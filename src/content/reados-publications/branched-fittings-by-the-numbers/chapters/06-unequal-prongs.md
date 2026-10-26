---
book: branched-fittings-by-the-numbers
chapterSlug: unequal-prongs
order: 6
title: "Unequal prongs"
description: "Develop G4, a breeches to Ø300 and Ø200 prongs: why two cones on one base meet in a plane, formulas for the crotch's feet and peak, both prongs' patterns, and a crotch on the centre line."
draft: false
---

When a breeches divides into two equal prongs, the crotch lies on the plane between them, and symmetry finds it. When the prongs are unequal, there is no plane of symmetry between them, and the crotch could in principle be any curve, twisting through space. If it did, it could be found only point by point, and no flat template could check it. It does not. When both prongs are cones standing on the main's circle, the crotch lies in a plane, and the plane can be found from the fitting's dimensions in two lines of arithmetic.

This chapter develops G4, the FX-4 breeches with unequal prongs. It sets up the two cones, proves that their crotch is flat, gives formulas for the crotch's feet and peak, develops both prongs, and ends with a crotch placed where it would be for equal prongs.

## G4 in coordinates

This is an illustration. The two FX-4 welding bays are different sizes, and the larger bay's hood draws more air. G4 divides the Ø355 main into a Ø300 prong for the larger bay and a Ø200 prong for the smaller. The prongs' combined area is 102,102 mm², 3.2% more than the main's, which the system's designer accepted to keep standard sizes.

The main end is at the origin, square to z. Both prong ends are parallel to it, 400 mm along z, with their centres 300 mm apart: the Ø300 prong at (120, 0, 400) and the Ø200 prong at (−180, 0, 400). The prong ends' near edges are at x = −30 and x = −80, so they stand 50 mm apart. The fitting is symmetric about the plane y = 0, but not about any plane between the prongs.

Each prong is a frustum of an oblique cone through the main circle and its own end, and each cone's apex is found as in Chapter 2.

- **Large prong**, Ø300: k = 150 ÷ 177.5 = 0.8451, 1 − k = 0.1549, and the apex is at (120 ÷ 0.1549, 0, 400 ÷ 0.1549) = **(774.5, 0, 2581.8)**.
- **Small prong**, Ø200: k = 100 ÷ 177.5 = 0.5634, 1 − k = 0.4366, and the apex is at (−180 ÷ 0.4366, 0, 400 ÷ 0.4366) = **(−412.3, 0, 916.1)**.

The large prong tapers gently and its apex is 2.6 m away; the small prong tapers sharply and its apex is less than a metre away. Neither apex needs to be drawn: both prongs are laid out from coordinates.

## Why the crotch is flat

Each cone can be written as an equation. At a height z, the cone's section is a circle whose centre has moved across by the cone's slope times z and whose radius has shrunk in proportion. For a cone through the main circle of radius R and a prong end of radius r centred at c, at length H, the section at height z is a circle of radius R − (R − r) z ÷ H centred at x = c z ÷ H. A point (x, y, z) is on the cone when its distance from that centre equals that radius.

Write the equations for both prongs' cones and subtract one from the other. The terms in x², y² and z² cancel, because both cones have the same circle at z = 0, and what remains is a product of z and an expression that is linear in x and z. Setting it to zero gives two solutions: z = 0, which is the main circle that both cones share, and a **plane**. The rest of the cones' intersection, the crotch, lies in that plane.

The result holds for any two cones standing on the same circle, whatever their apexes, which is why it holds for every breeches in this book whose prong ends are parallel to the main end. It is the most useful fact in branched work. It means that every such crotch can be found from three points, drawn as a flat curve and checked with a flat template.

## The crotch plane by formula

The plane is perpendicular to the plane y = 0, because the fitting is symmetric about that plane, so it is fixed by where it meets the main end, the line through the feet, and by the peak.

