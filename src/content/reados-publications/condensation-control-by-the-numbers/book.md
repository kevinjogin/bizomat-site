---
title: "Condensation Control by the Numbers"
subtitle: "Dew point, cold surfaces, breathing, heaters, desiccants and insulation for enclosures and cold pipes, worked through one coastal pump station"
description: "Keep water out of electrical enclosures and off cold pipes with numbers: dew point, night-sky cooling, breathing, heater sizing, desiccants, insulation and humidity logging."
category: Engineering
tags: [design, operations, quality, validation]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-29
referencesChecked: 2026-10-29
edition: "1"
level: "Intermediate engineering practice for designers, maintainers and technicians"
audience: "Electrical, mechanical and maintenance engineers, control-panel builders, technicians and technical students who design, install or look after outdoor enclosures, pump stations, plant rooms and chilled or cold-water pipework."
outcomes:
  - "Calculate vapour pressure, relative humidity, dew point and absolute humidity, and know how accurate the formulas are."
  - "Predict which surfaces in an enclosure fall below the dew point, including roofs cooled by a clear night sky."
  - "Estimate how much water an enclosure draws in by breathing and through cable conduits, and find the dominant path."
  - "Size and control an anti-condensation heater, size a desiccant charge, and choose insulation that keeps a cold pipe dry."
  - "Log humidity and surface temperatures, check the sensors, and prove that a condensation fix works."
coverVariant: category
references:
  - title: "Thermal Physics, second edition"
    creator: "C. Kittel and H. Kroemer"
    year: "1980"
    note: "Supplied source, © W. H. Freeman and Company, in copyright. Read as a subject map only: thermal radiation and the Stefan–Boltzmann law, chemical potential, phase equilibrium, the vapour pressure curve and the Clausius–Clapeyron relation, and kinetic theory. No text, derivations as set out, figures, tables or problems are reproduced; the treatment, case, numbers and exercises in this book are its own."
  - title: "Improved Magnus form approximation of saturation vapor pressure"
    creator: "O. A. Alduchov and R. E. Eskridge, Journal of Applied Meteorology 35, 601–609"
    year: "1996"
    url: "https://www.osti.gov/biblio/548871"
    note: "Source of the Magnus-form coefficients used for every vapour pressure and dew point in the book: 610.94 Pa, 17.625 and 243.04 °C."
  - title: "Revised release on the IAPWS Industrial Formulation 1997 for the thermodynamic properties of water and steam"
    creator: "International Association for the Properties of Water and Steam"
    year: "2007"
    url: "https://www.iapws.org/"
    note: "The saturation-pressure equation of IAPWS-IF97 was used to check the Magnus formula; it was itself checked against the NIST Chemistry WebBook water saturation data. The Magnus values agree within 0.25% from 0 to 50 °C."
  - title: "NIST Chemistry WebBook, SRD 69: thermophysical properties of water"
    creator: "National Institute of Standards and Technology"
    year: "2026"
    url: "https://webbook.nist.gov/chemistry/fluid/"
    note: "Reference saturation pressures of water used to confirm the formulas above."
  - title: "Enclosure heating and heater selection"
    creator: "AutomationDirect"
    year: "2026"
    url: "https://cdn.automationdirect.com/static/specs/enclheatingselection.pdf"
    note: "Maker's heater sizing method used in Chapter 5: heat transmission coefficients of 5.5 W/m²·K for painted steel, 3.7 for stainless steel, 12 for aluminium and 3.5 for plastic, the formula P = A × k × ΔT − P(internal), and the doubling of the first term for outdoor enclosures."
  - title: "Desiccant packs for enclosures (MIL-D-3464E unit definition)"
    creator: "Campbell Scientific"
    year: "2026"
    url: "https://www.campbellsci.com/p6714"
    note: "Source of the definition of a unit of desiccant used in Chapter 6: at least 3 g of water adsorbed at 20% relative humidity and at least 6 g at 40%, at 25 °C, citing MIL-D-3464E. The specification itself was not read."
  - title: "Humidity fixed points of binary saturated aqueous solutions"
    creator: "L. Greenspan, Journal of Research of the National Bureau of Standards 81A, 89–96"
    year: "1977"
    url: "https://nvlpubs.nist.gov/nistpubs/jres/81A/jresv81An1p89_A1b.pdf"
    note: "Source of the equilibrium relative humidities over saturated salt solutions at 25 °C used in Chapters 8 and 9 (lithium chloride 11.30%, magnesium chloride 32.78%, magnesium nitrate 52.89% and sodium chloride 75.29%)."
  - title: "ISO 9223 Corrosion of metals and alloys: corrosivity of atmospheres"
    creator: "International Organization for Standardization"
    year: "editions as called up"
    note: "Named by number and scope. The conventional estimate of time of wetness as the hours with relative humidity above 80% and temperature above 0 °C is described from published secondary accounts; no values from the standard are quoted."
  - title: "AS 60529 Degrees of protection provided by enclosures (IP Code)"
    creator: "Standards Australia"
    year: "edition as called up"
    note: "Named by number and scope as the basis of IP ratings. The book explains what an IP test does and does not show about humidity; it quotes no test details."
