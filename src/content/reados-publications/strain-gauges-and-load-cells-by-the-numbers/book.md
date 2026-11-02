---
title: "Strain Gauges and Load Cells by the Numbers"
subtitle: "Elasticity, resistance, bridges, spring elements, installation, calibration and accuracy for the sensors that weigh and measure force"
description: "How strain gauges turn stretch into resistance and how load cells, bridges and weighing systems are designed, installed, calibrated and kept accurate, worked with numbers."
category: Manufacturing
tags: [quality, manufacturing, validation, automation]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-11-02
referencesChecked: 2026-11-02
edition: "1"
level: "Intermediate engineering and maintenance"
audience: "Mechanical, process, maintenance and quality engineers, instrument technicians and plant managers who specify, install, calibrate, troubleshoot or rely on strain gauges, load cells and weighing systems in a factory."
outcomes:
  - "Explain why a metal springs back, why its electrical resistance changes when it is stretched, and what sets a strain gauge's sensitivity and temperature behaviour."
  - "Work out the output of quarter, half and full Wheatstone bridges, and find the errors that leads, cables and excitation add to a reading."
  - "Compare column, bending-beam and shear-beam load cells, and estimate the strain, output and stress of a spring element."
  - "Install a weighing vessel so that its load cells see only the load, and calibrate it with test weights, substitution and a straight-line check."
  - "Read a load cell's accuracy class, judge whether a scale is good enough for a tolerance, and detect drift, moisture and fatigue before they cost product."
coverVariant: category
references:
  - title: "Elementary Condensed Matter Physics (lecture notes)"
    creator: "A. H. Castro Neto"
    year: "2003"
    note: "Copyright work, used only as a map of ideas: atoms and bonds, crystals, elasticity and dislocations, free electrons in metals, electron scattering by lattice vibrations and by disorder, and semiconductors. No text, equations as set out there, figures or problems are reproduced, and all cases and calculations are KEVOS® originals."
  - title: "OIML R 60-1:2021 Metrological regulation for load cells, Part 1: Metrological and technical requirements"
    creator: "International Organization of Legal Metrology (OIML)"
    year: "2021"
    url: "https://www.oiml.org/en/files/pdf_r/r060-1-e21.pdf"
    note: "Read for Chapter 9: the four accuracy classes and their limits on load cell verification intervals, the classification symbol, the maximum permissible errors with the apportioning factor, creep and minimum dead load output return, the temperature range and the humidity classes. Values quoted in Chapter 9 are taken from this edition."
  - title: "An Introduction to Measurements using Strain Gages"
    creator: "K. Hoffmann, Hottinger Baldwin Messtechnik"
    year: "1989"
    note: "Background for gauge construction, bonding, bridge circuits, lead and cable effects and temperature compensation in Chapters 2 to 4."
  - title: "Experimental Stress Analysis, fourth edition"
    creator: "J. W. Dally and W. F. Riley, College House Enterprises"
    year: "2005"
    note: "Background for strain gauge sensitivity, rosette analysis and transducer design in Chapters 2, 5 and 6."
  - title: "Piezoresistance effect in germanium and silicon"
    creator: "C. S. Smith, Physical Review 94(1), 42–49"
    year: "1954"
    note: "Named in Chapter 2 for the discovery of the large piezoresistance of semiconductors on which semiconductor strain gauges rely."
  - title: "On the electro-dynamic qualities of metals"
    creator: "W. Thomson, Philosophical Transactions of the Royal Society of London 146, 649–751"
    year: "1856"
    note: "Named in Chapter 2 as the early observation that a metal wire's resistance changes when it is stretched."
