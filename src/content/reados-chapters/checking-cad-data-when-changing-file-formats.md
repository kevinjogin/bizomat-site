---
title: "Checking CAD data when changing file formats"
description: "Check what survives when CAD information moves between applications, including geometry, units, object structure, appearance and links to its source."
publishDate: 2026-10-05
category: "Technology"
tags:
  - design
  - validation
  - systems
author: "KEVOS®"
featured: false
draft: false
---

A drawing can look correct after export while losing information that the next person needs. Curves may arrive as different object types, dimensions may no longer behave as expected, or a picture may be mistaken for editable geometry. Successful opening proves that an application accepted a file; it does not establish that the intended information survived.

Alf Yarwood's *Introduction to AutoCAD 2011: 2D and 3D Design* explores moving drawings between applications through interchange files, images and document connections. The lasting lesson is to define what must be preserved before choosing a format. For computer-aided design, or **CAD**, a useful exchange is one that supports the receiving task with known, checked limitations.

## Begin with the receiving task

Ask what the recipient will do next. Viewing a concept, editing an outline, preparing a technical document and using geometry in another design system require different information. Choosing a format before identifying that task can lead to unnecessary conversion or a result that is visually useful but operationally unsuitable.

Write a short **exchange requirement**: a statement of what the transfer must preserve. It might require full-size planar outlines, separate layers and circular holes that remain editable circles. Another task might require only a legible illustration at a known document size.

Identify which information is optional. Construction geometry, internal notes or detailed visual materials may not be needed for the agreed purpose. Deliberately excluding them can simplify the exchange, provided the recipient understands the scope and the maintained source remains available.

Agree how success will be checked. A visual comparison may suit a document illustration, while an editable outline needs measurements and object inspection. The check should follow the receiving task rather than the convenience of whichever preview is easiest to open.

## Distinguish geometry from an image of geometry

**Vector geometry** describes elements such as lines, curves and their defining properties. A **raster image** describes a picture through pixels. Both can show a drawing, but they carry different kinds of information and support different kinds of editing.

A raster picture of a circle does not contain the same definition as a CAD circle with a centre and radius. Increasing the picture's size enlarges its pixels; it does not recover the original geometric definition. Tracing it creates new geometry that needs its own accuracy checks.

Likewise, a vector illustration is not automatically equivalent to the original CAD model. It may contain paths that preserve visible appearance without preserving dimensions, blocks or design relationships. The presence of smooth edges alone does not establish that the recipient has the intended editable structure.

Use an image when an image serves the task. It can be appropriate for a report or an early visual discussion. Label it accordingly and provide separate geometry where the recipient needs to measure, edit or process the design.

## Understand what an interchange format provides

An **interchange format** is intended to transfer information between applications. DXF, or **drawing interchange format**, is one example used for drawing data. Yarwood demonstrates exporting and reopening a drawing through DXF as a bridge between CAD environments.

Autodesk's [DXF import and export guide](https://help.autodesk.com/cloudhelp/2023/ENU/AutoCAD-LT/files/GUID-11AEFE3C-D05A-45C3-8604-7B6A594440F3.htm) describes the format as a way to transfer drawing data and notes that either a whole drawing or selected objects can be exported. The practical implication is to check the actual export scope as well as the filename extension.

Confirm the supported format version and object types with the receiving application. A broad statement that a program supports DXF does not explain every detail of its importer. Special objects and application-specific behaviour need particular attention.

Keep the original native file as the maintained source unless the project deliberately adopts a different arrangement. An exchange copy serves a purpose at a particular point in the workflow. It should not silently replace the source merely because the conversion appeared to succeed.

## Define the information that must survive

Break the exchange requirement into observable checks. Start with the overall geometry, units and orientation. Then consider object structure, layer organisation, annotations and any relationships that are important to the next edit.

| Information | Example check | Why it matters |
| --- | --- | --- |
| Size | Measure a known overall length | Detects unit or scale problems |
| Position | Inspect a known origin and feature coordinate | Detects placement changes |
| Shape | Inspect circles, arcs and closed boundaries | Detects unsuitable representation changes |
| Organisation | Review required layers or component groups | Supports selection and editing |
| Annotation | Compare dimensions, symbols and text | Preserves intended communication |

```figure
type: checklist
title: What must survive a format change
caption: An imported note saying 200 mm does not prove the outline measures 200 mm.
- x Size | a known overall length
- x Position | origin and a feature coordinate
- x Shape | circles, arcs, closed boundaries
- x Organisation | layers and groups
- *x Annotation | dimensions, symbols, text
```

Do not require every source property to survive if the receiving task does not use it. That can create needless restrictions. Instead, make essential properties explicit and record acceptable changes, such as a deliberate simplification made for a particular downstream operation.

