---
book: defect-maps-by-the-numbers
chapterSlug: charting-and-sampling-defect-counts
order: 10
title: "Charting and sampling defect counts"
description: "Charting daily defect counts with c and u charts, why clustering between parts causes false alarms and how to widen the limits, how inspection misses defects, and planning sampling of outgoing parts."
draft: false
---

Once the causes found by mapping have been dealt with, the defect rate has to be watched, so that a new cause is noticed quickly, and the quality of what leaves the plant has to be assured. The usual tools are attribute control charts for the counts and sampling inspection for outgoing lots. Both rest on the Poisson and binomial models, and both behave badly when defects cluster between parts, in ways that this book's earlier chapters make easy to understand and correct.

This chapter charts Plant E's daily defect counts, shows why clustering between doors makes the standard limits too tight and how to widen them, treats inspection itself as a measurement that can miss defects, and designs a sampling plan for the customer's audit. Its error is a chart that raised an alarm one day in six.

## Counts on a chart

A **c chart** plots the number of defects found on an inspection unit of constant size, with control limits at the mean count plus and minus three times its square root, which is three standard deviations under the Poisson model. A **u chart** does the same for defects per unit area or per part when the inspected amount varies, with limits that widen when less is inspected. The companion book on control charts covers both in [Charts for counts and proportions](/reados/publications/control-charts-by-the-numbers/charts-for-counts-and-proportions/); this chapter is concerned with what happens to them when the Poisson model does not hold.

Plant E's routine chart counts the defects on a sample of 20 doors taken across each day's production, an inspection unit of 19.2 m², and plots the daily total. The [c-chart check](/tools/c-chart-check/) takes up to twelve unit counts of the same size, calculates the average count, the upper and lower control limits from the Poisson model with the chosen width, the smallest count that would signal, and which units fall outside the limits.

For the first twelve days after the study, the daily counts were 9, 14, 7, 24, 10, 6, 12, 19, 8, 5, 11 and 15. The tool gives an average of 11.67 defects per unit, limits from **1.42 to 21.91**, a signal at 22 or more and one unit, day 4 with 24 defects, out of control, with the instruction to look for a special cause.

## The error: an alarm one day in six

Over the following months, Plant E's chart with Poisson limits signalled on roughly one day in six. Each signal triggered the procedure: stop, check the booth, the hooks, the powder and the air, and record the cause. Most investigations found nothing, and the operators, reasonably, began to treat the alarms as noise. That is the worst outcome a control chart can have, because when a real special cause arrived it would be ignored with the rest.

The reason lay in Chapter 7. Defects cluster between doors, with a negative binomial clustering parameter of about 0.34 per door. The total on 20 doors then has a variance of 20 × (0.55 + 0.55² ÷ 0.336) = 29.0, a standard deviation of 5.39, against the Poisson model's √11 = 3.32. The real day-to-day variation is 1.6 times as large as the chart assumes, so the Poisson limits are far too tight. Under the negative binomial model, a day's count exceeds 21 about 4% of the time, against 0.2% for the Poisson model: around one day in 24 from chance alone, and more when the mean drifts up a little on dusty weeks.

```figure
type: compare
title: Why the Poisson limits were too tight
rowhead: Model
cols: Standard deviation of a 20-door count | Chance a day exceeds 21 | False alarms
caption: This is an illustration. Both models have a mean of 11 defects per 20 doors. The Poisson model ignores the variation in defect rate between doors that Chapter 7 measured, so its limits sit inside the line's ordinary variation.
- Poisson | 3.32 | 0.2% | about one day in 450
- * Negative binomial, α = 0.336 per door | 5.39 | 4.3% | about one day in 24
```

### Widening the limits

There are two sound responses. One is to compute limits from the negative binomial model directly, using the fitted clustering parameter. The other, which needs no model, is the adjustment proposed by Laney for overdispersed attribute data: convert each count to a standardised value z = (c − c̄) ÷ √c̄, estimate the actual spread of these values from their average moving range divided by 1.128, and multiply the Poisson limits' width by that spread. If the counts were Poisson, the spread would be about 1 and the limits unchanged; with overdispersion it is larger.

