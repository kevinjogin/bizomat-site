---
book: sheet-metal-production-runs-by-the-numbers
chapterSlug: nesting-and-material-yield
order: 5
title: "Nesting the blanks and material yield"
description: "Nest 500 cross-shaped tray blanks: three per 2,400 × 1,200 sheet at 60% yield, why larger sheets do worse, the steel cost with GST, and a nest that ordered 83 sheets too many."
draft: false
---

On a run of hundreds, material is usually the largest single cost, and the share of each sheet that ends up as product, the yield, decides most of it. Yield depends on the blank's shape, the sheet's size and the way blanks are arranged on it. A cross-shaped blank like the tote tray's is awkward: its four arms leave empty corners that no other part of the same blank can fill. The nest has to be worked out, not assumed, and a few millimetres in the blank or the sheet can change the count per sheet and with it the whole order.

This chapter nests the running case's 960.9 × 760.9 mm blank on the shop's 2,400 × 1,200 mm sheets, compares other sheet sizes, works out the order and its cost with GST, considers what to do with the offcuts, and ends with a nest that put two blanks on each sheet instead of three.

## The blank and its rectangle

From Chapter 3, the blank is a cross 960.9 mm long and 760.9 mm wide, with an area of about **0.579 m²** after the lap tabs are added and the handle slots removed. It fills 79% of its enclosing rectangle; the other 21% is the four empty corners outside the notches.

Could the arms of one blank fill the corners of another? Each corner's empty region is about 180 mm along the long direction and a similar amount across, while the arms are 600 mm and 400 mm wide at their hems. An arm cannot fit into a corner, so cross-shaped blanks of this proportion do not interlock, and the nest is a matter of fitting whole enclosing rectangles on the sheet. That simplifies the arithmetic.

## Fitting rectangles on the sheet

This is an illustration. The shop's laser cuts 2,400 × 1,200 mm sheets of 1.2 mm cold-rolled steel, and the programmer leaves 10 mm between blanks and from each sheet edge. Two orientations are possible:

- **Long side along the sheet**: 960.9 mm blanks along the 2,400 mm length fit twice, with 2 × 960.9 + 30 = 1,951.8 mm used; 760.9 mm across the 1,200 mm width fits once. **Two per sheet.**
- **Long side across the sheet**: 960.9 mm across the 1,200 mm width fits once, with 239.1 mm spare; 760.9 mm along the 2,400 mm length fits three times, using 3 × 760.9 + 40 = 2,322.7 mm. **Three per sheet.**

Three per sheet puts 3 × 0.579 = 1.737 m² of blank on a 2.88 m² sheet, a yield of **60.3%**. The remaining 40% is the corners of each blank's rectangle, a strip about 219 mm wide down the sheet's length, and the edges.

```figure
type: compare
title: Tray blanks per sheet by sheet size
rowhead: Sheet, mm
cols: Blanks per sheet | Yield | Limiting dimension
caption: This is an illustration, with 10 mm between blanks and at the edges. A larger sheet is not a better sheet: both larger sizes waste more, because the blank does not divide them evenly.
- * 2,400 × 1,200 | 3 | 60.3% | three 760.9 mm widths along 2,400
- 2,500 × 1,250 | 3 | 55.6% | the extra 100 × 50 mm is unused
- 3,000 × 1,500 | 3 | 38.6% | two rows need 1,551.9 mm, 51.9 mm too many
- 2,400 × 1,000, if available | 3 | 72.4% | the 960.9 mm length fits across with 19 mm to spare
```

## Larger sheets are not always better

The comparison shows something counter-intuitive. A 3,000 × 1,500 mm sheet has 56% more area than the shop's standard sheet, and it still yields only three blanks, because two rows of 760.9 mm blanks need 1,551.9 mm across a 1,500 mm sheet: **51.9 mm** too much. Three blanks on a 4.5 m² sheet is a yield of 38.6%.

The opposite is also true. A sheet 1,000 mm wide, if the supplier stocks it or can cut it from coil, would still take three blanks along its length, with the blank's 960.9 mm length across its width and 19.1 mm to spare, and its yield would rise to **72.4%**, because it carries less unused width. Whether such a sheet is available, and at what price per kilogram, is a question for the supplier; the nesting arithmetic says it is worth asking on a run of this size.

