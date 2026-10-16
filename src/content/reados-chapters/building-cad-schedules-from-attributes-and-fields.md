---
title: "Building CAD schedules from attributes and fields"
description: "Build drawing schedules from defined attributes and linked geometry, with checks for units, copied references, extraction scope and updates before issue."
publishDate: 2026-10-05
category: "Technology"
tags:
  - design
  - systems
  - validation
  - process-improvement
author: "KEVOS®"
featured: false
draft: false
---

A drawing may show a room correctly while the area beside its name still describes an earlier layout. A separate schedule can preserve the same old value, even after someone fixes the label. When geometry, labels and tables are maintained independently, each change creates several opportunities for the information to drift apart.

Donnie Gladfelter's *AutoCAD 2011 and AutoCAD LT 2011: No Experience Required* develops a useful alternative: attach structured information to drawing objects, use fields for values derived from geometry, and extract selected information into tables. For a small business using computer-aided design, or **CAD**, the practical benefit depends on understanding those connections and checking where they can fail.

## Give each piece of information a defined home

A **schedule** is a structured list describing selected items in a drawing, such as spaces, equipment or components. Its rows should represent a clearly defined population. A space schedule might contain one row per named space; a component summary might combine identical items and show quantities instead.

An **attribute** is a named piece of information associated with an inserted block. A **block** is reusable drawing content, and each inserted instance can carry its own attribute values. A location marker could therefore contain an identifier, description and finish without requiring three unrelated text objects.

A **field** displays information obtained from a specified source, such as an object's area. Placing an area field inside an attribute creates a connection between the geometric boundary and the label's data. It does not establish that the boundary represents the correct physical extent, or that every downstream table is current.

Decide where each value belongs before creating the schedule. Geometry can supply measured area. A person may need to assign a space name or finish. The schedule should then collect those values, rather than become another place where the same information is independently invented.

## Define the record before designing the label

An **attribute tag** identifies the kind of value being stored. The prompt is the question presented when someone supplies that value, while the default is the initial suggestion. These have different purposes: a stable tag helps extraction, a clear prompt helps entry, and a carefully chosen default reduces accidental acceptance of unsuitable information.

Write a small field definition before building the block. Specify what each tag means, whether it is required, who supplies it and how it will be checked. Avoid one ambiguous tag such as DESCRIPTION carrying a room name in one instance and a material specification in another.

| Information | Example tag | Intended source | Useful check |
| --- | --- | --- | --- |
| Space identifier | SPACE_ID | Assigned identifier | Unique within the schedule's scope |
| Space name | SPACE_NAME | Agreed description | Matches the marked space |
| Area | AREA_M2 | Field linked to a boundary | Correct object and conversion |
| Finish | FINISH | Entered classification | Uses the agreed vocabulary |

Treat identifiers as text when their characters matter. A code containing a leading zero is not a quantity to add. Conversely, an area intended for arithmetic needs a usable numeric representation. Decide how units will be displayed without allowing a suffix to become part of an unusable text value in the extraction workflow.

Defaults deserve particular care. A plausible room name or finish can survive unnoticed after copying. An obvious incomplete value may be more useful during drafting, provided the issue check reliably finds and resolves it. The right default is the one that makes missing decisions visible.

## Establish what the boundary measures

A **closed polyline** joins a sequence of segments into a closed boundary. The book uses these boundaries to obtain areas for spaces. The software can calculate a precise value from the selected object, but precision does not resolve an ambiguous measurement convention.

Record whether the boundary follows an internal face, an external edge or another agreed reference. Identify how openings, recesses and shared divisions are treated. The same room can yield different valid geometric areas when different boundaries are deliberately used, so a schedule heading should explain the intended basis.

Inspect the actual polyline, particularly where it overlaps wall lines or neighbouring boundaries. Use object selection tools to confirm that the selected object is the intended closed boundary. A highlighted shape can look convincing while a short omitted segment or an unintended detour changes the measured result.

Keep measurement boundaries identifiable during editing even if they are excluded from plotted output. Hiding them permanently makes the data harder to maintain. A reviewer should be able to reveal a boundary, compare it with the drawing and identify the label that refers to it.

## Convert area units as area units

