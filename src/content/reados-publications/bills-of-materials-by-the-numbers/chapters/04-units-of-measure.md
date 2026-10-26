---
book: bills-of-materials-by-the-numbers
chapterSlug: units-of-measure
order: 4
title: "Units of measure: using, buying and stocking"
description: "Keep a BOM in the units things are used in, convert to the units they are bought and stocked in, calculate mass from geometry, and catch an order a hundred times too large."
draft: false
---

A bill of materials says the module needs 44 bolts, 6.0 metres of tube and 0.48 square metres of sheet. The supplier sells bolts in boxes of 100, tube in 6 metre lengths and sheet in 2,400 × 1,200 mm sheets, priced per kilogram. The store keeps bolts in bins counted each, tube in racks counted by length, and sheet in stacks counted by sheet. Each of those is a unit of measure, and every conversion between them is a place for an order to come out ten or a hundred times wrong.

This chapter sets out the three kinds of unit an item can have, using, buying and stocking, and how to keep the BOM in one and convert reliably to the others. It covers conversion factors, items bought by mass but used by length or area, calculating mass from geometry, and the checks that catch a unit error before an order is sent. The running case finds a purchase order for 17,600 bolts.

## Three units for one item

**The using unit** is the unit the product consumes: bolts each, tube in metres, sheet in square metres, paint in litres. The BOM should use it, because it is the unit in which the design states the quantity: two bearings, half a metre of tube.

**The buying unit** is the unit the supplier sells: boxes of 100 bolts, 6 m lengths of tube, sheets of a stated size, steel by the kilogram, paint by the 20 litre drum.

**The stocking unit** is the unit the store counts and issues: often the same as the using unit for small parts, often the buying unit for raw material.

Each item needs a conversion factor between each pair of units it uses, recorded once against the item, not re-entered on each order.

```figure
type: compare
title: Units of measure for PC-600 items
cols: Using unit | Buying unit | Conversion
caption: This is an illustration. Conversion factors are recorded against each item. The mass figures assume a steel density of 7,850 kg/m³.
- M10 bolt | each | box of 100 | 100 each = 1 box
- Roller tube, 50.8 mm | m | 6 m length | 6 m = 1 length
- *RHS 50 × 50 × 3 | m | kg | about 4.43 kg = 1 m
- 2 mm steel sheet | m² | sheet 2,400 × 1,200 mm, priced per kg | 2.88 m² = 1 sheet = about 45.2 kg
- Belt | m | m, cut from roll | 1 m = 1 m
```

## Keep the BOM in using units

It is tempting to put buying units in the BOM so that orders can be raised straight from it: "tube, 1 length per module" instead of "tube, 6.0 m per module". It works until anything changes. If the supplier changes to 6.5 m lengths, or a second product uses the same tube in different lengths, or a batch of four needs 24 m, which is exactly four lengths, while a batch of five needs 30 m, which is five, the BOM in buying units is wrong in a way that is hard to see.

The rule is to keep BOM quantities in using units, roll them up in using units, and convert to buying units only at the point of ordering, after totalling and after the scrap and cutting allowances of Chapter 5. Four modules need 24.0 m of tube, which at 6 m a length is exactly **4 lengths**; seven modules need 42.0 m, **7 lengths**; five need 30.0 m, **5 lengths**. The conversion is done once, on the total, where it can be checked.

## Mass from geometry

Steel sections and sheet are often bought by the kilogram and used by the metre or square metre. The conversion factor is the mass per unit length or area, which a supplier's catalogue gives and which can also be estimated from the section's geometry and the material's density.

This is an illustration. A 50 × 50 × 3 mm square hollow section, ignoring its corner radii, has a cross-sectional area of 50² − 44² = **564 mm²**. At 7,850 kg/m³, a metre of it weighs 564 × 10⁻⁶ m² × 1 m × 7,850 kg/m³ = about **4.43 kg**. The real section, with its rounded corners, is slightly lighter, and the supplier's catalogue figure should be used for ordering; the estimate is a check that the catalogue figure is for the right section. The batch of four modules' 41.76 m of section weighs about 41.76 × 4.43 = **185 kg** by this estimate.

