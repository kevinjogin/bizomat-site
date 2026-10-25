---
book: sheet-metal-parts-by-the-numbers
chapterSlug: flat-patterns-and-bend-deductions
order: 4
title: "Flat patterns and bend deductions"
description: "Develop a flat pattern two ways, by flats plus bend allowances and by outside dimensions less bend deductions, place holes and bend lines on the flat, and catch features placed by folded dimensions."
draft: false
---

The flat pattern is the drawing the laser cutter reads. Every edge, hole and slot on it must sit where, after folding, it will be in the right place on the finished part. Chapter 3 found the length of blank each bend consumes. This chapter puts those lengths together into the whole flat, by two methods that should agree, and then locates features and bend lines on the flat from their positions on the folded part.

That last step is where many flat patterns go wrong. A feature's position on the folded part is usually dimensioned to a virtual sharp; its position on the flat is not the same number. The running case develops the bracket's flat, places its holes and slots, and finds a slot that a quick layout had put one bend deduction out.

## Setback and bend deduction

Two more quantities connect the folded part's outside dimensions to the flat.

The **outside setback** is the distance from the virtual sharp, where the outside faces of the two flanges would meet, to the bend's tangent line on the outside. For a bend that turns through angle θ:

SB = (R + t) × tan(θ ÷ 2)

The **bend deduction** is how much shorter the flat is than the sum of the two outside flange dimensions measured to the virtual sharp:

BD = 2 × SB − BA

For the bracket's 90° bends, SB = (2 + 2) × tan 45° = **4.0 mm**, and with Chapter 3's BA of 4.398 mm, BD = 8.0 − 4.398 = **3.602 mm**. Each of the bracket's bends makes the flat 3.602 mm shorter than its outside dimensions would suggest.

```figure
type: formula
title: Outside setback and bend deduction
formula: SB = (R + t) × tan(θ ÷ 2)        BD = 2 × SB − BA
formula: flat length = sum of outside dimensions − sum of BD
caption: Outside dimensions are to the virtual sharp of each bend. The running case's 90° bends with R = 2, t = 2 and K = 0.40.
- SB | Outside setback, virtual sharp to tangent line
- BA | Bend allowance from Chapter 3, 4.398 mm
- BD | Bend deduction per bend
step: SB = 4.0 × tan 45° = 4.0 mm
step: BD = 2 × 4.0 − 4.398 = 3.602 mm
step: Flat = (15 + 60 + 160 + 60 + 15) − 4 × 3.602 = 310 − 14.407 = 295.593 mm
```

## Two methods that must agree

**Outside dimensions less bend deductions.** The bracket's outside dimensions, return, leg, base, leg, return, sum to 15 + 60 + 160 + 60 + 15 = 310 mm. Subtracting four bend deductions gives 310 − 4 × 3.602 = **295.593 mm**.

**Flats plus bend allowances.** Each straight portion of the part, between tangent lines, is its outside dimension less one setback for each bend at its ends. The returns have one bend each: 15 − 4 = 11 mm. The legs have two: 60 − 8 = 52 mm. The base has two: 160 − 8 = 152 mm. The flats sum to 11 + 52 + 152 + 52 + 11 = 278 mm, and four bend allowances add 4 × 4.398 = 17.593 mm, for **295.593 mm**.

The two agree, as they must, because they are the same geometry rearranged. Doing both is a cheap check on arithmetic and on the CAD program's flat: if the CAD flat differs, either its K-factor, its radius or its thickness is not what the drawing says.

```figure
type: stack
title: What makes up the bracket's 295.593 mm flat width
unit: mm
caption: Flats between tangent lines plus the bend allowance of each bend. The four bends take 17.6 mm of blank between them.
- Return flat | 11
- Bend | 4.398
- Leg flat | 52
- Bend | 4.398
- Base flat | 152
- Bend | 4.398
- Leg flat | 52
- Bend | 4.398
- Return flat | 11
```

## Placing features on the flat

A feature on a flange sits a known distance from that flange's tangent line, on both the folded part and the flat, because the flange's flat portion does not change length. So the rule for locating a feature on the flat is:

1. On the folded part, find the feature's distance from the nearest bend's tangent line, which is its distance from the virtual sharp less the setback.
2. On the flat, measure the same distance from the same tangent line.
3. Locate the tangent line on the flat by adding up flats and bend allowances from the flat's edge.

