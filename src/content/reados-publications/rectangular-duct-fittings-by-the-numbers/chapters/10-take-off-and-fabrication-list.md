---
book: rectangular-duct-fittings-by-the-numbers
chapterSlug: take-off-and-fabrication-list
order: 10
title: "The take-off and the fabrication list"
description: "Take off the run: centreline lengths, areas by perimeter that are exact for elbows and offsets, pieces and seams, gross coil with allowances, and a coil order placed on net area."
draft: false
---

A take-off turns a duct drawing into quantities: how much sheet, how many pieces, how many seams and joints, how many cleats and rivets. It is the basis of the shop's material order, its labour estimate and its cutting list, and it is where every pattern in this book is finally counted. A good take-off is quick, because it uses simple rules; it is accurate, because the rules are checked against the patterns; and it is complete, because it counts allowances and waste as well as the duct's own surface.

This chapter takes off the running case's main run and its branch tap. It shows that a simple rule, perimeter times centreline length, gives the exact area of every elbow and offset in this book, builds the fabrication list of pieces and seams, converts net area into gross coil with allowances and nesting waste, and ends with a coil order placed on net area that left the shop 3.6 m short.

## The centreline rule

The quickest estimate of a fitting's sheet area is its perimeter multiplied by the length of its centreline. For straight duct it is obviously exact. For the fittings in this book it turns out to be exact too, and it is worth seeing why.

- The **radius elbow** from Chapter 4: its centreline, arc plus tangents, is π ÷ 2 × 400 + 100 = 728.3 mm. Perimeter times centreline is 2.0 × 0.7283 = **1.457 m²**. Its pieces add up to two cheeks of 0.2913 m² and wrappers of 0.6 × (0.4142 + 1.0425) = 0.874 m², also **1.457 m²**. The throat is shorter than the centreline by exactly as much as the heel is longer, and the cheeks' area is their width times the centreline arc.
- The **mitred elbow** from Chapter 3: its centreline is 600 + 600 = 1,200 mm, so the rule gives **2.400 m²**. Its pieces are two cheeks of 0.720 m², a throat wrapper of 0.240 m² and a heel wrapper of 0.720 m²: **2.400 m²**.
- The **offsets** from Chapters 5 and 6: centrelines of 1,248.7 and 1,373.5 mm give **2.497** and **2.747 m²**, and summing their pieces gives the same.

The rule fails only where the faces slope relative to the centreline, as on a transition. The running case's transition, with an average perimeter of 2.3 m over its 600 mm length, comes out at 1.380 m² by the rule against 1.393 m² by its four true faces, 0.9% low, because the sloping faces are slightly longer than the length.

```figure
type: compare
title: Area by the centreline rule against the sum of the pieces
rowhead: Fitting
cols: Centreline, mm | Perimeter × centreline, m² | Sum of net pieces, m²
caption: The rule is exact for elbows and offsets, where what one side gains another loses, and slightly low for transitions, whose faces slope.
- Radius elbow, 90°, R200 throat | 728.3 | 1.457 | 1.457
- Mitred elbow, 90° | 1,200.0 | 2.400 | 2.400
- Single-plane offset, mitred | 1,248.7 | 2.497 | 2.497
- Diagonal offset | 1,373.5 | 2.747 | 2.747
- * Transition, 800 × 500 to 600 × 400 | 600.0 | 1.380 | 1.393
```

## The main run's take-off

This is an illustration. The running case's main run, in order, is the transition, the mitred elbow, eight straight sections, the radius elbow, the single-plane offset and the diagonal offset, with the shoe tap cut into one straight section. Its net areas are:

- transition: 1.393 m² plus a 30 mm inlet flange round 2.6 m of perimeter, 0.078 m², so **1.471 m²**;
- eight straight sections at 1,176 mm effective length: 8 × 2.0 × 1.176 = **18.816 m²**;
- mitred elbow **2.400 m²**, radius elbow **1.457 m²**, offset **2.497 m²**, diagonal offset **2.747 m²**;
- branch shoe tap, with its collar: **0.450 m²**.

The total net area is **29.84 m²**, which in 0.8 mm steel is about **187 kg**. The main run's centreline is 600 + 9,408 + 1,200 + 728.3 + 1,248.7 + 1,373.5 mm, about **14.6 m**.

```figure
type: stack
title: Net sheet area of the main run, by item
unit: m²
caption: This is an illustration. Straight duct is 63% of the area; the six fittings are the rest, and most of the labour.
- Straight sections, 8 | 18.816
- Diagonal offset | 2.747
- Single-plane offset | 2.497
- Mitred elbow | 2.4
- Transition with flange | 1.471
- Radius elbow | 1.457
- Shoe tap | 0.45
```

