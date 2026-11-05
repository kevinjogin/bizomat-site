---
title: "Heat Transfer by the Numbers"
subtitle: "Conduction, insulation, convection, radiation, heat exchangers and warm-up times, worked through one factory hot water system"
description: "Calculate heat flows in plant: energy and power, conduction through walls and pipe insulation, convection, radiation, economic insulation, heat exchangers and heating and cooling times."
category: Engineering
tags: [design, operations, process-improvement]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Intermediate engineering physics"
audience: "Maintenance and production engineers, energy managers, plant designers and technicians who need to estimate heat losses, insulation, heat exchanger duty and heating times with defensible numbers."
outcomes:
  - "Convert between energy and power and calculate the heat to warm a quantity of water or metal."
  - "Calculate conduction through layered walls and pipe insulation using thermal resistances."
  - "Estimate convection and radiation from surfaces and see how surface finish changes them."
  - "Choose an economic insulation thickness from heat cost and installed cost."
  - "Size a counterflow heat exchanger by LMTD and estimate warm-up and cool-down times."
coverVariant: category
references:
  - title: "A Text-Book of Physics: Heat, eighth edition"
    creator: "J. H. Poynting and J. J. Thomson, Charles Griffin and Company, London"
    year: "1925"
    note: "Supplied source, read as a subject map of temperature, quantity of heat, specific heat, conduction, convection, radiation and the mechanical equivalent of heat. Both authors died before 1955. No text, figures, examples or problems are reproduced; this book's case, calculations and figures are original and in SI units."
  - title: "Thermal Conductivity of Common Materials; Emissivity Coefficients of Common Materials; Convective Heat Transfer"
    creator: "The Engineering ToolBox"
    year: "current web pages"
    url: "https://www.engineeringtoolbox.com/thermal-conductivity-d_429.html"
    note: "Source for conductivities of mineral wool (0.04 W/m·K) and stainless steel (17 W/m·K), emissivities (paint 0.96, aluminium foil 0.04, stainless steel polished 0.075 and weathered 0.85) and typical convection coefficient ranges. The emissivity and convection pages are at engineeringtoolbox.com/emissivity-coefficients-d_447.html and engineeringtoolbox.com/convective-heat-transfer-d_430.html."
  - title: "Specific Heat Capacity of Water"
    creator: "The Engineering ToolBox"
    year: "current web page"
    url: "https://www.engineeringtoolbox.com/specific-heat-capacity-water-d_660.html"
    note: "Source for the specific heat of water, between about 4.18 and 4.21 kJ/kg·K from 10 °C to 90 °C; this book uses 4.19 kJ/kg·K."
  - title: "CODATA value: Stefan-Boltzmann constant"
    creator: "National Institute of Standards and Technology"
    year: "current"
    url: "https://physics.nist.gov/cgi-bin/cuu/Value?sigma"
    note: "Source for σ = 5.670 374 419 × 10⁻⁸ W/m²·K⁴, an exact value, used in Chapter 5."
related:
  - title: "Combustion by the Numbers"
    href: "/reados/publications/combustion-by-the-numbers/"
  - title: "Condensation Control by the Numbers"
    href: "/reados/publications/condensation-control-by-the-numbers/"
  - title: "Thermal Expansion by the Numbers"
    href: "/reados/publications/thermal-expansion-by-the-numbers/"
  - title: "Industrial Electric Heating by the Numbers"
    href: "/reados/publications/industrial-electric-heating-by-the-numbers/"
  - title: "Heating systems: boilers, burners and controls"
    href: "/reados/collections/fluids-hvac-and-building-services/heating-systems-boilers-burners-and-controls/"
  - title: "Cutting energy use in business premises"
    href: "/reados/collections/lean-and-continuous-improvement/cutting-energy-use-in-business-premises/"
  - title: "Shape Memory Alloys by the Numbers"
    href: "/reados/publications/shape-memory-alloys-by-the-numbers/"
---

## About this book

Heat moves wherever there is a temperature difference, by three routes: through solids by conduction, into and out of moving fluids by convection, and across space by radiation. Every factory pays for it. Hot water cools in its pipes, ovens lose heat through their walls, tanks take hours to warm up, and heat that could be recovered from waste streams goes down the drain. The physics was settled a century ago, and the arithmetic is short. What is often missing is the habit of putting numbers on heat flows before deciding what to insulate, what to buy and how long things will take.

This book builds that habit. It starts with energy and power, then works through conduction in flat walls and pipe insulation, convection and radiation at surfaces, the economic thickness of insulation, heat exchangers sized by the log mean temperature difference, and the time it takes to heat and cool a tank. Each chapter works one question through the running case, shows an error and how it is caught, and ends with an exercise and its worked answer.

It assumes school algebra and a calculator. The physics is explained from the start.

## The running case

The book follows **HW-60**, the wash-down hot water system at a fictional food factory. A gas-fired water heater supplies **85 °C** water to a **3,000 L** stainless steel storage tank, 1.5 m in diameter and 1.8 m tall, and from the tank along **60 m** of stainless steel pipe, 60.3 mm in outside diameter, to hose stations on the production floor. The plant room and the floor are at about **20 °C**. The hot water runs about **6,000 hours** a year.

All quantities, prices, coefficients chosen for the case and results are invented for teaching. This is an illustration. None of it describes a BIZOMAT client, supplier or project. Heat is costed at an assumed gas price of **A$22 per gigajoule** and a heater efficiency of 85%, about **A$0.093** per kilowatt-hour of heat delivered. Money is in Australian dollars, excluding GST.

## How to use the book

Chapters 1 to 5 build the tools: energy and power, conduction, convection and radiation. Chapter 6 uses them to choose insulation, Chapter 7 to size a heat exchanger, and Chapter 8 to estimate warm-up and cool-down times. Calculators for several steps are in the BIZOMAT tools, including [insulated pipe heat loss](/tools/insulated-pipe/), [radiant heat](/tools/radiant-heat/) and [LMTD heat exchanger](/tools/lmtd-exchanger/). The companion book *Thermal Expansion by the Numbers* follows the same system through the movement and stress that heat causes.

## Source limits and professional responsibility

The supplied 1925 textbook informed the range of subjects. The methods here are standard engineering heat transfer, simplified for hand calculation, with sources given for material data. Convection coefficients in particular are labelled teaching values within published ranges; detailed correlations give better estimates for real design. Hot surfaces and hot water can burn, and pressure systems, gas appliances and their controls are regulated. Real installations must be designed, installed and checked by competent people under the standards and laws that apply.
