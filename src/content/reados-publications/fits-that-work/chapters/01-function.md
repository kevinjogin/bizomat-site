---
book: fits-that-work
chapterSlug: define-the-function-before-the-tolerance
order: 1
title: "Define the function before the tolerance"
description: "Turn an assembly requirement into a measurable quantity, an operating envelope and an explicit model before allocating dimensional tolerances."
draft: true
---

A drawing can be beautifully dimensioned while leaving the important question unanswered: what must still work when the parts, environment and assembly method vary? Starting with a favourite tolerance makes this question harder. It commits manufacturing effort before the function has been translated into a limit.

Start with the event you want to prevent. A sliding component might bind, a sealing face might lose compression, or an access cover might fail to clear a neighbouring part. Those are different failure mechanisms. Each needs its own model, operating conditions and evidence.

This chapter establishes the running case and a compact requirement record. The record is useful because later calculations can be traced back to something more meaningful than a number copied from a drawing template.

## Define one observable quantity

This is an illustration. A fictional stop-cartridge assembly contains a housing, a cartridge and a spacer. Their axial dimensions leave a gap between the spacer end and a housing stop. The teaching requirement is that this gap, G, remains between **1.85 mm and 2.15 mm**, inclusive, in the defined assembled condition.

These limits are assumed requirements, not values taken from a component catalogue. A real project would have to justify them through the mechanism's travel, clearance, impact behaviour or other functional evidence. The arithmetic that follows cannot establish whether the chosen limits are appropriate.

The housing shoulder separation is H. The cartridge thickness is C, and the spacer thickness is S. The three members sit in a straight axial chain with fully seated, parallel contact faces. Under those assumptions:

**G = H − C − S.**

This equation has a physical meaning. Increasing H opens the gap; increasing either internal component closes it. Draw the chain on an assembly section and label its start and finish. If the equation cannot be followed through actual contacts, it is not ready for a spreadsheet.

## State the condition of the assembly

A dimension is not fully defined by its numerical size. The gap may change between loose assembly and tightening, between unloaded and loaded states, or between a cool inspection room and a hot enclosure. Write the state before measuring or calculating.

For this case, the initial model uses clean, fully seated rigid components at a uniform reference temperature of 20 °C. The operating investigation will extend to a uniform 60 °C. It excludes elastic compression, coatings, wear, temperature gradients and geometrical errors until those effects are considered explicitly. These exclusions are open work, not evidence that the effects are negligible.

The difference matters during review. “The assembly meets the gap requirement” is broader than “the ideal one-dimensional model meets the gap limits at 20 °C”. The second statement is a useful result. The first is premature if the remaining mechanisms have not been checked.

Record whether the limit applies during manufacture, after assembly or throughout service. A gap checked before tightening may not represent the operating gap. Conversely, requiring a temporary assembly state to meet a service limit can impose unnecessary work if that state has no functional consequence.

## Build the first requirement record

| Record item | Teaching case entry | Evidence still needed in a real project |
|---|---|---|
| Function | Preserve controlled axial free space | Mechanism analysis or testing that justifies the space |
| Quantity | Gap G between named contact boundaries | Drawing view and an agreed measurement method |
| Limits | 1.85 to 2.15 mm | Approval by the responsible design authority |
| Reference state | Seated, unloaded, clean, 20 °C | Assembly condition and temperature verification |
| Operating range | Uniform 20 to 60 °C for this study | Actual environment and transient conditions |
| Initial model | G = H − C − S | Confirmation that no intermediate feature was omitted |
| Remaining mechanisms | Geometry, temperature, measurement and process effects | Assigned checks with an owner and result |

Keep the record short enough to use. A requirement spreadsheet with dozens of empty columns can conceal the same uncertainty as a vague drawing note. The useful test is whether another person can identify what is being protected and which evidence would support acceptance.

Give the requirement an identifier, such as GAP-01, and use it consistently in calculations, inspection records and design reviews. The identifier is a link, not a substitute for a definition. If the meaning changes, preserve the old version so earlier evidence remains interpretable.

## Distinguish requirements from design choices

The gap limits describe the desired result. Choosing a 60 mm housing span or a 6 mm spacer is a design decision intended to achieve that result. A supplier's preferred machining tolerance is a process proposal. Keeping these three levels separate creates room to improve the design.

Suppose the housing supplier cannot hold the initial span economically. The team could tighten a different component, alter the nominal gap, change the assembly architecture or introduce a controlled adjustment. None of those options requires silently changing the functional requirement.

An exception may be legitimate when the original functional limit was unnecessarily restrictive. That requires new functional evidence and approval, followed by an update to dependent records. Rewriting the limit merely because a batch failed it reverses the direction of engineering justification.

Also distinguish design margin from an extra allowance. Margin is the distance between a predicted result and its limit. An allowance is a deliberately assigned amount for an effect, such as wear. If the same effect has already been included in the model, deducting it again as an allowance counts it twice.

## Use a diagram as a question, not proof

A simplified section should reveal the contact sequence and the direction of each term. It need not look like a finished production drawing. Show whether a component rests against a shoulder, floats on a spring or is fixed by a fastener. Those details decide whether its full length belongs in the dimensional chain.

For example, adding a cover thickness to the equation is wrong if the stop is machined into the housing and the cover does not position it. Omitting a washer is wrong if that washer lies directly between the cartridge and the seating face. The importance of a feature comes from its role in the chain, not its size.

Review the model with the people who assemble and inspect the product. They may identify a burr-sensitive seat, a component installed in two orientations or a surface that cannot be reached after assembly. These observations often improve the model more than adding decimal places.

The existing [tolerances, fits and surface finish chapter](/reados/collections/engineering-design-practice/specifying-tolerances-fits-and-surface-finish/) provides the broader drawing context. Here the task is to make one specific assembly quantity traceable.

## Exercise: expose the hidden state

A requirement says, “The moving sleeve shall have 0.20 mm clearance.” Write four questions that must be answered before selecting component tolerances.

A sound response asks whether the clearance is radial or diametral, whether 0.20 mm is a nominal value or a limit, which temperature and load state apply, and which surfaces define the measurement. Other useful questions concern coatings, misalignment and the consequence of excessive clearance. There is no valid tolerance calculation until the important ambiguities are resolved.

For the stop-cartridge case, explain what happens to G if S increases by 0.02 mm while H and C remain unchanged. The answer is a **0.02 mm reduction in G**. If the sketch suggests otherwise, repair the signs now. The next chapter uses those signs to calculate the full dimensional bounds.
