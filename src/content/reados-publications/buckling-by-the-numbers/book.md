---
title: "Buckling by the Numbers"
subtitle: "Columns, struts, bracing, cylinder rods, heated pipes, thin shells and temporary frames: why straight members go sideways and how to prove they will not"
description: "How compression members buckle and how to check them: Euler, effective length, sections, Johnson and secant formulas, bracing, cylinder rods, heat, vacuum and temporary frames."
category: Engineering
tags: [design, validation, quality]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-31
referencesChecked: 2026-10-31
edition: "1"
level: "Intermediate mechanical and structural engineering"
audience: "Mechanical and structural engineers, designers, fabrication and maintenance supervisors, and technicians who design, check, build or inspect frames, struts, legs, cylinders, pipes and tanks that carry compression."
outcomes:
  - "Explain why slender members fail by buckling at loads set by stiffness and length, and calculate Euler's load and the slenderness ratio."
  - "Choose an honest effective length factor for braced and sway members, and recognise when a frame needs bracing to stand up at all."
  - "Compare sections by their radius of gyration about the least axis, and switch correctly between Euler, Johnson, Rankine–Gordon and code curves."
  - "Allow for crookedness, offset loads, heat and relief-valve forces, and size bracing for the stiffness and strength a column needs."
  - "Check thin shells under vacuum and temporary lifting frames, and prove a structure with measurements, a staged first load, tests and inspection records."
coverVariant: category
references:
  - title: "Gauge Fields in Condensed Matter, Volume I: Superflow and Vortex Lines (Disorder Fields, Phase Transitions)"
    creator: "H. Kleinert, World Scientific, Singapore"
    year: "1989"
    note: "In copyright. Used only as a map for the physics behind Chapters 1 and 5: an energy expanded about an equilibrium whose quadratic term changes sign at a critical point, spontaneous symmetry breaking, and the smoothing of a transition by an applied field. No text, equations, figures or problems are reproduced, and all cases and calculations are BIZOMAT originals."
  - title: "Theory of Elastic Stability, second edition"
    creator: "S. P. Timoshenko and J. M. Gere, McGraw-Hill"
    year: "1961"
    note: "Background for Euler's load, effective length, the elastica, the secant formula, inelastic buckling and the buckling of cylindrical shells under external pressure in Chapters 1 to 5 and 9."
  - title: "Methodus inveniendi lineas curvas maximi minimive proprietate gaudentes, Additamentum I: De curvis elasticis"
    creator: "L. Euler, Lausanne and Geneva"
    year: "1744"
    note: "Named in Chapter 1 as the origin of the buckling load of a pin-ended strut."
  - title: "Inelastic column theory"
    creator: "F. R. Shanley, Journal of the Aeronautical Sciences, volume 14"
    year: "1947"
    note: "Named in Chapter 4 for the result that the tangent-modulus load is the load at which a real column begins to bend."
  - title: "Lateral bracing of columns and beams"
    creator: "G. Winter, Journal of the Structural Division, American Society of Civil Engineers"
    year: "1958"
    note: "Source of the rigid-link model of a braced column used in Chapter 6 for the ideal brace stiffness and the brace force from an initial offset."
  - title: "Collapse by instability of thin cylindrical shells under external pressure"
    creator: "D. F. Windenburg and C. Trilling, Transactions of the American Society of Mechanical Engineers, volume 56"
    year: "1934"
    note: "Source of the approximate collapse formula for a short cylinder held round at its ends, used in Chapter 9."
  - title: "On the analysis of experimental observations in problems of elastic stability"
    creator: "R. V. Southwell, Proceedings of the Royal Society of London, Series A, volume 135"
    year: "1932"
    note: "Source of the Southwell plot used in Chapter 11 to estimate a critical load from deflections measured below it."
  - title: "AS 4100:2020 Steel structures"
    creator: "Standards Australia"
    year: "2020"
    note: "Named by number and scope only in Chapters 4 and 11 as the Australian standard for the design of steel structures, including member capacities in compression. No clause or value from it is quoted."
  - title: "AS/NZS 1170.2:2021 Structural design actions, Part 2: Wind actions"
    creator: "Standards Australia and Standards New Zealand"
    year: "2021"
    note: "Named by number and scope only in Chapters 2 and 5 as the source of design wind actions; the 1.0 kPa used in the case is a placeholder, not a value from the standard."
  - title: "AS/NZS 1170.0:2002 Structural design actions, Part 0: General principles"
    creator: "Standards Australia and Standards New Zealand"
    year: "2002"
    note: "Named by number and scope only in Chapter 5 for load combinations. No clause or value from it is quoted."
  - title: "AS/NZS 1163:2016 Cold-formed structural steel hollow sections"
    creator: "Standards Australia and Standards New Zealand"
    year: "2016"
    note: "Named by number and scope only for the C350L0 grade of the case's circular hollow sections. No clause or value from it is quoted."
  - title: "AS/NZS 5131:2016 Structural steelwork: Fabrication and erection"
    creator: "Standards Australia and Standards New Zealand"
    year: "2016"
    note: "Named by number and scope only in Chapter 11. The straightness and plumb figures in the case are the case's own design assumptions, not values from the standard."
  - title: "Model Code of Practice: Managing the risks of plant in the workplace"
    creator: "Safe Work Australia"
    year: "2022"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-plant-workplace"
    note: "Named in Chapters 7 and 10 for the duty to manage the risks of plant, including hydraulic equipment and lifting equipment, under the model WHS laws."
