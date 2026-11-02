---
book: shop-floor-optimisation-by-the-numbers
chapterSlug: nesting-blanks-on-sheets
order: 7
title: "Nesting blanks on sheets"
description: "Lay rectangular blanks on stock sheets for least waste: grid and two-block layouts in the KEVOS® sheet nesting tool, the area bound, sheet size choice, mixed nesting and what utilisation hides."
draft: false
---

Cutting blanks from sheet is the two-dimensional version of Chapter 6's bar cutting, and it is harder in every way. Blanks can be placed in two orientations, they must not overlap, they need a gap between them for the cut and a margin at the sheet's edge, and the number of possible layouts is enormous even for simple rectangles. Nesting software for lasers and punches handles irregular shapes with sophisticated search, but most of the money in a sheet-metal shop is spent on rectangular or near-rectangular blanks, and for those a few simple layouts and a little arithmetic go a long way.

This chapter nests the EC-600's door, back and side blanks with the KEVOS® sheet nesting tool, compares two sheet sizes, mixes blanks on one sheet, and explains the bound that judges any layout. Its error is a sheet size chosen by habit.

## The blanks

This is an illustration. Each EC-600 cabinet is folded from six blanks of 1.6 mm cold-rolled steel: two square blanks of 690 × 690 mm for the door and the back, and four side blanks of 640 × 330 mm for the two sides, the roof and the floor. A week's output of 60 cabinets therefore needs 120 square blanks and 240 side blanks. The laser cuts with a 10 mm gap between blanks, which allows for the kerf and a narrow web that holds the skeleton together, and leaves a 10 mm margin around the sheet's edge.

```figure
type: stats
title: A week's EC-600 blanks
caption: This is an illustration. Prices are illustrative and exclude GST; both sheet sizes cost the same per square metre, A$33.33.
- 120 | square blanks, 690 × 690 mm
- 240 | side blanks, 640 × 330 mm
- 107.8 m² | area of the week's blanks
- A$96 | price of a 2,400 × 1,200 mm sheet
- A$150 | price of a 3,000 × 1,500 mm sheet
```

## The area bound and utilisation

The bound for nesting is the area bound: blanks cannot cover more than the whole sheet, so the number of sheets needed is at least the total blank area divided by the sheet area. The week's blanks cover 120 × 0.690 × 0.690 + 240 × 0.640 × 0.330 = 57.1 + 50.7 = 107.8 m². On 2,400 × 1,200 sheets of 2.88 m², the bound is 37.4, so at least 38 sheets; on 3,000 × 1,500 sheets of 4.5 m², 24.0, so at least 24 sheets, as long as blanks can be mixed freely.

The area bound is weaker than the length bound for bars, because blanks cannot be cut to fit the corners and edges of the sheet, so real layouts nearly always fall short of it. Utilisation, the blanks' area divided by the sheet's, is the usual measure of how close a layout comes: 85% to 90% is good for rectangles of one size on a well-matched sheet, and much lower values usually mean the sheet and the blank are badly matched.

## Grid and two-block layouts

For blanks of one size, two kinds of layout cover most of what is possible. A straight grid places identical rows and columns of blanks in one orientation, or turned through 90°. A two-block layout places one or more rows in one orientation and fills the remaining strip with blanks turned the other way, which often fits an extra row or column into the space a grid wastes.

The [sheet nesting yield check](/tools/sheet-nesting-yield/) tries both grids and the two-block layouts in both directions of the sheet, and reports the best: blanks per sheet, material utilisation, sheets for the order, spare blanks and material cost per part. It takes the sheet's length and width, the blank's length and width, the gap between blanks, the edge margin, the number of blanks needed, the price per sheet and the lowest utilisation the user will accept, which it checks.

```figure
type: compare
title: The sheet nesting tool's results for EC-600 blanks
cols: Grid lengthways | Grid turned | Best two-block | Blanks per sheet | Utilisation | Sheets for the week | Cost per blank, A$
rowhead: Blank on sheet
- 690 × 690 on 2,400 × 1,200 | 3 | 3 | 3 | 3 | 49.6% | 40 | 32.00
- * 690 × 690 on 3,000 × 1,500 | 8 | 8 | 8 | 8 | 84.6% | 15 | 18.75
- 640 × 330 on 2,400 × 1,200 | 9 | 7 | 10 | 10 | 73.3% | 24 | 9.60
- * 640 × 330 on 3,000 × 1,500 | 16 | 16 | 18 | 18 | 84.5% | 14 | 8.75
caption: This is an illustration from the KEVOS® sheet nesting tool, with a 10 mm gap and 10 mm edge margin. The square blank on the smaller sheet fails the tool's 70% utilisation check. On the larger sheet, 14 sheets give 252 side blanks, 12 spare.
```

