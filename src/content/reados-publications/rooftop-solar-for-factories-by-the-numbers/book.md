---
title: "Rooftop Solar for Factories by the Numbers"
subtitle: "Cells, modules, strings, inverters, roofs, monitoring and the business case for a factory's own solar array"
description: "How solar cells turn sunlight into power and how to size, check, mount, monitor and pay for a factory rooftop array with numbers: yield, strings, shading, wind and cost."
category: Engineering
tags: [design, operations, finance, validation]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-11-01
referencesChecked: 2026-11-01
edition: "1"
level: "Intermediate engineering and facilities management"
audience: "Manufacturing, facilities and maintenance engineers, operations managers and owners who are buying, checking, running or paying for a solar array on a factory roof and want to judge the numbers in a proposal for themselves."
outcomes:
  - "Explain how a silicon cell turns light into current and voltage, and why bandgap, recombination and temperature limit what it can deliver."
  - "Read a module datasheet and an IV curve, and work out output at real irradiance and cell temperature."
  - "Estimate the yearly yield of a roof array from its irradiation, orientation and loss chain, and check a supplier's yield claim."
  - "Check string voltages against inverter limits, and judge shading, bypass diodes and hot-spot risk on a roof."
  - "Check wind uplift and ballast, inverter cooling, spares and monitoring data, and build the business case with self-consumption and tariffs."
coverVariant: category
references:
  - title: "Electronic and Optoelectronic Properties of Semiconductor Structures"
    creator: "J. Singh, Cambridge University Press"
    year: "2003"
    note: "Copyright work, used only as a map of ideas: bandgaps and why direct and indirect gaps absorb light differently, carrier generation and recombination, radiative and nonradiative recombination, the temperature dependence of intrinsic carriers and charge injection across a junction. No text, equations as set out there, figures or problems are reproduced, and all cases and calculations are KEVOS® originals."
  - title: "Detailed balance limit of efficiency of p–n junction solar cells"
    creator: "W. Shockley and H. J. Queisser, Journal of Applied Physics 32, 510–519"
    year: "1961"
    note: "Named in Chapter 1 for the detailed-balance limit on the efficiency of a single-junction cell."
  - title: "Reassessment of the limiting efficiency for crystalline silicon solar cells"
    creator: "A. Richter, M. Hermle and S. W. Glunz, IEEE Journal of Photovoltaics 3(4), 1184–1191"
    year: "2013"
    note: "Named in Chapter 1 for the limiting efficiency of a silicon cell once Auger recombination is included."
  - title: "Self-consistent optical parameters of intrinsic silicon at 300 K including temperature coefficients"
    creator: "M. A. Green, Solar Energy Materials and Solar Cells 92, 1305–1310"
    year: "2008"
    note: "Source of the order of magnitude of silicon's absorption coefficient at several wavelengths, quoted as rounded values in Chapter 1."
  - title: "Statistical ray optics"
    creator: "E. Yablonovitch, Journal of the Optical Society of America 72, 899–907"
    year: "1982"
    note: "Named in Chapter 1 for the light-trapping limit of a textured cell with a reflecting rear."
  - title: "Climate Data Online: solar exposure"
    creator: "Bureau of Meteorology"
    year: "2026"
    url: "https://www.bom.gov.au/climate/data/"
    note: "Named in Chapters 4 and 9 as a source of measured daily solar exposure for Australian sites. The irradiation figures in the case are assumed, labelled values, not taken from it."
  - title: "Small-scale Renewable Energy Scheme"
    creator: "Clean Energy Regulator"
    year: "2026"
    url: "https://www.cleanenergyregulator.gov.au/"
    note: "Named in Chapter 10 for small-scale technology certificates. Eligibility, thresholds and the number of certificates are set by the regulator and must be checked for a real project."
