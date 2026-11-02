---
title: "Production Leak Testing by the Numbers"
subtitle: "Leak rates and units, flow through leaks, pressure decay, temperature, tracer gases, the helium detector, reject limits, capability and cost"
description: "How to specify, test and control leak-tightness in production, from leak rate units and pressure decay to helium tracer testing, reject limits, capability and cost, worked with numbers."
category: Manufacturing
tags: [quality, manufacturing, validation, process-improvement]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-11-03
referencesChecked: 2026-11-03
edition: "1"
level: "Intermediate manufacturing, quality and test engineering"
audience: "Manufacturing, quality and test engineers, product designers, buyers and production supervisors who specify leak-tightness, choose leak test methods, set reject limits or run leak test stations."
outcomes:
  - "State a leak specification in consistent units, relate it to the product's function, and convert between pressure–volume, volume and mass units."
  - "Explain how gas flows through real leaks, why different gases and pressures change the rate, and what that means for converting a test result to service conditions."
  - "Design a pressure decay or flow test, predict its signal and its temperature error, and decide when it cannot reach the specification."
  - "Explain how tracer gas methods and the helium mass spectrometer work, and choose between sniffing, accumulation and vacuum chamber testing."
  - "Set reject limits with calibrated leaks and uncertainty, monitor the station's capability, and compare methods on cycle time and cost."
coverVariant: category
references:
  - title: "Introduction to Plasma Physics: A Graduate Level Course"
    creator: "R. Fitzpatrick, University of Texas at Austin, lecture notes"
    year: "2006"
    note: "Copyright work, used only as a map of ideas: the gyration of charged particles in a magnetic field and its radius, ionisation and collisions in low-density gases. No text, equations as set out there, figures or problems are reproduced, and all cases and calculations are KEVOS® originals."
  - title: "Leak Testing, Nondestructive Testing Handbook, third edition, volume 1"
    creator: "C. N. Jackson Jr., C. N. Sherlock and P. O. Moore (technical editors), American Society for Nondestructive Testing"
    year: "1998"
    note: "Background for leak rate units, gas flow through leaks, pressure change and flow methods, tracer gas methods and helium mass spectrometer leak detectors used throughout."
  - title: "ISO 20484, Non-destructive testing — Leak testing — Vocabulary"
    creator: "International Organization for Standardization"
    year: "2017"
    note: "Named by number and scope only: terms and definitions for leak testing. Its definitions are not reproduced."
  - title: "ISO 20485 and ISO 20486, Non-destructive testing — Leak testing — Tracer gas method; Calibration of reference leaks for gases"
    creator: "International Organization for Standardization"
    year: "2017"
    note: "Named by number and scope only: tracer gas test techniques and the calibration of reference leaks. Their requirements are not reproduced and must be read in full."
  - title: "NIST/SEMATECH e-Handbook of Statistical Methods"
    creator: "National Institute of Standards and Technology"
    year: "2012"
    url: "https://www.itl.nist.gov/div898/handbook/"
    note: "Background for the gauge study, uncertainty, capability, control chart and sampling methods used in Chapters 8 and 9 and in the KEVOS® tools linked from them."
related:
  - title: "Vacuum by the Numbers"
    href: "/reados/publications/vacuum-by-the-numbers/"
  - title: "Brazing and Soldering by the Numbers"
    href: "/reados/publications/brazing-and-soldering-by-the-numbers/"
  - title: "Accept or Reject by the Numbers"
    href: "/reados/publications/accept-or-reject-by-the-numbers/"
  - title: "Control Charts by the Numbers"
    href: "/reados/publications/control-charts-by-the-numbers/"
  - title: "Pneumatics by the Numbers"
    href: "/reados/publications/pneumatics-by-the-numbers/"
---

## About this book

Nothing is perfectly leak-tight. Every joint, casting and seal passes some gas, and the question a manufacturer must answer is not whether a part leaks but whether it leaks more than its function can tolerate. A hydraulic oil cooler that passes a few cubic centimetres of air a day will never weep oil; one with a crack a fraction of a millimetre long will leave a puddle under the tractor. Leak testing turns that functional question into a number, measures each part against it, and does so fast enough to keep up with production.

This book shows how to do that with numbers. It starts with what a leak rate is and the units it is stated in, and how gas flows through the tiny channels that make up real leaks. It then works through the pressure decay test, its great enemy, temperature, and the flow and differential methods that improve on it. It explains tracer gas methods and the helium mass spectrometer detector, whose heart is an ion bent into a circle by a magnetic field. It finishes with the decisions: setting a reject limit with calibrated leaks and uncertainty, keeping the station capable over time, and choosing a method on cycle time and cost.

It is for manufacturing, quality and test engineers, product designers, buyers and production supervisors. It assumes engineering or trade training and comfort with the gas laws and basic statistics; the physics of flow and of the detector is explained as it is used. Each chapter works the running case with real numbers, includes a plausible mistake and how it was found, links the KEVOS® tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one product line. This is an illustration. A manufacturer in Ballarat, Victoria, brazes aluminium bar-and-plate oil coolers for agricultural machinery. Its OC-40 cooler carries hydraulic oil at up to 10 bar and must not weep oil over the tractor's life.

- **The part:** a vacuum-brazed aluminium core with two cast end tanks; oil-side internal volume 0.85 L; about 600 made per shift.
- **The specification:** the customer's drawing requires the oil side to leak no more than 1 × 10⁻³ mbar·L/s of air at 10 bar gauge.
- **The test line:** every cooler passes a pressure decay test with air at 6 bar gauge to catch gross leaks, then a helium test in an evacuated chamber, with the oil side filled with helium.
- **The people:** a test engineer who owns the two stations, production operators who run them, and a quality engineer who sets and audits the limits.

Volumes, pressures, leak rates, temperatures, cycle times, costs and results are the manufacturer's working figures or are calculated from stated assumptions. They do not describe KEVOS® work or any real manufacturer, customer, equipment maker or gas supplier. Prices are in Australian dollars excluding GST.

## How to use the book

Read Chapters 1 and 2 first: they define leak rates and explain the flow through leaks that every method depends on. Chapters 3 to 5 cover pressure-based methods and should be read in order. Chapters 6 and 7 cover tracer gases and the helium detector. Chapters 8 to 10 bring the decisions together: limits, capability and choosing a method.

Every calculation in the book was checked by running it, and the KEVOS® tools linked from each chapter were checked against the calculations they perform. Where a tool was built for a different purpose but does one step of a chapter's calculation, such as the closed gas vessel tool's pressure change with temperature, the chapter says which output is used.

## Source limits and professional responsibility

This book is educational. Leak testing of pressure equipment, gas-carrying and refrigeration components, medical devices and safety-related parts is governed by product standards, regulations and customer specifications that set their own methods, limits and records, and by the competent people responsible for them. Tracer gases are used under pressure and in enclosed spaces, and hydrogen mixtures need their own safety assessment. The book names the standards it refers to by number and scope only; they must be read in full before use.
