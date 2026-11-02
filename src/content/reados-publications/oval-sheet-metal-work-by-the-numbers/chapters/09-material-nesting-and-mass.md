---
book: oval-sheet-metal-work-by-the-numbers
chapterSlug: material-nesting-and-mass
order: 9
title: "Material, nesting and mass"
description: "Turn the trough's patterns into rectangles on 2,400 × 1,200 mm sheets: two sheets per trough at 54% yield, the finished mass of about 42 kg, the material cost with GST, and sheets ordered by area."
draft: false
---

Curved patterns do not fit sheets as neatly as rectangles do. A band of a sector wastes the corners of the rectangle that encloses it, and a large oval bottom plate leaves awkward strips around it. Nesting an oval job is a matter of finding which pieces fit in which gaps, and the answer is usually that the job's sheet count is set by the largest pieces' shapes, not by its total area. A shop that orders material by area alone will run short.

This chapter turns the running case's patterns, with their allowances, into enclosing rectangles, nests one trough's pieces on the shop's 2,400 × 1,200 mm sheets, works out the yield, the finished trough's mass and the material cost with GST, and ends with an order for ten troughs placed by area that came out nine sheets short.

## The pieces with their allowances

From Chapter 6, each pattern is a net band plus its allowances. This is an illustration.

- **End piece**, twice: a band from 1,368.6 mm to 1,851.8 mm radius, the rim arc's 1,824.8 mm plus the 27 mm rim band, spanning 20.36°. Its enclosing rectangle is the outer chord, **654.6 mm**, by the depth from that chord to the inner arc's middle, **504.7 mm**. Its area is about 0.277 m².
- **Side piece**, twice: a band from 9,124.1 mm to 9,607.4 mm radius, spanning 9.23°, plus a 20 mm lap at each end. Its enclosing rectangle is about **1,586.0 × 512.9 mm**, and its area about 0.729 m².
- **Bottom plate**, once: the bottom oval offset 25 mm for its flange, 1,700 × 800 mm overall, area about **1.064 m²**.

The pieces' total area per trough is about **3.11 m²**.

```figure
type: compare
title: The trough's pieces as rectangles on the sheet
rowhead: Piece
cols: Quantity | Enclosing rectangle, mm | Area each, m²
caption: This is an illustration. Rectangles include the rim band, laps and bottom flange. Curved bands fill about 85% of their rectangles; the bottom plate about 78%.
- End wall | 2 | 654.6 × 504.7 | 0.277
- * Side wall | 2 | 1,586.0 × 512.9 | 0.729
- Bottom plate | 1 | 1,700 × 800 | 1.064
- Per trough | 5 pieces | | 3.11
```

## Nesting one trough

The sheet is 2,400 × 1,200 mm of 1.6 mm galvanised steel, weighing 2.4 × 1.2 × 0.0016 × 7,850 = **36.17 kg**. The pieces fit like this.

- **Sheet A** carries the bottom plate, 1,700 × 800 mm, in one corner. The strip beside it, 700 mm wide and the full 1,200 mm long, takes both end pieces: each is 654.6 mm wide, and two of them, 504.7 mm deep each, stand one above the other in 1,009.4 mm of the strip's length. A strip 400 mm wide remains along the bottom plate.
- **Sheet B** carries both side pieces, each 1,586.0 × 512.9 mm, one above the other in 1,025.8 mm of the sheet's width, with their curves nested the same way. A piece about 800 × 1,200 mm remains at the end.

So one trough takes **two sheets**, and its pieces use 3.11 of their 5.76 m², a yield of about **54%**. The remaining 46% is not all waste: Sheet B's 800 × 1,200 mm offcut is large enough for another trough's two end pieces, and Sheet A's 400 mm strip is useful for small parts such as the rod's joint sleeves.

```figure
type: svg
title: One trough's pieces on two sheets
alt: Two rectangles representing 2,400 by 1,200 mm sheets. On the first, a large oval bottom plate fills most of the left side, with two curved end pieces stacked in the strip to its right. On the second, two long curved side pieces lie one above the other, with an empty offcut at the right end.
caption: This is an illustration at about 0.1 scale. Two sheets per trough; Sheet B's offcut can carry another trough's end pieces.
viewbox: 0 0 520 300
body:
<rect class="bxi" x="20" y="20" width="240" height="120"/>
<rect class="bxi" x="20" y="160" width="240" height="120"/>
<path class="bxa" d="M110 25A85 40 0 1 1 109.9 25Z"/>
<path class="bxa" d="M195 28A185 185 0 0 0 255 28L250 75A140 140 0 0 1 200 75Z"/>
<path class="bxa" d="M195 80A185 185 0 0 0 255 80L250 127A140 140 0 0 1 200 127Z"/>
<path class="bxa" d="M25 168A960 960 0 0 0 183 168L180 218A912 912 0 0 1 28 218Z"/>
<path class="bxa" d="M25 224A960 960 0 0 0 183 224L180 274A912 912 0 0 1 28 274Z"/>
<text class="txs" x="270" y="60">Sheet A: bottom plate and both ends</text>
<text class="txs" x="270" y="220">Sheet B: both sides, offcut at right</text>
<text class="txs" x="200" y="225">offcut</text>
```

