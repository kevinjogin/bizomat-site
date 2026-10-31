---
book: buckling-by-the-numbers
chapterSlug: slenderness-and-section-shape
order: 3
title: "Slenderness and the shape of the section"
description: "Why the radius of gyration, not the area, decides how well a section resists buckling: tubes, angles, channels, bars and flats of the same mass compared, and the least axis that governs."
draft: false
---

Two compression members of the same steel and the same mass per metre can differ in buckling load by a factor of a hundred. The difference is entirely in how the steel is arranged in the cross-section. Steel placed far from the section's centre resists bending, and so buckling, far better than steel bunched at the middle. The measure of how well a section does this is its radius of gyration, and the slenderness ratio built from it, K × L ÷ r, is the single most useful number in compression design.

This chapter compares the sections a fabricator might use for HT-8's legs, all of about the same weight per metre, shows how to find the radius of gyration about the axis that actually governs, and works through the error that catches people with angles: using the wrong axis.

## The radius of gyration

Chapter 1 wrote the Euler stress as π² × E ÷ (L ÷ r)², where r = √(I ÷ A). The radius of gyration r is the distance from the centroid at which the whole area, if concentrated in a thin ring, would give the same second moment of area. A section with its material spread out has a large r for its area; a compact section has a small one.

Because the Euler stress depends only on E and the slenderness, two members with the same slenderness buckle at the same stress, whatever their size. That makes the slenderness ratio a universal scale. For structural steel:

```figure
type: compare
title: Euler stress of steel at different slenderness ratios
cols: Euler stress, MPa | Share of a 350 MPa yield
rowhead: Slenderness K × L ÷ r
- 50 | 790 | above yield: the member yields first
- 100 | 197 | 56%
- 150 | 87.7 | 25%
- 200 | 49.3 | 14%
- 250 | 31.6 | 9%
- 300 | 21.9 | 6%
caption: E = 200,000 MPa. Below a slenderness of about 106 for a 350 MPa steel, the Euler stress exceeds the stress at which the steel starts to yield in compression, and Chapter 4's inelastic formulas apply instead.
```

A slender member wastes the strength of its steel. At a slenderness of 200 a C350 member buckles at 14% of its yield stress, so 86% of the strength that was paid for is never used. The cure is not a stronger steel. It is a section with a larger radius of gyration, or a shorter effective length.

## Same mass, different shapes

This is an illustration. Before settling on CHS 76.1 × 3.6 for HT-8's legs, the shop's engineer compared it with five other sections of about the same mass per metre that the shop could buy. All are taken in grade C350 steel for the comparison, so that only the shape differs, and each is checked on the 2,000 mm braced segment and the full 4,000 mm as pinned struts.

```figure
type: compare
title: Sections of about 6.3 to 8.2 kg/m as HT-8 legs
cols: Area, mm² | Mass, kg/m | Least r, mm | Buckling load on 2,000 mm, kN | Buckling load on 4,000 mm, kN
rowhead: Section
- * CHS 76.1 × 3.6 | 820 | 6.44 | 25.66 | 209.7 | 66.6
- SHS 75 × 75 × 3.0, sharp corners | 864 | 6.78 | 29.42 | 240.5 | 92.3
- Equal angle 75 × 75 × 6, about its weakest axis | 864 | 6.78 | 14.82 | 93.7 | 23.4
- Channel 100 × 50, 6 mm flanges, 5 mm web, minor axis | 1,040 | 8.16 | 15.64 | 125.6 | 31.4
- Solid round bar 32 mm | 804 | 6.31 | 8.00 | 25.4 | 6.4
- Flat bar 100 × 8 | 800 | 6.28 | 2.31 | 2.1 | 0.5
caption: This is an illustration. Pinned ends, E = 200,000 MPa, yield 350 MPa, built-up properties without root radii. The angle and channel are checked about their weakest axis only; they can also twist as they buckle, which this table does not cover.
```

The table makes the point more strongly than any formula. The flat bar and the tube contain almost the same amount of steel, yet on the 4,000 mm length the tube carries more than a hundred times as much before buckling. The flat bar's material sits within 4 mm of its weak axis; the tube's sits on average about 36 mm from its centre in every direction.

The hollow sections, round and square, are the clear winners for a member that can buckle in any direction. They have the same or nearly the same stiffness about every axis, so there is no weak axis to find, and their material is all at the outside. The square tube in the table edges ahead of the round one only because it is slightly heavier and its sharp-cornered properties are slightly flattering; a rolled square tube has rounded corners and a little less stiffness than this simple model gives.

### Measuring a section's efficiency

A useful way to compare sections is the buckling load per kilogram per metre. On the 4,000 mm length:

```figure
type: bars
title: Buckling load on 4,000 mm per kg/m of section
unit: kN per kg/m
caption: This is an illustration. Buckling loads from the comparison table divided by mass per metre. Hollow sections are three to four times as efficient as open sections of the same mass, and more than a hundred times as efficient as a flat bar.
- SHS 75 × 75 × 3.0 | 13.6
- * CHS 76.1 × 3.6 | 10.35
- Channel 100 × 50 | 3.84
- Equal angle 75 × 75 × 6 | 3.45
- Solid round bar 32 mm | 1.01
- Flat bar 100 × 8 | 0.08
```