related:
  - title: "Electronics Packaging by the Numbers"
    href: "/reados/publications/electronics-packaging-by-the-numbers/"
  - title: "Accelerated Life Testing by the Numbers"
    href: "/reados/publications/accelerated-life-testing-by-the-numbers/"
  - title: "Heat Transfer by the Numbers"
    href: "/reados/publications/heat-transfer-by-the-numbers/"
  - title: "Roof Lights by the Numbers"
    href: "/reados/publications/roof-lights-by-the-numbers/"
  - title: "Compressed Air Plant by the Numbers"
    href: "/reados/publications/compressed-air-plant-by-the-numbers/"
  - title: "Contact Temperature Sensors by the Numbers"
    href: "/reados/publications/contact-temperature-sensors-by-the-numbers/"
---

## About this book

Water causes more trouble in electrical and mechanical equipment than heat does, and most of it never arrives as rain. It arrives as vapour, carried in ordinary air, and turns to liquid on whatever surface happens to be colder than the air's dew point. A control cabinet that passed its ingress test can hold a puddle on its gland plate. A cold-water main can drip a litre an hour onto the switchboard beneath it. A sealed instrument box can fog on the inside of its own window.

This book works through condensation with numbers. It starts with the physics of water in air: vapour pressure, relative humidity and dew point. It then finds the cold surfaces, including the ones a clear night sky makes, works out how enclosures breathe in moist air and through which paths, and compares the four strategies for keeping water out: seal, vent, ventilate or heat. It sizes anti-condensation heaters and desiccant charges, insulates a cold pipe so it stays dry, connects humidity to corrosion and salts, and ends with the measurements that prove a fix works. Every chapter follows one running case, includes a plausible mistake and how it was found, and ends with an exercise and its worked answer.

It is for electrical, mechanical and maintenance engineers, control-panel builders, technicians and technical students. It assumes school algebra and physics. Readers who want the design of a whole electronic product's enclosure should read *Electronics Packaging by the Numbers*; readers who need humidity life testing should read *Accelerated Life Testing by the Numbers*. This book links to both rather than repeating them.

## The running case

Every chapter follows one fictional site. This is an illustration. A water utility runs a small pump station, **PS-7**, a few kilometres from the coast in New South Wales. Its control cabinet, **CC-7**, is a powder-coated sheet-steel floor-standing enclosure **1,200 mm high, 800 mm wide and 400 mm deep**, standing on a concrete plinth in the open, with an IP55 rating and a bottom gland plate. Its cables rise from an underground pit through four conduits.

The cabinet holds a variable-speed drive for the duty pump, which dissipates about **280 W** while the pump runs, plus a controller, power supplies and a telemetry modem that dissipate about **30 W** all the time. In summer the pump runs about **8 hours** a day, in daylight. A separate polycarbonate telemetry box on the same pole holds a radio and a battery. Beside the cabinet, a small block-wall pump room houses the pumps and a **DN100** steel delivery main that carries bore water at about **17 °C**.

The utility, its site and its records are invented. None describes BIZOMAT work or a real organisation. Weather conditions in the case are typical values chosen for the illustration, not records for any location.

## How to use the book

Read Chapter 1 first: it sets out the quantities and formulas that every later chapter uses. Chapters 2 and 3 explain where condensation forms and how the water gets in. Chapter 4 chooses a strategy, and Chapters 5, 6 and 7 size the means: heaters, desiccants and pipe insulation. Chapter 8 explains why humidity matters below the dew point, through corrosion and salts, and Chapter 9 sets out how to measure, check and prove a fix. Every calculation was checked by running it. Vapour pressures come from the Magnus formula with the Alduchov–Eskridge coefficients, checked against the IAPWS-IF97 saturation equation and NIST data.

## Source limits and professional responsibility

The physics is standard and the property data is published. Heat-transfer coefficients, sky temperatures, air-exchange rates and weather conditions in the running case are assumptions for the illustration, and a real installation should be judged on its own measurements. Electrical enclosures, their heaters and their contents are subject to electrical safety rules and the equipment makers' instructions, and pump stations carry their own work health and safety hazards, including confined spaces in pits. Electrical work, the selection of rated equipment and the approval of designs are for qualified people working under the rules that apply. This book teaches how condensation happens and how to calculate the means of preventing it. It is not a design for any installation.
