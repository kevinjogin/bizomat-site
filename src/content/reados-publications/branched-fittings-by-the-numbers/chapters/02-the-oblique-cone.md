---
book: branched-fittings-by-the-numbers
chapterSlug: the-oblique-cone
order: 2
title: "The oblique cone"
description: "Find an oblique cone's apex from its two circles, calculate its elements from coordinates, lay out its pattern by radial lines through a 120.21° fan, and catch a right-cone formula applied to it."
draft: false
---

A right cone, the cone of a reducer or a funnel, has its apex directly above the centre of its base, and every line from the apex to the base, every **element**, has the same length. Its pattern is a sector of a circle, drawn with one radius and one angle. Move the apex sideways, so that it is no longer over the base's centre, and the cone becomes **oblique**. Its base is still a circle and its elements are still straight, but they are all different lengths, and its pattern is no longer a sector.

Oblique cones are the building blocks of branched fittings, so this chapter treats one carefully, step by step. It takes the G1 wall hood, finds its cone's apex from the hood's two circles, calculates the elements from coordinates, lays out the full cone's pattern by radial lines, and ends with a right-cone formula applied to an oblique cone.

## G1, the wall hood

This is an illustration. Each FX-4 welding bay has a hood on its back wall, over the welding bench. The hood's skirt, at its bottom, is a circle of Ø600; its duct connection, at its top, is Ø250, 450 mm above the skirt. The hood is flat against the wall: its back, from skirt to duct, is a vertical line on the wall's face. Both circles are horizontal.

The axes put the skirt's centre at the origin, with z up and x towards the wall. The skirt's back point, against the wall, is at (300, 0, 0). The duct's back point must be directly above it, at (300, 0, 450), so the duct's centre, 125 mm in from its back point, is at (175, 0, 450). The hood is symmetric about the plane y = 0.

## Finding the apex

Two parallel circles of different sizes always lie on one cone. Take any point on the skirt and the matching point on the duct, the one in the same direction from its centre, and draw the line through them; every such line passes through the same point, the apex.

The apex is found from the ratio of the radii. The duct's radius is 125 mm and the skirt's 300 mm, a ratio of k = 125 ÷ 300 = 0.4167. Going from the skirt to the duct, every point moves 1 − k = 0.5833 of the way to the apex. The duct's centre is (175, 0, 450) from the skirt's centre, so the apex is (175, 0, 450) ÷ 0.5833 = **(300, 0, 771.4)**.

The apex is directly above the skirt's back point, at x = 300, which is what a hood that is flat against the wall requires: the back element runs straight up the wall, from the skirt's back point to the apex.

```figure
type: formula
title: The apex of the cone through two parallel circles
formula: apex = (centre offset ÷ (1 − k), height ÷ (1 − k)), where k = r ÷ R
caption: For G1, the skirt's radius R is 300 mm, the duct's r is 125 mm, the duct's centre is offset 175 mm and raised 450 mm.
- k | Ratio of the radii, 125 ÷ 300 = 0.4167
- 1 − k | Fraction of the way to the apex covered between the two circles, 0.5833
step: Apex x = 175 ÷ 0.5833 = 300.0 mm
step: Apex z = 450 ÷ 0.5833 = 771.4 mm
step: Check: the back element, x = 300 at both ends, is vertical
```

## The elements

An element runs from the apex to a point on the skirt. A skirt point at angle θ, measured round from the back at the wall, is at (300 cos θ, 300 sin θ, 0). The element from the apex, (300, 0, 771.4), to that point has differences of 300 − 300 cos θ, 300 sin θ and 771.4, and its true length is the square root of the sum of their squares.

```figure
type: compare
title: G1's cone elements, apex to skirt
rowhead: θ from the wall
cols: Skirt point x, y | Plan length | True length
caption: This is an illustration. Millimetres. The apex is at (300, 0, 771.4). The other half, from 180° to 360°, is the mirror image.
- 0° (back, on the wall) | 300.0, 0 | 0 | 771.4
- 30° | 259.8, 150.0 | 155.3 | 786.9
- 60° | 150.0, 259.8 | 300.0 | 827.7
- 90° | 0, 300.0 | 424.3 | 880.4
- 120° | −150.0, 259.8 | 519.6 | 930.1
- 150° | −259.8, 150.0 | 579.6 | 964.9
- * 180° (front) | −300.0, 0 | 600.0 | 977.3
```

