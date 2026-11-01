---
title: "Electronics Packaging by the Numbers"
subtitle: "Fitting boards, sensors, cables and antennas into a mechanical product that seals, stays cool and survives the plant"
description: "Package electronics in a mechanical product with numbers: board mounting and vibration, heat paths, sealing and venting, cables, antennas, compliance, testing and release."
category: Engineering
tags: [design, product-development, systems, validation, manufacturing]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Intermediate mechanical and product design"
audience: "Mechanical designers, product engineers and CAD users who must put circuit boards, sensors, cables and antennas into an enclosure and make the result seal, survive vibration and heat, and pass compliance."
outcomes:
  - "Turn an electronics brief into mechanical requirements for space, heat, sealing, mounting and connection."
  - "Exchange board outlines, keep-outs and height zones with the electronics designer and catch clashes early."
  - "Check board natural frequency, enclosure temperature, gasket compression and breathing with simple calculations."
  - "Choose connectors, cable entries and antenna positions that keep the product sealed and connected."
  - "Plan Australian compliance, prototype tests and a release package that production can build and test."
coverVariant: category
references:
  - title: "The Engineering Handbook for Designing Smart Connected Products"
    creator: "Chad Jackson, Lifecycle Insights (LC-Insights LLC)"
    year: "2018"
    note: "Supplied source, a 12-page industry eBook. Used only as a subject map: the new demands that sensors, circuit boards, harnesses and antennas place on mechanical teams and the need for close MCAD–ECAD integration. No text, figures or structure are reproduced; the case, calculations and method here are original."
  - title: "Vibration of Plates, NASA SP-160"
    creator: "Arthur W. Leissa, NASA"
    year: "1969"
    url: "https://ntrs.nasa.gov/citations/19700009156"
    note: "Public-domain reference for the classical natural-frequency solution of a thin rectangular plate simply supported on all edges, used in Chapter 3 as an upper bound for a circuit board."
  - title: "Fundamentals of Heat and Mass Transfer"
    creator: "Frank P. Incropera, David P. DeWitt, Theodore L. Bergman and Adrienne S. Lavine"
    year: "multiple editions"
    note: "Wiley textbook, named as the background for thermal-resistance networks and for the order of magnitude of free-convection coefficients in gases used in Chapter 4. No tables are reproduced; the coefficient used is a stated assumption."
  - title: "IEC 60529, Degrees of protection provided by enclosures (IP Code)"
    creator: "International Electrotechnical Commission"
    year: "current edition"
    note: "Named by number and scope only. Chapter 5 explains the structure of the IP code and the headline meaning of the digits; it quotes no test conditions."
  - title: "Recommendation ITU-R P.525, Calculation of free-space attenuation"
    creator: "International Telecommunication Union, Radiocommunication Sector"
    year: "current edition"
    url: "https://www.itu.int/rec/R-REC-P.525/en"
    note: "Reference for free-space path loss, used in Chapter 7 in its common form with distance in kilometres and frequency in megahertz."
  - title: "Know what you must do (supplier obligations)"
    creator: "Australian Communications and Media Authority"
    year: "current web page"
    url: "https://www.acma.gov.au/know-what-you-must-do"
    note: "Source for the supplier's duties summarised in Chapter 8: arrange testing, register as a responsible supplier on the national database, keep compliance records and label products."
  - title: "Electrical Equipment Safety System: in-scope equipment definitions"
    creator: "Electrical Regulatory Authorities Council"
    year: "current web page"
    url: "https://www.eess.gov.au/equipment/not-in-scope/"
    note: "Source for the statement in Chapter 8 that extra-low-voltage equipment, below 50 V a.c. or 120 V ripple-free d.c., is outside EESS scope but must still be electrically safe."
  - title: "IEC 60068 series, Environmental testing; IEC 61000-6-2 and IEC 61000-6-4, EMC generic standards for industrial environments; IEC 61000-4-2, electrostatic discharge immunity test; IEC 61076-2-101, M12 circular connectors"
    creator: "International Electrotechnical Commission"
    year: "current editions"
    note: "Named by number and scope only, as the families a test laboratory and supplier would discuss. No requirements or test levels are quoted."
  - title: "IEC 60028, International standard of resistance for copper"
    creator: "International Electrotechnical Commission"
    year: "1925, current edition"
    note: "Named as the basis of the annealed-copper resistivity of 0.017 241 Ω·mm²/m at 20 °C used in the cable voltage-drop calculation in Chapter 6."