For 2 mm sheet, the mass per square metre is 0.002 m × 7,850 kg/m³ = **15.7 kg/m²**, and a 2,400 × 1,200 mm sheet, 2.88 m², weighs about **45.2 kg**.

```figure
type: formula
title: Mass per metre and per square metre from geometry
formula: mass per metre = cross-sectional area × density        mass per m² = thickness × density
caption: This is an illustration for the PC-600's steel, at 7,850 kg/m³. Use the supplier's figures for ordering; use these to check them.
- cross-sectional area | 50 × 50 × 3 SHS, square corners: 50² − 44² = 564 mm²
- thickness | 2 mm sheet: 0.002 m
step: SHS: 564 × 10⁻⁶ × 7,850 ≈ 4.43 kg/m
step: Sheet: 0.002 × 7,850 = 15.7 kg/m²
step: One 2.88 m² sheet: 2.88 × 15.7 ≈ 45.2 kg
```

## The error: 17,600 bolts

This is an illustration. When the business moved its BOMs into a new business system, the M10 bolt was set up with a using unit of "each" and a buying unit of "box of 100". The import mapped the BOM's quantity column to the buying unit by mistake. For the batch of four modules, the system calculated a requirement of 176, correctly, and then raised a purchase order for **176 boxes**: 17,600 bolts.

At about A$38 a box, excluding GST, in this illustration, the order was worth about **A$6,688** instead of the A$76 that two boxes would cost. The buyer noticed the value, which was far above what a batch's fasteners normally cost, and stopped the order. The fix was to correct the item's unit mapping and rerun the requirement, which gave 176 each, converted to 2 boxes.

The check that caught it, the order's value against what such an order normally costs, is worth formalising. The business now flags any purchase line whose value or quantity is more than three times the same item's average over the last year, and a person must approve it.

## Rounding to buying units

Converting a requirement to buying units almost always means rounding up: 176 bolts is 1.76 boxes, which is 2 boxes. The rounding should be done on the batch's total, as Chapter 3 said, and the excess, 24 bolts here, stays in stock for the next batch. A planning system that knows the stock will use it next time; one that does not will round up again and the store will slowly fill with part boxes.

Minimum order quantities and price breaks are a separate question from units. A supplier who sells bolts only in boxes of 100 has a buying unit of 100; one who sells individually but gives a lower price above 500 has a buying unit of one and a price break at 500. The BOM should not reflect either; purchasing decides how much to buy, given the requirement the BOM produces.

## Units that look the same

Some units look alike and are not. A "length" of tube may be 6 m from one supplier and 6.5 m from another. A "sheet" may be 2,400 × 1,200 or 2,500 × 1,250 mm. A "drum" of paint may be 4, 10 or 20 litres. Each such unit must be defined with its size against each item, and an item bought from two suppliers in different sizes needs two buying units, each with its own conversion. The PC-600's tube is bought from one supplier in 6 m lengths; if a second supplier with 6.5 m lengths is added, the item gets a second conversion, and the cutting allowances of Chapter 5 must be recalculated for it.

## Consumables

Consumables, paint, weld wire, adhesive, cleaning solvent, are the items most often left out of BOMs, because they are not modelled and their quantities are not obvious. When they are included, their quantities need a stated basis.

This is an illustration. The PC-600's frame is painted, and its painted surface, taken from the CAD model, is about 2.1 m². The paint supplier's data sheet gives a practical coverage, for the film thickness the business specifies, which in this illustration is 8 m² per litre. The frame's paint quantity is therefore 2.1 ÷ 8 = about **0.26 litres**, stored in the frame's BOM as 0.26 L with its basis recorded: "2.1 m² painted area from FR-610 model at 8 m²/L". A batch of seven frames needs about 1.84 L, which at 4 L a tin rounds up to one tin.

The basis matters more than the number. If the frame's design changes, or the paint supplier changes the coverage figure, the basis shows how to recalculate. A consumable quantity with no basis is a guess that nobody can update.

## Issue units

