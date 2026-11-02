---
title: "Distribution Transformers by the Numbers"
subtitle: "Magnetism, cores, windings, faults, heat, insulation life, losses, noise and specification for the transformer that feeds a factory"
description: "How a factory's distribution transformer works and how to load, cool, protect, buy, test and maintain it with numbers: core and winding losses, fault levels, hot spots, ageing and loss costs."
category: Engineering
tags: [design, operations, finance, validation]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-11-02
referencesChecked: 2026-11-02
edition: "1"
level: "Intermediate engineering and facilities management"
audience: "Electrical, mechanical, maintenance and facilities engineers, plant managers and owners of sites with their own high-voltage supply who load, extend, buy, test or maintain a distribution transformer and want to check the numbers themselves."
outcomes:
  - "Explain why iron is magnetic, how a transformer's core and windings turn one voltage into another, and where its no-load and load losses come from."
  - "Work out a transformer's currents, voltage regulation, tap settings, fault currents and inrush, and check them against the loads and switchgear."
  - "Estimate oil and hot-spot temperatures, room ventilation and the rate of insulation ageing for a real load profile."
  - "Compare transformers by the cost of their losses over their life, and check minimum energy performance and noise requirements."
  - "Specify, test, commission and maintain a distribution transformer, and read oil tests, thermography and factory test results."
coverVariant: category
references:
  - title: "Elementary Condensed Matter Physics (lecture notes)"
    creator: "A. H. Castro Neto"
    year: "2003"
    note: "Copyright work, used only as a map of ideas: magnetism in solids, magnetic order and its loss at a transition temperature, free electrons and their scattering, and the effect of disorder on electrons in solids. No text, equations as set out there, figures or problems are reproduced, and all cases and calculations are KEVOS® originals."
  - title: "Greenhouse and Energy Minimum Standards (Power Transformers) Determination 2012"
    creator: "Commonwealth of Australia, Federal Register of Legislation F2012L02135"
    year: "2012"
    url: "https://www.legislation.gov.au/F2012L02135"
    note: "Read for Chapter 8: it applies AS 2374.1.2-2003, the minimum energy performance standard for distribution transformers, to power transformers rated 10 kVA to 2,500 kVA with a highest system voltage up to 24 kV, oil-immersed and dry-type. Check the current version of the instrument before relying on it."
  - title: "Introduction to Magnetic Materials, second edition"
    creator: "B. D. Cullity and C. D. Graham, Wiley-IEEE Press"
    year: "2009"
    note: "Background for ferromagnetism, domains, saturation, the Curie temperature, magnetostriction and the losses of soft magnetic materials in Chapters 1, 3 and 9."
  - title: "The J & P Transformer Book, thirteenth edition"
    creator: "M. J. Heathcote, Newnes"
    year: "2007"
    note: "Background for transformer construction, losses, impedance, short-circuit forces, inrush, cooling, testing and maintenance in Chapters 2 to 6 and 10."
  - title: "Transformer Engineering: Design and Practice"
    creator: "S. V. Kulkarni and S. A. Khaparde, Marcel Dekker"
    year: "2004"
    note: "Background for core design, stray and eddy losses in windings, the effect of harmonic currents and thermal design in Chapters 3, 4, 6 and 9."
  - title: "Loading transformers by temperature"
    creator: "V. M. Montsinger, Transactions of the American Institute of Electrical Engineers 49(2), 776–792"
    year: "1930"
    note: "Named in Chapter 7 as the early work relating the ageing of transformer insulation to its temperature by a fixed doubling interval. The interval used in the case is a stated assumption, not taken from this paper."
