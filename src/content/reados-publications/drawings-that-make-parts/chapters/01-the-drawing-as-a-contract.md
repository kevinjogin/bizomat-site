---
book: drawings-that-make-parts
chapterSlug: the-drawing-as-a-contract
order: 1
title: "The drawing as a contract"
description: "What a mechanical drawing must do, which kind of drawing to make, how the AS 1100 standards fit together, and how a drawing differs from the model it came from."
draft: false
---

When a part is made by someone else, the drawing is the agreement about what they will deliver. The supplier quotes against it, the machinist makes to it, the inspector accepts or rejects against it, and when there is a dispute about whether a part is right, the drawing is what both sides read. A drawing that can be read two ways is a contract with two meanings, and the cost of that ambiguity usually lands on whoever wrote it.

This chapter sets out what a mechanical drawing has to achieve, the kinds of drawing the Australian standards recognise, how the parts of the AS 1100 series fit together, and why a drawing still matters in an age of 3D models. It also introduces the running case, a pump bearing housing, and the first mistake made on it.

## Four jobs a drawing must do

A detail drawing for a manufactured part has four jobs. If it fails at any one, the part is at risk.

1. **Define the shape.** Every feature must be shown so that it can be understood without guessing, in views and sections chosen for that purpose.
2. **Define the size.** Every feature needs a size and a location, given once, in the units stated on the sheet.
3. **Define the acceptable variation.** Every dimension and every geometric characteristic needs a tolerance, either written beside it or covered by a general note.
4. **Define everything else that matters.** Material, surface texture, treatments, finishes, identification marks and any special inspection requirements.

AS 1100.201 clause 2.1.2 makes the third point directly: every feature on a component has a size and a geometric shape, so the tolerancing should be complete. It then introduces general tolerances as the practical way to achieve completeness without writing a tolerance against every line. Chapter 7 returns to this.

A useful test of a finished drawing is to imagine handing it to a competent machinist in another city who has never heard of the product. Could they make the part, and could an inspector decide whether it was right, without picking up the phone? If the answer is no, the drawing is not finished.

## Who reads the drawing, and what each reader needs

A drawing has several readers, and each reads it for a different purpose. Writing for all of them at once is what makes drawing practice demanding.

- **The estimator** reads it to price the work. They look for the tightest tolerances, the finest surface textures, the material, the quantity and anything unusual, because those drive machine time, inspection time and risk. An estimator who cannot find a tolerance will assume one, and their assumption may not be yours.
- **The machinist or programmer** reads it to plan operations. They need to know which features relate to which, so that they can choose a set-up that holds those relationships. Dimensions that follow function make this easier; dimensions that follow the order the designer happened to draw the part make it harder.
- **The inspector** reads it to decide acceptance. Every requirement must be measurable, and every measurement needs a limit. A note such as "bore to be a good fit" cannot be inspected.
- **The buyer** reads it to compare suppliers and to manage changes. They need the drawing number, the revision and a clear statement of what governs, so that every supplier is quoting the same thing.
- **The engineer who comes later** reads it to understand why the part is the way it is. A drawing that shows function in its datums and tolerances is easier to change safely than one that only shows geometry.

The conventions in the AS 1100 series serve all of these readers by making each mark mean one thing. A centre line, a hidden line, a symbol in front of a dimension or a note near the title block is read the same way by the estimator in Sydney and the inspector in Perth. That shared language is what lets a drawing travel without its author.

## Kinds of drawing

AS 1100.101 defines a vocabulary of drawing types in clause 2.2. The distinctions matter, because the type of drawing tells the reader what it is for and what it is not for.

```figure
type: tree
title: Drawing types defined in AS 1100.101 clause 2.2
caption: Summarised from AS 1100.101-1992. The running case uses a monodetail drawing for the housing and an assembly drawing for the bearing cartridge.
- Drawings for a single part
  - *Detail drawing | end product requirements for the parts shown
  - Monodetail drawing | a detail drawing of a single part
  - Multidetail drawing | a detail drawing of two or more uniquely identified parts on one sheet
  - Tabulated drawing | similar parts with their variations given in a table
- Drawings for assemblies and systems
  - Assembly drawing | an assembly or subassembly, sometimes called a general assembly
  - Detail assembly drawing | an assembly with one or more parts detailed on it
  - Arrangement and general arrangement drawings | relationships of major units, the end product for a general arrangement
  - Installation drawing | information needed to install items relative to their support
  - Control drawing | parameters for development, procurement or co-functioning, such as envelopes and interfaces
- Records and diagrams
  - Diagrammatic drawing | symbols and lines showing relationships in a system
  - Works as executed drawing | records what was actually built
```

