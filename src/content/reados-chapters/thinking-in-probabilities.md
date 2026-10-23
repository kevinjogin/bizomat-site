---
title: "Thinking in probabilities: degrees of belief for better decisions"
description: "Probability is a language for uncertainty. How degrees of belief, distributions, conditional probability and Bayes' rule help you reason clearly about evidence and risk."
publishDate: 2026-10-03
category: "Ideas"
tags:
  - ai
  - strategy
  - validation
author: "GoCore"
featured: false
draft: false
---

Most people talk about uncertainty in vague words: "probably", "unlikely", "there's a good chance", "almost certain". These words are useful in conversation but dangerous in decisions. Research on how people interpret such phrases has repeatedly found that different people attach very different numbers to the same words. One person's "likely" might mean 60%; another's might mean 90%.

Probability gives uncertainty a precise language. It allows beliefs to be stated clearly, combined consistently and updated as evidence arrives. It is the foundation of almost every method for making decisions under uncertainty, from medical diagnosis to automated vehicles to business forecasting.

This article explains the core ideas of probabilistic reasoning in plain English, following the approach of *Algorithms for Decision Making* by Mykel Kochenderfer, Tim Wheeler and Kyle Wray: degrees of belief, probability distributions, joint and conditional probability, and Bayes' rule. It includes worked examples showing why intuition about evidence often goes wrong. It is part of GoCore's series on decision making.

## Probability as a degree of belief

There are two common ways to interpret probability.

The **frequency** interpretation treats probability as how often something happens over many repetitions: a fair coin lands heads about half the time.

The **degree of belief** interpretation treats probability as a measure of how strongly an agent believes something, given what it knows. This applies even to one-off events. A forecaster can assign a probability to a particular product succeeding, even though that product will only be launched once.

The book adopts the degree-of-belief view, because decision makers constantly face unique situations. It also shows why such beliefs should follow the rules of probability. If an agent's degrees of belief satisfy a few reasonable requirements, such as being comparable and consistent (if A is more plausible than B, and B more than C, then A must be more plausible than C), they can be represented as probabilities between 0 and 1 that obey the standard rules.

The practical point is that beliefs which do not obey those rules can lead to contradictions. A person who believes it is 70% likely that a project finishes on time, and also 50% likely that it finishes late, holds inconsistent beliefs: the two must add to 100%.

## Probability distributions

A **probability distribution** describes the probabilities of all possible values of an uncertain quantity.

For a quantity with a limited number of possible values, such as the number of defective items in a batch or which of three suppliers will deliver first, the distribution assigns a probability to each value, and the probabilities add up to one.

For a quantity that can take any value in a range, such as delivery time, temperature or next month's revenue, the distribution is described by a **density**: a curve showing which values are more or less likely. Probabilities then apply to ranges, such as "between 10 and 12 days".

Some distributions appear again and again:

- **Uniform:** every value in a range is equally likely.
- **Gaussian (normal):** the familiar bell curve, common when many small effects add together, such as measurement errors.
- **Mixtures:** combinations of several distributions, useful when a quantity can behave in distinctly different ways, such as delivery times that are usually short but occasionally very long.

### Why the whole distribution matters

A single forecast, such as "delivery will take 10 days", hides crucial information. Two suppliers might both average 10 days. If one is almost always between 9 and 11 days and the other ranges from 5 to 30, they require very different planning. Decisions about safety stock, scheduling and promises to customers depend on the spread and shape of the distribution, not just its average.

## Joint distributions

Many decisions involve several uncertain quantities at once. A **joint distribution** gives the probability of each combination of values.

Suppose a business considers two uncertainties: whether demand next month is high or low, and whether a key supplier delivers on time. A joint distribution might look like this (an illustration):

| | Supplier on time | Supplier late | Total |
| --- | --- | --- | --- |
| Demand high | 0.30 | 0.10 | 0.40 |
| Demand low | 0.48 | 0.12 | 0.60 |
| Total | 0.78 | 0.22 | 1.00 |

The totals at the edges are called **marginal** probabilities: the probability of high demand, regardless of the supplier, is 0.40.

The challenge is that joint distributions grow very quickly. With ten yes-or-no uncertainties, there are 1,024 combinations; with thirty, over a billion. Representing them efficiently requires knowing which uncertainties influence each other, which is what Bayesian networks do. They are explained in [Bayesian networks](/reados/collections/decision-making-machines/bayesian-networks-cause-and-evidence/).