related:
  - title: "Stress Transformation by the Numbers"
    href: "/reados/publications/stress-transformation-by-the-numbers/"
  - title: "Metal Fatigue by the Numbers"
    href: "/reados/publications/metal-fatigue-by-the-numbers/"
  - title: "Random Error and Drift by the Numbers"
    href: "/reados/publications/random-error-and-drift-by-the-numbers/"
  - title: "Control Charts by the Numbers"
    href: "/reados/publications/control-charts-by-the-numbers/"
  - title: "Contact Temperature Sensors by the Numbers"
    href: "/reados/publications/contact-temperature-sensors-by-the-numbers/"
  - title: "Bulk Solids Flow by the Numbers"
    href: "/reados/publications/bulk-solids-flow-by-the-numbers/"
---

## About this book

A load cell is a piece of steel that bends very slightly under load, with four small metal-foil resistors glued to it. When the steel strains, the foil strains with it and its resistance changes by a fraction of an ohm. A bridge circuit turns that change into a few millivolts, and an indicator turns the millivolts into kilograms. Almost every scale, weighbridge, batch hopper, force tester, press monitor and torque transducer in a factory works this way, and almost every weighing problem in a factory comes from forgetting one link in that chain.

This book follows the chain from the atoms up. It starts with why steel springs back and why a metal's resistance changes when it is stretched, which explains what a strain gauge can and cannot measure and why temperature is its main enemy. It then works through the Wheatstone bridge, the spring elements inside load cells, shear and torque, the installation of a weighing vessel, calibration, accuracy classes and the faults that make a good scale drift.

It is for mechanical, process, maintenance and quality engineers, instrument technicians and plant managers. It assumes engineering or trade training and comfort with stress, strain and simple algebra; the physics is explained as it is used. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the KEVOS® tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one weighing system. This is an illustration. A stock-feed mill in Toowoomba, Queensland, makes mash and pelleted feed for cattle, pigs and poultry. Each batch of up to 2,500 kg of ingredients is weighed in a batch weigh hopper, called BH-2 in this book, before it drops into the mixer.

- **Hopper:** a steel hopper with a cylindrical upper section 1,800 mm in diameter and 1,200 mm high and a cone tapering to a 300 mm outlet over 1,300 mm. Empty, with its discharge gate and vibrator, it weighs 1,150 kg.
- **Load cells:** three single-ended shear beam load cells, one under each of the hopper's three lugs, each rated 2,000 kg, accuracy class C3, rated output 2 mV/V, bridge resistance 350 Ω.
- **Support:** each load cell sits on a stand of 100 × 100 × 5 mm square hollow section, 2,400 mm tall.
- **Electronics:** the three load cell cables meet in a junction box on the stand, and a 20 m cable runs to a weighing indicator in the control room, which supplies 10 V excitation and displays in 1 kg steps (0.1 kg in its service mode).
- **Below the hopper:** a screw feeder driven at 40 rpm by a 5.5 kW geared motor meters the batch into the mixer.
- **Test equipment:** twenty 25 kg certified test weights, 500 kg in all.

Masses, readings, stresses, prices and failure records are the mill's working figures or are calculated from stated assumptions. They do not describe KEVOS® work or any real business, load cell maker, instrument maker or supplier. Prices are in Australian dollars excluding GST, because a GST-registered business claims the GST back on its costs.

## How to use the book

Chapters 1 to 4 explain the gauge and the bridge, Chapters 5 and 6 the spring elements and multiaxial strain, Chapters 7 and 8 installation and calibration, and Chapters 9 and 10 accuracy and keeping a system honest. Read Chapter 1 first; the others stand on their own once the case is familiar.

Each chapter links the KEVOS® calculators it uses. The tools do the arithmetic; the chapter explains what the inputs mean and where they come from. Every result in the text was checked by calculation, and the numbers in figures match the text.

## Limits and responsibility

This book is educational. Weighing systems used for trade must be of an approved pattern and verified under Australia's trade measurement law, administered by the National Measurement Institute; check the current requirements before using any scale to buy or sell by mass. Hoppers, silos and their supports carry large loads and must be designed and checked by competent engineers to the applicable Australian standards. Electrical work on indicators and junction boxes must be done by licensed people. Datasheet values, readings and costs in the case are illustrations; use the manufacturer's documents and your own measurements for real work.
