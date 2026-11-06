---
title: "Brazing and Soldering by the Numbers"
subtitle: "Capillary joints from first principles: wetting, gaps, fluxes, fillers, heating, strength, inspection and cost, from the 1910 brazing hearth to lead-free solder"
description: "Design and make brazed and soldered joints with numbers: capillary flow and joint gaps, thermal expansion, lap length, fluxes, filler and solder alloys, heating, fume and cost."
category: Manufacturing
tags: [manufacturing, design, quality, process-improvement, operations]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-25
referencesChecked: 2026-10-25
edition: "1"
level: "Intermediate fabrication, maintenance and manufacturing engineering"
audience: "Fabricators, maintenance fitters, manufacturing engineers and designers who braze or solder metal parts, or design parts to be brazed or soldered, and want to understand why the rules work."
outcomes:
  - "Explain how wetting and capillary flow fill a joint, and why gap size matters."
  - "Set a joint clearance that allows for thermal expansion at brazing temperature."
  - "Size a lap or socket joint from the strengths of the filler and the parts."
  - "Choose a flux or atmosphere, a filler metal or solder, and a heating method for a joint."
  - "Control the fume, burn and fire hazards of brazing and soldering, and cost a joint."
coverVariant: category
references:
  - title: "Welding: theory, practice, apparatus and tests; electric, thermit and hot-flame processes"
    creator: "Richard N. Hart (McGraw-Hill, New York)"
    year: "1910"
    note: "Historical source for its chapter on brazing and soldering: borax and its calcining, spelter compositions, the brick hearth and gas-air burners, dip brazing, graphite protection of brass, soldering bits and fluxes, and the composition of common and fusible solders. Summarised and checked in new words; no text, tables or illustrations are reproduced."
  - title: "Electric Welding"
    creator: "Douglas T. Hamilton and Erik Oberg (The Industrial Press, New York)"
    year: "1918"
    note: "Historical source for its chapter on electric resistance soldering of small parts, including its energy use per joint, joint time and the retention of temper. Summarised in new words."
  - title: "Welding: a practical treatise on the applications of electric, gas and thermit welding"
    creator: "George W. Cravens (American Technical Society, Chicago)"
    year: "1921"
    note: "Historical source for soldering and brazing practice, solder melting temperatures, fluxes, and the difficulty of soldering aluminium at the time. Summarised in new words."
  - title: "Phase diagrams for lead-free solder alloys: Pb-Sn and Ag-Cu-Sn systems"
    creator: "National Institute of Standards and Technology, Metallurgy Division"
    year: "online reference"
    url: "https://www.metallurgy.nist.gov/phase/solder/solder.html"
    note: "Source for the tin-lead eutectic at 182.2 °C and 62.13% tin by mass, and the tin-silver-copper ternary eutectic at 215.9 °C with about 3.73% silver and 0.85% copper by mass, cited in Chapter 7."
  - title: "The effect of joint clearance on braze joint strength"
    creator: "Lucas-Milhaupt"
    year: "online reference"
    url: "https://blog.lucasmilhaupt.com/en-us/about/blog/joint-clearance-and-joint-strength"
    note: "Filler maker's guidance on joint clearance by filler family, including a general recommendation of about 0.05 to 0.13 mm for flux brazing, cited in Chapters 2 and 3."
  - title: "Brazing"
    creator: "The Open University, OpenLearn"
    year: "online reference"
    url: "https://www.open.edu/openlearn/science-maths-technology/engineering-technology/brazing"
    note: "Source for the 450 °C boundary for brazing fillers, joint gaps and brazing temperatures for several filler families, flux activity range and flux types by temperature, and heating methods, cited in Chapters 1, 5, 6 and 8. The page notes that it may be out of date."
  - title: "NIOSH Pocket Guide to Chemical Hazards: cadmium"
    creator: "National Institute for Occupational Safety and Health (US)"
    year: "online reference"
    url: "https://www.cdc.gov/niosh/npg/npgd0087.html"
    note: "Source for cadmium's listing as a potential occupational carcinogen and its target organs, cited in Chapters 6 and 10."
  - title: "Model Code of Practice: Welding processes"
    creator: "Safe Work Australia"
    year: "current edition"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-welding-processes"
    note: "Named in Chapter 10 as the model code covering fume and other hazards of welding and allied processes. Check which version applies in your jurisdiction."
