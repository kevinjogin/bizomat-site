---
book: first-of-a-kind-technology-by-the-numbers
chapterSlug: qualification-testing
order: 6
title: "Qualification testing: run length, feed envelope and yield basis"
description: "Size a qualification run with chi-square bounds (1,500 h for MTBF 500 h at 80%), test across a 5–13% contamination envelope, and correct a claimed 84% yield to 78.9%."
draft: true
---

A pilot shows that a process can work. A qualification run shows that it works well enough, for long enough, on the owner's feed, measured the owner's way. The difference matters most for a first-of-a-kind plant, because the pilot is usually the only physical evidence there is, and it was normally designed, fed and operated by the people who want to sell the technology. [Chapter 5](/reados/publications/first-of-a-kind-technology-by-the-numbers/scale-up-from-pilot-to-production/) found that the novel process's pilot never saw the water-loop concentration the full plant would run at, and the loop was retested at the full-scale bleed ratio. This chapter asks what else the evidence must show before the board can rely on the novel process.

It sizes a test for reliability with the chi-square bounds used in reliability demonstration, reads the pilot's 400 hours against them, sets a run length, spreads the run across the range of bales the recycler actually receives, and defines yield so that it can be compared with the proven line's guarantee. It ends with the correction that changes the rest of the book: the novel process's claimed 84% yield, rebuilt on the recycler's basis, is 78.9%.

## What a qualification run has to show

The US Government Accountability Office's readiness assessment guide, GAO-20-48G, treats readiness as something demonstrated by evidence, element by element, in an environment that represents the intended use. A qualification run is how a process plant produces that evidence for its critical elements. For the recycler it must show five things at once: that the process sustains its design **rate**; that it is **reliable** enough to run a shift pattern without constant stoppages; that its **yield** is what the business case assumes; that the **product** meets the flake specification, including 1.0% moisture; and that all four hold on the recycler's own bales, not on a feed chosen for the trial.

The pass criteria for each must be written down before the run starts. A criterion chosen after the results are known will tend to be one the results meet. Chapter 10 returns to this, because the same discipline later protects a much smaller decision.

```figure
type: checklist
title: What a qualification run must demonstrate
caption: Each item has a number and a test written before the run. Readiness is shown by evidence in a representative environment, not asserted from a pilot.
- Rate | 0.30 t/h through one full-size 250 mm hydrocyclone, its full-scale load, and the sorter at the full-scale 1.50 t/h per metre of belt
- Reliability | mean time between unplanned stops of at least 500 h, shown at 80% confidence
- Yield | saleable flake at 1.0% moisture as a share of bale mass received, by mass balance
- Product quality | moisture, polymer purity and fines content within the flake specification
- Feed | routine bales across the audited 5–13% contamination range, not selected feed
- Water loop | run at the full-scale bleed ratio of 0.667 m³/t, after reaching steady concentration
```

## Reliability: how long the run must be

Reliability is the hardest of the five to show quickly, because stoppages are rare events and a short run proves little about them. The standard approach, set out in reliability texts such as O'Connor and Kleyner's *Practical Reliability Engineering*, assumes that unplanned stops arrive at a constant rate during the run, so that the time between them is exponentially distributed with a mean called the **mean time between failures (MTBF)**. A **time-terminated test** runs for a fixed number of hours, T, and counts the stops, r. The lower confidence bound on MTBF is then

**MTBF lower bound = 2T ÷ χ²(C, 2r + 2)**

where χ²(C, 2r + 2) is the chi-square value with 2r + 2 degrees of freedom that is exceeded with probability 1 − C. Turned round, the hours needed to show a target MTBF with r stops allowed are

**T = MTBF target × χ²(C, 2r + 2) ÷ 2.**

This is an illustration. The recycler's plant runs 500 operating hours a month, so a target MTBF of **500 h** means, on average, no more than one unplanned stop of the wet section a month: the most the operations manager judged the shift pattern could absorb. At 80% confidence the run must last **805 h** if no stops are allowed, **1,497 h** if one is allowed and **2,140 h** if two are allowed. At 90% confidence the figures are 1,151, 1,945 and 2,661 h.

```figure
type: compare
title: Test hours needed to show an MTBF of 500 h
cols: 80% confidence | 90% confidence
rowhead: Stops allowed during the run
caption: This is an illustration. Hours = 500 × χ²(C, 2r + 2) ÷ 2 for a time-terminated test. Each stop allowed adds about 640 to 690 h at 80% confidence; the plan uses 1,500 h with one stop.
- None | 805 h, χ² 3.219 | 1,151 h, χ² 4.605
- * One | 1,497 h, χ² 5.989 | 1,945 h, χ² 7.779
- Two | 2,140 h, χ² 8.558 | 2,661 h, χ² 10.645
```

