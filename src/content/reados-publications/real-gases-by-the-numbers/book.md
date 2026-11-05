---
title: "Real Gases by the Numbers"
subtitle: "Compressibility, van der Waals, corresponding states, cylinder contents, Joule–Thomson cooling and liquefied gases, worked through one laser-cutting gas supply"
description: "Size, fill, draw and check high-pressure gas supplies with real-gas numbers: compressibility, contents, temperature, throttling, vapour pressure, critical points and line flow."
category: Engineering
tags: [manufacturing, design, quality]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-27
referencesChecked: 2026-10-27
edition: "1"
level: "Intermediate engineering thermodynamics for gas supplies and pressure equipment"
audience: "Production, process and maintenance engineers, equipment buyers and technical students who specify, run or troubleshoot high-pressure gas supplies, cylinder packs, regulators and liquefied gas tanks."
outcomes:
  - "Explain why gases depart from the ideal gas law at high pressure and state the departure as a compressibility factor."
  - "Calculate the real contents of a cylinder or pack from its pressure and temperature, and correct gauge readings for temperature."
  - "Use the van der Waals model and corresponding states to judge a gas for which no data table is to hand."
  - "Estimate the Joule–Thomson temperature drop across a regulator and decide when heating or staging is needed."
  - "Explain vapour pressure, filling ratio and the critical point for liquefied gases, and specify and check a gas supply."
coverVariant: category
references:
  - title: "Thermal and Statistical Physics (draft edition)"
    creator: "H. Gould and J. Tobochnik"
    year: "2006"
    note: "Supplied source, in copyright (later published by Princeton University Press). Read as a subject map for equations of state, the van der Waals model, the second virial coefficient, the Joule and Joule–Thomson processes, phase equilibrium, the Clausius–Clapeyron equation and the liquid–gas critical point. No text, derivations as set out, figures, tables or problems are reproduced; the treatment, case, numbers and exercises in this book are its own."
  - title: "Thermophysical Properties of Fluid Systems, NIST Chemistry WebBook, SRD 69"
    creator: "E. W. Lemmon, M. O. McLinden and D. G. Friend, National Institute of Standards and Technology"
    year: "2026"
    url: "https://webbook.nist.gov/chemistry/fluid/"
    note: "Source of every density, enthalpy, Joule–Thomson coefficient, saturation pressure and critical point in the book, for nitrogen, argon, oxygen, hydrogen, helium and carbon dioxide. Values retrieved on the date checked; compressibility factors were calculated from the tabulated densities."
  - title: "CODATA value: molar gas constant"
    creator: "National Institute of Standards and Technology"
    year: "2019"
    url: "https://physics.nist.gov/cgi-bin/cuu/Value?r"
    note: "The exact SI value of the molar gas constant, 8.314462618 J/(mol·K), used to calculate every ideal-gas density and compressibility factor."
  - title: "AS 4332 The storage and handling of gases in cylinders"
    creator: "Standards Australia"
    year: "edition as called up"
    note: "Named by number and scope as the Australian standard for storing and handling gas cylinders. No values are quoted from it."
  - title: "AS 2030 Gas cylinders (series)"
    creator: "Standards Australia"
    year: "edition as called up"
    note: "Named by number and scope as the Australian series covering the design, filling, inspection and testing of gas cylinders, including filling limits for liquefied gases. No values are quoted from it."
  - title: "Model Code of Practice: Confined spaces"
    creator: "Safe Work Australia"
    year: "current edition"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-confined-spaces"
    note: "Named in Chapter 8 as the starting point for assessing oxygen depletion where inert gas could accumulate. No values are quoted from it; the oxygen-depletion figures in the chapter are the book's own mixing calculation."
  - title: "ISO 13443 Natural gas: Standard reference conditions"
    creator: "International Organization for Standardization"
    year: "edition as called up"
    note: "Named in Chapter 7 by number and scope as the standard that sets 15 °C and 101.325 kPa as reference conditions for natural gas. No other content is quoted."
