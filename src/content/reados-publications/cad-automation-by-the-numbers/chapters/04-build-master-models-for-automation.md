---
book: cad-automation-by-the-numbers
chapterSlug: build-master-models-for-automation
order: 4
title: "Build master models for automation"
description: "Prepare master parts, assemblies and drawings that a program can drive safely: named references, driven parameters, stable options, deterministic file names and a flex test across the range."
draft: false
---

Automation drives models through their parameters and references, without a person watching each rebuild. A model that a designer can coax into shape by hand, fixing the odd failed feature as it appears, will fail silently or loudly when a program asks it for a size nobody tried. The quality of the master model therefore sets the ceiling on the quality of the automation built on it.

This chapter rebuilds the trestle range's master part, assembly and drawing for automation. It names everything the program will touch, drives the model from a small set of named parameters, handles options without fragile suppression, gives every generated file a deterministic name and proves the model with a flex test across the range. The failure case is a set of generated trestles that secretly shared one cross-member file, so that changing one changed them all.

## What a program needs from a model

A designer and a program use a model differently. The designer sees geometry and can tell when something looks wrong. The program sees a list of features, dimensions, faces and references, identified by names or internal numbers, and cannot see anything. To be driven safely, a model needs:

- **names for everything the program touches**: dimensions, features, planes, faces and edges used for holes, mates and drawing views;
- **a small set of driving parameters** from which every other dimension follows by relations, so that the program sets four or five values, not forty;
- **references that do not depend on generated geometry**, so that a fillet added on wide variants does not renumber the faces a hole was placed on;
- **options handled in a way the program can switch reliably**, such as the brace or the foot style;
- **predictable rebuilds** across the whole validated range, proved by test.

The failure case in Chapter 2, the macro that picked the wrong face, came from the absence of the first and third of these.

```figure
type: checklist
title: Master model review before automation
caption: This is an illustration of the office's review. The master is not handed to the programmer until every line is ticked or recorded as a known limitation.
- Every dimension, feature, plane and face the program uses has a meaningful name | checked against the generator's list of names
- Five driving parameters; every other size follows by relations that mirror the rule table | relations reviewed by the rule owner
- Sketches dimensioned to principal or named planes, not to edges of other features | no references to generated geometry
- Options built as interchangeable components with the same named references | brace and foot styles
- Master drawing dimensions attached to named geometry, notes anchored to the sheet | scales from a table
- ? Rebuild time per variant within the batch window | measured during the flex test
- x Suppression of features that other features depend on | replace with separate components
```

The review takes a designer and the rule owner about half a day for the trestle master. It is the cheapest point at which to find problems, because nothing yet depends on the model's internal structure. Once the generator and the regression set exist, every change to the master's names or structure has to be matched by a change to the code and the tests, so problems found later cost several times more to fix.

## Drive the model from named parameters

This is an illustration. The trestle master part is driven by five named parameters: belt width, height, foot style, bracing and the cross-member section, which the rules library sets from rule R3. Every other dimension in the model is a relation to these: the inside width is belt width plus 300 mm (rule R1), the leg length follows from the height less the foot-plate thickness and the cross-member depth, and so on.

The relations live in the model, where a designer can see and check them, and they mirror the rule table of Chapter 3. That duplication is deliberate but controlled. The rules library decides the values, and the model's relations apply them geometrically. A test in Chapter 7 confirms that the two agree for every boundary case.

Sketches are dimensioned to the model's principal planes and to named reference planes, never to edges of other features. A leg sketch dimensioned to the edge of the foot plate would move unpredictably when the foot plate changed for a different foot style. Dimensioned to a plane named "Floor", it does not.

## Handle options without fragile suppression

Options such as the brace and the foot style can be modelled in several ways. The simplest, suppressing and unsuppressing features, is also the most fragile: a suppressed feature that other features reference leaves those features without a parent, and the model fails in ways that depend on the order of operations.

