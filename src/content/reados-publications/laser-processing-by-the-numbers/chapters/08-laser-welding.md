---
book: laser-processing-by-the-numbers
chapterSlug: laser-welding-heat-input-and-fit-up
order: 8
title: "Laser welding: penetration, heat input and fit-up"
description: "Conduction and keyhole laser welding, heat input compared with TIG and MIG, cooling time and hard heat-affected zones in steel, and the fit-up a laser weld needs."
draft: false
---

A laser weld puts a small amount of heat exactly where it is needed and moves on quickly. Compared with an arc weld, it gives a narrow seam, a narrow heat-affected zone and little distortion, which is why the cell's W-2 robot welds the corners of its stainless steel boxes instead of a welder with a TIG torch. The same features make laser welding demanding: a small spot needs an accurately placed, tightly fitted joint, and a small heat input means very fast cooling, which in hardenable steel produces a hard heat-affected zone.

This chapter covers the two modes of laser welding, compares heat input with arc welding, works out the cooling time that follows, and deals with fit-up. It has two mistakes, because laser welding offers two very different ways to go wrong.

## Conduction and keyhole welding

At moderate power densities, the laser melts a shallow pool whose depth grows by conduction from the surface, much like a very concentrated TIG arc. This is conduction-mode welding: smooth, shallow, wide relative to its depth, and limited in penetration by how far heat can conduct during the interaction time.

Above a threshold of the order of a million watts per square centimetre in steels, the surface boils. The pressure of the escaping vapour pushes the molten metal aside and opens a narrow cavity, the keyhole, down which the beam travels. The keyhole traps the beam, just as the cutting kerf does in Chapter 1 but more completely, so most of the power is absorbed whatever the metal's flat-surface absorptivity. Heat is delivered along the whole depth of the keyhole rather than only at the surface, and the weld becomes deep and narrow.

The W-2's 0.100 mm spot delivers 25.5 million W/cm² at 2 kW (Chapter 4's exercise), far into keyhole mode. Moving the focus away from the surface enlarges the spot and lowers the power density, which is how the robot switches between modes.

```figure
type: compare
title: The W-2's spot and power density with the focus moved above the surface, 2 kW
cols: Spot diameter | Power density | Mode expected in steel
rowhead: Focus offset
- At focus | 0.100 mm | 25,500,000 W/cm² | Keyhole: deep, narrow
- 3 mm | 0.259 mm | 3,780,000 W/cm² | Keyhole, wider and shallower
- 6 mm | 0.489 mm | 1,060,000 W/cm² | Near the threshold: unstable, avoid
caption: This is an illustration. d(z) = 0.100 × √(1 + (z ÷ 1.25)²). The cell uses the focused setting for structural seams and a defocused, lower-power setting for cosmetic sealing runs; it avoids settings near the threshold, where the weld switches between modes and its depth jumps.
```

The threshold region deserves its warning. Near it, the keyhole forms and collapses irregularly, and the penetration can change by a factor of two along the same seam. The robot's programs therefore use either clearly keyhole or clearly conduction settings.

## Heat input: laser against arc

The heat input of a weld is the energy delivered per unit length of seam: power divided by travel speed, multiplied by the share that enters the work. For a laser, the power is the beam power at the work. For an arc, the [welding heat input tool](/tools/welding-heat-input/) separates the arc energy, voltage times current divided by travel speed, from the heat input adjusted by a process efficiency, because conventions on which figure a procedure means differ between standards.

```figure
type: compare
title: Heat input for a 1.5 mm stainless steel box corner
cols: Power | Travel speed | Energy per length | Share entering the work | Heat input
rowhead: Process
- * W-2 laser, keyhole | 2,000 W | 3.0 m/min | 40 J/mm | 0.8, assumed for a keyhole | 0.032 kJ/mm
- TIG, manual | 12 V × 80 A = 960 W | 200 mm/min | 0.288 kJ/mm arc energy | 0.6 | 0.173 kJ/mm
caption: This is an illustration. The TIG figures are from the welding heat input tool. The laser seam takes about a fifth of the heat of the TIG seam it replaced.
```

The laser seam puts 5.4 times less heat into the box per millimetre. That is the source of its advantages on thin stainless steel: less distortion of the box walls, a narrower band of heat tint to be cleaned off, and less time for chromium carbides to form at the grain boundaries in the heat-affected zone, which can leave stainless steel open to corrosion. It is also the source of its demands, as the rest of this chapter shows.

### Estimating penetration

