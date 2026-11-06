---
title: "Ultrasonic Testing by the Numbers"
subtitle: "Sound speed, echoes, thickness gauging, corrosion surveys, remaining life, angle-beam weld testing and long-path shaft inspection"
description: "How ultrasonic testing works and how to use it with numbers: sound speed, echoes, beams, thickness surveys, remaining life, weld testing, attenuation, sampling and records."
category: Manufacturing
tags: [quality, manufacturing, validation, operations]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-11-03
referencesChecked: 2026-11-03
edition: "1"
level: "Intermediate inspection, maintenance and quality engineering"
audience: "Maintenance, reliability, inspection and quality engineers, NDT technicians, fabricators and plant owners who specify, perform, audit or act on ultrasonic thickness surveys, weld tests and shaft inspections."
outcomes:
  - "Explain how sound travels in steel, why its speed follows from stiffness and density, and how echoes form at interfaces and defects."
  - "Choose a probe and frequency from the wavelength, near field and beam spread, and judge what a beam can and cannot resolve."
  - "Calibrate a thickness gauge, quantify its uncertainty, design a corrosion survey and turn the readings into a corrosion rate, remaining life and inspection interval."
  - "Locate and size reflectors in a butt weld with angle-beam probes, Snell's law and a distance–amplitude curve."
  - "Budget the signal on a long, attenuating path, and set out a procedure, sampling plan and record that make an ultrasonic result a sound decision."
coverVariant: category
references:
  - title: "Introduction to Modern Solid State Physics"
    creator: "Y. M. Galperin, lecture notes for course FYS 448, Department of Physics, University of Oslo"
    year: "2001"
    note: "Copyright work, used only as a map of ideas: lattice vibrations and the speed of long elastic waves, longitudinal and transverse modes, phase and group velocity, and the mechanisms that damp sound in solids. No text, equations as set out there, figures or problems are reproduced, and all cases and calculations are BIZOMAT originals."
  - title: "Ultrasonic Testing of Materials"
    creator: "J. Krautkrämer and H. Krautkrämer, Springer-Verlag"
    year: "1990"
    note: "Fourth edition. Background for wave modes, reflection and transmission at interfaces, sound fields of probes, attenuation and the techniques of thickness, weld and forging testing used throughout."
  - title: "ISO 16809, Non-destructive testing — Ultrasonic thickness determination"
    creator: "International Organization for Standardization"
    year: "2025"
    note: "Named by number and scope only: principles for determining thickness by the time of flight of ultrasonic pulses (adopted in Australia as AS ISO 16809). Its requirements are not reproduced and must be read in full."
  - title: "AS 2207, Non-destructive testing — Ultrasonic testing of fusion welded joints in carbon and low alloy steel"
    creator: "Standards Australia"
    year: "2007"
    note: "Named by number and scope only (reconfirmed 2017): manual A-scan testing of full and partial penetration welds in ferritic steel 6 mm and thicker. Check its current status with Standards Australia before use."
  - title: "ISO 17640 and ISO 11666, Non-destructive testing of welds — Ultrasonic testing: techniques, testing levels and assessment; acceptance levels"
    creator: "International Organization for Standardization"
    year: "2018"
    note: "Named by number and scope only. ISO 11666 sets acceptance levels that apply to testing performed to ISO 17640; a revision of ISO 11666 was in progress in 2026."
  - title: "AS/NZS 3788, Pressure equipment — In-service inspection"
    creator: "Standards Australia and Standards New Zealand"
    year: "2024"
    note: "Named by number and scope only: minimum requirements for in-service inspection and fitness-for-service assessment of pressure equipment. Inspection intervals for real equipment come from it and from the owner's competent inspection body, not from this book."
  - title: "NIST/SEMATECH e-Handbook of Statistical Methods"
    creator: "National Institute of Standards and Technology"
    year: "2012"
    url: "https://www.itl.nist.gov/div898/handbook/"
    note: "Background for the gauge study, uncertainty, regression and sampling methods used in Chapters 4, 5, 6 and 10 and in the BIZOMAT tools linked from them."
