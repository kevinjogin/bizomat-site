---
title: "Yield and Plastic Flow by the Numbers"
subtitle: "Dislocations, tensile tests, work hardening, yield criteria, proof tests, bending, thread rolling and residual stress, worked through one hydraulic cylinder"
description: "How metals yield and flow and how to use it: elastic constants, tensile tests, true stress and work hardening, hardness, von Mises and Tresca, proof tests, bending, rolling and residual stress."
category: Engineering
tags: [design, manufacturing, quality]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-31
referencesChecked: 2026-10-31
edition: "1"
level: "Intermediate mechanical and manufacturing engineering"
audience: "Mechanical and manufacturing engineers, designers, fabricators, test and quality staff who specify materials, read mill certificates, check parts against yield, or bend, roll and form metal."
outcomes:
  - "Explain yield and plastic flow through the movement of dislocations, and why real metals yield far below their theoretical strength."
  - "Evaluate a tensile test, convert it to true stress and strain, and describe work hardening with a flow curve."
  - "Relate hardness and grain size to strength, and check a part under combined stresses by von Mises and Tresca."
  - "Find the first-yield and collapse pressures of a thick tube, and judge a part after an overload."
  - "Plan bends, tube bends and rolled threads within the material's ductility, and manage thermal restraint and residual stress."
coverVariant: category
references:
  - title: "Gauge Fields in Condensed Matter, Volume II: Stresses and Defects (Differential Geometry, Crystal Melting)"
    creator: "H. Kleinert, World Scientific, Singapore"
    year: "1989"
    note: "In copyright. Used only as a map for the physics behind Chapters 1, 3 and 10: crystals as ordered lattices, displacement and strain, dislocations as the line defects that carry plastic flow, their interactions, and the extension of elasticity to defects. No text, equations, figures or problems are reproduced, and all cases and calculations are KEVOS® originals."
  - title: "Introduction to Dislocations, fifth edition"
    creator: "D. Hull and D. J. Bacon, Butterworth-Heinemann"
    year: "2011"
    note: "Background for the theoretical shear strength, dislocation movement, the Orowan relation and work hardening by dislocation interaction in Chapters 1 and 3."
  - title: "Mechanical Metallurgy, SI metric edition"
    creator: "G. E. Dieter, McGraw-Hill"
    year: "1988"
    note: "Background for the tensile test, true stress and strain, the flow curve, necking, yield criteria, strain ageing and the Bauschinger effect in Chapters 2 to 5."
  - title: "The Mathematical Theory of Plasticity"
    creator: "R. Hill, Clarendon Press, Oxford"
    year: "1950"
    note: "Background for the elastic-plastic thick-walled tube under internal pressure, its first-yield and collapse pressures and its plastic zone, in Chapter 6."
  - title: "The cleavage strength of polycrystals"
    creator: "N. J. Petch, Journal of the Iron and Steel Institute, volume 174, pages 25 to 28"
    year: "1953"
    note: "One of the two original sources of the grain size relation used in Chapter 4, with E. O. Hall's 1951 paper in the Proceedings of the Physical Society."
  - title: "ISO 6892-1 Metallic materials — Tensile testing — Part 1: Method of test at room temperature"
    creator: "International Organization for Standardization"
    year: "2019"
    note: "Named by number and scope only in Chapter 2. The specimen size and acceptance minimums in the case are the case builder's purchase specification, not values quoted from the standard."
  - title: "ISO 6506-1 Metallic materials — Brinell hardness test — Part 1: Test method"
    creator: "International Organization for Standardization"
    year: "2014"
    note: "Named by number and scope only in Chapter 4, as the method behind the Brinell validity rules that the WORKOS tool applies."
  - title: "ASTM E112 Standard Test Methods for Determining Average Grain Size"
    creator: "ASTM International"
    year: "2013"
    note: "Named by number and scope only in Chapter 4, as the definition of the grain size number that the WORKOS tool calculates."
  - title: "Model Code of Practice: Managing the risks of plant in the workplace"
    creator: "Safe Work Australia"
    year: "2022"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-plant-workplace"
    note: "Named in Chapters 1 and 6 for the duty to manage the risks of plant, including pressure equipment, test rigs and presses, under the model WHS laws."
