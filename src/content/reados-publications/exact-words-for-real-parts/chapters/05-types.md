---
book: exact-words-for-real-parts
chapterSlug: lists-that-contain-themselves
order: 5
title: "Lists that contain themselves: classes, types and loops in bills of materials and registers"
description: "Use Russell's paradox and theory of types to keep items, collections, documents and registers at separate levels, and to find and remove a loop in a bill of materials."
draft: true
---

The workshop agrees to remake the 30 brackets from the second set-up. The customer asks for them as kits: each bracket bagged with its four screws, four washers and a printed inspection sheet, ready for the fitter. The planner sets up a kit in the business system, releases a works order for 30 kits, and goes home.

The next morning the material requirement shows 300 bracket blanks, 1,200 screws and 112 kg of aluminium plate. The order was for 30. Nobody typed 300. The system produced it by following a list that, through one step, contained itself. This chapter uses Russell's most famous discovery to explain how that happens, and his theory of types to stop it happening again.

## Russell's paradox

In 1901, while writing *The Principles of Mathematics*, Russell found a contradiction at the base of the logic he and Gottlob Frege were using to found mathematics. The logic allowed any condition to define a class: the class of all things that satisfy it. Most classes are not members of themselves. The class of brackets is not a bracket. A few seem to be: the class of all things that are not brackets is itself not a bracket, so it is a member of itself.

Now consider the class of all classes that are not members of themselves. Is it a member of itself? If it is, then by its own definition it is not. If it is not, then by its own definition it is. Either answer contradicts itself. Russell wrote to Frege about the problem in June 1902, as the second volume of Frege's major work was in press, and Frege added an appendix acknowledging that his system was in trouble.

The problem is not a word game. It showed that a perfectly natural rule, "any condition defines a collection", produces contradictions when collections are allowed to include or exclude themselves. Russell spent most of the next decade working on a remedy.

## The vicious-circle principle and types

Russell's diagnosis, set out fully in a 1908 paper on the theory of types, was that the paradoxes all involve a vicious circle: a collection is defined in terms of all the members of some totality, and then treated as one of those members. His remedy was to forbid this. Whatever is defined by reference to all of a collection must not itself be a member of that collection.

The theory of types turns the principle into a structure. Individuals are at the lowest type. Classes of individuals are one type higher. Classes of classes of individuals are higher again, and so on. A class may only contain members of the type below it. The question "is this class a member of itself?" cannot even be asked, because a class and its members are of different types. The paradox does not get answered; it gets ruled out as badly formed.

Later logicians found other remedies, and Russell's full theory was complicated by refinements that most mathematicians did not adopt. But the core idea, that things should be sorted into levels and that a collection may only contain things from lower levels, has proved durable. It underlies type systems in programming languages and, without the name, the structure of any well-run bill of materials or document system.

```figure
type: layers
title: Four types for engineering information
caption: A list at one level may contain or refer to things at lower levels only. The rule is the engineering form of Russell's hierarchy.
- Type 3: registers | a document register, a nonconformance register, a list of approved procedures
- Type 2: documents | a drawing, an inspection record, a packing list: each describes things of lower type
- Type 1: collections | a kit, a bill of materials, a batch of 30 brackets
- Type 0: physical items | one bracket, one screw, one printed sheet of paper
```

## How the kit looped

This is an illustration. The planner set up kit BK-12 in the business system with four components:

| Component | Description | Quantity per kit |
| --- | --- | --- |
| CB-12 | Bracket, machined | 1 |
| SCR-M6x16 | Screw, M6 × 16 | 4 |
| WSH-M6 | Washer, M6 | 4 |
| DP-12 | Document pack | 1 |

So far, so good: a type-1 collection of type-0 items. The trouble came from DP-12. A colleague had set up DP-12 a week earlier as the kit's packing list, and to make the packing list print automatically, gave it a bill of materials of its own: the kit it describes, BK-12, quantity 1. The intention was that DP-12 would list what goes in the box. The system read it as an instruction that every document pack contains a kit.

