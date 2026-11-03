---
title: "Insulation Testing by the Numbers"
subtitle: "Insulators and dielectrics, insulation resistance, polarisation index, moisture, dielectric loss, partial discharge, thermal ageing and a test program"
description: "How to test and judge the insulation of motor windings, from why insulators insulate to insulation resistance, polarisation index, tan delta, partial discharge and ageing, worked with numbers."
category: Engineering
tags: [operations, quality, systems, process-improvement]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-11-03
referencesChecked: 2026-11-03
edition: "1"
level: "Intermediate electrical, maintenance and reliability engineering"
audience: "Electricians, electrical and reliability engineers, maintenance planners, motor rewinders and plant managers who test, interpret or pay for the testing of motor and generator windings."
outcomes:
  - "Explain why insulating materials insulate, how they polarise, and why their resistance depends so strongly on temperature, moisture and contamination."
  - "Plan and carry out an insulation resistance test safely, correct the reading for temperature and identify what else was in the circuit."
  - "Calculate and interpret the polarisation index and dielectric absorption ratio, and know when they mean little."
  - "Explain what capacitance, tan delta and partial discharge tests reveal that a DC test cannot, including the surges an inverter puts on a motor."
  - "Estimate how temperature shortens insulation life, and run a test program whose decisions are worth more than it costs."
coverVariant: category
references:
  - title: "Introduction to Solid State Physics"
    creator: "C. Kittel, John Wiley & Sons"
    year: "1996"
    note: "Seventh edition. Copyright work, used only as a map of ideas: energy bands and the band gap, dielectrics, polarisability and the local field, and dielectric relaxation. No text, equations as set out there, figures or problems are reproduced, and all cases and calculations are KEVOS® originals."
  - title: "Electrical Insulation for Rotating Machines: Design, Evaluation, Aging, Testing, and Repair"
    creator: "G. C. Stone, I. Culbert, E. A. Boulter and H. Dhirani, Wiley-IEEE Press"
    year: "2014"
    note: "Second edition. Background for winding insulation systems, the thermal, electrical, ambient and mechanical ageing stresses, and the off-line and on-line tests described in Chapters 1 and 4 to 10."
  - title: "IEEE Std 43, IEEE Recommended Practice for Testing Insulation Resistance of Electric Machinery"
    creator: "Institute of Electrical and Electronics Engineers"
    year: "2013"
    note: "Named by number and scope only: insulation resistance and polarisation index testing of rotating machine windings. Listed by IEEE as inactive-reserved since 2024; its test voltages, minimum values and correction methods are not reproduced and must be read in full."
  - title: "IEC 60085, Electrical insulation — Thermal evaluation and designation"
    creator: "International Electrotechnical Commission"
    year: "2007"
    note: "Named by number and scope only: the thermal classes of electrical insulation, such as 130 (B), 155 (F) and 180 (H), used in Chapter 9."
  - title: "AS/NZS 4836, Safe working on or near low-voltage and extra-low voltage electrical installations and equipment"
    creator: "Standards Australia and Standards New Zealand"
    year: "2023"
    note: "Named by number and scope only, as the Australian and New Zealand standard for safe work on low-voltage installations; its requirements are not reproduced."
  - title: "NIST/SEMATECH e-Handbook of Statistical Methods"
    creator: "National Institute of Standards and Technology"
    year: "2012"
    url: "https://www.itl.nist.gov/div898/handbook/"
    note: "Background for the constant failure rate bounds, Weibull analysis and control charts used in Chapters 1, 6 and 9."
related:
  - title: "Distribution Transformers by the Numbers"
    href: "/reados/publications/distribution-transformers-by-the-numbers/"
  - title: "Variable Speed Drives by the Numbers"
    href: "/reados/publications/variable-speed-drives-by-the-numbers/"
  - title: "Accelerated Life Testing by the Numbers"
    href: "/reados/publications/accelerated-life-testing-by-the-numbers/"
  - title: "Condensation Control by the Numbers"
    href: "/reados/publications/condensation-control-by-the-numbers/"
  - title: "Vibration Monitoring by the Numbers"
    href: "/reados/publications/vibration-monitoring-by-the-numbers/"
