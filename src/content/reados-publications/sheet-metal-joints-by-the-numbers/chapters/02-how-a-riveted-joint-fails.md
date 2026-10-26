---
book: sheet-metal-joints-by-the-numbers
chapterSlug: how-a-riveted-joint-fails
order: 2
title: "How a riveted joint fails"
description: "Check a riveted sheet joint four ways, rivet shear, bearing, net section and tear-out, find which governs, see how edge distance moves it, and catch a bracket that tore out."
draft: false
---

A riveted joint in sheet can fail in four ways. The rivet itself can shear across. The rivet can crush or stretch the edge of its hole, which is bearing failure. The sheet can break across its narrowest section, through the holes. Or the rivet can push a slug of sheet out ahead of it towards a nearby edge, which is tear-out. The joint is as strong as the weakest of the four, and the weakest is often not the rivet. A designer who checks only the rivet's catalogue shear strength is checking one mode in four, and in thin sheet near an edge it is frequently the wrong one.

This chapter sets out each mode with its formula, applies all four to the EN-700 bracket joint, and shows how edge distance and sheet thickness move the governing mode from one to another. The running case finds that the first brackets, with their rivets placed close to the flange's edge to clear a fold, failed by tear-out in a vibration test while their rivets were nowhere near their rated shear.

## The four modes

For a single rivet of diameter d in a hole of diameter dₕ, through sheet of thickness t, with an edge distance e from the hole's centre to the edge in the direction of the load:

```figure
type: formula
title: Four failure modes of a riveted sheet joint
formula: shear = rated shear of the rivet;  bearing = d × t × bearing strength;  net section = (w − n × dₕ) × t × tensile strength;  tear-out = 2 × (e − dₕ ÷ 2) × t × shear strength of the sheet
caption: The joint's strength is the lowest of the four. The tear-out formula treats the slug pushed out ahead of the rivet as sheared along two lines; it is a common simplification, and tests or a design standard govern real joints.
- d, dₕ | Rivet diameter and hole diameter
- t | Thickness of the sheet being checked
- w, n | Width of the sheet across the joint, and number of holes across it
- e | Edge distance from the hole's centre to the edge, in the direction of the load
```

Each mode is checked for **each sheet** in the joint, because the two sheets may differ in thickness and strength, and for the rivet. In EN-700's bracket joint, the bracket is 2.0 mm steel and the back wall 1.2 mm steel, so the bearing and tear-out checks give different results for each.

## Illustrative properties

The calculations below use **illustrative** properties, labelled as such, because real values come from the material's certificate and the rivet maker's published data:

- **Galvanised steel sheet**: tensile strength 320 MPa; shear strength taken as 0.6 times tensile, 192 MPa; bearing strength taken as 1.5 times tensile, 480 MPa.
- **4.8 mm steel blind rivet** in a 4.9 mm hole: rated shear strength 2,400 N and rated tensile strength 3,000 N, as a maker would publish them.

The ratios used for shear and bearing strength are common simplifications; design standards and references give their own values and rules, which depend on edge distance and other details, and should be used for real design.

## The running case: the bracket joint

This is an illustration. Each of EN-700's two brackets is a 2.0 mm steel angle whose vertical flange, 30 mm wide, is fixed to the 1.2 mm back wall by two 4.8 mm blind rivets in a vertical line. Chapter 1 gave each bracket a design load of 368 N downwards, so each rivet carries about **184 N** in shear, before the moment from the plate's overhang, which Chapter 4 adds.

The load pushes the bracket downwards; the rivets resist by bearing on the **upper** side of their holes in the bracket, so the bracket's critical edge is the top edge of its flange, above the upper rivet. In the first design that edge distance was **5 mm**, about one rivet diameter, so that the rivet cleared the bracket's fold.

```figure
type: compare
title: Strength of one rivet's share of the bracket joint, edge distance 5 mm
cols: Formula | Strength
caption: This is an illustration with illustrative properties. Tear-out in the bracket governs, below the rivet's rated shear.
- Rivet shear | Rated value | 2,400 N
- Bearing in the 2.0 mm bracket | 4.8 × 2.0 × 480 | 4,608 N
- Bearing in the 1.2 mm back wall | 4.8 × 1.2 × 480 | 2,765 N
- Net section of the bracket flange | (30 − 4.9) × 2.0 × 320 | 16,064 N
- *Tear-out of the bracket, e = 5 mm | 2 × (5 − 2.45) × 2.0 × 192 | 1,958 N
```

