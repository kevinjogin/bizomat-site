---
book: welding-distortion-by-the-numbers
chapterSlug: presetting-and-fixtures
order: 8
title: "Presetting, pre-bending and fixtures"
description: "Set parts at the opposite angle so welding pulls them true, pre-bend girders against their expected bow, calibrate presets by measurement, and design fixtures that control distortion without cracking."
draft: false
---

If a weld is going to pull a part out of shape by a predictable amount, the part can be set up out of shape by the same amount in the opposite direction, so that the weld pulls it true. Campbell jacked a pulley wheel apart before welding a broken spoke, so that the weld's contraction would bring it back. Whittemore opened the test plates' edges at the far end of a seam, so that their creep would close them. Modern fabricators preset butt joints at an angle, pre-bend flanges and pre-camber girders. Presetting turns distortion from an enemy into a tool, provided it is predictable, and the work of this chapter is mostly about making it so.

This chapter explains presetting for angular distortion, elastic pre-bending of long members against their expected bow, how to calibrate the preset from measurements, and how fixtures hold, preset and cool parts, with the shop's girders, frames and panels as examples.

## Presetting a butt joint

A single-V butt joint that kinks by 1° when welded can be set up with its plates angled 1° the other way, so that the weld's angular shrinkage pulls them flat. This is an illustration. For plates extending 500 mm from the seam, a 1° preset raises the far edge of one plate by about 500 × tan 1° ≈ **8.7 mm** relative to the other, a setting easy to make with a packer under the plate edges and check with a straight-edge. After welding and cooling, the joint should be flat; if it is not, the preset is adjusted for the next joint.

Presetting works best with consistent welding. A preset found for one welder's technique, heat input and number of passes may overcorrect or undercorrect for another, or for the same welder on a different day. The welding procedure therefore fixes the parameters that affect the distortion, and the preset is recorded with the procedure.

## Pre-bending flanges

A girder flange that tilts by about 1.2° at each side of the web (Chapter 4) can be pre-bent before assembly, in a press, by the same angle in the opposite direction, so that the fillet welds pull it flat. The bend is small and is made along the flange's centreline, where the web will sit. The shop pre-bends its top flanges this way, using a die set made for the flange width, and checks the angle with a template. On the girders where it was introduced, together with the smaller, balanced welds, the flange tilt fell from about 3 mm to under 1 mm at the edges.

## Pre-cambering a girder

A long member that will bow by a predictable amount can be bent elastically in the opposite direction while it is welded, then released. On release, it springs back by the elastic bend, and the weld's bow takes it the rest of the way to straight, or to a desired camber.

```figure
type: formula
title: Force to pre-bend the girder elastically against its expected bow
formula: F = 48 × E × I × δ ÷ L³
caption: This is an illustration for the shop's 8 m girder supported at its ends and pulled at mid-length in a fixture. The expected bow of about 1.8 mm is the one-flange-first value from Chapter 3; with the balanced sequence, a smaller pre-bend is needed.
- δ, pre-bend wanted at mid-length | 1.8 mm
- I, girder | about 1.11 × 10⁹ mm⁴
- L, span | 8,000 mm
step: F ≈ 48 × 205,000 × 1.11 × 10⁹ × 1.8 ÷ 8,000³
step: F ≈ 38 kN at mid-length
step: bending stress at the flanges ≈ 25 MPa, well within the elastic range
```

About 38 kN, nearly four tonnes, is a substantial force, and it needs a fixture strong enough to apply and hold it, but the stress it causes in the girder is small and entirely elastic, so the girder springs back fully when released. Pre-cambering is most useful for long, slender members whose bow is consistent from piece to piece; for the shop's girders, the balanced sequence of Chapter 7 reduced the bow so much that pre-cambering was kept only for the longest, lightest girders.

## Elastic and plastic presetting

