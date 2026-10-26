---
title: "Heat Exchangers by the Numbers"
subtitle: "Duty, temperature difference, coefficients, fouling, rating, plates and shells, pressure drop and boiling, worked through one hydraulic oil cooler"
description: "Size and rate heat exchangers with numbers: energy balances, LMTD and F correction, overall and film coefficients, fouling, effectiveness–NTU, plate or shell, pressure drop and boiling."
category: Engineering
tags: [design, systems, operations, quality]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Intermediate thermal engineering and plant design"
audience: "Mechanical, process and maintenance engineers who specify, check, buy, run or troubleshoot heat exchangers on industrial plant, from oil coolers and process water exchangers to condensers."
outcomes:
  - "Write a heat exchanger's duty as energy balances on both streams and check that they agree."
  - "Calculate the log mean temperature difference, its multi-pass correction and the area a duty needs."
  - "Build an overall coefficient from film coefficients, the wall and fouling, and find the controlling resistance."
  - "Rate an existing exchanger at new conditions with the effectiveness–NTU method and track its fouling in service."
  - "Choose between plate and shell-and-tube designs, and weigh velocity, pressure drop and boiling limits."
coverVariant: category
references:
  - title: "DOE Fundamentals Handbook: Thermodynamics, Heat Transfer, and Fluid Flow, Volume 2 of 3 (DOE-HDBK-1012/2-92)"
    creator: "U.S. Department of Energy"
    year: "1992"
    note: "Supplied source, a public-domain United States government training handbook approved for public release. Used as a subject map of heat transfer terminology, conduction through cylindrical walls, the overall coefficient, parallel and counterflow exchangers, regenerative and non-regenerative exchangers, the log mean temperature difference and boiling regimes. Its nuclear-specific sections are not used. This book's examples, figures and text are its own."
  - title: "Heat transfer in automobile radiators of the tubular type"
    creator: "F. W. Dittus and L. M. K. Boelter, University of California Publications in Engineering, vol. 2"
    year: "1930"
    note: "The origin of the widely used turbulent tube-flow correlation applied in Chapter 5, used in its common modern form."
  - title: "Standards of the Tubular Exchanger Manufacturers Association; AS 1210 Pressure vessels"
    creator: "Tubular Exchanger Manufacturers Association; Standards Australia"
    year: "Current editions"
    note: "Named by name and scope only, as the industry standard for shell-and-tube exchanger construction and the Australian standard for pressure vessel design. No values or methods are quoted from them."
related:
  - title: "Heat Transfer by the Numbers"
    href: "/reados/publications/heat-transfer-by-the-numbers/"
  - title: "Thermal Expansion by the Numbers"
    href: "/reados/publications/thermal-expansion-by-the-numbers/"
  - title: "Pneumatics by the Numbers"
    href: "/reados/publications/pneumatics-by-the-numbers/"
---

## About this book

A heat exchanger moves heat from one fluid to another without letting them mix. It looks simple, a bundle of tubes in a shell or a stack of pressed plates, but its performance depends on a chain of numbers: how much heat the duty needs, how large a temperature difference drives it, how easily heat crosses each film and wall, how quickly dirt builds up, how fast the fluids must flow and how much pump pressure that costs. Every link in the chain can be calculated, and an exchanger that disappoints in service almost always has one link that was assumed rather than worked out.

This book follows the chain in order: the duty and its energy balances, the log mean temperature difference and the multi-pass correction, the overall coefficient and its resistances, film coefficients from correlations, fouling and its monitoring, rating an existing exchanger with the effectiveness–NTU method, plate and shell-and-tube designs, velocity and pressure drop, and boiling, condensing and burnout. Each chapter ends with an exercise and a worked answer.

It suits mechanical, process and maintenance engineers. It assumes school algebra, logarithms and the basic ideas of heat transfer; *Heat Transfer by the Numbers* covers conduction, convection and radiation from first principles and has one chapter on a plate heat-recovery exchanger, and this book goes on from there.

## The running case

Every chapter follows one fictional exchanger. This is an illustration. OC-35 is a shell-and-tube oil cooler on the hydraulic power unit of a large press. It must remove 35 kW from the hydraulic oil, cooling it from 55 °C to 45 °C, using water from the plant's cooling tower, which arrives at 29 °C and may leave at 34 °C. The oil flows through the shell; the tower water flows through the tubes, which can be cleaned. Its fluid properties, coefficients and dimensions are illustrations chosen to show the method.

The exchanger and its numbers are invented; none describes KEVOS® work or a real installation. Prices, where they appear, are illustrations in Australian dollars excluding GST.

## Source limits and professional responsibility

This book is educational. Its correlations and coefficients are the simplified forms used for first estimates; real exchangers are designed with the maker's methods, measured fluid properties and validated software, and can differ from simple estimates by tens of per cent. Heat exchangers containing fluids under pressure are pressure equipment, and in Australia their design, manufacture, registration and inspection are governed by work health and safety regulations and the standards they call up. A competent engineer's design and the applicable approvals govern real equipment.
