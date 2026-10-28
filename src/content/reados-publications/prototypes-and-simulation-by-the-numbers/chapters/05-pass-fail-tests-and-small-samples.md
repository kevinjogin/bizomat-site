---
book: prototypes-and-simulation-by-the-numbers
chapterSlug: pass-fail-tests-and-small-samples
order: 5
title: "Pass-fail tests: what a small sample can and cannot show"
description: "Success-run sample sizes (22 for R 0.90 at C 0.90), exact binomial bounds, why 3 of 3 passes shows only R above 0.368, and a A$18,100 specimen drop test in place of A$209,000 of units."
draft: true
---

Many development tests have only two outcomes. The unit survives the drop or it does not; the inverter starts the saw or it trips; the RCD trips within its time or it does not. Results like these are easy to record and easy to misread. "Passed, 3 of 3" sounds like evidence that the design is sound. It is evidence of something, but much less than it sounds, and the honest way to report it is to say how low the true pass rate could still be.

This chapter covers the arithmetic of pass/fail testing on small samples. It explains what confidence means, sizes a zero-failure test with the success-run formula, shows what allowing a failure costs in sample size, and uses exact binomial bounds to state what any result shows. It then compares testing whole units with testing specimens, and ends with a drop test that passed 3 of 3 and was reported as a pass, until a reviewer asked for the bound.

## Attribute tests in development

A test whose result is pass or fail is an **attribute test**. The BPU-5 programme has several: the 300 mm corner drop of requirement R3; repeated starts of a 2.4 kW drop saw and a 230 mm angle grinder; trip tests of the RCD-protected outlets. For each, the quantity of interest is the **reliability** R, the probability that a unit built to the design passes the test. A test on a sample of units estimates R, and the question is how well.

Some of these tests sit beside formal requirements. Subsection 38.3 of the UN Manual of Tests and Criteria sets the tests lithium batteries must pass before transport; IEC 62619 sets safety requirements for industrial lithium cells and batteries; AS/NZS 3012 covers electrical installations on construction and demolition sites, including the in-service testing of equipment used there. Which apply to a real product, and how compliance is shown, needs an assessment by competent people. The BPU-5's R3 is the business's own requirement, set from how site equipment is handled, and this chapter is about planning and reading tests like it.

A measured result, such as usable energy in kilowatt-hours, carries far more information per unit than a pass or a fail, because it shows how close each unit came to the limit. [Measured performance: sample sizes for means and comparisons](/reados/publications/prototypes-and-simulation-by-the-numbers/measured-performance-and-sample-size/) covers those tests. Where a pass/fail result is all a test can give, the sample sizes below apply.

## What confidence means

A statement such as "R is at least 0.90 with 90% confidence" has a precise meaning. It does not mean there is a 90% chance that R is above 0.90. It means the test was designed so that if R were actually below 0.90, a result as good as the one observed would occur less than 10% of the time. **Confidence** C is a property of the test procedure: run it many times on designs whose true R is exactly 0.90, and it falsely declares success in at most 1 − C of them.

That framing tells you what to report. After a test, the useful number is the **lower confidence bound** on R: the lowest reliability that is still reasonably consistent with what was observed. If that bound is below the requirement, the test has not shown the requirement is met, whatever the raw pass count looks like.

## The success-run test

The simplest plan tests n units and accepts the design only if all n pass. If the true reliability were R, the chance that all n pass is R^n. To demonstrate R at confidence C, choose n so that R^n is no more than 1 − C, which gives the **success-run** formula:

n = ln(1 − C) ÷ ln(R), rounded up.

For R = 0.90 at C = 0.90, n = ln(0.10) ÷ ln(0.90) = 21.85, so **22** units must pass with no failures. If the true reliability were exactly 0.90, all 22 would pass only 0.90²² = 9.85% of the time, below the 10% the confidence allows.

```figure
type: bars
title: Units that must pass with zero failures to show reliability R at confidence C
unit: units
max: 230
caption: Success-run sample sizes, n = ln(1 − C) ÷ ln(R), rounded up. Raising confidence costs a few units; raising the reliability to be shown costs many.
- R 0.90, C 0.90 | 22
- R 0.90, C 0.95 | 29
- R 0.95, C 0.90 | 45
- R 0.95, C 0.95 | 59
- * R 0.99, C 0.90 | 230
```

The pattern in the figure is the important part. Going from 90% to 95% confidence at R = 0.90 adds 7 units. Going from R = 0.90 to R = 0.99 at the same confidence multiplies the sample by more than 10. High reliabilities cannot be demonstrated by testing small builds, however carefully; they have to come from understanding the failure mechanism, designing margin against it, and using tests to check the margin. The same formula, applied to demonstrating life rather than surviving a single test, is worked in [How many units, and for how long](/reados/publications/accelerated-life-testing-by-the-numbers/how-many-units-and-how-long/) in *Accelerated Life Testing by the Numbers*.

