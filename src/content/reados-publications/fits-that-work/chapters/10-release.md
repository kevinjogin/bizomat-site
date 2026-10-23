---
book: fits-that-work
chapterSlug: assemble-a-defensible-release-decision
order: 10
title: "Assemble a defensible release decision"
description: "Complete the stop-cartridge case, reconcile calculation and inspection evidence, and state exactly what can be released and what remains outside the approved envelope."
draft: false
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

## Bring every thermal state into the decision

The modelled interval above covers uniform temperatures only. Chapter 4 identified two uneven states as well: a housing that heats ahead of its contents, and internal parts that heat ahead of the housing. Applying the same Revision B limits and the ±0.010 mm geometric bound to all four states gives:

```figure
type: compare
title: Revision B across four thermal states, with the geometric bound
cols: Smallest gap | Largest gap
caption: Teaching coefficients, free expansion and ±0.010 mm geometry. The two uneven states each breach one limit if they reach a 40 °C difference.
- Uniform 20 °C | 1.860 mm | 2.100 mm
- Uniform 60 °C | 1.887 mm | 2.127 mm
- Housing 60 °C, contents 20 °C | 1.915 mm | 2.155 mm, above 2.15
- *Contents 60 °C, housing 20 °C | 1.832 mm, below 1.85 | 2.072 mm
```

The uniform states pass. Each uneven state, at a full 40 °C difference, breaches one limit. The same arithmetic can show how large a difference the design tolerates. Starting from 20 °C, with the geometric bound included:

- **The housing may lead its contents by up to about 36 °C** before the largest gap reaches 2.15 mm.
- **The contents may lead the housing by only about 14 °C** before the smallest gap reaches 1.85 mm.

Those two numbers turn a vague concern about gradients into a testable condition. A prototype instrumented with thermocouples through a realistic start-up and shutdown can show whether the actual differences stay inside them. If they do, the thermal claim in the release can be extended from uniform temperatures to the measured operating envelope. If the contents can lead by more than about 14 °C, the design needs another change, such as more lower-side margin, before production release.

## Reconcile inspection with design prediction

The design model establishes the intended range across permitted variation. Inspection evaluates particular manufactured items. Those are complementary tasks.

Suppose a corrected assembled-gap result at the reference state is **1.980 mm**, with the Chapter 6 expanded uncertainty of approximately 0.008071 mm. Its interval is approximately **1.971929 to 1.988071 mm**, so it passes the chosen interval-containment rule.

```figure
type: range
title: Design prediction and a measured result
unit: mm
min: 1.84
max: 2.16
caption: The measured interval sits inside both the model and the requirement, for that assembly and its conditions.
- Functional requirement | 1.85 | 2.15
- Conservative modelled interval | 1.86 | 2.127
- *Measured 1.980 ± U | 1.972 | 1.988
```

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

```figure
type: tree
title: A release decision with a defined scope
caption: State exactly what the evidence supports, and assign the rest to named decisions.
- Release claims
  - *Supported | Revision B under the bounded uniform-temperature model; one measured assembly under the rule
  - Not supported | Revision A thermally; long-run capability from ten parts; any temperature gradient; a harmless coating
```

The worked conclusion is therefore precise: **Revision B is the preferred design for further qualification within the stated envelope. A controlled pilot can proceed after the applicable equipment and process reviews; unrestricted production release requires the remaining geometry, thermal-envelope and process evidence.**

This conclusion completes the engineering decision supported by the information available. It does not pretend that invented teaching inputs constitute a real product qualification.

If a real project subsequently verifies those remaining conditions, its final release can name the approved configuration, operating envelope, measurement method, production controls and change triggers. The structure stays the same; the evidence status changes.

## Assemble the release package

A release decision rests on a package of evidence that another reviewer can follow. For GAP-01, the package would contain:

1. **The requirement record**, with the functional limits, reference state, operating envelope and the origin of each.
2. **The model**, at its controlled version, with inputs, signs, coefficients, geometric contributions and the independent checks performed.
3. **The drawings** at the revisions the model used, including any notes on finish and measurement condition.
4. **The process evidence** from each supplier for the features that carry the budget.
5. **The measurement method**, its uncertainty budget, any correlation studies and the decision rule.
6. **The pilot report**, with raw data, residuals against the model, thermal tests and open questions.
7. **The decision record**, with each claim, its evidence and its status, and the scope of the release.

Each item should reference the others by revision. A package in which the model refers to Revision B drawings but the process evidence describes Revision A housings is not a package; it is a set of unrelated documents in one folder.

## Make each approval mean something

