---
book: bills-of-materials-by-the-numbers
chapterSlug: levels-parents-and-where-used
order: 2
title: "Levels, parents and where-used"
description: "Number BOM levels, read level codes, find each item's lowest level for planning, answer where-used questions by implosion, decide when a group deserves to be a sub-assembly, and find duplicate items."
draft: false
---

A bill of materials is a tree, or more exactly a set of small trees joined wherever a part is used in more than one parent. Reading it well means knowing where each item sits: how far down the product it is, which parents use it, and how many of each. Those positions decide how quantities multiply, which items a planner must make first, and which products a change to a part will affect.

This chapter sets out the vocabulary and the questions. It covers numbering levels and writing level codes, the lowest level at which each item appears and why planning systems need it, answering where-used questions by reversing the tree, deciding when a group of parts should be a sub-assembly of its own, and finding the duplicates that creep in when the same sub-assembly is created twice under different numbers. The running case finds that the business stocks two identical rollers under two part numbers.

## Levels

The top item, the finished product, is level 0. Its direct children are level 1, their children level 2, and so on. Indented BOMs often show the level with a code: a number, or dots before the item, so that a reader can see at once how deep a line sits.

```figure
type: compare
title: Level codes for one branch of the PC-600 BOM
cols: Level | Quantity per parent | Source
caption: This is an illustration. Each dot is one level below the module. The 6205 bearing sits three levels down.
- PC-600 Pallet conveyor module | 0 | — | Made
- . DU-620 Drive unit | 1 | 1 | Made
- . . Motor | 2 | 1 | Bought
- . . DS-621 Drive shaft assembly | 2 | 1 | Made
- * . . . 6205 bearing | 3 | 2 | Bought
- . . M10 bolt | 2 | 8 | Bought
- . M10 bolt | 1 | 36 | Bought
```

The PC-600's deepest branch reaches level 3, the bearings in the drive shaft assembly. Most small products are three to six levels deep. A BOM much deeper than that usually contains sub-assemblies that exist only as groupings in the design, which the next sections deal with.

## The same item at several levels

An item can appear at more than one level. The M10 bolt is at level 1, where 36 fix the rollers and guides to the frame, and at level 2, where 8 are inside the drive unit. Both lines are correct, and Chapter 3 adds them into one total of 44 per module.

Planning systems care about the **lowest level** at which an item appears, often called its low-level code. They process the BOM level by level, from the top down, and an item must not be processed until every parent that uses it has been, or its demand from the deeper parents would be missed. The M10 bolt's low-level code is 2, not 1, because its deepest use is inside the drive unit. A planning system that gave it code 1 would calculate the bolt's requirement before it had counted the drive unit's demand, and would order 36 per module instead of 44.

Most systems calculate low-level codes automatically when BOMs are saved. A BOM imported in bulk, from a spreadsheet or a CAD export, may need the codes recalculated afterwards, which is worth checking whenever a planning run's results look short.

## Where-used: reading the tree upwards

A BOM answers "what is in this product?" by reading downwards, from parent to children, which is called exploding. It answers "where is this part used?" by reading upwards, from a part to every parent that contains it, which is called imploding, or a where-used query. Both are the same relationships read in opposite directions.

Where-used matters whenever a part changes. If the 6204 bearing's supplier discontinues it, design needs to know every product that uses it, how many it uses, and what stock and open orders exist.

This is an illustration. The where-used query for the 6204 bearing finds:

- **IR-630 idler roller**, 2 per roller;
- IR-630 is used in **PC-600**, 12 per module, and in **PC-900**, a longer module, 18 per module.

So each PC-600 uses 2 × 12 = 24 bearings and each PC-900 uses 2 × 18 = 36. With 10 PC-600 and 4 PC-900 modules on order, the bearing change affects 10 × 24 + 4 × 36 = **384** bearings of demand.

```figure
type: stats
title: Where the 6204 bearing is used
caption: This is an illustration. A where-used query reads the tree upwards and multiplies quantities on the way.
- 2 | Per IR-630 idler roller | Direct parent
- 24 | Per PC-600 module | 12 rollers × 2
- 36 | Per PC-900 module | 18 rollers × 2
- * 384 | On the current order book | 10 PC-600 and 4 PC-900 modules
```

## When is a group a sub-assembly?

Designers group parts into sub-assemblies for clarity, and the groups become levels in the BOM. Some of those levels are real: the idler roller is assembled on a bench, stocked as a finished item, and fitted to many modules. Others are only design groupings: a "frame fixings" sub-assembly that collects bolts for the designer's convenience is never built or stocked as a unit.

The question for each group is whether the business builds, stocks, sells or tracks it as a unit. If it does, it deserves its own part number, BOM and drawing. If not, it either should not be a level in the manufacturing BOM, or should be a phantom, which Chapter 6 explains: a level that exists for structure but is not stocked or ordered.

This is an illustration. The PC-600's designer had grouped the belt and the belt tensioning screws as a "belt kit" sub-assembly in the CAD model. The workshop never assembled them together; the belt was fitted at the end of assembly, and the screws earlier, with the frame. The kit appeared in the business system as a made item with no routing, and the planning system kept trying to schedule its manufacture. Making the kit a phantom removed it from planning without losing the grouping from the design.

## The error: the same roller twice

This is an illustration. When the longer PC-900 module was designed, its designer needed an idler roller and created a new one, IR-635, copying the PC-600's roller model and saving it under a new number, because they did not know whether a change to the PC-900's rollers might be needed later. No change was ever made. The two rollers had identical BOMs: the same tube length, shaft, bearings and end caps.

