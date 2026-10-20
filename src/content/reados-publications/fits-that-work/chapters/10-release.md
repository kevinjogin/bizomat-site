---
book: fits-that-work
chapterSlug: assemble-a-defensible-release-decision
order: 10
title: "Assemble a defensible release decision"
description: "Complete the stop-cartridge case, reconcile calculation and inspection evidence, and state exactly what can be released and what remains outside the approved envelope."
draft: true
---

The purpose of a tolerance investigation is a decision that another competent person can understand. A folder containing calculations, drawings and inspection results is not enough if those documents refer to different configurations or support different claims.

This final chapter completes the stop-cartridge case. It separates a demonstrated mathematical result from the evidence a real project must provide before using that result as a release basis.

## Reconcile the final configuration

The proposed configuration is Revision B: H = 59.98 ± 0.04 mm, C = 52.00 ± 0.04 mm and S = 6.00 ± 0.03 mm, all defined at 20 °C in their specified finished condition. No additional coating is included.

The functional gap interval is 1.85 to 2.15 mm. The thermal model covers a common uniform temperature from 20 to 60 °C, using the stated constant coefficients and free-expansion assumptions. The provisional geometric contribution is bounded by ±0.010 mm at the gap output.

The conservative modelled interval is **1.860000 to 2.127412 mm**. It leaves **0.010000 mm lower-side margin** and **0.022588 mm upper-side margin**. These are margins within the stated model, not reserves against every imaginable service condition.

The arithmetic can be reproduced independently:

```python
from itertools import product

H = (59.94, 60.02)
C = (51.96, 52.04)
S = (5.97, 6.03)
temperatures = (20.0, 60.0)
geometry = (-0.010, 0.010)

results = []
for h, c, s, t, e in product(H, C, S, temperatures, geometry):
    dt = t - 20.0
    gap = h * (1 + 23e-6 * dt)
    gap -= (c + s) * (1 + 12e-6 * dt)
    results.append(gap + e)

print(f"{min(results):.6f}, {max(results):.6f}")
# Expected: 1.860000, 2.127412
```

For this bounded model, corner evaluation is sufficient because each variable enters linearly when the others are fixed. It does not validate the chosen coefficients, geometric bound or thermal states.

## Turn allocations into evidence

The ±0.010 mm geometry entry began as a budget. Before real release, it must be supported by controls and an analysis connecting those controls to the gap.

As a capstone teaching assumption, suppose a reviewed contact model establishes three independent bounded contributions: reference-transfer effect ±0.005 mm, local seating-form effect ±0.003 mm and a remaining controlled seating effect ±0.002 mm. Their conservative sum is ±0.010 mm. These are deliberately supplied bounds for the exercise, not measured facts about a real product.

The important review questions are whether all three refer to the same assembly quantity, whether they overlap, whether any effect was omitted, and how each bound is maintained. A set of individually plausible values does not become evidence until those questions are answered.

If the project cannot substantiate the bound, the complete model remains conditional. The responsible decision is to continue investigation or restrict the next activity, rather than rename the allowance as a verified tolerance.

## Reconcile inspection with design prediction

The design model establishes the intended range across permitted variation. Inspection evaluates particular manufactured items. Those are complementary tasks.

Suppose a corrected assembled-gap result at the reference state is **1.980 mm**, with the Chapter 6 expanded uncertainty of approximately 0.008071 mm. Its interval is approximately **1.971929 to 1.988071 mm**, so it passes the chosen interval-containment rule.

That result does not by itself demonstrate thermal performance or the capability of future production. It also does not require adding the design geometry budget again if the measurement already captures the actual functional gap. Keep the product and measurement models distinct.

For each inspected assembly, preserve the configuration and condition. A result from an uncoated Revision A assembly cannot be filed as direct evidence that coated Revision B production meets its operating requirement.

## Write a decision with a defined scope

A useful completed review record has a clear outcome for each claim:

| Claim | Evidence in this teaching case | Decision |
|---|---|---|
| Revision A meets the full thermal-dimensional requirement | Upper bound 2.1574488 mm before geometry | Not supported |
| Revision B meets the bounded uniform-temperature model | Corner calculation plus assumed geometry bounds | Supported under stated assumptions |
| One measured B assembly meets the reference-state decision rule | Corrected result and uncertainty interval | Supported for that item and method |
| Ten pilot parts prove stable long-run capability | Small grouped dataset with a set-up shift | Not supported |
| Arbitrary temperature gradients are acceptable | Uniform model does not cover them | Not supported |
| Added housing coating is harmless | Calculated lower bound 1.836 mm | Not supported |

The worked conclusion is therefore precise: **Revision B is the preferred design for further qualification within the stated envelope. A controlled pilot can proceed after the applicable equipment and process reviews; unrestricted production release requires the remaining geometry, thermal-envelope and process evidence.**

This conclusion completes the engineering decision supported by the information available. It does not pretend that invented teaching inputs constitute a real product qualification.

If a real project subsequently verifies those remaining conditions, its final release can name the approved configuration, operating envelope, measurement method, production controls and change triggers. The structure stays the same; the evidence status changes.

## Assign unresolved work to decisions

An open item should identify what it prevents. “Check temperature” is weak. “Establish whether housing-to-cartridge temperature differences during start-up exceed the analysed envelope before authorising operation” connects the investigation to a release boundary.

Likewise, “collect more data” is not a sampling plan. State the process conditions, statistical question, required decision confidence and response to an adverse result. Determine an appropriate study with the quality or statistical specialist responsible for the claim.

Do not let a temporary inspection or assembly restriction disappear from the handover. Name its owner, review condition and removal criterion. A restriction without follow-through can become an undocumented permanent process.

## Use the book on a real assembly

Begin with one functional quantity rather than attempting to model the whole product at once. Write the contact chain and conditions, calculate bounds, then add the mechanisms that could consume the margin. Challenge statistical assumptions separately from deterministic limits.

Agree how the quantity will be measured and how uncertainty affects the decision. Compare design options with manufacturing and inspection effort. Plan pilot evidence that addresses the remaining questions, then preserve the configuration and effectivity of the result.

The [Engineering Design Practice collection](/reados/collections/engineering-design-practice/) provides surrounding guidance on drawings, calculation checking and product data. This book's contribution is the connected decision record: requirement, model, evidence, conclusion and change response.

## Final exercise: make the release statement testable

Rewrite “The fit is good and production can start” for a project using this method.

A defensible answer names the part and revision, the functional limits, the operating conditions covered, the evidence reviewed, the measurement decision rule, the authorised scope and any outstanding restrictions. It also identifies the person or role responsible for the approval.

If those details cannot yet be supplied, the statement should authorise only the next justified investigation. Sound engineering is visible in the boundary between what the evidence supports and what still needs to be learned.
