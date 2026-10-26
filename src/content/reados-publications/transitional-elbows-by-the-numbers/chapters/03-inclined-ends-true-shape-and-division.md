---
book: transitional-elbows-by-the-numbers
chapterSlug: inclined-ends-true-shape-and-division
order: 3
title: "Inclined ends: true shape and division"
description: "Describe a tilted end by its centre and plane, find its points by dividing the true circle, see why the plan's ellipse misleads, and catch a top girth 41.3 mm short from dividing the ellipse."
draft: false
---

A round end tilted out of the horizontal is still a circle. It looks like an ellipse in plan and like a straight line in elevation, but the sheet that forms it is a circle of the end's diameter, and the points on the pattern must be spaced round that circle, not round any view of it. Most of the trouble with fittings whose ends are not parallel starts at the tilted end, where a worker divides what the drawing shows instead of what the fitting is.

This chapter sets up the F2 reducing connector, describes its tilted top end by coordinates, finds the end's points by dividing the true circle, shows what the plan view does to those points, deals briefly with tilted rectangular ends, and ends with a top edge laid out from the plan's ellipse.

## F2 and its two ends

F2 is the reducing connector at a machine drop. This is an illustration. Its bottom end is Ø250, lying horizontally, and connects to the branch above it. Its top end is Ø200, and connects to a flexible hose that runs down to a machine at 30° from vertical. The fitting therefore reduces in size and turns through 30° at the same time.

With the origin at the centre of the bottom end and z vertical, the job sheet gives:

- **bottom end**: centre (0, 0, 0), plane horizontal, Ø250;
- **top end**: centre (80, 0, 290), plane tilted 30° about an axis parallel to y through its centre, Ø200;
- **direction of tilt**: the top end's normal leans towards +x, so the end faces up and outward.

The tilt axis is parallel to y, so the top end's points on that axis, at y = ±100, stay at the centre's height of 290 mm. The points along x rise and fall: the end's +x edge drops and its −x edge lifts, each by 100 × sin 30° = 50 mm.

## Two directions in the tilted plane

The simplest way to describe a tilted circle is by two directions lying in its plane, at right angles to each other, each one unit long:

- **u**, the direction of steepest slope in the end's plane, which for a 30° tilt about y is (cos 30°, 0, −sin 30°) = (0.8660, 0, −0.5);
- **v**, the direction along the tilt axis, (0, 1, 0).

A point at angle θ round the circle, measured from u, is then the centre plus 100 cos θ along u plus 100 sin θ along v:

(80 + 86.60 cos θ, 100 sin θ, 290 − 50 cos θ).

At θ = 0°, that gives (166.6, 0, 240), the end's lowest point, on its +x side. At θ = 180°, it gives (−6.6, 0, 340), its highest point. At θ = 90°, it gives (80, 100, 290), on the tilt axis at the centre's height.

```figure
type: compare
title: Points on F2's tilted top end, twelve divisions
rowhead: θ
cols: x | y | z | Plan position
caption: This is an illustration. The points from θ = 210° to 330° are the mirror images in y of those from 150° to 30°. Each point is 100 mm from the centre (80, 0, 290).
- 0° | 166.6 | 0 | 240.0 | end of the plan ellipse's short axis
- 30° | 155.0 | 50 | 246.7 | near the short axis
- 60° | 123.3 | 86.6 | 265.0 | between the axes
- * 90° | 80.0 | 100 | 290.0 | end of the plan ellipse's long axis
- 120° | 36.7 | 86.6 | 315.0 | between the axes
- 150° | 5.0 | 50 | 333.3 | near the short axis
- 180° | −6.6 | 0 | 340.0 | other end of the short axis
```

Every point in the table is exactly 100 mm from the centre: for θ = 60°, the differences are 43.3, 86.6 and −25.0, and √(43.3² + 86.6² + 25²) = 100.0 mm. That is the check that the end has been described correctly. A point that comes out at 99.0 or 101.0 mm from its centre has a wrong direction vector, and every line drawn to it will be wrong.

## Dividing the true circle

