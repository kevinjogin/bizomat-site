---
title: "Fins and Heat Sinks by the Numbers"
subtitle: "Thermal budgets, interfaces, the fin equation, natural and forced convection, spacing, radiation, spreading and testing, worked through one drive heat sink"
description: "Size and check heat sinks with numbers: thermal budgets, interfaces, fin efficiency, natural-convection spacing, radiation, fans and pressure drop, spreading resistance and testing."
category: Engineering
tags: [design, product-development, validation, quality]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-27
referencesChecked: 2026-10-27
edition: "1"
level: "Intermediate heat transfer for product and machine designers"
audience: "Mechanical, electrical and product engineers who choose, design, test or troubleshoot heat sinks and finned surfaces for power electronics, drives, motors, lighting and machine components."
outcomes:
  - "Write a junction-to-air thermal budget and turn it into a required heat sink resistance at the worst ambient."
  - "Use the fin equation and fin efficiency to judge fin material, thickness and height."
  - "Estimate natural-convection heat sink performance, choose fin spacing and add radiation correctly."
  - "Size a fan-cooled heat sink from its airflow and pressure drop, and find the operating point on a fan curve."
  - "Allow for interface and spreading resistances, and test a heat sink so the result can be trusted."
coverVariant: category
references:
  - title: "Schaum's Outline of Theory and Problems of Heat Transfer, second edition"
    creator: "Donald R. Pitts and Leighton E. Sissom, McGraw-Hill"
    year: "1998"
    note: "Supplied source, in copyright, and a scanned copy without a text layer. Used only as a subject map of fins of uniform section and fin efficiency, conduction shape factors and numerical conduction, natural convection from vertical plates and in enclosures, forced convection in channels and radiation exchange. No text, problems, figures, charts or tables are reproduced; this book's case, calculations, figures and exercises are original."
  - title: "Correlating equations for laminar and turbulent free convection from a vertical plate"
    creator: "S. W. Churchill and H. H. S. Chu, International Journal of Heat and Mass Transfer, vol. 18, pp. 1323–1329"
    year: "1975"
    note: "Origin of the vertical-plate natural-convection correlation used in Chapter 5, in its widely published form."
  - title: "Heat dissipation of parallel plates by free convection"
    creator: "W. Elenbaas, Physica, vol. 9, pp. 1–28"
    year: "1942"
    note: "The classic experiments on natural convection between vertical parallel plates on which the channel correlations of Chapter 6 rest."
  - title: "Thermally optimum spacing of vertical, natural convection cooled, parallel plates"
    creator: "A. Bar-Cohen and W. M. Rohsenow, Journal of Heat Transfer, vol. 106, no. 1, pp. 116–123"
    year: "1984"
    note: "Source of the composite channel correlation for symmetric isothermal plates and the optimum-spacing relation used in Chapter 6, in the form widely reproduced in heat transfer texts."
  - title: "Analytical forced convection modeling of plate fin heat sinks"
    creator: "P. Teertstra, M. M. Yovanovich and J. R. Culham, Proceedings of the 15th IEEE Semi-Therm Symposium, pp. 34–41"
    year: "1999"
    note: "Source of the composite Nusselt-number model for laminar flow in plate-fin channels used in Chapter 8, as reproduced by Simons below."
  - title: "Estimating parallel plate-fin heat sink thermal resistance"
    creator: "Robert E. Simons, Electronics Cooling"
    year: "2003"
    url: "https://www.electronics-cooling.com/2003/02/estimating-parallel-plate-fin-heat-sink-thermal-resistance/"
    note: "Checked source for the form of the Teertstra et al. correlation, its modified channel Reynolds number and its use with the fin efficiency to estimate a heat sink's resistance from fin base to inlet air."
  - title: "Simple formulas for estimating thermal spreading resistance"
    creator: "Robert E. Simons, Electronics Cooling"
    year: "2004"
    url: "https://www.electronics-cooling.com/2004/05/simple-formulas-for-estimating-thermal-spreading-resistance/"
    note: "Background for Chapter 9: spreading resistance arises where heat flows between a small source and a larger plate, and closed-form estimates by S. Lee, S. Song, V. Au and K. P. Moran (ASME/JSME conference, 1995) approximate the exact series. This book's spreading figures come from its own two-dimensional conduction model, not from those formulas."
  - title: "Aluminum 6063-T5"
    creator: "ASM International and MatWeb (Aluminum Association typical values)"
    year: "current web page"
    url: "https://asm.matweb.com/search/SpecificMaterial.asp?bassnum=MA6063T5"
    note: "Source for 6063-T5's thermal conductivity (209 W/m·K), density (2.7 g/cm³) and specific heat (0.9 J/g·°C), used for the extrusion throughout."
  - title: "Air: thermal conductivity; dynamic and kinematic viscosity; Prandtl number"
    creator: "The Engineering ToolBox"
    year: "current web pages"
    url: "https://www.engineeringtoolbox.com/air-absolute-kinematic-viscosity-d_601.html"
    note: "Source for the air properties at 1 atm used in every convection calculation, for example k = 0.02808 W/m·K and ν = 17.88 × 10⁻⁶ m²/s at 50 °C, and Pr ≈ 0.705. The conductivity and Prandtl tables are at engineeringtoolbox.com/air-properties-viscosity-conductivity-heat-capacity-d_1509.html and engineeringtoolbox.com/air-prandtl-number-viscosity-heat-capacity-thermal-conductivity-d_2009.html."
  - title: "Emissivity Coefficients of Common Materials; Thermal Conductivity of Metals"
    creator: "The Engineering ToolBox"
    year: "current web pages"
    url: "https://www.engineeringtoolbox.com/emissivity-coefficients-d_447.html"
    note: "Source for the emissivities of anodised aluminium (0.77) and commercial aluminium sheet (0.09), and for the conductivity of 0.5 % carbon steel (54 W/m·K) used in the steel-fin comparison; the metals page is at engineeringtoolbox.com/thermal-conductivity-metals-d_858.html."
  - title: "CODATA value: Stefan-Boltzmann constant"
    creator: "National Institute of Standards and Technology"
    year: "current"
    url: "https://physics.nist.gov/cgi-bin/cuu/Value?sigma"
    note: "Source for σ = 5.670 374 419 × 10⁻⁸ W/m²·K⁴, used in Chapter 7."
