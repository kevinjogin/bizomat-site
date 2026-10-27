---
book: accelerated-life-testing-by-the-numbers
chapterSlug: step-stress-and-halt
order: 8
title: "Finding the margins: HALT, step stress and measuring Ea"
description: "Highly accelerated life testing and what it is not, operating and destruct limits, choosing safe ALT stresses, measuring activation energy from degradation, and a weak link dismissed."
draft: false
---

The tests in the earlier chapters ask how long the product lasts under a known stress. A different question comes first: how much stress can the product take before it stops working or breaks, and what gives way first? The answer shows where the design's weak links are, sets the ceiling for any accelerated life test, and often finds problems that no life test would, because they appear only under stresses that service rarely reaches but sometimes does.

This chapter describes highly accelerated life testing, HALT, and the step-stress method it uses, explains the operating and destruct limits it finds and why it gives no life prediction, uses FL-60's HALT results to choose the life-test stresses of earlier chapters, and shows how to measure an activation energy from degradation at three temperatures instead of waiting for failures. It ends with a HALT failure that was dismissed as unrealistic.

## Step stress

A step-stress test applies a stress in increasing steps, holding each step long enough for the product to stabilise and be checked, until something happens. For temperature, a typical step is 10 K with a dwell of 10 or 20 minutes and a functional check at each step; for vibration, steps of a few g rms. The product runs throughout, and its behaviour is monitored continuously, so that the first step at which it misbehaves is recorded.

Two limits come out of a step-stress test. The **operating limit** is the stress at which the product stops working correctly but recovers when the stress is reduced. The **destruct limit** is the stress at which it fails permanently. The difference between the product's specification and its operating limit is its **operating margin**; the difference to the destruct limit is its **destruct margin**. A product with wide margins tolerates the variation between units, the unusual installation and the occasional extreme day; a product with narrow margins fails in the field whenever those coincide.

## HALT

HALT applies step stresses one at a time and then in combination, typically cold steps, hot steps, rapid thermal transitions between extremes, vibration in all axes at once, and finally combined temperature and vibration. It is deliberately severe, going well beyond the specification, because its purpose is to make the product fail quickly and show where it is weakest. Each failure is analysed, the weak point is fixed if the fix is reasonable, and the test continues or is repeated to find the next weak point, raising the margins step by step.

HALT is not a life test. It produces no acceleration factor and no life prediction, because its stresses deliberately exceed the limits within which the acceleration models of Chapters 2 to 5 hold, and the failures it causes are often overstress failures, not wear-out. Its value is qualitative and practical: it finds design weaknesses early and cheaply, and it tells the life test where the ceiling is.

```figure
type: range
title: FL-60 driver HALT limits against its specification, chamber air temperature
unit: °C
min: -80
max: 120
caption: This is an illustration. Specification −20 to +50 °C. The hot operating limit is a protective shutdown by design; the hot destruct limit is a semiconductor failure. No cold destruct limit was found down to the chamber's −80 °C.
- Specification | -20 | 50 | ambient around the driver in service
- * Operating limits | -55 | 95 | recovers when returned to specification
- Destruct limits | -80 | 115 | no cold destruct found; hot: output switch failed short
- Planned life test | 70 | 70 | chamber set for a 105 °C hottest-capacitor core
```

This is an illustration. FL-60's driver was run through HALT in a hired chamber. On cold steps, it stopped starting reliably at **−55 °C**, because its control circuit's start-up supply fell below its threshold, and it recovered fully on warming; no permanent damage occurred down to the chamber's limit of **−80 °C**. On hot steps, its designed thermal foldback began reducing output at a chamber temperature of 85 °C, as intended; at **95 °C** the controller's protective shutdown operated, the operating limit; and at **115 °C** the output switching transistor failed short, the destruct limit. Rapid transitions between −50 °C and +90 °C at about 60 K a minute caused no failures in ten cycles. Vibration steps found one weak point, described in the error below.

The driver's hot operating margin is therefore 95 − 50 = **45 K** and its destruct margin **65 K**, comfortable for an outdoor product. The cold operating margin is 35 K, and the start-up behaviour at −55 °C was judged acceptable for Australian service, where FL-60 will not meet such cold, though the business noted it for any future alpine or export variant.

