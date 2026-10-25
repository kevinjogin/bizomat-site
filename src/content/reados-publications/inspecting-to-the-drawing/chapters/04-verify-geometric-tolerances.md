---
book: inspecting-to-the-drawing
chapterSlug: verify-geometric-tolerances
order: 4
title: "Verify geometric tolerances from the datums"
description: "Set a part up on its datums, check flatness, perpendicularity and position with shop equipment, apply bonus tolerance correctly and know when a CMM is needed."
draft: false
---

Size tolerances ask how big a feature is. Geometric tolerances ask where it is, which way it points and what shape it has, measured from a defined starting point. That starting point is the datum reference frame, and a geometric tolerance measured from anywhere else is not the requirement on the drawing, however carefully it was measured.

This chapter checks the bracket's three geometric requirements: flatness of datum A, perpendicularity of the sensor bore to datum C and position of the two mounting holes. It uses shop equipment, a surface plate, an angle plate, a height gauge, a test indicator and gauge pins, because many small shops do much of their geometric inspection that way. It also says where shop methods stop being good enough. It does not teach geometric tolerancing in full; the chapter on [connecting size to datums and geometry](/reados/publications/fits-that-work/connect-size-to-datums-and-geometry/) in *Fits That Work* and the standard the drawing cites, commonly ASME Y14.5 or the ISO geometrical product specification series, carry the detail.

## Datums are where measurement starts

A datum is a theoretically exact plane, axis or point established from a real feature of the part. The real feature is never perfect, so the datum is simulated by something much more perfect: a surface plate for a flat face, an angle plate for a second face, a pin or mandrel for a hole. The drawing's feature control frame lists the datums in order of precedence, and the order matters.

For the bracket, the frame for the mounting holes reads Ø0.2 Ⓜ A B C. That means:

1. **Datum A first.** The base underside sits on the surface plate. A real face contacts the plate on its high points, and the plate establishes the plane.
2. **Datum B second.** The long side face is brought against an angle plate square to the surface plate. It contacts the angle plate at its high points while the part stays seated on A.
3. **Datum C third.** The outside face of the upright is brought against a stop square to both. It contacts at its high point while the part stays seated on A and against B.

Changing the order changes the result. If the part were pushed against B first and then allowed to rock onto A, the frame would be a different one, and so would every measured position.

```figure
type: steps
title: Setting the bracket up on its datum reference frame
caption: Each datum is seated in order, and the set-up is not disturbed until every feature referenced to that frame has been measured.
- Clean the plate, the angle plate and the part | a chip under datum A is a measurement error
- Seat datum A on the surface plate | press down gently; it must not rock
- Bring datum B against the angle plate | keep A seated
- Bring datum C against the end stop | keep A and B seated
- Clamp lightly without distorting the part | aluminium plate deflects under heavy clamping
- *Measure every feature referenced to A, B and C | before anything is moved
```

## Flatness of datum A

Flatness controls the shape of a single surface. It refers to no datum, because it is the datum feature itself. A flatness tolerance of 0.05 means every point on the surface must lie between two parallel planes 0.05 apart.

Resting the part on a surface plate does not measure its flatness. A slightly convex face rocks; a slightly concave one sits on its edges and looks perfect. The shop method is to support the part on three adjustable jacks with datum A facing up, level the surface roughly by adjusting the jacks until indicator readings at three corners agree, and then sweep or step the indicator over a grid of points.

This is an illustration. The inspector levels the bracket's base, face up, and reads a 3 by 3 grid. The readings, in millimetres from the lowest point, run from 0.000 at one corner to 0.031 at the opposite corner, with the intermediate points between. The flatness by this method is the range: 0.031.

Two cautions apply. A range taken after imperfect levelling is always equal to or larger than the true minimum-zone flatness, so a pass by this method is safe but a marginal fail may be a levelling error rather than a bad part; re-level and re-measure before rejecting. And nine points can miss a local high spot between them. On a machined plate face, a fine grid or a continuous sweep is better; on a critical sealing face, a coordinate measuring machine or optical flat is better still.

## Perpendicularity of the sensor bore

Perpendicularity controls orientation relative to a datum. The bore's frame, ⊥ Ø0.02 C, means the bore's axis must lie within a cylinder 0.02 in diameter, perpendicular to datum C, along the full length of the bore. The bore is only 8 mm long, through the upright's thickness.

