---
title: "Fine Particles by the Numbers"
subtitle: "Drag, settling, slip, Brownian diffusion, filter capture and duct deposition of dust and fume, worked through one laser-cutting fume extractor"
description: "Predict how dust, fume and mist behave by numbers: Stokes settling, slip, relaxation time, Brownian diffusion, impaction, filter capture, duct deposition and measurement."
category: Engineering
tags: [design, operations, quality]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-27
referencesChecked: 2026-10-27
edition: "1"
level: "Intermediate engineering physics for ventilation and extraction"
audience: "Mechanical and ventilation engineers, machine builders, maintenance planners and safety advisers who specify, check or troubleshoot dust, fume and mist extraction for machines and workshops."
outcomes:
  - "Calculate the drag, settling velocity and slip correction of a particle of any size from about 0.01 to 100 µm, and know when Stokes' law fails."
  - "Use relaxation time and Stokes number to predict which particles follow the air and which hit hoods, bends and filter fibres."
  - "Calculate the Brownian diffusion coefficient and displacement of sub-micron fume and compare diffusion with settling."
  - "Explain why a filter has a most penetrating particle size, and combine filter stages by their penetrations."
  - "Estimate deposition in horizontal ducts and plan measurements that prove an extraction system works."
coverVariant: category
references:
  - title: "Dynamical Theories of Brownian Motion"
    creator: "Edward Nelson, Princeton University Press"
    year: "1967"
    note: "Supplied source, read as a subject map of the physical theories of Brownian motion by Einstein, Smoluchowski, Langevin, Ornstein and Uhlenbeck. The book is in copyright; none of its text, derivations, figures or exercises is reproduced. This book applies the same physics to engineering particles with its own case, figures and exercises."
  - title: "Über die von der molekularkinetischen Theorie der Wärme geforderte Bewegung von in ruhenden Flüssigkeiten suspendierten Teilchen"
    creator: "Albert Einstein, Annalen der Physik 322(8), 549–560"
    year: "1905"
    url: "https://doi.org/10.1002/andp.19053220806"
    note: "Original source of the diffusion coefficient of a suspended sphere, D = kT ÷ (6πηr), used with a slip correction in Chapter 5."
  - title: "Zur kinetischen Theorie der Brownschen Molekularbewegung und der Suspensionen"
    creator: "Marian von Smoluchowski, Annalen der Physik 326(14), 756–780"
    year: "1906"
    url: "https://doi.org/10.1002/andp.19063261405"
    note: "Independent kinetic treatment of Brownian motion, cited in Chapter 5 for the history of the diffusion relation."
  - title: "Sur la théorie du mouvement brownien"
    creator: "Paul Langevin, Comptes rendus de l'Académie des Sciences 146, 530–533"
    year: "1908"
    note: "Original form of the equation of motion with a friction term and a fluctuating force, used in Chapter 4 to define the relaxation time."
  - title: "Über die grundlegenden Berechnungen bei der Schwerkraftaufbereitung"
    creator: "L. Schiller and A. Naumann, Zeitschrift des Vereines Deutscher Ingenieure 77, 318–320"
    year: "1933"
    note: "Source of the drag correlation used in Chapters 2 and 4 to correct settling velocities and stopping distances above the Stokes regime."
  - title: "Industrial Ventilation: A Manual of Recommended Practice for Design"
    creator: "American Conference of Governmental Industrial Hygienists"
    year: "current edition"
    note: "Named in Chapter 7 as a source of recommended minimum duct transport velocities; no values are quoted from it."
  - title: "Cunningham correction factor"
    creator: "Wikipedia"
    year: "current article"
    url: "https://en.wikipedia.org/wiki/Cunningham_correction_factor"
    note: "Source of the slip correction formula and Davies's 1945 coefficients for air (1.257, 0.400 and 0.55) used in Chapter 3."
  - title: "Viscosity of air, dynamic and kinematic"
    creator: "The Engineering ToolBox"
    year: "current web page"
    url: "https://www.engineeringtoolbox.com/air-absolute-kinematic-viscosity-d_601.html"
    note: "Source of the dynamic viscosity of air at 20 °C and 1 atm, about 1.81 × 10⁻⁵ Pa·s, used throughout."
  - title: "Boltzmann constant"
    creator: "NIST, CODATA values of the fundamental physical constants"
    year: "current"
    url: "https://physics.nist.gov/cgi-bin/cuu/Value?k"
    note: "Source of the exact value 1.380 649 × 10⁻²³ J/K used for diffusion coefficients in Chapter 5."
  - title: "HEPA"
    creator: "Wikipedia"
    year: "current article"
    url: "https://en.wikipedia.org/wiki/HEPA"
    note: "Background for the 0.3 µm test size and the most penetrating particle size discussed in Chapter 6. Filter classes under EN 1822 and ISO 29463 are named by number only; no values are quoted from them."
  - title: "Workplace exposure standards for airborne contaminants"
    creator: "Safe Work Australia"
    year: "current"
    note: "Named in Chapters 1 and 8 as the governing limits for airborne contaminants. No values are quoted; exposure assessment is for a competent occupational hygienist."