### Running a HALT well

A HALT is short, typically two to four days in a hired chamber, and the time is easily wasted. Three things make it productive. First, **monitoring**: the product must be powered and exercised throughout, with its outputs logged continuously, because many failures are intermittent and appear only at a particular stress; a product checked only between steps can pass a step at which it was misbehaving. Second, **temperatures measured on the product**: chamber air temperatures mean little for a powered product with its own heat, and the limits should be reported both as chamber temperature and as the temperature of the parts that failed. Third, **a small number of units**, usually two to four, with spares of the parts expected to fail, so that a weak link can be fixed on the spot and the test continued to find the next one.

The output of a HALT is a list, not a number: each weak link, the stress at which it appeared, its root cause, the fix chosen or the reason for not fixing it, and the limits finally reached. That list is one of the most useful documents in a product's development file, because it records what the design's real limits are and why.

## Choosing life-test stresses from HALT

The HALT limits set a ceiling for the accelerated life tests. A life test must run below the operating limit, with margin, so that its stress accelerates wear-out without tipping the product into protective modes or overstress mechanisms. For FL-60's driver, a chamber at **70 °C** gives a hottest-capacitor core of 105 °C, the capacitor's rating and the temperature used in Chapters 6 and 7. That chamber temperature is 25 K below the hot operating limit and 15 K below the onset of thermal foldback, so the driver runs at full output throughout, as it must if the test is to represent service.

The same reasoning applied to the other tests. The thermal-cycling profile of Chapter 5 for the LED board, −40 °C to +100 °C, sits inside the board's own HALT limits, found in a separate run. And the humidity test of Chapter 4 at 85 °C ran the driver at a chamber temperature below its foldback threshold.

```figure
type: steps
title: From HALT to life-test stresses
caption: This is an illustration of the order FL-60's programme followed. HALT comes first because it finds the ceiling and the weak links before chamber time is spent on long tests.
- HALT | find operating and destruct limits; fix weak links that are cheap to fix
- Margins reviewed | specification against limits; accept or redesign
- Mechanisms listed | capacitor wear-out, solder fatigue, corrosion, clip relaxation
- * Life-test stresses chosen | below operating limits, at or below every part's rating
- Acceleration measured where uncertain | degradation at three temperatures for Ea
- Demonstration tests | Chapters 4, 5 and 7
```

## Measuring the activation energy from degradation

Chapter 7 showed that FL-60's demonstration rests most heavily on the activation energy. Measuring it by running units to failure at three temperatures would take years at the lower temperatures, since the prototype drivers' characteristic life at a 105 °C core was already about 6,000 hours. A faster route uses **degradation**: instead of waiting for failure, measure how quickly a property drifts towards its failure limit at each temperature. If the drift is a thermally activated process, its rate follows the Arrhenius model, and the activation energy comes from how the rate changes with temperature.

This is an illustration. The business ran three groups of the production driver's hottest capacitor, on their drivers, with cores at **85 °C, 95 °C and 105 °C**, for 1,000 hours each, measuring capacitance every 100 hours. Each group's capacitance fell steadily, and the rate of loss was found from a straight-line fit.

```figure
type: compare
title: Capacitance loss rate of FL-60's capacitor at three core temperatures
cols: Loss rate, % per 1,000 h | 1/T, per K | ln(rate)
caption: This is an illustration. A straight line through ln(rate) against 1/T has a slope of −Ea/k; the fit gives Ea = 0.70 eV, which supports the value used in Chapters 2 and 7.
- 85 °C | 1.80 | 0.0027921 | 0.588
- 95 °C | 3.51 | 0.0027163 | 1.256
- * 105 °C | 6.00 | 0.0026445 | 1.792
```

Plotting ln(rate) against 1/T gives a straight line whose slope, multiplied by −k, is the activation energy. A least-squares fit through the three points gives a slope of about −8,160 K, so Ea = 8,160 × 8.617 × 10⁻⁵ = about **0.70 eV**. The measurement took six weeks of chamber time in total, run in parallel in three chambers, and it turned the most important assumption in the demonstration plan into a measured value.

