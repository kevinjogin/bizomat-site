---
book: accept-or-reject-by-the-numbers
chapterSlug: how-good-is-the-gauge
order: 4
title: "How good is the gauge?"
description: "Judge a gauge three ways: a Type 1 study of repeatability and bias with the KEVOS® gauge check, the test uncertainty ratio, and the money a better gauge would save in wrong decisions."
draft: false
---

Chapters 2 and 3 took the air gauge's uncertainty as given and asked what decisions to make with it. This chapter asks whether the gauge itself is good enough, and what a better one would be worth. There are three common ways to answer, and they can disagree. A gauge study measures the gauge's repeatability and bias against a reference and compares them with the tolerance. A test uncertainty ratio compares the whole uncertainty budget with the tolerance. And the economic view asks how much money the gauge's error costs in wrong decisions, and therefore what a better gauge would save.

The chapter runs a Type 1 gauge study on the air gauge with the KEVOS® gauge repeatability and bias check, finds and fixes a fault, explains why the study's repeatability differs from the budget's, prices better gauges using the method of Chapter 3, and ends with a gauge set to a master whose value had been entered wrongly.

## The Type 1 study

A Type 1 gauge study measures one reference part, usually a certified master, many times with one operator, and compares the spread and the average of the readings with the tolerance. It isolates the gauge from the parts and from the operators, so it is the first study to run on a new gauge or after any repair. The [gauge repeatability and bias check](/tools/gauge-repeatability-bias-check/) takes the number of readings, their mean and standard deviation, the master's reference value, the specification limits, the gauge resolution, the share of the tolerance the gauge may use, the spread in standard deviations it is compared over, and the minimum capability required. It reports the bias, the potential capability Cg, the capability including bias Cgk, the share of the tolerance used by repeatability with and without bias, a t-test of whether the bias is real, and the resolution as a share of the tolerance.

```figure
type: formula
title: Type 1 gauge capability
formula: Cg = (K × T) ÷ (L × s)
formula: Cgk = (K × T ÷ 2 − |bias|) ÷ (L ÷ 2 × s)
formula: Bias t = bias ÷ (s ÷ √n)
caption: A widely used convention takes K = 20% of the tolerance, a spread of L = 6 standard deviations and a minimum of 1.33 for both indices. The t statistic is compared with the t distribution with n − 1 degrees of freedom.
- T | tolerance band, USL − LSL
- s | standard deviation of the repeated readings
- bias | mean reading minus the master's reference value
- n | number of readings
```

This is an illustration. The air gauge was set with a 25.0100 mm master ring, and an inspector then measured the master 25 times, removing and reinserting the plug each time. The readings averaged 25.01012 mm with a standard deviation of 0.62 µm.

```figure
type: compare
title: The air gauge's Type 1 study, from the KEVOS® gauge check
cols: First study | After cleaning and re-setting
rowhead: Result
- Readings | 25, mean 25.01012 mm, s 0.62 µm | 25, mean 25.01005 mm, s 0.45 µm
- Bias | 0.12 µm | 0.05 µm
- Cg | 1.129 | 1.556
- Cgk | 1.065 | 1.519
- Repeatability share of tolerance | 17.7% | 12.9%
- Bias t statistic, p-value | 0.968, 0.343 | 0.556, 0.584
- Resolution share of tolerance | 2.38% | 2.38%
- * Verdict, minimum 1.33 | not capable | capable
caption: This is an illustration. Tolerance 25.000 to 25.021 mm, resolution 0.5 µm, K = 20%, L = 6. In neither study is the bias statistically significant at 5%.
```

The first study failed. Its bias of 0.12 µm was not significant, a p-value of 0.34 says that a bias that size could easily arise by chance from 25 readings, but its repeatability was too poor: six standard deviations took 17.7% of the tolerance, and Cg was 1.13 against the 1.33 required. The metrology technician found dirt in one of the plug's air jets and a master that had been stored beside the coolant tank, several degrees cooler than the gauge. After cleaning the jets and storing the master beside the gauge, a second study gave a standard deviation of 0.45 µm, Cg 1.56 and Cgk 1.52, and the gauge passed.

## Why the study and the budget differ

Chapter 2's budget used a repeatability of 1.0 µm, measured from repeat readings on production bushes. The Type 1 study, after the fix, found 0.45 µm on the master. Both are right, because they measure different things.