## From net to gross

Net area is not what the shop buys. Every blank carries seam and joint allowances, and every fitting's blank is nested on coil with some waste around its shape.

For the straight duct, the gross area is known exactly from Chapter 2's blanks: 16 L-pieces of 1,033.2 × 1,200 mm, **19.84 m²**, 5.4% more than the net 18.82 m².

For the fittings, the shop uses two factors from its own records. This is an illustration. Its seam, joint and flange allowances add about **10%** to a fitting's net area, and nesting irregular fitting blanks on 1,200 mm coil uses about **85%** of the coil they occupy. The fittings' net 11.02 m² therefore need 11.02 × 1.10 ÷ 0.85 = **14.26 m²** of coil.

The run's gross requirement is 19.84 + 14.26 = **34.10 m²**, or 34.10 ÷ 1.2 = **28.4 m** of 1,200 mm coil, about 214 kg. Those factors are the shop's own, measured from past jobs; a shop without records should start with its nests for a few jobs and measure them, rather than borrow another shop's numbers.

## The fabrication list

The take-off's other output is the fabrication list: every piece, with its size, quantity, seams and the chapter its pattern came from. It is what the cutting, rolling, folding and assembly benches work from, and it is what the estimator times.

```figure
type: compare
title: Fabrication list for the main run, pieces and seams
rowhead: Item
cols: Quantity | Pieces each | Corner seams each | Other operations
caption: This is an illustration. Labour follows pieces, seams and folds more closely than it follows area.
- Straight section | 8 | 2 L-pieces | 2 | cross-break wide faces
- Transition | 1 | 2 L-pieces | 2 | inlet flange, 88.45° folds
- Mitred elbow | 1 | 5: 2 cheeks, 3 wrappers | 4, plus heel joint | vane rails
- Radius elbow | 1 | 4: 2 cheeks, 2 wrappers | 4 | curve wrappers, notch heel flange
- Single-plane offset | 1 | 4: 2 cheeks, 2 wrappers | 4 | four 18.43° folds
- * Diagonal offset | 1 | 4 long pieces | 4 | eight folds at two angles
- Shoe tap | 1 | 5 | 4 | collar, about 24 rivets
- Joints | 12 | S and drive cleats | | 14.4 m S-cleat, 10.8 m drive
```

The list makes a point the area table hides. The eight straight sections are 63% of the sheet but only 16 pieces and 16 seams, all identical. The six fittings are 37% of the sheet and 24 pieces, almost all different, with folds at five different angles. An estimate that charged labour by area would undercharge every fitting job and overcharge every straight run.

## From the list to labour hours

The fabrication list's counts are what the estimator times. This is an illustration. The shop's own timings, measured over past jobs, are about 3 minutes to mark and cut a piece, 5 minutes to roll, close and seal a corner seam, 1.5 minutes per fold and 8 minutes per transverse joint including its cleats and sealing.

The main run has 40 pieces, 39 corner seams (two per straight section and per transition, four on each elbow, offset and tap, and the mitred elbow's heel joint), 32 folds (one per L-piece, one on the mitred elbow's throat wrapper, four on the single-plane offset, eight on the diagonal offset and one at the shoe) and 12 joints. Those come to 40 × 3 + 39 × 5 + 32 × 1.5 + 12 × 8 = 459 minutes, about **7.7 hours**, before curving the radius elbow's wrappers, notching, cross-breaking, fixing vane rails and the floor checks, which the shop times separately.

The split is instructive. The eight straight sections account for about 3.6 hours of those 7.7, the six fittings for about 4.1 hours, though the fittings are only 37% of the sheet. Per square metre, the fittings take roughly twice the straight duct's labour, and the diagonal offset, with its eight folds at two different angles, is the most expensive piece on the list per square metre.

## Packing for dispatch

Rectangular duct is bulky and light. The eight straight sections, assembled, enclose 8 × 0.6 × 0.4 × 1.176 = **2.26 m³** of air and weigh about 125 kg; on a truck they take up space out of all proportion to their mass. Shipped knocked down, as unassembled L-pieces stacked one inside another, the same sixteen pieces occupy little more than one section's volume, about a third of a cubic metre.

Whether to ship assembled or knocked down depends on who assembles the duct and where. Knocked-down duct saves transport and site storage but moves the corner seams' assembly and sealing to site, where it is slower and harder to do well. The fabrication list records the choice for each item, because it changes both the shop's labour and the installer's.

## Checking the take-off against the drawing

