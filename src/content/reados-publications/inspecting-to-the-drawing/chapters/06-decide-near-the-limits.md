---
book: inspecting-to-the-drawing
chapterSlug: decide-near-the-limits
order: 6
title: "Decide near the limits"
description: "Check that a gauge repeats, estimate measurement uncertainty with a small budget, and apply a decision rule agreed in advance to readings that sit close to a limit."
draft: false
---

Most readings are easy. A bracket length of 80.03 against limits of 79.90 and 80.10 conforms, and no reasonable doubt about the caliper changes that. The hard readings are the ones close to a limit. A bore that reads 10.0145 against an upper limit of 10.015 is inside on paper, but the bore gauge is not perfect, and the true diameter could be on either side of the limit.

What happens next should not depend on who is holding the gauge, how busy the shop is or how badly the parts are needed. It should depend on a rule, written down before the reading was taken. This chapter builds the pieces that rule needs for the bracket's bore: a check that the gauge repeats, a small uncertainty budget, and a decision rule agreed with the customer. The chapter on [making measurement and acceptance agree](/reados/publications/fits-that-work/make-measurement-and-acceptance-agree/) in *Fits That Work* develops the same ideas for an assembled gap; here they are applied at the inspection bench.

## First, does the gauge repeat?

Before estimating anything else, check that the instrument gives the same answer when nothing changes. The simplest useful check is to measure one feature ten times, removing and re-applying the gauge each time, and look at the spread.

This is an illustration. The inspector measures the bore of one anodised bracket ten times with the bore gauge, re-centring the gauge each time. The readings are 10.0128, 10.0131, 10.0126, 10.0133, 10.0129, 10.0130, 10.0127, 10.0132, 10.0129 and 10.0130 mm.

```figure
type: stats
title: Ten repeat readings of one bore
caption: This is an illustration. The spread of repeat readings on one part is a first look at repeatability, not a full gauge study.
- 10.01295 mm | mean | of ten readings
- 0.0007 mm | range | 10.0126 to 10.0133
- *0.00022 mm | standard deviation | sample standard deviation, s
- 8.7% | 6s as a share of tolerance | 6 × 0.000217 ÷ 0.015
```

The standard deviation of 0.00022 mm says the gauge, in this inspector's hands, repeats well against a 0.015 mm tolerance: six standard deviations consume under a tenth of it. That is a screening result. It does not cover reproducibility, the difference between inspectors; stability, the drift over days; or bias, a fixed offset that repeats perfectly. A formal gauge study, of the kind the NIST/SEMATECH handbook describes or the automotive industry's measurement system analysis manual specifies, uses several parts, several inspectors and repeated trials to separate those effects. For a 40-part batch, a screening check plus a second inspector measuring the same part three times is a proportionate start.

## A small uncertainty budget

Repeatability is one source of doubt about a reading. There are others: the calibration of the setting ring, the gauge's resolution, its linearity over the small range between the ring size and the reading, and temperature. The Guide to the Expression of Uncertainty in Measurement, JCGM 100, sets out how to combine them. Each source is expressed as a standard uncertainty, the equivalent of one standard deviation; independent sources combine by root-sum-square; and the combined value is multiplied by a coverage factor, usually 2, to give an expanded uncertainty with a coverage probability of roughly 95 per cent.

Chapter 5's stated error of 0.002 mm for the bore gauge covers its whole range. Used comparatively, within 0.015 mm of the ring it was set on, the relevant contributions are smaller, and the budget shows them.

This is an illustration.

| Source | Basis | Standard uncertainty, mm |
|---|---|---|
| Setting ring calibration | Certificate: U = 0.001 mm at k = 2, so 0.001 ÷ 2 | 0.00050 |
| Repeatability | s from the ten readings, for a single reading | 0.00022 |
| Resolution | 0.001 mm display, rectangular: 0.001 ÷ √12 | 0.00029 |
| Linearity near the setting | ±0.0005 mm from in-house check, rectangular: 0.0005 ÷ √3 | 0.00029 |
| Temperature difference | part and ring within 2 K of each other: 10 × 12.1 × 10⁻⁶ × 2 ÷ √3 | 0.00014 |