---

## About this book

Every motor, generator, transformer and cable depends on a thin layer of insulation that keeps current in the copper and out of the iron. That insulation ages. Heat slowly breaks down its resins, moisture and dirt open leakage paths across its surfaces, voltage surges discharge inside its voids, and vibration and thermal cycling crack it. When it finally fails, the result is a short circuit to earth, a burnt winding and a machine out of service, often without much warning to the people who run it.

Insulation tests give that warning. A DC insulation resistance test, the most common electrical maintenance test of all, measures how well the insulation blocks a steady current. The polarisation index compares readings over ten minutes to separate a clean, dry winding from a damp or dirty one. Capacitance and dissipation factor tests measure how the insulation behaves under alternating voltage, and partial discharge tests detect the small sparks inside voids that slowly erode it. Read with an understanding of what each test can and cannot see, they let a maintenance team dry, clean, repair or replace a winding before it fails.

This book shows how to use those tests with numbers. It starts with why insulation fails and why insulating materials insulate at all, then covers polarisation, the insulation resistance test, the polarisation index, moisture and temperature, dielectric loss, partial discharge and the surges from variable speed drives, thermal ageing, and finally running a test program and judging what it is worth.

It is for electricians, electrical and reliability engineers, maintenance planners, motor rewinders and plant managers. It assumes trade or engineering training and comfort with basic electrical theory; the physics of insulators is explained as it is used. Each chapter works the running case with real numbers, includes a plausible mistake and how it was found, links the KEVOS® tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one site. This is an illustration. A cold store near Wagga Wagga, New South Wales, holds frozen and chilled food for regional distribution. Its ammonia refrigeration plant runs around the clock, and its electrical maintenance team tests the insulation of the plant's motors:

- **C-1 and C-2, the screw compressor motors:** 315 kW, 3.3 kV, two-pole machines with form-wound stators insulated with mica tape and epoxy resin, thermal class 155 (F). C-1 runs most of the year; C-2 shares the load in summer.
- **EF-01 to EF-24, the evaporator fan motors:** 2.2 kW, 415 V, random-wound motors with enamelled wire, four of them in the two blast freezers and twenty in six storage rooms held at about −25 °C, with regular defrost cycles.
- **CF-1 to CF-6, the condenser fan motors:** 7.5 kW, 415 V motors on the roof, each driven by a variable speed drive in the plant room about 60 metres away.

The site tests its 3.3 kV motors at 2,500 V DC and its 415 V motors at 500 V DC under its own procedure. Readings, sizes, material properties, costs and results are the site's working figures or are calculated from stated assumptions. They do not describe KEVOS® work or any real cold store, motor maker, rewinder or service company. Material properties are typical values chosen for illustration and should be taken from manufacturers' data and measurements for real work. Prices are in Australian dollars excluding GST.

## How to use the book

Read Chapters 1 to 3 first: they set out why insulation fails, why it insulates and how it polarises, which every later chapter uses. Chapters 4 to 6 cover the DC tests and the effects of temperature and moisture. Chapters 7 and 8 cover the AC tests and partial discharge. Chapter 9 covers thermal ageing and life, and Chapter 10 brings the program and its cost together.

Every calculation in the book was checked by running it, and the KEVOS® tools linked from each chapter were checked against the calculations they perform. Where a tool was built for a different purpose but does one step of a chapter's calculation, the chapter says which output is used.

## Source limits and professional responsibility

This book is educational. Test voltages, acceptance values and correction methods for real machines come from standards such as IEEE Std 43 and from machine makers, which the book names by number and scope only; their values are not reproduced. Where the book uses acceptance criteria, they are the site's own illustrative criteria and are labelled as such.

Insulation tests apply high voltages, and a tested winding stores enough charge to injure. Testing must be done only by competent people under the site's safe work procedures, isolation and permit rules and, for low-voltage work in Australia and New Zealand, the requirements of AS/NZS 4836; high-voltage machines need the site's high-voltage rules as well. Decisions to energise, repair or replace real machines remain with the competent people responsible for them.