related:
  - title: "Ductwork by the Numbers"
    href: "/reados/publications/ductwork-by-the-numbers/"
  - title: "Welding Health and Safety by the Numbers"
    href: "/reados/publications/welding-health-and-safety-by-the-numbers/"
  - title: "Louvres and Ventilators by the Numbers"
    href: "/reados/publications/louvres-and-ventilators-by-the-numbers/"
---

## About this book

Every machine shop makes particles. Grinding throws sparks and grit, sanding makes dust, machining with coolant makes mist, welding and laser cutting make fume. Some of those particles fall to the floor within a second; others stay in the air for days and travel wherever the air goes. Some are caught easily by a filter; others slip through the best filter at a particular size. The difference is almost entirely a matter of size, and it can be calculated.

This book calculates it. It starts with the size ranges that machines produce and why counting particles and weighing them give such different pictures, then works through drag and settling, the slip correction that matters for small particles, relaxation time and the Stokes number that decide whether a particle follows the air or hits a wall, and the Brownian diffusion that governs the smallest fume. It then applies those numbers to filter capture, deposition in ducts, and the measurements that prove an extraction system works. Every chapter carries the same running case, shows how an error is caught and ends with an exercise and its worked answer.

The physics is a century old. Einstein, Smoluchowski and Langevin worked out how small particles move in a fluid to explain the jiggling of pollen grains and dust under a microscope, the effect Robert Brown described after returning from Australia. The same equations describe a particle of laser fume drifting above a cutting table.

## Prerequisites and how to use the book

It assumes algebra, scientific notation and a little physics: force, mass, velocity and viscosity. Chapters 1 to 5 build the particle mechanics in order. Chapters 6 to 8 apply them to filters, ducts and measurement. Airflow in ducts, fan curves and hoods are covered in *Ductwork by the Numbers*; fume hazards and controls in welding are covered in *Welding Health and Safety by the Numbers*.

## The running case

The book follows **LX-3**, a fictional extraction system for a 3 kW fibre laser cutting machine in a sheet metal shop. The machine cuts stainless steel and mild steel sheet up to 12 mm on a 3,000 × 1,500 mm slatted table. Air is drawn down through the table into zoned plenums at **0.60 m³/s** and carried through **8 m** of **200 mm** round duct, including a long horizontal run and two bends, to a filter unit with pleated cartridge filters, a spark trap ahead of them and a high-efficiency after-filter. The cleaned air returns to the workshop.

The process produces three families of particle: molten **spatter** and dross from 30 µm to well over 100 µm, coarse **dust** from slag and scale of a few micrometres, and **fume**, condensed metal oxide particles from about 0.01 µm to about 1 µm, much of it in loose chains of tiny primary particles. The fume particles are taken as metal oxide with a density of about **5,000 kg/m³**. Air is at **20 °C** and atmospheric pressure, with a viscosity of about **1.81 × 10⁻⁵ Pa·s** and a density of about **1.20 kg/m³**.

All dimensions, flows, particle data and results are invented for teaching. This is an illustration. None of it describes a KEVOS® client, supplier or project.

## Source limits and professional responsibility

The supplied 1967 lecture notes set out the physical theories of Brownian motion; they informed the subject, and nothing from them is reproduced. This book is educational. Fume from cutting and welding stainless and coated steels can contain hexavalent chromium, nickel and other hazardous substances. The design, testing and maintenance of real extraction systems, and any assessment of worker exposure, must follow the work health and safety law that applies, Safe Work Australia's workplace exposure standards and codes of practice, and the advice of a competent ventilation engineer and occupational hygienist.
