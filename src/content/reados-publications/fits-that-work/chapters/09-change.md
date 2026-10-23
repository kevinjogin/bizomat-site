---
book: fits-that-work
chapterSlug: preserve-the-evidence-when-the-design-changes
order: 9
title: "Preserve the evidence when the design changes"
description: "Evaluate coating, material, supplier and drawing changes against the assembly model, and maintain revision and effectivity records that protect interchangeability."
draft: false
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

```figure
type: decision
title: Map the evidence before assessing a change
question: What is changing?
caption: Every change asks whether existing evidence still describes the product.
- Housing material | Are expansion and restraint assumptions valid? | thermal model
- *Added surface finish | Dimensions before or after finishing? | stack and inspection
- New supplier | Is the process population equivalent? | process and measurement
- Datum feature | Does the measured quantity keep its meaning? | drawing interpretation
- Assembly sequence | Does seating or deformation change? | functional verification
```

This table is a starting point for consequence review. It is not a universal change-classification system.

## Classify changes by their consequence

Organisations often sort changes into categories, such as those that affect form, fit or function and those that do not, or into major and minor classes with different approval routes. Those categories are useful for workflow, but they are only as good as the judgement that assigns a change to them. The coating example shows how a change labelled cosmetic can violate a functional limit.

A practical safeguard is to make the classification follow the evidence map, not precede it. First identify which links in the evidence chain the change touches; then decide the category. A change that touches the thermal model, the measured quantity, the process population or the contact condition of a functional chain is not minor for that chain, however small it looks on the drawing.

```figure
type: checklist
title: Before classifying a change to the stop-cartridge assembly
caption: Assign the category after these questions are answered, not before.
- x Which requirements does the changed feature affect?
- x Does it alter a dimension, material, finish or contact in GAP-01's chain?
- x Does it change the population of parts reaching assembly?
- x Does it change what a measurement means?
- x Which earlier conclusions were statistical rather than bounds?
- *x Who must approve, and what evidence will they need?
```

## Work through a coating change

This is an illustration. A proposed finish adds a layer between 0.008 and 0.012 mm thick on each of the housing's two opposing axial faces. The stated housing span is, for this example, a substrate dimension before coating. Both layers grow into the space and reduce the effective span.

The total gap reduction is between **0.016 and 0.024 mm**. Applied to Revision B's complete modelled interval of 1.860000 to 2.127412 mm, the new interval is:

**Minimum: 1.860000 − 0.024 = 1.836000 mm.**

**Maximum: 2.127412 − 0.016 = 2.111412 mm.**

The lower limit is violated by **0.014 mm**. Describing the finish as cosmetic would not change its dimensional effect.

```figure
type: range
title: A "cosmetic" coating on the housing
unit: mm
min: 1.8
max: 2.2
caption: A gap reduction of 0.016 to 0.024 mm takes Revision B 0.014 mm below the lower limit.
- Functional requirement | 1.85 | 2.15
- Revision B | 1.86 | 2.127
- *With the coating | 1.836 | 2.111 | lower limit violated
```

If the drawing instead defines the span after coating, and the finished span is controlled to the existing limits, subtracting coating thickness again would be wrong. The important issue is what the drawing and process actually control. Clarify that before comparing calculations.

The same review should consider whether the coating changes seating, friction, wear or local build-up. The thickness calculation is one part of the change assessment, not a complete qualification of the finish.

## Work through a supplier change

This is an illustration. Revision B housings have been made by one supplier whose spans run centred close to 59.98 mm with a standard deviation of about 0.010 mm. A second supplier is proposed. Its sample parts all lie within the 59.94 to 60.02 mm limits, but they centre near 59.995 mm with a standard deviation of about 0.012 mm.

Which evidence survives the change depends on what kind of evidence it was:

- **The worst-case bound survives**, provided every accepted housing is inside its limits. The bound never relied on where parts sit within the tolerance. Its validity now depends on the second supplier's inspection being as trustworthy as the first's.
- **Any statistical prediction does not survive.** A model built on the first supplier's centring and spread now describes the wrong population. The new centre is 0.015 mm higher, which moves the gap upwards by the same amount and consumes upper-side margin that the old prediction counted as spare.
- **Pilot residuals may not survive.** If the second supplier's parts have different edge condition or flatness, the residual pattern between predicted and measured gaps could change, even with identical spans.

The change review should therefore ask which conclusions in the release record were statistical, which relied on process characteristics beyond the drawing, and which were pure bounds. Only the last kind transfers automatically to a new source.

## Treat a new measurement method as a change

Replacing feeler gauges with a coordinate measuring machine programme, or moving inspection to a new fixture, changes what the numbers mean even if the product is identical. Results from the old and new methods should not be mixed in one dataset, or compared against the same decision limits, until the relationship between them is known.

A simple correlation study answers the question. Measure the same set of assemblies, perhaps ten covering the range of gaps, with both methods, in a randomised order and with the parts identified. For each assembly, calculate the difference between the methods. The mean difference shows any bias; the scatter of the differences shows how well the methods agree.

This is an illustration. If the new method reads on average 0.004 mm smaller than the old, with the differences scattered by about 0.002 mm, then the old data can be compared with the new only after allowing for that bias. A 0.004 mm bias is half of the expanded uncertainty used in the decision rule, so ignoring it would shift the acceptance boundary noticeably. The study and its conclusion belong in the change record.

