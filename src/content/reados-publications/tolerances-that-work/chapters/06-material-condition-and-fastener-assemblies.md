---
book: tolerances-that-work
chapterSlug: material-condition-and-fastener-assemblies
order: 6
title: "Material condition, bonus tolerance and fastener assemblies"
description: "Link position tolerances to feature size with maximum material requirements, calculate virtual condition and bonus tolerance, and size clearance-hole patterns that always assemble."
draft: true
---

A clearance hole that is made slightly large gives a bolt more room. If the hole is at its largest permitted size, its position can wander further from true position and the bolt will still pass through. A plain positional tolerance ignores that. It applies the same small zone to a hole at its smallest size, where clearance is tight, and to one at its largest, where clearance is generous. Good parts get rejected for no functional reason.

Material condition modifiers fix this. They tie the geometric tolerance to the actual size of the feature, so a feature that departs from its tightest size earns extra positional tolerance. This chapter explains the idea, the calculations behind it and the standard formulas for sizing fastener patterns.

## Maximum and least material condition

Every feature of size has two extreme states:

- **Maximum material condition (MMC)** is the state in which the part contains the most material: the smallest size of a hole, or the largest size of a shaft or pin.
- **Least material condition (LMC)** is the opposite: the largest hole or the smallest shaft.

For a Northgate clearance hole drawn Ø9.0 with deviations +0.2 and 0, MMC is Ø9.0 and LMC is Ø9.2.

MMC is usually the critical state for assembly, because it is when clearance is smallest. LMC is usually the critical state for strength or wall thickness, because it is when material is thinnest, for example the wall between a bore and an outside edge.

## The maximum material requirement

In ISO practice, a circled M after the tolerance value in a feature control frame invokes the maximum material requirement defined in ISO 2692. ASME Y14.5 uses the same symbol and calls it the MMC modifier. In either system, the stated geometric tolerance applies when the feature is at MMC, and the tolerance increases by the amount the actual feature departs from MMC.

That increase is called **bonus tolerance**. For a hole with a position tolerance of Ø0.5 at MMC:

| Actual hole size | Departure from MMC | Permitted position tolerance |
|---|---|---|
| Ø9.00 (MMC) | 0.00 | Ø0.50 |
| Ø9.10 | 0.10 | Ø0.60 |
| Ø9.15 | 0.15 | Ø0.65 |
| Ø9.20 (LMC) | 0.20 | Ø0.70 |

The bonus is not a loophole. A larger hole genuinely gives the fastener more room, so the extra positional tolerance has no effect on assembly. The modifier simply lets the drawing say so.

```figure
type: line
title: Bonus tolerance grows as the hole departs from MMC
x: Actual hole size (mm)
y: Permitted position tolerance (Ø mm)
ymin: 0.4
ymax: 0.75
mark: 9.15 | Ø9.15 earns Ø0.65
caption: Every 0.01 mm of extra hole size adds 0.01 mm of positional tolerance, because the clear opening never shrinks.
- 9.00 | 0.50
- 9.05 | 0.55
- 9.10 | 0.60
- 9.15 | 0.65
- 9.20 | 0.70
```

## Virtual condition

The concept that makes this work is **virtual condition**, called the maximum material virtual condition in ISO terminology. It is the worst-case boundary created by the combined effect of size at MMC and the geometric tolerance at MMC:

- For a hole: virtual condition = MMC size − geometric tolerance at MMC
- For a pin or shaft: virtual condition = MMC size + geometric tolerance at MMC

For the Northgate hole, virtual condition is 9.0 − 0.5 = Ø8.5. Whatever combination of size and position a conforming hole has, a perfect Ø8.5 pin at the true position will always pass through it. If the hole is at MMC it can be off true position by up to 0.25 mm radially; if it is larger, it can be further off, but the clear opening at true position never falls below Ø8.5.

