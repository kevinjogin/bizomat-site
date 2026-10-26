---
book: plate-work-by-the-numbers
chapterSlug: rings-stiffeners-and-flanges
order: 7
title: "Rings, stiffeners and flanges"
description: "Roll a 75 × 75 × 6 angle into a ring on its centroid, not its back: length, toe and heel strains, toe-out against toe-in, splices, bolt circles on the outlet flange, and a ring cut 132 mm short."
draft: false
---

A rolled section bends about its own neutral axis, which for a section is its centroid. Rolling a flat plate puts the centroid at mid-thickness, and the mean line handles it. Rolling an angle, a channel or a flat bar on edge puts the centroid somewhere that is not obvious from the drawing, and the length to cut is the length of that line, not of the face that touches the shell. Get it wrong and the ring is short by the girth of a circle whose radius is the centroid's distance from the face, which for a 75 mm angle is over 130 mm.

This chapter rolls the running case's stiffening ring, a 75 × 75 × 6 equal angle around the top of the shell, works out its length and the strains in its legs, compares rolling it toe out and toe in, places its splice, and sets out the bolt circle on the hopper's outlet flange. It ends with a ring cut to the length of the shell it was to fit.

## What the ring does and where it goes

This is an illustration. The bin's shell is open at the top except for a flat roof, and the designer has specified a 75 × 75 × 6 equal angle ring around its top edge to keep the shell round and stiffen the roof's edge. The angle sits with one leg vertical against the outside of the shell, its back to the shell, and the other leg horizontal, pointing outward. In shop language, it is rolled **toe out**: the free edge of the horizontal leg, the toe, is on the outside of the ring.

The shell's outside radius is 1,206 mm, so the back of the angle's vertical leg lies on a radius of 1,206 mm.

Rings appear elsewhere on plate structures for the same reasons: an intermediate ring partway down a tall shell to resist wind or vacuum, a heavy ring at a cone-to-shell junction to carry the inward pull of the hopper, rings at support points to spread leg loads into the shell. Their sizes and positions are the designer's. Their lengths, strains and splices are the fabricator's, and every one of them is worked out on its section's centroid exactly as the top ring is below.

## The centroid of the angle

The ring is bent about a vertical axis, the bin's axis. The bending moves each part of the section by its radial distance from the centroid, so the centroid that matters is measured radially, outward from the back of the vertical leg.

With sharp corners, a 75 × 75 × 6 angle is a vertical leg of 75 × 6 mm and a horizontal leg of the remaining 69 × 6 mm. Measured outward from the back of the vertical leg:

- the vertical leg's area is 450 mm², its centroid 3 mm out;
- the horizontal leg's area is 414 mm², its centroid 6 + 69 ÷ 2 = 40.5 mm out.

The section's centroid is (450 × 3 + 414 × 40.5) ÷ 864 = **20.97 mm** from the back. A real rolled angle has a radius at its root and rounded toes, and published section tables give its centroid allowing for them; the value differs a little from the sharp-corner figure. The shop uses its supplier's table value for production and the sharp-corner figure for teaching and checking. The WORKOS [section properties calculator](/tools/section-properties/) gives the centroid of any built-up section.

```figure
type: formula
title: Length of an angle rolled into a ring
formula: c = Σ(A × x) ÷ ΣA        L = 2π × (R_back + c)
caption: The running case's 75 × 75 × 6 angle, sharp corners, rolled toe out with its back on the shell's 1,206 mm outside radius.
- c | Distance of the centroid from the back of the leg against the shell
- R_back | Radius of the back of that leg, 1,206 mm
- L | Length of angle along its centroid, the length to cut before splicing
step: c = (450 × 3 + 414 × 40.5) ÷ 864 = 18,117 ÷ 864 = 20.97 mm
step: Centroid radius = 1,206 + 20.97 = 1,226.97 mm
step: L = 2π × 1,226.97 = 7,709.3 mm
step: Back of the leg after rolling: 2π × 1,206 = 7,577.5 mm, 131.8 mm shorter than the centroid line
```

## Strains in the legs

Every fibre of the section moves from straight to a circle, and its strain is its distance from the centroid divided by the centroid's radius. The toe, 75 mm from the back and therefore 75 − 20.97 = 54.03 mm outside the centroid, is stretched by 54.03 ÷ 1,226.97 = **4.4%**. The back, 20.97 mm inside the centroid, is compressed by 20.97 ÷ 1,226.97 = **1.7%**.

