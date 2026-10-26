---
book: sheet-metal-patterns-by-the-numbers
chapterSlug: elbows-mitres-and-segmented-bends
order: 3
title: "Elbows: mitres and segmented bends"
description: "Develop a two-piece mitre and a five-piece segmented elbow, find joint angles, throat and heel lengths, cut all segments from one strip, and catch an elbow that turns only 72°."
draft: false
---

An elbow turns a duct through an angle. The simplest is a two-piece mitre: two pipes cut on a slant and joined. A smooth bend would carry air and dust with less resistance, but a torus cannot be developed, so sheet metal elbows approximate it with short straight pieces, each a cylinder cut on a slant at both ends. The more pieces, the closer the approximation and the more seams to make.

This chapter develops both kinds for the running case's Ø250 duct: a 90° mitre, and the five-piece segmented elbow on a 375 mm centreline radius that the job actually uses. It shows how to cut every segment of the elbow from one strip of sheet without waste, and ends with an elbow that came out 18° short of square.

## The two-piece mitre

A 90° mitre is two pipes, each cut at 45° to its axis. The cut line is the slant cut of Chapter 2 with α = 45°, and since tan 45° = 1, the ordinate at each line is simply R × (1 − cos φ). On the Ø250 duct's mean radius of 125.4 mm, the ordinates above the shortest generator are 0, 16.8, 62.7, 125.4, 188.1, 234.0 and 250.8 mm at lines 0 to 6. The difference between the shortest and longest generator, the throat and heel of the mitre, is the full mean diameter.

Both pieces come from one pattern. Set out the pattern once, cut it, and the offcut above the curve is the pattern for the other piece turned over. For a pair of pipes of equal length each side of the mitre, the two blanks can be cut from one rectangle with a single curved cut, so the mitre costs no more sheet than a straight pipe of the same total length.

A mitre is cheap to make and poor for airflow. Air turning a sharp corner separates from the inside wall, and the pressure loss through a mitred elbow is several times that of a radiused one. Duct design guides tabulate loss coefficients for each kind of elbow, and an extraction system designer will usually specify radiused or segmented elbows for that reason. The running case's designer has specified a five-piece elbow with a centreline radius of 1.5 diameters.

## How a segmented elbow is built

A segmented elbow, also called a gored or lobster-back elbow, is a chain of short cylinders. The two **end pieces** are half segments: square at the outer end, so they fit the straight duct, and cut on a slant at the inner end. Between them are **full segments**, cut on a slant at both ends. Each joint between pieces turns the duct through the same angle, the **joint angle**.

The arithmetic depends on counting joints, not pieces. An elbow of N pieces has N − 1 joints. To turn through a total angle Θ:

joint angle = Θ ÷ (N − 1)

Each cut plane bisects its joint, so it lies at half the joint angle from square. A full segment is cut at that half angle at each end, and an end piece at one end only.

For the running case, N = 5 and Θ = 90°, so there are 4 joints of 22.5°, and every cut is at 11.25° from square. Tan 11.25° = 0.1989.

```figure
type: formula
title: Segment lengths for a segmented elbow
formula: joint angle = Θ ÷ (N − 1)        β = joint angle ÷ 2
formula: centreline length of a full segment = 2 × C × tan β
formula: throat = 2 × (C − R) × tan β        heel = 2 × (C + R) × tan β
caption: The running case's five-piece 90° elbow, Ø250 in 0.8 mm sheet, centreline radius 375 mm, mean radius 125.4 mm.
- Θ | Total angle the elbow turns through
- N | Number of pieces, including the two half-segment ends
- C | Centreline radius of the elbow
- R | Mean radius of the duct
step: Joint angle = 90 ÷ 4 = 22.5°, so β = 11.25° and tan β = 0.1989
step: Full segment on the centreline = 2 × 375 × 0.1989 = 149.2 mm
step: Throat = 2 × 249.6 × 0.1989 = 99.3 mm; heel = 2 × 500.4 × 0.1989 = 199.1 mm
step: Each end piece = 375 × 0.1989 = 74.6 mm on the centreline, plus its straight tangent
```

## Developing a segment

A full segment is symmetrical about its middle plane, the plane square to its axis halfway along it. Develop half of it and mirror the result.

Measure the angle φ around the segment from the throat, the line on the inside of the bend. A generator at angle φ lies at a distance C − R cos φ from the elbow's centre of curvature, and the cut plane through the joint meets it at a distance (C − R cos φ) × tan β from the middle plane. So the half-length of each generator is:

h(φ) = (C − R cos φ) × tan β

At the throat, φ = 0, that is (375 − 125.4) × 0.1989 = 49.6 mm, half of the 99.3 mm throat. At the heel, φ = 180°, it is (375 + 125.4) × 0.1989 = 99.5 mm, half of the 199.1 mm heel. Between them the half-lengths follow the same cosine shape as Chapter 2's slant cut, offset by the throat length.