## Batches nest better

For a batch, the offcuts change the count. Each Sheet B leaves room for one trough's end pieces, so in a batch the end pieces can come from Sheet B's offcuts instead of Sheet A's strip, and Sheet A can carry only the bottom plate and small parts. The sheet count stays at two per trough, because each trough still needs one bottom plate and one pair of side pieces, and neither can share a sheet with another of its kind: two bottom plates need 1,600 mm of the 1,200 mm width, and two pairs of side pieces 2,051.6 mm.

So the trough's material is set by its two large pieces, not by its total area. Only a larger sheet, or a change of design such as a bottom made in two halves, would change it, and each of those has costs of its own.

## When the size changes, the nest changes

A small change in the trough's size can move a piece across the edge of a sheet. This is an illustration. If a customer wanted the same trough 2,000 mm long instead of 1,800, keeping the 900 mm width and 300 mm end radius, its side radius would grow to about 2,008.3 mm, each side arc would span 48.38° and run about 1,695.8 mm along the rim, and each side piece's enclosing rectangle would grow to about 1,738.2 × 511.5 mm. Two still fit one above the other on a 2,400 × 1,200 mm sheet. The bottom plate would grow to 1,900 × 800 mm, which also still fits, with a strip only 500 mm wide beside it, too narrow for an end piece 654.6 mm wide.

So the 2,000 mm trough still needs two sheets, but its end pieces can no longer share Sheet A with the bottom: they must come from Sheet B's offcut or a third sheet. A designer who knows the nest can see that consequence before quoting, rather than finding it on the cutting table.

## Using the offcuts across a batch

The offcuts of an oval job are irregular: the corners between curved bands, the strip beside a bottom plate, the spaces between nested side pieces. They are worth planning for, because a batch of ten troughs leaves ten of each.

The shop's practice for the running case is to cut the end pieces from Sheet B's offcuts, keep Sheet A's 400 mm strips for joint sleeves, rod-end covers and the small brackets that hold a float valve, and stack the remaining clean pieces of 1.6 mm galvanised sheet by size for later jobs. Pieces too small or too curved to use go to the scrap bin, whose value is credited to the job. A nesting program arranges the pieces automatically, but deciding which offcuts are worth keeping is still a judgement about the shop's other work.

## Mass

The trough's mass comes from its pieces:

- walls, net, 1.892 m², and the bottom, net, 0.964 m², in 1.6 mm steel: about **35.9 kg**, the figure Chapters 1 and 4 used;
- the rim bands, laps and the bottom's flange add about **3.2 kg**, for **39.1 kg** of sheet in the finished pieces;
- the 10 mm rim rod, 4.42 m long, adds about **2.7 kg**;
- rivets and sealant add a little.

The finished empty trough weighs about **42 kg**. Full to its fill line, it weighs about 482 kg. Its zinc coating adds a little to the sheet's mass, which the supplier's figures for the coated sheet include.

```figure
type: stack
title: What the finished trough weighs
unit: kg
caption: This is an illustration. Net walls and bottom are most of the steel; allowances and the rod add about 15%.
- Walls, net | 23.8
- Bottom, net | 12.1
- Rim bands, laps and flange | 3.2
- Rim rod | 2.7
```

## Handling and transport

At about 42 kg empty and 1,800 mm long, the trough is awkward rather than heavy, and it is handled by two people or with a lifting aid. Safe Work Australia's model Code of Practice on hazardous manual tasks sets out how a business identifies and controls the risks of lifting and carrying, and a bulky item like this is the kind of task it covers. The shop lifts troughs by the rim with two people, or with a forklift and a cradle under the bottom, never by one person dragging it by an end.

Flared troughs nest inside one another for transport, as the Library’s chapter on [corners, rims and nesting](/reados/publications/sheet-metal-production-runs-by-the-numbers/corners-rims-and-nesting/) shows for steel trays, but the rolled rim and the bottom flange's rivet heads decide how closely they nest. The shop measures the nesting pitch on the first two troughs of a batch, stacks no more than the truck's height and the troughs' rims allow, and puts a timber spacer between rims if they would rub through the zinc in transit. The nesting saves a great deal of truck space: ten troughs stacked inside one another take little more floor than one.

