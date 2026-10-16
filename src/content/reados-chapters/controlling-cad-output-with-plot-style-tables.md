---
title: "Controlling CAD output with plot style tables"
description: "Understand colour-dependent and named CAD plot styles, build a clear line hierarchy and diagnose output differences before changing shared plotting settings."
publishDate: 2026-10-05
category: "Technology"
tags:
  - design
  - systems
  - validation
author: "KEVOS®"
featured: false
draft: false
---

A drawing's screen colours do not necessarily describe its final printed appearance. A green line may plot as a heavy black outline, while two objects that look identical in the editor may produce different output. When those rules are unclear, people often change object properties repeatedly without finding the actual cause of the plotting problem.

George Omura's *Mastering AutoCAD 2011 and AutoCAD LT 2011* gives plot styles their own detailed treatment. For computer-aided design, or **CAD**, the central idea is to manage the translation from drawing properties to output deliberately. A useful plotting arrangement makes visual priorities clear and can be reproduced when the drawing moves to another computer.

## Separate geometry, display and output

**Geometry** defines positions and shapes. Display properties help you work with that geometry in the editor. Output settings determine how it is presented on a sheet or in an exported document. These layers of control are related, but changing one does not necessarily change the others.

A **plot style** controls selected plotted properties, such as colour, lineweight and screening. A **plot style table** collects those rules in a file used by an output arrangement. It can preserve an object's own property or override it for plotting.

For example, changing a plot style so that a colour prints black does not require the underlying drawing objects to become black in model space. That separation can support a useful editing display while producing a consistent monochrome issue.

Keep the distinction visible when diagnosing problems. A line that plots too heavily may have the correct geometry and an appropriate layer. The cause may sit in the selected plot style rather than in the object itself.

## Understand colour-dependent plot styles

A **colour-dependent plot style table**, stored as a CTB file, uses indexed drawing colours to determine plotted properties. Under this arrangement, colour can act as part of the output rule as well as a visual aid in the editor.

If a particular indexed colour maps to a specified black lineweight, eligible objects using that colour follow that rule when the table is applied. This can work well when the team already uses a stable colour convention and understands its relationship to output.

The implication is that changing a colour for convenience can change printed meaning. A drafter who makes an outline easier to see on a dark background may unintentionally alter its lineweight. The colour convention therefore belongs in the drawing setup and review process.

Document the mapping by purpose. A short reference connecting principal outlines, secondary detail and background information to their assigned properties is more useful than a list of unexplained colour numbers. The goal is a repeatable hierarchy, not merely a familiar palette.

## Understand named plot styles

A **named plot style table**, stored as an STB file, contains styles assigned by name to layers or objects. This allows plotted behaviour to be specified independently of the object's screen colour. Names can describe output roles such as primary outline or background reference.

The flexibility comes with another property to maintain. An object may have a suitable colour while carrying an unintended plot style. Direct object assignments can also differ from the style associated with its layer, so the property source needs to be understood.

Use names that express purpose rather than only a numerical setting. A style called Primary outline is easier to interpret than a collection of unrelated numbered styles, provided its use is clearly defined. The actual lineweight and other properties remain part of the documented definition.

Autodesk's [plot style table documentation](https://help.autodesk.com/cloudhelp/2026/ENU/AutoCAD-Core/files/GUID-2FD01085-DDD8-49D2-A910-E63EA45A7FED.htm) explains the distinction between colour-dependent and named arrangements. Choose the method that fits the project's conventions and exchange requirements rather than treating either method as universally superior.

## Choose an arrangement before changing the library

Inspect how the drawing is already configured. A drawing uses one plot-style type at a time, and a table of the other type is not simply an interchangeable preset. New-drawing defaults also do not retroactively change the plotting method of every existing file.

Check the relevant templates, layouts and received-file requirements. A small team may have a consistent internal convention while also receiving files prepared for another one. Preserving a received arrangement can be more appropriate than converting it immediately for convenience.

Define the intended outputs. A working colour PDF, a monochrome issue and a presentation sheet may need different tables or page setups. Give those outputs clear identities so the selected arrangement can be checked before publishing.

