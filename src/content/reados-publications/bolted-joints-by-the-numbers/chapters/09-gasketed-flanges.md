---
book: bolted-joints-by-the-numbers
chapterSlug: gasketed-flanges
order: 9
title: "Gasketed flanges: seating the gasket and holding the pressure"
description: "How the bolts of a gasketed flange are sized: the load to seat the gasket, the load to hold it tight under pressure, gasket factors, bolt area, and an old empirical rule compared."
draft: false
---

The test head in Chapter 1 seals with an O-ring and clamps metal to metal, so its bolts only have to keep two steel faces together. A gasketed joint is different. Its seal is a soft layer between the faces, and the bolts must first squeeze that layer hard enough to make it flow into the faces' roughness, and then keep enough squeeze on it, with pressure trying to push the faces apart, that it stays sealed. The bolts' job is to the gasket as much as to the joint, and the gasket's properties, not the pressure alone, often decide how many bolts are needed.

This chapter checks the bolting of the CT-1's return-line filter housing cover with the BIZOMAT gasketed flange bolt load check, which follows the widely used ASME approach, and compares it with an old empirical rule for bolts in packed joints from the handbook. Its mistake is a gasket upgrade that the bolts could not seat.

## The filter housing

The CT-1's hydraulic power unit returns oil to its tank through a filter in a cast housing with a bolted cover. The cover seals on a flat gasket whose load reaction diameter is 230 mm, with an effective seating width of 8 mm, and it is held by twelve M16 × 2 studs. The housing's design pressure is 2.0 MPa, set by the return line's relief valve. The studs are an alloy steel whose allowable stress for this purpose is 172 MPa. This is an illustration; for a vessel built to a pressure equipment code, the allowable bolt stress, the gasket's dimensions and its factors all come from that code and the gasket maker.

## Two bolt loads

The ASME pressure vessel code's rules for bolted flanges, in Appendix 2 of Section VIII Division 1, are widely used beyond the vessels the code covers, and they size the bolts for two conditions.

```figure
type: formula
title: Bolt loads for a gasketed flange
formula: Operating: Wm1 = H + Hp = (π ÷ 4) G² p + 2 π b G m p
formula: Seating: Wm2 = π b G y
formula: Required bolt area Am = max(Wm1, Wm2) ÷ Sa
caption: G is the diameter at the gasket load reaction, b the effective seating width, p the design pressure, m the gasket factor and y the gasket seating stress. H is the pressure's end force; Hp the compression the gasket must keep to stay tight under pressure, m times the pressure on twice its effective area. Sa is the allowable bolt stress. The bolts must provide at least Am of stress area.
- m | gasket factor, dimensionless
- y | gasket seating stress, MPa
- Wm1, Wm2 | operating and seating bolt loads
```

The seating load is what it takes to bed the gasket in before any pressure is applied, and it depends only on the gasket's area and its seating stress y. The operating load is the pressure's end force plus enough remaining squeeze on the gasket, m times the pressure, to keep it sealed. Soft gaskets have low y and m; metal and metal-reinforced gaskets need much more of both.

The [gasketed flange bolt load check](/tools/flange-bolt-load-check/) takes the design pressure, the gasket reaction diameter, the effective seating width, the gasket factor m and seating stress y, the number of bolts, the bolt diameter and pitch, the allowable bolt stress and a nut factor. It returns the hydrostatic end force, the operating and seating bolt loads and which governs, the required and provided bolt areas, the load per bolt and the tightening torque from the nut factor. It calculates bolt loads only; the flange's own stresses and rotation, and the joint's leak tightness, need the full code analysis.

### Where the gasket's numbers come from

The two dimensions the tool asks for are not simply the gasket's size. The gasket reaction diameter G is where the gasket's compressive force is taken to act, and the effective seating width b is the width over which the seating stress is taken to act. For a narrow gasket they are close to its mean diameter and half its width; for a wide one, the code takes an effective width smaller than half the actual width, and moves G outwards, because a wide gasket under a flange that rotates slightly is compressed most at its outer edge. The code gives the rules for both, by gasket type and facing. For the filter cover, the 8 mm effective width and the 230 mm reaction diameter were worked out by the housing's maker and taken from its drawing. This is an illustration.

## The cover as designed

The housing's maker specified a compressed non-asbestos fibre gasket. For that gasket the shop took m = 2.0 and y = 25 MPa from the gasket maker's data sheet. This is an illustration; gasket factors differ between products and makers.

