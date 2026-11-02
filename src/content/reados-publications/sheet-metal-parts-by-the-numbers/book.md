---
title: "Sheet Metal Parts by the Numbers"
subtitle: "Designing and drawing folded sheet metal parts: bend radius, K-factor, flat patterns, springback, features near bends, forces and tolerances"
description: "Design and draw folded sheet metal parts with numbers: bend radius, K-factor, bend allowance, flat patterns, springback, features near bends, forces and tolerances."
category: Manufacturing
tags: [manufacturing, design, quality, product-development]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Intermediate sheet metal design and drafting"
audience: "Mechanical designers, drafters and fabrication engineers who design folded sheet metal parts, prepare their flat patterns and detail drawings, and work with a folding or laser cutting supplier."
outcomes:
  - "Choose a bend radius from the material's ductility and the folder's tooling, and know what limits it."
  - "Calculate bend allowance, bend deduction and a flat pattern from a K-factor, and calibrate the K-factor."
  - "Estimate springback and the overbend a folder needs, and why measured springback can differ."
  - "Place holes, slots, reliefs and flanges where the bend will not distort them, and estimate folding and punching forces."
  - "Tolerance and draw a folded part so that a supplier can make it and an inspector can accept it."
coverVariant: category
references:
  - title: "Engineering Drawings: Detail Drawings (lecture, ENGG1960)"
    creator: "School of Aerospace, Mechanical and Mechatronic Engineering, University of Sydney"
    year: "2014"
    note: "Supplied lecture slides, read as a subject map of detail drawing content, including example detail drawings of folded sheet steel chassis parts. No slides, drawings, wording or exercises are reproduced."
  - title: "K-Factor (SOLIDWORKS Design Help)"
    creator: "Dassault Systèmes"
    year: "2026"
    url: "https://help.solidworks.com/2026/english/solidworks/sldworks/c_K_Factor.htm"
    note: "Reference for the definition of the K-factor as the neutral axis position divided by thickness, and for the bend allowance relationship used in Chapters 3 and 4."
  - title: "How to calculate press brake tonnage"
    creator: "Bystronic"
    year: "2021"
    url: "https://bystronic.com/zaf/en/news/how-calculate-press-brake-tonnage"
    note: "Source of the inch-based air bending tonnage formula and its material and method factors, converted to SI units in Chapter 8. The conversion is this book's own."
  - title: "Calculating punching force"
    creator: "Mate Precision Technologies"
    year: "2020"
    url: "https://www.mate.com/wp-content/uploads/2015/10/SalvIII_LIT00828PN_2020_MPTECH_LR.pdf"
    note: "Reference for the punching force estimate from cut perimeter, thickness and shear strength in Chapter 8."
  - title: "Sheet Metal Design for Manufacturability: Engineers' Guide"
    creator: "Fabcon"
    year: "2026"
    url: "https://fabcon.com/articles/sheet-metal-fabrication/sheet-metal-dfm-guidelines-engineers/"
    note: "One fabricator's published rules of thumb for minimum bend radius, flange length, hole distance from a bend and a general formed-feature tolerance, quoted in Chapters 6, 7 and 9 as examples. Other suppliers publish different values; the book treats them as starting points to confirm with the folder."
  - title: "Correlation of bendability of materials with their tensile properties"
    creator: "J. Datsko and C. T. Yang, Journal of Engineering for Industry, vol. 82"
    year: "1960"
    note: "Source of the minimum bend radius relationship with reduction of area used in Chapter 2."
  - title: "The springback of metals"
    creator: "F. J. Gardiner, Transactions of the ASME, vol. 79"
    year: "1957"
    note: "Source of the elastic springback relationship for pure bending used in Chapter 5."
  - title: "AS 1595 Cold-rolled, unalloyed, low carbon and high strength steel sheet and strip"
    creator: "Standards Australia"
    year: "edition as called up"
    note: "Named by number and scope as an Australian product standard for the kind of sheet in the running case. No values are quoted from it; the running case's material properties are illustrations."
related:
  - title: "Designing sheet metal parts for economical manufacture"
    href: "/reados/collections/manufacturing-operations-and-design-for-manufacture/designing-sheet-metal-parts-for-manufacture/"
  - title: "Drawings That Make Parts"
    href: "/reados/publications/drawings-that-make-parts/"
  - title: "Checking Drawings by the Numbers"
    href: "/reados/publications/checking-drawings-by-the-numbers/"
---

## About this book

A folded sheet metal part starts life flat. It is cut from a sheet by laser, punch or shear, then bent on a press brake, one fold at a time, into a bracket, a cover, a channel or an enclosure. Everything about it depends on what happens in the bends: the metal stretches on the outside and compresses on the inside, the bent region takes up a length that is neither the inside nor the outside dimension, the bend springs back when the punch lifts, and any hole too close to the bend is pulled out of shape. A designer who knows those numbers draws parts that fold right first time. One who does not draws parts that fold nearly right, and the difference is found at the press brake.

This book works through the numbers in the order a part is designed: the bend radius and what limits it, the neutral axis and K-factor, the flat pattern, springback, features near bends, flanges and hems, the forces the press brake and punch must supply, tolerances that a folded part can hold, and the detail drawing that brings them together. Each chapter calculates with one part and shows a plausible mistake and how it was found.

It suits mechanical designers and drafters who design sheet metal parts, fabrication engineers who prepare flat patterns, and buyers who must judge a supplier's queries. It assumes school algebra and trigonometry and a working knowledge of engineering drawing. The Library’s collection chapter on designing sheet metal parts for economical manufacture gives a shorter overview; this book goes into the calculations behind it.

## The running case

Every chapter follows one fictional part. This is an illustration. A machinery builder needs a bracket to mount a variable speed drive on a conveyor frame. It is a C-shaped channel folded from 2.0 mm cold-rolled mild steel: a base 160 mm wide, two legs 60 mm high and two return flanges 15 mm wide, all as outside dimensions, and 300 mm long along the bends. Four Ø7 holes in the base take the drive's M6 screws, and each leg has two 9 × 20 mm slots for M8 bolts to the frame. All four bends are 90° with an inside radius of 2 mm, and the part is powder coated after folding. Its folding supplier has a press brake and a turret punch, and its first K-factor for this material and tooling, from trial strips, is 0.40.

The business, the supplier and the mistakes are invented, and the material properties are illustrations rather than a grade's specified values. None describes KEVOS® work or a real supplier.

## Source limits and professional responsibility

The geometry in this book is exact, and every calculation was checked by running it. The process relationships, for minimum radius, springback and force, are published models that describe trends and give estimates; real values depend on the material batch, the tooling and the machine, and the book shows how to calibrate them with trials. Published rules of thumb for features near bends and minimum flanges vary between suppliers, and the book quotes one supplier's guide as an example only.

Press brakes and punches are dangerous machines, and force estimates in this book are for planning and quoting, not for setting a machine. Machine capacities, tooling limits and guarding are matters for the machine's manufacturer, the operator and Australian work health and safety requirements. The parts in this book are examples of design method, not designs for a particular duty.