The rule for a tilted end is simple: divide the circle itself, in its own plane, into equal angles, and calculate each point from the angle. Twelve divisions are 30° apart, and the true distance round the circle between neighbouring points is one twelfth of the circumference, 628.3 ÷ 12 = 52.4 mm. The chord between them, the straight distance, is 2 × 100 × sin 15° = 51.8 mm, and it is the same for every pair, which is the second check that the end is described correctly.

The traditional drawing does the same thing by folding. The worker draws the tilted end's edge view, the 200 mm line at 30° in the elevation, draws a half-circle on it as if the end had been folded flat about that line, divides the half-circle into equal parts, and projects each division back square onto the edge line. The projected points are the points of the true circle, seen edge on. From there they are projected into the plan, where they fall on the ellipse at unequal spacing.

## What the plan does to the points

In plan, the tilted end appears as an ellipse. Its long axis, along y, is the true diameter of 200 mm, because the tilt axis is parallel to the plan. Its short axis, along x, is foreshortened to 200 × cos 30° = **173.2 mm**. The equally spaced points on the circle land on the ellipse at unequal spacings: close together in plan near the long axis, where the circle tilts away from view, and nearly true near the short axis, where it does not.

The plan chord between the points at θ = 0° and 30° is 51.3 mm, against the true chord of 51.8 mm. The plan chord between θ = 60° and 90° is only 45.3 mm. A worker reading the plan sees points that look unevenly spaced and is tempted to "correct" them. They should not: the points are correct, and it is the view that is uneven.

```figure
type: bars
title: Chords between neighbouring top-end points, true and in plan
unit: mm
max: 60
caption: This is an illustration. Every true chord is 51.8 mm. The plan shortens the chords that run along x, by up to cos 30°.
- * True chord, any pair | 51.8
- Plan chord, θ = 0° to 30° | 51.3
- Plan chord, θ = 30° to 60° | 48.4
- Plan chord, θ = 60° to 90° | 45.3
```

The plan chord between θ = 30° and 60° is √((155.0 − 123.3)² + (50 − 86.6)²) = 48.4 mm. The pattern of shortening follows the cosine of the tilt: a chord running wholly along x would be shortened by cos 30°, to 0.866 of its length, and one running wholly along y not at all. Every chord on the tilted end lies somewhere between.

## Girths: true and apparent

The top end's true girth, the length of edge the pattern must have, is the circumference of a 200 mm circle, π × 200 = **628.3 mm**. The perimeter of the plan's ellipse, with semi-axes of 100 and 86.6 mm, is about **587.0 mm** by Ramanujan's approximation. The difference, 41.3 mm, is the length that a pattern would lack if its top edge were stepped round the plan.

The ellipse in plan matters for other reasons. It is the shape of the hole if the connector were to pass through a horizontal plate at that level, and it is what a worker sees when checking the fitting from above. But it is never the shape of the edge on the pattern.

## Where θ starts, and matching the ends

The angle θ must start in the same direction on both ends, or the side lines will join the wrong points. F2's bottom end is described the same way as its top: a point at angle θ is (125 cos θ, 125 sin θ, 0), measured from +x. Its θ = 0° point, (125, 0, 0), lies directly below the top end's θ = 0° point, (166.6, 0, 240), on the same side of the fitting. Joining θ to θ round both ends then gives side lines that run up the surface without crossing.

If the top end's u had been chosen pointing the other way, (−0.866, 0, 0.5), its θ = 0° point would be the highest point, on the −x side, and joining θ to θ would join the bottom's +x side to the top's −x side. The lines would cross the inside of the fitting, and the pattern, though it might close, would describe a twisted shape that nobody intended. The check is simple: the side line at θ = 0° and the side line at θ = 180° should both lie in the plane of symmetry, y = 0, and should be the shortest and longest lines of the fitting. For F2 they are, at 243.6 and 360.0 mm.

The shop's convention is to start θ on every end at the point nearest the +x side of the fitting and to run it anticlockwise seen from above, from +x towards +y. Writing the convention on the job sheet saves arguments later, when someone else checks the workbook.