related:
  - title: "Buckling by the Numbers"
    href: "/reados/publications/buckling-by-the-numbers/"
  - title: "Microstructures by the Numbers"
    href: "/reados/publications/microstructures-by-the-numbers/"
  - title: "Hand Forming Sheet Metal by the Numbers"
    href: "/reados/publications/hand-forming-sheet-metal-by-the-numbers/"
  - title: "Thermal Expansion by the Numbers"
    href: "/reados/publications/thermal-expansion-by-the-numbers/"
---

## About this book

Every metal part is designed around one number more than any other: its yield strength, the stress at which it stops springing back and starts to take a permanent set. Designers keep parts below it; fabricators deliberately go past it to bend, roll and form; test engineers prove parts against it; and failure investigators ask whether it was exceeded. Yet the physics of yielding, why it happens where it does and what happens after it, is often left to metallurgists.

This book explains yield and plastic flow from the crystal up and turns them into numbers that engineers use every day. It starts with the elastic constants and the dislocations that make metals yield at a tiny fraction of their theoretical strength, then reads a tensile test, converts it to true stress and strain, and describes work hardening. It relates hardness and grain size to strength, checks parts under combined stresses, finds the pressures at which a thick tube first yields and finally collapses, and then turns to deliberate plastic flow in bending, tube bending and thread rolling. It ends with thermal restraint, residual stress and annealing.

It is for mechanical and manufacturing engineers, designers, fabricators, and test and quality staff. It assumes school physics, algebra and a first course in stress analysis. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the WORKOS tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one product. This is an illustration. A hydraulic cylinder builder in Bayswater, Western Australia, makes the HC-63, a 63 mm bore cylinder for mobile mining equipment.

- **Duty:** 21 MPa working pressure, proof tested at 31.5 MPa, 1.5 times working.
- **Barrel:** cold-drawn, stress-relieved and honed steel tube, 63 mm bore and 76 mm outside diameter, with a mill certificate yield strength of 520 MPa.
- **Rod:** 36 mm, from 0.45% carbon steel bar, with an M27 × 2 rolled thread at its end.
- **Fabricated parts:** 10 mm grade 350 steel plate mounting brackets bent on a press brake, and 16 × 2 mm cold-drawn seamless steel tube for the hydraulic lines.
- **Test bench:** a pressure test bench with an intensifier, an oil heater and a frame tied by 25 mm steel bars.

Strengths, test results, loads, pressures, prices and times are the case builder's working figures or are calculated from stated assumptions. They do not describe KEVOS® work or any real business, product or supplier's data.

## How to use the book

Read Chapters 1 to 3 first: they set out the elastic and plastic behaviour that every later chapter uses. Chapter 4 relates hardness and grain size to strength. Chapters 5 and 6 deal with yield under combined stress and the behaviour of a pressurised tube up to collapse. Chapters 7 to 9 cover deliberate plastic flow in bending, tube bending and thread rolling, and Chapter 10 covers thermal restraint, residual stress and annealing.

Every calculation in the book was checked by running it, and the WORKOS tools linked from each chapter were checked against the calculations they perform. The formulas are sound first estimates for ductile steels; mill certificates, tests and trial pieces are the final word on real material.

## Source limits and professional responsibility

This book is educational. Its methods give first estimates of yield, collapse, springback, forming limits and thermal stress under the stated assumptions; they do not replace the design standards that apply to pressure equipment, structures or lifting gear, the material supplier's data, or the judgement of a competent engineer. Hydraulic cylinders, pressure test rigs and presses store large amounts of energy and must be designed, tested and operated under a safe system of work as the model WHS laws require. Decisions about real parts and equipment remain with the competent people responsible for them.
