---
book: fits-that-work
chapterSlug: make-measurement-and-acceptance-agree
order: 6
title: "Make measurement and acceptance agree"
description: "Build a transparent uncertainty budget, apply an explicit guard-band decision rule and distinguish a measured result from a manufacturing tolerance."
draft: false
---

A digital display presents a number with reassuring clarity. It does not reveal every influence on that number. Calibration, contact, alignment, repeatability, temperature and the definition of the quantity can all affect the result.

Acceptance requires both a specification and a decision rule. Without an agreed rule, two competent organisations can measure nearly the same value and reach different conclusions near a limit. Resolve the rule before the borderline part arrives.

## Define what the measurement represents

For this illustration, the result is the mean of five repeated measurements of the same assembled gap in a specified reference state. The method includes a defined seating condition, measurement location and temperature correction. It is not the mean gap across five different assemblies.

This distinction affects the uncertainty calculation. Repeating a measurement of one stable quantity can reduce uncertainty associated with random repeatability of the mean. It does not reduce batch variation, and it does not automatically reduce a shared calibration error.

Apply known corrections before calculating the final result. If a calibration establishes a significant indication error with an associated uncertainty, using only the uncertainty and ignoring the correction can leave a known bias in the answer.

## Build a small uncertainty budget

[NIST Technical Note 1297](https://www.nist.gov/pml/nist-technical-note-1297) distinguishes combined standard uncertainty from expanded uncertainty. Standard contributions are combined using their sensitivities and any relevant covariances; expanded uncertainty is obtained using a stated coverage factor.

The following is an invented budget, expressed entirely as contributions at the gap output. For the calculation, assume the contributions are independent and that their scopes do not overlap.

| Contribution | Stated information | Standard contribution |
|---|---|---:|
| Calibration after correction | Certificate expanded uncertainty 0.006 mm, k = 2 | 0.003000 mm |
| Repeatability of the mean | Single-reading standard deviation 0.004 mm; five independent repeats | 0.004 / √5 = 0.001789 mm |
| Display rounding | Increment 0.001 mm; uniform rounding within ±0.0005 mm | 0.0005 / √3 = 0.000289 mm |
| Residual temperature effect | Already evaluated at the output as a standard contribution | 0.002000 mm |

```figure
type: bars
title: A small uncertainty budget for the gap
unit: mm
max: 0.0035
caption: Combined standard uncertainty about 0.004035 mm; with k = 2, U is about 0.0081 mm.
- *Calibration, after correction | 0.003
- Residual temperature effect | 0.002
- Repeatability of a five-reading mean | 0.001789
- Display rounding | 0.000289
```

The combined standard uncertainty is:

**uc = √(0.003² + (0.004/√5)² + (0.0005/√3)² + 0.002²) ≈ 0.004035 mm.**

With an assumed coverage factor k = 2, expanded uncertainty is **U ≈ 0.008071 mm**. Retain the unrounded calculation for decisions. Reporting U as about 0.0081 mm is appropriate for explaining the result.

The table demonstrates arithmetic, not a validated budget for a real gauge. In particular, investigate whether observed repeatability already includes a material resolution contribution. Adding overlapping estimates can count the same effect twice. Include other important effects, such as re-seating or alignment, when the method requires them.

## Know what a feeler gauge can and cannot tell you

Feeler gauges are the most common way to check an assembled gap, and they are often the only tool that fits. Their limitations should be understood before they are used for acceptance near a limit. A set typically steps in increments of 0.01 or 0.02 mm, so the result is a bracket: one blade enters, the next does not. The judgement of "enters" depends on the operator's feel, the blade's condition and whether the blade is pushed square to the gap.

This is an illustration. If the blades step by 0.02 mm and the true gap is equally likely to lie anywhere between the blade that enters and the one that does not, the stepping alone contributes a standard uncertainty of about 0.01 / √3 ≈ 0.0058 mm. That is larger than any single contribution in the budget above, before feel and blade wear are included. A feeler gauge is a good tool for confirming that a gap is comfortably inside its limits and for finding where the local minimum lies. It is a poor tool for deciding a result 0.007 mm from a limit.

Where feeler gauges must be used, their reliability can be improved without new equipment. Check blade thicknesses with a micrometer and discard worn or kinked blades. Use a defined technique, such as the blade entering under its own weight or with light finger pressure, and write it into the instruction. Record both the blade that entered and the one that did not, rather than a single number. And for any result within a step or two of a limit, move to a method with a known, smaller uncertainty before deciding.

## Choose the coverage interpretation honestly

Using k = 2 does not guarantee exactly 95% coverage for every measurement problem. The appropriate factor depends on the distributions, effective information and required interpretation. Small samples, dominant non-normal contributions and nonlinear models may require a different treatment.

State the factor and method with the result. “Uncertainty ±0.008 mm” without a coverage factor and scope is incomplete. Also avoid treating a manufacturer's accuracy specification as a complete uncertainty budget for your actual measurement.

Measurement uncertainty concerns knowledge of the measured quantity. Manufacturing tolerance concerns permitted product variation. They are not interchangeable, and a wider product tolerance does not improve the gauge.

## Apply an explicit teaching decision rule

For this case, choose a conservative interval-containment rule: accept only when the entire interval from **y − U to y + U** lies within the specification of 1.85 to 2.15 mm. Here y is the corrected measured result.

This is the book's chosen rule. It is not asserted to be mandatory for every contract or standard. [JCGM 106](https://www.bipm.org/en/doi/10.59161/jcgm106-2012) provides the broader framework for conformity decisions and guard bands, including the trade-offs between different decision risks.

Using the unrounded U above, the acceptance interval for the reported value is approximately **1.858071 to 2.141929 mm**.

| Corrected result y | Interval using U ≈ 0.008071 mm | Decision under this rule |
|---|---|---|
| 2.130 mm | 2.121929 to 2.138071 mm | Accept |
| 2.143 mm | 2.134929 to 2.151071 mm | Hold; conformity is not established |
| 1.840 mm | 1.831929 to 1.848071 mm | Entire interval below specification |

```figure
type: range
title: Applying the decision rule
unit: mm
min: 1.82
max: 2.16
caption: Accept only when the whole interval y ± U lies inside 1.85 to 2.15 mm; otherwise hold or reject.
- Specification | 1.85 | 2.15
- *Result 2.130: accept | 2.122 | 2.138
- Result 2.143: hold | 2.135 | 2.151 | conformity not established
- Result 1.840: below specification | 1.832 | 1.848
```

The second result is not accepted even though its indicated value is inside the drawing limits. Nor is it automatically established as nonconforming: its interval overlaps the limit. A documented hold decision can lead to a better measurement, a permitted rework or a decision by the authorised person.

## Compare the uncertainty with the tolerance

A quick check of whether a measurement method suits a requirement is to compare its expanded uncertainty with the tolerance. For GAP-01, the half-width of the specification is 0.15 mm and U is about 0.0081 mm, a ratio of about 18 to 1. Rules of thumb in common use ask for ratios of at least 4 to 1 or 10 to 1, so this method is comfortably adequate.

The ratio also shows what the decision rule costs. Under the interval-containment rule, a band of width U is lost inside each limit, so about 2 × 0.0081 / 0.30 ≈ 5.4% of the total tolerance becomes a hold zone. With a feeler gauge whose uncertainty was three times larger, the hold zone would grow to about 16%, and many more good assemblies would be held. Rules of thumb are a screening aid, not a substitute for the budget; they do not tell you whether the measurement represents the right quantity.

## Decide what a better measurement would change

Reducing uncertainty can widen the acceptance interval without changing the product specification. The useful improvement depends on which contribution dominates.

Increasing repeats from five to twenty would halve the repeatability contribution of the mean, under the independence assumptions. It would not change calibration or residual temperature uncertainty. Buying a finer display may have little effect when the display contribution is already small.

Do not repeat measurements indefinitely until one happens to pass. That changes the decision process and can bias acceptance. Define any remeasurement method, reason and decision rule in advance, preserving the earlier result.

For a disputed assembly, the best next step may be improving the definition of the measurand or reproducing the actual seating condition. More repetitions of a mismatched method create a more precise answer to the wrong question.

## Measuring the parts or measuring the assembly

When the assembled gap cannot be reached, it can be calculated from component measurements. The uncertainty of the calculated gap combines the uncertainties of each measurement through the gap equation. This is an illustration. If the housing span, cartridge and spacer are measured with expanded uncertainties of 0.006, 0.004 and 0.002 mm, each at k = 2, their standard contributions are 0.003, 0.002 and 0.001 mm. Since each enters the gap with a sensitivity of plus or minus one:

**uc = √(0.003² + 0.002² + 0.001²) ≈ 0.00374 mm**, so **U ≈ 0.0075 mm** at k = 2

That is similar to the direct measurement's 0.0081 mm. But the calculated gap carries an extra assumption that the direct measurement does not: that the model is complete and that each component measurement represents the length it contributes in the assembly. Seating on high spots, burrs, tilt and clocking, described in Chapter 5, are not in the calculation. The two routes therefore answer slightly different questions, and their uncertainties are not directly comparable unless the model's own limitations are included.

```figure
type: compare
title: Two ways to establish the assembled gap
cols: Direct measurement | Calculated from parts
caption: Illustrative uncertainties at k = 2. The calculated route also depends on the model being complete.
- Expanded uncertainty | About 0.0081 mm | About 0.0075 mm
- Captures seating and burrs | Yes, at the points measured | No
- Needs access to the gap | Yes | No
- *Main hidden assumption | The location measured is the minimum | The model includes every effect
```

## Agree how operators and set-ups will be compared

A budget estimated by one skilled person in a quiet laboratory may not describe the measurement as it is done on the shop floor by different people on different shifts. A gauge repeatability and reproducibility study, in which several operators measure the same set of parts more than once without knowing which part is which, shows how much of the observed variation comes from the measuring process. Its result can be expressed as a fraction of the tolerance or of the process variation.

Such a study answers a different question from the uncertainty budget, and the two complement each other. The study is good at revealing operator and set-up effects; the budget is good at accounting for calibration, temperature and other effects that a short study cannot see. For a characteristic as tight as GAP-01, both are worth doing before production, and the linked measurement-system chapter describes the study in detail.

## Connect the result to the assembly record

Record the part or assembly identifier, revisions, method, reference condition, corrected result, uncertainty, coverage factor and decision rule. Preserve the raw observations and corrections where the consequence warrants it.

If the assembled gap is measured directly at its functional location, that result may already include the actual geometric effects present. Do not add the design's ±0.010 mm geometry allocation again as if it were a separate measurement uncertainty. Determine which influences belong to the product model and which belong to the measurement model.

The existing [measurement-system analysis chapter](/reados/collections/manufacturing-quality/measurement-system-analysis-for-manufacturers/) expands the production context. The immediate task is a result that another reviewer can interpret without guessing its meaning.

## Plan for the day a gauge is found out of calibration

Calibration is periodic, and a gauge can drift or be damaged between calibrations. When a recalibration finds a gauge outside its permitted error, the question is which acceptance decisions it affected. Answering that requires records that link each measurement to the instrument that made it, and a defined procedure for reviewing affected results.

Simple controls reduce the exposure: a daily or per-shift check against a reference standard, recorded with the result; a rule that a failed check stops measurement until resolved; and inspection records that name the instrument by its identifier. If the daily check passed yesterday and fails today, only today's results are in doubt. Without it, every result since the last calibration may need review.

## Report numbers at a precision that matches the evidence

The worked budget carries six decimal places so that the arithmetic can be checked. A report should not. A common convention is to round the expanded uncertainty to two significant figures, here 0.0081 mm, and to report the result to the same decimal place, such as 2.1430 mm. Keep the unrounded values in the calculation record, so that a decision close to a limit is made on the actual numbers, but present the rounded values to readers. A result reported to more digits than its uncertainty supports suggests a confidence the evidence does not have.

## Exercise: evaluate a borderline result

An improved method has a justified expanded uncertainty of 0.005 mm under the same chosen decision rule. Can a corrected result of 2.143 mm be accepted?

Its interval is **2.138 to 2.148 mm**, entirely inside 1.85 to 2.15 mm, so it is accepted under that rule. This answer assumes the improved uncertainty is valid for the same quantity and conditions. Merely typing a smaller U into the report does not change the evidence.