Laser weld penetration is set by trial, not calculation, because it depends on the keyhole's behaviour. A useful planning rule is that, for the same material, spot and mode, the speed for full penetration falls roughly in proportion to the thickness at constant power, because the energy per unit area of fused section stays roughly constant. The W-2's qualification coupon gave full penetration of 1.5 mm stainless at 2 kW and 3.0 m/min. For a 2 mm box, the rule gives 3.0 × 1.5 ÷ 2 = 2.25 m/min as a starting point for the trial, and the cell's trials settled at 2.2 m/min. Like Chapter 6's cutting speed rule, it is a guide to the first trial, not a replacement for it.

## The first mistake: gaps at the box corners

The boxes are bent from flat blanks, and their corners are closed by a laser seam where two flanges meet. A common rule of thumb for autogenous laser welding, without filler wire, is that the gap in a butt joint should not exceed about a tenth of the sheet thickness, 0.15 mm on 1.5 mm sheet, and that the beam must sit on the joint line within a fraction of the spot size. When the cell changed its sheet supplier, the box corners began to come out with holes and underfilled stretches, and two batches failed the customer's water ingress test.

Measuring the gaps found the cause. The new sheet's thickness was at the top of its tolerance, which made each bend slightly longer, and the corner gaps ranged up to 0.3 mm, twice the rule. With no filler, a 0.3 mm gap has nothing to fill it: the melt bridges part of it and sags or burns through the rest.

```figure
type: steps
title: How the box corner gaps were fixed
caption: This is an illustration. The gap limit is the cell's own figure from trials, consistent with the common rule of thumb.
- Symptom | Holes and underfill at corners; two batches failed water ingress
- Measurement | Corner gaps up to 0.3 mm on the new supplier's sheet; previously up to 0.12 mm
- Cause | Thicker sheet at the top of its tolerance lengthened the bends; flat blank unchanged
- * Correction | Flat blank recalculated for the measured thickness; corner gaps back to 0.05 to 0.12 mm
- Protection | Wobble head trial: a small circular oscillation widens the pool and bridged gaps up to about 0.3 mm at 2.2 m/min; kept as the fallback program
- Check | Feeler gauge check of corner gaps on the first box of each sheet batch
```

The real fix was upstream, in the bending: a laser weld cannot be expected to cover for the joint. The wobble program, in which the head's mirrors move the spot in a small circle as it travels, widens the weld pool at the cost of speed. It is kept for batches that cannot be corrected, not used to hide a fit-up problem. The international standard for laser and electron-beam welded joints, ISO 13919-1, sets quality levels for imperfections such as underfill and holes in welds in steel, and the cell's customer calls up one of its levels; its acceptance criteria are what the inspection checks against.

## Joints that suit a laser

The joint design does much of the work of making a laser weld robust. A square butt joint gives the neatest seam but is the least tolerant: the beam must sit on a line no wider than the gap, and any gap has no filler. A lap joint, with one sheet over the other and the beam welding through the top sheet into the bottom, is far more tolerant of the beam's position, because the weld can be anywhere on the overlap; it needs the sheets clamped together, because a gap between them is as damaging as a gap in a butt. A corner or edge-flange joint, in which the edges of two flanges meet at the outside of a box corner, gives the beam a small ridge of metal to melt and is moderately tolerant of position. The cell's boxes use corner joints for their vertical seams and lap joints for the bottom, so that the hardest positioning task is limited to four short seams.

The robot positions the head with a repeatability of a few hundredths of a millimetre, but the parts are only as accurate as their blanks and bends. With a 0.1 mm spot, the cell's rule is that the beam must sit within 0.1 mm of the joint line on butt and corner seams. Fixtures that clamp each box against fixed stops do most of that job; a seam-finding camera checks the start of each seam and offsets the program when a box sits slightly out of place.

## Shielding, porosity and cleanliness

Molten stainless steel exposed to air oxidises and picks up nitrogen, so the seam is shielded, usually with argon flowing from a nozzle beside the beam and, for the boxes' inside faces, purged through the box. Too little shielding gives a dark, oxidised seam; too much, or a gas jet aimed into the keyhole, can disturb the pool. The keyhole's own behaviour causes porosity: if it collapses momentarily, a bubble of vapour and gas is trapped as the pool freezes. Steady power, a stable focus position and clean, dry joint faces keep porosity down. Oil from forming, marker pen and protective film residues are the commonest sources of porosity in the cell's work, which is why the boxes are wiped with solvent before they are loaded into the welding fixture and why the film is stripped back well clear of each seam.

## Cooling time and hard heat-affected zones

The low heat input that helps stainless steel has the opposite effect in hardenable carbon steel. A small amount of heat in a narrow band cools very quickly, and Chapter 5 showed what fast cooling does to steel with a carbon equivalent of 0.476.

