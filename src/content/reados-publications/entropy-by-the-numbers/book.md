---
title: "Entropy by the Numbers"
subtitle: "The second law for engineers: absolute temperature, Carnot limits, heat pumps, entropy changes, lost work and exergy, worked through one food plant"
description: "Use the second law to find where a plant's energy loses its value: Carnot limits, heat pump and cool room COPs, entropy changes, lost work, exergy, throttling and compressors."
category: Engineering
tags: [design, systems, process-improvement]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-27
referencesChecked: 2026-10-27
edition: "1"
level: "Intermediate engineering thermodynamics"
audience: "Mechanical, process and building services engineers, energy auditors, plant managers and technical students who want to use entropy and exergy to judge real equipment, not just pass an exam."
outcomes:
  - "Explain why energy has a quality as well as a quantity, and why a 90% efficient boiler can still waste most of its fuel's value."
  - "Calculate Carnot limits for heat engines, heat pumps and refrigerators on the absolute scale, and reject claims that break them."
  - "Calculate entropy changes for heated liquids, phase changes and gases, and check them against property tables."
  - "Find entropy generation and lost work in heat exchangers, throttles, mixing valves and compressors."
  - "Carry out a second-law audit that ranks a plant's losses by exergy destroyed and turns the ranking into practical decisions."
coverVariant: category
references:
  - title: "Entropy and its Physical Meaning"
    creator: "J. S. Dugdale, Taylor & Francis, London (ISBN 0-7484-0569-0)"
    year: "1996 (reprinted 1998)"
    note: "Supplied source, in copyright. Read as a subject map of entropy in classical thermodynamics, its statistical meaning and its behaviour at low temperatures. No text, tables, figures, worked examples or exercises are reproduced or adapted; the engineering treatment, running case, numbers and checks in this book are original."
  - title: "16.Unified: Thermodynamics and Propulsion (lecture notes)"
    creator: "E. M. Greitzer, Z. S. Spakovszky and I. A. Waitz, Massachusetts Institute of Technology"
    year: "2026"
    url: "https://web.mit.edu/16.unified/www/FALL/thermodynamics/notes/notes.html"
    note: "Open university notes used as the checkable reference for the statements of the second law, the Carnot cycle, entropy changes of an ideal gas, lost work, throttling and the statistical definition of entropy."
  - title: "Thermophysical Properties of Fluid Systems, NIST Chemistry WebBook, SRD 69"
    creator: "National Institute of Standards and Technology"
    year: "2026"
    url: "https://webbook.nist.gov/chemistry/fluid/"
    note: "Source of the enthalpy, entropy and heat capacity of liquid water at 0.3 MPa, the saturation properties of water near 100 °C and the Joule–Thomson coefficient of nitrogen used in Chapters 1, 4, 6, 7 and 8."
  - title: "Boltzmann constant, CODATA recommended value"
    creator: "National Institute of Standards and Technology, Physical Measurement Laboratory"
    year: "2026"
    url: "https://physics.nist.gov/cgi-bin/cuu/Value?k"
    note: "Source of the exact value k = 1.380 649 × 10⁻²³ J/K used in Chapters 2 and 5."
  - title: "The International System of Units (SI Brochure), 9th edition"
    creator: "Bureau International des Poids et Mesures"
    year: "2019"
    url: "https://www.bipm.org/en/publications/si-brochure"
    note: "Named as the reference for the definition of the kelvin by a fixed value of the Boltzmann constant since 2019, discussed in Chapter 2."
  - title: "Réflexions sur la puissance motrice du feu"
    creator: "S. Carnot"
    year: "1824"
    note: "Named as the historical origin of the reversible engine and the temperature limit on heat engines. Its argument is described, not quoted."
  - title: "Model Code of Practice: Managing the risks of plant in the workplace"
    creator: "Safe Work Australia"
    year: "2022"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-plant-workplace"
    note: "Cited for the duty to manage the risks of boilers, compressors, pressure equipment and refrigeration plant discussed in the running case. The book does not cover plant safety; this code, the plant's own procedures and licensed trades do."
