---
book: control-charts-by-the-numbers
chapterSlug: capability-from-a-stable-process
order: 9
title: "Capability from a stable process"
description: "Cp, Cpk and predicted rejects from a stable process, capability against performance, the confidence bound on a capability index and how many parts a capability claim needs."
draft: false
---

The control chart answers one question: is the process behaving consistently? Capability answers another: is that consistent behaviour good enough for the specification? The two must be asked in that order. A capability index calculated from an unstable process describes nothing that will repeat, because the process it describes is changing. Once the chart shows stability, the process's spread and centre can be compared with the tolerance, and the comparison summarised in the familiar indices Cp and Cpk.

This chapter calculates SP-12's capability from its control chart baseline with the WORKOS capability tool, separates capability from performance, shows how uncertain a capability index is when it comes from a modest sample, and uses the WORKOS confidence tool to say how many parts a claim really needs. It ends with a capability claim made to a customer from fifty spools and an hour of production.

## Cp and Cpk

Cp compares the tolerance width with the process spread, taking six standard deviations as the spread: Cp = (USL − LSL) ÷ 6σ. It ignores where the process is centred, so it describes what the process could achieve if it were perfectly centred. Cpk takes the centre into account: it is the distance from the mean to the nearer limit, divided by three standard deviations. A Cpk of 1.33 means the nearer limit is four standard deviations from the mean; a Cpk of 1.0, three.

The [process capability check](/tools/process-capability-check/) works from an X̄–R chart's results. From the grand average, the average range, the subgroup size and the specification limits, it estimates σ from R̄ and d₂, gives the X̄ and R chart limits, Cp and Cpk, the predicted parts per million beyond each limit from the normal distribution, and a check against the least Cpk the user accepts. It flags an off-centre process and reminds the user to confirm stability before quoting capability.

```figure
type: stats
title: SP-12's capability from its control chart baseline
caption: This is an illustration. Grand average 12.0010 mm, average range 0.0051 mm, subgroups of 5, limits 11.990 and 12.010 mm, least Cpk 1.33. The prediction differs slightly from Chapter 1's 21.8 ppm because σ here is 0.00219 mm rather than the rounded 0.0022 mm.
- 0.00219 mm | Process σ | 0.0051 ÷ 2.326
- 1.52 | Cp | 0.020 ÷ (6 × 0.00219)
- * 1.37 | Cpk | (12.010 − 12.001) ÷ (3 × 0.00219)
- 20.5 ppm | Predicted out of tolerance | 20.3 above, 0.3 below
```

The process passes the 1.33 threshold, though not by much. The gap between Cp and Cpk, 0.15, is the cost of the mean sitting 0.001 mm above the middle of the tolerance. Centring it would raise Cpk to Cp, 1.52, and cut the predicted rejects to about 5 ppm, the cheapest improvement available.

## Capability against performance

The indices above use σ from within subgroups: the short-term spread of the process when its mean is not moving. Chapter 8 showed that SP-12's mean does move in practice, in a small sawtooth as the insert wears and is compensated, so the spread of all spools over a week is a little larger, about 0.00225 mm. Indices calculated with the overall standard deviation are performance indices, Pp and Ppk; ISO 22514 and most customer manuals keep the two sets of names apart for that reason.

```figure
type: compare
title: SP-12's capability and performance indices
cols: σ used, mm | Spread index | Centred index
rowhead: Index pair
caption: This is an illustration. Performance is lower than capability by the amount the mean moves between subgroups. The difference is small here because the tool-wear compensation keeps the sawtooth small.
- * Capability, Cp and Cpk | 0.00219, within subgroups | 1.52 | 1.37
- Performance, Pp and Ppk | 0.00225, overall | 1.48 | 1.33
```

A large gap between capability and performance means the process mean wanders more than its short-term noise suggests, and that the chart, if it has been used, should have been signalling. A small gap, as here, means the process is close to its potential. Customers increasingly ask for both, and for the data behind them.

## What an index means in parts per million

Each Cpk corresponds to a tail area beyond the nearer limit, if the process is normal. The correspondence explains why customers set thresholds where they do, and why the difference between 1.33 and 1.67 matters more than it looks.

```figure
type: bars
title: Parts per million beyond the nearer limit, by Cpk, for a normal process
unit: ppm
max: 1400
caption: One tail only, from the normal distribution. The scale makes the point: moving from 1.0 to 1.33 removes almost all of the rejects; beyond 1.5 the remainder is too small to show. Real processes rarely follow the normal curve this far into the tail.
- Cpk 1.00, nearer limit at 3σ | 1350
- * Cpk 1.33, at 4σ | 33
- Cpk 1.50, at 4.5σ | 3.4
- Cpk 1.67, at 5σ | 0.3
- Cpk 2.00, at 6σ | 0.001
```

