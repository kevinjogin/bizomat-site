---
book: fits-that-work
chapterSlug: connect-size-to-datums-and-geometry
order: 5
title: "Connect size to datums and geometry"
description: "Identify the geometric assumptions hidden in a linear stack, relate measurements to functional references and calculate simple angular and radial effects."
draft: false
---

The gap model assumes parallel contact faces and an unambiguous axial measurement. Real parts have form, orientation and location variation as well as size variation. A scalar stack can remain perfectly calculated while omitting the mechanism that causes assembly difficulty.

Geometry should enter the model because it affects function, not because a drawing looks more sophisticated with additional symbols. The task is to connect a controlled feature, its reference system and a measurable consequence.

## Identify what the scalar model leaves out

The stop-cartridge equation treats each axial length as if it applies uniformly over a face. Imagine instead that one seating face is tilted. The gap may be larger on one side and smaller on the other. A measurement at the centre can satisfy the limit while a corner closes first.

Before adding a geometric tolerance, decide which gap matters. Is the requirement the minimum local separation anywhere over an interface, the travel measured along an axis, or a distance at a designated inspection point? Those definitions can produce different answers on the same assembly.

Also investigate how the components actually contact. A broad face may touch at three high points rather than over its entire area. Tightening may change the contact pattern. A coating or burr may set the position. A nominal planar surface in CAD is not proof of the assembled contact state.

## Use references that represent the function

A datum reference system establishes how features are related for specification and evaluation. In practical review, identify which physical features establish the primary seating direction, which establish the remaining orientation, and which establish the remaining position.

Do not casually mix formal definitions from different drawing standards. Select the governing standard and edition, and have the symbols and interpretation reviewed by someone competent in that system. This chapter explains geometric consequences; it does not reproduce the normative rules of an ISO or ASME standard.

For the teaching assembly, a logical starting reference is the housing seating face because it establishes the start of the axial chain. Measuring every component from an unrelated convenient external face could introduce an unexamined transfer distance. If the convenient face is necessary for production access, document and control that transfer.

The inspection set-up should reproduce the intended reference relationship or account for the difference. A coordinate measuring machine can report a highly repeatable distance in a reference frame that does not represent assembly function.

## Calculate a simple angular effect

This is an illustration. Two points on a nominally planar seating surface, separated by 100 mm, differ in height by 0.05 mm. In a simplified rigid-plane model:

**tan θ = 0.05 / 100 = 0.0005.**

At a point 40 mm from the reference location, the corresponding height change is **40 × 0.0005 = 0.020 mm**. The effect alone equals Revision A's original cold dimensional margin.

The example does not convert a formal flatness or parallelism callout into an equivalent tilt automatically. Two measured points do not characterise a whole surface, and a warped face is not a plane. The calculation asks whether an angular mechanism could be important enough to investigate.

The useful response may be changing the support arrangement, controlling a functional surface, measuring the local gap directly or modifying the requirement. Tightening an unrelated outside dimension will not remove the tilt.

## Non-parallel ends can add or cancel

Each component in the chain has two ends. If those ends are not parallel, the part is a slight wedge, and its length depends on where it is measured. When wedges are stacked, their errors combine according to how the parts are rotated relative to each other.

This is an illustration. Suppose the cartridge and the spacer each have ends that differ in height by 0.02 mm across a 40 mm diameter. If the assembler happens to align their thick sides, the spacer's free face ends up tilted by 0.04 mm across the 40 mm, so the gap at one edge is 0.02 mm smaller than at the centre and at the other edge 0.02 mm larger. If their thick sides are opposed, the wedges cancel and the free face is parallel again.

```figure
type: compare
title: Two wedge-shaped parts stacked two ways
cols: Thick sides aligned | Thick sides opposed
caption: Each part varies by 0.02 mm across 40 mm. The same parts give different local gaps depending on how they are clocked.
- Tilt of the free face | 0.04 mm across 40 mm | About zero
- Gap change at the edges | ± 0.02 mm | About zero
- *Gap at the centre | Unchanged | Unchanged
```