Before the order is placed, the take-off is checked against the drawing in three ways.

1. **Centreline length**: the sum of the items' centrelines, 14.6 m for the main run, should equal the run's length measured on the drawing between the air handler and the run's end. A gap means a missing piece; an excess, a piece counted twice.
2. **Fittings count**: every change of direction, size or level on the drawing should appear as a fitting on the list, and every fitting on the list should be found on the drawing.
3. **Mass**: the gross mass, about 214 kg here, should be in proportion with similar past jobs. A take-off whose mass per metre of run is far from the shop's experience has an error somewhere, often in a thickness or a coil width.

## When the drawing changes

Duct layouts change between quotation and fabrication more often than most drawings, because duct is fitted around everything else in a building. A beam moves, a sprinkler main is rerouted, a ceiling drops, and a single-plane offset becomes a diagonal one or an elbow becomes a pair of 45° bends.

Each change moves the take-off in more than one column. Replacing the single-plane offset with a second fitting like the diagonal offset would add only about 0.25 m² of sheet by the centreline rule, a trivial amount, but it would replace four folds at one angle with eight at two others and four simple pattern pieces with four parallelograms that each need calculating. The area barely moves; the labour and the risk of error move a great deal.

The shop therefore treats every drawing revision as a new take-off for the items it touches: their centrelines, areas, pieces, seams and folds, recalculated from the new geometry and compared with the old. The comparison goes to whoever approves variations, with the labour change shown, so that a revision that looks small on the drawing is not absorbed at the shop's expense. Keeping the take-off in the same three-column form for every revision makes the comparison a matter of reading across a row.

## The error: coil ordered on net area

This is an illustration. For an earlier job of the same kind, the shop's new estimator ordered coil from the net area alone: on this run, that would have been 29.84 ÷ 1.2 = **24.9 m** of coil. The job's real requirement, with allowances and nesting waste, was 28.4 m, so the order was about **3.6 m short**, about 12.5% of what was needed.

The shortfall appeared on the last day of cutting, when the diagonal offset's long pieces could not be nested on what remained. The extra coil cost a rush delivery and a day's delay. The estimator's arithmetic had been right; only the basis was wrong. The shop's take-off sheet now carries three columns, net area, gross area and coil length, and the coil order is taken from the third.

```figure
type: checklist
title: Take-off checks before ordering
caption: Each line moves the quantity from what the duct is to what the shop must buy and make.
- Net area by the centreline rule, transitions by their faces | 29.84 m²
- Straight duct gross from its actual blanks | 19.84 m²
- Fittings gross from the shop's measured allowance and nesting factors | 14.26 m²
- Coil length from gross area and coil width | 28.4 m
- Pieces, seams, folds and joints counted for labour | 40 pieces, 12 joints
- x Coil ordered on net area | 3.6 m short
```

## Bringing the fittings together

Every fitting in this book came from a few ideas. State which dimension is in the plane of each bend. Develop each face as a flat shape: cheeks cut to shape, wrappers cut to length. Find every sloping face's true height or true length by Pythagoras, never from a single view. Cut each mitre at half the turn at that joint. In an offset, the mitre planes are parallel, the sloping section's edges are all equal, and the two side wrappers are the same length. Add every seam, joint and flange allowance from the shop's own trial pieces, and notch where layers meet. Then take off the run by its centrelines and count its pieces, because the sheet is the smaller part of the cost.

## Exercise: the branch run

The 300 × 200 mm branch runs 4,500 mm from the shoe tap, with one 90° radius elbow at its far end, 200 mm in the plane of the bend, throat radius 100 mm and 50 mm tangents. Find the branch's net area by the centreline rule and its mass in 0.8 mm steel.

**Worked answer.**

- Perimeter: 2 × (300 + 200) = **1.0 m**.
- Straight run: 4.5 m of centreline, so 1.0 × 4.5 = **4.500 m²**.
- Elbow: centreline radius 100 + 100 = 200 mm, arc π ÷ 2 × 200 = 314.2 mm, plus tangents of 100 mm: 414.2 mm, so 1.0 × 0.4142 = **0.414 m²**.
- Total net: **4.914 m²**, about **30.9 kg** in 0.8 mm steel.

With the straight duct's 6.2% seam share from Chapter 2's exercise and a fitting allowance on the elbow, the branch's gross sheet will be roughly 5.3 m², but the shop takes that from its blanks and factors, not from a single percentage. The branch also adds one more straight run and one more elbow to the fabrication list: five or so straight sections of L-pieces, four more corner seams on the elbow, and the joints between them, each counted and timed exactly as the main run's were.
