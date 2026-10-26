---
book: quoting-sheet-metal-work-by-the-numbers
chapterSlug: material-blanks-and-nesting
order: 2
title: "Material, blanks and nesting"
description: "Price material from blanks nested on whole sheets, by sheet price and yield rather than net area, round to sheets per batch, value offcuts, and catch a quote that priced net area and was 26% short."
draft: false
---

A sheet metal job's material cost is not the area of its parts. It is the sheets that must be bought to cut them from. Parts are cut from rectangular sheets of stock sizes; they nest with gaps between them and leave a skeleton and offcuts that are, at best, scrap with a little value. The fraction of each sheet that becomes parts, the **yield**, is rarely much above 80% and often well below, and a quote that prices the parts' net area at the sheet's price per kilogram misses everything else the shop must buy.

This chapter prices EN-700's material from blank sizes, nesting and sheet prices, at each of the quoted quantities. It covers blank sizes from flat patterns, nesting and yield, sheets per batch and the rounding that comes with them, offcuts and scrap value, and material price movements. The running case finds that a first estimate, priced from net area, understated EN-700's material by about 26%.

## Blanks from flat patterns

Each part's **blank** is its flat pattern before folding: the part's developed shape, with its flanges laid out flat and its bend allowances included, as *Sheet Metal Parts by the Numbers* calculates. For quoting, each blank's bounding rectangle, its outer perimeter and its holes are what matter.

This is an illustration. EN-700's blanks, rounded for quoting, are:

```figure
type: compare
title: EN-700's blanks for quoting
cols: Material | Blank, mm | Quantity per enclosure | Area per enclosure
caption: This is an illustration. Blank sizes are the flat patterns' bounding rectangles, including flanges and returns.
- Back panel | 1.2 mm galvanised | 740 × 540 | 1 | 0.400 m²
- Side panels | 1.2 mm galvanised | 740 × 290 | 2 | 0.429 m²
- Roof, base, rain hood | 1.2 mm galvanised | 560 × 310, 540 × 290, 520 × 230 | 1 each | 0.450 m²
- Equipment plate and brackets | 2.0 mm steel | 600 × 420, 120 × 90 | 1 and 2 | 0.274 m²
- *Door and cable plate | 2.0 mm aluminium | 720 × 520, 200 × 120 | 1 each | 0.398 m²
```

In total, each enclosure uses about **1.279 m²** of 1.2 mm galvanised steel, **0.274 m²** of 2.0 mm steel and **0.398 m²** of 2.0 mm aluminium, as blanks.

## Sheet prices

Sheet is bought by the sheet, priced by the kilogram or by the sheet. This is an illustration, with 2,400 × 1,200 mm sheets of 2.88 m², excluding GST:

- **1.2 mm galvanised steel** at A$2.40/kg: a sheet weighs 2.88 × 0.0012 × 7,850 = 27.1 kg and costs about **A$65.11**;
- **2.0 mm steel** at A$2.20/kg: 45.2 kg, about **A$99.48**;
- **2.0 mm aluminium** at A$9.50/kg, at 2,700 kg/m³: 15.6 kg, about **A$147.74**.

## Nesting and yield

A nest places the blanks on a sheet with the gaps the cutting process needs between them and at the sheet's edges. The nesting software, or the estimator with a sketch, finds how many blanks fit.

This is an illustration. For EN-700's 1.2 mm galvanised parts, the fabricator's nesting gives **five enclosures' parts on three sheets**, a yield of 5 × 1.279 ÷ (3 × 2.88) = about **74%**. For the 2.0 mm steel, eight equipment plates and sixteen brackets fit one sheet, eight enclosures' worth, a yield of about **76%**. For the aluminium, six doors and six cable plates fit one sheet, a yield of about **83%**.

```figure
type: bars
title: Nesting yield for EN-700's three materials
unit: %
max: 100
caption: This is an illustration from the fabricator's nests. A quarter of the galvanised sheet bought for each enclosure becomes skeleton and offcuts.
- 1.2 mm galvanised, 5 enclosures per 3 sheets | 74
- 2.0 mm steel, 8 enclosures per sheet | 76
- *2.0 mm aluminium, 6 enclosures per sheet | 83
```

## Sheets per batch

Sheets are bought whole, so the material for a batch is the number of sheets its nests need, rounded up. This is an illustration.

