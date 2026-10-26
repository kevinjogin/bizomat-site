---
book: bills-of-materials-by-the-numbers
chapterSlug: boms-from-cad-and-keeping-them-right
order: 10
title: "BOMs from CAD, and keeping them right"
description: "Turn a CAD assembly into the BOM the business builds from: map what CAD cannot know, import without overwriting decisions, and audit accuracy with two measures that mean different things."
draft: false
---

Most products' bills of materials begin in CAD. The assembly model already knows which parts are in each sub-assembly and how many, and a CAD BOM table can list them. Re-typing that structure into the business system is slow and error-prone, so businesses export it, by a built-in tool, a PDM workflow or a script of the kind *CAD Automation That Pays* describes. The export is the start of the BOM, not the whole of it. CAD knows the design; it does not know about phantoms, kits, cutting allowances, consumables, routings or effectivity, and an import that pretends it does will undo the decisions the earlier chapters made.

This chapter covers the path from CAD to a BOM the business can build from. It sets out what CAD knows and what it cannot, how properties carry the business's decisions into the export, how to import without overwriting them, and how to measure a BOM's accuracy once it is in use. The running case imports the PC-600 and finds 36 bolts counted twice, and the chapter ends with the book's checks gathered in one place.

## The design BOM and the build BOM

The BOM that comes from the CAD assembly is often called the **engineering BOM**: the product as designed, grouped the way the designer modelled it. The BOM the business plans and builds from is the **manufacturing BOM**: the product as made, grouped by how it is built, stocked and bought. They share most of their parts and differ in structure and in what they include.

```figure
type: compare
title: What the CAD assembly knows, and what the manufacturing BOM adds
cols: In the CAD assembly | Added for the manufacturing BOM
caption: This is an illustration for the PC-600. The left column comes from the model; the right from the decisions of Chapters 4 to 9.
- Structure | Sub-assemblies as modelled | Phantoms, stocked kits, bought sub-assemblies
- Quantities | Instance counts | Using units, cutting allowances, scrap rates
- Materials | Bodies with a material property | Raw material items: tube, section, sheet
- Consumables | Usually not modelled | Paint, adhesive, weld wire, with their basis
- Variants | Configurations | Option groups and rules
- *Time | The model as saved | Revisions and effectivity
```

## What the CAD assembly cannot know

A CAD assembly is a geometric model. Some of what a manufacturing BOM needs is not geometry at all:

- **Raw material**: the roller's tube is modelled as a part, IR-631, with a length. The manufacturing BOM needs the tube as a raw material item, 545 mm consumed per piece from Chapter 5, under IR-631.
- **Consumables**: the frame's paint is not modelled; its 0.26 L per frame comes from the painted area and a coverage figure, as Chapter 4 calculated.
- **Make, buy and phantom**: whether DS-621 is made or bought, or whether the belt kit is a phantom, is a manufacturing decision of Chapter 6.
- **Kits**: KT-650 groups 36 bolts, 72 washers and 36 nuts that the CAD assembly shows as individual fastener components.

## Properties carry the decisions

The way to get these decisions into the export is to record them where the export can read them: as custom properties on the CAD models, as *CAD Automation That Pays* sets out. The PC-600's business uses a small set:

- **Source**: made, bought or phantom, on every sub-assembly;
- **Kit**: the kit item, if any, that a fastener belongs to, such as KT-650;
- **Raw material** and **cut length**: on each part cut from stock, naming the raw material item and the length the cut plan uses;
- **BOM exclude**: on reference components, such as a customer's pallet modelled for clearance, that must never become demand.

The export reads the properties and builds the manufacturing structure from them. Decisions made in the model then travel with it, and a reimport does not reset them.

## Where the structures differ

The designer groups parts by function; the workshop groups them by when they are fitted. Sometimes the two disagree. This is an illustration. The PC-600's designer modelled each side guide as a small assembly: the folded guide GD-640 and its two mounting brackets. In the workshop, the brackets are welded to the frame before painting, and the guides are bolted to them at final assembly. The CAD structure puts the brackets under the guide; the manufacturing BOM needs them under the frame, because the frame's works order is where they are consumed.

