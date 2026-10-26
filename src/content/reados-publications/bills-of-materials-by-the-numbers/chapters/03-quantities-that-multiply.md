---
book: bills-of-materials-by-the-numbers
chapterSlug: quantities-that-multiply
order: 3
title: "Quantities that multiply"
description: "Roll quantities up through every level, add an item's uses across branches, scale to a batch, round at the right point, handle decimal quantities, and find a part counted twice."
draft: false
---

Every quantity in a bill of materials is a quantity per parent. The BOM says a roller has two bearings, not that the module has twenty-four; it says the module has twelve rollers. The module's twenty-four bearings exist only as the product of the two numbers, and every multilevel answer a BOM gives, what to buy, what to pick, what it costs, comes from multiplying quantities down the tree and adding them up across its branches. Most BOM errors are errors in that arithmetic: a multiplication missed, a quantity entered at the wrong level, a total rounded too early.

This chapter sets out the arithmetic. It covers extended quantities, which multiply down each path, totals that add an item's uses across every path, scaling to a batch, rounding at the right point, and decimal quantities such as metres and square metres. The running case rolls up the PC-600 for a batch of four and finds a bearing counted twice.

## Extended quantity along a path

The **extended quantity** of an item on a particular path through the BOM is the product of the quantities per parent along that path, from the top down to the item. For the 6204 bearing in the PC-600:

- the module has 12 rollers;
- each roller has 2 bearings;
- the extended quantity of the bearing on that path is 12 × 2 = **24** per module.

For the 6205 bearing, deeper down: the module has 1 drive unit, the drive unit has 1 drive shaft assembly, and the assembly has 2 bearings, so 1 × 1 × 2 = **2** per module.

## Totals across paths

An item that appears on more than one path has a total equal to the sum of its extended quantities on every path. The M10 bolt appears twice: 36 at the top level, and 1 × 8 = 8 inside the drive unit. Its total is 36 + 8 = **44** per module.

```figure
type: formula
title: Total quantity of an item in a product
formula: total = Σ over every path (product of quantities per parent along the path)
caption: This is an illustration for the PC-600 module. Multiply down each path; add across paths.
- path | One route from the top item down to the item
- quantity per parent | The number on each BOM line along the path
step: 6204 bearing: 12 rollers × 2 = 24
step: 6205 bearing: 1 drive unit × 1 shaft assembly × 2 = 2
step: M10 bolt: 36 at the top level + 1 drive unit × 8 = 44
```

## The running case: rolling up the PC-600

This is an illustration. The parts-only view of Chapter 1 is exactly this roll-up, done for every item. For one PC-600 module it gives, among other lines:

```figure
type: compare
title: Rolled-up quantities for the PC-600, per module and for a batch of four
cols: Per module | Batch of four | Unit
caption: This is an illustration. Raw materials are shown in their using units; Chapter 4 converts them to buying units.
- 6204 bearing | 24 | 96 | each
- 6205 bearing | 2 | 8 | each
- Roller end cap | 24 | 96 | each
- *M10 bolt | 44 | 176 | each
- Roller tube, 50.8 mm | 6.0 | 24.0 | m
- RHS for the frame | 10.44 | 41.76 | m
- 2 mm sheet for the guides | 0.48 | 1.92 | m²
- Belt | 4.2 | 16.8 | m
```

For a batch, every total is multiplied by the batch quantity: four modules need 4 × 24 = 96 of the 6204 bearing and 4 × 44 = 176 M10 bolts. The rollers' tube, 0.5 m per roller, comes to 12 × 0.5 = 6.0 m per module and 24.0 m for the batch; the frame's rectangular hollow section, four 1.8 m rails and six 0.54 m cross members, to 4 × 1.8 + 6 × 0.54 = 10.44 m per module.

## The error: a bearing counted twice

This is an illustration. Before the first batch was ordered, a production engineer wanted the bearings visible on the module's top-level BOM, because the fitters asked for them by the module rather than by the roller. They added a line to the PC-600's top level: "6204 bearing × 24". The roller's own BOM still contained its two bearings.

