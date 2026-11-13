---
book: clerk-of-the-works
chapterSlug: no-one-blocks-the-view
order: 3
title: "No one blocks the view: turning a functional brief into criteria you can check"
description: "Use Theseus's theatre in the Knight's Tale to turn a functional brief into a measurable design criterion, and check grandstand riser heights row by row with the sightline equation."
draft: false
---

In the Knight's Tale, Duke Theseus orders a theatre built for a tournament between two rival knights. Chaucer describes it in loving detail: round, a mile about, walled in stone with a ditch outside, and with its seats rising in tiers so high that a spectator on one tier did not hinder the one behind from seeing. Theseus employs every craftsman in the land who knew geometry or arithmetic, every painter and every carver, to plan and build it.

Chaucer wrote those lines around the time he was clerk of the king's works, an office in which he oversaw the scaffolds put up for the jousts at Smithfield in 1390. Whatever the connection, the passage contains the best kind of brief an owner can give: it states what the building is for, in terms a spectator would recognise. This chapter turns that kind of brief into a criterion an engineer can check, and uses it to catch a flaw in the grandstand's first design.

## Functional briefs and measurable criteria

A functional brief says what the user must be able to do. "No spectator's view is blocked by the person in front" is functional. A measurable criterion says what quantity must meet what limit, so that a drawing can be checked against it before anything is built. Owners are usually good at the first and leave the second to designers. The clerk of works' job is to make sure the second exists and is checked, because a functional brief that is never converted can be met in the owner's imagination and missed on the drawings.

```figure
type: steps
title: From a functional brief to a checked design
caption: The conversion happens once, early, and is recorded. After that, every drawing revision can be checked against the criterion rather than argued about.
- State the function | every spectator sees the near edge of the arena over the head of the person in front
- Choose the measure | the height by which each row's line of sight clears the eye of the row in front, called the C-value
- * Set the limit | the society's designer adopts a target C-value after reviewing published sports-ground guidance
- Define the inputs | focal point, eye positions, tread depth, riser heights
- Check every row | calculate C for each row on each drawing revision and record the result
```

## The sightline equation

The geometry is simple enough to derive on the back of a site diary. Take the focal point, the nearest point of the arena the spectator must see, as the origin. A spectator's eye in one row sits at a horizontal distance D from the focal point and a height R above it. The next row back is one tread depth T further away and one riser height N higher.

The line of sight from the back row's eye to the focal point is straight. Where it passes over the front row's eye, at horizontal distance D, its height is the back row's eye height scaled by the ratio of the distances: (R + N) × D ÷ (D + T). The clearance over the front row's eye is that height less R.

```figure
type: formula
title: Clearance of each row's sightline over the eye in front
formula: C = (R + N) × D ÷ (D + T) − R
caption: Derived from similar triangles. To find the riser needed for a target C, rearrange: N = (C + R) × (D + T) ÷ D − R.
- C | sightline clearance over the eye of the row in front, m
- R | height of the front row's eye above the focal point, m
- D | horizontal distance from the front row's eye to the focal point, m
- T | tread depth, the horizontal distance between rows, m
- N | riser height between the two rows, m
step: Row 2 over row 1, with D = 8.0, R = 1.40, T = 0.80 and N = 0.30: C = 1.70 × 8.0 ÷ 8.8 − 1.40 = 0.145 m
step: Row 12 over row 11, with D = 16.0, R = 4.40, T = 0.80 and N = 0.30: C = 4.70 × 16.0 ÷ 16.8 − 4.40 = 0.076 m
```

The two steps show the pattern that matters. With the same riser at every row, the clearance is generous at the front and shrinks towards the back, because each row is further from the focal point and the line of sight flattens. A constant riser that is comfortably enough at row 2 can be too little at row 12.

## The first design

This is an illustration. The society's brief, written by its committee, said that "every spectator should be able to see the running rail clearly over the person in front." The design engineer converted that into a criterion: a C-value of at least 90 mm at every row, with the focal point at the top of the running rail on the near side of the arena, 8.0 m horizontally from the front row's eye and 1.40 m below it. The tread depth is 0.80 m.

The concept drawings, prepared quickly for the grant application, showed a constant riser of 300 mm at every row: a total rise of 3.30 m over 11 risers. The clerk of works checked them against the criterion in the first week after appointment.

