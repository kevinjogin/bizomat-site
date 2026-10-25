---
book: design-simulation-by-the-numbers
chapterSlug: start-with-the-decision
order: 1
title: "Start with the decision, not the model"
description: "Write an analysis plan that names the design decision, the load cases, the acceptance criteria and the evidence a reviewer will need before any mesh is made."
draft: false
---

Most weak simulations fail before the first element is created. The model is built because the software makes it easy, a load is applied because one is needed, and a stress plot appears. Nobody wrote down which decision the result was meant to support, so nobody can say whether the plot answers it. A good analysis starts the other way round: with the decision, the evidence that would settle it and the cheapest way to get that evidence.

This chapter sets up the running case and turns it into an analysis plan. The plan is short, often a single page, but it fixes the questions, the loads, the acceptance criteria and the checks before anyone is attached to a particular answer. Every later chapter refers back to it.

## The bracket and the question behind it

This is an illustration. A conveyor line needs a new drive position. A gearmotor of 0.75 kW, with a 12:1 gearbox, will drive the head pulley through a short belt. The gearmotor weighs 32 kg and its centre of mass sits on the axis of a steel arm, 250 mm from the face of a base plate. The base plate bolts to the conveyor's side frame with four M12 bolts. The motor's nameplate speed is 1,440 rev/min, so the rotor turns at **1,440 / 60 = 24** revolutions a second, or 24 Hz.

The design team's first sketch uses a 12 × 50 mm flat bar for the arm, with the 50 mm dimension vertical. A designer could model it in ten minutes, apply the weight of the motor and produce a stress plot. That plot would answer the question "what is the bending stress under the motor's weight?", which is not the question anyone needs answered.

The real questions are these. Will the arm hold the motor without yielding or cracking under the loads it will actually see? Will it hold the motor still enough for the belt to stay aligned? Will it avoid vibrating badly when the motor runs at 24 Hz? Each question needs different evidence, and only the first is answered by a stress plot.

## Name the decision and its consequence

The analysis supports a decision: release the bracket for manufacture, change it or test it first. Write that decision down in one sentence, with the consequence of getting it wrong. For the bracket, a wrong "release" might mean a cracked weld, a belt that tracks off the pulley or a noisy, fatiguing structure. None of these is a life-safety failure in normal operation, but a falling 32 kg motor could injure someone, so the plan treats retention as important.

The consequence sets the effort. A model that supports a cosmetic decision can be quick and rough. A model that supports a structural release deserves hand checks, a convergence study and, if the margins are small, a test. Published frameworks for model credibility, such as NASA's standard for models and simulations, make the same point: the rigour of the evidence should match the cost of being wrong.

## List the load cases with their sources

A load case is a set of forces, moments, temperatures or motions that act together. List every case that could govern any of the questions, and give each one a source. A load with no source is an assumption, and it should be labelled as one.

```figure
type: compare
title: Load cases for the gearmotor bracket
cols: Load | Source
caption: All four cases act at the load point 250 mm from the base face. Every value is a teaching assumption with a stated basis.
- LC1 Static weight | 314 N downward | 32 kg × 9.81 m/s²
- LC2 Vertical design load | 628 N downward | LC1 × 2.0 dynamic allowance for starts, stops and knocks
- LC3 Belt pull | 450 N sideways | Belt tension estimate from the drive designer
- LC4 Start-up torque | 120 N·m about the arm axis | Twice the gearmotor's rated output torque
- *Combination C1 | LC2 + LC3 + LC4 | Used for the stress check
```

The weight is straightforward: **32 × 9.81 = 313.9 N**, rounded to 314 N. The dynamic allowance of 2.0 is a teaching assumption for the shocks of starting, stopping and occasional knocks. A real design would take it from the relevant code, the manufacturer or a measurement.

The start-up torque comes from the motor. Rated output torque is power divided by angular speed. With 0.75 kW and an output speed of **1,440 / 12 = 120 rev/min**, the rated torque is **9,550 × 0.75 / 120 ≈ 59.7 N·m**, about 60 N·m. The factor 9,550 converts kilowatts and rev/min into newton-metres, since 60,000 / 2π ≈ 9,549. Starting torque is taken as twice rated, so 120 N·m reacts into the bracket during start-up. The motor data sheet should confirm the ratio.

## Set acceptance criteria before you see a result

An acceptance criterion is a number the result must satisfy, chosen before the result exists. Choosing it afterwards invites the criterion to drift towards whatever the model produced. For the bracket, the team agrees on three:

