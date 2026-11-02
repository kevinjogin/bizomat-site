---
title: "Plain Bearings by the Numbers"
subtitle: "Oil films, unit load, friction, film thickness, clearance, heat, oil supply, thrust pads, materials and failures, worked through one fan's sleeve bearings"
description: "Design and check oil-lubricated plain bearings: film formation, PV, Petroff friction, Sommerfeld number and film thickness, clearance, heat balance, oil supply, thrust pads and failures."
category: Engineering
tags: [design, operations, quality, validation]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-31
referencesChecked: 2026-10-31
edition: "1"
level: "Intermediate mechanical and reliability engineering"
audience: "Mechanical, reliability and maintenance engineers, machine designers, fitters and students who specify, check, rebuild or troubleshoot sleeve bearings, bushes and thrust pads in fans, pumps, motors, compressors and gearboxes."
outcomes:
  - "Explain how a converging oil film carries load, and tell boundary, mixed and full-film lubrication apart."
  - "Check a bush by unit load, sliding speed and PV, and calculate a journal bearing's Petroff friction and power loss."
  - "Find a journal bearing's eccentricity, minimum film thickness and attitude angle from its Sommerfeld number with the short-bearing solution."
  - "Choose a clearance and an oil grade, and find the bearing's running temperature from its heat balance."
  - "Size the oil supply and a thrust bearing, judge start-up and materials, and diagnose common plain bearing failures, including oil whirl."
coverVariant: category
references:
  - title: "Statistical Physics"
    creator: "A. Isihara, Academic Press, New York and London"
    year: "1971"
    note: "In copyright. Used only as a map of the physics of viscosity as a transport coefficient, which Chapter 1 summarises; the bearing theory comes from the other sources listed. No text, structure, figures, tables or problems are reproduced."
  - title: "On the theory of lubrication and its application to Mr. Beauchamp Tower's experiments, including an experimental determination of the viscosity of olive oil"
    creator: "O. Reynolds, Philosophical Transactions of the Royal Society of London 177, 157–234"
    year: "1886"
    url: "https://doi.org/10.1098/rstl.1886.0005"
    note: "Named in Chapter 1 as the origin of the theory of the hydrodynamic oil film, the converging wedge and the equation now named after Reynolds."
  - title: "Analytical Derivation and Experimental Evaluation of Short-Bearing Approximation for Full Journal Bearings (NACA Report 1157)"
    creator: "G. B. DuBois and F. W. Ocvirk, National Advisory Committee for Aeronautics"
    year: "1953"
    url: "https://ntrs.nasa.gov/citations/19930092184"
    note: "Public domain. Source of the short-bearing relations used in Chapters 3 to 9: the capacity number, eccentricity ratio, attitude angle, friction ratio to the Petroff value, required side flow and peak film pressure, and of the authors' statement that the approximation suits bearings with length-to-diameter ratios up to about 1. All case values were calculated by KEVOS® from these relations; no charts or data are reproduced."
  - title: "Fundamentals of Fluid Film Lubrication (NASA Reference Publication 1255)"
    creator: "B. J. Hamrock, National Aeronautics and Space Administration"
    year: "1991"
    url: "https://ntrs.nasa.gov/citations/19910021217"
    note: "Public domain. Named in the introduction as a comprehensive text for readers who want the full theory of journal, thrust and rolling-element lubrication. Not quoted."
  - title: "First report on friction experiments (friction of lubricated bearings)"
    creator: "B. Tower, Proceedings of the Institution of Mechanical Engineers"
    year: "1883"
    note: "Named in Chapter 1 for the experiments in which an oil hole drilled in the loaded zone of a bearing revealed the film pressure that Reynolds then explained."
  - title: "Die wesentlichen Eigenschaften der Gleit- und Rollenlager"
    creator: "R. Stribeck, Zeitschrift des Vereines Deutscher Ingenieure 46"
    year: "1902"
    note: "Named in Chapter 1 as the origin of the friction curve now named after Stribeck. The curve in the book is a qualitative sketch, not his data."
  - title: "ISO 7902, Hydrodynamic plain journal bearings under steady-state conditions: circular cylindrical bearings"
    creator: "International Organization for Standardization"
    year: "current edition"
    note: "Named by number and scope in Chapter 4 as the standard calculation procedure for full journal bearings, to be used for final design in place of the short-bearing estimates. No values are reproduced."
  - title: "Model Code of Practice: Managing the risks of plant in the workplace"
    creator: "Safe Work Australia"
    year: "current edition"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-plant-workplace"
    note: "Cited in the introduction and Chapter 10 as the national guidance on managing plant hazards, including isolation of rotating machinery before bearings are inspected."