Drawing coordinates have a chosen unit interpretation. If one drawing unit represents one millimetre, an area property is expressed in square millimetres. Changing the number of displayed decimal places does not convert that area into square metres.

One metre contains 1,000 millimetres, so one square metre contains 1,000 multiplied by 1,000 square millimetres. The area conversion is therefore a division by 1,000,000, or multiplication by 0.000001. Dividing by 1,000 applies only one dimension of the conversion and produces the wrong area.

Use a known rectangle to check the complete path from geometry to label. Measure its side lengths independently, calculate their product, then compare the converted result with the displayed field. A suffix reading m² is only a label; it cannot establish that the underlying conversion is correct.

Choose display precision for the purpose of the schedule. Retain sufficient numerical precision for calculations, then format the presentation deliberately. A total calculated from unrounded values can differ slightly from the sum of visibly rounded rows, so decide which convention the reader needs and apply it consistently.

## Check the source of every copied field

A field refers to a particular source. Copying the label's appearance does not prove that the new instance now refers to the neighbouring boundary. The book specifically demonstrates selecting a new area source when placing room information in different spaces.

After copying an attributed label, check its identifier, descriptive values and field reference separately. Changing SPACE_NAME alone is insufficient. Two differently named spaces can accidentally display the same area because both fields still read the first boundary.

A useful test is to change one boundary temporarily in a working copy and update its field. Confirm which label responds. This tests the connection directly, which is more informative than comparing two identical area values and assuming both references are correct.

If a boundary is replaced rather than edited, inspect its dependent field again. The new shape may occupy the same location without being the original referenced object. Repair the source relationship before accepting the displayed value, then repeat the known-change test where the consequence matters.

## Separate field updates from extraction updates

An **update chain** is the sequence through which a change reaches the final output. Here it runs from boundary geometry to field value, from field value to extracted data, and from extracted data to the issued table. Each connection needs an explicit check.

AutoCAD provides UPDATEFIELD to refresh selected fields. Automatic field evaluation also depends on drawing settings and field type; a regeneration should not be treated as proof that every value has refreshed. Autodesk documents the command in its [UPDATEFIELD reference](https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Core/files/GUID-2B47D62E-19D0-4CA5-9AAC-1946132D2F62.htm).

Updating a field is distinct from updating a data extraction. Refresh the source information first, save the relevant source drawings, then update the extraction and inspect its result. Autodesk's [guidance on updating extracted data](https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Core/files/GUID-A4B8BDF9-5DDA-48F6-B535-B8801A66871E.htm) also notes that external extracted files are not monitored for currency in the same way as drawing tables.

Make this sequence part of the issue routine. A table that updated successfully last week may still be wrong today. The useful evidence is that a known recent change appears correctly in the source label, schedule and final output being released.

## Define exactly what the extraction includes

**Data extraction** collects selected object properties and attribute values into a structured output. The book's wizard workflow separates source drawings, object types, selected properties and table arrangement. Keeping those decisions separate makes a schedule easier to understand and repeat.

Start with the source population. Specify which drawing files or selected objects belong in the extraction, and which block types represent eligible records. A training example, an abandoned option and a live design may contain identical block names while serving very different purposes.

Next select only the properties required for the schedule. Review the preview before formatting it. Missing identifiers, blank areas or unexpected block names are data issues to resolve at the source, rather than inconvenient rows to conceal in the finished table.

Grouping also changes meaning. Combining identical rows can be appropriate for a quantity summary, but inappropriate when every space requires its own identifiable row. Decide whether the count column represents physical instances or merely a consequence of how records were combined.

Feature availability matters here. The book covers both AutoCAD and AutoCAD LT, but its Data Extraction wizard is not available in LT. Autodesk identifies attribute extraction as an alternative in its [AutoCAD LT support guidance](https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Unknown-command-when-attempting-to-use-data-extraction-features-in-AutoCAD-LT.html). Confirm the supported workflow in your product and platform before designing a process around the wizard.

## Keep the table understandable and maintainable

A **table style** controls recurring presentation choices such as headings, borders and text. Apply it after the data structure is sound. Attractive formatting cannot repair an incorrect selection, a duplicate identifier or a value that has been converted twice.

