---
book: bills-of-materials-by-the-numbers
chapterSlug: revisions-effectivity-and-change
order: 9
title: "Revisions, effectivity and change"
description: "Change a BOM without stranding stock or building the wrong thing: revision or new part number, effectivity by date, unit or use-up, what a change touches, and a use-up switch worked out."
draft: false
---

A bill of materials changes throughout a product's life. A part is improved, a supplier is replaced, a cost is cut, a fault is fixed. Each change has to answer three questions: what is changing, from when, and what happens to the parts, sub-assemblies and orders already in the system. Answered well, a change takes effect on a planned module with nothing wasted. Answered badly, the workshop builds the old design after the change, or the store fills with parts that nothing will use.

This chapter sets out how to answer them. It covers revisions and new part numbers and the interchangeability rule between them, effectivity by date, unit and use-up, the stock and orders a change touches, and the record a change should leave. The running case replaces the rollers' open 6204 bearings with sealed ones and strands 180 bearings by setting the change's date before checking what was on order.

## Revision or new part number

The first decision is whether the changed item keeps its part number with a new revision, or gets a new part number. The usual rule is **interchangeability**: if the new item can be used everywhere the old one was, and the old one everywhere the new one is, in form, fit and function, it can be a new revision. If either way round fails, it needs a new part number, because stock of the two must be kept apart and used differently.

```figure
type: decision
title: New revision or new part number?
question: A part is being changed. Can it keep its number with a new revision?
- Old and new interchangeable both ways | New revision | Stock of either can be used anywhere
- *New can replace old, old cannot replace new | New part number | Old stock used only where old is acceptable
- Neither replaces the other | New part number | Separate items; the BOM change decides which is used where
- Drawing correction only, part unchanged | New drawing revision | Item and stock unaffected
```

This is an illustration. The PC-600's rollers have used an open 6204 bearing. Food-grade customers and wet sites have asked for sealed bearings, which keep out washdown water. A sealed 6204 has the same bore, outside diameter and width, so it fits the same roller, and it can replace the open bearing in every roller. The open bearing cannot replace the sealed one in a roller sold as sealed. The change is one-way, so the sealed bearing gets its own part number, and the roller, whose function has improved and whose old stock is still usable in standard modules, becomes revision B of IR-630.

## Effectivity

**Effectivity** says when a change takes effect. Three forms are common:

- **date effectivity**: the new BOM applies to anything built from a stated date;
- **unit effectivity**: the new BOM applies from a stated serial number, unit or batch;
- **use-up effectivity**: the new BOM applies once the old item's stock, and any stated open orders, are consumed.

```figure
type: compare
title: Three forms of effectivity
cols: Takes effect | Suits | Risk
caption: This is an illustration. Date and unit effectivity are set by people; use-up effectivity is calculated from stock and orders.
- Date | From a calendar date | Changes forced by safety or a customer deadline | Old stock and open orders stranded at the date
- Unit | From a serial, unit or batch | Changes a customer must be able to trace | Batches resequenced, changing which units get the change
- *Use-up | When old stock and stated orders run out | Cost-driven or improvement changes with old stock still usable | The date moves as stock and demand change
```

Date effectivity is simple and suits changes that must happen by a deadline, such as a safety fix, where old stock should be scrapped or reworked. Unit effectivity suits customers who need to know which units have the change, which is common in regulated industries. Use-up effectivity suits changes like the sealed bearing, where the old item is still good for standard modules and scrapping it would waste money for nothing.

## What a change touches

A BOM change touches more than the BOM. Before setting its effectivity, the change should be checked against everything the old item is part of.

```figure
type: checklist
title: What to check before setting a BOM change's effectivity
caption: This is an illustration for the sealed bearing change. Each line can strand stock or build the wrong thing if missed.
- Where-used | Every BOM that contains the old item, including spares kits
- Stock of the old item | Loose bearings and bearings inside finished rollers
- Open purchase orders | Old bearings already ordered or in transit
- Work in progress | Rollers on the bench with old bearings
- Drawings and CAD properties | Roller drawing, model and its property values
- Cost roll-up | New bearing's price in the roller and every product above it
- x Setting the date before checking orders | Strands what arrives after it
- ? Spares for modules in service | Customers may still need the old bearing
```

