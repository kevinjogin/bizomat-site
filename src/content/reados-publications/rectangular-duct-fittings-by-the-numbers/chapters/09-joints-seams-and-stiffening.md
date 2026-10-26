---
book: rectangular-duct-fittings-by-the-numbers
chapterSlug: joints-seams-and-stiffening
order: 9
title: "Joints, seams and stiffening allowances"
description: "The allowances behind every fitting: Pittsburgh and snap-lock seams, S and drive cleats, flanges on curved edges that stretch or shrink, cross-breaks, and a drive cleat cut to the face."
draft: false
---

Every pattern in this book is a net shape plus allowances, and the allowances are where shops differ most. One shop's Pittsburgh pocket takes 25 mm of sheet and another's 30; one shop joins duct sections with cleats and another with integral flanges; one specification asks for cross-breaks on every panel over 450 mm and another for beads. The geometry of the fittings does not change, but the blanks do, and a pattern that is right for one shop's machines is wrong for another's.

This chapter sets out the kinds of seam, joint and stiffening the running case uses and the alternatives, explains what each allowance is for and how to find its value, works out how a flange turned on a curved cheek edge must stretch or shrink, and ends with a drive cleat cut to the length of the face it joins instead of a little longer.

## Longitudinal seams

Longitudinal seams run along the duct, joining its faces at the corners. Three kinds are common in rectangular duct.

The **Pittsburgh lock**, used in the running case, is rolled on a roll former: a pocket on one edge and a single flange on the other, closed by hammering the pocket over. Its allowance is set by the roll former's rolls. This is an illustration: the shop's machine takes 25 mm on the pocket edge and 8 mm on the flange edge.

The **snap lock**, sometimes called a button-punch snap lock, is also roll formed: a pocket with a row of small punched dimples on one edge and a flange on the other that snaps into it. It assembles without hammering, which suits site assembly of knocked-down duct, but its holding strength depends on the dimples, and specifications often limit it to lower pressures.

The **grooved seam**, the flat locked seam used on round duct and on panels joined edge to edge, takes three seam widths of sheet, as [Sheet Metal Patterns by the Numbers](/reados/publications/sheet-metal-patterns-by-the-numbers/seams-edges-and-notches/) derives. It joins two flat panels in the middle of a face rather than at a corner, and on rectangular duct it is used mainly for large panels made from narrow coil.

Whichever is used, the allowance belongs to the machine and the trial piece, not to a table. The shop keeps a card for each seam on each machine, with the allowance found from a trial piece and the date it was last checked.

## Transverse joints

Transverse joints join one duct section to the next. The running case uses **S and drive cleats**: on the two wide faces, an S-shaped cleat slides over the flat edges of both sections; on the two narrow faces, the edges are folded back 12 mm and a drive cleat, a flat channel, is driven on from the side to lock them.

The drive cleat is longer than the face it joins, so that its ends can be folded over the corners to lock it in place and close the joint. This is an illustration. On the 400 mm narrow faces, the shop cuts each drive cleat **450 mm** long, 25 mm beyond each corner, and folds the overhang over the S-cleat's end on the wide face. Each S-cleat is the wide face's length, **600 mm**.

Larger duct, or duct at higher pressure, usually has **flanged joints**: an integral flange formed on each end of each section, or a separate angle or roll-formed frame, bolted or clipped to the next section's flange with a gasket between. Flanged joints are stiffer, quicker to assemble on site and tighter, and they also stiffen the duct's panels at each joint. Their allowance is the flange's depth on every face, typically a few tens of millimetres, plus corner pieces that the flanges fit into.

```figure
type: compare
title: Seams and joints in the running case, and alternatives
rowhead: Joint
cols: Where | Allowance in this illustration | Set by
caption: This is an illustration. The running case uses the first two rows; the others show what changes if the specification or the shop's equipment differs.
- * Pittsburgh lock | Corner seams | 25 mm pocket, 8 mm flange | The roll former
- * S and drive cleats | Transverse joints | 12 mm drive folds; cleats 600 and 450 mm long | The shop's practice
- Snap lock | Corner seams | as the machine's maker states | The roll former
- Grooved seam | Panel to panel in a face | 3 × seam width | The grooving tool
- Integral flange | Transverse joints | flange depth on every face, plus corners | The flange former and specification
```