The duplicate was invisible until the store noticed two bins of identical rollers with different labels. IR-630 had 40 in stock; IR-635 had none, and the planning system had raised a works order to make 72 for the next PC-900 batch, while 40 identical rollers sat in the next bin. Comparing the two items' single-level BOMs line by line confirmed they were identical.

The fix was to replace IR-635 with IR-630 in the PC-900's BOM, mark IR-635 as superseded, and cancel the works order, reducing the PC-900 batch's roller requirement from 72 new to 72 − 40 = 32. The business's design procedure now asks, before a new part number is created, for a search of existing parts with the same description and material. *CAD Data You Can Trust* deals with that search in its chapter on numbering.

## Building a multilevel view from single levels

A multilevel view is built by starting at the top item and repeatedly replacing each made item by its own single-level BOM, multiplying quantities as the expansion goes down, until only bought items and raw materials are left.

```figure
type: steps
title: Exploding the PC-600 from its single-level BOMs
caption: This is an illustration. Each step replaces made items with their children until nothing made is left unexpanded.
- Start with the top item | PC-600 × 1
- Expand level 1 | Frame, drive unit, 12 rollers, 2 guides, belt, 36 bolts
- Expand each made item at level 1 | Drive unit gives motor, gearbox, coupling, DS-621, 8 bolts; each roller gives its five lines
- Expand made items at level 2 | DS-621 gives shaft, pulley and 2 bearings
- *Stop when only bought items and raw materials remain | Then total each part number across all branches
```

The expansion is mechanical, and a business system does it in an instant. Doing it once by hand for a small product is worth the half hour, because it shows exactly where each multiplication happens, and Chapter 3's errors are all errors in those multiplications.

## Products that share sub-assemblies

The PC-600 and PC-900 share most of their structure: the same roller, the same drive unit, the same side guide profile in a longer length. Sharing is valuable. A shared sub-assembly is designed, documented, stocked and improved once, and its demand from several products adds up into larger, cheaper batches.

A simple measure of sharing is the fraction of a product's distinct part numbers that also appear in another product. This is an illustration. Of the PC-900's distinct part numbers, about three-quarters also appear in the PC-600, once the duplicate roller is removed; the differences are the longer frame rails, the longer guides and the longer belt. Before the duplicate was removed, the measure was lower, and the business was paying for it in stock and planning effort without knowing.

## Checks on a structure

A few mechanical checks catch most structural faults, and a business system or a short script can run them on every BOM:

- **Every made item has a BOM**, and every bought item has none. A made item with no BOM cannot be planned; a bought item with a BOM is usually a mistake in its source code.
- **No item is its own ancestor.** A BOM in which a part, through some chain of parents, contains itself cannot be exploded; most systems refuse to save one, but imported data can contain one.
- **Low-level codes are current.** After any bulk change, recalculate them.
- **No two made items have identical single-level BOMs**, unless the difference is deliberate and recorded. That check would have found the duplicate roller on the day it was created.

## Item numbers and part numbers

Each BOM line also has an item number, its position in that BOM, used for the balloons on the assembly drawing. Item numbers are local: the 6204 bearing is item 3 in the roller's BOM and appears in no item list of the module's top level at all. Part numbers are global. A balloon on the drawing points to an item number; the parts list translates it to a part number; and the part number is what every other system uses. Confusing the two, for example a fitter asking the store for "item 3", is harmless on the bench and a mess on a purchase order.

## Where-used for raw materials

Where-used queries matter for raw materials too, and often more, because a raw material can sit beneath many made parts. The 50.8 mm roller tube is used only in the two rollers; the 2 mm steel sheet is used in the side guides, the drive unit's guard and three brackets on the frame. When the sheet's price rises, or its supplier changes the grade, the where-used query for the sheet is how costing and design find every part affected.

This is an illustration. The where-used query for the 2 mm sheet lists five made parts in two products. Multiplied up to the order book, the sheet's demand is dominated by the side guides, which use about four-fifths of it, so a decision about the sheet's grade is mostly a decision about the guides. Without the query, the business would have reviewed the guides and missed the three brackets, each small, each also folded from the same sheet and each also affected by any change to its bend radius or springback.

## Depth, breadth and the shape of a product

The shape of a BOM, how deep and how wide, says something about how the product is built. A wide, shallow BOM, many parts directly under the top, suits a product assembled in one stage. A deep, narrow one, with sub-assemblies inside sub-assemblies, suits a product built in stages, with sub-assemblies made ahead and stocked. Neither is better in itself; each should match how the workshop builds. A BOM whose shape does not match the workshop's practice produces planning results that the workshop ignores, which is the start of the BOM and the shop floor going their separate ways. The PC-600's BOM is shaped the way the module is built: frame first, rollers and drive unit built in parallel on benches, guides folded alongside, then final assembly at the top level. Its four levels match the workshop's four stages, and the planning system's schedule reads like the workshop's own plan.

## Exercise: a bearing change on the order book

The bearing supplier offers a sealed version of the 6204 at a different part number and the business decides to use it in all new rollers from next month. The order book has 10 PC-600 modules due before the change and 6 PC-600 and 4 PC-900 modules due after. How many of each bearing does the order book need, and which BOM changes?

**Worked answer.** Each PC-600 uses 24 bearings and each PC-900 36, from the where-used figures above.

- **Old bearing**, for the 10 PC-600 modules before the change: 10 × 24 = **240**.
- **New sealed bearing**, for the modules after: 6 × 24 + 4 × 36 = 144 + 144 = **288**.

Only one BOM changes: the IR-630 roller's single-level BOM replaces the 6204 with the sealed bearing, with an effective date, as Chapter 9 explains. Because IR-630 is used in both modules, both modules' requirements change automatically. Had the PC-900 still used the duplicate IR-635, the change would have had to be made twice, and the chance of making it once and forgetting the other is exactly why the duplicate mattered.
