---
book: bills-of-materials-by-the-numbers
chapterSlug: phantoms-kits-and-make-or-buy
order: 6
title: "Phantoms, kits and make-or-buy"
description: "Use phantom levels for groupings that are not stocked, decide between phantom and stocked kits, change an item from made to bought without counting its parts twice, and handle free-issue material."
draft: false
---

Not every level in a bill of materials is a thing the business builds and stocks. Some are groupings that help the designer or the fitter but never exist on a shelf; some are kits of parts picked together; some sub-assemblies are made in-house this year and bought complete next year. Each case changes what the planning system should order and make, and each, handled carelessly, makes it order or make the wrong things.

This chapter sets out how to handle them. It covers phantom levels, which the planning system passes straight through, kits of fasteners and small parts, the decision between a phantom and a stocked item, changing a sub-assembly from made to bought, and free-issue material supplied by the business to a subcontractor. The running case moves the drive shaft assembly to a machine shop and finds its bearings ordered twice.

## Phantoms

A **phantom** is a BOM level that exists for structure but is not stocked or ordered. When the planning system explodes a BOM and meets a phantom, it does not create a works order for it; it passes straight through, or "blows through", to the phantom's children, and adds their requirements directly to the phantom's parent.

Phantoms suit three cases:

- **design groupings**, such as Chapter 2's belt kit, which the designer finds useful and the workshop never builds as a unit;
- **sub-assemblies built and used at once** on the assembly line, never put into stock, where a works order and a stock transaction for each would be paperwork with no purpose;
- **common groups of parts** that appear in many products, such as a standard set of mounting fasteners, which can be maintained once as a phantom and dropped into many BOMs.

```figure
type: steps
title: How a planning system blows through a phantom
caption: This is an illustration for the PC-600's belt kit, made a phantom in Chapter 2.
- Explode the module | Belt kit × 1 is found at level 1
- Recognise the phantom | No works order and no stock movement for the kit
- Pass its children up | Belt × 4.2 m and tensioning screw × 4 are added to the module's level 1 demand
- *Continue the explosion | The belt and screws are planned as if they sat directly under the module
- Keep the structure for people | The indented BOM and the drawing still show the kit as a group
```

## Phantoms with stock

Occasionally a phantom item has stock: a few were built ahead for a trial, or returned from a cancelled order. Most systems handle this by consuming the phantom's stock first and blowing through only the rest. If the system does not, the stock sits unused while the planning system orders new parts, and someone should either use the stock deliberately or turn the phantom into a stocked item for a while. The business behind the PC-600 has two finished belt kits in stock from a trial; its system consumes them before blowing through, which was confirmed with a small test before it was relied on.

## Kits

A **kit** is a set of parts picked together for an assembly step: all the fasteners for mounting the rollers, all the parts for one drive unit. A kit can be a phantom, a list that tells the store what to pick, or a stocked item with its own part number, made by the store in advance by bagging the parts.

This is an illustration. The fitters asked for each module's 36 top-level M10 bolts, with their washers and nuts, to arrive as one bag rather than loose. The business made a stocked fastener kit, KT-650, containing the 36 bolts, 72 washers and 36 nuts, bagged by the store in batches of ten. In the module's BOM, KT-650 replaced the three loose lines.

## Phantom or stocked kit?

The choice depends on whether the kit is worth handling as a thing in its own right.

```figure
type: decision
title: Should this grouping be a phantom or a stocked item?
question: The BOM has a group of parts used together. Should the group be a phantom, a stocked kit or a stocked sub-assembly?
- Group exists only for clarity | Phantom | No orders, no stock; children planned under the parent
- Parts picked together, nothing done to them | Phantom kit, or a pick list | Store picks them for each build
- *Parts bagged or prepared ahead, used often | Stocked kit with its own part number | Kitting done in batches; one item to pick
- Parts assembled and tested ahead | Stocked sub-assembly | Works order, routing and stock of finished units
```

