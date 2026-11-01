---
title: "Combustion by the Numbers"
subtitle: "Fuel and air, flue gas analysis, available heat, metering, burners, condensing heat recovery and gas safety, worked through one gas-fired furnace"
description: "Burn gas well with numbers: stoichiometric air, excess air from flue oxygen, available heat, flame temperature, meter corrections, turndown, flue dew point, CO and cost per useful GJ."
category: Engineering
tags: [operations, design, process-improvement, manufacturing]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-29
referencesChecked: 2026-10-29
edition: "1"
level: "Intermediate engineering practice for process heating and plant engineering"
audience: "Process, plant, maintenance and energy engineers, burner and furnace technicians, heat-treatment and coating operators, and technical students who run, tune, buy or assess gas-fired process heating equipment."
outcomes:
  - "Write the combustion reaction for natural gas and propane, and calculate the air needed, the products formed and the heating values per cubic metre."
  - "Turn a flue gas oxygen reading into excess air and CO₂, and spot an analyser reading that cannot be right."
  - "Calculate available heat from flue temperature and excess air, and use it to plan a furnace load's fuel, time and cost."
  - "Correct a gas meter reading to standard conditions and check a burner's firing rate against its rating."
  - "Explain turndown, air–fuel ratio control, flue gas condensation, carbon monoxide and purging, and compare gas and electric heat on cost and emissions."
coverVariant: category
references:
  - title: "Thermal Physics, second edition"
    creator: "C. Kittel and H. Kroemer"
    year: "1980"
    note: "Supplied source, © W. H. Freeman and Company, in copyright. Read as a subject map only: heat and work, enthalpy, the Gibbs free energy and chemical reactions, the law of mass action, the ideal gas and kinetic theory. No text, derivations as set out, figures, tables or problems are reproduced; the treatment, case, numbers and exercises in this book are its own."
  - title: "NIST Chemistry WebBook, SRD 69: methane, propane, nitrogen, oxygen, carbon dioxide and water"
    creator: "National Institute of Standards and Technology"
    year: "2026"
    url: "https://webbook.nist.gov/chemistry/"
    note: "Source of the enthalpies of combustion (methane −890.7 kJ/mol, propane −2,219.2 kJ/mol, both Pittam and Pilcher 1972) and of the Shomate heat-capacity coefficients (Chase 1998) used for every flue gas enthalpy, available heat and flame temperature in the book."
  - title: "Check burner air to fuel ratios (Process Heating Tip Sheet #2)"
    creator: "US Department of Energy, Industrial Technologies Program"
    year: "2007"
    url: "https://www1.eere.energy.gov/manufacturing/tech_assistance/pdfs/42110.pdf"
    note: "Source of the guidance that most high-temperature direct-fired furnaces, radiant tubes and boilers run with about 10 to 20% excess air at high fire, of its worked example pairing 10% excess air with 2.1% oxygen in the flue gas, which the book's own calculation reproduces, and of the method of estimating savings from available heat at present and target oxygen levels."
  - title: "Understanding your gas bill"
    creator: "Australian Gas Networks"
    year: "2026"
    url: "https://australiangasnetworks.com.au/-/media/files/blended-gas/resources/fact-sheet_understanding-your-gas-bill.pdf"
    note: "Describes how a network converts a metered volume to energy with a heating value and a pressure correction factor, the method followed in Chapter 5. The heating value used in the running case is an illustration."
  - title: "Methane: chemical datasheet"
    creator: "NOAA CAMEO Chemicals"
    year: "2026"
    url: "https://cameochemicals.noaa.gov/chemical/8823"
    note: "Source of methane's lower and upper explosive limits in air, 5% and 15% by volume, used in Chapter 8."
  - title: "Carbon monoxide technical fact sheet"
    creator: "SafeWork NSW"
    year: "2026"
    url: "https://www.safework.nsw.gov.au/resource-library/hazardous-chemicals/carbon-monoxide-technical-fact-sheet"
    note: "Source of the workplace exposure standard for carbon monoxide of 30 ppm averaged over 8 hours, used in Chapter 8. Readers should check Safe Work Australia's current list for the value in force."
  - title: "GIS 54: Schedule 9, additional information required for Type B appliance acceptance"
    creator: "Energy Safe Victoria"
    year: "2024"
    url: "https://www.energysafe.vic.gov.au/industry-guidance/gas/gas-information-sheets/gis-54-schedule-9-additional-information-required-type"
    note: "An example of a technical regulator's requirements for accepting a Type B gas appliance, cited in Chapter 8. Requirements differ between states and territories."
  - title: "AS 3814 Industrial and commercial gas-fired appliances; AS/NZS 5601.1 Gas installations, general installations"
    creator: "Standards Australia"
    year: "editions as called up"
    note: "Named by number and scope as the standards for the design of Type B appliances and for gas installations, including ventilation and flueing. No requirements or values from them are quoted."
  - title: "National Greenhouse Accounts Factors"
    creator: "Australian Government, Department of Climate Change, Energy, the Environment and Water"
    year: "published annually"
    url: "https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-accounts-factors"
    note: "Named as the source of official emission factors for fuels and state electricity grids. The book's own carbon dioxide figures are calculated from the combustion chemistry of methane; no factor from the publication is quoted."
