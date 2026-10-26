---
book: sheet-metal-patterns-by-the-numbers
chapterSlug: rectangle-to-round-transitions
order: 8
title: "Rectangle-to-round transitions"
description: "Triangulate the fan transition from a 300 × 200 outlet to Ø250 round: flat triangles, part-cone corners, six true lengths, a seam on a long side, and a pattern built with every line set at 350 mm."
draft: false
---

The transition from a rectangular outlet to a round duct is the fitting that most often defeats a beginner, and the one that best shows why triangulation exists. It is not a cone, nor a pyramid, nor a cylinder. It is four flat triangles, one standing on each side of the rectangle, and four corner pieces between them, each part of an oblique cone whose apex is a corner of the rectangle. Every line on it has a different true length, and once those lengths are known, the pattern builds itself.

This chapter develops the running case's fan transition, from the fan's 300 × 200 mm outlet to the Ø250 duct, 350 mm long, with both ends centred. It finds the six true lengths that define the whole fitting, builds the pattern from a seam on the middle of a long side, and shows what happens when every line is set at the fitting's length instead of its own.

## Reading the transition

This is an illustration. The extraction fan has a rectangular outlet, 300 × 200 mm inside, and the duct leaving it is Ø250. The transition is 350 mm long between its two ends, which are parallel and centred on one axis. On the mean line of 0.8 mm sheet the rectangle is 300.8 × 200.8 mm, so its corners are at ±150.4 and ±100.4 mm from the centre, and the round end has a mean radius of 125.4 mm.

Look at the transition from above. Each side of the rectangle has a point on the circle directly beyond its middle: the long sides face the circle's points at 90° and 270°, and the short sides face 0° and 180°. A plane through a side of the rectangle and that point on the circle cuts the transition along a flat triangle. Between neighbouring triangles, at each corner, the surface sweeps around a quarter of the circle while staying anchored at the rectangle's corner. That sweep is part of an oblique cone with its apex at the corner.

So the transition is:

- four **flat triangles**, two with a base of 300.8 mm and two with a base of 200.8 mm, each with its apex on the circle; and
- four **corner cones**, each with its apex at a rectangle corner and its base a quarter of the circle.

The lines between them, from each rectangle corner to the two neighbouring side points on the circle, are **fold lines**. The triangles are flat; the corners are gently curved.

## Dividing the corners

Each corner cone spans a quarter of the circle, 90°. Dividing the circle into 12 parts gives three steps per quarter, so each corner is split into three narrow triangles by lines from the rectangle's corner to the circle's points at 0°, 30°, 60° and 90° for the first corner, and so on around.

By symmetry, all four corners of a centred transition are mirror images of one another, so the true lengths need only be found for one. That is one of the reasons centred transitions are drawn first when learning: four corners, one calculation.

## The true lengths

Every line rises 350 mm. Its plan length is the distance in plan from the corner at (150.4, 100.4) to a point on the circle at (125.4 cos φ, 125.4 sin φ).

```figure
type: compare
title: True lengths for one corner of the fan transition
rowhead: Line
cols: Plan length, mm | True length, mm
caption: Height 350 mm for every line. The corner is at (150.4, 100.4) mm from the centre. The other three corners mirror these values. The two triangle heights happen to be equal because the circle is 25 mm inside each side.
- Corner to φ = 0°, fold line to the short-side triangle | 103.5 | 365.0
- Corner to φ = 30° | 56.3 | 354.5
- Corner to φ = 60° | 88.1 | 360.9
- * Corner to φ = 90°, fold line to the long-side triangle | 152.5 | 381.8
- Height of long-side triangle, side midpoint to φ = 90° | 25.0 | 350.9
- Height of short-side triangle, side midpoint to φ = 0° | 25.0 | 350.9
```

Two things in the table deserve a second look. First, the corner's lines are not in order of angle: the shortest runs to 30°, not to the 45° direction where a square's corner would point, because a 300.8 × 200.8 rectangle's corner lies at atan(100.4 ÷ 150.4) = 33.7° from the centre, and the circle's nearest point is the one at 30°. Second, no line is as short as 350 mm. Even the triangle heights, which look vertical in an end elevation, lean 25 mm in plan and are 350.9 mm long.

The step along the circle between points is the arc, 787.9 ÷ 12 = 65.66 mm, as Chapter 7 established. The steps along the rectangle are its sides: 300.8 mm on the long sides, 200.8 mm on the short sides, and 150.4 mm for each half of the long side where the seam falls.

## Where the seam goes