The planning system did what the BOM said. Through the rollers it counted 12 × 2 = 24 bearings per module; from the new top-level line it counted another 24; total, 48 per module, 192 for the batch of four. The purchase order went out for 192. The store received 96 more bearings than the batch needed.

The excess was noticed when the store's count after the batch left 96 bearings unused. The check that should have caught it earlier was simple: the CAD assembly's parts-only count of 6204 bearings, 24 per module, against the planning system's requirement, 48. A factor of exactly two between them points straight at a duplicated line. The fix was to delete the top-level line and, to give the fitters what they wanted, add the bearings to the roller kit's pick list rather than the BOM. The surplus bearings were used on the next batch.

## Scaling to a batch

Requirements for a batch are the per-unit totals multiplied by the batch quantity, but only for items whose consumption really scales with the number of units. Some items do not: a setup piece, a test sample per batch, a tooling consumable used once whatever the batch size. Those belong on the BOM with a quantity per batch rather than per unit, or in the routing rather than the BOM, and most business systems have a field to mark them. Treating a per-batch item as per-unit multiplies it by the batch size and orders far too many; treating a per-unit item as per-batch orders far too few.

## Round at the right point

Rounding belongs at the point of buying or issuing, not in the BOM's quantities. A BOM that rounds the roller's tube length from 0.5 m up to 1 m "because we buy whole metres" doubles the tube requirement before any buying decision is made. A BOM that rounds the module's 10.44 m of hollow section to 11 m adds 0.56 m per module, which over a year's production is a lot of steel bought and not used.

The right place to round is after totalling the batch requirement: 24.0 m of tube for four modules becomes four 6 m lengths when bought, and 41.76 m of hollow section becomes however many stock lengths cover it after cutting allowances, which Chapter 5 calculates. Rounding each module's quantity, then multiplying, always buys at least as much as rounding the batch total, and usually more.

```figure
type: bars
title: Hollow section bought for seven modules, by where the rounding is done
unit: m
max: 80
caption: This is an illustration, before cutting allowances. Rounding each module up to whole metres buys 77 m; rounding the batch total buys 74 m against 73.08 m needed.
- Needed, 7 × 10.44 m | 73.08
- *Rounded once for the batch | 74
- Rounded per module, then multiplied | 77
```

## Decimal quantities and their precision

Many BOM quantities are not whole numbers: metres of tube, square metres of sheet, kilograms of weld wire, litres of paint. They should be stored to a precision that keeps the total right over a year's production. The roller's 0.5 m of tube is exact; a gusset that uses 0.0144 m² of plate should be stored as 0.0144, not rounded to 0.01, which would understate it by about 30%, or to 0.02, which would overstate it by about 40%. A useful rule is to store quantities to at least three significant figures, and to check the total for a year's expected production rather than for one unit, where small rounding errors look harmless.

## Where quantities come from

Each quantity per parent should have a source someone can check. For discrete parts, the source is the design: the assembly drawing and model show two bearings in each roller. For raw materials, it is the part's own drawing or model: the roller tube's 0.5 m comes from its cut length, the guide's 0.24 m² from its flat blank. For consumables, it is usually a measurement or an estimate from production: grams of adhesive, metres of weld per frame.

The source matters when a quantity is questioned. A quantity copied from an old spreadsheet, with no drawing or measurement behind it, is a quantity nobody can defend, and BOMs collect such numbers over the years. The business behind the PC-600 records, against each raw material and consumable line, where its quantity came from: "cut length from IR-631 drawing", "flat blank area from GD-640 model", "weld wire estimate, production, March". When the guide's flat pattern changed, the record showed at once that the sheet quantity had to change with it.

## Quantities per a different base

Some items are consumed in quantities that are awkward per unit: adhesive in grams per hundred assemblies, labels in rolls per thousand. Many systems allow a quantity per base other than one, such as "5 g per 100", and handle the division. Where a system does not, the quantity must be entered per unit, 0.05 g, and the precision rule above applies with force.

## Gross and net when sub-assemblies are in stock

A roll-up straight through every level gives the **gross** requirement: everything needed to build the batch from nothing. If some sub-assemblies are already built and in stock, the batch needs fewer of them, and fewer of everything inside them. The **net** requirement for a sub-assembly is its gross requirement less its stock, and only the net quantity is exploded further down.