- **20 off**: 12 galvanised sheets, 3 steel sheets and 4 aluminium sheets, about **A$1,670.72**, or **A$83.54** per enclosure.
- **50 off**: 30, 7 and 9 sheets, about **A$3,979.32**, or **A$79.59** per enclosure.
- **200 off**: 120, 25 and 34 sheets, about **A$15,323.36**, or **A$76.62** per enclosure.

The material cost per enclosure falls slightly with quantity because the last, partly used sheet of each material is spread over more enclosures. At 50 off, for instance, seven steel sheets hold 56 enclosures' plates, so six plates' worth of the seventh sheet is offcut unless another job uses it.

## The error: net area priced as material

This is an illustration. The estimator's first figure for EN-700's material took each part's net area, multiplied it by the thickness and density, and priced the mass at the per-kilogram price. For the galvanised parts that gave about 12.0 kg and **A$28.91** per enclosure; with the steel and aluminium, about **A$58.79** per enclosure in all.

The material actually bought, at 50 off, costs about **A$79.59** per enclosure. The net-area figure was about **A$20.80**, roughly **26%**, short per enclosure, about **A$1,040** across 50. The review caught it by asking a simple question: how many sheets of each material will be bought for this batch? The net-area method has no answer to that question, which is why it cannot be right. The fix was to price every material line from a nest and a sheet count, and to show the sheet count on the estimate, so that the purchasing order for the job and the quote's material line are visibly the same number.

```figure
type: compare
title: EN-700 material per enclosure at 50 off, ex GST
cols: Net area priced by mass | Sheets bought, nested
caption: This is an illustration. The difference is the skeleton, the offcuts and the part of the last sheet of each material.
- 1.2 mm galvanised | A$28.91 | A$39.07
- 2.0 mm steel | A$9.45 | A$13.93
- 2.0 mm aluminium | A$20.44 | A$26.59
- *Total | A$58.79 | A$79.59
```

## Orientation and the nest

Some parts cannot be turned freely in a nest. Sheet has a rolling direction, and parts with tight bends may need their bend lines across it; brushed or patterned finishes must run the same way on every visible part; protective film on aluminium must be on the face that will be visible. Each constraint removes options from the nest and lowers its yield. EN-700's aluminium door must have its film on the outside face and its long bends across the rolling direction, which the nest of six per sheet respects; a nest that ignored the constraint would show a slightly better yield and produce doors with the wrong face out.

## Filling sheets with other work

A shop running many jobs can nest parts from several jobs on one sheet and fill gaps that one job would leave as skeleton. That improves the shop's overall yield, but a quote should normally be priced on the job's own nest, because there is no guarantee that suitable work will be running alongside it. A shop that quotes every job as if its sheets will be filled by other work is quoting a yield it achieves only when it is busy, and it will lose money on jobs that run alone. EN-700's quote uses its own nests.

## Material on-costs

Buying material costs more than its invoice: ordering, receiving, checking, storing, moving and cutting sheets off a stack all take time and space. Many shops add a **material on-cost** to the material's price to recover these. This is an illustration. At an 8% on-cost, EN-700's material at 50 off becomes 79.59 × 1.08 = about **A$85.96** per enclosure. Whether the on-cost is added to material or recovered in the hourly rates of Chapter 8 is a policy choice; what matters is that it is recovered somewhere, once, and not twice.

## Bought-in items

The quote's material also includes bought-in items: EN-700's hinge, gasket, fasteners, sealant, and the cartons of Chapter 1. This is an illustration. The hinge at about A$18.00, the gasket at about A$6.00, fasteners and sealant at about A$6.00 and a carton at about A$12.00 add about **A$42.00** per enclosure, before any on-cost. The latch is supplied by the customer, so it appears in the quote's scope, not its material. Bought-in prices should be current quotes from the suppliers, valid for at least the quote's own validity, not last year's invoice prices.

## Offcuts and scrap value

The skeleton and offcuts have some value. Steel and aluminium scrap is sold to a metal recycler, and large, square offcuts can be kept for small parts on later jobs. This is an illustration. Each EN-700 enclosure at 50 off leaves about 4.2 kg of galvanised steel offcut and skeleton; at an illustrative scrap price of A$0.30 per kilogram, that is worth about **A$1.27** per enclosure. Aluminium scrap is worth more per kilogram than steel, and keeping it separate from steel scrap preserves its value.