```figure
type: formula
title: Combining the bore budget
caption: This is an illustration. The expanded uncertainty is rounded up, never down, before it is used in a decision.
formula: u = √(Σ uᵢ²)
formula: U = k × u, with k = 2
step: u = √(0.00050² + 0.00022² + 0.00029² + 0.00029² + 0.00014²) = 0.00069 mm
step: U = 2 × 0.00069 = 0.00139 mm
step: Rounded up: U = 0.0014 mm
step: Tolerance ÷ U = 0.015 ÷ 0.0014 ≈ 11
```

The largest contribution is the setting ring's calibration. That is useful to know: if the uncertainty had to come down, a better-calibrated ring would do more than a more careful inspector. The budget also documents assumptions that can be checked. If parts are measured warm from the machine, the temperature line is wrong, and so is the result.

## Decision rules

A decision rule says how the uncertainty is used when deciding conformance. JCGM 106 discusses the options in general terms, and ISO 14253-1 sets out decision rules for geometrical product specifications; customers in some industries specify one in their quality requirements. Three rules cover most shop practice.

- **Simple acceptance.** Accept if the reading is within the limits. Uncertainty is not used in the decision, though it should still be known and small. Some parts accepted near a limit will really be just outside it.
- **Guarded acceptance.** Accept only if the reading is within the limits shrunk by the uncertainty on each side: the acceptance zone. A part accepted under this rule is very likely to conform. Some conforming parts near the limits will not be accepted.
- **Guarded rejection.** Reject only if the reading is outside the limits widened by the uncertainty. Used where the burden is on proving a part bad, such as an incoming dispute.

None of these is correct in general. The choice is a commercial and engineering decision about who carries the risk of a wrong decision, and it belongs in the agreement between supplier and customer. If the order and the customer's requirements say nothing, the shop should choose a rule, state it on the inspection report, and tell the customer, rather than apply one silently.

This is an illustration. The bracket's customer, asked, specifies guarded acceptance for the sensor bore and simple acceptance elsewhere. With U = 0.0014 mm, the bore's acceptance zone is 10.0014 to 10.0136 mm.

```figure
type: range
title: Bore tolerance, acceptance zone and two readings
caption: This is an illustration. Part B is inside the drawing limits but outside the guarded acceptance zone, so it is not accepted on this measurement.
min: 9.998
max: 10.017
unit: mm
ticks: 9.998 | 10.0075 | 10.017
- Drawing limits | 10.000 | 10.015
- *Acceptance zone, guarded | 10.0014 | 10.0136 | limits shrunk by U = 0.0014 each side
- Part A, mean of three | 10.0130 | 10.0130 | accepted
- Part B, mean of three | 10.0145 | 10.0145 | not accepted; held
```

Guarded acceptance costs tolerance. The acceptance zone is 0.0122 mm wide instead of 0.015: about 19 per cent of the band has gone to measurement. That cost is a reason to keep uncertainty small on tight features, and a reason for the machining target, discussed in Chapter 3, to aim well inside the band rather than near it.

## What happens to a held part

Part B is not rejected and not accepted. It is held, labelled and set aside, and one of three things happens next.

1. **Measure better.** A method with smaller uncertainty, such as a calibrated air gauge or a coordinate measuring machine with a suitable probe, may place the reading clearly inside or outside. The new measurement's uncertainty must be evaluated in the same way; a second reading on the same gauge is not a better measurement.
2. **Treat it as nonconforming.** If no better method is available or worth the cost, the part is handled as a nonconformance under Chapter 9. The customer may grant a concession, knowing what the reading was and what the rule is.
3. **Scrap or rework it.** For a cheap part, scrapping a held part can cost less than the time spent deciding.

Whichever path is taken, the record keeps the original reading, the rule and the outcome.

## The error: measuring until it passes

This is an illustration. Before the decision rule was written, the inspector measured part B and got 10.0148. Uneasy, the inspector measured again: 10.0151, outside. Again: 10.0144. The record showed 10.0144 and "accepted".

Nothing about the third reading made it more correct than the first two. Choosing the reading that passes is a decision rule too, a bad one, which systematically accepts parts that are near or over the limit. It also hides the information the shop most needs: that the process was producing bores close to the upper limit.

The senior inspector found the pattern by comparing records: several brackets' bore readings were recorded at 10.0140 to 10.0144, with no readings between 10.0145 and 10.0150, which is not how a real process distributes. The correction was procedural. The method sheet now states the number of readings, three, and that their mean is the result; all three readings are recorded; and the decision rule is applied to the mean without exception. The boring bar's pre-anodising target, set in Chapter 7 to allow for coating growth, was moved down by 0.002 mm, and the next batch's bore readings centred near 10.010 after anodising.

