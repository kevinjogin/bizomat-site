---
title: "Metal Casting by the Numbers"
subtitle: "Melting, charge blending, patterns, gating, solidification, risers, gas and grain, heat treatment and inspection for sand castings"
description: "How a sand casting is made right: melt energy and cycle, charge blending, pattern allowances, gating, Chvorinov's rule, riser feeding, gas and grain, T6 heat treatment and Brinell checks."
category: Manufacturing
tags: [manufacturing, quality, process-improvement]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-31
referencesChecked: 2026-10-31
edition: "1"
level: "Intermediate foundry, manufacturing and quality engineering"
audience: "Foundry engineers and supervisors, patternmakers, manufacturing and quality engineers, and designers and buyers of castings who want to understand how a sound casting is planned, made and proved."
outcomes:
  - "Work out the energy, time and cost of a melt, the furnace's cycle and output per shift, and the energy behind each casting."
  - "Blend charge materials to a target composition allowing for melt loss, and size a pattern with machining and shrinkage allowances."
  - "Size a gating system for a pouring time and a safe gate velocity, and predict freezing order with the casting modulus and Chvorinov's rule."
  - "Design risers that pass both the modulus and feed-volume checks, and tell gas porosity from shrinkage porosity at the furnace and in a section."
  - "Plan solution, quench and ageing loads, and prove castings with valid Brinell tests, radiography, pressure tests and records."
coverVariant: category
references:
  - title: "Gauge Fields in Condensed Matter, Volume I: Superflow and Vortex Lines (Disorder Fields, Phase Transitions)"
    creator: "H. Kleinert, World Scientific, Singapore"
    year: "1989"
    note: "In copyright. Used only as a map for the physics behind Chapters 1 and 8: the difference between first-order transitions with latent heat, such as freezing, and the continuous transitions the book treats, and the role of nucleation and order. No text, equations, figures or problems are reproduced, and all cases and calculations are KEVOS® originals."
  - title: "Theorie der Erstarrung von Gußstücken"
    creator: "N. Chvorinov, Die Giesserei, volume 27"
    year: "1940"
    note: "Named in Chapter 6 as the origin of the rule that solidification time is proportional to the square of the casting modulus."
  - title: "Complete Casting Handbook: Metal Casting Processes, Metallurgy, Techniques and Design"
    creator: "J. Campbell, Butterworth-Heinemann"
    year: "2011"
    note: "Background for filling, oxide films and the double-film mechanism, gate velocities, feeding and hydrogen porosity in aluminium alloys in Chapters 5, 7 and 8."
  - title: "ASM Handbook, Volume 15: Casting"
    creator: "ASM International"
    year: "2008"
    note: "Background for melting, patternmaking allowances, gating and risering practice, grain refinement, modification and heat treatment of aluminium castings in Chapters 2 to 9."
  - title: "ASTM E155 Standard Reference Radiographs for Inspection of Aluminum and Magnesium Castings"
    creator: "ASTM International"
    year: "2020"
    note: "Named by number and scope only in Chapter 10 as an example of reference radiographs used to grade casting radiographs. No image or severity level from it is quoted."
  - title: "ISO 6506-1 Metallic materials — Brinell hardness test — Part 1: Test method"
    creator: "International Organization for Standardization"
    year: "2014"
    note: "Named by number and scope only in Chapter 10 as the test method standard behind the Brinell validity rules. The rule values in the case are the case foundry's settings in the WORKOS tool, not quotations from the standard."
  - title: "Model Code of Practice: Managing the risks of plant in the workplace"
    creator: "Safe Work Australia"
    year: "2022"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-plant-workplace"
    note: "Named in Chapters 2 and 9 for the duty to manage the risks of plant, including furnaces, cranes and quench tanks, under the model WHS laws."
related:
  - title: "Heating and Cooling Times by the Numbers"
    href: "/reados/publications/heating-and-cooling-times-by-the-numbers/"
  - title: "Microstructures by the Numbers"
    href: "/reados/publications/microstructures-by-the-numbers/"
  - title: "Industrial Electric Heating by the Numbers"
    href: "/reados/publications/industrial-electric-heating-by-the-numbers/"
---

## About this book

A casting is decided in the few minutes it takes metal to fill a mould and freeze. Whether it comes out sound, the right size and the right strength depends on decisions made long before: how the metal was melted and alloyed, how big the pattern was made, how the gating brings the metal in, which parts freeze last and whether a riser feeds them, whether the melt carried gas, and how the casting was heat treated. Each of those decisions has a few numbers behind it, and most foundry defects can be traced to one of them being wrong.

This book works through those numbers, stage by stage, for one aluminium sand casting. It starts with the physics of freezing: latent heat, freezing range and the three stages of shrinkage. It then follows the casting from the furnace, through charge blending, patternmaking, gating, solidification and feeding, to the melt-quality problems that feeding cannot cure, heat treatment and final inspection.

It is for foundry engineers and supervisors, patternmakers, manufacturing and quality engineers, and the designers and buyers who specify castings. It assumes school physics and algebra. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the WORKOS tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one casting. This is an illustration. A jobbing foundry in Ballarat, Victoria, makes GB-12, a gearbox cover for a machinery builder.

- **Alloy and temper:** an aluminium–silicon–magnesium casting alloy of the Al–7Si–0.35Mg type, heat treated to T6.
- **Casting:** finished envelope 300 × 200 × 100 mm, 6 mm walls and a heavy bearing boss; 6.68 kg as cast; 12.1 kg poured per mould with two risers and the gating, a yield of 55%.
- **Melting:** a 100 kW electric crucible furnace melting 150 kg charges of returns and new ingot.
- **Production:** 60 castings a shift, sand moulded with a resin-bonded core, solution treated, quenched and aged in batches of 40.
- **Specification:** 75 to 95 HBW after heat treatment, sound bearing boss, pressure-tight walls.

Temperatures, properties, constants, efficiencies, prices, test results and times are the case foundry's working figures or are calculated from stated assumptions. They do not describe KEVOS® work or any real foundry, customer or alloy supplier's data.

## How to use the book

Read Chapter 1 first: freezing, latent heat and shrinkage underlie every later chapter. Chapters 2 and 3 cover the melt; Chapters 4 to 7 the mould, from pattern to risers, and are best read in order; Chapter 8 covers the defects that come from the melt; Chapters 9 and 10 cover heat treatment and inspection.

Every calculation in the book was checked by running it, and the WORKOS tools linked from each chapter were checked against the calculations they perform. The methods are the classical ones of foundry practice: Bernoulli for gating, Chvorinov for freezing time, feed-volume and modulus checks for risers. They are sound first estimates and teaching tools; trial castings, sections and simulation decide the real design.

## Source limits and professional responsibility

This book is educational. Its methods estimate melt energy, allowances, gating, freezing and feeding for ordinary sand castings, and each chapter says where they stop being reliable. Real castings are proved by trial, sectioning, radiography and testing against the customer's specification, and alloy data, heat-treatment procedures and inspection rules come from the alloy supplier, the applicable standards and the customer. Molten metal, furnaces, quench tanks and lifting are serious hazards, managed under the model WHS laws by competent people. Decisions about real castings and foundry operations remain with those responsible for them.
