---
book: inspecting-to-the-drawing
chapterSlug: turn-every-balloon-into-limits
order: 3
title: "Turn every balloon into limits"
description: "Convert each ballooned requirement into a lower and upper limit or a pass rule, resolve the general tolerance note, and avoid the misreadings that pass bad parts."
draft: false
---

A balloon says what to check. It does not yet say what counts as a pass. Drawings express tolerances in several ways: plus and minus, explicit limits, one-sided tolerances, a general note, a geometric tolerance with a datum reference, an attribute such as a thread class. An inspector who compares a measured value directly against the way the tolerance is written invites arithmetic errors at the bench, often under time pressure and often on the last part of the day.

The cure is to convert every requirement into the same form before any part is measured: a lower limit and an upper limit, or, where the requirement is not a number, a written pass rule. The limits table that results is checked once, by two people, and then used for every part in the batch. This chapter builds that table for the bracket.

## Limits, not tolerances

A tolerance is a width; a limit is a value. The bench needs values. "30 ±0.02" means the feature must lie between 29.98 and 30.02, and those two numbers are what the inspector compares with the reading. Writing the limits once removes the arithmetic from the measurement.

```figure
type: compare
title: Ways a tolerance is written and the limits they give
cols: As written on the drawing | Lower limit | Upper limit
caption: Every tolerance on the bracket reduces to two numbers or a pass rule before measurement starts.
- Equal bilateral | 30 ±0.02 | 29.98 | 30.02
- *Unilateral | Ø6.6 +0.2/0 | 6.60 | 6.80
- Explicit limits | Ø10.000 / Ø10.015 | 10.000 | 10.015
- General note | 80, note says ±0.1 | 79.90 | 80.10
- Minimum only | full thread 8 minimum | 8.0 | none
- Range in a note | break edges 0.2 to 0.5 | 0.2 | 0.5
- One-sided geometric | flatness 0.05 | 0 | 0.05
```

Two forms deserve care. A unilateral tolerance such as +0.2/0 puts the whole tolerance on one side of the nominal, and it is easy to read as ±0.2 when tired. A minimum-only requirement has no upper limit on the drawing, but it may have a practical one: a thread depth of "8 minimum" in an upright that leaves 2 mm of wall above the bore cannot go much deeper without breaking through. The inspector records the drawing's limit and flags the practical one as a note, not as a new requirement.

## The general tolerance note

On most detail drawings, the general tolerance note governs more dimensions than any other line. SB-2041 states "Unless otherwise stated: linear ±0.1, angular ±0°30′". Every dimension without its own tolerance therefore has limits of nominal −0.1 and nominal +0.1.

Many drawings do not give the values directly. They cite a standard and a tolerance class instead, and the values depend on the size of the dimension: a short dimension gets a tighter tolerance than a long one. AS 1100.201 has an appendix of general tolerances, and ISO 2768-1 is widely cited on overseas drawings. When the note cites a standard, the inspector reads the values from the edition the note calls up, for each dimension, and writes them into the limits table. They are not guessed, and they are not taken from the last job that used the same class. The chapter on [tolerances on the drawing](/reados/publications/drawings-that-make-parts/tolerances-on-the-drawing/) in *Drawings That Make Parts* explains how general tolerance notes are set and why size bands exist.

Some general tolerance standards give separate values for radii and chamfers, and some treat angles by the length of the shorter leg. Read the note and the standard it cites for the feature type in front of you. SB-2041's note applies one linear value to everything, including the inside radius, which makes the bracket simpler than many real drawings.

### Implied angles

The bracket's upright meets the base at a right angle, but the drawing does not dimension that angle. Does the general angular tolerance apply to an angle that is drawn but not written? Practice differs between drawing standards. Some treat an implied 90° angle as governed by the general angular tolerance; others leave it to be controlled by geometric tolerances. The inspector does not settle this. This is an illustration: the shop sends a query, and the customer confirms that the general angular tolerance of ±0°30′ applies to the angle between the upright and the base.

An angular limit is awkward to measure directly on a short feature. It is easier to convert it into a linear deviation over a known length, which a height gauge or square and feeler can check.