The elements grow from 771.4 mm at the wall to 977.3 mm at the front. On a right cone of the same base and height they would all be equal; on G1, the longest is 205.9 mm longer than the shortest. The element at θ = 90°, for example, has a plan length of √(300² + 300²) = 424.3 mm and a rise of 771.4 mm, and its true length is √(424.3² + 771.4²) = 880.4 mm.

## The pattern by radial lines

An oblique cone, like a right cone, develops by radial lines from its apex. The pattern is a fan of elements, each at its true length, spaced so that the distance along the skirt between neighbouring element ends is the skirt's arc between them. Each pair of neighbouring elements and the arc between them forms a long, thin triangle with its point at the apex, and the angle at the apex is found from the triangle's three sides.

For the first step, from θ = 0° to 30°, the elements are 771.4 and 786.9 mm, and the skirt's arc between them is 300 × π ÷ 6 = 157.1 mm. By the cosine rule, the angle at the apex is **11.51°**. Each later step is calculated the same way. Adding them gives the angle of each element on the pattern, measured from the back element.

```figure
type: compare
title: G1's cone pattern as angles and radii
rowhead: θ from the wall
cols: Angle on the pattern from the back element | Element length | Skirt point on the pattern, across and up
caption: This is an illustration. Angles accumulated from closely spaced elements. Coordinates in millimetres from the apex, with the front element, at 180°, running straight up the sheet.
- 0° (back) | 0 | 771.4 | −668.8, 384.5
- 30° | 11.51° | 786.9 | −590.2, 520.5
- 60° | 22.30° | 827.7 | −507.4, 653.9
- 90° | 32.23° | 880.4 | −411.6, 778.3
- 120° | 41.65° | 930.1 | −294.4, 882.3
- 150° | 50.90° | 964.9 | −154.4, 952.4
- * 180° (front) | 60.11° | 977.3 | 0, 977.3
```

The half pattern spans **60.11°**, and the full pattern, mirrored about the front element, spans **120.21°**. Its outer edge, the skirt's girth of π × 600 = 1,885.0 mm, is not a circular arc: it bulges farthest from the apex at the front, where the elements are longest, and comes nearest at the back. With the seam on the back element, the seam's two ends are 1,337.5 mm apart across the sheet.

## Arcs and chords on an oblique cone

The angle at the apex depends on whether the third side of each triangle is taken as the skirt's arc or its chord. With the 157.1 mm arc, the first step's angle is 11.51°; with the 155.3 mm chord, it is 11.38°. Over twelve steps, the chords lose about 1.2° from the pattern's 120.21°, and the pattern's skirt edge comes out about 20 mm short of its girth. The patterns in this book use arcs, or angles accumulated from closely spaced elements, which is what the arc approximates.

## Why the back element is shortest

On a hood that is flat against the wall, the apex lies on the wall, directly above the skirt's back point. The back element is then vertical and the shortest possible, and the front element, which has to reach across the whole skirt, is the longest. The rise of every element is the same, 771.4 mm; only its plan length changes, from nothing at the back to the skirt's full 600 mm diameter at the front.

That simple structure makes the flat-backed oblique cone one of the easiest to check. It also makes it one of the most common: hoods against walls, hoppers against a building's side and chutes that must keep one face vertical are all flat-backed oblique cones. Every element's true length is √(plan length² + 771.4²), and every plan length is the distance in plan from the back point to the skirt point, 600 × sin(θ ÷ 2) for a point at θ. At θ = 90°, that gives 600 × sin 45° = 424.3 mm, as in the table.

## Sections of an oblique cone

Cut an oblique cone by a plane parallel to its base and the cut is a circle, not an ellipse. That is what makes the hood's duct end round, and it holds at every height. At a height z above the skirt, the section is a circle whose radius has shrunk in proportion to the distance left to the apex, and whose centre has moved along the line from the skirt's centre to the apex.

For G1, at half height, z = 225 mm, the section's radius is 300 × (1 − 225 ÷ 771.4) = 212.5 mm, a Ø425 circle, and its centre is at x = 300 × 225 ÷ 771.4 = 87.5 mm, half way between the skirt's centre and the duct's. The section's back point is at x = 87.5 + 212.5 = 300 mm, on the wall, as it must be.

