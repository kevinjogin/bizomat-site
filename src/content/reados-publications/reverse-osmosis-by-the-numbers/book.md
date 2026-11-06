---
title: "Reverse Osmosis by the Numbers"
subtitle: "Osmotic pressure, recovery, flux, temperature, polarisation, scaling, pretreatment, energy and cleaning, worked through one bore-water plant"
description: "Size, check and run a brackish-water reverse osmosis plant from first principles: osmotic pressure, recovery, flux, temperature, polarisation, scaling, pretreatment, energy and cleaning."
category: Engineering
tags: [design, operations, quality, validation]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-30
referencesChecked: 2026-10-30
edition: "1"
level: "Intermediate process and water treatment engineering"
audience: "Process, mechanical and maintenance engineers, water treatment operators, plant managers and students who need to specify, check, operate or troubleshoot a reverse osmosis plant."
outcomes:
  - "Calculate the osmotic pressure of a water from its ion analysis, with an osmotic coefficient, and explain why it sets the feed pressure."
  - "Use solute and water mass balances to find concentrate strength, concentrate-end driving pressure and the recovery a feed pressure allows."
  - "Estimate permeate flow and quality from membrane water and salt permeability, the net driving pressure and the temperature correction factor."
  - "Judge concentration polarisation, array layout and scaling limits, and decide which pretreatment a water needs."
  - "Calculate pump power, specific energy and the thermodynamic least work, and normalise operating data to decide when to clean."
coverVariant: category
references:
  - title: "A Modern Course in Statistical Physics, 2nd edition"
    creator: "L. E. Reichl, John Wiley & Sons"
    year: "1998"
    note: "In copyright. Used only as a map of the physics behind the book: osmotic pressure in dilute solutions, entropy of mixing, Onsager relations and volume flow across a membrane, and Fick's law. No text, structure, figures, tables or problems are reproduced."
  - title: "FILMTEC Membranes. System Design: System Performance Projection (technical manual excerpt, Form No. 609-02057-604)"
    creator: "The Dow Chemical Company, hosted by Lenntech"
    year: "n.d."
    url: "https://www.lenntech.com/data-sheets/filmtec-design-equations-l.pdf"
    note: "Source of the water and salt permeation equations, the log-mean concentration ratio, the temperature correction factor with its 2640 and 3020 constants, and the polarisation factor exp(0.7 Yi) used in Chapters 3, 4, 5 and 9."
  - title: "Osmotic Coefficients and Mean Activity Coefficients of Uni-univalent Electrolytes in Water at 25 °C"
    creator: "W. J. Hamer and Y.-C. Wu, Journal of Physical and Chemical Reference Data 1, 1047"
    year: "1972"
    url: "https://srd.nist.gov/jpcrdreprint/1.3253108.pdf"
    note: "Source of the sodium chloride osmotic coefficients quoted in Chapter 1 (0.944 at 0.05 mol/kg, 0.933 at 0.1 mol/kg, 0.924 at 0.2 mol/kg, 0.923 at 0.6 mol/kg) that justify the book's single value of 0.93."
  - title: "Chemistry 2e, Section 11.4: Colligative Properties"
    creator: "P. Flowers, K. Theopold, R. Langley and W. R. Robinson, OpenStax"
    year: "2019"
    url: "https://openstax.org/books/chemistry-2e/pages/11-4-colligative-properties"
    note: "Open textbook reference for osmosis, the van 't Hoff relation between osmotic pressure, molarity and temperature, and the van 't Hoff factor."
  - title: "The solution-diffusion model: a review"
    creator: "J. G. Wijmans and R. W. Baker, Journal of Membrane Science 107, 1–21"
    year: "1995"
    note: "Named in Chapter 3 as the standard account of why water and salt cross a reverse osmosis membrane in proportion to pressure and concentration differences. No text is reproduced."
  - title: "Thermodynamic analysis of the permeability of biological membranes to non-electrolytes"
    creator: "O. Kedem and A. Katchalsky, Biochimica et Biophysica Acta 27, 229–246"
    year: "1958"
    note: "Named in Chapter 3 as the origin of the reflection coefficient, the irreversible-thermodynamics description of coupled water and solute flow through a membrane."
  - title: "PHREEQC Version 3 (database phreeqc.dat)"
    creator: "D. L. Parkhurst and C. A. J. Appelo, U.S. Geological Survey"
    year: "2013"
    url: "https://github.com/usgs-coupled/phreeqc3"
    note: "The distributed phreeqc.dat database was read for the gypsum solubility constant (log K −4.55 at 25 °C) and the amorphous silica constant (log K −2.71) used in Chapter 6."
  - title: "Chemical geothermometers and mixing models for geothermal systems"
    creator: "R. O. Fournier, Geothermics 5, 41–50"
    year: "1977"
    url: "https://pubs.usgs.gov/publication/70009905"
    note: "Origin of the temperature relation for amorphous silica solubility used in Chapter 6 to show how the silica limit falls in cold water; checked against the PHREEQC constant at 25 °C."
  - title: "FILMTEC BW30-400/34i Element product data sheet"
    creator: "The Dow Chemical Company, hosted by Lenntech"
    year: "n.d."
    url: "https://www.lenntech.com/data-sheets/Dow-Filmtec-BW30-400%2034i-L.pdf"
    note: "Cited in Chapter 7 for the class of limit makers publish for polyamide brackish-water elements: a free chlorine tolerance below 0.1 ppm and a maximum feed silt density index of 5. Readers use their own element's data sheet."
  - title: "Membrane Cleaning Fundamentals: Cleaning Criteria and Normalization of Reverse Osmosis Systems"
    creator: "Water Technology"
    year: "n.d."
    url: "https://www.watertechonline.com/home/article/14171904/membrane-cleaning-fundamentals-cleaning-criteria-and-normalization-of-reverse-osmosis-systems"
    note: "Cited in Chapter 9 for the typical cleaning triggers that membrane makers give, stated as ranges; the book tells readers to follow their own maker's limits."
  - title: "ASTM D4189 Standard Test Method for Silt Density Index (SDI) of Water; ASTM D4516 Standard Practice for Standardizing Reverse Osmosis Performance Data"
    creator: "ASTM International"
    year: "current editions"
    note: "Named by number and scope in Chapters 7 and 9. Paywalled; no clauses or values are quoted. The SDI arithmetic in Chapter 7 is the widely published plugging-index form."
  - title: "Model Code of Practice: Managing risks of hazardous chemicals in the workplace"
    creator: "Safe Work Australia"
    year: "current edition"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-hazardous-chemicals-workplace"
    note: "Named in Chapters 7 and 9 for the handling of cleaning acids, caustic, biocides and dechlorination chemicals. Readers check whether the code applies in their state or territory."
