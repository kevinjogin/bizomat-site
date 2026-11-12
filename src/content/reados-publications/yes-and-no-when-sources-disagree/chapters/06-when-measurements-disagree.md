---
book: yes-and-no-when-sources-disagree
chapterSlug: when-measurements-disagree
order: 6
title: "When measurements disagree: torque audits, bolt stretch and two crews"
description: "When two checks of the same work give opposite verdicts, find out what each method measures, test whether a difference is real, and trace it to its cause before accepting or reworking the joint."
draft: false
---

So far the conflicts in the planner's register have been between documents. Once the work starts, a new kind of source appears: measurements. They are often treated as the final word, because they come from the job itself rather than from someone's paperwork. But measurements disagree too, and for the same reasons documents do. Two methods can measure different quantities under the same name. A reading can be damaged in the taking, as a figure can be damaged in the copying. And two sets of results can differ because the things measured really are different.

This chapter follows the assembly of joints J2 and J3, where a torque audit and a bolt-stretch survey give opposite verdicts on the same bolts. It shows how to establish what each method measures, how to tell a real difference from scatter, and how to find the cause before deciding what to rework.

## Two checks, two verdicts

This is an illustration. The steel joints J2 and J3 are assembled on the same day by two crews, both working to the new instruction from Chapter 2: compound C on threads and nut faces, 135 N·m in the cross pattern at 30%, 60% and 100%, then a circular pass at 100%. Crew A assembles J2; crew B assembles J3.

Two checks follow.

- **Torque audit.** A supervisor puts a calibrated wrench set to 135 N·m on each nut and confirms that it clicks without the nut turning. All sixteen bolts pass.
- **Bolt stretch survey.** The plant's inspector measures the elongation of each bolt with an ultrasonic bolt gauge, which compares the time a sound pulse takes to travel the bolt's length before and after tightening. The gauge reports elongation in millimetres. All eight bolts on J2 are close to the expected value. All eight on J3 are well short of it.

Two checks of the same bolts say "all good" and "half of them are low". Before choosing between them, the planner asks the question from Chapter 2: are they measuring the same thing?

## What each method actually measures

A torque audit measures torque, and torque is the product of preload and friction. If friction is higher than assumed, the wrench reaches its set torque at a lower preload, and the audit still passes. A torque audit confirms that the tightening procedure reached its torque; it cannot confirm that it reached its preload.

An ultrasonic stretch measurement measures the change in length of the bolt. Through the bolt's stiffness, that change is directly related to the tension in the bolt, independent of friction. It is a much more direct measure of preload, though it brings its own sources of error: the gauge must be set for the bolt's length and material, the transducer must couple well to the bolt head, and temperature affects the speed of sound in the steel.

```figure
type: compare
title: What each check on the joints can and cannot tell you
cols: Measures | Sensitive to friction | Main sources of error
caption: This is an illustration. Both checks are useful; they answer different questions. Only stretch speaks directly to preload.
- Torque audit with a click wrench | Torque at which the nut does not yet move | Yes: confirms torque, not preload | Wrench calibration, static friction, speed of application
- *Ultrasonic bolt stretch | Elongation of the bolt between head and tip | No | Gauge set-up, coupling, temperature, bolt length entered
```

So the two checks do not contradict each other. Both can be right: every nut reached 135 N·m, and the bolts on J3 carry less preload than intended. That combination points straight at friction. Something made the nut factor on J3 higher than the 0.12 the instruction assumed.

## Convert stretch to preload

The [bolt preload verification tool](/tools/bolt-preload-verification/) in BIZOMAT Tools turns a measured stretch into a preload. It calculates the bolt's stiffness from the shank and threaded lengths in the grip, multiplies by the stretch to give the preload, and compares it with a target set as a share of proof load and an accepted deviation. If you enter the applied torque, it also works out the nut factor implied by that torque and preload, and the torque that would reach the target with that nut factor. It treats the bolt as elastic and uses a simplified stiffness model.

For the spool, the planner enters an M16 × 2 bolt, a 40 mm grip with 10 mm of thread in the grip, 207 GPa for the bolt and the steel flanges, a proof stress of 600 MPa, a target of 75% of proof load, an accepted deviation of ±10% and an applied torque of 135 N·m. The tool gives a bolt stiffness of **971.7 kN/mm**, so the target of 70.5 kN corresponds to a stretch of about 0.0726 mm.

The average results for the two crews:

