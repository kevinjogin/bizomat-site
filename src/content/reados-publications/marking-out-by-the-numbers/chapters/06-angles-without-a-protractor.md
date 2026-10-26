---
book: marking-out-by-the-numbers
chapterSlug: angles-without-a-protractor
order: 6
title: "Angles without a protractor"
description: "Set out angles from lengths by the tangent and chord methods, use the steel square as an angle table, read roof pitch in all its old and new forms, and know how accurate each method is."
draft: false
---

A protractor is the obvious tool for an angle, and on sheet metal it is usually the wrong one. A shop protractor has a radius of perhaps 75 or 100 mm, so a line drawn from it is fixed over only that length, and its graduations are read to about half a degree. Half a degree is 8.7 mm over a metre. For anything longer than the protractor, an angle should be set out from lengths, which can be measured far more accurately than a small arc can be read.

There are two ways to turn an angle into lengths: the tangent method, which uses a run and a rise at right angles, and the chord method, which uses an arc and a chord. This chapter works through both with their errors, then turns to the steel square, which tinsmiths used as an angle table for generations, and tests an old table of square settings against exact trigonometry. It ends with a roof whose pitch was written in an old notation and read as a different angle altogether.

## The tangent method

An angle θ at a point on a datum line is set out by measuring a run L along the line, erecting a perpendicular at its end and marking a rise of L × tan θ on it. The line from the vertex through the top of the rise makes the angle θ with the datum.

```figure
type: compare
title: Rise and chord for common angles, run or radius 500 mm
rowhead: Angle
cols: Tangent method: rise on a 500 mm run | Chord method: chord on a 500 mm radius | Sine (for reference)
caption: Rise = 500 tan θ; chord = 2 × 500 × sin(θ ÷ 2). The sine column is the length a confused hand sometimes uses for the rise; at 10° it is 1.3 mm short, and at 45° it is 146 mm short.
- 10° | 88.16 mm | 87.16 mm | 86.82 mm
- 15° | 133.97 mm | 130.53 mm | 129.41 mm
- * 22.5° | 207.11 mm | 195.09 mm | 191.34 mm
- 30° | 288.68 mm | 258.82 mm | 250.00 mm
- 45° | 500.00 mm | 382.68 mm | 353.55 mm
```

How accurate is it? An error dx in the rise changes the angle by dx × cos²θ ÷ L radians. For a 10° angle on a 500 mm run, a rise 0.5 mm wrong moves the angle by 0.056°, which shifts a line about 1 mm over a metre. That is roughly a tenth of the error of a protractor read to half a degree. Lengthening the run improves it in proportion: on a 1,000 mm run, the same 0.5 mm moves the angle by half as much.

The tangent method needs a true perpendicular at the end of the run. An error in the perpendicular, if it leans by a small angle, tilts the rise and changes the angle by an amount that is small for small angles and grows as the angle approaches 45°. For small angles, a perpendicular from a checked steel square is good enough; for large ones, construct it as in Chapter 4.

## The chord method

The chord method needs no perpendicular. From the vertex, strike an arc of radius R that cuts the datum line. From that point, strike a second arc of radius 2R sin(θ ÷ 2), the chord, to cut the first. The line from the vertex through the crossing makes the angle θ.

Its error is similar: an error dc in the chord changes the angle by dc ÷ (R cos(θ ÷ 2)) radians. For 10° on a 500 mm radius, a chord 0.5 mm wrong moves the angle by 0.058°, almost the same as the tangent method. The chord method has two advantages on the bench. It uses only dividers or a trammel, set from a rule, so there is no right angle to build; and the crossing arcs meet at an angle close to 90° for small angles, which, as Chapter 4 showed, makes the crossing point well fixed.

Angles that are halved or doubled are best handled with the bisection of Chapter 4 or by stepping the same chord twice. A 22.5° angle, for example, can be found as half of a 45° angle, and 45° is half of a right angle built from a 3-4-5 triangle, so no trigonometry is needed at all.

## Steep angles: work from the other arm

The tangent of an angle grows quickly beyond 45°. On a 500 mm run, a 60° angle needs a rise of 866 mm and an 80° angle a rise of 2,836 mm, which no sheet will hold. Any angle above 45° is better set out as its complement from a perpendicular: an 80° angle to the datum is a 10° angle to a line at right angles to the datum, with a rise of 88.16 mm on a 500 mm run measured along the perpendicular.

