---
title: "Contact Temperature Sensors by the Numbers"
subtitle: "Thermocouples, platinum resistance thermometers and thermistors: how they work and how they are wired, installed and calibrated, worked through one cure oven"
description: "Choose, wire, install and calibrate thermocouples, Pt100s and thermistors with numbers: Seebeck voltages, cold junctions, lead errors, immersion, response time and uncertainty."
category: Manufacturing
tags: [manufacturing, quality, automation, operations]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-28
referencesChecked: 2026-10-28
edition: "1"
level: "Intermediate measurement practice for production, process and maintenance work"
audience: "Production, process, quality and maintenance engineers, instrument and electrical technicians, and technical students who specify, install, calibrate or rely on thermocouples, resistance thermometers and thermistors."
outcomes:
  - "Explain what a contact sensor actually measures, and predict when it differs from the temperature of the product."
  - "Convert thermocouple voltages with the NIST reference functions, and find the errors that cold junctions and extension cable introduce."
  - "Calculate Pt100 and thermistor resistances, sensitivities, lead-wire and self-heating errors, and choose a wiring arrangement."
  - "Estimate immersion, radiation and response-time errors, and design an installation that keeps them small."
  - "Calibrate a sensor against a reference, build an uncertainty budget and set guard bands on a process limit."
coverVariant: category
references:
  - title: "Thermal Physics, second edition"
    creator: "C. Kittel and H. Kroemer"
    year: "1980"
    note: "Supplied source, © W. H. Freeman and Company, in copyright. Read as a subject map only: the definition of temperature through thermal equilibrium and entropy, the Boltzmann factor, semiconductor carrier statistics, and the appendix on temperature scales and primary and secondary thermometers. No text, derivations as set out, figures, tables or problems are reproduced; the treatment, case, numbers and exercises in this book are its own."
  - title: "NIST ITS-90 Thermocouple Database (NIST Monograph 175 reference functions)"
    creator: "National Institute of Standards and Technology"
    year: "1993, online database current"
    url: "https://its90.nist.gov/"
    note: "Source of the type K reference function and its coefficients, from which every type K voltage in the book was computed and checked against the published table values (for example 4.096 mV at 100 °C, 8.138 mV at 200 °C and 41.276 mV at 1,000 °C)."
  - title: "How accurate is a thermocouple?"
    creator: "TC Ltd"
    year: "2026"
    url: "https://tcdirect.co.uk/thermocouple-sensors/thermocouple-accuracies.aspx"
    note: "Maker's summary of the IEC 60584 tolerance classes, used for the type K class 1 (±1.5 °C from −40 to 375 °C) and class 2 (±2.5 °C from −40 to 333 °C) values."
  - title: "What is the standard and tolerances for RTD Pt100 sensors?"
    creator: "TC Ltd"
    year: "2026"
    url: "https://tcdirect.co.uk/pt100-sensor/pt100-specification.aspx"
    note: "Maker's summary of the IEC 60751 tolerance classes for platinum resistance thermometers, used for classes AA, A and B: ±(0.1 + 0.0017|t|), ±(0.15 + 0.002|t|) and ±(0.3 + 0.005|t|) °C."
  - title: "RTD information sheet"
    creator: "Thermosense"
    year: "2026"
    url: "https://thermosensedirect.com/media/pdf/info-sheet-rtds.pdf"
    note: "Source of the Callendar–Van Dusen equation and the standard coefficients A = 3.9083 × 10⁻³, B = −5.775 × 10⁻⁷ and C = −4.183 × 10⁻¹² (C below 0 °C only) used for every Pt100 resistance in the book."
  - title: "The International System of Units (SI), ninth edition"
    creator: "Bureau International des Poids et Mesures"
    year: "2019"
    url: "https://www.bipm.org/en/publications/si-brochure"
    note: "Source of the 2019 definition of the kelvin through the fixed value of the Boltzmann constant, 1.380649 × 10⁻²³ J/K."
  - title: "The International Temperature Scale of 1990 (ITS-90)"
    creator: "H. Preston-Thomas, Metrologia 27, 3–10"
    year: "1990"
    note: "Named as the definition of the temperature scale in use, with its fixed points and interpolating instruments. Only its general structure is described; no tables are reproduced."
  - title: "IEC 60584-1 Thermocouples, Part 1: EMF specifications and tolerances; IEC 60751 Industrial platinum resistance thermometers and platinum temperature sensors"
    creator: "International Electrotechnical Commission"
    year: "editions as called up"
    note: "Named by number and scope as the standards behind thermocouple and platinum sensor tolerances. Values used in the book come from the makers' published summaries above, not from the standards themselves."
  - title: "National Measurement Institute and NATA accreditation"
    creator: "National Measurement Institute Australia; National Association of Testing Authorities"
    year: "2026"
    url: "https://www.nata.com.au/"
    note: "Named as Australia's custodian of the national measurement standards and the body that accredits calibration laboratories, as the basis of traceable calibration."