The running case uses two of these. The housing gets a **monodetail drawing**: one part, one sheet, everything needed to make and inspect it. The bearing cartridge, which combines the housing, bearing, shaft, end cap, seal and screws, gets an **assembly drawing** with a parts list. The assembly drawing does not repeat the housing's dimensions; it refers to the housing's drawing number.

A common confusion is between a detail drawing and a "detail" in the sense of an enlarged view of part of a drawing. AS 1100.101 notes the difference explicitly. When someone says "send me the detail", ask which they mean.

## How the AS 1100 series fits together

AS 1100 is a series. Part 101 sets the general principles for all technical drawing: sheets, lines, lettering, scales, projection, sections, dimensioning, tolerancing and general conventions. Discipline parts then add what is particular to each field. AS 1100.101 itself names them: Part 201 covers mechanical drawing, Part 301 architectural, Part 401 engineering survey and design, and Part 501 structural engineering. AS 1100.201 in turn refers to the AS 1101 series for graphical symbols, including AS 1101.3 for welding symbols.

Alongside the AS 1100 series sit Australian adoptions of ISO drawing standards, such as AS ISO 128.24 on lines for mechanical engineering drawings, which is an identical adoption of ISO 128-24:1999. Its preface shows how the adoption works: the Australian number appears on the title page, the ISO number on the cover, and references to other ISO standards are replaced by Australian equivalents where they exist.

```figure
type: layers
title: The standards behind a mechanical drawing in this book
caption: The status shown is as found on the Standards Australia store and in the supplied documents in October 2026. Always check the edition your contract calls up.
- AS 1100.101-1992 | general principles for all technical drawing; reconfirmed 2014; listed as pending revision
- AS 1100.201-1992 | mechanical engineering drawing; reconfirmed 2014
- AS ISO 128.24-2005 | lines on mechanical engineering drawings; adopts ISO 128-24:1999
- *Referenced standards | for example AS 1101.3 welding symbols and AS 1913 centre holes, at the editions called up
- Contract or customer standard | may specify ISO or other standards instead, and then governs
```

### Which edition governs

Drawing standards are revised slowly, and many Australian businesses work from editions that are decades old. That is not necessarily wrong: AS 1100.101 and AS 1100.201 were both reconfirmed in 2014, meaning the committee reviewed them and found them still valid. But overseas customers and suppliers often work to later ISO standards, and some conventions, notably surface texture indication, have moved. The rule is the one that applies to any referenced document: the edition named on the drawing or in the contract governs.

AS 1100.101 clause 2.5.6 asks each sheet to name the standard the drawing follows. That single line answers the "which edition" question for every reader who comes later, and it is often left off.

## Model and drawing: which one governs?

Most parts today are designed as 3D models, and the drawing is produced from the model. Some businesses send suppliers only the model. Others send a drawing and a model and say nothing about which governs. Both practices cause trouble.

A model defines nominal geometry very precisely, but on its own it usually says nothing about tolerances, surface texture, material condition, inspection requirements or which features matter. A drawing says all of those things but may lag the model after a change. When both are sent, the supplier needs to know which is the authority if they disagree.

The running case business adopted a simple rule, written in a note on every drawing: the drawing governs; the model is supplied for information to assist manufacture. Where a feature is not dimensioned on the drawing, the model may be used for its nominal geometry, subject to the general tolerances on the drawing. That is one workable rule. Others exist, including fully model-based definition with tolerances in the model. What matters is that the rule is stated, not assumed. The READOS chapter on [drawing packages suppliers can quote and make from](/reados/collections/engineering-design-practice/drawing-packages-suppliers-can-quote-and-make-from/) covers the commercial side of this choice.

## The running case: the housing

This is an illustration. The business is designing a bearing cartridge for a small centrifugal pump. The housing is the most demanding part. It will be machined from a grey iron casting by an outside machine shop, and inspected on receipt by the business's own staff. Its key features are:

