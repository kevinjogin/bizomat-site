---
book: accelerated-life-testing-by-the-numbers
chapterSlug: reading-life-data-with-weibull
order: 6
title: "Reading life data with the Weibull distribution"
description: "Why life is a distribution, the Weibull shape and scale, median ranks and suspensions, fitting FL-60's prototype driver data, translating to field life, and four survivors left out."
draft: false
---

No two drivers fail at the same moment. Even under identical conditions, small differences in each capacitor's seal, each solder joint and each batch of electrolyte spread the failure times out, sometimes widely. A single number such as "average life" hides that spread, and the spread is exactly what a reliability target is about: FL-60's target is not that the average driver lasts ten years, but that 90% of them do. To work with that target, test results must be described as a distribution, and the distribution most used for life data is the Weibull.

This chapter explains the Weibull distribution and what its two parameters mean, shows how to estimate them from a test in which some units failed and others were still running when it stopped, fits FL-60's prototype driver results, and translates the fitted life at the test temperature into a field life with the acceleration factor from Chapter 2. It ends with an analysis that left out the drivers that had not failed.

## The Weibull distribution

The Weibull distribution gives the fraction of a population that has failed by time t, the **unreliability** F(t), as F(t) = 1 − exp[−(t/η)^β]. It has two parameters, and each has a plain meaning.

- The **scale parameter** η, the characteristic life, is the time by which 63.2% of the population has failed, whatever the shape. It sets where on the time axis the failures occur.
- The **shape parameter** β describes how failures spread out in time and, more usefully, what kind of failure is happening. A β below 1 means the failure rate falls with age, the signature of early failures from defects. A β of exactly 1 means a constant failure rate, the signature of random events. A β above 1 means the failure rate rises with age, the signature of wear-out; values of 2 to 4 are typical of fatigue and chemical degradation.

```figure
type: formula
title: The Weibull distribution and its B life
formula: F(t) = 1 − exp[−(t/η)^β]      B_p = η × (−ln(1 − p))^(1/β)
caption: B10 is the time by which 10% of units have failed, which is the quantity FL-60's target is written in. R(t) = 1 − F(t) is the reliability.
- F(t) | fraction failed by time t
- η | characteristic life, the time at which 63.2% have failed, h
- β | shape parameter: below 1 early failures, 1 random, above 1 wear-out
- B_p | time by which a fraction p has failed, h
step: β = 2.57, η = 5,950 h: B10 = 5,950 × (−ln 0.9)^(1/2.57) = 5,950 × 0.4166 = 2,479 h
```

The shape parameter matters for acceleration as well as description. Chapter 1's second rule was that acceleration should change the time scale but not the shape of the distribution. In Weibull terms, an accelerated test should change η but leave β the same. If tests at two temperatures give clearly different values of β, the mechanism has probably changed between them, and the acceleration factor between them is suspect.

## FL-60's prototype driver test

This is an illustration. Before the capacitor change of Chapter 3, the business ran ten prototype drivers, each with 2,000-hour capacitors, in a chamber set so that the hottest capacitor's core ran at **105 °C**. The drivers were monitored continuously, and a driver counted as failed when its output current fell below 90% of its rating or its ripple rose above a set limit. The test was stopped at **6,000 hours**.

Six drivers failed, at **2,150, 3,020, 3,610, 4,280, 4,850 and 5,600 hours**. Four were still running at 6,000 hours. Every failed driver was opened, and in all six the life-limiting capacitor showed the expected signs of electrolyte loss: a bulging vent, low capacitance and high ESR. All six were the same mechanism, which the analysis needs.

The four drivers still running are not missing data; they are information. Each of them survived at least 6,000 hours, and leaving them out would make the drivers look worse than they are. Units removed from a test before failure are called **suspensions**, or censored data, and any analysis of life data must include them.

## Estimating the parameters

The simplest method, and the one a spreadsheet can do, is **median rank regression**. The failures are put in order of time, and each is given an estimate of the fraction of the population that had failed by then. Since the true fraction is unknown, the median of its possible values is used, which Benard's approximation gives as (i − 0.3) ÷ (N + 0.4), where i is the failure's order and N is the total number of units on test, including the suspensions. Taking logarithms twice turns the Weibull equation into a straight line: ln[−ln(1 − F)] = β ln t − β ln η. Plotting the left-hand side against ln t gives a line whose slope is β and from which η follows.

