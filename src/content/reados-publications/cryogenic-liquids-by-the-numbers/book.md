---
title: "Cryogenic Liquids by the Numbers"
subtitle: "Boiling points, flash, boil-off, cooling energy, shrink fitting, transfer, trapped liquid and oxygen deficiency, worked through one liquid nitrogen station"
description: "Store, move and use liquid nitrogen safely and economically: pressure and boiling point, flash and boil-off, the nitrogen a part needs, shrink fitting, relief and oxygen deficiency."
category: Engineering
tags: [manufacturing, operations, design, validation]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-30
referencesChecked: 2026-10-30
edition: "1"
level: "Intermediate mechanical, maintenance and workshop engineering"
audience: "Mechanical, maintenance and manufacturing engineers, workshop supervisors, fitters and safety officers who store or use liquid nitrogen and need to check its quantities, times, pressures and hazards."
outcomes:
  - "Explain why a cryogenic liquid stays at its boiling point and find that temperature at any tank pressure from NIST data or the Clausius–Clapeyron relation."
  - "Calculate flash loss, standing boil-off and transfer losses, and judge whether a vessel's venting is normal or a fault."
  - "Calculate the liquid nitrogen needed to cool a part from enthalpy data and estimate how long it takes in film boiling."
  - "Design a liquid nitrogen shrink fit from integrated contraction data, including the temperature needed and the time available to assemble."
  - "Size the hazards: pressure from trapped liquid, self-pressurisation, and the oxygen level a release or spill leaves in a room."
coverVariant: category
references:
  - title: "Quantum Field Theoretical Methods in Statistical Physics, 2nd edition"
    creator: "A. A. Abrikosov, L. P. Gor'kov and I. Ye. Dzyaloshinskii, translated by D. E. Brown, edited by D. ter Haar, Pergamon Press"
    year: "1965"
    note: "In copyright. Used only as a map of the low-temperature physics behind the book: quasi-particles and the heat capacity of solids and quantum liquids near absolute zero. No text, structure, figures, tables or problems are reproduced."
  - title: "NIST Chemistry WebBook, SRD 69: Thermophysical Properties of Fluid Systems"
    creator: "E. W. Lemmon, M. O. McLinden and D. G. Friend, National Institute of Standards and Technology"
    year: "current edition"
    url: "https://webbook.nist.gov/chemistry/fluid/"
    note: "Source of every fluid property in the book: saturation temperatures, densities, enthalpies and latent heats of nitrogen, argon, oxygen, hydrogen and helium, the properties of nitrogen gas at 101.325 kPa, and the isochoric pressures of trapped liquid nitrogen. Downloaded as tables and interpolated."
  - title: "Material Properties (cryogenic property fits)"
    creator: "Cryogenic Technologies Group, National Institute of Standards and Technology"
    year: "n.d."
    url: "https://trc.nist.gov/cryogenics/materials/materialproperties.htm"
    note: "Source of the specific heat and linear contraction fits for nickel steels (used as a proxy for low-alloy steel), 304 stainless steel and copper, and the thermal conductivity fit for 32 kg/m³ polyurethane foam. Integrated numerically for the enthalpies and contractions in Chapters 3 to 7 and 10."
  - title: "Heat transfer in stable film boiling"
    creator: "L. A. Bromley, Chemical Engineering Progress 46"
    year: "1950"
    note: "Origin of the film boiling correlation for a horizontal cylinder used in Chapter 5, with nitrogen vapour properties from NIST."
  - title: "Rewet Temperature Correlations for Liquid-Nitrogen Boiling Pipe Flows across Varying Flow Conditions and Orientations"
    creator: "S. R. Darr, J. Dong, N. Glikin, J. W. Hartwig and J. N. Chung, NASA Technical Reports Server 20200000632"
    year: "2020"
    url: "https://ntrs.nasa.gov/citations/20200000632"
    note: "Cited in Chapters 5 and 7 for the description of chilldown: film boiling first, then rewetting at the end of film boiling, and why water-based correlations do not suit liquid nitrogen. No values are taken from it."
  - title: "Model Code of Practice: Confined spaces"
    creator: "Safe Work Australia"
    year: "2024"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-confined-spaces"
    note: "Source for the statement that air normally contains about 21% oxygen and that 19.5% to 23.5% is considered safe, used in Chapter 9. Check which version applies in your jurisdiction."
  - title: "AS 1894:2025, The storage and handling of non-flammable cryogenic and refrigerated liquids"
    creator: "Standards Australia"
    year: "2025"
    url: "https://store.standards.org.au/product/as-1894-2025"
    note: "Named by number and scope in Chapters 8 and 10. Paywalled; no clauses or values are quoted. It replaces AS 1894-1997."
  - title: "AS 1210, Pressure vessels"
    creator: "Standards Australia"
    year: "current edition"
    note: "Named by number and scope in Chapter 8 as the Australian design standard for pressure vessels, which governs cryogenic vessels and their relief devices. No clauses or values are quoted."
