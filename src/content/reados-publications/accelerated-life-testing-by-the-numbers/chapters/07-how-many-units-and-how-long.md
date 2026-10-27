---
book: accelerated-life-testing-by-the-numbers
chapterSlug: how-many-units-and-how-long
order: 7
title: "How many units, and for how long"
description: "Zero-failure demonstration tests, the success-run formula, trading test time for units with a known Weibull shape, allowing a failure, FL-60's driver plan, and a failure explained away."
draft: false
---

Chapter 6 analysed a test that ran until most units failed. That is the best way to learn about a design, but it is a poor way to prove one: it takes a long time, and a design that is good enough may not fail at all within a practical test. Most product approvals instead rely on a **demonstration test**: run a set number of units for a set time, and if no more than an agreed number fail, the reliability target is shown with a stated confidence. The questions are how many units and how long, and the answers involve a trade between the two that depends on what is known about the failure distribution.

This chapter derives the zero-failure, or success-run, test from the binomial distribution, shows how to shorten it with more units or to reduce the units by testing longer when the Weibull shape is known, sets out what allowing one failure costs, designs FL-60's production driver demonstration, and examines how the answer depends on the activation energy and the shape. It ends with a failure that was explained away.

## The success-run test

Suppose each unit has a true probability R of surviving the test without failing. If n units are tested and all survive, the probability of that happening is Rⁿ. If R were below the target, all n surviving would be unlikely; how unlikely depends on n. A demonstration at confidence C chooses n so that, if R were only just at the target, the chance of all n surviving would be no more than 1 − C. Setting Rⁿ = 1 − C and solving gives the **success-run formula**.

```figure
type: formula
title: The success-run test: zero failures demonstrate R at confidence C
formula: n = ln(1 − C) ÷ ln(R)
caption: Each unit must run for the full time the reliability R refers to, at use conditions or their accelerated equivalent. The formula assumes nothing about the shape of the failure distribution.
- n | number of units, all of which must survive
- R | reliability to be demonstrated over the test's equivalent life
- C | confidence
step: R = 0.90, C = 0.90: n = ln(0.10) ÷ ln(0.90) = 21.85, so 22 units
step: R = 0.95, C = 0.90: n = 44.9, so 45 units; R = 0.99, C = 0.90: n = 229.1, so 230 units
```

The numbers grow quickly with the reliability demanded. Demonstrating 90% at 90% confidence takes 22 units each run for a full design life; demonstrating 99% takes 230. Lowering the confidence helps less than one might hope: 90% reliability at 60% confidence still needs 9 units. A zero-failure test on a handful of units demonstrates only modest reliability, and that is a fact about evidence, not about the product. A product may be far more reliable than its test can show; the test simply cannot tell, from so few units, that it is not merely lucky. That is also why a passed zero-failure test says little about the very high reliability sometimes claimed in marketing: showing 99% survival with confidence needs hundreds of units or very strong prior evidence.

## Trading time for units

The success-run formula makes no assumption about how failures spread in time, so it gives no credit for testing longer than one life. If the shape of the distribution is known, longer testing can be credited, because for a wear-out mechanism a unit that survives two lives is much stronger evidence than one that survives one.

If failures follow a Weibull distribution with a known shape β, a unit's probability of surviving a test m times as long as the target life is R^(m^β). Substituting into the success-run argument gives n = ln(1 − C) ÷ (m^β × ln R). Testing for twice the life with β = 2 divides the units needed by four; with β = 3, by eight.

```figure
type: compare
title: Units needed to show R = 0.90 at C = 0.90 with zero failures
cols: Test for 1 life | Test for 1.5 lives | Test for 2 lives
caption: From n = ln(1 − C) ÷ (m^β ln R), rounded up. With β = 1 there is still a gain from testing longer, but it is the gain of simply accumulating more unit-hours.
- β = 1, random failures | 22 | 15 | 11
- * β = 2, wear-out | 22 | 10 | 6
- β = 3, steep wear-out | 22 | 7 | 3
```

The gain depends entirely on β being known, and that is the trap. The shape cannot be demonstrated by a zero-failure test, because no failures occur to show it. It has to come from somewhere else: an earlier test to failure on a similar design, the component maker's data, or published values for the mechanism. And an assumed β that is too steep makes the test look much stronger than it is. The advice in the reliability literature is to assume a β at the low end of what the evidence supports.

## FL-60's production driver demonstration

