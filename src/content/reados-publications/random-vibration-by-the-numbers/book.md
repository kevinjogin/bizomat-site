---
title: "Random Vibration by the Numbers"
subtitle: "Spectra, RMS levels, Miles' equation, isolation, peaks, fatigue and shaker testing, worked through the electrics on a mobile screening plant"
description: "Specify, analyse and test equipment for random vibration: power spectral density, RMS and peaks, single-degree-of-freedom response, isolation, fatigue under random loading and test time compression."
category: Engineering
tags: [design, validation, quality, manufacturing]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-30
referencesChecked: 2026-10-30
edition: "1"
level: "Intermediate mechanical and product engineering"
audience: "Mechanical, electrical and product engineers, test engineers, technicians and students who must design or check equipment that is shaken by vehicles, machines or transport, and plan or read vibration tests."
outcomes:
  - "Describe random vibration by its power spectral density, calculate the RMS level of a profile and read its peaks from the normal distribution."
  - "Estimate a power spectral density from measured data and state the statistical uncertainty of the estimate."
  - "Predict the response of a resonant part or a mounted box with Miles' equation, and its relative displacement."
  - "Select isolators that avoid machine forcing frequencies and reduce random vibration, and check sway space."
  - "Estimate fatigue damage under random loading with the Rayleigh peak distribution and Miner's rule, and plan a time-compressed shaker test."
coverVariant: category
references:
  - title: "An Introduction to Stochastic Processes in Physics"
    creator: "D. S. Lemons, Johns Hopkins University Press"
    year: "2002"
    note: "In copyright. Used only as a map of the physics behind the book: random variables and the normal distribution, the central limit theorem, the Langevin equation and the stochastically driven damped harmonic oscillator. No text, structure, figures, tables or problems are reproduced."
  - title: "On structural fatigue under random loading"
    creator: "J. W. Miles, Journal of the Aeronautical Sciences 21(11), 753–762"
    year: "1954"
    note: "Named in Chapter 4 as the origin of Miles' equation for the RMS response of a single-degree-of-freedom system to broadband random input."
  - title: "The Miles Equation (FEMCI workshop poster)"
    creator: "R. Simmons, NASA Goddard Space Flight Center"
    year: "2001"
    url: "https://femci.gsfc.nasa.gov/workshop/2001/posters/simmons/Simmons_MilesEquation.pdf"
    note: "Cited in Chapter 4 for the equation's single-degree-of-freedom and flat-input assumptions and the errors that follow when a spectrum is shaped near the resonance."
  - title: "Mathematical analysis of random noise"
    creator: "S. O. Rice, Bell System Technical Journal 23 and 24"
    year: "1944–1945"
    note: "Named in Chapter 7 as the origin of the expected rate of zero crossings and the peak distribution of a Gaussian random process."
  - title: "Random Data: Analysis and Measurement Procedures, 4th edition"
    creator: "J. S. Bendat and A. G. Piersol, John Wiley & Sons"
    year: "2010"
    note: "Named in Chapter 3 as the standard text on estimating power spectral densities and their statistical error. No text or tables are reproduced."
  - title: "Vibration Analysis for Electronic Equipment, 3rd edition"
    creator: "D. S. Steinberg, John Wiley & Sons"
    year: "2000"
    note: "Named in Chapters 6 and 8 as the source of the three-band approach to random fatigue and of the practice of separating the natural frequencies of nested assemblies. No text or tables are reproduced."
  - title: "NASA-HDBK-7005 Dynamic Environmental Criteria"
    creator: "National Aeronautics and Space Administration"
    year: "2001"
    note: "Named as a public handbook on predicting and testing for dynamic environments, including random vibration. No values are quoted."
  - title: "IEC 60068-2-64 Environmental testing, Part 2-64: Tests, Test Fh: Vibration, broadband random and guidance; MIL-STD-810H Method 514.8 Vibration"
    creator: "International Electrotechnical Commission; US Department of Defense"
    year: "current editions"
    note: "Named by number and scope in Chapter 9 as the test standards most often specified for random vibration testing. No clauses, profiles or values are quoted; the book's profile is an illustration."
  - title: "AS 4100 Steel structures, Section 11 Fatigue"
    creator: "Standards Australia"
    year: "current edition"
    note: "Named by number and scope in Chapter 8 for the treatment of fatigue in welded steel details with S–N curves that change slope below the constant-amplitude fatigue limit. No values are quoted."