Whether to credit scrap value in a quote is a policy decision. Most shops do not credit it job by job, because the price fluctuates and the scrap from many jobs is sold together; they treat it as a small offset to overhead. Offcuts kept for reuse are more valuable, but only if they are actually used; a rack of offcuts that nobody draws on is just slow scrap.

## Checking the nest

A nest is worth checking against a rough calculation, because nesting software can be given the wrong sheet size, the wrong quantity or the wrong part revision. The quick check is the one used above: the parts' total blank area for the batch divided by the sheets' total area should give a yield in a plausible range, typically 65 to 85% for mixed panel work like EN-700's. A yield above 90% suggests that parts are missing or the sheet size is wrong; one below 60% suggests a poor nest worth a second look, or parts that would nest better with another job's.

## Material price movements

Sheet and especially aluminium prices move, sometimes sharply, over the weeks between quote and order. A quote's validity period, Chapter 1's 30 days, is partly a material-price protection. For long-running orders or large material content, a shop may quote material at the day's price with a stated adjustment if prices move beyond a threshold, or buy and hold the material when the order is placed. EN-700's aluminium door is nearly a third of the enclosure's material cost at 50 off, so a movement in aluminium prices matters to its price more than its small area suggests.

## Minimum buys

Suppliers do not always sell single sheets. Aluminium in particular may come in packs, and a special thickness or coating may have a minimum order. This is an illustration. If EN-700's 2.0 mm aluminium is sold only in packs of five sheets, the 20-off batch's four sheets become five, about A$147.74 more, or about A$7.39 per enclosure at 20 off. The extra sheet goes into stock, where it may be used by a later job or may sit for a year. A quote at low quantities should price what must actually be bought, and decide deliberately whether to charge the whole pack to the job or to carry part of it as stock at the shop's risk.

## The material line in summary

```figure
type: stats
title: EN-700 material per enclosure at 50 off, ex GST
caption: This is an illustration. Sheet at nested yield, with an 8% on-cost, plus bought-in items; the customer supplies the latch.
- A$79.59 | Sheet as bought | 30, 7 and 9 sheets of the three materials
- A$85.96 | With 8% on-cost | Ordering, receiving, storing, handling
- A$42.00 | Bought-in items | Hinge, gasket, fasteners, sealant, carton
- * A$127.96 | Material line | Per enclosure at 50 off
```

The material line is the most certain part of the quote, because its quantities come straight from the nests and its prices from current supplier quotes. That certainty is worth protecting: the nests and the supplier quotes should be kept with the estimate, so that a reviewer, or the estimator after the job, can see exactly where every dollar came from.

## Certificates and traceability

Some customers require material certificates, the mill's or supplier's statement of a batch's grade and properties, and traceability from each part back to its sheet. These add cost: certified material may cost more, and keeping each part traceable to its sheet takes marking and records. EN-700's specification asked for certificates for the galvanised steel's coating class, which the supplier provides with each delivery; the estimator allowed a small amount of time per batch for filing them with the job. Had full part-to-sheet traceability been required, each blank would need a mark from the laser and a record linking it to its sheet's certificate, which is a real cost per part and should appear in the quote as such.

## Exercise: a 1.0 mm roof

Suppose the customer asks whether a 1.0 mm galvanised roof and rain hood would reduce the price. The roof and hood blanks are 560 × 310 and 520 × 230 mm, about 0.293 m² per set. If they nest separately on 1.0 mm sheets, eight sets per sheet, a yield of about 81%, with a 1.0 mm sheet at an illustrative A$56.20, what is their material cost per enclosure at 50 off? What happens to the 1.2 mm nest, and is the saving real?

**Worked answer.** Fifty sets at eight per sheet need 50 ÷ 8 = 6.25, so **7 sheets**, about A$393.40, or about **A$7.87** per enclosure. The roof and hood would leave the 1.2 mm nest, whose remaining parts, the back, sides and base, nest differently; if they now fit, say, six enclosures to three sheets, 50 off would need 25 sheets instead of 30, saving about 5 × A$65.11 = A$325.55, or about **A$6.51** per enclosure.

The change does not save money at all: the thinner sheet costs about A$7.87 per enclosure against a saving of A$6.51, a net **increase of about A$1.36**, because the separate thin nest has its own part-used last sheet. That is before counting a second material to stock and handle, a second nest to program, a second clinching die setting, as *Sheet Metal Joints by the Numbers* warns, and the roof's reduced stiffness. Material decisions should be priced with their nesting and process effects, not by the thickness alone; a thinner sheet is not automatically a cheaper part.
