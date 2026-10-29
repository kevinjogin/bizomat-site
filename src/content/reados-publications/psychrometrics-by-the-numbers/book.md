---
title: "Psychrometrics by the Numbers"
subtitle: "Moist air for air-handling plant: properties, the chart, loads, mixing, humidifying, cooling coils, reheat and evaporative cooling, in one print hall"
description: "Size and check air-handling processes with moist-air balances: properties, the chart, room loads, mixing, heating and humidifying, cooling coils, reheat, evaporative cooling and condensation."
category: Engineering
tags: [design, operations, quality, validation]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: draft
publishDate: 2026-10-30
referencesChecked: 2026-10-30
edition: "1"
level: "Intermediate building services and process engineering"
audience: "Mechanical and building services engineers, HVAC and process technicians, facility and production managers, and students who need to design, check or commission air-handling plant that controls humidity."
outcomes:
  - "Calculate humidity ratio, enthalpy, specific volume and dew point for any air state, on a dry-air basis."
  - "Plot air-handling processes on the psychrometric chart and read sensible heat ratios from it."
  - "Turn room sensible and latent loads into the supply air temperature, moisture content and airflow."
  - "Calculate mixing, heating, humidifying, cooling and dehumidifying processes with mass and energy balances."
  - "Judge reheat, evaporative cooling and condensation risks, and commission an air-handling unit with measurements that prove it works."
coverVariant: category
references:
  - title: "ASHRAE Handbook—Fundamentals, Chapter 1: Psychrometrics"
    creator: "ASHRAE"
    year: "current edition"
    note: "Named as the reference for the Hyland–Wexler saturation-pressure equations and the moist-air relations that the book and the linked WORKOS tools use. Paywalled; no tables, figures or text are reproduced."
  - title: "Formulations for the thermodynamic properties of the saturated phases of H2O from 173.15 K to 473.15 K"
    creator: "R. W. Hyland and A. Wexler, ASHRAE Transactions 89(2A)"
    year: "1983"
    note: "Named as the origin of the saturation-pressure equations over water and ice used for every property calculation in the book."
  - title: "Humidity fixed points of binary saturated aqueous solutions"
    creator: "L. Greenspan, Journal of Research of the National Bureau of Standards 81A(1)"
    year: "1977"
    url: "https://nvlpubs.nist.gov/nistpubs/jres/81A/jresv81An1p89_A1b.pdf"
    note: "Cited in Chapter 3 for the principle of checking humidity sensors over saturated salt solutions. Readers take the equilibrium humidity at their temperature from the paper itself; no values are reproduced."
  - title: "16.Unified: Thermodynamics and Propulsion (lecture notes)"
    creator: "E. M. Greitzer, Z. S. Spakovszky and I. A. Waitz, Massachusetts Institute of Technology"
    year: "2026"
    url: "https://web.mit.edu/16.unified/www/FALL/thermodynamics/notes/notes.html"
    note: "Open university notes used as the checkable reference for the steady-flow mass and energy balances applied to every air-handling process."
  - title: "AS/NZS 3666 Air-handling and water systems of buildings: Microbial control (Parts 1 to 3)"
    creator: "Standards Australia and Standards New Zealand"
    year: "2011"
    note: "Named by number and scope in Chapters 6 and 9 for humidifiers and evaporative coolers. No clauses or values are quoted; the book does not cover its requirements."
  - title: "Managing cooling water systems throughout their lifecycle"
    creator: "NSW Health"
    year: "2026"
    url: "https://www.health.nsw.gov.au/environment/factsheets/Pages/legionella-control-water-system-lifecycle.aspx"
    note: "Cited as an example of state health guidance on Legionella control in water systems; readers check the rules of their own state or territory."
  - title: "Climate data online"
    creator: "Bureau of Meteorology"
    year: "2026"
    note: "Named as a source of the site weather records from which real design conditions are derived. The book's design conditions are illustrations, not Bureau data."