The trestle master handles its options in two ways:

- **The brace** is a separate part, inserted into the assembly by the generator when rule R4 requires it, and mated to named planes on the legs and cross-member. The trestle frame part does not change with bracing at all.
- **The foot style** is chosen by swapping a foot component from the standard-part library: a bolt-down plate, a levelling foot or a cast-in anchor plate. Each foot is a library part with the same named mating references, so the generator swaps one for another without touching the frame.

Building options from separate, interchangeable components keeps each part simple and makes the generated assemblies easier to check, because the bill of materials states exactly which brace and which foot were used.

## Give generated files deterministic names

Every variant the configurator produces needs its own files, and those files need names. If the names are arbitrary or sequential, the same trestle requested twice produces two sets of files, and the office slowly accumulates duplicates.

The trestle configurator builds names from its inputs. A 1,200 mm belt, 1,500 mm high, bolt-down foot, braced trestle is **TR-1200-1500-BD-B**. Before generating, the configurator searches the vault for that name. If the variant exists and was generated under the current rule-table revision, it reuses it. If it exists under an older revision, it flags the variant for review. Only if it does not exist does it generate a new one.

```figure
type: tree
title: What one generated trestle consists of
caption: This is an illustration. Names are built from the inputs, so the same inputs always give the same names. Standard parts come from the library and are never copied.
- TR-1200-1500-BD-B assembly | generated, named from the inputs
  - TR-1200-1500-FR frame | generated part, driven from the master frame
  - TR-1200-XM100 cross-member | generated part, shared by every 1,200 mm trestle by design
  - TR-1500-BR brace | generated part, inserted because height > 900 mm
  - FT-BD-150 foot plate | library part, referenced, never copied
  - TR-1200-1500-BD-B drawing set | generated from the master drawing
```

The name structure also makes some sharing deliberate. Every 1,200 mm trestle uses the same cross-member regardless of height, so the cross-member is named from the belt width alone and generated once. That sharing is intended and recorded, unlike the accidental sharing in the failure case below. The general principles of part numbering, and the trade-off between intelligent and sequential numbers, are covered in [Part numbers and file names that last](/reados/publications/cad-data-you-can-trust/part-numbers-and-file-names/). The office kept its vault's sequential part numbers as the official identity and used the intelligent name as a searchable property.

## Prepare the master drawing

Drawings break under automation as easily as models. Dimensions attached to edges that change, views that crop differently at different sizes and notes positioned for one size all fail when the model grows or shrinks.

The trestle master drawing follows four rules:

1. Every dimension attaches to named geometry or to dimensions imported from the model, never to a picked edge of a generated feature.
2. View scales are set by the generator from the variant's overall size, from a short table of standard scales, so that a 1,500 mm trestle and a 400 mm one both fit the sheet.
3. Notes and tables are anchored to the sheet's border, not to views, so they do not move when a view grows.
4. The title block reads the part number, description, material, rule-table revision and generator version from the model's properties, which the generator sets.

Chapter 9 covers the drawings and cut lists the generator produces from this master.

## Prove it with a flex test

A master model is not ready for automation until it has been driven across its whole range and checked. The test is called a flex test: drive the model to each combination of extreme and boundary values, rebuild, and check for errors and for geometry that has gone wrong without an error.

This is an illustration. With 828 variants, testing every one by hand is impractical, but most problems appear at the edges. The office chose **24** combinations: the smallest and largest belt widths and the 900 mm boundary of rule R3; heights of 400 mm, 900 mm, 950 mm and 1,500 mm, covering both ends and the brace boundary; and both bracing states where they apply, with the foot styles rotated through them. The generator drove the master to each, rebuilt it and recorded rebuild errors, mass and bounding box.