The joint's strength per rivet is therefore about **1,958 N**, set by tear-out, not the 2,400 N of the rivet's data sheet.

## The error: tear-out in the vibration test

This is an illustration. The designer had checked the bracket joint against the rivet's rated shear: 184 N per rivet against 2,400 N, a margin of about 13. In the vibration test of Chapter 1, the brackets resonated at one frequency of the test profile, which amplified the load on them several times, and after a few minutes the upper rivet in each bracket had torn a slot up through the 5 mm of flange above it. The rivets themselves were undamaged.

The four-mode check explained it. Tear-out at 5 mm edge distance was the weakest mode, at 1,958 N, so the true static margin was about 10.6, not 13, and under repeated, amplified loading the thin ligament above the hole was where a crack started and grew. The fix had two parts: the bracket was redrawn with an edge distance of 10 mm, by moving the rivets down and lengthening the flange, and a gusset was added to stiffen the bracket and move its resonance away from the test profile.

```figure
type: bars
title: Tear-out strength of the 2.0 mm bracket, by edge distance
unit: N
max: 6500
caption: This is an illustration. Doubling the edge distance from 5 to 10 mm almost triples the tear-out strength, because the ligament ahead of the hole grows from 2.55 to 7.55 mm.
- e = 5 mm, about 1 d | 1958
- *e = 10 mm, about 2 d | 5798
- Rivet rated shear, for comparison | 2400
```

With a 10 mm edge distance, tear-out rises to about **5,798 N**, and the joint is governed by the rivet's 2,400 N rated shear, which is where a well-proportioned riveted joint should be governed: by the part that is designed, tested and rated for it.

## Which mode governs

The four modes respond differently to the joint's proportions, and knowing how is more useful than any single result.

- **Thin sheet** lowers bearing and tear-out in proportion to thickness, while the rivet's shear stays the same. In very thin sheet, bearing in the thinner sheet usually governs: EN-700's 1.2 mm back wall bears at 2,765 N per rivet, not far above the rivet's 2,400 N.
- **Short edge distance** lowers tear-out sharply, because the ligament ahead of the hole is the edge distance less half the hole.
- **Many rivets across a narrow strip** lower the net section, which matters most in tension members such as straps and lap joints in narrow sheet, and rarely in a wide panel.
- **Larger rivets** raise rivet shear with the square of the diameter but bearing only in proportion, so a much larger rivet in thin sheet shifts the governing mode to bearing.

```figure
type: decision
title: Where to look first in a riveted sheet joint
question: Which mode is most likely to govern this joint?
- Rivet small for the sheet, generous edge distances | Rivet shear | The rivet maker's rating governs
- *Thin sheet, rivet of normal size | Bearing in the thinnest sheet | Check d × t × bearing strength
- Rivet close to an edge in the direction of the load | Tear-out | Edge distance below about 2 d is a warning
- Several rivets across a narrow strap | Net section | Width less holes, times thickness
```

## Shear joints and tension joints

Everything above concerns joints loaded in **shear**, with the load in the plane of the sheets. Rivets are at their best in shear. A joint loaded in **tension**, pulling the sheets apart along the rivet's axis, fails differently: the rivet's head pulls through the sheet, the rivet stretches or its blind head opens, or the thin sheet around the head dishes and tears. Blind rivets in particular are weaker in tension than in shear, and their makers publish tensile ratings separately. EN-700's brackets see some tension as well as shear, because the plate's weight acts some distance out from the wall and tries to peel the top of each bracket away from it. Chapter 4 calculates that tension and checks the rivets and the back wall for it; until then, the shear check of this chapter is only half the bracket's story.

## Load direction matters

Tear-out depends on the edge **in the direction of the load**. A rivet 5 mm from an edge that the load pushes away from is in no danger of tearing out towards it; the same rivet 5 mm from an edge that the load pushes towards is. EN-700's bracket rivets were safe from tear-out towards the flange's bottom edge, because the load pushes the rivets down against the tops of their holes. A load that reverses, such as a vibration that throws the plate upwards as well as down, makes every edge around the hole a possible tear-out edge, and the edge distance must be checked in each direction the load can act.