Welding engineers describe cooling by t8/5, the time the weld and heat-affected zone take to cool from 800 °C to 500 °C, the range in which steel's microstructure is decided. Short times give hard, brittle martensite; longer times give softer structures. The [weld preheat and cooling time check tool](/tools/weld-preheat-check/) estimates t8/5 from the heat input and plate thickness with screening formulas for thick-plate and thin-plate heat flow.

For a 3 mm grade 350 bracket welded by MIG at 20 V, 150 A and 400 mm/min with 80% efficiency, the tool gives a heat input of 0.36 kJ/mm and a thin-plate t8/5 of 16.4 s, inside the window of 3 to 20 s the cell entered as its procedure limits. It also flags that, by its rule, a CE of 0.476 calls for preheat, with a Séférian preheat estimate of 126 °C; for 3 mm sheet, the cell's qualified procedure and AS/NZS 1554.1, which the tool names, govern that decision.

The same thin-plate formula, given the laser's 2 kW at 2 m/min with 80% entering the work, a heat input of 2,000 ÷ 33.3 × 0.8 = 48 J/mm or 0.048 kJ/mm, gives t8/5 = 0.29 s. That is far outside the range for which the screening formula was devised, so the number itself is not reliable. Its message is: the laser weld cools through the critical range more than fifty times faster than the MIG weld.

### The second mistake: hard brackets

A customer asked for a batch of 3 mm brackets in grade 350 steel to be laser welded rather than MIG welded, to reduce distortion. The procedure qualification's macro section was given a Vickers hardness survey at 10 kgf (HV10). In the heat-affected zone, the diagonals measured 0.209 and 0.211 mm. The [Vickers test check tool](/tools/vickers-test-check/) gave 420 HV10 with all validity checks passed, and a fail against the customer's limit of 350 HV10.

```figure
type: decision
title: Options for laser-welded steel brackets with a hard heat-affected zone
caption: This is an illustration. The cell chose the first option and wrote the CE limit into its laser welding procedure.
- Order a lower-carbon-equivalent steel for laser-welded parts | A steel with CE 0.326 by the carbon equivalent tool, readily weldable, re-qualified at 290 HV10 | Adopted: laser-welded steel brackets specify CE ≤ 0.40 on the order
- Add a defocused second pass to temper the heat-affected zone | Lowers hardness but doubles the beam time and needs its own qualification | Not adopted
- Preheat the bracket | Impractical on a robot cell with fast cycle times; slows cooling only a little at laser heat inputs | Not adopted
- Weld these brackets by MIG instead | Meets hardness with the existing procedure; more distortion | Kept as the fallback for grade 350
```

A steel with carbon 0.12%, manganese 1.10% and smaller additions gave a CE of 0.326 in the [carbon equivalent tool](/tools/carbon-equivalent/), in its readily weldable band. The re-qualified procedure on that steel measured 290 HV10 in the heat-affected zone. The rule is now written into the procedure: steels for laser-welded parts are ordered with a carbon equivalent no greater than 0.40, checked on the mill certificate at receipt.

## What the W-2 records

Laser welding is a process whose result cannot be fully seen from the outside: penetration, porosity and hardness are inside the seam. The cell's procedure record for each welding program therefore holds the qualification evidence: macro sections showing penetration and fusion, hardness surveys for steels, the gap and position limits proved in trials, and the laser power measured at the work with the puck from Chapter 1 at the start of each week. The robot's program number is printed on each box's traveller, so that any seam can be traced to its settings.

## Exercise: a thinner box at lower power

A small box in 1.2 mm stainless steel is to be welded at 1.5 kW and 2.5 m/min. The alternative is manual TIG at 10 V and 70 A, travelling at 150 mm/min with a process efficiency of 60%. Taking 80% of the laser power as entering the work, compare the two heat inputs, using the welding heat input tool for the TIG figure. By the cell's gap rule of thumb, what is the largest corner gap the laser seam should be expected to bridge without filler?

### Answer

The laser delivers 1,500 W at 2,500 ÷ 60 = 41.7 mm/s, so 1,500 ÷ 41.7 = 36 J/mm, and with 80% entering the work the heat input is 0.0288 kJ/mm.

The welding heat input tool gives the TIG run an arc power of 0.7 kW, an unadjusted arc energy of 0.28 kJ/mm and an efficiency-adjusted heat input of 0.168 kJ/mm. The TIG seam puts 0.168 ÷ 0.0288 = 5.8 times as much heat into the box.

By the rule of thumb of a tenth of the thickness, the largest gap the laser seam should be expected to bridge without filler is 0.12 mm on 1.2 mm sheet. The flat blank should be calculated for the sheet's measured thickness, and the first box of each batch checked with feeler gauges, as for the 1.5 mm boxes.