```figure
type: tree
title: The kit's structure as the business system saw it
caption: This is an illustration. Each kit contains a document pack, and each document pack contains a kit. The system's explosion stopped only at its 20-level limit.
- BK-12 kit, 30 ordered | type 1
  - CB-12 bracket, 1 per kit | type 0
  - SCR-M6x16 screw, 4 per kit | type 0
  - WSH-M6 washer, 4 per kit | type 0
  - * DP-12 document pack, 1 per kit | treated as an item, but defined as a list of the kit
    - * BK-12 kit, 1 per pack | the same kit again, and so on
```

The system exploded the bill level by level, multiplying quantities as it went. At each pass through DP-12 it found another BK-12, and each BK-12 called for another bracket, four screws, four washers and another document pack. The system was set to stop exploding at 20 levels, a safeguard against runaway data that in this case was itself the cause of the wrong answer. The kit appears at every second level, so the explosion passed through it ten times before stopping.

```figure
type: stats
title: What the looping bill asked for, against what was needed
caption: This is an illustration. The blank is 125 × 85 × 13 mm of 6061 plate at 2.70 g/cm³, about 0.373 kg. The loop multiplied every requirement by ten.
- 30 | kits ordered | the real requirement
- *300 | bracket blanks planned | 10 passes through the kit × 30
- 1,200 | screws and 1,200 washers planned | against 120 of each needed
- 111.9 kg | plate requirement | against 11.2 kg for 30 blanks
```

The planner caught it because 112 kg of plate for a 30-bracket job was obviously wrong. A smaller loop, or a cheaper component, might not have stood out. Several hundred washers more than needed would have been bought and shelved without anyone asking why.

## What went wrong, in Russell's terms

The fault was a confusion between two things that share a name. One is the printed packing sheet that goes in the bag: a piece of paper, a type-0 item, rightly a component of the kit. The other is the packing list as a document: a description of the kit, a type-2 object, which refers to the kit's components. The colleague who set up DP-12 needed the second and created it as the first, then gave it the content of the second. The result was a type-0 item that contained the type-1 collection it was part of. That is exactly the self-membership Russell's hierarchy forbids.

The distinction between a thing and a description of it runs through all engineering information. A drawing is a document about a part; a printed copy of the drawing is a physical item. A bill of materials is a collection of items; the BOM report is a document describing it. A register lists documents; a printout of the register is an item. Keeping each at its own type is what stops lists from looping.

```figure
type: compare
title: The packing list as an item and as a document
cols: As a printed item | As a document
caption: Both are legitimate. The loop came from creating one record that tried to be both.
- Type | 0: a sheet of paper | 2: a description of a kit
- Belongs in | the kit's bill of materials, quantity 1 | the document register, linked to the kit
- Refers to | nothing; it is printed | the kit's components, by part number
- * In the faulty record | given a bill of materials containing the kit | stored as a component of the kit it describes
```

## Finding loops before they run

A business system that allows any item to have any components cannot prevent loops by itself. They have to be found. The standard method is a depth-first walk of the bill of materials that remembers which items are on the current path.

```figure
type: steps
title: Finding a loop in a bill of materials
caption: The walk marks each item as in progress when it starts and as finished when all its components are done. Meeting an item that is still in progress means the path has come back to itself.
- Start at the top item | mark it in progress
- Visit each component in turn | if it is finished, skip it; if it is new, mark it in progress and go down
- * Meet an item already in progress | stop: the path from that item to here is a loop
- Finish an item | when all its components are finished, mark it finished and go back up
- Report the loop | list the items on the path, for example BK-12, DP-12, BK-12
```

Applied to BK-12, the walk goes down to CB-12, the screw and the washer, finishing each, then to DP-12, then to its single component BK-12, which is still marked in progress. The loop is BK-12 to DP-12 to BK-12, reported before a single blank is planned. Many business systems include a check of this kind. It is worth confirming that it is switched on, and that it runs when a bill is changed, not only when it is first created.

For a wider treatment of levels, parents and where-used reports in bills of materials, see [levels, parents and where-used](/reados/publications/bills-of-materials-by-the-numbers/levels-parents-and-where-used/) in *Bills of Materials by the Numbers*.

## Failure: a register that listed itself

The type rule applies just as much to documents. While the remake was being organised, the quality lead set up a register of all records for the CB-12 investigation, with a rule that every record about the investigation must be listed in it. The register was itself a record about the investigation. Should it list itself?