related:
  - title: "Thermal Expansion by the Numbers"
    href: "/reados/publications/thermal-expansion-by-the-numbers/"
  - title: "Stiffening Sheet Metal by the Numbers"
    href: "/reados/publications/stiffening-sheet-metal-by-the-numbers/"
  - title: "Design Simulation by the Numbers"
    href: "/reados/publications/design-simulation-by-the-numbers/"
  - title: "Tanks and Hoppers by the Numbers"
    href: "/reados/publications/tanks-and-hoppers-by-the-numbers/"
---

## About this book

A straight member in compression does not fail the way intuition expects. Long before its steel is anywhere near yield, it bows sideways and stops carrying load. The load at which that happens is set by its stiffness and length, not its strength, and it can be lowered dramatically by things that look minor on a drawing: a missing brace, a base plate assumed to be fixed, a load that arrives 88 mm off-centre, a slack diagonal, a hydraulic relief valve set higher than the job needs, a pipe that is heated between two fixed points, a vent with a bag over it.

This book shows how to calculate buckling loads and how to keep them. It starts from Euler's load for a perfect pin-ended strut and the energy picture of buckling as a fork in the road, then adds, one chapter at a time, the things that real members have: end conditions and bracing, sections with weak axes, yielding, crookedness and offset loads. It applies them to bracing, cylinder rods and screws, heated members, thin shells under vacuum and temporary lifting frames, and finishes with how to prove and inspect what was built.

It is for mechanical and structural engineers, designers, fabrication and maintenance supervisors and technicians who design, check, build or inspect members in compression. It assumes school physics, algebra and the idea of a second moment of area. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the BIZOMAT tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one structure and the equipment around it. This is an illustration. A fabrication shop in Toowoomba, Queensland, designs, builds and installs HT-8, an elevated stand for a stainless steel process-water header tank at a food plant.

- **Tank:** 316 stainless steel, 2,200 mm inside diameter, 3 mm shell, water to 2,000 mm, 420 kg empty and 8,023 kg full.
- **Stand:** four legs of CHS 76.1 × 3.6 in grade C350, 4,000 mm from base plate to top frame, at the corners of a 2,200 mm square, each carrying 19.7 kN under the full tank.
- **Bracing:** horizontal struts of CHS 48.3 × 3.2 at mid-height, and tension-only diagonals of 16 mm round bar with turnbuckles in every face.
- **Around it:** a hydraulic tipping cradle that stands the tank upright, a hot-water outlet pipe to a transfer pump, and shear legs used to lift the pump set from its pit.

Loads, dimensions, tolerances, test results, prices and times are invented for the case or calculated from stated assumptions. The wind pressure used is a placeholder, not a design value. None of it describes BIZOMAT work or any real business, product or site.

## How to use the book

Read Chapters 1 and 2 first: Euler's load and the effective length are used in every later chapter. Chapters 3 to 5 complete the check of a single member: its section, its slenderness range and its imperfections. Chapter 6 deals with bracing. Chapters 7 to 10 apply the same ideas to machines, heat, thin shells and temporary works, and can be read in any order. Chapter 11 covers proving, inspection and records.

Every calculation in the book was checked by running it, and the BIZOMAT tools linked from each chapter were checked against the calculations they perform. The formulas used are the classical ones: they explain behaviour, show which changes matter and give sound first checks. They are not a substitute for the governing design standard.

## Source limits and professional responsibility

This book is educational. Its methods give estimates for straight, prismatic members and simple shells, and each chapter says where they stop being reliable. Structures that must comply with the Building Code of Australia or a client's specification must be designed and checked to the governing standards, such as AS 4100 for steel structures and AS/NZS 1170 for loads, by people competent to do so. Pressure vessels, lifting equipment, hydraulic equipment and temporary works are subject to their own standards, makers' instructions and the model WHS laws. Decisions about real structures, lifts and plant remain with the competent people responsible for them.
