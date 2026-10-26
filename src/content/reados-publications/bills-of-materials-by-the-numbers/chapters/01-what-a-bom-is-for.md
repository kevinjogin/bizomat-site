---
book: bills-of-materials-by-the-numbers
chapterSlug: what-a-bom-is-for
order: 1
title: "What a bill of materials is for"
description: "Who uses a BOM and for what, engineering, manufacturing and CAD BOMs, the indented, top-level and parts-only views of one structure, and the running case's pallet conveyor module."
draft: false
---

A bill of materials looks like a simple list: part numbers, descriptions, quantities. It is in fact several documents sharing one structure, read by people with different questions. The buyer wants to know what to order and how much. The storeperson wants to know what to pick for this build. The fitter wants to know what goes into which sub-assembly. The cost accountant wants to know what the product costs. The planner wants to know what must be made before what. One BOM can answer all of them, if its structure and its numbers are right, and if each reader looks at it in the way that suits their question.

This chapter sets out who uses a BOM and why, the differences between the engineering, manufacturing and CAD versions of a BOM, and the three standard views of one structure: indented, top-level only and parts only. It introduces the running case, the PC-600 pallet conveyor module, and finds a fastener shortage caused by reading the right BOM in the wrong view.

## Who uses a BOM

Each user asks a different question, and the BOM must be able to answer it.

```figure
type: compare
title: Who uses the BOM, and what they need from it
cols: Question | What they need from the BOM
caption: One structure serves every user, but each reads it differently. Most BOM disputes are two users reading the same BOM for different questions.
- Design | What is this product made of? | Every part and sub-assembly, at the right revision
- Purchasing | What do we buy, and how much? | Bought items, totalled across every level, in buying units
- Production planning | What must be made, in what order? | Made items and the levels they sit at
- Store and kitting | What do we pick for this build? | Items by sub-assembly, in issue units
- *Costing | What does the product cost? | Every item's cost, multiplied by its total quantity
- Service | What spare parts does this unit have? | The as-built structure of a particular unit
```

## Engineering, manufacturing and CAD BOMs

Three versions of a BOM are common, and confusing them is a common source of error.

**The engineering BOM** describes the product as designed: its parts and sub-assemblies, grouped the way the designer thinks about them, at their design revisions.

**The manufacturing BOM** describes the product as built: grouped the way the workshop assembles it, with the raw materials made items are cut from, the consumables used in building, and sometimes items the design does not show at all, such as packaging or labels.

**The CAD BOM** is a table generated from the CAD assembly, usually placed on the assembly drawing. It shows what is modelled: every part and sub-assembly in the CAD file, with properties read from the models. It is usually close to the engineering BOM and often lacks what the model does not contain, such as weld wire, paint or the bar stock a shaft is turned from.

The three can differ legitimately. A sub-assembly that the designer groups for clarity may not be built separately, and a raw material the workshop needs may not be modelled. The point is to know which BOM is being read, and to keep the differences deliberate and recorded.

## The running case: the PC-600 module

This is an illustration. The PC-600 pallet conveyor module's engineering BOM has four levels. At its top, level 0, is the module itself. Its level 1 items are:

- **FR-610 frame weldment**, 1 off, made from rectangular hollow section and plate;
- **DU-620 drive unit**, 1 off, with a bought motor, gearbox and coupling, a made drive shaft assembly DS-621, and 8 M10 bolts;
- **IR-630 idler roller**, 12 off, each made from a tube, a shaft, two 6204 bearings and two end caps;
- **GD-640 side guide**, 2 off, folded from 2 mm sheet;
- **Belt**, 4.2 m, bought by the metre;
- **M10 bolts**, 36 off, fixing the rollers and guides to the frame.

The drive shaft assembly DS-621, at level 2 under the drive unit, contains a shaft, a drive pulley and two 6205 bearings.