Use headings that identify both the quantity and its unit. Keep codes, names and measured values in distinct columns. If a total is useful, make clear what it adds and whether every row is included. Test formulas on a small set where the expected answer can be checked independently.

Avoid repairing a derived schedule by typing over individual values without understanding the update behaviour. That creates an exception which may be overwritten later or remain inconsistent with the drawing. Correct the source attribute or field whenever that is where the information belongs.

Invisible attributes can help keep the drawing legible while retaining useful data for extraction. However, invisible does not mean confidential or absent from the file. Include only information suitable for the intended drawing recipients, and review extracted columns separately from the visible label.

## Work through a small space schedule

This is an illustration. A small Australian product business is comparing three proposed work areas in a concept layout. It wants a schedule of geometric areas for internal discussion. The example does not establish usable capacity, permitted occupancy or compliance with any building requirement.

The drawing uses millimetres, and each rectangular work area has a separate closed boundary. The agreed measurement basis is the inside edge shown in the concept drawing. Each label contains a unique identifier, a name and an area field linked to that space's boundary.

| Space | Boundary dimensions | Raw area in mm² | Displayed area in m² |
| --- | --- | --- | --- |
| A | 4,000 × 3,000 mm | 12,000,000 | 12.00 |
| B | 5,000 × 3,000 mm | 15,000,000 | 15.00 |
| C | 3,000 × 2,000 mm | 6,000,000 | 6.00 |
| Total | Three separate spaces | 33,000,000 | 33.00 |

During setup, the drafter copies A's label into B and changes its name. B still displays 12.00 because the field refers to A's boundary. The error is resolved by selecting B's actual boundary as the field source, updating the field and confirming the expected 15.00 result.

The proposed width of B then changes from 5,000 to 5,500 mm. Its area becomes 16,500,000 mm², or 16.50 m². The total becomes 34.50 m², an increase of 1.50 m². These simple numbers provide a check that the update has reached every stage.

The reviewer first checks the changed boundary dimensions. Next they refresh the field and confirm B's label reads 16.50. They save the source, update the schedule and verify that the three identifiers occur once each and the total reads 34.50. Finally, they inspect the exported sheet to confirm that it shows the same information.

Suppose the extraction also includes a copied option layout containing another A label. A total alone may not reveal the cause of the problem. Reviewing identifiers and the included source drawings exposes the extra record. The correction belongs in the extraction scope, not in a manually reduced total.

## Make a small business process repeatable

Begin with one modest schedule rather than trying to catalogue every property available in the drawing. Choose information that someone will actually use, and write its definitions beside the extraction procedure. Add fields only when their purpose and maintenance responsibility are clear.

Assign responsibility for the boundary, entered attributes and final schedule review. One person may perform all three roles in a small team, but the checks still differ. A correct boundary does not establish that a finish is approved, and a correct finish does not establish that the published table is current.

Retain the extraction settings with the project information needed to reproduce the schedule. The 2011 book uses DXE settings files; later releases may use different formats. Record the actual product version and file arrangement you have tested instead of assuming a historical filename convention applies unchanged.

The underlying block design is covered in [Building reusable CAD blocks that stay consistent](/reados/collections/cad-drafting-and-drawing-standards/building-reusable-cad-blocks-that-stay-consistent/). Where schedules are transferred to other applications, [Checking CAD data when changing file formats](/reados/collections/cad-drafting-and-drawing-standards/checking-cad-data-when-changing-file-formats/) provides a related framework for checking that meaning survives the transfer.

## Questions to ask

- What does one row represent, and which source objects belong in the schedule?
- Are identifiers unique and attribute meanings consistent?
- Does each field refer to the intended boundary with the correct units?
- Has a known change reached the label, extracted table and issued output?
- Can another person reproduce the schedule using the saved sources and settings?

## Bringing it together

A dependable drawing schedule starts with clearly defined information and traceable sources. Attributes identify and describe items, fields connect suitable values to geometry, and extraction brings selected records together. Checking the entire update chain turns those features into a maintainable process.

---

*Source: Donnie Gladfelter, AutoCAD 2011 and AutoCAD LT 2011: No Experience Required (2010), principally Chapter 9; Autodesk documentation linked above. Figures are illustrations, not project data. Software features vary by product, platform and release; verify the workflow in your installed version.*
