---
book: drafting-geometry-by-the-numbers
chapterSlug: absolute-relative-and-polar-points
order: 2
title: "Absolute, relative and polar points"
description: "Enter points by absolute, relative and polar coordinates, convert between them exactly, and avoid the angle, sign and quadrant errors that put features on the wrong side of a part."
draft: false
---

Every CAD system lets you describe a point in three ways: by its position from the origin, by its offset from the last point, or by a distance and an angle. The three are equivalent, and a good drafter moves between them without thinking, choosing whichever matches the way the design was specified. A hole located 110 mm from an edge is an absolute coordinate. A step 15 mm to the left is a relative one. A bolt 50 mm from a bore centre at 45° is a polar one.

The arithmetic is simple, which is why its mistakes are so persistent. A sign typed the wrong way, an angle measured from the wrong reference or an inverse tangent that loses its quadrant puts a feature on the wrong side of the part, often far enough to be obvious and sometimes close enough to pass. This chapter sets out the conventions, the conversions and the checks, and uses them to place the motor plate's outline, holes and slot.

## Three ways to describe one point

**Absolute coordinates** give a point's distances from the origin along the x and y axes, written as (x, y). In the running case, the bore centre O is at (110, 70): 110 mm to the right of the origin and 70 mm above it. Points to the left of or below the origin have negative coordinates.

**Relative coordinates** give the change in x and y from the last point entered, written here as Δ(dx, dy). Many programs mark relative input with a prefix such as @, so that @25,−15 means 25 mm right and 15 mm down from the last point. Some programs, when they show input fields next to the cursor, treat the second and later points as relative by default and need a different prefix for absolute input. Check which convention your software uses, because the same keystrokes produce different points.

**Polar coordinates** give a distance and a direction from the last point, written here as r∠θ. The CAD convention, inherited from mathematics, measures θ from the positive x axis, anticlockwise positive. So 0° points right, 90° up, 180° left and 270° (or −90°) down. A polar entry such as @50<45 means 50 mm from the last point at 45° above the positive x direction.

```figure
type: compare
title: The same bolt hole described three ways
cols: Written as | Reference | Best when the design gives
caption: This is an illustration. The top right motor hole of the plate, which lies on the 100 mm pitch circle at 45° from the bore centre.
- Absolute | (145.355, 105.355) | The origin A | Distances from the datum edges
- Relative to the bore | Δ(35.355, 35.355) | The bore centre O | Offsets from a feature
- *Polar from the bore | 50∠45° | The bore centre O | A radius and an angle
```

## The conversions

Converting between the forms needs only Pythagoras and the basic trigonometric functions.

From polar to relative:

- dx = r × cos θ
- dy = r × sin θ

From relative to polar:

- r = √(dx² + dy²)
- θ = the angle whose tangent is dy ÷ dx, **taken in the correct quadrant**

And from relative to absolute, add the offsets to the previous point's coordinates.

The quadrant warning matters. The ordinary inverse tangent function, written tan⁻¹ on a calculator or ATAN in a spreadsheet, returns an angle between −90° and +90° only. It cannot tell the difference between a point up and to the right and a point down and to the left, because dy ÷ dx has the same sign for both. The two-argument function, ATAN2 in spreadsheets and most programming languages, takes dx and dy separately and returns the angle in the right quadrant, between −180° and +180°. Use it, or check the signs of dx and dy by hand and add 180° when dx is negative. The BIZOMAT [polar coordinates calculator](/tools/polar-coordinates/) converts in both directions and is a quick independent check.

```figure
type: formula
title: Converting between relative and polar coordinates
formula: dx = r cos θ        dy = r sin θ
formula: r = √(dx² + dy²)        θ = ATAN2(dy, dx)
caption: CAD angles run anticlockwise from the positive x axis. Spreadsheets differ in argument order; Excel's ATAN2 takes x first, ATAN2(dx, dy), so check yours.
- r | Distance from the reference point, mm
- θ | Direction, degrees anticlockwise from +x
- dx, dy | Offsets along x and y from the reference point, mm
step: Pivot P to bore O: dx = 90, dy = 50
step: r = √(90² + 50²) = 102.956 mm
step: θ = ATAN2(50, 90) = 29.055°, so O is 102.956∠29.055° from P
```

## Which form to use

Choose the form that matches the design information, so that the numbers you type are the numbers on the drawing or in the specification.

