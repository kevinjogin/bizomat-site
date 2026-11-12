---
book: exact-words-for-real-parts
chapterSlug: structure-and-the-best-fit-trap
order: 7
title: "Structure is not enough: datum frames, best fits and Newman's objection"
description: "Use Russell's structuralism and Newman's objection to see why a best-fit alignment can make any hole pattern look good, and why a drawing fixes the datum frame in advance."
draft: true
---

The measuring machine passed brackets 36, 48 and 60. All three came from the second set-up, and all three, it now turns out, have their four holes rotated half a degree from where the drawing puts them. The machine was calibrated. The probe points were well spaced. The centres were built correctly, as Chapter 4 described. Every number in the report was true. The report was still worthless for the question it was meant to answer.

The explanation lies in a choice made once, when the sample routine was programmed: how to line up the measured part with the drawing. It is a choice about structure. Russell built a theory of knowledge on the idea that structure is what we can know, and a Cambridge mathematician showed within a year that structure alone says almost nothing. The same argument explains the measuring machine's report.

## Russell's structuralism

In *The Analysis of Matter* (1927), Russell argued that what science tells us about the physical world is its structure. We perceive our own experiences directly. We infer that they are caused by events outside us. And the inference tells us only that the outside events stand in relations with the same logical pattern as the relations among our experiences, not what those events are like in themselves. A map tells you how towns are arranged relative to each other; it does not tell you what the towns look like.

The engineering parallel is close. A drawing, a 3D model, a machining programme and an inspection report all describe the same bracket, in different media and different coordinates. The drawing gives the holes in polar form: 45 mm radius, at 45°, 135°, 225° and 315°. The programme gives them as X and Y. The measuring machine reports them as X and Y in its own coordinates. What they share, if all is well, is structure: the same distances and angles between features. That shared structure is what lets a machinist read a drawing and a measuring machine check a part.

```figure
type: compare
title: Hole 4 described in three ways
cols: Description | What it fixes
caption: This is an illustration. The polar and Cartesian forms describe the same location relative to the datums. The pattern-only description fixes the shape of the pattern but not where it sits.
- Drawing, polar | 45 mm at 45° from the X axis set by datum C | position relative to B and C
- Programme, Cartesian | X 31.820, Y 31.820 mm from the bore centre | the same position, in other words
- * Pattern only | 63.640 mm from hole 5, 90° apart round a 90 mm circle | shape, but not orientation to the datums
```

## Newman's objection

In 1928, the mathematician M. H. A. Newman published a short critique of Russell's book in *Mind*. His point was logical. Suppose all we know about some collection of things is that there exists a relation among them with a given structure. Then, as long as the collection has enough members, that claim is guaranteed to be true: a relation with any structure you like can always be defined on a large enough collection. A claim that cannot fail tells us nothing about the world, except perhaps how many things are in it.

The claim regains content only if the relation is specified in advance, independently of the matching. "These towns are arranged like the dots on this map" says almost nothing if you may choose which town goes with which dot. It says a great deal if each dot is labelled. Russell accepted the force of the objection. Commentators have debated ever since what it means for structural theories of science.

For inspection, Newman's point is a working rule. If the measurement is allowed to choose how the measured features are matched to the nominal ones, a good match is nearly guaranteed and proves little. The match carries information only when the matching relation is fixed beforehand by something other than the features being judged.

## How the sample routine was aligned

This is an illustration. The first-off routine for bracket 1, written by the quality lead, built the coordinate frame from the datums. It probed the base face to set datum A, the bore to set the origin at datum B, and the dowel hole to set the X axis through datum C. Hole positions were then measured in that frame, exactly as the drawing's feature control frame requires.

The sample routine was written later by a technician who wanted something quicker. It probed the base face and the four holes, then asked the software to best-fit the four measured centres to their nominal positions, rotating and shifting the frame until the four errors were as small as possible together. It did not probe the bore or the dowel hole for alignment. On a bracket from the first set-up, both routines give nearly the same result, because the hole pattern and the datums agree. On a bracket from the second set-up they do not.

