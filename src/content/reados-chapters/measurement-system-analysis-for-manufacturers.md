---
title: "Measurement system analysis: making sure your gauges can tell good parts from bad"
description: "Every accept, reject and adjust decision trusts a measurement. How to check bias, repeatability and reproducibility, run a gauge R&R study, judge the result and fix a weak system."
publishDate: 2026-10-09
category: "Manufacturing"
tags:
  - quality
  - manufacturing
  - validation
author: "KEVOS®"
featured: false
draft: false
---

A machining business is rejecting more bores than usual. The operators say the process is fine; the inspector says the parts are oversize. Two people measure the same part with the same gauge and get readings 0.008 mm apart on a tolerance of 0.040 mm. Meanwhile the customer is asking for capability figures, and the numbers look poor. Before anyone touches the machine, a more basic question needs answering: can the measurement itself be trusted?

Every quality decision in manufacturing rests on a measurement. Accepting or rejecting a part, adjusting a machine, plotting a control chart, calculating capability, approving a first-off, settling a dispute with a customer: each assumes that the number on the gauge reflects the part. When the measurement system adds significant variation or bias of its own, good parts are rejected, bad parts are accepted, processes are adjusted for no reason and capability looks worse or better than it really is. The cost is real but usually invisible, because people blame the process rather than the measurement.

**Measurement system analysis (MSA)** is a structured way of finding out how much of the variation you see comes from the measurement itself, and whether the measurement is good enough for the decision it supports. This article explains the main sources of measurement error, the difference between calibration and MSA, how to run and interpret a gauge repeatability and reproducibility study, how to assess go/no-go and visual inspection, and how to improve a weak measurement system. It is general information for manufacturers and suppliers. Where a customer specifies a particular MSA method, such as for a production part approval submission, follow the customer's method.

## A measurement system is more than a gauge

The **measurement system** is everything that produces the number: the instrument, any fixture or setting master, the method, the person measuring, the environment, the part's own form and the way readings are recorded. Errors can enter at every step. A good micrometer used with inconsistent force, on a warm part, by someone who measures in a different place each time, is a poor measurement system.

Variation adds up. The variation you observe in a set of measurements combines the real variation in the parts and the variation introduced by measuring them. Statistically, the variances add: observed variance equals process variance plus measurement variance. A measurement system that contributes a large share of the observed variation makes a process look less consistent than it is, and hides real changes behind noise.

## The vocabulary of measurement error

Several terms are often confused:

| Term | Meaning | A practical sign of trouble |
|---|---|---|
| **Resolution** | The smallest change the instrument can display | Readings only ever show a few different values |
| **Bias (accuracy)** | The difference between the average measured value and the true or reference value | The gauge consistently reads high or low against a master |
| **Repeatability** | Variation when the same person measures the same part repeatedly with the same gauge | One person gets different answers on the same part |
| **Reproducibility** | Variation between different people (or set-ups) measuring the same part | Two people consistently get different answers |
| **Stability** | Change in bias over time | A gauge drifts between calibrations |
| **Linearity** | Change in bias across the measuring range | Accurate at small sizes, biased at large ones |

**Precision** usually refers to repeatability and reproducibility together. A gauge can be precise but inaccurate, repeating beautifully around the wrong answer, or accurate on average but imprecise.

## Resolution: the ten-to-one rule of thumb

A common workshop rule is that an instrument's resolution, and ideally its overall uncertainty, should be about one-tenth of the tolerance it is checking. A tolerance of 0.020 mm calls for an instrument that resolves 0.002 mm or better; a vernier or digital calliper reading to 0.01 mm is not suitable, however convenient. Where ten-to-one is not achievable, a ratio closer to five-to-one may be acceptable with good evidence from a measurement study, but the instrument should never be so coarse that it cannot distinguish parts across the tolerance.

Resolution is necessary but not sufficient. A digital readout showing three decimal places says nothing about whether those decimals are repeatable.

## Calibration and MSA are different checks

**Calibration** compares an instrument against a reference standard of known value and records any error, so that the instrument's readings can be traced back to national measurement standards. In Australia, calibration laboratories accredited by NATA, the National Association of Testing Authorities, provide this traceability.

**MSA** asks a different question: in our hands, on our parts, with our method, is this measurement system good enough for the decision we use it for? A freshly calibrated gauge can still give poor results if the method varies between people, the fixture lets the part move, or the parts' form makes the reading ambiguous. Both checks are needed. Calibration addresses accuracy against a standard; MSA addresses the whole system in use.

## Gauge repeatability and reproducibility studies

The most common MSA study for measured values is a **gauge repeatability and reproducibility (R&R) study** (often written "gage R&R" in North American references). A typical design:

1. **Select parts** that represent the full range of normal process variation, typically ten parts. Avoid ten nearly identical parts, which make any gauge look poor relative to the spread.
2. **Select appraisers**: usually three people who normally use the gauge.
3. **Measure each part several times**: each appraiser measures each part two or three times, in random order, without seeing their own or others' previous readings.
4. **Analyse the results**, by the average and range method or by analysis of variance, to separate the variation into repeatability (equipment variation), reproducibility (appraiser variation) and part-to-part variation.

