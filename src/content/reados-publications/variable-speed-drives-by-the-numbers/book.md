---
title: "Variable-Speed Drives by the Numbers"
subtitle: "Semiconductors, losses, cooling, life, motors, fans, braking, harmonics and maintenance for the drives that run a factory"
description: "How variable-speed drives control induction motors and how to size, cool, apply and maintain them with numbers: switch physics, losses, junction temperature, energy savings and life."
category: Engineering
tags: [automation, design, operations, validation]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-11-01
referencesChecked: 2026-11-01
edition: "1"
level: "Intermediate engineering and maintenance"
audience: "Mechanical, electrical and maintenance engineers, technicians and plant managers who specify, install, set up, troubleshoot or pay for variable-speed drives on fans, pumps, conveyors and other factory machines."
outcomes:
  - "Explain how a drive's rectifier, DC link and inverter control an induction motor's speed, and how its semiconductor switches block voltage and conduct current."
  - "Estimate a drive's conduction and switching losses, junction temperature and cabinet cooling, and find the cause of an overheating drive."
  - "Estimate the life of a drive's capacitors, fans and power modules, and plan maintenance and spares from it."
  - "Apply drives to fans, pumps and conveyors with the right torque, cooling and speed range, and check the energy saving and the business case."
  - "Set ramps and braking, and deal with harmonics, earth leakage, cable effects and electromagnetic compatibility in a real installation."
coverVariant: category
references:
  - title: "Electronic and Optoelectronic Properties of Semiconductor Structures"
    creator: "J. Singh, Cambridge University Press"
    year: "2003"
    note: "Copyright work, used only as a map of ideas: doping, intrinsic carrier density and its temperature dependence, carrier mobility and its limitation by lattice scattering, impact ionisation and avalanche breakdown, minority-carrier injection and recombination. No text, equations as set out there, figures or problems are reproduced, and all cases and calculations are BIZOMAT originals."
  - title: "Application Manual Power Semiconductors, second edition"
    creator: "A. Wintrich, U. Nicolai, W. Tursky and T. Reimann, SEMIKRON International"
    year: "2015"
    note: "Background for the loss and thermal models of IGBT and diode modules in Chapters 2 to 5: conduction losses from threshold voltage and slope resistance, switching energies scaled with current and voltage, and thermal resistance chains."
  - title: "Fundamentals of Power Semiconductor Devices"
    creator: "B. J. Baliga, Springer"
    year: "2008"
    note: "Background for the ideal drift region, its breakdown voltage and specific on-resistance, and the comparison of silicon and silicon carbide in Chapter 2."
  - title: "Electric Motors and Drives: Fundamentals, Types and Applications, fifth edition"
    creator: "A. Hughes and B. Drury, Newnes"
    year: "2019"
    note: "Background for induction motor operation on a drive, constant flux and field weakening, motor cooling at low speed and braking in Chapters 1, 6 and 8."
  - title: "Work Health and Safety (Managing Electrical Risks in the Workplace) Code of Practice 2015"
    creator: "Commonwealth of Australia, Federal Register of Legislation, based on Safe Work Australia's model code"
    year: "2015"
    url: "https://www.legislation.gov.au/F2016L00407"
    note: "Named in Chapters 1 and 10 for the duty to manage electrical risks, including isolation and the stored energy in a drive's DC link capacitors. Work in New South Wales follows the code of practice approved there; check the current version with the state regulator."
related:
  - title: "Rooftop Solar for Factories by the Numbers"
    href: "/reados/publications/rooftop-solar-for-factories-by-the-numbers/"
  - title: "Centrifugal Pumps by the Numbers"
    href: "/reados/publications/centrifugal-pumps-by-the-numbers/"
  - title: "Fins and Heat Sinks by the Numbers"
    href: "/reados/publications/fins-and-heat-sinks-by-the-numbers/"
  - title: "Accelerated Life Testing by the Numbers"
    href: "/reados/publications/accelerated-life-testing-by-the-numbers/"
  - title: "Electronics Packaging by the Numbers"
    href: "/reados/publications/electronics-packaging-by-the-numbers/"
  - title: "Selecting electric motors and drives"
    href: "/reados/collections/machine-elements-and-mechanical-design/selecting-electric-motors-and-drives/"
---

## About this book

Most of the electricity a factory buys is turned into motion by induction motors, and more and more of those motors are fed through variable-speed drives. A drive lets a fan run at the airflow the process needs instead of fighting a damper, lets a conveyor start gently and match its feed to the machine it serves, and lets a pump deliver the flow without a throttling valve. It does this by switching hundreds of volts on and off thousands of times a second in semiconductor devices smaller than a coin, and those devices, their losses, their heat and their ageing decide whether the drive does its job for fifteen years or fails in two.

This book explains drives from the semiconductor up and the machine down. It starts with what a drive does to a motor, then explains how its diodes and transistors block voltage and carry current, where their losses come from, how hot they get and how long they last. It then turns to the machines: the motor at low and high speed, the energy saved on fans and pumps, starting, stopping and braking, harmonics, earth leakage and interference, and finally how to specify, commission and maintain a drive.

It is for mechanical, electrical and maintenance engineers, technicians and plant managers. It assumes engineering or trade training and comfort with power, torque and simple algebra; the semiconductor physics is explained as it is used. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the BIZOMAT tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one drive panel. This is an illustration. A plastics recycler in Albury, New South Wales, shreds, washes and granulates used plastic containers into flake for re-use. Its wash line has a drive panel, called DP-4 in this book, feeding three motors:

- **F-1:** the dust and vapour extraction fan for the granulators and wash tanks, a 30 kW, 4-pole, 400 V, 50 Hz induction motor rated at 1,475 rpm, belt-driven. Before the drive it ran at full speed with an outlet damper partly closed.
- **P-3:** the cooling-water pump for the extruder and the granulator bearings, a 22 kW, 2-pole motor rated at 2,950 rpm, sending water up to a cooling tower on the roof.
- **C-2:** the infeed belt conveyor to the shredder, a 7.5 kW, 4-pole geared motor whose speed sets the shredder's feed rate.

DP-4 holds three drives of matching rating, each with a six-pulse diode rectifier, a DC link of electrolytic capacitors and a three-phase inverter of insulated-gate bipolar transistors (IGBTs) and diodes switching at 4 kHz, in a ventilated steel cabinet in the wash hall, which is warm, humid and dusty with plastic fines.

Ratings, losses, temperatures, prices and failure records are the plant's working figures or are calculated from stated assumptions. They do not describe BIZOMAT work or any real business, drive maker, motor maker or supplier. Prices are in Australian dollars excluding GST, because a GST-registered business claims the GST back on its costs.

## How to use the book

Chapters 1 to 5 are about the drive itself, and Chapters 6 to 10 about applying and keeping it. Read Chapter 1 first; the others stand on their own once the case is familiar. Each chapter links the BIZOMAT calculators it uses. The tools do the arithmetic; the chapter explains what the inputs mean and where they come from. Every result in the text was checked by calculation, and the numbers in figures match the text.

## Limits and responsibility

This book is educational. Drives operate at lethal voltages and store energy in their capacitors after they are switched off. Installation, wiring, protection and maintenance must be carried out by licensed electrical workers to the wiring rules, the drive maker's instructions and the applicable Australian requirements. Machine safety functions that depend on a drive must be designed and validated by competent people. Standards are named by number and scope only. Datasheet values, losses and costs in the case are illustrations; use the manufacturer's documents and measured data for real work.
