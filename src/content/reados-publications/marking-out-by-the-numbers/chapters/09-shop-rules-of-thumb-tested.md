---
book: marking-out-by-the-numbers
chapterSlug: shop-rules-of-thumb-tested
order: 9
title: "Shop rules of thumb, tested"
description: "Test old and new shop shortcuts against exact geometry: circle constants, approximations for π, a folding-rule trick, six radii, ellipse girths and the gallon rule, in millimetres on real parts."
draft: false
---

Every trade carries rules of thumb. They are short, easy to remember and quick to use, and most of them were worked out by someone careful a long time ago. Some are exact identities dressed up as tricks. Some are close approximations that were good enough for the work of their day. A few are wrong, or right only in the case they were invented for, and they survive because nobody has tested them on the work in front of them.

This chapter tests a selection, most of them taken from Osborne's 1910 tin-shop handbook, one of this book's sources, with some that are still repeated in shops today. The method is the same for each: state the rule, find the exact relationship it stands for, work out the error as a percentage, and then, the step that matters, turn the percentage into millimetres on a real C-12 part and compare it with the marking budget. A rule is good enough when its error is small compared with the budget, and not otherwise.

## How to test a rule

1. **State it exactly,** including the units it assumes. Many old rules assume inches or US gallons without saying so.
2. **Find the exact form.** Most circle rules are a disguised π, √π or √2; others come from similar triangles.
3. **Work out the error** as a percentage of the exact value.
4. **Apply it to the job.** Multiply the percentage by the actual size. A 0.05% error is 0.5 mm on a metre and 0.05 mm on 100 mm.
5. **Compare with the budget.** If the error uses more than a small fraction of the marking budget, use the exact form.

The fifth step is what distinguishes a tested rule from folklore. "Near enough" has to mean near enough for this part.

## Constants that were exact

Osborne's handbook gives a dozen decimal multipliers for circle work. Tested against the exact values, they are almost all correct to the four figures given.

```figure
type: compare
title: Osborne's circle constants against their exact values
rowhead: Rule
cols: Multiplier given | Exact value | What it is | Error
caption: Constants restated from Osborne (1910). Every one is correct to the figures given; the errors are smaller than any hand layout can show. The degree-to-length rule is the weakest, and on the C-12 hood's 753.63 mm arc it gives 753.49 mm, 0.15 mm short.
- Side of a square of equal area, from the diameter | 0.8862 | 0.88623 | √π ÷ 2 | −0.003%
- Side of the inscribed square, from the diameter | 0.7071 | 0.70711 | 1 ÷ √2 | −0.001%
- Side of the inscribed square, from the circumference | 0.2251 | 0.22508 | 1 ÷ (π√2) | +0.009%
- Arc length per degree per unit radius | 0.01745 | 0.0174533 | π ÷ 180 | −0.019%
- Ellipse area, from the product of the axes | 0.7854 | 0.78540 | π ÷ 4 | +0.0002%
- Diameter from the circumference | 0.3183 | 0.31831 | 1 ÷ π | −0.003%
- Circle area from the circumference squared | 0.07958 | 0.079577 | 1 ÷ (4π) | +0.003%
```

These are exact rules in practice. They were tools for people working with pencil and paper, who needed a single multiplication in place of a square root, and they remain useful as checks: a girth calculated on a calculator should agree with diameter ÷ 0.3183 to four figures, and if it does not, a key was pressed wrongly.

Osborne also gives a table of multipliers that turn a circle's circumference into its area for diameters from 0.1 to 48, with the curiosity that at a diameter of 4 the two are the same number. The table is exact, and the reason is simple: the area is always the circumference multiplied by a quarter of the diameter, since πD × D ÷ 4 = πD² ÷ 4. At a diameter of 4 the multiplier is 1. The whole table collapses into one identity, which is easier to remember and impossible to misread.

## Approximations for π

The girth of the C-12 collar on its mean line is π × 301.2 = 946.25 mm, and its marking budget is ±0.5 mm. Each approximation for π can be tested on it directly.

```figure
type: compare
title: The collar girth by different values of π
rowhead: Value used
cols: Girth, mm | Error, mm | Error, %
caption: Mean diameter 301.2 mm. Values within the ±0.5 mm budget are usable for this part; 3 is the "three diameters" rule of thumb, and it is the hexagon of Chapter 5, not the circle.
- π (exact) | 946.25 | 0.00 | 0.000
- 3.1416 | 946.25 | 0.00 | 0.000
- 22/7 (3D + D/7) | 946.63 | +0.38 | +0.040
- 3.14 | 945.77 | −0.48 | −0.051
- * Osborne's folding-rule setting | 948.04 | +1.79 | +0.189
- 3 | 903.60 | −42.65 | −4.507
```