The general rule is that yield depends on how evenly the blank's dimensions divide the sheet's, not on the sheet's size. A blank's designer who knows the shop's sheet sizes can sometimes trim a few millimetres from a non-critical dimension and gain a whole blank per sheet; here the tray's dimensions are fixed by the shelving and the capacity, so the gain must come from the sheet.

## The order for the run

Five hundred trays at three per sheet need 500 ÷ 3 = 166.7, so **167 sheets**, which give 501 blanks, one spare. Each sheet weighs 2.4 × 1.2 × 0.0012 × 7,850 = **27.13 kg**, so the order is about **4,531 kg** of steel, of which the finished trays' blanks use about 500 × 5.45 = 2,727 kg.

This is an illustration. At A$84.00 per sheet excluding GST, the order costs 167 × 84.00 = **A$14,028.00** excluding GST, or **A$15,430.80** including GST at 10%. Spread over the 500 trays, the steel costs **A$28.06** per tray excluding GST, the largest single item in Chapter 9's unit cost.

```figure
type: stats
title: The run's material order
caption: This is an illustration. Prices exclude GST unless stated; GST is 10%.
- 167 | Sheets, 2,400 × 1,200 × 1.2 mm | 501 blanks, one spare
- 4,531 kg | Steel ordered | 2,727 kg in the finished blanks
- * A$14,028.00 | Steel, excluding GST | A$15,430.80 including GST
- A$28.06 | Steel per tray, excluding GST | at three blanks per sheet
```

## What yield is worth per tray

Yield converts directly into cost per tray. This is an illustration. The shop's price of A$84.00 per sheet works out at A$84.00 ÷ 27.13 kg = about **A$3.10 per kilogram**, excluding GST.

- At **two** blanks per sheet, each blank carries half a sheet: **A$42.00** of steel.
- At **three** per sheet, a third: **A$28.00**, or A$28.06 once the order is rounded up to whole sheets.
- On a 2,400 × 1,000 mm sheet at the same price per kilogram, the sheet would weigh 22.61 kg and cost about A$70.00, so each of its three blanks would carry **A$23.33**, a saving of **A$4.67** per tray, or about **A$2,335** excluding GST over the run, if the narrower sheet were available at that price.

The gap between two and three per sheet, A$14.00 per tray, is larger than the whole of the tray's folding and riveting cost in Chapter 9. Nesting is the cheapest place in the run to save money, because it costs only a programmer's attention.

## Offcuts and spares

Each sheet leaves a strip about 219 mm wide and 2,400 mm long beside the blanks, plus the empty corners between them, about 1.14 m² in all. Across 167 sheets that is about 191 m² of offcut, most of it in pieces too narrow or too awkwardly shaped for another tray.

The strip is worth something if the shop has a use for it: small brackets, gussets or the half-size tray's handle reinforcements, if a later design needs them. The shop nests any such parts into the strip in the same cutting program, at no extra cutting setup, which turns part of the waste into product. What remains goes to the scrap bin, and its scrap value, small per kilogram, is credited to the job.

The one spare blank in the order is deliberate. On a run of five hundred, a blank damaged in handling or a first-article tray sectioned for checking would otherwise force a new sheet onto the laser for a single part. The shop's practice is to order to the next whole sheet and keep the spares with the job until the run is accepted.

## Cutting the nest

A nest is a cutting program as well as an arrangement, and three details of the program affect the blanks' quality on a run of this size.

**Inner features first.** The handle slots are cut before each blank's outline, while the blank is still held by the whole sheet. Cut after the outline, a slot's heat can let the freed blank shift on the slats by a fraction of a millimetre, and the slot ends up out of position.

**Lead-ins in the waste.** Every cut starts with a pierce, which leaves a small crater, and a short lead-in to the line. The programmer puts every pierce and lead-in in the waste, outside the blank's outline or inside the slot, so that no blank carries a pierce mark on its edge where the hem or a corner will be formed.

**Micro-joints.** A freed blank resting on the laser's slats can tip as the last cut is made and catch the cutting head. The program leaves two or three tiny uncut bridges holding each blank to the skeleton until the sheet is unloaded; the blanks are then knocked out and the bridges' small nibs filed off at the deburring step. On this blank the bridges go on the short-wall flaps' outer edges, inside the hem allowance, where the hem fold hides any trace.