An object count can help diagnose a difference, but it is not a universal acceptance test. One source object may become several valid receiving objects, or several source objects may be combined. Judge that change against the intended structure rather than assuming every count difference is a defect.

## Prepare a representative trial

Before exchanging a large project, choose a small sample containing the kinds of information that matter. Include representative curves, closed outlines, text, dimensions and any special content expected in the real delivery. A sample containing only simple lines may give false confidence about a more complex file.

Record a few known measurements and the intended units. These form an independent reference for checking the imported result. Avoid relying solely on dimensions displayed in the drawing, because those annotations themselves may be affected by conversion.

Use the actual export and import settings intended for the project. A successful test with a different format version or conversion option does not necessarily establish that the final exchange will behave the same way. Keep a concise record of the settings that produced an acceptable result.

Ask the receiving person to perform the intended operation, not just open the file. If the task requires editing a circle diameter, test that edit. If it requires selecting a closed boundary, inspect whether the boundary is recognised in the receiving environment.

## Check units and coordinates before appearance

A file can fill the screen at almost any scale, so visual size is a weak check. Measure a known reference after import and compare it with the stated unit convention. A difference of a thousand may indicate a metre-to-millimetre interpretation problem, but the cause still needs investigation.

Check orientation and position separately. A shape may have the correct dimensions while arriving rotated or displaced. That matters when the geometry will be combined with another drawing or positioned relative to a shared reference.

Inspect elevation where planar geometry is required. An outline that looks flat from above can contain points at different heights. The receiving operation may reject it or produce an unexpected result even though a top-view screenshot looks correct.

Do not correct an unexplained discrepancy by repeatedly applying scale factors. Establish which side of the exchange interpreted the units differently, then fix the controlled process. An undocumented local adjustment can hide a problem that will recur in the next file.

## Inspect curves and boundaries

A **closed boundary** forms a complete loop without an unintended gap. Some receiving tasks depend on that structure. The visible endpoints may appear connected at the current zoom level while remaining separate in the stored geometry.

Check critical joins and the receiving application's interpretation of the loop. If the task needs a single closed object, a visually identical group of separate lines may be insufficient. If the task accepts separate segments, their continuity and organisation may still need review.

Inspect curved features by both measurement and object type. A circle represented by many small straight segments may appear smooth at ordinary scale while behaving differently when edited. Whether that representation is acceptable depends on the next operation and the required accuracy.

Keep export precision separate from the quality of the original design information. Writing more decimal places cannot repair an inaccurate source outline. The transfer should preserve suitable information, not manufacture an appearance of precision beyond what the source supports.

## Review text and dimensions as communication

Text can change appearance when a receiving environment uses different fonts or handles text structure differently. Check symbols, line breaks and crowded notes. A substituted character in a diameter callout can matter more than a modest visual difference in the title block.

Inspect dimension values and their references. A converted dimension may look right while losing the behaviour needed for later editing. If the receiving task depends on dimensions updating with geometry, test that relationship rather than accepting the initial appearance.

Distinguish an annotation from the geometric measurement it describes. An imported note stating 200 mm does not prove the outline measures 200 mm. Check both, especially where a conversion or unit interpretation could produce a plausible but inconsistent result.

Use a checked published view as a visual comparison where helpful. It can show the intended annotation and presentation, but it should accompany rather than replace the geometric checks required for editable data. Each form provides evidence about a different part of the exchange.

## Keep links and embedded copies distinct

**Object linking and embedding**, or OLE, provides ways for supporting applications to use information from another document. A linked object refers to its source, while an embedded object stores a copy within the destination. Those arrangements have different update and dependency implications.

Autodesk's [OLE overview](https://help.autodesk.com/cloudhelp/2021/ENU/AutoCAD-Core/files/GUID-8D74BAD2-B564-4C7C-A732-8AB0FC271155.htm) explains that an embedded copy does not follow later source changes. A link requires continued access to the relevant source and supporting application, with updating behaviour determined by the setup.

Decide whether the destination should remain connected to ongoing work or preserve an identified issue. Test that behaviour with a small, reversible source change. Do not assume that something pasted into a document will update simply because it originally came from a CAD application.

The source also demonstrates a desktop-publishing file-link workflow. Treat that as an example of a dependency, not proof that every linked illustration uses the same mechanism. Check the actual destination application's method instead of using linking and embedding as interchangeable terms.

## Make document illustrations traceable

When a drawing appears inside a report, record which drawing revision and export produced it. A clear caption or nearby note can connect the illustration to its purpose. This becomes important when the report and the CAD source are updated on different schedules.

