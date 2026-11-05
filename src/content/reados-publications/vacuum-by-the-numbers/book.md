---
title: "Vacuum by the Numbers"
subtitle: "Molecules, mean free path, conductance, pumps, pump-down, vapour, leaks and gauges, worked through one degassing chamber with kinetic theory"
description: "Size, run and check an industrial vacuum system with numbers: gas quantity, molecular flux, flow regimes, conductance, pumping speed, pump-down time, gas loads, leaks and gauges."
category: Engineering
tags: [manufacturing, design, quality]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-27
referencesChecked: 2026-10-27
edition: "1"
level: "Intermediate engineering physics for production equipment"
audience: "Production and process engineers, maintenance technicians, equipment buyers and technical students who specify, run or troubleshoot vacuum chambers, pumps and leak tests in factories and workshops."
outcomes:
  - "State vacuum in absolute units and calculate how much gas a chamber holds at any pressure."
  - "Use kinetic theory to find molecular speeds, wall flux and mean free path, and tell which flow regime a line is in."
  - "Calculate the conductance of orifices and tubes and the effective pumping speed at the chamber."
  - "Estimate pump-down time, ultimate pressure and the gas loads from vapour, outgassing and leaks."
  - "Choose gauges and leak tests that suit the pressure and gas, and specify a vacuum system safely."
coverVariant: category
references:
  - title: "Fundamentals of Statistical and Thermal Physics"
    creator: "F. Reif, McGraw-Hill"
    year: "1965"
    note: "Supplied source, in copyright. Read as a subject map for the kinetic theory of dilute gases, molecular flux and effusion, mean free path, viscosity and its independence of pressure, and phase equilibrium. No text, derivations as set out, figures, tables or problems are reproduced; the treatment, case, numbers and exercises in this book are its own."
  - title: "Thermophysical Properties of Fluid Systems, NIST Chemistry WebBook, SRD 69"
    creator: "E. W. Lemmon, M. O. McLinden and D. G. Friend, National Institute of Standards and Technology"
    year: "2026"
    url: "https://webbook.nist.gov/chemistry/fluid/"
    note: "Source of the nitrogen viscosity at 20 °C used for mean free path and viscous conductance (17.56 µPa·s at 100 Pa and 17.57 µPa·s at 0.1 MPa), and of the saturation pressure of water used in Chapter 7. Values retrieved on the date checked."
  - title: "CODATA value: Boltzmann constant"
    creator: "National Institute of Standards and Technology"
    year: "2019"
    url: "https://physics.nist.gov/cgi-bin/cuu/Value?k"
    note: "The exact SI value of the Boltzmann constant, 1.380649 × 10⁻²³ J/K, used in every molecular calculation."
  - title: "AS 1210 Pressure vessels"
    creator: "Standards Australia"
    year: "edition as called up"
    note: "Named by number and scope as the Australian standard for pressure vessel design, which covers vessels under external pressure such as vacuum chambers. No values are quoted from it."
related:
  - title: "Pneumatics by the Numbers"
    href: "/reados/publications/pneumatics-by-the-numbers/"
  - title: "Thermal Expansion by the Numbers"
    href: "/reados/publications/thermal-expansion-by-the-numbers/"
  - title: "Industrial Gases by the Numbers"
    href: "/reados/publications/industrial-gases-by-the-numbers/"
---

## About this book

A vacuum is not empty space. A chamber pumped down to a few hundred pascals still holds around ten thousand million million million molecules, every one of them flying about at an average of some 470 metres a second and colliding with others more than ten million times a second. What changes as the pressure falls is not that the gas disappears but how it behaves: how far each molecule travels between collisions, whether the gas flows through a pipe like a fluid or drifts through it one molecule at a time, how quickly a pump can catch it, and how much the walls, the work and the leaks give off. Those behaviours are what make vacuum work predictable, and they all follow from the kinetic theory of gases.

This book works through vacuum with numbers. It starts with how to state a vacuum and how much gas is left, then uses kinetic theory to find molecular speeds, wall flux and mean free path, and from them the flow regimes, the conductance of lines, the speed of pumps and the time to pump down. It then deals with the gas loads that set the pressure a system can reach, water vapour, outgassing and leaks, with leak testing, with gauges, and finally with safety and specifying a system. Each chapter follows one running case, includes a plausible mistake and how it was found, and ends with an exercise and its worked answer.

It is for production and process engineers, maintenance technicians, equipment buyers and technical students who work with vacuum chambers, degassing, drying, vacuum lifting and leak testing. It assumes school algebra and physics; the kinetic theory is built up from there. Ultra-high vacuum, plasma and thin-film processes are outside its scope.

## The running case

Every chapter follows one fictional chamber. This is an illustration. A maker of outdoor electronic sensors pots its circuit boards in two-part epoxy, and the mixed resin must be degassed before it is poured, or trapped air leaves voids that let moisture in. The shop's degassing chamber, VC-200, is a stainless steel vessel of **200 litres**, 0.2 m³, with a 400 × 400 mm hinged door carrying a glass viewport. It is pumped by a two-stage oil-sealed rotary vane pump rated at **16 m³/h** through **1.5 m of 25 mm bore hose**. The process degasses each batch of about 6 kg of mixed resin at **200 Pa**, absolute, for ten minutes, and the whole cycle must fit in twenty minutes.

The gas is treated as nitrogen at 20 °C for the molecular calculations, which is how vacuum gauges and pump ratings are usually stated, and close to air. The sensor maker, the chamber, its pump and its problems are invented. None describes BIZOMAT work or a real business.

## How to use the book

Read Chapters 1 to 3 first: they set out the units, the molecular picture and the flow regimes, which every later chapter uses. Chapters 4 to 6 deal with moving gas out, Chapters 7 and 8 with the gas that keeps coming in, and Chapters 9 and 10 with measurement, safety and the specification. Every calculation was checked by running it, and values are given to more figures than a shop needs so that the arithmetic can be followed.

## Source limits and professional responsibility

The physics in this book is standard kinetic theory, and the property data come from NIST. The pump ratings, outgassing rates, leak rates and prices in the running case are illustrations; real systems are specified from makers' data and measured. A vacuum chamber carries the full force of the atmosphere on its walls, door and windows, and pumps can release oil mist and process vapours: chambers are designed and certified under the applicable Australian pressure equipment standards and work health and safety law, and qualified review governs real work. This book teaches how vacuum systems behave and how to check them. It is not a design for any vessel or installation.