## A second inspector

The repeat readings in this chapter came from one inspector. A bore gauge depends on how it is centred and rocked, and two competent people can settle on slightly different readings from the same bore. That difference, reproducibility, is not in the budget above.

This is an illustration. A second inspector measures part A three times and gets a mean of 10.0134, against the first inspector's 10.0130. The difference of 0.0004 mm is less than a third of the expanded uncertainty, so it does not change part A's decision, but it is not negligible against a 0.015 mm band either. The shop has three reasonable responses: add a reproducibility contribution to the budget, which widens U slightly and narrows the acceptance zone; agree a common technique and repeat the comparison to see whether the difference shrinks; or restrict tight-feature acceptance to inspectors whose results have been compared. For a 40-part batch, the second response is the proportionate one, and the comparison is recorded with the budget.

## Attribute gauges have uncertainty too

Plug gauges seem to remove the problem: a bore either takes the GO plug and refuses the NO-GO, or it does not. But a gauge is a made object with its own manufacturing tolerance and wear. A GO plug nominally at 10.000 is really a little above or below it, and wears smaller with use.

Gauge standards and gauge makers commonly place the gauge tolerance inside the work tolerance, so that gauge error tends to reject borderline good parts rather than accept bad ones. That is a built-in guarded acceptance, and its size is set by the gauge class, not by the inspector. Read the gauge certificates to know what the plugs actually measure, and check plugs for wear at intervals set in the calibration register. A worn GO plug passes undersize bores without anyone noticing, because the gauge still feels right.

## Writing the result

A result near a limit is only interpretable with its uncertainty and the rule beside it. On the bracket's first article record, the bore line reads: result 10.0130 mm, mean of three readings; U = 0.0014 mm at k = 2; guarded acceptance per customer requirement; acceptance zone 10.0014 to 10.0136; conforms. A reader can check every step. For requirements where simple acceptance applies and the screen in Chapter 5 passed comfortably, the reading and the decision are enough.

## Readings near a limit are information

A held part is a decision problem; a run of readings near a limit is a process problem. If the bracket's bores read 10.0110, 10.0118, 10.0125 and 10.0131 on consecutive sampled parts, none needs a decision rule yet, but the next few will. The inspector's record should reach the machinist before they do.

The simplest tool is a run chart at the machine: the sampled bore readings plotted in order, with the drawing limits and the acceptance zone drawn on it. A machinist who sees four points climbing towards the upper edge of the acceptance zone adjusts the boring bar without waiting for a held part. That use of inspection data, to steer the process rather than to sort its output, is cheaper than any concession and needs nothing more than a pencil and the readings the plan already collects.

## Proportion

An uncertainty budget for every balloon on a bracket would be absurd. The length of 80 ±0.1 measured with a caliper of stated error 0.02 needs no budget; the screen in Chapter 5 settles it. Budgets and guarded rules earn their keep on features with tight tolerances relative to the instrument, on features where the customer has asked for them, and on any reading that lands within an instrument error or two of a limit.

A practical shop rule is to write a budget for each instrument and feature type once, keep it with the method sheet, and review it when the instrument, the method or the conditions change. The bracket's bore budget is used on every batch; it is not rebuilt for each part.

## Exercise: apply the rule

A shaft diameter has limits of 25.000 to 25.013 mm. The inspection method's budget gives a combined standard uncertainty of 0.0009 mm. The customer requires guarded acceptance with k = 2. Three parts measure 25.0118, 25.0062 and 25.0004. Decide each part, and say how much of the tolerance the rule consumes.

**Answer.** U = 2 × 0.0009 = 0.0018 mm. The acceptance zone is 25.0018 to 25.0112. The first part, 25.0118, is inside the limits but above 25.0112, so it is not accepted and is held. The second, 25.0062, is accepted. The third, 25.0004, is inside the limits but below 25.0018, so it is held. The rule consumes 2 × 0.0018 = 0.0036 mm of a 0.013 mm band, about 28 per cent. With a quarter of the band going to measurement, the shop should look for a better method for this feature or ask whether the customer's rule could use a smaller uncertainty from an improved budget, rather than accept a steady stream of held parts.