There are two ways to handle it. The designer can restructure the model to match the build, which is clean but makes the model less convenient to design in. Or the export can move components according to a property, here a **Build parent** property on each bracket naming FR-610, so that the manufacturing BOM places the brackets under the frame whatever the model's grouping. The PC-600's business uses the property, sparingly, because every moved component is a place where the CAD view and the build view differ, and the comparison step must know to expect it. Four brackets per module, moved from the guides to the frame, are listed in the export's rules, and nothing else is moved.

## Quantities CAD counts badly

Instance counts are what CAD does best: twelve rollers, two guides, 44 bolts. Some quantities it does not count at all, or counts in the wrong unit. The belt is modelled as a single body; its quantity in the manufacturing BOM is 4.2 m, which comes from a **Cut length** property on the belt's model, not from counting one belt. The frame's section is modelled as weldment members whose lengths CAD knows, but the manufacturing BOM needs the bars of the cut plan, which no model contains.

The rule the business follows is that the export takes instance counts from the model and every other quantity from a property with a stated unit, as Chapter 4 required. A quantity that the export cannot find, such as a belt with no cut length, stops the import, rather than coming in as 1 with no unit, which the planning system would read as one metre or one roll depending on the item.

## When to export

An export can run on every save, nightly or on release. On every save is too often: the business system would see half-finished designs. Nightly is common in businesses whose PDM system handles the import, and it suits them provided the import goes to a pending revision, as above. The PC-600's business exports on release: when a drawing and its model are released through the change process of Chapter 9, the export runs and produces its list of differences for the change's reviewer. The BOM then changes on the same event as the drawing, which keeps the two in step.

```figure
type: steps
title: From CAD assembly to manufacturing BOM for the PC-600
caption: This is an illustration. Each step reads model properties; nothing is set by hand after the import.
- Walk the assembly | Every component, with its quantity and properties
- Drop excluded components | Reference models with BOM exclude set
- Group kit members | 36 bolts, 72 washers and 36 nuts become 1 × KT-650
- Add raw material | Tube, section and sheet under the parts cut from them
- Mark sources | Made, bought or phantom from the Source property
- *Import as pending | Released only with the change's effectivity
```

## The error: 36 bolts counted twice

This is an illustration. The first export of the PC-600 ran before the Kit property had been set on the CAD fasteners. The export brought in the 36 M10 bolts, 72 washers and 36 nuts as loose lines under the module. The business system's BOM already held KT-650, entered by hand when the kit was created in Chapter 6, and the import added the loose lines without removing the kit.

The planning system's requirement for M10 bolts became 36 through the kit, 36 loose and 8 in the drive unit: **80** per module. The parts-only check of Chapter 3 caught it before any order was raised: the CAD assembly counted 44 M10 bolts, the planning system 80. The ratio was not a neat multiple this time, but the difference, exactly 36, matched the kit's bolt count, which pointed straight at it.

The fix was to set the Kit property on every fastener in the assembly and to make the export group kit members, so that the CAD model and the kit say the same thing. The business also stopped entering kits by hand in the business system: a kit now exists because the model's properties say so, and the export creates it.

## Import without overwriting

An import from CAD must not overwrite what the business system holds for good reason. The main rules the PC-600's business follows are:

- **Import into a pending revision**, released only with the change's effectivity, as Chapter 9 required.
- **Compare before release**: the import produces a list of differences against the current BOM, lines added, removed and changed in quantity, and someone reviews it.
- **Never import routings, prices or stock**: those belong to the business system and are not in the model.
- **Refuse unknown items**: a component whose part number does not exist in the business system stops the import, rather than creating an item without its units, costs and source.

The comparison step is where most errors are caught. An import for a small design change should produce a short list of differences. A long list for a small change means the export and the business system disagree about something structural, and the list shows what.

## Measuring BOM accuracy

Once BOMs are in use, their accuracy can be measured, and should be, because errors that nobody measures are found by the workshop, one batch at a time. The usual method is an audit: take a sample of BOMs, check every line against the product as built and the current design, and count the errors.

Two measures come from the same audit, and they mean different things.