related:
  - title: "Heat Pumps and Refrigeration by the Numbers"
    href: "/reados/publications/heat-pumps-and-refrigeration-by-the-numbers/"
  - title: "Process Steam by the Numbers"
    href: "/reados/publications/process-steam-by-the-numbers/"
  - title: "Heat Exchangers by the Numbers"
    href: "/reados/publications/heat-exchangers-by-the-numbers/"
  - title: "Heat Transfer by the Numbers"
    href: "/reados/publications/heat-transfer-by-the-numbers/"
  - title: "Thermal Expansion by the Numbers"
    href: "/reados/publications/thermal-expansion-by-the-numbers/"
  - title: "Pneumatics by the Numbers"
    href: "/reados/publications/pneumatics-by-the-numbers/"
  - title: "Industrial Electric Heating by the Numbers"
    href: "/reados/publications/industrial-electric-heating-by-the-numbers/"
---

## About this book

The first law of thermodynamics says that energy is never lost. Every engineer believes it, and every energy bill seems to contradict it, because a plant buys energy in a form that can do almost anything and throws it away as warm water, warm air and a slightly warmer sky. The energy is all still there. What has gone is its usefulness, and the quantity that measures that loss is entropy.

This book uses entropy as an engineering tool. It starts from the absolute temperature scale and the Carnot limit, then shows how to calculate entropy changes for the things a plant actually does: heating water, raising steam, cooling a cool room, compressing and throttling air, mixing hot and cold streams and pushing heat through a heat exchanger. From entropy it builds lost work and exergy, the energy that could have been turned into work, and finishes with a second-law audit that ranks a plant's losses by how much value each destroys.

It is for mechanical, process and building services engineers, energy auditors, plant managers and students who already know the first law and want to judge real equipment with the second. It assumes algebra, natural logarithms and the idea of specific heat. Each chapter works through one running case with real numbers, includes one plausible mistake and how it was found, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one fictional plant. This is an illustration. A small Australian food processor is reviewing its utilities before replacing ageing equipment. The engineer uses a dead state of 20 °C (293.15 K) and 101.325 kPa throughout, the conditions the plant's surroundings sit at for much of the year.

- **Wash water:** 0.50 kg/s of mains water heated from 20 °C to 60 °C, 83.6 kW, now by a gas boiler of 90% efficiency on the fuel's heating value. An air-source heat pump is proposed.
- **Cool room:** held at 2 °C with a refrigeration load of 12 kW and a measured coefficient of performance of 2.5.
- **Heat recovery:** warm effluent at 45 °C, 0.50 kg/s, could preheat the incoming wash water in a plate heat exchanger.
- **Tempering valve:** mixes 60 °C hot water with 20 °C cold water to supply 40 °C hand-wash water.
- **Compressed air:** a compressor taking 22 kW delivers 0.06 kg/s of air at 8 bar absolute, which regulators reduce to 5 bar absolute for a packaging line.
- **Cooking kettle:** a jacketed kettle condensing 0.02 kg/s of low-pressure steam at 102.5 °C.

The plant, its equipment, the measurements and every price are invented. None describes KEVOS® work or a real business.

## How to use the book

Read Chapters 1 to 4 in order: they set out the quality of energy, the absolute temperature scale, the limits on heat pumps and refrigerators, and the methods for calculating entropy that every later chapter uses. Chapter 5 explains what entropy counts at the molecular scale and can be read at any point. Chapters 6 to 9 deal with the main sources of loss in a plant, and Chapter 10 brings them together in an audit.

Water properties are taken from the NIST Chemistry WebBook and given to more figures than a measurement could justify, so that a reader can follow each step. Where a simpler model, such as a constant specific heat, is used instead, the chapter says so and compares it with the table.

## Source limits and professional responsibility

The laws and formulas in this book are standard and exact within their stated assumptions. The equipment performance figures, such as the heat pump's coefficient of performance and the compressor's power, are illustrations; real figures come from the manufacturer's data at the actual operating conditions and from measurement on site. Treating fuel exergy as equal to the fuel's heating value is a simplification adopted for clarity.

Boilers, pressure vessels, compressed air systems, refrigeration plant and gas appliances carry serious hazards and are regulated in Australia. Their design, installation, modification and maintenance are matters for competent engineers and licensed trades, under work health and safety law and Safe Work Australia's model code of practice for plant, and under the licensing that applies to gas fitting and refrigerant handling. This book teaches how to judge energy use. It is educational and is not a design for any plant.