The price is the perpendicular itself. Its error adds directly to the angle, so for steep angles the perpendicular must be constructed as carefully as Chapter 4 describes, not taken from a small square. The chord method avoids the problem: a chord of 2R sin(θ ÷ 2) works for any angle up to 180°, and for 80° on a 500 mm radius it is 642.79 mm, comfortably inside a sheet.

## Carrying an angle with a sliding bevel

A sliding bevel, a blade that locks at any angle in a stock, carries an angle from where it was constructed to where it is needed: from the scrap reference to the folder, or from a site template to the sheet. It is set by laying the stock along the reference datum and closing the blade onto the constructed line, then locking it. Three habits keep it honest.

1. **Set it on the longest lines available.** A bevel blade 200 mm long, set against a line 1 mm off at the blade's end, carries an error of 0.29°. Set against a constructed line over its full length, with the blade's edge tight to the scribed line under a lens, it is good to about a tenth of that.
2. **Lock it firmly and check after use.** A bevel whose wing nut has loosened slightly will close as it is pressed against work. Lay it back on the reference after each use and look for daylight.
3. **Never read a bevel by its angle.** It has no scale; it holds an angle, it does not measure one. To find what angle a bevel holds, lay it on a datum line and measure the chord on a known radius.

## The steel square as an angle table

A carpenter's or tinsmith's steel square has two arms at right angles, the longer blade and the shorter tongue, both graduated. Laying a straightedge from a graduation on the blade to a graduation on the tongue forms a right triangle, and the angle the straightedge makes with either arm depends only on the ratio of the two readings. The square is a tangent table in steel.

The 1910 handbook by Osborne gives a table for the inch-graduated square: hold the straightedge at 12 inches on one arm, and set it to a listed reading on the other arm to obtain angles from 5° to 45° in 5° steps, with their complements read at the other end. The reading for an angle θ should be 12 tan θ inches. The table below tests a selection of Osborne's settings against that formula.

```figure
type: compare
title: Osborne's steel-square settings tested against 12 tan θ
rowhead: Intended angle
cols: Setting in the 1910 table, inches | Exact 12 tan θ, inches | Angle the setting gives | Error
caption: Settings from Osborne (1910), restated with attribution. Most are within a few hundredths of a degree, as good as the square can be read. The 22½° and 10° settings are about a tenth of a degree out, worth knowing on long lines.
- 40° | 10 1/16 | 10.069 | 39.98° | −0.02°
- 30° | 6 15/16 | 6.928 | 30.03° | +0.03°
- * 22½° | 5 | 4.971 | 22.62° | +0.12°
- 20° | 4 3/8 | 4.368 | 20.03° | +0.03°
- 15° | 3 7/32 | 3.215 | 15.01° | +0.01°
- * 10° | 2 3/32 | 2.116 | 9.90° | −0.10°
- 5° | 1 1/16 | 1.050 | 5.06° | +0.06°
```

The table was a sound tool. Most settings are good to a few hundredths of a degree, which is better than anyone can read a square. The two weaker entries are worth noting: a 22½° line set at 5 inches is 0.12° steep, which moves its end 2.1 mm over a metre, and a 10° line set at 2 3/32 inches is 0.10° flat. A square graduated in sixteenths cannot do much better at 22½°, where the exact value, 4.971 inches, falls between graduations; 4 31/32 would be closer if the square has thirty-seconds.

### A metric version

A metric square, or a pair of steel rules held at right angles, gives the same table in millimetres. With a 300 mm run, the rise for θ is 300 tan θ: 26.25 mm for 5°, 52.90 mm for 10°, 80.38 mm for 15°, 124.26 mm for 22.5°, 173.21 mm for 30° and 300 mm for 45°. The C-12 shop keeps these on a card inside the lid of its marking-out box, worked out once and checked by drawing each angle and measuring its chord.

A 300 mm square fixes the angle only over 300 mm, and a reading 0.3 mm out on the rise at 15° moves the angle by about 0.05°. For lines up to a metre that is adequate; beyond that, the square should be used to set a bevel or to start a line that is then extended by the tangent method on a longer run.

## Roof pitch in all its forms

Roof slope is written in at least four ways, and confusing them is one of the commonest angle errors in sheet metal work.

