---
book: arc-welding-by-the-numbers
chapterSlug: positions-access-and-fit-up
order: 8
title: "Positions, access and fit-up"
description: "Count the cost of welding out of position, decide when turning the work pays, and plan fit-up, tacking and sequence so the frame stays square and the welds stay sound."
draft: false
---

A weld made flat, with gravity holding the molten pool in the joint, can use a larger electrode at a higher current, deposits metal faster and is easier to make well. The same weld made vertically or overhead needs a smaller electrode, a lower current and more skill, and takes longer. Before the arc is struck, the parts must be fitted together accurately and held there, because a gap or misalignment cannot be fixed by welding without cost. Position, access and fit-up therefore decide much of the time, cost and quality of a fabrication before any welding parameter is chosen.

This chapter works out what welding the conveyor frames out of position would cost, why the shop turns them, and how it fits, tacks and sequences them so that they finish square.

## Welding positions

Welds are described by position: flat, with the weld on top; horizontal, with the joint running horizontally on a vertical face; vertical, with the joint running up or down; and overhead, with the weld underneath. Fillet welds in the corner between a horizontal and a vertical plate, the commonest on the conveyor frames, are made in the horizontal-vertical position.

Out of position, the welder must stop the pool running out of the joint, so the pool must be smaller. Smaller pools need less heat, which means smaller electrodes or lower current. The Hobart data sheet quoted in Chapter 4, for example, advises reducing the optimum amperage by 15% when welding out of position. For the shop's electrodes, that would mean about 170 × 0.85 ≈ 145 A for a 4.0 mm electrode and about 130 × 0.85 ≈ 110 A for a 3.2 mm electrode. In practice the shop uses 3.2 mm electrodes at about 110 A for vertical-up and overhead fillets, because the smaller electrode gives better control.

```figure
type: compare
title: The shop's settings by position for 6 mm fillets
cols: Electrode and current | Deposition rate
caption: This is an illustration. Deposition rates are the shop's weighed values; the out-of-position current follows the 15% reduction advised on one maker's data sheet.
- Flat and horizontal-vertical | 4.0 mm at 170 A | 1.5 kg/h
- Vertical-up and overhead | 3.2 mm at about 110 A | 0.70 kg/h
```

At about half the deposition rate, positional welding takes about twice as long per kilogram, before allowing for the extra skill, fatigue (Chapter 6) and inspection it needs.

Vertical welds can be made upwards or downwards. Vertical-up welding builds each layer on a shelf of solidified metal below, giving good penetration and fusion, and it is the normal technique for low-hydrogen electrodes. Vertical-down welding is faster, but the pool tends to run ahead of the arc, so fusion and penetration are less certain; it is used with electrodes and procedures designed for it, mainly on thin material and some pipeline work. The direction is part of the qualified procedure, not the welder's choice on the day.

## Should the frame be turned?

This is an illustration. If a conveyor frame were welded where it stood, about 40% of its 20 m of welds would be flat or horizontal and 60% vertical or overhead. Splitting the 3.11 kg of weld metal in that proportion:

- flat and horizontal: 0.4 × 3.109 ÷ 1.5 ≈ 0.83 h;
- vertical and overhead: 0.6 × 3.109 ÷ 0.70 ≈ 2.66 h;
- total arc time: about **3.49 h**.

The shop actually turns each frame with the overhead crane so that almost all of its welds are made flat or horizontal, at about 1.5 kg/h, giving the 2.07 h of arc time used in Chapter 6. Turning saves about 3.49 − 2.07 ≈ **1.42 h** of arc time, plus the corresponding electrode changes, at the cost of crane time that is part of the 1.04 h of positioning in the time study. It also improves quality, because fewer welds are made in difficult positions.

```figure
type: bars
title: Arc time per conveyor frame by how it is positioned
unit: hours of arc time
max: 4
caption: This is an illustration. Turning the frame with the crane lets nearly all welds be made at 1.5 kg/h; a positioner (Chapter 6's exercise) would raise the effective rate further and cut handling time.
- Welded where it stands, 60% positional | 3.49
- *Turned with the crane | 2.07
- On a positioner | 1.94
```

The positioner in Chapter 6's exercise goes further. By holding the frame at any angle, it lets more welds be made flat rather than horizontal, raising the effective deposition rate to about 1.6 kg/h and the arc time down to about 1.94 h, and it replaces most of the crane handling. Positioners, turning rolls and manipulators exist to put welds in the flat position; their value can be calculated from deposition rates like these.

## Access

A weld that the welder cannot reach or see properly will not be made properly. Access depends on the space around the joint for the electrode holder and the welder's hands, the angle at which the electrode can be presented, and the welder's view of the pool.

On the conveyor frames, the cross-members are welded to the inside of the channel side rails, between the channel's flanges. A 150 mm channel has flanges about 75 mm wide, so the fillet welds at the inner corners of the channel are in a pocket. With a 350 mm electrode and a holder, the welder can reach them at a reasonable angle near the open end of the cross-member, but not deep in the corner between the channel web and flange. The designer moved the cross-member connections to a cleat bolted or welded on the web, away from the flanges, which made every weld reachable at a good angle. That change came from the welders, during the time study.

Access also matters for inspection. A weld that cannot be seen after welding cannot be visually inspected, and a joint that cannot be reached with a gauge cannot be measured. Design reviews at the shop include the welders and the inspector for this reason.

## Fit-up

Fit-up is the assembly of parts in their correct positions, with the specified gaps, before welding. Chapter 5 showed what a root gap costs: either a weaker weld or a larger one. Misalignment, out-of-square ends and parts in the wrong place cost more, because they must be cut out and refitted.

