---
book: cad-standards-that-stick
chapterSlug: standard-part-libraries-people-trust
order: 6
title: "Standard-part libraries people trust"
description: "Consolidate scattered fasteners and purchased parts into one controlled library, name items by their standard designation, run a request process and keep duplicates from returning."
draft: false
---

A designer who cannot find a standard part quickly will model a new one. The new part takes ten minutes, works perfectly in the assembly and quietly adds one more version of an M8 screw to the office's files. Repeat that across six people and several years, and the office has hundreds of near-identical screws, washers and bearings, some modelled correctly, some not, all appearing in bills of materials under slightly different descriptions.

A trusted library stops this by being faster to use than modelling from scratch and more reliable than a colleague's copy. This chapter consolidates the running case office's scattered standard parts into one controlled library, sets naming and metadata rules, introduces a request process and measures the result. Its error case is two screws that looked the same in the model and were different on the shelf.

## What belongs in the library

A standard-part library holds items that are defined outside the office and used repeatedly: fasteners, washers, pins, keys, circlips, bearings, seals, and purchased components such as motors, gearboxes, belt idlers and castors. It may also hold internal standard items that the office makes repeatedly to one design, such as a common mounting foot.

It does not hold project parts, even popular ones, because project parts change with the project. Mixing the two leads to a library item being edited for one project and silently changing in every other assembly that uses it.

Many CAD systems include a generator for standard fasteners, which creates parts on demand from a table of sizes. These generators are useful, but they need the same control as any other library: one shared location, consistent properties and an agreed list of which sizes and grades the office actually buys. A generator that lets each person create any size in any grade reproduces the duplication problem automatically.

## Audit what exists

Chapter 2's file inventory found standard-part files in 47 folders. The administrator, with help from the drafter, gathered every file that appeared to be a standard or purchased part into a staging folder for review. There were **3,860**.

The review looked for three kinds of duplicate:

- **Exact duplicates**: identical files with different names or locations, found by comparing file contents.
- **Equivalent duplicates**: different files representing the same item, found by comparing mass, bounding box dimensions and description, then confirmed by eye.
- **Variants**: files representing different items that people had treated as the same, such as a fully threaded screw and a partly threaded bolt of the same nominal size. These are not duplicates and must both survive, correctly named.

```figure
type: funnel
title: From scattered files to an active library
caption: This is an illustration. About 30% of the files were duplicates; a further 380 unique items had not been used in any assembly for five years.
- Standard-part files found in 47 folders | 3860
- Unique items after removing 1,140 duplicates | 2720
- *Active library items after retiring 380 unused | 2340
```

The arithmetic is **3,860 − 1,140 = 2,720** unique items, and **2,720 − 380 = 2,340** active items. The duplicates were **1,140 ÷ 3,860 ≈ 29.5%** of the files. The 380 unused items were not deleted; they were moved to a read-only archive, because old assemblies might still reference them.

The review took about 30 hours of the drafter's time and 10 of the administrator's, spread over two months. It was the largest single task in the first year, and the one with the most visible benefit.

## Name items by what they are

The old files had names such as "M8 bolt", "bolt_m8x25", "M8x25 HHB zinc" and "screw M8 25". Searching was slow because nobody could predict the name. The new library uses a fixed pattern: item type, standard designation, size, property class or grade, and finish.

For fasteners, the standard designation does real work. Hexagon head bolts that are only partly threaded and hexagon head screws that are threaded to the head are covered by different international product standards, ISO 4014 and ISO 4017 respectively, and they are not interchangeable in every joint. Naming by standard makes the difference visible.

```figure
type: compare
title: Old and new names for the same items
cols: Old file names found | New library name
caption: This is an illustration. The new pattern is type, standard, size, grade, finish; the standards are named for identification only.
- Fully threaded screw | bolt_m8x25, M8 bolt, screw M8 25 | HEX SCREW ISO 4017 M8x25 8.8 ZP
- Partly threaded bolt | M8x25 HHB zinc, M8 bolt (2) | HEX BOLT ISO 4014 M8x25 8.8 ZP
- Plain washer | washer M8, M8 flat washer | WASHER ISO 7089 M8 ZP
```

