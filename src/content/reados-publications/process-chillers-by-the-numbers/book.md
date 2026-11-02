---
title: "Process Chillers by the Numbers"
subtitle: "Sizing, reading and running a process-water chiller from real refrigerant data: load, state points, flash gas, compressor, lift, cost and fault-finding"
description: "Size, check and run a process-water chiller with numbers: cooling load, the cycle from NIST R-134a data, saturation, flash gas, compressor work, temperature lift, cost and faults."
category: Engineering
tags: [manufacturing, operations, design]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-27
referencesChecked: 2026-10-27
edition: "1"
level: "Intermediate engineering thermodynamics for production plant"
audience: "Production, process and maintenance engineers, technicians, facilities managers and buyers who specify, commission, run or troubleshoot process-water chillers in factories."
outcomes:
  - "Measure or estimate a process cooling load and turn it into a water flow and a chiller rating."
  - "Work a chiller's cycle point by point from real refrigerant data and check its energy balance."
  - "Read evaporating and condensing temperatures, superheat and subcooling from gauges and thermometers."
  - "Show how flash gas, compressor efficiency and temperature lift drive capacity, power and cost."
  - "Commission a chiller against its rating and diagnose common faults from their numerical signatures."
coverVariant: category
references:
  - title: "Fundamentals of Statistical and Thermal Physics"
    creator: "F. Reif, McGraw-Hill"
    year: "1965"
    note: "Supplied source, in copyright. Read as a subject map for the second law, refrigerators, throttling and the Joule–Thomson process, and equilibrium between phases with the Clausius–Clapeyron equation. No text, derivations as set out, figures, tables or problems are reproduced; the treatment, case, numbers and exercises in this book are its own."
  - title: "Thermophysical Properties of Fluid Systems, NIST Chemistry WebBook, SRD 69"
    creator: "E. W. Lemmon, M. O. McLinden and D. G. Friend, National Institute of Standards and Technology"
    year: "2026"
    url: "https://webbook.nist.gov/chemistry/fluid/"
    note: "Source of every refrigerant property in the book: R-134a saturation and superheated vapour data in the ASHRAE reference state (enthalpy and entropy zero for saturated liquid at −40 °C), and water's enthalpy for the cooling load. Values retrieved on the date checked."
  - title: "ARCtick: Australian Refrigeration Council"
    creator: "Australian Refrigeration Council"
    year: "2026"
    url: "https://www.arctick.org/"
    note: "The body that administers refrigerant handling licences and refrigerant trading authorisations on behalf of the Australian Government. Referred to in Chapter 9 for who may work on a chiller's refrigerant circuit."
  - title: "AS/NZS 5149 Refrigerating systems and heat pumps: safety and environmental requirements"
    creator: "Standards Australia and Standards New Zealand"
    year: "edition as called up"
    note: "Named by number and scope as the standard for the safety of refrigerating systems. No values are quoted from it."
related:
  - title: "Heat Pumps and Refrigeration by the Numbers"
    href: "/reados/publications/heat-pumps-and-refrigeration-by-the-numbers/"
  - title: "Heat Transfer by the Numbers"
    href: "/reados/publications/heat-transfer-by-the-numbers/"
  - title: "Vacuum by the Numbers"
    href: "/reados/publications/vacuum-by-the-numbers/"
---

## About this book

A process chiller is the refrigeration plant most factories own: a packaged machine that cools water for moulds, machine tools, hydraulic systems, lasers, welders, plating baths and food processes, and sends it round the plant in a closed loop. It is usually bought on a single number, its rated capacity, and then run for fifteen years by people who are rarely told what its gauges mean. Yet its performance, its running cost and most of its faults can be read from a handful of measurements, if they are interpreted with the right refrigerant data.

This book works through one process chiller with numbers. It sets out what the chiller is asked to do and the second law's limit on it, calculates the cooling load, works the vapour-compression cycle point by point from NIST's refrigerant data, and then looks in turn at saturation pressure and temperature, throttling and flash gas, compressor work and discharge temperature, the effect of temperature lift, running cost, and commissioning and fault-finding. Each chapter follows one running case, includes a plausible mistake and how it was found, and ends with an exercise and its worked answer.

It is written as a companion to the Library’s Heat Pumps and Refrigeration by the Numbers, which sets out the second law, the cycle, heat pump water heating, cold rooms and refrigerant rules for a food factory. This book does not repeat that ground. It goes deeper into one kind of machine, calculating its state points from published property data and showing how to read and diagnose it in service. It assumes school algebra and physics; the Library’s Heat Transfer by the Numbers covers the heat flows that evaporators and condensers rely on.

## The running case

Every chapter follows one fictional machine. This is an illustration. A plastics moulder cools its injection-mould circuits with a process-water chiller, called CH-30 here, rated at **30 kW** of cooling. Water leaves the chiller at **12 °C** and returns from the moulds at **17 °C**, a flow of about 1.43 kg/s. The chiller uses **R-134a** in a single vapour-compression circuit with an air-cooled condenser, sized to work in ambient air up to 35 °C. At its design point it evaporates at **2 °C** with **5 K** of superheat at the compressor's inlet, condenses at **45 °C** with **5 K** of subcooling, and its compressor has an isentropic efficiency of **0.70**.

All refrigerant properties are NIST's, in the ASHRAE reference state. The moulder, the chiller's ratings, its prices and its problems are invented. None describes KEVOS® work or a real business.

## How to use the book

Read Chapters 1 to 3 first: they set out the job, the load and the cycle that every later chapter uses. Chapters 4 to 6 look inside the cycle, Chapter 7 at what changes its performance, Chapter 8 at what it costs to run, and Chapter 9 at commissioning a chiller and finding its faults. Every calculation was checked by running it, and values are given to more figures than a shop needs so that the arithmetic can be followed.

## Source limits and professional responsibility

The thermodynamics in this book is standard, and the refrigerant data are NIST's. The chiller's efficiencies, operating hours, tariffs and prices are illustrations. Refrigerating systems contain gases under pressure, and in Australia the people who handle refrigerants must be licensed. Chillers are designed, installed and serviced by qualified, licensed people to the applicable standards and regulations, and qualified review governs real work. This book teaches how process chillers behave and how to check them. It is not a design for any system.