The conveyor shop fits its frames in a fixture: a flat steel table with stops that locate the two side rails parallel at the correct width and the cross-members at the correct spacing, with clamps to hold them. The fixture also sets the frame square, checked by measuring diagonals. The fit-up check before welding covers:

1. rails parallel and at the correct width, measured at each cross-member;
2. frame square, diagonals within the drawing tolerance;
3. cross-member ends tight to the rail webs, checked with a feeler gauge at the root;
4. bracket positions measured from datum holes, not from the frame ends.

## What a fixture is worth

This is an illustration. Before the fixture, the shop fitted frames on trestles with tape measures and squares. Its time study recorded about 1.64 hours of fit-up and tacking per frame then, against 1.24 hours with the fixture, a saving of 0.40 hours. At the A$90 an hour (excluding GST) that the shop uses for welding labour in Chapter 10, that is A$36 per frame. The fixture cost about A$6,500 to build, so it paid for itself after about 6,500 ÷ 36 ≈ 181 frames, roughly eight months of the conveyor contract at the shop's rate of production.

That calculation leaves out the fixture's larger benefit: frames that come out square and to size, without the rework in the failure below. A fixture's value is partly time and partly the cost of the errors it prevents, which are harder to price but often larger.

## Welding on site

Site repairs remove most of the advantages above. The conveyor cannot be turned, so many welds are vertical or overhead. Access is often poor, between idlers, under chutes and beside structures. The welder may be working at height, from a platform or a harness, and in wind, rain, dust and heat. Fit-up is to an existing frame that may be distorted, corroded or out of square.

The shop plans site work accordingly. It estimates site welds at positional deposition rates, allows more time for access and set-up, uses manual metal arc welding because wind disturbs gas shielding, and prefers to fabricate as much as possible in the workshop and bolt it in, leaving only the welds that must be made in place. Site welds that cannot be made to the workshop's quality, for example because the welder cannot reach the root, are referred back to the designer rather than attempted. Working at height and in confined spaces brings its own hazards and permits, which the site's rules govern.

## Tack welds

Tack welds hold the parts in place until the main welds are made. They are real welds, and they become part of the final weld, so they must be made to the welding procedure, with the same electrodes, preheat if any, and care. A cracked or porous tack incorporated into a weld carries its defect into the joint.

This is an illustration. The shop's practice on the conveyor frames is to place tacks about 25 mm long, with no more than 300 mm between them on long joints, at both ends of each cross-member connection and on each side of a joint, so the parts cannot rotate. A 6 m line of joints at 300 mm spacing needs 6,000 ÷ 300 + 1 = 21 tacks. Tack ends are ground or fused out where the main weld runs over them, so that they do not leave cold laps.

## Sequence and distortion

Every weld shrinks as it cools, pulling the parts towards it. On a frame, welding all the cross-members on one side rail before the other pulls that rail inwards and can twist or bow the frame. The physics of shrinkage, and the back-step and balanced sequences that control it, are covered in [Weld Repairs That Hold](/reados/publications/weld-repairs-that-hold/welding-sequence-back-step-and-balance/). The conveyor shop applies the same principles: it welds the cross-members in a balanced order, alternating between rails and working from the middle of the frame outwards, keeps the frame clamped in the fixture until the main welds are complete, and checks the diagonals again after welding.

The amount of distortion depends on the heat put into the frame, which is another reason to avoid oversize welds (Chapter 5): a 7 mm fillet deposits 36% more metal than a 6 mm one, and its shrinkage pulls correspondingly harder. Where a frame must finish straight over its full 6 m length, the shop measures the side rails for bow with a string line after welding, records the result, and adjusts the sequence if successive frames show the same bow in the same direction, rather than straightening every frame afterwards.

## A failure: the frame that would not sit flat

This is an illustration. Early in the conveyor contract, two frames failed the customer's dimensional check: when placed on the installation supports, one corner of each lifted by about 12 mm, and the diagonals differed by more than the drawing allowed.

The welding records showed that both frames had been welded on a day when the fixture was in use for another job. They had been fitted and tacked on trestles, then welded one rail at a time: all the cross-member welds on the left rail, then all on the right. The left rail's welds shrank while the right rail was still only tacked, pulling the frame out of square and twisting it, and the right rail's welds, made later against a frame that was already distorted, locked the twist in.

The two frames were straightened by a qualified procedure using controlled heating under supervision, and the shop made two changes: frames are fitted and welded only in the fixture, with a second fixture bought to avoid the conflict, and the welding sequence for the frame is now written on the drawing, alternating between rails from the middle outwards.

## Exercise: partial turning

A larger frame is too heavy to turn fully with the shop's crane. It can be turned once, so that about 75% of its welds are flat or horizontal and 25% remain vertical or overhead. The frame has the same 3.11 kg of weld metal. Using the shop's deposition rates, calculate the arc time and compare it with welding in place (60% positional) and with full turning.

With 75% at 1.5 kg/h and 25% at 0.70 kg/h, the arc time is 0.75 × 3.109 ÷ 1.5 + 0.25 × 3.109 ÷ 0.70 ≈ 1.55 + 1.11 = **2.66 h**. Welding in place would take about 3.49 h and full turning about 2.07 h.

One turn recovers about 0.83 hours of the 1.42 hours that full turning saves, roughly 58% of the benefit. The remaining positional welds would also be the ones most likely to need repair, so the shop would consider a temporary support that allows a second turn, or a larger crane for these frames, and compare the cost with the 0.59 hours of arc time still to be saved on every frame.
