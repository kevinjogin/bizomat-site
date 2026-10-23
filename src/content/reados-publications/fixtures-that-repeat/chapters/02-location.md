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

## Place side contacts at the right height

Side and end contacts touch faces that have edges, and the edges are rarely sharp and clean. A chamfer, an edge radius or a burr along the bottom edge can sit exactly where a low contact would touch. A contact placed too high, on the other hand, lets the clamping or cutting force tilt the part about the bottom edge.

For the 16 mm thick bracket, a practical starting point is to place the side and end contacts near mid-thickness, clear of any chamfer or radius at either edge. If the bottom edge has a 0.5 mm chamfer, a contact centred about 6 to 10 mm above the bottom face touches the flat side with margin. Record the contact height on the fixture drawing; it is as much part of the location strategy as the contact's position along the face.

Relieve the corner where the primary supports meet the side contacts. A sharp internal corner in the fixture traps chips and prevents the part's edge from seating, especially if the part carries a small burr. A relief groove or a gap between the support and side locator gives debris and edge features somewhere to go.

## Avoid an accidental fourth primary locator

Three points define the ideal primary plane. A fourth fixed-height support can be useful only when its relationship to that plane and the part is understood. If it stands high, the part can rock between competing support sets. If it stands low, it may carry no load until the part bends.

An adjustable or conforming support can provide additional load support after the locating condition is established. Its operating sequence must avoid lifting the part away from the primary references. Locking and load capacity require suitable hardware and application review.

Do not treat “more support” as automatically better. The question is whether the support carries load while preserving the intended reference. A contact that becomes a new uncontrolled locator can reduce repeatability.

## Keep clamp forces inside the support triangle

Three primary supports define a triangle on the bottom face. A downward clamping force that acts inside that triangle presses the part onto all three supports. A force acting outside it tends to tip the part about the nearest edge of the triangle, lifting the opposite support, so the part is no longer seated on its intended plane.

This is an illustration. Place the bracket's three bottom supports at (15, 15), (135, 15) and (75, 70) mm, using x along the length and y across the width from one corner. The triangle covers 3,300 mm², a little over a quarter of the bottom face.

- A clamp at **(75, 40)** lies inside the triangle and seats the part on all three supports.
- A clamp at **(140, 70)**, near a far corner, lies well outside. On its own, it would tend to tip the part about the line between the supports at (135, 15) and (75, 70).
- A clamp at **(110, 40)** looks central but lies just outside the same edge. At y = 40 mm, that edge passes through x ≈ 107.7 mm, so the clamp is about 2 mm beyond it.

```figure
type: compare
title: Three clamp positions against the support triangle
cols: Inside the triangle? | Effect on its own
caption: Supports at (15, 15), (135, 15) and (75, 70) mm. Position, not appearance, decides whether a clamp seats the part.
- Clamp at (75, 40) | Yes | Seats the part on all three supports
- Clamp at (140, 70) | No, well outside | Tends to tip the part and lift a support
- *Clamp at (110, 40) | No, about 2 mm outside | Looks central but can still lift a support
```

The last case is the useful lesson: a quick visual judgement can be wrong by a few millimetres, which is enough to change whether a clamp seats or tips the part. Plot the supports and clamp points on a plan view. Where a clamp must sit outside the triangle, for access or to hold a thin region, pair it with a clamp on the other side or move a support so that the combined clamping force still acts within the triangle.

## Use pin location with a clear constraint plan

When locating from two holes, two tightly fitting round pins may impose an unnecessary constraint on hole spacing. A relieved secondary locator can accommodate the intended spacing variation while still controlling rotation.

The relief direction matters. For two hole centres lying along x, the secondary arrangement should permit the intended variation along that line while retaining the transverse constraint needed to control rotation. Check the actual manufacturer's geometry; do not infer it from the word “diamond”.

Clearance also creates possible motion. A round pin smaller than its hole does not uniquely centre the hole without a seating force or another centring mechanism. Record which direction the part is seated and how that condition is repeated.