Two practical points make the study meaningful. Measure the parts exactly as they are measured in production: same gauge, same fixture, same location on the part, same environment. And keep it blind: if appraisers know which part they are measuring, they tend to repeat their previous reading.

## Judging the result

The combined repeatability and reproducibility, often expressed as a percentage, is compared either with the tolerance or with the total observed variation:

- **Percentage of tolerance** suits gauges used to accept or reject parts.
- **Percentage of process variation** suits gauges used for process control and capability studies, where the measurement must distinguish parts within the natural spread of the process.

Widely used guidance from the automotive industry's MSA reference manual treats a measurement system with R&R under 10% as generally acceptable, between 10% and 30% as possibly acceptable depending on the importance of the characteristic, the cost of the gauge and the consequences of error, and over 30% as generally unacceptable. Many customers apply these bands, but some set their own, so check what applies.

```figure
type: layers
title: Judging a gauge R&R result
caption: After the automotive MSA reference manual; the number of distinct categories should also be adequate.
- *Under 10% | generally acceptable
- 10% to 30% | may be acceptable, depending on the application
- Over 30% | generally unacceptable
```

A second useful figure is the **number of distinct categories**: roughly how many groups of parts the measurement system can reliably tell apart within the process spread. It is calculated as about 1.41 times the ratio of part variation to measurement variation. A value of five or more is commonly recommended. A system that can distinguish only one or two categories is effectively a go/no-go gauge, however many decimals it displays.

The split between repeatability and reproducibility points to the fix:

- **Repeatability dominates**: the instrument, fixture or part location is the problem. Consider a better instrument, a fixture that locates the part consistently, maintenance of the gauge or measuring at a defined point.
- **Reproducibility dominates**: people are measuring differently. Standardise the method, define the measuring force and location, use setting masters, and train.

## Bias, linearity and stability

R&R studies measure precision, not accuracy. Check bias by repeatedly measuring a reference part of known value, such as a calibrated master, and comparing the average with the reference. Check linearity by doing this at several points across the range the gauge is used for. Check stability by measuring the same master regularly over time and plotting the results on a control chart. A gauge that drifts shows up long before its next scheduled calibration.

## Attribute gauges and visual inspection

Many acceptance decisions are pass or fail: go/no-go plug and ring gauges, templates, visual checks of finish or appearance. These need a different kind of study, usually called an **attribute agreement analysis**:

1. Assemble a set of parts, typically 30 to 50, including clearly good parts, clearly bad parts and parts close to the limits.
2. Establish the correct decision for each part, using a better measurement method or expert agreement.
3. Have several inspectors assess each part two or three times, blind and in random order.
4. Calculate how often each inspector agrees with themselves, with each other and with the correct decision, and how often good parts are rejected (false alarms) or bad parts accepted (misses).

Visual inspection studies often reveal large differences between inspectors, especially near the limits. Clear boundary samples, defined lighting and viewing conditions, and photographs of acceptable and unacceptable conditions usually improve agreement more than exhortation does.

## Go and not-go gauges

Fixed limit gauges remain efficient for high-volume checks. The principle is simple: the **go gauge** checks the maximum material condition and should pass freely, while the **not-go gauge** checks the minimum material condition and should not pass. A go gauge can check the combined effect of several features at once, such as the full form of a thread, while a not-go gauge should check one dimension at a time. Fixed gauges wear, particularly the go side, so they need regular checking against masters or calibrated measurement, and should be withdrawn when worn beyond their own limits.

## Keeping the measurement system under control

A gauge control programme does not need to be elaborate:

- **A register** of every gauge used for product acceptance or process control, each with a unique identity.
- **Calibration intervals** based on use, risk and history, with status labels on each gauge.
- **An out-of-tolerance procedure**: when a gauge is found out of calibration, assess which parts were measured with it since its last good check and whether any need to be recalled or re-checked.
- **Controlled storage and handling**, especially for masters and precision instruments.
- **Environment**: dimensional measurements are referenced to 20 °C. Large temperature differences between parts and gauges, especially for steel parts straight off a machine, produce real errors on tight tolerances.
- **MSA for new gauges and methods**, and repeat studies when the gauge, method or process changes significantly.
- **Correlation with customers**: where your measurements and your customer's must agree, compare results on the same parts early, before a dispute.

The [PPAP for small suppliers](/reados/collections/manufacturing-quality/ppap-for-small-suppliers/) article explains where measurement studies fit in a customer approval package.

## Common causes of measurement error on the shop floor

