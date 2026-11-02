---
book: tolerances-that-work
chapterSlug: verifying-tolerances-and-tolerance-review
order: 10
title: "Verifying tolerances and running a tolerance review"
description: "Allow for measurement uncertainty, match gauges and CMM methods to the specification, and use a structured review to release drawings that are complete and verifiable."
draft: true
---

A tolerance is only as good as the ability to verify it. A requirement that cannot be measured reliably invites disputes, rejected good parts and accepted bad ones. Verification also feeds back into design: if a tolerance consumes most of the measurement capability available, it is effectively tighter than written.

This final chapter covers measurement uncertainty and decision rules, the match between specification and inspection method, and a practical tolerance review that brings the whole book together. It finishes with a summary of how the Northgate guide roller drawings changed from first issue to release.

## Every measurement has uncertainty

A measured value is an estimate. The instrument, the operator, the temperature, the part's form and the measuring method all contribute uncertainty. A good measurement report states the result together with its **expanded uncertainty**, written U, which defines an interval within which the true value is expected to lie with a stated confidence, commonly about 95%.

Uncertainty matters most when a measured value lies near a tolerance limit. If a bore is measured at 42.023 mm with U = 0.004 mm, against an upper limit of 42.025 mm, the true size could be anywhere from 42.019 mm to 42.027 mm. The measurement cannot prove that the part conforms.

## Decision rules

ISO 14253-1 sets out a default way of handling this. In simplified terms:

- **Conformance is proven** when the measured value lies inside the tolerance reduced at each end by the uncertainty. This narrower band is the conformance zone.
- **Nonconformance is proven** when the measured value lies outside the tolerance increased at each end by the uncertainty.
- **Between the two**, neither is proven. The standard's default places the burden of proof on whichever party is making the claim: a supplier must prove conformance, and a customer rejecting parts must prove nonconformance.

Contracts can agree different rules, and in practice many organisations simply accept measurements inside the tolerance when the uncertainty is small. The important thing is to agree the rule before a dispute arises.

This is an illustration. The Northgate housing bore is Ø42 H7, a tolerance of 0.025 mm. With an inspection method whose expanded uncertainty is 0.004 mm, the conformance zone is 0.025 − 2 × 0.004 = **0.017 mm** wide. The supplier must produce bores within about two-thirds of the drawn tolerance to prove conformance under the default rule. The tolerance-to-uncertainty ratio here is 0.025 ÷ 0.004 = 6.25.

```figure
type: range
title: Decision zones for the Ø42 H7 bore with U = 0.004 mm
min: 41.995
max: 42.03
unit: mm
ticks: 41.995 | 42.000 | 42.0125 | 42.025 | 42.03
caption: Under the ISO 14253-1 default, a supplier proves conformance only inside the narrower zone. A reading of 42.023 cannot prove it.
- Drawing tolerance | 42.000 | 42.025
- *Conformance proven | 42.004 | 42.021 | 0.017 mm wide
- Uncertainty band, low | 42.000 | 42.004
- Uncertainty band, high | 42.021 | 42.025
- Reading 42.023 ± 0.004 | 42.019 | 42.027 | straddles the limit
```

Long-standing workshop guidance suggests that measurement uncertainty should be no more than about a tenth of the tolerance, with a quarter often accepted as a practical limit. The guidance is a convention rather than a requirement in a standard, but it captures the right idea: the measuring method must be much finer than the tolerance it checks.

```figure
type: gauge
title: Tolerance-to-uncertainty ratio for the bore measurement
min: 0
max: 12
value: 6.25
unit: : 1
label: = 0.025 ÷ 0.004
caption: Workshop convention favours about 10:1, with 4:1 often accepted as a practical limit.
- 0 | 4 | Too coarse
- 4 | 10 | Usable
- 10 | 12 | Preferred
```

## Measurement system capability

Uncertainty from the instrument alone is only part of the story. Repeated measurements of the same part by different operators reveal the variation of the whole measurement system. Gauge repeatability and reproducibility studies quantify this and express it as a percentage of the tolerance. Widely used automotive industry guidance treats less than 10% as acceptable, 10% to 30% as possibly acceptable depending on the application, and more than 30% as unacceptable. The Library chapter on [measurement system analysis](/reados/collections/manufacturing-quality/measurement-system-analysis-for-manufacturers/) explains how to run such a study.

For the housing bore, a hand-held bore gauge used by several inspectors might show variation large enough to matter against 0.025 mm. A fixed air gauge or a coordinate measuring machine in a temperature-controlled room may be needed for reliable decisions. That is part of the true cost of the tolerance, and it belongs in the design decision.

## Match the inspection method to the specification

Different measurement methods test different things. Problems arise when the inspection method quietly tests a different requirement from the one on the drawing.

**Two-point and envelope checks.** A micrometer or bore gauge measures local two-point size. A full-form GO plug gauge tests the envelope: whether a perfect cylinder at maximum material size fits. The Taylor principle for limit gauges, long described in reference works including Machinery's Handbook, calls for a full-form GO gauge and a NOT GO gauge that checks individual local sizes. Under ASME Rule #1, that gauging matches the default requirement. Under ISO independency without the envelope symbol, a full-form GO gauge can reject a bent part whose local sizes all conform. Make the gauge match the specification, or change the specification to match the function.

**Coordinate measuring machines.** A CMM measures points and fits geometry to them. The fitting method changes the result. A least-squares cylinder, a maximum inscribed cylinder and a minimum circumscribed cylinder fitted to the same points in a slightly out-of-round bore give different diameters and axes. The datum definitions in ISO 5459 and ASME Y14.5 imply particular fitting methods for datums. The inspection plan should state which fitting methods, how many points and what scanning strategy are used for critical features, and the CMM program should follow the drawing's datum precedence.

