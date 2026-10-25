---
book: welder-training-by-the-numbers
chapterSlug: assessment-and-feedback
order: 6
title: "Assessment and feedback"
description: "Assess practice welds by eye, gauge and break test, judge what a small sample of coupons can prove, check that two assessors agree, and give feedback that changes the next weld."
draft: false
---

Every practice weld is a question: is this good enough, and if not, why not? Assessment answers it. Done well, it tells the trainee exactly what to change on the next run, tells the instructor where the trainee is on the learning curve, and tells the manager when the trainee is ready. Done badly, it gives vague praise or blame, varies with whoever is looking, and draws conclusions from too few welds. Campbell's school broke students' welds open to show them what was inside; the Davis-Bournonville course ended its lecture on testing welded joints with questions asking whether a tensile test was a conclusive test of a weld. Both understood that a weld must be judged by evidence, and that the evidence must be understood.

This chapter covers the methods of assessing practice welds, what a small number of coupons can and cannot prove, how to check that two assessors judge alike, and how to give feedback that changes what the trainee does next.

## Two purposes

Assessment in training has two purposes, and they need different habits. **Formative** assessment happens during learning: the instructor and trainee look at a run together, find what went wrong and decide what to change. It is frequent, informal and aimed at the next weld. **Summative** assessment decides something: whether the trainee has passed a module, whether they can weld production work, whether they are ready for the qualification test. It is less frequent, formal, done to written criteria and recorded. A trainee needs a great deal of formative assessment and only occasional summative assessment, and a common mistake is to give them the reverse: little feedback during practice and a test at the end of each month.

## Looking at the weld

Visual inspection is the first and most frequent assessment, and it is a skill in itself. The fabricator's instructors check each cleaned practice run for:

- **size**, the leg lengths and throat of a fillet, measured with a fillet weld gauge against the size the procedure calls for;
- **profile**, whether the face is flat or slightly convex, without excessive convexity or concavity;
- **undercut**, a groove melted into the parent metal at the toe of the weld and not filled;
- **overlap**, weld metal lying on the parent metal at the toe without fusing to it;
- **porosity** and **cracks** on the surface;
- **evenness**, of width, ripple and leg length along the run;
- **stops and starts**, whether the restarts are fused into the previous metal without craters or lumps.

Each is linked to something the trainee controls: undercut to travel speed and angle, overlap to a cold or slow arc, uneven legs to torch angle, porosity to gas cover. Visual inspection tells the trainee which variable to change. It also needs good light, a clean weld and the right tools: a fillet gauge, an undercut gauge and a magnifier, kept at every booth.

## Looking inside

Visual inspection cannot see the most important fault in a fillet weld, lack of fusion at the root, where weld metal has been laid over parent metal that was not melted. For that, the weld must be opened. The simplest method for fillet practice is the fillet break test: a coupon is welded on one side only, then bent or hammered over until the weld breaks, and the broken face is examined for fusion into the root and for internal porosity. A macro section, cut across the weld, ground, polished and etched, shows the fusion boundary and penetration directly. Butt welds are opened by bend tests. Testing Welded Joints by the Numbers describes these tests and what they show, including macro examination, in its chapter on [macro sections and visual inspection](/reados/publications/testing-welded-joints-by-the-numbers/macro-sections-and-visual-inspection/).

```figure
type: compare
title: Assessing a practice fillet weld
cols: What it finds | How often in training
caption: This is an illustration of the fabricator's practice. The production procedure and the qualification standard set the criteria and tests for formal assessment.
- Visual inspection with gauges | size, profile, undercut, overlap, surface porosity | every run
- *Fillet break test | lack of root fusion, internal porosity | about one coupon in five
- Macro section | fusion boundary, penetration, internal defects | at each module test
- Instructor watching the weld | technique causes of the faults | part of every session
```

## Reading a broken face