A transition needs one seam, and the usual place is the middle of one of the flat triangles, where the seam line is straight and short and the surface beside it is flat. The running case puts it on the middle of a long side, where the seam line is the long-side triangle's height, 350.9 mm, and the pattern starts and ends with half of that triangle. A seam at a corner would run along a fold line, which is possible but harder to groove because the seam would have to bend.

On a fan outlet, the seam also goes where it is easiest to reach and to seal, which on the running case is the top long side. The shop marks the seam position and the fan's orientation on the job sheet so that the transition is not formed upside down.

## Building the pattern

The pattern is built around the transition, starting at the seam, in the order the surface is met.

1. Draw the seam line, 350.9 mm, from the long side's midpoint M to the circle point at 270°.
2. Complete the **half long-side triangle**: from M, mark 150.4 mm along the rectangle's edge to the corner; from the circle point, the fold line to that corner is 381.8 mm. The corner is where those arcs cross.
3. Build the **corner**: from the corner, swing arcs of 360.9, 354.5 and 365.0 mm to the next three circle points, each stepped 65.66 mm from the last along the circle edge.
4. Build the **short-side triangle**: from the corner, 200.8 mm to the next corner, which must also be 365.0 mm from the circle point at 0°.
5. Continue round: corner, long-side triangle, corner, short-side triangle, corner, and finally the second half long-side triangle back to the seam.
6. Check the closure: the last seam line must be 350.9 mm.

The rectangle edge of the pattern is a chain of straight lines, 1,003.2 mm long in all, the mean perimeter of the rectangle. The circle edge is a smooth curve 787.9 mm long. On the running case's pattern, built this way in a spreadsheet, the closing seam line came out at 350.9 mm, confirming every step.

The same spreadsheet gives the pattern's area by adding up its triangles, 0.313 m², which in 0.8 mm steel is about 2.0 kg before flange and collar. That number is worth having for two reasons. It lets the shop price the fitting from material and labour rather than by guess, and it is an independent check: a pattern whose drawn area differs noticeably from the sum of its triangles has a misplotted point somewhere.

```figure
type: svg
title: Pattern of the fan transition
alt: An irregular curved band. Its lower edge is a chain of straight segments representing the four sides of the rectangle, with the seam halves at the ends. Its upper edge is a smooth curve representing the round end. Straight fold lines run from each rectangle corner on the lower edge to two points on the upper edge, enclosing fan-shaped groups of triangles at the corners; the flat triangles sit between the fans.
caption: This is an illustration at about 0.39 scale, mirrored for drawing. Solid lines are fold lines between the flat triangles and the corner cones; thin lines divide each corner. The pattern spans about 939 × 583 mm before allowances.
viewbox: 0 0 450 280
body:
<path class="bx" d="M40 260L99.3 260L177.6 248L290.8 212.4L361.9 177.5L410.5 143.5L331.3 30L310.1 44.8L288.2 58.6L265.3 70.7L241.7 81.5L217.4 90.4L192.7 98.2L168 105.9L142.9 112.5L117.5 117.2L91.8 120.4L65.9 121.6L40 121.6Z"/>
<path class="lf" d="M99.3 260L65.9 121.6M99.3 260L91.8 120.4M177.6 248L142.9 112.5M177.6 248L168 105.9M290.8 212.4L217.4 90.4M290.8 212.4L241.7 81.5M361.9 177.5L288.2 58.6M361.9 177.5L310.1 44.8"/>
<path class="la" d="M99.3 260L40 121.6M99.3 260L117.5 117.2M177.6 248L117.5 117.2M177.6 248L192.7 98.2M290.8 212.4L192.7 98.2M290.8 212.4L265.3 70.7M361.9 177.5L265.3 70.7M361.9 177.5L331.3 30"/>
<text class="txs" x="20" y="276">Seam M</text>
<text class="txs" x="380" y="190">Seam</text>
<text class="txs" x="120" y="200">Short side</text>
<text class="txs" x="210" y="170">Long side</text>
<text class="txs" x="300" y="130">Short</text>
<text class="txs" x="160" y="84">Round end, 787.9 mm</text>
```

## Forming and the fold lines

The pattern's straight lines from each corner to the side points are folds, and they are not sharp. Calculated from the true geometry, the surface changes direction by about 16° across each fold line, 16.3° beside the long-side triangles and 15.5° beside the short ones, so the fold is a soft break made over a bar or on a folder with a light set. Within each corner, neighbouring panels differ by about 30°, but that change is spread smoothly across the panel as curvature, not concentrated at a line. The corner cones are curved by hand or over a stake, pulling the round end into shape a little at a time and checking with a template of the Ø250 circle.

The order matters. Fold the four soft breaks first, close and lock the grooved seam, then work the round end to the template. Trying to round the corners before the seam is closed lets the pattern spring flat again.