- **Inconsistent force**, for example on micrometers used without a ratchet or friction thimble.
- **Measuring at different places** on a part with form errors, such as a bore that is slightly oval or lobed. A two-point measurement can miss lobing that a three-point instrument detects.
- **Angular errors**: a test indicator with its stylus at an angle to the surface over-reads, by roughly 6% at 20 degrees.
- **Worn jaws, anvils or gauges.**
- **Dirt, burrs and coolant** on the part or gauge faces.
- **Temperature differences** between the part, the gauge and the reference.
- **Rounding and transcription errors**, which automatic data capture can remove.

## A worked example

This is an illustrative example. A machining business makes valve bodies with a critical bore of 20.000 mm, toleranced at plus or minus 0.020 mm, so the tolerance width is 0.040 mm. The bore is measured with a dial bore gauge. Capability figures look borderline, at a Cp of about 1.11, and operators and inspectors often disagree.

**The study.** The quality lead selects ten parts spanning the normal range and asks three operators to measure each part three times, blind and in random order. The analysis estimates repeatability at a standard deviation of about 0.0025 mm and reproducibility at about 0.0030 mm. Combined, the measurement standard deviation is about 0.0039 mm. Expressed as six standard deviations against the 0.040 mm tolerance, the R&R is about 59%, well over the 30% guide. The number of distinct categories is below two. The gauge cannot reliably tell parts apart within the process spread.

**What it means for capability.** The observed process standard deviation was about 0.0060 mm. Subtracting the measurement variance from the observed variance suggests the real process standard deviation is about 0.0046 mm, which would give a Cp of about 1.46, not 1.11. The process was better than it looked; the measurement was the problem.

**First improvement.** Watching the operators reveals three different techniques for finding the minimum reading as the gauge is rocked in the bore, and setting is done against different references. The team writes a one-page method with photographs, introduces a single setting master and adds a simple fixture to hold the part square. A repeat study shows repeatability of about 0.0012 mm and reproducibility of about 0.0010 mm, giving an R&R of about 23%. That falls in the marginal band.

**Second improvement.** Because the bore is a special characteristic for the customer, the business invests in an air gauge for this feature. A third study shows R&R under 10%, and the number of distinct categories is now comfortably above five. The observed Cp rises to about 1.45, without any change to the machining process.

```figure
type: bars
title: Gauge R&R on a 20.000 ± 0.020 mm bore
unit: %
max: 65
caption: Observed Cp rose from about 1.11 to 1.45 without changing the machining at all.
- Original bore gauge | 59
- One technique, one master, a fixture | 23
- *Air gauge | 10 | under 10%
```

**Keeping it.** The air gauge is added to the gauge register with a daily check against its master, plotted on a simple chart, and the study is scheduled to be repeated after any change to the gauge or method.

## Applying this in an Australian manufacturing business

- **List the gauges** used for acceptance and control, starting with critical characteristics.
- **Check resolution** against tolerance before anything else.
- **Use calibration for traceability** through accredited laboratories, and MSA for fitness in use.
- **Run R&R studies** with real parts, real people and real methods, blind.
- **Use the split** between repeatability and reproducibility to target the fix.
- **Study attribute and visual inspection** too, using boundary samples.
- **Control temperature, cleanliness and handling** for tight tolerances.
- **Assess the impact** when a gauge is found out of calibration.
- **Agree measurement methods with customers** early.

## Where measurement programmes go wrong

- **Assuming calibration proves a gauge is fit for purpose.**
- **Studying parts that are all nearly identical**, which makes any gauge look poor.
- **Letting appraisers see previous readings.**
- **Using convenient instruments** with inadequate resolution.
- **Ignoring visual and go/no-go inspection.**
- **Blaming the process** for variation the gauge adds.
- **Never repeating studies** after methods or equipment change.

## Questions to ask about your measurements

- Which decisions in our business depend on each gauge?
- Is each gauge's resolution suitable for the tolerance it checks?
- When did we last study repeatability and reproducibility on our critical characteristics?
- Do different people measure the same way, and can we show it?
- How would we know if a gauge drifted between calibrations?
- What happens to parts already shipped when a gauge is found out of calibration?
- Do our measurements agree with our customer's?

## Bringing it together

Every quality decision trusts a measurement, so the measurement deserves the same scrutiny as the process. Understand the difference between resolution, bias, repeatability, reproducibility, stability and linearity. Use calibration for traceability and measurement system analysis for fitness in use. Run gauge R&R studies with realistic parts, appraisers and methods, judge the results against the decision the gauge supports, and use the split between equipment and appraiser variation to target improvements. Extend the same discipline to go/no-go and visual inspection. Often the cheapest quality improvement available is not a new machine but a measurement system that finally tells the truth. The [proving a process is ready for production](/reados/collections/product-development-and-launch/proving-a-process-is-ready-for-production/) article shows how trusted measurement underpins stability and capability evidence.

---

*Source: KEVOS® editorial notes, drawing on earlier KEVOS® manufacturing handbooks on PPAP measurement systems analysis, measuring instruments and inspection methods, and production gauging and inspection practice. The worked example is illustrative. This article is general information; follow your customers' specific MSA requirements.*