## Allowing failures

A zero-failure plan is harsh on a good design. If the BPU-5's tray actually had a reliability of 0.95 in the drop, comfortably above the 0.90 to be shown, it would pass all 22 specimens only 0.95²² = **32.4%** of the time. A design that is genuinely good would usually fail the test.

Allowing one or more failures in a larger sample gives a good design a better chance. The plan becomes: test n, and accept if no more than f fail. The sample size is the smallest n for which the chance of f or fewer failures, at a true reliability of exactly R, is no more than 1 − C. For R = 0.90 at C = 0.90, allowing **1 failure** needs **38** units, and allowing **2 failures** needs **52**. With 38 specimens and one failure allowed, a design with true reliability 0.95 passes **42.7%** of the time, better than 32.4%, at the cost of 16 more specimens.

The choice must be made before the test. A team that plans 22 with no failures, sees one failure, and then decides that one failure in 22 is acceptable has not run any valid plan: 21 of 22 does not show R = 0.90 at 90% confidence, as the bounds below make clear.

## What a result shows: exact binomial bounds

The success-run formula plans a test. To read a result, with or without failures, use the exact binomial bounds of **Clopper and Pearson** (1934). The one-sided lower bound on R at confidence C, after x passes in n trials, is the reliability at which a result of x or more passes would occur with probability exactly 1 − C. In a spreadsheet it is BETA.INV(1 − C, x, n − x + 1). When every trial passes, it reduces to (1 − C)^(1/n): for 3 of 3 at 95%, 0.05^(1/3) = 0.368.

```figure
type: compare
title: What pass/fail results show: one-sided lower bounds on reliability
cols: Lower bound at 90% | Lower bound at 95%
caption: Exact Clopper-Pearson bounds. Three passes from three trials are consistent with a reliability as low as 0.368 at 95% confidence. Only 22 of 22 clears 0.90 at 90%.
- * 3 of 3 passed | 0.464 | 0.368
- 12 of 12 passed | 0.825 | 0.779
- 11 of 12 passed | 0.713 | not used
- 21 of 22 passed | 0.834 | not used
- 22 of 22 passed | 0.901 | 0.873
- 37 of 38 passed | 0.901 | not used
```

The bounds put small samples in proportion. Three passes from three is what you would see one time in eight even if the true reliability were only 0.5, since 0.5³ = 0.125. Twelve of twelve, the whole BPU-5 DVT build, still leaves a 95% lower bound of only 0.779. One failure costs a lot: 11 of 12 gives 0.713 at 90% against 12 of 12's 0.825, and 21 of 22 gives 0.834 against 22 of 22's 0.901.

### The rule of three as a cross-check

For a quick check of a zero-failure result, the **rule of three** (Hanley and Lippman-Hand, 1983) says that after zero events in n trials, the 95% upper bound on the probability of the event is about 3 ÷ n. After 22 passes with no failures, the 95% upper bound on the failure probability is about 3 ÷ 22 = 0.136; the exact value is 1 − 0.873 = 0.127. The rule is a slightly cautious approximation and works best for n above about 30. Its use for sizing a stoppage-free run on a production cell is shown in [Proving the pilot: acceptance tests and run length](/reados/publications/modular-projects-by-the-numbers/proving-the-pilot/) in *Modular Projects by the Numbers*.

### Trials must be independent

Every number in this chapter assumes that each trial is an independent draw from the population of units the design will produce. Two common practices break that assumption. Dropping the same unit several times counts one unit's strength several times, and damage from earlier drops makes later results neither independent nor representative. Taking every specimen from one moulding run, or one welder's shift, samples only that run's variation, and a weak batch elsewhere would go unseen. For the BPU-5, each specimen was dropped once, and the specimens were drawn from several moulding runs and welded by both of the welders who would build production trays. Where independence cannot be achieved, the bounds overstate what the test shows.

## Whole units or specimens

This is an illustration. Twenty-two whole BPU-5 units, dropped and then inspected and functionally tested, would cost about **A$9,500** each at DVT, excluding GST, or **A$209,000**, and the DVT build has only 12 units, most of them needed for other tests. The mechanical design engineer proposed testing **specimens** instead: a moulded corner section from the production tool, with the battery tray and its brackets fitted, loaded with ballast so that the corner and tray carry the same impact as in a whole-unit drop. Each specimen costs **A$650**, and a drop fixture to hold and release them consistently costs **A$3,800**, so 22 specimens cost 14,300 + 3,800 = **A$18,100**.

