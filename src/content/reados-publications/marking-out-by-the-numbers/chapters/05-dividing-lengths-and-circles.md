---
book: marking-out-by-the-numbers
chapterSlug: dividing-lengths-and-circles
order: 5
title: "Dividing lengths and circles"
description: "Divide lines and circles into equal parts without letting errors pile up: calculate chords, correct divider settings by trial, fix points by halving or coordinates, and check against centre lines."
draft: false
---

Equal spacing is everywhere in sheet metal: rivet rows, louvre slots, bolt holes on a flange, the divisions of a circle used to develop a pattern. The traditional tool is the dividers. Set them to the spacing, step along the line or round the circle, and the points appear one after another. It is quick, and it feels exact, because every step is the same.

That is the problem. Every step carries the same small error in the setting, so the errors do not average out; they add. After sixteen steps, a setting that was 0.05 mm long has moved the last point 0.8 mm. This chapter shows how to divide lengths and circles so that errors stay at the size of one measurement, not sixteen. It works through the sixteen holes on the C-12 base plate, which carry the kit's tightest marking budget, ±0.25 mm on their positions relative to one another, and it tests an old tin-shop rule about stepping radii that is still repeated.

## Dividing a line

There are three ways to divide a line into n equal parts. The best depends on whether the line's length is known as a number.

1. **Calculate and mark from the datum.** If the length is known, divide it by n and mark each point at its running dimension from one end: L ÷ n, 2L ÷ n, 3L ÷ n and so on. Each point carries one measurement's error. This is the method used for the C-12 louvre panel in Chapter 3, with slots at 112.5, 225.0 … 787.5 mm.
2. **Construct with an inclined line.** If the length is not known, such as an edge on existing work, draw a line from one end at any convenient angle, step n equal units of any size along it with dividers, join the last step to the far end of the line to be divided, and draw parallels to that join through the other steps. Where the parallels cut the line are the divisions, by Euclid's Elements, Book VI, Proposition 9. The units on the inclined line can be any size, so their errors do not matter as long as they are equal to one another, and the parallels transfer them in proportion.
3. **Step by trial.** Set the dividers to an estimate of L ÷ n, step n times from one end and see where the last step lands. Correct the setting by the overshoot divided by n, and step again.

### Correcting by trial

The third method is the dividers' own way of dividing, and done properly it converges in two or three trials. Suppose an existing edge 873.4 mm long, measured with a tape, must be divided into seven. The first setting is a round 125 mm. Seven steps land at 875.0 mm, 1.6 mm past the end. Each step is therefore 1.6 ÷ 7 = 0.23 mm too long, so the setting is reduced to 124.77 mm. In practice the correction is made not by reading a scale but by closing the dividers until their points span one-seventh of the overshoot less than before, judged against the first step, and stepping again.

The important feature of the method is that the final check, the last step landing on the end, measures the accumulated error directly. Whatever is left at the end is n times the remaining setting error. Stepping can never hide its own error, provided the last step is compared with the end rather than forced onto it.

## Why stepping errors pile up

A divider step has two kinds of error. The **setting error** is the difference between the dividers' span and the intended spacing; it is the same on every step, so it is systematic, and after n steps it has moved the last point n times as far. The **placement error** is the small, random wander of the point as each step is taken; it varies from step to step and grows only as the square root of n.

```figure
type: compare
title: Accumulated error after stepping sixteen equal spaces
rowhead: Divider setting error
cols: From the setting (16 × error) | From placement (√16 × 0.1 mm) | Worst case at the last point
caption: This is an illustration. Placement error is taken as ±0.1 mm per step. The setting term dominates even for a careful setting under a lens, which is why long stepped chains should be avoided where the budget is tight.
- ±0.02 mm | ±0.32 mm | ±0.40 mm | ±0.72 mm
- ±0.05 mm | ±0.80 mm | ±0.40 mm | ±1.20 mm
- ±0.10 mm | ±1.60 mm | ±0.40 mm | ±2.00 mm
```

Even a setting good to two-hundredths of a millimetre, which is about the limit of a careful divider setting against a rule under magnification, leaves the sixteenth step about 0.7 mm out in the worst case. For C-12's hole circle, whose marking budget is ±0.25 mm, sixteen stepped chords cannot meet the target, however skilled the hand.

## Dividing a circle

A circle of radius R divided into n equal parts has points spaced by the chord 2R sin(180° ÷ n). Dividers step chords, not arcs, so the setting must be the chord. The arc length, the circumference divided by n, is always longer.

