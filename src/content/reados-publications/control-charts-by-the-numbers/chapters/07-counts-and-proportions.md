---
book: control-charts-by-the-numbers
chapterSlug: charts-for-counts-and-proportions
order: 7
title: "Charts for counts and proportions"
description: "Defectives and defects as binomial and Poisson random variables: p and c chart limits, why they are asymmetric, limits that change with sample size, missing lower limits, and when to use a u chart."
draft: false
---

Not every quality characteristic is a measurement. Some are verdicts: a spool has a burr or it does not, a weld passes or fails, an invoice is right or wrong. Others are counts: scratches on a tray of parts, defects in a metre of coated sheet, faults in a printed circuit board. Verdicts and counts follow different random laws from measurements, and their charts use those laws to set limits. The p chart plots the proportion of defective items in each sample, using the binomial distribution; the c chart plots the count of defects in each inspection unit, using the Poisson distribution.

This chapter sets up both for SP-12's visual inspection with the BIZOMAT p and c chart tools, explains why their limits sit asymmetrically and what that does to false alarms, shows how the limits must change with sample size, and ends with a day when half a sample was charted against limits for a full one.

## Two random laws

A proportion defective comes from a fixed number of items, each of which is defective or not. If each item is defective independently with probability p, the number defective in a sample of n follows the binomial distribution, with mean np and variance np(1 − p). The proportion defective, d ÷ n, has mean p and standard deviation √(p(1 − p) ÷ n).

A count of defects has no fixed upper limit: a tray of spools can show any number of scratches. If defects occur independently and at a steady average rate, the count in an inspection unit of fixed size follows the Poisson distribution, whose variance equals its mean. Lemons derives the Poisson as the limit of the binomial when the number of chances is large and the probability of each is small, which is exactly the situation of a few scratches among countless places a scratch could be.

```figure
type: compare
title: The two attribute charts
cols: What is counted | Random law | Centre | Three-sigma limits
rowhead: Chart
caption: Both charts use the normal approximation for their limits, which is reasonable when the expected count is at least a few; Chapter 2's logic of three-sigma limits carries over.
- p chart | defective items in a sample of n | binomial | p̄ | p̄ ± 3√(p̄(1 − p̄) ÷ n)
- c chart | defects in a fixed inspection unit | Poisson | c̄ | c̄ ± 3√c̄
```

## Burrs at visual inspection

This is an illustration. Every SP-12 spool is visually inspected for burrs at the cross-holes before washing, and the inspector records the number of spools with a burr in each batch of 200. Ten consecutive batches gave 3, 5, 2, 4, 6, 3, 4, 11, 3 and 4 burred spools.

The [p-chart check](/tools/p-chart-check/) works from up to ten samples of equal size. It calculates the fraction defective in each sample, the average fraction defective, the upper and lower limits from the binomial standard deviation with the lower limit not below zero, which samples fall outside them, and the number of defectives per sample that would trigger a signal.

```figure
type: stats
title: SP-12's burr inspection on the p chart
caption: This is an illustration. Ten samples of 200 spools, 45 burred in all. Sample 8, with 11 burred spools, is above the upper limit; any sample with 11 or more would signal.
- 2.25% | Average fraction defective | 45 ÷ 2,000
- 1.05% | Standard deviation of p | √(0.0225 × 0.9775 ÷ 200)
- * 0 to 5.40% | Control limits | lower limit negative, set to zero
- Sample 8 | Outside the limits | 11 burred of 200, 5.5%
```

Sample 8 was investigated. The cross-hole deburring brush on the lathe had worn short during that batch and was replaced at its end; the next batches returned to their usual three or four. Removing sample 8, which had a known cause, the baseline average becomes 1.89% and the upper limit 4.78%, which would signal at 10 burred spools in 200. Like the individuals chart of Chapter 3, the attribute chart's limits should come from a baseline cleared of known special causes.

## Limits that lean

The normal approximation draws symmetric limits, but the binomial and Poisson distributions are not symmetric when the expected count is small: they have a long tail upwards and are cut off at zero below. Two consequences follow.