Presetting can be elastic, as in the pre-cambered girder, where the part is held bent by a fixture and springs back on release, or plastic, as in the pre-bent flange, where the part is permanently bent before welding. Elastic presetting needs a fixture that holds the force during welding and cooling; plastic presetting needs a press and a bending operation but no holding fixture. Elastic presetting has the further effect of putting the part in a stress state that partly opposes the weld's residual stress, which can reduce the final stress; plastic presetting does not. The choice depends on the part, the equipment and the quantity.

## Calibrating the preset

The amount of preset is found by measurement, not just calculation. The shop's method is simple: make the first piece with the preset from the calculation or from experience, measure its distortion when cool, adjust the preset by the remaining error, and repeat until the pieces come out within tolerance. Three or four pieces usually settle it, and the preset is then recorded with the welding procedure. The calibration measurements are kept too, because they show how much the distortion varies from piece to piece; if the variation is larger than the tolerance, no single preset will work, and the welding itself must be made more consistent before presetting can help. If the procedure changes, a different filler, process, weld size or sequence, the preset is re-calibrated.

```figure
type: bars
title: Calibrating the girder flange pre-bend
unit: mm of flange tilt at the edges after welding
max: 3.5
caption: This is an illustration of the shop's first four girders after the change to smaller, balanced welds. The pre-bend was adjusted after each girder by the measured remaining tilt.
- Girder 1, no pre-bend | 2.0
- Girder 2, pre-bend 0.6° | 0.9
- Girder 3, pre-bend 1.0° | 0.2
- *Girder 4, pre-bend 1.0° | 0.3
```

## Fixtures

Fixtures hold parts in position for welding, and well designed, they are also among the most effective distortion controls. A welding fixture can:

- **locate** each part accurately, so that fit-up is consistent and gaps are as the procedure intends;
- **clamp** parts against movement in the directions that matter;
- **preset** parts at the angles or cambers calibrated above;
- **cool** the work with chill bars or water-cooled surfaces near the welds;
- **turn** the work, so welds are made in the flat position and balanced sides alternated quickly.

READOS covers fixture design for repeatable fabrication in [Fixtures That Repeat](/reados/publications/fixtures-that-repeat/), including location and clamping principles.

## Fixtures and restraint

A fixture's clamps restrain the part, and restraint turns shrinkage into stress (Chapter 6). A fixture that clamps every part rigidly in every direction gives a part that is in tolerance while clamped, but that may move when released and carries high residual stress, and in crack-sensitive joints may crack. A better fixture locates the parts precisely and clamps only the directions that matter for the tolerance, letting the shrinkage happen in directions that do not matter. For the shop's base frame side frames, the fixture holds the frame flat against its base but lets the members draw together lengthwise, which the cutting allowance accounts for; the frames come out flat and with less stress than when they were clamped all round.

## The panel fixture

The shop's fixture for its stainless panels is a flat aluminium plate with copper chill bars set into it along the lines of the seams and stiffener welds, and toggle clamps that hold the sheet flat against it. The aluminium and copper draw heat from the sheet's back face, narrowing the heated band; the clamps hold the sheet flat while it cools; and the stitch sequence numbered on the fixture card spreads the heat. Panels come off the fixture within the flatness the customer accepts, without shrinking or planishing.

## Strongbacks and temporary attachments

For large parts that cannot go into a fixture, strongbacks, stiff bars tacked or clamped across a joint, act as local fixtures, holding the joint's alignment and angle while it is welded. Temporary attachments welded to a part must be removed afterwards, and the removal leaves a ground spot where the attachment was, which must be inspected for cracks, especially on hardenable steels and fatigue-loaded parts. The shop prefers clamped strongbacks, which leave no marks and can be reused.

## Allowing for contraction

