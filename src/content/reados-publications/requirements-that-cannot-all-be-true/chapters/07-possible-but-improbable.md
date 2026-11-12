---
book: requirements-that-cannot-all-be-true
chapterSlug: possible-but-improbable
order: 7
title: "Possible but improbable: acceptance tests a good machine usually fails"
description: "How to recognise requirements that can be met but are rarely shown to be met, using the confidence bound on Cpk and a tolerance stack, and how to fix the test or the wording instead of the design."
draft: false
---

The last kind of conflict from Chapter 1 is the most easily mistaken for a fault in the machine. The requirement can be met. A machine can be built that meets it. But the way the requirement is tested, or the way it is worded, makes failure likely anyway. Andrea Weisberger's evidential form of argument is the model: the claim is not that the requirements contradict each other, but that the evidence will usually count against them.

This chapter examines two cases from the inspection station. The first is the acceptance test, R12, which a compliant axis would fail most of the time. The second is the clearance between the probe and the frame, which every frame must have but a few will not. In both, the fix lies in the test or the wording, not in the steel.

## The acceptance test as written

This is an illustration. R12 reads: "Acceptance: the axis shall be moved 30 times to 1,000 mm, the position measured each time, and the results shall show a process capability index Cpk of at least 1.67 at 95% confidence, against ±0.010 mm."

The capability index Cpk compares the distance from the mean to the nearer limit with three standard deviations. A Cpk of 1.67 means the nearer limit is five standard deviations from the mean. The words "at 95% confidence" mean that it is not enough for the 30 runs to show a Cpk of 1.67; the test must show that the true Cpk is at least 1.67, with 95% confidence. That requires the observed Cpk to be well above 1.67, because a sample of 30 estimates the standard deviation, and so Cpk, with considerable uncertainty.

## What a compliant axis would show

The [capability confidence check](/tools/capability-confidence-check/) in BIZOMAT Tools calculates Cp and Cpk from a sample's mean, standard deviation and specification limits, then the one-sided lower confidence bound on each, using the chi-square distribution for Cp and the normal approximation from the NIST/SEMATECH e-Handbook for Cpk. It also finds the sample size at which the same Cpk would be proven. Its limitations are stated: the process must be stable and roughly normal, and the Cpk bound is an approximation that NIST gives for samples of about 25 or more.

This is an illustration. Design C from Chapter 5 is built and tested in the builder's shop. Thirty runs to 1,000 mm give a mean error of +0.0015 mm and a standard deviation of 0.0016 mm. The engineer enters these with limits of −0.010 and +0.010 mm, 95% one-sided confidence and a requirement of 1.67.

```figure
type: stats
title: The 30-run acceptance test on design C
caption: This is an illustration. Results from the capability confidence check. The observed Cpk is above 1.67, but the lower confidence bound is well below it, so the test as written is failed.
- 2.083 | Cp from the sample | Spread alone, ignoring the offset
- 1.771 | Cpk from the sample | Above the 1.67 required
- * 1.375 | Lower 95% bound on Cpk | Below 1.67: not proven
- 448 | Runs needed at this Cpk | To prove 1.67 at 95% confidence
```

The axis has an observed Cpk of 1.771. The confidence bound is 1.375. The test fails, though nothing about the axis suggests it falls short of 1.67. The tool reports "not yet proven: more data needed" and estimates that about 448 runs would prove the requirement if the Cpk held at 1.771.

### How often a good axis would pass

The tool's result for one test raises a further question: how often would an axis whose true Cpk is 1.771 pass this test? The engineer answers it by simulation, generating 200,000 sets of 30 runs from a normal distribution with mean +0.0015 mm and standard deviation 0.0016 mm, computing the Cpk bound for each set as the tool does, and counting passes.

```figure
type: bars
title: Chance of passing the 30-run test, by the axis's true capability
unit: %
max: 100
caption: This is an illustration. Simulation of 200,000 tests for each axis, using the tool's bound. An axis truly at Cpk 1.771 passes about one test in eleven. Even an axis truly at Cpk 2.0 passes fewer than one in three.
- True Cpk 1.771 | 8.8
- True Cpk 2.0 | 29.7
```