Three conclusions follow. First, measuring the gap at the centre can hide an edge that is 0.02 mm closer, the whole of Revision A's original cold margin. Second, unless the assembly process controls the rotation of each part, the worst alignment must be assumed, because nothing prevents it. Third, controlling the parallelism of the functional ends, or specifying how parts are oriented at assembly, may achieve more than tightening their lengths.

## Flat faces seat on their high points

A face that is not perfectly flat does not touch its mate over its whole area. A rigid part rests on its three highest points, or on whatever pattern of high spots clamping force produces. The seated position therefore depends on the peaks, not on the average surface.

A length measured with a micrometer across the centre of two faces may differ from the length that sets the assembly. If one face of the spacer has a flatness deviation of 0.01 mm, with high spots near its edge, the spacer can act up to 0.01 mm longer in the assembly than a centre measurement shows. When margins are counted in hundredths of a millimetre, that difference belongs in the model or in the measurement method.

Measuring on a surface plate, with the part resting on its functional face as it would in the assembly, captures the seated length more faithfully than a two-point measurement. The inspection instruction should say which of the two is required, because both will be described as "measuring the thickness".

## Corners, burrs and fillets decide where parts sit

The most common geometric surprise is not tilt or flatness but a corner. Three cases recur:

- **A burr on a seating edge.** A burr only 0.05 mm high under the cartridge's seat lifts it by that amount, more than twice Revision A's original margin. Deburring requirements, and an inspection step that looks for burrs, protect the chain cheaply.
- **A fillet larger than the chamfer that should clear it.** If a housing's internal corner has a fillet of 0.5 mm radius, and the cartridge's matching edge has only a 0.3 mm chamfer, the cartridge rests on the fillet instead of the face. It sits slightly proud, and the error depends on the actual radius, which may not be inspected at all.
- **Debris and coatings.** Swarf in a corner or a paint run on a seat has the same effect as a burr, and often varies from assembly to assembly.

None of these appears in G = H − C − S, and none is fixed by tightening H, C or S. They are controlled by specifying corner relief, chamfers that clear fillets with margin, edge condition and cleanliness, and by checking them.

## Distinguish diametral and radial clearance

Consider a separate illustrative pin and hole interface. The smallest hole is 6.40 mm in diameter, and the largest pin is 6.00 mm. Their diametral clearance is 0.40 mm; the available radial offset is only **0.20 mm**, assuming round, straight, aligned rigid features in one cross-section.

If the pin centre is offset from the hole centre by 0.12 mm in x and 0.10 mm in y, its radial offset is:

**r = √(0.12² + 0.10²) = 0.156205 mm**, approximately.

The remaining ideal radial clearance is approximately **0.043795 mm**. If both offsets are 0.16 mm, the resultant is approximately 0.226274 mm, which exceeds the 0.20 mm allowance.

Checking x and y independently against 0.20 mm would incorrectly accept the second case. Checking against the 0.40 mm diametral difference would be worse. This example is a geometrical clearance calculation, not a complete positional-tolerance or virtual-condition analysis.

```figure
type: compare
title: Checking a radial offset correctly
cols: Offsets 0.12 and 0.10 mm | Offsets 0.16 and 0.16 mm
caption: A 6.40 mm hole and 6.00 mm pin allow only 0.20 mm of radial offset; combine x and y before comparing.
- Resultant offset | About 0.156 mm | About 0.226 mm
- Against 0.20 mm radial | Inside, about 0.044 mm left | Exceeds the allowance
- *Checking x and y separately | Accepts | Wrongly accepts
```

With two pins, the first contact can constrain how the second aligns. Do not simply apply the one-pin calculation independently to both holes while allowing the part to translate differently for each. The assembly has one physical position. Clearance, spacing, orientation and any intentional relief must be evaluated together.

## Size and position trade against each other

The pin and hole example shows a general relationship. The clearance available for positional error depends on the actual sizes of the features. A hole made at its largest and a pin at its smallest leave more room for offset than the worst-case pair above; a hole at its smallest and a pin at its largest leave the least. Geometrical tolerancing systems provide formal ways to express this interaction, so that a part with favourable sizes may be allowed more positional variation without affecting assembly.

