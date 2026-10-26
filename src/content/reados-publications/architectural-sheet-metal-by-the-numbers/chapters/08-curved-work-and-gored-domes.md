---
book: architectural-sheet-metal-by-the-numbers
chapterSlug: curved-work-and-gored-domes
order: 8
title: "Curved work and gored domes"
description: "Make profiles follow curves by segmenting them, choosing the number of segments from the sagitta and cutting small-angle mitres, then develop a domed finial from flat gores with calculated widths."
draft: false
---

Buildings curve. Canopies sweep round corners on plan, bay windows bow outwards, and finials and domes cap posts and turrets. Sheet metal is flat, and a folded profile resists being bent on plan, because its flanges must stretch on the outside of the curve and compress on the inside. There are two broad ways to make sheet metal follow a curve: form it continuously, with machines that stretch and shrink the flanges, or approximate the curve with many short straight pieces. For domes, the equivalent is to build the curved surface from narrow flat strips called gores, each curved in one direction only. Both approaches are old, and both reduce to calculations a fabricator can do before cutting anything.

This chapter takes W-40's curved work through by numbers. It considers a curved version of the entrance canopy, chooses how many straight segments its fascia needs from the sagitta, the gap between each segment and the true curve, cuts the small-angle mitres between segments using Chapter 3's factor, compares segmenting with continuous curving, and then develops a 300 mm domed finial from twelve gores. The failure case is a four-segment mock-up that looked like a polygon, not a curve.

## The curved canopy

The architect proposed an alternative canopy whose front edge sweeps round a **quarter circle of 6 m radius** on plan, from the facade out and across the entrance. The canopy's fascia, the same profile as in Chapter 1, would follow that curve. The arc's length, along its centre line, is **6,000 × π ÷ 2 ≈ 9,425 mm**.

A straight piece of profile laid along a curve touches it at its ends and stands away from it in the middle. The gap at the middle is the **sagitta**: for a segment spanning an angle θ of the curve, it is **R × (1 − cos(θ ÷ 2))**. The more segments, the smaller each angle and the smaller the sagitta, so the closer the segmented fascia looks to a true curve.

```figure
type: compare
title: A quarter circle of 6 m radius in straight segments
cols: Chord of each segment | Sagitta, gap at mid-segment | Mitre angle between segments
caption: This is an illustration. The sagitta is how far each straight segment stands off the true curve at its middle. At 8 segments the fascia deviates about 29 mm, which reads as a curve from the street; at 4 it deviates over 100 mm and reads as a polygon.
- 4 segments | 2,341.1 mm | 115.3 mm | 157.5°
- *8 segments | 1,176.2 mm | 28.9 mm | 168.75°
- 12 segments | 784.8 mm | 12.8 mm | 172.5°
- 16 segments | 588.8 mm | 7.2 mm | 174.4°
```

## Choose the number of segments

The choice balances appearance against work. Each extra segment adds two mitres, a lap and a mitre's worth of fitting time. Too few, and the canopy looks faceted. The architect and fabricator agreed on **8 segments**, each about 1,176 mm long, as a first proposal, and tested it with the mock-up described below. At that count, each segment stands about **29 mm** off the curve at its middle, and the corners between segments are each 168.75°, turning only 11.25°.

## Small-angle mitres

Each joint between segments is a mitre at an angle of 168.75° between the two runs, the same kind of corner as in Chapter 3, only far more open. The factor is **k = 1 ÷ tan(168.75° ÷ 2) ≈ 0.0985**, so each ordinate is about one tenth of the point's projection. For the fascia, with projections of 0, 40, 40, 90, 90 and 70 mm, the ordinates are about **0, 3.9, 3.9, 8.9, 8.9 and 6.9 mm**.

```figure
type: formula
title: Mitre ordinates between curved-fascia segments
formula: φ = 180° − (90° ÷ number of segments)        ordinate = d ÷ tan(φ ÷ 2)
caption: This is an illustration for 8 segments round a quarter circle. The ordinates are small, so they must be marked carefully; an error of 2 mm is a fifth of the largest.
- Number of segments | 8
- Angle turned at each joint | 90° ÷ 8 = 11.25°
step: corner angle φ = 180° − 11.25° = 168.75°
step: k = 1 ÷ tan 84.375° ≈ 0.0985
step: ordinate at the main face, d = 90: 90 × 0.0985 ≈ 8.9 mm
```