The one-pin radial-clearance calculation in [Fits That Work](/reados/publications/fits-that-work/connect-size-to-datums-and-geometry/) shows why diametral clearance cannot be treated as the allowable offset in each coordinate. Multiple contacts must share one physical assembly position.

## Design the loading sequence with the contacts

An operator should be able to seat the part on the primary supports, bring it against the intended side and end references, and clamp without losing those contacts. Provide access to see or check the important seating condition.

If tightening the first clamp rotates the part away from an end stop, changing the written instruction may not be enough. Reconsider the clamp direction, support arrangement or sequence. A method that depends on holding the part by hand beside a moving or closing mechanism needs redesign and a proper machine-safety assessment.

Provide clearance for non-locating surfaces and for expected incoming variation. A generous relief can prevent an uncontrolled rough face from becoming an accidental datum. Provide a way for chips to leave the locating region rather than collect beneath it.

## Seat the part the same way every time

Even with a sound 3-2-1 layout, location depends on how the part is brought against its contacts. One operator may slide the part firmly into the corner; another may drop it in and clamp. The difference can be several hundredths of a millimetre if the part does not quite reach the side or end stops before the clamp closes.

A common remedy is a light, consistent seating force applied before clamping: a spring plunger or a small pusher that holds the part against the side and end contacts while the main clamps are tightened. Its force must be large enough to overcome friction on the primary supports, small enough not to lift or tilt the part, and directed towards the stops. Where a pusher is not practical, the instruction should specify the seating action and include a check, such as a feeler that must not enter between part and stop, before the first clamp is closed.

## Make the wrong orientation impossible

A bracket that is nearly symmetrical can be loaded the wrong way round, upside down or end for end. If the fixture accepts a wrongly oriented part, the machine will cut features in the wrong place, and the error may not be found until inspection.

Fixture designers commonly prevent this by adding a feature that only the correct orientation can clear: a pin that enters an existing hole or slot, a block that fouls an asymmetric profile, or a locator placed where only one end of the part has material. Such features are sometimes called foolproofing or error-proofing.

The foolproofing feature must not become an accidental locator. It should clear the part by enough to avoid touching it when correctly loaded, so that it rejects the wrong orientation without competing with the 3-2-1 contacts. Its clearance belongs on the drawing, and its function should be tested deliberately during the trial by trying to load the part incorrectly.

## Make locating contacts replaceable

Locating contacts wear. The part slides across them during loading, chips are dragged over them, and the clamping force concentrates on small areas. A contact that wears by a few hundredths of a millimetre shifts every part loaded against it.

Using hardened, replaceable locating buttons, pads and pins, rather than machining the contact surfaces into the fixture body, keeps the worn element cheap and quick to change. The replacement must restore the original position, which means the seating of the replaceable part, its height and its fixing method all need to be controlled. Chapter 9 sets out how wear is monitored and when contacts are replaced; the design choice that makes this practical is made now.

## Measure the locators after the fixture is built

The fixture drawing shows where the contacts should be. The built fixture puts them somewhere close to that. Before the trial, measure the actual positions and heights of the three primary supports, the two side contacts and the end contact relative to a fixture reference, and record them.

This record serves three purposes. It confirms that the build matches the design before parts are cut. It gives a baseline against which later wear can be measured. And when the trial shows a systematic offset in the machined features, the measured locator positions often explain it immediately, saving a search through programs and tool offsets.

## Exercise: diagnose inconsistent location

A bracket repeats when the designer loads it, but another operator sometimes obtains a 0.04 mm shift. Both use the same clamps and program. Identify three investigations before changing the machine offset.

Useful investigations include observing seating sequence, checking contamination or burrs at the contacts, and checking whether a clamp or extra support moves the part during tightening. Also inspect incoming reference-face variation and whether the measurement set-up is consistent.

Changing the offset might compensate for one loaded state while making another worse. The objective is first to establish one controlled state. The next chapter checks whether the intended contacts remain valid under the applied loads.
