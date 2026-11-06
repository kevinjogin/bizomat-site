---
title: "Layouts That Plot to Scale"
subtitle: "Model space, paper space and the arithmetic of scale: viewports, text, dimensions, linetypes, line weights, PDF output and drawing sets"
description: "Set up CAD layouts that print true to scale: viewport factors, text heights, dimension and linetype scales, line weights, PDF output, mixed-scale sets and file units."
category: Engineering
tags: [design, quality, systems, validation]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Introductory to intermediate CAD drafting"
audience: "Drafters, CAD users, designers and checkers who set up drawing layouts, issue PDFs and printed sets, and need every view, note and line on the sheet to come out at its intended size."
outcomes:
  - "Draw the model at full size and set every layout viewport to an exact, locked scale factor."
  - "Calculate text, dimension, linetype and hatch scales for any view scale, or set them to follow the viewport."
  - "Plan a sheet so that views, details, dimensions and notes fit at preferred scales before drawing them."
  - "Produce plots and PDFs that hold their scale, and prove it with a measured check."
  - "Issue drawing sets with mixed scales and reduced prints, and keep scale intact when files change hands."
coverVariant: category
references:
  - title: "NSWTMEM330 CAD 1, Student Reference Book (CAD & Detail Drafting), version 2"
    creator: "Granville TAFE (TAFE NSW), CAD & Detail Drafting section"
    year: "2008"
    note: "Supplied source, read as a subject map of 2D CAD practice: templates, layers, text and dimension styles, model space and layouts, viewport scaling, linetype scale, hatching and plotting. Its tutorials, settings tables, figures and wording are not reproduced, and this book follows its own sequence, method and running case."
  - title: "PSLTSCALE (system variable), AutoCAD 2021 help"
    creator: "Autodesk"
    year: "2021"
    url: "https://help.autodesk.com/cloudhelp/2021/ENU/AutoCAD-Core/files/GUID-23EA4D64-AE7D-41E5-A8D0-20F060313D62.htm"
    note: "Reference for how paper-space linetype scaling interacts with the global linetype scale and viewport magnification in Chapter 6. AutoCAD names are used as one widely used example; other CAD programs have equivalent settings."
  - title: "To set dimension scale for creating dimensions in a layout, AutoCAD 2023 help"
    creator: "Autodesk"
    year: "2023"
    url: "https://help.autodesk.com/cloudhelp/2023/ENU/AutoCAD-Core/files/GUID-208E7AC9-402C-4DB4-B7E0-58058A77B5E3.htm"
    note: "Reference for scaling dimensions to a layout viewport and for the overall dimension scale in Chapter 5."
  - title: "Primary Units tab (Dimension Style Manager), AutoCAD 2025 help"
    creator: "Autodesk"
    year: "2025"
    url: "https://help.autodesk.com/view/ACD/2025/ENU/?guid=GUID-2D1177AB-3130-4522-A631-AA28493529DC"
    note: "Reference for the measurement (linear) scale factor applied to dimension values in Chapter 5, including its behaviour in paper space."
  - title: "About annotative objects and styles, AutoCAD 2023 help"
    creator: "Autodesk"
    year: "2023"
    url: "https://help.autodesk.com/cloudhelp/2023/ENU/AutoCAD-Core/files/GUID-6D4A620B-30AB-4593-B168-F9FF084017C6.htm"
    note: "Reference for annotative text, dimensions and hatches that take their size from the viewport's annotation scale, in Chapters 4 to 6."
  - title: "INSUNITS (system variable), AutoCAD 2025 help"
    creator: "Autodesk"
    year: "2025"
    url: "https://help.autodesk.com/cloudhelp/2025/ENU/AutoCAD-Core/files/GUID-A58A87BB-482B-4042-A00A-EEF55A2B4FD8.htm"
    note: "Reference for drawing insertion units and the automatic scaling of inserted blocks and references in Chapter 10."
  - title: "AS 1100.101 Technical drawing, Part 101: General principles"
    creator: "Standards Australia"
    year: "1992, reconfirmed"
    url: "https://store.standards.org.au/product/as-1100-101-1992"
    note: "Named by number and scope for sheet sizes, scales and lettering. No values are quoted from it; the Library’s Drawings That Make Parts covers its provisions, and the running case's text heights and line weights are the fictional office's own standard."
related:
  - title: "Drawings That Make Parts"
    href: "/reados/publications/drawings-that-make-parts/"
  - title: "Checking CAD layouts and plot scale before issue"
    href: "/reados/collections/cad-drafting-and-drawing-standards/checking-cad-layouts-and-plot-scale-before-issue/"
  - title: "Drafting Geometry by the Numbers"
    href: "/reados/publications/drafting-geometry-by-the-numbers/"
---

## About this book

Every CAD drawing lives in two places at once. The model is drawn at full size, a 1,600 mm frame as 1,600 units, because that is the only size at which its geometry, dimensions and calculations are true. The sheet is drawn at paper size, an A3 as 420 × 297 mm, because that is what will be printed and read. Between them sit the layout viewports, each a window onto the model at a chosen scale, and a set of scale-dependent settings for text, dimensions, linetypes, hatching and line weights that decide whether the printed sheet is legible.

When those settings are right, nobody notices them. When one is wrong, the drawing still looks plausible on screen and fails on paper: 3.5 mm notes print at 0.35 mm, hidden lines print solid, a view labelled 1:10 is really 1:9.73, a PDF prints at 97%. This book sets out the arithmetic behind each setting so that every one can be calculated, set deliberately and checked with a ruler.

It is written for drafters and CAD users who set up layouts, for designers who issue drawings, and for checkers who sign them. It assumes you can draw in a 2D CAD program. The method is software-neutral, but where a setting needs a name, the book uses AutoCAD's as one widely used example and says so; other programs have equivalents under other names. What a finished mechanical drawing must show, its views, dimensions and tolerances to AS 1100, is the subject of the Library’s *Drawings That Make Parts*. How to construct exact geometry is in *Drafting Geometry by the Numbers*.

## The running case

Every chapter follows one fictional drawing set. This is an illustration. A small machinery builder is detailing the tail take-up frame of a belt conveyor: a welded steel frame 1,600 mm long, 450 mm wide and 600 mm high that carries the tail pulley on two sliding bearing pads, adjusted by take-up screws. The set has three sheets on the office's A3 template: a general arrangement of the 6,000 mm conveyor at 1:20, the take-up frame at 1:10 with an enlarged detail of the bearing pad slide at 1:2 and of the take-up screw lug at 2:1, and a part drawing of the bearing pad.

The office's own drafting standard, also fictional, sets its text heights at 3.5 mm for dimensions and notes, 5 mm for view titles and 7 mm for the drawing number, and its plotted line widths at 0.5 mm for visible outlines and 0.25 mm for thin lines. Each chapter builds part of the set, makes the kind of mistake real drawing offices make, and shows how it was detected and corrected. The business, the drawings and the mistakes are invented; none describes BIZOMAT work or a real supplier.

## Source limits and professional responsibility

Scale arithmetic is exact, and every number in this book was checked by running the calculation. Software behaviour is not universal: setting names, defaults and the way settings interact differ between CAD programs and between versions of one program. Test any setting described here on a sample layout in your own software before relying on it, and use the cited help pages for the program you use.

A drawing that plots to scale is still only as good as its content. Sheet sizes, scales, lettering and line conventions for Australian engineering drawings are set by AS 1100 and any standard your contract calls up, and those govern where they differ from the running case's office standard. The frame in the running case is an example of drafting practice, not a conveyor design; real conveyors and their guarding are engineering and work health and safety matters for competent people.
