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

## Decide what a better measurement would change

Reducing uncertainty can widen the acceptance interval without changing the product specification. The useful improvement depends on which contribution dominates.

Increasing repeats from five to twenty would halve the repeatability contribution of the mean, under the independence assumptions. It would not change calibration or residual temperature uncertainty. Buying a finer display may have little effect when the display contribution is already small.

Do not repeat measurements indefinitely until one happens to pass. That changes the decision process and can bias acceptance. Define any remeasurement method, reason and decision rule in advance, preserving the earlier result.

For a disputed assembly, the best next step may be improving the definition of the measurand or reproducing the actual seating condition. More repetitions of a mismatched method create a more precise answer to the wrong question.

## Connect the result to the assembly record

Record the part or assembly identifier, revisions, method, reference condition, corrected result, uncertainty, coverage factor and decision rule. Preserve the raw observations and corrections where the consequence warrants it.

If the assembled gap is measured directly at its functional location, that result may already include the actual geometric effects present. Do not add the design's ±0.010 mm geometry allocation again as if it were a separate measurement uncertainty. Determine which influences belong to the product model and which belong to the measurement model.

The existing [measurement-system analysis chapter](/reados/collections/manufacturing-quality/measurement-system-analysis-for-manufacturers/) expands the production context. The immediate task is a result that another reviewer can interpret without guessing its meaning.

## Exercise: evaluate a borderline result

An improved method has a justified expanded uncertainty of 0.005 mm under the same chosen decision rule. Can a corrected result of 2.143 mm be accepted?

Its interval is **2.138 to 2.148 mm**, entirely inside 1.85 to 2.15 mm, so it is accepted under that rule. This answer assumes the improved uncertainty is valid for the same quantity and conditions. Merely typing a smaller U into the report does not change the evidence.
