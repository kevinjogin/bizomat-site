---
book: marking-out-by-the-numbers
chapterSlug: checking-a-layout-before-the-cut
order: 10
title: "Checking a layout before the cut"
description: "Check a finished layout with measurements that do not repeat the marking: closures, diagonals, centre lines, sums and templates, then record the method so the next job starts proven."
draft: false
---

The cheapest moment to find a marking error is after the last line is scribed and before the first cut. Before that moment the layout is incomplete and cannot be checked as a whole; after it, every error is metal. A check at that moment takes a few minutes per part. It is skipped more often than any other step in marking out, usually because the person who marked the part is confident in it, and confidence is exactly what a check is meant to replace.

This chapter brings the book's checks together into a method for any layout and applies it to the whole C-12 kit. Its central rule is that a check must not repeat the marking: a measurement that follows the same route with the same tool can only confirm that the work is repeatable, not that it is right. It sets out a check sheet for the kit, shows how to record a layout so that the next job can rely on it, and ends with an error that was not a marking error at all, which the check found anyway.

## Checks that do not repeat the marking

Chapter 1 drew the distinction between repeatable and right. A check is useful only if it can find the systematic errors, the bent hook, the cambered edge, the wrong divider setting or the forgotten allowance, and that requires a different route to the answer. There are five ways to get one.

1. **A different tool.** A steel rule checking a tape's work, a trammel checking a rule's, a template checking both.
2. **A different reference.** A centre line checking positions that were measured from an edge, or the reverse.
3. **A different quantity.** Diagonals checking squareness that was built from a 3-4-5 triangle; a chord checking an angle that was set by its tangent.
4. **A sum or closure.** The total of divisions checked against the overall length; the last step of a polygon checked against the first.
5. **A different person.** A second pair of eyes is the best check of all against errors of decision, such as a wrong allowance or a misread drawing, because the person who made the decision will make it again.

[Checking, nesting and keeping patterns](/reados/publications/sheet-metal-patterns-by-the-numbers/checking-nesting-and-keeping-patterns/) applies the same principle to developed patterns. The checks in this book are the marking-out versions of it.

## The check families, part by part

Each kind of feature has its natural checks, and most were introduced in the chapter that marked it.

```figure
type: tree
title: Which check for which feature
caption: Each check uses a different route from the method that made the marks. The chapter numbers show where each was introduced.
- Rectangles and squares
  - Opposite sides equal, then diagonals equal | Chapter 2
- Lengths and positions
  - Measured from a different datum or with a different tool | Chapter 3
- Constructed lines
  - Three crossings in line; perpendicular checked by its diagonal | Chapter 4
- Divisions and hole circles
  - Sum of divisions; points on centre lines; neighbour chords | Chapter 5
- Angles
  - Chord on a known radius | Chapter 6
- Polygons
  - Sides, across corners and across flats all equal | Chapter 7
- Arcs and ellipses
  - Ordinates at stations not used to mark; axes measured | Chapter 8
- Every part
  - Calculation re-done by a second person; first-off formed and measured | Chapter 10
```

## The C-12 check sheet

This is an illustration. The shop's check sheet for the kit lists every check, the expected value, the limit and the tool. The limits come from the marking budgets in Chapter 1: ±0.5 mm on general dimensions and ±0.25 mm on hole positions relative to one another, converted where needed into the quantity actually measured.

```figure
type: compare
title: C-12 check sheet
rowhead: Part and check
cols: Expected | Limit | Tool
caption: This is an illustration. Diagonal limits are converted from the allowed corner offset with the formula of Chapter 2. Every check uses a different tool or reference from the marking method.
- Base plate: across flats, four directions | 600.0 mm | ±0.5 mm | steel rule on edge
- Base plate: across corners, four directions | 649.44 mm | ±0.5 mm | trammel set from a rule
- Base plate: holes on centre lines and 45° lines | on the line | 0.25 mm | lens and fine steel rule
- Base plate: neighbour chords | 105.35 mm | ±0.25 mm | dividers set from a rule
- Collar blank: length, top and bottom | 971.25 mm | ±0.5 mm | class I tape from 100 mm
- Collar blank: diagonal difference | 0 | 0.97 mm | same tape, same way
- Apron: diagonal difference | 0 | 0.71 mm | same tape, same way
- Apron hole: major and minor axes | 309.10 and 304.40 mm | ±0.5 mm | steel rule on edge
- Hood cheeks: ordinates at 125 and 275 mm | 106.14 and 49.33 mm | ±0.5 mm | steel rule on edge
- Hood cheeks: pair laid face to face | identical | no daylight | by eye, after cutting the first
- Louvre panel: slot 1 to slot 7 | 675.0 mm | ±0.5 mm | steel rule
```

