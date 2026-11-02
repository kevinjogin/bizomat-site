---
title: "Bulk Solids Flow by the Numbers"
subtitle: "Storing and discharging powders and pellets: density, friction, silo pressures, flow patterns, outlets and discharge rates, worked through one compounding plant"
description: "Why powders and pellets behave unlike liquids, and how to size and run bins and silos so they hold what they should, discharge reliably and do not arch, rathole or segregate."
category: Engineering
tags: [design, manufacturing, operations]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-31
referencesChecked: 2026-10-31
edition: "1"
level: "Intermediate mechanical and process engineering"
audience: "Mechanical, process and plant engineers, production and maintenance supervisors, and students who specify, buy, modify or run bins, hoppers and silos for powders, pellets and granules."
outcomes:
  - "Explain why a bulk solid carries load by friction and force chains, so its pressures and discharge rate do not follow liquid rules."
  - "Use poured, tapped and consolidated bulk density correctly for capacity, and read the Hausner ratio as a first flowability check."
  - "Read shear and wall friction test results and use them to calculate Janssen pressures in a silo."
  - "Tell mass flow from funnel flow, and check a hopper's wall angle and outlet size against arching and ratholing."
  - "Estimate the discharge rate of a coarse material through an outlet, and know why fine powders discharge more slowly."
  - "Recognise segregation, flow aid misuse and the safety hazards of silos, and plan inspections and corrections."