This is an illustration. Each leg's two slots are centred 25 mm above the outside of the base. On the folded leg, the base bend's tangent line is at R + t = 4 mm above the base's outside face, and the return bend's tangent line is at 60 − 4 = 56 mm. Working from the flat's left edge, the left return's flat is 11 mm, its bend 4.398 mm, then the leg's flat begins at the return's tangent line. The slot is 56 − 25 = 31 mm along the leg's flat from that tangent line. On the flat, it is therefore 11 + 4.398 + 31 = **46.398 mm** from the left edge.

The base's holes are 20 mm in from each outside face of the base, so 20 − 4 = 16 mm from each base tangent line. From the left edge, the base flat starts at 11 + 4.398 + 52 + 4.398 = 71.796 mm, so the first hole is at 71.796 + 16 = **87.796 mm** and the second, by symmetry, at 295.593 − 87.796 = **207.797 mm**. Their spacing on the flat, 120.0 mm, is the same as on the folded base, because both lie on one flat.

```figure
type: svg
title: The bracket's flat pattern with bend lines and features
alt: A rectangle 295.6 mm wide and 300 mm long, drawn at 0.8 scale. Four vertical dashed lines mark the bend lines at 13.2, 69.6, 226.0 and 282.4 mm from the left edge. Two round holes sit on the base between the middle bend lines, at 87.8 and 207.8 mm from the left edge, and two more further along. Two horizontal slots sit on each leg, centred 46.4 mm from each outer edge.
caption: This is an illustration. Bend lines are drawn at the centre of each bend allowance, as many folders prefer; the folder's back gauge sets each bend from the edges.
viewbox: 0 0 330 290
body:
<rect class="bx" x="40" y="20" width="236.47" height="240"/>
<path class="cl" d="M50.56 20V260M95.68 20V260M220.8 20V260M265.92 20V260"/>
<circle class="bxi" cx="110.24" cy="68" r="2.8"/>
<circle class="bxi" cx="206.24" cy="68" r="2.8"/>
<circle class="bxi" cx="110.24" cy="212" r="2.8"/>
<circle class="bxi" cx="206.24" cy="212" r="2.8"/>
<rect class="bxa" x="69.12" y="76.4" width="16" height="7.2" rx="3.6"/>
<rect class="bxa" x="69.12" y="196.4" width="16" height="7.2" rx="3.6"/>
<rect class="bxa" x="231.36" y="76.4" width="16" height="7.2" rx="3.6"/>
<rect class="bxa" x="231.36" y="196.4" width="16" height="7.2" rx="3.6"/>
<text class="txs" x="40" y="276">Returns</text>
<text class="txs" x="130" y="276">Base, 4 × Ø7</text>
<text class="txs" x="62" y="14">Leg</text>
<text class="txs" x="236" y="14">Leg</text>
<text class="txa" x="60" y="110">Slot 46.4 from edge</text>
<text class="txs" x="230" y="286">295.6 wide</text>
```

## Bend lines on the flat

The flat pattern usually shows a line at each bend, so that the folder can check the blank and, on some parts, align it. Offices differ on where the line goes: at the centre of the bend allowance, at one of the tangent lines, or at the point the folder's back gauge would set. The drawing must say which, because the positions differ by half a bend allowance, about 2.2 mm on the bracket.

The bracket's flat shows bend lines at the centre of each bend allowance, at 13.199, 69.597, 225.996 and 282.394 mm from the left edge, with a note: "BEND LINES AT CENTRE OF BEND ALLOWANCE, FOR REFERENCE". The folder sets the bends from the blank's edges with its back gauge and uses the lines only to check that the blank is the right way round. On the laser-cut blank, the bend lines can be marked with small notches at the edges or a light etch, if the folder asks for them; a full-depth etch across a bend line on the outside of the bend is best avoided, because it is a notch exactly where the strain is highest.

## The error: a slot laid out from folded dimensions

This is an illustration. Before the flat was taken from the CAD model, a quick layout for a prototype had been drawn by hand, placing each feature on the flat at its folded distance from the blank's edge, as if the part had no bends. The slot, 25 mm above the base on a 60 mm leg below a 15 mm return, was placed at 15 + (60 − 25) = **50 mm** from the edge.

The correct position, from the method above, is 46.398 mm. The hand layout put the slot 3.602 mm too far from the edge, exactly one bend deduction, because it ignored the return bend between the edge and the leg. After folding, the slot sat 25 − 3.602 = **21.4 mm** above the base instead of 25 mm, and the prototype bracket sat 3.6 mm low on the frame. The fault was found at the trial fit and traced in minutes by measuring the slot on the folded part and comparing it with the flat.