Two lines deserve comment. The diagonal checks use the same tape the same way, deliberately, because the question is whether two lengths are equal, and any bias cancels. And the hood cheeks are checked against each other after the first is cut, by laying it on the second's layout: the relationship that matters at assembly is that the two cheeks match, and comparing them directly tests it without any measurement at all.

## Check while marking, not only at the end

The final check catches what is left, but many errors are far cheaper to find as soon as they are made, because everything marked afterwards is built on them. Each construction in this book has a check built into it, and the habit worth forming is to make that check before moving on.

- After scribing a datum line, check it against the straightedge or string line along its whole length.
- After building a perpendicular, check that its three crossings lie in line and measure one diagonal against its calculated value.
- After marking a rectangle, measure its sides and diagonals before marking anything inside it.
- After stepping divisions, compare the last step with the end, and never force it onto the end.
- After marking a curve by ordinates, check it at stations that were not used to mark it.

An error found at the datum costs a line. The same error found at the final check costs every line that was measured from that datum.

## When a check fails

A failed check is information, and the pattern of the failure usually says what went wrong. Before re-marking, it pays to read it.

1. **A constant offset**, every point out by the same amount in the same direction, points to the start of every measurement: the datum line, a tape's hook, or a template placed slightly off. Chapter 3's louvre panel is the example.
2. **An error that grows with distance**, small near the datum and larger far from it, points to a scale: a tape or rule whose graduations are wrong, a divider setting stepped many times, or temperature.
3. **An error that grows round a figure**, as in Chapter 7's stepped octagon, points to an angle repeated at every turn.
4. **One point out and the rest correct** is a slip: a misread graduation, a mark on the wrong line, a scriber that skidded.
5. **Every point correct and the part still wrong** is an error of decision, a misread drawing or a forgotten allowance, as in the collar blank below.

Two rules apply whatever the cause. Never move a mark to make a check pass: if the check fails, the method that produced the mark is suspect, and every other mark it produced is suspect with it. And re-mark from the datums, not from the faulty marks, cleaning the old lines off with abrasive cloth so that they cannot be confused with the new ones. On galvanised sheet, the cleaned area should be inspected for damage to the coating, and any part whose visible face has been scribed and cleaned should be considered against the finish the customer expects.

## Who checks, and how much

The best check is made by someone who did not mark the part, working from the drawing and the job sheet rather than from the marks. In a small shop that is not always possible, and a fabricator checking their own work can still meet the principle by changing tool and route for every check. What does not work is re-measuring the same marks the same way. It finds slips, a misread graduation or a mark on the wrong line, but not the errors that matter most.

How much to check depends on the cost of an error. A part that will be cut from a full sheet of stainless steel, or whose holes must match work already installed on site, deserves every check on the sheet. A bracket cut from an offcut, which can be remade in ten minutes, may need only its overall size. The check sheet should say which checks are required for which parts, so that the decision is made once, calmly, and not at the bench when the job is late.

## First-off: form one before cutting the rest

Marking out is checked before cutting, but some errors only show when the part is formed: an allowance that is wrong for the machine, a rolled radius that springs back, a fold that moves the part's edge. For any part made in more than one, the shop's rule is to cut, form and measure one before cutting the others. The C-12 kit is one of each part, but the shop makes the hood's rolled top as a trial on a strip of offcut first, to confirm that the rolls give the 570.42 mm radius before the real blank is committed. [Inspecting to the Drawing](/reados/publications/inspecting-to-the-drawing/) covers first-article inspection in full.

## Checks after the cut

A good layout can still become a bad part if the cut wanders from the line. A quick measurement after cutting, of the same key sizes that were checked before it, separates marking errors from cutting errors. If a base plate measured 600.0 mm across flats as marked and 599.4 mm after cutting, the shears took the line on one side and more besides; the marking was right, and the cutting method or the rule about leaving the line, from Chapter 7, needs attention. If both measurements are out by the same amount, the fault is in the marking. Keeping both numbers on the job sheet is what makes the distinction possible, and over a few jobs it shows a shop whether its accuracy is limited by its marking, its cutting or neither.

## Recording the layout