There is nothing contradictory in a register listing itself: it can include a line "this register, CB-12-INV-REG". The harm came from a second rule the quality lead added, intended to catch records that had been forgotten: the register must list every investigation record that does not appear in any other register. The register does not appear in any other register, so it must list itself; once it lists itself, it appears in a register, but only its own. Whether it should be listed now depends on whether it is listed, and the team spent a meeting arguing about it.

That is a small version of Russell's paradox, and the cure is his. The register is a type-3 object. Its membership rule should be stated over type-2 records only, and the register itself is recorded where type-3 objects are recorded: in the workshop's document register. Rewritten as "this register lists every type-2 record about the CB-12 investigation; it is itself listed in the document register", the rule has no circle and the meeting would have been short.

## Self-reference that is harmless

Russell's principle does not forbid every self-reference, and a practical reading should not. A drawing can carry its own number in its title block. A procedure can include a clause saying how the procedure itself is revised. A bill of materials report can print its own report date. None of these involves a collection defined over a totality that includes the collection.

The test for the vicious kind is whether a list's contents, or a quantity, depend on the list itself. A kit whose components include the kit fails. A register whose membership rule depends on its own membership fails. A drawing that mentions its own number passes. When in doubt, the type hierarchy settles it: if a thing would have to be a member of something at its own level or lower, the structure is wrong.

## Putting the types into the system

A hierarchy that lives only in people's heads will be broken the next time someone is in a hurry. The workshop wrote it into its business system with four controls, each cheap to set up.

1. Every item record carries a type field: physical item, collection, document or register. The field is mandatory when a record is created.
2. A bill of materials may only contain physical items and collections. The system refuses a document or register as a component. A printed copy that ships in a box is set up as a physical item with its own number, such as DP-12-PRINT, and no components.
3. Documents are linked to the items they describe through a separate document link, not through the bill of materials. The packing list DP-12 is linked to BK-12 as "describes", which the explosion does not follow.
4. Every change to a bill of materials runs the loop check before it is saved, and the planner's material report shows the total mass of raw material against the previous order of the same kit, so that a tenfold jump stands out.

The fourth control is not a type rule at all. It is a sanity check on the outcome, the same idea as probing the fixture after clocking it in Chapter 2. Type rules prevent the known kind of error; outcome checks catch the kinds nobody anticipated.

This is an illustration. With DP-12-PRINT as a component and DP-12 as a linked document, the 30 kits explode to 30 brackets, 120 screws, 120 washers and 30 printed sheets, and the plate requirement returns to 11.2 kg. The loop check now rejects any attempt to give a printed item components, and the mass comparison would have flagged the earlier error the moment the works order was released.

## Exercise: find and remove the loop

The customer's own system holds the camera module CM-40 with these parent and child records:

| Parent | Child | Quantity |
| --- | --- | --- |
| LINE-6 | CM-40 | 6 |
| CM-40 | BK-12 | 1 |
| CM-40 | CAM-HD | 1 |
| BK-12 | CB-12 | 1 |
| BK-12 | SCR-M6x16 | 4 |
| CAM-HD | CAL-SHEET | 1 |
| CAL-SHEET | CM-40 | 1 |

Walk the bill from LINE-6, find the loop, say which record breaks the type rule, and give the bracket requirement for ten lines once the loop is removed.

**Worked answer.** From LINE-6 the walk goes to CM-40 (in progress), then BK-12, CB-12 and SCR-M6x16 (all finished), then CAM-HD (in progress) and CAL-SHEET (in progress). CAL-SHEET's child is CM-40, which is still in progress, so the loop is CM-40, CAM-HD, CAL-SHEET, CM-40. The faulty record is CAL-SHEET → CM-40: the calibration sheet is a document about the camera module, a type-2 object, but it has been given the module as a component. If the sheet is a printed item shipped with the camera, it belongs as a child of CAM-HD with no children of its own; if it is a document, it belongs in the document register, linked to CM-40. With the record removed, each line needs 6 modules, each module needs 1 kit and each kit needs 1 bracket, so ten lines need 10 × 6 × 1 × 1 = 60 brackets and 240 screws. That matches the original order, which is a useful check that nothing else in the structure is multiplying quantities.