```figure
type: compare
title: Half-lengths of a full segment from its middle plane
rowhead: Line
cols: Angle from throat | Half-length, mm | Full length, mm
caption: Ø250 duct, 375 mm centreline radius, cuts at 11.25° from square. Lines 7 to 12 repeat lines 5 to 0. The end pieces use the half-length column, measured from their square end plus the 50 mm tangent.
- 0 and 12, throat | 0° | 49.6 | 99.3
- 1 and 11 | 30° | 53.0 | 106.0
- 2 and 10 | 60° | 62.1 | 124.2
- 3 and 9 | 90° | 74.6 | 149.2
- 4 and 8 | 120° | 87.1 | 174.1
- 5 and 7 | 150° | 96.2 | 192.4
- * 6, heel | 180° | 99.5 | 199.1
```

The pattern for a full segment is laid out on a centre line, the middle plane unrolled, with the girth of 787.9 mm divided into 12 spaces of 65.66 mm. On each division, mark the half-length above and below the centre line and draw the two cut curves through the marks. The segment is a lens-shaped band, narrowest at the seam if the seam is on the throat, widest at line 6.

The end pieces are developed from a straight base line. The running case's end pieces have a 50 mm straight tangent before the first cut, so each generator is 50 mm plus its half-length: 99.6 mm at the throat and 149.5 mm at the heel, with the cut curve between.

## Cutting all five pieces from one strip

Look at two neighbouring segments. The cut curve at the top of one is the cut curve at the bottom of the next, mirrored. If every second segment is turned through 180° about its own axis, so that its throat lies where its neighbour's heel was, the curves match exactly and the segments can be cut from one continuous strip, each cut serving two pieces.

The strip is the full blank width, 805.9 mm with seam allowances, and its length is the sum of the centreline lengths of all the pieces: three full segments of 149.2 mm and two end pieces of 74.6 + 50 = 124.6 mm, a total of **696.7 mm**. The pieces are marked out one after another along the strip, the curves alternating in direction, and cut apart with snips along each curve. Nothing is wasted except the seam corners.

Turning alternate segments has a consequence: their seams alternate between throat and heel. That is usually welcome, because a line of seams on one side of an elbow makes a stiff ridge that resists forming. The shop marks each segment with its number and an arrow for airflow before cutting, because five similar curved bands are easy to assemble in the wrong order.

```figure
type: svg
title: The five-piece elbow and its strip
alt: Left, an elevation of the segmented elbow turning 90 degrees, made of two end pieces and three full segments arranged around a centreline arc of radius 375 mm. Right, a strip of sheet divided by four wavy cut lines into five pieces, the curves alternating direction, with the end pieces at each end of the strip.
caption: This is an illustration, not to scale. Alternate segments are turned through 180° so that each cut serves two pieces, and the 696.7 mm strip yields all five without waste.
viewbox: 0 0 640 300
body:
<path class="cl" d="M40 260A220 220 0 0 1 260 40"/>
<path class="li" d="M70 260V214L80 166L104 126L139 94L180 72L220 64H260"/>
<path class="li" d="M10 260V202L23 140L57 80L106 36L164 4"/>
<path class="lf" d="M70 214L10 202M80 166L23 140M104 126L57 80M139 94L106 36"/>
<text class="txs" x="12" y="284">End piece</text>
<text class="txs" x="120" y="150">Throat</text>
<text class="txs" x="30" y="40">Heel</text>
<text class="txa" x="150" y="190">C = 375</text>
<rect class="bx" x="330" y="40" width="290" height="230"/>
<path class="la" d="M382 40C392 100 392 210 382 270M435 40C425 100 425 210 435 270M494 40C504 100 504 210 494 270M552 40C542 100 542 210 552 270"/>
<text class="txs" x="338" y="160">End</text>
<text class="txs" x="397" y="160">1</text>
<text class="txs" x="455" y="160">2</text>
<text class="txs" x="515" y="160">3</text>
<text class="txs" x="575" y="160">End</text>
<text class="txs" x="400" y="290">Strip 696.7 × 805.9 mm</text>
<text class="txs" x="330" y="30">Alternate curves share one cut</text>
```

## How many pieces

More pieces make a smoother bend and cost more labour: each piece needs a seam, and each joint needs a lap or a rivet line and sealing. The running case's choice of five pieces is common for a 90° elbow at a centreline radius of 1.5 diameters, but the arithmetic for other choices is the same.

One measure of smoothness is how far the corners of the segmented centreline stand outside the true arc. The centreline of a segmented elbow is a polygon whose corners lie at the joints, a distance C ÷ cos β from the centre of curvature instead of C. For the running case's radius of 375 mm, that excess is 155.3 mm for a two-piece mitre, 30.9 mm for three pieces, 13.2 mm for four, 7.4 mm for five and 4.7 mm for six. Five pieces put every corner within about 2% of the radius, which is why five is a common choice at this size.