related:
  - title: "Accelerated Life Testing by the Numbers"
    href: "/reados/publications/accelerated-life-testing-by-the-numbers/"
  - title: "Infrared Temperature Measurement by the Numbers"
    href: "/reados/publications/infrared-temperature-measurement-by-the-numbers/"
  - title: "Heating and Cooling Times by the Numbers"
    href: "/reados/publications/heating-and-cooling-times-by-the-numbers/"
  - title: "Random Error and Drift by the Numbers"
    href: "/reados/publications/random-error-and-drift-by-the-numbers/"
  - title: "Fins and Heat Sinks by the Numbers"
    href: "/reados/publications/fins-and-heat-sinks-by-the-numbers/"
  - title: "Industrial Electric Heating by the Numbers"
    href: "/reados/publications/industrial-electric-heating-by-the-numbers/"
---

## About this book

Most temperatures in a factory are measured by touching: a thermocouple in an oven, a platinum resistance thermometer in a pipe, a thermistor on a circuit board. These sensors are cheap, small and familiar, and they are trusted far more than they deserve. Each one reports the temperature of its own tip, which is not always the temperature of the air, metal or liquid around it, and each sits at the end of a chain of wires, junctions and electronics that adds its own errors. A reading shown to a tenth of a degree may be thirty degrees from the truth.

This book works through contact temperature measurement with numbers. It starts with what a sensor actually reads, then treats the three common families in turn: thermocouples and the voltage they make, cold junctions and extension cable, platinum resistance thermometers, their wiring and measuring circuits, and thermistors. It then deals with the installation errors that matter most in practice, conduction along the stem, radiation and contact, and with response time. It finishes with calibration, the uncertainty budget and a full specification for one installation. Each chapter follows one running case, includes a plausible mistake and how it was found, and ends with an exercise and its worked answer.

It is for production, process, quality and maintenance engineers, instrument technicians and technical students. It assumes school algebra and physics, and the physics of temperature itself is introduced where it is needed. Non-contact measurement has its own book, *Infrared Temperature Measurement by the Numbers*, and this one links to it rather than repeating it.

## The running case

Every chapter follows one fictional installation. This is an illustration. A small coating business runs a batch powder-coat cure oven, **CV-180**, with a working space **3.0 m long, 2.0 m wide and 2.2 m high**, heated by electric elements and stirred by a recirculating fan. The powder in use must be held at **180 °C metal temperature for 10 minutes** to cure, according to its maker's data sheet as assumed for this illustration. The oven's air setpoint is **200 °C**. Parts range from **1.2 mm** sheet panels to frames with **10 mm** steel base plates.

The oven has four kinds of contact sensor. A **Pt100** in the supply air duct feeds the temperature controller. A **type K thermocouple** feeds a separate over-temperature limit controller set at **230 °C**. A six-channel **data logger** with trailing type K thermocouples is used to profile parts through a cure. A **10 kΩ thermistor** measures the logger's terminal temperature for cold-junction compensation, and another watches the control cabinet.

The business, its oven, its powder and its problems are invented. None describes KEVOS® work or a real business.

## How to use the book

Read Chapter 1 first: it sets out why a sensor reads its own temperature, which every later chapter builds on. Chapters 2 and 3 cover thermocouples, Chapters 4 and 5 platinum resistance thermometers, and Chapter 6 thermistors; they can be read in any order. Chapters 7 and 8 deal with installation and response time, Chapter 9 with calibration and uncertainty, and Chapter 10 brings everything together into a specification and a proving survey. Every calculation was checked by running it, using the NIST reference functions for thermocouples and the standard Callendar–Van Dusen coefficients for platinum.

## Source limits and professional responsibility

The physics is standard and the sensor data comes from published reference functions and makers' summaries of the IEC standards, which are named but not quoted. Heat-transfer coefficients and sensor dimensions in the running case are illustrations, and the right values for a real installation are the ones measured on it. Ovens, furnaces and their controls are hazardous: over-temperature protection, electrical work and the cure schedules that make a coating fit for use are matters for qualified people working under the applicable electrical and work health and safety rules and the coating maker's instructions. This book teaches how contact sensors work and how to check them. It is not a procedure for any installation.
