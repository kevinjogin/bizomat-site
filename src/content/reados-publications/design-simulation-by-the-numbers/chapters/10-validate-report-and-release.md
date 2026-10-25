---
book: design-simulation-by-the-numbers
chapterSlug: validate-report-and-release
order: 10
title: "Validate, report and release with a defined scope"
description: "Compare predictions with strain, deflection and tap tests against limits set in advance, avoid tuning the model to fit, and write a report a reviewer can check."
draft: false
---

Verification asks whether the model solves its equations correctly: units, loads, restraints, mesh and benchmarks. Chapters 2 to 8 were largely verification. Validation asks a different question: does the model represent the real bracket on the real conveyor well enough for the decision? Only a comparison with physical evidence can answer that, and the comparison is only meaningful if its rules were set before the measurements were taken.

This final chapter tests the first Revision B bracket, compares the results with the predictions, resolves a disagreement without fudging the model and assembles the report that supports the release decision.

## Plan the test before the parts arrive

The analysis plan from Chapter 1 named a validation test: strain gauges and a tap test on the first article. Before the bracket is made, the plan is expanded to say exactly what will be measured, where, under which load and what agreement is acceptable.

This is an illustration. The test plan for Revision B contains three measurements:

1. **Bending strain.** A single strain gauge on the top face of the arm, 20 mm from the root and on its centreline, aligned with the arm. A 50 kg test mass hung at the load point applies **50 × 9.81 = 490.5 N**. Acceptable agreement: within 10% of prediction.
2. **Tip deflection.** A dial indicator under the load point, zeroed before the mass is hung. Acceptable agreement: within 20%, a wider band because the frame's flexibility was not modelled.
3. **First natural frequency.** A tap test with an accelerometer on the end plate and the motor fitted, the bracket bolted to the actual conveyor frame. Acceptable result: above 48 Hz, with a value below 70 Hz prompting a review.

Setting the limits beforehand prevents the most common validation failure, which is deciding after the event that whatever agreement was achieved was good enough. The wider band for deflection is also deliberate and explained, so a reviewer can see why it differs from the strain band.

## Predict the test results

The test load is not the design load, so the predictions must be scaled. The model is linear in the arm, so its results scale with load.

- Bending stress at the gauge: the converged model gave 11.72 MPa under 628 N, so under 490.5 N it is **11.72 × 490.5 / 628 ≈ 9.15 MPa**. With E = 200,000 MPa, the strain is **9.15 / 200,000 ≈ 45.8 microstrain**.
- Tip deflection: the model gave 0.0612 mm under 628 N, so under 490.5 N it is **0.0612 × 490.5 / 628 ≈ 0.048 mm**, with the frame treated as rigid.
- First natural frequency: 88.9 Hz, with the frame treated as rigid.

## Compare the results with the limits

The bracket is welded, galvanised, bolted to the conveyor with the motor fitted and tested.

```figure
type: compare
title: First article test results against predictions
cols: Predicted | Measured | Difference | Limit | Result
caption: Teaching values. The strain agrees closely. The deflection and frequency both point to a frame that is more flexible than the rigid assumption.
- *Bending strain at gauge | 45.8 µε | 44.0 µε | −3.9% | ±10% | Within limit
- Tip deflection, 490.5 N | 0.048 mm | 0.055 mm | +15% | ±20% | Within limit
- First natural frequency | 88.9 Hz | 82 Hz | −7.8% | Above 48 Hz | Passes; above 70 Hz review level
```

The strain agrees within 4%, inside its 10% limit. That confirms the bending stress in the arm, which depends only on equilibrium and the section, and it confirms the gauge installation. The deflection and frequency also meet their criteria, but both differ from prediction in the direction that a flexible frame would cause: more deflection and a lower frequency.

## Explain the disagreement physically

The two discrepancies are consistent with each other, which is good evidence that they share a cause. If the frame adds flexibility in series with the bracket, the combined stiffness falls by some ratio, the frequency falls by the square root of that ratio and the deflection rises by the full ratio.

From the frequencies, the stiffness ratio is **(88.9 / 82)² ≈ 1.175**: the real system is about 17.5% more flexible than the model. Applying that to the predicted deflection gives **0.048 × 1.175 ≈ 0.056 mm**, within about 2% of the measured 0.055 mm. One physical explanation, a frame adding about 17.5% to the flexibility, accounts for both measurements.