```figure
type: formula
title: Converting the angular limit into a linear check
caption: This is an illustration. Converting the angle to a deviation over the measured height lets the inspector check it with a square and indicator.
formula: deviation = L × tan(θ)
- L | length over which the deviation is measured, mm
- θ | angular tolerance, here 0°30′ = 0.5°
step: Upright above the base: L = 45 − 8 = 37 mm
step: tan(0.5°) = 0.00873
step: Deviation = 37 × 0.00873 = 0.323 mm
step: The upright face may lean up to 0.32 mm from square over its 37 mm exposed height
```

The result is rounded down to 0.32 mm for the limits table, not up, so that the conversion never accepts a part the angle would reject. Rounding a limit always moves it inward, toward the tighter side.

## Geometric tolerances as limits

A geometric tolerance gives an upper limit on a deviation from perfect form, orientation or location, with zero as the ideal. Flatness 0.05 means the measured flatness may be anything from 0 to 0.05. Perpendicularity Ø0.02 means the bore axis must lie within a cylinder 0.02 in diameter that is perpendicular to datum C.

Position at maximum material condition is the exception: its upper limit depends on the actual size of the feature. The bracket's mounting holes have a position tolerance of Ø0.2 at MMC. MMC for a hole is its smallest permitted size, 6.60. A hole made at 6.60 gets exactly Ø0.2; a hole made larger gets more, by the amount it departs from MMC. So the limits table cannot hold a single number for balloons 8.1 and 8.2. It holds the rule instead, and Chapter 4 applies it.

## Requirements that are not numbers

Material, finish, marking and thread class do not reduce to two numbers. They need a pass rule written in advance, so the decision is the same whoever makes it.

- **Material (19):** pass if the material certificate states 6061-T6, the certificate's heat or lot number matches the plate used, and the plate is traceable to this batch.
- **Finish (20):** pass if the finisher's certificate states the customer's specification, the coating thickness on the part is within 10 to 15 µm, and there are no rack marks on datum A.
- **Thread (14):** pass if the M4-6H GO gauge enters the full depth and the NO-GO gauge does not enter more than the amount the gauge maker specifies.
- **Marking (23):** pass if the marking reads SB-2041-C and the batch number, is on the underside and is legible.

## The running case: the limits table

This is an illustration. The inspector extends the balloon list from Chapter 2 with two columns, lower and upper limit, and a third for any pass rule.

| Balloon | Requirement | Lower | Upper |
|---|---|---|---|
| 1 | Length 80 | 79.90 | 80.10 |
| 2 | Width 50 | 49.90 | 50.10 |
| 3 | Base thickness 8 | 7.90 | 8.10 |
| 4 | Height 45 | 44.90 | 45.10 |
| 5 | Upright thickness 8 | 7.90 | 8.10 |
| 6 | Flatness, datum A | 0 | 0.05 |
| 7.1, 7.2 | Hole Ø6.6 +0.2/0 | 6.60 | 6.80 |
| 8.1, 8.2 | Position at MMC | 0 | 0.2 + (hole size − 6.60) |
| 9 | Bore | 10.000 | 10.015 |
| 10 | Bore height from A | 29.98 | 30.02 |
| 11 | Bore from B | 24.95 | 25.05 |
| 12 | Bore perpendicularity to C | 0 | 0.02 |
| 13 | Bore texture | none | Ra 0.8 |
| 14.1, 14.2 | Thread M4-6H | pass rule | pass rule |
| 15.1, 15.2 | Full thread depth | 8.0 | none |
| 16 | M4 spacing 20 | 19.90 | 20.10 |
| 17 | First M4 from B | 14.90 | 15.10 |
| 18 | Inside radius R3 | 2.90 | 3.10 |
| 19 | Material | pass rule | pass rule |
| 20 | Anodise | 10 µm | 15 µm, plus pass rule |
| 21 | After anodising | applies to all dimensions | |
| 22 | Edge break | 0.2 | 0.5 |
| 23 | Marking | pass rule | pass rule |
| 24 | Other surfaces | none | Ra 3.2 |
| query | Upright to base angle | 89°30′ | 90°30′ |

The table carries the extra line for the angle, labelled with the query rather than a balloon number, because the requirement came from the customer's answer rather than from a printed feature. It is added to the ballooned drawing as balloon 25 at the next update, and the query reference is kept with it.

Surface texture limits need one caution. An Ra value on a drawing is an upper limit, but how many readings may exceed it, and over what sampling length, depends on the surface texture standard the drawing follows. The table records the limit; the method chosen in Chapter 7 must follow the rule.