A transition made in two halves, with seams on the middles of both long sides, is easier to handle on larger sizes and lets each half be formed on the bench before the two are joined. The running case's transition is small enough to make in one piece.

## The error: every line set at 350 mm

This is an illustration. A shop hand who had not met triangulation set out a transition by drawing a rectangle edge and a girth line 350 mm apart, and joining each rectangle corner and side point to the circle's points with lines all 350 mm long, "because the fitting is 350 mm long". The pattern looked plausible on the sheet, a band with a straight lower edge and a curved upper edge.

Every line was short: by 0.9 mm on the triangle heights, and on the corner lines by 15.0, 4.5, 10.9 and 31.8 mm. Formed, the transition could not reach a round end: the corners pulled the circle down, the round end came out warped by tens of millimetres, and it would not take a Ø250 template at any setting. The shop scrapped it.

The cause was the central lesson of Chapter 1. A line's true length is its length in space, and the fitting's length is only the vertical component. The longest corner line, to the 90° point, runs 152.5 mm sideways in plan while rising 350 mm, and its true length is 381.8 mm. The fix was to make the true length table first, and to check it by the rule that no line on a transition between parallel ends can be shorter than the distance between them.

```figure
type: bars
title: How short each line was when set at 350 mm
unit: mm
max: 35
caption: Shortfall against the true length, for one corner and the triangle heights. The fold line to the long-side triangle, which leans furthest in plan, was the worst.
- Triangle heights | 0.9
- Corner to φ = 0° | 15.0
- Corner to φ = 30° | 4.5
- Corner to φ = 60° | 10.9
- * Corner to φ = 90° | 31.8
```

## The ends: a flange to the fan and a spigot to the duct

The net pattern ends at the rectangle and the circle. Both ends need allowances, and they are different in kind.

The rectangular end bolts to the fan. This is an illustration. The running case's fan outlet has a flat flange, and the transition is given a 20 mm flange turned outward square to its axis, drilled to match, with a gasket between. A turned-out flange on a straight edge is a simple fold, but at each of the four corners the two flanges meet and would overlap, so each corner of the pattern is notched to remove a 20 × 20 mm square before folding. Folded, the flanges meet edge to edge at the corners and are riveted or soldered there. Many installations put a flexible connector between the fan and the transition to stop vibration travelling along the duct; the transition's flange then matches the connector's frame instead of the fan's.

The round end slips into the Ø250 duct, so it is given a 40 mm cylindrical collar, crimped, exactly like the reducer's collars in Chapter 5. The collar is developed as a straight pipe, 787.9 mm on the mean line plus seam allowance, and riveted to the transition's round end. Making the collar separately keeps the transition's pattern simple and the slip joint truly round.

Both allowances are added to the net pattern before it is cut, and the job sheet lists them separately: rectangle flange 20 mm with corner notches, round end collar separate. That is the subject of Chapter 9.

## Offset transitions

Real fans and hoods do not always line up. When the round end is offset from the rectangle's centre, the four corners are no longer alike, and each needs its own row of true lengths. The method does not change: coordinates for each corner and each circle point, plan lengths, true lengths, and the same building sequence. The spreadsheet of Chapter 7 handles it by changing the circle's centre.

A large offset can move a circle point outside the rectangle's side in plan, so that the flat triangle on that side leans outward instead of inward. The pattern is still developable, but the fold becomes a reverse fold, and the shop needs to know before forming. Checking the plan of every triangle's apex against its side, in or out, takes a moment and prevents it.

## Exercise: a square-to-round

A hood outlet is a 300 × 300 mm square, to be joined to a Ø250 duct, 300 mm long, centred. Taking the dimensions as mean-line values, find the true lengths of one corner's lines and of the triangle height, and the step along the circle.

**Worked answer.** The corner is at (150, 150) and the circle's radius is 125 mm.

- Corner to φ = 0°, at (125, 0): plan √(25² + 150²) = 152.1 mm; true length √(152.1² + 300²) = **336.3 mm**.
- Corner to φ = 30°, at (108.3, 62.5): plan √(41.7² + 87.5²) = 96.9 mm; true length **315.3 mm**.
- Corner to φ = 60° and φ = 90° mirror those: **315.3 mm** and **336.3 mm**.
- Triangle height: plan 25 mm; true length √(25² + 300²) = **301.0 mm**.
- Step along the circle: 2π × 125 ÷ 12 = **65.45 mm**.

Because the square is symmetrical about its diagonal, each corner's lines are symmetrical too, and only two true lengths, plus the triangle height, define the whole pattern.