```figure
type: tree
title: The PC-600 module's structure, first levels
caption: This is an illustration. Quantities are per parent. The full BOM has about 30 lines; this shows its shape.
- PC-600 Pallet conveyor module | Level 0
  - FR-610 Frame weldment × 1 | Made: rails, cross members and feet
  - DU-620 Drive unit × 1 | Made
    - Motor, gearbox and coupling × 1 each | Bought
    - DS-621 Drive shaft assembly × 1 | Made: shaft, pulley, 2 × 6205 bearings
    - M10 bolt × 8 | Bought
  - * IR-630 Idler roller × 12 | Made: tube, shaft, 2 × 6204 bearings, 2 end caps
  - GD-640 Side guide × 2 | Made from 2 mm sheet
  - Belt × 4.2 m | Bought by the metre
  - M10 bolt × 36 | Bought
```

## Three views of one structure

A CAD program, or a business system, can show the same structure in several ways. SOLIDWORKS's help describes three standard BOM types, and most systems offer equivalents:

- **Indented**, which lists sub-assemblies and indents their components beneath them, showing the whole hierarchy;
- **Top-level only**, which lists the parts and sub-assemblies at the top level but not the components inside the sub-assemblies;
- **Parts only**, which omits the sub-assemblies themselves and lists every part they contain as an individual item, with quantities totalled.

Each answers a different question. The indented view shows how the product is built. The top-level view is the kit list for final assembly: what the fitter needs at the main assembly stage, with sub-assemblies arriving already built. The parts-only view, with quantities totalled across all levels, is what purchasing needs to order bought parts.

```figure
type: compare
title: Bearings and bolts in each view of the PC-600 BOM
cols: Indented | Top-level only | Parts only
caption: This is an illustration. The same structure gives very different counts depending on the view. Only the parts-only view totals across levels.
- 6204 bearing | 2 under each roller, 12 rollers | Not shown | 24
- 6205 bearing | 2 under DS-621 | Not shown | 2
- *M10 bolt | 36 at top level, 8 under DU-620 | 36 | 44
- IR-630 idler roller | 12 at top level | 12 | Not shown, as a sub-assembly
```

## The error: ordering from the top level

This is an illustration. For the first customer batch of four PC-600 modules, a buyer exported the module's CAD BOM to a spreadsheet and ordered the bought parts from it. The export used the assembly drawing's table, which had been set to top-level only, because the drawing's purpose was final assembly.

The order covered the 36 top-level M10 bolts per module, 144 in all, and none of the 8 per drive unit, which appear only inside DU-620. It also covered no bearings at all, because the rollers and drive shaft appear at the top level as sub-assemblies, and their bearings sit inside them. The bearing gap was noticed at once, because the buyer knew rollers need bearings. The bolt gap was not: the first module's drive unit was assembled with bolts borrowed from stock, and the store's M10 stock ran out during the third.

The fault was not in the BOM, which was correct, but in the view. The fix was a rule: purchasing orders from the parts-only view, which totals 44 M10 bolts per module, 176 for four, and the drawing's top-level table is labelled "FOR ASSEMBLY, NOT FOR ORDERING". The office also added a check to its order process: the total count of each fastener in the order must match the parts-only view for the batch.

## What every line carries

Whatever the view, each line of a BOM should carry enough to identify the item and its quantity unambiguously:

- an **item number**, the line's position in this BOM, used for balloons on the drawing;
- a **part number**, which identifies the item across every BOM it appears in;
- a **description**, for people;
- a **quantity per parent**, with its **unit of measure**;
- a **revision**, where the BOM must say which version of the part is used;
- a **source**, whether the item is made, bought or a phantom, which Chapter 6 explains.

The part number does the real work. The description may change, the item number differs between BOMs, but the part number is how purchasing, the store and the planning system recognise the item. A BOM line without a part number, "bracket, as drawn", is a line no system can act on. The unit of measure deserves the same attention: "4.2" means nothing until the line says whether it is metres of belt, pieces or kilograms, and Chapter 4 shows what happens when it does not.

## Who owns which part of the BOM

A BOM serves several departments, and each owns part of it. If nobody owns a part, it drifts; if everybody does, it is changed without agreement. The business behind the PC-600 divides ownership this way:

- **Design** owns the structure and the part numbers of the engineering BOM: which parts the product contains and at what revision.
- **Production engineering** owns the manufacturing BOM's additions: raw materials, cut lengths, consumables, and how the product is grouped for building.
- **Purchasing** owns the bought items' supplier details, buying units and lead times, but not whether they are in the BOM.
- **Costing** owns the cost rates applied to the BOM, but not its quantities.