The store may issue an item in a unit different from both the using and the buying unit. Tube might be bought in 6 m lengths, stocked as lengths, and issued to the saw as lengths, with the offcuts returned. Bolts might be bought in boxes and issued by count. The issue unit decides what the store's picking list shows and how stock is decremented, and a mismatch between the issue unit and the BOM's using unit is a common cause of stock records drifting from reality: the store issues a whole 6 m length for a job that the system thinks consumed 0.5 m, and the stock record shows 5.5 m that is actually on the saw's offcut rack.

The PC-600's business issues tube by length and books the offcut back to stock by measured length, so the record follows the material. It is more work at the saw and the only way the tube's stock count stays right.

## Prices follow buying units

Prices are quoted per buying unit, and the cost roll-up of Chapter 8 needs them per using unit. A tube at A$54 a 6 m length, excluding GST, costs A$9.00 a metre, so each roller's 0.5 m costs A$4.50 before any cutting allowance. The conversion is the same factor as for quantities, applied in the other direction, and the same check applies: a price per using unit that is a hundred times what it should be will make the product's cost look absurd, which is the cost roll-up's equivalent of the 17,600 bolts.

```figure
type: bars
title: A batch of seven PC-600 modules in buying units
unit: units
max: 8
caption: This is an illustration, before cutting and scrap allowances, which Chapter 5 adds. Each bar is the batch requirement converted and rounded up once.
- Roller tube, 6 m lengths for 42 m | 7
- 2 mm sheet, 2,400 × 1,200 for 14 guide blanks | 2
- *M10 bolts, boxes of 100 for 308 | 4
- Paint, 4 L tins for 1.84 L | 1
```

## Units in the CAD model

CAD properties often carry quantities that end up in the BOM: a cut length on a tube, a flat blank area on a sheet metal part, a mass. The property must say its unit, or the business system must assume one consistently. A tube length written as "500" into a property that the system reads as metres is a 500 m tube. *CAD Automation That Pays* covers how a tool writes such properties with explicit units; the BOM's side of the rule is that every quantity imported from CAD has a stated unit, checked against the item's using unit before it is accepted.

## Changing an item's units

Occasionally an item's units change: a supplier moves from selling bolts in boxes of 100 to boxes of 200, or the business decides to buy tube by the kilogram from a new mill. The change touches every open order, every stock record and every price, and it should be made as a controlled change with a cut-over date. Changing the conversion factor in place, on a working day, with open orders in the old unit, is how a business ends up receiving 200-bolt boxes against an order the system now thinks is for half as many.

The safer pattern, which the PC-600's business follows, is to create the new buying unit alongside the old one, let open orders complete in the old unit, raise new orders in the new one, and retire the old unit once nothing refers to it. It takes a little longer and leaves no order, stock record or price in two minds about what a box contains.

## Checks on units

A few checks catch most unit errors:

- **Every item has a using unit**, and every BOM line uses it.
- **Every conversion is recorded once**, against the item, and every order uses it.
- **Order lines are compared with history**, by quantity and value, as the bolt error showed.
- **Mass and length conversions are checked** against an estimate from geometry when an item is set up.

## Exercise: buying sheet for the guides

Each PC-600 has two side guides, each folded from a flat blank of 2,000 × 120 mm, so 0.24 m² per guide and 0.48 m² per module. Sheet is bought as 2,400 × 1,200 mm sheets, priced per kilogram. Ignoring cutting allowances, how many sheets does a batch of seven modules need, and what is their mass? How many guide blanks could one sheet hold if they are nested lengthways?

**Worked answer.** Seven modules need 7 × 0.48 = **3.36 m²** of sheet. Each sheet is 2.88 m², so 3.36 ÷ 2.88 = 1.17 sheets, which rounds up to **2 sheets** when bought. Two sheets weigh about 2 × 45.2 = **90.4 kg**.

By area, one sheet could hold 2.88 ÷ 0.24 = 12 blanks. Laid lengthways, a 2,000 mm blank fits along the 2,400 mm side with 400 mm left over, and 120 mm blanks fit ten across the 1,200 mm side, so the sheet holds **10** blanks, not 12, before any gap between them. Seven modules need 14 blanks, so two sheets, holding 20, are enough, and the area calculation happened to give the right number of sheets for the wrong reason. Chapter 5 makes the nesting and the gaps explicit, because the area method will not always be so lucky.