Two choices shape the answer. Allowing a stop costs about 690 more hours at 80% confidence, but a plan that allows none fails on the first stop, however good the process is, and the test then proves nothing about a plant that will certainly stop sometimes. Raising the confidence from 80% to 90% adds 346 to 521 h. The recycler chose 80%: the decision is commercial, the plant is not safety-critical, and the qualification is one input among several. A team qualifying equipment whose failure would hurt someone would choose differently.

The method is the time-based cousin of two others in the series. [Proving the pilot: acceptance tests and run length](/reados/publications/modular-projects-by-the-numbers/proving-the-pilot/) in *Modular Projects by the Numbers* sizes a zero-stoppage acceptance run by the rule of three, and [How many units, and for how long](/reados/publications/accelerated-life-testing-by-the-numbers/how-many-units-and-how-long/) covers success-run tests on many units at once. Here there is one plant section, so the evidence can only come from hours on test.

## Reading the pilot's 400 hours

The novel process's pilot ran **400 operating hours** with **2 unplanned stops**, both of the hydrocyclone stage. Its point estimate of MTBF is 400 ÷ 2 = **200 h**. The 80% lower bound is 2 × 400 ÷ 8.558 = **93.5 h**, and the 90% lower bound is **75.2 h**.

So at the confidence the recycler intends to use, the pilot supports an MTBF of under a fifth of the target. Even if the pilot had run its 400 hours with no stops at all, the 80% lower bound would have been 800 ÷ 3.219 = 248.5 h, still half the target. The point is not that the pilot was poor; 400 hours is simply too short to show 500 h between stops, whatever happens during it. The pilot was also run on one supplier-selected feed at 4% contamination, which matters for yield, below.

[Pass-fail tests: what a small sample can and cannot show](/reados/publications/prototypes-and-simulation-by-the-numbers/pass-fail-tests-and-small-samples/) in *Prototypes and Simulation by the Numbers* makes the same point for counts of passes and failures: a short clean record narrows the uncertainty much less than intuition suggests.

## The plan: 1,500 hours with one stop allowed

The process engineer's plan was a run of **1,500 h** on the pilot rig with **one stop allowed**, just above the 1,497 h required. At 20 operating hours a day that is **75 operating days**, or **12.5 weeks** at six days a week. At 0.30 t/h the run consumes **450 t** of bales, 150 hours' feed for the full plant, which the recycler can supply from its own yard.

The plan wrote down four rules before any hours were counted:

- **What counts as a stop.** Any unplanned halt of the wet section that needs intervention before feed can restart, whatever its length. Planned cleaning and screen changes at fixed intervals are not stops, provided the interval was declared in advance.
- **When the clock starts.** After the Chapter 5 retest at 0.2 m³/h of bleed, once the loop has run 92 h and reached 99% of its steady concentration of 3,000 mg/L COD. Hours at lower concentration are recorded but do not count, because they are not the plant's operating condition.
- **Who operates.** The recycler's own operators on rotating shifts, with the supplier's engineer on call, not at the controls. A run operated by the inventor shows what the inventor can do.
- **What passes.** At most one stop in 1,500 h. With none, the 80% lower bound is 932.0 h; with one, it is 501.0 h. Either passes.

The constant-rate assumption deserves a note. New plant often stops more in its first weeks, as loose fittings and control settings are found, and less afterwards. That is reliability growth, which Chapter 7 models. For qualification, the conservative choice is to start counting only after a declared shakedown, record every stop during it, and report both.

## Testing across the feed envelope

The recycler audited 30 of its bales: non-target contamination averaged **8%** and ranged from **5% to 13%**. The pilot's 4% feed lay below even the cleanest bale in the audit. A qualification run on clean feed would therefore measure the process on a feed the plant will never see.

Yield, for this process, is the saleable flake recovered as a share of the bale mass fed. If the process recovers a fixed share of the target polymer, HDPE and PP, whatever the contamination, then yield falls in proportion to the target content of the bale. Recovery of target polymer, worked out in the error case below, is **85.73%**. On bales with 5% contamination the yield would be 85.73 × 0.95 = **81.4%**; at 8%, **78.9%**; at 13%, **74.6%**.

```figure
type: range
title: Expected yield of the novel process across the recycler's bale audit
min: 70
max: 86
unit: %
ticks: 70 | 74 | 78 | 82 | 86
caption: This is an illustration, assuming a constant 85.73% recovery of target polymer. The supplier's 84% claim sits above the whole envelope because it was measured wet on 4% contamination feed.
- Bale audit range, 13% to 5% contamination | 74.6 | 81.4
- * Average bale, 8% contamination | 78.9 | 78.9 | the basis used from this chapter on
- Supplier's claim | 84.0 | 84.0 | weighed wet, 3% moisture, 4% feed
```