coverVariant: category
references:
  - title: "Statistical Physics: Statics, Dynamics and Renormalization"
    creator: "L. P. Kadanoff, World Scientific, Singapore (ISBN 981 02 3758 8)"
    year: "2000"
    note: "Supplied source, in copyright. Read only as a subject map: many-particle systems, fluctuations, self-organised criticality and the experimental studies of granular materials it reprints. It is a physics text; no text, equations, figures, examples or exercises are reproduced or adapted, and the engineering treatment, running case and numbers in this book are original."
  - title: "Granular solids, liquids, and gases"
    creator: "H. M. Jaeger, S. R. Nagel and R. P. Behringer, Reviews of Modern Physics, vol. 68, pp. 1259–1273"
    year: "1996"
    url: "https://doi.org/10.1103/RevModPhys.68.1259"
    note: "Review of the physics of granular materials: force chains, dilatancy, pressure saturation in containers, discharge through an orifice and segregation. Used for the physical explanations in Chapters 1, 3 and 10; described, not quoted."
  - title: "Self-organized criticality: an explanation of the 1/f noise"
    creator: "P. Bak, C. Tang and K. Wiesenfeld, Physical Review Letters, vol. 59, pp. 381–384"
    year: "1987"
    url: "https://doi.org/10.1103/PhysRevLett.59.381"
    note: "The sandpile model of avalanches, used in Chapter 3 to explain why a heap fails in slips of every size. Described, not quoted."
  - title: "Density relaxation in a vibrated granular material"
    creator: "J. B. Knight, C. G. Fandrich, C. N. Lau, H. M. Jaeger and S. R. Nagel, Physical Review E, vol. 51, pp. 3957–3963"
    year: "1995"
    url: "https://doi.org/10.1103/PhysRevE.51.3957"
    note: "Experiments showing that a tapped granular column compacts slowly, roughly with the logarithm of the number of taps. Used qualitatively in Chapter 2."
  - title: "Experiments on corn pressure in silo cells: translation and comment of Janssen's paper from 1895"
    creator: "M. Sperl, Granular Matter, vol. 8, pp. 59–65"
    year: "2006"
    url: "https://doi.org/10.1007/s10035-005-0224-z"
    note: "English translation and commentary of H. A. Janssen's 1895 paper on grain pressures in silos, the origin of the pressure equation derived independently in Chapter 5."
  - title: "The flow of granular solids through orifices"
    creator: "W. A. Beverloo, H. A. Leniger and J. van de Velde, Chemical Engineering Science, vol. 15, pp. 260–269"
    year: "1961"
    url: "https://doi.org/10.1016/0009-2509(61)85030-6"
    note: "Origin of the discharge-rate correlation used in Chapter 9. The commonly cited constants (C about 0.58, k about 1.4 and up to about 3 depending on particle shape) are used as stated there, with the correlation's limits."
  - title: "Storage and Flow of Solids, Bulletin 123"
    creator: "A. W. Jenike, Utah Engineering Experiment Station, University of Utah"
    year: "1964"
    note: "The founding method for mass-flow hopper design, flow functions, flow factors and critical outlet dimensions. Its design charts are not reproduced; Chapters 6 to 8 explain the method and use illustrative test-report values."
  - title: "Powders and Bulk Solids: Behavior, Characterization, Storage and Flow"
    creator: "D. Schulze, Springer, Berlin"
    year: "2008"
    url: "https://doi.org/10.1007/978-3-540-73768-1"
    note: "Textbook reference for shear testing, flowability classification by the ratio of consolidation stress to unconfined yield strength, wall friction, flow patterns and flow aids. Used for orientation; nothing is reproduced."
  - title: "The coefficient of earth pressure at rest"
    creator: "J. Jáky, Journal of the Society of Hungarian Architects and Engineers"
    year: "1944"
    note: "Origin of the approximation K = 1 − sin φ for the ratio of horizontal to vertical stress in a granular fill, used for the Janssen calculations in Chapter 5."
  - title: "Friction conditions in a mass of metal powder"
    creator: "H. H. Hausner, International Journal of Powder Metallurgy, vol. 3, no. 4, pp. 7–13"
    year: "1967"
    note: "Origin of the ratio of tapped to poured bulk density used as a flowability indicator in Chapter 2."
  - title: "AS 3774, Loads on bulk solids containers"
    creator: "Standards Australia"
    year: "Current edition"
    note: "Named by number and scope only, as the Australian standard for structural loads on bins and silos, including filling, discharge and eccentric discharge loads. No values or factors from it are quoted."
  - title: "EN 1991-4, Eurocode 1: Actions on structures, Part 4: Silos and tanks"
    creator: "European Committee for Standardization"
    year: "Current edition"
    note: "Named by number and scope only, as a widely used code for silo loads. No values or factors from it are quoted."
  - title: "ASTM D6128 (Jenike shear tester) and ASTM D6773 (Schulze ring shear tester), standard test methods for shear testing of bulk solids"
    creator: "ASTM International"
    year: "Current editions"
    note: "Named by number and scope only, as the test methods behind the flow function and wall friction results discussed in Chapters 4 and 7."
  - title: "ASTM D6940 and ASTM D6941, standard practices for measuring sifting and fluidization segregation tendencies of bulk solids"
    creator: "ASTM International"
    year: "Current editions"
    note: "Named by number and scope only in Chapter 10, as laboratory tests that rank a material's tendency to segregate. No procedures or values are quoted."
  - title: "The segregation of particulate materials. A review"
    creator: "J. C. Williams, Powder Technology, vol. 15, pp. 245–251"
    year: "1976"
    url: "https://doi.org/10.1016/0032-5910(76)80053-8"
    note: "Review of segregation mechanisms (sifting, trajectory, air entrainment and others) used for the classification in Chapter 10. Described, not quoted."
  - title: "ISO 60, Plastics: Determination of apparent density of material that can be poured from a specified funnel"
    creator: "International Organization for Standardization"
    year: "Current edition"
    note: "Named by number and scope only in Chapter 2, as a standard method for the poured bulk density of plastics granules. No values are quoted."
  - title: "Model Code of Practice: Confined spaces"
    creator: "Safe Work Australia"
    year: "2020"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-confined-spaces"
    note: "Cited in Chapter 11 because the inside of a bin or silo is typically a confined space. The book does not set out entry procedures; this code, the site's procedures and competent people do."
  - title: "AS/NZS 60079.10.2, Explosive atmospheres: Classification of areas, Explosive dust atmospheres"
    creator: "Standards Australia and Standards New Zealand"
    year: "Current edition"
    note: "Named by number and scope only, as the standard for classifying areas where combustible dust can form an explosive atmosphere, discussed in Chapter 11. No values are quoted."
  - title: "AS/NZS 4024 series, Safety of machinery"
    creator: "Standards Australia and Standards New Zealand"
    year: "Current editions"
    note: "Named by number and scope only in Chapter 11, as the standards covering guarding and safety-related controls for feeders and rotary valves. Nothing is quoted."
