---
book: cad-standards-that-stick
chapterSlug: custom-properties-that-feed-the-title-block
order: 5
title: "Custom properties that feed the title block and BOM"
description: "Design a property schema with fixed names, types, allowed values and owners, link it to title blocks and bills of materials, and test it against the system that receives the data."
draft: false
---

Custom properties are where a CAD model stops being geometry and starts being business data. The part number, description, material, finish and approval details stored in a model's properties appear in its title block, populate the bill of materials, and in many offices flow on into purchasing, planning and stock systems. If the properties are inconsistent, every one of those downstream uses inherits the inconsistency.

This chapter designs a property schema for the running case office. It defines each property's name, type, allowed values, source and owner, links the schema to drawings and bills of materials, and tests it against the business system that receives the data. The error case is a description that looked complete in CAD and lost its most important word on the way to the stores.

## Properties are a data model

It is tempting to treat custom properties as a list of labels to fill in. They are better treated as a small data model, with the same discipline as a database table. Each property needs:

- **a fixed name**, spelled and capitalised one way, because many systems treat "Material" and "MATERIAL" as different properties;
- **a type**, such as text, number, date or yes/no;
- **allowed values or a format**, such as a list of standard materials or a maximum text length;
- **a source**, which may be entry by a person, calculation by the CAD system or a link to another value;
- **an owner**, the role that is responsible for the value being right;
- **a destination**, the places where the value is used, such as the title block, bill of materials or business system.

Writing this down for every property produces a data dictionary. READOS's chapter on [writing a data dictionary](/reados/collections/operational-data-records-and-controls/writing-a-data-dictionary/) explains the general idea; the CAD property schema is one small, important application of it.

## What the office had before

The baseline in Chapter 2 found three families of property names, one for each old template family. Across all 26,400 files the administrator found 41 distinct property names, many of them variants of the same idea. Material alone appeared as "Material", "MATERIAL", "Matl" and, in a few hundred files, "Material " with a trailing space that made it invisible to anyone searching for the correct name. Description appeared under four names. Some files had both a "Revision" and a "Rev" property holding different values.

These variants caused visible faults. A title block linked to "Material" showed a blank on any drawing whose model used "MATERIAL". A bill of materials column linked to "Description" was empty for parts made from the oldest template family. Designers had learned to work around the blanks by typing directly into the title block or the BOM table, which produced drawings that looked right while their underlying data was wrong.

## The schema

The administrator reduced the 41 names to 14 controlled properties. This is an illustration; another office's list will differ, and a reference such as the international standard on title block data fields can help decide which fields are needed.

```figure
type: compare
title: The running case office's property schema
cols: Type and format | Source | Owner
caption: This is an illustration. Every property has one name, one format and one owner; the destinations are recorded separately.
- PartNumber | text, register format | entered from the number register | designer
- Description | text, 40 characters maximum, noun first | entered | designer
- Material | list of standard materials | entered, checked against model material | designer
- Finish | list of standard finishes | entered | designer
- Mass | number, kg, 3 decimal places | calculated by CAD | CAD system
- MakeBuy | list: Make, Buy | entered | designer
- Supplier | text, from supplier list | entered for Buy parts | purchasing
- SupplierPartNo | text | entered for Buy parts | purchasing
- Revision | text, letter | set at release | engineering manager
- DrawnBy | list of staff initials | entered | designer
- DrawnDate | date | entered | designer
- CheckedBy | list of staff initials | entered at check | checker
- ApprovedBy | list of staff initials | entered at approval | engineering manager
- *TemplateID | text | inherited from template, never edited | CAD administrator
```

Two features of this schema deserve comment. First, the Mass property is calculated by the CAD system from the model's geometry and assigned material, not typed. A typed mass is a copy that goes stale when the model changes. Second, the Material property is a list entry that must agree with the material assigned to the model for mass calculation. The schema records that the two must match, and the compliance checks in Chapter 9 test it.

The 40-character limit on Description was not chosen for neatness. It came from the business system, as the error case explains.

## Link, do not type

Once the schema exists, every place that displays a property should link to it rather than hold a copy. In practice that means:

