---
title: "Heating and Cooling Times by the Numbers"
subtitle: "Biot and Fourier numbers, lumped and one-term solutions, surfaces, corners, finite differences and furnace cycles, worked through one hardened steel shaft"
description: "Estimate how long parts take to heat through and cool down: Biot and Fourier numbers, lumped and one-term solutions, semi-infinite surfaces, product solutions and finite differences."
category: Manufacturing
tags: [manufacturing, quality, process-improvement, design]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-27
referencesChecked: 2026-10-27
edition: "1"
level: "Intermediate heat transfer for manufacturing and plant engineers"
audience: "Manufacturing, process, quality and design engineers who set furnace, oven, quench, cure or cooling times, and anyone who has to decide how long a part must stay in before its centre is ready."
outcomes:
  - "Calculate Biot and Fourier numbers and use them to decide which heating-time model a part needs."
  - "Estimate centre and surface temperatures in slabs, cylinders and spheres with lumped and one-term solutions."
  - "Use the semi-infinite solid for surface heating, short contacts and the transfer delay before a quench."
  - "Combine one-dimensional solutions for ends and corners, and check them with an explicit finite-difference model."
  - "Turn the calculations into a furnace cycle that is measured, proved and costed."
coverVariant: category
references:
  - title: "Schaum's Outline of Theory and Problems of Heat Transfer, second edition"
    creator: "Donald R. Pitts and Leighton E. Sissom, McGraw-Hill"
    year: "1998"
    note: "Supplied source, in copyright, and a scanned copy without a text layer. Used only as a subject map of time-varying conduction: Biot and Fourier numbers, lumped analysis, semi-infinite bodies, slabs and cylinders with convective surfaces, chart solutions, multidimensional products and numerical methods. No text, problems, figures, charts or tables are reproduced; this book's case, calculations, figures and exercises are original and were computed for it."
  - title: "Temperature Charts for Induction and Constant-Temperature Heating"
    creator: "M. P. Heisler, Transactions of the ASME, vol. 69, pp. 227–236"
    year: "1947"
    note: "The origin of the well-known charts of centre temperature against Fourier number for slabs, cylinders and spheres. This book does not reproduce the charts; it computes the same one-term series directly, with eigenvalues and coefficients solved in its own calculations."
  - title: "Alloy Steel Grade 4140 Fact Sheet (AISI 4140, normalised)"
    creator: "M&W Components (Elgin material sheets)"
    year: "2024"
    url: "https://www.mwcomponents.com/uploads/Resource-Center/Elgin-Material-Sheets/Alloy-Steel-Grade-4140-Fact-Sheet_Elgin-Website.pdf"
    note: "Source for the thermal conductivity of 4140 steel falling from 42.6 W/m·K at 100 °C to 42.2 at 200 °C, 37.7 at 400 °C and 33.0 at 600 °C, and for specific heats of 0.519 J/g·°C at 150–200 °C and 0.561 J/g·°C at 350–400 °C. The mean values used in the running case are stated assumptions informed by this trend."
  - title: "Emissivity Coefficients of Common Materials"
    creator: "The Engineering ToolBox"
    year: "current web page"
    url: "https://www.engineeringtoolbox.com/emissivity-coefficients-d_447.html"
    note: "Source for the emissivity of oxidised steel (0.79), rounded to 0.8 in the furnace calculations."
  - title: "CODATA value: Stefan-Boltzmann constant"
    creator: "National Institute of Standards and Technology"
    year: "current"
    url: "https://physics.nist.gov/cgi-bin/cuu/Value?sigma"
    note: "Source for σ = 5.670 374 419 × 10⁻⁸ W/m²·K⁴, used in every radiation calculation."
  - title: "Determining Grossmann H-value from cooling curve data; The effect of agitation on oil quenchants"
    creator: "Thermal Processing magazine"
    year: "current web pages"
    url: "https://thermalprocessing.com/?p=18333"
    note: "Background for Chapter 8: the Grossmann H-value expresses quench severity through the surface heat transfer coefficient and the steel's conductivity, oils are characterised by cooling-curve tests to ASTM D6200, and modern oils differ from Grossmann's original straight oil. No H-values are quoted; the quench coefficient in the case is a stated assumption. The second article is at thermalprocessing.com/?p=26827."
  - title: "AMS2750, Pyrometry; ASTM D6200, Standard test method for determination of cooling characteristics of quench oils by cooling curve analysis"
    creator: "SAE International; ASTM International"
    year: "current editions"
    note: "Named by number and scope only in Chapters 8 and 9, as the pyrometry specification many heat treaters work to and the standard cooling-curve test for quench oils. No requirements, classes, tolerances or intervals are quoted."