- **Absolute** for features dimensioned from the datums, such as the bore at (110, 70) and the pivot at (20, 20).
- **Relative** for outlines described edge by edge, where each edge has a length along x or y.
- **Polar** for features defined by a radius and an angle: bolt circles, slots, chamfers specified by length and angle, and anything rotated about a centre.

Avoid converting when you do not need to. Every conversion is another chance to round or to lose a sign. If the design says "50 mm at 45° from the bore centre", typing 50∠45° from the bore centre is safer than calculating (145.355, 105.355) and typing that.

## The running case: the outline by relative entry

This is an illustration. The drafter built the plate outline from A with relative entries, each matching an edge:

1. From A (0, 0): Δ(220, 0) to B, the bottom edge.
2. Δ(0, 95) to C, the right edge.
3. Δ(−45, 45) to D, the chamfer. Equivalently, the polar entry 63.640∠135°.
4. Δ(−135, 0) to E, the top edge.
5. An arc of radius 40, centred at (40, 100), from E to F (0, 100).
6. Δ(0, −100) back to A, closed with an endpoint snap.

Each relative entry can be checked against the absolute coordinates of the corners. B is (0 + 220, 0 + 0) = (220, 0). C is (220, 95). D is (220 − 45, 95 + 45) = (175, 140). E is (175 − 135, 140) = (40, 140). The sum of all the straight offsets plus the arc's net movement must be zero for a closed outline: in x, 220 + 0 − 45 − 135 − 40 + 0 = 0, and in y, 0 + 95 + 45 + 0 − 40 − 100 = 0. That closure check takes seconds and catches a mistyped sign immediately.

```figure
type: steps
title: Placing the plate's features with the right form for each
caption: This is an illustration. Each entry uses the form in which the design states the feature.
- Bore O | Absolute (110, 70), dimensioned from the datum edges
- Pivot P | Absolute (20, 20), dimensioned from the datum edges
- Motor holes | Polar 50∠45°, 50∠135°, 50∠225°, 50∠315° from O
- Slot centreline ends | Polar 180∠5° and 180∠20° from P, giving S1 (199.315, 35.688) and S2 (189.145, 81.564)
- *Check | Relative S1 to S2 is Δ(−10.170, 45.876), length 46.989 mm, equal to the chord 2 × 180 × sin 7.5°
```

## Angles from other conventions

Not every source measures angles the CAD way. Three conversions are common.

**Clockwise angles.** A design note that says "20° clockwise from horizontal" means −20°, or 340°, in CAD terms. Both work in most programs, but they are not the same as +20°.

**Angles from the vertical.** A chamfer specified as "30° from the vertical face" on a right-hand edge, sloping up and to the left, has a CAD direction of 90° + 30° = 120°. Draw a sketch with the axes before converting; the arithmetic is easy and the direction is where mistakes happen.

**Bearings.** Site and layout drawings may give directions as bearings, measured clockwise from north. If north is the drawing's +y direction, a bearing β converts to a CAD angle of 90° − β. A bearing of 60° becomes 30°; a bearing of 150° becomes −60°, or 300°.

## Checks that catch coordinate errors

Most coordinate mistakes produce a point that is obviously wrong once someone looks. The checks below make someone look.

- **Closure.** For any closed outline entered relatively, the offsets must sum to zero in x and in y.
- **Distance back to a datum.** After placing a feature by polar entry from one datum, measure its distance from another. The top right motor hole is 50 mm from O by construction; its distance from P should be √(125.355² + 85.355²) = 151.66 mm. If it is not, something was entered from the wrong point.
- **Inside the part.** Every hole, slot and pocket must lie inside the outline with material around it. For the chamfered edge of the plate, the line through C and D satisfies x + y = 315, so any point with x + y greater than 315 is outside the plate.
- **Symmetry.** Patterns that should be symmetric about a centre or a line should have matching coordinates. The four motor holes have x coordinates 74.645 and 145.355, which average 110, the bore's x coordinate.

## The error: a point on the wrong side

This is an illustration. When the plate design was being set up, an engineer used a spreadsheet to calculate the polar coordinates between the datums, so that the drafter could locate the pivot from the bore. The spreadsheet calculated the offset from O to P as dx = 20 − 110 = −90 and dy = 20 − 70 = −50, the distance as 102.956 mm, and the angle as ATAN(dy ÷ dx) = ATAN(0.5556) = 29.055°.