## Checking a tilted end on the job

A tilted end is checked after forming by its highest and lowest points. On F2, with the bottom end level, the top end's lowest point should be 240 mm above the bottom and its highest point 340 mm, a difference of 100 mm across a 200 mm diameter, which is the sine of 30° times the diameter. The points on the tilt axis, at y = ±100 mm, should both be at 290 mm. A straightedge laid across the formed top end and a digital angle gauge on it should read 30°, and a tape round it should read the girth of the mean line plus the sheet thickness allowance, as Chapter 10 sets out. A connector whose top end reads 28° or 32° has usually been formed with its side lines bent unevenly, and is corrected before seaming by easing the lines on the long side, not by forcing the collar. Each of these checks takes a minute and uses tools that every shop already has.

## Tilted rectangular ends

A rectangular end tilted out of its plane behaves the same way. Its edges along the tilt axis keep their length in plan; its edges across the tilt axis are foreshortened by the cosine of the tilt. The corners are found from the end's centre and its two in-plane directions, exactly as for a circle, with half the width along one direction and half the height along the other. The pattern needs only the corners and any division points along the edges, each calculated, never measured from a view.

A rectangular end rotated within its own plane, as F6's twisted transition is in Chapter 9, needs a third description: the angle its sides make with the axes. Writing the corners as coordinates handles that too.

## The error: dividing the ellipse

This is an illustration. The first F2 pattern after the apprentice's error in Chapter 1 was laid out by a worker who drew a correct plan and elevation, drew the top end's ellipse in plan, and divided the ellipse's perimeter into twelve equal parts with dividers, about 48.9 mm each. They then projected each division up to the elevation to find its height, calculated the true lengths from those points, and stepped 48.9 mm between points along the top edge of the pattern.

Two errors followed. The points were in the wrong places on the true circle: dividing the ellipse equally put them at 28.3°, 58.1° and 90° in the first quarter, instead of 30°, 60° and 90°, so the true distances between them ranged from 49.4 to 55.6 mm instead of a uniform 52.4 mm. And the top edge of the pattern was stepped at 48.9 mm, so it totalled 587.0 mm, **41.3 mm short** of the 628.3 mm the Ø200 hose collar needed.

The formed connector's top end was about 13 mm undersize in diameter and slightly out of round, and the hose collar would not go on. It was found when the collar was offered up. The fix was to divide the true circle and calculate the points from the formula, and the shop's job sheet for F2 now gives the twelve top-end points as coordinates so that nobody needs to divide anything.

```figure
type: checklist
title: Before marking any tilted end
caption: Each item catches an error that the plan or elevation invites.
- Centre and plane taken from the job sheet | not scaled from a view
- Two in-plane directions written down and checked square to each other | u and v
- Points calculated from equal angles on the true circle | 30° for twelve divisions
- Every point checked at the end's radius from its centre | 100.0 mm for F2's top
- Pattern edge stepped at the true spacing | 52.4 mm along the arc for F2's top
- x Points divided round the plan's ellipse | spacing uneven, girth 41.3 mm short
```

## Exercise: a steeper top

A second drop needs a connector like F2 but with its top end tilted 45° instead of 30°, with the same centre at (80, 0, 290) and the same Ø200. Find the plan ellipse's short axis, the point at θ = 60°, and the girth the pattern's top edge must have. How short would a top edge stepped round the plan's ellipse be?

**Worked answer.**

- The short axis is 200 × cos 45° = **141.4 mm**; the long axis stays 200 mm.
- With u = (cos 45°, 0, −sin 45°), the point at θ = 60° is (80 + 70.71 × 0.5, 100 × 0.866, 290 − 70.71 × 0.5) = **(115.4, 86.6, 254.6)**.
- The pattern's top edge must be the true girth, π × 200 = **628.3 mm**, the same as before.
- The ellipse with semi-axes 100 and 70.7 mm has a perimeter of about 540.3 mm, so a top edge stepped round it would be **88.0 mm short**.

The steeper the tilt, the more the plan misleads. The true circle does not change at all.