The side blanks show the value of the two-block layout. On the 2,400 × 1,200 sheet, a straight grid fits 9 blanks lengthways, three by three. The two-block layout puts one row of three blanks lengthways across one edge, using 340 mm of the sheet's usable 1,180 mm width, and fills the remaining 840 mm strip with seven blanks turned the other way, 10 in all. On the larger sheet, the best layout runs three bands of four blanks with their short sides along the sheet's 1,500 mm width, and fills the remaining 1,030 mm with six turned blanks, 18 in all against a grid's 16.

The square blank shows the opposite problem. A 690 mm square needs 700 mm with its gap, and the smaller sheet's usable 1,180 mm width fits only one row of them, with 480 mm left over that no 690 mm blank can use. Three blanks per sheet gives a utilisation of 49.6%, and the tool flags the layout as unacceptable against a 70% limit. The larger sheet's 1,480 mm usable width fits two rows, and its 2,980 mm length four columns, for 8 blanks and 84.6%.

## Choosing the sheet size

```figure
type: compare
title: A week's EC-600 blanks on each sheet size, one blank type per sheet
cols: Sheets for squares | Sheets for sides | Total sheets | Material, A$ ex GST
rowhead: Sheet size
- 2,400 × 1,200 mm | 40 | 24 | 64 | 6,144
- * 3,000 × 1,500 mm | 15 | 14 | 29 | 4,350
caption: This is an illustration. Same blanks, same price per square metre. The larger sheet saves A$1,794 a week, mostly on the square blanks, which fit the smaller sheet badly.
```

Because both sheets cost the same per square metre, the whole difference comes from the fit. The larger sheet saves A$1,794 a week, about A$93,000 over a 52-week year, almost all of it from the door and back blanks. Before switching, the shop confirmed three practical points: that the laser's 3,000 × 1,500 mm bed takes the larger sheet, that the sheet loader and the store's racking can handle it, and that the steel supplier stocks it in this grade and thickness at a comparable price. The larger sheet also produces larger skeletons, which need handling, and is heavier for one person to manoeuvre, which the store layout had to allow for.

## Mixing blanks on a sheet

Single-blank layouts waste the strips their grids cannot use, and mixing blank types fills those strips. Real nesting software mixes freely; the tool, by design, handles one blank size at a time, and the mixed case is worth working by hand to see what it gains.

This is an illustration. On the 2,400 × 1,200 sheet, one row of three square blanks uses 700 mm of the 1,180 mm usable width and leaves a strip 2,380 × 480 mm. Side blanks laid lengthways fit that strip three at a time: 640 + 10 mm three times is 1,950 mm along the length, and 330 mm across the 480 mm strip. Each sheet then carries three square blanks and three side blanks, a utilisation of (3 × 0.4761 + 3 × 0.2112) ÷ 2.88 = 71.6%, against 49.6% for squares alone.

```figure
type: compare
title: The week's blanks on 2,400 × 1,200 sheets, separate and mixed
cols: Sheets | Material, A$ ex GST
rowhead: Layout
- Separate: squares 3 a sheet, sides 10 a sheet | 64 | 6,144
- Mixed: 3 squares and 3 sides a sheet, then sides 10 a sheet | 52 | 4,992
- * Separate on 3,000 × 1,500 sheets | 29 | 4,350
caption: This is an illustration. Forty mixed sheets give all 120 squares and 120 sides; the remaining 120 sides need 12 more sheets. Mixing recovers most of the smaller sheet's loss, but not all of it.
```

Mixing on the smaller sheet saves A$1,152 a week against separate layouts, but the larger sheet with no mixing at all is still A$642 a week cheaper. The order in which to try improvements is therefore: first the sheet size, then the layout of each blank, then mixing. Each step can be checked against the area bound: the larger sheet's 29 sheets against a bound of 24 shows that perfect mixing could save at most five more sheets a week, about A$750, which tells the shop whether better nesting software is worth its price.

## What utilisation hides

Utilisation is a useful headline but an incomplete measure. It ignores the value of remnants: a skeleton with a clean 480 mm strip along one edge can be cut into gland plates or brackets, while a skeleton with the same area of waste scattered as webs cannot. It ignores cutting time: a two-block layout has more cut length where blanks meet sheet edges differently, and on a slow laser the extra minutes can outweigh a small material saving. And it ignores the parts' grain or rolling direction, which matters for parts that are bent tightly or must match in appearance, and which may forbid turning a blank.

