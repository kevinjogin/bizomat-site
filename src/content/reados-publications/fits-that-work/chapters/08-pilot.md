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

## Arrange the measurements so causes can be separated

How a pilot is sequenced decides what its data can reveal. If every Set-up A assembly is measured in the morning and every Set-up B assembly in the afternoon, a difference between the groups could come from the set-up, the room warming during the day, a gauge drifting, or a change of operator. The data cannot tell them apart, because each possible cause changed at the same moment.

Two simple habits help. **Randomise** the order in which assemblies are measured, so that time-related effects spread across groups instead of lining up with one of them. And **block** deliberately on the factors you want to compare: build and measure some assemblies from each set-up within the same session, by the same operator, with the same gauge. If a difference persists under those conditions, the set-up becomes a much stronger suspect.

This planning costs nothing but thought before the pilot starts. Trying to separate confounded causes afterwards usually costs another pilot.

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

```figure
type: line
title: Ten pilot gaps, in sequence
x: Observation
y: Gap (mm)
ymin: 1.97
ymax: 2.0
caption: Two set-ups 0.016 mm apart: pooled, the standard deviation is about 0.0085 mm; within each set-up, about 0.0014 mm.
legend: Measured gap
- 1 | 1.974
- 2 | 1.976
- 3 | 1.978
- 4 | 1.976
- 5 | 1.976
- 6 | 1.99
- 7 | 1.992
- 8 | 1.994
- 9 | 1.992
- 10 | 1.992
```

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

## Record values, not only verdicts

A gap recorded as "pass" carries one bit of information. A gap recorded as 1.976 mm carries far more: where the process sits, how it moves between set-ups, and how close it comes to each limit. The ten-observation dataset above revealed a 0.016 mm step between set-ups only because the values were kept. As pass/fail records, all ten would have looked identical.

The same applies to components. Measuring and recording the housing span, cartridge and spacer for each pilot assembly costs little more than checking them against limits, and it makes the comparison with the model in the next section possible. Agree with suppliers before the pilot that measured values, not certificates of conformity alone, will accompany the pilot parts.

## Compare each assembly with its own prediction

When component dimensions are recorded for each assembly, the model can be tested assembly by assembly. This is an illustration. One pilot assembly has a measured housing span of 59.985 mm, cartridge of 51.998 mm and spacer of 6.004 mm. The model predicts:

**G = 59.985 − 51.998 − 6.004 = 1.983 mm**

The measured gap is 1.976 mm, so the residual, measured minus predicted, is **−0.007 mm**.

Is that a sign of an omitted effect? Not on its own. The direct gap measurement has an expanded uncertainty of about 0.0081 mm and the calculated value about 0.0075 mm, from Chapter 6. Combining them gives an expanded uncertainty for the difference of about 0.011 mm, so a single residual of −0.007 mm is well within what measurement alone could produce.

The pattern across many assemblies tells more than any one. If residuals scatter around zero, the model is consistent with the evidence. If they are consistently negative, the assemblies are seating tighter than the component measurements suggest, which points to burrs, high spots or a contact the model omits, as Chapter 5 described. A consistent residual of a few thousandths of a millimetre is invisible in individual results and obvious in a column of differences.

## Include the conditions that matter most

A pilot built and measured entirely at room temperature tests only the reference state. The thermal analysis of Chapter 4 identified the hot uniform state, a hot housing and hot internal parts as the cases that consume the margins. A small number of pilot assemblies taken through those conditions, with the gap or a proxy for it measured hot, tests the part of the model that carries the most assumption.

Not every condition can be reproduced in a pilot. Where a condition is left out, the pilot report should say so, and the open question should remain on the list for later evidence, such as a field trial with temperature logging. A pilot that tests only the easy conditions and reports success invites the reader to believe more than it showed.

## Keep capability conditional on its assumptions