Those rules are powerful, but they belong to the governing standard and must be applied as it defines them. For this book, the point is narrower: never evaluate a positional or orientation error in isolation from the sizes of the features involved. A check that uses nominal sizes can accept an assembly that fails at the size limits, or reject one that would have assembled comfortably.

## Allocate a geometric contribution deliberately

Suppose the stop-cartridge team proposes reserving an additional **±0.010 mm** at the gap output for the combined geometric effects not represented by H, C and S. This is a teaching allocation, not a demonstrated result.

For Revision B, adding that bounded contribution to the thermal-dimensional model gives **1.860000 to 2.127412 mm**. The mathematical margin is 0.010000 mm at the lower side and 0.022588 mm at the upper side, within the uniform-temperature assumptions.

```figure
type: range
title: Revision B with a geometric allocation
unit: mm
min: 1.8
max: 2.2
caption: Reserving ±0.010 mm for geometry not in H, C and S leaves 0.010 mm and about 0.023 mm of margin.
- Functional requirement | 1.85 | 2.15
- Thermal-dimensional model | 1.87 | 2.117
- *Plus ±0.010 mm for geometry | 1.86 | 2.127
```

The allocation becomes useful only when the team defines how geometry will be shown to remain within it. That may require an analytical relationship, a measurement across the relevant face, a contact model or a controlled test. Writing “geometry allowance” into a spreadsheet does not create a geometric control.

Check for double-counting. If H was measured between the actual assembled contact points and already includes the effect of a particular tilt, adding the same tilt as a separate output allowance counts it twice. Conversely, a size measurement between nominally fitted planes may not capture the local minimum gap.

## Decide how geometric contributions combine

The questions of Chapter 3 apply to geometry as well as size. Geometric errors can be added as bounds, or combined statistically if there is evidence about their distributions and independence. Two features make the bound more often appropriate for geometry. Angular errors can usually be oriented in any direction, so the unfavourable alignment is not rare unless something prevents it. And geometric deviations are measured less often than sizes, so the data needed to support a statistical model are frequently missing.

Whichever method is chosen, keep the geometric contributions visible as separate lines in the model, with their source. A single "geometry allowance" without a breakdown cannot be checked, cannot be compared with inspection results, and invites the double-counting described above.

## Review the measurement path with the drawing

Make a characteristic map with four columns: functional quantity, controlling features, inspection reference and evidence. For GAP-01, include which faces are used, whether the assembly is loaded, where the gap is evaluated and how local extremes are found.

Ask the manufacturing and inspection teams to describe their set-ups independently. Differences reveal assumptions worth resolving. A fixture that references one side and an inspection method that references the opposite side can both be consistent internally while disagreeing systematically.

The broader [drawing-package guidance](/reados/collections/engineering-design-practice/drawing-packages-suppliers-can-quote-and-make-from/) is useful when converting the result into supplier instructions. The immediate goal is agreement on the physical meaning of the requirement.

## Find the local minimum when inspecting

If the requirement is the minimum local gap, inspection must look for the minimum, not the gap at a convenient point. For the stop-cartridge case, practical methods include:

- **Feeler gauges at several positions** around the circumference, for example four at 90° intervals, recording each reading and the smallest.
- **A height gauge or indicator** traversed across the spacer face and the housing stop, building a small map of both surfaces relative to a common reference.
- **A coordinate measuring machine** sampling enough points on both faces to find their closest approach in the assembled orientation.

Each method has a resolution and an uncertainty, which Chapter 6 shows how to estimate. The record should show not only the minimum found, but also how many positions were checked and where, so that a later reviewer can judge whether the true minimum could have been missed.

## Exercise: estimate the consequence of tilt

A simplified planar surface changes height by 0.03 mm over 120 mm. Estimate the height difference at a point 60 mm from the reference location, then identify one reason the estimate might be insufficient.

The calculated difference is **60 × 0.03 / 120 = 0.015 mm**. The result may be insufficient because the face is not planar, the relevant contact lies elsewhere, the clamp changes the shape or the two sampled points miss a local high spot. The calculation establishes a scale, not a complete inspection.

After geometry is included, a further question remains: how confidently can the resulting gap be measured? The next chapter turns an indicated value into a documented acceptance decision.