```figure
type: compare
title: Four ways of writing a roof slope
rowhead: Notation
cols: Meaning | 10° roof | Example of a trap
caption: Degrees are the normal notation on Australian roofing drawings. Old plans, overseas suppliers and some trades still use the others. "Pitch" as a fraction of the span is the old usage found in Osborne's handbook.
- Degrees | angle above horizontal | 10° | none, if the drawing says degrees
- Ratio, "1 in x" | 1 unit of rise per x units of run | 1 in 5.67 | read as a fraction of the span
- Percentage | rise ÷ run × 100 | 17.6% | read as degrees
- * Old "pitch" as a fraction | rise ÷ span (twice the run) | 0.088 pitch | 1/3 pitch read as 1 in 3
```

The old pitch notation is the dangerous one. A "one-third pitch" roof, in the usage of Osborne's handbook, has a rise equal to one-third of the span. Since the span is twice the run on a symmetrical roof, the rise is two-thirds of the run and the slope is arctan(2/3) = 33.69°. Read as "1 in 3", it becomes arctan(1/3) = 18.43°, an error of more than 15°.

## Setting the C-12 hood straps

This is an illustration. The C-12 cowl sits on a roof pitched at 10°, and its hood must sit level, so the two straps that carry it are folded at 10° where they meet the base. The fabricator does not set the folder from its angle scale. Instead:

1. On a piece of scrap, scribe a datum line and mark a run of 500 mm along it.
2. At the end of the run, erect a perpendicular with a checked square and mark a rise of 88.16 mm.
3. Scribe the line from the vertex through the rise. This is 10° to the datum.
4. Check it by the chord method: an arc of 500 mm from the vertex should cut the datum and the 10° line 87.16 mm apart.
5. Set a sliding bevel to the two lines and use it to check the first strap off the folder, before the second is bent.

The same scrap carries the 22.5° and 45° lines for the base plate's corners in Chapter 7, built by bisecting a constructed right angle. It is kept with the job until the kit is finished, so that every angle on the job can be checked against one reference.

## The error: a one-third-pitch roof

This is an illustration. On an earlier job, the shop was given an old plan of a farm building, which described the roof as "one-third pitch". The fabricator read this as a slope of 1 in 3, set out 18.43° and made a cowl apron and strap set to suit. A site check, made before the parts were finished because the shop's job sheet requires every roof angle to be confirmed on site, found the roof rising about 667 mm over a level run of 1,000 mm, an angle of 33.7°.

The plan was right; the reading was wrong. Under the old notation, one-third pitch means a rise of one-third of the span, which is two-thirds of the run. The apron had not been cut, so the cost was an afternoon of re-marking. Had it been fitted, the cowl would have leaned 15° downhill.

The shop added a line to its job sheet: "Roof slope: in degrees, measured on site, and the notation on the plan, quoted." A digital inclinometer or a spirit level and rule laid on the roof gives the angle directly; the notation on the plan then becomes a cross-check, not the source.

## How this applies to a small Australian business

Small shops often take angles from a folder's or a saw's scale because it is quick. The scale's zero can drift and its pointer is read over a few centimetres, so a constructed angle on scrap, checked by its chord, is both more accurate and a record of what was intended. For any work that fits buildings, angles should come from site measurements and be recorded in degrees, with any old or overseas notation translated on the job sheet by someone other than the person who will mark the parts.

## Exercise: a 15° bevel from a 300 mm square

Using a 300 mm metric square, set out a 15° line, check it by the chord method on a 300 mm radius, and estimate how far the line could be out at 900 mm from the vertex if the rise is marked within ±0.3 mm.

**Worked answer.** The rise on a 300 mm run is 300 × tan 15° = **80.38 mm**. The chord on a 300 mm radius is 2 × 300 × sin 7.5° = **78.32 mm**; an arc of 300 mm from the vertex should cut the datum line and the new line 78.32 mm apart.

A ±0.3 mm error in the rise changes the angle by 0.3 × cos² 15° ÷ 300 = 0.000933 radians, or **±0.053°**. At 900 mm from the vertex, the line moves by 900 × 0.000933 = **±0.84 mm**. If that is too much for the job, the fix is a longer run: on a 900 mm run with the same ±0.3 mm on the rise of 241.15 mm, the movement at 900 mm drops to ±0.28 mm.