A release usually needs more than one signature, and each should vouch for something specific. The design authority approves the requirement and the model. Manufacturing approves that the process can hold the allocated tolerances. Quality approves the measurement method and decision rule. The person responsible for the product approves the scope of release and any restrictions.

Separating the approvals keeps each person answerable for what they can actually judge. It also makes gaps visible: if nobody is in a position to approve the thermal envelope, the release record shows an empty role rather than hiding the gap behind a single signature at the bottom of the page.

## Assign unresolved work to decisions

An open item should identify what it prevents. “Check temperature” is weak. “Establish whether housing-to-cartridge temperature differences during start-up exceed the analysed envelope before authorising operation” connects the investigation to a release boundary.

Likewise, “collect more data” is not a sampling plan. State the process conditions, statistical question, required decision confidence and response to an adverse result. Determine an appropriate study with the quality or statistical specialist responsible for the claim.

Do not let a temporary inspection or assembly restriction disappear from the handover. Name its owner, review condition and removal criterion. A restriction without follow-through can become an undocumented permanent process.

## Keep watching after release

A release describes the evidence at one moment. Afterwards, the process and the product continue to change, and the evidence should be kept current with a few deliberate checks:

- **Monitor the features that carry the budget**, such as Revision B's housing span, with a control chart or a regular sample, so that a drift is seen before it uses the margin.
- **Audit assembled gaps periodically**, with the agreed method, and compare them with the model's predictions as in the pilot.
- **Review the change triggers** of Chapter 9 whenever a supplier, material, finish, fixture or operating condition changes.
- **Collect service evidence**, such as returns, wear patterns or field temperature measurements, and compare it with the assumptions in the requirement record.

When the monitoring shows that an assumption no longer holds, the release is reopened for that claim. A release that can be reopened on evidence is a stronger decision than one that is treated as permanent.

## A one-page summary of the teaching decision

The detailed record supports a short summary that a manager or customer can read in a minute. For the stop-cartridge case, it might read:

*GAP-01, stop-cartridge axial gap, requirement 1.85 to 2.15 mm. Revision B (housing 59.98 ± 0.04 mm) replaces Revision A, which exceeded the upper limit at 60 °C. Under the bounded model, Revision B gives 1.860 to 2.127 mm across uniform temperatures from 20 to 60 °C, including a ±0.010 mm geometric allowance whose basis is still being confirmed. It tolerates the housing leading its contents by about 36 °C and the contents leading the housing by about 14 °C; start-up temperature differences have not yet been measured. Decision: proceed to a controlled pilot; production release requires confirmation of the geometric bound, measured start-up temperature differences within the envelope, and housing process capability from the selected supplier.*

Every statement in it traces back to a calculation, a test or a named open item in the record. That traceability, more than any single number, is what makes the decision defensible.

## Check the record against itself

Before a release record is signed, it is worth one deliberate pass looking for internal contradictions, because they are common and easy to miss when each document was written by a different person. Useful checks include:

- **Revisions:** every calculation, test and inspection result names the same drawing revisions, or explains why it does not.
- **Numbers:** every figure in the summary appears, with the same value and units, in the detailed record it came from.
- **States:** each result names its condition, such as reference temperature, seated and unloaded, or hot, and the condition matches the claim it supports.
- **Decision rule:** the acceptance results were judged with the rule and uncertainty the record states, not an earlier version.
- **Open items:** every limitation mentioned in the text appears in the list of unresolved work, with an owner.

This review takes an hour for a record of this size. It regularly finds a result filed against the wrong revision, a margin quoted from an outdated model, or a restriction mentioned in an email but missing from the release. Each of those, found after release, would undermine the whole decision.

## Use the book on a real assembly

Begin with one functional quantity rather than attempting to model the whole product at once. Write the contact chain and conditions, calculate bounds, then add the mechanisms that could consume the margin. Challenge statistical assumptions separately from deterministic limits.

Agree how the quantity will be measured and how uncertainty affects the decision. Compare design options with manufacturing and inspection effort. Plan pilot evidence that addresses the remaining questions, then preserve the configuration and effectivity of the result.

The [Engineering Design Practice collection](/reados/collections/engineering-design-practice/) provides surrounding guidance on drawings, calculation checking and product data. This book's contribution is the connected decision record: requirement, model, evidence, conclusion and change response.

## Final exercise: make the release statement testable

Rewrite “The fit is good and production can start” for a project using this method.

A defensible answer names the part and revision, the functional limits, the operating conditions covered, the evidence reviewed, the measurement decision rule, the authorised scope and any outstanding restrictions. It also identifies the person or role responsible for the approval.

If those details cannot yet be supplied, the statement should authorise only the next justified investigation. Sound engineering is visible in the boundary between what the evidence supports and what still needs to be learned.