## The error: 180 bearings stranded

This is an illustration. The engineer making the change set date effectivity for the sealed bearing from the start of week 3, so that the next batch, seven modules due to start that week, would have sealed bearings throughout. The store held 60 loose open bearings. A purchase order for 120 more open bearings, raised before the change, arrived in week 2.

From week 3 the planning system saw no demand for open bearings at all. It raised an urgent order for 88 sealed bearings, for the 44 rollers the batch needed beyond the 40 finished rollers in stock, and left **180** open bearings, A$1,170 at A$6.50 each, with no demand. The 40 finished rollers, built with open bearings, would also have been stranded, had the planner not noticed that the batch's rollers were coming from two sources.

The fix had two parts. The 120 bearings from the open order were returned to the supplier, who charged a 15% restocking fee, A$117 in this illustration. The change was reset to use-up effectivity at module level, so that open-bearing rollers went into standard modules first and sealed rollers began when they ran out. Checking open orders before setting the date, the third line of the checklist above, would have caught it before the order arrived.

## Calculating a use-up switch

A use-up switch is a calculation, not a guess. It needs the old item's stock, at every level it exists, the open orders that will be accepted, and the demand in sequence.

This is an illustration, after the 120 bearings were returned. The store held 60 loose open bearings and 40 finished rollers with open bearings. The 60 loose bearings make 60 ÷ 2 = 30 more rollers, so there are 40 + 30 = **70** open-bearing rollers available. The next batch is seven modules of 12 rollers. The business decided that each module would have rollers of one type, so that a module sold as sealed has only sealed rollers. Seventy rollers fill floor(70 ÷ 12) = **5** modules, using 60, and leave **10** open-bearing rollers. The other two modules need 2 × 12 = 24 sealed rollers, so **48** sealed bearings.

```figure
type: steps
title: The use-up switch for the sealed bearing, batch of seven modules
caption: This is an illustration. The switch is set at module level, so no module has rollers of both kinds.
- Count old stock at every level | 40 finished rollers and 60 loose bearings
- Convert to the level of the switch | 40 + 60 ÷ 2 = 70 open-bearing rollers
- Fill whole modules | floor(70 ÷ 12) = 5 modules, 60 rollers
- *Switch at module 6 | Modules 6 and 7 take 24 sealed rollers, 48 sealed bearings
- Decide the remainder | 10 open-bearing rollers kept as service spares
```

The 10 left over became service spares for modules already in the field, which use the open bearing and will need replacements. That turned the remainder from waste into stock with a purpose, and the spares kit's BOM, found by the where-used check, kept the open bearing deliberately.

## The cost of the change

The sealed bearing costs A$7.90 against the open bearing's A$6.50 in this illustration, ex GST, so each module's cost rises by 24 × A$1.40 = **A$33.60**. The cost roll-up of Chapter 8 should be rerun with the change, and the rise should reach the quoting team before the first quotation that includes sealed modules. If sealed bearings become an option for food-grade modules only, as Chapter 7's option groups would allow, the cost rise applies only to those modules, and the standard modules keep the open bearing and its cost.

## Revisions in the BOM

A BOM line should refer to an item, not to an item at a revision, unless the revision matters for building. If every BOM line named the revision of its child, every drawing revision of a part would need a new revision of every parent above it, and a change to one bearing would ripple up through the roller, the module and every product that uses the module.

The usual practice is to keep revisions on items and drawings, and to change a BOM only when its contents change: a child added, removed, replaced by another item, or its quantity changed. The sealed bearing changes the roller's BOM, because the roller now contains a different item. A clarified note on the bearing's drawing does not change the roller's BOM at all.

## Effectivity across levels

A change made deep in a BOM takes effect at the level where its stock is converted. The sealed bearing is effective in the roller's BOM: rollers made after the switch take sealed bearings. But the module does not care about bearings directly; it takes rollers, and finished rollers of revision A remain in stock after the switch. So the module's effective change happens later than the roller's, when revision A rollers run out, unless the change says that the module must take only revision B rollers from a stated point.