## Clearance and fit

The hole is slightly larger than the rivet: 4.9 mm for a 4.8 mm rivet in this illustration. A blind rivet expands as it is set and largely fills its hole; a loose-fitting fastener, such as a screw in a clearance hole, does not, and its joint can slip before it bears. Slip under repeated load wears the hole oval and loosens the joint. Oversized holes, drilled to clear burrs or poor alignment, reduce the rivet's fill and its ability to share load with its neighbours, and the rivet maker's recommended hole size should be held.

## Units in the check

Every formula in this chapter multiplies millimetres by millimetres by megapascals, and one megapascal is one newton per square millimetre, so the results come out directly in newtons. Keeping every dimension in millimetres and every strength in megapascals avoids the commonest slip, a thickness entered in metres or a strength in pascals, which gives a result a million times wrong and usually obviously so. A spreadsheet laid out with one row per mode per sheet, its formula written beside it in words and the governing value highlighted, is quick to check and easy to rerun when a dimension changes.

## Margin and what it means

The ratio of a joint's strength to the load it carries is its **margin**, and how much margin a joint needs is a design decision, set by the product's requirements, the applicable standard or the consequences of failure. EN-700's bracket rivets, at 184 N each, had a calculated margin of about 10.6 against tear-out at 5 mm edge distance and about 13 against the rivet's rated shear. Both look large, and the test still failed the joint, because the factored load was an estimate of a dynamic situation that the vibration test reproduced more severely than the factor of 3 had assumed.

A large calculated margin is therefore not proof of a sound joint under repeated or dynamic loading. It shows that the joint will carry its static load; it does not show how the joint behaves when the load is amplified by resonance or repeated millions of times. For those, the four-mode check identifies the weak point, and a test decides whether it is weak enough to matter.

## Holes near folds

The first bracket's rivets were placed close to the flange's edge for a reason: the bracket's fold, at the other side of the flange, needed clearance, and a hole too close to a fold distorts when the fold is made, as *Sheet Metal Parts by the Numbers* explains. The flange was simply too short to give the rivet both a clear distance from the fold and a safe distance from the edge. Lengthening the flange by 5 mm, so that the upper rivet sits 10 mm from the edge instead of 5 mm while keeping its distance from the fold, resolved both, at the cost of a little sheet, and is the usual answer: give a riveted flange enough length for the fold clearance, the hole and the edge distance together, and draw all three.

## Multiple rivets and load sharing

A joint with several rivets in line along the load does not share the load equally among them. The rivets at the ends of the line carry more than those in the middle, because the sheets stretch between rivets and the end rivets see the difference first. For two rivets, as in EN-700's bracket, the sharing is close to equal; for long lines, designers either limit the number of rivets in a line or use the end rivets' share for the check. A joint that adds rivets to a long line to gain strength gets less than it expects.

## Exercise: the hinge rivets

EN-700's door hinge is fixed to the 2.0 mm aluminium door by 4.0 mm aluminium blind rivets in 4.1 mm holes, rated in this illustration at 1,000 N in shear. The door's aluminium is taken as 228 MPa tensile, 0.6 times that in shear and 1.5 times that in bearing. With the hinge leaf's rivets 6 mm from the door's edge in the direction of the load, and the strip of door under each rivet 25 mm wide, what governs each rivet's strength? Would a larger edge distance change that?

**Worked answer.** Bearing in the door is 4.0 × 2.0 × 342 = **2,736 N**. Tear-out at 6 mm is 2 × (6 − 2.05) × 2.0 × 136.8 = about **2,161 N**. The net section of a 25 mm strip is (25 − 4.1) × 2.0 × 228 = about **9,530 N**. The rivet's rated shear is **1,000 N**.

The rivet governs already, at 1,000 N, because aluminium blind rivets are much weaker than steel ones. Tear-out at 6 mm is more than twice that, so the edge distance is adequate here. The lesson is the reverse of the bracket's: with a weak rivet in a thick enough sheet, the rivet's rating sets the joint's strength, and more rivets, not more edge distance, is the way to more strength. At 8 mm edge distance the tear-out would rise to about 3,256 N, which changes nothing about which mode governs; only a stronger rivet, or more rivets sharing the load, would.
