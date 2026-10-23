---
book: fixtures-that-repeat
chapterSlug: locate-the-part-without-overconstraint
order: 2
title: "Locate the part without overconstraint"
description: "Map rigid-body freedoms, separate locating contacts from supporting contacts and evaluate the effects of locator spacing, clearance and loading sequence."
draft: false
---

A part should settle into one intended position without being forced to reconcile conflicting contacts. If it rocks until a clamp bends it flat, the final position depends on clamp force, part stiffness and contact sequence. Those are poor hidden substitutes for a location strategy.

Treat location as a geometry problem before treating it as a hardware-selection problem. Identify the motions that remain possible after each contact is established, then determine how those contacts are maintained during the operation.

## Use six rigid-body freedoms consistently

A free rigid body has three translational and three rotational degrees of freedom. Contact directions are unilateral unless there is a mechanism maintaining contact: a support can push on the part but cannot pull it back down after it lifts.

Some workshop explanations count positive and negative directions separately. This book uses the conventional six-degree-of-freedom rigid-body description. Keeping the convention explicit avoids apparently conflicting counts.

For a rectangular teaching bracket, three non-collinear primary contacts establish a plane when the part remains seated. Two suitably separated contacts on a secondary face establish the remaining in-plane orientation and one lateral position. A final end contact establishes the remaining longitudinal position.

This is the familiar 3-2-1 arrangement. It is a useful starting model, not proof that any six buttons will locate any workpiece. Contact geometry, compliance, clearances and the direction of clamping still matter.

## Name the function of each contact

For the bracket, use x along the 150 mm length, y across the 80 mm width and z normal to the prepared bottom face.

| Contact group | Intended reference | Main role in the seated idealisation |
|---|---|---|
| Three bottom contacts | Prepared primary face | Establish z position and rotations about x and y |
| Two side contacts | Prepared long side | Establish y position and rotation about z |
| One end contact | Prepared end | Establish x position |
| Clamps | Chosen supported regions | Maintain the intended contact state |

```figure
type: tree
title: A 3-2-1 contact map for the bracket
caption: Six contacts remove six freedoms; clamps hold the contacts, they do not locate.
- Locating the bracket
  - Three bottom contacts | primary face: z and two rotations
  - Two side contacts | long side: y and rotation about z
  - One end contact | end face: x
  - *Clamps | maintain the intended contact state
```

The table describes the ideal seated geometry. It does not mean the contacts can resist arbitrary forces in both directions. The load-path review must determine whether a force tends to seat the part or separate it from a contact.

Mark the contacts on a simple section and plan view. Use identifiers that remain consistent in the fixture drawing, inspection method and operating instructions. “Clean the back stops” is less reliable than showing the specific contacts that define the reference.

## Place contacts to reduce sensitivity

Widely separated secondary locators reduce angular sensitivity to a small difference in their positions. This is an illustration: two side contacts are 100 mm apart, and their relative offset is 0.02 mm. A rigid line seated against them has a small-angle slope of **0.02 / 100 = 0.0002**.

At a feature 150 mm from the first contact, the corresponding offset is approximately **0.03 mm**. If the contacts were only 50 mm apart, the same 0.02 mm mismatch would create approximately 0.06 mm at that feature.

```figure
type: bars
title: Why side contacts should be far apart
unit: mm
max: 0.07
caption: The same 0.02 mm mismatch between two side contacts, seen at a feature 150 mm away.
- *Contacts 100 mm apart | 0.03
- Contacts 50 mm apart | 0.06
```

The calculation does not establish a formal positional tolerance for the fixture. It shows why placing locators close together on a convenient small tab can magnify their errors at a distant feature.

Keep contacts on surfaces capable of carrying the expected pressure without unacceptable marking or deformation. The widest geometric span is not useful if one contact sits on a weak unsupported lip.

## Avoid an accidental fourth primary locator

Three points define the ideal primary plane. A fourth fixed-height support can be useful only when its relationship to that plane and the part is understood. If it stands high, the part can rock between competing support sets. If it stands low, it may carry no load until the part bends.

An adjustable or conforming support can provide additional load support after the locating condition is established. Its operating sequence must avoid lifting the part away from the primary references. Locking and load capacity require suitable hardware and application review.

Do not treat “more support” as automatically better. The question is whether the support carries load while preserving the intended reference. A contact that becomes a new uncontrolled locator can reduce repeatability.

## Use pin location with a clear constraint plan

When locating from two holes, two tightly fitting round pins may impose an unnecessary constraint on hole spacing. A relieved secondary locator can accommodate the intended spacing variation while still controlling rotation.

The relief direction matters. For two hole centres lying along x, the secondary arrangement should permit the intended variation along that line while retaining the transverse constraint needed to control rotation. Check the actual manufacturer's geometry; do not infer it from the word “diamond”.

Clearance also creates possible motion. A round pin smaller than its hole does not uniquely centre the hole without a seating force or another centring mechanism. Record which direction the part is seated and how that condition is repeated.

The one-pin radial-clearance calculation in [Fits That Work](/reados/publications/fits-that-work/connect-size-to-datums-and-geometry/) shows why diametral clearance cannot be treated as the allowable offset in each coordinate. Multiple contacts must share one physical assembly position.

## Design the loading sequence with the contacts

An operator should be able to seat the part on the primary supports, bring it against the intended side and end references, and clamp without losing those contacts. Provide access to see or check the important seating condition.

If tightening the first clamp rotates the part away from an end stop, changing the written instruction may not be enough. Reconsider the clamp direction, support arrangement or sequence. A method that depends on holding the part by hand beside a moving or closing mechanism needs redesign and a proper machine-safety assessment.

Provide clearance for non-locating surfaces and for expected incoming variation. A generous relief can prevent an uncontrolled rough face from becoming an accidental datum. Provide a way for chips to leave the locating region rather than collect beneath it.

## Exercise: diagnose inconsistent location

A bracket repeats when the designer loads it, but another operator sometimes obtains a 0.04 mm shift. Both use the same clamps and program. Identify three investigations before changing the machine offset.

Useful investigations include observing seating sequence, checking contamination or burrs at the contacts, and checking whether a clamp or extra support moves the part during tightening. Also inspect incoming reference-face variation and whether the measurement set-up is consistent.

Changing the offset might compensate for one loaded state while making another worse. The objective is first to establish one controlled state. The next chapter checks whether the intended contacts remain valid under the applied loads.