The shop method is to fit the largest gauge pin that enters the bore, stand the bracket on datum C so the bore axis is roughly vertical, and indicate the pin's side at two heights in two directions at right angles. The pin extends the short bore axis to a length that can be read.

This is an illustration. The inspector fits a pin and reads it at 10 mm and 40 mm above the plate, 30 mm apart. In the direction along the base, the readings differ by 0.030; across the base, by 0.015.

```figure
type: formula
title: Projecting the pin readings back to the bore length
caption: This is an illustration. The slope measured on the pin is scaled back to the 8 mm length the tolerance applies to.
formula: tilt over bore = (difference ÷ separation) × bore length
formula: axis deviation = √(dx² + dy²)
- separation | 30 mm between indicator heights
- bore length | 8 mm, the upright thickness
step: dx = (0.030 ÷ 30) × 8 = 0.0080 mm
step: dy = (0.015 ÷ 30) × 8 = 0.0040 mm
step: deviation = √(0.0080² + 0.0040²) = 0.0089 mm
step: Result 0.009 against a limit of 0.02: conforms
```

The method has a real limitation. A gauge pin represents the largest cylinder that fits the bore, not the bore's derived axis, and a bore that is slightly bell-mouthed or tapered will hold the pin at an angle the axis does not share. For a tolerance of 0.02 on an 8 mm bore with a 0.015 size tolerance, the pin method is adequate as a shop check with a comfortable margin. If the result had come out near 0.02, the right next step would be a coordinate measuring machine that scans the bore and constructs its axis, not a second reading with a different pin.

## Position at maximum material condition

Position controls location. The mounting holes' frame, Ø0.2 Ⓜ A B C, means each hole's axis must lie within a cylinder 0.2 in diameter, centred on its true position, which the basic dimensions locate from datums B and C with the part seated on A. The Ⓜ symbol means maximum material condition applies: the tolerance grows as the hole departs from its smallest size.

The calculation has two parts. First, the measured position: the diameter of the smallest zone, centred on true position, that contains the axis.

```figure
type: formula
title: Position and bonus tolerance for a hole at MMC
caption: The position result is a diameter, so the radial offset is doubled. The bonus comes from the hole's actual size, measured in Chapter 5.
formula: position = 2 × √(Δx² + Δy²)
formula: allowed = stated tolerance + (actual size − MMC size)
- Δx, Δy | measured coordinates minus basic coordinates, mm
- MMC size | smallest permitted hole, 6.60 mm
```

This is an illustration. With the bracket seated on A, B and C, the inspector measures each hole's centre with a height gauge and test indicator, using a gauge pin in each hole, and records the coordinates from datums C and B. Hole size comes from the measurement in Chapter 5.

```figure
type: compare
title: Position results for the two mounting holes
cols: Hole 8.1 | Hole 8.2
caption: This is an illustration. Hole 8.2 is within its size limits and within ±0.1 of its basic coordinates in one direction, but its position fails.
- Basic coordinates from C and B | 30.00, 25.00 | 65.00, 25.00
- Measured coordinates | 30.06, 24.95 | 65.11, 25.04
- Δx, Δy | +0.06, −0.05 | +0.11, +0.04
- Position, 2√(Δx² + Δy²) | 0.156 | 0.234
- Measured hole size | 6.68 | 6.61
- Bonus, size − 6.60 | 0.08 | 0.01
- Allowed, 0.2 + bonus | 0.28 | 0.21
- *Decision | conforms | does not conform
```

Note what the bonus does and does not do. Hole 8.1 is larger than its MMC size, so its zone grows to 0.28 and its position of 0.156 passes easily. Hole 8.2 is close to its MMC size, so it gets almost no bonus, and its 0.234 fails against 0.21. Bonus is earned by the actual size of the individual hole; it is not shared between holes, and it does not apply at all to a hole that is outside its size limits.

Where a customer accepts a position result only because of bonus tolerance, some first article formats ask for that to be stated, with the actual position and the words that the result was accepted at MMC. Record the actual position, the actual size and the allowed value for every position balloon, whether or not bonus was needed, and the reader can check the arithmetic.

## The error: checking hole spacing instead of position

This is an illustration. On the first trial bracket, a machinist checking at the machine measured the centre distance between the two mounting holes with a caliper and two pins: 35.05 mm. The drawing's basic dimensions put the holes at 30 and 65 from datum C, 35 apart, and the general tolerance is ±0.1, so 35.05 looked comfortably inside.