The drafter entered 102.956∠29.055° from O and got a pivot at (200.0, 120.0). Two checks failed at once. The point was outside the plate, since 200 + 120 = 320 is greater than 315. And it was in the wrong place relative to the slot: the slot centreline, which should pass 180 mm from the pivot, now did not pass near it at all.

The cause was the quadrant. The point P is down and to the left of O, in the third quadrant, where the correct angle is 29.055° + 180° = 209.055°, or −150.945°. The ordinary inverse tangent cannot see that, because −50 ÷ −90 is positive, the same as 50 ÷ 90. The spreadsheet was corrected to use ATAN2, which returned −150.945°, and the drafter placed P at 102.956∠209.055° from O, giving (20.00, 20.00). The office's calculation template now uses ATAN2 everywhere, and the check "every feature inside the outline" was added to the drafting checklist.

```figure
type: decision
title: Finding the direction from one point to another
question: Which angle should be typed for a polar entry from O to P?
- dx positive | ATAN(dy ÷ dx) is already correct | Right half of the plane
- dx negative | Add 180° to ATAN(dy ÷ dx) | Left half; the O to P case, 29.055° + 180° = 209.055°
- dx zero | 90° if dy is positive, 270° if negative | Straight up or down
- *Any case | Use ATAN2 and check the signs of dx and dy | Returns −180° to +180° directly
```

## Working planes and moved origins

Sometimes the most convenient origin for part of the geometry is not the drawing origin. The slot is easiest to describe from the pivot, the motor holes from the bore. Most CAD programs let you move or rotate the coordinate system temporarily, so that the pivot becomes (0, 0) and the slot ends become simply 180∠5° and 180∠20°.

This is useful and slightly dangerous. A moved coordinate system that is left in place makes every later absolute entry wrong by the offset. Two habits keep it safe: name and save each user coordinate system so that its purpose is clear, and return to the world system as soon as the construction is done. A quick test is to snap to the origin corner A and read its coordinates; if they are not (0, 0), the drawing is not in the system you think it is.

Polar entries from an object snap give the same convenience without moving anything. Snapping to the centre of the pivot hole and typing a polar distance from there places the slot ends correctly in world coordinates.

## How many decimals an angle needs

Angles deserve the same care as distances, because an angle error grows with the radius it is applied at. A point placed at radius r with an angle error of Δθ degrees moves sideways by about r × Δθ × π ÷ 180.

For the slot ends, at 180 mm from the pivot, an angle typed 0.1° wrong moves the end by 180 × 0.1 × π ÷ 180 = 0.314 mm. An error of 0.01° moves it 0.031 mm, and 0.001° moves it 0.003 mm. For the motor holes, at only 50 mm from the bore, the same 0.1° error moves a hole 0.087 mm. The rule of thumb is that the decimal places in an angle should increase with the radius: whole degrees are exact enough when the design value is a whole number, but a derived angle such as 29.055° should be carried to at least three decimal places, or better still not typed at all but taken from a snap.

Angles specified in degrees, minutes and seconds need converting before most CAD programs will accept them as decimals. One minute is 1/60 of a degree and one second 1/3,600, so 29° 3′ 17″ is 29 + 3/60 + 17/3,600 = 29.0547°. Some programs accept the degree, minute and second form directly with their own separators; check the format before relying on it, because a value misread as 29.317° is a quarter of a degree out.

## Exercise: locating the slot from the bore

A machinist checking the first plate wants to measure the slot from the bore, which is the feature fixtured on the coordinate measuring machine, rather than from the pivot. Give the relative and polar coordinates of the slot's upper end S2 from O, and show one check.

**Worked answer.** S2 is at (189.145, 81.564) in world coordinates and O is at (110, 70). The relative offset is:

- dx = 189.145 − 110 = 79.145 mm
- dy = 81.564 − 70 = 11.564 mm

So S2 is Δ(79.145, 11.564) from O. The polar form is:

- r = √(79.145² + 11.564²) = **79.985 mm**
- θ = ATAN2(11.564, 79.145) = **8.313°**

Both dx and dy are positive, so the angle is in the first quadrant and needs no correction.

One check uses the slot geometry from the pivot instead. S2 lies 180 mm from P at 20°, and O lies 102.956 mm from P at 29.055°. The angle between those two directions, seen from P, is 9.055°. By the cosine rule, the distance O to S2 is √(180² + 102.956² − 2 × 180 × 102.956 × cos 9.055°) = 79.99 mm, which agrees to within the rounding of the inputs. Chapter 3 develops the cosine rule and the other triangle solutions used here.