```figure
type: bars
title: Flex-test failures in the first master model, 24 combinations
unit: failures
max: 4
caption: This is an illustration. Seven of 24 combinations failed in the first master; the rebuilt master passed all 24, with masses and bounding boxes matching hand calculations.
- Sketch dimensioned to a foot-plate edge | 3
- Hole pattern on a renumbered face | 2
- Fillet failing at the 400 mm height | 1
- Drawing view cropping the 1,500 mm trestle | 1
```

Seven of the 24 combinations failed. The causes were the familiar ones: a sketch dimensioned to an edge, a hole placed on a face whose internal number changed, a fillet that had no room at the smallest height and a drawing view that did not fit the tallest variant. Each was fixed by applying the principles above, and the rebuilt master passed all 24. The flex test became part of the regression set in Chapter 7. It runs again after every master-model change and every CAD upgrade.

The masses and bounding boxes were not just recorded. For four of the combinations, a designer calculated the expected mass by hand from the cut list and section weights, and the generated values agreed to within 1%. A model that rebuilds without error but has the wrong mass is more dangerous than one that fails, because it looks right.

## A failure case: one cross-member for everyone

This is an illustration. The first version of the generator created each trestle by copying the master assembly and its frame part to new names, then driving the copy. It did not copy the cross-member part, which the master assembly referenced from the master folder. Every generated trestle therefore referenced **the same cross-member file**, the master's.

For a month, nobody noticed, because the generator set the cross-member's size each time it built a trestle, and the drawings were produced immediately afterwards. Then a designer opened an older 600 mm trestle drawing to add a customer's revision note. The drawing showed a 100 × 50 cross-member, 1,500 mm long. The most recent generation had been a 1,200 mm trestle, which had resized the shared file, and every older drawing that referenced it now showed that size.

The detection came from a person reading an old drawing and seeing a cross-member far too long for the trestle. A where-used search on the cross-member file then showed it referenced by 41 generated assemblies. The corrections were:

1. The generator was changed to create or reuse a cross-member for each belt width under its own name, as shown in the tree above.
2. The 41 affected assemblies were regenerated from the generation log's recorded inputs, and their drawings were compared with the released PDFs, which had been produced at the time and were correct.
3. A check was added to the regression set: after generating two different variants, confirm that each references only its own generated parts and the library.

The released PDFs saved the office from a real fault, because the workshop builds from released PDFs, not live models. The safe practices for copying assemblies and checking references are covered in [References, where-used and safe copying](/reados/publications/cad-data-you-can-trust/references-where-used-and-safe-copying/).

## How this applies to a small Australian business

Most of the effort in a configurator project goes into the master model and its rules, not the code. A small office can do this work without any programming at all, and it pays back even without automation: a flex-tested master model with named parameters is faster to use by hand and produces fewer errors. If you are working with an outside developer, prepare the master model in-house with your own designers, because they understand the product and will maintain the model long after the developer has gone. The modelling rules that make a model robust to change are covered in [Modelling rules that survive change](/reados/publications/cad-standards-that-stick/modelling-rules-that-survive-change/).

## Exercise: choosing the flex-test set

The office plans to add a seventh belt width of 1,400 mm, with the validated height range unchanged. Rule R3 will give it a new 125 × 50 cross-member. Which combinations would you add to the flex test, and why? How many does the set grow to if each new belt width combination is tested at the four heights already used, with both bracing states where they apply?

**Worked answer.** Add the new belt width at each of the four test heights: **400**, **900**, **950** and **1,500** mm. The 400 mm height checks the tightest geometry. The 900 and 950 mm heights check the brace boundary with the new cross-member, where the brace connection rule from Chapter 3 may need a new position. The 1,500 mm height checks the largest variant and the drawing view. Bracing applies only above 900 mm, so 950 mm and 1,500 mm are tested braced and 400 mm and 900 mm unbraced, matching the rule. That adds **4** combinations, taking the set from 24 to **28**. Also add one test confirming that a 1,400 mm trestle references its own 125 × 50 cross-member and not the 1,200 mm one.