```figure
type: compare
title: Ø250 elbows at 375 mm centreline radius by number of pieces
rowhead: Pieces
cols: Joints | Joint angle | Full segment on centreline, mm | Corner outside the arc, mm
caption: The two-piece mitre is the limiting case: one joint of 90° and no full segments. Its throat is a sharp corner.
- 2, mitre | 1 | 90° | none | 155.3
- 3 | 2 | 45° | 310.7 | 30.9
- 4 | 3 | 30° | 201.0 | 13.2
- * 5 | 4 | 22.5° | 149.2 | 7.4
- 6 | 5 | 18° | 118.8 | 4.7
```

## How tight a radius

The same formulas show why a segmented elbow cannot be made on a very tight radius. The throat length is 2 × (C − R) × tan β, so it shrinks as the centreline radius approaches the duct's radius and becomes zero when C = R. At that point every cut plane passes through the same point on the inside of the bend, the segments meet at a knife edge on the throat, and the inside of the elbow is a sharp corner, no better for airflow than a mitre.

For the running case's duct, C = R means a centreline radius of 125.4 mm, half a diameter. At the specified 375 mm, 1.5 diameters, the throat of each full segment is 99.3 mm, long enough to roll, seam and lap without difficulty. At one diameter, C = 250.8 mm, the throat would be 2 × 125.4 × 0.1989 = 49.9 mm. That is still workable, but the lap at each joint takes a larger share of each segment, and hand slip rolls struggle to form a band that narrow at the throat without kinking it.

The practical limit is set by the shop's equipment and the joint, not by geometry alone. A shop that laps each joint by 10 mm needs a throat comfortably longer than two laps, and a check of the throat length on the job sheet before cutting saves a strip of sheet when a designer has asked for a radius the shop cannot form.

## Assembly and checking

Segments are joined by a lap, the end of one segment slipping inside the next, or by a flanged or riveted joint, and the lap allowance is added to one end of each piece, as Chapter 9 explains. Whichever is used, two checks catch most faults before the elbow is fitted.

First, lay the formed elbow on a flat bench with one end piece's square end against a straight edge. The other end should be square to it, which a large steel square or a 3-4-5 triangle on the bench confirms. Second, measure the throat and heel of each full segment. A segment whose throat is 99 mm and heel 199 mm is right; one whose throat and heel are both close to 149 mm has been cut square by mistake, and one whose heel is short has been turned the wrong way.

The centreline length is a useful overall check. From the start of one tangent to the end of the other, measured around the centreline polygon, the elbow is 50 + 74.6 + 3 × 149.2 + 74.6 + 50 = 696.7 mm, the same as the strip it was cut from.

## The error: an elbow that turned 72°

This is an illustration. A second five-piece elbow was set out from memory by a worker used to six-piece elbows. Remembering that a 90° elbow "divides by the number of pieces", the worker took 90 ÷ 5 = 18° as the joint angle and cut every segment at 9° from square.

The elbow had four joints of 18°, so it turned through 72°. Its half-length table was also wrong at every line: with tan 9° = 0.1584, the full segment was 2 × 375 × 0.1584 = 118.8 mm on the centreline instead of 149.2, and the whole strip was 575.2 mm long instead of 696.7 mm. The fault was found at the bench square check before the elbow left the shop, because the outlet end stood 18° away from square.

The rule that prevents it is to count joints, not pieces, and to write the joint angle on the job sheet: "5 pieces, 4 joints at 22.5°, cuts at 11.25°". The worker's six-piece habit was right for six pieces, which have five joints of 18°; the mistake was carrying the number to a different elbow. A second, independent check is the strip length. A five-piece 90° elbow at 375 mm radius is 696.7 mm long on the centreline including its two 50 mm tangents. A strip of 575 mm is the wrong elbow, whatever its curves look like.

## Exercise: a 60° elbow in Ø150

A Ø150 duct in 0.8 mm sheet needs a 60° elbow in four pieces on a centreline radius of 225 mm. Find the joint angle, the cut angle, the centreline length of a full segment, its throat and heel, and the half-lengths at lines 0, 3 and 6.

**Worked answer.** Four pieces have **3 joints**, so the joint angle is 60 ÷ 3 = **20°** and each cut is at **10°** from square. Tan 10° = 0.1763. The mean radius is 150.8 ÷ 2 = 75.4 mm.

- Full segment on the centreline: 2 × 225 × 0.1763 = **79.4 mm**.
- Throat: 2 × (225 − 75.4) × 0.1763 = **52.8 mm**.
- Heel: 2 × (225 + 75.4) × 0.1763 = **105.9 mm**.
- Half-lengths: line 0, (225 − 75.4) × 0.1763 = **26.4 mm**; line 3, 225 × 0.1763 = **39.7 mm**; line 6, (225 + 75.4) × 0.1763 = **53.0 mm**.

Each end piece is 39.7 mm on the centreline plus its tangent. A check: the line 3 half-length is always C × tan β, half the full segment's centreline length, and 39.7 is half of 79.4.