```figure
type: steps
title: The filter cover in the gasketed flange bolt load check, fibre gasket
caption: This is an illustration. 2.0 MPa, G 230 mm, b 8 mm, m 2.0, y 25 MPa, 12 studs M16 × 2, allowable 172 MPa, nut factor 0.20.
- Hydrostatic end force H | 83.1 kN
- Operating bolt load Wm1 | 129.3 kN
- Seating bolt load Wm2 | 144.5 kN
- Governs | Gasket seating
- * Required / provided bolt area | 840 / 1,880 mm²: BOLTING ADEQUATE
- Load per bolt / torque | 12.04 kN / 39 N·m
```

The twelve studs provide more than twice the area needed. Seating governs: it takes more load to bed this gasket than to hold the pressure, even with the gasket factor. Each stud carries 12.04 kN when the gasket is seated, 77 MPa on its stress area, and is tightened to about 39 N·m.

## The mistake: an upgraded gasket

After several years the fibre gasket had hardened and the cover wept oil. The fitter on duty found no fibre gasket of the right size in stores, but did find a spiral-wound gasket, metal windings with a graphite filler, that fitted. Spiral-wound gaskets are used on high-pressure flanges, so it seemed an upgrade. The cover was refitted with the studs tightened to their usual torque, and it leaked from the first start.

The engineer ran the cover again with the spiral-wound gasket's figures, m = 3.0 and y = 69 MPa, from that gasket's data sheet. This is an illustration.

```figure
type: compare
title: The filter cover's bolting with two gaskets
cols: Seating load | Required area | Provided area | Load per stud | Verdict
rowhead: Gasket
- * Compressed fibre, m 2.0, y 25 MPa | 144.5 kN | 840 mm² | 1,880 mm² | 12.0 kN | Adequate
- Spiral-wound, m 3.0, y 69 MPa | 398.9 kN | 2,319 mm² | 1,880 mm² | 33.2 kN | Inadequate
caption: This is an illustration. Twelve M16 studs at an allowable of 172 MPa. A gasket made for high pressure needs a seating stress far beyond what a light cover's studs can supply.
```

To seat the spiral-wound gasket, each stud would have to carry 33.2 kN, 212 MPa on its stress area, beyond the 172 MPa allowable, and the light cast cover would bend between the studs long before the whole gasket was evenly compressed. At the fitter's usual 39 N·m, the studs gave about 12 kN each, barely a third of the seating load; the gasket's windings were never compressed enough to seal. A gasket is not better or worse in itself: it is matched to a flange, and a flange designed for a soft gasket cannot seat a hard one. The cover was refitted with a new fibre gasket of the specified type, and the stores record now lists the gasket by its specification, not just its size.

## An old rule for packed joints

Older handbooks give an empirical rule for the working strength of studs and bolts in packed joints, where the gasket, or packing, is more elastic than the bolts. It sets a working load per bolt as an allowable stress times a function of the bolt's diameter in inches, W = St (0.55 d² − 0.25 d), so that small bolts are given a lower stress in recognition that a fitter's spanner can easily overstress them.

The [working strength of bolts in packed joints tool](/tools/bolt-working-strength-packed/) takes the nominal bolt diameter, the area at the thread root, an allowable working stress in tension and the total external load on the joint. It returns the working strength per bolt by that formula and by an alternative based on the root area, the working strength in pounds, and the number of bolts for the total load. It flags bolts under 5/8 inch, about 16 mm, as liable to be broken by normal tightening. It is an empirical rule for hand-tightened bolts in gasketed joints, and its notes say that pressure equipment must be designed to its code.

```figure
type: steps
title: The filter cover's studs in the packed joint working strength tool
caption: This is an illustration. M16 studs, root area 144.1 mm², working stress 68.95 MPa (10,000 psi, the handbook's customary figure), total load 83.1 kN, the pressure's end force.
- Working strength per stud, formula | 2.70 kN
- Working strength, root area | 2.93 kN
- * Studs for 83.1 kN | 31
- Bolt size | 16 mm: at the handbook's minimum for tight joints
```

The old rule asks for 31 studs where the code method finds 12 more than enough. The difference is not a contradiction. The rule comes from a time when bolts were tightened by feel with an ordinary spanner, their materials were weaker and less consistent, and the allowable of 10,000 psi was chosen to cover all of that. The code method assumes a controlled preload and a known gasket. The shop uses the old rule only as a cross-check on old equipment designed by it, and as a reminder of why small bolts in gasketed joints are tightened with a torque wrench, not by feel. The tool's second figure, based on the thread's root area less a quarter of the diameter, gives 2.93 kN per stud, close to the first; the two forms of the rule were meant to agree, and they do within about 10% for bolts of this size. Neither should be used to design new pressure equipment, and the tool's notes say as much.