Avoid editing a shared table while trying to fix one unusual drawing. A table can be used by several projects, so a local-looking change may affect their future output. First establish whether the issue belongs in the drawing, its page setup or the shared definition.

## Build a small visual hierarchy

**Lineweight** is the plotted thickness of a line. A useful hierarchy gives more emphasis to important outlines and less to supporting information. It should help a reader distinguish the drawing's structure without requiring colour perception or close inspection of every line.

Choose a small number of meaningful roles. Principal outlines, secondary detail, dimensions and background references may be enough for a simple drawing. Additional variations should communicate a useful distinction rather than merely demonstrate the range of available settings.

Check intersections and closely spaced lines. A heavy lineweight can merge small details or obscure a narrow opening. A fine line can disappear at a reduced output size or on a printer that reproduces light marks poorly.

Keep the hierarchy connected to object meaning. A line should not become prominent merely because it happened to inherit a colour used by a different category. Review representative geometry from each role when preparing the table.

## Use screening and greyscale deliberately

**Screening** controls the intensity with which a style is plotted. It can reduce the prominence of background information while leaving primary content easier to read. The useful setting depends on the output medium, lineweight and surrounding content.

**Greyscale** converts colours into shades of grey. It serves a different purpose from assigning every selected style to black. Two screen colours can become similar grey tones, which may remove a distinction the drafter relied on while editing.

Do not assume that a screen preview gives a precise prediction of paper appearance. Printer behaviour, paper and reproduction can affect light lines and fills. Inspect the actual medium where the drawing is intended to be used.

Use screening to support hierarchy, not to hide unresolved content. If information is superseded or excluded from an issue, manage that status explicitly. Making it faint can leave readers uncertain whether it is still part of the design.

## Preserve useful object properties where possible

Plot styles can override more than colour and lineweight. The book discusses linetype, end treatment, joins and fill-related controls. Each override adds another place where output may differ from what the drawing properties suggest.

Change only the properties needed for the intended output rule. If an object's linetype carries meaning, an unnecessary plot-style override can erase that meaning. Keeping suitable properties under their existing control makes the overall arrangement easier to diagnose.

Check direct overrides and nested block content. A layer may have the expected colour or style while an object inside a block uses a different property. Inspect the actual content responsible for the unexpected output instead of repeatedly changing the insertion layer.