## Establish when a revision takes effect

An effectivity rule states which products use the new configuration. It might refer to a serial range, an order, a batch or a defined implementation event. “Use the latest drawing” is weak when old and new parts remain in stock.

Suppose a fictional store holds 80 Revision A housings and 40 Revision B housings. The corrected thermal-dimensional design applies only to B. Relabelling the whole stock location with the newest drawing number would erase a necessary distinction.

The Revision A housings in store need not simply be scrapped. Chapter 4 showed that Revision A's largest gap reaches the upper limit at about 49 °C under uniform temperatures, before any geometric allowance. A team could decide, with the right authority, to reserve those housings for a product variant or application whose operating temperature is demonstrably lower, after recalculating the margin with the geometric allowance included. That is a restricted-use decision, and it is only safe if the restriction is recorded, the parts are identified and segregated, and the assemblies built from them are traceable to the restricted application. Without those controls, the cheaper option of using up old stock becomes a route for Revision A parts to reach products they cannot serve.

Identify stock, work in progress and already assembled units. Decide whether each population can be used as-is, reworked, restricted to a defined condition or held. Preserve the decision and its authority. A design revision does not physically alter existing parts.

Use positive identification where mixing would matter. If revisions cannot be distinguished by a practical inspection, the inventory history becomes especially important. Do not rely on appearance when a 0.02 mm nominal shift is the relevant change.

## Preserve the old calculation as evidence

Retain the previous model and result when issuing a revision. Record what changed, why it changed and which conclusions remain valid. Overwriting the input table without retaining its history makes it difficult to understand earlier approvals and rejected parts.

For Revision B, the change record should say that H moved from 60.00 ± 0.06 to 59.98 ± 0.04 mm, identify the thermal upper-limit failure that motivated the change, and link the new supplier and measurement evidence.

The result should not be described merely as “tolerance improved”. The exact change explains which old parts may still be relevant and what a future engineer must preserve.

Keep a model version as well as a drawing version. A correction to a formula can change the engineering conclusion even if no geometry has changed. Conversely, a drawing formatting update may leave the model unaffected. Record the distinction.

## Control the model as carefully as the drawing

The calculation behind a release is part of the configuration. A spreadsheet corrected quietly, a script updated without a record, or a coefficient changed to match a new material can alter a conclusion as surely as a drawing change. Treat the model like a controlled document: give it a version, record what changed and why, have changes checked by a second person, and link each version to the drawing revisions and decisions it supported.

The check is not a formality. A sign error in one cell, a half-width entered where a full width was intended, or a formula that silently stopped including a row can turn a failing design into a passing one. The independent checks described in Chapter 2, such as corner enumeration and one-input perturbation, are worth repeating whenever the model changes.

## Review supplier deviations as bounded decisions

A deviation request may apply to one batch, one characteristic and one period. State those boundaries. A temporary acceptance should not silently alter the master drawing or become a precedent for every later batch.

Evaluate the actual proposed limits against the complete model. If a supplier asks to return to the original housing tolerance, the earlier thermal failure returns as well. A satisfactory room-temperature sample does not remove it.

When acceptance depends on sorting or matching, record the inspection method, uncertainty and pairing rule. Include any consequence for replacement parts. A deviation that preserves initial assembly but prevents interchangeable service replacement may be unacceptable for the product.

## Make revalidation triggers operational

Define observable triggers: a material grade change, a new measurement fixture, an altered finishing route, an out-of-control process signal or a new operating-temperature requirement. Assign responsibility for reviewing each trigger.

Do not rely on every supplier or operator intuitively recognising a model-sensitive change. Put the relevant conditions in controlled specifications and agreements. The amount of documentation should match the consequence, but the important dependencies must be visible.

After implementation, verify that the intended revision reached the work instructions, inspection programme, stock records and assembly station. A signed change request that never reaches the process is an administrative event, not an implemented engineering change.

## Close the loop with the people who build it

An engineering change reaches the product only through the people who make, assemble and inspect it. After a change is released, confirm in person or by record that the new revision is at the point of use: the machining programme, the inspection instruction, the assembly station and the stock location. A first-off inspection after the change, with its results recorded against the new revision, gives direct evidence that the change has been implemented as intended.

Explain the reason for the change as well as its content. An assembler who knows that the housing span moved to protect the hot gap is more likely to notice and report a mixed batch, or an odd seating behaviour, than one who has only been told that the drawing number has changed.

## Exercise: assess an apparently identical replacement

A replacement spacer has the same 6.00 ± 0.03 mm size but a different material. Can it be accepted as dimensionally equivalent?

At the reference temperature, its permitted size interval may be equivalent. Across the operating range, its expansion coefficient and constraints must be assessed. Contact stiffness, wear and other functional requirements may also matter. The correct response is to identify the affected assumptions and obtain evidence before treating the part as fully interchangeable.

For a second check, explain why the coating example uses the thickest total coating for the smallest gap. Both layers reduce the available housing space, so their maximum combined thickness produces the most adverse lower-side condition.

The final chapter assembles these decisions into one complete review, including the limits that must remain attached to any release.
