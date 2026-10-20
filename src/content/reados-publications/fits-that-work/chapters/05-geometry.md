---
book: fits-that-work
chapterSlug: connect-size-to-datums-and-geometry
order: 5
title: "Connect size to datums and geometry"
description: "Identify the geometric assumptions hidden in a linear stack, relate measurements to functional references and calculate simple angular and radial effects."
draft: true
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

## Distinguish diametral and radial clearance

Consider a separate illustrative pin and hole interface. The smallest hole is 6.40 mm in diameter, and the largest pin is 6.00 mm. Their diametral clearance is 0.40 mm; the available radial offset is only **0.20 mm**, assuming round, straight, aligned rigid features in one cross-section.

If the pin centre is offset from the hole centre by 0.12 mm in x and 0.10 mm in y, its radial offset is:

**r = √(0.12² + 0.10²) = 0.156205 mm**, approximately.

The remaining ideal radial clearance is approximately **0.043795 mm**. If both offsets are 0.16 mm, the resultant is approximately 0.226274 mm, which exceeds the 0.20 mm allowance.

Checking x and y independently against 0.20 mm would incorrectly accept the second case. Checking against the 0.40 mm diametral difference would be worse. This example is a geometrical clearance calculation, not a complete positional-tolerance or virtual-condition analysis.

With two pins, the first contact can constrain how the second aligns. Do not simply apply the one-pin calculation independently to both holes while allowing the part to translate differently for each. The assembly has one physical position. Clearance, spacing, orientation and any intentional relief must be evaluated together.

## Allocate a geometric contribution deliberately

Suppose the stop-cartridge team proposes reserving an additional **±0.010 mm** at the gap output for the combined geometric effects not represented by H, C and S. This is a teaching allocation, not a demonstrated result.

For Revision B, adding that bounded contribution to the thermal-dimensional model gives **1.860000 to 2.127412 mm**. The mathematical margin is 0.010000 mm at the lower side and 0.022588 mm at the upper side, within the uniform-temperature assumptions.

The allocation becomes useful only when the team defines how geometry will be shown to remain within it. That may require an analytical relationship, a measurement across the relevant face, a contact model or a controlled test. Writing “geometry allowance” into a spreadsheet does not create a geometric control.

Check for double-counting. If H was measured between the actual assembled contact points and already includes the effect of a particular tilt, adding the same tilt as a separate output allowance counts it twice. Conversely, a size measurement between nominally fitted planes may not capture the local minimum gap.

## Review the measurement path with the drawing

Make a characteristic map with four columns: functional quantity, controlling features, inspection reference and evidence. For GAP-01, include which faces are used, whether the assembly is loaded, where the gap is evaluated and how local extremes are found.

Ask the manufacturing and inspection teams to describe their set-ups independently. Differences reveal assumptions worth resolving. A fixture that references one side and an inspection method that references the opposite side can both be consistent internally while disagreeing systematically.

The broader [drawing-package guidance](/reados/collections/engineering-design-practice/drawing-packages-suppliers-can-quote-and-make-from/) is useful when converting the result into supplier instructions. The immediate goal is agreement on the physical meaning of the requirement.

## Exercise: estimate the consequence of tilt

A simplified planar surface changes height by 0.03 mm over 120 mm. Estimate the height difference at a point 60 mm from the reference location, then identify one reason the estimate might be insufficient.

The calculated difference is **60 × 0.03 / 120 = 0.015 mm**. The result may be insufficient because the face is not planar, the relevant contact lies elsewhere, the clamp changes the shape or the two sampled points miss a local high spot. The calculation establishes a scale, not a complete inspection.

After geometry is included, a further question remains: how confidently can the resulting gap be measured? The next chapter turns an indicated value into a documented acceptance decision.