Because the ordinates are so small, the joints are easy to seal and nearly invisible, which is part of the appeal of a segmented curve. The segment lengths are set along the profile's fixing line, where d = 0, and every segment is identical except the two at the ends, which meet the facade and a straight run.

## Set out the curve on site

A 6 m radius cannot be swung from a centre point on most sites, because the centre is somewhere in the car park or inside the building. The curve is set out instead by **offsets from a chord**. For each segment, a straight line is struck between its two ends, 1,176.2 mm apart, and the curve's distance from that line is measured off at intervals. Measured from the chord's midpoint, the offsets are about **28.9 mm** at the middle, **27.1 mm** at 147 mm either side, **21.7 mm** at 294 mm, **12.7 mm** at 441 mm and **0** at the ends, 588.1 mm out. Each offset is the difference between √(R² − x²) and the same quantity at the chord's end.

The canopy's edge beam is set to that curve, and the segment ends are marked on it where the chords meet the curve. The segmented fascia then touches the beam at every segment end and stands off it by the sagitta at every middle, which the fixing brackets are packed to suit. The offsets also let the installer check the beam before the fascia arrives, so a beam built to the wrong radius is found early.

## Curved copings and cappings

A curved parapet's coping raises one more difficulty: its top flat is no longer a rectangle but part of a ring, wider on the outside of the curve than the inside by the same proportion as the radii. Segmenting solves it in the same way as for the fascia. Each segment's top is a flat trapezoid, its outer edge longer than its inner edge, and the legs are straight lengths cut to the outer and inner chords. On a 6 m radius with a 240 mm top, the outer and inner chords of an 11.25° segment differ by about 47 mm, so each segment's blank is cut as a trapezoid rather than a rectangle, with the small-angle mitres at its ends. The calculation for each edge is the chord formula at the edge's own radius.

## Segmenting or curving continuously

The alternative to segmenting is to curve the profile continuously, on a machine that crimps or stretches its flanges. On a 6 m radius, a point 90 mm out from the fixing line lies on a curve about **1.5%** larger than the fixing line, so its flat must stretch by about that much relative to the back. Thin steel can be stretched that far, and curving machines do it routinely for gutters and simple fascias. Complex profiles with several flanges at different projections, like W-40's fascia, are harder, because each flange needs a different amount of stretch and the bevels can buckle.

```figure
type: checklist
title: Segmented or continuously curved fascia
caption: This is an illustration of the decision for W-40's curved canopy. A continuously curved fascia was quoted by a specialist; the segmented version was made in the fabricator's own shop.
- Appearance from the street | continuous: a true curve; segmented: a curve with faint joints every 1.2 m
- Profile complexity | segmenting suits any profile; curving suits simple ones best
- Equipment | segmenting needs only the shop's guillotine and brake
- Joints | segmenting adds seven joints; curving needs only laps between lengths
- ? Cost | depends on quantity and the specialist's price; compared for this job
- x Forcing a straight folded profile round a curve on site | the flanges buckle and the face distorts
```

## The domed finial

At one end of W-40's parapet, a flagpole base is capped by a **domed finial**, a hemisphere **300 mm** in diameter. A dome is curved in two directions, so it cannot be made from one flat sheet without stretching. It can be made from **gores**: narrow, pointed strips, each running from the base to the top, each curved in only one direction, which together approximate the hemisphere. They are the same shapes as the segments of a peeled orange or the panels of a beach ball.

The finial uses **12** gores. At the base, the equator of the hemisphere, the circumference is **π × 300 ≈ 942.5 mm**, so each gore is **942.5 ÷ 12 ≈ 78.5 mm** wide. Going up, the circle round the dome at any height is smaller, in proportion to the cosine of the latitude, the angle up from the base measured at the dome's centre, and each gore narrows in the same proportion, to a point at the top. Each gore's length, measured along its centre line from base to top, is a quarter of the sphere's circumference, **π × 300 ÷ 4 ≈ 235.6 mm**.

```figure
type: compare
title: Width of each of the finial's 12 gores at its latitudes
cols: Distance up the gore's centre line | Width of the gore
caption: This is an illustration for a 300 mm hemisphere. Distance up the centre line = 150 × latitude in radians; width = 78.5 × cos(latitude). Seam allowances are added outside these lines.
- Base, latitude 0° | 0 mm | 78.5 mm
- 15° | 39.3 mm | 75.9 mm
- 30° | 78.5 mm | 68.0 mm
- 45° | 117.8 mm | 55.5 mm
- 60° | 157.1 mm | 39.3 mm
- 75° | 196.3 mm | 20.3 mm
- *Top, 90° | 235.6 mm | 0 mm, a point
```