The figures should be read with Chapter 1's caution. They rest on the normal curve holding several standard deviations into the tail, which no realistic study can test, and on the process staying in control. Their real use is comparative: a process at Cpk 1.0 makes hundreds of times more rejects than one at 1.5, whatever the exact numbers.

## The measurement is part of σ

The σ in every capability index is the spread of the measured values, which includes the gauge's own scatter. By the variance sum rule of Chapter 1, the process's true spread is smaller. This is an illustration. SP-12's gauge study gave a repeatability standard deviation of 0.0006 mm. Removing it from the measured 0.00219 mm leaves √(0.00219² − 0.0006²) = 0.00211 mm for the spools themselves, and a Cpk of 1.42 rather than 1.37. The difference is small here because the gauge contributes only 7.5% of the variance; with a poorer gauge, a capable process can look incapable. A measurement system study, reported beside the capability, lets a customer see how much of the spread belongs to the gauge, and it is why the companion books on inspection treat gauge capability before process capability.

## One-sided and non-normal characteristics

Some characteristics have only one limit. SP-12's case hardness must be at least 56 HRC, and the 62 HRC upper limit in the drawing is far from where the process runs. For a one-sided requirement the relevant index is the one-sided one: Cpl = (mean − LSL) ÷ 3σ. This is an illustration. With the clean baseline of Chapter 3, mean 58.21 HRC and σ̂ 0.505 HRC, Cpl is (58.21 − 56) ÷ (3 × 0.505) = 1.46, and Cpu, against 62 HRC, is 2.50. The lower limit is the one that matters, and Cpl is the number to report.

Hardness, roughness, flatness, runout and many other characteristics are not normally distributed, often because they are bounded at zero or skewed by their physics. For those, indices calculated from σ as if the data were normal misstate the tails. The usual remedies are to fit a suitable distribution and calculate the index from its percentiles, replacing six standard deviations with the distance between the 0.135% and 99.865% points, or to transform the data to normality first. ISO 22514 describes such methods by name. Whichever is used should be stated, because two honest analysts can otherwise produce different indices from the same data.

## Keeping the number current

A capability study is a snapshot, but the charts that make it believable keep running. SP-12's quality engineer recalculates Cp, Cpk, Pp and Ppk monthly from the month's control chart data, and plots them. A falling Cpk with a stable chart means the spread is creeping up within the limits the chart was given, a sign to revisit the baseline; a gap opening between Cpk and Ppk means the mean is wandering more than it used to. Either is easier to deal with as a trend in a monthly plot than as a surprise in a customer audit.

## How certain is a capability index?

A Cpk of 1.37 is an estimate, and like every estimate it has uncertainty. It inherits the uncertainty of σ, which Chapter 1 put at roughly 6% for 125 spools, and of the mean. The NIST e-Handbook gives approximate formulas for lower confidence bounds: for Cp, from the chi-square distribution of the sample variance; for Cpk, from a normal approximation that depends on the sample size and on Cpk itself.

The [capability confidence check](/tools/capability-confidence-check/) applies them. From the number of parts measured, the sample mean and standard deviation, the specification limits and a one-sided confidence level, it calculates Cp and Cpk, their lower confidence bounds, the chi-square quantile and z value used, and the number of parts at which the same Cpk would prove a required value, with a warning that the Cpk approximation is unreliable for fewer than 25 parts.

```figure
type: line
title: Lower 95% confidence bound on a sample Cpk of 1.46, against the number of parts measured
x: Parts measured
y: Lower 95% bound on Cpk
ymin: 1
ymax: 1.5
caption: This is an illustration. From the NIST approximation used by the capability confidence check. A sample Cpk of 1.46 proves a required 1.33 only from about 181 parts; with 50 parts the bound is 1.21.
- 25 | 1.10
- 50 | 1.21
- 100 | 1.28
- 181 | 1.33
- 200 | 1.34
- 300 | 1.36
```

The curve rises slowly. To narrow the bound by half, the sample must grow about fourfold, because the uncertainty of a standard deviation falls with the square root of the number of readings. Capability claims from small studies are therefore weaker than their headline numbers suggest, and a customer who asks for a capability with confidence is asking a reasonable question.

## The error: fifty spools and an hour

This is an illustration. A prospective customer asked for SP-12's capability on the land diameter, requiring Cpk of at least 1.33 demonstrated at 95% confidence. A sales engineer, keen to respond the same day, had 50 consecutive spools measured from the lathe straight after an insert change and warm-up. They gave a mean of 12.0010 mm and a standard deviation of 0.00205 mm: Cp 1.63, Cpk 1.46. The response quoted Cpk = 1.46.

