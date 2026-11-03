---
title: "Vibration Monitoring by the Numbers"
subtitle: "Accelerometers, units and severity, spectra, unbalance, misalignment, bearing and gear faults, alarms and running a monitoring program"
description: "How to monitor the condition of rotating machines by vibration, from piezoelectric sensors and units to spectra, fault diagnosis, alarms and the economics of a program, worked with numbers."
category: Operations
tags: [operations, systems, quality, process-improvement]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-11-03
referencesChecked: 2026-11-03
edition: "1"
level: "Intermediate maintenance, reliability and mechanical engineering"
audience: "Maintenance planners, reliability and mechanical engineers, fitters, vibration technicians and operations managers who set up, run, interpret or pay for vibration monitoring of fans, pumps, motors and gearboxes."
outcomes:
  - "Explain why vibration reveals machine condition, and set monitoring intervals from the time between a fault's first sign and failure."
  - "Convert between acceleration, velocity and displacement, choose measurement units and judge severity against standards and baselines."
  - "Explain how a piezoelectric accelerometer works, and mount and select one so that its frequency range covers the faults of interest."
  - "Read a vibration spectrum and diagnose unbalance, misalignment, looseness, resonance, rolling bearing and gear faults."
  - "Set alarm limits, run a route or online program, and judge its cost against the failures it prevents."
coverVariant: category
references:
  - title: "Introduction to Solid State Physics"
    creator: "C. Kittel, John Wiley & Sons"
    year: "1996"
    note: "Seventh edition. Copyright work, used only as a map of ideas: dielectric polarisation, ferroelectric crystals and the piezoelectric effect, and elastic waves in solids. No text, equations as set out there, figures or problems are reproduced, and all cases and calculations are KEVOS® originals."
  - title: "Vibration-based Condition Monitoring: Industrial, Aerospace and Automotive Applications"
    creator: "R. B. Randall, John Wiley & Sons"
    year: "2011"
    note: "Background for signal processing, spectrum analysis, envelope analysis and the diagnosis of rolling bearing and gear faults used in Chapters 5, 8 and 9."
  - title: "ISO 20816-3, Mechanical vibration — Measurement and evaluation of machine vibration — Part 3: Industrial machinery with a power rating above 15 kW and operating speeds between 120 r/min and 30 000 r/min"
    creator: "International Organization for Standardization"
    year: "2022"
    note: "Named by number and scope only: broadband in-situ vibration evaluation of coupled industrial machines. Its zone boundaries and criteria are not reproduced and must be read in full."
  - title: "ISO 18436-2, Condition monitoring and diagnostics of machines — Requirements for qualification and assessment of personnel — Vibration condition monitoring and diagnostics"
    creator: "International Organization for Standardization"
    year: "2014"
    note: "Named by number and scope only: a four-category scheme for vibration analysts. A revision was in development in 2024–25; check the current edition."
  - title: "NIST/SEMATECH e-Handbook of Statistical Methods"
    creator: "National Institute of Standards and Technology"
    year: "2012"
    url: "https://www.itl.nist.gov/div898/handbook/"
    note: "Background for the Weibull, control chart and trending methods used in Chapters 1, 4 and 10."
related:
  - title: "Vibrating Machine Elements by the Numbers"
    href: "/reados/publications/vibrating-machine-elements-by-the-numbers/"
  - title: "Shaft Alignment by the Numbers"
    href: "/reados/publications/shaft-alignment-by-the-numbers/"
  - title: "Random Vibration by the Numbers"
    href: "/reados/publications/random-vibration-by-the-numbers/"
  - title: "Gears by the Numbers"
    href: "/reados/publications/gears-by-the-numbers/"
  - title: "Ultrasonic Testing by the Numbers"
    href: "/reados/publications/ultrasonic-testing-by-the-numbers/"
  - title: "Insulation Testing by the Numbers"
    href: "/reados/publications/insulation-testing-by-the-numbers/"
---

## About this book

Every rotating machine vibrates, and the way it vibrates changes as it wears. An unbalanced fan shakes once per revolution; a misaligned coupling adds twice per revolution; a spalled bearing race rings at a frequency set by its geometry; a chipped gear tooth knocks once each time it meshes. Measured with a small sensor on the bearing housing and analysed by frequency, those changes appear weeks or months before the machine fails, which gives a maintenance team time to plan the repair instead of reacting to a breakdown.

This book shows how to use vibration monitoring with numbers. It starts with why vibration reveals condition and how that sets monitoring intervals, then covers the units of vibration and how to convert between them, the piezoelectric accelerometer that measures it, judging severity and setting alarms, and reading a spectrum. It then works through the common faults, unbalance, misalignment, looseness, resonance, rolling bearing defects and gear faults, and finishes with running a program and judging what it is worth.

It is for maintenance planners, reliability and mechanical engineers, fitters, vibration technicians and operations managers. It assumes engineering or trade training and comfort with basic mechanics; the physics of the sensor and the signal processing are explained as they are used. Each chapter works the running case with real numbers, includes a plausible mistake and how it was found, links the KEVOS® tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one site. This is an illustration. A timber mill near Mount Gambier, South Australia, runs a sawmill, a chipper and a kiln, and monitors its critical rotating plant on a fortnightly route with a portable data collector, plus two permanently mounted sensors on its most important machine:

- **F-2, the dust extraction fan:** a 55 kW motor driving an overhung centrifugal impeller at 1,480 r/min through a flexible coupling.
- **P-4, the hydraulic power unit for the log carriage:** a 37 kW, 1,480 r/min motor whose drive-end bearing is a 6309 deep-groove ball bearing.
- **G-3, the log-deck conveyor gearbox:** a two-stage helical reducer driven at 1,480 r/min, with a 19-tooth input pinion.
- **The chipper:** the mill's largest machine, with permanently mounted accelerometers on its two main bearings.

Speeds, sizes, vibration levels, costs and results are the mill's working figures or are calculated from stated assumptions. They do not describe KEVOS® work or any real mill, machine maker or service company. Bearing geometry is typical for illustration and should be taken from the bearing maker's data for real calculations. Prices are in Australian dollars excluding GST.

## How to use the book

Read Chapters 1 to 3 first: they set out why monitoring works, the units and the sensor. Chapters 4 and 5 cover severity, alarms and spectra, which every diagnostic chapter uses. Chapters 6 to 9 cover the faults and can be read in any order. Chapter 10 brings the program and its cost together.

Every calculation in the book was checked by running it, and the KEVOS® tools linked from each chapter were checked against the calculations they perform. Where a tool was built for a different purpose but does one step of a chapter's calculation, the chapter says which output is used.

## Source limits and professional responsibility

This book is educational. Severity criteria for particular machines come from standards such as the ISO 20816 series and from machine makers, which the book names by number and scope only; their limits are not reproduced. Working near rotating machinery and taking measurements on running plant are hazardous and must follow the site's safe work procedures, isolation rules and guarding requirements. Decisions to run, repair or stop real machines remain with the competent people responsible for them.