A fillet break test is only as useful as the reading of the broken face, and the reading is taught. On a sound coupon, the fracture runs through the weld metal, and the root of the joint is fused: the weld metal has wetted and melted into the corner where the two plates meet, and the fracture face shows grey, granular weld metal right into that corner. On a coupon with lack of root fusion, the fracture runs along the unfused root, which shows as a smooth, often discoloured band where the weld metal lay against plate it never melted. Porosity shows as rounded holes in the fracture face; slag or flux inclusions as dark, angular patches. The instructor shows each trainee the faces of their own broken coupons and connects each fault to its cause: a band of unfused root to an arc held on top of the pool rather than at its leading edge, holes to poor gas cover or a contaminated plate. Campbell's lesson, that metal added where the parent metal was not fused is not a weld, is learned most quickly from the trainee's own broken coupon.

## Assessment as a habit, not an event

The fabricator found that the most useful assessments were the small, constant ones. Every run is inspected by the trainee and, often, the instructor; every fifth coupon is broken; every week the instructor reviews the coupon log with the trainee; every module ends with a test. No single assessment carries much weight, so no single bad day is a disaster, and the picture built from hundreds of small judgements is far more reliable than any one test. Trainees who are assessed this way come to see assessment as information rather than judgement, which makes them more willing to show their worst welds as well as their best.

## What a small sample can prove

A trainee's reject rate is estimated from a sample of coupons, and small samples are uncertain, as Chapter 3 showed. Two simple tools help to judge what a sample can prove.

The first is a confidence interval. This is an illustration. If a trainee has 2 rejected coupons in a sample of 20, the observed rate is 10%, but a 95% confidence interval, calculated by the standard Wilson method, runs from about 3% to about 30%. With 8 rejected in 80, the observed rate is the same 10%, but the interval narrows to about 5% to 19%. Twenty coupons cannot distinguish a trainee whose true rate is 5% from one whose true rate is 25%.

```figure
type: range
title: 95% confidence intervals for an observed 10% reject rate
unit: % of coupons rejected
min: 0
max: 35
caption: Wilson score intervals for 2 rejects in 20, 4 in 40 and 8 in 80 coupons. The observed rate is 10% in each case; only the sample size changes.
- 2 rejected in 20 | 2.8 | 30.1
- 4 rejected in 40 | 4.0 | 23.1
- *8 rejected in 80 | 5.2 | 18.5
```

The second is the "rule of three". If a trainee has no rejects at all in n coupons, the upper limit of a 95% confidence interval for their true reject rate is about 3 ÷ n. Twenty clean coupons in a row show, with 95% confidence, a true rate below about **15%**; thirty, below about **10%**; sixty, below about **5%**. A run of clean coupons is encouraging, but it takes a long run to prove a low rate.

## Using the numbers in decisions

The fabricator's module tests use these numbers. To pass a fillet module, a trainee must weld a run of coupons without help, all passing visual inspection, with every fifth broken open, and the rolling reject rate over the last 40 coupons must be below the module's target. The manager knows that 40 coupons cannot prove a rate precisely, and treats the test as a decision under uncertainty: a trainee who passes may still have a true rate somewhat above the target, which is why their first production welding is supervised and fully inspected. A trainee who fails narrowly is not told they are failing but that their evidence is not yet strong enough, and keeps practising.

## Do two assessors agree?

Assessment is only fair if it does not depend on who does it. The fabricator checks this by having its two instructors assess the same set of coupons independently, without seeing each other's decisions, and comparing the results.

This is an illustration. The two instructors each assessed the same 40 practice coupons, accepting or rejecting each. They agreed on 34 of the 40, an agreement of 85%. But some agreement would happen by chance: instructor A rejected 30% of the coupons and instructor B 25%, so if their decisions were unrelated, they would agree on about 0.30 × 0.25 + 0.70 × 0.75 = **60%** of coupons by chance alone. A measure called Cohen's kappa compares the observed agreement with the chance agreement.

