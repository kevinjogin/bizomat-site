---
title: "Infrared Temperature Measurement by the Numbers"
subtitle: "Planck's law, emissivity, wavelength, ratio pyrometers, reflections, spot size, thermography and calibration, worked through one forging billet heater"
description: "Measure hot parts and running plant without contact, with numbers: thermal radiation, emissivity errors, wavelength choice, ratio pyrometers, reflections, spot size, thermography and uncertainty."
category: Manufacturing
tags: [manufacturing, quality, automation, operations]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-27
referencesChecked: 2026-10-27
edition: "1"
level: "Intermediate measurement physics for production and maintenance"
audience: "Production, process, quality and maintenance engineers, instrument technicians and technical students who choose, install, set up or rely on pyrometers and thermal imaging cameras."
outcomes:
  - "Use Planck's law to explain what an infrared thermometer measures and why short wavelengths suit hot metal."
  - "Calculate the temperature error from a wrong emissivity setting at any wavelength, and choose a wavelength that limits it."
  - "Explain when a ratio pyrometer helps, when it does not, and what limits its accuracy."
  - "Correct for reflected radiation, windows and partly filled spots, and set up a pyrometer installation that stays accurate."
  - "Run a thermographic survey that finds real faults, and build an uncertainty budget traceable to a calibration."
coverVariant: category
references:
  - title: "Thermal and Statistical Physics (draft edition)"
    creator: "H. Gould and J. Tobochnik"
    year: "2006"
    note: "Supplied source, in copyright (later published by Princeton University Press). Read as a subject map for temperature and its measurement, the photon gas and black body radiation, the Planck distribution and the Stefan–Boltzmann law. No text, derivations as set out, figures, tables or problems are reproduced; the treatment, case, numbers and exercises in this book are its own."
  - title: "CODATA values: second radiation constant and Stefan–Boltzmann constant"
    creator: "National Institute of Standards and Technology"
    year: "2019"
    url: "https://physics.nist.gov/cuu/Constants/"
    note: "The second radiation constant, 1.438776877 × 10⁻² m·K, and the Stefan–Boltzmann constant, 5.670374419 × 10⁻⁸ W/(m²·K⁴), used in every radiation calculation. The Planck-law values in the book were computed from these constants and checked by running the calculations."
  - title: "What is Emissivity?"
    creator: "AMETEK Land"
    year: "2025"
    url: "https://www.ametek-land.com/pressreleases/blog/2025/march/what-is-emissivity-2025"
    note: "Source of the definition of emissivity used, the relation between emissivity and reflectivity for opaque bodies, and the indicative emissivities at 1 µm of oxidised steel (0.85) and unoxidised steel (0.35). Indicative values only."
  - title: "Emissivity Table"
    creator: "Optris"
    year: "2026"
    url: "https://optris.com/us/technology/emissivity-table/"
    note: "Source of the indicative emissivities of polished and oxidised copper, painted surfaces and anodised aluminium used in Chapter 7, and of the maker's advice that tabulated values are recommendations to be verified under the actual measurement conditions."
  - title: "ISO 18434-1 Condition monitoring and diagnostics of machines: Thermography, Part 1: General procedures"
    creator: "International Organization for Standardization"
    year: "edition as called up"
    note: "Named by number and scope as the international standard for thermographic condition monitoring of machines. No values or criteria are quoted from it."
  - title: "AS/NZS 4836 Safe working on or near low-voltage and extra-low voltage electrical installations and equipment"
    creator: "Standards Australia and Standards New Zealand"
    year: "edition as called up"
    note: "Named in Chapter 7 by number and scope as one reference for safe work near live electrical equipment during thermal surveys. No values are quoted from it."
related:
  - title: "Contact Temperature Sensors by the Numbers"
    href: "/reados/publications/contact-temperature-sensors-by-the-numbers/"
  - title: "Heat Transfer by the Numbers"
    href: "/reados/publications/heat-transfer-by-the-numbers/"
  - title: "Heating and Cooling Times by the Numbers"
    href: "/reados/publications/heating-and-cooling-times-by-the-numbers/"
  - title: "Industrial Electric Heating by the Numbers"
    href: "/reados/publications/industrial-electric-heating-by-the-numbers/"
  - title: "Random Error and Drift by the Numbers"
    href: "/reados/publications/random-error-and-drift-by-the-numbers/"
---

## About this book

Everything warmer than absolute zero gives off thermal radiation, and an infrared thermometer turns that radiation into a temperature. It can read a billet leaving an induction coil at 1,200 °C, a moving strip, a rotating shaft or a live busbar, none of which a thermocouple could touch. It can also read the wrong number with complete confidence. The radiation it collects depends on the surface as much as the temperature, it includes whatever the surface reflects, it passes through windows, steam and dust on the way, and it comes from a spot that may or may not be filled by the object. An instrument that reads to a tenth of a degree can be wrong by fifty.

This book works through infrared temperature measurement with numbers. It starts with Planck's law, the physics of thermal radiation, and uses it to show why the wavelength an instrument works at decides how badly a wrong emissivity hurts. It then deals with emissivity itself, the choice of wavelength, ratio pyrometers, reflections and windows, spot size and alignment, thermal imaging for maintenance, and finally calibration and the uncertainty budget. Each chapter follows one running case, includes a plausible mistake and how it was found, and ends with an exercise and its worked answer.

It is for production, process, quality and maintenance engineers, instrument technicians and technical students who choose, install or rely on pyrometers and thermal cameras. It assumes school algebra and physics; the radiation physics is built up from there. Detector design, spectroscopy and the details of particular instruments are outside its scope.

## The running case

Every chapter follows one fictional installation. This is an illustration. A forge heats carbon steel billets, **40 mm in diameter and 100 mm long**, in an induction heater, IH-40, and feeds them to a forging press. A billet leaves the coil every **12 seconds**, and its temperature must be **1,200 °C**, within an accepted band of **1,170 to 1,230 °C**; a diverter sends cold billets back for reheating and hot ones to a scrap bin, because overheated steel forges badly. The billet surface carries a thin oxide scale.

The exit temperature is read by a single-wavelength pyrometer working at **1.0 µm**, mounted **0.6 m** from the billets' path, looking through a protective window, with its emissivity set to **0.85**. The forge is considering a ratio pyrometer. Its maintenance team also uses an 8 to 14 µm thermal imaging camera to survey the heater's power cabinet and the press's motor.

The forge, its heater, its instruments and its problems are invented. None describes KEVOS® work or a real business.

## How to use the book

Read Chapters 1 and 2 first: they set out the radiation physics and the emissivity problem that every later chapter builds on. Chapters 3 to 6 deal with choosing and installing a pyrometer, Chapter 7 with thermal imaging for maintenance, and Chapter 8 with calibration and the uncertainty budget. Every calculation was checked by running it with the CODATA constants, using the full Planck law rather than an approximation unless the text says otherwise.

## Source limits and professional responsibility

The physics is standard. Emissivity values from makers' tables are indicative only, and the right value for a real surface is the one measured on it under the conditions of use. The instrument settings, temperatures and tolerances in the running case are illustrations. Hot billets, induction heaters, live switchboards and running machinery are hazardous: thermography of energised electrical equipment is done by trained people under the applicable electrical safety rules and work health and safety law, and qualified review governs process settings for real work. This book teaches how infrared thermometry works and how to check it. It is not a procedure for any installation.