| Row | D (m) | R (m) | C with 300 mm risers (mm) |
| --- | --- | --- | --- |
| 2 | 8.8 | 1.70 | 145 |
| 3 | 9.6 | 2.00 | 133 |
| 4 | 10.4 | 2.30 | 123 |
| 5 | 11.2 | 2.60 | 114 |
| 6 | 12.0 | 2.90 | 107 |
| 7 | 12.8 | 3.20 | 100 |
| 8 | 13.6 | 3.50 | 94 |
| 9 | 14.4 | 3.80 | 89 |
| 10 | 15.2 | 4.10 | 84 |
| 11 | 16.0 | 4.40 | 80 |
| 12 | 16.8 | 4.70 | 76 |

In the table, D and R are for the row in question, and C is its clearance over the row in front. Rows 9 to 12, a third of the seats, fall short of 90 mm. The front rows have much more clearance than they need. The design met the brief in the committee's mind, because 300 mm looked like a generous riser, and failed it on paper.

## The corrected design

The fix is to step the risers: shallow at the front, deeper at the back, each set to the value the criterion needs. Rearranging the equation gives the riser for each row from the target C. The design engineer rounded each riser up to the next 5 mm for fabrication.

```figure
type: bars
title: Sightline clearance by row, constant and stepped risers
unit: mm
max: 150
caption: This is an illustration. With 300 mm risers throughout, rows 9 to 12 fall below the 90 mm target. Stepped risers from 240 to 305 mm hold every row between 90 and 95 mm.
- Row 2, constant | 145
- Row 6, constant | 107
- Row 9, constant | 89
- * Row 12, constant | 76
- Row 2, stepped | 91
- Row 6, stepped | 91
- Row 9, stepped | 94
- Row 12, stepped | 94
```

The stepped risers run 240, 250, 260, 265, 270, 275, 285, 290, 295, 300 and 305 mm from front to back. Every row achieves between 90 and 95 mm. The total rise is 3.035 m instead of 3.30 m: the stand is 265 mm lower at the back, every seat meets the brief, and the steel frame is slightly smaller. A design that is both better and cheaper is not common, and it came from checking a criterion rather than trusting an impression.

The criterion is only as good as its assumptions about where the eye is. The design engineer used a seated eye height and a set-back from the riser face taken from the seat supplier's dimensions, and recorded both on the drawing. If the society later changes to a taller seat, every eye moves up and back slightly, and the check has to be repeated. A recorded assumption can be rechecked in minutes; an unrecorded one is rediscovered only when a spectator complains.

The corrected riser heights were issued on revision C of the seating plat drawings. Chapter 6 follows what happened to that revision.

## Failure: the wrong focal point

The first check had its own error, caught by the design engineer when the clerk of works sent the table across. The clerk had first taken the focal point as the far side of the arena, about 60 m away, reasoning that spectators want to see the whole ground. With a distant focal point, the line of sight is almost flat, almost any riser gives a large C-value, and the constant 300 mm design passed easily.

The error was in the inputs, not the arithmetic. The near edge of the arena is the hardest point to see, because the line of sight to it is steepest and most easily blocked. A design that lets every spectator see the nearest point lets them see everything beyond it. Choosing the far side made the check meaningless.

Detection came from asking which point of the function was hardest to satisfy, which is a good question to ask of any criterion. The correction was to record the focal point on the drawing with the criterion, so that every later check used the same one:

1. Criterion: C ≥ 90 mm at every row.
2. Focal point: top of the running rail, near side, 8.0 m from the front row's eye and 1.40 m below it.
3. Eye position: a stated height above each seat and a stated distance from the riser face.
4. Check: tabulated for every row on every revision of the seating plat drawings.

The same question applies to any criterion the clerk of works is asked to check. For a roof overhang, the hardest case is the steepest driving rain on the front row. For a kiosk queue, it is the busiest five minutes, not the average hour. A check run against the easy case proves nothing about the hard one.

## Recording the check on every revision

A criterion checked once is a criterion checked on one drawing. Designs change, and a riser height altered for some other reason, to fit a stair or clear a beam, can quietly undo the sightline. The clerk of works therefore keeps a one-page check sheet for the seating plat and repeats it whenever the drawings are revised.