## Flanges on curved edges

A flange turned on a straight edge only bends. A flange turned on a curved edge also stretches or shrinks, because its free edge moves to a different radius. This is the reason radius elbows need care at their seams.

On the running case's radius elbow, the shop turns 8 mm flanges on the cheeks' curved edges, square to the cheek, to engage the wrappers' Pittsburgh pockets.

- On the **throat** edge, the inner arc of 200 mm radius, the flange is the strip just inside the arc, from 192 to 200 mm radius, turned up until it stands on the 200 mm arc. Its free edge moves outward from 192 to 200 mm radius, a stretch of 8 ÷ 192 = **4.2%**.
- On the **heel** edge, the outer arc of 600 mm radius, the flange is the strip just outside, from 600 to 608 mm radius, turned down onto the 600 mm arc. Its free edge moves inward, a shrink of 8 ÷ 608 = **1.3%**.

A 4.2% stretch is within what galvanised sheet takes if the edge is smooth, but a nick at the edge can start a tear, so the throat flange is deburred and formed evenly, a little at a time. A 1.3% shrink is small, but sheet cannot shrink in a flange without wrinkling unless it is helped, so the heel flange is given small V-notches at intervals. The notches let each tab close up on its neighbour; their spacing is found on a trial piece.

```figure
type: bars
title: Strain at the free edge of an 8 mm flange on a curved cheek edge
unit: %
max: 5
caption: This is an illustration. Stretch on the throat, shrink on the heel. The tighter the radius, the larger the strain; the elbow in the exercise has larger radii and smaller strains.
- * Throat, R200, stretch | 4.2
- Heel, R600, shrink | 1.3
- Throat, R300, stretch | 2.7
- Heel, R900, shrink | 0.9
```

## Notches

Notches remove sheet where layers would pile up or folds would collide. On rectangular fittings they fall in four kinds of place:

1. **Where a transverse joint's fold meets a corner seam**: the 12 mm drive fold on a narrow face would collide with the wide face's Pittsburgh flange at the corner, so the corner is notched 12 × 12 mm at each end of each section.
2. **Where flanges meet at a corner**: on a collar or an inlet flange, each face's flange is cut back by the flange width at each corner, square for a square corner and to the corner's angle otherwise, as Chapter 7's 91.55° corners and Chapter 8's 45° shoe corners showed.
3. **On a flange that shrinks**: V-notches at intervals, as on the heel above, and at every inside corner of a Z-shaped offset cheek.
4. **On a flange that stretches sharply**: a short relief slit at a corner, so that the flange can open without tearing.

A notch is part of the pattern and is marked on it, because a notch cut by eye at the bench is either too small to let the joint close or too large to seal.

## Stiffening

Flat panels need stiffening, and the specification sets how. Chapter 2 cross-broke the running case's 600 mm panels; the alternatives are:

- **beading**: rolled ribs across a panel at intervals, made on a beading machine, stiffer than a cross-break and neater, but needing the machine;
- **intermediate reinforcement**: an external angle or channel around the duct between joints, on large or high-pressure duct;
- **tie rods**: rods across the inside of very wide duct, tying opposite panels together.

Transverse joints stiffen the duct too, especially flanged joints, and some specifications count a joint as a reinforcement if it is stiff enough. Which stiffening a given duct needs depends on its size, gauge and pressure, and comes from the specification, which this book does not try to reproduce.

## Counting the joints in a run

Joints are counted from the run's sequence of pieces, not estimated. This is an illustration. The running case's main run, from the transition to the end of the diagonal offset, is a chain of thirteen pieces: the transition, the mitred elbow, eight straight sections, the radius elbow, the single-plane offset and the diagonal offset. Thirteen pieces in a chain have **twelve** joints between them; the transition's inlet bolts to the air handler, and the run's far end joins the next contract's work.

Each cleated joint needs two S-cleats of 600 mm and two drive cleats of 450 mm. The run's twelve joints therefore need 12 × 2 × 600 = **14.4 m** of S-cleat and 12 × 2 × 450 = **10.8 m** of drive cleat, both cut from strip on the shop's cleat former. Those lengths go on the cutting list beside the duct blanks, with the cleat formers' strip widths, because a run whose duct is all cut but whose cleats are not is not ready to dispatch.