related:
  - title: "Industrial Gases by the Numbers"
    href: "/reados/publications/industrial-gases-by-the-numbers/"
  - title: "Oxy-Fuel by the Numbers"
    href: "/reados/publications/oxy-fuel-by-the-numbers/"
  - title: "Entropy by the Numbers"
    href: "/reados/publications/entropy-by-the-numbers/"
  - title: "Compressed Air Plant by the Numbers"
    href: "/reados/publications/compressed-air-plant-by-the-numbers/"
  - title: "Vacuum by the Numbers"
    href: "/reados/publications/vacuum-by-the-numbers/"
  - title: "Infrared Temperature Measurement by the Numbers"
    href: "/reados/publications/infrared-temperature-measurement-by-the-numbers/"
---

## About this book

The ideal gas law, pV = nRT, is one of the most useful equations in engineering, and at the pressures of a workshop air line it is right to a fraction of a per cent. In a modern gas cylinder at 20 or 30 MPa it is not. The molecules of a real gas take up room and pull on each other, and at high pressure those two effects change how much gas a cylinder holds, how its pressure moves with temperature, how cold it gets through a regulator, and whether it stays a gas at all. The errors run to ten or fifteen per cent, which is enough to run a production cell out of gas before the end of a shift, freeze a regulator, or let a liquefied gas cylinder build a dangerous pressure on a hot day.

This book works through real gases with numbers. It starts with the compressibility factor, the single number that says how far a gas departs from the ideal law, and uses it to find the real contents of a cylinder pack. It then explains the departure with the van der Waals model, extends it to any gas with the principle of corresponding states, and applies it to gauges and temperature, to the Joule–Thomson cooling that happens in every regulator, to liquefied gases and the critical point, and to flow in pipes and nozzles. The last chapter puts it together into a specification and a set of checks. Each chapter follows one running case, includes a plausible mistake and how it was found, and ends with an exercise and its worked answer.

It is for production, process and maintenance engineers, equipment buyers and technical students who deal with gas cylinders, cylinder packs, regulators, microbulk and bulk liquid tanks, and the machines they feed. It assumes school algebra and the ideal gas law. Cryogenic plant design, gas mixtures in detail and pipeline-scale gas engineering are outside its scope.

## The running case

Every chapter follows one fictional gas supply. This is an illustration. A sheet metal shop runs a fibre-laser cutting cell that cuts stainless steel with nitrogen as the assist gas. Its supply, LN-1, is a manifolded pack of **15 cylinders of 50 litres water capacity each**, 0.75 m³ in total, filled to **30.0 MPa gauge (30.1 MPa absolute) at 15 °C**. A regulator on the pack drops the pressure to **1.8 MPa gauge** for the line to the machine, and the laser's own valve sets **1.6 MPa absolute** behind its **2.0 mm cutting nozzle**, which then passes about **36 kg of nitrogen an hour** while the beam is on. The pack is changed when it falls to **2.5 MPa absolute**, below which the regulator can no longer hold the line pressure. The shop cuts for about six beam-on hours a day.

All property values come from the NIST Chemistry WebBook. The shop, its machine, its supply and its problems are invented. None describes BIZOMAT work or a real business.

## How to use the book

Read Chapters 1 to 3 first: they set out the compressibility factor, the molecular reasons behind it and the way one gas's behaviour predicts another's. Chapters 4 and 5 deal with what happens to the gas in the pack and through the regulator, Chapter 6 with gases that liquefy, Chapter 7 with the low-pressure side of the supply, and Chapter 8 with specifying and checking the whole. Every calculation was checked by running it, and values are given to more figures than a shop needs so that the arithmetic can be followed. Pressures are absolute unless they are marked as gauge.

## Source limits and professional responsibility

The physics in this book is standard thermodynamics, and the property data come from NIST. The pack size, flows, prices and supplier arrangements in the running case are illustrations; real supplies are specified from the gas supplier's data and the equipment maker's requirements. High-pressure gas stores an enormous amount of energy, liquefied gases can build pressure without limit when warmed, and inert gases can displace the oxygen in a room without warning: gas installations are designed, installed and maintained under the applicable Australian standards, the supplier's instructions and work health and safety law, and qualified review governs real work. This book teaches how real gases behave and how to check the numbers. It is not a design for any installation.
