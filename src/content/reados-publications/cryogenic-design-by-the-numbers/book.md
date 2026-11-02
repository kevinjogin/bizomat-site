---
title: "Cryogenic Design by the Numbers"
subtitle: "Heat capacity, contraction, materials, supports, straps, radiation, current leads and cryocoolers, worked through one 40 K test cryostat"
description: "Design apparatus that works at 40 K and below: heat capacity and cooldown, contraction, materials, supports, thermal straps, radiation, current leads, cryocoolers and test coils."
category: Engineering
tags: [design, product-development, validation, prototyping]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-30
referencesChecked: 2026-10-30
edition: "1"
level: "Intermediate to advanced mechanical and instrumentation engineering"
audience: "Mechanical, electrical and instrumentation engineers, technicians and students who design, build or run cryostats, cryocooled sensors, test rigs or superconducting apparatus and need to check their heat loads and mechanics."
outcomes:
  - "Explain why heat capacity, conductivity and expansion change so much at low temperature, and use integrated NIST data rather than room-temperature constants."
  - "Estimate a cold assembly's enthalpy, cooldown time with a real cryocooler curve, and warm-up heater time."
  - "Design joints, fits and supports for differential contraction, and choose materials that stay tough and insulate."
  - "Calculate the heat leaks through supports, straps, radiation, multilayer insulation, wiring and current leads, and assemble a heat budget."
  - "Check a cryocooler against the Carnot limit and size the protection of a small superconducting test coil."
coverVariant: category
references:
  - title: "Quantum Field Theoretical Methods in Statistical Physics, 2nd edition"
    creator: "A. A. Abrikosov, L. P. Gor'kov and I. Ye. Dzyaloshinskii, translated by D. E. Brown, edited by D. ter Haar, Pergamon Press"
    year: "1965"
    note: "In copyright. Used only as a map of the physics behind the book: phonon and electron heat capacity, electrons in metals and their residual resistance, and the theory of superconductivity, its energy gap and critical field. No text, structure, figures, tables or problems are reproduced."
  - title: "Material Properties (cryogenic property fits)"
    creator: "Cryogenic Technologies Group, National Institute of Standards and Technology"
    year: "n.d."
    url: "https://trc.nist.gov/cryogenics/materials/materialproperties.htm"
    note: "Source of every solid property in the book: specific heat, thermal conductivity and linear contraction fits for OFHC copper (RRR 50 to 500), 6061-T6 and 1100 aluminium, 304 stainless steel, G-10 CR, Ti-6Al-4V, Invar, PTFE and beryllium copper, integrated numerically for enthalpies, mean coefficients and conductivity integrals."
  - title: "Cryostat Design (CERN Accelerator School: Superconductivity for Accelerators, CERN-2014-005)"
    creator: "V. Parma, CERN, arXiv:1501.07154"
    year: "2014"
    url: "https://arxiv.org/abs/1501.07154"
    note: "Source of the engineering multilayer insulation formula and its coefficients, the measured performance of 30 layers between 300 K and 50 K (about 1 W/m²), the emissivities used in its worked example, the conductivity integral of 304 stainless steel, and the advice on packing density and gaps, used in Chapters 5 and 7."
  - title: "Current Leads, Links and Buses (CERN Accelerator School 2013)"
    creator: "A. Ballarino, CERN, arXiv:1501.07166"
    year: "2014"
    url: "https://arxiv.org/abs/1501.07166"
    note: "Source of the statements that the minimum heat inleak of a conduction-cooled lead is about 47 W/kA between ambient and 4.2 K, nearly independent of material through the Wiedemann–Franz law, and that alloys and real metals depart from it, used in Chapter 8."
  - title: "Optimum input leads for cryogenic apparatus"
    creator: "R. McFee, Review of Scientific Instruments 30"
    year: "1959"
    note: "Named in Chapter 8 as the origin of the optimised conduction-cooled lead. The result used in the book was re-derived and checked numerically with NIST copper data."
  - title: "Cryogenic Refrigerators: An Updated Survey (NBS Technical Note 655)"
    creator: "T. R. Strobridge, National Bureau of Standards"
    year: "1974"
    url: "https://nvlpubs.nist.gov/nistpubs/Legacy/TN/nbstechnicalnote655.pdf"
    note: "Cited in Chapter 9 for the way refrigerator efficiency is expressed as a percentage of Carnot and for its finding that efficiency rises with capacity, the larger plants being the more efficient. No values are quoted from its charts."
  - title: "Theory of Superconductivity"
    creator: "J. Bardeen, L. N. Cooper and J. R. Schrieffer, Physical Review 108, 1175–1204"
    year: "1957"
    url: "https://doi.org/10.1103/PhysRev.108.1175"
    note: "Named in Chapter 10 as the origin of the microscopic theory of superconductivity and its energy gap of about 1.76 k_B T_c for weak coupling."
  - title: "Superconductivity at 93 K in a new mixed-phase Y-Ba-Cu-O compound system at ambient pressure"
    creator: "M. K. Wu, J. R. Ashburn, C. J. Torng and others, Physical Review Letters 58, 908–910"
    year: "1987"
    url: "https://doi.org/10.1103/PhysRevLett.58.908"
    note: "Cited in Chapter 10 for the discovery of superconductivity near 93 K in yttrium barium copper oxide, the family behind today's REBCO tapes."
  - title: "CODATA Internationally Recommended Values of the Fundamental Physical Constants"
    creator: "National Institute of Standards and Technology"
    year: "2018 adjustment"
    url: "https://physics.nist.gov/cuu/Constants/"
    note: "Source of the exact Boltzmann constant and elementary charge from which the Sommerfeld Lorenz number, 2.443 × 10⁻⁸ W·Ω/K², is calculated in Chapters 6 and 8, and of the Stefan–Boltzmann constant used in Chapter 7."
