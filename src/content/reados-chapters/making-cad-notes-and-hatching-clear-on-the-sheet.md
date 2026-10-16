---
title: "Making CAD notes and hatching clear on the sheet"
description: "Use text styles, leaders, tables and hatch patterns to explain a CAD drawing clearly, with readable output and fewer conflicting or ambiguous annotations."
publishDate: 2026-10-04
category: "Technology"
tags:
  - design
  - systems
  - process-improvement
author: "KEVOS®"
featured: false
draft: false
---

Geometry shows shape and position, but it rarely communicates every decision needed to understand a drawing. Notes identify conditions, leaders connect explanations to features, tables organise repeated information and hatching distinguishes areas. Poorly arranged annotation can obscure the very geometry it is meant to explain.

David Byrnes's *AutoCAD 2011 For Dummies* treats these elements as a deliberate part of drawing communication. The lasting principle is to design annotation for the reader and the final output. A note that looks comfortable while zoomed in may be unreadable on the issued sheet, and an attractive pattern may suggest a meaning that was never intended.

## Decide what the reader needs to know

**Annotation** is explanatory information added to a drawing, including text, dimensions, symbols, leaders and patterns. Its purpose is to help the recipient interpret and use the represented design. It should resolve uncertainty rather than merely fill empty space.

Identify the intended reader and action. A concept reviewer may need to know which assumptions remain open. A person preparing a prototype may need a clearly identified revision and references to the approved requirements. The same geometry can require different explanations at different stages.

Distinguish a requirement from a description or a question. A sentence that casually suggests a material can be mistaken for a specification when placed beside a detailed drawing. Mark unresolved choices through the project's agreed process rather than letting tentative notes appear final.

Keep each note focused on a useful point. If a note combines several unrelated instructions, readers may miss one or struggle to identify the feature to which it applies. Separate the information where that improves clarity without scattering it unnecessarily across the sheet.

## Establish a small set of text styles

A **text style** stores shared characteristics such as font and related text settings. It helps keep annotation consistent and makes deliberate changes easier to apply. A drawing rarely benefits from every note having an independently chosen appearance.

Use a restrained hierarchy for titles, general notes and feature labels. The hierarchy should help readers navigate, not imitate a promotional layout. Follow the project's drafting convention where one is specified, including any required lettering and output sizes.

Choose fonts with the receiving workflow in mind. A font available on one workstation may be absent on another, and substitution can change line breaks or the appearance of symbols. Inspect the exported output and confirm any dependencies needed for editable exchange.

Avoid local formatting changes that disguise a style problem. If many notes need individual adjustment to remain readable, the shared style or sheet arrangement may be wrong. Correct the recurring cause rather than accumulating exceptions that the next drafter must understand.

## Choose text objects for the content

**Single-line text** suits short labels that can stand independently. **Multiline text** supports paragraphs and related formatting within a text area. Selecting an appropriate object type makes later revisions easier to manage.

A paragraph assembled from many separate lines can be awkward to edit. Adding a sentence may require manual repositioning of everything below it. Multiline text can handle wrapping as a coherent object, although its width and placement still require review.

Use alignment deliberately. A label may need to remain centred on a feature, while a note block may need a stable upper-left reference. An unsuitable alignment can make revised text drift into neighbouring content as its length changes.

Inspect the result after substantive wording changes. Correct spelling does not guarantee that the note still fits the intended area or points to the right feature. Text maintenance includes both meaning and placement.

## Separate paper size from model size

**Paper text height** is the intended height of lettering in the final sheet output. It is different from the model-space height needed when a non-annotative note is shown through a reduced view.

Choose the annotation method before adding many notes. Common approaches include placing notes in paper space, sizing non-annotative model-space text for a particular scale, or using annotative objects. Mixing approaches without a clear reason can make later scale changes difficult to manage.

For non-annotative model-space text, the required height depends on the view scale and unit conversion. If model and paper units are both millimetres, a note intended to print at 3 millimetres in a 1:10 view needs a model height of 30 millimetres. This is an illustrative calculation, not a prescribed lettering standard.

