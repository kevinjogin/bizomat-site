---
title: "Thermoelectric Cooling by the Numbers"
subtitle: "Seebeck and Peltier effects, module datasheets, operating points, heat sinks, cabinet loads, condensation, control and reliability"
description: "How thermoelectric coolers pump heat with no moving parts, and how to size, sink, power, control and judge one for a sealed cabinet or small chiller, worked with numbers."
category: Engineering
tags: [design, product-development, systems]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-11-03
referencesChecked: 2026-11-03
edition: "1"
level: "Intermediate mechanical, electrical and product engineering"
audience: "Mechanical, electrical, controls and product engineers, maintenance planners and buyers who specify, design, test or replace thermoelectric coolers for sealed cabinets, instruments, sample chillers and electronics."
outcomes:
  - "Explain the Seebeck, Peltier and Thomson effects, why semiconductors pump heat and metals do not, and what the figure of merit ZT limits."
  - "Derive a module's Seebeck coefficient, resistance and conductance from its datasheet and calculate the heat pumped, power and COP at any current and temperatures."
  - "Size the modules, hot-side heat sink and cold-side exchanger together for a cabinet's heat load, including walls, insulation and sun."
  - "Check the cold side for condensation, and choose a supply, connection and control scheme that keeps the COP and the modules' life."
  - "Judge reliability, running cost and the choice between thermoelectric, compressor and plain ventilation cooling with numbers."
coverVariant: category
references:
  - title: "Introduction to Modern Solid State Physics"
    creator: "Y. M. Galperin, lecture notes for course FYS 448, Department of Physics, University of Oslo"
    year: "2001"
    note: "Copyright work, used only as a map of ideas: transport of charge and heat by electrons, the thermoelectric (Seebeck) and Peltier coefficients and their relation, the Wiedemann–Franz law, and the lattice's share of heat conduction. No text, equations as set out there, figures or problems are reproduced, and all cases and calculations are BIZOMAT originals."
  - title: "Introduction to Thermoelectricity"
    creator: "H. J. Goldsmid, Springer"
    year: "2016"
    note: "Second edition (Springer Series in Materials Science 121). Background for the thermoelectric effects, the figure of merit, bismuth telluride materials, module theory, optimum current and coefficient of performance used in Chapters 1 to 4."
  - title: "CRC Handbook of Thermoelectrics"
    creator: "D. M. Rowe (editor), CRC Press"
    year: "1995"
    note: "Background for module construction, performance modelling from datasheet parameters, heat exchangers for modules and reliability considerations used in Chapters 3, 5 and 9."
  - title: "IEC 60529, Degrees of protection provided by enclosures (IP Code)"
    creator: "International Electrotechnical Commission"
    year: "2013"
    note: "Named by number and scope only, for the IP ratings of the sealed cabinet in the running case. Its requirements are not reproduced."
  - title: "NIST/SEMATECH e-Handbook of Statistical Methods"
    creator: "National Institute of Standards and Technology"
    year: "2012"
    url: "https://www.itl.nist.gov/div898/handbook/"
    note: "Background for the Weibull, exponential and confidence-bound methods used in Chapter 9 and in the BIZOMAT tools linked from it."
related:
  - title: "Fins and Heat Sinks by the Numbers"
    href: "/reados/publications/fins-and-heat-sinks-by-the-numbers/"
  - title: "Contact Temperature Sensors by the Numbers"
    href: "/reados/publications/contact-temperature-sensors-by-the-numbers/"
  - title: "Condensation Control by the Numbers"
    href: "/reados/publications/condensation-control-by-the-numbers/"
  - title: "Heat Pumps and Refrigeration by the Numbers"
    href: "/reados/publications/heat-pumps-and-refrigeration-by-the-numbers/"
  - title: "Electronics Packaging by the Numbers"
    href: "/reados/publications/electronics-packaging-by-the-numbers/"
---

## About this book

Pass a direct current through a junction of two different conductors and the junction warms or cools, depending on the direction of the current. Build the junction from two well-chosen semiconductors, repeat it a hundred times between two ceramic plates, and the result is a thermoelectric cooler: a flat, silent, solid-state heat pump a few millimetres thick that moves heat from one face to the other at the rate the current sets, and reverses when the current does. It has no compressor, no refrigerant and no moving parts apart from the fans on its heat exchangers.

It also has a low coefficient of performance, a hard limit on the temperature difference it can make, and a hot side that must reject both the heat pumped and all the electrical power supplied. Thermoelectric coolers are excellent for small, sealed, quiet or precise jobs and poor for large ones. This book shows how to tell which a job is and how to design for it with numbers: the physics of the effects and the materials, the module's datasheet and the model behind it, the operating point, the heat sinks, the heat load, condensation, power and control, reliability, and the choice between thermoelectric, compressor and ventilation cooling.

It is for mechanical, electrical, controls and product engineers, maintenance planners and buyers. It assumes engineering training and comfort with basic heat transfer and electricity; the solid-state physics is explained from the start as it is used. Each chapter works the running case with real numbers, includes a plausible mistake and how it was found, links the BIZOMAT tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one installation. This is an illustration. An irrigation trust in the Riverland of South Australia runs a pump station near Loxton whose control and telemetry equipment sits in a sealed outdoor cabinet, TC-1, on the shaded south wall of the pump shed:

- **The cabinet:** powder-coated steel, 600 mm high, 500 mm wide and 250 mm deep, sealed to IP66 against dust and hosing. It holds the station's controller, a 4G router, a radio, a 24 V power supply, I/O, a battery charger and a 12 V standby battery, giving off 45 W in all.
- **The problem:** design summer air temperatures reach 45 °C, and the router and battery maker want the cabinet's air kept at or below 35 °C. Fans and filters cannot cool a cabinet below the outside air, and filters clog with Riverland dust.
- **The cooler:** a thermoelectric air-to-air cooler, CC-1, with three modules on a 24 V supply, a finned hot-side heat sink and fan outside the cabinet and a finned cold-side exchanger and fan inside.
- **A second job:** the station's water-quality autosampler has a small insulated sample box, SC-1, that must hold its samples at 4 °C, cooled by a single module.

The modules are a generic 127-couple bismuth telluride type rated 6.0 A, 15.4 V and a maximum temperature difference of 68 K at a 27 °C hot side. Dimensions, loads, temperatures, prices and results are the trust's working figures or are calculated from stated assumptions. They do not describe BIZOMAT work or any real trust, manufacturer, supplier or customer. Prices are in Australian dollars, including GST where stated.

## How to use the book

Read Chapters 1 to 4 in order: they build the physics and the module model that the rest uses. Chapters 5 and 6 go together on the heat sinks and the heat load, and Chapter 7 on condensation follows from them. Chapters 8 and 9 can be read in either order, and Chapter 10 brings the choice of cooling method and its cost together.

Every calculation in the book was checked by running it, and the BIZOMAT tools linked from each chapter were checked against the calculations they perform. Where a tool was built for a different purpose but answers one question in a chapter, such as the enclosure cooling tool's refusal to cool below ambient, the chapter says what is used and what is not.

## Source limits and professional responsibility

This book is educational. Electrical installations, enclosures for hazardous areas, medical and food refrigeration, and equipment carrying safety functions are governed by standards, regulations and certification requirements that this book does not cover. Module, heat sink and fan ratings must be taken from the maker's current data, and designs for real equipment must be checked by testing and by competent people responsible for them.