related:
  - title: "Fits That Work"
    href: "/reados/publications/fits-that-work/"
  - title: "Vibrating Machine Elements by the Numbers"
    href: "/reados/publications/vibrating-machine-elements-by-the-numbers/"
  - title: "Gears by the Numbers"
    href: "/reados/publications/gears-by-the-numbers/"
  - title: "Heat Transfer by the Numbers"
    href: "/reados/publications/heat-transfer-by-the-numbers/"
  - title: "Machine Part Repairs by the Numbers"
    href: "/reados/publications/machine-part-repairs-by-the-numbers/"
---

## About this book

A plain bearing is a shaft turning in a hole. Done well, it carries large loads for decades with almost no wear, runs quietly, damps vibration and tolerates dirt that would ruin a rolling bearing. It does all this because, at speed, the shaft never touches the hole: it floats on an oil film a few hundredths of a millimetre thick, pumped into place by its own rotation. Done badly, the same bearing wipes its lining in minutes.

This book explains how that film forms and what it needs, and turns the explanation into the calculations used to choose and check real bearings. It covers unit load and PV, Petroff's friction, the Sommerfeld number and the film thickness it implies, clearance, the heat balance that sets the running temperature, the oil supply, thrust pads, starting and stopping, bearing materials, and the failures and vibrations that plain bearings are prone to. The physics of viscosity behind it all is the subject of a companion book, Viscosity by the Numbers.

It is for mechanical, reliability and maintenance engineers, machine designers, fitters and students who know basic mechanics and fluid flow. Each chapter works the running case with real numbers, includes one plausible mistake and how it was caught, links the KEVOS® tool that does the chapter's calculation where one exists, and ends with an exercise and its worked answer. Readers who want the full theory will find it in Hamrock's public-domain NASA text, Fundamentals of Fluid Film Lubrication.

## The running case

Every chapter follows one fictional fan. This is an illustration. A timber processing plant in regional Victoria runs a 75 kW centrifugal dust extraction fan, FB-75, whose impeller sits between two pedestal bearings.

- **Drive:** a four-pole electric motor, direct-coupled, at 1,480 rpm.
- **Journal bearings:** two oil-ring-lubricated pedestal bearings with tin-based white metal (babbitt) linings. Each journal is 80 mm in diameter; each bearing is 60 mm long, a length-to-diameter ratio of 0.75. The design radial clearance is 0.06 mm.
- **Loads:** each journal bearing is designed for 6.0 kN, covering its share of the 1,100 kg rotor's weight with an allowance for unbalance. The non-drive-end bearing also locates the shaft axially and carries the impeller's thrust of 2.5 kN on a tapered-land thrust face of 150 mm outside and 90 mm inside diameter.
- **Oil:** an ISO VG 68 turbine-type mineral oil, 68.0 mm²/s at 40 °C and 8.6 mm²/s at 100 °C, with a density of 870 kg/m³ at 15 °C falling by 0.07% per kelvin and a specific heat of 1.9 kJ/(kg·K).
- **Housing:** each bearing housing sheds heat to the fan house air at 6.0 W per kelvin of difference between its oil and the air. The fan house reaches 30 °C on summer afternoons.

The plant, its fan and its bearings are invented and do not describe KEVOS® work or any real product or business. Equipment and oil data are of the kind makers publish, not the data of any product.

## How to use the book

Read Chapters 1, 3 and 4 first: they set out the film, its friction and its thickness, and every later chapter uses them. Chapter 2 deals with bushes that do not run on a full film, and can be read on its own. Chapters 5 to 7 are about choosing a clearance, an oil and an oil supply that keep the film healthy. Chapter 8 covers thrust bearings, Chapter 9 starting, stopping and materials, and Chapter 10 compares plain and rolling bearings and diagnoses failures.

The journal bearing calculations use the short-bearing solution published by DuBois and Ocvirk in NACA Report 1157, which their tests showed to be useful for bearings with length-to-diameter ratios up to about one. It gives closed-form answers that a reader can check with a calculator. For final design, the full solutions in the relevant ISO standard or a bearing maker's software should be used. Numbers are carried to more digits than a measurement would justify so that a reader can follow each step.

## Source limits and professional responsibility

The relations in this book are the standard simplified forms used for first design and checking. Real bearings are affected by misalignment, shaft deflection, thermal distortion, surface finish, oil supply details and dynamic loads that these relations do not include, and they are proved by measurement in service. Bearing and oil makers' data govern real decisions.

Rotating machinery can cause serious injury, and bearings are inspected and repaired only with the machine isolated and its stored energy released, under work health and safety law and Safe Work Australia's guidance on plant. This book is educational. It is not a design or maintenance instruction for any machine, and a competent person must approve real work.