It was the wrong check twice over. Basic dimensions carry no general tolerance; they are exact, and the tolerance comes from the feature control frame. And the frame controls each hole's location from datums A, B and C, not the holes' distance from each other. Measured from the datums, the same part had hole 8.2 at 0.234 against an allowed 0.21. The holes were close to each other, but the pair had shifted away from datum C, so they would not line up with a mounting pattern located from the bracket's outside face.

The inspector found the error when building the first article record, because the position line asked for coordinates from datums and the machinist's record had a spacing. The cause of the shift was a fixture stop that had been knocked 0.1 mm out of place, which Chapter 9 follows up. The correction to the method was to replace the machine-side check with a simple go gauge: a plate with two pins at the true positions, sized at the holes' MMC minus the position tolerance, located against faces matching datums B and C. A bracket that drops onto the gauge has holes in position.

## When the datum feature itself is the problem

Every geometric result depends on the datum features being sound. A burr on the edge of datum A, a chip of swarf under it, or an anodising rack mark on it lifts one corner of the part off the plate, and every height and position measured from that set-up inherits the tilt. The error is systematic: it moves every reading the same way, so repeating the measurement does not reveal it.

Three habits catch most of these problems. First, check the datum features before setting up: run a fingertip and a clean cloth over datum A, look for burrs on its edges, and confirm that the flatness of datum A has been measured before it is used as a reference for anything else. Second, check that the part is seated: with the part on the plate, press gently on each corner in turn while watching an indicator on the opposite corner; any movement means it rocks. Third, measure one known feature twice from different set-ups. If the bore height from datum A reads the same with the part seated normally and after it has been lifted, cleaned and reseated, the set-up is repeatable.

The bracket's customer specification forbids rack marks on datum A for exactly this reason. A rack contact point leaves a small raised or bare spot, and on a datum face that spot becomes the part's support point on the customer's assembly as well as on the inspector's plate.

## Recording geometric results

A geometric result should be recorded as a number, not as "OK", and it should be recorded with enough of the method that someone else could repeat it. For the bracket, the inspector records for balloon 6 the flatness value and the grid used; for balloon 12, the pin size, the two heights, the four readings and the computed deviation; for balloons 8.1 and 8.2, the measured coordinates, the hole sizes, the computed position, the bonus and the allowed value.

That level of record looks heavy on a part with three geometric tolerances. It pays for itself the first time a customer queries a result, because the question "how did you measure it?" can be answered from the record rather than from memory.

## When shop methods are not enough

Surface plate methods are powerful, cheap and transparent; every step can be watched and repeated. They become unreliable when the tolerance is small compared with the uncertainty of the set-up, when the datum features are curved or irregular, when there are many features referenced to complex frames, or when form must be assessed with a fitted reference rather than a range.

```figure
type: decision
title: Surface plate or coordinate measuring machine?
question: Can the set-up uncertainty be held well below the tolerance with plate, angle plate and indicator?
- Yes, comfortably | Use shop methods | record the set-up and the readings so the method can be repeated
- *Only just | Use a CMM or ask the customer | a marginal method produces marginal decisions; see Chapter 6
- No | Use a CMM or a dedicated gauge | or raise a query if the tolerance seems unachievable to measure
```

A coordinate measuring machine is not automatically better. Its program has to build the same datum reference frame, in the same order, from the same features, and a program written carelessly can measure the wrong thing very precisely. Check a new CMM program against a part also measured by another method before trusting it on a batch.

## Exercise: position with bonus

A plate has a Ø8.0 +0.15/0 hole with a position tolerance of Ø0.1 at MMC to datums A, B and C. The basic coordinates are 20.00 from B and 40.00 from C. A part measures 20.04 from B and 40.05 from C, and the hole measures 8.09. Does the hole conform? What is the smallest hole size at which this location would still pass?

**Answer.** The offsets are 0.04 and 0.05, so position = 2 × √(0.04² + 0.05²) = 2 × 0.0640 = 0.128. The hole is within its size limits of 8.00 to 8.15. MMC is 8.00, so the bonus is 8.09 − 8.00 = 0.09 and the allowed position is 0.1 + 0.09 = 0.19. The hole conforms. To find the smallest size that still passes at this location, set 0.1 + (size − 8.00) = 0.128, which gives a size of 8.028. A hole at 8.03 would pass; a hole at 8.02 at the same location would not. The arithmetic shows why size and position must be measured on the same hole in the same record: neither result alone decides the position balloon.
