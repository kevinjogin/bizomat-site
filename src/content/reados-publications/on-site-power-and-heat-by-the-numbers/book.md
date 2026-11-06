---
title: "On-Site Power and Heat by the Numbers"
subtitle: "Carnot limits, engine and turbine cycles, steam turbines, waste heat and combined heat and power, worked through one laundry's energy plant"
description: "Judge on-site power and heat with engineering thermodynamics: Carnot limits, Otto, Diesel, Brayton and Rankine cycles, turbochargers, waste heat recovery and the cogeneration business case."
category: Engineering
tags: [design, systems, operations, process-improvement]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-30
referencesChecked: 2026-10-30
edition: "1"
level: "Intermediate engineering thermodynamics"
audience: "Mechanical, process and energy engineers, plant managers, energy auditors and technical students who need to judge engines, turbines, heat recovery and cogeneration proposals with their own numbers."
outcomes:
  - "Use the first law, heat rate and the Carnot limit to test any efficiency or power claim for a heat engine."
  - "Analyse compressors and turbines in steady flow and find their isentropic efficiency from measured pressures and temperatures."
  - "Work the air-standard Otto, Diesel and Brayton cycles and explain how far real gas engines, diesels and gas turbines fall short of them."
  - "Calculate condensing and back-pressure steam turbine cycles, including heat rate and exhaust dryness."
  - "Find the exergy of engine exhaust and jacket water, and judge recovery claims against it."
  - "Calculate cogeneration utilisation and primary energy saving on a consistent heating-value basis, and build a heat-led business case."
coverVariant: category
references:
  - title: "16.Unified: Thermodynamics and Propulsion (lecture notes)"
    creator: "E. M. Greitzer, Z. S. Spakovszky and I. A. Waitz, Massachusetts Institute of Technology"
    year: "2026"
    url: "https://web.mit.edu/16.unified/www/FALL/thermodynamics/notes/notes.html"
    note: "Open university notes used as the checkable reference for the steady-flow energy equation, the Carnot cycle, the Brayton, Otto and Diesel air-standard cycles and the Rankine cycle. The book's treatment, running case, numbers and exercises are original."
  - title: "Revised Release on the IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam (IAPWS R7-97)"
    creator: "International Association for the Properties of Water and Steam"
    year: "2012"
    url: "https://www.iapws.org/relguide/IF97-Rev.html"
    note: "Formulation used, through an independent implementation, for every steam enthalpy, entropy, saturation temperature and specific volume in Chapter 8."
  - title: "NIST Chemistry WebBook, SRD 69"
    creator: "National Institute of Standards and Technology"
    year: "2026"
    url: "https://webbook.nist.gov/chemistry/"
    note: "Source of the heat of combustion of methane and the enthalpy of vaporisation of water from which the higher and lower heating values in Chapters 1 and 5 are derived."
  - title: "CODATA Key Values for Thermodynamics"
    creator: "J. D. Cox, D. D. Wagman and V. A. Medvedev (eds), Hemisphere Publishing"
    year: "1989"
    note: "Named in Chapter 5 as the source of the enthalpy of vaporisation of water at 25 °C, 44.0 kJ/mol, used to convert the higher heating value of methane to the lower."
  - title: "ISO 8528-1 Reciprocating internal combustion engine driven alternating current generating sets, Part 1: Application, ratings and performance; ISO 3046-1 Reciprocating internal combustion engines, Performance, Part 1: Declarations of power, fuel and lubricating oil consumptions, and test methods"
    creator: "International Organization for Standardization"
    year: "current editions"
    note: "Named by number and scope in Chapters 4 and 5 for generating-set duty ratings and for the reference conditions behind engine power and fuel figures. Paywalled; no clauses or values are quoted."
  - title: "Goods and services tax (GST)"
    creator: "Australian Taxation Office"
    year: "current web page"
    url: "https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst"
    note: "Cited in Chapter 10 for the basis of comparing costs excluding GST: a registered business claims GST credits on its business purchases."
  - title: "National Greenhouse Accounts Factors"
    creator: "Australian Government, Department of Climate Change, Energy, the Environment and Water"
    year: "published annually"
    url: "https://www.dcceew.gov.au/climate-change/publications/national-greenhouse-accounts-factors"
    note: "Named in Chapter 10 as the source of the emission factors for gas and for grid electricity by state that decide whether cogeneration lowers a site's emissions. No factors are quoted."
  - title: "Understanding your gas bill"
    creator: "Australian Gas Networks"
    year: "2026"
    url: "https://australiangasnetworks.com.au/-/media/files/blended-gas/resources/fact-sheet_understanding-your-gas-bill.pdf"
    note: "Cited for the way Australian gas is billed by energy content in megajoules, the basis behind converting between billed (higher) and datasheet (lower) heating values in Chapters 5 and 10."
  - title: "Directive 2012/27/EU on energy efficiency, Annex II"
    creator: "European Parliament and Council of the European Union"
    year: "2012"
    note: "Named as the origin of the primary energy saving measure for cogeneration used in Chapter 10. Its method is described, not quoted; the reference efficiencies in the book are the analyst's stated choices, not the directive's values."
  - title: "Réflexions sur la puissance motrice du feu"
    creator: "S. Carnot"
    year: "1824"
    note: "Named as the historical origin of the reversible engine and the temperature limit on heat engines in Chapter 1. Its argument is described, not quoted."
  - title: "AS/NZS 5601.1 Gas installations, general installations; AS 3814 Industrial and commercial gas-fired appliances; AS/NZS 3000 Electrical installations (wiring rules)"
    creator: "Standards Australia and Standards New Zealand"
    year: "current editions"
    note: "Named by number and scope in Chapter 10 as standards that bear on installing a gas engine generator. No clauses or values are quoted; the book does not cover their requirements."
  - title: "Model Code of Practice: Managing the risks of plant in the workplace"
    creator: "Safe Work Australia"
    year: "2022"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-plant-workplace"
    note: "Cited for the duty to manage the risks of engines, boilers, turbines and pressure plant discussed in the running case. The book does not cover plant safety; this code, the plant's own procedures and licensed trades do."
