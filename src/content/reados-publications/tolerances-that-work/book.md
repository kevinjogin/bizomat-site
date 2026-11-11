---
title: "Tolerances That Work"
subtitle: "Fits, datums and stack-up analysis for parts that assemble and function"
description: "Specify, analyse and verify dimensional variation in mechanical parts, from ISO limits and fits to datums, geometric tolerances and stack-ups."
category: Engineering
tags: [design, quality, manufacturing]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-11-11
referencesChecked: 2026-11-11
edition: "1"
level: "Intermediate"
audience: "Mechanical designers, drafters, manufacturing and quality engineers, and technical buyers who write, check or quote from toleranced drawings and need assemblies to work without paying for unnecessary precision."
outcomes:
  - "Translate a functional requirement into size limits, fits and geometric tolerances that a supplier can make and inspect."
  - "Build a datum reference frame that reflects how a part is located and used in its assembly."
  - "Calculate worst-case and statistical tolerance stack-ups, and explain the risk each method accepts."
  - "Allow for temperature, measurement uncertainty and process capability when setting and checking tolerances."
  - "Run a structured tolerance review before a drawing is released."
references:
  - title: "ISO 286-1:2010 Geometrical product specifications (GPS): ISO code system for tolerances on linear sizes, Part 1: Basis of tolerances, deviations and fits"
    creator: "International Organization for Standardization"
    year: "2010"
    url: "https://www.iso.org/standard/45975.html"
    note: "Defines standard tolerance grades, fundamental deviations and the hole-basis and shaft-basis systems used in Chapters 2, 3 and 9."
  - title: "ISO 286-2:2010 Geometrical product specifications (GPS): ISO code system for tolerances on linear sizes, Part 2: Tables of standard tolerance classes and limit deviations for holes and shafts"
    creator: "International Organization for Standardization"
    year: "2010"
    url: "https://www.iso.org/standard/54915.html"
    note: "Source of the limit deviations behind the 25 mm and 50 mm fit examples in Chapter 3. Read the current table for the size range in use rather than copying the examples."
  - title: "ISO 2768-1:1989 General tolerances, Part 1: Tolerances for linear and angular dimensions without individual tolerance indications"
    creator: "International Organization for Standardization"
    year: "1989"
    url: "https://www.iso.org/standard/7748.html"
    note: "General tolerance classes discussed in Chapters 1 and 2. ISO lists this part for revision; its former Part 2, on geometrical general tolerances, was withdrawn in 2021 and replaced by ISO 22081."
  - title: "ISO 1101:2017 Geometrical product specifications (GPS): Geometrical tolerancing, Tolerances of form, orientation, location and run-out"
    creator: "International Organization for Standardization"
    year: "2017"
    url: "https://www.iso.org/standard/66777.html"
    note: "Defines the tolerance zones described in Chapter 5. Symbols and rules should be confirmed against the edition your drawings invoke."
  - title: "ISO 5459:2024 Geometrical product specifications (GPS): Geometrical tolerancing, Datums and datum systems"
    creator: "International Organization for Standardization"
    year: "2024"
    url: "https://www.iso.org/standard/87855.html"
    note: "Datum concepts used in Chapter 4. The third edition (2024) replaced the 2011 edition; check which edition your drawings invoke."
  - title: "ISO 8015:2011 Geometrical product specifications (GPS): Fundamentals, Concepts, principles and rules"
    creator: "International Organization for Standardization"
    year: "2011"
    url: "https://www.iso.org/standard/55979.html"
    note: "Source of the independency principle and the invocation rules contrasted with ASME practice in Chapters 2 and 6."
  - title: "ISO 2692:2021 Geometrical product specifications (GPS): Geometrical tolerancing, Maximum material requirement (MMR), least material requirement (LMR) and reciprocity requirement (RPR)"
    creator: "International Organization for Standardization"
    year: "2021"
    note: "Background for the material-condition modifiers in Chapter 6."
  - title: "ISO 14253-1:2017 Geometrical product specifications (GPS): Inspection by measurement of workpieces and measuring equipment, Part 1: Decision rules for verifying conformity or nonconformity with specifications"
    creator: "International Organization for Standardization"
    year: "2017"
    note: "Background for the decision rules and conformance zones in Chapter 10."
  - title: "Y14.5-2018 Dimensioning and Tolerancing"
    creator: "American Society of Mechanical Engineers"
    year: "2018"
    url: "https://www.asme.org/codes-standards/find-codes-standards/y14-5-dimensioning-tolerancing"
    note: "The principal alternative to the ISO GPS system. Chapters 2, 4 and 6 note where its default rules differ."
  - title: "AS 1100.201 Technical drawing, Part 201: Mechanical engineering drawing"
    creator: "Standards Australia"
    year: "1992, reconfirmed 2014"
    note: "Australian mechanical drawing standard. Check the edition and any ISO standards your organisation has adopted in its place."
  - title: "ISO 492 Rolling bearings: Radial bearings, Geometrical product specifications (GPS) and tolerance values"
    creator: "International Organization for Standardization"
    year: "current edition"
    note: "Bearing bore, outside diameter and width tolerances referred to in Chapters 3 and 7. Use the bearing manufacturer's catalogue for the bearing actually selected."
  - title: "ISO 273 Fasteners: Clearance holes for bolts and screws"
    creator: "International Organization for Standardization"
    year: "1979"
    note: "Fine, medium and coarse clearance-hole series used in the fastener example in Chapter 6."
  - title: "ISO 1 Geometrical product specifications (GPS): Standard reference temperature for the specification of geometrical and dimensional properties"
    creator: "International Organization for Standardization"
    year: "current edition"
    note: "Establishes the 20 °C reference temperature discussed in Chapter 9."
  - title: "Machinery's Handbook, 29th edition"
    creator: "Erik Oberg, Franklin D. Jones, Holbrook L. Horton and Henry H. Ryffel (Industrial Press)"
    year: "2012"
    note: "Consulted to cross-check the preferred metric fit limits and the Taylor principle for limit gauges. No tables, figures or text are reproduced; readers should use the current standards and supplier data."
  - title: "Shigley's Mechanical Engineering Design, 10th edition"
    creator: "Richard G. Budynas and J. Keith Nisbett (McGraw-Hill Education)"
    year: "2015"
    note: "Standard treatment of interference-fit pressure and thick-cylinder stresses used for the shrink-fit example in Chapter 3."
  - title: "Dimensioning for Interchangeable Manufacture"
    creator: "Eugene T. Fortini (Industrial Press)"
    year: "1967"
    note: "Early systematic treatment of tolerance chains and statistical stacking, background to Chapters 7 and 8."