related:
  - title: "Eddy-Current Inspection by the Numbers"
    href: "/reados/publications/eddy-current-inspection-by-the-numbers/"
  - title: "Testing Welded Joints by the Numbers"
    href: "/reados/publications/testing-welded-joints-by-the-numbers/"
  - title: "Accept or Reject by the Numbers"
    href: "/reados/publications/accept-or-reject-by-the-numbers/"
  - title: "Metal Fatigue by the Numbers"
    href: "/reados/publications/metal-fatigue-by-the-numbers/"
  - title: "Pipe Welding by the Numbers"
    href: "/reados/publications/pipe-welding-by-the-numbers/"
---

## About this book

Tap a steel bar and it rings: the atoms pass a disturbance from one to the next at a speed set by how stiffly they are bound and how heavy they are. Ultrasonic testing uses the same physics at a few million cycles per second. A probe sends a short pulse of sound into a part, the pulse reflects from the far wall or from anything that interrupts the metal, and the instrument times the echo. Time multiplied by sound speed gives a distance: a wall thickness, the depth of a crack, the position of a lack of fusion in a weld. The echo's height says something about the reflector's size, and its absence says something about what is not there.

This book shows how to use ultrasonic testing with numbers. It starts with how sound travels in steel, what happens at interfaces and what a probe's beam looks like. It then works through the jobs a maintenance or quality engineer most often pays for: thickness gauging and its calibration, corrosion surveys and the remaining life and inspection interval they lead to, angle-beam testing of butt welds and the sizing and evaluation of indications, and the long sound paths of shaft inspection, where attenuation and beam spread decide what can be found. It finishes with the procedure, the people, the sampling and the records that turn readings into decisions.

It is for maintenance, reliability, inspection and quality engineers, NDT technicians, fabricators and plant owners. It assumes engineering or trade training and comfort with basic mechanics and statistics; the wave physics is explained as it is used, starting from the idea of atoms connected by springs. Each chapter works the running case with real numbers, includes a plausible mistake and how it was found, links the BIZOMAT tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one plant. This is an illustration. A raw sugar mill in the Mackay district of Queensland crushes cane from June to November and uses the slack season, December to May, for maintenance and inspection. Its inspection contractor's level 2 ultrasonic technician and the mill's reliability engineer work on four items:

- **Juice line JL-4:** DN150 carbon steel pipe, 168.3 mm outside diameter and 7.11 mm nominal wall, carrying heated mixed juice at about 105 °C and a design pressure of 1.0 MPa. Twelve condition monitoring locations are measured every slack season.
- **Flash vessel V-12:** a carbon steel vessel of 1,200 mm inside diameter with a 10 mm shell, designed for 0.70 MPa, that flashes condensate to low-pressure steam. Its shell is surveyed on a grid, sometimes while still hot.
- **The V-12 insert plate:** a new 12 mm shell insert plate around a replacement nozzle, joined to the shell by full-penetration butt welds that are tested with angle-beam probes.
- **No. 3 mill top roll shaft:** a forged steel shaft inspected from its end face with a straight-beam probe for fatigue cracks at the journal fillets, 650 mm and 2,550 mm from the end.

Dimensions, readings, signal amplitudes, rates, prices and results are the mill's working figures or are calculated from stated assumptions. They do not describe BIZOMAT work or any real mill, inspection company, instrument maker or customer. Material properties are typical values for illustration; real acceptance limits and inspection intervals come from the design code, the standards a contract calls up and the owner's competent inspection body. Prices are in Australian dollars excluding GST.

## How to use the book

Read Chapters 1 to 3 first: they explain sound speed, echoes and beams, which every later chapter uses. Chapters 4 to 6 form a sequence on thickness: gauging and calibration, survey design, and remaining life. Chapters 7 and 8 go together on weld testing. Chapter 9 can be read on its own after Chapter 3, and Chapter 10 brings the procedure, sampling, records and cost together.

Every calculation in the book was checked by running it, and the BIZOMAT tools linked from each chapter were checked against the calculations they perform. Where a tool was built for a different purpose but does one step of a chapter's calculation, such as the liquid compression tool's wave speed, the chapter says which output is used and which are not.

## Source limits and professional responsibility

This book is educational. Ultrasonic testing of pressure equipment, structural welds and rotating machinery is governed by design codes, product standards, contract specifications and written procedures, and is performed and interpreted by personnel certified for the method, such as under ISO 9712. The book names the standards that apply to its examples by number and scope only; it does not reproduce their requirements, and they must be read in full before use. Fitness-for-service and inspection-interval decisions on real equipment remain with the owner and the competent people responsible for it.