related:
  - title: "Tanks and Hoppers by the Numbers"
    href: "/reados/publications/tanks-and-hoppers-by-the-numbers/"
  - title: "Fine Particles by the Numbers"
    href: "/reados/publications/fine-particles-by-the-numbers/"
  - title: "Plastic Parts by the Numbers"
    href: "/reados/publications/plastic-parts-by-the-numbers/"
  - title: "Scale Models by the Numbers"
    href: "/reados/publications/scale-models-by-the-numbers/"
  - title: "Blending Bulk Solids by the Numbers"
    href: "/reados/publications/blending-bulk-solids-by-the-numbers/"
---

## About this book

A bin of pellets or powder looks like a tank of liquid that happens to be dry. It is not. A bulk solid holds itself up by friction, so the pressure at the bottom of a tall silo stops rising after a few diameters of depth. It can stand in a steep heap, bridge across an outlet or leave a stable hole down its middle. It flows out of an outlet at a rate that hardly depends on how full the bin is. It sorts itself by size when it is poured, shaken or discharged. Each of these behaviours has caused stopped production lines, damaged silos and injuries, and each can be predicted with a few measurements and some straightforward arithmetic.

This book teaches that arithmetic for practical use. It starts with the physical reasons a granular material behaves as it does, then works through bulk density and compaction, the angle of repose, internal and wall friction, and the Janssen pressures in a silo. It then covers the two flow patterns, mass flow and funnel flow, and the checks that decide whether a hopper will arch or rathole. It ends with discharge rates, segregation and the safe running of a storage system.

It is for mechanical, process and plant engineers, production and maintenance supervisors, and students who specify, buy, modify or run bins and silos. It assumes algebra, basic statics and friction, and the idea of stress as force per area. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one fictional plant. This is an illustration. Plant C compounds polypropylene with up to 30% calcium carbonate filler and sells the result as pellets to injection moulders. Two stores feed its extrusion line.

- **Silo S1, polypropylene pellets.** A 304 stainless steel silo with a mill (2B) finish: 3.2 m diameter, a 9.0 m cylinder and a conical hopper 2.6 m high, at 60° to the horizontal, down to a 200 mm outlet with a slide gate and rotary valve. It is filled by blowing pellets from road tankers into a central inlet in the roof. The pellets are cylinders about 3.5 mm long weighing 24 mg each, with a particle density of 905 kg/m³ and a measured poured bulk density of 545 kg/m³.
- **Bin B2, calcium carbonate filler.** A 304 stainless bin, 1.6 m in diameter, with a 1.5 m cylinder and a 60° cone to a 150 mm outlet over a screw feeder. It is filled from one-tonne bulk bags. The filler is a ground calcium carbonate with a median particle size of about 3 µm, a poured bulk density of 650 kg/m³ and a tapped bulk density of 1,000 kg/m³.

S1 has worked well since it was installed. B2 has not: it stops feeding several times a shift and is cleared by an operator hitting the cone with a mallet. The plant's engineer is asked to explain both and to fix B2.

The plant, its equipment and every measurement and test result are invented. None describes KEVOS® work, a real plant or a real supplier's product.

## How to use the book

Read Chapters 1 to 5 in order: they set out the properties every later chapter uses, and the pressures in a silo. Chapters 6 to 9 cover flow: the two flow patterns, arching, ratholes and flow aids, and discharge rates. Chapter 10 deals with segregation and Chapter 11 with the inspection and safe running of bins and silos.

KEVOS® tools are linked where they perform a step of the method, with a note of exactly what each one calculates and where its model stops. Where a tool solves a related problem rather than the chapter's own, the text says so.

## Source limits and professional responsibility

The relations in this book are the standard engineering models of bulk solids: Janssen's pressure equation, Jenike's arching method and Beverloo's discharge correlation. They are well tested within their assumptions and each chapter states those assumptions. Hopper design charts, flow factors and silo load factors belong to the original methods and to standards such as AS 3774. They are named here, not reproduced, and the illustrative test results in the running case are not values for any real material.

Silos fail structurally, collapse when a rathole or arch gives way, engulf people who enter them and can contain explosive dust clouds. The design, modification, inspection and entry of real bins and silos are matters for competent engineers and trained people under the relevant standards, the equipment maker's instructions and Australian work health and safety law. This book is educational. It explains how bulk solids behave and how the standard checks work; it is not a design for any bin or silo or a substitute for testing a real material.