The same pattern feeds the Description property from Chapter 5, adjusted to stay within 40 characters. "HEX SCREW ISO 4017 M8x25 8.8 ZP" is 31 characters, so it fits. Where a name would exceed 40 characters, the standard abbreviation list in the written standard shortens it in a defined way rather than leaving each person to improvise.

## Organise the library so people can browse it

Searching by name works when a designer knows exactly what they want. Often they do not: they need "a bearing unit about this size" or "whatever castor we normally use". The library therefore needs a structure that can be browsed as well as searched.

The office used a shallow folder structure of two levels: a category, such as fasteners, bearings, drive components or castors, and within it a type, such as hexagon screws or flanged bearing units. Deeper structures were tried and abandoned, because people disagreed about where items belonged and the same item ended up filed twice. Two levels were enough to browse quickly and few enough that nobody had to guess.

Each type folder holds a short preferred-items note listing the sizes and grades the office normally buys. A designer who needs an M10 screw finds the screws folder, sees that the office stocks property class 8.8 zinc-plated screws in certain lengths, and picks one of those unless the design needs something else. Preferred lists reduce variety, which helps purchasing and stores as much as it helps the CAD office.

## Configured families or separate files

Many CAD systems allow one file to hold a family of sizes as configurations, driven by a table. A family file for hexagon screws might hold every length in a size, or every size in a standard. The alternative is one file per item.

Both approaches work, and the choice affects maintenance. A family file is easier to keep consistent, because a change to the shape or properties applies to every member at once. It can also be harder to manage when one size needs a correction, because the whole family must be revised and every assembly using any member is affected. One file per item isolates changes, but multiplies the number of files to name, describe and check.

The office chose family files for fasteners, where the shape is fixed by the standard and only dimensions vary, and separate files for purchased components such as motors and bearing units, where each item has its own datasheet, supplier and history. The choice is recorded in the written standard so that new items follow it. Whichever approach is used, Chapter 5's rule applies: anything that identifies an item, its part number and description, must differ for every size, whether the sizes live in one file or many.

## Carry purchasing data with purchased parts

A purchased component such as a geared motor is more than its geometry. The library item for it carries the schema properties from Chapter 5, with MakeBuy set to Buy and the Supplier and SupplierPartNo completed. It may also carry the manufacturer's own part number, which can differ from the supplier's when the same item is bought through a distributor.

Purchasing owns these values. The library process gives them a way to set them without editing CAD files: when a new purchased item is added, purchasing is sent the item's description and confirms or completes the supplier data before the item is released to the library. This keeps purchasing data where designers will find it, in the model, and keeps purchasing responsible for it.

Manufacturer models downloaded from the internet are a convenient starting point, but they need checking. They may carry the manufacturer's own property names, unusual units, excessive detail that slows assemblies, or geometry that does not match the variant actually ordered. The library process treats a downloaded model as raw material: it is checked against the datasheet, simplified where necessary and given the office's properties before release.

## Run a request process

A library that only the administrator can change will be bypassed unless requests are handled quickly. The office set a target of two working days from request to release for standard items and five days for purchased items needing supplier data.

```figure
type: steps
title: Adding an item to the library
caption: This is an illustration of the running case office's process. The drafter maintains the library; the administrator owns the rules.
- Request | designer searches first, then requests the item on the shared list with its standard or datasheet
- Check for duplicates | drafter searches by designation and by size before modelling
- Create | from the generator or datasheet, using the library template and naming pattern
- *Complete data | properties per the schema; purchasing confirms supplier data for bought items
- Release | saved to the read-only library folder; register updated; requester notified
```

The duplicate check at step 2 is the most important. It catches the case where an item exists under a name the requester did not think to search for, and it is where the naming pattern pays for itself.