This is an illustration. A batch of four PC-600 modules needs 4 × 12 = 48 rollers gross. The store holds 40 finished rollers. The net roller requirement is 48 − 40 = **8**, and only those 8 need bearings: 8 × 2 = **16** bearings, not the 96 that a straight roll-up would show.

```figure
type: compare
title: Gross and net requirements for a batch of four PC-600 modules
cols: Gross | In stock | Net
caption: This is an illustration. Stock of a sub-assembly is netted before its children are exploded, so a roll-up that ignores stock overstates every level beneath it.
- IR-630 idler roller | 48 | 40 | 8
- *6204 bearing, through the rollers | 96 | 0 | 16
- Roller end cap | 96 | 0 | 16
- Roller tube | 24.0 m | 0 | 4.0 m
```

The order matters: net the rollers first, then explode the net rollers, then net each child against its own stock. Planning systems do this level by level, which is one reason they need the low-level codes of Chapter 2. A spreadsheet roll-up that explodes the whole BOM first and nets stock afterwards will order 96 bearings when 16 are needed.

## Zero and negative quantities

Some BOM lines carry a quantity of zero: reference items shown for information, such as a mating part drawn on the assembly but supplied by the customer. They must be marked so that no system treats them as demand, and a zero quantity alone is often not enough, because some systems ignore zeros and some round them up to one.

A few businesses use negative quantities for by-products and recovered material: offcuts returned to stock, or a part removed and reused in a rebuild. Negative lines reduce the requirement for their item, and they are useful where the recovery is reliable. They are dangerous where it is not, because the planning system will count on material that may not come back. The PC-600's business uses no negative lines; offcuts are returned to stock by the store, not predicted by the BOM.

## Roll-ups in spreadsheets

Many small businesses roll BOMs up in spreadsheets, and spreadsheets have their own failure modes. Sorting a sheet by part number destroys the indentation that shows which lines belong to which parent, so any formula that relies on position stops working. A formula copied down a column can pick up the wrong parent's quantity when a row is inserted. A total that sums every line of a part number across an indented sheet adds quantities per parent without multiplying them, giving 2 + 2 = 4 bearings for the module instead of 24 and 2 for its two bearing types.

The safest spreadsheet structure gives every row its own extended quantity, calculated from its own parent's extended quantity by a reference to that parent's row, and totals by part number only from that column. Even then, a spreadsheet roll-up should be checked against an independent count as below, because spreadsheets fail without warning.

## Checking a roll-up

Three checks catch most roll-up errors:

- **Compare with an independent count.** The CAD assembly's parts-only view, or a physical count of a built unit, against the planning system's requirement for one unit. Ratios of exactly two, twelve or another BOM quantity point to duplicated or misplaced lines.
- **Check items that should match.** Each roller has two bearings and two end caps, so the module's bearing and end cap totals should be equal, 24 and 24. A mismatch is a missing or extra line.
- **Check against last time.** A batch requirement that differs from the last batch of the same product by more than the change in quantity means the BOM has changed, and the change should be explainable.

## Exercise: a mixed batch

A customer orders three PC-600 modules and two PC-900 modules. The PC-900 has 18 rollers, the same drive unit, 48 M10 bolts at its top level and 6.2 m of belt. Using the roller's BOM of two 6204 bearings and two end caps, how many 6204 bearings, end caps, M10 bolts and metres of belt does the order need?

**Worked answer.**

- **6204 bearings**: PC-600, 12 × 2 = 24 per module; PC-900, 18 × 2 = 36 per module. Total 3 × 24 + 2 × 36 = 72 + 72 = **144**.
- **End caps**: the same as bearings, **144**, which is a useful check.
- **M10 bolts**: PC-600, 36 + 8 = 44; PC-900, 48 + 8 = 56. Total 3 × 44 + 2 × 56 = 132 + 112 = **244**.
- **Belt**: 3 × 4.2 + 2 × 6.2 = 12.6 + 12.4 = **25.0 m**.

The belt total should be rounded, if at all, only when it is bought, as a length or lengths that cover 25.0 m plus whatever the belt supplier needs for joining, which is a buying allowance, not a BOM quantity.