The customer's supplier quality engineer ran the same numbers through a confidence calculation and replied that the claim was not demonstrated. The capability confidence check gives the same answer: with 50 parts, the lower 95% bound on Cpk is 1.21, below 1.33, and the lower bound on Cp is 1.35. If the Cpk held at 1.46, about 181 parts would prove the requirement. The verdict was "not yet proven: more data needed".

```figure
type: stats
title: The fifty-spool study in the capability confidence check
caption: This is an illustration. 50 parts, mean 12.0010 mm, s = 0.00205 mm, limits 11.990 and 12.010 mm, 95% one-sided, required Cpk 1.33.
- 1.63 / 1.46 | Cp / Cpk from the sample | above the requirement
- 1.35 | Lower bound on Cp | chi-square quantile 33.93 for 49 degrees of freedom
- * 1.21 | Lower bound on Cpk | below the required 1.33
- 181 | Parts needed to prove 1.33 at this Cpk | if the process holds
```

The confidence bound was not the only problem. The fifty spools came from one insert, freshly set, in one hour of a warm machine: they contained none of the variation from tool wear, insert changes, bar batches or the second shift. Their standard deviation, 0.00205 mm, was smaller than the 0.00219 mm from the 25-subgroup baseline spread over three days, which in turn was smaller than the 0.00225 mm overall. A capability study is meant to describe the process the customer will receive, and the customer will receive spools from all of those conditions.

The plant's answer was a proper study: the 125 baseline spools plus a further week of control chart subgroups, about 800 spools across both shifts, several inserts and two bar batches, all from a process the X̄–R chart and the CUSUM showed to be in control. On that data, with σ about 0.0022 mm, Cpk was 1.36 and its lower 95% bound, from 800 parts, about 1.30: close to the requirement but just short. The plant centred the process, re-ran a fortnight of production at a Cpk of about 1.5, and submitted that, with the charts. The customer accepted it.

## Before production: preliminary studies

A new part or a new machine has no week of control chart data, and the customer still needs an answer before production starts. The usual compromise is a preliminary study: a run of production-intent parts, measured and charted, from which performance indices are calculated. Because a short run cannot contain the variation that months of production will bring, from tool wear, material batches, seasons and staff, customers often ask for a higher index from a preliminary study than they accept from ongoing production. The margin is an allowance for what the short study cannot see.

The arithmetic of this chapter shows how to make such a study as informative as possible. Spread it across conditions rather than concentrating it: several inserts, both shifts, more than one bar batch, a cold start. Chart it, so that any instability shows. Report the confidence bound, so that the customer can see how much the sample size limits the claim. And state plainly that the preliminary figure will be confirmed from production data, with a date. A preliminary study done that way is a fair first answer; one done like the fifty-spool study above is a number that will have to be withdrawn.

## What a capability claim should include

A capability index on its own is a single number stripped of everything that makes it believable. A claim worth making, or accepting, carries its context.

```figure
type: checklist
title: A capability claim SP-12 would now send
caption: This is an illustration. Each item answers a question a careful customer would otherwise have to ask.
- x Control chart of the same data, showing no unexplained signals
- x Number of parts and subgroups, and the period, shifts, inserts and material batches covered
- x Both capability (within-subgroup σ) and performance (overall σ) indices
- x Lower confidence bound on Cpk at the customer's stated confidence
- x Measurement system study for the gauge used
- x Normality check, or the method used for non-normal data
- ? Plan for keeping the capability: charts, reaction plan, review frequency
```

The last item is the one the index cannot provide. Capability is a property of a process in control, and it lasts only as long as the control does. The charts of the earlier chapters are what make a capability claim a promise rather than a snapshot.

## Exercise: a larger study

Suppose the fifty-spool study had been 200 spools with the same mean and standard deviation, 12.0010 mm and 0.00205 mm. Using the NIST approximation for the lower bound on Cpk, Cpk − z × √(1 ÷ 9n + Cpk² ÷ (2(n − 1))) with z = 1.645, find the bound and say whether it would prove 1.33. What would still be missing from the claim?

**Worked answer.** This is an illustration. Cpk is still 0.009 ÷ (3 × 0.00205) = **1.463**. With n = 200, the bracket is 1 ÷ 1,800 + 1.463² ÷ 398 = 0.000556 + 0.005379 = 0.005935, whose square root is 0.0770, so the bound is 1.463 − 1.645 × 0.0770 = **1.336**, just above 1.33. The statistics would prove the requirement. What would still be missing is the rest of the checklist: if all 200 spools came from one insert in a few hours, the claim would describe a process the customer will not receive. A control chart over a representative period, with the performance indices beside the capability ones, is what would make the number credible.
