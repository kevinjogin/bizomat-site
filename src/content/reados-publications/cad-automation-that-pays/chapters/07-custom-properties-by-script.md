---
book: cad-automation-that-pays
chapterSlug: custom-properties-by-script
order: 7
title: "Custom properties by script"
description: "Read and write custom properties at file and configuration level, tell raw from resolved values, validate against a written schema, and fix in batches with a dry run before writing anything."
draft: false
---

Custom properties are the CAD file's metadata: part number, description, material, revision, drawn by, finish, supplier. They feed title blocks, parts lists, vaults and purchasing systems, and they are where most CAD data quality problems live. They are also one of the easiest things to automate, which makes them one of the easiest things to damage in bulk. A script that writes "Rev A" to two thousand files in a minute is a gift if the value and the place are right, and a week of clean-up if either is wrong.

This chapter sets out how to work with properties by script. It covers where properties live, at the file or the configuration, the difference between a property's raw text and its resolved value, validating properties against a written schema, fixing them in batches with a dry run, and the trap of writing a value to a place the title block does not read. The running case adds a property check to the release pack and finds that a batch fix had filled hundreds of fields nobody could see.

## Where properties live

Most parametric CAD programs keep properties in two places. **File-level** properties, sometimes called custom properties, apply to the whole document. **Configuration-specific** properties apply to one configuration and can differ between configurations: a shaft's length-dependent part numbers, for example. A drawing's title block and a parts list are each set up to read one or the other, and when both exist with the same name, the program's own rules decide which wins.

```figure
type: compare
title: File-level and configuration-specific properties
cols: Applies to | Typical use | Read by
caption: This is an illustration of the office's convention. The template decides which one a title block reads; the script must write to the same place.
- File-level | The whole document | Material, finish, drawn by, project | Title blocks and parts lists in the office's templates
- *Configuration-specific | One configuration | Part number and description where configurations are different parts | Parts lists, when set to read configuration properties
- Drawing's own properties | The drawing document | Drawing number, revision, sheet count | The drawing's title block
```

A script must know, for each property, which place the office uses, and read and write there. The office's *CAD Standards That Stick* schema records it; the script reads that schema rather than hard-coding it.

## Raw and resolved values

A property's value can be plain text, "Mild steel", or an expression that the CAD program evaluates, such as a link to the model's mass, to its material or to a dimension. The API usually offers both the **raw** value, the expression as typed, and the **resolved** value, what it evaluates to. A script that checks whether a property is filled in should read the resolved value, because an expression that links to a missing dimension resolves to nothing even though its raw text is not blank. A script that copies properties from one file to another should usually copy the raw value, so that the link keeps working in the new file.

Chapter 4 wrote the bracket's mass as the static text "1.38". The alternative is a property linked to the model's mass, which stays right when the model changes. The office chose the static value for released drawings on purpose: a released drawing's mass should not change silently if someone later edits the model without a revision. The working model keeps a linked mass property; the release pack copies its resolved value into the drawing as static text at release.

## A schema the script can read

A property check needs rules, and the rules should be data, not code. The office's schema, a small table maintained by the CAD administrator, lists each property, where it lives, whether it is required, and the pattern or list its value must match.

```figure
type: checklist
title: The office's property schema, as the release pack reads it
caption: This is an illustration. Each rule is a row in a table the script loads, so the administrator can change a rule without changing code.
- Part number, file level, required | Two letters, a hyphen and three digits, such as BR-310
- Description, file level, required | Noun first, upper case, no more than 40 characters
- Material, file level, required | Must match the material assigned in the model
- Revision, drawing, required | A single letter A to Z, or a number for pre-release
- Drawn by, drawing, required | Initials from the office's user list
- Finish, file level, optional | One of the office's finish codes, if present
- x Free text in part number | Rejected; the pattern exists so that the register can match it
- ? Supplier part number on purchased parts | Required only where the part's type is "purchased"
```

## The running case: checking 138 files

This is an illustration. The release pack's assembly mode, after walking the drive assembly, checks every unique file against the schema before exporting anything. On the 138 files it found 22 problems in 19 files:

```figure
type: bars
title: Property problems found in the drive assembly's 138 files
unit: problems
max: 12
caption: This is an illustration. 22 problems in 19 files; 3 files had two problems each.
- Revision blank on the drawing | 11
- Description does not match the pattern | 7
- *Material property differs from the model's material | 4
```

The material mismatches were the interesting ones. On four parts, the property said "Mild steel" while the model's assigned material was a stainless grade. Two had been changed in the model and not in the property; two had been copied from a mild steel part and changed in the model only. The property check compared the two because the schema says the material property must match the model, and the release pack refused to release those four drawings until a person decided which was right.

## Fixing in batches, with a dry run

Finding problems is half the job; fixing the routine ones is the other half. A batch fix should always run in two passes. The first, a dry run, walks the files, decides what it would change, and writes a report: file, property, old value, new value, reason. A person reads it. The second pass makes exactly the changes in the report, no more, and logs each one.

```figure
type: steps
title: A batch property fix in two passes
caption: This is an illustration of the release pack's property fixer. Nothing is written in the first pass.
- Load the schema and the list of files | From the walk or a folder
- Dry run: decide each change | Old value, new value and the rule that requires it
- Write the report | One line per change, with a count at the end
- *A person reviews and approves | Changes not wanted are removed from the list
- Apply exactly the approved changes | Each file saved once; each change logged with old and new values
```

The report is also the undo: because it records every old value, a second script can restore them if something turns out to be wrong.

## The error: hundreds of invisible fixes

