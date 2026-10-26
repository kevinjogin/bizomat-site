---
book: sheet-metal-joints-by-the-numbers
chapterSlug: folded-lock-seams
order: 7
title: "Folded lock seams"
description: "Join sheet by folding it: grooved, Pittsburgh, standing and double seams, what loads they carry and how they seal, which way the lock should face, and catch a rain-hood seam grooved too loose to grip."
draft: false
---

The oldest sheet metal joint uses no fastener at all. Two edges are folded into hooks, hooked together and pressed flat, and the folds themselves hold the sheets. Graham's 1918 school text describes the machines that do it, folders, grooving machines, burring and setting-down machines, and the same seams still close ductwork, roofs, gutters and the bottoms of cans. A folded seam is quick, needs no hole, keeps its coating and, with a little sealant, keeps water out. It is also a joint whose strength depends entirely on how tightly the folds grip, and a seam folded or grooved loose has almost none.

This chapter describes the main folded seams, what they carry and in which direction, how they seal, which way the lock should face, and how a seam's quality is checked. Pattern allowances for seams belong to pattern development, which *Sheet Metal Patterns by the Numbers* covers; here the concern is the seam as a joint. The running case joins EN-700's rain hood to its roof with a grooved seam and finds the first hoods' seams grooved with a tool set too wide, so that they slid apart under hand pressure.

## The main seams

- **Grooved seam**, or folded lock seam: each edge is folded into a hook, the hooks are engaged, and the seam is closed with a grooving tool that presses it down and offsets it slightly, so that the sheets lie flush on one side. It joins two flat sheets edge to edge.
- **Pittsburgh lock**: one edge is roll-formed into a pocket and the other into a simple flange that is inserted into the pocket and hammered over. It is the common longitudinal seam on rectangular duct, quick to make on a roll-former.
- **Standing seam**: the edges are turned up and folded over each other, leaving a raised rib. It is used on roofs and on joints that must shed water and stiffen a panel.
- **Double seam**: the joint between a can's or a bucket's body and its bottom, in which flanged edges are rolled together in two operations, the burring and setting-down of older practice.

```figure
type: compare
title: Folded seams and where EN-700 might use them
cols: Joins | Carries best | Seals with
caption: This is an illustration. Each seam's strength depends on its folds' tightness and is best known from the fabricator's own coupon tests.
- Grooved seam | Two flat sheets edge to edge | Shear along the seam; modest tension across it | Sealant in the lock
- Pittsburgh lock | Corner of a rectangular duct | Shear along the corner | Sealant in the pocket
- *Standing seam | Panels on a roof or hood | Bending, by its rib; sheds water | The raised fold itself, plus sealant
- Double seam | Body to bottom of a round vessel | Pressure from inside | Its own tight rolling, plus compound
```

## Making a grooved seam

```figure
type: steps
title: Making EN-700's grooved rain-hood seam
caption: This is an illustration of the sequence. The fold widths and the groove come from the seam's detail and the tool matched to the sheet.
- Fold the hooks | Each edge folded back on itself to the seam width, 6 mm, on the folder
- Apply sealant | A continuous bead in the hook that will face the weather
- Engage the hooks | The hood's hook into the roof's, lock facing down-slope
- *Close and groove | Grooving tool matched to 1.2 mm sheet presses the seam down and offsets it
- Check | Push test along the seam by hand; no movement, no gaps in the sealant
```

The width of the hooks and the groove of the tool must match each other and the sheet's thickness. A groove too wide leaves the seam loose, as the error below shows; one too narrow crushes the folds and can crack the coating. The folder's adjustments for fold width and sharpness, which Graham's text tells the student to check before every fold, are what make the hooks consistent along the seam.

## What a seam carries

A folded seam is strong in **shear along its length**, where the folds bear on each other over the whole seam, and weaker in **tension across it**, where the load tries to unfold the hooks. Its strength across the seam depends on how tightly it was closed, the sheet's thickness and its yield strength, and is far below the sheet's own strength: a folded seam is a sealing and locating joint, not a structural one.