## Tightening a gasketed joint

A gasket compresses unevenly if the studs are tightened one after another to full torque: the first ones crush the gasket locally and the cover tilts. The shop's procedure for the filter cover, drawn from the general practice that the ASME guideline for assembling pressure boundary bolted flange joints sets out, is a star pattern in at least four passes, at 30%, 60% and 100% of the final torque, then a circular pass at 100% until no nut turns, and a final check after 4 hours, because gaskets relax as they bed in. This is an illustration.

```figure
type: checklist
title: Refitting the filter housing cover
caption: The CT-1 maintenance instruction. This is an illustration.
- x System isolated, pressure released and confirmed zero on the gauge; oil drained below the cover
- x Faces cleaned without scoring; old gasket fully removed
- x New gasket of the specified type, not reused, not doubled up
- x Stud threads clean and lubricated as specified; nuts run on freely by hand
- x Star pattern, four passes to 39 N·m, then a circular pass
- x Retorque check after 4 hours, before the unit is pressurised to full
- x Gasket type, torque, wrench and date recorded
```

## Why gaskets lose load

Gaskets creep and relax under their bolt load, more at higher temperature, so the stud load falls over time; a gasket that seals at assembly can leak months later. Long studs, which are flexible, lose a smaller share of their load for the same gasket creep than short stiff bolts, for the same reason that long bolts tolerate embedding in Chapter 1. Some joints use disc springs under the nuts to keep the load up as the gasket relaxes. The filter cover's studs are short, and the shop's answer is the retorque check and a scheduled gasket replacement. Each replacement is recorded with the gasket's type and batch, the torque and the date, so that a cover that starts to weep can be traced to a gasket, a procedure or a fitter, and so that the replacement interval can be set from the rig's own history instead of a guess. The first interval was set at two years, to be reviewed after the first two replacements. This is an illustration.

## Flange rotation

The bolt load check assumes the cover and the housing's flange stay flat. They do not. The bolts pull at a circle outside the gasket, the pressure and gasket push at circles inside it, and the flange ring rotates slightly about its own section, lifting at the gasket's inner edge. A thin flange rotates more, and a gasket compressed at its outer edge and barely touched at its inner edge may leak even though the total bolt load is right. That is why the code goes on, after sizing the bolts, to check the flange's stresses and, in later editions and in some other codes, its rotation. For the filter cover, made by a housing maker to its own design, the shop relies on the maker's design for the flange and checks only that the bolting it maintains still meets the bolt load requirement.

## O-rings instead of gaskets

The test head in Chapter 1 avoids most of this chapter's problems by sealing with an O-ring in a groove and bolting metal to metal. The O-ring needs only a small, controlled squeeze, set by the groove depth, not by the bolt load, and the bolts' only job is to keep the faces in contact under pressure. Their load is sized by separation, as in Chapter 4, and the joint is stiff, as Chapter 5 needs for fatigue. A flat gasket, by contrast, puts a soft layer in the bolted joint, making it less stiff, letting it relax, and asking the bolts to seat it. Where a design allows it, the shop prefers the O-ring and metal-to-metal contact. Many hydraulic components are built that way for the same reasons, and flat gaskets remain where faces are large, rough or not flat enough for an O-ring, as on the cast filter housing.

## Exercise: eight studs instead of twelve

A new filter housing of the same size is offered with eight M16 studs instead of twelve. With the fibre gasket, check the bolting with the gasketed flange tool's relations: required and provided areas, load per stud and torque.

### Worked answer

The bolt loads do not depend on the number of studs: Wm1 = 129.3 kN and Wm2 = 144.5 kN, so seating still governs and the required area is 144,500 ÷ 172 = 840 mm².

Eight M16 studs, each with a stress area of 156.7 mm², provide 1,253 mm², more than the 840 mm² required. Each stud carries 144.5 ÷ 8 = 18.06 kN, 115 MPa, and is tightened to 0.20 × 18,060 × 0.016 = 57.8 N·m.

The gasketed flange check reports the bolting as adequate. But the code method checks bolt area only. With eight studs, the gap between studs on the 230 mm gasket diameter grows by half, and a light cover bends more between them, so the gasket's compression is less even. Whether eight studs keep the gasket tight between them depends on the cover's stiffness, which the flange's full design check, not the bolt load check, answers.