related:
  - title: "Variable-Speed Drives by the Numbers"
    href: "/reados/publications/variable-speed-drives-by-the-numbers/"
  - title: "Electronics Packaging by the Numbers"
    href: "/reados/publications/electronics-packaging-by-the-numbers/"
  - title: "Infrared Temperature Measurement by the Numbers"
    href: "/reados/publications/infrared-temperature-measurement-by-the-numbers/"
  - title: "Accelerated Life Testing by the Numbers"
    href: "/reados/publications/accelerated-life-testing-by-the-numbers/"
  - title: "Cutting energy use in business premises"
    href: "/reados/collections/lean-and-continuous-improvement/cutting-energy-use-in-business-premises/"
  - title: "Learning curves and zero fuel cost: solar, wind and batteries"
    href: "/reados/collections/engineering-history-modern-era/learning-curves-and-zero-fuel-cost-solar-wind-and-batteries/"
---

## About this book

A solar module on a factory roof is a large, flat semiconductor device. It turns part of the sunlight falling on it into direct current, and an inverter turns that into alternating current the factory can use. How much it delivers over a year depends on physics in the silicon, on the sun and the roof, on how the modules are wired, mounted and kept clean, and on how much of the output the factory uses itself. A proposal for a roof array condenses all of that into a few figures: kilowatts, kilowatt-hours a year, a price and a payback. This book shows how to check each of those figures.

It starts inside the cell, with photons, the bandgap and recombination, because those set the limits on efficiency and explain why output falls as the cell heats. It then works from the module datasheet to the yearly yield of a roof, through strings, voltage limits and the inverter, shading and bypass diodes, roof loads and wind, inverter heat and reliability, and monitoring, soiling and degradation. It finishes with the business case: self-consumption, tariffs, certificates, finance and depreciation.

It is for manufacturing, facilities and maintenance engineers, operations managers and owners. It assumes engineering or trade training and comfort with power, energy and simple algebra; the semiconductor physics is explained as it is used. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the WORKOS tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one array. This is an illustration. A stainless steel food-equipment fabricator in Shepparton, Victoria, runs a day shift and part of an afternoon shift in a 72 × 36 m portal-frame workshop with a trapezoidal steel deck roof at 5°, ridge running east to west. A single-storey office annex has a flat concrete roof. The business uses about 420 MWh of electricity a year, mostly between 7 am and 5 pm.

The array, called SF-90 in this book, is:

- **Modules:** 216 monocrystalline silicon modules of 420 W each, 90.72 kW in total at standard test conditions. Each module is 1,722 × 1,134 mm with 108 half-cut cells and three bypass diodes.
- **Layout:** 180 modules flush-mounted on rails on the north face of the workshop roof, and 36 on ballasted frames at 10° on the office annex roof.
- **Strings:** 12 strings of 18 modules.
- **Inverters:** two 40 kW three-phase inverters, each with three maximum power point trackers taking two strings, in a ventilated room beside the main switchboard.

Irradiation, prices, tariffs, test results and failure records are the business's working figures or are calculated from stated assumptions. They do not describe KEVOS® work or any real business, installer, module maker, inverter maker, network or retailer. Prices are in Australian dollars excluding GST, because a GST-registered business claims the GST back on its costs; where a price includes GST, the text says so.

## How to use the book

Read Chapters 1 to 3 first if the physics is new; they explain the module datasheet. Chapters 4 to 7 deal with designing and checking an array, Chapters 8 and 9 with running it, and Chapter 10 with paying for it. Chapters stand on their own once the case is familiar.

Each chapter links the WORKOS calculators it uses. The tools do the arithmetic; the chapter explains what the inputs mean and where they come from. Every result in the text was checked by calculation, and the numbers in figures match the text.

## Limits and responsibility

This book is educational. A grid-connected solar array is electrical installation work and must be designed and installed by appropriately accredited and licensed people, to the applicable Australian standards and wiring rules and to the local network's connection requirements. Roof structures must be checked by a qualified structural engineer. Standards are named by number and scope only. Datasheet values, irradiation and costs in the case are illustrations; use measured data and the manufacturer's documents for real work.
