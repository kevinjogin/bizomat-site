---
book: exact-words-for-real-parts
chapterSlug: constructions-not-inferred-things
order: 4
title: "Constructions, not inferred things: building a hole's position from probe points"
description: "Apply Russell's maxim on logical constructions to measurement: treat a hole centre and its position error as quantities built from probe points, and check how each was built."
draft: false
---

Nobody has ever touched the centre of a hole. A coordinate measuring machine touches the wall of the hole at a handful of points, and software calculates a centre from them. An inspector with pins and a height gauge measures to the edges of a pin and works out where its centre must be. The centre is never observed. It is built.

That sounds like a philosopher's quibble until two measuring methods disagree about the same hole, as they did on the brackets. Then the question of how each centre was built becomes the whole investigation. Russell had a principle for exactly this situation, and it turns out to be good metrology.

## Russell's maxim

In a 1914 essay, "The Relation of Sense-data to Physics", Russell stated what he called the supreme maxim in scientific philosophising: "wherever possible, logical constructions are to be substituted for inferred entities." The idea is that when we find ourselves inferring the existence of something we cannot observe, we should try instead to define it as a construction out of things we can observe. If the construction works, the inference is unnecessary, and we know exactly what we are talking about.

Russell applied the maxim, with Whitehead, to physical objects, points of space and instants of time. He argued, for example, that a point need not be an invisible thing we infer; it can be defined from a series of regions that shrink around it. Whether that programme succeeded in physics is still debated. In measurement it succeeds completely, because every derived quantity is already a construction. The maxim's practical force is to make the construction explicit, so that it can be stated, checked and repeated.

```figure
type: layers
title: How a position verdict is constructed
caption: Each layer is built from the one below it. Only the bottom layer is observed. A disagreement between two inspectors can start at any layer.
- Verdict | conforms or does not conform
- Allowed tolerance | stated tolerance plus bonus from the hole's size
- Position error | twice the distance from the constructed centre to true position
- Deviation | constructed centre minus nominal, in the datum frame
- Datum frame | a plane, an axis and a direction, each constructed from its own probe points
- Centre and size | a circle fitted to the probe points by a stated method
- Probe points | X and Y coordinates where the stylus touched the wall
```

The diagram has seven layers, and six of them involve a choice. Which fitting method builds the circle? How many points, and where? Which features build the datum frame, and in what order? Change any choice and the verdict can change, with the same physical hole.

## Building the centre of one hole

This is an illustration. The first-off inspection of bracket 1 measured each clearance hole with four probe points, spaced 90° apart around the wall at mid-depth, in a coordinate system aligned to datums A, B and C. For hole 4, the hole at 45° on the pitch circle, the nominal centre is 45 × cos 45° = 31.8198 mm in X and the same in Y.

The four probe points were:

| Point | Angle on the hole | X (mm) | Y (mm) |
| --- | --- | --- | --- |
| 1 | 0° | 35.193 | 31.792 |
| 2 | 90° | 31.858 | 35.127 |
| 3 | 180° | 28.523 | 31.792 |
| 4 | 270° | 31.858 | 28.457 |

With four points at right angles, the construction is simple enough to do by hand. The centre's X is the midpoint of points 1 and 3; its Y is the midpoint of points 2 and 4. The diameter is the average of the two spans.

```figure
type: formula
title: Centre and size of hole 4 on bracket 1 from four points
formula: Xc = (X1 + X3) ÷ 2, Yc = (Y2 + Y4) ÷ 2
caption: This is an illustration. The construction assumes the four points are equally spaced and the hole is round; a least-squares fit gives the same answer under those conditions.
- Xc, Yc | constructed centre, mm
- X1, X3 | X of the points at 0° and 180°, mm
- Y2, Y4 | Y of the points at 90° and 270°, mm
step: Xc = (35.193 + 28.523) ÷ 2 = 31.858 mm
step: Yc = (35.127 + 28.457) ÷ 2 = 31.792 mm
step: diameter = ((35.193 − 28.523) + (35.127 − 28.457)) ÷ 2 = 6.670 mm
step: deviations: dX = 31.858 − 31.8198 = +0.0382 mm; dY = 31.792 − 31.8198 = −0.0278 mm
step: position error = 2 × √(0.0382² + 0.0278²) = 0.0945 mm
```