Paper-space annotation can be created at its intended plotted size when the layout output is correctly configured. That simplifies the size calculation, but the notes still need to remain clearly connected to the relevant views and features.

## Understand annotative behaviour before relying on it

An **annotative object** supports size representations associated with selected annotation scales. This can help a note appear at a consistent paper size in differently scaled views without manually creating unrelated copies.

The relevant scales must be assigned and the viewport arrangement must be understood. Autodesk's [guide to annotative objects and styles](https://help.autodesk.com/cloudhelp/2022/ENU/AutoCAD-Core/files/GUID-6D4A620B-30AB-4593-B168-F9FF084017C6.htm) explains that an object's scale assignments affect its display. An annotation that appears absent may have a scale-setting issue rather than having been deleted.

Test the method in the actual views the drawing will use. Confirm that the note is visible, readable and suitably placed in each one. A representation that works in an overall view may overlap geometry in a detail.

Do not solve every visibility problem by adding more copies. First inspect the object type, scale assignments, layer state and viewport settings. Duplicated notes can later disagree when one is revised and another is overlooked.

## Make leaders unambiguous

A **leader** is a line or set of lines connecting explanatory content to a feature. A **multileader** combines related leader and content elements in an organised object. Its usefulness depends on a clear connection between the words and the intended target.

Place the arrow or endpoint where the meaning is unambiguous. A leader ending near several edges can leave the reader unsure whether the note applies to a face, hole, corner or whole component. Review it from the recipient's perspective rather than assuming familiarity with the design.

Avoid crossing leaders where a different arrangement can provide a clearer path. Keep enough separation between notes and geometric linework to distinguish explanation from the represented object. Clarity is more valuable than fitting every note into the nearest gap.

When several features share one note, verify that the statement applies to all of them. Multiple leaders can reduce repeated text, but they can also conceal an exception. The shared wording must remain accurate after later design changes.

## Use tables for repeated structured information

A **table** organises information into rows and columns with a defined relationship. It is useful when readers need to compare repeated entries or find a value by identifier. It is less useful for unrelated notes that happen to occupy the same area.

Use a table object and a suitable table style rather than drawing a grid and positioning many unrelated text objects, where the software and exchange requirements allow it. Coherent table structure makes row changes and consistent formatting easier to maintain.

Define each column clearly, including units where required. A heading such as size may be ambiguous if entries mix diameter, width and overall length. Prefer labels that tell the reader what the value represents.

Check identifiers against the drawing. A beautifully formatted schedule is still wrong if a row refers to a feature that has been renamed or removed. When data is entered manually, treat the table and the geometry as two sources that must be kept in agreement.

## Use hatching to communicate a defined distinction

**Hatching** fills a bounded area with a pattern or other fill. It can distinguish regions, represent a section convention or support a particular drawing explanation. Its meaning depends on the project's agreed notation.

Do not assume that a pattern name establishes a material specification. A hatch may be symbolic, while another pattern may deliberately represent a physical arrangement. Make the intended meaning clear through the drawing convention or legend where needed.

Choose a density that remains readable at the intended output size. Excessively dense hatching can become a dark mass, hide edges and compete with dimensions. Very sparse hatching may fail to distinguish a small region.

Use angle and pattern changes only where they clarify a meaningful difference. Decorative variation creates additional information for the reader to interpret. If two areas need to be distinguished, explain why rather than relying on a visual difference with no stated meaning.

## Check hatch boundaries and internal regions

A **hatch boundary** defines the area to be filled. The boundary needs to represent the intended region reliably. Small gaps, overlaps or unwanted internal objects can cause the software to identify a different area from the one expected.

Inspect the boundary preview before accepting the hatch. Confirm whether holes or internal regions should remain unfilled and whether the chosen detection method treats them appropriately. A filled opening can make a drawing communicate the opposite of the intended geometry.

Where a hatch is associated with its boundary, test its behaviour after an edit. Association can help maintain the relationship, but it is still necessary to check the result when objects are replaced or boundaries are changed substantially.