**Functional gauges.** For features with maximum material modifiers, such as the housing's bolt holes, a functional gauge with pins at virtual condition tests assembly directly, as described in Chapter 6. It does not report how much tolerance remains, so for process control it is often combined with occasional CMM measurement.

**Run-out with an indicator.** Run-out on the Northgate shaft is measured by supporting the shaft on its bearing seats, the datum features, and reading a dial indicator on the toleranced surface while the shaft rotates. Supporting it on centre holes instead would measure run-out to a different axis. The method must reproduce the datums on the drawing.

## The inspection plan

For every critical and important feature, an inspection plan records:

- the requirement and its reference to the drawing;
- the measurement method, instrument and any fixture;
- the datum set-up and, for CMMs, the fitting methods;
- the sampling frequency, for example first article, then one part in ten;
- the decision rule and the expected uncertainty; and
- what happens when a result falls in the uncertainty band.

Writing this plan during design, not after the first parts arrive, often exposes requirements that are ambiguous or impractical to verify while they can still be changed cheaply.

## A tolerance review before release

The following review brings together every chapter of this book. It works best as a short meeting between the designer, someone from manufacturing or the supplier, and someone responsible for inspection.

1. **Functional requirements.** Are the assembly's functional conditions listed, with their limits and the reasons for them?
2. **Critical features.** Is every feature that controls a functional requirement identified, and is everything else covered by a stated general tolerance class?
3. **Datum scheme.** Do the datums reflect how each part is located in its assembly, in the right order of precedence?
4. **Completeness.** Does every critical feature have size and geometric controls sufficient for its function, with no requirement left implicit?
5. **Governing standard.** Does the title block name the tolerancing standard, so that defaults such as envelope behaviour are unambiguous?
6. **Fits.** Are both extremes of every fit checked, including bought-in parts and temperature?
7. **Stack-ups.** Is each functional condition supported by a documented stack-up, with the method, assumptions and variance contributions recorded?
8. **Capability.** Has each tight tolerance been checked against the intended process and supplier, and are capability requirements stated where a statistical method was used?
9. **Verification.** Can every critical requirement be measured with adequate uncertainty, and does the inspection plan reproduce the datums?
10. **Records.** Is the reasoning behind each critical tolerance stored where future engineers will find it?

```figure
type: checklist
title: The ten-point tolerance review at a glance
caption: Run it with design, manufacturing and inspection in the room before a drawing is released.
- Functional requirements | listed with limits and reasons
- Critical features | identified; everything else under a named general class
- Datum scheme | mirrors how each part is located
- Completeness | no implicit requirements on critical features
- Governing standard | named in the title block
- Fits | both extremes checked, with bought-in parts and temperature
- Stack-ups | method, assumptions and variance shares recorded
- Capability | checked against process and supplier
- Verification | adequate uncertainty; datums reproduced
- Records | reasoning stored where future engineers will find it
```

## How the guide roller drawings changed

The table summarises the main changes Northgate made across the chapters. The values are fictional and illustrate the process rather than a design to copy.

| Item | First issue | Released design | Chapter |
|---|---|---|---|
| General tolerances | ±0.1 on all dimensions | ISO 2768-m, standard named in title block | 2 |
| Bearing fits | Not analysed | Shaft k5 and housing H7 from bearing supplier guidance, checked at both extremes | 3 |
| Datums | Edges of flange | A mounting face, B bore axis, C bolt hole | 4 |
| Bore alignment | No control | Perpendicularity of bore to A, traced to roller tracking | 5 |
| Bolt holes | ±0.1 coordinates from edges | Position at MMC relative to A and B, sized by the fixed-fastener formula; frame tapped holes with projected zone | 5, 6 |
| Housing groove | Chained from outer end face | Dimensioned directly from shoulder to groove load face | 7 |
| Axial float | Not analysed; worst case 0.10 to 0.60 mm | Statistically allocated tolerances with capability requirement; select-fit spacer kept as fallback | 7, 8, 9 |
| Temperature | Not considered | Float and housing fit checked from −10 °C to 80 °C | 9 |
| Inspection | Not planned | Inspection plan with decision rule, CMM fitting methods and functional gauge for bolt holes | 10 |

None of these changes made the parts dramatically harder to make. Several made them easier: the general tolerance class is looser, the positional tolerance accepts more good holes, and the groove dimension no longer accumulates two tolerances. The main effect is that every number now has a reason, every functional requirement is controlled and every requirement can be verified.

## Bringing it together

Tolerancing is design work. It decides how much a part costs, how it is inspected and whether the assembly works on the thousandth unit as well as on the first. The methods in this book, from ISO fits to datum frames, geometric tolerances, stack-ups and decision rules, are tools for making those decisions deliberately.

The habits matter more than any single technique: start from function, choose datums that reflect the assembly, analyse the chains that matter, test the assumptions behind statistical results, allow for temperature and measurement, and record the reasoning. A drawing produced that way is a clear contract between designer, supplier and inspector, and a reliable foundation for every later change.

## Exercise: review one drawing

Run the ten-point review on a drawing that is about to be released or revised. For each question, record the answer and any action. Count how many actions improve function, how many reduce cost and how many reduce the risk of dispute. Most reviews find all three.

---

*Source: KEVOS® notes drawing on ISO 286, ISO 1101, ISO 5459, ISO 8015, ISO 2692 and ISO 14253-1, ASME Y14.5, standard mechanical design texts and Machinery's Handbook as listed in the book references. The guide roller case is fictional. This book is general engineering information.*