```figure
type: compare
title: FL-60 prototype drivers at 105 °C core, ten on test, four suspended at 6,000 h
cols: Hours to failure | Median rank, (i − 0.3) ÷ 10.4 | Fitted F(t)
caption: This is an illustration. Median rank regression on the six failures with N = 10 gives β = 2.57, η = 5,950 h, r² = 0.996. The four drivers still running at 6,000 h set N but are not plotted.
- 1 | 2,150 | 6.7% | 7.0%
- 2 | 3,020 | 16.3% | 16.1%
- 3 | 3,610 | 26.0% | 24.2%
- 4 | 4,280 | 35.6% | 34.9%
- 5 | 4,850 | 45.2% | 44.6%
- 6 | 5,600 | 54.8% | 57.5%
```

The fit gives **β = 2.57** and **η = 5,950 hours**, with a correlation coefficient squared of 0.996 on the transformed plot: a straight line, so the Weibull describes the data well. A β of 2.57 is a clear wear-out signature, as expected for electrolyte loss. The B10 life at the test temperature is **2,479 hours**.

```figure
type: line
title: Fitted Weibull unreliability of the prototype drivers at 105 °C core
x: Hours on test
y: Fraction failed, %
ymin: 0
ymax: 80
mark: 2479 | B10 life
caption: This is an illustration: β = 2.57, η = 5,950 h. The curve starts slowly and steepens, the shape of wear-out; 10% have failed by 2,479 h and 63.2% by 5,950 h.
- 1000 | 1.0
- 2000 | 5.9
- 3000 | 15.8
- 4000 | 30.3
- 5000 | 47.2
- 6000 | 64.0
- 7000 | 78.1
```

Median rank regression is quick and visual, and it is adequate for a first look. With heavier censoring, suspensions scattered among the failures rather than all at the end, or decisions that depend on the tails, **maximum likelihood estimation** is preferred: it uses every unit's information directly, gives confidence bounds on β and η, and is built into reliability software and into IEC 61649's procedures. When suspensions occur between failures, the ranks must also be adjusted, for example by Johnson's method, because a unit removed early leaves fewer units at risk for the later ranks. In FL-60's test all the suspensions came at the end, so the simple ranks are correct.

## From the test to the field

The fitted distribution describes the drivers at a 105 °C core. Under the Arrhenius model, acceleration multiplies every time by the same factor without changing β, so the field distribution has the same shape and a characteristic life multiplied by the acceleration factor.

This is an illustration. With the acceleration factor of 21.2 from Chapter 2, for 0.7 eV between the 57.9 °C effective use temperature and 105 °C, the field B10 is 2,479 × 21.2 = about **52,600 hours**, about **12.0 years** at 4,380 hours a year. The reliability at the 43,800-hour design life is exp[−(43,800 ÷ (5,950 × 21.2))^2.57] = about **0.936**, so about 6.4% of these prototype drivers would fail within ten years and about 1.1% within the five-year warranty.

```figure
type: bars
title: Field B10 life of the prototype drivers, by acceleration model
unit: years
max: 16
caption: This is an illustration: test B10 of 2,479 h at 105 °C core, 4,380 operating hours a year. The prototype meets the 10-year B10 target only if the acceleration is at least as strong as 0.7 eV, which is why the capacitor was changed.
- Arrhenius, Ea = 0.5 eV, AF 8.9 | 5.0
- * Arrhenius, Ea = 0.7 eV, AF 21.2 | 12.0
- Makers' doubling rule, AF 26.2 | 14.8
```

The figure shows why a point estimate is not enough. On the central model, the prototype meets its B10 target of 10 years, with a little to spare. On a weaker plausible model it fails badly. And the B10 itself is an estimate from only six failures, with a confidence interval that maximum likelihood analysis would show to be wide. Taken together, the result says that the 2,000-hour prototype is marginal, which agrees with Chapter 3's calculation and supports the decision to change to 10,000-hour capacitors. The production driver then needs its own demonstration, which Chapter 7 designs.

## How much six failures can tell

Six failures are enough to see the shape of a distribution, but not to pin it down. With so few points, the fitted β and η each carry a wide band of uncertainty, and the B10, which sits in the lower tail where there are fewest data, carries the widest. Maximum likelihood methods put numbers on that band; as a rough guide, with half a dozen failures the lower confidence bound on a B10 can easily be half the point estimate or less. A conclusion that depends on the point estimate being right to within 20% is therefore not supported by a test of this size.

Two practical consequences follow. First, results from small tests should be reported with their bounds, or at least with a statement that the bounds are wide, so that nobody treats "B10 = 12.0 years" as more precise than it is. Second, small tests are most useful when the answer is clear-cut: a design whose estimate falls far below its target, as the prototype's would at 0.5 eV, or far above it. When the estimate sits close to the target, as the prototype's did on the central model, the honest conclusion is "marginal", and the right response is a design change that moves it well clear, or more test units, not a more favourable choice of model.