1. **Stress.** Under combination C1, the von Mises stress away from singular points must not exceed 150 MPa. This is 0.6 times an assumed yield strength of 250 MPa, the nominal value implied by the steel's grade name. The real grade and thickness may have a different minimum yield, which must be checked in the material standard.
2. **Deflection.** Under LC2 and under LC3, the load point must move less than 0.5 mm. The drive designer gave this figure for belt alignment.
3. **Frequency.** The first natural frequency of the bracket with the motor fitted must be at least 48 Hz, twice the motor's running frequency, so the bracket is never close to resonance in normal running.

```figure
type: stats
title: The three acceptance criteria
caption: Each criterion answers a different question. A design that passes one can still fail another.
- *≤ 150 MPa | Von Mises stress, combination C1 | 0.6 × assumed 250 MPa yield
- ≤ 0.5 mm | Load point deflection, LC2 and LC3 | Belt alignment limit
- ≥ 48 Hz | First natural frequency | 2 × the 24 Hz running speed
```

These are teaching criteria, not code requirements. A real bracket may need a fatigue check at the weld, a bolt check under prying and a check against an applicable structural or machinery standard. The point is that the criteria exist, are numerical and were agreed before the model was run.

Notice also what is missing. There is no criterion for the stress at a sharp corner or at the root of a weld, because a linear elastic model cannot predict a meaningful number there. Chapter 6 explains why, and Chapter 7 explains what to report instead.

## Choose the cheapest evidence for each question

With the questions, loads and criteria fixed, decide how each will be answered. A finite element model is not the only tool, and often not the first.

```figure
type: matrix
title: Matching each question to its cheapest credible evidence
x: Low cost → high cost
y: Low confidence → high confidence
caption: Start in the bottom-left and move only as far as the margins require. Hand calculations bound the answer; test settles disputes.
- Hand calculation | Beam stress, deflection, mass and frequency in minutes
- Finite element model | Local stresses, real restraints, complex shapes
- Supplier data and codes | Bolt capacities, motor torques, weld categories
- *Physical test | Strain gauges and a tap test on the first bracket
```

For the bracket, hand calculations can estimate bending stress, deflection and a first natural frequency within minutes. Chapter 2 shows that they are enough to reject the flat bar. A finite element model is worth its cost for the stress where the arm meets the base plate, the flexibility of the bolted base and the combined effect of torque and bending. A test on the first bracket is worthwhile because the frequency margin depends on the conveyor frame, which nobody has modelled.

## Write the analysis plan

The plan records the decisions above in a form a reviewer can check. It should fit on a page and should be written before modelling begins.

```figure
type: checklist
title: Analysis plan for the gearmotor bracket
caption: Open items are marked as questions. They must be closed or accepted before the result supports a release.
- Decision to be supported | Release Revision B of the bracket for a first article
- Load cases and sources | LC1 to LC4 and combination C1, table attached
- Acceptance criteria | 150 MPa, 0.5 mm, 48 Hz, agreed with the drive designer
- Hand calculations | Stress, deflection, mass and frequency for both revisions
- Model scope | Arm, welds idealised, base plate, bolts, frame treated as rigid
- ? Frame stiffness | Unknown; covered by a tap test on the first article
- Verification | Reaction check, mesh convergence, comparison with hand values
- Validation | Strain gauge and tap test, with agreement limits set in advance
- Report | Inputs, assumptions, results, margins and scope of the conclusion
```

The open item matters. The model will treat the conveyor frame as rigid, because nobody has its stiffness. The plan says so before the result exists and states how the gap will be closed. A reviewer reading the final report can see that the omission was a decision, not an oversight.

## List every source of vibration, not only the motor

The frequency criterion uses the motor speed because it is the largest and most obvious excitation. It is not the only one. The gearbox output turns at 120 rev/min, or **120 / 60 = 2** Hz. The belt passes its joint, if it has one, once per belt revolution. A slightly unbalanced pulley shakes the drive once per pulley revolution. Gear teeth mesh many times per revolution, at frequencies far above the bracket's first mode.

Write these frequencies into the plan, even when they look harmless, and say why each is or is not a concern. For the bracket, the 2 Hz output excitation is far below any credible first mode and the tooth-mesh frequencies are far above it, so the 24 Hz motor speed governs. A reviewer can see the reasoning instead of wondering whether the other sources were forgotten. If the conveyor later runs on a variable-speed drive, the motor speed becomes a band rather than a single value, and the criterion must cover the whole band.