```figure
type: formula
title: Crotch of two cones on the main's circle, prong ends parallel
formula: foot = R(r₁ − r₂) ÷ (c₂ − c₁);  peak = 2RH ÷ (d + 2R − r₁ − r₂)
caption: For G4. The prong with radius r₁ and centre c₁ is the large prong; d is the distance between the prong ends' centres, c₁ − c₂.
- R | Main's radius, 177.5 mm
- r₁, c₁ | Large prong's radius and centre, 150 and 120 mm
- r₂, c₂ | Small prong's radius and centre, 100 and −180 mm
- H, d | Length 400 mm; centres 300 mm apart
step: Foot x = 177.5 × 50 ÷ (−300) = −29.6 mm, so the feet are at (−29.6, ±175.0, 0)
step: Peak z = 2 × 177.5 × 400 ÷ (300 + 355 − 250) = 350.6 mm
step: Peak x, on the large prong's inner element at that height = −48.2 mm
```

The crotch plane meets the main end along the line x = −29.6 mm, 29.6 mm towards the small prong from the main's centre, and rises to the peak at (−48.2, 0, 350.6). It leans towards the small prong by 18.6 mm over its 350.6 mm height, an angle of **3.04°** from vertical.

Two features of the formulas are worth noticing. The feet shift towards the smaller prong in proportion to the difference of the prongs' radii; equal prongs have their feet on the centre line, as G2's were. And the peak's height depends only on the spacing of the prong ends and the sum of their radii: G4's 300 mm spacing and radii summing to 250 mm are the same as G2's, so its peak is at the same **350.6 mm**, even though its prongs are different sizes.

## Points on the crotch

The crotch's points, found by following each large-prong element until it enters the small prong's cone, all lie exactly in the plane: the largest distance of any calculated point from it is less than a thousandth of a millimetre.

```figure
type: compare
title: Points on G4's crotch
rowhead: Large-prong element from main-circle point at θ
cols: Crotch point x, y, z | Notes
caption: This is an illustration. Millimetres. Points for negative y are mirror images. The foot is at θ = 99.6°.
- 99.6° | −29.6, 175.0, 0 | foot
- 120° | −37.7, 144.6, 152.7 |
- 150° | −45.6, 78.4, 300.8 |
- * 180° | −48.2, 0, 350.6 | peak
```

## A crotch template for a leaning plane

G2's crotch template stood upright on the main end's centre line. G4's must lean. The template is cut to the crotch's true shape, which is its shape measured in its own plane: across, the y of each point, unchanged; and up, the distance along the leaning plane from the feet line, which is each point's height divided by the cosine of 3.04°.

For G4, the template's points are at (175.0, 0) at the feet, (144.6, 152.9), (78.4, 301.2) and (0, 351.1) at the peak, with the negative-y points mirrored. Its height is 351.1 mm against the crotch's 350.6 mm rise, half a millimetre more, because the plane leans. On a lean of 3°, the difference is small enough to ignore; on a sharply unequal breeches, where the plane may lean 10° or more, it is not.

The template is used with a simple jig. A straight batten is clamped across the main end along the feet line, 29.6 mm towards the small prong from the main's centre, and the template stands on the batten, leaning towards the small prong at 3.04°, set with an angle gauge. The formed prongs are offered up to it from either side.

## When the crotch is not flat

The proof that the crotch is flat depends on both prongs being cones standing on the main's circle, which needs both prong ends to be parallel to the main end. When a prong end is tilted, as in G3 and in Chapter 7's G5, that prong is not a cone, and the proof fails. G3's crotch was still flat, for a different reason: symmetry put it on the plane between two identical prongs. A breeches whose prongs are both unequal and tilted has neither reason, and its crotch is a curve in space.

Chapter 7 develops such a fitting and measures how far its crotch departs from a plane. For many practical fittings the departure is small enough that a flat template is still a useful check, but the crotch's points must then be found by calculation, ruling by ruling, not from the formulas above.

## The two prongs' patterns

Each prong is developed by radial lines from its own apex, exactly as G2's were, with each element running from the main circle, or from the crotch where the element starts inside the other prong, to the prong end.

```figure
type: compare
title: G4's prong elements, by main-circle point
rowhead: θ
cols: Large prong, Ø300: pattern angle and length used | Small prong, Ø200: pattern angle and length used
caption: This is an illustration. Millimetres and degrees. Each prong's pattern angle is measured from its element at θ = 0°. The large prong owns the main circle from −99.6° to 99.6°; the small prong owns the rest.
- 0° | 0°, 410.6 (outer side) | 0°, 58.7 (crotch peak)
- 30° | 2.00°, 411.6 | 4.87°, 88.9
- 60° | 3.96°, 414.6 | 9.66°, 184.8
- 90° | 5.86°, 418.5 | 14.40°, 362.5
- 120° | 7.75°, 261.1 | 19.29°, 429.5
- 150° | 9.65°, 105.4 | 24.54°, 417.4
- * 180° | 11.58°, 52.6 (crotch peak) | 30.10°, 412.9 (outer side)
```