```figure
type: decision
title: Where does the coordinate frame come from?
question: Are the features that set the frame the same as the features being judged?
caption: Newman's point in inspection form. A frame built from the judged features can only test their shape; a frame built from the datums tests their location.
- No: the frame comes from datums A, B and C | position relative to the datums is tested | what the drawing requires
- * Yes: the frame is best-fitted to the judged holes | only the pattern's shape is tested | any rotation or shift of the whole pattern is invisible
- Partly: some datums, some judged features | depends on which freedoms are taken from the judged features | write down which, and check it against the drawing
```

## The two reports for bracket 36

During the investigation, the quality lead re-ran bracket 36 on the first-off routine, aligned to the datums, and compared the results with the sample routine's report.

This is an illustration. In the datum frame, the four hole centres measured as follows, with the nominal centres at X and Y of ±31.820 mm:

| Hole | Nominal angle | Measured X (mm) | Measured Y (mm) | Hole size (mm) |
| --- | --- | --- | --- | --- |
| 4 | 45° | 31.553 | 32.088 | 6.66 |
| 5 | 135° | −32.106 | 31.547 | 6.64 |
| 6 | 225° | −31.536 | −32.085 | 6.68 |
| 7 | 315° | 32.089 | −31.545 | 6.65 |

The [Polar Hole Position Check](/tools/polar-hole-position-check/) tool takes exactly this kind of data. Enter four holes, each with a nominal radius of 45 mm, its nominal angle, its measured X and Y and its measured diameter, then a position tolerance of 0.3 mm and size limits of 6.6 and 6.8 mm. It converts each polar nominal to X and Y, finds the distance from nominal to the measured centre, doubles it to give the position error as a diameter, adds the bonus from the hole's size, and reports the share of the allowed tolerance each hole uses. For the datum-aligned data it rejects all four holes. It measures from whatever origin and orientation your coordinates use, so it is only as good as the alignment behind them, and it does not include datum shift or perpendicularity.

The sample routine's best fit found that rotating the frame by 0.49° brought the measured holes almost onto their nominal positions, with a negligible shift. In that rotated frame the same four holes reported tiny errors.

```figure
type: bars
title: Share of allowed position tolerance used by each hole on bracket 36
unit: %
max: 240
caption: This is an illustration. Datum-aligned, every hole uses more than twice its allowance. Best-fitted, the same holes use 2% to 8%. The holes did not change; the frame did.
- Hole 4, datum frame | 210
- * Hole 5, datum frame | 233
- Hole 6, datum frame | 204
- Hole 7, datum frame | 220
- Hole 4, best fit | 5
- Hole 5, best fit | 8
- Hole 6, best fit | 6
- Hole 7, best fit | 2
```

In the datum frame, hole 5's centre sits 0.395 mm from its true position, a position error of 0.791 mm against 0.34 mm allowed with bonus. In the best-fit frame, its error is 0.029 mm. Both numbers are correctly calculated. The first answers the drawing's question: where are the holes relative to the bore and the dowel? The second answers a different question: is the pattern the right shape? The pattern was the right shape. It was in the wrong place, and the best fit, given freedom to rotate, put it in the right place on paper.

## Failure: an alignment chosen for convenience

This is the failure that let 30 unusable brackets reach the customer. It was not careless. Best-fit alignment is a legitimate tool: it is the right choice when the drawing tolerances a pattern only to itself, or when a measurement is meant to separate the shape of a pattern from its location. The fault was using it where the drawing tied the pattern to datums B and C, without noticing that the choice removed the very thing being checked.

Detection does not depend on catching a bad part. It depends on reading the routine. Three questions expose the problem:

1. Which features set each degree of freedom of the frame: the plane, the origin and the rotation?
2. Are any of those features among the features the routine then judges?
3. Does the drawing's feature control frame reference those same features, in the same order?

For the sample routine, the answers were: the base face, then a best fit of the four holes for origin and rotation; yes, all four holes; and no, the drawing references B and C. The routine was checking shape when the drawing asked for location.