related:
  - title: "Industrial Electric Heating by the Numbers"
    href: "/reados/publications/industrial-electric-heating-by-the-numbers/"
  - title: "Heating and Cooling Times by the Numbers"
    href: "/reados/publications/heating-and-cooling-times-by-the-numbers/"
  - title: "Process Steam by the Numbers"
    href: "/reados/publications/process-steam-by-the-numbers/"
  - title: "Industrial Gases by the Numbers"
    href: "/reados/publications/industrial-gases-by-the-numbers/"
  - title: "Condensation Control by the Numbers"
    href: "/reados/publications/condensation-control-by-the-numbers/"
  - title: "Heat Transfer by the Numbers"
    href: "/reados/publications/heat-transfer-by-the-numbers/"
---

## About this book

Most of the heat used in Australian factories for drying, curing, baking, melting and heat treatment still comes from burning gas. A gas burner looks simple: gas and air go in, a flame comes out, and a controller turns it up and down. Behind that simplicity sit a chemical reaction with fixed proportions, a stream of hot flue gas that carries away much of the fuel's energy, and a set of failure modes, from soot and carbon monoxide to explosions, that make gas plant one of the most regulated equipment types in industry.

This book works through gas combustion with numbers. It starts with the reaction and the air it needs, then reads the flue gas to find out how much air a burner is really getting. It follows the fuel's energy into the work, the walls and the flue, calculates flame temperature and the benefit of preheating the air, corrects gas meter readings to find a burner's true firing rate, and explains turndown and air–fuel ratio control. It then recovers heat from the water in the flue gas, deals with carbon monoxide, purging and approvals, and ends by comparing gas and electricity on cost and emissions. Each chapter follows one running case, includes a plausible mistake and how it was found, and ends with an exercise and its worked answer.

It is for process, plant and energy engineers, burner and furnace technicians, operators and technical students. It assumes school algebra and chemistry. Electric process heating has its own book, *Industrial Electric Heating by the Numbers*, and how long a load takes to heat through is the subject of *Heating and Cooling Times by the Numbers*; this book links to them rather than repeating them.

## The running case

Every chapter follows one fictional furnace. This is an illustration. A heat-treatment job shop runs **TF-120**, a natural-gas-fired batch tempering furnace. Two nozzle-mix burners of **60 kW** each fire into the chamber, for a total input of **120 kW (432 MJ/h)** at high fire, with combustion air from a single fan. A typical load is **800 kg** of steel parts in **200 kg** of baskets, heated to **600 °C** and held for **2 hours**. The flue gas leaves at about **650 °C**, and the burners are set for **3% oxygen** in the dry flue gas.

Gas is supplied through a sub-meter at **35 kPa** gauge. For the illustration, the network's heating value is taken as **38.6 MJ/m³** and the gas price as **A$30 per GJ including GST**. The furnace runs about **500 loads a year**.

The job shop, its furnace and its figures are invented. None describes KEVOS® work or a real business.

## How to use the book

Read Chapters 1 and 2 first: they set out the reaction, the air and the flue gas analysis that every later chapter uses. Chapters 3 and 4 follow the energy and the flame temperature, Chapter 5 deals with gas metering, and Chapter 6 with burners and control. Chapter 7 covers water in the flue gas and condensing heat recovery, Chapter 8 covers carbon monoxide, purging and approvals, and Chapter 9 compares costs and emissions. Every calculation was checked by running it, using NIST's enthalpies of combustion and heat-capacity data. Natural gas is treated as methane for the chemistry; Chapter 1 explains why that is accurate enough for air and heat calculations, and where it is not.

## Source limits and professional responsibility

The chemistry and thermodynamics are standard, and property data comes from NIST. Burner settings, losses, prices and the furnace itself are illustrations, and real equipment should be judged on its own measurements and its maker's data. Gas-fired appliances and gas installations are regulated in every Australian state and territory: their design, installation, commissioning, adjustment and servicing are for licensed gasfitters and qualified people working under the applicable standards, the appliance's approval or acceptance by the technical regulator, the maker's instructions and work health and safety law. This book explains how combustion works and how to calculate it. It is not a procedure for adjusting, commissioning or approving any appliance.