Inspect cropping and proportions after placement. Resizing a picture differently in horizontal and vertical directions can distort the represented object. Cropping may remove an important note or a feature that explains the visible geometry.

Choose an output suitable for the final reading size and the receiving application. The source's older publishing applications and export options are historical examples, not a current compatibility list. Confirm support before building a repeated workflow around a particular format.

If a linked illustration is intended to update, verify that the link points to the intended issue rather than a similarly named working export. If a fixed illustration is intended, retain the exact output used. The important distinction is whether change is controlled and visible to the document's author.

## Test an outline transfer with independent checks

This is an illustration. A founder needs to transfer a planar panel outline to another CAD application. The panel is 200 mm wide and 120 mm high, with four circular openings of diameter 10 mm. Their centres are 20 mm from the nearest outer edges.

The source uses millimetres. The founder records the overall dimensions, the four hole centres and the requirement for closed boundaries. The source is exported using the format version agreed with the recipient, and the recipient opens it in the application intended for the next task.

The imported width measures 0.2 in the receiving drawing, which is configured in metres. That may represent the correct physical length: 0.2 metres equals 200 mm. The teams establish the receiving unit convention before deciding whether any scaling correction is needed.

The hole centres are then checked in that same convention. Their horizontal separation is 160 mm, or 0.16 metres, and their vertical separation is 80 mm, or 0.08 metres. Their diameter should be 0.01 metres. Consistent conversion across these measurements supports the unit interpretation.

```figure
type: compare
title: Checking a transferred panel outline
cols: Source in mm | Receiving drawing in metres
caption: 0.2 is correct if the receiving unit is metres; establish the convention before judging the numbers.
- Width | 200 | 0.2
- Horizontal hole spacing | 160 | 0.16
- Vertical hole spacing | 80 | 0.08
- *Hole diameter | 10 | 0.01
```

Next, the recipient checks that the four openings remain suitable editable circles and that the outer outline is closed. Those checks are separate from the correct overall size. A file can pass the measurement test and still fail the object-structure requirement.

Finally, the recipient performs a trial edit and confirms that the intended operation works. The result is recorded with the export and import settings. The example demonstrates a transfer check, not approval of the panel design or suitability for a manufacturing process.

## Use a return transfer selectively

A **round-trip check** exports information, imports it into the receiving system and transfers it back for comparison. It can reveal changes that are difficult to identify in a single direction. Use it when the project expects repeated movement between systems or when preservation requirements are demanding.

Compare the returned result with the original source in a controlled way. Check known measurements, important object types and the information needed for the next edit. Do not allow the returned file to overwrite the maintained original during the trial.

A successful round trip is useful evidence but not a guarantee about every file. The sample may not contain all the object types used later, and both conversions may preserve appearance while changing a relationship that was never tested. Record what the check actually covered.

For one-way transfers, a receiving-system check may be more relevant than a return transfer. Choose the verification that tests the real task. More conversions can introduce additional changes without providing useful evidence if the workflow never requires them.

## Make exceptions visible to the next person

If a property cannot be preserved, describe the limitation and its consequence. A note that dimensions are provided for reference only is different from a claim that they remain associated. Clear language helps the recipient choose an appropriate review and editing method.

Keep accepted exceptions with the delivery record. Otherwise, a later person may interpret a deliberate simplification as complete source information. When the intended use changes, revisit the exception rather than assuming the earlier acceptance applies to every task.

For a small Australian business, a repeatable trial file and a short exchange note can reduce repeated uncertainty. Combine them with the packaging checks in [Preparing CAD files for a reliable handover](/reados/collections/cad-drafting-and-drawing-standards/preparing-cad-files-for-a-reliable-handover/). Conversion checks establish what survived; packaging checks establish whether the recipient received what is needed to use it.

## Questions to ask

- What will the receiving application and person do with the information?
- Is the transfer carrying editable geometry, a picture or a linked resource?
- Have units, orientation and important coordinates been checked?
- Are curves, boundaries and dimensions suitable for the next operation?
- Is update behaviour deliberate and tested?
- Which limitations belong in the delivery record?

## Bringing it together

File conversion should be judged against an explicit receiving task. Establish what must survive, test representative information and inspect the imported result beyond its initial appearance.

Keep source files, exchange copies and document illustrations identifiable. That makes differences easier to diagnose and gives the next person a clearer basis for deciding what the transferred information can support.

---
*Source: Alf Yarwood, Introduction to AutoCAD 2011: 2D and 3D Design (2010), primarily chapter 10; Autodesk documentation linked above. Dimensions and transfer events are original illustrations. Verify format support and object behaviour in both applications; successful conversion does not establish design suitability.*
