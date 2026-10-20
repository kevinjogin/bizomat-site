---
book: fits-that-work
chapterSlug: make-a-pilot-answer-the-right-question
order: 8
title: "Make a pilot answer the right question"
description: "Plan a dimensional pilot, retain sequence and context, distinguish process shifts from measurement effects and report capability claims with their limits."
draft: false
---

A pilot can establish that the proposed process makes acceptable parts under the conditions actually exercised. It can also reveal failure mechanisms that a calculation omitted. It cannot establish every future operating condition simply because all of its samples passed.

Design the pilot around unresolved questions. For Revision B, these include whether the housing span is controllable, whether the assembled gap agrees with the model, and whether set-up or measurement changes produce a meaningful shift.

## Separate three investigations

First, investigate the measurement process. Can the method distinguish changes small enough to affect the decision? Does removing and replacing the assembly change the result? Do operators reproduce the reference condition? A calibration certificate alone does not answer those questions.

Second, investigate the manufacturing process. What happens across the intended operating period, tool condition, material batches and set-ups? Record the sequence so a drift or step change can be seen.

Third, investigate the product model. Do measured assembly results agree with predicted results from the component dimensions and conditions? A residual can reveal an omitted contact or geometric effect, but it can also arise from measurement uncertainty.

The [NIST gauge-study guidance](https://www.itl.nist.gov/div898/handbook/mpc/section4/mpc4.htm) separates repeatability, reproducibility and other measurement influences. Use a study design appropriate to the decision; a short reload exercise is useful investigation but should not be labelled a complete gauge R&R approval.

## Retain the context of every observation

Record assembly and component identifiers, drawing revisions, time, machine or fixture state, operator, measurement method and relevant temperatures. Keep raw results as well as corrected results. If a part was reworked, preserve that history.

Do not combine development parts made under exceptional attention with routine production and report one undifferentiated population. Both sets can be useful, but they answer different questions.

Plan how to investigate a failure before the trial begins. Quarantine the affected item, preserve its condition where practical, check the measurement method and trace the input dimensions. Replacing a failed observation with a passing remeasurement without explanation destroys evidence.

## Read the sequence before summarising it

This is an illustration. Ten invented gap observations are taken at the reference condition. A documented set-up change occurs between observations five and six.

| Observation | Gap, mm | Context |
|---:|---:|---|
| 1 | 1.974 | Set-up A |
| 2 | 1.976 | Set-up A |
| 3 | 1.978 | Set-up A |
| 4 | 1.976 | Set-up A |
| 5 | 1.976 | Set-up A |
| 6 | 1.990 | Set-up B |
| 7 | 1.992 | Set-up B |
| 8 | 1.994 | Set-up B |
| 9 | 1.992 | Set-up B |
| 10 | 1.992 | Set-up B |

The first group's mean is **1.976 mm**, and the second's is **1.992 mm**. The difference is **0.016 mm**. The overall mean is **1.984 mm**.

Every indicated result lies comfortably within the gap limits. That does not make the shift irrelevant. It is comparable with margins being discussed elsewhere in the design. Investigate whether the shift follows manufacturing, assembly seating, measurement set-up or another changed condition.

The sample standard deviation of all ten readings is approximately **0.008538 mm**. Within each five-reading group it is approximately **0.001414 mm**. Neither number alone explains the process. Pooling has mixed a between-group difference with within-group scatter.

## Use a small calculation to make the grouping visible

The following code reproduces the descriptive statistics. It deliberately makes no capability or normality claim:

```python
from statistics import mean, stdev

a = [1.974, 1.976, 1.978, 1.976, 1.976]
b = [1.990, 1.992, 1.994, 1.992, 1.992]
for label, data in [("A", a), ("B", b), ("all", a + b)]:
    print(label, f"{mean(data):.6f}", f"{stdev(data):.6f}")
# A   1.976000 0.001414
# B   1.992000 0.001414
# all 1.984000 0.008538
```

Retaining the labels is essential. A sorted list of dimensions would erase the sequence and make the step less visible. Good analysis begins with preserving how the observations were produced.

## Keep capability conditional on its assumptions

For an appropriately stable process, a conventional capability calculation compares a specification width with process spread. [NIST's capability discussion](https://itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm) explains the role of stability and distribution assumptions. An index calculated from an unsuitable dataset can be numerically correct and operationally misleading.

As a separate arithmetic example, assume a stable normal gap process with mean 1.99 mm and standard deviation 0.02 mm. For limits 1.85 and 2.15 mm:

**Cp = (2.15 − 1.85) / (6 × 0.02) = 2.50.**

**Cpk = min[(2.15 − 1.99) / 0.06, (1.99 − 1.85) / 0.06] = 2.333**, approximately.

These figures belong to an assumed population, not to the ten-point pilot. No universal acceptance threshold is imposed here. The required evidence and acceptance criterion depend on the product, contract and consequence.

## Report what zero failures means

Ten satisfactory parts do not prove a negligible failure probability. Under an independent, representative Bernoulli model with constant failure probability p, the probability of seeing zero failures in n trials is **(1 − p)ⁿ**.

For zero failures in ten trials, a one-sided 95% upper confidence bound obtained from that model is **1 − 0.05^(1/10) ≈ 25.9%**. This is not a prediction that the process fails at that rate. It shows how weak a small zero-failure sample is as evidence for a very low rate.

If observations are not independent or the trial excludes difficult conditions, even that model may be inappropriate. Use sample planning tied to the claim you need, rather than choosing a convenient number and describing the resulting confidence afterwards.

## Exercise: choose the next investigation

Given the two-group dataset, propose one experiment that helps distinguish a measurement-set-up shift from a manufacturing shift.

One useful response is to preserve several assemblies from both groups and remeasure them in a controlled, randomised sequence with the same verified measurement set-up, while retaining their identities. If the group difference persists, investigate the product and manufacturing conditions; if it changes with the measurement set-up, investigate that method. Neither outcome alone identifies the root cause.

The pilot should end with supported conclusions and named open questions. The next chapter ensures those conclusions remain attached to the correct revisions and component populations.