related:
  - title: "Vibrating Machine Elements by the Numbers"
    href: "/reados/publications/vibrating-machine-elements-by-the-numbers/"
  - title: "Electronics Packaging by the Numbers"
    href: "/reados/publications/electronics-packaging-by-the-numbers/"
  - title: "Accelerated Life Testing by the Numbers"
    href: "/reados/publications/accelerated-life-testing-by-the-numbers/"
  - title: "Random Error and Drift by the Numbers"
    href: "/reados/publications/random-error-and-drift-by-the-numbers/"
  - title: "Designing Welded Joints by the Numbers"
    href: "/reados/publications/designing-welded-joints-by-the-numbers/"
---

## About this book

A machine on a truck, a box on a vibrating screen, a product in a delivery van: none of them is shaken by a single tidy sine wave. They are shaken by a jumble of frequencies whose amplitudes rise and fall at random, the combined effect of rough roads, engines, gears, impacts and structures ringing in sympathy. That jumble has a precise description, the power spectral density, and from it an engineer can predict how hard each part of the equipment will be shaken, how far it will move, how often its peaks will reach any level, and how long it will last before fatigue cracks it.

This book works through that chain of ideas. It starts with random vibration as a random variable and with the spectrum that describes it, shows how a spectrum is measured and how uncertain the measurement is, and then follows the vibration into a resonant part, through isolators and into the boards and brackets inside a box. It finishes with peaks, fatigue under random loading, and the shaker tests that compress years of service into hours.

It is for mechanical, electrical and product engineers, test engineers, technicians and students who meet vibration requirements and want to understand and check them. It assumes the idea of a natural frequency, basic statistics and logarithms. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the KEVOS® tool that performs the chapter's calculation where one exists, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one fictional installation. This is an illustration. A mobile screening plant for quarries carries its control equipment on its own frame: a diesel engine running at 1,500 rpm drives the vibrating screen and a generator, and the electrics sit in a steel enclosure, CB-7, bolted near the engine.

- **The enclosure:** 18 kg with its contents, on four mounts; inside, a main circuit board whose first natural frequency is about 180 Hz.
- **The vibration specification:** a random profile from 5 to 500 Hz, rising at 3 dB per octave from 0.0025 g²/Hz at 5 Hz to 0.02 g²/Hz at 40 Hz, flat at 0.02 g²/Hz to 200 Hz, then falling to 0.005 g²/Hz at 500 Hz: 2.55 g RMS in all.
- **A sensor bracket:** a steel bracket carrying a proximity sensor and junction box, bolted directly to the screen frame, with a natural frequency of about 120 Hz.
- **Service:** about 2,000 operating hours a year for ten years.

The plant, its profile, its frequencies and any material data are invented. None describes KEVOS® work or a real product. Accelerations are in g, where 1 g = 9.807 m/s².

## How to use the book

Read Chapters 1 to 4 in order: they set out the random-variable view, the spectrum, measurement and the single-degree-of-freedom response on which everything else rests. Chapters 5 and 6 follow the vibration into the enclosure and should be read together. Chapters 7 and 8 deal with peaks and fatigue, and Chapter 9 with testing.

The methods are the classical hand methods: Miles' equation, transmissibility, the Rayleigh distribution of peaks and Miner's rule. They are the right tools for first sizing and for checking finite element and test results, and the book states the assumptions behind each.

## Source limits and professional responsibility

Real structures have many modes, non-linear joints and damping that varies with amplitude, and real environments are not always stationary or Gaussian. The hand methods here give estimates whose errors can be large, and fatigue predictions in particular can differ by a factor of ten or more depending on assumptions the data cannot settle. Equipment whose failure could cause harm must be analysed and tested by qualified people to the standards that apply to it.

Shaker testing uses large forces and electrical power, and test articles can break and release parts. Test laboratories manage those hazards under work health and safety law. This book teaches how to understand and calculate random vibration. It is educational and is not a design or a test specification for any product.