For an appropriately stable process, a conventional capability calculation compares a specification width with process spread. [NIST's capability discussion](https://itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm) explains the role of stability and distribution assumptions. An index calculated from an unsuitable dataset can be numerically correct and operationally misleading.

As a separate arithmetic example, assume a stable normal gap process with mean 1.99 mm and standard deviation 0.02 mm. For limits 1.85 and 2.15 mm:

**Cp = (2.15 − 1.85) / (6 × 0.02) = 2.50.**

**Cpk = min[(2.15 − 1.99) / 0.06, (1.99 − 1.85) / 0.06] = 2.333**, approximately.

These figures belong to an assumed population, not to the ten-point pilot. No universal acceptance threshold is imposed here. The required evidence and acceptance criterion depend on the product, contract and consequence.

## Report what zero failures means

Ten satisfactory parts do not prove a negligible failure probability. Under an independent, representative Bernoulli model with constant failure probability p, the probability of seeing zero failures in n trials is **(1 − p)ⁿ**.

For zero failures in ten trials, a one-sided 95% upper confidence bound obtained from that model is **1 − 0.05^(1/10) ≈ 25.9%**. This is not a prediction that the process fails at that rate. It shows how weak a small zero-failure sample is as evidence for a very low rate.

```figure
type: stats
title: What ten good pilot parts can show
caption: Capability indices hold only under their assumptions, and zero failures in ten trials is weak evidence.
- 0 of 10 | Failures | in the pilot
- *Up to 25.9% | Failure rate still possible | one-sided 95% bound
- 2.50 / 2.33 | Cp and Cpk | under an assumed model
```

If observations are not independent or the trial excludes difficult conditions, even that model may be inappropriate. Use sample planning tied to the claim you need, rather than choosing a convenient number and describing the resulting confidence afterwards.

## Size the pilot from the claim, not the calendar

The zero-failure calculation can be turned around to show how many trials a claim would need. Under the same independent, representative model, demonstrating with 95% confidence that the failure probability is below p, with no failures observed, needs about:

**n = ln(0.05) / ln(1 − p)**

which is close to 3 / p for small p.

```figure
type: compare
title: Zero-failure trials needed for a 95% upper bound
cols: Trials with no failures | Rule of thumb, 3 ÷ p
caption: Pass/fail evidence for low failure rates needs large samples. Measured values usually answer the question with far fewer parts.
- Below 5% | 59 | 60
- Below 1% | 299 | 300
- *Below 0.1% | 2,995 | 3,000
```

A pilot of ten or twenty assemblies cannot support a claim of one in a thousand by pass/fail counting, however carefully it is run. That is not a reason to build three thousand pilot assemblies. It is a reason to collect measured values instead of pass/fail results, and to use them, with stated assumptions, to estimate how close the process runs to its limits.

## Decide in advance what would stop or change the pilot

Before the first part is made, write down what results would lead to stopping, investigating or changing the plan. Examples include any gap outside the hold limits of the decision rule, a residual pattern beyond an agreed size, a step change between set-ups larger than a stated amount, or a measurement check failing. Agreeing these criteria in advance prevents two opposite errors: continuing through a clear warning because the schedule demands it, and abandoning a sound process because of one surprising result that later proves to be a measurement error.

## Write the pilot report for the release decision

The pilot report feeds the release decision of Chapter 10, so it should be organised around the questions that decision must answer. A useful structure is:

1. **What was built:** revisions, quantities, process routes, set-ups and dates.
2. **What was measured, and how:** methods, instruments, conditions and uncertainty.
3. **What was found:** the data, the grouping by set-up, the residuals against the model, and any failures with their investigation.
4. **What the evidence supports:** stated as carefully scoped conclusions.
5. **What remains open:** conditions not tested, assumptions not yet supported, and who owns each.

Raw data belong in an appendix or linked record, not only in summary charts. A reviewer who doubts a conclusion should be able to recalculate it.

## Keep some pilot assemblies

When the pilot ends, keep a few assemblies and components from each group, identified and stored with their records. They become reference samples. If a later production problem appears, the retained parts can be remeasured with the same method, compared with new parts, or sectioned to examine contact faces. A retained pilot assembly that measured 1.976 mm and still measures 1.976 mm a year later also confirms that the measurement method has not drifted, which no certificate can show as directly.

## Exercise: choose the next investigation

Given the two-group dataset, propose one experiment that helps distinguish a measurement-set-up shift from a manufacturing shift.

One useful response is to preserve several assemblies from both groups and remeasure them in a controlled, randomised sequence with the same verified measurement set-up, while retaining their identities. If the group difference persists, investigate the product and manufacturing conditions; if it changes with the measurement set-up, investigate that method. Neither outcome alone identifies the root cause.

The pilot should end with supported conclusions and named open questions. The next chapter ensures those conclusions remain attached to the correct revisions and component populations.
