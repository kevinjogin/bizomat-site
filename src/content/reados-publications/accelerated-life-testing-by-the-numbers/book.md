---
title: "Accelerated Life Testing by the Numbers"
subtitle: "Arrhenius, humidity and thermal-cycling models, Weibull analysis and demonstration tests that prove a life in weeks, worked through one floodlight"
description: "Prove a product's life without waiting years: the Boltzmann factor and Arrhenius model, capacitor life, humidity and thermal cycling, Weibull analysis, sample sizes and HALT."
category: Products
tags: [validation, quality, product-development, design]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-28
referencesChecked: 2026-10-28
edition: "1"
level: "Intermediate reliability engineering for product design and validation"
audience: "Product, design, test and quality engineers, and technical managers in small and medium manufacturers who must show that a product will last its design life before it ships."
outcomes:
  - "Explain why raising temperature speeds up failure, using the Boltzmann factor, and calculate Arrhenius acceleration factors and their sensitivity to activation energy."
  - "Estimate electrolytic capacitor life, humidity acceleration with the Peck model and solder-fatigue acceleration with the Norris–Landzberg model."
  - "Fit a Weibull distribution to life data with suspensions, and translate a test result into field life."
  - "Size a zero-failure demonstration test for a stated reliability and confidence, and judge what it really proves."
  - "Use HALT and step-stress results to choose safe test stresses, and plan a test programme that answers the product's real questions."
coverVariant: category
references:
  - title: "Thermal Physics, second edition"
    creator: "C. Kittel and H. Kroemer"
    year: "1980"
    note: "Supplied source, © W. H. Freeman and Company, in copyright. Read as a subject map only: the Boltzmann factor, the statistics of thermally activated processes and the treatment of reaction equilibrium. No text, derivations as set out, figures, tables or problems are reproduced; the treatment, case, numbers and exercises in this book are its own."
  - title: "NIST/SEMATECH e-Handbook of Statistical Methods, section 8.1.5.1: Arrhenius"
    creator: "National Institute of Standards and Technology"
    year: "2012, online"
    url: "https://www.itl.nist.gov/div898/handbook/apr/section1/apr151.htm"
    note: "Source of the Arrhenius acceleration model in the form used, the Boltzmann constant in eV/K, the typical activation energy range of about 0.3 to 1.5 eV, and the check values of 133 and about 17,600 for the acceleration factors between 25 °C and 125 °C at 0.5 and 1.0 eV, which the book's calculations reproduce."
  - title: "CODATA value: Boltzmann constant"
    creator: "National Institute of Standards and Technology"
    year: "2019"
    url: "https://physics.nist.gov/cuu/Constants/"
    note: "The Boltzmann constant, 8.617333262 × 10⁻⁵ eV/K, used in every Arrhenius and Peck calculation."
  - title: "SN008a: Expected lifetime of aluminum electrolytic and aluminum polymer capacitors"
    creator: "F. Puhane, Würth Elektronik"
    year: "2018"
    url: "https://www.we-online.com/components/media/o173043v410%20SN008a%20EN.pdf"
    note: "Maker's support note giving the lifetime estimate for liquid aluminium electrolytic capacitors, Lx = Lnom × 2^((T0 − Ta)/10), and stating that makers set a typical maximum expected lifetime of 13 to 15 years whatever the calculation gives. Both are used in Chapter 3 as a maker's rule, not a universal law."
  - title: "Comprehensive model for humidity testing correlation (Proceedings of the 24th International Reliability Physics Symposium, pp. 44–50)"
    creator: "D. S. Peck"
    year: "1986"
    note: "The origin of the Peck temperature–humidity model. Its parameters, a humidity exponent of 2.7 and an activation energy of 0.79 eV, are taken from the secondary summary below, as the original paper could not be read in full."
  - title: "Temperature humidity accelerated life testing"
    creator: "F. Schenkelberg, Accendo Reliability"
    year: "2026"
    url: "https://accendoreliability.com/temperature-humidity-accelerated-life-testing/"
    note: "Secondary source for the form of the Peck model and the values n = 2.7 and Ea = 0.79 eV attributed to Peck's paper."
  - title: "Norris–Landzberg solder joint fatigue"
    creator: "F. Schenkelberg, Accendo Reliability"
    year: "2026"
    url: "https://accendoreliability.com/norris-landzberg-solder-joint-fatigue/"
    note: "Source of the Norris–Landzberg acceleration model and its fitted constants for tin–lead eutectic solder (frequency exponent 1/3, temperature-range exponent 1.9, Ea/k = 1,414 K), and of the note that one study suggests the same values for lead-free solder. Original: K. C. Norris and A. H. Landzberg, Reliability of controlled collapse interconnections, IBM Journal of Research and Development 13(3), 266–271, 1969."
  - title: "IEC 61649 Weibull analysis; JEDEC JESD22 series of environmental stress tests"
    creator: "International Electrotechnical Commission; JEDEC Solid State Technology Association"
    year: "editions as called up"
    note: "Named by number and scope as the standard for Weibull analysis and the family of temperature, humidity and temperature-cycling test methods for electronic components. No values or clauses are quoted from them."
  - title: "Consumer guarantees"
    creator: "Australian Competition and Consumer Commission"
    year: "2026"
    url: "https://www.accc.gov.au/consumers/buying-products-and-services/consumer-rights-and-guarantees"
    note: "Used for the general point that the Australian Consumer Law's guarantees, including acceptable quality and durability, apply alongside any manufacturer's warranty. No legal advice is given."