related:
  - title: "Weldability by the Numbers"
    href: "/reados/publications/weldability-by-the-numbers/"
  - title: "Industrial Gases by the Numbers"
    href: "/reados/publications/industrial-gases-by-the-numbers/"
  - title: "Choosing a joining method"
    href: "/reados/collections/machine-elements-and-mechanical-design/choosing-a-joining-method/"
---

## About this book

Brazing and soldering are the quiet joining processes. They join copper pipes in every building, wires on every circuit board, carbide tips on saw blades, tubes in heat exchangers and refrigeration coils, and broken castings in repair shops. They melt a filler metal into a joint without melting the parts, and the filler is drawn in by capillary action, so the joint depends on things that cannot be seen: the gap, the cleanliness of the surfaces, the flux, the temperature and the time.

This book is for fabricators, maintenance fitters, manufacturing engineers and designers who braze or solder, or design parts to be brazed or soldered. It assumes basic physics and algebra in SI units. It explains, with numbers, why the rules of good practice work: why the gap must be small but not too small, why clearances change at brazing temperature, how long a lap must be, what flux does, how filler metals and solders are chosen, how much heat a joint needs, and how to keep the fume and fire hazards under control.

## Early manuals as a starting point

The welding manuals of the early twentieth century treated brazing and soldering as close relatives of welding, often in the same chapter. Richard N. Hart's *Welding* of 1910 described brazing with spelter and borax on a brick hearth with gas-air burners, dip brazing in a bath of molten spelter, and soldering with a copper bit and zinc chloride flux. Douglas T. Hamilton and Erik Oberg's *Electric Welding* of 1918 described resistance soldering of spectacle frames, joint by joint, in a few seconds each. George W. Cravens's *Welding* of 1921 summarised solders, fluxes and brazing practice, and noted that aluminium could not yet be soldered commercially.

Much of what they taught still holds, and some of it has been overturned. Each chapter takes one of their themes, checks it against modern understanding and applies it to a modern workshop.

## The running case

This is an illustration. A small manufacturer makes copper and brass manifolds for hydronic heating systems, brazes copper tube into brass fittings and steel headers, solders electrical connections on its control boxes, and re-tips carbide cutting tools for a local machine shop. It has had leaks in the field, a run of cracked carbide tips and a question from a customer about lead in its solder, and its production manager wants to understand the processes well enough to fix them.

The business, its products, prices and failures are invented for teaching. They are not BIZOMAT work. Real brazed and soldered products for pressure, potable water, electrical or safety-critical service must meet the applicable standards and regulations.

## How to use the book

Chapter 1 defines brazing and soldering and why they work. Chapters 2 to 4 cover wetting and capillary flow, joint clearance and thermal expansion, and joint design and strength. Chapter 5 deals with fluxes and atmospheres, Chapter 6 with brazing filler metals and Chapter 7 with solders. Chapter 8 compares heating methods, Chapter 9 the difficult metals, and Chapter 10 inspection, hazards and cost. Every chapter ends with an exercise and its worked answer.

## Limits and professional responsibility

This book is educational. Brazing and soldering involve heat, flame, fume and chemicals that can cause burns, fires and serious illness. Some filler metals contain cadmium or lead, and some fluxes contain fluorides; their fume and residues are hazardous. Work must follow the safety data sheets for each filler and flux, the equipment makers' instructions, and the work health and safety regulator's requirements, including Safe Work Australia's model code of practice for welding processes as adopted in each jurisdiction. Joints for pressure equipment, gas, potable water and electrical installations are subject to their own standards, codes and licensing, which govern.

## An original treatment

The Library introduces brazing and soldering briefly in [Choosing a joining method](/reados/collections/machine-elements-and-mechanical-design/choosing-a-joining-method/), and discusses brazing for copper, cast iron and dissimilar metals in Weldability by the Numbers. This book goes further into the processes themselves. The explanations, the manufacturer's case, the calculations, figures and exercises are original BIZOMAT writing. The historical manuals are public-domain works in the United States; their facts are summarised, checked and corrected in new words, and none of their text, tables or illustrations is reproduced.
