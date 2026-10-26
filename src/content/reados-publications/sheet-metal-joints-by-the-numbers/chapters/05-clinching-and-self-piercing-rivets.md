---
book: sheet-metal-joints-by-the-numbers
chapterSlug: clinching-and-self-piercing-rivets
order: 5
title: "Clinching and self-piercing rivets"
description: "Join sheet without holes or heat: how clinches and self-piercing rivets form, what their strength depends on, how to check them in production, and catch a clinch die left set for thicker sheet."
draft: false
---

Some of the best joints in sheet metal have no hole drilled before them. A **clinch** presses the two sheets together between a punch and a die until they flow into an interlocking button, joined by their own metal. A **self-piercing rivet** is pressed through the top sheet and flares into the bottom sheet, which it does not pierce, locking the two together. Neither needs heat, so coatings survive; neither needs a drilled hole, so there is no cut edge and no alignment problem; and both are fast. Their strength depends on the tooling being right for the sheets, which is where they go wrong.

This chapter explains how clinches and self-piercing rivets form, what governs their strength, how many are needed in a seam, and how their quality is checked in production. The running case uses clinches for EN-700's body seams and finds that after a change of sheet thickness, the clinching tool was left with a die set for the old thickness, and the new seams lost about 40% of their strength.

## How a clinch forms

A round clinching tool has a punch on one side of the sheets and a die on the other. As the punch advances, it draws both sheets down into the die's cavity; the die's shape makes the bottom sheet spread sideways, and the top sheet's material flows outwards into an undercut, so that the two lock together in a button. The result is a round button on the die side and a shallow recess on the punch side, with no hole and no added part. Some tools produce rectangular clinches with lanced edges, which suit different loads and thicknesses.

The interlock's quality depends on the sheets' combined thickness, their ductility and the tool's dimensions. A clinch tool set is designed for a range of thickness combinations, and outside that range the interlock is shallow or the sheets crack.

## How a self-piercing rivet forms

A **self-piercing rivet** is a semi-tubular rivet pressed into the sheets by a punch against a shaped die. The rivet pierces the top sheet, then its tubular end flares outwards inside the bottom sheet without breaking through, forming a mechanical lock. It is stronger than a clinch for the same sheets, handles thicker and stronger materials and dissimilar metal stacks, and adds a part. It needs much higher setting force than a blind rivet and a rigid C-frame tool. It is common in automotive bodies, especially aluminium, and less common in small enclosure work like EN-700's.

```figure
type: compare
title: Clinching, self-piercing rivets and blind rivets for EN-700's body seams
cols: Hole needed | Added part | Coating | Access
caption: This is an illustration of the trade-offs. Strength and cycle time depend on the tooling and sheets and come from the tool and rivet makers' data.
- *Round clinch | None | None | Kept | Both sides
- Self-piercing rivet | None | Rivet | Kept | Both sides
- Blind rivet | Drilled or punched | Rivet | Cut edge at hole | One side
- Spot weld | None | None | Burnt at weld | Both sides
```

## Strength

A clinch's strength comes from its interlock, and it is lower than a rivet's of similar size, typically more so in tension, where the button can pull out, than in shear. Clinching tool makers publish test strengths for their tools in given sheet combinations, and those figures, or the fabricator's own tests, are the only reliable values.

This is an illustration. For EN-700's 1.2 mm + 1.2 mm galvanised seams, the clinching tool maker's data gives an 8 mm round clinch a shear strength of about **1,500 N** and a tensile strength of about **450 N**. Shear is the useful direction: the seams are designed so that their loads act in the plane of the sheets, and tension across a clinch, which peels it, is avoided.

## The running case: EN-700's seams

This is an illustration. EN-700's seams total about 5.8 m. At 50 mm pitch, they carry about **116** clinches. Their loads are modest. The enclosure's empty mass, from its body sheet of about 1.3 m² of 1.2 mm steel, about 12.2 kg, the aluminium door at about 1.9 kg, the equipment plate's 25 kg and a few kilograms of brackets and fittings, is about **42 kg**. Even lifted by its roof with a dynamic factor, the load per clinch along the roof's 1.5 m of seam is a few tens of newtons, far below 1,500 N.

