---
book: fixtures-that-repeat
chapterSlug: separate-fixture-repeatability-from-measurement-noise
order: 7
title: "Separate fixture repeatability from measurement noise"
description: "Design a controlled reload trial, preserve operator and sequence information, and distinguish fixture behaviour from measurement variation and production capability."
draft: true
---

A trial should reveal what the fixture does repeatedly, including the conditions that make it behave differently. Measuring one carefully loaded part once establishes very little about that behaviour.

The measurement process also varies. If it is not examined, a fixture can be blamed for measurement noise or credited with repeatability that the gauge cannot resolve. Separate the questions before collecting a large table of numbers.

## Define the quantity and reference

For this illustration, measure the indicated x-position of a reference feature on one stable artefact relative to a defined fixture reference. Express readings as offsets in millimetres from that reference.

The artefact is reused so that part-to-part manufacturing variation does not dominate this first investigation. The exercise is static and conducted under an approved test method. It is not a cutting trial and does not demonstrate resistance to machining loads.

Record the artefact, measurement system, fixture revision, clamping method, temperature condition and sequence. State whether the instrument or reference is reset between readings. Resetting to each new loaded position would conceal the very movement the trial is intended to observe.

## Start without reloading

Take repeated readings without disturbing the artefact, using the intended measurement technique. This investigates short-term indication behaviour under that condition.

The invented readings are **0.000, 0.001, −0.001, 0.000, 0.001 and 0.000 mm**. Their mean is approximately **0.000167 mm**, and their sample standard deviation is approximately **0.000753 mm**.

These six observations are too few to characterise every measurement influence. They also do not include removal, re-seating, operator changes or longer-term drift. The result is a local diagnostic, not a complete uncertainty budget.

Check an appropriate reference before and after the study. A stable display can still have bias, and a changed reference can make a whole group of readings move together.

## Add the loading operation

Now remove and reload the same artefact using the proposed method, preserving each result in sequence. For Operator A, use the following invented offsets:

**0.002, −0.001, 0.003, 0.000, −0.002 and 0.001 mm.**

Their mean is **0.000500 mm**, sample standard deviation approximately **0.001871 mm**, and range **0.005 mm**.

The larger variation suggests that the combined reload-and-measure process behaves differently from repeated indication without disturbance. It does not isolate the fixture's variance automatically. Re-seating the measuring probe, changes in contact force and measurement alignment may also be involved.

Subtracting two small sample variances and calling the square root “true fixture repeatability” would require additional assumptions and a suitable study. Preserve the distinction between a useful exploratory comparison and a formal variance-component estimate.

## Introduce another operator deliberately

Suppose Operator B's six readings are each 0.008 mm higher than the corresponding A readings. Their mean is **0.008500 mm** with the same sample standard deviation of approximately 0.001871 mm.

Both operators have a narrow spread, yet their means differ by 0.008 mm. Investigate the method before adjusting the fixture. One operator may seat against a different contact, apply a different sequence or interpret the measurement reference differently.

The [NIST gauge R&R guidance](https://www.itl.nist.gov/div898/handbook/mpc/section4/mpc4.htm) treats repeatability and reproducibility as distinct aspects of a measurement study. The present small dataset illustrates why grouping matters; it is not a substitute for the appropriate formal study.

Use randomised or balanced sequences where useful so operator, time and fixture condition are not inseparable. If A always measures in the morning and B after the machine warms, the observed difference cannot be attributed to operator alone.

## Reproduce the descriptive calculation

```python
from statistics import mean, stdev

static = [0.000, 0.001, -0.001, 0.000, 0.001, 0.000]
a = [0.002, -0.001, 0.003, 0.000, -0.002, 0.001]
b = [value + 0.008 for value in a]

for label, values in [("static", static), ("A", a), ("B", b)]:
    print(label, f"{mean(values):.6f}",
          f"{stdev(values):.6f}", f"{max(values)-min(values):.6f}")
# static 0.000167 0.000753 0.002000
# A      0.000500 0.001871 0.005000
# B      0.008500 0.001871 0.005000
```

The calculation is intentionally modest. It reports what the invented data contain, without inferring a long-run reject rate or an unverified true position.

## Expand the trial to the intended conditions

After the exploratory method is understood, plan the relevant combinations of operators, repeated loads, part sizes, set-ups, cleaning states and time. Include the intended range of accepted incoming parts, not only a convenient master.

Test complete changeover as well as reloading in an undisturbed fixture. Removing and reinstalling the fixture can introduce a different reference-transfer error. A repeatable nest on a variable machine interface is not a repeatable overall process.

For machining qualification, measure the resulting product features using an appropriate independent method. A static artefact study cannot establish tool deflection, thermal drift during cutting or the behaviour of a partially machined part.

Keep adverse observations. A chip at a locating contact is evidence about cleaning and detection, even if removing it restores the result. Decide whether the condition is prevented, detected or merely hoped away.

## Use acceptance criteria chosen in advance

Allocate fixture variation from the product's functional requirements and complete error model. Do not adopt a universal percentage of tolerance without understanding the measurement and process.

State how the criterion is evaluated, including the treatment of measurement uncertainty and any required confidence. A maximum observed range from six trials is not a guaranteed bound for every future load.

For a real release, agree the study size and analysis with the responsible quality or metrology specialist. The more consequential the claim, the more important it is that the trial actually supports it.

The existing [production-readiness chapter](/reados/collections/product-development-and-launch/proving-a-process-is-ready-for-production/) explains the broader connection between measurement, stability and capability.

## Exercise: choose the right corrective action

Operator A and B show the same small within-group spread but a 0.008 mm difference in means. Should the fixture be adjusted halfway between them?

Not yet. First investigate whether the two methods establish the same physical reference and measurement condition. A halfway adjustment could leave both procedures wrong while making the pooled average look attractive.

A useful next step is a supervised, standardised reload and measurement sequence with preserved identities and balanced order. Record what changes and what remains. The next chapter converts the agreed method into instructions that survive ordinary production and changeover.