Both 22/7 and 3.14 pass for the collar, but only just: each uses three-quarters or more of the budget on its own, leaving nothing for the tape and the scriber. On a larger part they fail. A Ø1,200 mm duct marked with 3.14 comes out 1.9 mm short in girth, which is more than most seams can take up. The calculator's π costs nothing and should be the default; the approximations belong to a time when it was not available.

## A folding-rule trick, and why it works

Osborne describes a way of finding a circumference without figures using a two-foot folding rule. A mark is made on both legs 3 13/16 inches from the centre of the hinge. The legs are opened until the two marks are the circle's diameter apart, and the distance between the tips of the legs is then, he says, the circumference.

The trick is similar triangles. The legs, the line between the marks and the line between the tips form two isosceles triangles with the same angle at the hinge, so the tips' separation is the marks' separation multiplied by 12 ÷ 3 13/16 = 3.1475. That is π plus 0.19%. Osborne notes the result for a 7⅝-inch diameter, 24 inches against a true 23.955, which is exactly that ratio. The rule works for any diameter up to twice the mark's distance from the hinge, where the legs open into a straight line.

The trick is not approximate in principle. It is exact if the marks are placed at the leg length divided by π. On a metric rule with 500 mm legs, the marks go at 500 ÷ π = 159.15 mm from the hinge, and the method then gives the circumference of any diameter up to 318 mm, limited only by how accurately the marks and the diameter can be set. Osborne's 3 13/16 inches was the nearest sixteenth to 12 ÷ π = 3.820 inches, and the rounding is the whole of its error. On the C-12 collar it gives a girth 1.79 mm long, more than three times the budget, which shows how much a sixteenth of an inch matters when it is multiplied by π.

## Rules that fail

### Six radii round a different circle

Chapter 5 showed that six radii step round their own circle exactly, because they form a hexagon whose corners lie on it, but that the hexagon's perimeter is 4.5% less than the circle's, so six radii stepped along a pattern arc to give a girth make the pattern too short. Osborne warns against the mistake. It is listed here because it is the commonest failure of a rule that is exact in one setting and wrong in another.

### The girth of an ellipse as π(a + b)

The perimeter of an ellipse has no simple exact formula. The quick rule, π times the sum of the semi-axes, is excellent for ellipses that are nearly circles and poor for long ones.

```figure
type: compare
title: π(a + b) against the true perimeter of an ellipse
rowhead: Ellipse, semi-axes in mm
cols: π(a + b) | True perimeter | Error
caption: True perimeters calculated by numerical integration. For the C-12 apron hole the rule is exact for every practical purpose; for an oval twice as long as it is wide it is 2.7% short, about 53 mm.
- * Apron hole, 154.55 × 152.20 | 963.68 mm | 963.70 mm | −0.001%
- Oval, 300 × 200 | 1,570.80 mm | 1,586.54 mm | −0.99%
- Oval, 400 × 200 | 1,884.96 mm | 1,937.69 mm | −2.72%
```

A rule that is excellent on the job it was learned on can be badly wrong on the next one. Here the deciding quantity is how far the ellipse departs from a circle.

### A quarter of a circle by its chord

Osborne's chimney-top pattern sets off "a little less than a quarter of the circumference" each way from a centre line, a sensible bench rule for a shape that is later formed to fit. It is worth knowing why "a little less" works: the chord of a quarter circle is 0.7071 D, while the arc is 0.7854 D, so the chord is about 90% of the arc. Where a pattern's edge will be bent round to the arc, it is the arc that must be marked; where it stays straight, as across the corner of a transition, the chord is right. The rule of thumb hides that distinction in the word "little".

## Gallons are not one thing

Osborne's rule for the contents of a cylindrical vessel is: square the diameter in inches, multiply by the height in inches, and multiply by 0.0034 to get gallons. Tested, it is exact to better than one part in a hundred thousand, because 0.0034 is π ÷ 4 ÷ 231 and 231 cubic inches is the United States gallon.

That is the trap for an Australian reader. An imperial gallon is 4.54609 litres, about 20% larger than the US gallon of 3.785 litres. The familiar "44-gallon drum" holds about 200 litres, which is 44 imperial gallons; 44 US gallons is only 166.6 litres. A US-based rule applied to a request in imperial gallons sizes the vessel about 17% too small.

The metric rule needs no gallons at all. With the diameter D and height H in millimetres, the volume in litres is D² × H × π ÷ 4 ÷ 1,000,000. The C-12 collar, Ø300 × 250 mm inside, holds 17.67 litres, a check that is only useful as an example but shows the size of the numbers.

## Converting an inch rule

