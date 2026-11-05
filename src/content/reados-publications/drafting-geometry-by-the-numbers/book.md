---
title: "Drafting Geometry by the Numbers"
subtitle: "Exact 2D construction for detail drawings: coordinates, triangles, tangents, bolt circles, offsets, areas and cut-ready profiles"
description: "Build exact 2D drafting geometry with numbers: datums, coordinates, triangles, tangent arcs, bolt circles, slots, ellipses, offsets, mass and cut-ready profiles."
category: Engineering
tags: [design, manufacturing, quality, validation]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Introductory to intermediate drafting geometry"
audience: "Drafters, CAD users, designers and fabrication engineers who draw 2D profiles for detail drawings, laser or waterjet cutting and CNC work, and want every point to be exactly where the design needs it."
outcomes:
  - "Choose a datum and enter points by absolute, relative and polar coordinates without quadrant or rounding errors."
  - "Solve triangles, intersections, tangent lines and fillet centres to place hidden construction points exactly."
  - "Lay out bolt circles, polar arrays and arc slots, and calculate the movement an adjustment slot gives."
  - "Calculate area, mass and centroid of a 2D profile and check the CAD result independently."
  - "Prepare a closed, correctly segmented profile with kerf allowance that a cutting machine can use."
coverVariant: category
references:
  - title: "NSWTMEM330 CAD 1, Student Reference Book (CAD & Detail Drafting), version 2"
    creator: "Granville TAFE (TAFE NSW), CAD & Detail Drafting section"
    year: "2008"
    note: "Supplied source, read as a subject map of 2D CAD drafting: coordinate entry, object snaps, circles and arcs, construction lines, fillets, arrays, ellipses, offsets and checking. Its exercises, procedures, figures and wording are not reproduced, and this book follows its own sequence, software-neutral method and running case."
  - title: "Modular equations and approximations to π"
    creator: "S. Ramanujan, Quarterly Journal of Mathematics, vol. 45, pp. 350–372"
    year: "1914"
    note: "Source of the approximation for the perimeter of an ellipse used in Chapter 6."
  - title: "Technical Drawing with Engineering Graphics, 15th edition"
    creator: "F. E. Giesecke, S. Lockhart, M. Goodman and C. Johnson, Pearson"
    year: "2016"
    note: "Background reading on geometric construction, tangency, ellipses and auxiliary views. No text, figures, values or exercises are reproduced."
  - title: "AS 1100.101 Technical drawing, Part 101: General principles, and AS 1100.201 Part 201: Mechanical engineering drawing"
    creator: "Standards Australia"
    year: "1992, reconfirmed"
    url: "https://store.standards.org.au/product/as-1100-101-1992"
    note: "Named by number and scope as the Australian drawing standards that govern how the geometry in this book is presented and dimensioned. No values are quoted from them; the Library’s Drawings That Make Parts covers their provisions."
related:
  - title: "Drawings That Make Parts"
    href: "/reados/publications/drawings-that-make-parts/"
  - title: "Drawing accurate CAD geometry from clear references"
    href: "/reados/collections/cad-drafting-and-drawing-standards/drawing-accurate-cad-geometry-from-clear-references/"
  - title: "Circles, arcs, chords and bolt circles"
    href: "/reados/collections/practical-mathematics-for-engineering/circles-arcs-chords-and-bolt-circles/"
---

## About this book

A detail drawing is only as good as the geometry under it. A dimension can be typed over, a note can be reworded, but a hole drawn 0.2 mm from where the design needs it will be cut 0.2 mm out by a laser that reads the file and ignores the dimensions. Modern work makes this sharper than it was on the drawing board: the CAD file itself goes to the cutting machine, the CNC programmer and the inspector's coordinate measuring machine, so the geometry has to be exact, not just look right.

This book is about producing that exact geometry. It works through the calculations a drafter needs to place every point deliberately: choosing a datum, entering coordinates, solving triangles, constructing tangents and fillets, laying out bolt circles and slots, drawing polygons and inclined circles, offsetting profiles, calculating area and mass, checking the result and preparing a profile for cutting. Each method is shown with the arithmetic, checked by an independent route and applied to one part.

It suits drafters and CAD users moving beyond basic commands, designers who prepare profiles for fabrication, and engineers who check other people's drawings. You need school trigonometry and a scientific calculator or spreadsheet. The methods are software-neutral: every CAD package offers coordinate entry, object snaps and inquiry tools under its own names, and the book explains what to calculate rather than which buttons to press. How the finished geometry is presented on the sheet, with views, dimensions and tolerances, belongs to the Library’s *Drawings That Make Parts*.

## The running case

Every chapter works on one fictional part. This is an illustration. A small machinery builder needs a motor mounting plate for a belt-driven conveyor. The plate is 10 mm mild steel, laser cut, 220 mm long and 140 mm high, with a 45 × 45 mm chamfer at the top right corner and an R40 radius at the top left. A Ø60 bore at (110, 70) takes the motor spigot, and four Ø9 holes on a 100 mm pitch circle hold the motor flange. The plate pivots on an M10 bolt through a Ø11 hole at (20, 20), and a second M10 bolt locks it through an 11 mm wide arc slot, centred on the pivot at a radius of 180 mm and running from 5° to 20°. Turning the plate through the slot raises or lowers the motor to tension the belt.

The drafter draws the plate with its bottom left corner at the origin. Each chapter adds geometry, checks it, and usually finds one plausible mistake and shows how it was detected and corrected. The business, the part and the mistakes are invented; none describes BIZOMAT work or a real supplier.

## Source limits and professional responsibility

The calculations are standard plane geometry and trigonometry, and every number in the book was checked by running the calculation. Material properties, such as the 7,850 kg/m³ density used for steel, are typical values for illustration; use your supplier's data for real parts. Cutting allowances such as kerf vary with the machine, material and thickness, and the values in Chapter 10 are illustrations that your cutter must confirm.

Geometry is only part of a design. Whether the plate is strong enough, whether the motor bolts hold, and whether the guarding meets workplace safety requirements are engineering decisions for a competent person, and Australian work health and safety duties apply to the machine the plate goes into. Treat this book as education in drafting method, not as design approval.