A layout that works is worth keeping. The record need not be long. The C-12 job sheet carries, for each part:

```figure
type: checklist
title: What the job sheet records for each marked part
caption: This is an illustration. The record lets the next job reuse a proven method, and lets a fault found later be traced to its tool and its step.
- Datums | which edges or lines, and how they were checked
- Method | the construction for each feature, with radii, chords and offsets
- Budget | the marking budget for each feature, from the drawing's tolerance
- Tools | tape, rule and square used, with the date each was last checked against the reference
- Checks | each check, its expected value and the value found
- Signature | who marked, who checked
- ? Changes | anything done differently from the plan, and why
```

The last line is the one that improves the shop. When a fabricator departs from the plan, for a good reason or a bad one, the record shows it, and the next plan can include the better method or guard against the worse.

## The check sheet in use

This is an illustration. When the C-12 kit was checked, every part passed except one, and the results were recorded on the job sheet.

```figure
type: stats
title: C-12 check results, before cutting
caption: This is an illustration. The largest values found are shown against their limits. The collar blank failed on length, for a reason that had nothing to do with marking accuracy.
- 0.3 mm | Base plate, largest across-flats deviation | limit ±0.5 mm
- 0.2 mm | Hole circle, largest offset from a centre line | limit 0.25 mm
- 0.4 mm | Apron, diagonal difference | limit 0.71 mm
- *−24.95 mm | Collar blank, length | limit ±0.5 mm
```

## The error: a collar blank without its lap

This is an illustration. The collar blank was marked accurately: its length matched the number on the fabricator's notepad within 0.1 mm, its diagonals agreed within 0.3 mm, and its ends were parallel. The number on the notepad was wrong. The fabricator had written the girth, 946.25 mm, as the blank length, and forgotten the 25 mm riveted lap.

The check sheet caught it because its expected value, 971.25 mm, was worked out by the person who wrote the job sheet, not by the person marking the blank. The checker measured 946.3 mm against an expected 971.25 mm and stopped the job. Re-marking took ten minutes. Had the blank been cut and rolled, the collar would have closed edge to edge with no lap at all, and there is no repair for that except a new blank.

The fault is instructive because no improvement in marking technique could have prevented it. The marking was excellent. The error was in a decision, the blank length, and only a check by a different route, here a different person's calculation, could find it. That is the strongest argument for writing expected values on the check sheet before marking begins.

## Common mistakes in checking

- **Checking with the marking tool.** The same tape, the same hook and the same route confirm only that the work is repeatable.
- **Working out the expected value at the bench.** The person marking will make the same assumptions again; expected values belong on the job sheet before marking starts.
- **Checking only the overall size.** A rectangle with the right sides can still be a parallelogram, and a hole circle with the right diameter can still be rotated.
- **Adjusting a mark to pass.** It hides the cause, and the other marks made the same way stay wrong.
- **Not recording the values found.** A tick says the check was done; the number says how close the part came to its limit, which is what tells a shop whether its methods have margin.
- **Skipping the check on a simple part.** Simple parts are where decisions, such as a forgotten lap, go unnoticed.

## How this applies to a small Australian business

In a small shop, the person who quotes a job, marks it, cuts it and checks it may be the same person, often on the same afternoon. The check sheet is how that person gets the benefit of a second pair of eyes without a second person: expected values worked out at the desk, before the bench; a different tool for every check; and a record that turns one job's lessons into the next job's method. Over a year, the records also show which kinds of error the shop actually makes, which is where training and better tools should go.

## Exercise: the collar blank's diagonal limit

The collar blank is 971.25 × 250 mm. For the lap seam to close evenly, its two ends must be parallel within 0.5 mm over the 250 mm height, which means a corner offset of no more than 0.5 mm over the 250 mm side. What diagonal difference should the check sheet allow, and would a difference of 0.6 mm pass?

**Worked answer.** The true diagonal is √(971.25² + 250²) = 1,002.91 mm. The allowed angle out of square is ε = 0.5 ÷ 250 = 0.002 radians. From Chapter 2, the diagonal difference is Δ ≈ 2ab × ε ÷ d = 2 × 971.25 × 250 × 0.002 ÷ 1,002.91 = **0.97 mm**.

A measured difference of 0.6 mm corresponds to an offset of 0.6 ÷ 0.97 × 0.5 = 0.31 mm over the 250 mm height, which **passes**. The check sheet's limit of 0.97 mm is the value shown in the C-12 check sheet above.
