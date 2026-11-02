---
book: sheet-metal-patterns-by-the-numbers
chapterSlug: checking-nesting-and-keeping-patterns
order: 10
title: "Checking, nesting and keeping patterns"
description: "Check every fitting with independent numbers, compare a CAD unfold, nest the blanks on 2,400 × 1,200 sheets, and keep a pattern register that stops a good pattern being used for the wrong job."
draft: false
---

A pattern is finished when it has been checked, cut economically, proved on a first-off piece and recorded so that it can be used again. Those four steps take less time than setting out the pattern, and they decide whether the next batch fits as well as the first. They are also where most of the errors in this book were caught: at a girth tape, a bench square, a trial strip or a closure check, never by looking at the pattern and thinking it looked right.

This chapter collects the checks from every earlier chapter into one list for the running case, shows how to compare a hand development with a CAD unfold, nests the job's blanks on standard sheets, and sets out a pattern register. It ends with a correct pattern used for a job whose sizes meant something different.

## Checks that do not repeat the arithmetic

A check is useful only if it can fail. Recalculating a number the same way usually repeats the same mistake, so each check below uses a different route to the same quantity: a girth measured with a tape after forming, an outline that must equal a calculated true length, a pattern that must close, an arc that must equal a girth.

```figure
type: compare
title: First-off checks for the running case's fittings
rowhead: Fitting
cols: Check | Expected value | Chapter
caption: This is an illustration. Each check uses a measurement or a relationship independent of the calculation that produced the pattern.
- Ø250 duct | Outside girth with a tape after seaming | 790.4 mm | 2
- Roof piece cut at 20° | Longest generator, line 6 | 591.3 mm from the base | 2
- Five-piece elbow | Outlet square to inlet on the bench; strip length | 90°; 696.7 mm | 3
- Square branch | Saddle depth at the sides | 25.2 mm | 4
- Concentric reducer | Inner arc on the pattern equals small girth | 630.8 mm | 5
- Sander hood | Neck-to-mouth along lines 0, 3, 6 | 257.9, 335.4, 447.3 mm | 6
- Eccentric reducer | Large end girth; flat side length | 630.8 mm; 250.0 mm | 7
- * Fan transition | Closing seam line; round end on template | 350.9 mm; Ø250 | 8
- Hood mouth wired edge | Trial strip fully wrapped | 11.2 mm allowance | 9
```

## Comparing a CAD unfold

Most shops now model fittings in a CAD program's sheet metal tools and unfold them, or buy patterns from software that develops standard fittings. The methods in this book are the way to check those patterns, and three habits make the check quick.

First, **check the basis**. A CAD model drawn to inside dimensions and unfolded with a neutral line at mid-thickness gives the mean-line girth. Many programs place the neutral line with a K-factor, and for a rolled cylinder a K-factor of 0.5 is the mean line. A lower value moves the neutral line inward: at K = 0.4, the Ø250 duct's unfolded girth is 2π × (125 + 0.4 × 0.8) = 787.4 mm instead of 787.9 mm. For 0.8 mm sheet the difference is half a millimetre, inside the work's tolerance; in plate it is not, and the basis must match the shop's practice.

Second, **check three numbers per fitting**, chosen from the table above or from the pattern's key dimensions: a girth or arc, a true length, and an angle or chord. If all three agree with a hand calculation to within half a millimetre, the CAD pattern is right.

Third, **check the allowances separately**. CAD unfolds give the net surface unless seams, laps and flanges were modelled. A CAD pattern that agrees with the hand calculation's net dimensions but has no seam allowance is right and incomplete, and it is the pattern maker's job, not the software's, to know which.

## Nesting the job

The shop buys 0.8 mm galvanised sheet in 2,400 × 1,200 mm sheets. This is an illustration. Each pattern's gross size, its net pattern plus every allowance, rounded up to the rectangle it needs on the sheet, is listed below. The total gross area is about 5.75 m², exactly two sheets' worth at 100% use, so the job needs at least two sheets and in practice three.

```figure
type: compare
title: Gross rectangles for the running case's blanks
rowhead: Blank
cols: Quantity | Rectangle, mm | Area, m²
caption: This is an illustration. Rectangles are rounded up from each pattern's gross size. The total is about 5.75 m², two full 2,400 × 1,200 sheets of area, but shapes rarely nest that tightly.
- Straight duct, Ø250, 1,000 mm between joints | 3 | 805.9 × 1,040 | 2.514
- Roof piece | 1 | 805.9 × 631.3 | 0.509
- Five-piece elbow strip | 1 | 805.9 × 696.7 | 0.561
- Fan transition, with flange | 1 | about 980 × 625 | 0.613
- Sander hood, with wire | 1 | about 860 × 640 | 0.550
- Concentric reducer band | 1 | about 790 × 280 | 0.221
- Eccentric reducer | 1 | about 640 × 330 | 0.211
- Square and 45° branches, Ø150 | 2 | 491.8 × 360 and 340 | 0.344
- Slip collars, Ø250 and Ø200 | 5 | 805.9 and 648.8 × 60 | 0.223
```