The large prong's whole pattern spans **23.2°** at its distant apex: a long, shallow band. The small prong's spans **60.2°**: a short, steep fan. Their crotch edges have the same length, because they are the two sides of one seam, and the large prong's main edge is longer, because it owns more of the main circle: 199.2° of it against the small prong's 160.8°.

The large prong's area is about 0.307 m² and the small prong's about 0.229 m²; together 0.535 m², about 3.4 kg at 0.8 mm, almost the same as G2's two equal prongs.

## How the main end is shared

The crotch's feet decide how the main end's circle is shared between the prongs, and so where each prong's air enters the main. G4's large prong owns 199.2° of the main circle and the small prong 160.8°: 55% and 45%. The prongs' areas are shared 69% and 31%. The two shares are different, and they need not match: the main end's circle is not a flow divider, and the air redistributes across the main within a short distance. What matters for the flow is that each prong is a smooth taper with no step, which both are.

A designer who wanted the crotch further towards the small prong, perhaps so that the main's centre line passed through the large prong for some reason of layout, would move the prong ends' centres. The foot formula shows that shifting both centres together does not change the foot, because only their difference appears; changing the spacing or the radii does.

## Assembly

G4 is assembled like G2, with the two prongs' seams at the crotch's peak and the crotch seam riveted from foot to foot. Two differences need care. The prongs are not interchangeable, so each pattern is marked with its size before cutting. And the main end's two joints, at the feet, are not opposite each other across a diameter of the main: they are 29.6 mm towards the small prong, on a chord, and the main end's template is marked with the feet line so that the formed fitting can be checked against it.

## The error: a crotch on the centre line

This is an illustration. A worker who had made G2 set out G4 the same way, with the crotch on the main's centre plane, x = 0, and its peak at x = 0, z = 350.6. They had worked out that the peak's height was the same as G2's, which was correct, and assumed that its position was too, which was not.

On the plane x = 0, the two cones do not meet. The large prong's elements were cut off too early, at x = 0, leaving out the strip of the large cone between x = 0 and the true crotch; the small prong's were cut off too late, so it extended past the true crotch into the large prong's region. Formed, the two prongs did not meet along a line: the small prong's edge stood inside the large prong's surface at the feet, 29.6 mm from where it should have been, and the mismatch grew to 48.2 mm at the peak.

It was found at once, when the prongs were offered up together. The patterns were recut from the crotch plane by formula, and the shop added G4's numbers to its job sheet: feet at x = −29.6, peak at (−48.2, 0, 350.6), plane leaning 3.04° towards the small prong.

```figure
type: bars
title: G4's crotch, true position and on the centre line
unit: mm
max: 60
caption: This is an illustration. Distance of the crotch from the main's centre plane, towards the small prong. Putting it on the centre line misplaces it by 29.6 mm at the feet and 48.2 mm at the peak.
- * True, at the feet | 29.6
- * True, at the peak | 48.2
- On the centre line | 0
```

## Exercise: a different pair

Suppose G4's prongs were changed to Ø280 and Ø220, with centres at (150, 0, 400) and (−150, 0, 400). Find the crotch's feet, its peak's height and its peak's x.

**Worked answer.**

- The foot's x is 177.5 × (140 − 110) ÷ (−150 − 150) = **−17.8 mm**, towards the smaller prong.
- The peak's height is 2 × 177.5 × 400 ÷ (300 + 355 − 250) = **350.6 mm**, the same as before, because the spacing is still 300 mm and the radii still sum to 250 mm.
- The peak's x is on the large prong's inner element, from (−177.5, 0, 0) to the large prong end's inner edge at (150 − 140, 0, 400) = (10, 0, 400): at 350.6 ÷ 400 = 0.8765 of the way, x = −177.5 + 0.8765 × 187.5 = **−13.2 mm**.

A smaller difference between the prongs moves the crotch less from the centre line, and it moves both feet and peak in the same direction. With the formulas on the job sheet, a designer can try several pairs of prong sizes in a few minutes and see where each puts the crotch before any pattern is drawn.
