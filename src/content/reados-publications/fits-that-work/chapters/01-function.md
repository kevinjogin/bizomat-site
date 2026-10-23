---
book: fits-that-work
chapterSlug: define-the-function-before-the-tolerance
order: 1
title: "Define the function before the tolerance"
description: "Turn an assembly requirement into a measurable quantity, an operating envelope and an explicit model before allocating dimensional tolerances."
draft: false
---

A drawing can be beautifully dimensioned while leaving the important question unanswered: what must still work when the parts, environment and assembly method vary? Starting with a favourite tolerance makes this question harder. It commits manufacturing effort before the function has been translated into a limit.

Start with the event you want to prevent. A sliding component might bind, a sealing face might lose compression, or an access cover might fail to clear a neighbouring part. Those are different failure mechanisms. Each needs its own model, operating conditions and evidence.

This chapter establishes the running case and a compact requirement record. The record is useful because later calculations can be traced back to something more meaningful than a number copied from a drawing template.

## Define one observable quantity

This is an illustration. A fictional stop-cartridge assembly contains a housing, a cartridge and a spacer. Their axial dimensions leave a gap between the spacer end and a housing stop. The teaching requirement is that this gap, G, remains between **1.85 mm and 2.15 mm**, inclusive, in the defined assembled condition.

These limits are assumed requirements, not values taken from a component catalogue. A real project would have to justify them through the mechanism's travel, clearance, impact behaviour or other functional evidence. The arithmetic that follows cannot establish whether the chosen limits are appropriate.

The housing shoulder separation is H. The cartridge thickness is C, and the spacer thickness is S. The three members sit in a straight axial chain with fully seated, parallel contact faces. Under those assumptions:

**G = H − C − S.**

```figure
type: svg
title: The stop-cartridge stack
alt: A housing with an inner span H between its left wall and a stop on the right. Inside sit the cartridge C and then the spacer S, leaving a small gap G between the spacer and the housing stop. Dimension lines show H across the full inner span, and C, S and G along it.
caption: The gap closes when C or S grows, and opens when H grows: G = H − C − S.
viewbox: 0 0 600 230
body:
<rect class="bxi" x="40" y="60" width="20" height="100"/>
<rect class="bxi" x="540" y="60" width="20" height="100"/>
<rect class="bxi" x="40" y="150" width="520" height="10"/>
<rect class="bx" x="60" y="80" width="416" height="60" rx="2"/>
<rect class="bxi" x="476" y="90" width="48" height="40" rx="2"/>
<rect class="fs pulse" x="524" y="80" width="16" height="60"/>
<text class="tx" x="268" y="115" text-anchor="middle">Cartridge C</text>
<text class="tx txs" x="500" y="114" text-anchor="middle">S</text>
<text class="txa" x="532" y="50" text-anchor="middle">G</text>
<path class="ln" d="M60 178H476M476 178H524M524 178H540M60 172V184M476 172V184M524 172V184M540 172V184"/>
<path class="ln" d="M60 206H540M60 200V212M540 200V212"/>
<text class="tx txs" x="300" y="226" text-anchor="middle">Housing span H</text>
```

This equation has a physical meaning. Increasing H opens the gap; increasing either internal component closes it. Draw the chain on an assembly section and label its start and finish. If the equation cannot be followed through actual contacts, it is not ready for a spreadsheet.

## Trace the chain through contacts

A reliable way to write the equation is to walk around the assembly from one boundary of the gap to the other, passing only through faces that actually touch. For the stop-cartridge case, start at the free face of the spacer, where the gap begins:

1. Cross the spacer to its seated face, against the cartridge: the walk moves away from the stop by S.
2. Cross the cartridge to its seated face, against the housing wall: a further C away from the stop.
3. Cross the housing from that wall to the stop face: the walk returns towards the stop by H.
4. Arrive at the stop, the other boundary of the gap.