The straight ducts show the kind of arithmetic that decides a nest. Laid with their 1,040 mm length across the sheet's 1,200 mm width, the duct blanks are 805.9 mm wide along the sheet's 2,400 mm length. Two fit, using 1,611.8 mm, and the 788.2 mm left is **17.7 mm** short of a third, because 3 × 805.9 = 2,417.7 mm. One sheet therefore yields two duct blanks and an offcut of 788.2 × 1,200 mm.

That offcut is not waste if the next pattern is chosen for it. The elbow strip, 696.7 × 805.9 mm, fits it with its 805.9 mm side across the sheet's width and its 696.7 mm along the offcut. Sheet 1 then holds two ducts and the elbow, about 78% of its area. The third duct, the roof piece and the collars go on sheet 2, and the fitting blanks fill sheet 2 and part of sheet 3, whose remainder is stock for the next job. The whole job's blanks use about 67% of three sheets' area.

A note for designers: if the shop changed its longitudinal seam to a 12 mm lap, the duct blank would be 787.9 + 12 = 799.9 mm and three would fit across 2,400 mm with 0.3 mm to spare. That is too tight to rely on, since the guillotine needs a square edge to work from, but it shows how a few millimetres of allowance can decide whether a sheet yields two pieces or three. Questions about seam type belong at the quotation, not the bench.

## Proving the first piece

Chapters 2, 7 and 9 each found a fault on a first-off piece that would otherwise have spoiled a batch. The shop's rule for any new or changed pattern is the same in every case:

1. Cut **one** blank from the pattern.
2. Cut a trial strip from the offcut for each edge allowance.
3. Form, seam and finish the first piece exactly as production will.
4. Measure it against the first-off checks.
5. Only then cut the rest.

For a stock pattern that has been used successfully before, steps 2 and 4 can be shortened to a girth tape on the first piece. For a new pattern, they cannot.

A stock pattern also needs a full re-proof when anything it depends on changes. The usual triggers are a different sheet thickness, even 0.75 mm instead of 0.8 mm; a new supplier or coating, which can change how the sheet folds and springs; a new grooving tool, crimper or wiring machine, which changes the allowances; and a change of seam type or position. None of these changes the net geometry by much, but each can change the allowances by a millimetre or two, and Chapter 2's short spare showed what 12 mm of missing allowance does. The register's "first-off result" field is updated at each re-proof, so that the date of the last proof is always visible.

Checking is also more reliable when it is independent. The person who set out a pattern tends to check it the way they drew it and repeat any slip. The shop's practice is that a second person checks a new pattern's three key numbers against the job sheet before the first blank is cut, which takes five minutes and is recorded in the register as "checked by".

## Costing from the patterns

The gross area table is also the material estimate. This is an illustration. If the shop pays A$96.00 per 2,400 × 1,200 sheet of 0.8 mm galvanised, excluding GST, the job's three sheets cost A$288.00, or A$316.80 including 10% GST. Charging the job for the 5.75 m² it actually uses, at A$96.00 ÷ 2.88 m² = A$33.33 per m², would recover only A$191.67 excluding GST, and the difference is the value of the offcut left on sheet 3 and of the scrap.

Whether the job carries the offcut depends on whether the shop will use it. A shop with a steady flow of small fittings can store and use a third of a sheet; one that rarely does should price the whole sheet. Either way the pattern areas make the decision visible, which a guess from experience does not.

Labour follows the same logic. Each seam, lap, crimp and wired edge is a counted operation, and the allowance table in Chapter 9 doubles as an operation list: three grooved seams on the straight ducts, five on the elbow, four laps on the elbow, nine crimps across the job, one wired edge. A shop that times each operation once can price fittings from their patterns.

## Patterns as cutting files

A pattern drawn on a computer and cut by a laser, plasma or a CNC notcher is still a pattern, and three faults are common.

The **scale** can be wrong. A file exported in inches and read in millimetres, or drawn at 1:5 and cut at full size, produces a perfect shape at the wrong size. Every cutting file in the shop carries a 100 mm reference square on a separate layer, which the operator measures on the first part.

