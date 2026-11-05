---
title: "Design Simulation by the Numbers"
subtitle: "Planning, checking and reporting finite element and motion studies that a reviewer can trust"
description: "Plan, build, check and report design simulations with hand calculations, restraint and mesh studies, frequency checks, test comparison and a clear release scope."
category: Engineering
tags: [design, validation, quality, product-development]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Intermediate mechanical design"
audience: "Mechanical designers, CAD users and engineers who run simulation inside a CAD package and need results that survive review, testing and a change in the design."
outcomes:
  - "Write an analysis plan that states the decision, load cases and acceptance criteria before any model is built."
  - "Bound every simulation result with hand calculations for stress, deflection, mass and natural frequency."
  - "Choose restraints, loads and meshes deliberately, and show convergence with a numerical study."
  - "Read stress, frequency and motion results correctly, including singularities and the limits of linear analysis."
  - "Compare predictions with a test and report a simulation with a defined, defensible scope."
coverVariant: category
references:
  - title: "Mastering SolidWorks: The Design Approach, second edition"
    creator: "Ibrahim Zeid"
    year: "2015"
    note: "Pearson Education, publishing as Peachpit. Supplied source, reviewed for its subject map of analysis tools, mass properties, motion studies and finite element analysis inside a CAD system. No text, tutorials, figures, examples or problems are reproduced, and this book follows its own sequence and case."
  - title: "Mechanics of Materials (Roylance)"
    creator: "David Roylance, Massachusetts Institute of Technology, via LibreTexts"
    year: "online edition"
    url: "https://eng.libretexts.org/Bookshelves/Mechanical_Engineering/Mechanics_of_Materials_(Roylance)"
    note: "Reference for beam stress and displacement (chapter 4), the stress concentration factor of 3 at a circular hole in a large plate (section 5.1), an introduction to finite element analysis (section 5.3) and the Tresca and von Mises yield criteria (section 6.1)."
  - title: "Examining Spatial (Grid) Convergence"
    creator: "NASA Glenn Research Center, NPARC Alliance verification and validation tutorial"
    year: "online tutorial"
    url: "https://www.grc.nasa.gov/www/wind/valid/tutorial/spatconv.html"
    note: "Reference for the observed order of convergence, Richardson extrapolation and Roache's grid convergence index, with factors of safety of 1.25 for three meshes and 3.0 for two, used in Chapter 6."
  - title: "NASA-STD-7009B, Standard for Models and Simulations"
    creator: "National Aeronautics and Space Administration"
    year: "2024"
    url: "https://standards.nasa.gov/sites/default/files/standards/NASA/B/1/NASA-STD-7009B-Final-3-5-2024.pdf"
    note: "Named as an example of a published framework for model credibility, in which the effort spent on credibility matches the consequence of a wrong decision. Chapter 10 uses the idea, not the standard's requirements or scales."
  - title: "ASME V&V 10, Standard for Verification and Validation in Computational Solid Mechanics"
    creator: "ASME"
    year: "current edition"
    note: "Named by number and scope only, as the solid-mechanics verification and validation standard a reader may meet. No content is quoted."
related:
  - title: "Engineering Design Practice"
    href: "/reados/collections/engineering-design-practice/"
  - title: "Machine Elements and Mechanical Design"
    href: "/reados/collections/machine-elements-and-mechanical-design/"
  - title: "Fixtures That Repeat"
    href: "/reados/publications/fixtures-that-repeat/"
---

## About this book

Simulation inside a CAD package has made stress plots cheap. A useful answer is still expensive, because it depends on decisions the software cannot make: which question is being asked, which loads matter, how the part is held, how fine the mesh must be and what the result will be compared with. This book is about those decisions. It treats a simulation as an engineering calculation that has to be planned, checked and reported, not as a coloured picture.

It is written for designers and engineers who already build models in a parametric CAD system and have access to its static, frequency and motion tools. You should be comfortable with stress, strain, bending moments and the idea of a natural frequency. Each chapter introduces one stage of the work, applies it to the running case with real numbers and ends with an exercise and its worked answer. Read the chapters in order the first time; later, the checklists and exercises stand on their own.

## The running case

The book follows a fictional **gearmotor mounting bracket** for a belt conveyor. A 32 kg gearmotor hangs at the end of a steel arm, 250 mm from the face of a base plate bolted to the conveyor frame. The first proposal uses a 12 × 50 mm flat bar; hand calculations in Chapter 2 reject it, and the rest of the book analyses a 50 × 50 × 5 mm square hollow section welded to a 10 mm base plate. The loads are the motor's weight with a dynamic allowance, a sideways belt pull and the reaction torque at start-up. The acceptance criteria limit stress, deflection at the motor flange and the first natural frequency.

All dimensions, loads, criteria, software results, test readings and costs are invented for teaching. This is an illustration. They are not BIZOMAT projects, measured data or performance claims, and the simulation results quoted are worked teaching values, not output from a named product.

## Source limits and professional responsibility

The supplied CAD textbook informed the choice of topics. The method, the case, the calculations and the figures are original, and the formulas used are standard mechanics checked against the references listed. Software menus are not described, because they change between products and releases; the decisions are the same in all of them.

This book is educational. It does not replace design codes, product standards, manufacturer data or the judgement of a competent engineer. Lifting equipment, pressure equipment, structures and safety-related machinery have their own requirements and approval paths, and a real bracket of this kind would need its loads, welds, bolts and fatigue life checked against them. Use the method here to ask better questions of a model and to record better evidence; let qualified review decide whether a real design is fit for service.
