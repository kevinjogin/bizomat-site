---
title: "Plasma Surface Engineering by the Numbers"
subtitle: "Glow discharges, sheaths, plasma cleaning, plasma nitriding and PVD coatings for tools, dies and machine parts"
description: "How low-pressure plasmas clean, nitride and coat steel and carbide parts, and how to specify, run, test and cost plasma nitriding and PVD coatings, worked with numbers."
category: Manufacturing
tags: [manufacturing, quality, process-improvement, validation]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-11-02
referencesChecked: 2026-11-02
edition: "1"
level: "Intermediate engineering and production"
audience: "Manufacturing, tooling, quality and maintenance engineers, toolmakers, heat treaters and buyers who specify, run, inspect or pay for plasma nitriding, plasma cleaning and PVD coatings on tools, dies and machine parts."
outcomes:
  - "Explain what a low-pressure plasma is, how a glow discharge starts and why ions arriving at a part's surface carry the energy that cleans, heats and coats it."
  - "Plan a plasma cleaning and plasma nitriding cycle, and judge its gas mixture, pressure, power, temperature and time from the numbers."
  - "Read a nitrided layer's hardness profile and specify its compound layer and diffusion depth for the part's duty."
  - "Explain how sputtering and cathodic arc PVD deposit coatings, and estimate thickness, rate and uniformity from a coater's settings."
  - "Test coating thickness and adhesion, find the cause of a failed coating, and work out whether a treatment pays for itself."
coverVariant: category
references:
  - title: "Fundamentals of Plasma Physics"
    creator: "P. M. Bellan, Cambridge University Press"
    year: "2006"
    note: "Copyright work, used only as a map of ideas: plasma parameters, Debye shielding and quasi-neutrality, collisions with neutrals, sheaths and Langmuir probes, and the drift of charged particles in crossed electric and magnetic fields. The copy consulted was a 2004 manuscript of the book. No text, equations as set out there, figures or problems are reproduced, and all cases and calculations are KEVOS® originals."
  - title: "Principles of Plasma Discharges and Materials Processing, second edition"
    creator: "M. A. Lieberman and A. J. Lichtenberg, Wiley"
    year: "2005"
    note: "Background for glow discharges, the Bohm criterion, collisionless and collisional sheaths, sputtering and plasma processing in Chapters 1 to 4 and 7."
  - title: "Glow Discharge Processes: Sputtering and Plasma Etching"
    creator: "B. Chapman, Wiley"
    year: "1980"
    note: "Background for the structure of the glow discharge, breakdown, the hollow cathode effect and sputtering in Chapters 2, 4 and 7."
  - title: "Handbook of Physical Vapor Deposition (PVD) Processing, second edition"
    creator: "D. M. Mattox, William Andrew"
    year: "2010"
    note: "Background for substrate preparation, sputter and arc deposition, film growth, thickness and adhesion testing in Chapters 4 and 7 to 9."
  - title: "Thermochemical Surface Engineering of Steels"
    creator: "E. J. Mittemeijer and M. A. J. Somers (editors), Woodhead Publishing"
    year: "2015"
    note: "Background for the compound layer and diffusion zone of nitrided steels, nitriding potential and case growth in Chapters 5 and 6."
  - title: "Ueber die zum Funkenübergang in Luft, Wasserstoff und Kohlensäure bei verschiedenen Drucken erforderliche Potentialdifferenz"
    creator: "F. Paschen, Annalen der Physik 273(5), 69–96"
    year: "1889"
    note: "Named in Chapter 2 as the original measurements of breakdown voltage against pressure and gap that give the Paschen curve."
related:
  - title: "Vacuum by the Numbers"
    href: "/reados/publications/vacuum-by-the-numbers/"
  - title: "Diffusion by the Numbers"
    href: "/reados/publications/diffusion-by-the-numbers/"
  - title: "Adhesive Bonding by the Numbers"
    href: "/reados/publications/adhesive-bonding-by-the-numbers/"
  - title: "Microstructures by the Numbers"
    href: "/reados/publications/microstructures-by-the-numbers/"
  - title: "Cutting tool materials and coatings"
    href: "/reados/collections/machining-and-metal-parts/cutting-tool-materials-and-coatings/"