An axis with a true Cpk of 1.771, comfortably better than 1.67, passes the test about 8.8% of the time. An axis with a true Cpk of 2.0 passes about 29.7% of the time. To pass reliably with 30 runs, the observed Cpk would need to be about 2.14 or more. The test, in effect, demands a much better machine than the requirement states.

## Where the conflict lies

The conflict is between the number of runs, the confidence and the capability. Each is reasonable. Together, they make passing improbable for any machine near the requirement. The machine is not the problem.

The engineer asks the customer's quality engineer what the test is for. The answer: to be confident, before paying, that the axis is capable to 1.67, because the customer's quality system requires 1.67 for measuring equipment. That purpose is entirely legitimate, and it does need confidence. What it does not need is 30 runs. On an automatic axis a run takes about 10 s, so 448 runs take about 75 minutes. The cheap fix is to change the number.

```figure
type: compare
title: Runs needed to prove Cpk 1.67 at 95%, by observed Cpk
cols: Cpk observed | Lower bound with 30 runs | Runs needed to prove 1.67
caption: This is an illustration. From the capability confidence check, mean +0.0015 mm. The better the axis, the fewer runs it needs; every case is quick on an automatic axis.
- Standard deviation 1.6 µm | 1.771 | 1.375 | 448
- Standard deviation 1.5 µm | 1.889 | 1.469 | 108
- Standard deviation 1.4 µm | 2.024 | 1.575 | 48
- * Standard deviation 1.3 µm | 2.179 | 1.698 | 27, so 30 suffices
```

The rewritten R12 sets the number of runs from the requirement, not the other way round: "Acceptance: at least 450 runs to each of three positions, the lower 95% confidence bound on Cpk to be at least 1.67 at each, the process shown to be stable over the runs." The confidence the customer wanted is preserved. The improbability is removed.

### Stability before capability

A longer test fixes the statistics but raises a new question, which the tool's limitations point to. A capability index describes a stable process. A 30-run test takes five minutes; a 450-run test takes over an hour, and three of them take most of a morning. In that time the axis warms, the workshop changes temperature and the probe's cable settles. If the positioning error drifts as the screw warms, the runs no longer come from one stable distribution, and the standard deviation of the whole set mixes a drift with the scatter. A capability index computed from them describes neither.

The engineer therefore writes three conditions into the test. First, the axis is warmed up by a stated programme of moves before the counted runs begin, so the test measures the working state, not the cold start. Second, the runs are plotted in time order on a control chart, and the capability is calculated only if the chart shows no trend or shift. Third, the workshop and beam temperatures are logged throughout, so that any drift can be traced to its cause.

The test is also run at three positions, near each end and at the middle of the travel, rather than only at 1,000 mm. A single position shows capability at that position. The requirement is accuracy over the full travel, and the error budget in Chapter 5 shows that the thermal term grows with the distance from the fixed end of the scale. A test at one position cannot support a claim about every position; a claim about every position needs evidence from more than one.

None of these conditions makes passing harder for a good axis. Each makes the result mean what the customer thinks it means. An acceptance test that a good machine usually fails is improbable; one that a drifting machine can pass by luck is worse, because it gives false assurance. The rewritten test is designed to avoid both.

### Do not fix it the other way

There is a tempting alternative: keep 30 runs and drop the confidence clause, accepting any observed Cpk of 1.67 or more. That makes the test easy to pass, but it gives up the customer's real purpose. A 30-run study with an observed Cpk of 1.67 has a 95% lower bound near 1.3, which would not satisfy the customer's own quality system. Fixing an improbable requirement by weakening it is the evidential version of Grim's redefinition: the words survive and the content goes. The right fix keeps the purpose and changes the test that measures it.

## The second case: a clearance every frame must have

This is an illustration. The probe must start each frame between 4 and 6 mm above the frame's top surface, the range of its vertical search. If it starts lower, it may strike the frame; if higher, it may not reach. The request says every frame must be measured "without adjusting the probe height". The clearance is set by a chain of dimensions: the uprights, the beam and rail, the probe head, the fixture and the frame itself.

The [tolerance stack design tool](/tools/tolerance-stack-design/) in BIZOMAT Tools calculates a one-dimensional stack of up to six dimensions with symmetric tolerances: the nominal gap, its worst-case limits, its root-sum-square limits, the statistical spread of the gap from each dimension's process capability index Cp, the predicted share of assemblies outside the required gap assuming centred normal distributions, and the largest contributor. Its limitations are stated: a linear stack with symmetric tolerances; geometric tolerances and non-linear stacks need more; and real processes drift.

