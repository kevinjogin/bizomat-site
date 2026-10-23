---
title: "Testing a hypothesis without fooling yourself: predictions, p-values, power and honest comparisons"
description: "How to state testable business hypotheses, plan comparisons before seeing data, read p-values and confidence intervals correctly, size tests with enough power and avoid peeking and fishing."
publishDate: 2026-10-16
category: "Ideas"
tags:
  - validation
  - experimentation
  - strategy
author: "KEVOS"
featured: false
draft: false
---

Businesses test ideas constantly. A new quoting approach seems to win more jobs. A changed machine setting seems to reduce scrap. A redesigned web page seems to bring more enquiries. A supplier's material seems to last longer. In each case, someone has a belief about cause and effect and some data that appears to support it. The difficult question is whether the data really shows what it appears to, or whether the apparent improvement is chance, coincidence or the result of looking at the data in a way that was bound to find something.

The physicist Richard Feynman put the principle memorably: the first rule is not to fool yourself, and you are the easiest person to fool. People see patterns in noise, remember the evidence that supports their ideas, stop collecting data when results look good and try analysis after analysis until one gives the hoped-for answer. Statistical hypothesis testing exists to protect against these tendencies, but only when it is used honestly: with predictions stated in advance, comparisons planned before looking at results, samples large enough to detect real effects and results interpreted for what they actually mean.

This article explains how to frame a testable hypothesis, the logic of significance testing, what p-values and confidence intervals do and do not mean, the two kinds of error, power and sample size, common tests for business data, the traps of multiple comparisons, peeking and fishing, practical significance and how to plan and report tests honestly. It is part of a series on research and evidence for business decisions.

## A testable hypothesis

A **hypothesis** is a specific, testable statement about a relationship or difference: "Quotes that include a fixed-price option will be accepted more often than quotes without one", or "Raising the oven temperature by 10 °C will reduce curing defects." Good hypotheses are:

- **specific** about what is compared and how it will be measured;
- **falsifiable**, meaning that some possible result would show them to be wrong; and
- **stated before the data is examined**, so that the test is a genuine prediction rather than a description of what was already seen.

```figure
type: checklist
title: A testable hypothesis
caption: A hypothesis written after looking at the data is a description, not a test.
- x Specific | what is compared, and how it is measured
- x Falsifiable | some result would prove it wrong
- *x Stated before the data is examined
```

A vague belief, such as "the new process is better", becomes testable once the measure, the comparison and the expected direction are defined.

## The logic of significance testing

Classical significance testing begins with a **null hypothesis**: that there is no real difference or effect, and any difference observed is due to chance. The **alternative hypothesis** is that a real difference exists. The test asks: if the null hypothesis were true, how surprising would the observed data be?

That surprise is measured by the **p-value**: the probability of obtaining a result at least as extreme as the one observed, if the null hypothesis were true. A small p-value means the data would be unusual if there were no real effect, which counts as evidence against the null hypothesis. By convention, results with p-values below 0.05 are often called "statistically significant", although the threshold is a convention, not a law of nature.

### What a p-value is not

A p-value is widely misunderstood. It is **not**:

- the probability that the null hypothesis is true;
- the probability that the result was due to chance;
- a measure of how large or important the effect is; or
- proof that an effect exists or does not exist.

A p-value of 0.03 says only that a result this extreme would occur about 3% of the time if there were truly no effect. Whether that is convincing depends on how plausible the hypothesis was to begin with, how many other comparisons were made and how well the study was designed.

## Confidence intervals: often more useful

A **confidence interval** gives a range of plausible values for the true effect, such as "the new approach increases win rates by between −4 and +24 percentage points". It conveys both the size of the effect and the uncertainty about it, which a p-value alone does not. A wide interval spanning both no effect and a large effect says, honestly, that the data cannot yet tell. Reporting effects with confidence intervals is generally more informative than reporting p-values alone.

## Two kinds of error

Any test can be wrong in two ways:

- A **type I error**, or false positive, concludes that an effect exists when it does not. The significance threshold controls this risk for a single, pre-planned test.
- A **type II error**, or false negative, misses an effect that does exist. This risk depends on the sample size, the size of the real effect and the variability of the data.

Business consequences differ. A false positive may lead to rolling out a change that does nothing; a false negative may lead to abandoning a genuinely useful idea. Thinking about which error is more costly helps decide how much evidence to require.

## Power and sample size

**Power** is the probability that a test will detect an effect of a given size if it really exists. Underpowered tests, with samples too small to detect realistic effects, are common in business. They usually produce "no significant difference", which is often misread as "no difference".

Planning sample size in advance requires choosing the smallest effect that would matter, an estimate of variability and the desired power, commonly 80%. For example, to detect an increase in a win rate from 30% to 40% with 80% power at the usual 5% significance level, roughly 350 quotes would be needed in each group. Many small businesses do not have that many quotes, which means they should either test larger expected effects, accumulate data over longer periods or accept more uncertainty in their decisions.

## Common tests for business data

The right test depends on the type of data and the design:

- **Comparing two proportions**, such as win rates or defect rates, uses tests for proportions or contingency tables. The [analysing counts and categories in business data](/reados/collections/operational-data-records-and-controls/analysing-counts-and-categories-in-business-data/) article explains these.
- **Comparing two means**, such as average cycle times, often uses t-tests, which assume roughly normal data or reasonably large samples.
- **Paired data**, such as the same machines measured before and after a change, uses paired tests, which are more powerful because they remove differences between machines.
- **Skewed or ranked data** may suit non-parametric tests, which compare ranks rather than means.
- **Several factors at once** suit designed experiments, described in the [experiment before you standardise](/reados/collections/product-development-and-launch/designed-experiments-before-standardising/) article.

Spreadsheets and statistical tools perform the calculations; the important judgements are choosing the design and test before seeing the results and checking the test's assumptions.

## Before-and-after comparisons need a control

Many business tests compare performance before and after a change. Without a **control group** that did not receive the change, any difference could be due to seasonal patterns, other changes, regression to the mean after an unusually bad period or chance. Where possible, apply the change to some cases and not others, ideally chosen at random, and compare the two groups over the same period.

## A/B testing

Online businesses routinely run **A/B tests**, randomly showing visitors one of two versions of a page, email or offer and comparing results. The same principle applies offline: alternating two versions of a quote template, trialling a new procedure on randomly chosen shifts or offering a promotion to a random half of customers. Randomisation makes the groups comparable, so differences in results can be attributed to the change.

## The trap of peeking

Checking test results repeatedly and stopping as soon as a "significant" difference appears inflates the false positive rate dramatically, because random fluctuations will eventually cross the threshold. Decide the sample size or duration in advance and analyse at the end, or use methods specifically designed for sequential monitoring.

## Multiple comparisons and fishing

If twenty unrelated comparisons are each tested at the 5% level, there is roughly a 64% chance that at least one will appear significant by chance alone. Testing many measures, many subgroups or many time periods and reporting only the significant ones, sometimes called **fishing** or **p-hacking**, produces findings that do not replicate. Protections include:

- deciding the primary measure and comparison in advance;
- treating additional comparisons as exploratory and labelling them as such;
- adjusting significance thresholds when many tests are planned; and
- confirming surprising findings with a new test before acting on them.

## Replication

A single significant result, especially a surprising one, is weaker evidence than it appears. Many published findings in research fields have failed to replicate when tested again. In business, the practical equivalent is to confirm a promising result with a second test, ideally in a different period or location, before committing large investments. Results that hold up across repeated tests deserve much more confidence than a single lucky quarter.

## Practical significance

A statistically significant result may be too small to matter. With large samples, trivial differences become significant. Always ask whether the size of the effect justifies action, given the cost and risk of the change. Conversely, a large, practically important effect that falls short of statistical significance in a small sample may justify a further test rather than abandonment.

## Another way: updating beliefs