The **curves** can be coarsened. Some programs export arcs and splines as many short straight segments, and a cut curve made of chords is short, for the same reason as the stepped girths of Chapters 2 and 7. Setting the export's chord tolerance to a few hundredths of a millimetre keeps the error negligible; the Library’s chapter on [profiles that cut cleanly](/reados/publications/drafting-geometry-by-the-numbers/profiles-that-cut-cleanly/) works through the arithmetic.

The **allowances** can be on the wrong layer or missing. The shop's files keep the net pattern and the allowances on separate layers, with the net outline as a reference line that is not cut. The checker can then compare the net shape with the hand calculation and the allowance with the job sheet, one at a time.

## The pattern register

A good pattern outlives the job it was made for, if someone can find it and knows what it is. The shop keeps a register, one line per pattern, and marks the same information on the pattern itself, whether it is a hard template in thin sheet hung on a board or a cutting file on the computer.

```figure
type: checklist
title: What the shop records for each pattern
caption: Each field answers a question that a later user would otherwise guess. The size basis field is the one that prevents the error below.
- Pattern number and revision | for example P-0412 rev B
- Fitting and sizes | Ø250 five-piece 90° elbow, C = 375
- Size basis | inside, outside or mean diameter, stated in words
- Sheet and thickness | 0.8 mm galvanised
- Allowances included | 6 mm grooved seam, 12 mm laps, 40 mm crimp
- Seam position and airflow direction | seams alternate; arrow on each piece
- First-off result and date | strip 696.7 mm; elbow square on bench
- Checked by | the person who checked it, not the person who drew it
- x Pattern stored without its size basis | the cause of the error below
```

Hard patterns need care of their own. A template in thin sheet bends when dropped and wears at its edges when scribed around hundreds of times, and a bent template is a wrong pattern that looks right. The shop checks each stock template's key dimension, a girth or a chord, whenever it is taken down for a new batch, and marks the date on its register line. A template that has drifted by more than half a millimetre is remade from the register's numbers, not copied from itself.

## The error: right pattern, wrong job

This is an illustration. Months later, a second customer ordered Ø250 duct for a ventilation job. The shop pulled its stock Ø250 pattern, blank width 805.9 mm, and cut a batch. The customer's drawings, however, gave duct sizes as outside diameters, because their fittings slid inside the duct rather than over it.

On an outside diameter of 250 mm, the mean diameter is 249.2 mm and the correct mean girth π × 249.2 = 782.9 mm. The stock pattern made duct 5.0 mm larger in girth, 1.6 mm larger in diameter, and the customer's fittings rattled in it. The first piece was not checked against the customer's fitting, because the pattern was "proven".

The pattern was not wrong. It was correct for inside-diameter work, and it had been proven for that. The register entry had no size basis field, and nobody asked. The shop added the field, re-marked every round pattern on the board with "ID" or "OD" in large letters, and added a line to its quotation checklist: "Sizes inside, outside or mean?", the same question Chapter 1 put first.

## Bringing the patterns together

Every fitting in this book came from the same few ideas. Name the solid. Find the true length of every line that the pattern needs, by choosing a view that shows it, by rotating it into one, or by calculating it from its plan and height. Develop on the mean line. Step arcs, not chords. Add every allowance once, at its full value, and notch where layers pile up. Then prove the first piece before cutting the rest, and record what the pattern is for.

The running case's eight fittings used those ideas in different proportions: the straight duct and roof piece mostly girth and allowance, the elbow and branches cut ordinates, the reducers and hood radial lines and true lengths, the eccentric reducer and transition triangulation. A shop that can do all eight can set out almost any developable fitting a customer brings, and can check a CAD pattern for any of them with a calculator and a tape.

## Exercise: a different sheet size

The shop's supplier offers 2,500 × 1,250 mm sheets at a similar price per square metre. How many straight Ø250 duct blanks, 805.9 × 1,040 mm, fit on one sheet, and what offcut is left?

**Worked answer.** With the 1,040 mm length across the 1,250 mm width, the blanks are 805.9 mm along the 2,500 mm length. Three need 3 × 805.9 = **2,417.7 mm**, which fits, leaving an offcut of 2,500 − 2,417.7 = **82.3 mm** along the length, plus a strip 1,250 − 1,040 = **210 mm** wide down the side. The sheet yields three duct blanks instead of two, using 3 × 805.9 × 1,040 ÷ (2,500 × 1,250) = **80.4%** of its area. For a job with many straight ducts, the larger sheet saves a third of the duct sheets; for a job of mostly fittings, the difference matters less. Either way, the calculation takes a minute and belongs on the quotation.