Assign a positive sign to the steps that move towards the closing boundary and a negative sign to the steps that move away. The walk gives H − C − S, the same equation as before, but now each term is tied to a contact that someone can point to on the assembly.

```figure
type: steps
title: Walking the chain from one gap boundary to the other
caption: Each step crosses one part between two faces that touch. If a step cannot be named as a contact, the equation is not ready.
- Start at the spacer's free face | one boundary of G
- Cross the spacer | − S
- Cross the cartridge | − C
- Cross the housing to the stop | + H
- *Arrive at the stop | the other boundary of G
```

If the walk has to jump through air, through a feature that does not locate anything, or through a part that may sit in more than one position, the model has found a question rather than an answer. Those questions are the most valuable output of this stage.

## State the condition of the assembly

A dimension is not fully defined by its numerical size. The gap may change between loose assembly and tightening, between unloaded and loaded states, or between a cool inspection room and a hot enclosure. Write the state before measuring or calculating.

For this case, the initial model uses clean, fully seated rigid components at a uniform reference temperature of 20 °C. The operating investigation will extend to a uniform 60 °C. It excludes elastic compression, coatings, wear, temperature gradients and geometrical errors until those effects are considered explicitly. These exclusions are open work, not evidence that the effects are negligible.

The difference matters during review. “The assembly meets the gap requirement” is broader than “the ideal one-dimensional model meets the gap limits at 20 °C”. The second statement is a useful result. The first is premature if the remaining mechanisms have not been checked.

Record whether the limit applies during manufacture, after assembly or throughout service. A gap checked before tightening may not represent the operating gap. Conversely, requiring a temporary assembly state to meet a service limit can impose unnecessary work if that state has no functional consequence.

## Name the consequence at each end

The two limits of a requirement usually protect against different failures. For the stop-cartridge gap, a gap that is too small could mean the spacer touches the stop and preloads the cartridge, or that thermal growth closes the remaining space in service. A gap that is too large could allow axial movement that produces impact, noise or loss of positional accuracy.

Writing the two consequences separately helps in three ways. It shows which limit deserves more caution if they differ in severity. It shows which evidence is needed for each: a closing gap might call for a hot test, an opening gap for a vibration or wear check. And it prevents a later review from treating the limits as interchangeable, for example by accepting a shift towards the larger gap because the lower limit was the original worry.

In the teaching record, both ends are treated as equally important. A real project would record the consequence and its severity for each limit, and a tighter or looser margin at one end can then be a deliberate decision rather than an accident of arithmetic.

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

```figure
type: checklist
title: A first requirement record
caption: Each entry still needs evidence in a real project; the record shows what must be proved, not that it has been.
- x Function | preserve controlled axial free space
- x Quantity | gap G between named contact boundaries
- x Limits | 1.85 to 2.15 mm
- x Reference state | seated, unloaded, clean, 20 °C
- x Operating range | uniform 20 to 60 °C
- *x Initial model | G = H − C − S
```

Keep the record short enough to use. A requirement spreadsheet with dozens of empty columns can conceal the same uncertainty as a vague drawing note. The useful test is whether another person can identify what is being protected and which evidence would support acceptance.

Give the requirement an identifier, such as GAP-01, and use it consistently in calculations, inspection records and design reviews. The identifier is a link, not a substitute for a definition. If the meaning changes, preserve the old version so earlier evidence remains interpretable.

## Decide how the requirement will be verified

Before tolerances are allocated, decide how the gap will be confirmed. There are three broad routes:

- **Measure the assembled gap directly**, for example with feeler gauges or a depth gauge through an access point. This tests the real result but needs access, and feeler gauges step in increments and depend on the operator's feel.
- **Measure each component and calculate the gap.** This works when the assembly hides the gap, but it relies on the model being complete and on each measurement representing the contact faces.
- **Test the function**, for example by confirming free movement or the absence of contact at temperature. This shows the mechanism works in the tested conditions but may not reveal how close it is to failing.