The seams' pitch is therefore set by **sealing**, not strength. Fifty millimetres keeps the sheets pressed together tightly enough for the sealant bead to stay closed, which the water spray test confirmed. A seam with clinches at 150 mm would be strong enough and would leak.

```figure
type: bars
title: What sets the pitch of EN-700's clinched seams
unit: clinches per metre
max: 22
caption: This is an illustration for a seam carrying 3,000 N per metre in shear, with a factor of 2 on 1,500 N clinches. Strength needs 4 per metre; sealing needs 20.
- Strength, 3,000 N × 2 ÷ 1,500 N | 4
- *Sealing at 50 mm pitch | 20
```

## The error: a die set for the old sheet

This is an illustration. When the fabricator's supplier ran short of 1.2 mm galvanised sheet, a batch of EN-700 roof panels was made from 1.0 mm sheet, approved as an alternative after a check of the roof's stiffness. The clinching tool, though, was left with the die set for 1.2 + 1.2 mm. Joining 1.0 mm to 1.2 mm with that die produced clinches whose interlock was shallow.

The production check caught it on the first shift. The fabricator measures two things on a sample of clinches: the button's diameter and the **residual bottom thickness**, the thickness of metal remaining at the bottom of the button, which the tool maker specifies for each sheet combination. The bottom thickness was out of range, and a shear test of a coupon made on the same tool gave about **900 N**, some 40% below the 1,500 N expected. The roof panels made that shift were re-clinched with the correct die and retested.

The general lesson is that a clinch, more than most joints, is defined by its tooling as much as its design. Any change of sheet thickness, grade, coating or supplier is a change to the joint, and needs the tool maker's setting for the new combination and a coupon test before production.

## Production checks

Because a clinch has no visible fastener to inspect, its quality is checked by measurement and by test.

```figure
type: checklist
title: Production checks for clinched joints
caption: This is an illustration of a typical routine; the tool maker's quality guidance and the product's requirements set the actual checks and their frequency.
- Bottom thickness | Measured on a sample of clinches each shift, against the tool maker's range
- Button diameter | Measured on the same sample
- Coupon shear test | One coupon per shift and after any tool or material change
- Visual check | Every clinch for cracking at the button, especially in coated or high-strength sheet
- x Changing sheet without changing the die setting | The error above
- ? New material or coating | Tool maker's setting and a coupon test before production
```

## Trends, not just limits

A clinching punch and die wear slowly, and the joints they make change slowly with them. A check that only asks whether each sample is inside its limits will pass the joints until the day one falls outside. Plotting the residual bottom thickness and the button diameter shift by shift shows the drift long before then. This is an illustration. EN-700's fabricator found its bottom thickness creeping upwards by a few hundredths of a millimetre a week as the die wore, and replaced the die at a planned stop when the trend reached the middle of the range, rather than at an unplanned one when it reached the limit and a shift's output was in doubt.

## Flanges, access and the tool

A clinching tool needs room. Its die sits under the joint and its punch above, both on a C-frame whose throat depth limits how far from an edge a clinch can be made. The seam's flange must be wide enough for the button, with clearance to any fold, as the tool maker specifies for each tool. This is an illustration. EN-700's seams have 15 mm flanges, enough for 8 mm clinches with clearance to the fold, and the clinches sit within the tool's throat depth from the panel's edge. A seam designed without the tool in mind can end up with flanges too narrow to clinch, or clinches too far in for the frame to reach, which forces a change of method late in the project.

## Thickness combinations

Clinching tools are specified for a total thickness and for the combination of thicknesses, because the two sheets play different roles: the sheet on the punch side flows into the undercut, and the sheet on the die side spreads to form the button. Tool makers state which sheet should be on which side for unequal thicknesses and what range of ratios their tools handle. Joining a very thin sheet to a much thicker one, or a hard sheet to a soft one, can be outside a tool's range altogether, and a self-piercing rivet or a blind rivet may then be the better joint.

