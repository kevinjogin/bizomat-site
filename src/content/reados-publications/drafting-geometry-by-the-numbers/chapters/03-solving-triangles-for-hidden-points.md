---
book: drafting-geometry-by-the-numbers
chapterSlug: solving-triangles-for-hidden-points
order: 3
title: "Solving triangles for hidden points"
description: "Find construction points that no dimension gives directly: chamfers by length and angle, the sine and cosine rules, line intersections and perpendicular distances, with checks."
draft: false
---

Designs are rarely specified in the coordinates a drafter needs. A chamfer is given as a length and an angle. A bolt must sit a certain distance from two other features. A web of material must be at least so wide between a hole and a sloping edge. Each of these hides a triangle, and each triangle has to be solved before the point can be placed exactly.

Most CAD programs can find such points graphically, by drawing construction lines and circles and snapping to their intersections, and that is often the quickest route. But the graphical route needs the same understanding: you must know which triangle you are constructing, which solution you want when there are two, and how to check the result. This chapter covers right triangles, the sine and cosine rules, intersections of lines and the distance from a point to a line, using the motor plate's chamfer, lock bolt and webs.

## Right triangles: chamfers and slopes

A right-angled triangle is fixed by any two of its sides, or by one side and one acute angle. The relations are the familiar ones:

- opposite = hypotenuse × sin θ
- adjacent = hypotenuse × cos θ
- opposite = adjacent × tan θ
- hypotenuse = √(adjacent² + opposite²)

Chamfers are the everyday case. A chamfer may be specified by two leg lengths, as on the plate's 45 × 45 mm corner, or by one leg and an angle, written for example as 45 × 30°. The first form is unambiguous: the chamfer line runs from (220, 95) to (175, 140), its length is √(45² + 45²) = 63.640 mm and its direction is 135°.

The second form needs care, because it does not say which face the 45 mm is measured along or which face the 30° is measured from. If it means 45 mm along the top edge at 30° to that edge, the vertical leg is 45 × tan 30° = 25.981 mm and the chamfer length is 45 ÷ cos 30° = 51.962 mm. If it means 45 mm down the side at 30° to the side, the legs swap. The geometry is easy; the reading is not. A drafter who meets a length-and-angle chamfer with no sketch should ask, or show both legs on the drawing so that the reader cannot misread it.

```figure
type: compare
title: Three ways a corner chamfer can be specified
cols: Horizontal leg | Vertical leg | Chamfer length | Ambiguous?
caption: The plate uses the first form. The other two show why a length-and-angle chamfer needs a sketch or both legs stated.
- *45 × 45 | 45 mm | 45 mm | 63.640 mm | No
- 45 × 30°, from the top edge | 45 mm | 25.981 mm | 51.962 mm | Yes, unless sketched
- 45 × 30°, from the side edge | 25.981 mm | 45 mm | 51.962 mm | Yes, unless sketched
```

## The sine and cosine rules

When a triangle has no right angle, two rules solve it. Label the corners A, B and C, and the side opposite each corner a, b and c.

The **cosine rule** relates two sides and the angle between them to the third side:

c² = a² + b² − 2ab cos C

It also runs backwards, to find an angle from three sides:

cos C = (a² + b² − c²) ÷ 2ab

The **sine rule** relates each side to the sine of its opposite angle:

a ÷ sin A = b ÷ sin B = c ÷ sin C

The cosine rule has one great advantage for drafting: when used to find an angle, it always gives the right answer, because the inverse cosine returns angles from 0° to 180° and every angle in a triangle lies in that range. The sine rule has a trap. The inverse sine returns only angles from −90° to 90°, and an obtuse angle has the same sine as its supplement: sin 143.6° = sin 36.4°. If the angle you want is obtuse, the inverse sine gives the wrong one, silently. The KEVOS® [triangle solver](/tools/triangle-solver/) handles every case, including the ambiguous one below, and is a useful second route for checking a hand solution.

```figure
type: formula
title: Solving the pivot, bore and lock-bolt triangle
formula: OS² = PS² + PO² − 2 × PS × PO × cos P
formula: cos O = (PO² + OS² − PS²) ÷ (2 × PO × OS)
caption: This is an illustration. P is the pivot, O the bore centre and S the lock bolt at the middle of the slot. The cosine rule gives the obtuse angle at O directly.
- PS | Pivot to lock bolt, the slot radius, 180 mm
- PO | Pivot to bore centre, 102.956 mm
- P | Angle at the pivot between the two, 29.055° − 12.5° = 16.555°
step: OS = √(180² + 102.956² − 2 × 180 × 102.956 × cos 16.555°) = 86.441 mm
step: cos O = (102.956² + 86.441² − 180²) ÷ (2 × 102.956 × 86.441) = −0.8050
step: O = 143.607°, and S = 180° − 16.555° − 143.607° = 19.838°
```