---

## About this book

A low-pressure plasma is a partly ionised gas, glowing faintly in a steel chamber, in which a small fraction of the atoms have lost an electron. It is a surprisingly practical tool. Ions accelerated across a thin layer at a part's surface scrub away oxides and oils, heat the part to nitriding temperature, drive nitrogen into its surface, or knock atoms off a metal target so that they condense on the part as a hard coating a few micrometres thick. Plasma nitriding, plasma cleaning and physical vapour deposition (PVD) coatings are now routine on moulds, dies, cutting tools, gears and hydraulic parts, and the people who buy and specify them are rarely plasma physicists.

This book explains what happens inside the chamber, using numbers rather than mysteries. It starts with what a plasma is, how a glow discharge breaks down and sustains itself, and why the sheath at a part's surface matters most. It then works through plasma cleaning and activation, plasma nitriding and the testing of nitrided layers, sputtering and cathodic arc PVD, coating thickness and uniformity, adhesion and failures, and the economics of treating tools and dies.

It is for manufacturing, tooling, quality and maintenance engineers, toolmakers, heat treaters and buyers. It assumes engineering or trade training and comfort with pressure, temperature, voltage and simple algebra; the physics is explained as it is used. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the KEVOS® tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one job through one shop. This is an illustration. A surface engineering job shop in Newcastle, New South Wales, treats tools and parts for toolmakers and manufacturers. It has two plasma machines:

- **PN-1:** a plasma nitriding vessel with a working space 1,000 mm in diameter and 1,600 mm high, a pulsed DC power supply of up to 1,000 V and 60 kW, and gas supplies of nitrogen, hydrogen, argon and methane.
- **PV-1:** a PVD coater with a chamber about 700 mm across, four chromium magnetron sputtering targets, a pulsed bias supply for the parts and a three-fold planetary rotation fixture.

The job is order 27 from a die-casting toolmaker: 24 core inserts in H13 hot-work tool steel for an aluminium high-pressure die-casting die, each 60 mm in diameter and 150 mm long, hardened and tempered to about 46 HRC. The toolmaker wants a duplex treatment: plasma nitriding to give a hard diffusion zone with no brittle compound layer, followed by a 4 µm chromium nitride (CrN) PVD coating, to reduce soldering of aluminium to the cores and extend their life. The same toolmaker also sends the shop its carbide and high-speed steel cutters for coating.

Masses, settings, temperatures, thicknesses, test results, prices and failure records are the shop's working figures or are calculated from stated assumptions. They do not describe KEVOS® work or any real business, equipment maker, coating supplier or customer. Prices are in Australian dollars excluding GST, because a GST-registered business claims the GST back on its costs.

## How to use the book

Chapters 1 to 3 explain the plasma, the discharge and the sheath, Chapters 4 to 6 cleaning and nitriding, and Chapters 7 to 10 PVD coatings, their testing and their economics. Read Chapter 1 first; the others stand on their own once the case is familiar. The Library's [Vacuum by the Numbers](/reados/publications/vacuum-by-the-numbers/) covers the pumps, leaks and gauges that every plasma machine depends on, and [Diffusion by the Numbers](/reados/publications/diffusion-by-the-numbers/) the diffusion that sets nitrided case depth.

Each chapter links the KEVOS® calculators it uses. The tools do the arithmetic; the chapter explains what the inputs mean and where they come from. Every result in the text was checked by calculation, and the numbers in figures match the text.

## Limits and responsibility

This book is educational. Plasma machines use high voltages, hydrogen and other flammable or asphyxiant gases, vacuum vessels and high temperatures, and must be designed, installed and operated to the maker's instructions, the applicable Australian standards and work health and safety law, by trained people. Treatment specifications for real parts must be agreed with the part's designer and the treater, and verified by test. Standards are named by number and scope only. Process settings, layer depths, hardness values and costs in the case are illustrations; use the equipment maker's data, the steel maker's data and your own trials for real work.