For Plant E's twelve days, the standardised values had an average moving range giving a spread of 1.98. The adjusted upper limit is 11.67 + 3 × 1.98 × √11.67 = **32.0**, and the lower limit falls below zero, so there is none. Day 4, at 24, is within the adjusted limits.

```figure
type: stats
title: Plant E's daily chart, Poisson and adjusted limits
caption: This is an illustration. Twelve daily totals on 20 doors. The adjustment widens the limits by the measured spread of the standardised counts, 1.98, so that only variation beyond the line's ordinary day-to-day behaviour signals.
- 11.67 | average defects per 20-door sample
- 21.9 | upper limit from the Poisson model, from the c-chart check
- 1.98 | spread of the standardised counts, from their moving ranges
- 32.0 | adjusted upper limit
```

Widening the limits does not excuse day 4, and nobody pretended it did. It had been a windy afternoon with the roller door open, and the engineer noted it as such; the dusty-day effect was a known, common cause, already on the list of things to fix, rather than a new special cause needing a stoppage. With the adjusted limits, the chart signalled about once in two months, and the signals that came were worth investigating: one was a contaminated powder batch, another a failed filter seal.

### When to use each

Adjusted limits are right when the overdispersion reflects stable, known variation between parts or days. They are wrong if that variation is itself the problem to be fixed. The honest arrangement is to chart with limits that match the process as it is, so that alarms mean something, while keeping the sources of overdispersion on the improvement list, as Plant E did with the roller door.

### Charting by type and zone

A single chart of all defects can hide a change in one type behind normal variation in the others. Once mapping has shown that different types have different causes, it is often worth charting the most important types separately, or the defects in a critical zone separately, each with its own limits. Plant E kept its total chart and added a second, cheap one: the number of doors per day with any defect in the top 200 mm band. A rise there points straight at the hooks, before it is large enough to move the total.

## Inspection is a measurement

The counts on the chart, and every count in this book, come from inspectors, and inspectors miss things. Inspection of appearance defects is a measurement with a probability of detection: for a visible speck under good light on a flat door, perhaps 90% for a trained inspector; for a small crater on a dark textured finish late in a shift, much less. Plant E estimated its inspectors' detection probability by seeding doors with marked defects and recording how many were found, and settled on 0.9 per defect as a working figure.

Detection probability changes what reaches the customer. A door with one defect escapes inspection with probability 0.1; a door with two escapes only if both are missed, 0.1² = 0.01; and so on. With the negative binomial distribution of defects per door, the share of all doors that leave the plant with an undetected defect is about **1.6%**. Under the Poisson model, with more doors carrying exactly one defect, it would be 3.3%. Clustering, by putting defects on doors that have several, makes those doors easier to catch.

### Estimating the detection probability

Plant E's figure of 0.9 came from a simple study. The engineer marked 200 small defects on 60 doors with an ultraviolet pen invisible under the inspection lamp, mixed the doors into normal production over a week, and recorded which marked defects the inspectors found and reported. They found 181, a detection probability of 0.905, with an approximate 95% interval of ±0.04. Detection was lower at the bottom edge of the door, where the lamp's light fell at a low angle, and late in shifts. Both findings changed the inspection station: a second lamp was fitted low down, and inspectors now rotate every two hours. Such studies need care in their design, since inspectors who know a study is running look harder, but even a rough figure is far better than assuming that inspection finds everything.

### Sampling area rather than parts

Sometimes the economic choice is to inspect only part of each part's area, for example the most visible zone. If defects are placed at random on a part and a fraction f of its area is inspected, a part with k defects is caught with probability 1 − (1 − f)^k. Inspecting half the area catches half the doors with one defect, three quarters of those with two and seven eighths of those with three. Uneven density changes this: inspecting the zone where intensity is highest, such as the top band before the hooks were fixed, catches far more than its share of the area would suggest. A map of intensity is therefore also a map of where inspection pays.