- **Title blocks** use linked notes that display the model's properties. Changing the description in the model changes the drawing.
- **Bill of materials tables** use columns linked to the properties of each component, never typed values.
- **Drawing-only fields**, such as the sheet number or the drawing's own revision, are linked to the drawing's properties rather than the model's, and the schema notes which is which.

```figure
type: tree
title: Where one property's value travels
caption: This is an illustration for the Description property. Every arrow is a link; a typed copy at any point breaks the chain.
- Description property in the part model | entered once by the designer
  - Drawing title block | linked note
  - Assembly bill of materials | linked column, one row per component
    - Exported BOM file | generated from the table
      - Business system item record | imported, 40-character field
        - Purchase orders and picking lists | printed from the item record
```

Typed overrides are the usual way a linked system decays. A designer finds a blank or wrong value in a BOM table, types the correct value into the cell, and the table looks right. The model is still wrong, the next export is still wrong, and the override hides the problem from everyone who looks at the drawing. The written standard should forbid overrides in title blocks and BOMs and the checks in Chapter 9 should look for them.

When an override is found, treat it as a symptom. Somebody typed it because the linked value was blank or wrong, which usually means the model is missing a property, uses an old property name or holds a wrong value. Fix the model, remove the override and let the link show the corrected value. Then ask whether the same cause affects other files, because an override rarely appears alone.

## Test against the receiving system

A property schema is only as good as its fit with the system that receives its data. The running case office exports bills of materials to its business system, which creates or updates item records and generates purchase orders and picking lists. The administrator tested the schema by exporting the bill of materials for a complete 2,400 mm module and importing it into the business system's test company.

Before the schema was introduced, a similar trial export of **410** lines had **63** lines rejected by the import, **15.4%**. The rejections fell into four groups.

```figure
type: bars
title: Reasons for 63 rejected BOM lines before the schema
unit: lines
max: 30
caption: This is an illustration. Each reason maps to a schema rule that now prevents it.
- *Material not in the business system's list | 29
- Description longer than the 40-character field | 14
- Part number missing | 11
- Make or buy not stated | 9
```

The four counts add to **29 + 14 + 11 + 9 = 63**. Each reason became a schema rule: the material list was aligned with the business system's list, the description was limited to 40 characters, the part number became mandatory before release, and make-or-buy became a required list entry. After the schema and new templates were in use, an export of the same 410 lines, with properties corrected as each part was revised, had **4** rejections, **1.0%**, all for new materials not yet added to the business system's list. Those four were a process gap rather than a data error, and purchasing added the materials.

Notice that the 14 description rejections were the visible part of a larger problem. The business system rejected descriptions only on import of new items. Existing items with long descriptions were already in the system, silently cut to 40 characters.

## The error case: the word that fell off the end

The transfer module has left-hand and right-hand side members, mirror images of each other. Their descriptions in the old files were:

- "SIDE MEMBER, 2400 LONG, 3 MM GALVANISED STEEL, LH"
- "SIDE MEMBER, 2400 LONG, 3 MM GALVANISED STEEL, RH"

Each is 49 characters. The business system's description field holds 40. When the items had been created, years earlier, the system had truncated both to "SIDE MEMBER, 2400 LONG, 3 MM GALVANISED ", identical except for their part numbers. Picking lists print descriptions prominently and part numbers in small type. A storeperson picking for a module assembly took two left-hand members, because the descriptions matched and the part numbers were not checked.

The error was detected at assembly, when the second member would not mount: its hole pattern faced the wrong way. The cost was about two hours of assembly time and a delay while a right-hand member was found. Investigation traced the cause back through the picking list to the item record and the original description.

The correction worked at three levels:

1. **The data.** All item descriptions longer than 40 characters were listed from the CAD properties. There were 212. Those whose distinguishing information fell beyond character 40 were corrected first.
2. **The convention.** The written standard adopted a noun-first, distinguishing-detail-early convention, for example "SIDE MEMBER LH 2400 3MM GALV", 28 characters, with the hand immediately after the noun.
3. **The schema.** The Description property was limited to 40 characters at entry, so that the truncation could not happen silently again.