The first is that the lower limit often disappears. For SP-12's burrs, p̄ − 3σ_p is negative, so the lower limit is set to zero, and a sample can never fall below it. The chart cannot signal an improvement. If the deburring brush were upgraded and the true rate halved, the chart would show it only as a run of low samples, never as a point beyond a limit. The tool flags this, and the remedy is a larger sample: with samples of 1,000 spools, the lower limit for p̄ = 2.25% would be 0.84%, and a sustained halving would eventually show.

The second is that the upper tail is heavier than the normal predicts, so false alarms are more frequent than the nominal 0.135% per side. For p̄ = 2.25% and n = 200, the exact binomial chance of 11 or more burred spools when nothing has changed is about 0.6%, more than four times the nominal rate: an in-control ARL nearer 170 samples than 740 for the upper side. That is acceptable for a chart whose signals are cheap to investigate, but it is worth knowing, and where false alarms are costly, limits set from the exact binomial or Poisson probabilities are better than the normal approximation.

## Scratches on a tray

This is an illustration. Finished spools are packed in trays of 50, and a final inspector counts the visible handling scratches on each tray. Twelve trays showed 2, 4, 1, 3, 5, 2, 3, 2, 6, 3, 1 and 4 scratches.

The [c-chart check](/tools/c-chart-check/) works from up to twelve inspection units of the same size. It calculates the average number of defects per unit, the upper and lower limits from the Poisson model at the chosen width (no lower limit when it would be negative), the defect count that would signal, and which units fall outside the limits.

```figure
type: bars
title: Scratches per tray of 50 SP-12 spools
max: 10
caption: This is an illustration. Average 3.0 scratches a tray; upper limit 3 + 3√3 = 8.2, so 9 or more would signal. No tray is outside the limits, and there is no lower limit.
- Tray 1 | 2
- Tray 2 | 4
- Tray 3 | 1
- Tray 4 | 3
- Tray 5 | 5
- Tray 6 | 2
- Tray 7 | 3
- Tray 8 | 2
- * Tray 9 | 6
- Tray 10 | 3
- Tray 11 | 1
- Tray 12 | 4
```

The handling process is in control at about three scratches a tray. Whether three is acceptable is a separate question, for the customer's specification, not the chart. The chart's job is to say whether a change, such as a new packing operator or a different tray liner, has made things better or worse.

## Is the count really binomial?

The p chart's limits assume that every spool in every batch has the same chance of a burr, independently of the others. Real processes often break that assumption. If the deburring brush wears gradually, the chance of a burr rises through each batch and differs between batches; if burrs come in clusters, from one bad bar end for instance, spools in a batch are not independent. Both effects make the counts vary more from sample to sample than the binomial predicts, a condition called overdispersion, and the p chart then raises too many alarms.

The check is simple: compare the sample-to-sample variance of the counts with the binomial variance np̄(1 − p̄). This is an illustration. The nine samples without the known special cause average 3.78 burred spools, with a variance of 1.44, against a binomial variance of 3.71. The counts are, if anything, less variable than the binomial predicts. With only nine samples the ratio, 0.39, is too uncertain to read much into: for nine samples, chance alone can produce ratios from about 0.3 to 2.2. Had the ratio been 3 or 4, consistently over more data, the plant would have needed limits that include the extra between-batch variation, such as those of the individuals chart applied to the proportions, or a modified p chart that estimates the extra variation from the data.

## Seeing an improvement

A chart with no lower limit can still confirm an improvement, but slowly and only through runs. The alternative is a sample large enough to bring the lower limit above zero. For a p chart the lower limit is positive when n is larger than 9(1 − p̄) ÷ p̄; for SP-12's 2.25% that is about 391 spools. With samples of 400 or more, a sustained halving of the burr rate would eventually push a sample below the lower limit, and the improvement could be shown on the same terms as a deterioration. When a deburring trial is planned, the sample size should be chosen with this in mind, before the trial starts.

## When the unit changes size