This is an illustration. The production driver uses 10,000-hour capacitors throughout, with the hottest capacitor moved away from the heat sink. Its target is R = 0.90 over 43,800 hours, demonstrated at C = 0.90.

The shape comes from the prototype test of Chapter 6, which gave β = 2.57 for the same capacitor wear-out mechanism. The team assumed **β = 2**, below the measured value, as a margin against the uncertainty in a fit from six failures. Testing for **two design lives**, m = 2, then needs 21.85 ÷ 2² = 5.46, so **6 units**. Using the measured 2.57 would have needed only 4 units, which is why the lower assumption was chosen deliberately.

Two design lives are 87,600 field hours. With the Arrhenius factor of 21.2 between the 57.9 °C effective temperature and a 105 °C core, the test must run 87,600 ÷ 21.2 = **4,123 hours**, about **172 days**. If all six drivers survive, the demonstrated confidence is 1 − 0.9^(6 × 2²) = **0.920**, just above the 0.90 required.

```figure
type: steps
title: FL-60's production driver demonstration plan
caption: This is an illustration. Every number in the plan carries an assumption, and the plan states each one and its source.
- Target | R = 0.90 over 43,800 h, at C = 0.90
- Shape | β = 2 assumed; prototype test measured 2.57 for the same mechanism
- Length | two design lives, 87,600 field hours
- Acceleration | Arrhenius, Ea = 0.7 eV, 57.9 °C to 105 °C core: AF 21.2
- * Test | 6 drivers for 4,123 h at 105 °C hottest-capacitor core, zero failures allowed
- Result if passed | demonstrated confidence 0.920
```

## What the plan really rests on

The plan's numbers are only as good as its two assumptions, and both should be examined before the chamber is booked.

**The shape.** If the true β were 1.2 rather than 2, six drivers surviving two lives would demonstrate only R = 0.846 at 90% confidence; if it were 1, only R = 0.825. The prototype test's β of 2.57 gives reasonable comfort that the true value is above 2 for this mechanism, but if a different mechanism, with a flatter shape, were to limit the production driver, the test's power would fall away.

**The acceleration.** If the activation energy were 0.5 eV instead of 0.7 eV, the acceleration factor would be 8.87 instead of 21.2, and 4,123 test hours would represent only about 36,600 field hours, 0.84 of a design life rather than 2. Six surviving drivers would then demonstrate R of only about **0.58** at 90% confidence, and about 31 drivers would be needed to show 0.90.

```figure
type: bars
title: Reliability demonstrated by six survivors of FL-60's test, at C = 0.90
unit: R
max: 1
caption: This is an illustration. The same test result supports very different conclusions depending on the assumptions behind it. The planning case is highlighted.
- * Planned: β = 2, Ea = 0.7 eV | 0.90
- β = 1.2, Ea = 0.7 eV | 0.846
- β = 1, Ea = 0.7 eV | 0.825
- β = 2, Ea = 0.5 eV | 0.577
```

The sensitivity to activation energy is much the larger. That is why Chapter 8 describes a way to measure it on the driver's own capacitors, and why the plan uses the capacitor maker's rule, which implies a stronger acceleration than 0.7 eV over this range, only as a cross-check, not to shorten the test.

## Allowing a failure

A zero-failure test has an unforgiving property: a single failure, even a random one, means the demonstration has not been made. Plans can instead allow one or more failures, at the cost of more units. With one failure allowed, the condition becomes that the probability of seeing no more than one failure, if R were only at the target, is at most 1 − C. For R = 0.90 at C = 0.90 and one life, that needs **38 units** instead of 22. For FL-60's two-life test with β = 2, each unit's chance of failing during the test, at the target, is 1 − 0.9⁴ = 0.344, and one failure allowed needs **10 units** instead of 6.

Allowing a failure buys robustness against an unlucky result, which matters when units are expensive to retest and chamber time is long. It does not buy permission to ignore failures: whatever the plan allows, every failure must be analysed and its mechanism understood.

## Credit from other evidence

A demonstration test is not the only evidence a business has, and a plan that ignores the rest asks the test to carry more than it must. The capacitor maker's own life tests, run on many more parts than any small manufacturer could afford, already show how the capacitor series ages; the prototype test of Chapter 6 showed the mechanism and its shape; and the thermal survey showed the temperatures. Formal methods exist for combining prior evidence with a new test, Bayesian demonstration plans among them, and they can reduce the units needed considerably when the prior evidence is strong and relevant.