```figure
type: checklist
title: Before accepting a nest
caption: The open item was the cause of this chapter's error. Sheet sizes deserve the same scrutiny as layouts.
- x Gap and edge margin match the laser's actual practice | kerf, web and clamp zones
- x Turning blanks is allowed for this part | grain, rolling direction, appearance
- ? More than one sheet size has been checked | the sheet chosen by habit may fit badly
- x Utilisation meets the shop's limit, or the reason is recorded | the tool's check
- x Useful remnants are marked for the remnant rack | strips and large offcuts
- x Material cost per part matches the quote's assumption | Quoting Sheet Metal Work, Chapter 2
```

Quoting depends on the same numbers. *Quoting Sheet Metal Work by the Numbers* builds its material cost from nesting yield in [Material, blanks and nesting](/reados/publications/quoting-sheet-metal-work-by-the-numbers/material-blanks-and-nesting/), and a quote built on the smaller sheet's figures for the EC-600 would carry A$1,794 a week of material the shop no longer buys.

## Irregular parts and nesting software

Most real parts are not rectangles. Brackets have notches, gussets are triangles, and covers have rounded corners and cut-outs. Laser and punch nesting software places these true shapes, rotating them, fitting small parts inside the cut-outs of larger ones, and sometimes sharing a single cut line between neighbouring straight edges, a technique called common-line cutting that saves both material and cutting time. These are search problems far larger than any in this chapter, and the software solves them with heuristics of the kind Chapter 10 describes: place parts by a rule, then improve the arrangement by moving and swapping until no change helps.

The bound still applies, and it is the best way to judge what the software is doing. The total part area divided by the sheet area gives the least number of sheets no software can beat, and the gap between the software's result and that bound shows how much room is left. A vendor's claim of improved utilisation can be tested the same way: nest the shop's own recent jobs in both packages, and compare each result with the area bound for the same parts. The rectangular-blank results of the sheet nesting tool are also a useful check on the software. If the software's nest of a simple rectangular blank is worse than the tool's grid or two-block layout, its settings for gap, margin or rotation are probably wrong.

Two settings cause most disappointing nests. One is forbidding rotation for parts that could safely be turned, which halves the software's freedom. The other is a gap or margin larger than the laser needs, which costs a row or a column on many blanks, as the square blank's 480 mm strip showed. Both are worth checking against the cutting practice of the actual machine.

## The error: a sheet size chosen by habit

This is an illustration. When EC-600 was introduced, its blanks were nested on 2,400 × 1,200 mm sheets because that was the size the shop had always bought for job work. Nobody checked the fit. The material cost per cabinet was set from the first month's actual consumption, and because the cost was what it was, nobody questioned it.

The problem surfaced when the purchasing officer noticed that EC-600's steel consumption per cabinet was almost half as much again as the blank area suggested. The sheet nesting tool, given the door blank on the usual sheet, reported 3 blanks per sheet at 49.6% utilisation and failed its own 70% check. Entering the larger sheet gave 8 blanks at 84.6%. The fix took a week to arrange with the supplier and the store, and cut the week's material cost from A$6,144 to A$4,350. The lesson is that a sheet size is a design decision for each product, not a property of the shop, and that the tool's utilisation check is worth running for every new blank.

## Exercise: a new gland plate

This is an illustration. A larger cabinet, EC-800, adds a 520 × 260 mm gland plate blank, 180 needed a month, from the same steel. With a 10 mm gap and 10 mm margin:

1. How many blanks does a straight grid fit on a 2,400 × 1,200 mm sheet, lengthways and turned?
2. The sheet nesting tool finds a better layout. How many blanks per sheet, and what utilisation, sheets and material cost per blank for 180 at A$96 a sheet?
3. What is the area bound for 180 blanks on this sheet?

**Worked answer.**

1. Usable sheet 2,380 × 1,180 mm. Lengthways: (2,380 + 10) ÷ 530 = 4.5, so 4 along; (1,180 + 10) ÷ 270 = 4.4, so 4 across: **16**. Turned: (2,380 + 10) ÷ 270 = 8.9, so 8 along; (1,180 + 10) ÷ 530 = 2.2, so 2 across: **16**.
2. The tool reports **18** blanks per sheet from a two-block layout. Four bands of four blanks, each band 520 mm along the sheet's length, use 2,120 mm of the usable 2,380 mm; the 260 mm strip left over takes two more blanks turned the other way, which the straight grids waste. Utilisation = 18 × 0.520 × 0.260 ÷ 2.88 = **84.5%**. Sheets = 180 ÷ 18 = **10**, with no spare blanks. Cost per blank = 10 × 96 ÷ 180 = **A$5.33** excluding GST.
3. 180 × 0.1352 m² = 24.3 m², divided by 2.88 m² = 8.45 sheets, so at least **9 sheets**. The tool's 10 sheets are one above the bound, so at most one sheet a month, A$96, could be saved by a cleverer layout or by mixing the gland plates with other blanks. That is worth trying in nesting software, and not worth much more effort.