## Decimal places and rounding

Limits are written to the number of decimal places the requirement implies, and results are recorded to at least one more place than the limit. A bore limit of 10.015 is recorded against a reading such as 10.0130, not 10.01.

Results are never rounded to make them pass. A reading of 80.104 against an upper limit of 80.10 is above the limit; writing it as 80.10 does not change the part. The question of whether 80.104 is really above 80.10, given the uncertainty of the caliper, is a real question, and Chapter 6 answers it with a decision rule, not with rounding.

## The error: a unilateral tolerance read as bilateral

This is an illustration. On the first draft of the limits table, the inspector's assistant wrote the mounting holes as 6.40 to 6.80, reading Ø6.6 +0.2/0 as ±0.2. A trial part had holes drilled with a worn 6.5 mm drill and opened with a reamer that had been set slightly small; they measured 6.52 and 6.54. Against the draft table, both passed.

The second check of the table, done by the senior inspector reading the drawing rather than the draft, found the mistake. The correct lower limit is 6.60, and both holes were undersize. An M6 screw would still pass through a 6.52 hole, so the error would probably not have shown at assembly. It would have shown in Chapter 4's position calculation: an undersize hole is outside its size limits, so no bonus applies, and the hole fails its size requirement before position is even considered.

The fix had two parts. The draft table was corrected, and the shop's template for limits tables was changed so that the "as written" column sits beside the lower and upper columns. The checker now compares the three for every line, which makes a sign error visible.

## Acceptance limits and machining targets

The limits table defines acceptance. It is not a machining target, and the two should not be confused. A machinist aiming at the bore's lower limit of 10.000 will make some bores below it, because every process varies. Shops therefore set process targets inside the limits, often near the middle, and sometimes deliberately off-centre where something later in the process will move the dimension.

The bracket is a case in point. Note 1 says dimensions apply after anodising, and anodising builds a coating that makes a bore smaller. A machining target for the bore therefore sits above the middle of the 10.000 to 10.015 band, by an allowance the finisher can state. That allowance belongs on the machining set-up sheet, not in the limits table. The inspector's table stays exactly as the drawing says, and the in-process check sheet at the machine carries the target and its own, tighter, in-process limits, clearly labelled as such.

Keeping the two apart matters when something goes wrong. If a set-up sheet's in-process limits are copied into the final inspection record, parts that meet the drawing can be rejected, or, worse, a target that forgot the coating can be accepted at the machine and fail after finishing. Chapter 7 follows exactly that failure.

## Checking the table

The limits table is a calculation, and calculations are checked. The best check is independent: a second person works from the drawing, not from the first person's table, and compares their numbers. Where the two tables disagree, both go back to the drawing.

```figure
type: checklist
title: Checking a limits table before it is used
caption: The table is used for every part in the batch, so a single error repeats on every part.
- Every balloon has a line | count matches the ballooned drawing
- Every limit traced to the drawing | as-written column beside each pair of limits
- General tolerance values from the cited edition | not from memory or the last job
- Rounded conversions moved inward | angles, unit conversions
- Non-numeric requirements have a written pass rule | material, finish, thread, marking
- x Limits typed from a previous revision | discard and rebuild from the current drawing
```

## Exercise: write the limits

A drawing for a spacer shows: length 25 +0/−0.05; bore Ø8.000 to Ø8.022; outside diameter 16 with no tolerance; a chamfer 0.5 × 45° with no tolerance. The general tolerance note reads "linear ±0.2, angular ±1°". Write the lower and upper limits for each requirement, and convert the chamfer's angular tolerance into a deviation across the 0.5 mm chamfer leg, to three decimal places.

**Answer.** Length: 24.95 to 25.00, because the tolerance is all on the minus side. Bore: 8.000 to 8.022. Outside diameter: 15.80 to 16.20 under the general note. Chamfer size: 0.3 to 0.7 under the general note, which is a wide range for a small chamfer and might prompt a query if function depends on it. Chamfer angle: 44° to 46°. Over a 0.5 mm leg, tan(1°) = 0.01746, so the deviation is 0.5 × 0.01746 = 0.0087 mm, which rounds inward to 0.008 mm. That is far too small to check with a shop instrument, which tells the inspector the angle will in practice be accepted on the tool's ground angle and a visual check, and the record should say so rather than imply a measurement that was not made.