There is also a statistical reason to prefer shape over precision in small tests. The shape parameter is the quickest check that the test produced the intended mechanism: if β had come out near 1, or below it, the failures would have pointed to defects or random events rather than wear-out, and the capacitor model would not have applied at all. Looking at β before looking at η is a habit worth keeping.

## Mean life and the MTBF trap

Life data are often summarised as a mean time between failures, MTBF, calculated as total unit-hours on test divided by the number of failures. For FL-60's prototype test, that is (2,150 + 3,020 + 3,610 + 4,280 + 4,850 + 5,600 + 4 × 6,000) ÷ 6 = 47,510 ÷ 6 = **7,918 hours**, which with an acceleration factor of 21.2 becomes a field MTBF of about **167,900 hours**, or 38 years.

That figure is easily misread. An MTBF calculated this way assumes a constant failure rate, β = 1, which these drivers plainly do not have. It does not mean that drivers last 38 years: under its own exponential assumption, it implies that 23% of drivers fail within 10 years, while the Weibull fit says 6.4%. Neither number is "the" answer from the MTBF, because the MTBF does not describe a wear-out population at all. For wear-out mechanisms, report β, η and the B life the target is written in, never an MTBF alone.

## The error: four survivors left out

This is an illustration. The engineer who first analysed the prototype test put the six failure times into a spreadsheet template that calculated median ranks from the number of rows, which was six. The four drivers still running at 6,000 hours were not in the template, because they had not failed.

With N = 6, the median ranks became 10.9%, 26.6%, 42.2%, 57.8%, 73.4% and 89.1%: the analysis now said that nearly 90% of drivers had failed by 5,600 hours, when in fact four of ten were still running at 6,000 hours. The fit gave **β = 3.05** and **η = 4,403 hours**, a characteristic life 26% too short. The field B10 at 0.7 eV came out at about 10.2 years instead of 12.0. In this case the error was pessimistic, and the conclusion, that the prototype was marginal, happened to survive it. But the steeper β would have been carried into the planning of the production test in Chapter 7, where a steeper assumed β makes a short test look more convincing than it is.

The error was found when a reviewer compared the template's summary, "6 of 6 failed", with the test log, which listed ten drivers. The analysis was redone with N = 10, and the template was replaced with one that requires an entry for every unit on test, with its time and whether it failed or was suspended, and that checks the count against the test log.

```figure
type: checklist
title: Checks on a Weibull analysis
caption: The open item is this chapter's error. Every unit on test is data, whether or not it failed.
- x Every failure analysed and confirmed as the same mechanism | six capacitor wear-out failures
- x Shape parameter consistent with the mechanism | β = 2.57, wear-out
- x Fit quality checked | straight line, r² = 0.996
- x Field life reported with its sensitivity to the acceleration model | 5.0 to 14.8 years
- ? Suspended units included in the ranks | four survivors omitted: η 26% low, β too steep
```

## How this applies to a small Australian business

Small manufacturers rarely have dozens of failures to analyse, and that is exactly when careful analysis matters most. A spreadsheet can do median rank regression; the discipline is in the data: record every unit on test with its hours and its status, analyse every failure to confirm its mechanism, keep different mechanisms apart, and report the result as β, η and the B life the target uses, with the range that the acceleration model's uncertainty allows. Field returns can be analysed the same way, with the units still in service as suspensions, which is how Chapter 9 compares the test's predictions with the field.

## Exercise: an eleventh driver

Suppose an eleventh prototype driver had been added to the test and had failed at **1,200 hours**, and failure analysis showed a cracked ceramic capacitor damaged during assembly, not capacitor wear-out. How should it be treated in the wear-out analysis, and what would including it as a wear-out failure do to the result?

**Worked answer.** The cracked capacitor is a different mechanism, an early failure from a manufacturing defect, so it must not be fitted with the wear-out failures. In the wear-out analysis it is treated as a **suspension** at 1,200 hours: the driver was removed from the population at risk of wear-out at that time without failing by wear-out. Because it is suspended before the first wear-out failure, the ranks of the six wear-out failures are adjusted slightly, with N = 11 and one unit removed early. If it were wrongly included as a seventh wear-out failure, it would pull the lower tail down: median rank regression on seven failures with N = 11 gives β of about 1.72 instead of 2.57 and a B10 of about 1,660 hours instead of 2,479, mixing a production-quality question into a design-life answer. The defect belongs in a separate count, which tells the business about its assembly process and its screening, not about the capacitor's life.