This is an illustration. Before the release pack, an engineer had written a batch fix to fill the blank "Revision" property on all of a project's part files, and run it on 312 files. The log showed 312 successful writes. Afterwards, the drawings' title blocks still showed blank revisions.

The script had written "Revision" as a file-level property on each part. The office's drawing template reads the revision from the drawing's own properties, not the part's, and for parts the parts list read a configuration-specific "Revision" property that existed, blank, on each part's default configuration. Configuration-specific values take precedence in that template. The script had filled 312 fields that nothing read, and left the fields that mattered blank.

The release pack's checker found it by comparing each property's resolved value in the place the schema says it lives with the value the drawing actually displays. The fix was to delete the 312 orphan file-level values, which the old script's log made possible, and to fill the drawing revisions where the template reads them. The rule that came out of it is in the schema: each property's location is recorded, and the script writes only there. The release pack's own test set now includes a drawing whose part carries the same property at both levels with different values, so that any change to the tool's reading or writing rules is tested against exactly the situation that caught the old script out.

## Check against the model, not only the schema

A schema can check that a value has the right form. Some errors can only be found by comparing a property with the model it describes, as the material check above did. The release pack runs three such comparisons:

- **Material** against the material assigned in the model, which found the four stainless parts.
- **Thickness in the description** against the model's sheet metal thickness, for sheet metal parts. A description "PLATE 2.0 MS" on a part whose sheet metal feature is 3.0 mm thick is a description that will mislead a buyer. The comparison converts the model's 0.003 m to millimetres, as Chapter 4 requires, and compares with a tolerance.
- **Mass** against the model's computed mass, for any part whose mass property is static text. A difference of more than 2% means the model has changed since the mass was written.

Each comparison reads the model through the API and the property through the schema's location, and reports both values when they differ, so that a person can decide which is right. The tool never decides on its own that the model is right and the property wrong, or the reverse, because either can be the one that was changed by mistake.

## Configurations in a walk

When the property check runs during an assembly walk, it reads each instance's properties from the configuration that instance uses, as Chapter 6 required. A shaft with three configurations, each with its own part number, appears as three unique file and configuration pairs, and each is checked separately. A rule such as "part number must be unique across the assembly" must then compare configuration part numbers, not file names, or it will report the three shafts as one part with three numbers.

This is an illustration. The drive assembly has two multi-configuration parts, a shaft with three lengths and a bracket with left and right hands. The checker treats them as five unique items with five part numbers, all different and all matching the register, which is what the parts list also shows.

## Who may change which property

Not every user should be able to change every property by script. The drawing's revision belongs to the release process; the part number to the register; the material to the designer. A batch tool that any drafter can run, and that can change any property, bypasses those owners. The release pack's fixer can only write the properties the schema marks as "fixable by tool", which are formatting fixes such as description case and spacing, and fills from authoritative sources such as the register. Anything else it reports for a person to change in the normal way, so that the office's controls over revisions and numbers still apply.

## Warning on save

The office also wanted drafters to see property problems before release, not at it. A small add-in now runs the schema check, read only, when a part or drawing is saved, and shows a short warning listing any problems, without changing the file or blocking the save. It takes a fraction of a second, because it checks only the document being saved, and it cut the property problems found at release from 22 in the drive assembly's first check to 3 a month later. Blocking the save was considered and rejected: a drafter who cannot save their work because a property is blank will find a way round the block.

## Properties that come from other systems

Some properties are not the CAD office's to decide. A part number may be issued by the vault or the ERP system; a supplier's part number comes from the supplier. A script that fills these should take them from their source, not invent or derive them, and should record where each value came from. The release pack fills the part number only by reading it from the register, and if the register has no entry for a file, it reports that rather than generating a number.

## Reading many properties quickly

Property reads are among the most frequent calls a tool makes, and Chapter 3's point about call counts applies directly. Many APIs offer a call that returns all of a document's or configuration's property names and values at once, which is far cheaper than asking for each property by name. The release pack reads each unique file's properties in one call, holds them in its cache keyed by file and configuration, and looks up names in the cache. For the drive assembly's 138 files, with about a dozen properties each, that is 138 bulk reads instead of about 1,650 individual ones, and the check that took half a minute in the first version now takes a few seconds.

## Encoding and special characters

Property values are text, and text has encoding. A description with a degree sign, a diameter symbol or an en dash may survive inside the CAD program and come out garbled in a CSV report or an ERP import that expects a different encoding. The release pack writes its reports in UTF-8, which handles all of these, and the schema forbids the diameter symbol in descriptions, because one of the office's downstream systems mangled it, in favour of "DIA".

## Exercise: a property for the purchasing system

Purchasing wants a property "Order code" on every purchased part, formed as the supplier code, a hyphen and the supplier's part number, for example "BRG-6204-2RS". There are 46 purchased part files in the library, of which 31 have supplier code and supplier part number properties filled in and 15 do not. How would you add the property by script?

**Worked answer.**

1. **Add the rule to the schema** first: "Order code", file level, required for purchased parts, formed as supplier code, hyphen, supplier part number, with its pattern. Decide whether it should be a linked expression, which updates if either source property changes, or static text; linked is better here, because the source properties are the authority.
2. **Dry run** on the 46 files. For the 31 complete files, the report shows the new property and its resolved value. For the 15 incomplete files, it reports "cannot form order code: supplier part number blank" and proposes no change.
3. **Review** the report with purchasing, who confirm the 31 values and supply the missing supplier data for the 15.
4. **Apply** the 31 changes, logging each, then fill the 15 files' supplier properties from purchasing's data and rerun the dry run and apply for them.

The script should never form an order code from partial data, such as "BRG-" with nothing after it, because a code that looks valid and is not is worse than a blank that everyone can see.