## Draw the boundary of the model

Every model leaves something out. The plan should say what is inside the model, what is represented by a simplified boundary and what is omitted, with a reason for each. For the bracket, the arm, the welds, the base plate and the bolts are inside. The gearmotor is represented as a point mass with its centre of mass on the arm axis, connected to the motor flange. The conveyor frame is represented as rigid, which is the open item already noted. Paint, the motor's terminal box and the guard are omitted because they carry no load.

Each simplification has a direction of error. Treating the frame as rigid makes the bracket look stiffer and its frequency higher than reality, so it is unconservative for the frequency criterion. Treating the motor as a point mass ignores its rotary inertia, which matters for torsional modes but not for the first bending mode. Recording the direction of each error tells the reviewer which margins need to be larger.

## Budget the time before you spend it

Analysis time is a cost like any other. A rough budget in the plan stops a simple question from absorbing a week of meshing. For the bracket, the team allows half an hour for hand calculations, half a day for the model, its checks and its convergence study, an hour for the report and half a day for the first-article test. If the model takes longer than its budget, that is a signal to ask whether the geometry is too detailed or the question too broad, not a reason to keep refining.

The budget also helps when margins are large. If hand calculations show a stress of 25 MPa against a 150 MPa criterion, a full convergence study on that stress may not be worth its cost, and the plan can say so. Effort should go where the margins are thin or the consequences serious.

## A failure case: the model without a plan

This is an illustration of what the plan prevents. Suppose the designer had skipped it and modelled the flat bar under the motor's weight alone. The bending moment at the root is **314 × 250 = 78,500 N·mm**. The section modulus of a 12 × 50 bar bent about its strong axis is **12 × 50² / 6 = 5,000 mm³**, so the root stress is about **78,500 / 5,000 = 15.7 MPa**. The plot would be mostly blue, and the design would look comfortably safe.

Everything in that result is correct, and the conclusion drawn from it is wrong. Under the belt pull the bar bends about its weak axis, where its stiffness is about one-seventeenth as large. Its first sideways natural frequency, as Chapter 2 shows, is under 15 Hz, which the motor passes through every time it starts. The plot answered a question nobody needed answered and hid the two that mattered.

The failure was detectable. A reviewer with the plan in hand would have asked where the sideways load case was and where the frequency check was. A reviewer without a plan has only the plot, and a blue plot is persuasive.

## Keep the plan alive

The plan is not a form filled in once. When a load changes, the plan changes first and the model follows. When a result surprises someone, the plan shows which assumption to question. When the design changes, the plan shows which checks must be repeated. Store it with the model and the report under the same revision, so that the three always describe the same design.

A useful habit is to write, in one line, the result you expect before running each case. If the gravity case should give about 0.03 mm of deflection and the model reports 3 mm, the expectation catches the error immediately. Chapter 2 develops those expectations properly.

## Agree the plan with the people who own the inputs

The analyst rarely owns every input. In the running case the drive designer owns the belt tension and the alignment limit, the motor supplier owns the torque data and the site owns the conveyor frame. Each of those people should see the load table and the criteria before modelling begins, and each should confirm or correct the values attributed to them. A five-minute review at this stage costs far less than a reworked analysis after a disputed result.

Record the confirmation in the plan, with names and dates. If the belt tension later changes, the record shows who supplied the original value and which results depend on it. It also protects the analyst from being blamed for an input that was outside their control, which is a fair outcome for everyone and a strong incentive to keep the plan current.

## Exercise: write the criterion for a heavier motor

The drive designer proposes a 1.1 kW gearmotor of 41 kg, with the same 12:1 gearbox and the same 1,440 rev/min motor. Update LC1, LC2 and LC4, and say whether any acceptance criterion should change.

**Worked answer.** LC1 becomes **41 × 9.81 = 402.2 N**, about 402 N. LC2 becomes **2.0 × 402.2 = 804.4 N**, about 804 N. The rated output torque becomes **9,550 × 1.1 / 120 ≈ 87.5 N·m**, so LC4 becomes about **175 N·m** at twice rated. LC3, the belt pull, must be confirmed by the drive designer, because a larger motor usually means higher belt tension.

The stress and deflection criteria do not change, because they describe what the steel and the belt can tolerate. The frequency criterion also stays at 48 Hz, because the running speed is unchanged. The heavier motor will lower the bracket's natural frequency, since frequency falls with the square root of mass, so the frequency check is the one most likely to change its answer. The plan should record that before any model is rerun.
