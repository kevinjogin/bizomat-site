---
title: "Compressed Air Plant by the Numbers"
subtitle: "Free air delivery, compression work, heat, water, dryers, pressure, receivers and distribution, worked through one factory compressor room"
description: "Calculate what a compressor room really does: the work of compression, the heat it makes, the water it condenses, and the pressure, storage and pipe choices that set the power bill."
category: Engineering
tags: [design, operations, process-improvement]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-27
referencesChecked: 2026-10-27
edition: "1"
level: "Intermediate mechanical engineering"
audience: "Mechanical and maintenance engineers, energy managers and plant managers who specify, run, audit or extend a factory's compressed air plant, from the compressor room to the main headers."
outcomes:
  - "Convert between free air delivery, actual volume and mass flow, and state pressure ratios correctly."
  - "Calculate isothermal and isentropic compression work and judge a compressor's specific power against them."
  - "Estimate discharge temperatures, the benefit of staging, and the heat available for recovery."
  - "Calculate the water condensed by aftercoolers and dryers and convert between pressure and atmospheric dew points."
  - "Choose pressure set points, receiver volumes, control modes and main sizes from their effect on power and pressure."
coverVariant: category
references:
  - title: "DOE Fundamentals Handbook: Thermodynamics, Heat Transfer, and Fluid Flow, Volume 1 of 3 (DOE-HDBK-1012/1-92)"
    creator: "U.S. Department of Energy"
    year: "1992"
    note: "Supplied source, a U.S. Government training handbook approved for public release with unlimited distribution. Read for its treatment of the ideal gas law, compression processes, the first and second laws and efficiency. Its imperial-unit examples and text are not reproduced; this book uses SI units and its own case."
  - title: "Revised Release on the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam (IAPWS R7-97)"
    creator: "International Association for the Properties of Water and Steam"
    year: "2012 revision"
    url: "https://www.iapws.org/relguide/IF97-Rev.html"
    note: "Source of the saturation-pressure equation used for every water vapour pressure above 0 °C in the book; values were checked against the NIST WebBook to within 0.03 per cent."
  - title: "Revised Release on the Pressure along the Melting and Sublimation Curves of Ordinary Water Substance (IAPWS R14-08)"
    creator: "International Association for the Properties of Water and Steam"
    year: "2011"
    url: "https://www.iapws.org/relguide/MeltSub.html"
    note: "Source of the sublimation-pressure equation used for vapour pressures over ice, needed for dew points below 0 °C."
  - title: "Thermophysical Properties of Fluid Systems, NIST Chemistry WebBook, SRD 69"
    creator: "E. W. Lemmon, M. O. McLinden and D. G. Friend, National Institute of Standards and Technology"
    year: "current online edition"
    url: "https://webbook.nist.gov/chemistry/fluid/"
    note: "Used to check the water saturation pressures calculated from the IAPWS equation."
  - title: "Improving Compressed Air System Performance: A Sourcebook for Industry, third edition"
    creator: "U.S. Department of Energy, Advanced Manufacturing Office, with the Compressed Air Challenge"
    year: "2016"
    note: "Government guidance used as background on control modes, storage, leaks, heat recovery and system assessment. No figures or tables are reproduced."
  - title: "ISO 1217, Displacement compressors, acceptance tests; ISO 8573-1, Compressed air, contaminants and purity classes"
    creator: "International Organization for Standardization"
    year: "current editions"
    note: "Named by number and scope only: the first for how free air delivery and specific power are measured, the second for how air quality, including pressure dew point, is specified. No classes or values are quoted."
  - title: "AS 1210 Pressure vessels; AS/NZS 1200 Pressure equipment; AS 4343 Pressure equipment, hazard levels"
    creator: "Standards Australia"
    year: "current editions"
    note: "Named by number and scope only, as the standards that govern air receiver design, the wider pressure equipment regime and hazard classification. No clauses are quoted."
related:
  - title: "Pneumatics by the Numbers"
    href: "/reados/publications/pneumatics-by-the-numbers/"
  - title: "Thermal Expansion by the Numbers"
    href: "/reados/publications/thermal-expansion-by-the-numbers/"
---

## About this book

Compressed air is often called a factory's most expensive utility, and the reason is in the thermodynamics. A compressor turns electricity into pressure, but most of the electricity becomes heat on the way, and most of the pressure is then thrown away through regulators, leaks and open blowers. The compressor room is where those losses start and where many of them can be fixed.

This book follows the energy and the water through one compressor room. It begins with what "a cubic metre of air" means, calculates the ideal work of compression and compares a real compressor against it, then follows the heat the compressor makes, the water the air carries, the dryers that remove it, the pressure the system runs at, the storage and controls that decide part-load power, and the pipes that take the air to the plant. The last chapter turns the numbers into an assessment.

It serves mechanical and maintenance engineers, energy managers and plant managers who run, audit or extend compressed air plant. You need comfortable algebra, SI units and a spreadsheet. The thermodynamics is introduced as it is used. READOS's Pneumatics by the Numbers covers the point-of-use side, cylinders, valves and leak hunting; this book stays in the compressor room and the mains.

## The running case

Every chapter works on one fictional installation: **CA-1, the compressor room of a packaging plant.** An oil-injected rotary screw compressor with a 37 kW motor delivers 6.0 m³/min of free air at 750 kPa gauge, drawing about 41 kW at full load. Air at 25 °C and 60 per cent relative humidity enters the intake. An aftercooler cools the compressed air to 35 °C, a refrigerated dryer brings it to a pressure dew point of 3 °C, and a receiver and a main carry it to the plant, which uses an average of 4.2 m³/min over 6,000 hours a year.

This is an illustration. All flows, powers, prices, results and failures are invented for teaching and checked by calculation. They are not KEVOS® work, a real site or a measured compressor, and real compressors' performance comes from their makers' test data. Electricity is priced at a teaching A$0.25 per kWh and gas at A$18 per GJ, both excluding GST.

## Source limits and professional responsibility

The supplied DOE Fundamentals Handbook informed the subject map and the principles of ideal gases, compression and efficiency. This book develops them in SI units with its own case, figures and exercises, and nothing is copied from the handbook's text or examples.

This book is educational. Compressed air systems store energy in receivers and pipework, discharge air hot enough to burn and at pressures that can inject air into skin or launch debris, and contain oil that can ignite. Receivers are pressure vessels with design, registration and inspection duties under the model Work Health and Safety Regulations and the Australian Standards named in the references. Changes to pressures, safety valves, controls and receivers need competent review. Use the methods here to understand and question a system, not as authority to alter one.