## Material cost

This is an illustration. If the shop pays A$110.00 per sheet of 1.6 mm galvanised steel excluding GST, each trough's two sheets cost **A$220.00** excluding GST, or **A$242.00** including GST at 10%. Spread over the pieces actually used, that is about A$70.74 per square metre of finished pieces, against A$38.19 per square metre of bought sheet: the 54% yield nearly doubles the effective price of the steel in an oval job.

The rod, rivets and sealant add their own costs, small beside the sheet. The labour to form four part cones and notch an oval flange is the larger cost of an oval trough, and it is what the flat-oval version of Chapter 8 saves.

## Sheet or coil

Galvanised sheet is also sold as coil, cut to length by the shop or its supplier. For the running case, a coil 1,200 mm wide cut to lengths that suit each piece would let Sheet B be cut only as long as the two side pieces need, about 1,600 mm instead of 2,400, saving the 800 mm offcut when it is not wanted. Whether that saves money depends on the price per kilogram of coil against sheet, the shop's equipment for cutting coil, and whether the offcut would have been used anyway. For a batch of ten troughs it is worth asking; for one, sheet is simpler.

## Checking the order

Before a material order for an oval job is placed, three numbers are compared.

1. **Sheets from the nest**: two per trough, twenty for ten troughs, counted from the nest drawing, sheet by sheet.
2. **Sheets from area**: the pieces' total area divided by the sheet's area, eleven for ten troughs. This is a lower limit. An order below it is certainly short; an order above it may still be short if the shapes do not nest.
3. **Mass**: the order's mass, twenty sheets at 36.17 kg, about 723 kg, against the finished troughs' sheet steel, ten at 39.1 kg, about 391 kg. The ratio, 54%, should match the nest's yield.

If the three disagree, the nest is checked before the order goes out. A nest that claims a yield much better than the pieces' shapes allow has a piece missing or a piece placed where it does not fit; one much worse has wasted space that another piece could fill.

## The error: sheets ordered by area

This is an illustration. For a batch of ten troughs, the office ordered sheet by area: ten troughs at 3.11 m² each is 31.1 m², which is 31.1 ÷ 2.88 = 10.8, so **11 sheets**. The shop needed **20**, two per trough, because each trough's bottom plate and pair of side pieces each fill a sheet that cannot take a second of its kind.

The shortfall appeared on the second day of cutting, with six troughs' pieces cut and nine sheets short for the rest. The extra sheets came a week later. The estimator's arithmetic had been right; the basis was wrong. On rectangular work, ordering by area with an allowance for waste often comes out close, because rectangles nest tightly; on oval work, with its large curved pieces and fixed sheet widths, the shapes decide and area is only a floor. The shop's oval jobs are now ordered from a nest, sheet by sheet, and the order is checked against the area as a lower limit, never used as the order itself.

```figure
type: checklist
title: Material checks for an oval job
caption: Each check makes the order follow the pieces' shapes, not just their area.
- Every piece's enclosing rectangle with its allowances | ends 654.6 × 504.7, sides 1,586.0 × 512.9 mm
- A nest drawn for one unit and for the batch | two sheets per trough
- Offcuts assigned to other pieces where they fit | ends in Sheet B's offcut
- Yield worked out and compared with the estimate | about 54%
- Mass from the pieces, plus rod and fittings | about 42 kg empty
- x Sheets ordered by total area | 11 ordered, 20 needed
```

## Exercise: a larger sheet

The supplier offers 1.6 mm galvanised sheet at 3,000 × 1,500 mm. Could one sheet carry a whole trough's pieces? Check the bottom plate, the two side pieces and the two end pieces.

**Worked answer.** On a 3,000 × 1,500 mm sheet:

- The bottom plate, 1,700 × 800 mm, along the sheet's length, leaves 1,300 × 1,500 mm beside it and a strip 1,700 × 700 mm below it.
- The two side pieces, 1,586.0 × 512.9 mm each, need 1,586.0 mm of length. They fit in the strip below the bottom plate only one at a time, since the strip is 700 mm deep, so the second side piece needs space elsewhere: the 1,300 × 1,500 mm area beside the bottom plate is 1,300 mm long, too short for 1,586.0 mm.
- So one 3,000 × 1,500 mm sheet carries the bottom plate, one side piece and the two end pieces, which fit in the 1,300 × 1,500 mm area, but not the second side piece.

A whole trough still needs more than one sheet, though the larger sheet carries more of it and leaves a smaller offcut. Whether that is cheaper depends on the larger sheet's price per kilogram and on what the second sheet's spare area can be used for. In a batch, the second sheet's spare area could carry the next trough's end pieces, so the comparison is best made over the whole batch, not one trough.