related:
  - title: "Variable-Speed Drives by the Numbers"
    href: "/reados/publications/variable-speed-drives-by-the-numbers/"
  - title: "Industrial Electric Heating by the Numbers"
    href: "/reados/publications/industrial-electric-heating-by-the-numbers/"
  - title: "Permanent Magnets in Machines by the Numbers"
    href: "/reados/publications/permanent-magnets-in-machines-by-the-numbers/"
  - title: "Eddy Current Inspection by the Numbers"
    href: "/reados/publications/eddy-current-inspection-by-the-numbers/"
  - title: "Machine Noise Control by the Numbers"
    href: "/reados/publications/machine-noise-control-by-the-numbers/"
  - title: "Accelerated Life Testing by the Numbers"
    href: "/reados/publications/accelerated-life-testing-by-the-numbers/"
---

## About this book

A factory that takes its electricity at high voltage owns the transformer that turns 11 kV or 22 kV into the 400 V its machines use. That transformer is usually the most important and least considered piece of equipment on the site: a steel tank of oil in a substation room or kiosk, humming quietly for thirty years. Every kilowatt the factory uses passes through it, it costs money in losses every hour of every day, and if it fails the whole site stops until a replacement can be found, which can take months.

This book explains distribution transformers from the atoms up. It starts with why iron is magnetic, then works through how turns and flux set the voltage, where the core's losses come from, the windings and their load losses, short circuits and switching on, heat and cooling, and the ageing of the paper insulation that sets the transformer's life. It finishes with the cost of losses, harmonics and noise, and how to specify, test and maintain a transformer.

It is for electrical, mechanical, maintenance and facilities engineers, plant managers and owners. It assumes engineering or trade training and comfort with power, voltage, current and simple algebra; the physics is explained as it is used. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the KEVOS® tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one transformer. This is an illustration. A frozen vegetable processing plant in Devonport, Tasmania, takes its supply at 11 kV and owns its substation. Its transformer, called TX-1 in this book, is:

- **Rating:** 1,500 kVA, three-phase, 11,000 V to 433 V at no load, vector group Dyn11, off-circuit tap changer with five positions in 2.5% steps.
- **Construction:** oil-immersed, naturally cooled (ONAN), mineral oil, sealed tank with radiators, built in 1996.
- **Test report values:** impedance 5.0%, no-load loss 2.40 kW, load loss 16.5 kW at rated current, top-oil temperature rise 52 K and winding gradient 14 K at rated load.
- **Location:** a brick substation room beside the main switchboard, with intake louvres and an extraction fan rated 9,000 m³/h.
- **Load:** a peak of 1,175 kVA today; a new spiral freezing tunnel will add about 346 kVA, taking the peak to about 1,520 kVA.

The plant must decide whether TX-1 can carry the tunnel, and if not, what should replace it. The chapters build the answer.

Ratings, losses, temperatures, prices, tariffs, test results and oil analyses are the plant's working figures or are calculated from stated assumptions. They do not describe KEVOS® work or any real business, transformer maker, network or supplier. Prices are in Australian dollars excluding GST, because a GST-registered business claims the GST back on its costs.

## How to use the book

Chapters 1 to 3 explain the magnetic core, Chapters 4 to 7 the windings, faults, heat and insulation life, and Chapters 8 to 10 the economics, noise and harmonics, and the specification and care of a transformer. Read Chapter 1 first if the physics is new; the others stand on their own once the case is familiar.

Each chapter links the KEVOS® calculators it uses. The tools do the arithmetic; the chapter explains what the inputs mean and where they come from. Every result in the text was checked by calculation, and the numbers in figures match the text.

## Limits and responsibility

This book is educational. High-voltage installations are dangerous and regulated. Work on transformers, switchgear and their protection must be done by appropriately authorised and licensed people, to the applicable Australian standards, the wiring rules, the network's connection requirements and the site's high-voltage operating procedures, under a safe system of work. Loading beyond nameplate rating, protection settings and replacement decisions must be made with the transformer maker's data and qualified engineering review. Standards are named by number and scope only. Datasheet values, temperatures, test results and costs in the case are illustrations; use the manufacturer's documents and measured data for real work.