related:
  - title: "Condensation Control by the Numbers"
    href: "/reados/publications/condensation-control-by-the-numbers/"
  - title: "Cooling Towers by the Numbers"
    href: "/reados/publications/cooling-towers-by-the-numbers/"
  - title: "Process Chillers by the Numbers"
    href: "/reados/publications/process-chillers-by-the-numbers/"
  - title: "Ductwork by the Numbers"
    href: "/reados/publications/ductwork-by-the-numbers/"
  - title: "Entropy by the Numbers"
    href: "/reados/publications/entropy-by-the-numbers/"
---

## About this book

An air-handling unit is a row of simple processes: two airstreams mix, a coil heats, a humidifier adds water, another coil cools and wrings water out, a fan adds a little heat. Each process obeys a mass balance for the dry air, a mass balance for the water and an energy balance, and the whole art of psychrometrics is keeping those three balances on the right basis. Most humidity problems in real plant trace back to one of them being skipped.

This book works through the processes one at a time. It sets out the properties of moist air and the chart that maps them, shows how to measure humidity well enough to trust, and turns a room's sensible and latent loads into the air the unit must supply. It then calculates mixing, winter heating and humidifying, summer cooling and dehumidifying, reheat and humidity control, and evaporative cooling, and finishes with condensation, commissioning and the checks that keep a system honest through the seasons.

It is for mechanical and building services engineers, HVAC and process technicians, facility and production managers and students who know what relative humidity is and want to calculate with it. It assumes algebra and the idea of specific heat. Each chapter works one running case with real numbers, includes one plausible mistake and how it was found, links the WORKOS tool that performs the chapter's calculation where one exists, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one fictional plant. This is an illustration. A carton printer runs sheet-fed presses in a hall 60 m long, 30 m wide and 8 m high in an inland suburb of a large Australian city. The printer specifies 22 ± 2 °C and 50 ± 5% relative humidity all year, because paperboard takes up and gives off moisture with the air around it and changes size, flatness and static charge as it does.

- **The air-handling unit:** a mixing box taking 3.0 m³/s of outdoor air and 5.0 m³/s of return air, filters, a steam humidifier, a hot-water heating coil, a chilled-water cooling coil and a draw-through supply fan absorbing 15 kW.
- **Summer loads:** 80 kW sensible and 9 kW latent on the humid design day.
- **Winter loads:** a 25 kW sensible surplus from the presses and 4 kW latent.
- **Design weather:** a humid summer day of 29 °C and 70%, a hot dry day of 38 °C and 20%, a winter day of 5 °C and 80%, and a frosty morning of 0 °C and 95%.
- **The warehouse:** an adjoining finished-goods store cooled in summer by direct evaporative coolers handling 6.0 m³/s.

The plant, its loads, the weather figures and any prices are invented. None describes KEVOS® work or a real business. Standard atmospheric pressure, 101.325 kPa, is used throughout.

## How to use the book

Read Chapters 1 to 4 in order: they set out the properties, the chart, measurement and the room balance that every later chapter uses. Chapters 5 to 9 each take one process and can be read in any order once the supply air state of Chapter 4 is understood. Chapter 10 brings the processes together for commissioning and the seasons.

Every property is calculated on the basis of one kilogram of dry air, with the same formulas the linked WORKOS tools use: the Hyland–Wexler saturation pressure, the ideal-gas humidity ratio and the standard moist-air enthalpy. Values are given to more figures than a measurement could justify, so that a reader can follow each step.

## Source limits and professional responsibility

The balances in this book are exact within their stated assumptions of steady flow and ideal-gas moist air. Room loads, design weather, equipment ratings and sensor behaviour are illustrations; real values come from a load calculation for the actual building, the site's weather records, manufacturers' data and measurement on site.

Humidifiers, evaporative coolers, cooling towers and other water-using air-handling plant carry a risk of Legionella and other microbial growth, and their installation and maintenance are regulated by state and territory health law and by AS/NZS 3666. Refrigeration, steam and electrical work need licensed trades. This book teaches how to calculate and check air-handling processes. It is educational and is not a design for any building.