- **Line accuracy** is the fraction of lines with no error. It shows how much of the data is right.
- **BOM accuracy** is the fraction of BOMs with no error at all. It shows how often a build can trust its BOM completely, which is what the workshop cares about.

This is an illustration. The business audited 20 of its BOMs, a total of 412 lines, and found 9 errors on 9 lines, spread across 6 BOMs. Line accuracy was 403 ÷ 412 = **97.8%**; BOM accuracy was 14 ÷ 20 = **70%**. The line figure sounds good; the BOM figure says that three builds in ten would find something wrong.

```figure
type: bars
title: Errors found in an audit of 20 BOMs, by type
unit: errors
max: 5
caption: This is an illustration. Nine errors in 412 lines: 97.8% line accuracy, but 6 of 20 BOMs had at least one.
- Wrong quantity | 4
- Wrong revision | 2
- Missing line | 2
- Extra line | 1
```

The business sets its own targets, because what is acceptable depends on what an error costs. For a product where a missing line stops a build for three days, BOM accuracy is the measure to manage. The types of error matter as much as their count: four wrong quantities suggest a problem with how quantities are entered or imported, and the audit should find which.

## Running an audit

An audit needs a method that can be repeated, so that one quarter's figure can be compared with the next:

- **Choose the sample deliberately**: include BOMs built recently, BOMs changed recently and BOMs that have never been audited.
- **Check against two references**: the CAD model and the product as built, since a BOM can match one and not the other.
- **Classify each error** by type and by cause, so that the fixes address causes.
- **Fix the BOMs and the causes**: correcting the 9 lines fixes those BOMs; finding why the quantities were wrong fixes the next ones.

Sample size is a practical choice. This is an illustration. The business holds about 600 BOMs. At 20 a quarter, auditing all of them would take 600 ÷ 80 = **7.5 years**. But only about 120 of them are built in a typical year, and auditing those first brings every active BOM round in 120 ÷ 80 = **1.5 years**. The inactive BOMs are checked when they next come into use, which is when an error in them would first cost anything.

## The book's checks in one place

Every chapter has ended its error case with a check that would have caught it. Together they make a short routine for any BOM.

```figure
type: checklist
title: Checks for a bill of materials
caption: This is an illustration that gathers the checks from each chapter of this book. Most take minutes and catch errors that cost days.
- Purpose | Each view of the BOM serves a stated use: buy, build, cost, service
- Structure | Where-used and low-level codes agree; no level exists without a reason
- Quantities | Parts-only count matches CAD; items that should match do
- Units | Every line in using units; orders compared with history
- Allowances | Cut materials by pieces per stock length; scrap applied once
- Sources | Made, bought, phantom and free-issue checked against suppliers' quotations
- Options | Every combination configured and checked against its rules
- Costs | Labour equals routing hours; a hand calculation agrees within a cent or two
- Changes | Open orders and stock at every level checked before effectivity is set
- x Accepting an import without its list of differences | The most common route for a structural error
```

None of these checks needs special software. Each compares two numbers that should agree, a count from CAD and a requirement from planning, routing hours and labour cost, stock at every level and the effectivity's switch point, and asks why when they do not. That habit, more than any system, is what keeps a bill of materials right over the years a product is made, through every change, supplier and option it collects along the way.

## Exercise: the next audit

A quarter after the first audit, the business audits another 20 BOMs, 430 lines, and finds 5 errors, in 4 BOMs. What are the line accuracy and BOM accuracy? What would it mean if line accuracy had improved but BOM accuracy had not?

**Worked answer.** Line accuracy is (430 − 5) ÷ 430 = 425 ÷ 430 = **98.8%**, up from 97.8%. BOM accuracy is (20 − 4) ÷ 20 = 16 ÷ 20 = **80%**, up from 70%.

Had line accuracy improved and BOM accuracy not, the errors would have become fewer but stayed spread across as many BOMs, so the same share of builds would still meet one. That pattern suggests the fixes reached the most error-prone BOMs but not the cause shared by the rest, often a single import rule or entry habit. The audit's classification of error types and causes is where to look next, and the two measures together say more than either does alone.