The lesson generalises. Any feature whose position on the flat is measured across a bend must include that bend's deduction. A feature measured across two bends, such as a hole in the base located from the blank's edge, includes two, and a hand layout that ignored them would place it 2 × 3.602 = 7.2 mm out. The error grows with every bend crossed, which is why hand layouts of parts with more than a couple of bends are best avoided altogether, and why the office's checker compares at least one feature per flange between the drawing's flat and a hand calculation. A flat pattern taken from a correctly set up CAD model handles this automatically; a hand layout or a spreadsheet must do it explicitly.

## Working from inside dimensions

Some parts are dimensioned to the inside, because the inside is what mates with something: a channel that must fit over a bar, a box that must hold a module. The same geometry applies with an **inside setback** in place of the outside one. The inside setback runs from the inside virtual sharp to the tangent line on the inside and is R × tan(θ ÷ 2), so 2 × tan 45° = 2.0 mm for the bracket's bends.

Dimensioned to the inside, the bracket's return is 15 − 2 = 13 mm, its leg 60 − 4 = 56 mm and its base 156 mm. Each flat portion is its inside dimension less one inside setback per bend: 13 − 2 = 11, 56 − 4 = 52 and 156 − 4 = 152 mm, the same flats as before. Adding the four bend allowances gives the same 295.593 mm. The check is worth doing once by hand, because it shows that the method does not care which face is dimensioned, only that every dimension is consistently to one face and the setback matches it.

## Checking a CAD flat

Most flat patterns now come from a CAD model's unfold command, and the arithmetic in this chapter is how to check one. Three numbers are enough: the overall flat size, the position of one feature on each flange, and the spacing between two bend lines. For the bracket, the CAD flat should be 295.59 mm across, the slot 46.40 mm from its edge, and the two base bend lines 156.4 mm apart, which is the base's 152 mm flat plus a bend allowance. If all three agree with a hand calculation using the folder's K-factor, radius and thickness, the model is set up correctly. If the overall size agrees and a feature does not, the feature was probably placed on the flat rather than on the folded model, or was moved after unfolding.

## Nesting the blank

The flat's size also decides how many blanks fit on a sheet, and small differences can matter. This is an illustration. The laser contractor cuts from 2,400 × 1,200 mm sheets, leaving 10 mm between parts and at the edges. Each blank needs 295.6 + 10 = 305.6 mm across and 300 + 10 = 310 mm along. Across the 1,200 mm sheet, only three fit, since four would need 1,222 mm, and along it, seven. The sheet yields **21 blanks**, using only 64.7% of its area.

The same blank on a 2,500 × 1,250 mm sheet fits four across and eight along, **32 blanks** and 90.8% of the area. Neither the designer nor the drawing chooses the sheet, but a designer who knows that a blank just over a quarter of the sheet's width wastes a quarter of the sheet can ask the cutter which sheet sizes it stocks before fixing a flange length that makes no functional difference.

## Which dimensions go on the flat pattern

The flat pattern view on a drawing exists for the cutter and for checking. It should show the overall flat size, the feature positions and the bend lines, each from one edge or datum, and it should say whether its dimensions are for manufacture or for reference. If the folder is to adjust the flat for its own tooling, as Chapter 3 recommended when the folder is not yet known, every flat dimension is a reference and the finished part's dimensions govern. If the flat has been agreed with the folder from trial strips, the flat's dimensions can govern the cut blank, with the finished dimensions governing the folded part.

Either way, the flat should never be the only definition of the finished part. A drawing that gives a flat pattern and a folded view without its own dimensions leaves the inspector unable to accept a part that is right in the flat and wrong after folding.

## Exercise: a bracket with an acute bend

A smaller bracket has two flanges meeting at an included angle of 60°, so the sheet turns through 120° at the bend. Its outside flange dimensions to the virtual sharp are 50 mm and 40 mm, in the same 2.0 mm sheet with R = 2 mm and K = 0.40. What is its flat length?

**Worked answer.** The bend angle in the formulas is the change of direction, **120°**, or 2.0944 rad, not the 60° included angle.

- SB = (2 + 2) × tan(120° ÷ 2) = 4 × tan 60° = **6.928 mm**.
- BA = 2.0944 × (2 + 0.40 × 2) = 2.0944 × 2.8 = **5.864 mm**.
- BD = 2 × 6.928 − 5.864 = **7.992 mm**.

The flat length is 50 + 40 − 7.992 = **82.008 mm**.

The outside setback is large because the virtual sharp of an acute corner lies well beyond the bend; the outside dimensions to it are long compared with the flanges' real flat portions. A drafter who used θ = 60° would have calculated SB = 4 × tan 30° = 2.309 mm, BA = 2.932 mm and BD = 1.687 mm, and a flat of 88.31 mm, more than 6 mm too long.