The next layer adds the bonus. The position tolerance is Ø0.3 mm at maximum material condition, which for a hole is its smallest size, 6.6 mm. A hole that is larger than its minimum gives the screw more room, so the drawing allows the extra size as extra position tolerance. Hole 4 measured 6.670 mm, so the bonus is 0.070 mm and the allowed tolerance is 0.370 mm. The position error of 0.0945 mm uses about a quarter of it.

The [True Position with Bonus Tolerance](/tools/true-position/) tool performs exactly these last layers. Enter a hole, the MMC modifier, the X and Y deviations of +0.0382 and −0.0278 mm, a tolerance of 0.3 mm, a measured size of 6.67 mm and size limits of 6.6 and 6.8 mm. It returns a position of 0.0945 mm, a bonus of 0.07 mm and an allowed tolerance of 0.37 mm, and it reports that the hole conforms. It does not construct the centre: it takes the deviations as given, so the layers below are your responsibility. It does not include datum shift, and it treats the measured size as the actual mating size, which a hole with form error will not match. It also reminds you to confirm that the deviations were measured in the drawing's datum reference frame, which is the point Chapter 7 turns on.

## The construction is part of the result

A position error of 0.0945 mm is not a fact about the hole alone. It is a fact about the hole together with four probe points, a fitting method and a datum frame. Russell's maxim says to be explicit about that. In practice, explicit means the inspection record carries, beside each result, the number and spacing of points, the fitting method and the alignment. Most measuring machine reports already contain this information. Most summaries that reach the customer strip it out.

The difference matters most when the hole is not perfectly round. A real drilled hole has some lobing or taper. A least-squares circle runs through the middle of the probe points. A maximum inscribed circle is the largest that fits inside them, which is what a screw or a gauge pin actually meets. A minimum circumscribed circle is the smallest that encloses them. On a hole with form error, the three give different centres and different sizes. None of them is the true centre, because there is no such thing apart from a construction. The question is which construction matches the function. For a clearance hole that must pass a screw, the inscribed circle is closest to how the screw sees the hole.

```figure
type: compare
title: Three ways to construct a hole from the same probe points
cols: What it builds | Matches which function
caption: On a perfectly round hole the three agree. On a real hole they differ, and the drawing standard and the inspection plan should say which one is meant.
- Least-squares circle | the circle that minimises the squared distances to the points | general shape and location; most measuring machine defaults
- * Maximum inscribed circle | the largest circle inside all the points | a pin or screw passing through: the hole's mating envelope
- Minimum circumscribed circle | the smallest circle enclosing all the points | an external feature such as a boss, by symmetry
```

## Failure: a construction built on a short arc

The failure that most often corrupts a constructed centre is not a wrong formula but poorly placed points. A circle needs at least three points. If those points are bunched together on a short arc, any small error in one of them moves the constructed centre a long way.

This is an illustration. During the investigation, a technician re-measured hole 4 on bracket 1 with a quick three-point routine. A clamp was in the way, so the points went in at 0°, 30° and 60° around the hole: a 60° arc. The middle point landed on a small burr that stood 0.005 mm proud of the true wall. Everything else was the same as the first-off.

```figure
type: bars
title: Shift of the constructed centre from a 0.005 mm error at one point
unit: µm
max: 40
caption: This is an illustration. The same 5 µm error at one point moves the centre about 37 µm when the three points span 60°, and about 3 µm when they span the whole hole at 120° spacing.
- Three points at 0°, 120° and 240° | 3.3
- * Three points at 0°, 30° and 60° | 36.9
```

The short-arc construction put the centre at X 31.890 and Y 31.811 mm, 0.037 mm from where the four-point construction placed it, and gave a diameter of 6.606 mm instead of 6.670 mm. Its position error came out at 0.142 mm, half as large again as the true value of 0.0945 mm. The bonus fell from 0.070 to 0.006 mm, because the construction had shrunk the hole. On a hole closer to its limit, that construction would have rejected a good part, or with the burr on the other side, accepted a bad one.

Detection does not require knowing the right answer. Three checks catch most short-arc constructions:

1. Look at the angular spread of the points. Less than about 180° between the outermost points is a warning; less than 120° is a reason to re-measure.
2. Compare the constructed diameter with an independent check, such as a plug gauge. A 6.6 mm plug entered hole 4 freely, so a constructed diameter of 6.606 mm, barely above the plug, was suspect.
3. Repeat with a different set of points. If the centre moves by more than a small fraction of the tolerance, the construction, not the hole, is the problem.