Campbell's pulley wheel shows presetting in its oldest form. To weld a broken spoke held between rim and hub, the rim was sawn and the hub and rim jacked apart so that the crack in the spoke opened by about the amount the weld would contract, perhaps a thirty-second to a sixteenth of an inch; the spoke was welded, the jack removed while it was hot, and the rim allowed to draw in. The same principle applies wherever a weld joins parts held at both ends: provide, before welding, the movement the weld will take away.

## Presetting in tee joints

A tee joint's standing plate, such as a bracket or stiffener welded with a fillet on one side only, is pulled towards the weld as it cools. Setting the plate leaning slightly away from the weld side before tacking lets the shrinkage pull it upright. The angle is small, often a fraction of a degree, and is set with a bevelled packer or a fixture stop. Where a stiffener has fillets on both sides, welding them in balance (Chapter 7) is usually enough, and presetting is kept for one-sided welds and for joints where balance is impossible.

## Presetting hollow section frames

Frames of hollow sections distort at their joints and along their members, and presetting can be applied to both. A frame whose corners pull inwards as their welds cool can have its members set slightly open at the corners in the fixture; a member that bows towards brackets welded on one face can be clamped with a slight opposite bow. The shop calibrated these presets for its base frame side frames in the same way as for the girder flanges, by measuring the first few frames and adjusting the fixture's stops, and it engraved the settings on the fixture so they could not drift.

## Cost of presetting and fixtures

Presets and fixtures cost money and time to make, and they pay back through less straightening and rework. This is an illustration. The shop's rotating girder fixture, with its press-bending die for the flanges, cost about A$18,000, excluding GST, to design and build. Before it, straightening a girder took about three hours on average; afterwards, almost none. At about 40 girders a year and A$130 an hour, the saving was about 40 × 3 × 130 ≈ **A$15,600** a year, a payback of a little over a year, before counting the more consistent quality and the fewer girders that missed delivery dates. For one-off work, a fixture rarely pays; for repeated products, it nearly always does.

## Presetting and inspection

A preset joint looks wrong before it is welded, which can confuse inspectors and welders. A butt joint with its plates deliberately angled, or a flange deliberately bent, may be "corrected" by a well-meaning person who does not know why it is set that way. The shop marks preset parts with a tag stating the preset and its purpose, and the sequence sheet shows it, so that nobody straightens a part before it is welded.

## Combining the methods

Presetting, fixtures, sequence and weld size work best together. The shop's final girder method used all four: smaller welds sized to the loads, a balanced sequence with a twin-head carriage, flanges pre-bent by a calibrated angle, and a rotating fixture that held the girder straight and let it be turned. No single method would have brought the girders within tolerance on its own; together, they removed the straightening step entirely. The production manager's rule became to start with the cheapest controls, weld size and sequence, and add presets and fixtures only where measurements showed they were still needed.

## A failure: the preset that overshot

This is an illustration. After calibrating the flange pre-bend on four girders, the shop changed its flux-cored wire to a different maker's product with a higher deposition rate, and the welders ran it at a higher current. The next girders came out with their flanges tilted the other way, by about 1 mm, overcorrected.

The new wire and settings put in less heat per millimetre of weld, because the travel speed rose more than the current, so the flanges tilted less than before, and the pre-bend overshot. The preset was recalibrated on the next three girders, and the procedure was updated to record that any change of consumable or settings requires recalibration.

## Exercise: a smaller pre-bend

With the balanced sequence, the 8 m girder's expected bow is only about 0.4 mm. What force would pre-bend it elastically by that amount, and is pre-bending worthwhile?

The force is proportional to the deflection, so for 0.4 mm it is about 38 × 0.4 ÷ 1.8 ≈ **8.6 kN**. The bending stress at the flanges is about 25 × 0.4 ÷ 1.8 ≈ 5.5 MPa.

A bow of 0.4 mm over 8 m is about one part in 20,000, well inside any structural straightness tolerance, so pre-bending is not worthwhile for this girder once the balanced sequence is used. Pre-cambering is reserved for longer, lighter members whose bow would otherwise exceed the tolerance.