Significance testing is one framework among several. **Bayesian** approaches treat probabilities as degrees of belief and update them as evidence arrives, producing statements such as "there is an 85% probability that the new approach is better". They make prior assumptions explicit and suit decisions made with accumulating data. The [thinking in probabilities](/reados/collections/judgement-markets-and-learning/thinking-in-probabilities/) article explains the reasoning.

## Planning and reporting honestly

A simple **analysis plan**, written before data is collected, states the hypothesis, the primary measure, the comparison, the sample size or duration, the test and the decision rule. Reports should present the planned analysis first, give effect sizes with confidence intervals, state sample sizes, disclose any additional exploratory analyses and note limitations. Negative and inconclusive results should be reported too; they are evidence.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

An engineering services firm believes that adding a fixed-price option to its quotes will improve its win rate. Over a quarter, it alternates quote templates: 80 quotes go out without the option and 90 with it. Twenty-four of the first group are won (30%) and 36 of the second (40%).

The sales director wants to declare success. The analyst calculates that the difference of 10 percentage points has a p-value of about 0.17, and a 95% confidence interval running from about −4 to +24 percentage points. The data is consistent with no effect and with a substantial one. The test was underpowered: detecting a 10-point improvement reliably would have needed around 350 quotes in each group.

```figure
type: bars
title: Win rate with and without a fixed-price option
unit: %
max: 45
caption: p ≈ 0.17, and the 95% interval for the difference runs from about −4 to +24 points: consistent with no effect or a large one.
- Without the option, 80 quotes | 30
- *With the option, 90 quotes | 40
```

Rather than abandoning or adopting the idea on this evidence, the firm continues alternating templates for another two quarters, with the decision rule and total sample size written down in advance, and combines the data at the end. It also records quote values, to check whether any change in win rate holds for larger jobs as well as smaller ones.

## How this applies to a small Australian business

- **State hypotheses and measures before collecting data.**
- **Use control groups** and randomise where possible.
- **Plan sample sizes** for the smallest effect worth detecting.
- **Report effect sizes and confidence intervals**, not just p-values.
- **Avoid peeking** and stopping early.
- **Label exploratory analyses** and confirm surprising findings.
- **Judge practical significance** alongside statistical significance.
- **Confirm surprising results** with a second, pre-planned test.
- **Report inconclusive results honestly.**

## Common mistakes

- **Reading "not significant" as "no effect".**
- **Treating p-values as the probability the hypothesis is true.**
- **Before-and-after comparisons without controls.**
- **Testing many measures and reporting the winners.**
- **Stopping a test when it first looks good.**
- **Underpowered tests** that cannot detect realistic effects.

## Frequently asked questions

**Is 0.05 a magic threshold?** No. It is a convention. Results just above or below it are similar in strength, and the decision should consider effect size, prior evidence and consequences.

**What if the business cannot collect large samples?** Test larger, more meaningful changes, accumulate data over longer periods, use paired designs that reduce variability, combine evidence from several sources and make decisions reversible.

**Should every business decision be tested statistically?** No. Formal tests suit repeatable decisions where data can be collected. Many decisions rely on judgement, informed by evidence of varying strength.

**What is a pre-registered analysis?** An analysis plan written and dated before the data is examined, so that readers can see the test was not chosen after seeing results.

**Why do promising results so often fail to repeat?** Because results selected for being striking tend to include some luck, and the next test regresses towards the true, usually smaller, effect. Small samples and many comparisons make this worse. Confirming results with a second, pre-planned test guards against acting on luck.

## Questions to ask

- What exactly do we predict, and what result would show we are wrong?
- Do we have a comparison group, and were cases assigned fairly?
- Is our sample large enough to detect the smallest effect that matters?
- Did we decide the analysis before looking at the results?
- Has this result been repeated before we invest heavily in it?
- Is the effect large enough to justify the change?

## Bringing it together

Hypothesis testing protects against self-deception, but only when used honestly. Frame specific, falsifiable predictions; plan comparisons, measures and sample sizes in advance; use controls and randomisation; read p-values correctly and prefer confidence intervals; respect power; avoid peeking and fishing; and weigh practical alongside statistical significance. Tests planned and reported this way turn business hunches into evidence that can be trusted.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations.*