KT-650 earns its place as a stocked kit because it is used on every module, its contents never change between modules, and bagging ten at a time takes the store less time than picking 144 loose fasteners for every build. A kit for a one-off special would not.

A stocked kit has a BOM of its own, and its quantities must still roll up correctly. The module's demand for M10 bolts now comes through KT-650, 36 per kit and one kit per module, plus the drive unit's 8, still 44 per module. The parts-only view of Chapter 1 should show the same 44 after the kit was introduced as before, and checking that it does is the simplest test that the kit's BOM was set up right. A kit whose BOM said 36 nuts and 36 washers instead of 72 washers would show the fault in the same check, as a washer total half what it was.

## Changing from made to bought

A sub-assembly that the business makes can be bought complete instead, from a subcontractor who builds it to the business's drawing. The change alters the BOM in a specific way: the item's source changes from made to bought, its single-level BOM no longer drives the business's own orders, and its children are bought by the subcontractor, not by the business, unless the business supplies them.

This is an illustration. The business decided to buy the DS-621 drive shaft assembly, the shaft, pulley and two 6205 bearings, complete from a machine shop. The machine shop would turn the shaft, make the pulley, buy and fit the bearings, and deliver finished assemblies. In the business's system, DS-621 became a bought item with the machine shop as supplier. Its own BOM remained on file for reference, since the drawing still defines what the machine shop makes, but no longer exploded in planning.

```figure
type: compare
title: The DS-621 drive shaft assembly, made and bought
cols: Made in-house | Bought complete | Bought with free-issue bearings
caption: This is an illustration. The business orders different things in each case; the drawing defining the assembly is the same.
- What the business orders | Shaft bar, pulley material, 2 × 6205 bearings | DS-621 complete × 1 | DS-621 × 1, and 2 × 6205 bearings to send to the machine shop
- Works order in-house | Yes | No | No
- Bearings in the business's demand | 2 | 0 | 2, issued to the subcontractor
- *Who fits the bearings | Business | Machine shop | Machine shop
```

## The error: two bearings ordered twice

This is an illustration. When DS-621 was changed to bought, the engineer making the change worried that the bearings would disappear from the business's orders, as they did, and moved the two 6205 bearings up into the DU-620 drive unit's BOM "so they would still be ordered". The machine shop, meanwhile, had quoted for complete assemblies with bearings fitted.

For the next batch of seven modules, the business received seven complete drive shaft assemblies, bearings fitted, and also bought fourteen 6205 bearings that nothing used. The store found them when the drive units were built: every DS-621 arrived complete, and fourteen bearings sat in the bin with no demand.

The fix was to remove the bearings from DU-620's BOM. The check that would have caught it was to compare the new BOM with the machine shop's quotation line by line: the quotation said "bearings supplied and fitted", so the business's BOM should have had no bearings below the drive unit. Any change of source from made to bought should be checked against what the supplier has agreed to supply, before the first order.

## Free-issue material

Sometimes the business supplies some of a subcontracted assembly's parts itself, because it buys them more cheaply, holds them in stock, or needs traceability. That is **free-issue** material: the business buys it, issues it to the subcontractor, and receives the finished assembly back.

Free issue complicates the BOM in a useful way. The subcontracted item is bought, but some of its children are still the business's demand, so the BOM must show which children are free-issued and which the subcontractor provides. Most systems mark free-issue lines with a flag, so that the planning system raises demand for them and the store issues them to the subcontractor rather than to an internal works order. Without the flag, either the business does not order them and the subcontractor waits, or the business orders them and they sit in the store, as happened above. Free-issue stock held at the subcontractor's premises still belongs to the business, so the stock record should show where it is; a count of the store that finds fourteen bearings missing may simply be counting the wrong building.

## The make-or-buy arithmetic