```figure
type: svg
title: Virtual condition: the opening that always stays clear
alt: Two clearance holes of diameter 9.0 at their maximum material size, each shifted 0.25 millimetres from true position in opposite directions. A pin of diameter 8.5 at true position fits inside both.
caption: Hole at MMC Ø9.0, shifted by the full 0.25 mm radial allowance either way, still clears a perfect Ø8.5 pin at true position.
viewbox: 0 0 640 300
body:
<circle class="lf dsh" cx="310" cy="150" r="120"/>
<circle class="li" cx="303" cy="150" r="120"/>
<circle class="li dsh" cx="317" cy="150" r="120"/>
<circle class="bxa" cx="310" cy="150" r="113"/>
<path class="cl" d="M150 150H470M310 20V280"/>
<text class="txa" x="310" y="155" text-anchor="middle">Ø8.5 pin = virtual condition</text>
<text class="tx" x="490" y="80">Hole at MMC Ø9.0,</text>
<text class="tx" x="490" y="100">shifted 0.25 mm right</text>
<text class="tx" x="30" y="80">Hole at MMC Ø9.0,</text>
<text class="tx" x="30" y="100">shifted 0.25 mm left</text>
<path class="la" d="M303 274H317M303 268V280M317 268V280"/>
<text class="tx" x="310" y="295" text-anchor="middle">0.5 mm total shift = position tolerance</text>
```

Virtual condition is the number that matters for assembly. Two features fit together in every case if the virtual condition of the hole is at least as large as the virtual condition of the pin or bolt.

## Fastener formulas

Two common configurations give simple, widely used formulas. They assume the positional tolerances apply at MMC and are equal on the mating parts, and they use the fastener's maximum diameter.

**Floating fasteners** pass through clearance holes in both parts and are secured by nuts. Each part has a clearance hole, so each part can use the full clearance:

**T = H − F**

where T is the positional tolerance diameter for each part, H the hole's MMC diameter and F the fastener's maximum diameter.

**Fixed fasteners** are restrained in one part, for example by a tapped hole or a press-fitted stud, and pass through a clearance hole in the other. The clearance must be shared between the two parts:

**T = (H − F) ÷ 2**

when the tolerance is split equally. It can also be split unequally, as long as the two tolerances add up to H − F.

This is an illustration from the guide roller. The housing is fixed to the frame with four M8 screws into tapped holes in the frame. ISO 273 lists clearance holes for M8 screws in fine, medium and coarse series of Ø8.4, Ø9 and Ø10. Northgate chose the medium series, Ø9.0. Using the nominal 8.0 mm as a conservative maximum screw diameter:

- **Fixed fastener case:** T = (9.0 − 8.0) ÷ 2 = 0.5 mm. The housing holes get position Ø0.5 at MMC, and the tapped holes in the customer's frame are specified at position Ø0.5 at MMC as well.
- **If the design used through-bolts and nuts instead:** T = 9.0 − 8.0 = 1.0 mm for each part.

```figure
type: compare
title: Floating and fixed fasteners with M8 screws in Ø9.0 holes
cols: Floating: bolt and nut | Fixed: tapped hole
caption: A tapped hole uses its share of the clearance without having any, so the fixed case halves each part's tolerance.
- Formula | T = H − F | T = (H − F) ÷ 2
- Calculation | 9.0 − 8.0 | (9.0 − 8.0) ÷ 2
- Position tolerance per part at MMC | Ø1.0 | Ø0.5
- Extra control needed | None beyond the two hole patterns | Projected tolerance zone on the tapped holes
```

The fixed case halves the available tolerance, which is why tapped-hole patterns are more demanding to make and why frame drawings sometimes cause assembly trouble that the housing drawing did not.

## Projected tolerance zones for tapped holes

A tapped hole whose axis is slightly tilted presents another problem. The screw follows the thread, so it leans across the joint and into the clearance hole of the mating part. The relevant location error is not at the surface of the frame but up in the clearance hole, as high as the thickness of the clamped part.

A **projected tolerance zone**, shown with a circled P and a projection height, moves the positional tolerance zone out of the tapped hole into the space the screw will occupy. For the Northgate frame, the projection height should be at least the maximum thickness of the housing flange that the screws pass through. Without projection, a frame could pass inspection with tapped holes correctly located at the surface but tilted enough that the screws foul the housing holes.

## Using a functional gauge

Material condition modifiers make inspection simpler as well as more permissive. Because virtual condition is a fixed boundary, conformance can be checked with a **functional gauge**: a fixture representing the datum features with pins at the virtual condition size placed at true positions.