```figure
type: compare
title: Chord and arc for equal divisions of a 540 mm pitch circle
rowhead: Divisions
cols: Chord, mm | Arc, mm | Arc minus chord, mm
caption: R = 270 mm. Setting dividers to the arc instead of the chord overshoots by the last column at every step; with sixteen divisions that is 16 × 0.68 = 10.9 mm round the circle.
- 3 | 467.65 | 565.49 | 97.83
- 4 | 381.84 | 424.12 | 42.28
- 6 | 270.00 | 282.74 | 12.74
- 8 | 206.65 | 212.06 | 5.41
- 12 | 139.76 | 141.37 | 1.61
- * 16 | 105.35 | 106.03 | 0.68
```

Six divisions are special: the chord equals the radius, so a circle is divided into six by stepping its own radius around it. That is exact, and it is the basis of the hexagon in Chapter 7.

### An old rule tested: six radii only fit their own circle

The 1910 handbook by Osborne gives a warning about patterns for tapered articles. To find the length of the curved edge of a cone's pattern, some tinsmiths stepped the radius of the finished circle six times along the pattern's arc, reasoning that six radii go round a circle. Osborne points out that this makes the pattern too short. The reason is now clear: six radii are six chords of the small circle, and six chords give the perimeter of a hexagon, 6R, which is already 4.5% less than the circumference 2πR. Stepped along a larger arc, each chord spans slightly more arc than it would on the small circle, but nothing like enough to recover the shortfall.

```figure
type: bars
title: Six radii stepped along a pattern arc, for a Ø302.4 mm circle
unit: mm
max: 1000
caption: The circle's radius is 151.2 mm, so its circumference is 950.0 mm. Stepped six times along a pattern arc of radius 760 mm, the six radii cover 908.7 mm of arc, 4.3% short. Osborne's own method of stepping smaller divisions is better, and a girth calculated and measured along the arc with a bent strip is best.
- Required arc length | 950.0
- * Six radii stepped on the pattern arc | 908.7
- Six radii round the circle itself (a hexagon) | 907.2
```

Osborne's recommendation, to bend a strip of light sheet to the curve and measure along it, is the bench form of calculating the arc length directly. Chapter 9 tests more of the rules in his handbook.

## The sixteen holes on the base plate

This is an illustration. The base plate's sixteen Ø7 mm holes lie on a 540 mm pitch circle centred on the octagon, one every 22.5°, with the first on the vertical centre line. Their positions relative to one another must be within ±0.5 mm, so the marking budget is ±0.25 mm. Stepping sixteen chords has been ruled out. Two methods meet the budget.

### Method 1: halving, then one chord

The centre lines constructed in Chapter 4 already give four holes, at 0°, 90°, 180° and 270°, each 270 mm from the centre measured with a steel rule along its centre line. Bisecting the four right angles at the centre gives four more lines at 45°, and four more holes on them at 270 mm. That fixes eight holes, each from the centre by a single radius measurement.

The remaining eight lie midway between those. Each is found by striking the chord 105.35 mm from both neighbours, so that the arcs cross on the pitch circle. No point is more than one chord from a point fixed from the centre, so the setting error appears once, not sixteen times.

### Method 2: coordinates from the centre lines

Every hole can be marked as an x and y offset from the two centre lines. For the hole at 22.5° from the horizontal centre line, the offsets are 270 cos 22.5° = 249.45 mm and 270 sin 22.5° = 103.32 mm. By symmetry, only three pairs of offsets are needed for the whole circle.

```figure
type: compare
title: Hole offsets from the centre lines, 540 mm pitch circle
rowhead: Angle from the horizontal centre line
cols: Along the horizontal, mm | Along the vertical, mm | Holes using it
caption: This is an illustration. Each hole is two baseline measurements from the centre lines, so its error does not depend on any other hole. Holes at 0° and 90° lie on the centre lines.
- 0° | 270.00 | 0.00 | 2 (on the horizontal centre line)
- * 22.5° | 249.45 | 103.32 | 4
- 45° | 190.92 | 190.92 | 4
- 67.5° | 103.32 | 249.45 | 4
- 90° | 0.00 | 270.00 | 2 (on the vertical centre line)
```

Each offset is a single baseline measurement with a steel rule stood on its edge, about ±0.15 mm. The position error of the hole, combining two independent offsets, is about √2 × 0.15 = ±0.21 mm by RSS, inside the ±0.25 mm budget. The shop uses this method, because the offsets go on the job sheet once and every hole is marked the same way.

### Checking the circle