Those sections are useful in the shop. A template cut to the Ø425 circle and held at half height inside the formed hood checks its shape in the middle, where nothing else can be measured easily. And a hood that must be made in two courses, joined by a horizontal seam, has a round joint at whatever height the seam falls.

Cut the cone by a plane that is not parallel to the base, and the section is generally an ellipse, as on any cone. Chapter 9 meets one when a round pipe joins the hood's side.

## Marking out a large fan

G1's half pattern is a fan whose apex lies 977.3 mm from the skirt's front point and well off any reasonable piece of sheet once the hood is cut short at the duct. Two practical ways deal with an apex that is out of reach.

- **A trammel from a batten.** A long batten is fixed across the bench beyond the sheet, the apex is marked on it, and each element is swung as an arc of its true length from that point. It works, but every element depends on the batten not moving.
- **Coordinates.** The skirt points and duct points of the pattern are given as coordinates from a datum on the sheet, as in the table above, and marked with a tape and square or by the cutting table directly. No apex is needed.

The shop uses coordinates for every oblique cone wider than its trammel, and keeps the trammel for small work. Either way, the check is the same: the distance along the pattern's edge between neighbouring skirt points must be the 157.1 mm arc, and the elements must be their tabled lengths.

## Seams on an oblique cone

The seam goes on an element, and the choice decides the pattern's shape. On G1, the back element is the natural choice: it is the shortest, it lies against the wall where it is hidden and protected, and it is on the plane of symmetry, so the pattern is symmetric about the front element and only half needs calculating.

The full cone's pattern is a fan of 120.21° whose longest radius is 977.3 mm. That is too wide for a 1,200 mm sheet: the seam ends are 1,337.5 mm apart. The hood is therefore made in two halves, with a second seam on the front element, each half a fan of 60.11°. Chapter 3 develops the halves as frustums, since the hood ends at the duct, not at the apex.

## The error: a right-cone formula

This is an illustration. A worker who had made many right-cone reducers developed the first G1 by the familiar formula. They took the slant height from the elevation's sloping side, the front element, 977.3 mm, and calculated the pattern's angle as 360° × 300 ÷ 977.3 = **110.51°**. They drew a sector of that radius and angle.

The sector's skirt edge had the right length, 1,885.0 mm, because a sector of radius 977.3 mm and angle 110.51° has that arc. But every element in it was 977.3 mm long, and the hood it made was a right cone with its apex over the skirt's centre, 977.3 mm up the slant, not a cone flat against the wall. Rolled up, the duct end was centred over the skirt, 175 mm away from where the drawing put it, and the hood stood off the wall by the same amount at the top.

It was found when the formed hood was offered up to the wall. A right-cone formula always makes a right cone; for an oblique cone, the elements must be calculated one by one. The quickest test of any cone pattern is to compare its shortest and longest radii: on a right cone they are equal, and on G1 they differ by 205.9 mm. A sector drawn with one radius cannot be an oblique cone, whatever its angle.

```figure
type: bars
title: G1's back and front elements, true and by the right-cone formula
unit: mm
max: 1000
caption: This is an illustration. The right-cone sector makes every element 977.3 mm. The true back element is 205.9 mm shorter.
- * Back element, true | 771.4
- Back element, right-cone sector | 977.3
- * Front element, true | 977.3
- Front element, right-cone sector | 977.3
```

## Exercise: the element at 45°

Find the true length of G1's cone element from the apex to the skirt point at θ = 45°, first from the coordinates and then from the plan-length shortcut. Which two elements in the table does it lie between?

**Worked answer.**

- The skirt point is at (300 cos 45°, 300 sin 45°, 0) = (212.1, 212.1, 0).
- The differences from the apex, (300, 0, 771.4), are 87.9, 212.1 and 771.4, and the true length is √(87.9² + 212.1² + 771.4²) = **804.9 mm**.
- By the shortcut, the plan length is 600 × sin 22.5° = 229.6 mm, and √(229.6² + 771.4²) gives the same **804.9 mm** when the unrounded values are used.

It lies between the elements at 30° and 60°, 786.9 and 827.7 mm, nearer the first, because the elements lengthen slowly near the back and faster towards the sides.