## Sampling outgoing lots

Plant E's main customer audits each delivery by inspecting a sample of doors and rejecting the lot if too many have defects. The customer and the plant agreed that lots with 1% defective doors should almost always be accepted and lots with 5% defective should almost always be rejected. The [acceptance sampling plan tool](/tools/acceptance-sampling-plan/) designs a single attributes sampling plan from the acceptable quality level, the rejectable quality level, the producer's risk and the consumer's risk, using the binomial operating characteristic, and gives the plan's average outgoing quality limit. It can also check a plan the user proposes.

With an acceptable quality level of 1%, a rejectable level of 5%, a producer's risk of 5% and a consumer's risk of 10%, the tool designs a plan of **n = 132 doors, c = 3**: inspect 132 doors and accept the lot if 3 or fewer have defects. It accepts 95.6% of lots at 1% defective and 9.9% of lots at 5%, both inside the agreed risks, with an average outgoing quality limit of 1.47%. ISO 2859-1 provides tabulated plans indexed by acceptable quality level and lot size, which many customers use instead; the tool designs a plan directly from the risks.

The [sampling OC tool](/tools/sampling-oc/) gives the probability that a plan accepts a lot with a stated fraction defective, with the average outgoing quality. At Plant E's escape rate of 1.6%, the 132-door plan accepts **83.8%** of lots. One delivery in six would be rejected and screened, at the plant's cost, even though the process was working as designed. Had defects not clustered between doors, the escape rate would have been 3.3%, and the plan would have accepted only 36% of lots.

```figure
type: compare
title: The customer's audit plan against Plant E's outgoing quality
rowhead: Outgoing defective share
cols: Probability of acceptance, n = 132, c = 3 | Lots rejected
caption: This is an illustration. From the sampling OC tool. At the present escape rate one lot in six is rejected; the plant's improvement work in Chapter 11 aims to bring the escape rate below the 1% the plan was designed to accept.
- 1.0%, the acceptable quality level | 95.6% | 1 in 23
- * 1.6%, present escape rate | 83.8% | 1 in 6
- 3.3%, if defects were not clustered | 36.3% | about 2 in 3
- 5.0%, the rejectable quality level | 9.9% | 9 in 10
```

The numbers made the business case for the improvements of the next chapter clearer, and more urgent, than the rework cost alone: every rejected lot cost a screening visit and a delivery delay, and the customer's patience.

## How this applies to a small Australian business

If your defect chart alarms often and the investigations find nothing, check whether the counts are overdispersed and widen the limits to match the process as it is, with Laney's adjustment or a negative binomial model. Estimate how often your inspectors miss defects and use it to predict what reaches the customer. When a customer audits by sampling, work out the plan's acceptance probability at your real outgoing quality, so that rejected lots are a forecast rather than a surprise.

Agreeing the plan with the customer is also the moment to agree what happens to a rejected lot: whether it is screened at the plant or the customer's site, who pays, and whether a run of accepted lots allows a move to reduced inspection. Those terms often matter more to the cost than the sample size does.

## Exercise: a smaller audit sample

The customer proposes a cheaper audit of 50 doors with an acceptance number of 1. (a) Using the sampling OC tool, what is the probability of accepting a lot at Plant E's present escape rate of 1.6%? (b) Is the smaller plan better or worse for Plant E at that rate? (c) What does the customer give up?

**Worked answer.** (a) The sampling OC tool gives **80.9%** acceptance for n = 50, c = 1 at 1.6% defective. (b) Slightly **worse** for Plant E than the 83.8% of the 132-door plan: more lots would be rejected at its present quality. (c) The customer gives up discrimination. A plan with 50 doors and c = 1 rejects good lots more often and accepts bad lots more often than the 132-door plan; at 5% defective it accepts about 28% of lots instead of 10%. Smaller samples cost less to inspect but blur the line between good and bad lots for both parties.