related:
  - title: "Electroplating by the Numbers"
    href: "/reados/publications/electroplating-by-the-numbers/"
  - title: "Process Steam by the Numbers"
    href: "/reados/publications/process-steam-by-the-numbers/"
  - title: "Centrifugal Pumps by the Numbers"
    href: "/reados/publications/centrifugal-pumps-by-the-numbers/"
  - title: "Diffusion by the Numbers"
    href: "/reados/publications/diffusion-by-the-numbers/"
  - title: "Entropy by the Numbers"
    href: "/reados/publications/entropy-by-the-numbers/"
  - title: "Cooling Towers by the Numbers"
    href: "/reados/publications/cooling-towers-by-the-numbers/"
---

## About this book

Reverse osmosis pushes water through a membrane that holds the salt back. The idea fits in a sentence, but every number that matters in a real plant comes from a short list of physical relations: the osmotic pressure of the water, the mass balances that concentrate it as it travels along the membranes, the proportionality between net driving pressure and flow, the way temperature changes the membrane, the thin layer of extra salt that forms at the membrane surface, and the solubility of the salts that end up in the concentrate. A plant that is designed, run and diagnosed with those relations in view rarely surprises its owner.

This book works through them one at a time. It starts with osmotic pressure and the recovery that a feed pressure allows, moves to flux, permeability and temperature, then to polarisation, scaling and the pretreatment that keeps a membrane alive. It finishes with the pump and the energy bill, measured against the thermodynamic least work of separation, and with the routine of normalising operating data and cleaning when the numbers say so.

It is for process, mechanical and maintenance engineers, water treatment operators, plant managers and students who know what a pump curve and a mass balance are. It assumes algebra and the ideas of pressure and concentration. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the BIZOMAT tool that performs the chapter's calculation where one exists, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one fictional plant. This is an illustration. A metal-finishing plant in a regional town draws brackish bore water for its rinse tanks, its powder-coat pretreatment line and a small steam boiler. The bore water is too salty to use directly, so the plant runs a reverse osmosis unit called BW-12.

- **Feed water:** 2,400 mg/L of dissolved solids from a balanced ion analysis: sodium 600, potassium 12, calcium 120, magnesium 80, chloride 1,060, sulfate 260 and bicarbonate 240 mg/L, with 28 mg/L of silica.
- **Duty:** 12.0 m³/h of permeate at 75% recovery, so 16.0 m³/h of feed and 4.0 m³/h of concentrate, for two shifts a day.
- **Membranes:** eighteen spiral-wound brackish-water elements of 37 m² each, 666 m² in all, in a two-to-one array: two pressure vessels of six elements in the first stage feeding one vessel of six in the second.
- **Design conditions:** 25 °C reference, with the feed tank swinging from about 18 °C in winter to 30 °C in summer.
- **Pressures at the design point:** 11.5 bar gauge at the membrane inlet, 3.0 bar of pressure drop along the twelve elements in series, and 0.5 bar gauge on the permeate to the storage tank.

The plant, its water analysis, the membrane data and any prices are invented. None describes BIZOMAT work or a real business. The element data are of the kind makers publish, not the data of any product.

## How to use the book

Read Chapters 1 to 3 in order: they set out osmotic pressure, the mass balances and the flux equation that every later chapter uses. Chapters 4 to 7 each take one practical limit (temperature, polarisation, scaling and fouling) and can be read in any order once Chapter 3 is understood. Chapters 8 and 9 deal with running the plant: energy, and the operating records that show when it needs cleaning.

Calculations use the same relations as the linked BIZOMAT tools: the van 't Hoff osmotic pressure with an osmotic coefficient, the log-mean concentration factor, and the membrane maker's temperature correction factor. Values are given to more figures than a measurement could justify, so that a reader can follow each step.

## Source limits and professional responsibility

The relations in this book are the simplified forms used for hand checks and first sizing. A real design is projected element by element with the membrane maker's software, using a full water analysis, the maker's own element data and its design limits. The book's hand calculations are a way to understand and check such a projection, not a replacement for it.

Water for drinking or food use, concentrate discharge and chemical handling are regulated. Discharge of saline concentrate needs the approval of the local water utility or environmental regulator, and cleaning and dosing chemicals are hazardous chemicals under work health and safety law. This book teaches how to calculate and check reverse osmosis processes. It is educational and is not a design for any plant.