- **Crew A, J2**, average stretch 0.0709 mm: preload **68.9 kN**, 2.3% below target, implied nut factor **0.122**. Preload verified.
- **Crew B, J3**, average stretch 0.0568 mm: preload **55.2 kN**, 21.7% below target, implied nut factor **0.153**. Preload out of tolerance. The tool also reports that, with that nut factor, the target would have needed 172 N·m.

The per-bolt preloads tell the same story more fully.

```figure
type: bars
title: Preload from measured stretch, by bolt and crew
unit: kN
max: 80
caption: This is an illustration. Preloads from the bolt preload verification tool at a bolt stiffness of 971.7 kN/mm. Target 70.5 kN, tolerance 63.5 to 77.6 kN. Every J2 bolt is inside the tolerance; every J3 bolt is below it, but above the gasket floor of 46.1 kN.
- J2 lowest bolt | 64.2
- J2 average, crew A | 68.9
- J2 highest bolt | 73.6
- *J3 lowest bolt | 49.6
- J3 average, crew B | 55.2
- J3 highest bolt | 61.3
```

## Test whether the difference is real

Bolt preloads from torque tightening always scatter. Before concluding that crew B did something different, the planner checks whether a gap of this size could plausibly arise from scatter alone, using the eight bolts from each joint.

Crew A's preloads have a mean of 68.9 kN and a standard deviation of 3.03 kN. Crew B's have a mean of 55.2 kN and a standard deviation of 3.79 kN. The [two-sample comparison tool](/tools/two-sample-t/) runs Welch's t-test from the means, standard deviations and sample sizes of two groups. It gives the difference, its standard error, the t statistic, the degrees of freedom, a two-sided p-value and a confidence interval for the difference. It assumes independent, roughly normal samples.

For these data the tool returns a difference of **13.7 kN**, a standard error of 1.72 kN, t = 7.99 with 13.35 degrees of freedom, a p-value of about **0.000002**, and a 95% confidence interval for the difference of **10.0 to 17.4 kN**.

The p-value says that a gap this large would be extremely unlikely if both crews' bolts came from the same population. The confidence interval is more useful for the decision: the true difference is very probably between 10 and 17 kN, which is large in engineering terms, about 14% to 25% of the target. The difference is real, and it is big enough to matter.

The assumptions deserve a moment. Eight bolts per joint is a small sample, and preloads within one joint are not perfectly independent, because tightening one bolt affects its neighbours. Neither caution changes the conclusion here, because the gap is so much larger than the scatter. If the gap had been 3 kN with p around 0.1, the honest conclusion would have been "not shown to differ", and the next step would be more measurement rather than rework.

## Find the cause

A real difference needs an explanation before anyone reworks the joint, or the rework may repeat the fault. The implied nut factor points to friction: 0.153 on J3 against 0.122 on J2 and 0.12 in the instruction. The planner asks crew B to describe exactly what they did.

The answer is simple. Crew B applied compound C to the threads, as they always had, but not to the nut faces. Their usual practice on other plants called for "lubricated threads", and the extra words "and nut faces" in the new instruction did not register. Nut-face friction is a large share of the total tightening torque, so leaving it dry raises the nut factor substantially. A nut factor around 0.15, between the fully lubricated 0.12 and the dry 0.20, is what partial lubrication would be expected to give.

This is the meaning problem of Chapter 2 again, in a new place. "Lubricated" meant one thing to the gasket maker and the planner, and another to crew B. The instruction had defined it, but the definition did not reach the crew's habits.

### The failure case: accepting the audit

If the plant had relied on the torque audit alone, J3 would have been accepted. Its bolts carry 49.6 to 61.3 kN, above the gasket maker's floor of 46.1 kN, so the joint would probably have sealed at first. But its margin for relaxation would be smaller than intended, and the lowest bolts would sit close to the floor once the gasket relaxed in service. A torque audit cannot detect this, because every nut genuinely reached 135 N·m.

### The correction

The planner's instruction for J3:

1. Loosen the bolts in the reverse of the tightening sequence.
2. Clean the nut faces, apply compound C to threads and nut faces, and retighten in the full sequence to 135 N·m.
3. Re-measure every bolt's stretch and record the preloads.
4. Brief both crews on the instruction's definition of "lubricated", with a photograph of a correctly coated nut face added to the work pack.

The bolts on J3 were never loaded above target, so they can be reused. After rework the J3 bolts measure between 0.0690 mm and 0.0735 mm of stretch, all inside the tolerance.