related:
  - title: "Fins and Heat Sinks by the Numbers"
    href: "/reados/publications/fins-and-heat-sinks-by-the-numbers/"
  - title: "Heat Transfer by the Numbers"
    href: "/reados/publications/heat-transfer-by-the-numbers/"
  - title: "Diffusion by the Numbers"
    href: "/reados/publications/diffusion-by-the-numbers/"
  - title: "Industrial Electric Heating by the Numbers"
    href: "/reados/publications/industrial-electric-heating-by-the-numbers/"
---

## About this book

Every furnace, oven, quench tank, curing press and cooling conveyor runs on a time. Somebody decided how long a part stays in, and the decision is usually a rule handed down with the procedure: an hour for this, twenty minutes for that. A rule like that may be right for the part it was written for and badly wrong for the next one, because the time a part needs to heat through depends on its size, its material and how hard the surroundings push heat into it, and those three things combine in ways a single rule cannot follow. Too short a time leaves the centre unready; too long a time wastes energy and furnace hours, and in some processes damages the surface.

This book shows how to calculate those times. It starts with the two dimensionless numbers that organise the whole subject, the **Biot number**, which compares the resistance inside the part with the resistance at its surface, and the **Fourier number**, which measures time against the part's size. It then works through the models in order of effort: the lumped part with one temperature, the one-term solutions for slabs, cylinders and spheres, the semi-infinite solid for surfaces and short times, product solutions for ends and corners, and an explicit finite-difference model that can be built in a spreadsheet and used to check everything else. The last three chapters turn the numbers into practice: what the surface condition really is in a furnace or a quench, how to measure and prove a cycle, and how to plan a cycle's time, energy and throughput.

It suits manufacturing, process, quality and design engineers. It assumes school algebra, exponentials and logarithms, and the basic ideas of conduction, convection and radiation. *Heat Transfer by the Numbers* covers those from first principles and introduces the lumped model in its last chapter, [Heating up and cooling down](/reados/publications/heat-transfer-by-the-numbers/heating-up-and-cooling-down/); this book starts there and goes further.

## How to use the book

Read Chapters 1 and 2 first: they decide which model a problem needs. Chapters 3 to 6 can be read in order or picked up as the shape of a part requires. Chapter 7 builds the numerical model used to check the others. Chapters 8 to 10 bring it together for a real cycle. Each chapter ends with an exercise and a worked answer. Every number in the book was calculated, not read from a chart, and the methods are given so the calculations can be repeated in a spreadsheet.

## The running case

Every chapter follows one fictional part. This is an illustration. DS-100 is a drive shaft in AISI 4140 (42CrMo4) chromium-molybdenum steel: a plain body 100 mm in diameter and 500 mm long, with an integral flange 220 mm in diameter and 40 mm thick at one end. The body weighs about 30.8 kg and the flange about 11.9 kg. A heat-treatment shop hardens the shafts by heating them to 850 °C in an electric box furnace, holding them, quenching them in oil at 60 °C, and then tempering them at 550 °C. The shop wants to know how long each stage really takes, because its present cycle was written for a different part.

For the calculations, the steel is given a density of 7,850 kg/m³, a mean thermal conductivity of 33 W/m·K and a mean specific heat of 650 J/kg·K over the hardening heat, which includes an allowance for the heat the steel absorbs as it transforms. Those are stated assumptions, chosen to fit the published trend for this steel, which conducts less heat and stores more as it gets hotter. Furnace, quench and price figures are illustrations too. The part, the shop and its numbers are invented; none describes KEVOS® work or a real installation. Prices are illustrations in Australian dollars including GST.

## Source limits and professional responsibility

This book is educational. Its models assume constant properties, simple shapes and uniform surface conditions, and real parts depart from all three: properties change with temperature, steels absorb heat as they transform, surface coefficients change during a quench, and loads shade one another in a furnace. The models give good first estimates and show which variables matter; they do not replace measurement. Heat-treatment cycles for real parts are set by the material specification, the heat treater's qualified procedures and the customer's requirements, proved with load thermocouples and metallurgical testing, and approved by competent people. Furnaces, quench tanks and their atmospheres are serious hazards and are governed in Australia by work health and safety laws and the standards they call up.
