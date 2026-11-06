---
title: "Stress Transformation by the Numbers"
subtitle: "Stress at a point, Mohr's circles, combined loads, thick walls, 3D stress, strain gauge rosettes and fits, worked through one drill-rig spindle"
description: "How stress changes with direction and where it peaks: transformation, principal stresses, Mohr's circle, tubes, thick walls, 3D states, rosettes, fits and thermal restraint."
category: Engineering
tags: [design, validation, quality]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-11-01
referencesChecked: 2026-11-01
edition: "1"
level: "Intermediate mechanical design engineering"
audience: "Mechanical design engineers, machine builders, test engineers and technicians who check shafts, tubes, cylinders and fitted parts under combined loads, or who read strain gauges on real machines."
outcomes:
  - "Describe the stress at a point as a set of components on a small element, and write them down for a shaft or tube under pressure, axial load, bending and torque."
  - "Transform stresses to any direction, and find the principal stresses, their directions and the maximum shear by formula and by Mohr's circle."
  - "Check thin and thick-walled tubes and cylinders under combined loads, and know when the thin-wall formulas stop being good enough."
  - "Handle three-dimensional stress states, convert between stresses and strains, and reduce strain gauge rosette readings to principal stresses."
  - "Check interference fits on hollow shafts and members restrained against thermal expansion, using equilibrium and compatibility together."
coverVariant: category
references:
  - title: "Gauge Fields in Condensed Matter, Volume II: Stresses and Defects (Differential Geometry, Crystal Melting)"
    creator: "H. Kleinert, World Scientific, Singapore"
    year: "1989"
    note: "In copyright. Part IV was used only as a map of ideas: stress and strain as tensors whose components change with the coordinate frame, the stress conservation law that expresses equilibrium, and the split of total strain into elastic and plastic parts that must together stay compatible. No text, equations, figures or problems are reproduced, and all cases and calculations are BIZOMAT originals."
  - title: "Theory of Elasticity, third edition"
    creator: "S. P. Timoshenko and J. N. Goodier, McGraw-Hill"
    year: "1970"
    note: "Background for the stress element, the transformation of stress and strain, principal stresses in three dimensions, the compatibility conditions and the thick-walled cylinder solution in Chapters 1, 2, 5, 6 and 10."
  - title: "Shigley's Mechanical Engineering Design, tenth edition"
    creator: "R. G. Budynas and J. K. Nisbett, McGraw-Hill Education"
    year: "2015"
    note: "Background for Mohr's circle, combined loading of shafts, thin and thick-walled cylinders and the stresses in press and shrink fits in Chapters 3, 4, 5 and 9."
  - title: "Experimental Stress Analysis, fourth edition"
    creator: "J. W. Dally and W. F. Riley, College House Enterprises"
    year: "2005"
    note: "Background for strain gauge rosettes, the reduction of rosette readings to principal strains and stresses, and the errors that affect them in Chapters 7 and 8."
  - title: "Roark's Formulas for Stress and Strain, eighth edition"
    creator: "W. C. Young, R. G. Budynas and A. M. Sadegh, McGraw-Hill"
    year: "2012"
    note: "Background for torsion of tubes and rectangular sections and for the thick cylinder formulas, used to cross-check the BIZOMAT tools in Chapters 1, 4 and 5."
  - title: "AS 1210 Pressure vessels"
    creator: "Standards Australia"
    year: "2010"
    note: "Named by number and scope only in Chapter 5. The design of pressure equipment is governed by its code, which sets allowable stresses and rules that this book does not reproduce."
  - title: "ISO 286-1 Geometrical product specifications (GPS) — ISO code system for tolerances on linear sizes — Part 1: Basis of tolerances, deviations and fits"
    creator: "International Organization for Standardization"
    year: "2010"
    note: "Named by number and scope only in Chapter 9, as the system of tolerance grades on which the interference fit limits tool bases its hole and shaft tolerances."
  - title: "Model Code of Practice: Managing the risks of plant in the workplace"
    creator: "Safe Work Australia"
    year: "2022"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-plant-workplace"
    note: "Named in Chapters 1 and 10 for the duty to manage the risks of plant, including failures of pressurised and rotating parts, under the model WHS laws."
