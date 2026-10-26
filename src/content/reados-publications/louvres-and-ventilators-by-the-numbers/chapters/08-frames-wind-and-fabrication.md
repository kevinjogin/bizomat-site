---
book: louvres-and-ventilators-by-the-numbers
chapterSlug: frames-wind-and-fabrication
order: 8
title: "Frames, wind loads, fixing and the cut list"
description: "Check PR-30's blades and mullion for wind, fix the frame to a block wall so it stays there, allow for movement, and produce the cut list and assembly checks for the whole louvre."
draft: false
---

A louvre is a small cladding panel full of holes, and the wind treats it like any other part of the wall. Gusts press on it and suck at it; its blades span between the jambs and mullions like small beams; its mullions span from sill to head; and its frame passes everything into the wall through a handful of fixings. A louvre that has been sized perfectly for airflow and rain can still fail by rattling, bending or simply leaving the wall in a storm.

This final chapter checks PR-30's intake blades and mullion for wind, sizes the frame's fixings into the block wall, allows for thermal movement in the perimeter joint, and assembles everything from the earlier chapters into a cut list and a set of assembly checks. The failure case is a louvre fixed into hollow blockwork with plastic plugs.

## Wind on the louvre

Wind loads on walls come from AS/NZS 1170.2 for the site's wind region, terrain, the building's height and shape and the louvre's position on the wall, with higher local pressures near corners and edges. This book uses a teaching design pressure of **±1.0 kPa** on PR-30's intake louvre, acting both inwards and outwards. A real design takes the pressure from the standard, or from the building's structural engineer, and applies it to the louvre as the louvre maker's tested data or a calculation directs.

The pressure acts on the louvre's face. Each blade collects the pressure from a strip of the face as high as the blade pitch, **100 mm**, and spans horizontally between the jamb and the mullion, **1,125 mm**. The mullion collects the reactions from all the blades on both sides of it, a strip of face **1,125 mm** wide, and spans vertically from sill to head, about **1,500 mm**.

## Checking a blade

Each blade carries a line load of **1.0 kPa × 0.1 m = 0.1 kN/m**, or 0.1 N/mm, along its span. Treated conservatively as simply supported between its clips, its bending moment, stress and deflection follow from the beam formulas.

```figure
type: formula
title: PR-30's intake blade under the teaching wind pressure
formula: M = wL² ÷ 8        σ = M ÷ Z        δ = 5wL⁴ ÷ (384EI)
caption: This is an illustration. The blade's section modulus Z and second moment of area I are teaching values for the 207 mm girth drainable blade in 1.2 mm aluminium, about the axis that resists wind. Real values come from the blade's section properties, calculated or from the maker.
- Line load w | 1.0 kPa × 0.1 m = 0.1 N/mm
- Span L | 1,125 mm, jamb to mullion
- Moment M | 0.1 × 1,125² ÷ 8 ≈ 15,820 N·mm
- Stress σ, with Z = 1,800 mm³ | 15,820 ÷ 1,800 ≈ 8.8 MPa
- Deflection δ, with E = 70,000 MPa and I = 25,000 mm⁴ | about 1.19 mm, span ÷ 944
step: The blade is comfortably stiff and lightly stressed at this span
```

The blade's formed hook and drip lip are what make it stiff. A flat 150 mm strip of 1.2 mm sheet has almost no stiffness about the axis that matters; folded into a shallow channel, it becomes a useful beam. That is one reason drainable blades are formed rather than flat, and why a blade's folds are checked against a stay in the shop (Chapter 2): a blade whose hook is folded short is weaker as well as wetter.

### Why the mullion is there

Without the central mullion, each blade would span the full **2,250 mm** clear width. Its moment would rise with the square of the span, four times, to about **63,300 N·mm**, and its stress to about **35.2 MPa**; its deflection would rise with the fourth power of the span, sixteen times, to about **19.1 mm**, span ÷ 118. Under a gusty wind, a blade deflecting nearly 20 mm would flex back and forth, rattle in its clips and eventually crack at its rivets. The mullion costs one extra member and halves every blade's span.

## Checking the mullion

The mullion collects the blades' reactions from a strip **1,125 mm** wide: half of each bay on either side. Its line load is **1.0 kPa × 1.125 m = 1.125 kN/m**, or 1.125 N/mm, over a span of about **1,500 mm** from sill to head.