The correction was to unclamp, re-fixture and measure eight points equally spaced around the hole. The eight-point least-squares centre agreed with the four-point first-off within 0.003 mm.

## A different construction of the same verdict

There is another way to build the verdict that never constructs a centre at all. A functional gauge for the bracket is a plate with a spigot for datum B, a pin for datum C and four fixed pins on the 90 mm pitch circle. Each pin is made at the holes' virtual condition: the smallest hole size less the position tolerance at that size, 6.6 − 0.3 = 6.3 mm. If the bracket drops onto the gauge, every hole clears its pin, and the position requirement at maximum material condition is met, bonus included.

The gauge builds the verdict out of a physical fit rather than out of numbers. It skips the layers for centre, deviation and bonus, and goes straight from the part to conforms or does not conform. In Russell's terms it is a different construction of the same quantity, and the two constructions should agree. When they do not, one of them has been built wrongly.

This is an illustration. A 6.3 mm virtual-condition gauge would have rejected every bracket from the second set-up in seconds. A hole rotated 0.393 mm tangentially from its true position needs at least 6.3 + 2 × 0.393 = 7.09 mm of diameter to clear its pin, and the largest hole the drawing allows is 6.8 mm. The workshop did not own a gauge for CB-12, because 60 parts did not seem to justify one. The investigation cost more than a gauge plate would have.

The comparison also shows what each construction is good for. The gauge answers one question quickly and cannot say by how much a part fails. The numerical construction says how much of the tolerance each hole uses, which is what a machinist needs to correct a set-up. A sound inspection plan for a repeat order uses both: the gauge on every part, and the measuring machine on the first-off and samples, built in the datum frame.

## Constructions all the way down

The datum frame is itself a construction. Datum A, the base face, is a plane fitted to probe points on the face. Datum B is the axis of a circle or cylinder fitted to points in the bore. Datum C, the dowel hole, gives a direction from B's axis to its own constructed centre. Every hole position on the bracket is measured in that constructed frame, so every error in building the frame passes straight into every position result.

This is where Russell's maxim becomes a practical rule for writing inspection plans. Do not write "measure the position of the holes". Write how each construction is built: the number of points on each datum and hole, their spacing and depth, the fitting method, and the order in which the datum frame is established. Then any competent inspector, on any machine, builds the same quantities, and two results can be compared. Without that, two inspectors measuring the same bracket may each be correct about two different constructions.

## A construction that answers the wrong question

One more lesson waits in Chapter 7. A construction can be perfectly executed and still build the wrong quantity. The sample routine that measured brackets 36, 48 and 60 built the hole centres correctly from well-spaced points. It then built the coordinate frame not from datums B and C, but by fitting the four hole centres themselves to their nominal pattern. Every layer was correct as a calculation. The frame layer answered a different question from the one the drawing asked. The next chapters show how that happened and why it hid the fault completely.

## Exercise: construct and judge hole 6 on bracket 1

The first-off probed hole 6, the hole at 225°, at four points 90° apart: (−28.432, −31.871), (−31.775, −28.524), (−35.118, −31.871) and (−31.775, −35.218), all in mm in the datum frame. Construct its centre and diameter, find its position error, apply the bonus, and say whether it conforms. Then say what you would check before trusting the result.

**Worked answer.** The nominal centre is (−31.8198, −31.8198). The constructed centre is X = (−28.432 + −35.118) ÷ 2 = −31.775 mm and Y = (−28.524 + −35.218) ÷ 2 = −31.871 mm. The diameter is ((−28.432 − (−35.118)) + (−28.524 − (−35.218))) ÷ 2 = (6.686 + 6.694) ÷ 2 = 6.690 mm. The deviations are dX = −31.775 − (−31.8198) = +0.0448 mm and dY = −31.871 − (−31.8198) = −0.0512 mm, so the position error is 2 × √(0.0448² + 0.0512²) = 2 × 0.0680 = 0.136 mm. The bonus is 6.690 − 6.6 = 0.090 mm, so the allowed tolerance is 0.390 mm, and the hole conforms with about a third of its allowance used. Before trusting it, check that the two spans agree reasonably (6.686 and 6.694 mm differ by 0.008 mm, a hint of slight ovality), that the points were equally spaced at a stated depth, and that the frame was aligned to datums A, B and C rather than best-fitted. With slight ovality, a maximum inscribed circle would give a slightly smaller size and therefore a slightly smaller bonus, which on this hole would not change the verdict.