## Sealing joints

Transverse joints leak more than longitudinal seams, because a cleat is a sliding fit and its corners are folded rather than formed. The specification for the job sets the duct's leakage requirement, and the shop meets it with sealant at every joint: in the S-cleat's folds before the section is pushed home, along the drive cleat's edges after it is driven, and especially at the four corners, where the drive's folded overhang meets the S-cleat. Corners are where most cleated joints leak, and a bead of sealant worked into each corner does more for leakage than any amount along the straight edges.

Flanged joints use a gasket between the flanges instead, and their corners are sealed where the corner pieces meet the flange. Either way, the sealing is part of the joint's specification and the shop's trial pieces should be sealed exactly as production will be, because sealant affects how far a joint closes.

## The error: drive cleats cut to the face

This is an illustration. A batch of drive cleats for the narrow faces was cut 400 mm long, exactly the height of the face, by a hand who reasoned that the cleat covers the face. Driven on, each cleat reached corner to corner and no further.

Without the 25 mm overhang at each end, there was nothing to fold over the corners to lock the cleat in place. The joints held together on the bench but the cleats could slide out under vibration, and the joint was open at each corner where the drive fold met the S-cleat. The shop found it at the trial assembly, when a cleat slid half out as a section was lifted.

The cleats were scrap, a few metres of strip, and the batch was recut at 450 mm. The loss was small because the fault showed on the bench. On site, a joint that comes apart in service is found by a drop in airflow at the far end of the run, or a section that sags, and is far more expensive to trace and repair at height than a bundle of cleats is to recut. The shop's cutting list now gives every cleat's length as "FACE + 2 × 25", so that the overhang is visible and nobody cuts to the face.

```figure
type: checklist
title: Allowance checks for a rectangular fitting
caption: Each allowance comes from a machine or a specification, and each is written on the cutting list, not worked out at the bench.
- Seam allowances from the shop's current machine card | Pittsburgh 25 and 8 mm
- Transverse joint folds on the right faces | drive folds on the 400 mm faces
- Cleat lengths include their overhang | drive cleats 400 + 2 × 25 = 450 mm
- Flanges on curved edges notched or relieved | heel V-notches, throat formed evenly
- Corner notches at every joint and flange corner | 12 × 12 mm at drive folds
- x Cleats cut to the face they join | drive cleats that slid out
```

## Calibrating with trial pieces

Every allowance in the comparison table is an illustration, and every shop finds its own. The method is the same for each: make a short trial piece of the seam or joint in the same sheet, with marks a known distance apart on either side, form it exactly as production will, and measure between the marks. The difference from the expected distance is what the machine takes beyond the nominal allowance, and the allowance is adjusted to suit.

For a Pittsburgh lock, two 300 mm strips are rolled, one with a pocket and one with a flange, marked 50 mm in from the net lines, locked together and measured: the marks should be 100 mm apart across the seam. For a drive cleat, a short joint is assembled and the overhang folded over to see whether 25 mm is enough to lock and not so much that it fouls the next fitting. The trial takes a few minutes and a strip of offcut, and its result goes on the machine's card.

## Exercise: a larger radius elbow's flanges

The radius elbow in Chapter 4's exercise has 600 mm in the plane of the bend, a throat radius of 300 mm and a heel radius of 900 mm. With the same 8 mm flanges on its cheeks' curved edges, find the strain at each flange's free edge, and say which flange needs notches.

**Worked answer.**

- Throat flange: strip from 292 to 300 mm radius turned onto the 300 mm arc, a stretch of 8 ÷ 292 = **2.7%**.
- Heel flange: strip from 900 to 908 mm radius turned onto the 900 mm arc, a shrink of 8 ÷ 908 = **0.9%**.

The **heel** flange still needs V-notches, because any shrink in a flange wrinkles without relief, though fewer than on the smaller elbow. The throat's stretch is about two thirds of the running case's 4.2%, and an evenly formed, deburred edge takes it comfortably. Larger radii make every flange easier, which is one more reason a fabricator welcomes a generous throat radius.