This is why the use-up calculation above counted stock at two levels, loose bearings and finished rollers, and converted both to rollers before filling modules. A switch calculated only from loose bearings would have found 60 ÷ 2 = 30 open-bearing rollers, enough for two modules, and put sealed rollers into module 3, leaving the 40 finished open-bearing rollers with no module planned to take them. Effectivity should be set at the level where the customer sees the difference, and stock below that level counted up to it.

## The record of a change

Each change should leave a record that answers the three questions at the start of the chapter: what changed, from when, and what happened to the old stock and orders. For the sealed bearing, the record names the new part number, the roller's revision B, the use-up effectivity at module 6 of the batch, the return of 120 bearings to the supplier, and the 10 open-bearing rollers kept as service spares.

The record should be findable from the item. A year later, someone asking why the store has open-bearing rollers on a spares shelf, or why the roller's revision B appeared in the middle of a batch, should be able to find the answer from the roller's own history, not from someone's memory of the week it happened.

## Changes that come from CAD

Many BOM changes start as design changes in CAD: a part replaced in an assembly, a quantity changed in a pattern. The CAD model changes the day the designer saves it, but the BOM should change on the effectivity the change sets, not on the day of the save. A BOM imported from CAD every night, as Chapter 10 will describe, must not overwrite the business system's BOM with a change whose effectivity has not arrived. The PC-600's business imports CAD BOMs into a pending revision, which takes effect only when the change is released with its effectivity.

## The steps of a change

Most businesses run changes through a short sequence, with a person responsible for each step. The names vary, change request and change order being common; the steps matter more than the names.

```figure
type: timeline
title: The sealed bearing change, from request to close
caption: This is an illustration. The weeks are counted from the request; the use-up switch, not a date, decided when sealed rollers began.
- Week 0 | Request: customers ask for sealed bearings on wet sites
- Week 1 | Review: where-used, stock, open orders, cost and spares checked
- Week 2 | Approval: new part number, roller revision B, use-up effectivity
- Week 3 | Release: BOM, drawing and CAD property updated; pending revision set
- * Week 4 | Effective: module 6 of the batch, the first with sealed rollers
- Week 6 | Close: record completed; spares kit and cost roll-up confirmed
```

Separating approval from release matters. Approval decides what will change; release makes the change visible to planning and the workshop with its effectivity. A change approved and released on the same afternoon, by the same person, is the change most likely to skip the review that would have found the open order.

## Work in progress

Parts already on the bench when a change takes effect need a decision of their own. In this illustration, six rollers had been pressed with open bearings when the change was approved and were waiting for their end caps. They were finished as revision A, counted with the finished stock, and went into the standard modules with the rest. The alternative, pressing the bearings out and fitting sealed ones, would have damaged the open bearings for no gain, since standard modules can use them. A change that must reach work in progress, such as a safety fix, says so explicitly, and the record lists what was reworked.

## Measuring how changes go

A business that wants its changes to go well can measure two things: how many it makes, and how long they take from request to effect. This is an illustration. The PC-600's business made 34 BOM changes last year. Their median time from request to effectivity was 11 days, and four of them stranded stock, the sealed bearing among them. Stranded stock is the clearest measure of a change process that is not checking what it touches, and the business reviews each case to find which line of the checklist was skipped. In three of the four, it was open orders.

## Exercise: mixing rollers in a module

Suppose the business allowed rollers of both kinds within a module, provided the module is sold as standard. With the same 70 open-bearing rollers and a batch of seven modules, how many sealed rollers and sealed bearings would the batch need, and how many open-bearing rollers would be left? What does that choice give up?

**Worked answer.** The batch needs 7 × 12 = 84 rollers. With 70 open-bearing rollers used first, the batch needs 84 − 70 = **14** sealed rollers, so **28** sealed bearings, and no open-bearing rollers are left.

The choice saves 20 sealed bearings against the per-module switch's 48, worth 20 × A$7.90 = A$158 in this illustration, and it uses up all the old stock. It gives up two things. One module would have rollers of both kinds, which is acceptable for a standard module but cannot be sold as sealed. And it leaves no open-bearing rollers as service spares, so spares for modules in the field would have to be built from sealed bearings, which work as replacements but cost more. Neither answer is wrong. The point is that each choice has numbers that can be calculated before the batch starts, and the change record should say which was chosen and why.