related:
  - title: "Entropy by the Numbers"
    href: "/reados/publications/entropy-by-the-numbers/"
  - title: "Combustion by the Numbers"
    href: "/reados/publications/combustion-by-the-numbers/"
  - title: "Process Steam by the Numbers"
    href: "/reados/publications/process-steam-by-the-numbers/"
  - title: "Heat Exchangers by the Numbers"
    href: "/reados/publications/heat-exchangers-by-the-numbers/"
  - title: "Compressed Air Plant by the Numbers"
    href: "/reados/publications/compressed-air-plant-by-the-numbers/"
---

## About this book

Every proposal for on-site power arrives with a set of efficiencies: an electrical efficiency for the engine, a heat recovery figure, a utilisation factor and a payback period. The figures are often all true and still tell the buyer very little, because each is measured against a different basis and none says how much of the heat the site can actually use. This book gives an engineer the thermodynamics to rebuild those figures from first principles and decide for themselves.

It starts with the first law and the Carnot limit, then analyses the machines one at a time: compressors and turbines in steady flow, the Otto and Diesel cycles behind gas engines and standby generators, the Brayton cycle behind gas turbines and microturbines, and the Rankine cycle behind steam turbines. It then follows the heat that every engine rejects, finds how much of it is worth recovering, and finishes with cogeneration, where power and heat are judged together and turned into a business case.

It is for mechanical, process and energy engineers, plant managers, energy auditors and students who know the first law and the idea of specific heat and want to apply them to real equipment. It assumes algebra, powers and natural logarithms. Each chapter works one running case with real numbers, includes one plausible mistake and how it was found, links the BIZOMAT tool that performs the chapter's main calculation, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one fictional plant. This is an illustration. A commercial laundry in a regional Australian city washes, dries and irons linen for hotels and restaurants. It runs 16 hours a day, 300 days a year (4,800 hours), and is reviewing on-site generation before it replaces an ageing boiler.

- **Electricity:** an average demand of 450 kW while the plant runs, never below 400 kW.
- **Steam:** 550 kW at 10 bar gauge (184.1 °C) for the flatwork ironers and finishing, from a gas-fired boiler of 82% efficiency on the gas's higher heating value.
- **Hot water:** 350 kW for the tunnel washer, from a steam calorifier fed through a pressure-reducing valve at 2 bar gauge.
- **The proposal:** a lean-burn gas engine generator taking 1,000 kW of fuel on the lower heating value, making 400 kW of electricity (390 kW net), with 230 kW of jacket-water heat at 90 °C and 0.64 kg/s of exhaust at 470 °C.
- **The alternatives:** a recuperated microturbine, a back-pressure steam turbine in place of the pressure-reducing valve, and an organic Rankine cycle unit offered for the jacket water. The site already has a 500 kVA standby diesel generator.

The plant, its equipment, the measurements and every price are invented. None describes BIZOMAT work or a real business. Surroundings are taken as 25 °C and 101.325 kPa throughout.

## How to use the book

Read Chapters 1 and 2 first: they set out the energy balance, the Carnot limit and the steady-flow analysis that every later chapter uses. Chapters 3 to 5 deal with reciprocating engines, Chapters 6 and 7 with gas turbines and Chapter 8 with steam turbines; each group can be read on its own. Chapters 9 and 10 bring the heat and the money together and depend on the earlier figures for the gas engine.

The cycle chapters use the cold-air standard: air as an ideal gas with constant specific heats and reversible processes. It is a model for understanding and comparing, not for predicting a real machine's output, and each chapter says where it departs from reality. Steam properties come from the IAPWS-IF97 formulation. Fuel is treated as methane for combustion calculations.

## Source limits and professional responsibility

The laws and cycle formulas in this book are standard and exact within their stated assumptions. Equipment figures such as the engine's efficiency, the turbocharger's measurements and the microturbine's component efficiencies are illustrations; real figures come from the manufacturer's data at the actual operating conditions and from tests on site. Prices are illustrations, stated excluding GST.

Gas engines, turbines, boilers, pressure equipment, gas installations and generators connected to the electricity network carry serious hazards and are regulated in Australia. Their design, installation, connection, operation and maintenance are matters for competent engineers, licensed gas fitters and electricians, the gas and electrical safety regulators, the local network service provider and the environmental regulator, under work health and safety law and Safe Work Australia's model code of practice for plant. This book teaches how to judge energy conversion. It is educational and is not a design or approval for any plant.