During the first six months the office averaged about 25 requests a month. Most were completed within the target. Two that were not, both purchased items awaiting supplier confirmation, were released provisionally with a property flag that blocked them from release on a drawing until the data arrived.

## The error case: two screws that looked the same

Before the library work, the office's bill of materials for the 2,400 mm module listed "M8 x 25 HEX BOLT ZINC" twice, with different part numbers and quantities of 16 and 8. Purchasing assumed a duplication error in the BOM, combined the lines and ordered 24 of the cheaper item, which happened to be the fully threaded screw. Stores issued them for all 24 positions.

At 16 positions the full thread made no difference. At the other 8, where the designer had chosen a partly threaded bolt so that the plain shank would bear in a clamped bracket, the joint was not as designed. The difference was noticed by the assembly supervisor, who saw threads in the bracket bore during a routine check and queried it. No product had shipped. Eight screws were replaced with bolts and the brackets inspected.

The cause was a naming failure, not a modelling one. Both files had been modelled correctly. Both had been given a description that described only the size, because the person creating each one did not think of the other. Purchasing reasonably read identical descriptions as one item.

The correction followed the library process. Both items were renamed and described by standard designation, as in the comparison above, so that their descriptions now differ visibly. The BOM was regenerated. Purchasing's rule was changed so that two BOM lines with similar descriptions and different part numbers are queried with the designer rather than combined. And the written standard added a note on bolt and screw selection so that designers state the choice deliberately.

Whether the plain shank mattered in that joint was an engineering question, answered by the engineer. The CAD administrator's job was to make sure that a design decision, once made, survived the journey from model to shelf.

## Measure the library's effect

Chapter 1 estimated 92 hours a year lost to searching for or recreating standard parts. Six months after the library release, the administrator repeated the informal survey: six people estimated their weekly search time. The average fell from about 20 minutes to about 6. This is an illustration, and recollections are not measurements, so the administrator also counted something objective: new standard-part files created outside the library folder in the six months. There were 9, against an estimated 140 in the previous six months, judging by file dates in the old scattered folders.

```figure
type: bars
title: Standard-part files created outside the library, per six months
unit: files
max: 150
caption: This is an illustration. The earlier figure is estimated from file dates; the later figure is counted directly.
- Six months before the library | 140
- *Six months after the library | 9
```

The nine files were reviewed. Five were legitimate items that should have been requested, and were added to the library. Four were duplicates of existing items, and their authors were shown how to find them. That pattern, a few stray files each period, reviewed and absorbed, is what a healthy library looks like.

## Keep duplicates from returning

Libraries decay in predictable ways: someone saves a modified copy beside the original, a project folder accumulates local copies, or a generator creates an item outside the library location. Three habits keep this in check.

- Keep the library folder read-only for everyone except its maintainers, as with templates.
- Repeat the "files outside the library" count every quarter and review what it finds.
- Point the controlled search settings from Chapter 3 at the library first, so that a missing reference resolves to the library item rather than to a stray copy.

## Exercise: plan for growth

The active library holds 2,340 items. It gains about 25 items a month through requests, and about 5 a month are retired to the archive when products change. How large will it be in two years? If the drafter spends about 20 minutes per new item and the administrator reviews retirements at about 10 minutes each, what is the annual maintenance time?

**Answer.** Net growth is **25 − 5 = 20 items a month**. Over 24 months that is **480** items, so the library will hold about **2,340 + 480 = 2,820** items.

New items take **25 × 12 × 20 ÷ 60 = 100 hours a year** of the drafter's time. Retirements take **5 × 12 × 10 ÷ 60 = 10 hours a year** of the administrator's. At A$95 an hour the total of 110 hours costs about **A$10,450**, compared with the estimated A$8,740 a year previously lost to searching alone. The comparison shows that a library is not free to maintain. Its value lies as much in fewer errors, like the screw case, as in saved search time, and the request numbers should be watched: if requests stay at 25 a month, it is worth asking whether some are for items that a configured family could supply with less effort.