```figure
type: compare
title: PR-30's intake louvre members under ±1.0 kPa
cols: Line load and span | Moment | Stress | Deflection
caption: This is an illustration with teaching section properties: blade Z = 1,800 mm³ and I = 25,000 mm⁴; mullion Z = 10,000 mm³ and I = 300,000 mm⁴. The no-mullion row shows why the mullion is there.
- Blade, with mullion | 0.1 N/mm over 1,125 mm | 15,820 N·mm | 8.8 MPa | 1.19 mm, span ÷ 944
- Blade, no mullion | 0.1 N/mm over 2,250 mm | 63,300 N·mm | 35.2 MPa | 19.1 mm, span ÷ 118
- *Mullion | 1.125 N/mm over 1,500 mm | 316,400 N·mm | 31.6 MPa | 3.53 mm, span ÷ 425
```

The mullion is the most heavily loaded member in the louvre and is made from a deeper folded box section than the frame. Its ends must be fixed into the head and sill strongly enough to carry its reactions, about **1.125 × 1,500 ÷ 2 ≈ 844 N** at each end, into the frame and on into the wall. A mullion that simply sits between head and sill, held by a couple of rivets into thin sheet, can tear free at its ends long before it bends.

## Blade clips and rivets

Each blade passes its share of the wind into a clip at each end. At the teaching 1.0 kPa, each end reaction is half the blade's load, **0.1 × 1,125 ÷ 2 ≈ 56 N**; at 1.5 kPa, about 84 N. Shared between two rivets in each clip, that is a few tens of newtons per rivet, far below a rivet's shear capacity. The danger is not strength but repetition. Gusts load and unload the blades thousands of times in a storm, and a clip with one rivet lets the blade rock about it, wearing the hole until the blade rattles. PR-30's clips each take two rivets into the blade and two into the jamb channel, spaced as far apart as the clip allows, so the blade cannot pivot on a single fastener. The rivets are aluminium with stainless mandrels, compatible with the blades and the frame.

## Finish and fabrication order

PR-30's louvre is powder coated after fabrication, so that every cut edge, rivet head and fold is coated. That fixes the order of work: cut, fold, punch drain slots and clip holes, assemble dry on the bench to check fit, take apart, coat, then rivet together. Coating a part that will later be drilled or cut exposes bare metal at the hole; drilling after coating is avoided, and any unavoidable site hole is touched up with the coater's repair paint. Pre-coated coil can be used instead for the blades, with the cut ends hidden in the jamb channels; it saves the coater's charge but needs care in handling, because a scratched pre-coated blade cannot be recoated alone.

The coating also changes the fit. A powder coat adds thickness to every surface, so the blade clips are made with enough clearance that a coated blade still slides into a coated clip without scraping its finish off. The shop allows for the coater's typical film thickness on both parts when it sets the clip's internal width.

## Fixing the frame to the wall

The whole louvre's wind load must pass through its frame into the wall. On PR-30's 3.6 m² face at 1.0 kPa, that is **3.6 kN**, inwards or outwards. The frame is fixed around its **7,800 mm** perimeter at about **400 mm** centres, about **20** fixings, so each carries roughly **3,600 ÷ 20 = 180 N**. Fixings near the mullion's ends carry more, because the mullion delivers its reactions there, so an extra fixing is placed at each mullion end, into the head and sill.

The wall decides what fixing can carry 180 N. PR-30's wall is concrete block. In hollow block, an anchor's capacity depends on whether it reaches solid material; plastic plugs in the thin shell of a hollow block hold little and can pull out under repeated gusts. PR-30's block cores around the opening were filled with grout when the wall was built, on the structural engineer's lintel and opening detail, and the frame is fixed with stainless anchors into the grouted cores, at edge distances and embedments the anchor maker publishes for grouted block. The anchor capacities, with the appropriate factors, comfortably exceed the 180 N demand; checking that is the engineer's job, and the louvre shop's job is to supply a fixing schedule that says where each fixing goes.

## Movement and the perimeter joint

The louvre's aluminium frame moves with temperature, as Chapter 7 of *Roof Lights by the Numbers* shows for a roof light frame. On a wall it sees a smaller range than a roof light; this book uses **50 K**. The 2,400 mm head and sill grow by about **23 × 10⁻⁶ × 2,400 × 50 ≈ 2.76 mm** over that range. With the frame fixed so that it can slide on slotted holes from a fixed point at mid-length, each end moves about **1.38 mm**.

The gap between the frame and the block reveal is sealed with a sealant joint over a backing rod. For a sealant rated at ±25% movement, the joint must be at least **1.38 ÷ 0.25 ≈ 5.5 mm** wide; PR-30's joint is **10 mm**, which also allows for the opening's own tolerances. The sill flashing laps under the frame and is sealed to the reveal with the same joint, with its stop-ends turned up behind the jamb seals so that water on the sill cannot reach the joint's ends.

## The cut list

Everything in the earlier chapters ends in a list the shop can cut from:

```figure
type: checklist
title: Cut list for PR-30's intake louvre, 2,400 × 1,500 mm
caption: This is an illustration. Quantities include the number of blanks across the coil and the spares, so the list is also the material order. Lengths are cut sizes.
- x Frame head and sill | 2 × 2,400 mm, folded channel, 1.6 mm aluminium
- x Frame jambs | 2 × 1,500 mm, with drain channels for the blades' gutters
- x Mullion | 1 × 1,400 mm, folded box section, with end fixing plates
- x Blades | 28 × 1,121 mm, girth 207 mm, 1.2 mm aluminium; 6 strips of 5 blanks from 1,200 mm coil, 2 spare
- x Blade clips | 56, folded at 45°, set out from one datum at the sill
- x Sill flashing | 1 × 2,500 mm, girth 225 mm: 50 back upstand, 150 sloping sill, 15 drip, 10 hem; 2 stop-ends
- x Bird mesh panels | 2, framed, 12 mm aperture, 1.6 mm stainless wire, removable
- ? Fixing schedule | 20 anchors at about 400 mm centres plus 2 at the mullion ends, into grouted cores
```

The blades weigh about 21 kg, the frame and mullion about 6 kg, and the mesh panels a few kilograms more: the louvre is a two-person lift, which also decides that it is installed from inside the plant room, not from a ladder outside.

### The louvre's record

The cut list is filed with the louvre's design record: the airflow and heat load from Chapter 1, the free area and blade geometry from Chapter 2, the pressure budget from Chapter 3, the rain class and drainage plan from Chapter 4, the mesh and cleaning plan from Chapter 5, the wind pressure and fixing schedule from this chapter. When the owner adds a bigger dryer, as in the exercise to Chapter 1, the record shows in minutes which numbers change and whether the louvre still works, instead of starting again from a site measure and a guess.

## Assembly checks

Before it leaves the shop, PR-30's louvre is checked:

- **square**: its diagonals, about **2,830.2 mm** each, equal within 3 mm;
- **blade gaps**: the net gap gauge from Chapter 2 passes every gap in both bays;
- **blade angles**: 45° on every fifth blade, by protractor;
- **orientation**: OUTSIDE stencilled on each jamb, with an arrow pointing up;
- **drains**: water poured into each blade gutter runs to the jamb channels and out at the sill;
- **mesh**: tight, and removable without tools.

On site, it is checked again for plumb and level after fixing, the perimeter joint is sealed, and the hose test from Chapter 4 is run with the tray in place.

## A failure case: plastic plugs in hollow block

This is an illustration. On an earlier plant room, a louvre of similar size was fixed into the hollow cores of an ungrouted block wall with plastic plugs and screws at 600 mm centres, because they were in the installer's van. No fixing schedule had been issued.

During a severe storm the following winter, gusts sucking on the louvre's face pulled the top fixings out of the block shells, and the louvre's head leaned outwards about 30 mm, held only by its sill fixings and the sealant. Rain then ran freely through the gap at the head. The detection came the next morning from the gap and the water on the floor.

The correction was to remove the louvre, grout the cores around the opening, refix the frame with anchors rated for grouted block at 400 mm centres, with extra fixings at the mullion ends, and reseal. The shop now issues a fixing schedule with every louvre, stating the wall type it assumes, and asks the builder to confirm the wall before installation.

## How this applies to a small Australian business

Get the wind pressure for the louvre's position from the loading standard or the structural engineer. Check the blades as beams between their supports, and use mullions to keep their spans short, because deflection grows with the fourth power of span. Check the mullion and its end fixings. Size the frame's fixings for the whole face's wind load, into the wall as it actually is, with a fixing schedule. Allow for thermal movement with slotted fixings and a properly sized sealant joint. Produce a cut list that is also a material order, and check the louvre for square, gaps, angles, orientation and drainage before it leaves the shop.

## Exercise: a gustier site

PR-30's owner builds a second plant room on an exposed corner of the site, where the engineer gives a design pressure of **±1.5 kPa** for a louvre of the same design. What are the blade's moment and stress now? What does each of the 20 perimeter fixings carry? Does the mullion's deflection stay below span ÷ 300?

**Worked answer.** The blade's line load becomes **1.5 × 0.1 = 0.15 N/mm**, its moment **0.15 × 1,125² ÷ 8 ≈ 23,730 N·mm**, and its stress **23,730 ÷ 1,800 ≈ 13.2 MPa**, still low. The face load is **1.5 × 3.6 = 5.4 kN**, so each of the 20 fixings carries about **270 N**, and the anchor capacities must be rechecked. The mullion's deflection scales with the pressure, from 3.53 mm to about **5.3 mm**, span ÷ 283, which no longer meets span ÷ 300; a stiffer mullion section, or a second mullion that halves the bays, would be chosen.