## A reading damaged in the taking

One more conflict appears in the survey data. The first reading on the third bolt of J2 is 0.041 mm of stretch, which the tool converts to 39.8 kN, 43.5% below target, with an implied nut factor of 0.212. On its own, that bolt would have been rejected.

But it disagrees with everything else about J2: the other seven bolts were within tolerance, and the same crew, compound and procedure were used throughout. The inspector checks the measurement rather than the bolt. The transducer's coupling gel had been wiped off the bolt head; with fresh gel, the same bolt reads 0.0695 mm, a preload of 67.5 kN, well inside tolerance.

This is Abelard's copyist at work in a modern setting. A single absurd value in an otherwise consistent set is more likely to be an error in recording than a fact about the world. The right response is the same as for a suspicious figure in a document: go back to the original, here by measuring again, before treating it as evidence.

```figure
type: checklist
title: Questions to ask when two measurements disagree
caption: This is an illustration. Each question resolved part of the conflict on J2 and J3. Only after all of them was rework decided.
- x Do the methods measure the same quantity | torque audit measures torque; stretch measures preload
- x Is any single reading out of line with its neighbours | one J2 reading of 0.041 mm, corrected by re-measuring
- x Is the difference between groups larger than the scatter | 13.7 kN, 95% interval 10.0 to 17.4 kN
- x Does a calculated quantity point to a cause | implied nut factor 0.153 on J3 against 0.122 on J2
- x Does the people's account match the numbers | crew B left nut faces dry
- x Has the rework been measured, not just performed | J3 re-measured inside tolerance
```

## Choosing the check for the next job

The conflict also changes how the plant checks future bolted joints. Measuring every bolt with an ultrasonic gauge takes time and a trained inspector, and not every joint justifies it. The planner sets out a simple rule for the spool and similar joints:

- **Torque audit on every joint**, because it is quick and catches bolts that were missed or under-torqued. Its record states that it confirms torque only.
- **Stretch measurement on every bolt of the first joint each crew assembles**, so that a friction problem like crew B's is found on the first joint, not after the last.
- **Stretch measurement on a sample of later joints**, at least two bolts per joint on opposite sides of the pattern, increasing to every bolt if any reading falls outside the tolerance.
- **Full measurement on any joint after rework**, as on J3.

The rule puts the more expensive, more direct measurement where it gives the most information: at the start of each crew's work, where a misunderstood instruction would show up. It is a choice about evidence, made before the conflict rather than after it. A plant that only ever audits torque has chosen, perhaps without realising it, never to find a friction problem until a joint leaks.

## Recording measurements in the register

Measurement results go into the register in the same form as documentary claims: what was measured, by whom, with which instrument and calibration, under what conditions, and what it means. The planner's entries for the spool read, in part:

- "J2, crew A, ultrasonic stretch, gauge serial recorded, calibration current: preloads 64.2 to 73.6 kN, mean 68.9 kN. Accepted."
- "J3, crew B, first survey: preloads 49.6 to 61.3 kN, mean 55.2 kN. Difference from J2 real (Welch t, p about 0.000002). Cause: nut faces not lubricated. Reworked; re-survey inside tolerance. Accepted after rework."
- "Torque audit, all bolts: pass at 135 N·m. Note: audit confirms torque only; not used as evidence of preload."

That last line is as important as the others. It records not just what the audit found, but what it is evidence of, so that a later reviewer does not mistake a torque audit for a preload check.

## Exercise: one bolt after rework

After rework on J3, one bolt measures 0.0712 mm of stretch with the applied torque of 135 N·m. Using the bolt preload verification tool with the inputs above, find its preload, its deviation from target, its implied nut factor and whether it passes. Then say what the implied nut factor tells you about the rework.

**Worked answer.** The tool gives a preload of 971.7 kN/mm × 0.0712 mm = **69.2 kN**, a deviation of **−1.9%** from the 70.5 kN target, and a pass against the ±10% tolerance. The implied nut factor is 135,000 ÷ (69,180 × 16) = **0.122**, the same as crew A's average on J2.

The nut factor is the useful part of the answer. It shows that the rework did what it was meant to do: with the nut faces lubricated, J3's friction now matches J2's. A pass on preload alone could have come from a different combination, for example dry nut faces and a higher torque. The matching nut factor confirms that the cause was removed, not just compensated for.
