---
title: "Induction Hardening by the Numbers"
subtitle: "Reference depth, power and time, coils, steel, quenching, tempering, case depth traverses, distortion and process control for induction-hardened shafts"
description: "How induction hardening works and how to control it: frequency and the Curie point, power and heating time, coils, steel condition, quench and temper, case depth, cracking and charts."
category: Manufacturing
tags: [manufacturing, quality, process-improvement]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-31
referencesChecked: 2026-10-31
edition: "1"
level: "Intermediate heat treatment, manufacturing and quality engineering"
audience: "Manufacturing, process and quality engineers, heat treatment supervisors, laboratory technicians and designers who specify, run, check or buy induction-hardened shafts, journals and similar parts."
outcomes:
  - "Choose a frequency for a case depth from the hot reference depth, and explain why steel's heating depth jumps at its Curie point."
  - "Estimate the energy, power and heating time for a hardened layer, and understand how conduction, coupling and coil design change the result."
  - "Relate the case to the steel's carbon, starting condition and grain size, and keep the quench and temper within their proven limits."
  - "Measure effective case depth with valid Vickers indentations and interpolation, and recognise the causes of distortion and quench cracks."
  - "Control the process with heat monitoring, control charts and capability indices, and react correctly to a change."
coverVariant: category
references:
  - title: "Gauge Fields in Condensed Matter, Volume I: Superflow and Vortex Lines (Disorder Fields, Phase Transitions)"
    creator: "H. Kleinert, World Scientific, Singapore"
    year: "1989"
    note: "In copyright. Used only as a map for the physics behind Chapter 2: continuous phase transitions such as the loss of ferromagnetic order at the Curie point, and the penetration depth of fields into a superconductor as a relative of the electromagnetic reference depth. No text, equations, figures or problems are reproduced, and all cases and calculations are KEVOS® originals."
  - title: "Handbook of Induction Heating"
    creator: "V. Rudnev, D. Loveless, R. Cook and M. Black, Marcel Dekker"
    year: "2003"
    note: "Background for reference depth, the effect of the Curie point, frequency selection, coil design, coupling, scanning and quenching in Chapters 2 to 6."
  - title: "ASM Handbook, Volume 4C: Induction Heating and Heat Treatment"
    creator: "ASM International"
    year: "2014"
    note: "Background for induction hardening practice, steels, quenchants, tempering, residual stress, distortion and cracking in Chapters 4 to 9."
  - title: "Time-temperature relations in tempering steel"
    creator: "J. H. Hollomon and L. D. Jaffe, Transactions of the American Institute of Mining and Metallurgical Engineers, volume 162"
    year: "1945"
    note: "Source of the tempering parameter used in Chapter 7 to compare times and temperatures."
  - title: "ISO 3754 Steel — Determination of effective depth of hardening after flame or induction hardening"
    creator: "International Organization for Standardization"
    year: "1976"
    note: "Named by number and scope only in Chapter 8. The case's 500 HV1 limit is the case drawing's own definition, not a value quoted from the standard."
  - title: "ISO 6507-1 Metallic materials — Vickers hardness test — Part 1: Test method"
    creator: "International Organization for Standardization"
    year: "2018"
    note: "Named by number and scope as the test method behind the Vickers validity rules in Chapters 1 and 8. The rule values used are the case laboratory's settings in the WORKOS tool, not quotations from the standard."
  - title: "Model Code of Practice: Managing the risks of plant in the workplace"
    creator: "Safe Work Australia"
    year: "2022"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-plant-workplace"
    note: "Named in Chapters 1 and 6 for the duty to manage the risks of plant, including induction machines, quench systems and ovens, under the model WHS laws."
related:
  - title: "Diffusion by the Numbers"
    href: "/reados/publications/diffusion-by-the-numbers/"
  - title: "Heating and Cooling Times by the Numbers"
    href: "/reados/publications/heating-and-cooling-times-by-the-numbers/"
  - title: "Industrial Electric Heating by the Numbers"
    href: "/reados/publications/industrial-electric-heating-by-the-numbers/"
  - title: "Control Charts by the Numbers"
    href: "/reados/publications/control-charts-by-the-numbers/"
---

## About this book

Induction hardening puts a hard, wear-resistant case on a steel part in seconds, by inducing currents in its surface, heating that surface above its hardening temperature and quenching it, while the core stays tough. It is fast, clean and precise, and it is unforgiving: a few seconds' difference in time, a millimetre in the coil's position, a different delivery of steel or a warm quench bath can change the case without anything visible on the part.

This book follows one induction-hardened journal through every stage. It starts with the electromagnetics, the reference depth and its jump at the steel's Curie point, then sets the power and heating time, the coil and its coupling, the steel's response, the quench and the temper. It then covers how the case is measured, why hardened parts distort and crack and how to prevent it, and how the whole process is held steady in production.

It is for manufacturing, process and quality engineers, heat treatment supervisors, laboratory technicians and the designers and buyers of induction-hardened parts. It assumes school physics and algebra. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the WORKOS tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one part. This is an illustration. A drive-line manufacturer in Dandenong, Victoria, induction hardens the bearing journal of the IH-40 drive shaft.

- **Shaft:** 400 mm long, 40 mm journal, 3.95 kg, a 0.45% carbon steel of the 1045 type, bought as normalised bar at 180 to 230 HB.
- **Case:** a 100 mm journal hardened to 600 to 720 HV1 at the surface, with an effective case depth of 2.0 to 3.0 mm to 500 HV1, stopping 5 mm short of the shoulder fillet.
- **Equipment:** a 30 kHz, 80 kW generator, a single-shot coil with an integral spray quench, a 2,000 L polymer quench tank with a 10 kW chiller, and tempering ovens running 2 hours at 180 °C.
- **Production:** 120 shafts an hour, with one section per shift for case depth.

Resistivities, permeabilities, efficiencies, energies, test results, prices and times are the case manufacturer's working figures or are calculated from stated assumptions. They do not describe KEVOS® work or any real business, machine maker or steel supplier's data.

## How to use the book

Read Chapters 1 to 3 first: they set out the process, the reference depth and the energy that every later chapter uses. Chapters 4 to 7 cover the coil, the steel, the quench and the temper and can be read in any order. Chapter 8 covers measurement, Chapter 9 distortion and cracking, and Chapter 10 control in production.

Every calculation in the book was checked by running it, and the WORKOS tools linked from each chapter were checked against the calculations they perform. The formulas, reference depth, layer heat balances, interpolation and control chart arithmetic, are sound starting points; sectioned parts are the final word on every recipe.

## Source limits and professional responsibility

This book is educational. Its methods give first estimates of frequency, energy, quench and temper loads and show how case depth is measured and controlled; real recipes are proved by sectioned parts, hardness traverses and crack testing against the customer's specification, and steel data come from the supplier and the applicable standards. Induction machines carry high currents and voltages, strong magnetic fields, hot parts and quench spray, and must be guarded, interlocked and operated under a safe system of work as the model WHS laws require; people with active medical implants should get medical advice before working near them. Decisions about real parts and processes remain with the competent people responsible for them.