## Conditional probability

**Conditional probability** is the probability of one thing given that another is known. It is written P(A | B) and read "the probability of A given B".

From the table above, the probability that demand is high *given* that the supplier is late is 0.10 ÷ 0.22, or about 0.45. Knowing the supplier is late changes our belief about demand slightly, perhaps because both are affected by the same seasonal factors.

Conditional probability is how evidence enters reasoning. Almost every useful question in decision making is conditional: given these test results, how likely is a fault? Given this customer's history, how likely are they to reorder? Given this weather forecast, how likely is a delivery delay?

## Bayes' rule

**Bayes' rule** connects two conditional probabilities that people often confuse. It says:

**P(A | B) = P(B | A) × P(A) ÷ P(B)**

In words: the probability of a hypothesis given the evidence equals the probability of the evidence given the hypothesis, multiplied by the prior probability of the hypothesis, divided by the overall probability of the evidence.

The terms have names:

- **Prior:** P(A), the belief before seeing the evidence.
- **Likelihood:** P(B | A), how likely the evidence is if the hypothesis is true.
- **Posterior:** P(A | B), the updated belief after seeing the evidence.

```figure
type: steps
title: Bayes' rule in three parts
caption: Evidence should move a belief by the right amount: neither ignored nor overweighted.
- Prior | belief before the evidence
- Likelihood | how likely the evidence is if true
- *Posterior | belief after the evidence
```

### A worked example: a warning alarm

This is an illustration with round numbers.

A factory installs a monitoring system that raises an alarm when it detects signs of an impending machine fault.

- On any given day, there is a 2% chance that a fault is developing.
- When a fault is developing, the alarm sounds 95% of the time.
- When no fault is developing, the alarm still sounds 10% of the time (a false alarm).

The alarm sounds. How likely is it that a fault is developing?

Many people's intuition says around 90%, because the alarm is "95% accurate". Bayes' rule gives a very different answer:

| | Fault developing | No fault | Total |
| --- | --- | --- | --- |
| Share of days | 2% | 98% | 100% |
| Alarm sounds | 2% × 95% = 1.9% | 98% × 10% = 9.8% | 11.7% |

Of all days when the alarm sounds (11.7%), only 1.9% involve a real fault. The probability of a fault given an alarm is 1.9 ÷ 11.7, or about **16%**.

```figure
type: stack
title: Days when a "95% accurate" alarm sounds
unit: % of days
caption: A fault given an alarm is 1.9 ÷ 11.7, about 16%: faults are rare, so most alarms are false.
- *Real fault developing | 1.9
- False alarm | 9.8
```

The alarm is still useful: it raises the probability of a fault from 2% to about 16%, an eightfold increase. But most alarms are false. The reason is the low **base rate**: faults are rare, so even a modest false-alarm rate produces many more false alarms than true ones.

### Why base rates matter

Ignoring base rates is one of the most common errors in reasoning about evidence. The same pattern appears in medical screening, fraud detection, security alerts, quality inspection and recruitment tests. When the thing being detected is rare, a positive signal often means much less than it seems.

Knowing this changes decisions. In the factory example, it would be unwise to shut down production every time the alarm sounds. A better response might be a quick follow-up inspection, which is cheap relative to an unnecessary shutdown, and which provides a second piece of evidence.

### Combining evidence

Bayes' rule can be applied repeatedly. Yesterday's posterior becomes today's prior. If the follow-up inspection also suggests a fault, the probability rises again. If it finds nothing, the probability falls. This step-by-step updating is the foundation of many methods for tracking changing situations, explained in [Acting when you can't see everything](/reados/collections/decision-making-machines/acting-when-you-cant-see-everything/).

## Independence and conditional independence

Two uncertainties are **independent** if knowing one tells you nothing about the other. The outcome of one coin toss tells you nothing about the next.

More subtle, and more useful, is **conditional independence**: two things may be related in general but independent once a third is known. For example, ice cream sales and sunburn cases rise and fall together, but once the weather is known, one tells you little about the other. Hot, sunny weather explains both.