## The running case: where the lock bolt sits

This is an illustration. The frame designer needs to know where the lock bolt sits relative to the motor, to check that a spanner can reach the bolt beside the motor body. In the drawn position, the lock bolt is at the middle of the slot, 180 mm from the pivot at 12.5°. Its world coordinates are (20 + 180 cos 12.5°, 20 + 180 sin 12.5°) = (195.733, 58.959), which this chapter calls S.

The drafter could simply measure from O to S in the CAD file. Solving the triangle as well gives an independent check and the angles the frame designer will need.

The triangle P, O, S has:

- side PO = 102.956 mm, from Chapter 2, at a direction of 29.055° from P;
- side PS = 180 mm, at 12.5° from P;
- so the angle at P is 29.055° − 12.5° = 16.555°.

The cosine rule gives OS = **86.441 mm**, which matches the distance measured between the points in the file, √(85.733² + 11.041²) = 86.441 mm. The angle at O is 143.607°, so the lock bolt lies nearly behind the motor as seen from the pivot. The angles sum to 16.555° + 143.607° + 19.838° = 180°, which confirms the solution.

The motor's body is 150 mm in diameter, so its surface is 75 mm from O. The clear gap between the motor body and the centre of the lock bolt is 86.441 − 75 = 11.4 mm, which is not enough for a socket on an M10 bolt head. The frame designer moved the lock bolt to be fitted from behind the frame, with a nut on the motor side, and noted the reason on the frame drawing. This is the value of solving the triangle early: a clash found in the geometry costs a note; a clash found at assembly costs a redesign.

## The error: the angle that came out acute

This is an illustration. Before the drafter's check, an engineer had worked out the angle at O in a spreadsheet using the sine rule: sin O = PS × sin P ÷ OS = 180 × sin 16.555° ÷ 86.441 = 0.5933. The spreadsheet's ASIN returned 36.393°. The engineer used that angle to sketch the spanner access and concluded that the lock bolt sat well to one side of the motor, with plenty of room.

The drafter's check found the mistake in two ways. First, the angles did not sum to 180°: 16.555° + 19.838° + 36.393° = 72.786°. Second, the plotted direction from O to S, measured in the CAD file, was 172.662° from the positive x axis, nearly straight back towards the pivot side, which matches an interior angle of 143.6° at O and not 36.4°.

The correct angle is 180° − 36.393° = 143.607°. The engineer's spreadsheet now finds angles with the cosine rule and checks that the three angles sum to 180°. The office's rule is short: use the sine rule only for sides, or for angles you know are acute.

```figure
type: checklist
title: Checks for any solved triangle
caption: A solved triangle should pass all of these before its points are used. Two independent routes to the same point are the strongest check.
- Angles sum to 180° | 16.555° + 143.607° + 19.838° = 180° for the lock-bolt triangle
- Largest side faces the largest angle | PS = 180 mm faces the 143.607° angle at O
- Cosine rule used for angles | Gives obtuse angles correctly; the inverse sine does not
- Result matches a measurement in the file | OS measured as 86.441 mm between snapped points
- x Inverse sine used for an angle that might be obtuse | Returned 36.393° instead of 143.607°
- ? Two solutions possible | Side-side-angle data can fit two triangles; decide which one the design means
```

## Two solutions: the ambiguous case

When a triangle is specified by two sides and an angle that is not between them, there may be two triangles that fit. This is the ambiguous case, and it turns up in drafting more often than people expect, for example when a point is required to be at a given distance from one feature and on a line from another.

Suppose the lock bolt were specified differently: on the line at 12.5° from the pivot, and 86.441 mm from the bore centre. A circle of radius 86.441 mm about O crosses that line twice. One crossing is the intended lock bolt, 180 mm from the pivot. The other is only 17.377 mm from the pivot, inside the pivot boss, where no bolt can go. Both satisfy the specification.

Algebraically, the cosine rule becomes a quadratic in PS, and its two roots are 180 mm and 17.377 mm. Graphically, the construction circle has two intersections and the snap picks whichever is nearer the cursor. Either way the drafter must choose, and must check the choice against the design's intent. The general defence is to specify points in a way that has only one answer, such as two distances from two datums with the side stated, or a distance and an angle from one datum.

## Intersections of lines

Many construction points are the intersection of two lines: where a chamfer meets an edge, where two centrelines cross, where a sloping face meets a datum line. Graphically, draw both lines and snap to the intersection. Numerically, write each line in a form you can solve.

A convenient form for drafting is the line through a point (x₀, y₀) in direction θ: every point on it is (x₀ + t cos θ, y₀ + t sin θ) for some distance t. Two lines in this form give two equations in two unknowns, t₁ and t₂, which solve by substitution.