The master is a nearly perfect cylinder with a fine finish, clean and at the gauge's temperature. A production bush has small form errors, a lobed or tapered bore of a micrometre or two, a turned finish, and sometimes a film of coolant. Each time the plug enters a bush, it settles slightly differently relative to these features, and the reading varies more than it does on the master. The Type 1 study measures the instrument; repeat readings on parts measure the measurement process as it is used. For decisions about parts, the second is the number that matters, which is why the budget uses it. The Type 1 study is still essential, because it shows whether the instrument is the weak link. Here, after cleaning, it is not: most of the 1.0 µm comes from the parts and the way they are presented. Subtracting variances, √(1.0² − 0.45²) = 0.89 µm of the repeatability on parts comes from the bushes' form and their presentation to the plug, against 0.45 µm from the instrument itself.

A full gauge study would go further, with several operators each measuring several parts several times, separating repeatability from reproducibility between operators and from the parts' own variation. That is the usual next step for a gauge used by several people on several shifts.

## The test uncertainty ratio

The test uncertainty ratio, the tolerance divided by twice the expanded uncertainty, was 4.64 in Chapter 2. A common rule asks for 4, and some industries ask for 10. It is a useful quick check because it includes everything in the budget, not just repeatability, but Chapter 2's error showed its limitation: it says the gauge is small compared with the tolerance, not that its errors do not matter. With a process running close to a limit, as BU-25's does, even a gauge with a ratio of 4.64 decides the fate of many bushes.

The convention for Type 1 studies, six standard deviations within 20% of the tolerance, is in fact stricter than a test uncertainty ratio of 4 for repeatability alone: it allows a standard deviation of only 0.70 µm on BU-25's 21 µm tolerance, while a ratio of 4 allows an expanded uncertainty of 2.6 µm, a standard uncertainty of 1.3 µm. The two rules are different conventions with different histories, and a gauge can pass one and fail the other, which is exactly what the air gauge did in its first study.

## What a better gauge is worth

Neither convention says what a better gauge would be worth. The economic view does. Using the method of Chapter 3, the cost-based acceptance limits and the cost of wrong decisions can be worked out for any measurement uncertainty, with the same process and costs.

```figure
type: compare
title: Cost of wrong decisions per shift by the gauge's combined standard uncertainty
cols: Cost-based limits, mm | Escapes | Good bushes rejected | Cost, A$ ex GST
rowhead: Standard uncertainty, µm
- 1.60 | 25.0012 to 25.0190 | 0.68 | 79.5 | 790
- * 1.13, the current air gauge | 25.0012 to 25.0193 | 0.34 | 50.0 | 459
- 0.80 | 25.0011 to 25.0197 | 0.17 | 31.6 | 273
- 0.50 | 25.0008 to 25.0201 | 0.07 | 17.4 | 142
- 0.30, the bench gauge | 25.0006 to 25.0204 | 0.03 | 9.5 | 75
- 0.10 | 25.0002 to 25.0208 | 0.01 | 2.9 | 22
caption: This is an illustration. Each row uses its own cost-based limits. A better gauge lets the limits move out towards the tolerance, cutting false rejects and escapes together.
```

The table puts a price on measurement quality. Halving the standard uncertainty from 1.13 to about 0.5 µm would cut the cost of wrong decisions from A$459 to A$142 a shift, a saving of about A$317 a shift, or roughly A$79,000 a year on one shift a day. That is the most a better gauge could be worth for this bore, before the cost of the gauge itself and of any slower measurement. A better gauge does two things at once: it catches more of the truly oversize bushes, and it lets the acceptance limits move out towards the tolerance, so it also rejects fewer good ones.

The table also shows where the value comes from. Most of the current gauge's uncertainty is repeatability on parts, so the gains would come from a gauge, or a method, that is less sensitive to the bores' form and finish: a different plug design, a measuring station that locates the bush consistently, or averaging two readings, which Chapter 5 examines. Spending on a better-calibrated master would hardly help, because calibration contributes only 0.5 of the 1.13 µm.

## Gauges, processes and where to spend

The economic view also answers a question that conventions cannot: is the money better spent on the gauge or on the process? Chapter 10 shows that centring BU-25's process in its tolerance would cut the number of bad bushes per shift by about two-thirds, and that a two-stage inspection with the bench gauge cuts the cost of wrong decisions to about half. These options compete with a better air gauge for the same budget, and the right choice depends on their costs, which a table like the one above makes it possible to compare.

```figure
type: decision
title: Is the gauge good enough?
question: What decision rests on the measurement?
caption: The three questions are complementary. Only the last puts a value on improvement.
- Is the instrument itself sound? | Type 1 study on a master: Cg and Cgk at least 1.33, bias not significant | fix or repair if it fails
- Is the measurement small against the tolerance? | test uncertainty ratio from the full budget, often at least 4 | a quick screen for gauge selection
- * What does its error cost? | cost-based limits and wrong decisions per shift, for this gauge and better ones | the basis for spending on a better gauge
```

