---
title: "Louvres and Ventilators by the Numbers"
subtitle: "Free area, blade geometry, pressure drop, rain, mesh, natural ventilation, movable blades and frames, worked through one compressor plant room"
description: "Design and make weather louvres by numbers: airflow and free area, blade pitch and overlap, pressure drop, rain penetration, mesh, stack ventilation, movable blades, wind loads and cut lists."
category: Engineering
tags: [design, manufacturing, quality]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Intermediate building services and sheet metal design"
audience: "Sheet metal fabricators, building services and plant room designers, drafters and maintenance engineers who size, detail, make or check weather louvres, ventilators and movable louvres."
outcomes:
  - "Work out the airflow a plant room needs from its heat load and size a louvre's free area for a chosen free-area velocity."
  - "Set blade pitch, angle and overlap so that a louvre blocks sightlines and sheds rain, and develop the formed blade for cutting."
  - "Estimate a louvre's pressure drop and its effect on the fan, and read published rain penetration ratings correctly."
  - "Account for bird and insect mesh, and calculate stack-driven airflow through a pair of louvres."
  - "Lay out a movable louvre's linkage and actuator, check blades and mullions for wind, and produce a cut list."
coverVariant: category
references:
  - title: "Home Instruction for Sheet Metal Workers"
    creator: "William Neubecker, edited by Frank X. Morio, U. P. C. Book Company, New York"
    year: "1922"
    note: "Supplied source, read as a subject map of the stationary and movable louvres, posts, curbs, quadrant-operated blades and ventilators that sheet metal shops made by hand. Its engravings, imperial examples, sequences and prose are not reproduced; this book expresses the subject as modern calculations in SI units, with its own case, figures and exercises."
  - title: "AMCA Standard 500-L, Laboratory Methods of Testing Louvers for Rating; and an example manufacturer louvre catalogue published under AMCA's Certified Ratings Program"
    creator: "Air Movement and Control Association International"
    year: "current edition; catalogue 2009"
    url: "https://z1.grr.object.ussignal.com/AMCA_PROD/CRP/4024/12549.0/Catalog/LSA6D38%20June%202009.pdf"
    note: "The standard is named by number and scope only. Published catalogues tested to it define the beginning point of water penetration as the free-area velocity at which 0.01 oz of water per square foot of free area (about 3 g/m²) penetrates in a 15-minute test; that definition and the range of catalogue values quoted in Chapter 4 come from such catalogues."
  - title: "Louvre specifications"
    creator: "Designing Buildings Wiki"
    year: "current web page"
    url: "https://www.designingbuildings.co.uk/wiki/Louvre%20specifications"
    note: "Source for the EN 13030 rain test conditions (13 m/s wind, 75 L/h per m² of rain, airflow varied up to 3.5 m/s) used in Chapter 4. EN 13030 itself is named by number only."
  - title: "Weather louvre testing: what is EN 13030?"
    creator: "HVC Supplies"
    year: "current web page"
    url: "https://h-v-c.com/weather-louvre-test-en-130130"
    note: "Manufacturer's summary of the EN 13030 rain defence classes A to D (99%, 95% to 98.9%, 80% to 94.9%, below 80%) and their ingress ranges, used in Chapter 4."
  - title: "Stack effect"
    creator: "Wikipedia"
    year: "current article"
    url: "https://en.wikipedia.org/wiki/Stack_effect"
    note: "Source of the orifice form of the stack flow equation and the discharge coefficient of about 0.65 to 0.70 used in Chapter 6."
  - title: "NCC 2022 Housing Provisions, Part 10.6 Ventilation"
    creator: "Australian Building Codes Board"
    year: "2022"
    url: "https://ncc.abcb.gov.au/editions/ncc-2022/adopted/housing-provisions/10-health-and-amenity/part-106-ventilation"
    note: "Source of the 5% ventilating area quoted in Chapter 6 as a comparison for habitable rooms in houses; it does not govern a plant room."
  - title: "AS 1668.2 Mechanical ventilation in buildings; AS 1668.4 Natural ventilation of buildings; AS/NZS 1170.2 Wind actions"
    creator: "Standards Australia and Standards New Zealand"
    year: "current editions"
    note: "Named by number and scope only. No values or clauses are quoted; the ventilation rates, pressures and wind loads in this book are labelled teaching values or derived from the case's own heat load."
related:
  - title: "Ductwork by the Numbers"
    href: "/reados/publications/ductwork-by-the-numbers/"
  - title: "Architectural Sheet Metal by the Numbers"
    href: "/reados/publications/architectural-sheet-metal-by-the-numbers/"
  - title: "Sheet Metal Parts by the Numbers"
    href: "/reados/publications/sheet-metal-parts-by-the-numbers/"
---

## About this book

A louvre looks like the simplest thing in a building: a frame full of sloping blades in a hole in a wall. It has to let a known flow of air through without too much resistance, keep out the rain that wind drives at it, keep out birds and, sometimes, insects, block the view into a plant room, stand up to the wind, and sometimes open and close on command. Each of those jobs can be calculated, and a louvre that has not been calculated usually fails at one of them: the plant room overheats, rain soaks the switchboard, the fans howl, or the blades rattle loose in the first storm.

This book designs louvres and ventilators by numbers. It starts with the airflow a room needs and the free area that will pass it, sets out the geometry of the blades and develops the formed blade for cutting, estimates the pressure drop and its effect on the fans, reads published rain ratings correctly, deals with mesh, calculates natural ventilation by the stack effect, lays out the linkage of a movable louvre and finally checks the blades and frame for wind and produces a cut list. Every chapter works one problem through the running case, shows how an error is caught and ends with an exercise and its worked answer.

## Prerequisites and how to use the book

It assumes basic algebra and trigonometry and some familiarity with folded sheet metal. Chapters 1 to 3 cover airflow, blades and pressure; Chapters 4 and 5 rain and mesh; Chapter 6 natural ventilation; Chapter 7 movable louvres; and Chapter 8 frames, wind loads and fabrication. Duct friction, fittings and fan curves are covered in *Ductwork by the Numbers*, and folded profiles in *Architectural Sheet Metal by the Numbers*; this book links to them rather than repeating them.

## The running case

The book follows **PR-30**, the fictional compressor plant room of a small food factory. The room is 6.0 m by 5.0 m in plan and 4.0 m high, with one external wall facing south and another facing east. It houses two screw air compressors and a refrigerated air dryer, which together release about **36 kW** of heat into the room when running. Fresh air enters through a fixed weather louvre, **2,400 mm wide by 1,500 mm high**, low in the south wall. Two wall fans exhaust warm air through a motorised louvre high in the east wall. When the compressors stop, the motorised louvre opens and the room ventilates naturally.

All dimensions, loads, prices and results are invented for teaching. This is an illustration. None of it describes a BIZOMAT client, supplier or project. Air is taken at 35 °C, the summer design outdoor temperature in the case, with a density of about 1.15 kg/m³ and a specific heat of about 1.006 kJ/kg·K.

## Source limits and professional responsibility

The supplied 1922 trade course informed the range of subjects: stationary and movable louvres, posts and curbs, quadrant-operated blades and ventilators. The methods here are modern restatements with original examples. This book is educational. Ventilation of real plant rooms must meet the National Construction Code, the AS 1668 series, the equipment makers' installation requirements and any hazardous-area or fire rules that apply; wind loads come from AS/NZS 1170.2. Louvre performance should be taken from the maker's tested data, and real designs should be prepared or checked by a competent person.