The BOM is also where the make-or-buy decision's numbers come from. This is an illustration, in Australian dollars excluding GST. Made in-house, DS-621 costs its material, shaft bar, pulley material and two bearings, about A$118, plus 1.5 hours of machining and assembly at the business's rate of A$85 an hour, A$127.50: about **A$245.50** each. The machine shop quoted **A$232** each, complete.

The bought assembly is A$13.50 cheaper on price, but that is not the whole comparison. In-house, the business's machinist has 1.5 hours per assembly freed for other work, which matters if the machine shop is the bottleneck and not if it is idle. The machine shop's lead time, three weeks, is longer than the business's own, a week, so the planning system needs the longer lead time on DS-621 and orders earlier. And the business loses direct control of the bearing fitting, which the machine shop's quotation and an inspection on receipt must cover. The BOM's figures start the decision; capacity, lead time and quality finish it.

## The cost of a level

Every made level in a BOM costs administration: a works order to raise, issue and close, stock transactions for its components and for the finished item, and usually a little floor space. Those costs are small per batch and real over a year.

This is an illustration. The business estimates a quarter of an hour of planning and store time per works order, about A$21 at A$85 an hour. DS-621, made in batches for each module batch, generated about 24 works orders a year: about **A$510** of administration that the make-or-buy comparison above left out. Buying the assembly removed those works orders as well as the machining, and the business's comparison, redone with them included, favoured buying more clearly. The same reasoning explains why phantoms are worth using for groupings that do not need works orders: each phantom saves that administration on every batch.

## Phantoms in costing

A phantom has no works order and no labour of its own, so its cost in a cost roll-up is simply the sum of its children's costs. The belt kit costs its belt and screws, nothing more. A cost roll-up that adds an assembly labour rate to every level, including phantoms, overstates the product's cost by a labour charge for work that does not happen. Chapter 8's roll-up applies labour only to levels with a routing, which in the PC-600's BOM excludes the belt kit and the fastener kit's bagging, which the store charges as overhead.

## Reversing a change

Make-or-buy decisions are reversed more often than people expect: a supplier raises prices, misses deliveries or closes. The BOM should make reversal easy, which is another reason to keep a bought sub-assembly's BOM on file. When DS-621 is bought, its BOM still records the shaft, pulley and bearings at their current revisions, and the drawing still defines them. Bringing it back in-house means changing the source back to made, reviewing that BOM against the current drawing and recalculating lead times, not reconstructing a sub-assembly from memory.

## The CAD model and phantoms

The CAD assembly usually does not know which levels are phantoms, kits or bought items: those are manufacturing decisions, not design ones. The business keeps them as properties on the CAD models, read by the BOM export of Chapter 10, so that a sub-assembly marked as a phantom in its model is marked as a phantom in the business system when the BOM is imported. The alternative, setting them by hand in the business system after each import, is how a phantom becomes a stocked item again when someone reimports the BOM.

## Exercise: a kit for the drive unit

The store proposes a stocked kit for each drive unit's loose parts: the motor, gearbox, coupling, drive shaft assembly and 8 M10 bolts, picked and staged on a trolley a day before the drive unit is built. The drive unit is already a made sub-assembly with its own works order. Should the kit be a new stocked item, a phantom, or neither?

**Worked answer.** **Neither.** The drive unit DU-620 already groups exactly these parts in its single-level BOM, and its works order already tells the store what to pick. A new stocked kit would add a part number, a stock record and a works order for an item that is unpacked the next day, with nothing done to its contents. A phantom would remove the drive unit's level from planning, which is wrong, because the drive unit is genuinely built and its works order is needed.

What the store wants is a pick list for the drive unit's works order, staged a day early. That is a scheduling and picking practice, not a BOM change. The BOM should stay as it is, and the store's process should pick DU-620's components to a trolley when the works order is released, which needs no new item at all. The general test is that a new BOM level should exist because something is built, stocked, bought or tracked at that level; a level created to fix a scheduling or picking problem usually creates a planning problem in its place.