For lines at 45°, or horizontal and vertical lines, simpler forms are easier. The plate's chamfer passes through C (220, 95) and D (175, 140). Every point on it satisfies x + y = 315. A line through any point H at 45° to the chamfer, that is, perpendicular to it, has direction (1, 1), so its points are (Hx + t, Hy + t). Substituting into x + y = 315 gives t = (315 − Hx − Hy) ÷ 2. That is the intersection, and it is also the foot of the perpendicular from H to the chamfer.

## Distance from a point to a line

The shortest distance from a point to a line is along the perpendicular, and it is the quantity that matters for webs of material, edge distances and clearances. For a line written as ax + by = c, the distance from point (x₀, y₀) is:

distance = |a x₀ + b y₀ − c| ÷ √(a² + b²)

For the chamfer, a = 1, b = 1 and c = 315. The top right motor hole H is at (145.355, 105.355). Its distance from the chamfer is |145.355 + 105.355 − 315| ÷ √2 = 64.29 ÷ 1.4142 = **45.46 mm**. Subtracting the hole's radius of 4.5 mm leaves a web of **40.96 mm** of steel between the hole and the chamfer. The foot of the perpendicular, from the previous section, is at (145.355 + 32.145, 105.355 + 32.145) = (177.5, 137.5), which lies on the chamfer between C and D, so the shortest distance is to the chamfer itself and not to one of its ends.

That last check matters. The formula gives the distance to the infinite line. If the foot of the perpendicular falls beyond the end of the actual edge, the nearest point of the edge is its endpoint, and the web is measured to that corner instead.

```figure
type: stats
title: Webs of material around the plate's top right corner
caption: This is an illustration. Perpendicular distances from the chamfer line x + y = 315, less the feature radius. All feet of perpendiculars fall on the chamfer between C and D.
- 40.96 mm | Motor hole to chamfer | Centre 45.46 mm from the line, less 4.5 mm
- 65.46 mm | Bore to chamfer | Centre 95.46 mm from the line, less 30 mm
- * 25.82 mm | Slot end S2 to chamfer | Centre 31.32 mm from the line, less 5.5 mm
```

## The same points by construction

Everything in this chapter can also be found graphically, and in daily work that is often how it is done. The point is that the graphical route and the numerical one should agree, and that each is a check on the other.

For the lock bolt, the construction is a circle of radius 180 mm about the pivot and a construction line from the pivot at 12.5°. Their intersection is S, and an intersection snap places it exactly. For the web between the motor hole and the chamfer, the construction is a line through the hole centre perpendicular to the chamfer, which most programs offer as a perpendicular snap, and the distance from the hole centre to the snapped foot point. For the ambiguous case, a circle of radius 86.441 mm about the bore crosses the 12.5° line twice, and seeing both crossings on the screen is the clearest possible warning that the specification has two answers.

Construction geometry has two weaknesses. It depends on picking the right intersection when several are close together, and it leaves no record of the arithmetic unless the construction lines are kept. The remedy for both is the habit from Chapter 1: keep construction geometry on its own non-plotting layer, and confirm each critical point with one independent calculation or measurement. For the plate, the drafter recorded OS = 86.441 mm and the 40.96 mm web on the construction layer beside the points they describe.

## Exercise: the chamfer that changed

The customer asks for a larger chamfer, 60 × 60 mm instead of 45 × 45 mm, to clear a guard bracket. Find the new chamfer line, its length, and the web between the top right motor hole and the chamfer. Is the web still at least 15 mm, the minimum the engineer set for this 10 mm plate?

**Worked answer.** The new chamfer runs from (220, 140 − 60) = (220, 80) to (220 − 60, 140) = (160, 140). Every point on it satisfies x + y = 300. Its length is √(60² + 60²) = 84.853 mm, at 135°.

The motor hole H is at (145.355, 105.355). Its distance from the new line is |145.355 + 105.355 − 300| ÷ √2 = 49.29 ÷ 1.4142 = 34.85 mm, and the web is 34.85 − 4.5 = **30.35 mm**. The foot of the perpendicular is at (145.355 + 24.645, 105.355 + 24.645) = (170.0, 130.0), which lies between (160, 140) and (220, 80), so the measurement is to the chamfer itself. The web is well above 15 mm.

Check the slot too. S2 at (189.145, 81.564) is |189.145 + 81.564 − 300| ÷ √2 = 20.71 mm from the new line, so the web beyond the slot end is 20.71 − 5.5 = **15.21 mm**. That passes, but by only 0.21 mm, and the slot's lower end S1 already has the plate's thinnest web: 220 − 199.315 − 5.5 = 15.19 mm to the right edge. The larger chamfer would make the slot's top end as critical as its bottom end, with no margin left for a later change. The drafter should report this before redrawing, and offer the alternatives: keep the 45 × 45 mm chamfer, or accept the thin web knowingly, or move the slot's upper end, which reduces the adjustment range that Chapter 5 calculates.
