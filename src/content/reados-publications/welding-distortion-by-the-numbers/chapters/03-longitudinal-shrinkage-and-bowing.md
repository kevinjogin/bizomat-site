---
book: welding-distortion-by-the-numbers
chapterSlug: longitudinal-shrinkage-and-bowing
order: 3
title: "Longitudinal shrinkage and bowing"
description: "Treat a weld's shrinkage along its length as a tensile force, calculate the bow it causes off the neutral axis, and see why sequence and symmetry decide whether long members come out straight."
draft: false
---

A weld also shrinks along its length, and on a long member, that shrinkage matters more than the shrinkage across it. A beam, girder, column or long frame member with welds running along it is shortened slightly by them, and if the welds do not lie on the member's neutral axis, the axis about which it bends, their shrinkage bends the member as well, bowing it towards the welds. A girder that comes out of the shop curved up or down, or swept sideways, is showing longitudinal shrinkage acting off its axis.

This chapter treats the longitudinal shrinkage of a weld as a tensile force along the weld line, calculates the bow it causes in a welded tee section and in the shop's plate girder, and explains why symmetry and the order of welding decide whether long members come out straight.

## The weld as a tendon

The band of metal along a weld that was squashed while hot and wants to be shorter (Chapter 1) behaves, once cool, as if a tensile force were pulling along the weld line, like a tendon stretched along the member. The force, sometimes called the tendon force or shrinkage force, depends mainly on the heat input of the weld: more heat yields a wider band and a larger force. Its value can be estimated from formulas derived from tests or measured on the shop's own work; for teaching, this chapter uses illustrative values.

If the tendon force F acts along a line that is a distance e from the member's neutral axis, it bends the member with a moment M = F × e, and a long member of length L bends into a curve whose depth at mid-length, the bow or camber, is approximately:

δ ≈ M × L² ÷ (8 × E × I)

where E is the steel's stiffness and I the member's second moment of area. The bow grows with the square of the length, so long members are especially sensitive, and it falls with the member's stiffness, so slender members bow more than deep ones.

## A welded tee section

This is an illustration. The shop makes long welded tee sections, a 150 mm × 10 mm flange with a 200 mm × 8 mm web, 6 m long, for stiffeners and trusses. The two fillet welds joining the web to the flange lie at the flange, about 49 mm from the tee's neutral axis, which lies well down the web.

```figure
type: formula
title: Bow of a welded tee section from its flange welds
formula: δ ≈ F × e × L² ÷ (8 × E × I)
caption: This is an illustration. The combined tendon force of 80 kN for the two fillets is an assumed value for teaching; real values depend on the heat input and should be calibrated from the shop's measurements.
- F, combined tendon force of the two fillets | 80 kN, illustrative
- e, weld line to neutral axis | about 49 mm
- I, tee section | about 13.9 × 10⁶ mm⁴
step: M = 80,000 × 49 ≈ 3.9 × 10⁶ N·mm
step: δ ≈ 3.9 × 10⁶ × 6,000² ÷ (8 × 205,000 × 13.9 × 10⁶)
step: δ ≈ 6.2 mm bow over 6 m, curving towards the flange
```

Six millimetres over six metres is about one part in a thousand, which may exceed the straightness tolerance for a member that must fit into a structure. The calculation shows the levers: a smaller tendon force, from smaller welds or lower heat input; a smaller offset, by placing welds nearer the neutral axis; a stiffer section; or a shorter length.

## The plate girder

The shop's plate girders are about 8 m long, with a 300 mm × 20 mm top flange, a 600 mm × 10 mm web and a 250 mm × 16 mm bottom flange, joined by pairs of fillet welds at each flange. Because the flanges differ, the girder's neutral axis lies about 355 mm above the bottom, about 261 mm below the top flange welds and about 339 mm above the bottom flange welds.

If both pairs of welds were made at the same time, with equal tendon forces, their moments would partly cancel, because they lie on opposite sides of the axis. The remaining moment, from the difference in their distances, is small, and the bow it would cause is less than half a millimetre over 8 m.

But the shop did not weld them at the same time. It welded the top flange to the web first, completely, and then turned the assembly and welded the bottom flange. When the top welds were made, the section was only a tee of top flange and web, whose neutral axis lay close to the top flange, so those welds bent it very little. When the bottom welds were made, the section was complete, and their full force acted 339 mm below the axis.

```figure
type: bars
title: Illustrative bow of the 8 m girder by welding order
unit: mm of camber at mid-length
max: 2
caption: This is an illustration with an assumed tendon force of 150 kN for each pair of flange welds. Welding both flanges together, or alternating between them, leaves the moments to cancel; welding one flange completely first does not.
- Both flanges welded together | 0.4
- *Top flange first, then bottom | 1.8
```

About 1.8 mm over 8 m is not large in itself, but the shop's girders also carried stiffeners welded on one side of the web, which added sweep, a sideways bow, and the combination took some girders outside tolerance. The fix began with the order: welding the flange welds in alternation, a length at the top, a length at the bottom, on alternate sides, so that each pull was balanced by another before the section had stiffened much. It cost the welders more turning of the girder, which the shop reduced by mounting girders in a rotating fixture, and it brought the camber of the next batch down to well under a millimetre.

## What sets the tendon force

The tendon force rises with heat input, so it is larger for big welds, multi-pass welds and slow, high-current processes, and smaller for small single-pass welds made quickly. It does not grow simply with the number of passes, because later passes reheat and partly relax the earlier ones, but a joint made with several heavy passes always pulls harder than one made with a single light pass. For a given weld size, a process that deposits metal faster with less heat per millimetre, or a joint prepared to need less weld metal, reduces the force. Measurements on the shop's own members give the most reliable values, and the shop now measures the bow on the first member of each new design and works back to the effective tendon force, which it then uses to predict the next design.

