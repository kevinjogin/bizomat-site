---
book: fixtures-that-repeat
chapterSlug: separate-fixture-repeatability-from-measurement-noise
order: 7
title: "Separate fixture repeatability from measurement noise"
description: "Design a controlled reload trial, preserve operator and sequence information, and distinguish fixture behaviour from measurement variation and production capability."
draft: false
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

```figure
type: stats
title: Adding the loading operation to the study
caption: Reloading adds variation that a measure-only repeat cannot reveal.
- 0.00075 mm | Standard deviation | measured repeatedly, no reload
- *0.00187 mm | Standard deviation | reloaded each time
- 0.005 mm | Range | reloaded each time
```

The larger variation suggests that the combined reload-and-measure process behaves differently from repeated indication without disturbance. It does not isolate the fixture's variance automatically. Re-seating the measuring probe, changes in contact force and measurement alignment may also be involved.

Subtracting two small sample variances and calling the square root “true fixture repeatability” would require additional assumptions and a suitable study. Preserve the distinction between a useful exploratory comparison and a formal variance-component estimate.

## Introduce another operator deliberately

Suppose Operator B's six readings are each 0.008 mm higher than the corresponding A readings. Their mean is **0.008500 mm** with the same sample standard deviation of approximately 0.001871 mm.

```figure
type: line
title: Six reloads, three conditions
x: Reading
y: Deviation (mm)
ymin: -0.004
ymax: 0.012
caption: Operator B has the same spread as A but sits 0.008 mm higher: a systematic difference to investigate.
legend: No reloading | Reloaded by A | Reloaded by B
- 1 | 0 | 0.002 | 0.01
- 2 | 0.001 | -0.001 | 0.007
- 3 | -0.001 | 0.003 | 0.011
- 4 | 0 | 0 | 0.008
- 5 | 0.001 | -0.002 | 0.006
- 6 | 0 | 0.001 | 0.009
```

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

## Plan the trial as a small matrix

Once the exploratory study has shown how the method behaves, the full trial should cover the conditions production will meet, in an order that keeps their effects separable. For the bracket, a modest plan might combine:

- **Two operators**, each following the written method.
- **Two blank conditions**: blanks near the thinnest and thickest accepted sizes, since Chapter 4 showed that clamp behaviour depends on part height.
- **Five loads** of each combination, giving twenty loads in all.

```figure
type: compare
title: A twenty-load trial plan for the bracket fixture
cols: Thin blanks | Thick blanks
caption: Five loads in each cell, run in a randomised order with every result labelled by operator, blank and sequence.
- Operator A | 5 loads | 5 loads
- *Operator B | 5 loads | 5 loads
```

Run the twenty loads in a randomised order rather than all of A's first and all of B's afterwards, and label each result with its operator, blank and position in the sequence. Then the analysis can compare operators within the same blank size, blank sizes within the same operator, and early loads with late ones. Twenty loads is not a capability study, but it is enough to reveal a large effect from any of these factors, and it costs little more than twenty unplanned loads.

## Agree the stopping rules before starting

Decide before the first load what would pause the trial. Sensible rules include any sign of collision or contact between tool and fixture, any part found unseated after clamping, a result outside a stated investigation limit, or a failed reference check on the measuring equipment. Agreeing them in advance protects the trial from two opposite pressures: pressing on through a clear warning to finish on schedule, and abandoning a sound fixture over one surprising result that turns out to be a measurement slip.

When a stopping rule is triggered, record the condition, investigate it, and record the outcome before continuing. A trial that pauses, finds a burr on the end stop, and adds a deburring check to the method has produced exactly the kind of evidence it was designed to find.

## Measure the parts the fixture actually makes

The artefact study shows how the location repeats. The machined parts show whether the whole operation, cutting forces, deflection, heat and all, produces the features the drawing requires. Both are needed, and the second cannot be inferred from the first.

Measure the first machined brackets on an independent method, such as a coordinate measuring machine, against the features the fixture was designed to control. Compare the results with what the earlier chapters predicted. If the static reload study showed a spread of a few thousandths of a millimetre but machined feature positions vary by several hundredths, something in the cutting process, not the location, dominates: deflection under load, thermal drift or a part that springs after release. The difference between the two studies is itself the most useful diagnostic the trial provides.