Recognising conditional independence makes reasoning far more manageable. It allows complex problems to be broken into smaller pieces, and it guards against mistaking a shared cause for a direct connection.

## From probabilities to decisions

Probabilities become useful for decisions when they are combined with the consequences of each outcome. The **expected value** of an uncertain quantity is the average of its possible values, each weighted by its probability. If a project has a 60% chance of earning $100,000 and a 40% chance of losing $50,000, its expected value is 0.6 × $100,000 − 0.4 × $50,000, or $40,000.

Expected value is a starting point, not the whole answer. A business that could not survive the $50,000 loss might reasonably reject a project with a positive expected value. The next step, weighing outcomes by how much they actually matter rather than by their dollar amounts alone, is the subject of [Utility: putting a value on outcomes](/reados/collections/valuing-time-delay-and-uncertainty/utility-putting-a-value-on-outcomes/).

## Common reasoning errors that probability prevents

**Confusing the two conditionals.** The probability of an alarm given a fault (95%) is not the probability of a fault given an alarm (16%).

**Ignoring base rates.** Rare events produce many false positives.

**Adding probabilities that overlap.** The probability of A or B is not simply the probability of A plus the probability of B if both can happen together.

**Treating vague words as precise.** "Likely" means different things to different people.

**Assuming independence.** Uncertainties that share a common cause, such as several suppliers affected by the same port strike, can fail together.

## What this means for business decisions

Thinking in probabilities improves everyday decisions:

- **State beliefs as numbers** when decisions matter. "I think there is a 30% chance we lose this customer this year" invites better discussion than "there's some risk".
- **Ask for distributions, not single forecasts.** What is the range, and what would a bad case look like?
- **Check base rates.** Before reacting to a signal, ask how common the underlying event is.
- **Update steadily.** Treat new evidence as a reason to adjust beliefs by an appropriate amount, neither ignoring it nor overreacting.
- **Look for common causes.** Risks that seem separate may move together.

### Calibration

A forecaster is **calibrated** if events they call 70% likely happen about 70% of the time. Calibration can be checked by recording forecasts and outcomes over time. Many people and organisations find that they are overconfident: events they call 90% likely happen much less often. Keeping a simple forecast log is one of the most practical ways to improve judgement.

## A worked illustration

This is an illustration, not a real business.

A small online retailer uses a fraud-screening tool that flags suspicious orders. The supplier says it catches 90% of fraudulent orders and wrongly flags only 3% of genuine ones. The retailer's records suggest about 1 in 200 orders (0.5%) is fraudulent.

Applying Bayes' rule: of every 10,000 orders, about 50 are fraudulent, of which 45 are flagged. Of the 9,950 genuine orders, about 299 are flagged. So of 344 flagged orders, only 45, or about 13%, are actually fraudulent.

```figure
type: stack
title: Orders flagged as fraud, per 10,000
unit: orders
caption: Only about 13% of flagged orders were fraudulent, so flagged orders now get a quick check instead of cancellation.
- *Fraudulent, flagged | 45
- Genuine, flagged | 299
```

The retailer had been cancelling every flagged order, losing many genuine customers. It changes its process: flagged orders receive a quick manual check, such as confirming the delivery address, before any cancellation. Lost genuine sales fall sharply, while fraud remains low.

## Questions to ask

- What is the base rate of the event I am trying to detect or predict?
- Am I confusing the probability of the evidence given the hypothesis with the probability of the hypothesis given the evidence?
- What does the full distribution look like, not just the average?
- Which uncertainties might share a common cause?
- For your own business: how calibrated are the forecasts your team makes?

## Bringing it together

Probability is a precise language for uncertainty. Treating it as a degree of belief lets decision makers reason about one-off situations as well as repeated ones. Distributions capture the full range of possibilities, joint and conditional probabilities show how uncertainties relate, and Bayes' rule shows exactly how evidence should change beliefs.

The worked examples show why intuition often fails, especially when the event being detected is rare. Stating beliefs as numbers, checking base rates, asking for distributions and updating steadily are simple habits that make decisions clearer and more consistent.

---

*Source: Mykel J. Kochenderfer, Tim A. Wheeler and Kyle H. Wray, Algorithms for Decision Making (MIT Press, 2022). Explanations are GoCore's own; figures in the examples are illustrations, not data. This article is general information, not professional advice.*