## Keeping the gauge honest

A gauge study is a snapshot. Between studies, jets clog, plugs wear, masters are dropped and settings are changed, and every bush measured in the meantime is decided with whatever the gauge has become. Three routine checks keep the gap between studies short.

The first is a setting check at the start of every shift and after any stoppage: the operator measures the master and confirms that the reading is within a small band of its certified value, for the air gauge ±0.5 µm. The second is a periodic Type 1 study, monthly for this gauge, which repeats the full check of repeatability and bias. The third is a control chart of the setting-check readings, which turns a series of individually acceptable readings into a picture of drift: a run of readings creeping upwards shows a clogging jet or a warming master long before any single reading fails. *Random Error and Drift by the Numbers* treats the statistics of slow drift in measurement systems.

```figure
type: checklist
title: Routine checks on the air gauge
caption: The open item is the one this chapter's error turned on. A certified value that is remembered rather than read is not certified.
- x Setting check each shift and after any stoppage | master read within ±0.5 µm of its value
- x Monthly Type 1 study | Cg and Cgk at least 1.33; bias tested
- x Setting readings charted | look for runs and trends, not only single failures
- ? Master's certified value read from the certificate at every setting | never from memory or an old label
- x Master stored at the gauge's temperature | not beside coolant tanks, doors or heaters
- x Reaction plan written down | quarantine and re-measure bushes since the last good check
```

The reaction plan matters as much as the checks. When a check fails, every bush accepted since the last good check was decided by a gauge that may have been wrong. The plan states which bushes are quarantined, how they are re-measured, and who decides whether a customer must be told. The more often the gauge is checked, the fewer bushes a failure puts in doubt, which is the real argument for checking every shift rather than every week: the check costs a minute, and a failure found a week late puts 10,000 bushes in question.

## The error: a master entered wrongly

This is an illustration. Six months after the study, a new master ring was bought with a certificate giving its size as 25.0095 mm. The technician who set the gauge entered 25.0100 mm, the old master's value, from habit. Every reading from then on was 0.5 µm high.

The shift setting checks did not catch it, and could not have. Each check compared the master's reading with the value the operators believed it had, 25.0100 mm, and since the gauge had been set to show exactly that, every check passed. A check that uses the same wrong number as the setting can only confirm the mistake. The monthly Type 1 check found it, because the metrology technician took the reference value from the certificate. Measured against the new master, whose certified value was correctly entered in the study, 25 readings averaged 25.0100 mm against a reference of 25.0095 mm, a bias of 0.5 µm, and with a standard deviation of 0.45 µm the tool's t-test gave t = 5.56 and a p-value well below 0.001: a real bias. Cg was unchanged at 1.56, but Cgk fell to 1.19, below the 1.33 required, and the tool reported the gauge not capable.

The cost of the error could be estimated with the method of Chapter 3. Readings 0.5 µm high are equivalent to acceptance limits 0.5 µm lower, 25.0007 to 25.0188 mm. Those limits give 0.15 escapes and 70.8 false rejects a shift, A$521, about A$62 a shift more than the correct limits. The shop had scrapped about 21 extra good bushes a shift for the two weeks before the check found the error. The correction was to re-set the gauge with the certified value, and to change the setting procedure so that the master's value is read from its certificate, not remembered, and recorded with the setting.

## Exercise: a gauge for a new bore

This is an illustration. A new air gauge is being considered for the same bore. Thirty readings of the 25.0100 mm master give a mean of 25.0103 mm and a standard deviation of 0.80 µm.

1. Work out Cg and Cgk with K = 20% and L = 6.
2. Is the bias significant at 5%? The t-test's p-value is 0.049.
3. Does the gauge pass a minimum of 1.33? What would the economic view add?

**Worked answer.**

1. Cg = 0.20 × 21 ÷ (6 × 0.80) = 4.2 ÷ 4.8 = **0.875**. Cgk = (0.10 × 21 − 0.3) ÷ (3 × 0.80) = 1.8 ÷ 2.4 = **0.750**, with values in micrometres.
2. t = 0.3 ÷ (0.80 ÷ √30) = 0.3 ÷ 0.146 = **2.05**, with 29 degrees of freedom. A p-value of 0.049 is just below 0.05, so the bias is **significant at 5%**, though only just; it should be confirmed with a second study before the gauge is adjusted.
3. **No**: both indices are well below 1.33, and repeatability alone uses 22.9% of the tolerance. The economic view would add that a gauge whose repeatability on the master is already 0.8 µm, against 0.45 µm for the current gauge, is likely to be worse on production bushes too, which would raise the cost of wrong decisions above the current A$459 a shift. It should not be bought for this bore without a study on production bushes that shows otherwise.
