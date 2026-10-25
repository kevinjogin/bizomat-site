---
book: plastic-parts-by-the-numbers
chapterSlug: clamp-force-shot-size-and-cycle-time
order: 8
title: "Clamp force, shot size and cycle time"
description: "Estimate the clamp force and shot a part needs, choose a machine size, build up a cycle time from fill, pack, cooling and ejection, and see where seconds can be saved."
draft: false
---

A moulding machine is chosen to suit the part and the mould, not the other way round. It must hold the mould closed against the pressure of the melt, inject enough plastic in each shot, and accept the mould's size between its tie bars. Once the machine is chosen, its hourly rate and the cycle time together set most of the part's cost. A designer who can estimate these numbers can see the cost consequences of design decisions long before a moulder quotes.

This chapter estimates the clamp force and shot size for the cover, chooses a machine size, builds up a cycle time and shows which seconds the design controls.

## Why the mould must be clamped

When the cavity is full and the machine applies packing pressure, the melt pushes on every surface of the cavity. The force trying to open the mould is the pressure acting on the part's area projected onto the parting plane. If the clamp cannot resist it, the mould halves separate slightly and melt escapes into the gap, forming flash along the parting line.

The required clamp force is therefore the projected area multiplied by the average pressure in the cavity, with a margin. The projected area is easy to calculate from the CAD model. The average cavity pressure is not: it varies with material, wall thickness, flow length and process, and the peak near the gate can be much higher than the average near the end of fill. A mould flow analysis estimates it, and an experienced moulder can judge it from similar parts.

## Estimate the clamp force

This is an illustration. The cover's projected area, looking along the mould's opening direction, is its plan outline, **160 × 100 = 16,000 mm²**. The skirt walls run parallel to the opening direction, so they add almost nothing to the projected area. The mould flow analysis in Chapter 7 predicted a peak injection pressure at the gate of about 60 MPa; the moulder suggests an average cavity pressure of about 30 MPa for planning, half the gate peak, which is a common pattern for a part of this flow length. The value is an assumption to be confirmed by the analysis and the trials.

```figure
type: formula
title: Clamp force estimate for the cover
formula: F_clamp = A_projected × p_average × margin
caption: Teaching values. The average cavity pressure is an assumption from the moulder; a mould flow analysis or measured cavity pressure gives a better figure.
- A_projected | Part area projected onto the parting plane, mm²
- p_average | Average cavity pressure during packing, MPa
- margin | Allowance for pressure variation, here 15%
step: 16,000 mm² × 30 MPa = 480,000 N = 480 kN
step: 480 kN ÷ 9.81 ≈ 49 tonnes-force
step: With a 15% margin, about 56 tonnes-force
```

Machines are commonly rated in tonnes of clamping force, meaning tonnes-force, so 480 kN corresponds to about **480,000 / 9,810 ≈ 49 tonnes**. With a 15% margin, the cover needs a machine of at least about 56 tonnes. The next common size up, perhaps a 60 or 80 tonne machine depending on the moulder's fleet, would suit, subject to the checks below.

## Check the shot size and the barrel

Each shot must deliver the part, the runner if there is one, and a small cushion of melt left in front of the screw so that packing pressure can be maintained. For the cover, the part is about 66.2 cm³ from Chapter 1. A three-plate cold runner adds about 6 g, or about 5 cm³ of polycarbonate, so the shot is about 72 cm³; with a hot tip, it is about 66 cm³.

The shot should sit within the range of the machine's barrel capacity that the moulder considers good practice for the material. A shot that uses only a small fraction of a large barrel leaves melt sitting at temperature for many cycles, which can degrade heat-sensitive materials; a shot near the barrel's full capacity leaves no reserve for packing and makes the process hard to control. Polycarbonate is processed at about 300 °C, so residence time matters. The moulder will match the barrel to the shot; the designer's job is to give them the shot volume.

The mould must also physically fit. Its plates must pass between the machine's tie bars, its closed height must suit the machine's daylight and its opening stroke must be long enough to release the part. The cover's mould, with lifters and a hot tip, is compact enough for a 60 to 80 tonne machine, but a two-cavity mould might need a larger machine for space as much as for force.

