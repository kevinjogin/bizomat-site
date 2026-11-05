---
book: accept-or-reject-by-the-numbers
chapterSlug: learning-the-defect-rate
order: 8
title: "Learning the defect rate"
description: "Estimate and update a defect rate from audits: a p-chart with the BIZOMAT tool, Bayesian updating with a beta prior, separating special causes, and correcting an imperfect reject rate."
draft: false
---

Every decision in the first seven chapters used a base rate: 0.78% of bushes with an out-of-tolerance bore, 0.6% with chatter. Chapter 7 showed that a threshold tuned to the wrong rate costs hundreds of dollars a shift. Base rates are not constants. They drift as tools wear, change when a supplier changes, and jump when something breaks. A shop that makes decisions with base rates must keep learning them, from data collected for the purpose, and must be able to tell a real change from the noise in small samples.

This chapter sets up a daily audit of BU-25 bushes, charts it with the BIZOMAT p-chart tool, updates the defect rate from each day's result by Bayes' rule, separates a special cause from the steady rate, and shows how to recover a true defect rate from an inspection's reject rate when the inspection is imperfect. The error is a bad day averaged into the base rate.

## The daily audit

A base rate must be learned from parts whose true state is known, which means an audit with a method much better than the routine inspection. This is an illustration. Each day, 200 bushes are taken at random from the lathe's output, before the air gauge, and their bores are measured on the bench gauge, whose uncertainty is a quarter of the air gauge's. The count of bushes outside 25.000 to 25.021 mm is the day's result.

```figure
type: bars
title: Out-of-tolerance bores in each day's audit of 200 bushes
unit: bushes
max: 7
caption: This is an illustration. 18 out-of-tolerance bores in 2,000 audited bushes over ten days, 0.9% in all. Day 10 stands out.
- Day 1 | 2
- Day 2 | 1
- Day 3 | 0
- Day 4 | 3
- Day 5 | 1
- Day 6 | 2
- Day 7 | 1
- Day 8 | 0
- Day 9 | 2
- * Day 10 | 6
```

Daily counts of two, one, none and three look erratic, but they are what a steady rate of under 1% produces in samples of 200. The question for any single day is whether its count is consistent with the steady rate or signals a change.

## The p-chart

The [p-chart check](/tools/p-chart-check/) answers that question. It takes the number of items in each sample and the number defective in up to ten samples, and reports each sample's fraction defective, the average fraction, the binomial standard deviation, the upper and lower control limits at three standard deviations, which samples fall outside, and the count per sample that would signal.

This is an illustration. With samples of 200 and the ten daily counts, the tool gives an average fraction defective of 0.900%, a standard deviation of 0.668%, an upper control limit of 2.903% and a lower limit of zero. A sample signals at 6 or more defectives. Day 10, with 6, is at 3.0% and out of control; the other nine are in control.

```figure
type: stats
title: The audit's p-chart, from the BIZOMAT p-chart tool
caption: This is an illustration. With only 200 bushes a sample and a rate under 1%, the chart's lower limit is zero and its upper limit is about three times the average.
- 0.900% | average fraction defective, all ten days
- 0.668% | standard deviation of a day's fraction
- 2.903% | upper control limit
- 6 or more | defectives in a day that signal
- Day 10 | out of control, 6 of 200
```

The investigation of day 10 found a chipped boring insert, changed mid-afternoon. The out-of-tolerance bores were all from the hour before the change. That is a special cause: a specific event, now removed, not part of the process's steady behaviour. The chart's job was to separate it from the ordinary day-to-day noise, and it did. *Control Charts by the Numbers* covers p-charts and their limits in more depth in [Charts for counts and proportions](/reados/publications/control-charts-by-the-numbers/charts-for-counts-and-proportions/).

## Updating the rate by Bayes' rule

The chart says whether a day is unusual. It does not say what the steady rate is, or how sure the shop can be of it. For that, the defect rate itself can be treated as uncertain, described by a probability distribution, and updated by Bayes' rule as each day's audit arrives.

The natural distribution for a rate is the beta distribution, because it updates very simply. A beta distribution with parameters a and b has a mean of a ÷ (a + b), and behaves like the record of a earlier defectives in a + b earlier parts. After a new sample with d defectives in n parts, it becomes a beta distribution with parameters a + d and b + n − d. Prior knowledge and new data are added together, each weighted by how many parts stand behind it.