related:
  - title: "Yield and Plastic Flow by the Numbers"
    href: "/reados/publications/yield-and-plastic-flow-by-the-numbers/"
  - title: "Metal Fatigue by the Numbers"
    href: "/reados/publications/metal-fatigue-by-the-numbers/"
  - title: "Thermal Expansion by the Numbers"
    href: "/reados/publications/thermal-expansion-by-the-numbers/"
  - title: "Design Simulation by the Numbers"
    href: "/reados/publications/design-simulation-by-the-numbers/"
---

## About this book

A stress is not a single number. At any point in a loaded part, the push, pull and shear across a small cut depend on which way the cut faces. A shaft under torque has no normal stress on a cross-section, yet a cut at 45° to its axis carries a tension as large as the shear, and that tension is what opens the spiral cracks of a brittle shaft. A pressurised tube that looks safe along its axis can be close to yield around its circumference. Finding the worst direction, and the worst value in it, is the job of stress transformation.

This book teaches that job with numbers. It starts with the stress at a point and the small element used to describe it, then shows how stresses change as the element turns, where they reach their largest and smallest values, and how Mohr's circle draws the whole picture. It then applies the method to tubes under pressure, thrust and torque, to thick walls, to three-dimensional states, to strains and strain gauge rosettes, and finally to interference fits and thermal restraint, where the parts must fit together as well as balance their loads.

It is for mechanical design engineers, machine builders, test engineers and technicians. It assumes school physics, algebra and a first course in statics; it explains trigonometry where it is used. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the BIZOMAT tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one machine. This is an illustration. A drill-rig builder in Kalgoorlie, Western Australia, is designing the RH-40 rotary head for a mineral exploration rig. The head turns the drill rods, pushes them down while drilling, pulls them back when a hole is finished and passes flushing water down their bore.

- **Spindle:** a hollow spindle of quenched and tempered chromium-molybdenum steel, 90 mm outside diameter with a 72 mm bore at its critical section. Yield strength 650 MPa, elastic modulus 205 GPa, Poisson's ratio 0.29.
- **Loads on the spindle:** flushing water at 7 MPa inside the bore; up to 6,500 N·m of torque; a pullback of 120 kN in tension; a feed thrust of 40 kN in compression while drilling; and a bending moment of 2,000 N·m at the gear seat from the gear mesh.
- **Drive gear:** a steel gear whose 160 mm hub is shrunk onto an 80 mm length of the spindle's 90 mm seat.
- **Other parts:** a hydraulic chuck cylinder of 140 mm bore and 20 mm wall at 21 MPa, two 32 mm guide rods held between brackets on the mast, and a bronze bush pressed into a steel housing in the water swivel.

Loads, strengths, dimensions, readings and times are the case builder's working figures or are calculated from stated assumptions. They do not describe BIZOMAT work or any real business, rig or supplier's data.

## How to use the book

Read Chapters 1 to 3 in order: they build the method that every later chapter uses. Chapters 4 and 5 apply it to tubes and cylinders, and Chapter 6 extends it to three dimensions. Chapters 7 and 8 deal with strain and with strain gauge rosettes, and can be read as a pair. Chapters 9 and 10 cover fits and thermal restraint, where compatibility joins equilibrium.

Every calculation in the book was checked by running it, and the BIZOMAT tools linked from each chapter were checked against the calculations they perform. The methods are elastic and assume isotropic metals. They find the stress state at a point; whether that state is acceptable is a question for the yield, fatigue and code checks that follow.

## Source limits and professional responsibility

This book is educational. Its methods give elastic stresses for idealised geometry and loads; they do not replace a design code, a finite element analysis checked against hand calculations, tests on the real part, or the judgement of a competent engineer. Pressurised and rotating parts store energy that a failure releases, and the risks of plant must be managed under the model WHS laws. Pressure equipment must be designed, made and inspected to its code. Decisions about real parts and machines remain with the competent people responsible for them.