The constant-recovery assumption is itself something to test. Wet contaminants such as labels, paper fibre and food residue can load the hydrocyclones and the water loop more heavily on dirty bales, so recovery may fall as contamination rises. That is why the plan fed routine bales in the proportions they arrive, drawn from the yard without selection, and added a block of about 150 h on bales at the dirty end of the audit, at 11% contamination or more. The yield of each block was reported separately against its audited contamination. One yield point is worth **A$217,800 a year** excluding GST at full feed (180 t of flake at A$1,050 a tonne, plus A$160 a tonne of residue disposal avoided), so the spread across the envelope is worth knowing: the cleanest bales would add about A$560,000 a year against the average, the dirtiest would cost about A$934,000.

## Measuring yield on the right basis

A yield is a ratio, and both its top and bottom need a definition. The plan defined it as **dry saleable flake, at the 1.0% moisture specification, divided by bale mass as received**, measured by **mass balance** over each block of the run:

- Weigh every bale fed on a calibrated scale, and audit a sample for contamination.
- Weigh every bag of flake, sample its moisture, and correct the mass to 1.0% moisture. Flake outside the purity or moisture specification is not saleable and is not counted.
- Weigh the residue and the solids removed from the water loop, and sample their moisture.
- Check closure: feed in should equal flake, residue, solids and moisture losses out. The plan set a closure limit of 2% of feed mass; a block outside it is re-weighed, not averaged in.

The same definition was then applied to the proven line's guarantee, which reads "72% yield, dry, on feed with no more than 10% contamination". Only when both options are on one basis can the board compare them.

## The error: a yield measured wet on clean feed

The board paper carried the novel process's yield as **84%**, from the supplier's pilot report. When the process engineer applied the definition above, the first step was to ask the supplier for the measurement basis behind the figure. The reply showed that the 84% was flake **weighed wet at the bagging point, at 3% moisture**, as a share of a pilot feed with **4% contamination**, selected by the supplier. Both facts were in the report's appendix; neither was in its summary table. Each was true on its own basis, and nobody had misled anyone deliberately.

The process engineer then rebuilt the figure in three steps:

```figure
type: steps
title: From the claimed 84% to the recycler's expected yield
caption: This is an illustration. Each step changes the basis, not the process. The two corrections are worth A$369,600 and A$746,900 a year, A$1,116,500 together, at A$217,800 a point.
- Claimed yield, weighed wet | 84.0% of feed, flake at 3.0% moisture, pilot feed with 4% contamination
- Saleable at the 1.0% moisture specification | 84.0 × 0.97 ÷ 0.99 = 82.30%
- Recovery of target polymer | the pilot feed was 96% target, so 82.30 ÷ 0.96 = 85.73%
- * On the recycler's bales | 92% target on average, so 85.73 × 0.92 = 78.87%, written 78.9%
```

The gap between the claim and the expected yield is **5.13 points**, worth **A$1,116,500 a year** at A$217,800 a point. The moisture correction accounts for 1.70 points, A$369,600, and the feed correction for 3.43 points, A$746,900. The error was found because the qualification plan required a defined basis for every number that would be tested, and the claim could not be tested until its basis was known. It was corrected in the case and the board paper, and every later chapter uses **78.9%**.

The correction does not sink the novel process on its own. At 78.9% and full throughput, its steady contribution is still about A$6.03 million a year against the proven line's A$4.72 million. What it removes is most of the margin for anything else to go wrong, and [Chapter 7](/reados/publications/first-of-a-kind-technology-by-the-numbers/ramp-up-to-nameplate/) shows what the start-up does to the rest. The qualified yield needed to justify the novel process is calculated in Chapter 9.

The lesson generalises. Ask for the basis of every performance number: wet or dry, on what feed, over how long, measured by whom and with what scale. A claim that cannot be restated on the buyer's basis is not yet evidence.

## Exercise: two stops in 1,500 hours

The qualification run reaches 1,500 h with **two** unplanned stops. Does it show an MTBF of at least 500 h at 80% confidence? If the plan had allowed two stops from the start, how long would the run have needed to be?

**Worked answer.** With r = 2 the degrees of freedom are 2 × 2 + 2 = 6, and χ²(0.80, 6) = 8.558. The lower bound is 2 × 1,500 ÷ 8.558 = **350.5 h**, below 500 h, so the run fails, even though its point estimate, 1,500 ÷ 2 = 750 h, is above the target. A plan allowing two stops would have needed 500 × 8.558 ÷ 2 = **2,140 h**, or 107 operating days at 20 h a day, about 17.8 six-day weeks. Extending the run after the second stop until the bound passes is not the same as planning 2,140 h in advance: stopping a test when the numbers first look good, or extending it until they do, biases the result. The honest options are to report a fail, find and fix the cause of the stops, and start a new run under the same rules.