## Build up the cycle time

A moulding cycle has four main phases: filling the cavity, packing and holding pressure while the part shrinks, cooling until the part is stiff enough to eject, and opening the mould, ejecting the part and closing again.

```figure
type: stack
title: Estimated cycle for the single-cavity cover mould
unit: s
caption: Teaching values totalling 17.5 s. The hold phase is part of the in-mould cooling time, so cooling after hold is 7.3 s of the 11.3 s estimate from Chapter 2.
- Fill | 1.2
- Pack and hold | 4
- Cooling after hold | 7.3
- Open, eject and close | 5
```

This is an illustration. The fill time of 1.2 s comes from the mould flow analysis. Chapter 2 estimated that the part needs about 11.3 s from the end of filling until it is cool enough to eject, including a 20% margin. The holding pressure is applied for the first 4.0 s of that time, until the gate freezes, so the cooling timer after hold is set to about **11.3 − 4.0 = 7.3 s**. Opening, ejecting and closing the mould take about 5 s on a machine of this size with lifters and a robot to take the part.

The total is about **1.2 + 11.3 + 5.0 = 17.5 s**, or about **3,600 / 17.5 ≈ 206** covers an hour. The 11.3 s in the mould after filling is about 65% of the cycle, which is why Chapter 2's decisions about wall thickness matter so much. RJG's measured breakdown of a moulding cycle found the time spent getting the part cool enough to eject, including filling and packing, was about 85% of its cycle; the exact share varies with the part and the machine, but the conclusion is the same.

At 8,000 covers a year, the mould runs for about **8,000 × 17.5 / 3,600 ≈ 39 hours** a year, a small fraction of a machine's available time. That affects the economics in Chapter 9: the cover will be run in batches, and the time to set the mould up for each batch becomes a significant cost.

## See which seconds the design controls

Each phase of the cycle depends on design decisions as well as on the moulder.

- **Cooling** depends on the wall thickness squared, the material's thermal properties and the mould temperature. A wall of 2.0 mm instead of 2.5 mm would cut the estimated cooling time from about 9.4 to about 6.0 s before margin, about 4 s per cycle with margin. The thickest local section governs, which is why the cored bosses in Chapter 4 matter.
- **Mould opening and ejection** depend on the part's geometry. Lifters and slides add movement and time; deep parts need longer strokes. The cover's lifters add perhaps half a second.
- **Packing** depends on gate size and wall thickness. A gate that freezes early shortens the hold time but leaves the part under-packed.
- **Filling** is short for most parts and depends mostly on the machine and the flow length.

The mould's cooling design matters as much as the part. Covestro's design guide observes that money spent on enhanced mould cooling can pay back many times over in reduced cycle time and improved part quality. A mould with cooling channels close to the ribbed core and balanced between the two halves, as Chapter 6's warpage case showed, can run at the estimated cooling time; a poorly cooled mould may need several extra seconds to eject a part that holds its shape.

## Match the machine to the mould

With the clamp force, shot and mould size estimated, the moulder can match the job to a machine. The table below shows how the choice looks for the single-cavity and two-cavity moulds. The hourly rates are invented for teaching and exclude GST; real rates depend on the moulder, the machine's age and whether an operator or a robot attends it.

```figure
type: compare
title: Machine choices for the cover moulds
cols: Clamp needed with margin | Machine class | Illustrative hourly rate | Parts per hour
caption: Teaching values excluding GST. The larger mould needs a larger and dearer machine, so doubling the cavities does not halve the machine cost per part.
- Single cavity, cold runner | About 56 t | 60 to 80 t | A$85 | About 206
- Single cavity, hot tip | About 56 t | 60 to 80 t | A$85 | About 206
- *Two cavities, hot manifold | About 120 t | 150 t | A$110 | About 389
```

Two details deserve attention. The hot tip does not change the clamp force or the machine class for a single cavity, because the runner it removes is small and lies at the centre of the part's outline. And the two-cavity mould's cycle of about 18.5 s gives about **2 × 3,600 / 18.5 ≈ 389** parts an hour, not 412, because the larger mould opens and closes more slowly.