Degradation testing needs care. The property measured must be the one that leads to failure, and its relationship to the failure limit must be known; the drift must be steady enough to fit; and all three temperatures must be below any limit that would change the mechanism, which is why the highest is the capacitor's 105 °C rating. A straight line through the three points is also a check on the model: if the 95 °C point had fallen well off the line, it would have suggested a second mechanism, the trap of Chapter 2.

## Step-stress life tests

A related technique, the **step-stress accelerated life test**, runs units at one stress for a while, then raises it, and so on, until they fail, and then uses a model of how damage accumulates across steps to estimate life at use conditions. It can produce failures from fewer units in less time than constant-stress tests. Its weakness is its dependence on the cumulative damage model and on the assumption that the mechanism is the same at every step, both of which are harder to check than in a constant-stress test. For a small business, constant-stress tests at two or three levels, with degradation measurement where possible, are usually easier to defend.

## The error: a weak link dismissed

This is an illustration. In FL-60's HALT vibration steps, the driver ran without fault up to 25 g rms of random vibration. At **30 g rms**, its output became intermittent, and inspection found that the leads of the large output inductor had cracked at the board, where the heavy component's mass rocked it on its leads. The team discussed the finding and set it aside: 30 g rms was far beyond anything a floodlight on a pole would meet, and the HALT report recorded the failure as "beyond any realistic service condition".

Two years after launch, a distributor returned a batch of floodlights from a customer who had mounted them on the frame of a mobile screening plant at a quarry. Several had failed with intermittent output, and their drivers showed cracked inductor leads, the same failure HALT had found. The screening plant vibrated far less than 30 g rms, but it did so for thousands of hours, and the leads had fatigued.

HALT's lesson is that the stress at which a weak link appears does not decide whether to fix it. What decides is the cost of the fix against the consequences of the failure. A drop of adhesive at the inductor's base, staking it to the board, cost almost nothing and, in a repeat HALT, raised the vibration destruct limit beyond the chamber's capability. The business made the change, added the staking to the assembly drawing, and changed its HALT procedure: every HALT failure gets a decision recorded against the cost of the fix, and "unrealistic stress" is not, on its own, a reason to leave a weak link in place.

```figure
type: checklist
title: Checks on a HALT programme
caption: The open item is this chapter's error. HALT finds weak links; whether to fix them is a cost decision, not a stress-level decision.
- x Operating and destruct limits found for each stress | temperature, transitions, vibration
- x Every failure analysed to root cause | start-up supply, output switch, inductor leads
- x Margins compared with the specification | 45 K hot operating margin
- x Life-test stresses set below operating limits | chamber 70 °C, 25 K below 95 °C
- ? Each weak link judged by the cost of its fix | inductor staking: almost free, but dismissed
```

## How this applies to a small Australian business

HALT chambers are expensive to own but can be hired by the day from test laboratories, and a day or two of HALT early in development often finds more design problems than months of conventional testing. For a small manufacturer, the practical sequence is: HALT on early prototypes to find weak links and limits; fix what is cheap to fix; then life tests at stresses chosen from the HALT limits, with degradation measurements to pin down the parameters that matter most. Australian products meet extremes, such as heat in the north, cold nights inland, vibration on mining and agricultural equipment, and salt on the coast, and margins found in HALT are what carry a product through the installation nobody expected.

## Exercise: a two-point estimate

Suppose the business had run only two degradation groups, at 85 °C and 105 °C, with loss rates of 1.80% and 6.00% per 1,000 hours. What activation energy would the two points give, and what does the third point add?

**Worked answer.** The slope between the two points is [ln(6.00) − ln(1.80)] ÷ (1/358.15 − 1/378.15) = (1.792 − 0.588) ÷ (2.7921 × 10⁻³ − 2.6445 × 10⁻³) = 1.204 ÷ 1.477 × 10⁻⁴ = about **8,150 K**, so Ea = 8,150 × 8.617 × 10⁻⁵ = about **0.70 eV**, the same as the three-point fit. Two points always fit a straight line exactly, so they cannot show whether the Arrhenius model holds between them. The third point, at 95 °C, tests the model: it falls on the line, which shows that a single mechanism with a single activation energy describes the drift across the range. Had it fallen well off the line, the business would have known that its acceleration model was suspect before relying on it.