- a flange 140 mm in diameter and 12 mm thick, with four 9 mm holes on a 115 mm pitch circle for M8 bolts;
- a locating spigot 100 mm in diameter, projecting 5 mm from the flange face, which centres the housing on the pump;
- a cylindrical body 95 mm in diameter;
- a bearing bore 62 mm in diameter, with a shoulder, to take a deep-groove ball bearing;
- four M6 tapped holes on a 78 mm pitch circle in the rear face, for an end cap carrying a lip seal;
- an overall length of 77 mm from the spigot face to the rear face.

```figure
type: stats
title: The running case housing
caption: This is an illustration. These are nominal sizes; later chapters add views, tolerances and surface texture.
- *Ø140 × 12 | Flange | four Ø9 holes on a Ø115 pitch circle
- Ø100 × 5 | Locating spigot | centres the housing on the pump
- Ø62 | Bearing bore | seats a deep-groove ball bearing
- 4 × M6 | Tapped holes | on a Ø78 pitch circle, rear face
- 77 | Overall length, mm | spigot face to rear face
```

## A drawing as a record

A drawing is also a record of a decision. Once released, it fixes what the business agreed to buy, at a particular revision, on a particular date. When a part fails in service, or when a supplier and customer disagree about whether a batch was acceptable, the released drawing at the revision in force when the parts were ordered is the evidence. That is why the revision, the date and the approval signatures in the title block matter as much as any dimension, and why Chapter 10 treats release as part of the drawing, not an administrative afterthought.

The record also protects the designer. A drawing that states the standard it was prepared to, the units, the projection, the general tolerances and the material can be read the same way in ten years. One that relies on the office's unwritten habits cannot, and the habits leave with the people who held them.

## The first mistake: a model sent without a drawing

The business's first request for quotation went to three machine shops with only the 3D model attached, because the drawing was "nearly finished". Two shops quoted. Their prices differed by a factor of almost two. When the buyer asked why, the reasons were revealing. One shop had assumed the bore needed only a general machining tolerance and quoted it as a simple turned diameter. The other had assumed a bearing seat needed a precision bore and quoted fine boring and inspection.

Neither assumption was unreasonable, because the model said nothing about tolerance. The quotes were not comparable, and accepting the cheaper one would have produced bores that might not hold the bearing correctly. The error was detected because the buyer compared the quotes line by line instead of choosing the lower total. The fix was to finish the drawing, with the bore's tolerance and surface texture stated, and requote. The lesson is that a quote is only as precise as the definition it was priced against.

## What a drawing does not do

A drawing defines the part. It does not normally define how to make it. AS 1100.201's surface texture section, for example, allows a production method to be specified only where the final texture must be produced by that method; otherwise the supplier chooses. Over-specifying the method on a drawing removes the supplier's freedom to use their best process and makes the designer responsible for the process outcome.

There are exceptions. Castings drawings must carry machining allowances and special locations, and AS 1100.201's Appendix B lists what a casting drawing should show, from mass to pattern identification. Welded parts need weld symbols. But the default is to state requirements, not methods, and to let the person with the machine decide how to meet them.

## Exercise: classify the drawings

The business needs drawings for: the housing; the end cap; a set of six spacer washers that differ only in thickness; the bearing cartridge as assembled; and an outline showing the space the cartridge occupies and its mounting interface, to send to the pump manufacturer. Which AS 1100.101 drawing type suits each?

**Worked answer.**
- The **housing** and the **end cap** each get a monodetail drawing, because each is a single part made to its own requirements.
- The **six spacer washers** suit a tabulated drawing: one drawing of the washer with a table giving each variant's thickness and part number.
- The **assembled cartridge** gets an assembly drawing with a parts list, referring to each part's drawing number.
- The **outline for the pump manufacturer** is a control drawing, in AS 1100.101's sense of one that establishes parameters for the co-functioning of items: here, an envelope and interface control drawing showing the space occupied, the mounting spigot and bolt pattern, and any limits the pump must respect.

Choosing the type first helps decide what each drawing must contain and, equally, what it should leave out. The interface drawing, for example, should not show internal details of the cartridge that the pump manufacturer does not need and the business may wish to keep confidential.