## Look for patterns in time

A range or standard deviation summarises a set of results but hides their order. Plot the trial results in the order they were made. Common patterns include:

- **A drift through the session**, which often follows warming of the machine, fixture or coolant, as Chapter 5 described.
- **A step after an event**, such as cleaning, a tool change or a different operator taking over.
- **One outlying result**, which may point to a chip, a burr or a missed seating step on that load.

Each pattern suggests a different response. A drift calls for a warm-up routine or a temperature control; a step calls for a look at what changed at that point; an outlier calls for an investigation of that specific load. All three are invisible in a single summary number.

## Try to make it fail, deliberately and safely

A trial that only confirms the fixture works when loaded correctly leaves out the conditions most likely to cause scrap. Within the site's approved procedures, and with the machine in a safe state, test the foreseeable mistakes:

- **Wrong orientation:** does the foolproofing from Chapter 2 actually prevent the part from seating?
- **A missed clamp or an unclamped part:** is there anything that makes it obvious before the cycle starts?
- **Debris at a contact:** how large a chip under a locator changes the result, and would the cleaning and checking steps find it?
- **A blank at the edge of the incoming range:** does it load, seat and clamp as the method expects?

Record what happens in each case. The results show which mistakes the design prevents, which the method detects, and which rely only on the operator's attention. That last group is the one to reduce before production.

## Involve the people who will run it

The trial should be run, at least in part, by the operators who will use the fixture in production, following the draft instructions rather than the designer's personal method. The designer knows which contact matters and how firmly to seat the part; a production operator knows only what the fixture and the instruction tell them. Differences between the designer's results and the operators' results, like the 0.008 mm offset between Operators A and B above, are signals that the fixture or instruction is not yet self-explanatory.

Ask the operators what was awkward, unclear or slow, and record their comments alongside the measurements. Small changes made at this stage, such as a sight line to a contact, a clearer mark on a clamp, or a reordered step, often improve repeatability more than any change to the locators.

## Use acceptance criteria chosen in advance

Allocate fixture variation from the product's functional requirements and complete error model. Do not adopt a universal percentage of tolerance without understanding the measurement and process.

State how the criterion is evaluated, including the treatment of measurement uncertainty and any required confidence. A maximum observed range from six trials is not a guaranteed bound for every future load.

For a real release, agree the study size and analysis with the responsible quality or metrology specialist. The more consequential the claim, the more important it is that the trial actually supports it.

The existing [production-readiness chapter](/reados/collections/product-development-and-launch/proving-a-process-is-ready-for-production/) explains the broader connection between measurement, stability and capability.

## Time the real cycle

The 134-second cycle in Chapter 6 was an assumption. The trial is the first chance to measure it. Time each element of the cycle for several loads by each operator, including the occasional tasks such as cleaning the locators, and compare the measured values with the assumed ones.

Differences are informative. If loading takes 50 seconds instead of the assumed 35, the business case changes and the loading method may need attention. If inspection takes longer than expected, the inspection plan may need a gauge rather than a general instrument. The measured times, not the assumptions, should go forward into the qualification record and the economic review.

## Write the trial record as evidence

The trial record should let someone who was not there understand what was tested and judge the conclusions. It should include the fixture, program and tool revisions; the artefact and parts used; the measurement methods and their checks; every result in sequence with its labels; the failure-mode tests and their outcomes; the measured cycle times; and the conclusions, each stated with the conditions it covers. Results that were excluded, such as a load disturbed by an interruption, should stay in the record with the reason for excluding them.

Keep a few of the trial parts and the artefact, labelled with their results. They become references for later questions: a production part that measures differently can be compared directly with a trial part measured on the same instrument, and remeasuring the artefact after months of use shows whether the fixture has changed or the measurement has.

## Exercise: choose the right corrective action

Operator A and B show the same small within-group spread but a 0.008 mm difference in means. Should the fixture be adjusted halfway between them?

Not yet. First investigate whether the two methods establish the same physical reference and measurement condition. A halfway adjustment could leave both procedures wrong while making the pooled average look attractive.

A useful next step is a supervised, standardised reload and measurement sequence with preserved identities and balanced order. Record what changes and what remains. The next chapter converts the agreed method into instructions that survive ordinary production and changeover.
