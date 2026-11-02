---
title: "Laser Processing by the Numbers"
subtitle: "Absorption, focusing, cutting, welding, marking, gases, safety and cost in one sheet-metal laser cell"
description: "How metals absorb laser light and how to plan laser cutting, welding and marking with numbers: focus, power density, heat flow, assist gas, safety and cost per part."
category: Manufacturing
tags: [manufacturing, design, quality]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-11-01
referencesChecked: 2026-11-01
edition: "1"
level: "Intermediate manufacturing and production engineering"
audience: "Manufacturing and production engineers, laser operators moving into process planning, estimators and sheet-metal designers who buy, run, quote or troubleshoot laser cutting, welding and marking."
outcomes:
  - "Explain why metals reflect most laser light and how wavelength, temperature, angle and surface condition change the share absorbed."
  - "Work out focused spot size, depth of focus and power density from the beam quality and optics, and use them to set up a cut."
  - "Estimate cutting speed, assist gas use and cost per part, and choose between oxygen, nitrogen and air."
  - "Plan laser welds and pulsed marking from heat input, fit-up, pulse energy, fluence and overlap."
  - "Check cut-edge hardness, fume extraction, chiller duty and the machine hour rate of a laser cell."
coverVariant: category
references:
  - title: "Electrodynamics of Solids: Optical Properties of Electrons in Matter"
    creator: "M. Dressel and G. Grüner, Cambridge University Press"
    year: "2002"
    note: "Copyright work, used only as a map of ideas: how the reflectivity and absorptivity of a metal follow from its conductivity, the long-wavelength Hagen–Rubens relation and its limits, the optical skin depth, and the Fresnel equations at oblique incidence. No text, equations as set out there, figures or problems are reproduced, and all cases and calculations are KEVOS® originals."
  - title: "Laser Material Processing, fourth edition"
    creator: "W. M. Steen and J. Mazumder, Springer"
    year: "2010"
    note: "Background for laser cutting, welding and marking: process regimes, assist gases, keyhole and conduction welding, and the fit-up rules of thumb quoted as such in Chapters 5 to 9."
  - title: "Lasers"
    creator: "A. E. Siegman, University Science Books"
    year: "1986"
    note: "Background for Gaussian beams, the Rayleigh range and the beam quality factor M², used in Chapter 4."
  - title: "Conduction of Heat in Solids, second edition"
    creator: "H. S. Carslaw and J. C. Jaeger, Oxford University Press"
    year: "1959"
    note: "Background for the surface heating solutions used in Chapters 2 and 5: a steady uniform disc source and a uniform flux switched on at the surface of a thick body."
  - title: "Model Code of Practice: Managing the risks of plant in the workplace"
    creator: "Safe Work Australia"
    year: "2022"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-plant-workplace"
    note: "Named in Chapters 1 and 10 for the duty to manage the risks of plant, which includes laser machines, their guarding and their isolation for maintenance."
related:
  - title: "Cutting and Gouging by the Numbers"
    href: "/reados/publications/cutting-and-gouging-by-the-numbers/"
  - title: "Infrared Temperature Measurement by the Numbers"
    href: "/reados/publications/infrared-temperature-measurement-by-the-numbers/"
  - title: "Sheet Metal Parts by the Numbers"
    href: "/reados/publications/sheet-metal-parts-by-the-numbers/"
  - title: "Choosing a cutting process for plate and sheet"
    href: "/reados/collections/machining-and-metal-parts/choosing-a-cutting-process-for-plate-and-sheet/"
  - title: "Lasers from theory to tool"
    href: "/reados/collections/engineering-history-modern-era/lasers-from-theory-to-tool/"
---

## About this book

A laser puts a great deal of power into a very small spot, but only the part of that power the metal absorbs does any work. Most of the light that reaches a clean metal surface is reflected. How much is absorbed depends on the metal, the wavelength, the temperature, the angle at which the beam meets the surface and the state of that surface. Everything else in laser processing, from the cutting speed to the colour of a weld, follows from that first step and from how quickly the absorbed heat flows away.

This book shows how to plan and check laser processing with numbers. It starts with where a laser's energy goes and why metals reflect so much of it, then works through angle and polarisation, beam quality and focusing, heat flow and hardened cut edges, cutting speed and cost, assist gases, welding and pulsed marking. It finishes with the parts of a laser cell that are easy to overlook until they fail: guarding, fume extraction, the chiller and the hour rate that pays for it all.

It is for manufacturing and production engineers, laser operators moving into process planning, estimators and sheet-metal designers. It assumes engineering or trade training and comfort with power, energy and heat; the optics and electromagnetism are explained as they are used. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the KEVOS® tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one laser cell. This is an illustration. A sheet-metal and enclosure fabricator in Toowoomba, Queensland, makes electrical cabinets, brackets and small stainless steel boxes. Its laser cell has four machines:

- **LC-4:** a 4 kW fibre laser cutting machine with a 3,000 × 1,500 mm bed. Wavelength 1.07 µm, beam parameter product 4 mm·mrad (beam quality factor M² 11.74), a 100 mm collimator and a 200 mm focusing lens, giving a 0.2 mm focused spot. Nitrogen comes from a bulk liquid tank and oxygen from a cylinder pack.
- **LC-2:** an older 2 kW CO₂ laser cutting machine, wavelength 10.6 µm, kept for acrylic signage and thin mild steel.
- **W-2:** a 2 kW fibre laser welding cell on a six-axis robot, used for stainless steel boxes and some brackets.
- **M-20:** a 20 W pulsed fibre marking laser for nameplates and two-dimensional codes.

The parts that recur are 1.5 mm grade 304 stainless steel cabinet doors cut from 760 × 560 mm blanks, 6 mm grade 350 steel mounting brackets, 3 mm grade 5052 aluminium panels, 3 mm copper busbar links, welded stainless boxes and engraved nameplates.

Powers, speeds, absorptivities, prices and test results are the cell's working figures or are calculated from stated assumptions. They do not describe KEVOS® work or any real business, laser maker, gas supplier or customer. All prices are in Australian dollars excluding GST, because a GST-registered business claims the GST back on its costs.

## How to use the book

Read Chapters 1 to 4 in order: they set out absorption, angle and focusing, which every later chapter uses. Chapters 5 to 9 can then be read in any order. Chapter 10 brings together safety, fume, cooling and cost, and the cell's process record.

Every calculation in the book was checked by running it, and the KEVOS® tools linked from each chapter were checked against the calculations they perform. Optical constants, absorptivities and cutting chart speeds are assumed values for illustration: real values depend on the alloy, the surface and the machine, and come from measurements and the laser maker's process data.

## Source limits and professional responsibility

This book is educational. Industrial cutting, welding and marking lasers are Class 4 lasers: their direct and scattered beams can blind and burn, and the processes make fume and fire risks. Laser machines must be guarded, interlocked and operated under the maker's instructions and a documented risk assessment, by people trained to do so. Safety-critical welds and structural parts must be made to qualified procedures and the applicable standards. Decisions about real machines, processes and products remain with the competent people responsible for them.
