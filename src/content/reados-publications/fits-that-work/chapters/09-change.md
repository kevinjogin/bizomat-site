---
book: fits-that-work
chapterSlug: preserve-the-evidence-when-the-design-changes
order: 9
title: "Preserve the evidence when the design changes"
description: "Evaluate coating, material, supplier and drawing changes against the assembly model, and maintain revision and effectivity records that protect interchangeability."
draft: true
---

A successful review is a statement about a particular design, process and set of conditions. It is not permanent approval of every part that later carries a familiar description. Changes can invalidate the reasoning without changing the nominal dimension displayed on the first page of a drawing.

The practical task is to preserve the connection between the approved configuration and its evidence. This requires more than putting a revision letter on a PDF.

## Map the evidence before assessing the change

For GAP-01, the evidence chain includes the functional requirement, the signed model, component limits, material assumptions, geometry controls, measurement method, decision rule and relevant production conditions.

A change request should identify which link it affects. Changing the housing material affects thermal behaviour. Changing the inspection reference affects the meaning of a measured span. Changing a supplier may affect the process distribution even if the same drawing is retained.

Do not assume every change requires every test to be repeated. Select the affected evidence deliberately. Equally, do not preserve an old approval merely because repeating work would be inconvenient.

| Proposed change | First question | Evidence likely to need review |
|---|---|---|
| Housing material substitution | Are expansion and restraint assumptions still valid? | Thermal model and material specification |
| Added surface finish | Are dimensions specified before or after finishing? | Stack, contact behaviour and inspection method |
| New supplier | Is the accepted process population equivalent? | Process and measurement evidence |
| Changed datum feature | Does the measured quantity retain its meaning? | Drawing interpretation and measurement correlation |
| New assembly sequence | Does seating or deformation change? | Assembly method and functional verification |

This table is a starting point for consequence review. It is not a universal change-classification system.

## Work through a coating change

This is an illustration. A proposed finish adds a layer between 0.008 and 0.012 mm thick on each of the housing's two opposing axial faces. The stated housing span is, for this example, a substrate dimension before coating. Both layers grow into the space and reduce the effective span.

The total gap reduction is between **0.016 and 0.024 mm**. Applied to Revision B's complete modelled interval of 1.860000 to 2.127412 mm, the new interval is:

**Minimum: 1.860000 − 0.024 = 1.836000 mm.**

**Maximum: 2.127412 − 0.016 = 2.111412 mm.**

The lower limit is violated by **0.014 mm**. Describing the finish as cosmetic would not change its dimensional effect.

If the drawing instead defines the span after coating, and the finished span is controlled to the existing limits, subtracting coating thickness again would be wrong. The important issue is what the drawing and process actually control. Clarify that before comparing calculations.

The same review should consider whether the coating changes seating, friction, wear or local build-up. The thickness calculation is one part of the change assessment, not a complete qualification of the finish.

## Establish when a revision takes effect

An effectivity rule states which products use the new configuration. It might refer to a serial range, an order, a batch or a defined implementation event. “Use the latest drawing” is weak when old and new parts remain in stock.

Suppose a fictional store holds 80 Revision A housings and 40 Revision B housings. The corrected thermal-dimensional design applies only to B. Relabelling the whole stock location with the newest drawing number would erase a necessary distinction.

Identify stock, work in progress and already assembled units. Decide whether each population can be used as-is, reworked, restricted to a defined condition or held. Preserve the decision and its authority. A design revision does not physically alter existing parts.

Use positive identification where mixing would matter. If revisions cannot be distinguished by a practical inspection, the inventory history becomes especially important. Do not rely on appearance when a 0.02 mm nominal shift is the relevant change.

## Preserve the old calculation as evidence

Retain the previous model and result when issuing a revision. Record what changed, why it changed and which conclusions remain valid. Overwriting the input table without retaining its history makes it difficult to understand earlier approvals and rejected parts.

For Revision B, the change record should say that H moved from 60.00 ± 0.06 to 59.98 ± 0.04 mm, identify the thermal upper-limit failure that motivated the change, and link the new supplier and measurement evidence.

The result should not be described merely as “tolerance improved”. The exact change explains which old parts may still be relevant and what a future engineer must preserve.

Keep a model version as well as a drawing version. A correction to a formula can change the engineering conclusion even if no geometry has changed. Conversely, a drawing formatting update may leave the model unaffected. Record the distinction.

## Review supplier deviations as bounded decisions

A deviation request may apply to one batch, one characteristic and one period. State those boundaries. A temporary acceptance should not silently alter the master drawing or become a precedent for every later batch.

Evaluate the actual proposed limits against the complete model. If a supplier asks to return to the original housing tolerance, the earlier thermal failure returns as well. A satisfactory room-temperature sample does not remove it.

When acceptance depends on sorting or matching, record the inspection method, uncertainty and pairing rule. Include any consequence for replacement parts. A deviation that preserves initial assembly but prevents interchangeable service replacement may be unacceptable for the product.

## Make revalidation triggers operational

Define observable triggers: a material grade change, a new measurement fixture, an altered finishing route, an out-of-control process signal or a new operating-temperature requirement. Assign responsibility for reviewing each trigger.

Do not rely on every supplier or operator intuitively recognising a model-sensitive change. Put the relevant conditions in controlled specifications and agreements. The amount of documentation should match the consequence, but the important dependencies must be visible.

After implementation, verify that the intended revision reached the work instructions, inspection programme, stock records and assembly station. A signed change request that never reaches the process is an administrative event, not an implemented engineering change.

## Exercise: assess an apparently identical replacement

A replacement spacer has the same 6.00 ± 0.03 mm size but a different material. Can it be accepted as dimensionally equivalent?

At the reference temperature, its permitted size interval may be equivalent. Across the operating range, its expansion coefficient and constraints must be assessed. Contact stiffness, wear and other functional requirements may also matter. The correct response is to identify the affected assumptions and obtain evidence before treating the part as fully interchangeable.

For a second check, explain why the coating example uses the thickest total coating for the smallest gap. Both layers reduce the available housing space, so their maximum combined thickness produces the most adverse lower-side condition.

The final chapter assembles these decisions into one complete review, including the limits that must remain attached to any release.