```figure
type: formula
title: Updating a defect rate with a beta distribution
formula: Prior: beta(a, b), mean a ÷ (a + b)
formula: After d defectives in n parts: beta(a + d, b + n − d)
formula: Posterior mean = (a + d) ÷ (a + b + n)
caption: The prior's a + b is how many parts' worth of weight it carries. A prior with little weight is quickly overruled by data; one with much weight changes slowly.
- a, b | the prior's parameters
- d, n | defectives and parts in the new sample
```

This is an illustration. Last month's audits found 31 out-of-tolerance bores in 4,000 bushes, 0.775%. The quality engineer judged that the process might have changed since, so rather than giving last month the full weight of 4,000 parts, used it as a prior worth 400 parts: beta(3.1, 396.9), with a mean of 0.775% and a 90% interval from 0.22% to 1.61%. That is a cautious prior: it says roughly where the rate is but leaves it free to move.

```figure
type: compare
title: The defect rate as each piece of evidence arrives
cols: Mean | 90% interval | Probability the rate exceeds 1%
rowhead: After
- Prior, last month weighted as 400 bushes | 0.775% | 0.22% to 1.61% | 25.6%
- Day 1: 2 of 200 | 0.850% | 0.34% to 1.54% | 30.0%
- * Days 1 to 9: 12 of 1,800 | 0.686% | 0.43% to 1.00% | 5.0%
- Days 1 to 10, special cause included | 0.879% | 0.59% to 1.21% | 24.9%
caption: This is an illustration. The interval narrows as data accumulate. Including day 10's special cause raises the estimate and makes a rate above 1% look five times more likely.
```

After nine ordinary days, the estimate is 0.686%, with a 90% interval of 0.43% to 1.00%, and only a 5% probability that the steady rate exceeds 1%. That is consistent with the 0.78% predicted from the process capability in Chapter 1, and it is the rate that should feed the acceptance limits and thresholds of the earlier chapters.

## How much weight to give the past

The prior's weight is a judgement, and it is worth seeing how much it matters. Had last month's audits been given their full weight of 4,000 bushes, the estimate after nine ordinary days would be (31 + 12) ÷ (4,000 + 1,800) = 0.741%. With the 400-bush weight used above, it is 0.686%. With no prior at all, a flat distribution, it is 0.721%. After 1,800 audited bushes, the choice moves the estimate by less than a tenth of a percentage point.

The weight matters far more for how quickly the estimate responds to change. A heavy prior is stable: one unusual week barely moves it, which is good if the process is steady and bad if it has really shifted. A light prior responds quickly but is noisier. A practical compromise is to let old data fade: each month, carry forward the previous estimate as a prior worth only part of the parts behind it, say a tenth, so that recent audits always dominate. That is the Bayesian counterpart of the exponentially weighted charts used for detecting small shifts. Whatever weight is chosen, it should be written down with the estimate, so that the next person to update it uses the same rule.

## How large should the audit be?

A daily audit of 200 bushes takes over three hours of bench time at a minute a bush, about A$267 a day, yet at a rate under 1% it is a coarse instrument. Its p-chart signals at 6 or more defectives, and a day's count reaches that only rarely unless the rate has risen sharply.

```figure
type: compare
title: Chance that a single day's audit signals, by the true defect rate that day
cols: 200 bushes a day, signal at 6 or more | 500 bushes a day, signal at 10 or more
rowhead: True rate
- 0.7%, normal | 0.3% | 0.3%
- 1.4%, doubled | 6.4% | 16.8%
- 2.0% | 21.3% | 54.3%
- * 3.0% | 55.7% | 93.3%
caption: This is an illustration. Binomial probabilities. The 500-bush limit assumes an average rate of about 0.7%. Both audits rarely raise false alarms; the larger one detects moderate rises far more often.
```

A doubling of the rate would be signalled on fewer than one day in fifteen with 200 bushes, so a real but moderate deterioration could run for weeks before a single day flagged it. The Bayesian estimate, which accumulates evidence across days, picks such a change up sooner, as do cumulative-sum charts, described in *Control Charts by the Numbers*. Larger daily audits detect faster but cost more bench time: 500 bushes a day would take a whole shift of the bench gauge.

## One rate for each cause

A single "defect rate" hides the fact that different defects have different causes, and their rates move independently. BU-25 has at least two: out-of-tolerance bores, driven by the process mean, tool wear and thermal drift, and chatter, driven by the boring bar's condition and set-up. A rise in one says nothing about the other, and each feeds a different decision: the bore rate feeds the air gauge's acceptance limits, the chatter rate the camera's threshold. Mixing them into one number would move both settings when only one should change.

