---
title: "Viscosity by the Numbers"
subtitle: "What viscosity is, how temperature, pressure and shear change it, and how to choose, measure and use an oil grade, worked through one hydraulic power unit"
description: "Understand and use viscosity: units, gases and liquids, temperature, grades, pressure and shear, measurement, flow in lines, leakage, viscous heating and oil condition."
category: Engineering
tags: [design, operations, quality, process-improvement]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-31
referencesChecked: 2026-10-31
edition: "1"
level: "Intermediate mechanical and maintenance engineering"
audience: "Mechanical, maintenance and reliability engineers, hydraulic and lubrication technicians, designers and students who choose oils, size lines, read oil reports or run machines whose behaviour changes with oil temperature."
outcomes:
  - "Convert between dynamic and kinematic viscosity and the older units, and explain why gases and liquids respond to temperature in opposite ways."
  - "Calculate an oil's viscosity at any working temperature from two catalogue values, and choose an ISO grade against a machine's viscosity window and cold start."
  - "Estimate how pressure, shear and additives change viscosity, and judge when those effects matter."
  - "Calculate laminar pressure drop, clearance leakage and viscous heating, and see how each follows the oil temperature."
  - "Measure viscosity correctly, and use it with other results to detect the wrong oil, oxidation, dilution and shear loss."
coverVariant: category
references:
  - title: "Statistical Physics"
    creator: "A. Isihara, Academic Press, New York and London"
    year: "1971"
    note: "In copyright. Used only as a map of the physics behind Chapters 1, 2 and 5: Maxwell's kinetic theory of gas viscosity, its density independence, transport coefficients of fluids and the link between friction and diffusion. No text, structure, figures, tables or problems are reproduced."
  - title: "Thermophysical Properties of Fluid Systems (NIST Chemistry WebBook, SRD 69)"
    creator: "E. W. Lemmon, I. H. Bell, M. L. Huber and M. O. McLinden, National Institute of Standards and Technology"
    year: "n.d."
    url: "https://webbook.nist.gov/chemistry/fluid/"
    note: "Source of every gas and water viscosity and density in the book: nitrogen at 0.1 MPa from −40 °C to 200 °C and at 20 °C from 0.1 MPa to 19.9 MPa, and water at 0.1 MPa from 0 °C to 100 °C, used in Chapters 1, 2 and 7."
  - title: "On the dynamical theory of gases"
    creator: "J. C. Maxwell, Philosophical Transactions of the Royal Society of London 157, 49–88"
    year: "1867"
    url: "https://doi.org/10.1098/rstl.1867.0004"
    note: "Named in Chapter 2 as the origin of the prediction, confirmed by his own experiments, that a gas's viscosity does not depend on its density and rises with temperature. Checked in the book against NIST data for nitrogen."
  - title: "The viscosity of gases and molecular force"
    creator: "W. Sutherland, Philosophical Magazine, series 5, 36"
    year: "1893"
    note: "Named in Chapter 2 as the origin of the temperature formula for gas viscosity. The constant used in the book was fitted by KEVOS® to NIST's nitrogen data, not taken from any table."
  - title: "An experimental investigation of the circumstances which determine whether the motion of water shall be direct or sinuous, and of the law of resistance in parallel channels"
    creator: "O. Reynolds, Philosophical Transactions of the Royal Society of London 174, 935–982"
    year: "1883"
    url: "https://doi.org/10.1098/rstl.1883.0029"
    note: "Named in Chapter 7 as the origin of the dimensionless group now called the Reynolds number and of the distinction between laminar and turbulent flow."
  - title: "Isothermals, isopiestics and isometrics relative to viscosity"
    creator: "C. Barus, American Journal of Science, series 3, 45"
    year: "1893"
    note: "Named in Chapter 5 as the origin of the exponential pressure–viscosity relation. The coefficient used in the book is an illustrative oil maker's value, not a value from this paper."
  - title: "ASTM D341, Standard Practice for Viscosity–Temperature Equations and Charts for Liquid Petroleum or Hydrocarbon Products"
    creator: "ASTM International"
    year: "current edition"
    note: "Named by number and scope only. Chapter 3 uses the double-logarithmic Walther relation the practice is built on, as implemented in the KEVOS® tools; no values or charts from the standard are reproduced."
  - title: "ISO 3448, Industrial liquid lubricants: ISO viscosity classification"
    creator: "International Organization for Standardization"
    year: "current edition"
    note: "Named by number and scope in Chapter 4: the classification of industrial oils by their kinematic viscosity at 40 °C. Grade limits should be confirmed from the standard or the oil maker's data."
  - title: "ASTM D2270, Standard Practice for Calculating Viscosity Index from Kinematic Viscosity at 40 °C and 100 °C"
    creator: "ASTM International"
    year: "current edition"
    note: "Named by number and scope in Chapter 3 as the definition of viscosity index. The book does not calculate the index, because that needs the standard's reference tables."
  - title: "ASTM D7152, Standard Practice for Calculating Viscosity of a Blend of Petroleum Products"
    creator: "ASTM International"
    year: "current edition"
    note: "Named by number and scope in Chapter 10. The blend estimate used there, averaging the Walther double logarithm by fraction, is a common approximation of the kind the practice describes; no values or procedures from it are reproduced."
  - title: "ASTM D445, Standard Test Method for Kinematic Viscosity of Transparent and Opaque Liquids"
    creator: "ASTM International"
    year: "current edition"
    note: "Named by number and scope in Chapters 6 and 10 as the usual laboratory method behind an oil report's kinematic viscosity. No values or procedures from the standard are reproduced."
  - title: "Model Code of Practice: Managing the risks of plant in the workplace"
    creator: "Safe Work Australia"
    year: "current edition"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-plant-workplace"
    note: "Cited in the introduction and Chapters 8 and 9 as the national guidance on managing plant hazards, including stored hydraulic energy, which applies whenever lines, valves or oil are worked on."