```figure
type: balance
title: Testing R3 with 22 whole units or 22 specimens
left: 22 whole units, A$209,000
right: 22 specimens, A$18,100
tilt: left
caption: This is an illustration, excluding GST. The specimens cost under a tenth as much, and they are valid only if they reproduce the corner, the tray and the load path of the whole unit.
- 22 × A$9,500 a unit | 22 × A$650 a specimen, A$14,300
- More units than the 12-unit DVT build | drop fixture, A$3,800
- Every failure mode in the unit is present | only the corner and tray failure modes are present
```

A specimen represents the unit only for the failure modes it contains. The corner-and-tray specimen reproduces the moulded corner's wall thickness, the tray, its brackets and welds, and the inertia loads on the tray. It does not reproduce damage elsewhere, such as an inverter's heat sink breaking loose, or loss of function from a connector unseating. The team therefore kept a small number of whole-unit drops as a check that no other failure mode appears, and relied on the specimens for the statistical demonstration. This is the fidelity argument of Chapter 2 again: the specimen is credible because it contains the features that drive the answer.

## The error: "drop test passed, 3 of 3"

This is an illustration. The first DVT test report on R3 said: **"drop test passed, 3 of 3"**. Three DVT units had been dropped 300 mm on to a corner, inspected, and powered up; all three passed. The tool-commitment decision in [The value of a test](/reados/publications/prototypes-and-simulation-by-the-numbers/the-value-of-a-test/) had already been made on the shell test, and this was the first test of the moulded product.

At the DVT review, a reviewer asked for the lower bound. Three of three gives a 95% lower bound of **0.368**: the result was consistent with a design that fails the drop nearly two times in three. It showed the design was not hopeless, and nothing more. The review recorded R3 as not yet demonstrated and asked for the planned demonstration, R = 0.90 at C = 0.90, which needs 22 passes with no failures.

The team ran the 22-specimen test. One specimen failed: the weld on a **tray bracket** cracked. With 21 of 22, the lower 90% bound is **0.834**, below 0.90, so the test failed. The team did not reinterpret the result: switching after the event to a plan that allows one failure would need 38 specimens with at most one failure, and 21 of 22 is not that. The bracket was redesigned with a larger weld return and a gusset, logged as one DVT-stage issue at A$15,000, and a fresh 22-specimen test was run on the new design. All **22 of 22** passed, a lower 90% bound of **0.901**, and R3 was recorded as demonstrated for the drop failure modes the specimens contain.

The error was in the report, not the test: "passed" described the three units, and the reader took it as a statement about the design. The business changed its report template so that every pass/fail result states the number tested, the number passed, and the lower bound at the planned confidence. [Design reviews and the release decision](/reados/publications/prototypes-and-simulation-by-the-numbers/design-reviews-and-release/) shows how those bounds become release criteria.

```figure
type: checklist
title: Before reporting a pass/fail test
caption: This is an illustration. The crossed item is the DVT report's error. A pass count without a bound invites the reader to assume far more than the test showed.
- State the reliability and confidence the test was planned to show | R 0.90 at C 0.90 for the drop
- Fix the sample size and failures allowed before testing | 22 with none, or 38 with one
- Report number tested, number passed and the lower bound | 21 of 22: 0.834 at 90%
- Say which failure modes the test article contains | specimens: corner and tray only
- x Report "passed" without the bound | 3 of 3 shows only R above 0.368 at 95%
- x Change the plan after seeing a failure | 21 of 22 is not a pass on any plan made in advance
- ? Would a measured result say more | strain or deflection at the bracket instead of crack or no crack
```

## Exercise: a plan that allows one failure

The team considers planning the retest to allow one failure, so that a single unlucky specimen does not fail an otherwise good design. For R = 0.90 at C = 0.90, how many specimens are needed? What does 37 of 38 show? What does the tolerance of one failure cost in specimens, compared with the zero-failure plan?

**Worked answer.** The smallest n for which one or fewer failures has a probability of no more than 0.10 when R = 0.90 is **n = 38**. If 37 of 38 pass, the Clopper-Pearson lower 90% bound is **0.901**, just above 0.90, so the plan works as intended. The zero-failure plan needs 22, so the extra 16 specimens cost 16 × A$650 = **A$10,400**, excluding GST, with the same A$3,800 fixture. In return, a design whose true reliability is 0.95 passes 42.7% of the time instead of 32.4%. Whether that is worth A$10,400 depends on what a false rejection would cost: another redesign and retest. The plan must be chosen before the specimens are dropped.