Both charts assume samples or inspection units of the same size. When they vary, the limits must vary with them. For the p chart, the standard deviation √(p̄(1 − p̄) ÷ n) depends on each sample's n, so each sample gets its own limits: wider for small samples, narrower for large. For counts, the u chart divides each count by the size of its unit, giving defects per spool, per metre or per tray-equivalent, and draws limits at ū ± 3√(ū ÷ nᵢ), where nᵢ is the size of each unit in the chosen measure. The BIZOMAT tools work with equal sizes; varying sizes need the formulas applied sample by sample.

## The error: limits for 200 on a sample of 80

This is an illustration. On a Friday afternoon, a short shift inspected only 80 spools, of which 5 had burrs: 6.25%. The inspector plotted it on the p chart, saw it above the 5.40% limit, and stopped the lathe to look for a worn brush. The brush was fine.

The limit of 5.40% belonged to samples of 200. For a sample of 80, the standard deviation of the proportion is √(0.0225 × 0.9775 ÷ 80) = 1.66%, and the upper limit is 2.25% + 3 × 1.66% = 7.22%. Five burred spools in 80 sits comfortably inside it; a signal would have needed 6 or more. The stoppage cost forty minutes for nothing.

```figure
type: compare
title: The p chart's upper limit depends on the sample size
cols: Standard deviation of p | Upper limit | Burred spools that signal
rowhead: Spools inspected
caption: This is an illustration with p̄ = 2.25%. Smaller samples have wider limits, because a proportion from a few items is noisier.
- * 200, the usual batch | 1.05% | 5.40% | 11 or more
- 80, the short shift | 1.66% | 7.22% | 6 or more
```

The chart sheet was changed to show the limit as a small table by sample size, and the inspection procedure was changed to complete a full sample of 200 before plotting where possible. Short samples are now marked as such, so that their wider limits are not forgotten when the chart is reviewed.

## One count or several

A count of all scratches lumps together causes that may behave differently: scratches from the gripper, from the tray, from the inspector's own handling. When the c chart signals, the first question is which kind rose, and when it does not signal, a rise in one kind may be hidden by a fall in another. SP-12's inspector records each scratch with a code for its position on the spool, which points to its source, and the codes are tallied monthly in a Pareto chart. The c chart watches the total for change; the tally shows where to work. Charting each kind separately is possible, but with only a few scratches per tray each separate chart would have an average count near one, and charts of such small counts have almost no power to see anything but a large jump.

The same reasoning applies to proportions. A spool rejected for a burr and one rejected for a scratch are both "defective", but a p chart of all rejects mixes their causes. Where the reasons for rejection are recorded, a chart of each major reason is usually more useful than a chart of the total.

## Attribute charts and measurement charts

Attribute charts are cheap to run, because a go or no-go verdict is quicker than a measurement, and they suit characteristics that cannot easily be measured. But they carry much less information per item. A spool's diameter tells how far it is from the limit; a pass or fail tells only which side it is on. To detect the same shift, a p chart typically needs samples many times larger than an X̄ chart, and for a process with a low defect rate it may need hundreds or thousands of items per sample before the chart can see anything at all. Where a characteristic can be measured, a measurement chart is almost always more sensitive; attribute charts are for what cannot.

Their other use is upstream of measurement charts. A p chart of rejects at final inspection can show that something has changed, and the measurement charts of the individual characteristics then show which one. SP-12's burr chart and diameter charts are reviewed together each week for that reason.

## Exercise: bigger trays

The plant moves to trays of 100 spools. Assuming the scratch rate per spool is unchanged, what is the new average count per tray, the upper control limit and the count that would signal? Would a lower limit now exist?

**Worked answer.** This is an illustration. The rate is 3.0 scratches per 50 spools, so a tray of 100 averages **6.0** scratches. The upper limit is 6 + 3√6 = 6 + 7.35 = **13.35**, so **14 or more** would signal. The lower limit, 6 − 7.35, is still negative, so **no lower limit** exists; a tray would need an average of 9 or more scratches before 3σ fell inside zero (9 − 3 × 3 = 0). The larger unit gives a steadier count and a chart better able to show a modest increase, but improvements would still show only as runs of low counts.