```figure
type: formula
title: Agreement between two assessors beyond chance
formula: κ = (p_observed − p_chance) ÷ (1 − p_chance)
caption: This is an illustration. Kappa is 1 for perfect agreement and 0 for agreement no better than chance. Values of about 0.6 are often described as moderate to substantial; the aim for welding assessment is higher.
- p_observed | 34 ÷ 40 = 0.85
- p_chance | 0.30 × 0.25 + 0.70 × 0.75 = 0.60
step: κ = (0.85 − 0.60) ÷ (1 − 0.60)
step: κ ≈ 0.63
```

A kappa of about 0.63 showed that the instructors broadly agreed but not as closely as they should. Looking at the six coupons they disagreed on, they found that instructor A rejected any visible undercut while instructor B accepted shallow undercut within the procedure's limit. They agreed on a written criterion with a gauge measurement, made a board of reference coupons showing acceptable and unacceptable examples, and repeated the exercise a month later, reaching 38 agreements in 40.

## Feedback that changes the next weld

Assessment is wasted if it does not change what the trainee does next. Good feedback in welding is:

- **immediate**, given while the trainee still remembers how the weld felt;
- **specific**, naming the fault and its cause, such as "undercut on the top toe; you are travelling a little fast and the gun is tilted down";
- **limited**, one or two points at a time, because a trainee in the cognitive stage cannot work on five things at once;
- **linked to evidence**, showing the trainee the fault on the coupon or the broken face, not just describing it;
- **checked**, by watching the next run to see whether the change was made.

Praise matters too, when it is specific: telling a trainee that their restarts have become smooth tells them which change worked and should be kept.

## Self-assessment

The goal of all this assessment is a welder who can assess their own work. From the first weeks, the fabricator's trainees inspect each run themselves, with the gauge and the criteria, before the instructor looks, and the instructor compares the trainee's judgement with their own. A trainee who consistently misses undercut or overlap is taught to see it. By the time trainees reach production welding, their self-assessment is part of the module tests, because a production welder who cannot see their own defects will pass them on to the inspector, or to the customer.

## Records of assessment

Every summative assessment is recorded: date, trainee, module, coupons, results, reasons for rejection, assessor and decision. Formative assessments are summarised in the coupon log that feeds the learning curve. The records serve the trainee, who can see their progress; the instructor, who can see patterns; the manager, who can plan; and, later, the qualification and quality systems, which may need evidence of how a welder was trained and assessed.

## A failure: two standards

This is an illustration. In the trainees' fifth month, Chris began welding supervised production, and the shop's quality inspector rejected several of his welds for undercut that the instructor had been accepting in the booth. Chris was confused and discouraged: he had been told his welds were good.

The cause was the same difference in criteria that the kappa exercise later exposed, but between the instructor and the inspector. The inspector was applying the acceptance criteria of the production standard, which set a limit on undercut depth; the instructor had been judging by eye. The fix was to give the instructors and the inspector the same written criteria and the same gauges, and to have the inspector assess a sample of training coupons each month, so that training and production judged welds the same way.

## Exercise: how many clean coupons?

The manager wants evidence, with 95% confidence, that a trainee's true reject rate on vertical-up fillets is below 8% before moving them to supervised production in that position. Using the rule of three, how many consecutive clean coupons are needed? If the trainee has one reject along the way, what does that suggest?

The rule of three gives an upper 95% limit of about 3 ÷ n for zero rejects in n coupons. For 3 ÷ n to be below 0.08, n must be at least 3 ÷ 0.08 ≈ **38** consecutive clean coupons.

One reject does not mean the trainee has failed, but it means the zero-reject rule no longer applies; with one reject, a longer sample, roughly 60 coupons or more, is needed to show the same upper limit. In practice, the manager would combine the coupon evidence with the learning curve and the reasons for the reject: a single reject for a cause the trainee has since corrected weighs less than one that repeats an old fault.