Each change goes through the owner of the part it touches. A buyer who finds a cheaper equivalent bearing proposes it to design, which decides whether it is equivalent and changes the BOM if so; the buyer does not substitute it on the order and leave the BOM showing the old part. The rule sounds bureaucratic and saves a great deal of confusion: when the BOM says 6204 bearing, every department knows it means the same bearing.

## The BOM and the drawing

The assembly drawing usually carries a parts list, and its balloons point to the parts by item number. The parts list and the BOM must agree, and the simplest way to make them agree is for the drawing's table to be generated from the same CAD assembly as the CAD BOM, as Chapter 10 describes, rather than typed. A typed parts list is a second copy of the BOM, and a second copy will one day disagree with the first.

The drawing's parts list is usually a top-level view, because the drawing shows one level of assembly at a time: the PC-600's general arrangement shows its frame, drive unit, rollers, guides, belt and top-level bolts, and the drive unit's own drawing shows what is inside it. That is right for the drawing's purpose and, as the error above showed, wrong for ordering.

## How big a BOM is

The PC-600's BOM, counted different ways, gives different sizes, and each count answers a different question. Its single-level BOMs, one per parent, hold about thirty relationship lines in all. Its indented view, which lists each item under each parent it appears in, has about the same number of lines. Its parts-only view lists each distinct bought or made part once, with its total quantity. A business system may also list the raw materials, such as the tube stock and sheet stock, as items in their own right.

Line counts matter in practice for two reasons. Every line is something that can be wrong, so a product with a thousand lines needs a more systematic check than one with thirty. And every line costs time to create and maintain, which is one reason Chapter 10's BOMs generated from CAD are worth the effort of setting up.

## Single-level and multilevel

Business systems usually store a BOM as single-level relationships: each parent's immediate children and their quantities. The PC-600's single-level BOM says the module contains one drive unit; the drive unit's says it contains one drive shaft assembly and 8 bolts; the drive shaft assembly's says it contains two 6205 bearings. The multilevel views are built from these by following the relationships down, multiplying quantities as Chapter 3 shows.

Storing single levels has a great advantage: a sub-assembly used in several products has one BOM, maintained once. The IR-630 roller is also used on a longer conveyor module; its BOM, tube, shaft, two bearings, two end caps, is the same in both, and a change to it applies to both. The cost is that every multilevel answer has to be calculated, and the calculation is where most BOM errors live.

## The as-built BOM

One more BOM is worth naming, because service needs it and nobody else does: the **as-built** record of a particular unit, listing what was actually fitted, including any substitutions and the serial or batch numbers of traceable parts. The PC-600's engineering BOM says each roller has two 6204 bearings; the as-built record for module 3 of the first batch says which bearing batch was fitted to which roller, because a later bearing recall would need to know. Most small businesses keep as-built records only for traceable or safety-related parts, and that is usually enough; the engineering BOM covers the rest, provided substitutions are recorded as deviations rather than made silently.

## Exercise: a spare-parts list

A customer with six PC-600 modules wants a spare-parts kit containing one of every bearing and one of every fastener used, per module, so that a complete set is on site. Which view of the BOM should the service team start from, and how many 6204 bearings, 6205 bearings and M10 bolts would a full set for one module contain?

**Worked answer.** The service team needs every bought part at every level, with totals, which is the **parts-only** view. For one module it gives:

- **6204 bearings**: 2 per roller × 12 rollers = **24**;
- **6205 bearings**: 2 in the drive shaft assembly × 1 = **2**;
- **M10 bolts**: 36 at the top level plus 8 in the drive unit = **44**.

A "complete set" of 24 bearings and 44 bolts per module is probably more than the customer means by spares; a typical spares kit holds a fraction of the wearing parts. But the parts-only view is the right starting point, because it is the only view that shows how many of each part a module contains. The service team would then agree the kit's contents with the customer, such as 4 of the 6204 bearings and both 6205 bearings, and give the kit its own part number and BOM.