The engineer enters five dimensions: upright height 850 ± 0.15 mm and beam and rail height 165 ± 0.10 mm, which add to the gap; probe head length 210 ± 0.05 mm, fixture height 300 ± 0.10 mm and frame height 500 ± 0.80 mm, which subtract from it. The frames are welded, so their height tolerance is wide. She takes Cp as 1.0 for all dimensions, a cautious value for the frames.

```figure
type: range
title: Probe clearance against the 4 to 6 mm search range
min: 3.5
max: 6.5
unit: mm
ticks: 3.5 | 4.0 | 4.5 | 5.0 | 5.5 | 6.0 | 6.5
caption: This is an illustration. From the tolerance stack design tool. The worst case runs outside the search range at both ends; the root-sum-square range sits inside it. The tool predicts 0.0289% of frames outside, about one in 3,460.
- Search range required | 4.0 | 6.0
- Worst-case clearance | 3.8 | 6.2
- * Root-sum-square clearance | 4.172 | 5.828
```

The nominal gap is 5.0 mm. The worst case runs from 3.8 to 6.2 mm, outside the search range, so "every frame without adjustment" cannot be guaranteed. The root-sum-square range, 4.172 to 5.828 mm, is inside it, and the tool predicts 0.0289% of frames outside, with the frame height the largest contributor by far. At 6,000 frames a year, that is about 1.7 frames.

### Possible, improbable and cheap to handle

"Every frame" is not impossible for any one frame; it is improbable for every frame over years of production. The question is what to do about one or two frames a year. Tightening the frame height tolerance would fix it, at a cost on every frame. A far cheaper option is to let the probe's vertical search extend automatically when it finds nothing in the normal range, with a slow approach to protect it. The extended search costs a few lines of control program and a few seconds on the rare frame that needs it, against a tighter welding tolerance on all 6,000 frames a year. It also logs each event, so a rising count tells the customer that its frame heights are drifting before any frame is scrapped. The rewritten requirement replaces "every frame without adjustment" with: "Frames within drawing tolerance measured without manual adjustment; an automatic extended search for frames outside the probe's normal range, with the event logged."

## The failure case: a first article study nobody could pass

This is an illustration. The machine builder was on the receiving end of an improbable test the year before. A customer required its machined brackets to show a Cpk of at least 1.33 at 95% confidence from a 20-part first article study. The builder's process was good: its long-run records showed a Cpk near 1.6. The 20-part study gave an observed Cpk of 1.603, and the lower bound fell well short of 1.33. The parts were rejected, re-made and re-measured twice, with similar results, before anyone calculated what the study could show.

### How it is detected and corrected

The failure is detected before the contract by asking, of every acceptance test: if the item met the requirement exactly, or a little better, how often would it pass? A capability confidence check on the expected result, or a quick simulation, answers that in minutes. The correction is to set the sample size from the requirement and the confidence, or to agree in advance to use the supplier's long-run data where it exists. In that case the customer accepted the long-run records once they were shown the arithmetic, and the dispute ended.

## Exercise: the 20-part study

Using the capability confidence check, take a 20-part study with a mean of 10.000 mm, a standard deviation of 0.0104 mm and limits of 9.95 and 10.05 mm, against a requirement of Cpk 1.33 at 95% confidence.

1. What are the observed Cpk and its lower bound? Is the requirement proven?
2. What does the tool say about the sample size, and what would you propose?

**Worked answer.**

1. The tool gives an observed Cp and Cpk of 1.603, since the mean is centred, and a lower 95% bound on Cpk of 1.158. That is below 1.33, so the requirement is not proven, though the observed value is well above it.
2. The tool warns that with fewer than 25 parts its Cpk bound approximation is not reliable, and estimates that about 52 parts would prove the requirement if the Cpk held at 1.603. Propose a study of at least 52 parts, or more to allow for some variation in the result, with a control chart to show stability. If the customer is limited to 20 parts for cost reasons, propose using the supplier's long-run process data for the capability claim and the 20 parts as a check that the first article matches it.