| Revision | Date | Riser heights | Lowest C (row) | Result |
| --- | --- | --- | --- | --- |
| A, concept | week −10 | 300 mm constant | 76 mm (row 12) | fails at rows 9 to 12 |
| B, tender | week −4 | 300 mm constant | 76 mm (row 12) | fails; raised with the designer |
| C, for construction | week 2 | 240 to 305 mm stepped | 90 mm (row 7) | passes at every row |

Revision B is the uncomfortable row. The tender drawings went out to builders with the same constant risers as the concept, because the clerk of works was appointed after tenders closed. The builder priced revision B. Revision C, issued in week 2, changed the raker beams that carry the seating, and Chapter 6 shows what that change cost when it did not reach the fabricator. A clerk of works appointed before tender would have caught the sightline problem before anyone priced it.

## Chaucer's scaffolds and temporary seating

The stands Chaucer oversaw at Smithfield were temporary: timber scaffolds put up for a tournament and taken down afterwards. Temporary seating is still common at shows and sporting events, and it is where the society would turn if its new stand were not ready in time. That possibility sits behind the liquidated damages figure in Chapter 2, which was built up from the hire cost of temporary seating.

It also gives the clerk of works a useful comparison. A hired temporary stand comes with the supplier's engineering, its own sightline geometry and its own certification for the event. When the committee asks why the permanent stand needs so much checking, the answer is that nobody else will check the society's brief for it. A hire company checks its own product. A builder builds what is drawn. A certifier checks compliance with the code. Only the owner's side checks that the building does what the owner asked for.

## The brief beyond sightlines

Sightlines are one criterion among many in a grandstand, and most of the others are not the owner's to set. Seating dimensions, aisle widths, exit capacity, barrier loads, accessible seating and fire separation of the kiosk are governed by the National Construction Code and its referenced standards, assessed by the building certifier and designed by qualified engineers. The clerk of works does not check those calculations. The clerk does check that each functional requirement in the society's own brief has been converted into a criterion and that the drawings meet it.

The society's brief had six such requirements. The clerk of works listed each with its criterion, its source and its check.

```figure
type: checklist
title: The society's brief, converted to criteria
caption: This is an illustration. Five were converted and checked by contract signing; the shade requirement was left open and later became the shade sail proposal in Chapter 2.
- x Spectators see the running rail | C ≥ 90 mm at every row, focal point as recorded
- x Elderly members can reach their seats | handrails on every aisle; maximum riser in aisles per the certifier's approved design
- x The kiosk serves the stand at half time | two serving windows; queue space of 30 m² clear of the exits
- x Roof keeps rain off the seats | roof overhang covers all 12 rows for rain at 30° from vertical
- x Wheelchair users sit with companions | accessible spaces with companion seats, as approved by the certifier
- ? Shade on hot show days | not converted: no criterion agreed before contract
```

The open item is instructive. Because the shade requirement was never converted into a criterion, it was never designed, never priced and never in the contract. When it surfaced in week 7, it arrived as a request for contingency money. A brief item that is not converted does not disappear; it comes back later as a variation.

## Exercise: check a back row with a deeper tread

The design engineer proposes widening the tread on rows 11 and 12 from 0.80 m to 0.90 m, to give more legroom for a corporate box. With the stepped design, row 11's eye is 16.0 m from the focal point and 4.130 m above it, and the riser to row 12 is 305 mm. Calculate row 12's C-value with a 0.90 m tread instead of 0.80 m, say whether it meets the criterion, and find the riser that would restore 90 mm.

**Worked answer.** With T = 0.90 m, row 12's eye is at D + T = 16.9 m and R + N = 4.130 + 0.305 = 4.435 m. Its sightline passes over row 11's eye at a height of 4.435 × 16.0 ÷ 16.9 = 4.199 m, so C = 4.199 − 4.130 = 0.069 m, or about 69 mm. That fails the 90 mm criterion: the deeper tread moves row 12 back and flattens its line of sight. The riser needed is N = (0.090 + 4.130) × 16.9 ÷ 16.0 − 4.130 = 4.4573 − 4.130 = 0.327 m, which rounds up to 330 mm. The proposal therefore changes more than the tread: it raises the back of the stand by 25 mm, which affects the roof, the rear wall and the steel. The clerk of works should send the calculation to the design engineer with the question, so that the change is designed rather than discovered on site.