This is an illustration. The fabricator's coupon tests of grooved seams in its 1.2 mm galvanised sheet give a strength across the seam of about **8 kN per metre** when properly closed. The sheet itself, at 320 MPa, carries about 1.2 × 320 = **384 kN per metre** in tension. The seam holds about 2% of what the sheet would; it is adequate for the light loads that seams are used for, and it would be a poor choice for a joint that has to carry real tension.

## The running case: the rain hood

This is an illustration. EN-700 has a rain hood over its door: a 520 mm long, 150 mm deep folded canopy that sheds water away from the door's top edge. It joins the roof with a grooved seam, 6 mm wide, sealed in the lock. Its load is wind: in this illustration, an uplift pressure of 1.5 kPa on the hood's 0.52 × 0.15 = 0.078 m² gives about **117 N**, trying to open the seam across its width.

The seam's strength, at 8 kN/m over 0.52 m, is about **4,160 N**, a margin of about 36 on the wind load. The seam's real job is to keep water out, which its lock and sealant do, and to hold the hood firmly so that it does not drum in the wind. Strength is not what decides this seam; its grip, its orientation and its sealing are.

## The error: a seam grooved too loose

This is an illustration. The first batch of rain hoods was grooved on a hand grooving tool whose groove was wide enough for 1.6 mm sheet, left from an earlier job. On EN-700's 1.2 mm sheet, the tool pressed the seam down without gripping it: the hooks were engaged but not closed. The hoods looked right, but a fitter checking one could slide the hood along the roof by hand, and a pull test across a coupon made with the same tool gave about **2 kN per metre**, a quarter of the properly closed seam's strength. The seam would still have carried the 117 N wind load, with a margin of about 9, but it would have let water wick through the open lock, and the hood would have rattled.

The fix was to use the groove matched to the sheet's thickness, as Graham's text already advised for the grooving machine in 1918, to retest a coupon, and to add a simple production check: every hood seam is pushed along its length by hand, and must not move. The rule is the clinching rule of Chapter 5 again: a folded joint is defined by its tooling, and the tooling must match the sheet.

```figure
type: bars
title: Strength across the rain hood's grooved seam, by how it was closed
unit: N
max: 4500
caption: This is an illustration from the fabricator's coupon tests, scaled to the hood's 0.52 m seam. Both carry the 117 N wind load; only the tight seam grips, seals and stays quiet.
- Grooved with a tool set for 1.6 mm sheet | 1040
- *Grooved with the tool matched to 1.2 mm | 4160
- Wind uplift on the hood | 117
```

## Which way the lock faces

A seam on an outdoor surface must face so that water runs over it, not into it. On a sloping roof or hood, the upper sheet's edge should lap over the lower sheet's, like roof tiles, so that water flowing down the slope passes over the seam rather than being directed into its lock. A seam assembled the other way round directs water straight into the fold, where capillary action draws it along the lock and through to the inside, sealant or not. EN-700's rain hood seam is drawn with its lock facing down-slope, and the drawing shows the direction of the water's flow so that the assembler cannot reverse it.

## Sealing a seam

A tightly closed seam is nearly watertight on its own, but not completely: water can wick along the fold by capillary action. A non-hardening sealant applied in the lock before closing fills the fold and stops it. The sealant must be compatible with the coating, remain flexible through the product's temperature range, and be applied in a continuous bead, because a gap in the bead is a path for water. EN-700's seams are water-tested on every tenth enclosure, with a hose for a set time and a check inside for any trace of water.

## Seams and the sheet's coating

Folding galvanised sheet tightly can crack the zinc on the outside of the fold, especially at small radii and in thicker coatings, though zinc's ductility usually lets it bend without flaking. Pre-painted sheet is more sensitive. A folded seam that cracks its coating has bare steel along a fold where water may sit, which defeats the reason for choosing a cold joint. Sheet makers publish minimum fold radii for their coated products, and the seam's tooling should respect them.