related:
  - title: "Cryogenic Design by the Numbers"
    href: "/reados/publications/cryogenic-design-by-the-numbers/"
  - title: "Industrial Gases by the Numbers"
    href: "/reados/publications/industrial-gases-by-the-numbers/"
  - title: "Real Gases by the Numbers"
    href: "/reados/publications/real-gases-by-the-numbers/"
  - title: "Thermal Expansion by the Numbers"
    href: "/reados/publications/thermal-expansion-by-the-numbers/"
  - title: "Heat Transfer by the Numbers"
    href: "/reados/publications/heat-transfer-by-the-numbers/"
  - title: "Fits That Work"
    href: "/reados/publications/fits-that-work/"
---

## About this book

Liquid nitrogen is the cheapest deep cold a workshop can buy. It shrinks shafts and bushes for assembly, freezes samples, grinds rubber and plastics that would smear at room temperature, and cools sensors and test pieces. It is also a liquid that is always boiling, that turns into almost seven hundred times its volume of gas, that can burst a closed pipe and that can take the oxygen out of a room without anyone noticing. Every one of those facts has a number attached, and the numbers are easy to work out once the physics behind them is clear.

This book works through those numbers. It starts with why a cryogenic liquid sits at its boiling point and how the pressure above it sets that temperature. It then calculates the losses that every user pays for, from flash and standing boil-off to the nitrogen spent cooling hoses, and the nitrogen and time a steel part needs to reach −196 °C. It designs a liquid nitrogen shrink fit from measured contraction data, and finishes with the hazards: trapped liquid, self-pressurising vessels, oxygen deficiency and the materials that break when cold.

It is for mechanical, maintenance and manufacturing engineers, workshop supervisors, fitters and safety officers. It assumes algebra, the idea of energy and power, and familiarity with gauge and absolute pressure. Each chapter works the running case with real numbers, includes one plausible mistake and how it was caught, links the WORKOS tool that performs the chapter's calculation where one exists, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one fictional station. This is an illustration. A gearbox and pump repair workshop fits quenched and tempered alloy steel stub shafts into heavy steel gear carriers that already carry their bearings. The carriers weigh about 280 kg and cannot be heated evenly in the workshop, so the shafts are shrunk in liquid nitrogen instead. The station is called SF-180.

- **Supply:** a 180 L low-pressure liquid cylinder, delivered holding 140 kg of nitrogen, with its pressure-building regulator set to 100 kPa gauge and its relief valve set to 150 kPa gauge. The maker's normal evaporation rate is 2.0% of the full contents a day.
- **Transfer:** a 1.5 m stainless corrugated hose of 17 mm outside diameter, 0.45 kg/m, insulated with 25 mm of foam, delivering about 6 L/min.
- **Bath:** an open-topped stainless liner 400 × 300 × 350 mm deep, 1.2 mm thick, in 100 mm of rigid polyurethane foam, with a hinged foam lid. It is filled to 220 mm, 26.4 L of liquid.
- **Part:** a low-alloy steel shaft 80 mm in diameter and 350 mm long, 13.81 kg, with a design diametral interference of 0.060 to 0.095 mm in its carrier and a wanted assembly clearance of 0.03 mm.
- **Room:** a maintenance bay 8 × 6 × 3.5 m, 168 m³.

The station, its equipment, the parts and their numbers are invented and do not describe KEVOS® work or any real business. Equipment data are of the kind makers publish, not the data of any product.

## How to use the book

Read Chapters 1 to 3 in order: they set out boiling, pressure and heat leak, which every later chapter uses. Chapters 4 to 6 follow a part from the bath to its carrier. Chapter 7 deals with moving the liquid, Chapters 8 and 9 with its two main hazards, and Chapter 10 pulls the station together into materials rules, a procedure and a monthly nitrogen budget.

All fluid properties come from NIST's tables, and all solid properties from NIST's cryogenic material fits, integrated over temperature. Figures are given to more digits than a measurement would justify, so that a reader can follow each step. The linked WORKOS tools use constant properties; the chapters show how to give them the right average values.

## Source limits and professional responsibility

The book's relations are the simplified forms used for hand checks. Real heat transfer to a boiling cryogen depends on surface condition, orientation and agitation, and the chapters that estimate times say how far to trust them. Measure on the job where it matters.

Cryogenic liquids cause cold burns, embrittle ordinary materials, burst closed spaces and displace oxygen. Their storage and handling are covered in Australia by AS 1894, by pressure equipment standards such as AS 1210, by the supplier's safety data sheet and instructions, and by work health and safety law and codes of practice in each state and territory. This book is educational. It is not a procedure, a risk assessment or a design for any station, and a competent person must approve real work.