```figure
type: compare
title: Description before and after the convention
cols: Characters | What the 40-character field shows
caption: This is an illustration. Putting the distinguishing detail early means it survives any truncation.
- Old LH description | 49 | SIDE MEMBER, 2400 LONG, 3 MM GALVANISED
- Old RH description | 49 | SIDE MEMBER, 2400 LONG, 3 MM GALVANISED
- *New LH description | 28 | SIDE MEMBER LH 2400 3MM GALV
```

The lesson extends beyond descriptions. Any property that crosses into another system must respect that system's limits, and the schema is the place to record them. A CAD property can hold far more than most business systems accept.

## Decide who fills in what, and when

A schema with fourteen properties and no timing rule invites one of two failures. Either designers fill everything in at the start, guessing values they do not yet know, or they leave everything until release and then rush. Neither produces good data.

The running case office tied each property to a stage. At creation, the template supplies TemplateID and the designer enters the part number from the register, a working description, DrawnBy and DrawnDate. During design, Material, Finish and MakeBuy are set as the decisions are made, and Mass updates itself. Before checking, the designer confirms the description against the 40-character rule. At checking, the checker enters CheckedBy, and purchasing completes Supplier and SupplierPartNo for bought parts. At approval, the engineering manager enters ApprovedBy and the Revision.

Tying properties to stages has a second benefit: the checklist for each stage can ask only for the properties that should exist by then. A checker who finds Material blank at the checking stage has found a genuine omission. A checker who finds Supplier blank on a part that has not yet been sent to purchasing has found nothing wrong.

Some properties are better filled by the system than by people. Where the CAD system can enter the author's initials or the creation date automatically from the user account and clock, let it. Each automatic entry is one fewer chance for a typing error, and one fewer field for a busy designer to skip.

## Clean up old files gradually

The 26,400 old files still carry the 41 old property names. Converting them all at once is possible with a script, but risky: a bulk change to released files alters their content without a revision, and a script error multiplied across thousands of files is hard to undo.

The office chose a gradual approach. Files are converted to the new schema when they are next revised, using a small tool that maps each old name to its new one and reports any value it cannot map. For files that feed the business system but are not being revised, such as the 212 items with long descriptions, the business system's item records were corrected directly and the CAD properties updated at the next revision. The register records the mapping from old names to new so that anyone reading an old file knows what each field means.

## Handle configurations and derived parts

Many CAD systems allow one file to hold several configurations, such as the seven lengths of side member. Properties can then be set at the file level, shared by every configuration, or at the configuration level, specific to one. The schema must say which.

For the side members, the material and finish are the same for every length and belong at file level. The part number, description and mass differ by length and belong at configuration level. A common fault is to set the part number at file level, so that every length carries the same number. The bill of materials then shows seven different parts with one number, which is the same problem as the template error in Chapter 4 by another route.

The office's rule is simple: anything that identifies the item, its number, description and mass, is set per configuration; anything that describes a shared characteristic, material, finish and make-or-buy, may be set at file level. The rule is written into the standard and tested in the template release test.

## Exercise: check a property row

A designer creates a purchased bearing unit with these properties: PartNumber blank; Description "FLANGED BEARING UNIT, 4-BOLT, 30 MM BORE, CAST IRON HOUSING"; Material "Cast Iron"; MakeBuy "Buy"; Supplier blank. Which schema rules does it break, and how would you correct it?

**Answer.** Four problems. The **PartNumber** is blank; it must be taken from the number register before release. The **Description** is 59 characters, too long for the 40-character limit. Truncated, it becomes "FLANGED BEARING UNIT, 4-BOLT, 30 MM BORE" and loses the housing material; if the office also buys a pressed-steel version, the two would become indistinguishable on a picking list. A noun-first version such as "BEARING UNIT 4-BOLT 30MM CI" is 27 characters and keeps both the bore and the housing. The **Material** "Cast Iron" is probably not on the office's list of standard materials as typed; it should be chosen from the list or, for a bought part, set to the convention the standard uses for purchased items. The **Supplier** is blank for a Buy part; purchasing must complete it, with the SupplierPartNo, before the part is released.