A 4.4% stretch is well within what structural angle can take when rolled evenly, but it is large compared with the 0.25% of the shell plate. The ring yields fully through most of the section, so it springs back much less than the shell did, and it is rolled on a section bender with rolls shaped to hold the legs, checked against a template of the shell's outside radius on the back of the vertical leg.

```figure
type: bars
title: Strain in the angle's fibres, rolled toe out on the shell
unit: %
max: 5
caption: Positive values are stretch, negative compression, shown here as magnitudes. Toe out puts the larger strain in tension at the toe, which the leg tolerates; toe in puts it in compression, where the leg can buckle.
- * Toe, stretched, toe out | 4.4
- Back, compressed, toe out | 1.7
- Toe, compressed, toe in | 4.6
- Back, stretched, toe in | 1.8
```

## Toe out and toe in

The same angle could be rolled **toe in**, with its vertical leg against the inside of the shell and its horizontal leg pointing inward, as some tank designs use. Then the back lies on the shell's inside radius of 1,200 mm and the centroid is inside it, at 1,200 − 20.97 = 1,179.03 mm. The ring's centroid length is 2π × 1,179.03 = 7,408.1 mm, and the toe, now at 1,125 mm, is compressed by 4.6%.

Compression in a thin outstanding leg is the hard case. The leg wants to buckle sideways into waves, and a section bender needs guide rolls bearing on the leg to stop it. Toe-out rings are easier to roll well, which is one reason designers prefer them where the structure allows. Whichever is specified, the length is always taken on the centroid, and the centroid is on the toe side of the back.

## Flat bar rings

Flat bar makes the point plainly. A 100 × 10 mm flat bar can be rolled two ways around the shell.

**Flat**, as a band lying on the shell's surface, it bends about its thin dimension. Its centroid is 5 mm from the shell, at a radius of 1,211 mm; its length is 2π × 1,211 = **7,608.9 mm**; and its strains are only ±5 ÷ 1,211 = 0.4%, like a thin shell plate.

**On edge**, standing out from the shell like a flange, it bends about its 100 mm dimension. Its centroid is 50 mm out, at 1,256 mm; its length is 2π × 1,256 = **7,891.7 mm**; and its edges are strained by ±50 ÷ 1,256 = **4.0%**. Rolling flat bar on edge needs a section bender and guides, and is limited in how tight a radius it can reach for a given width.

The two rings differ in length by 282.8 mm, all of it from where the centroid sits.

## The splice

Structural angle comes in stock lengths, and a 7.7 m ring fits in one length of 9 m angle (an illustration), with a single splice. The splice is a full penetration butt weld across the section, as the drawing details it, and its position is chosen like a shell seam's: clear of the upper course's vertical seams at 135° and 315°, clear of the roof's inlet and of any lifting lugs. The running case puts it at 225°, 90° from each upper-course seam.

Each end of the angle is left straight for a short length by the section bender, just as plate ends are, so the shop rolls a length longer than it needs and cuts the flats off after rolling. The ring is then cut to its final length by fitting it around the shell: closed tightly with its back against the shell's outside and marked at the splice. Rolling to a calculated length and cutting afterwards by fitting is safer than cutting to length first, because the section's real centroid, its springback and the shell's real diameter all vary a little from the calculation.

## Checking a rolled ring

A rolled ring can be the right length and still be wrong in three ways, and each has a simple check on the shop floor.

1. **Radius.** A template cut to the shell's outside radius, 1,206 mm, is held against the back of the vertical leg at several points around the ring. Gaps show where the ring is too flat or too tight, read through the same sagitta relation as Chapter 3: on a 1,000 mm chord, about 10 mm of radius per millimetre of gap.
2. **Flatness.** Laid on a flat floor, toe down, the ring should touch all round. A section bender that is not set square tends to roll a slight helix, so that the ring's ends at the splice sit one above the other. A helix of more than a few millimetres makes the ring stand off the shell unevenly and must be corrected in the bender, not pulled flat at fit-up.
3. **Leg angle.** The 90° between the legs can open or close during rolling, especially toe in. A square checked at several points shows it. A toe-out leg that has opened by a degree or two sits slightly off horizontal, which matters if the roof is to bear on it.