## Testing a seam coupon

A seam's strength is measured on coupons: strips cut across a seam made with the production sheet, sealant and tooling, and pulled apart in a tensile machine. This is an illustration. EN-700's fabricator cuts coupons 50 mm wide, pulls each across the seam until it opens, and scales the result to a strength per metre: a coupon opening at 400 N gives 400 ÷ 0.05 = 8,000 N per metre, the 8 kN/m used above. Three coupons are pulled whenever the sheet, the tooling or the seam detail changes, and one each week in production. The figure is the fabricator's own, for its own process, which is the only kind of figure a folded seam's strength can honestly be given.

## How folded seams fail in service

Folded seams rarely break outright. They fail by opening slowly under repeated flexing, as a panel drums in the wind and works the lock back and forth; by corroding inside the lock, where water sits if the sealant has a gap or the lock faces the wrong way; and by being dented or prised open in handling. Each failure is visible early as a gap, a rust stain or a rattle, and each is prevented more by a tight seam, a continuous sealant bead and the right orientation than by any extra strength. A maintenance check of an outdoor enclosure's seams, once a year, finds the first signs while the repair is still a bead of sealant rather than a new panel.

## Seams on round vessels

Round bodies and their bottoms are joined by double seams, by flanged and soldered joints, or by folded and riveted joints. A double seam is formed in two operations: the bottom's flange and the body's burr are first rolled together, then flattened against the body, giving five layers of sheet locked in a small roll. Its quality is checked by cutting a seam and measuring its thickness, length and overlap against the specification for the container, as can makers do routinely. For vessels holding liquid, the seam is also leak-tested. Such seams are specialised; a fabricator making occasional round vessels is more likely to flange and weld or flange and solder the bottom, as *Brazing and Soldering by the Numbers* describes.

## Drawing a seam

A seam on a drawing needs more than a line. EN-700's rain-hood drawing shows the seam's type and width in a detail, the sheet each hook belongs to, the direction the lock faces relative to the water's flow, the sealant and where it goes, and a note of the coupon strength the seam must reach. The flat patterns of the hood and roof carry the seam's allowances, calculated as *Sheet Metal Patterns by the Numbers* sets out, so that the hooks come out the right width when folded. A drawing that shows only "grooved seam" leaves every one of those decisions to whoever happens to make the part, and the loose-seam error shows what can follow.

## Folded seams and clinches compared

EN-700's body seams are clinched, not folded, and the choice was deliberate. A folded seam needs extra sheet for its hooks along every edge, a folding operation on each part and a grooving operation on the assembly; a clinched seam needs only a flange on each part and a row of clinches. For the enclosure's body, with its corner seams carrying the box's shape, clinches gave a stiffer joint for less sheet and fewer operations. For the rain hood, where a continuous, water-shedding joint along a sloping edge mattered more than stiffness, the grooved seam's continuous lock was the better seal.

## Exercise: a standing seam for the hood

Suppose the rain hood were joined to the roof by a standing seam instead, with a coupon strength across the seam of 6 kN per metre in this illustration because its rib is loaded differently. What would its strength be over 0.52 m, and its margin on 117 N of uplift? What else would change?

**Worked answer.** The strength is 6 × 0.52 = about **3,120 N**, a margin of about **27** on the 117 N wind load. Like the grooved seam, it is far stronger than the load requires.

What changes is not strength but form. A standing seam leaves a raised rib along the joint, which stiffens the hood's edge and sheds water well because the joint sits above the water's path; it needs more sheet for its taller folds, and its rib must be acceptable in appearance and must not catch dirt or interfere with the door. For a hood that drummed in wind, the rib's stiffness might be worth having. The choice, as with every seam, rests on what the joint must do, which Chapter 1 asked first, and a coupon test of the standing seam in production sheet would confirm its strength before the change was made.