The strain gauge is unaffected by frame flexibility, because the bending moment in the arm depends only on the load and its distance, not on how stiff the support is. Its close agreement is therefore exactly what the explanation predicts. The sensitivity study in Chapter 8 anticipated a result like this; a 20% frame contribution was one of the cases tabulated, at 81.2 Hz.

To confirm the explanation independently, the analyst models the conveyor frame's channel from its drawings, extending the model about one metre either side of the bracket, without adjusting anything to match the test. The extended model predicts a first frequency of 83.4 Hz, within about 1.7% of the measured 82 Hz.

## A failure case: tuning the model to fit

This is an illustration of what not to do. A different analyst, faced with a predicted 88.9 Hz and a measured 82 Hz, reduces the steel's modulus in the model from 200,000 to 170,000 MPa. The frequency falls in proportion to the square root of the modulus, to about **88.9 × √(170 / 200) ≈ 82.0 Hz**, and the analyst reports the model as validated.

The strain gauge exposes the fudge. The arm is statically determinate, so the stress at the gauge under 490.5 N is still 9.15 MPa whatever the modulus. With a modulus of 170,000 MPa, the predicted strain becomes **9.15 / 170,000 ≈ 53.8 microstrain**, about 22% above the measured 44.0. The tuned model now disagrees with the one measurement that was in perfect agreement before.

Tuning a well-known property to match a test hides the real cause, which here is the unmodelled frame, and makes the model wrong in every situation the tuning did not cover. It also destroys the test's value as independent evidence. The legitimate response is to add the missing physics, as the extended frame model did, and to report the original disagreement honestly.

## Measure the start-up torque as well

The motion study in Chapter 9 predicted a peak mounting moment of 121 N·m at start-up, and the plan accepted the rigid-body result on the basis that the belt is tensioned before each start. A short measurement can check both the value and the assumption. Two strain gauges bonded on a side wall of the arm at ±45° to its axis respond to the shear strain from torsion while cancelling the bending strain, if they are wired as a half bridge.

The prediction follows from Chapter 2. A torque of 121 N·m produces a shear stress of about **5.93 × 121 / 120 ≈ 5.98 MPa** in the wall. The shear modulus of steel is **E / (2 × (1 + ν)) = 200,000 / 2.6 ≈ 76,900 MPa**, so the shear strain is about **5.98 / 76,900 ≈ 77.7 microstrain**, and each 45° gauge reads half of that, about ±38.8 microstrain.

```figure
type: stats
title: Start-up torque measured on the first article
caption: Teaching values. The measured peak is about 5% below the motion study's prediction and shows no snatch from belt slack.
- 121 N·m | Predicted peak mounting moment | Motion study, Chapter 9
- ±38.8 µε | Predicted 45° gauge reading | From 5.98 MPa shear stress
- *±37.0 µε | Measured peak over ten starts | Highest of ten
- 115 N·m | Torque implied by the measurement | 121 × 37.0 / 38.8
```

Over ten starts, the highest peak reading is ±37.0 microstrain, implying a torque of about **121 × 37.0 / 38.8 ≈ 115 N·m**. The trace rises smoothly with no sharp spike, which supports the assumption that the tensioned belt does not snatch. The measured torque is about 5% below the prediction, so LC4's value of 120 N·m remains a reasonable, slightly conservative design input.

Ten starts is a small sample. It cannot show the rare start when the belt has been slackened for maintenance and retensioned poorly, or the start with a jammed product on the belt. The report says so and recommends that the maintenance instruction include the belt tension check, which keeps the measured behaviour representative.

## Record the test as carefully as the model

The test record needs the same traceability as the model: the bracket's serial number and revision, the gauge type and position, the instrument calibration, the test mass and its verification, the temperature, the bolt tightening record and the raw readings, not only the averages. Photographs of the gauge positions are cheap and remove arguments about where a gauge really was.

A test record without that detail cannot support a release. If the strain had disagreed by 30%, the first question would have been whether the gauge was in the planned position and correctly aligned; without photographs and measurements of its position, nobody could answer.

## Match the evidence to the consequence

Validation is expensive, and not every simulation needs it. Published approaches to model credibility, NASA's standard for models and simulations among them, scale the evidence required to the consequence of a wrong decision. A bracket whose failure would cause downtime and a possible injury from a falling motor justifies a strain gauge and a tap test on the first article. A cosmetic cover would not. A pressure vessel or a lifting device would need far more, along with compliance with the standards and approvals that govern it.