Two checks are made with tools that did not make the marks:

1. **Neighbour chords.** With dividers set to 105.35 mm against a steel rule, check that each hole's centre lies on an arc struck from its neighbour. A failure points to one hole.
2. **Centre lines.** The holes at 0°, 90°, 180° and 270° must sit exactly on the centre lines, and the holes at 45° on the bisectors. These are the independent references that catch an angular error, which a check across the diameter does not, because a point slid a little along the circle hardly changes its distance from the opposite hole.

## Chords on a flat part, arcs on a blank that will be rolled

The rule that dividers step chords applies to a circle that stays a circle on the sheet, such as the base plate's pitch circle. A blank that will be rolled into a cylinder is different. Holes or marks that must end up equally spaced round the collar are marked on the flat blank along a straight line, and the spacing on the flat is the arc, the girth divided by the number of spaces, because the flat length becomes the circumference when it is rolled.

On the C-12 collar, a row of sixteen marks round the girth, for example to align with the base plate's holes, is spaced at 946.25 ÷ 16 = 59.14 mm on the mean line, marked from datum B at running dimensions. Using the chord of the finished circle here, 2 × 150.6 × sin 11.25° = 58.76 mm, would be the opposite mistake to stepping arcs on the plate: every space would be 0.38 mm short, and the last one, across the seam, would come out 64.83 mm, nearly 6 mm too long. Each layout has to be asked the same question: will this line still be straight when the part is finished, or will it be bent round?

### Mating circles: let the first part mark the second

When two parts must share a hole circle, the most reliable method is not to mark both. Mark, check and drill one, here the base plate, then clamp it to the mating part and mark the second part's holes through the first part's holes with a transfer punch or a sharp scriber. The tape, the rule and the arithmetic all drop out of the relationship between the two parts, which is the one that matters at assembly. This is the template rule from Chapter 1, and the C-12 job sheet uses it for every pair of mating flanges.

## The error: a divider setting 0.1 mm long

This is an illustration. Before the shop wrote the method above into its job sheet, a fabricator marked an earlier base plate by stepping chords, starting from the hole on the vertical centre line and going round. The dividers had been set from a tape in poor light, at 105.45 mm instead of 105.35 mm. After fifteen steps, the last hole sat 1.5 mm further round than intended, so the final gap, back to the first hole, was only 103.85 mm. The fabricator saw the short gap, assumed it was a placement slip and spread it by eye over the last few holes.

The check against the centre lines caught it before drilling. The hole four steps round, which should have sat on the horizontal centre line, was 0.4 mm past it; the hole eight steps round, which should have sat on the vertical centre line opposite the start, was 0.8 mm past it. Errors that grow steadily with the number of steps are the signature of a setting error. The marks were cleaned off with abrasive cloth and the circle re-marked by coordinates. Because the shop checks against the centre lines on every circle, the fault cost twenty minutes instead of a plate.

## How this applies to a small Australian business

Hole circles are among the commonest features a small fabrication shop marks by hand, on flanges, base plates, covers and guards. A table of offsets for each pitch circle and number of holes the shop uses often, worked out once, checked and kept on the wall, removes both the stepping error and the arithmetic at the bench. The cost is an afternoon with a spreadsheet; the saving is every hole circle that would otherwise need its holes opened up, slotted or redrilled at assembly.

## Exercise: a twelve-hole variant

The shop is asked for a C-12 variant with twelve holes on the same 540 mm pitch circle, the first on the vertical centre line. Find the chord between neighbouring holes and the offsets from the centre lines for every hole, and show that twelve stepped chords with a setting error of ±0.05 mm would not meet a ±0.25 mm budget.

**Worked answer.** The holes are 30° apart. The chord is 2 × 270 × sin 15° = **139.76 mm**.

Holes lie at 0°, 30°, 60°, 90° and so on from the horizontal centre line. The offsets are:

- 0° and 90°: on the centre lines, at 270.00 mm.
- 30°: 270 cos 30° = **233.83 mm** along the horizontal, 270 sin 30° = **135.00 mm** along the vertical.
- 60°: **135.00 mm** along the horizontal, **233.83 mm** along the vertical.

By symmetry, eight holes use the 30° and 60° pairs and four lie on the centre lines.

Stepping eleven chords from the first hole to the last, a setting error of ±0.05 mm accumulates to 11 × 0.05 = **±0.55 mm** at the last hole before any placement error is added, more than twice the ±0.25 mm budget. The coordinate method, at about ±0.21 mm per hole, meets it.