There are limits to spreading the material out. A tube with a very thin wall for its diameter can buckle locally, its wall crinkling into small waves before the member as a whole bows. CHS 76.1 × 3.6 has a diameter-to-thickness ratio of 21, which is stocky; ratios in the high double figures need a local buckling check, and very thin-walled tubes and shells are the subject of Chapter 9.

## Finding the least axis

Every section has two principal axes through its centroid: one about which its second moment of area is greatest and one about which it is least. A member that is free to buckle in any direction buckles about the least axis.

For symmetric sections the principal axes are the obvious ones. A channel's weak axis is parallel to its web, and its minor-axis radius of gyration, 15.64 mm for the channel in the table, is less than half the major-axis value of 39.36 mm. An I-section's weak axis runs through its web.

For an angle, the principal axes are not the axes parallel to its legs. They lie at 45° to the legs for an equal angle: the strong axis runs along the line of symmetry, through the heel and the centroid, and the weak axis crosses it at right angles through the centroid. Buckling about the weak axis moves the heel towards or away from the leg tips. The radius of gyration about the weak axis is much smaller than the value about either leg.

```figure
type: svg
title: The axes of an equal angle
alt: An equal angle is drawn in section, with one leg vertical and one horizontal. Two dashed lines through its centroid run parallel to the legs and are labelled x and y. Two solid lines at 45 degrees through the centroid are labelled u and v. The u axis runs from the heel at the corner out through the centroid, along the angle's line of symmetry, and is the strongest. The v axis crosses it at right angles through the centroid and is marked as the weakest.
caption: For an equal angle the rectangular axes x and y have the same stiffness, but the principal axes are at 45°. The strong axis u lies along the line of symmetry through the heel; buckling happens about v, at right angles to it, where the radius of gyration is least.
viewbox: 0 0 640 320
body:
<path class="bxa" d="M200 40H230V260H200ZM230 230H420V260H230Z"/>
<circle class="fa" cx="254" cy="206" r="5"/>
<path class="ln dsh" d="M140 206H470"/>
<path class="ln dsh" d="M254 20V300"/>
<path class="la draw" pathLength="1" d="M134 86L374 326"/>
<path class="la draw" pathLength="1" d="M144 316L384 76"/>
<text class="txb" x="476" y="210">x</text>
<text class="txb" x="260" y="18">y</text>
<text class="txb" x="388" y="74">u, strongest</text>
<text class="txb" x="60" y="78">v, weakest</text>
<text class="tx txs" x="440" y="270">r about x or y: 23.29 mm</text>
<text class="tx txs" x="440" y="290">r about v: 14.82 mm</text>
```

The WORKOS [Section properties: I, T, channel and angle](/tools/section-shapes/) tool builds a section from rectangles and reports its area, mass per metre, centroid, second moments of area about the rectangular axes, the principal second moments, section moduli, radii of gyration about the rectangular axes and the least radius of gyration. For the 75 × 75 × 6 angle, entered as an angle with 75 mm legs and 6 mm thicknesses, it gives an area of 864 mm², second moments about the rectangular axes of 468,827 mm⁴, principal values of 747,792 and 189,862 mm⁴, and a least radius of gyration of 14.82 mm. The tool ignores the root and toe radii of rolled sections, so for a section bought from a mill the maker's tables are slightly different and should be used for design.

For simpler shapes, the WORKOS [Section properties](/tools/section-properties/) tool gives the area, second moments of area, section moduli and radii of gyration of a solid rectangle, a sharp-cornered rectangular tube, a solid circle or a circular tube. Entered as a circular tube with a 76.1 mm outside diameter and a 3.6 mm wall, it reports the leg's area of 820 mm², second moment of 540,065 mm⁴ and radius of gyration of 25.66 mm, the figures used throughout this book. It does not calculate any load capacity: it supplies the numbers the buckling tools need.

### Different lengths about different axes

A member does not always have the same effective length about both axes. A channel used as a wall-mounted column might be held by girts against movement across its weak axis every 2,000 mm, while it can bow about its strong axis over its full 4,000 mm. Each axis then has its own slenderness, and the larger one governs.

This is an illustration. For the 100 × 50 channel in the comparison table, the strong-axis slenderness over 4,000 mm is 4,000 ÷ 39.36 = 101.6, and the weak-axis slenderness over 2,000 mm is 2,000 ÷ 15.64 = 127.9. The weak axis still governs, even with half the length, because its radius of gyration is less than half the strong-axis value. Only when the weak-axis restraints are closer than about 4,000 × 15.64 ÷ 39.36 = 1,590 mm does the strong axis take over. This is the reason girts and fly braces are placed where they are: their spacing is chosen so that the two slenderness ratios are roughly balanced, and no steel is wasted resisting the axis that does not govern.

### Members that twist as they buckle