related:
  - title: "Fits That Work"
    href: "/reados/publications/fits-that-work/"
  - title: "Engineering Design Practice"
    href: "/reados/collections/engineering-design-practice/"
  - title: "Machine Elements and Mechanical Design"
    href: "/reados/collections/machine-elements-and-mechanical-design/"
  - title: "Manufacturing Quality"
    href: "/reados/collections/manufacturing-quality/"
---

## About this book

Every manufactured part is slightly different from its drawing. The question is never whether variation will occur, but whether the design has decided how much variation each feature may have, where it is measured from and how the variation of several parts combines in an assembly. A tolerance is that decision written down.

Too little tolerance makes a part expensive, slow to make and difficult to inspect. Too much allows assemblies that bind, rattle, leak or wear early. Most drawings have both faults at once: tight numbers copied from a template on features that do not matter, and missing or ambiguous controls on the few that do.

This book works through the whole chain. It begins with size limits and the ISO system of fits, moves to datums and geometric tolerances, and then shows how to add up variation through an assembly using worst-case and statistical methods. Later chapters deal with temperature, deflection, allocation of a tolerance budget, measurement uncertainty and a practical review process.

The ten chapters share one fictional example: a **guide roller unit** made by an invented small manufacturer, Northgate Rollers. A steel shaft carries two ball bearings, a spacer and a retaining ring inside a flanged housing that bolts to a frame. The parts, dimensions, supplier data and results are invented for teaching. They are not BIZOMAT projects, clients, prices or claims of performance, and the dimensions are not a design to copy.

Calculations use millimetres and degrees Celsius. Where a table value from a standard is used, the chapter says so; check the current edition of the standard for your own size range rather than relying on an example. The book is general engineering education. It does not replace the standards your drawings invoke, your customer's requirements or the judgement of a competent engineer responsible for a design.

## An independent treatment

The Library already includes a single chapter on [specifying tolerances, fits and surface finish](/reados/collections/engineering-design-practice/specifying-tolerances-fits-and-surface-finish/). This book goes much further into datums, geometric tolerancing, stack-up calculation and verification, with one assembly carried through every chapter.

The Library book [Fits That Work](/reados/publications/fits-that-work/) covers some of the same ground from the other end. It follows an assembly from tolerance budgets to the evidence for releasing it: statistics, temperature, measurement, pilots and design changes. This book is about writing the drawing: the ISO system of limits and fits, datums, geometric tolerances and material condition, with stack-ups used to decide what goes on each drawing. Where a topic is treated more fully there, the chapter links to it.

Each chapter follows the guide roller through one thing that went wrong, from the first drawings to production, how it was detected and how it was corrected, and ends with a worked exercise. Where a BIZOMAT tool performs the calculation, the chapter links to it and quotes its result.

The explanations, the guide roller case and all worked examples are original BIZOMAT writing. Machinery's Handbook was consulted to cross-check published fit limits; no tables, figures or text from it or from any standard are reproduced. Standards are cited so readers can obtain the authoritative wording.