For the housing, a gauge would provide a flat surface for datum A, a locating feature for datum B and four Ø8.5 pins at the basic hole pattern. A housing whose holes all accept the pins, while its mounting face sits on the gauge surface, conforms to the positional requirement. Each hole's size is still checked separately against its limits. A gauge like this is quick to use on the shop floor and reflects assembly directly. It is worth the cost when volumes justify it; for small quantities, a coordinate measuring machine can compute the same result from measured data.

## Zero positional tolerance at MMC

A less familiar but useful technique is to specify a position tolerance of zero at MMC and widen the size tolerance instead. For the housing hole, a size of Ø8.5 to Ø9.2 with position Ø0 at MMC gives exactly the same virtual condition, Ø8.5, as the original Ø9.0 to Ø9.2 with Ø0.5. Functionally the requirement is identical.

The difference is flexibility. The supplier can trade size against position freely. A hole drilled at Ø8.8 can be up to 0.3 mm off true position in diameter terms; one at Ø9.2 can be up to 0.7 mm off. Some parts that would be rejected under the conventional specification, a hole at Ø8.9 located perfectly, for example, become acceptable. The technique needs clear communication with suppliers who have not met it, because "zero tolerance" can be misread as a demand for perfection.

## Least material condition and datum modifiers

The least material requirement, shown with a circled L, works the same way in the other direction. It protects minimum wall thickness or minimum engagement, for example the edge distance from a hole to the outside of a thin flange. The tolerance applies at LMC and increases as the feature moves towards MMC.

Modifiers can also be applied to **datum references**. If datum B, the bearing bore, were referenced at its maximum material boundary in the position tolerance for the bolt holes, the gauge would use a fixed pin for the bore rather than an expanding mandrel. A housing with a bore larger than that pin could shift on it, and the hole pattern would gain some extra movement relative to the bore. That reflects assemblies where the mating part has clearance in the bore. In the Northgate unit, the bore holds the bearing that defines where the shaft runs, so the bolt pattern is better located relative to the actual bore axis, without that shift.

## ISO and ASME differences

The underlying geometry of MMC, virtual condition and bonus tolerance is the same in both systems, but invocation and defaults differ:

- In ISO GPS, the independency principle of ISO 8015 applies unless a modifier says otherwise. The maximum material requirement in ISO 2692 links size and geometry for the toleranced feature, and ISO 2692 also defines a reciprocity requirement that allows a size tolerance to grow when the geometric deviation is less than permitted.
- In ASME Y14.5, Rule #1 already imposes perfect form at MMC on regular features of size, and the MMC modifier adds bonus tolerance to the geometric control.

A drawing that names its governing standard, and uses modifiers deliberately, avoids most disputes.

## Common mistakes

- **Using regardless-of-size position for clearance holes.** It rejects good parts and makes functional gauging impossible.
- **Applying the floating formula to fixed fasteners.** That doubles the tolerance the assembly can actually accept.
- **Omitting projected zones on tapped holes** in thick clamped parts.
- **Using MMC where the function is not assembly.** Features that locate precisely, such as a dowel hole defining the position of a precision part, may need tolerances that do not grow with size.
- **Forgetting the mating part's drawing.** A positional tolerance on the housing only guarantees assembly if the frame is controlled consistently.

## Questions to ask

- Is the function of this feature assembly with clearance, where bonus tolerance is harmless?
- Is the fastener fixed or floating, and has the clearance been divided accordingly?
- Do tapped holes need a projected tolerance zone, and what projection height?
- What is the virtual condition of each mating feature, and do they always clear?
- Would a functional gauge or a coordinate measuring machine be the better verification method at the expected volume?

## Exercise: size a bolt pattern

For a two-part bolted joint you know, record the fastener size, the clearance hole size and whether each fastener is fixed or floating. Calculate the positional tolerance each part can have at MMC and the virtual condition of the holes. Compare your results with the tolerances on the current drawings.

So far, each requirement has been checked on one part at a time. The next chapter adds variation through a chain of parts and calculates the worst-case result for the guide roller's axial float.