On the flat sheet, the fabricator draws a centre line 235.6 mm long, marks the seven stations up it, sets off half each width either side, and joins the points with a smooth curve, a flexible batten bent through them. Each gore is curved over a stake in its length direction only, and the gores are joined edge to edge with small lapped and riveted, or soldered, seams. A seam allowance of a few millimetres is added to one edge of each gore, outside the calculated outline. The top, where twelve points meet, is covered with a small turned or spun cap.

More gores give a smoother dome. Eight gores, each **117.8 mm** wide at the base, would show clear facets on a dome this size; sixteen, each **58.9 mm** wide, would be smoother but double the seams. Twelve was the agreed balance.

## Check the dome, and know the alternatives

As the gores are joined, the fabricator checks the dome against three numbers: its base must be a circle of 300 mm diameter, measured across several diameters; its height must be 150 mm above the base; and every gore's seam must run in a smooth line from base to top. A gore cut a little wide at its middle shows as a ridge; one cut narrow, as a hollow. Small errors are worked out on a stake as the seams are closed; large ones mean a gore is re-cut.

Gores are not the only way to make a dome. A **spun** dome, formed on a lathe from a single disc over a former, is perfectly smooth and seamless, and for a run of identical finials it can be cheaper than gores. A **pressed** dome needs a die and suits large quantities. For a single 300 mm finial in a small shop, gores made from offcuts of the coping material match its colour exactly and need no outside supplier, which is why W-40's fabricator chose them.

## The shop drawing and take-off

Every piece in this book ends up on a shop drawing and a take-off. For W-40's front, the shop drawing set lists each profile from the register, with its girth and stretch-out; each corner with its measured angle, ordinates and hand; the raking profile with its pitch; each flashing with its pattern and the order of installation; the coping's groups, expansion joints and clip spacing; and the curved canopy's segments and the finial's gores. The take-off counts lengths, corner pieces, soakers, clips, rivets and sealant from the same drawing. How such a take-off becomes a price is covered in *Quoting Sheet Metal Work by the Numbers*.

## A failure case: the polygon canopy

This is an illustration. The architect's first sketch suggested four segments for the curved canopy, to keep the number of joints down. The fabricator made a short mock-up of two adjacent segments at full size and set it up in the yard against a chalk line of the true 6 m curve.

Each segment stood **115 mm** off the curve at its middle. From across the street, the canopy would have read as a series of straight lines with obvious angles between them, a polygon rather than a sweep. The architect, seeing the mock-up, rejected four segments at once.

The detection came from the full-size mock-up against the true curve, which made the sagitta visible before anything was made for the building. The correction was the eight-segment design, checked with a second mock-up whose 29 mm sagitta read as a smooth curve from the street. The fabricator now gives architects a sagitta table, like the one above, at the first meeting about any curved work.

## How this applies to a small Australian business

When a profile must follow a curve, calculate the sagitta for each possible number of segments and choose the count from what the eye will accept at the viewing distance, confirmed with a full-size mock-up. Cut the small-angle mitres with Chapter 3's factor, marking the tiny ordinates carefully. Compare segmenting with continuous curving for each profile. For domes, develop gores from the circumference and the cosine of each latitude, add seam allowances outside the calculated outline, and choose the number of gores for smoothness against seams. Put every number on the shop drawing, so the take-off and the quote follow from it.

## Exercise: twelve segments

The architect asks what twelve segments would look like on the 6 m radius quarter circle. What is the angle turned at each joint, the corner angle, the sagitta and the factor k? What is the mitre ordinate at the fascia's main face, d = 90 mm?

**Worked answer.** Each joint turns **90° ÷ 12 = 7.5°**, so the corner angle is **172.5°**. Each segment spans 7.5° of the curve, so the sagitta is **6,000 × (1 − cos 3.75°) ≈ 12.8 mm**, and the chord about 784.8 mm. The factor is **k = 1 ÷ tan 86.25° ≈ 0.0655**, so the ordinate at d = 90 mm is **90 × 0.0655 ≈ 5.9 mm**. Twelve segments would read as a smoother curve than eight, at the cost of four more joints and ordinates small enough that marking accuracy becomes the limit.