The audit therefore records each defect separately, with its cause where known, and keeps a separate rate for each. Where a process has two machines, or two shifts with different practices, it is worth keeping separate rates for them too until the data show that they are the same. A combined rate is easy to calculate from the separate ones; separate rates cannot be recovered from a combined one. The audit sheet should therefore have a column for each defect from the start, even if most of its entries are zero, because adding a column after a problem appears leaves no history to compare against. The right size depends on how costly a fortnight of undetected deterioration would be, which the cost figures of Chapters 3 and 7 make it possible to estimate.

## Correcting an inspection's reject rate

Audits are slow and expensive; the routine inspection sees every bush. It is tempting to learn the base rate from the inspection's reject rate. Chapter 1 showed why that misleads: an imperfect inspection rejects good parts and passes bad ones, so its reject rate is not the defect rate. But if the inspection's sensitivity and false-call rate are known, the true rate can be recovered, a correction published by Rogan and Gladen in 1978 for medical screening.

```figure
type: formula
title: True defect rate from an imperfect inspection's reject rate
formula: True rate = (reject rate + specificity − 1) ÷ (sensitivity + specificity − 1)
caption: Specificity is 1 − false-call rate. The correction is exact on average, but it divides by a number that shrinks as the inspection gets worse, so small errors in the reject rate or the inspection's characteristics are magnified.
- Reject rate | the share of parts the inspection rejects
- Sensitivity | the share of bad parts it rejects
- Specificity | the share of good parts it passes
```

This is an illustration. The vision system, at its original threshold of 32.3, rejects 2.56% of bushes, with a sensitivity of 95% and a false-call rate of 2%, so a specificity of 98%. The true chatter rate is (0.0256 + 0.98 − 1) ÷ (0.95 + 0.98 − 1) = 0.0056 ÷ 0.93 = **0.60%**, the base rate used in Chapters 1 to 7. A month in which the camera rejected 3.02% would imply a true rate of 1.10%, nearly double.

The correction is fragile. If the camera's false-call rate were really 2.2% instead of 2%, the same 2.56% reject rate would imply a true rate of only 0.39%. Any reject rate below the false-call rate, 2%, implies a negative true rate, which simply means the camera's characteristics have changed. The correction is a useful check on the reject counts, but the inspection's characteristics must be re-measured regularly against audits for it to be trusted, and audits remain the primary source of the base rate.

## The error: a bad day averaged in

This is an illustration. When the daily audit began, the quality engineer updated the defect rate by adding every day's count to the running total, without looking at the p-chart. After day 10, the estimate stood at 0.879%, with a one-in-four chance of exceeding 1%, and the engineer recalculated the cost-based acceptance limits of Chapter 3 with the higher rate and drafted a request to lower the vision system's threshold.

The production supervisor, who had changed the chipped insert on day 10, asked why one bad hour should change the limits for every shift. The p-chart showed day 10 as a special cause, and the investigation had already removed it. The steady rate, from the nine ordinary days, was 0.686%, below last month's figure, not above it. Including the special cause had overstated the rate by 28% and would have moved the limits in the wrong direction.

The correction was a rule: each day's audit is first plotted on the p-chart; days that signal are investigated, and their counts are recorded against the special cause, not added to the steady rate. Special causes are still important data. They are the record of how often the process fails abruptly, and how many bushes each failure affects, which is what the reaction plans of Chapter 4 and Chapter 10 need. They just answer a different question from the steady rate.

## Exercise: four more days

This is an illustration. Four more ordinary days give 1, 0, 2 and 1 out-of-tolerance bores in 200 bushes each, all inside the p-chart's limits.

1. Starting from the estimate after days 1 to 9, beta(15.1, 2,184.9), what is the updated distribution and its mean?
2. Would any of the four days signal on the p-chart with the limit of 6 or more?
3. The updated 90% interval is 0.42% to 0.89%. What does this say about the 0.78% rate predicted from process capability in Chapter 1?

**Worked answer.**

1. 4 defectives in 800 bushes: beta(15.1 + 4, 2,184.9 + 796) = **beta(19.1, 2,980.9)**. Mean 19.1 ÷ 3,000 = **0.637%**.
2. **No**: the highest count is 2, well below 6. (With these days added, the chart's own limits would tighten slightly, but none of these counts would approach them.)
3. The 0.78% prediction lies inside the 90% interval, so the audits are **consistent** with the capability study, though they now lean towards a slightly lower rate. If later audits keep the interval below 0.78%, the process's mean or spread has probably improved, and the capability study, the prior of Chapter 2 and the cost-based limits of Chapter 3 should be updated together.