The ring is checked before the splice is welded, while its ends can still be adjusted, and again after welding, because the splice weld's shrinkage pulls the ring tighter around the shell, often helpfully.

The WORKOS [ring length calculator for angle or bar](/tools/angle-ring-length/) repeats this chapter's arithmetic for other sections and radii, and is a quick independent check on a hand calculation before any section is cut.

## The outlet flange and its bolt circle

The hopper's outlet is a Ø400 opening in the 8 mm cone, which the conveyor or slide gate below bolts to through a flat flange ring welded to the cone's bottom edge. This is an illustration. The flange is 8 mm plate, 560 mm outside diameter, with 12 holes on a 500 mm pitch circle.

Its inside diameter must clear the cone's outside at the outlet. The cone's outside surface lies 8 ÷ cos 30° = 9.24 mm outside its inside surface horizontally, so at the outlet its outside diameter is 2 × (200 + 9.24) = 418.5 mm, and the flange's bore is made 420 mm to slip over it.

The 12 holes are 30° apart. Set out with dividers, their spacing is the chord 500 × sin 15° = **129.41 mm**, and the WORKOS [bolt circle calculator](/tools/bolt-circle/) gives each hole's coordinates. The holes straddle the flange's centre lines, as is usual practice, so that no hole sits on a centre line; the matching flange on the equipment below must follow the same convention, and the shop checks the mating drawing before drilling.

The flange weighs π ÷ 4 × (0.560² − 0.420²) × 0.008 × 7,850 = **6.8 kg**. Its 560 mm outside diameter does not fit in the 345 mm strip left beside the cone segments on their 8 mm sheet, which Chapter 8 deals with.

## The error: a ring cut to the shell's girth

This is an illustration. The first angle was cut to 7,577.5 mm, the outside girth of the shell, by a fitter who reasoned that the ring must go around the shell, so it must be the shell's length. It was rolled, and it would not close around the shell by a long way.

The rolled ring's centroid kept its 7,577.5 mm length, so the centroid lay on a radius of 7,577.5 ÷ 2π = 1,206.0 mm, where the back should have been. The back was 20.97 mm inside that, on a radius of 1,185.0 mm, and its girth was 7,445.7 mm, **131.8 mm short** of the shell's outside girth. The gap at the splice was over 130 mm.

The fault was found at the trial fit and the angle was scrapped, because 132 mm of angle cannot be added to a ring except with an extra splice that the drawing did not allow. The ring was recut from a fresh length on its centroid, 7,709.3 mm plus the flats at each end, rolled and fitted. The shop's ring checklist now starts with the section's centroid, written down before any length.

```figure
type: checklist
title: Before cutting a section for a ring
caption: The checks that would have caught the short ring.
- Section's centroid found from the supplier's table, measured from the face that touches | 20.97 mm by sharp corners
- Ring length taken on the centroid radius | 7,709.3 mm
- Toe out or toe in confirmed from the drawing | toe out, toe stretched 4.4%
- Extra length added for the bender's straight ends | cut off after rolling
- Splice position clear of shell seams and openings | 225°
- x Ring cut to the shell's girth | 131.8 mm short at the back
```

## Exercise: a channel ring

A 100 mm deep channel, with flanges 50 mm wide and 6 mm thick and a 6 mm web, is to be rolled into a ring with its web flat against the outside of the running case's shell and its flanges pointing outward. Taking sharp corners, find the centroid's distance from the back of the web, the ring's length on its centroid, and the strain at the flange tips.

**Worked answer.** Split the channel into the web, 100 × 6 mm, and two flanges, each 44 × 6 mm beyond the web.

- Web: area 600 mm², centroid 3 mm from the back.
- Each flange: area 264 mm², centroid 6 + 22 = 28 mm from the back.
- Centroid: (600 × 3 + 2 × 264 × 28) ÷ (600 + 528) = (1,800 + 14,784) ÷ 1,128 = **14.70 mm** from the back.
- Ring length: 2π × (1,206 + 14.70) = **7,669.9 mm**.
- Flange tips, 50 mm from the back and 35.30 mm outside the centroid: strain 35.30 ÷ 1,220.70 = **2.9%** in tension.

The channel rolled flanges out has its centroid closer to the shell than the angle does, because two of its three parts lie against the shell, and its tips are strained less.