Be particularly careful with True Color values in a CTB workflow. Autodesk documents that RGB colours can bypass the expected indexed-colour mapping in its [monochrome plotting guidance](https://www.autodesk.com/support/technical/article/caas/sfdcarticles/sfdcarticles/Plotting-True-Color-objects-in-monochrome.html). A line that looks like a familiar indexed colour may therefore plot differently.

## Create a representative output test

A **test sheet** collects examples that reveal whether an output arrangement behaves as intended. Include actual categories of objects from the project rather than only a row of long horizontal lines. The test should expose the cases most likely to become unclear.

Use short lines, close parallel lines, corners, curves, text, dimensions and hatched areas. Include any relevant block content and reference information. A table that handles isolated geometry well may still produce an unreadable dense detail.

Show the intended role beside each sample so the review has a clear reference. Record the plot table, page setup, output size and device or PDF configuration. Without that context, a successful sample is difficult to reproduce later.

Inspect both overall hierarchy and local legibility. The main outline should be apparent at a normal reading distance, while small details should remain distinguishable when read closely. Avoid approving output solely at a magnification that nobody will use on the finished sheet.

## Work through a three-role plotting arrangement

This is an illustration. A small Australian product business is preparing monochrome concept sheets. It chooses three trial roles: primary outline at 0.50 mm, secondary detail at 0.25 mm and background reference at 0.18 mm. These are hypothetical choices to test, not prescribed drafting standards.

The primary line is twice the nominal thickness of the secondary line because 0.50 divided by 0.25 equals 2. That arithmetic describes the setting, but it does not guarantee that readers perceive exactly twice the emphasis. The team still needs to inspect a representative output.

| Role | Trial plotted lineweight | Intended purpose |
| --- | --- | --- |
| Primary outline | 0.50 mm | Establish the main shape |
| Secondary detail | 0.25 mm | Explain smaller features without dominating |
| Background reference | 0.18 mm | Provide context behind the proposed content |

In a CTB trial, the team assigns agreed indexed colours to those roles and maps them through the table. In an STB trial, it assigns named styles to the relevant layers. It uses separate test drawings appropriate to each method rather than assuming both table types can be applied interchangeably to one drawing.

The samples show a narrow feature becoming difficult to read with the 0.50 mm outline on both sides. The team reviews whether the role assignment or the chosen weight needs adjustment. It does not reduce the physical geometry to make the lineweight problem disappear.

One received symbol continues to plot in colour under the monochrome CTB trial. Inspection finds an RGB colour inside the block. The team decides how that content should be represented, corrects the property in a working copy and repeats the output check.

The selected arrangement is then tested with a full concept sheet. The team checks the final PDF at its intended size and produces a paper sample if paper forms part of the workflow. It retains the accepted sample with the table revision so later changes can be compared against a known result.

## Diagnose differences from the output backwards

Start with the actual output file or sheet that is wrong. Confirm which layout, page setup and plot table produced it. A familiar filename is not enough if several copies of the table exist in different support locations.

Next confirm that plotting with styles is enabled and that the intended table is available. Review output settings affecting the viewport or shaded presentation. If only some objects differ, inspect their effective colour, style and nested properties rather than immediately changing global settings.

Change one likely cause at a time and regenerate the relevant sample. This preserves the connection between a correction and its result. Several simultaneous changes may improve the output while leaving the actual explanation unclear.

Keep scale problems separate from appearance problems. A correctly weighted line can still be shown at the wrong drawing scale. [Checking CAD layouts and plot scale before issue](/reados/collections/cad-drafting-and-drawing-standards/checking-cad-layouts-and-plot-scale-before-issue/) explains the related page and viewport checks.

## Treat conversion as a controlled migration

Converting between plotting methods changes how output rules are assigned. It should be tested on a copy with a reference output available. The objective is to preserve intended meaning and appearance, not simply make another file extension available in a selection list.

Autodesk distinguishes converting a colour-dependent table through CONVERTCTB from changing the drawing's style mode through CONVERTPSTYLES. Its [conversion guidance](https://help.autodesk.com/cloudhelp/2022/ENU/AutoCAD-LT/files/GUID-922028F0-C2E2-4203-96D7-C7BCB0D4D9C2.htm) describes these separate steps. Follow the supported procedure for the installed version and inspect the resulting assignments.

Compare every affected layout that will be issued. A successful test on one sheet may not cover a different reference, object override or viewport arrangement elsewhere. Retain the original drawing and table until the revised output has been reviewed adequately.

Document why the migration was made and what the team should use for future drawings. Without that decision, new work may continue to arrive through the old templates and recreate the same inconsistency. A plotting-method change belongs with template and library maintenance.

## Keep shared tables identifiable

Use controlled copies of accepted tables and give changes a clear revision record. When a new version alters appearance, retain a sample output that demonstrates the difference. This makes it possible to understand why a later plot differs from a historical issue.

Include necessary plotting information when editable drawings are handed over. A recipient should also have a reference PDF showing the intended appearance. [Preparing CAD files for a reliable handover](/reados/collections/cad-drafting-and-drawing-standards/preparing-cad-files-for-a-reliable-handover/) describes how to review those dependencies as part of the package.

For a small team, one maintained sample sheet and a short role-to-property reference can provide useful control. Keep the arrangement understandable enough that a drafter can diagnose an exception without rewriting the entire table.

## Questions to ask

- Is the drawing using colour-dependent or named plot styles?
- Which properties come from the object, layer and selected plot table?
- Does the hierarchy remain readable at the intended output size?
- Are unexpected colours or weights caused by overrides, nested content or a different table copy?
- Has a shared-table change or conversion been checked against representative layouts?

## Bringing it together

Plot style tables turn drawing properties into a controlled visual result. Choose a clear assignment method, keep the hierarchy modest and test realistic content at its final reading size. Diagnose differences through the full output path and maintain shared tables as identifiable project dependencies.

---

*Source: George Omura, Mastering AutoCAD 2011 and AutoCAD LT 2011 (2010), Chapter 9; Autodesk documentation linked above. Lineweights are illustrative choices, not prescribed standards. Verify output using the intended drawing, software, page setup and output device.*