None of these changes the yield, but each changes the time per sheet or the blank's finish, and each is set once in the program and repeated five hundred times.

## Buying sheet or coil

Steel is cheaper per kilogram in coil than in cut sheet, because cutting to length is a service. A shop with a coil-fed laser or a cut-to-length line can buy coil of a width that suits the blank, a 1,000 mm coil for this tray, for instance, and cut each sheet to exactly the length three blanks need. That captures both the lower price and the better yield of the narrower sheet.

The catch is quantity. Coil is sold in whole coils of several tonnes, and a coil of an unusual width may need a minimum order or a slitting charge. For a run that uses about 4.5 tonnes of 1.2 mm steel, coil might suit if the shop has the equipment and a second product that uses the same width; for a one-off run, sheet is usually simpler. The decision is a comparison of total cost, steel, processing and stockholding, not of price per kilogram alone.

## Traceability

The distributor's specification does not require material certificates, but the shop keeps the supplier's mill certificate with the job anyway, recording the heat numbers of the sheets used. If a tray later cracks at a fold or a corner, the certificate shows the steel's grade and properties, and the heat number shows which other trays came from the same steel. On a run of five hundred, that turns a vague worry about the whole batch into a list of specific trays.

## The error: two per sheet

This is an illustration. The first nest for the run was drawn by a programmer who placed the blank in the orientation it was drawn, long side along the sheet, and saw two blanks fit. The order went out for 250 sheets: 500 ÷ 2.

The production engineer, checking the material order against the estimate, which had assumed 60% yield, found the order 83 sheets larger than expected: about **2,252 kg** of steel and about A$6,972.00 excluding GST of extra cost. The nest was redone in the other orientation, which fitted three, and the order was cut to 167 sheets before the supplier had delivered.

Had the order gone through, the shop would not have lost the whole A$6,972.00: the 83 extra sheets would have gone into stock for later jobs. But they would have tied up cash and floor space for months, and some would have rusted at the edges before use, because uncoated cold-rolled sheet stored in an unheated shop does not keep indefinitely. A wrong nest costs money even when the material is eventually used.

The lesson was to check every orientation and to compare the nest's yield with the expected yield before ordering. The shop's nesting software now tries every orientation automatically, but the engineer still compares its yield with a quick rectangle calculation like the one above, because software nests only the sheet sizes it is given.

```figure
type: checklist
title: Nesting checks before ordering material
caption: Each check is quick, and each can change the order by tens of sheets.
- Blank's enclosing rectangle and actual area known | 960.9 × 760.9 mm, 0.579 m²
- Both orientations tried on every available sheet size | three per sheet, not two
- Yield compared with the estimate's assumption | 60.3%
- Order rounded up to whole sheets, spares kept | 167 sheets, 501 blanks
- Offcut strip assigned to other parts where possible | 219 mm strip
- x Blank nested only in its drawn orientation | 250 sheets ordered, 83 too many
```

## Exercise: the half-size tray

The half-size tray's blank from Chapter 3's exercise is 793.7 × 693.7 mm, with an area of about 0.370 m². How many fit on a 2,400 × 1,200 mm sheet, and at what yield? Would a 2,400 × 900 mm sheet do better?

**Worked answer.**

- On 2,400 × 1,200 mm, with 793.7 mm across the 1,200 mm width, one row fits; along the 2,400 mm length, 693.7 mm blanks fit three times, using 2,121.1 mm. **Three per sheet**, a yield of 3 × 0.370 ÷ 2.88 = **38.5%**.
- On 2,400 × 900 mm, the 793.7 mm dimension still fits across, with 86.3 mm to spare, and three still fit along: **three per sheet** on 2.16 m², a yield of **51.3%**.

The smaller tray wastes even more of a standard sheet than the large one, because its 793.7 mm dimension uses only two thirds of the sheet's width. If the half-size tray goes into production, a narrower sheet, or a nest that combines it with other parts, is worth pricing. A mixed nest of two full-size blanks and one half-size blank on a standard sheet, for example, fits along the 2,400 mm length and yields about 53%, better than the half-size tray alone but worse than the full-size tray alone, so mixing helps only when both products are needed at the same time.