related:
  - title: "Pipe Flow by the Numbers"
    href: "/reados/publications/pipe-flow-by-the-numbers/"
  - title: "Gears by the Numbers"
    href: "/reados/publications/gears-by-the-numbers/"
  - title: "Heat Transfer by the Numbers"
    href: "/reados/publications/heat-transfer-by-the-numbers/"
  - title: "Vacuum by the Numbers"
    href: "/reados/publications/vacuum-by-the-numbers/"
  - title: "Pneumatics by the Numbers"
    href: "/reados/publications/pneumatics-by-the-numbers/"
---

## About this book

Viscosity is the property that decides whether an oil film holds two surfaces apart, how much pressure a line loses, how fast a pump leaks back to its inlet, how hot a relief valve makes the oil and whether a machine will start on a cold morning. It is also the property that changes most with temperature. A typical hydraulic oil is about ten times as viscous at 10 °C as at 60 °C, and a ten-degree change in running temperature can move a machine from its maker's preferred viscosity band to the edge of it.

This book explains where viscosity comes from, using the kinetic picture of gases and the activated flow of liquids, and then follows it through the practical work of choosing, measuring and using oil. It covers units, the temperature relation used by every oil data sheet, grades and operating windows, pressure and shear, measurement, flow in lines and hoses, leakage through clearances, viscous heating and the use of viscosity to judge an oil's condition. A companion book, Plain Bearings by the Numbers, applies the same property to hydrodynamic bearings.

It is for mechanical, maintenance and reliability engineers, hydraulic and lubrication technicians, designers and students who know basic fluid mechanics and heat. Each chapter works the running case with real numbers, includes one plausible mistake and how it was caught, links the KEVOS® tool that does the chapter's calculation where one exists, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one fictional hydraulic power unit. This is an illustration. A press shop in western Sydney runs a 60-tonne forming press from a hydraulic power unit called HPU-40.

- **Pump and drive:** a fixed-displacement axial piston pump of 30 cm³/rev on a 15 kW electric motor at 1,450 rpm, delivering 40 L/min at a working pressure of 160 bar. The relief valve is set at 175 bar.
- **Reservoir and lines:** a 120 L steel reservoir; a 38 mm bore suction hose 0.8 m long; a pressure line of 22 mm × 3 mm steel tube, 16 mm bore and 4 m long; a 25 mm bore return line 5 m long.
- **Oil:** an ISO VG 46 anti-wear mineral hydraulic oil whose data sheet gives 46.0 mm²/s at 40 °C and 6.8 mm²/s at 100 °C, a density of 870 kg/m³ at 15 °C, a specific heat of 1.9 kJ/(kg·K), a volumetric expansion coefficient of 0.0007 per kelvin and a pressure–viscosity coefficient of 2.0 × 10⁻⁸ per pascal.
- **Pump maker's viscosity window:** 16 to 36 mm²/s preferred in continuous running, 10 mm²/s least for short periods, and 1,000 mm²/s most at a cold start.
- **Conditions:** the factory air ranges from 5 °C on a winter morning to 38 °C on a summer afternoon. The oil normally runs at 50 °C and reaches 65 °C on the hottest days.

The press shop, its power unit and its oil are invented and do not describe KEVOS® work or any real product or business. Equipment and oil data are of the kind makers publish, not the data of any product.

## How to use the book

Read Chapters 1 and 3 first: every later chapter uses their units and their temperature relation. Chapter 2 explains why gases and liquids differ and can be skipped by readers who only handle oil. Chapters 4 to 6 are about the oil itself: choosing it, the effects of pressure and shear, and measuring it. Chapters 7 to 9 follow the oil through the machine, and Chapter 10 uses viscosity to watch the oil age.

Numbers are carried to more digits than a measurement would justify so that a reader can follow each step. Every calculation in the book was checked by running it, and the KEVOS® tools linked from the chapters perform the same calculations with the reader's own data.

## Source limits and professional responsibility

The relations in this book are the standard simplified forms used for selection and checking. Oil makers' data, machine makers' viscosity limits and laboratory results govern real decisions, and they differ between products and between batches. Extrapolating any viscosity relation far beyond its data, especially to low temperatures, needs data from the oil maker.

Hydraulic systems store energy and can inject oil through the skin, hot oil burns, and oil mist and spills are fire and slip hazards. Work on them is subject to work health and safety law and to Safe Work Australia's guidance on plant. This book is educational. It is not a design or maintenance instruction for any machine, and a competent person must approve real work.