Open sections with low torsional stiffness, especially angles, tees and channels, can buckle by twisting or by a combination of bending and twisting, at loads lower than the bending-only Euler load about the weak axis. A single angle loaded through one leg, as in a bolted brace, is also loaded off its centroid, which adds bending. Neither effect is in the simple formulas of this book or in the WORKOS tools. Where open sections are used as compression members, the governing steel design code's methods, which include these effects, are needed. Closed hollow sections are very stiff in torsion and are not troubled by twisting modes, another reason they suit HT-8's legs.

## The error: the wrong radius for an angle

This is an illustration. Late in the design, the plant asked whether galvanised angles could be used for the legs instead of tubes, because angles were easier to bolt to the plant's existing platform steel. An estimator checked a 75 × 75 × 6 equal angle on the 2,000 mm braced segment.

The estimator took the radius of gyration about an axis parallel to one leg, 23.29 mm, from a quick calculation. That gave a slenderness of 85.9, a Johnson buckling load of 203.6 kN and a factor of 10.35. The angle looked almost as good as the tube.

The checker asked one question: "About which axis does an angle buckle?" Using the least radius of gyration, 14.82 mm, the slenderness is 134.9, the member buckles elastically, and the buckling load is 93.7 kN: a factor of 4.76, less than half the estimator's figure. On the full 4,000 mm, which would apply if the mid-height struts were ever removed for access, the factor would be 1.19.

```figure
type: compare
title: The angle leg checked about two axes, 2,000 mm braced segment
cols: Radius of gyration, mm | Slenderness | Mode | Buckling load, kN | Factor
rowhead: Axis used
- Parallel to a leg (wrong) | 23.29 | 85.9 | Johnson | 203.6 | 10.35
- * Weakest principal axis, v | 14.82 | 134.9 | Euler | 93.7 | 4.76
caption: This is an illustration. 75 × 75 × 6 angle, area 864 mm², yield 350 MPa for comparison. The correct check is about the weakest axis, and even then a twisting or eccentric-load check of the angle is still needed.
```

The angle option was dropped. Even with the correct axis, it was less efficient than the tube, and a proper check would also have had to deal with the angle's eccentric connection and possible twisting. The shop added a line to its check template: "Open sections: state which axis, and give the least r."

## Choosing a section for a compression member

The comparison suggests a short procedure the shop now uses for any new compression member:

1. Decide the effective length in each direction (Chapter 2). If it differs by direction, as it does for a member braced on one axis only, the section's two radii of gyration should differ in the same ratio.
2. Choose a target slenderness. For a main member, keeping K × L ÷ r below about 120 to 150 keeps the member reasonably efficient and not too floppy to handle and erect.
3. Divide the effective length by the target slenderness to get the radius of gyration needed.
4. Choose the lightest available section with at least that radius of gyration about its least axis, preferring closed sections where the member can buckle in any direction.
5. Check the buckling load with the actual properties, and check local buckling if the walls are thin.

For HT-8's legs, an effective length of 4,000 mm and a target slenderness of 150 give a radius of gyration of 26.7 mm. CHS 76.1 × 3.6, with 25.66 mm, is just short of that target, and CHS 88.9 × 3.2, with 30.32 mm, comfortably meets it. With the mid-height struts halving the effective length to 2,000 mm, the target falls to 13.3 mm and the 76.1 mm tube is more than enough. Either way, the struts must be there for the 76.1 mm tube to work as chosen.

## Exercise: a lighter, larger tube

This is an illustration. The steel supplier offers CHS 88.9 × 3.2 at a similar price per kilogram to the 76.1 × 3.6 the shop chose.

1. What are its area, second moment of area, radius of gyration and mass per metre?
2. As a pinned strut 4,000 mm long, what are its slenderness, buckling load and factor on the 19.7 kN leg load?
3. Compare its mass and buckling load with CHS 76.1 × 3.6 on the same 4,000 mm length.
4. What is its diameter-to-thickness ratio, and what extra check does that suggest?

**Worked answer.**

1. Inside diameter 82.5 mm. A = π × (88.9² − 82.5²) ÷ 4 = **861.6 mm²**; I = π × (88.9⁴ − 82.5⁴) ÷ 64 = **792,059 mm⁴**; r = √(792,059 ÷ 861.6) = **30.32 mm**; mass 861.6 × 7,850 ÷ 10⁶ = **6.76 kg/m**.
2. Slenderness 4,000 ÷ 30.32 = **131.9**, above the transition of 106.2, so Euler governs: σ_E = π² × 200,000 ÷ 131.9² = 113.4 MPa, P_E = 113.4 × 861.6 = **97.7 kN**, factor 97.7 ÷ 19.7 = **4.97**.
3. The larger tube is 5% heavier (6.76 against 6.44 kg/m) and has a 47% higher buckling load on 4,000 mm (97.7 against 66.6 kN). Spreading the steel further from the centre pays.
4. D ÷ t = 88.9 ÷ 3.2 = **27.8**, still a stocky tube, but a little thinner than the 21.1 of the chosen leg. Local buckling is not a concern at this ratio, but the thinner wall is more easily dented in handling, and a dent acts as a local imperfection. A quick visual check for dents before erection is worth adding to the inspection list (Chapter 11).