related:
  - title: "Cryogenic Liquids by the Numbers"
    href: "/reados/publications/cryogenic-liquids-by-the-numbers/"
  - title: "Vacuum by the Numbers"
    href: "/reados/publications/vacuum-by-the-numbers/"
  - title: "Thermal Expansion by the Numbers"
    href: "/reados/publications/thermal-expansion-by-the-numbers/"
  - title: "Heat Pumps and Refrigeration by the Numbers"
    href: "/reados/publications/heat-pumps-and-refrigeration-by-the-numbers/"
  - title: "Heat Transfer by the Numbers"
    href: "/reados/publications/heat-transfer-by-the-numbers/"
  - title: "Contact Temperature Sensors by the Numbers"
    href: "/reados/publications/contact-temperature-sensors-by-the-numbers/"
---

## About this book

Below about 100 K, the material properties an engineer learns to treat as constants stop being constant. A kilogram of copper that needs 389 J to warm by one kelvin at room temperature needs 58 J at 40 K and about a tenth of a joule at 4 K. Pure copper conducts heat several times better at 40 K than at room temperature, while stainless steel conducts less than a third as well. Aluminium shrinks by 0.4% on the way down, stainless steel by 0.3%, PTFE by 2% and Invar by almost nothing. Every one of those changes has to be designed for, and every watt of heat that reaches the cold end costs hundreds of watts at the wall socket.

This book is about designing apparatus that works in that world: test cryostats, cryocooled sensors, sample stages and the mechanical and electrical parts that hold and feed them. It starts with why the properties change, which the physics of phonons and electrons in solids explains, then follows a cold assembly through its cooldown, its contraction and the choice of its materials. Five chapters then count the heat that leaks in, through supports, straps and joints, radiation, wiring and current leads, and the last two set that heat against what a cryocooler can remove and look at the superconducting coils such apparatus is often built to test.

It is for mechanical, electrical and instrumentation engineers, technicians and students who know basic heat transfer and electrical circuits. Each chapter works the running case with real numbers, includes one plausible mistake and how it was caught, links the KEVOS® tool that performs the chapter's calculation where one exists, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one fictional cryostat. This is an illustration. An electrical equipment maker's laboratory builds a test cryostat, CT-40, to characterise small high-temperature superconducting coils at 40 K and currents up to 100 A. It is cooled by a cryocooler, with no liquid cryogens.

- **Vacuum vessel:** 304 stainless steel, 400 mm inside diameter and 600 mm high, 1.005 m² of inside surface, at room temperature.
- **Cryocooler:** a single-stage Gifford–McMahon cold head whose fictional capacity curve gives 2.0 × (T − 25 K) watts up to 120 W, so 30 W at 40 K, driven by a water-cooled compressor drawing 7.0 kW.
- **Cold mass:** an OFHC copper cold plate 300 mm in diameter and 20 mm thick (12.64 kg), a test coil of 4.0 kg treated as copper, and a 6061 aluminium coil former of 2.0 kg: 18.64 kg in all, with 0.35 m² of outer surface wrapped in ten layers of multilayer insulation.
- **Supports:** three G-10 tubes, 25 mm outside diameter, 2 mm wall, 150 mm long, from the vessel's top flange to the plate.
- **Thermal link:** a laminated copper strap of residual resistance ratio 50, 300 mm² in section and 100 mm long, with two bolted joints.
- **Electrical:** two copper current leads for 100 A, and 32 phosphor bronze instrument wires 0.127 mm in diameter and 1 m long.
- **Target:** the cold plate at or below 40 K with 100 A flowing, and a cooldown of no more than six hours.

The laboratory, its cryostat, the cryocooler's curve and the coil are invented and do not describe KEVOS® work or any real product or business. Equipment data are of the kind makers publish, not the data of any product.

## How to use the book

Read Chapter 1 first: it explains why the rest of the book integrates properties over temperature instead of using constants. Chapters 2 to 4 cover the cold mass itself: its heat, its contraction and its materials. Chapters 5 to 8 each take one path by which heat leaks in and can be read in any order. Chapter 9 assembles the heat budget and sets it against the cryocooler, and Chapter 10 turns to the coils CT-40 exists to test.

All solid properties come from NIST's cryogenic material fits, integrated numerically over temperature. Figures are given to more digits than a measurement would justify, so that a reader can follow each step. The linked KEVOS® tools use constant properties; the chapters show how to give them the right mean values.

## Source limits and professional responsibility

The relations in this book are the simplified forms used for first design and checking. Real heat loads depend on surface finish, workmanship, vacuum quality and contact pressure, and real apparatus is commissioned by measurement. Property data vary with alloy, temper and purity; NIST's fits are typical values within their stated accuracy, and critical designs need data for the actual material.

Cryostats are vacuum vessels and sometimes pressure vessels, superconducting coils store energy that can be released suddenly, and cryogenic equipment can cause cold burns and oxygen deficiency. Their design and operation are subject to the relevant standards and to work health and safety law. This book is educational. It is not a design for any apparatus, and a competent person must approve real work.