The difficulty is the word "relevant". Prior evidence from a different capacitor series, a different board layout or a different maker's part can mislead as easily as it helps, and the formal methods are only as sound as the judgement that the earlier evidence applies. For a small business, the practical approach is usually simpler: use prior evidence to choose the shape, the acceleration model and the stress levels, as FL-60's plan did, and let the demonstration itself stand on the success-run arithmetic, so that anyone checking it can follow every step.

## Staging the test

A long demonstration need not be a single event at the end of development. FL-60's 172-day test can report at intervals: after one design life's equivalent, at about 2,061 hours, six survivors demonstrate R = 0.90 at a confidence of only 1 − 0.9⁶ = 0.47 for the full life, but they also show that no early or unexpected mechanism has appeared, which is valuable in itself. Interim measurements of every driver's output, ripple and capacitor temperatures show whether degradation is progressing as the model predicts. The business can then decide, with real data, whether to continue to the full length, add units, or stop and redesign. What it must not do is redefine the pass criterion after seeing the interim data, which turns a demonstration into a search for a favourable reading.

## The error: a failure explained away

This is an illustration. FL-60's demonstration ran for 4,123 hours with six production drivers. At 3,100 hours one driver stopped. The failure analysis found that a spring clip pressing the output rectifier against its heat sink had relaxed, the rectifier had overheated, and it had failed short. None of the capacitors had degraded. The test engineer, reasoning that the demonstration was about capacitor wear-out and the clip was not a capacitor, recorded the failure as "not relevant", and with five of six surviving, reported the demonstration as passed.

That reasoning was wrong in two ways. The target was for the driver, not for its capacitors, and a driver that fails in service from a relaxed clip is as dead as one that fails from dried electrolyte. And the clip's relaxation is itself a temperature-driven mechanism, accelerated by the chamber, which the test had found exactly as it was meant to. A failure can be excluded only if it is shown to be caused by the test itself, such as a fixture fault or a chamber excursion, not because it belongs to a mechanism the plan did not expect.

With one failure among six, the test demonstrated confidence of only about **0.67** for R = 0.90, not 0.92. The business treated the result as a design finding: the clip was replaced with a screw and spring washer, the change was checked with a thermal survey, and a new demonstration was run on ten drivers of the revised design, a plan that allows one failure, so that a single random event would not force another six-month repeat.

```figure
type: checklist
title: Checks on a demonstration test
caption: The open item is this chapter's error. A failure counts unless it is shown to be an artefact of the test.
- x Target written as R over a stated life, with C | R = 0.90 over 43,800 h, C = 0.90
- x Shape assumed conservatively, with its source | β = 2 against 2.57 measured
- x Acceleration factor's sensitivity reported | R from 0.58 to 0.90 across Ea and β
- x Units and duration from the formula, rounded up | 6 units, 4,123 h
- ? Every failure counted unless proved an artefact | relaxed clip excluded: real confidence 0.67
```

## How this applies to a small Australian business

Demonstration tests are where reliability claims meet budgets. A small manufacturer can rarely afford 22 units for a full design life, but it can afford six for two design lives, if it has good evidence for the shape and the acceleration, and it should say plainly what the test shows if that evidence is weaker than hoped. A short written plan, stating the target, the assumptions, the units, the hours and the rule for counting failures, agreed before the test starts, prevents most arguments afterwards, and it is exactly what a customer, an insurer or a distributor will ask for when they question a warranty or a durability claim.

## Exercise: eight units instead of six

The business considers putting **eight** drivers on test instead of six, with zero failures allowed, keeping β = 2 and two design lives. What confidence would eight survivors demonstrate for R = 0.90? Alternatively, how long would eight drivers need to run to demonstrate R = 0.90 at C = 0.90?

**Worked answer.** With eight survivors of two lives, the demonstrated confidence is 1 − 0.9^(8 × 4) = 1 − 0.9³² = **0.966**. Alternatively, solve 8 × m² × ln(0.9) = ln(0.1) for the test length: m² = 21.85 ÷ 8 = 2.73, so m = **1.65 design lives**, which is 1.65 × 43,800 ÷ 21.2 = about **3,410 hours** at 105 °C core, about 142 days instead of 172. Two more drivers either raise the confidence from 0.92 to 0.97 or shorten the test by about a month, and the business would choose according to whether time to market or margin against the assumptions mattered more.