## Clinches and repeated loads

A clinch has no drilled hole and no cut edge, so it lacks the sharp stress concentration that a hole introduces, and clinched joints generally perform well under repeated loads compared with their static strength. A clinch can still loosen or crack under repeated peeling, which is why seams are arranged to load clinches in shear. EN-700's vibration test, which found the brackets' tear-out problem, found nothing wrong with its clinched seams, as the design intended.

## Clinching and coatings

Clinching does not burn coatings, but it does deform them. A zinc coating, being ductile, usually survives the button's forming without cracking; some paint and powder coatings do not, and crack around the button. Pre-painted sheet is clinched with tooling designed for it, or the clinches are placed where a cracked coating does not matter. EN-700's body is bare galvanised, which clinches well; a painted version would be clinched before painting, or tested with its paint.

## Repairing a clinched joint

A clinch cannot be undone and redone in the same place, because the button is the joint. A failed or rejected clinch is usually repaired by adding a blind rivet beside it, in a drilled hole with the edge distance and pitch of Chapter 4, or by re-clinching at a new position between the existing buttons where the pitch allows. The joint schedule should say which repair is acceptable, because a repair rivet brings back the drilled hole and cut edge that clinching was chosen to avoid, and on an outdoor seam it needs sealing under its head and through its body, so a closed-end rivet with sealant is the usual choice.

## Combining clinches with sealant or adhesive

A bead of sealant in a clinched seam keeps water out; a structural adhesive in the seam, cured after clinching, adds strength and stiffness and spreads load away from the clinches. The clinches then act partly as fixtures, holding the parts while the adhesive cures. Such hybrid joints are common in vehicle bodies and appliances. EN-700 uses a sealant only, because its seams need sealing far more than they need strength.

## Self-piercing rivets in practice

Self-piercing rivets earn their place where clinches are not strong enough and blind rivets are undesirable: thicker stacks, aluminium to steel, high-strength steels, crash-loaded joints. They need a rivet for each joint, a tool capable of the setting force, and, like clinches, a die matched to the stack. Their quality is checked in similar ways, by the head's height above the top sheet, by sectioning sample joints to see the rivet's flare, and by coupon tests. For a product like EN-700, with thin, similar sheets and modest loads, clinching gives an adequate joint at lower cost.

## Speed

Clinching and self-piercing riveting are fast: a second or two per joint on a production tool, with no drilling, no deburring and no part to load for a clinch. This is an illustration. EN-700's 116 seam joints, clinched at about 2 seconds each, take about **3.9 minutes**; as blind rivets, with each hole drilled and deburred first at about 15 seconds per joint, they would take about **29 minutes**. Chapter 10 prices the difference; it is one of the main reasons clinching is chosen for long seams.

## Exercise: a side seam's clinches

EN-700's two vertical side seams are each 0.7 m long. Suppose a racking load in handling puts 3,000 N of shear along each seam, and the design applies a factor of 2. With 1,500 N clinches, how many does each seam need for strength, how many does it have at 50 mm pitch, and what is its margin? What happens to that margin with the 900 N clinches of the error above?

**Worked answer.** For strength, each seam needs 3,000 × 2 ÷ 1,500 = **4** clinches. At 50 mm pitch over 0.7 m it has **14**, with a combined shear strength of 14 × 1,500 = 21,000 N, a margin of 21,000 ÷ 3,000 = **7** on the load.

With the weak 900 N clinches, the seam's strength falls to 14 × 900 = 12,600 N, a margin of **4.2**: still above the factor of 2, so the seam would not have failed in handling. It would, however, have failed its acceptance, because the clinch's specified strength is part of the product's definition, and a joint that is 40% weaker than specified is a defect whether or not it breaks. The margin set by the sealing pitch masked the fault, which is exactly why production checks measure the clinch itself rather than waiting for a seam to fail.
