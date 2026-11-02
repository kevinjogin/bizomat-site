---
title: "Eddy-Current Inspection by the Numbers"
subtitle: "Conductivity, coating thickness, cracks, sorting and tube testing, with the statistics that make each result a decision"
description: "How eddy-current testing works and how to use it with numbers: penetration depth, conductivity and temper, coating thickness, cracks, sorting, tubes, thresholds and records."
category: Manufacturing
tags: [quality, manufacturing, validation]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-11-01
referencesChecked: 2026-11-01
edition: "1"
level: "Intermediate manufacturing quality and inspection engineering"
audience: "Quality engineers, inspection technicians, manufacturing engineers and supplier quality staff who specify, run, audit or act on eddy-current tests of metal parts, coatings and tubes."
outcomes:
  - "Explain how a coil's impedance responds to a metal's conductivity, permeability, distance and flaws, and read an impedance-plane display."
  - "Choose a test frequency from the standard depth of penetration for conductivity, coating, crack and tube tests."
  - "Use conductivity and coating thickness measurements to check temper and anodising, with calibration, gauge studies and temperature correction."
  - "Set up crack detection, steel sorting and tube testing with reference standards, scan plans and thresholds that balance false calls and misses."
  - "Turn readings into acceptance decisions with sampling plans, capability bounds, outlier checks and a written procedure and record."
coverVariant: category
references:
  - title: "Electrodynamics of Solids: Optical Properties of Electrons in Matter"
    creator: "M. Dressel and G. Grüner, Cambridge University Press"
    year: "2002"
    note: "Copyright work, used only as a map of ideas: the skin effect and its dependence on frequency and conductivity, the surface impedance of a conductor, the free-electron picture of conductivity and scattering, and the description of resonant circuits and their losses. No text, equations as set out there, figures or problems are reproduced, and all cases and calculations are KEVOS® originals."
  - title: "Fundamentals of Eddy Current Testing"
    creator: "D. J. Hagemaier, American Society for Nondestructive Testing"
    year: "1990"
    note: "Background for coils and probes, the impedance plane, standard depth of penetration, conductivity and coating measurement, and reference standards, used throughout."
  - title: "Introduction to Electromagnetic Nondestructive Test Methods"
    creator: "H. L. Libby, Wiley-Interscience"
    year: "1971"
    note: "Background for the coupled-circuit model of a probe and test part used in Chapter 1, and for encircling-coil testing of tubes and bars in Chapter 8."
  - title: "NIST/SEMATECH e-Handbook of Statistical Methods"
    creator: "National Institute of Standards and Technology"
    year: "2012"
    url: "https://www.itl.nist.gov/div898/handbook/"
    note: "Background for the calibration, gauge, tolerance interval, capability, outlier and sampling methods used in Chapters 3 to 9 and in the KEVOS® tools linked from them."
related:
  - title: "Induction Hardening by the Numbers"
    href: "/reados/publications/induction-hardening-by-the-numbers/"
  - title: "Electroplating by the Numbers"
    href: "/reados/publications/electroplating-by-the-numbers/"
  - title: "Testing Welded Joints by the Numbers"
    href: "/reados/publications/testing-welded-joints-by-the-numbers/"
  - title: "Control Charts by the Numbers"
    href: "/reados/publications/control-charts-by-the-numbers/"
  - title: "Measurement system analysis for manufacturers"
    href: "/reados/collections/manufacturing-quality/measurement-system-analysis-for-manufacturers/"
---

## About this book

Pass an alternating current through a coil and hold it near a metal, and the coil's magnetic field induces circulating currents in the metal: eddy currents. They flow in a layer near the surface, and they push back on the coil, changing its impedance. Anything that changes how easily the currents flow, or where they can flow, changes that impedance: the metal's conductivity and magnetic permeability, the distance between coil and metal, the thickness of the part and any crack across the currents' path. Measuring the change lets an inspector check a heat treatment, measure a coating, find a crack or sort mixed parts, in seconds, without touching or marking the part.

This book shows how to use eddy-current testing with numbers. It starts with what the coil sees and how deep the currents reach, then works through conductivity and what it reveals about a metal, measuring it reliably, coating thickness, surface cracks, sorting steel parts and testing tubes. It finishes with the decisions: thresholds, false calls and missed defects, acceptance sampling and capability, and the procedure, people and records that make a test result trustworthy.

It is for quality engineers, inspection technicians, manufacturing engineers and supplier quality staff. It assumes engineering or trade training and comfort with basic electricity and statistics; the electromagnetism and the statistical methods are explained as they are used. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the KEVOS® tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one product line. This is an illustration. A maker of hydraulic gear pumps in Dandenong South, Victoria, builds the PH-6 pump family and uses eddy-current methods at three points:

- **Housings:** machined from 6061-T6 aluminium bar and sulfuric acid anodised to 15 to 25 µm. Each incoming bar's temper is checked by conductivity against the maker's band of 42.0 to 45.0 %IACS, and the anodising thickness is measured on every batch.
- **Drive shafts:** 42CrMo4 steel, induction hardened at the two bearing journals and ground. The journals are scanned for grinding cracks with a four-element surface probe, and every shaft passes a comparator coil that sorts out any whose journals missed hardening.
- **Oil cooler:** built in-house from 90/10 copper-nickel tubes 12.7 mm in diameter with 1.0 mm walls, bought in lots of 2,000. The tube maker tests every tube with an encircling coil, and the pump maker audits the records and samples the tubes on its own test bench.

Conductivity bands, readings, signal amplitudes, noise levels, prices and test results are the pump maker's working figures or are calculated from stated assumptions. They do not describe KEVOS® work or any real business, instrument maker, material supplier or customer. Material properties are typical values for illustration; real acceptance limits come from the material and product specifications a customer calls up. Prices are in Australian dollars excluding GST.

## How to use the book

Read Chapters 1 and 2 first: they explain the coil's response and the depth of penetration, which every later chapter uses. Chapters 3 and 4 go together on conductivity. Chapters 5 to 8 can then be read in any order. Chapter 9 brings the statistical decisions together, and Chapter 10 the procedure, records and cost.

Every calculation in the book was checked by running it, and the KEVOS® tools linked from each chapter were checked against the calculations they perform. Where a tool was built for a different purpose but does one step of a chapter's calculation, such as the induction hardening plan's reference depth, the chapter says which output is used and which are not.

## Source limits and professional responsibility

This book is educational. Eddy-current testing of safety-critical parts, pressure equipment and aircraft is governed by product standards, customer specifications and written procedures, and is performed and interpreted by personnel certified for the method. The book names the standards that apply to its examples by number and scope only; it does not reproduce their requirements, and they must be read in full before use. Decisions about real parts remain with the competent people responsible for them.