related:
  - title: "Contact Temperature Sensors by the Numbers"
    href: "/reados/publications/contact-temperature-sensors-by-the-numbers/"
  - title: "Electronics Packaging by the Numbers"
    href: "/reados/publications/electronics-packaging-by-the-numbers/"
  - title: "Connected Products by the Numbers"
    href: "/reados/publications/connected-products-by-the-numbers/"
  - title: "Diffusion by the Numbers"
    href: "/reados/publications/diffusion-by-the-numbers/"
  - title: "Fins and Heat Sinks by the Numbers"
    href: "/reados/publications/fins-and-heat-sinks-by-the-numbers/"
  - title: "Thermal Expansion by the Numbers"
    href: "/reados/publications/thermal-expansion-by-the-numbers/"
---

## About this book

A product designed to last ten years cannot be tested for ten years before it ships. Accelerated life testing makes the time shorter by raising the stresses that drive wear-out, most often temperature, humidity and temperature cycling, so that the same damage accumulates in weeks. It rests on physics: most chemical and diffusion processes that wear products out speed up with temperature in a way that the Boltzmann factor describes, and fatigue grows with the size of each thermal cycle in a way that can be measured. It also rests on assumptions that are easy to forget, and an accelerated test that breaks them can prove almost anything.

This book works through accelerated life testing with numbers. It starts with what can and cannot be accelerated, then derives the Arrhenius model from the Boltzmann factor and shows how sensitive its predictions are to the activation energy. It applies the idea to the electrolytic capacitor, often the life-limiting part of a power supply, and extends it to humidity and to thermal cycling of solder joints. It then turns to the statistics: fitting a Weibull distribution to life data, sizing a demonstration test, and using HALT and step-stress tests to find margins and safe stress levels. It ends with a complete test plan and what the field taught it. Each chapter follows one running case, includes a plausible mistake and how it was found, and ends with an exercise and its worked answer.

It is for product, design, test and quality engineers and their managers. It assumes school algebra and some familiarity with logarithms; the physics and statistics are built up from there.

## The running case

Every chapter follows one fictional product. This is an illustration. A small Australian lighting manufacturer is developing **FL-60**, a 60 W LED floodlight for loading docks and yards. It has a die-cast aluminium housing sealed with a silicone gasket, an LED board on an aluminium-core circuit board, and a constant-current driver whose life is expected to be limited by its aluminium electrolytic capacitors.

FL-60 is designed to run **12 hours a night**, 4,380 hours a year, for a design life of **10 years**, or **43,800 operating hours**, outdoors in Australian conditions. The reliability target is that at least **90%** of drivers survive the design life, demonstrated with **90% confidence**. The business offers a 5-year warranty. Its test budget is a few months of chamber time, not years.

The manufacturer, the floodlight, its parts, test results and field returns are invented. None describes KEVOS® work or a real business.

## How to use the book

Read Chapters 1 and 2 first: they set out what acceleration means and the Arrhenius model that most later chapters use. Chapters 3 to 5 apply acceleration models to capacitors, humidity and thermal cycling. Chapters 6 and 7 cover the statistics of life data and demonstration tests, Chapter 8 the search for margins with HALT and step stress, and Chapter 9 the full test plan. Every calculation was checked by running it, with the CODATA value of the Boltzmann constant.

## Source limits and professional responsibility

The acceleration models in this book are empirical. Their parameters were fitted to particular materials and failure mechanisms, and the values quoted are the published ones for those cases, used here as illustrations. A real product's parameters must come from its own components' data, its makers' guidance and its own tests. Products such as FL-60 must also meet electrical safety, electromagnetic compatibility and other regulatory requirements, which reliability testing does not replace, and the Australian Consumer Law's guarantees apply whatever warranty is offered. This book teaches how accelerated life testing works and how to check it. It is not a test procedure for any product, and qualified review governs real decisions about safety, compliance and warranty.