For the bracket, three measurements on one article are proportionate. They confirm the stress path, quantify the frame's effect and verify the frequency margin on the actual installation. They do not establish fatigue life, which depends on weld quality and many cycles; that is addressed by the weld fatigue assessment named in the plan, using the nominal stresses the model has now been shown to predict well.

## Write the report a reviewer can check

The report records the decision, the evidence and the limits of both. It should allow a competent reviewer to understand and check the work without opening the model.

```figure
type: checklist
title: Contents of the simulation report for Revision B
caption: Each section answers a question a reviewer will ask. Open items are listed, not hidden.
- Decision and scope | Release Revision B for the 32 kg gearmotor on conveyor line 2
- Design identification | Part numbers, revisions and analysis configuration names
- Analysis plan | Questions, load cases with sources, acceptance criteria agreed in advance
- Inputs | Materials with sources, units, loads, restraints and connections
- Hand calculations | Stress, deflection, mass and frequency estimates with formulas
- Verification | Reaction checks, benchmark, mesh and time-step convergence tables
- Results against criteria | Converged values, margins, singular points identified and excluded
- Validation | Test plan, limits, results, the frame explanation and the extended model
- x Tuned parameters | None; the original disagreement is reported
- ? Open items | Weld fatigue assessment and bolt check by the nominated methods
```

Two items deserve emphasis. The first is the list of singular points and artefacts that were excluded: the sharp corner at the arm root and the bolt connector rings. A reviewer who sees a red spot in an image deserves to know it was considered. The second is the open items. Every simulation report has them, and listing them is a sign of competence, not weakness.

## State the release decision and its limits

The conclusion is a decision with a defined scope. For the running case, it reads in substance as follows. Revision B meets the stress, deflection and frequency criteria in the analysis plan for the 32 kg gearmotor, the stated load cases and the conveyor frame as tested, with the smallest margin being the drain hole stress at about 3.9 times below its criterion. The first article confirmed the arm's bending stress within 4% and a first natural frequency of 82 Hz on the installed frame. Release for manufacture is recommended subject to the weld fatigue assessment and bolt check listed as open items.

The scope is as important as the result. The conclusion does not cover the 41 kg motor, a shorter start-up time, a different conveyor frame or the addition of a guard stay, each of which an earlier chapter showed could change the answer. When any of them is proposed, the plan shows exactly which checks to repeat.

## Keep the model, the plan and the report together

The model, the plan, the hand calculations, the test record and the report form a single body of evidence. Store them together under the design's revision control. A model file without its plan is hard to trust; a report without the model cannot be reproduced; a test record without the predictions it was compared with proves little.

When the bracket is next changed, the analyst starts from this set, not from a blank screen. The load table, criteria, benchmarks and validated frame model all carry forward, and the work needed for Revision C may be an afternoon rather than a week. That reuse is the final return on doing the analysis carefully the first time.

## Ask for an independent review

The last check is a person. A competent engineer who did not build the model should read the plan, the report and the test record, and should be able to reproduce the key hand calculations and reaction checks from the report alone. Their task is not to rerun the analysis but to test whether its evidence supports its conclusion and whether anything important was left out.

For the bracket, the reviewer's questions might be whether the dynamic allowance of 2.0 has a source, whether the weld size was checked, and whether the guard designer knows not to add a rigid stay. Each question is either answered from the report or becomes an open item. A review that finds nothing to ask is usually a review that was not done.

## Exercise: a disappointing tap test

Suppose the tap test had measured 64 Hz instead of 82 Hz, with the same strain result. What stiffness ratio does that imply, what tip deflection would you expect under the 490.5 N test load and what would you do next?

**Worked answer.** The stiffness ratio is **(88.9 / 64)² ≈ 1.93**, so the real system is nearly twice as flexible as the model, implying the frame contributes almost as much flexibility as the bracket. The expected tip deflection is **0.048 × 1.93 ≈ 0.093 mm**, which a dial indicator reading should confirm. The bracket still passes the 48 Hz criterion, but 64 Hz lies below the 70 Hz review level set in the plan. The next steps are to measure the deflection to confirm the explanation, model the frame to find which part is flexible, and decide with the site whether to stiffen the frame locally, accept the reduced margin with the 32 kg motor, or rule out the heavier motor. The strain result, still in agreement, confirms that the arm itself is behaving as predicted.