## Intermittent welds and bowing

Where the design allows intermittent fillet welds rather than continuous ones, the total heat input along the member falls, and so does the tendon force and the bow. For lightly loaded stiffeners and secondary members, intermittent welds can cut distortion substantially. Designing Welded Joints by the Numbers sets out their drawbacks, chiefly in fatigue and corrosion, in its chapter on fillet welds, so they suit statically loaded, sheltered members, which is where much of the shop's stiffening is.

## Long frames and machine bases

The same reasoning applies to frames made of hollow sections joined end to end and side by side. A long frame member with brackets welded along one face bows towards them; a frame whose corner welds are all made on the top face bows downwards at the corners when cooled. The shop's machine bases, with their brackets and gussets mostly on the top surface, came out with their top faces dished, partly from this. Welding some attachments to the underside first, or arranging attachments in balanced pairs, reduced the dishing, and machining the top plate after welding, in two stages as Chapter 8 describes, removed the rest.

## Preheat and bowing

Preheating a member before welding, as the Davis-Bournonville course recommended for castings, reduces the temperature difference between the weld and the surrounding metal, and with it the band of metal that yields, but it also adds heat to the whole member. For long members, preheating a narrow band along the weld can reduce the tendon force, while preheating the whole member to a uniform temperature can reduce distortion overall because the member expands and contracts more evenly. Preheat is chosen mainly for metallurgical reasons, to avoid cracking, and its effect on distortion is a secondary benefit or cost that the welding engineer weighs.

## Symmetry

The general principle is symmetry about the neutral axis. Welds placed symmetrically about the axis, with equal heat input, pull equally on both sides and cancel each other's bending. Welds on one side only, or larger on one side, or made at different times, leave a net moment. Designers can choose symmetric sections and joint arrangements; fabricators can choose sequences that keep the pulls balanced as the member is built up.

## Sweep from stiffeners

A girder's stiffeners, welded to one side of the web, shrink across the web and along their own length, and their welds lie off the girder's vertical axis of bending, bending the girder sideways. A girder with stiffeners on one side only will sweep towards them; with matching stiffeners on both sides, the sweep largely cancels. Where stiffeners must be on one side, the welding sequence and welding them before the flanges, while the web can be restrained flat, help. The shop moved half of each girder's stiffeners to the other side of the web where the design allowed, which cut the sweep substantially.

## Shortening

Longitudinal shrinkage also shortens the member along its length, by an amount roughly equal to the tendon force divided by the member's axial stiffness, E times its cross-sectional area. For the tee section above, 80 kN over a 3,100 mm² section shortens it by about 80,000 × 6,000 ÷ (205,000 × 3,100) ≈ 0.76 mm over 6 m. That is usually small enough to absorb, but on long, lightly built members with many welds, or where several welded members must fit exactly together, it is added to the cutting allowances alongside the transverse shrinkage of Chapter 2.

## Tolerances decide how much matters

Whether a bow matters depends on the tolerance the member must meet. Structural steelwork standards set tolerances on straightness for members, often expressed as a fraction of the length, and machine frames and precision assemblies have their own, usually tighter, requirements set by the designer. A bow of one part in a thousand may be acceptable in a long truss chord and quite unacceptable in a machine guideway. Knowing the tolerance before welding lets the shop decide how much effort distortion control deserves on each product: a little sequence planning for the chords, presetting and staged machining for the guideways.

## Camber as a design feature

Some members are meant to be curved. Beams and girders are often given a deliberate camber, an upward curve that the load will flatten, and welding shrinkage can be used to produce or adjust it, by welding more on one side or by heating along one flange. Equally, a designed camber can be destroyed by welding that bows the member the other way. The shop checks camber after welding for every girder that has one specified, and corrects it as Chapter 9 describes.

## Measuring bow

Bow and sweep are measured with a taut string line or a laser along the member, reading the offset at mid-length and at intervals. The measurement is taken with the member supported so that its own weight does not bend it, or with the sag from its weight calculated and allowed for, because a long girder lying on two supports sags noticeably under its own weight, and the sag is not distortion.

## A failure: the stiffened beam

This is an illustration. A batch of long beams for a platform, each with light stiffeners welded along one side of the web at close spacing, came out of the shop with a sideways sweep of about 15 mm over 9 m, far outside the erection tolerance. Each beam had to be heat straightened, taking about two hours apiece.

The stiffeners had been welded with larger fillets than the design required, all on one side, each welded from top to bottom without any balance. The next batch used the calculated fillet size, welded the stiffeners in pairs from the middle of the beam outwards, and had the beams held against a straight edge on the table while the stiffeners were welded. The sweep fell to about 4 mm, within tolerance.

## Exercise: a shorter, stiffer tee

The welded tee in this chapter is made 4 m long instead of 6 m, with the same welds. What bow would you expect? And if the web were made 250 mm deep instead of 200 mm, would the bow rise or fall, and why?

The bow depends on the square of the length, so at 4 m it is about 6.2 × (4 ÷ 6)² ≈ **2.8 mm**, less than half.

A deeper web raises the second moment of area considerably, which reduces the bow, but it also moves the neutral axis further from the flange, increasing the offset e of the welds, which increases the moment. Working it through, the offset grows from about 49 mm to about 69 mm while I nearly doubles, from about 13.9 to 24.9 million mm⁴, so the bow falls from about 6.2 mm to about **4.9 mm**, less than the increase in I alone would suggest. The designer or fabricator would calculate both to be sure.
