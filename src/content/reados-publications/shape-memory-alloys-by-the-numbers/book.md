---
title: "Shape Memory Alloys by the Numbers"
subtitle: "Designing with nickel-titanium wire actuators and superelastic parts: transformation temperatures, stress, stroke, bias springs, heating, cooling and fatigue"
description: "Design with nickel-titanium shape memory wire and superelastic parts using numbers: transformation temperatures, stress shifts, stroke, bias springs, current, cooling and fatigue."
category: Engineering
tags: [design, product-development, automation, quality]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-27
referencesChecked: 2026-10-27
edition: "1"
level: "Intermediate mechanical and mechatronic design"
audience: "Mechanical and mechatronic designers, product engineers and automation engineers who are considering shape memory wire actuators or superelastic parts and want to size them from published data."
outcomes:
  - "Explain what martensite and austenite are and how they give shape memory and superelasticity."
  - "Choose a wire grade from its transformation temperatures and the service temperature, allowing for the shift caused by stress."
  - "Size a wire actuator's length, diameter and bias spring for a stroke and force within the maker's stress and strain guidelines."
  - "Set the heating current, pulse and cooling time, and avoid the overheating and overstrain that shorten life."
  - "Design a superelastic part for its temperature range and plan the tests that accept a shape memory product."
coverVariant: category
references:
  - title: "Introduction to the Thermodynamics of Solids, revised edition"
    creator: "J. L. Ericksen (Springer-Verlag, New York; first edition Chapman & Hall, 1991)"
    year: "1998"
    note: "Supplied copyright text, read as a subject map only: martensitic transformations, equilibrium of bars under dead loads and in hard devices, non-monotonic stress–stretch curves and the Clausius–Clapeyron relation. No passages, equations as set out, figures or exercises are reproduced."
  - title: "Flexinol actuator wire technical data"
    creator: "Dynalloy, Inc."
    year: "2026"
    url: "https://www.dynalloy.com/tech_data_wire.php"
    note: "Source of the published wire data used in Chapters 4, 6, 7 and 8: resistance per metre, heating pull force at 172 MPa, cooling deformation force at 70 MPa, current for a one-second contraction, cooling times for 70 °C and 90 °C wire, and the guidance on 2% to 6% working strain. Values were read from the maker's page on the date above."
  - title: "Nitinol SE508 wire material data sheet"
    creator: "Confluent Medical Technologies"
    year: "2002"
    url: "https://confluentmedical.com/wp-content/uploads/2021/03/se508_wire_data-Converted_v2.pdf"
    note: "Source of typical superelastic wire properties used in Chapters 1 and 9: density, resistivity, modulus range, expansion coefficient, tensile strength, elongation, loading plateau stress at 3% strain, permanent set after 6% strain and Af range. The sheet states that the values are typical and strongly dependent on processing and temperature."
  - title: "Physical metallurgy of Ti–Ni-based shape memory alloys"
    creator: "K. Otsuka and X. Ren, Progress in Materials Science, vol. 50, pp. 511–678"
    year: "2005"
    note: "Review of the transformations, transformation temperatures, the stress dependence of the transformation and functional properties of NiTi, used as background for Chapters 1 to 3 and 8. The slope of 6.5 MPa per °C used in this book is an illustration within the range such reviews describe; a product's own measurement governs."
  - title: "Engineering Aspects of Shape Memory Alloys"
    creator: "T. W. Duerig, K. N. Melton, D. Stöckel and C. M. Wayman (editors) (Butterworth-Heinemann)"
    year: "1990"
    note: "General engineering reference for actuator design, bias springs, cyclic behaviour and superelastic applications, discussed in Chapters 5, 8 and 9. No values are quoted from it."
  - title: "ASTM F2004, F2082 and F2516 (NiTi transformation temperature by thermal analysis, by bend and free recovery, and tension testing of superelastic NiTi)"
    creator: "ASTM International"
    year: "editions as called up"
    note: "Named by number and scope as the test methods a NiTi specification commonly calls up, in Chapter 9. No values or clauses are quoted from them."
related:
  - title: "Heat Transfer by the Numbers"
    href: "/reados/publications/heat-transfer-by-the-numbers/"
  - title: "Thermal Expansion by the Numbers"
    href: "/reados/publications/thermal-expansion-by-the-numbers/"
  - title: "Pneumatics by the Numbers"
    href: "/reados/publications/pneumatics-by-the-numbers/"
  - title: "Rubber Parts by the Numbers"
    href: "/reados/publications/rubber-parts-by-the-numbers/"
---

## About this book

A few metal alloys can be bent out of shape when cool and then, when warmed, return by themselves to the shape they were given in manufacture, pulling with surprising force as they do. Others, at room temperature, can be bent or stretched by several per cent and spring back completely, many times further than any spring steel. Both behaviours come from the same source, a reversible change in the metal's crystal structure called a martensitic transformation, and the most useful alloy that shows them is nickel-titanium, often called Nitinol.

Shape memory wire makes a silent, compact actuator that pulls when an electric current warms it. Superelastic wire and tube make springs, clips and guides that survive strains that would permanently bend steel. Both are easy to misuse, because their behaviour depends strongly on temperature and stress in ways that ordinary metals do not prepare a designer for. This book works through the numbers that decide whether a shape memory design works: transformation temperatures and how stress shifts them, stroke and force, bias springs, heating current, cooling time, fatigue and the behaviour of superelastic parts across a temperature range.

It suits mechanical and mechatronic designers and automation engineers. It assumes school physics and algebra, the idea of stress and strain, and Ohm's law. No previous knowledge of metallurgy is needed.

## The running case

Every chapter follows one fictional product. This is an illustration. A maker of electrical enclosures designs VL-25, a latch release for a pressure-relief vent flap on an outdoor control cabinet. A spring-loaded latch pin holds the flap shut. To open the vent remotely, a controller passes current through a 150 mm length of 0.25 mm (0.010 in) nickel-titanium actuator wire, which contracts and pulls the latch pin back 4.0 mm. A steel bias spring stretches the wire again when it cools. The cabinet's interior can reach 60 °C in summer sun. A superelastic nickel-titanium wire clip, introduced in Chapter 9, holds the flap against its seal.

The enclosure maker, the latch and every mistake are invented and do not describe KEVOS® work or a real product. Wire data are taken from manufacturers' published sheets and identified in the references; the case's transformation temperatures and test results are illustrations.

## Source limits and professional responsibility

Shape memory alloys' properties depend strongly on composition and processing, and published values are typical, not guaranteed. The transformation temperatures, stress–temperature slope and fatigue behaviour used here are illustrations within the ranges published sources describe, and every calculation was checked by running it. A real design must use the supplier's data for the actual wire and confirm it by test.

VL-25 is a convenience release, not a certified safety device. Pressure relief, emergency venting and any function on which safety depends are governed by the applicable standards and must be designed and approved by competent people. Medical devices, which are a major use of nickel-titanium, are outside this book's scope. The thermodynamics text in the references was used only as a map of ideas; nothing from it is reproduced.