related:
  - title: "Condensation Control by the Numbers"
    href: "/reados/publications/condensation-control-by-the-numbers/"
  - title: "Accelerated Life Testing by the Numbers"
    href: "/reados/publications/accelerated-life-testing-by-the-numbers/"
  - title: "Design Simulation by the Numbers"
    href: "/reados/publications/design-simulation-by-the-numbers/"
  - title: "Plastic Parts by the Numbers"
    href: "/reados/publications/plastic-parts-by-the-numbers/"
  - title: "Engineering Design Practice"
    href: "/reados/collections/engineering-design-practice/"
---

## About this book

More and more mechanical products now contain a circuit board, a sensor, a radio and a cable. A pump reports its bearing temperature. A conveyor gearbox sends its vibration level to a phone. A water tank tells its owner how full it is. Each of these products is still a mechanical object that has to be bolted down, sealed against rain, kept within its temperature limits and assembled on a bench. The electronics designer can make the board work. Making it survive in the product is mostly a mechanical job, and it is the mechanical designer who gets the call when water collects under the lid or the radio drops out.

This book is for mechanical designers, product engineers and CAD users who are asked to package electronics. You will learn to turn an electronics brief into mechanical requirements. You will exchange board data with the electronics designer, mount a board so that it does not resonate, follow the heat out of the enclosure, seal and vent the housing, bring cables in, place an antenna and plan compliance and tests. Each chapter takes one decision, explains the physics, works the decision through the running case with real numbers and ends with an exercise and its worked answer.

It assumes basic mechanics, heat transfer at the level of a first engineering course and working CAD skills. It assumes no electronics design experience. Where an electronics concept is needed, the chapter explains just enough of it to make the mechanical decision.

## The running case

The book follows a fictional **gearbox monitor**: a sensor node that bolts to the housing of the drive gearbox on an outdoor conveyor at a quarry in regional Australia. It measures housing vibration and temperature and sends summaries over the LTE-M cellular network. It has a die-cast aluminium base, a polycarbonate lid, a 4-layer circuit board 80 mm by 50 mm and an M12 connector bringing 24 V d.c. from the conveyor's control cabinet 25 m away. The enclosure is 110 mm by 70 mm by 45 mm. It must be rated IP66 and IP67, and it must work with the gearbox housing at up to 75 °C and the air at up to 40 °C.

All dimensions, loads, temperatures, test results, quantities and money values are invented for teaching. This is an illustration. None of it describes a KEVOS® project, product or measured result. Money is in Australian dollars, and each example says whether GST is included.

## How to use the book

Read the chapters in order the first time, because each one adds to the package decided in the chapters before it. Chapter 1 writes the brief, Chapters 2 to 7 settle the design and Chapters 8 to 10 prove and release it. Each chapter also stands alone as a reference when you meet the same decision on your own product.

## Source limits and professional responsibility

A short industry eBook on designing smart connected products was supplied for this book. It was used only to choose the subject: it describes how sensors, boards, harnesses and antennas are changing the work of mechanical teams. The structure, case, calculations, figures and exercises here are original. Physical relationships are attributed to public references, and standards are named by number and scope only, without quoted values.

This book is educational. The calculations are simplified models with stated assumptions, and the material properties are illustrative unless a source is given. Products for hazardous areas, mining equipment under specific regulation, medical use, mains-powered equipment and safety functions carry requirements beyond its scope. Qualified review, the suppliers' current data, an accredited test laboratory and the regulator's own guidance govern real products.