Do not hide a geometry defect by choosing a setting that merely makes the hatch appear successful. If the same boundary will support another operation, an unresolved gap may still matter. Repair the underlying geometry when that is the actual problem.

## A worked example of a prototype review sheet

This is an illustration. A product team prepares a review sheet containing an overall panel view at 1:5 and a detail at 1:1. Model and paper units are millimetres. The team chooses a 3-millimetre paper text height for this internal review, subject to checking the output's readability.

With non-annotative model-space notes, the overall view would need text 15 millimetres high: 3 multiplied by 5. The full-size detail would need text 3 millimetres high. If the team instead uses an annotative style, it must assign and test the two relevant scales rather than manually applying those heights indiscriminately.

The sheet contains four feature notes and a small table identifying three open decisions. Each decision has a unique reference, a brief question and an owner. The table is clearly labelled as review information, so the unresolved items are not mistaken for approved instructions.

Two regions use hatching to distinguish the areas being discussed. The legend explains the distinction without assigning an unconfirmed material. An opening inside one region remains unfilled, and the team checks that the hatch boundary correctly excludes it.

| Review check | Intended result |
| --- | --- |
| Overall-view text | Readable at the chosen output size |
| Detail-view text | Consistent paper size and clear placement |
| Leaders | Each note identifies its intended feature |
| Decision table | Three references match the marked items |
| Hatch | Discussed regions are distinct and openings remain clear |

After exporting the sheet, the team opens the PDF in a separate viewer and inspects it at a realistic reading size. One note overlaps a leader after wrapping, so its width and position are revised. The drawing is clearer because the output was checked, not simply because styles were applied.

## Review wording independently of formatting

Spell checking can catch typing mistakes, but it cannot establish whether a technical statement is correct. Review identifiers, units, references and the status of each instruction separately from typography.

Watch for copied notes that retain an earlier project's assumptions. A familiar sentence can appear authoritative while naming the wrong material, finish or revision. Reuse the structure of a useful note, but verify its content against the current requirements.

Remove contradictions between general and local notes. If a local exception is intentional, make the relationship explicit through the agreed drawing convention. Do not leave the reader to decide which conflicting statement has priority.

Ask someone unfamiliar with the immediate drafting work to read a representative sheet. Their questions can reveal ambiguous leaders, unexplained abbreviations and missing context that the author no longer notices.

## Keep annotation maintainable during revisions

Place annotation on appropriate layers and use consistent styles so that changes can be managed deliberately. [Organising CAD drawings with layers and properties](/reados/collections/cad-drafting-and-drawing-standards/organising-cad-drawings-with-layers-and-properties/) explains how organisation supports both editing and presentation.

When geometry changes, review nearby notes, tables, leaders and hatches together. An automatic update to one object does not guarantee that a manually written statement remains correct. The whole explanation must still match the revised design.

Avoid shrinking all text to solve a crowded sheet. Consider another detail view, a different note arrangement or a further sheet where appropriate. A drawing that contains all required words but cannot be read has not communicated them successfully.

Keep the intended output conditions visible in the review. A sheet may be legible on a large monitor but unsuitable when printed smaller. Confirm the expected distribution size rather than assuming that recipients will always zoom in or use the largest available printer.

## Questions to ask

- Which uncertainty does each note or pattern resolve?
- Is the annotation method consistent across the drawing?
- Do leaders identify their intended features without guesswork?
- Are table entries, units and identifiers current?
- Does hatching distinguish the intended regions without obscuring geometry?
- Has the actual exported or printed sheet been checked for meaning and readability?

## Bringing it together

Clear annotation combines accurate wording with deliberate presentation. Use styles, suitable text objects, leaders and tables to keep information coherent, then use hatching only where it communicates an understood distinction.

Judge the result on the sheet the reader will receive. Readability, correct references and consistent meaning matter more than how attractive the drawing looks while being edited. A short output review helps reveal problems that the drafting view can conceal.

---
*Source: David Byrnes, AutoCAD 2011 For Dummies (2010), primarily chapters 13 and 15; Autodesk documentation linked above. Examples and text heights are illustrations, not prescribed drafting standards. Check software behaviour and project requirements before applying settings.*