There was also a clue in the data that nobody looked for. Had the sample routine also reported the dowel hole's position in its best-fit frame, the dowel would have appeared 0.43 mm out of place, a position error of 0.86 mm. That is the rotation, transferred to the one feature the best fit had not used. When a best-fitted pattern looks perfect, checking a feature outside the pattern is a cheap way to see what the fit absorbed.

The workshop corrected the problem in three steps:

1. The sample routine was rewritten to build its frame from datums A, B and C, matching the first-off routine.
2. Every measuring routine now prints its alignment at the top of the report in plain words, for example "A: plane, 8 points; B: bore centre, origin; C: dowel centre, X axis".
3. Best-fit alignment is allowed only when the inspection plan names it and states why.

## Re-inspecting the second set-up

With the corrected routine, all 30 brackets from the second set-up were measured, 120 hole-position results in all. Every hole on every bracket failed, with errors between 0.75 and 0.80 mm against allowances of 0.30 to 0.50 mm. The consistency is itself informative. A uniform rotation of about half a degree, the same on every part, points to the set-up rather than to tool wear or random error, which matches the edge-clocking fault found in Chapter 2.

Brackets 12 and 24 from the first set-up were re-run on the corrected routine too. Both passed with the largest hole using under 40% of its allowance. The first 30 brackets were sound, and the analysis that began in Chapter 1 with "your brackets don't fit" is now complete: thirty brackets, one set-up, one unmarked edge, one inspection routine that could not see the result.

## When a best fit is the right choice

None of this makes best-fit alignment wrong in itself. It is the right construction whenever the question really is about shape, and it is often the fastest way to separate two causes of error. The test is always whether the freedom the fit takes away is one the drawing leaves free.

| Situation | Best fit appropriate? | Why |
| --- | --- | --- |
| A pattern toleranced only to itself, with no datum for location | Yes | the drawing leaves location free, so the fit takes nothing the drawing requires |
| A composite tolerance whose lower segment controls the pattern's shape | Yes, for that segment only | the lower segment is about shape; the upper segment still needs the datums |
| Diagnosing whether a fault is in the pattern or in its location | Yes, alongside a datum-aligned run | the difference between the two runs is the location error |
| A pattern located to datums, as on CB-12 | No | the fit removes exactly the error the drawing controls |

The third row is how the workshop now uses best fit. Running both alignments on a first-off and comparing them separates a set-up error, which shows as a large difference between the two, from a programming or tooling error, which shows in both.

## Structure that carries information

Russell was right that structure is much of what we know, and Newman was right that bare structure is not enough. The two points fit together in measurement. A drawing communicates structure: distances, angles and the relations among features. It also fixes, through its datums, which relations count. A measurement communicates useful structure only if it uses the same fixed relations. Whenever a result has been obtained by choosing the matching that makes it look best, its agreement with the drawing should be read as a statement about shape, and nothing more.

## Exercise: read an alignment and predict what it hides

A second customer's drawing for a cover plate tolerances a six-hole pattern at Ø0.2 mm to datums A (the face), B (a 40 mm bore) and C (a slot). The supplier's report says: "Alignment: A plane; best fit of six holes, translation only." State which errors this alignment can and cannot detect, and say what you would ask the supplier for.

**Worked answer.** The plane is set by datum A, so tilt of the pattern relative to the face is tested. Rotation is not fitted, so the rotation comes from the machine's axes as the part was placed, not from datum C; whether the report can see a rotation error therefore depends on how the part was squared on the machine, which the report does not say. Translation is best-fitted to the six holes, so any shift of the whole pattern relative to the bore, datum B, is invisible: a pattern 0.3 mm off the bore centre would report as perfect. The alignment can detect errors in the pattern's shape, such as one hole out of place relative to the others, and partly its orientation. It cannot detect the pattern's location relative to B or its rotation relative to C, both of which the drawing requires. Ask for a re-run with the frame built from A, B and C in the drawing's order, or at minimum for the bore centre and slot position reported in the current frame, which will show at once how much shift and rotation the fit absorbed.