The choice affects the design. An inspection hole, a datum face that a gauge can reach, or a fixture for measuring components in their assembled orientation is much cheaper to add now than after tooling is made. Record the intended method in the requirement record, next to the limits it will verify.

## Distinguish requirements from design choices

The gap limits describe the desired result. Choosing a 60 mm housing span or a 6 mm spacer is a design decision intended to achieve that result. A supplier's preferred machining tolerance is a process proposal. Keeping these three levels separate creates room to improve the design.

Suppose the housing supplier cannot hold the initial span economically. The team could tighten a different component, alter the nominal gap, change the assembly architecture or introduce a controlled adjustment. None of those options requires silently changing the functional requirement.

An exception may be legitimate when the original functional limit was unnecessarily restrictive. That requires new functional evidence and approval, followed by an update to dependent records. Rewriting the limit merely because a batch failed it reverses the direction of engineering justification.

Also distinguish design margin from an extra allowance. Margin is the distance between a predicted result and its limit. An allowance is a deliberately assigned amount for an effect, such as wear. If the same effect has already been included in the model, deducting it again as an allowance counts it twice.

## Translate the customer's words

Requirements often arrive in words, not numbers: "must not rattle", "must assemble without force", "must keep running when hot". Those statements are valid starting points but cannot be checked against a drawing until they are translated into a quantity, a limit and a condition.

Keep the original words with the translated requirement. If "must not rattle" became a maximum gap of 2.15 mm, the record should show the original statement, who made the translation and what evidence supported the number. When the limit is later challenged, the team can return to the original need rather than argue about a number whose origin has been lost. If the translation turns out to be wrong, it is the translation that changes, with the customer's need still visible.

## Use a diagram as a question, not proof

A simplified section should reveal the contact sequence and the direction of each term. It need not look like a finished production drawing. Show whether a component rests against a shoulder, floats on a spring or is fixed by a fastener. Those details decide whether its full length belongs in the dimensional chain.

For example, adding a cover thickness to the equation is wrong if the stop is machined into the housing and the cover does not position it. Omitting a washer is wrong if that washer lies directly between the cartridge and the seating face. The importance of a feature comes from its role in the chain, not its size.

Review the model with the people who assemble and inspect the product. They may identify a burr-sensitive seat, a component installed in two orientations or a surface that cannot be reached after assembly. These observations often improve the model more than adding decimal places.

The existing [tolerances, fits and surface finish chapter](/reados/collections/engineering-design-practice/specifying-tolerances-fits-and-surface-finish/) provides the broader drawing context. Here the task is to make one specific assembly quantity traceable.

## Common traps at the start

A few errors recur often enough to check for deliberately:

- **A reference dimension used as a requirement.** A dimension shown on the drawing for information may have no functional meaning at all.
- **The wrong state.** A requirement written for the loose assembly but checked after tightening, or the reverse.
- **A missing intermediate part.** A washer, shim, coating or gasket in the contact path that the sketch left out.
- **Mixed radial and diametral values.** A clearance quoted per side in one document and across a diameter in another.
- **One number serving two functions.** A single gap limit trying to protect both a seal compression and a clearance, which may need different conditions and evidence.

Finding one of these before any tolerance is set costs a conversation. Finding it after production has started can cost the whole batch.

## Exercise: expose the hidden state

A requirement says, “The moving sleeve shall have 0.20 mm clearance.” Write four questions that must be answered before selecting component tolerances.

A sound response asks whether the clearance is radial or diametral, whether 0.20 mm is a nominal value or a limit, which temperature and load state apply, and which surfaces define the measurement. Other useful questions concern coatings, misalignment and the consequence of excessive clearance. There is no valid tolerance calculation until the important ambiguities are resolved.

For the stop-cartridge case, explain what happens to G if S increases by 0.02 mm while H and C remain unchanged. The answer is a **0.02 mm reduction in G**. If the sketch suggests otherwise, repair the signs now. The next chapter uses those signs to calculate the full dimensional bounds.