Old rules arrive in inches, and converting them is a test in its own right. The inch is defined as exactly 25.4 mm, as NIST Special Publication 811 sets out, so a conversion need never be approximate. The question is what kind of rule is being converted.

A **ratio rule** needs no conversion at all. Osborne's circle constants, the folding-rule ratio and the steel-square angle settings of Chapter 6 depend only on the ratio of two lengths, so they work in any unit. The square's settings for 12 inches become settings for 300 mm by scaling, which gives the metric table of Chapter 6; they do not become millimetre values by multiplying each inch figure by 25.4 and then reading it on a 300 mm arm, which would mix a 304.8 mm run with a 300 mm one.

A **length rule** must be converted exactly, then rounded with care. Osborne's ¼-inch fold allowances are 6.35 mm, not 6 mm, and his 3 13/16-inch mark is 96.84 mm. Rounding 25.4 to 25 to make the arithmetic easy introduces an error of 1.6%, which on a metre is 16 mm and on the collar's girth would be 15 mm. Where a converted length is rounded, the rounding should be to a stated precision, and the rounded value should then be checked against the tolerance as if it were a new rule.

## Rules that are calibrations, not geometry

Some rules cannot be tested by geometry at all. An allowance for a wired edge, a folded seam or a bend depends on the machine, the tooling, the sheet and the operator, and a rule of thumb for it is a record of someone's past calibration. It may be right in their shop and wrong in another. Such rules are tested by making a trial strip and measuring what it actually takes up, as [Seams, edges and notches](/reados/publications/sheet-metal-patterns-by-the-numbers/seams-edges-and-notches/) describes, and the result goes on the card with the date and the machine it was measured on.

## The C-12 rule card

This is an illustration. The shop keeps a laminated card in its marking-out box. After this testing, it reads:

```figure
type: checklist
title: The C-12 shop's rule card, after testing
caption: This is an illustration. Each rule on the card has been tested against exact geometry and against the shop's usual marking budgets.
- Girth on the mean line | π × (inside diameter + thickness), with the calculator's π
- Hole circles | chords 2R sin(180° ÷ n) on the flat; girth ÷ n on a blank that will be rolled
- Arc from chord and rise | R = ((c ÷ 2)² + h²) ÷ (2h); measure the rise at the true middle
- Angles | rise = run × tan θ, or chord = 2R sin(θ ÷ 2); never the sine for the rise
- Ellipse girth | π(a + b) only when a ÷ b is under 1.05; otherwise calculate
- x 3.14 or 22/7 for girths over 300 mm | uses most of a ±0.5 mm budget on its own
- x Six radii for a girth | 4.5% short
- x Gallons | write litres; if a customer says gallons, ask which
```

## The error: a header box sized in the wrong gallons

This is an illustration. Before the card was rewritten, the shop was asked to make a galvanised header box for a farm water system, to hold "about the same as a 44-gallon drum". The tradesperson sized it with the old cylinder rule from a US handbook, which gave dimensions for 44 US gallons, and drew the box on that basis.

The check that caught it was the one written into the shop's drawing review: every vessel's capacity is stated in litres on the drawing and recalculated by a second person in millimetres and litres. The reviewer's figure was 167 litres; the customer, asked, meant a standard drum, 200 litres. The box was redrawn about 20% larger in volume before any metal was cut. The fault cost an hour, and it would have cost a box.

## How this applies to a small Australian business

Small shops inherit rules from old handbooks, from whoever trained their tradespeople and from overseas suppliers, and few of those rules arrive with their assumptions attached. Testing the rules a shop actually uses is an afternoon's work with a calculator, and the result belongs on a card or a wall chart where everyone can see it, with the failures marked as clearly as the good rules. Units deserve special care: litres and millimetres on every drawing, and a question to the customer whenever anything else is used.

## Exercise: test a rule for squaring a circle

A tradesperson says that a square duct of equal area to a round one is found by multiplying the round duct's diameter by 0.886, "near enough nine-tenths". For a Ø400 mm duct, find the exact side of the square of equal area, the side by the 0.886 rule and by the nine-tenths rule, and the area error of each.

**Worked answer.** The exact side is D × √π ÷ 2 = 400 × 0.886227 = **354.49 mm**, giving an area of 125,664 mm², equal to π × 200².

- **0.886:** side 354.40 mm, area 125,599 mm², **−0.05%**. Good enough for any duct.
- **Nine-tenths:** side 360.00 mm, area 129,600 mm², **+3.1%**. Each side of the square would be 5.5 mm longer than needed, which for duct work may or may not matter, but it is not "near enough" for a part with a ±1 mm tolerance.

The 0.886 rule is the exact constant rounded to three figures; "nine-tenths" is a different rule that happens to sound similar.