related:
  - title: "Heating and Cooling Times by the Numbers"
    href: "/reados/publications/heating-and-cooling-times-by-the-numbers/"
  - title: "Electronics Packaging by the Numbers"
    href: "/reados/publications/electronics-packaging-by-the-numbers/"
  - title: "Heat Transfer by the Numbers"
    href: "/reados/publications/heat-transfer-by-the-numbers/"
  - title: "Industrial Electric Heating by the Numbers"
    href: "/reados/publications/industrial-electric-heating-by-the-numbers/"
---

## About this book

Almost every electronic power device, and many motors, lamps, brakes and bearings, sheds its heat through a finned piece of aluminium. The heat sink looks like the simplest part in the product, and it is often chosen from a catalogue by a single number, its thermal resistance. That number hides a chain of assumptions: the air temperature, the sink's orientation, how the power device is clamped to it, the fins' spacing and thickness, whether its surface radiates, whether a fan blows on it and how much the fan can push through it. When a product overheats in the field, one of those assumptions is usually the cause.

This book follows the chain in order. It starts with the thermal budget that sets the sink's job, then works through the interface between device and sink, the fin equation and fin efficiency, natural convection from plates and between fins, the spacing that suits natural convection, radiation, forced air with fans and pressure drop, spreading in the sink's base and, finally, testing and derating. Each chapter ends with an exercise and a worked answer, and every number was calculated for this book.

It suits mechanical, electrical and product engineers. It assumes school algebra, exponentials and the basic ideas of conduction, convection and radiation, which *Heat Transfer by the Numbers* covers. *Electronics Packaging by the Numbers* places the heat path inside the wider design of an enclosure, in [Follow the heat out](/reados/publications/electronics-packaging-by-the-numbers/follow-the-heat-out/); this book goes deeper into the finned part of that path.

## The running case

Every chapter follows one fictional heat sink. This is an illustration. HS-150 cools the power module of a motor drive that a small Australian manufacturer builds into machine control cabinets. At full load the module dissipates 150 W. The heat sink is mounted on the back of the cabinet with its fins vertical, in the factory air, which reaches 40 °C on a hot day. It is an extrusion of 6063-T5 aluminium with an anodised finish: a base 200 mm wide, 250 mm tall and 10 mm thick, carrying fins 45 mm tall and 2.5 mm thick. How many fins, and whether a fan is needed, are among the questions the book answers. A later version of the drive will dissipate 250 W in the same footprint.

The module's own figures, its junction-to-case and case-to-sink resistances and the drive designer's junction temperature limit, are illustration values standing in for a real maker's datasheet. Air properties come from published tables, and aluminium's from published typical values. The product, the company and its numbers are invented; none describes BIZOMAT work or a real product. Prices, where they appear, are illustrations in Australian dollars including GST.

## Source limits and professional responsibility

This book is educational. Its correlations are the simplified forms used for first estimates, and real heat sinks differ from them by ten or twenty per cent or more, depending on the installation, the air's freedom to move, neighbouring equipment and manufacturing tolerances. Device limits must come from the device maker's datasheet and application notes. Electrical equipment in Australia must meet the applicable electrical safety, EMC and installation requirements, and surface temperatures that people can touch need assessing against the relevant standards. Testing in the product's real installation, and review by competent people, govern real designs.