The moulder may also prefer to run a mould on a machine larger than strictly necessary, simply because it is free. That is usually acceptable for clamp force, since the clamp can be set below the machine's maximum, but a much larger barrel than the shot needs raises the residence-time concern above. The brief can state the acceptable machine range so that a quote based on an unsuitable machine is easy to spot.

## Check the estimate against the trial

The first trials give real numbers. The moulder will find the shortest cooling time at which parts eject cleanly and meet their dimensions, and will usually add a margin, as RJG recommends, for variation in material and machine. If the trial cycle is much longer than the estimate, the difference points to a cause: a hot spot in the mould, a thick region not cored out, a part sticking on the core, or simply a cautious first setting that will be shortened as the process is optimised.

This is an illustration. At the first trial, the moulder runs the cover at a 21 s cycle while dialling in the process, then shortens it to 18 s once the parts are stable, close to the 17.5 s estimate. The estimate has done its job: it set an expectation that the trial could be measured against, and it told the purchasing team roughly what the parts would cost before the mould existed.

## Record the estimates in the brief

Write the projected area, the assumed cavity pressure, the clamp force with its margin, the shot volume and the estimated cycle into the brief, beside the mould life and the cavity count. Every toolmaker and moulder then quotes against the same assumptions, and any quote that departs from them, a smaller machine or a much longer cycle, stands out and can be questioned before an order is placed. The same numbers become the benchmark for the trial in Chapter 10, where the real cycle and clamp setting are recorded against them.

## A failure case: the clamp that was too small

This is an illustration. In an earlier project, a similar cover was quoted for a 40 tonne machine because the moulder had one free. The projected area had been estimated from the part's mass rather than its outline, and the estimate of about 11,000 mm² was well short of the true 16,000 mm².

At the first trial, every part had a fine flash along the skirt edge at the end farthest from the gate, where the parting line was last to be pressurised. Raising the clamp to the machine's maximum reduced the flash but did not remove it, and lowering the packing pressure to stop the flash left sink marks around the bosses. The process window had collapsed: there was no setting that gave parts free of both flash and sink.

The detection should have come before the trial. The projected area is a two-minute calculation from the CAD outline, and **16,000 × 30 / 9,810 ≈ 49 tonnes** already exceeds 40 tonnes before any margin. Moving the mould to a larger machine solved the problem at once but changed the hourly rate and the quoted price.

## Plan for a second cavity

A two-cavity mould makes two covers per cycle. Its projected area is twice the part's plus the runner's, so with a hot manifold and about 2,000 mm² for the manifold's drops and the gates' surroundings, the area is about **2 × 16,000 + 2,000 = 34,000 mm²**. At the same 30 MPa, the clamp force is about **34,000 × 30 = 1,020 kN**, or about 104 tonnes, and about 120 tonnes with a 15% margin. A two-cavity mould is also larger, so it needs a larger machine, at a higher hourly rate, both for force and for space.

The cycle grows slightly too, perhaps by a second for the longer opening stroke and robot movement, so each cycle takes about 18.5 s and produces two parts. Chapter 9 uses these numbers to decide whether the second cavity pays at 8,000 covers a year.

## Exercise: the effect of a thinner wall on capacity

If the wall were reduced to 2.2 mm everywhere and the cooling estimate scaled with the square of thickness, what would the in-mould time after filling and the total cycle become, keeping the 20% margin, the 1.2 s fill and the 5.0 s for opening and ejection? How many covers an hour would the mould make?

**Worked answer.** The estimate scales by **(2.2 / 2.5)² ≈ 0.774**, so the 9.4 s estimate becomes about 7.3 s, and with a 20% margin about **8.7 s**. The cycle becomes about **1.2 + 8.7 + 5.0 = 14.9 s**, so the mould makes about **3,600 / 14.9 ≈ 241** covers an hour, about 17% more than at 2.5 mm. The thinner wall would need its stiffness checked again with the rib grid from Chapter 4, and its flow-length ratio rises to about **112 / 2.2 ≈ 51**, which the mould flow analysis would need to confirm.
