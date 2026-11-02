---
title: "Scale Models by the Numbers"
subtitle: "Dimensional analysis, similitude and model testing for engineers, worked through one pump-station sump model"
description: "Use dimensions, dimensionless groups and similarity laws to plan a scale model, scale its results to full size, fit power laws to test data and know when the model stops telling the truth."
category: Engineering
tags: [design, experimentation, validation]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-31
referencesChecked: 2026-10-31
edition: "1"
level: "Intermediate engineering fluid mechanics and test practice"
audience: "Mechanical, civil and hydraulic engineers, test-lab staff, technical managers and students who plan scale-model tests, read model study reports or need to scale measured results to full size."
outcomes:
  - "Check any formula or spreadsheet for dimensional consistency and catch unit errors before they reach a decision."
  - "Build dimensionless groups with the Buckingham pi method and decide which ones a model must match."
  - "Choose a model scale and scale flows, velocities, times, forces and powers by Froude and Reynolds similarity."
  - "Recognise viscous and surface-tension scale effects, and know whether a model result is conservative or not."
  - "Fit a power law to test data on logarithmic axes, judge its uncertainty and avoid extrapolating across a change of regime."
  - "Plan, run and report a model test so that its results can be scaled and trusted."
coverVariant: category
references:
  - title: "Scaling and Renormalization in Statistical Physics"
    creator: "J. Cardy, Cambridge University Press, Cambridge (Cambridge Lecture Notes in Physics 5, ISBN 0 521 49959 3)"
    year: "1996"
    note: "Supplied source, in copyright. Read only as a subject map of scaling ideas: dimensions and scaling laws, crossover between regimes and finite-size effects. It is a physics text about critical phenomena; no text, equations, figures, examples or exercises are reproduced or adapted, and the engineering treatment, running case, numbers and checks in this book are original."
  - title: "On physically similar systems; illustrations of the use of dimensional equations"
    creator: "E. Buckingham, Physical Review, vol. 4, pp. 345–376"
    year: "1914"
    url: "https://doi.org/10.1103/PhysRev.4.345"
    note: "The original statement of the pi theorem used in Chapter 2. Its argument is described, not quoted."
  - title: "The International System of Units (SI Brochure), 9th edition"
    creator: "Bureau International des Poids et Mesures"
    year: "2019"
    url: "https://www.bipm.org/en/publications/si-brochure"
    note: "Reference for base quantities, derived units and the dimensions of derived quantities used in Chapter 1."
  - title: "Thermophysical Properties of Fluid Systems, NIST Chemistry WebBook, SRD 69"
    creator: "National Institute of Standards and Technology"
    year: "2026"
    url: "https://webbook.nist.gov/chemistry/fluid/"
    note: "Source of the density, viscosity and surface tension of water at 10, 20 and 30 °C used for the Reynolds and Weber numbers throughout (for example 998.21 kg/m³, 1.0016 mPa·s and 72.74 mN/m at 20 °C)."
  - title: "Turbulent flow in pipes, with particular reference to the transition region between the smooth and rough pipe laws"
    creator: "C. F. Colebrook, Journal of the Institution of Civil Engineers, vol. 11, pp. 133–156"
    year: "1939"
    note: "Named as the origin of the friction-factor equation used by the pipe friction tool in Chapter 8."
  - title: "ANSI/HI 9.8, Rotodynamic Pumps for Pump Intake Design"
    creator: "Hydraulic Institute"
    year: "Current edition"
    note: "Named by number and scope only, as a standard that sets out intake design and physical model study requirements for pump sumps. No values or criteria from it are quoted; a real model study must use the edition specified for the project."
  - title: "IEC 60193, Hydraulic turbines, storage pumps and pump-turbines: Model acceptance tests"
    creator: "International Electrotechnical Commission"
    year: "Current edition"
    note: "Named by number and scope only, as the standard that governs model tests of hydraulic machines and the scaling of their efficiency to full size, discussed in Chapter 9. No values are quoted."
  - title: "ISO 5167-2, Measurement of fluid flow by means of pressure differential devices: Orifice plates"
    creator: "International Organization for Standardization"
    year: "Current edition"
    note: "Named by number and scope only, as the standard for orifice-plate flow measurement whose discharge coefficient depends on Reynolds number, the effect examined in Chapter 7. No values are quoted."
  - title: "Model Code of Practice: Confined spaces"
    creator: "Safe Work Australia"
    year: "2020"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-confined-spaces"
    note: "Cited because pump-station wet wells are typically confined spaces. The book does not cover pump-station safety; this code, the owner's procedures and competent people do."
related:
  - title: "Pipe Flow by the Numbers"
    href: "/reados/publications/pipe-flow-by-the-numbers/"
  - title: "Centrifugal Pumps by the Numbers"
    href: "/reados/publications/centrifugal-pumps-by-the-numbers/"
  - title: "Water Hammer by the Numbers"
    href: "/reados/publications/water-hammer-by-the-numbers/"
  - title: "Prototypes and Simulation by the Numbers"
    href: "/reados/publications/prototypes-and-simulation-by-the-numbers/"
  - title: "Random Error and Drift by the Numbers"
    href: "/reados/publications/random-error-and-drift-by-the-numbers/"
---

## About this book

Engineers test small things to learn about big ones. A pump sump is modelled at a sixth of full size, a ship hull in a towing tank, a building in a wind tunnel, a spillway in a flume. The model is cheaper, faster and safer to change than the real thing, but it only helps if its results can be carried to full size, and only if the engineer knows which results cannot. The tools for that are old and simple: the dimensions of physical quantities, the dimensionless groups built from them, and the similarity laws that say how each quantity scales.

This book teaches those tools for practical use. It starts with the dimensional check that catches unit errors in any formula, builds dimensionless groups by the Buckingham pi method, and then sets up a real model: choosing its scale, scaling flows and times by the Froude number, and facing the Reynolds and Weber numbers that a small model cannot match. It shows how to fit a power law to test data, how to spot a change of regime in the data, how the same similarity ideas give the pump and fan affinity laws, and how to plan and report a model test so that its results can be trusted.

It is for mechanical, civil and hydraulic engineers, test-lab staff and technical managers who plan model tests, commission them or read their reports, and for students who want to see dimensional analysis used on a real problem. It assumes algebra, logarithms and basic fluid mechanics: pressure, flow, velocity and head. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one fictional project. This is an illustration. A designer is finalising a stormwater pump station, called PS-3 here, for a low-lying industrial estate. A station of similar layout elsewhere is said to have suffered from surface vortices, so the designer commissions a physical model of the wet well before the concrete is poured.

- **Pumps:** three identical vertical mixed-flow pumps, two duty and one standby, each 0.45 m³/s at 18 m head, running at 1,450 rpm with an efficiency of 82%, so about 96.7 kW at the shaft.
- **Intakes:** a bellmouth of 600 mm diameter on each pump, 300 mm above the floor, with 1.20 m of water above the bellmouth lip at the lowest operating level.
- **Approach:** a channel 4.0 m wide carrying 0.90 m³/s to the duty pumps at a depth of 1.8 m at the lowest level, an average approach velocity of 0.125 m/s.
- **Storage:** a 6.0 m diameter circular storage tank that empties back into the wet well through a 300 mm outlet.
- **Model:** a 1:6 geometric scale model in a hydraulics laboratory, with the pumps replaced by suction pipes of 100 mm bore, each with a flow meter, and the lab's water at about 20 °C.

The station, its dimensions, the lab and every measurement are invented. None describes KEVOS® work, a real station or a real laboratory.

## How to use the book

Read Chapters 1 to 4 in order: they set out dimensions, dimensionless groups, similarity and Froude scaling, which every later chapter uses. Chapters 5 and 6 deal with the scale effects that limit a small model, and Chapters 7 and 8 with turning test data into scaling laws without being misled by a change of regime. Chapter 9 applies the same ideas to pumps and fans, and Chapter 10 brings everything together in a test plan and report.

Water properties come from the NIST Chemistry WebBook and are carried to more figures than a model test could justify, so that a reader can follow each step. KEVOS® tools are linked where they perform a step of the method, with a note of exactly what each one calculates.

## Source limits and professional responsibility

The similarity laws in this book are exact consequences of the governing physics when their assumptions hold, and approximations when they do not; each chapter says which. The model study criteria that apply to a real pump intake, such as limits on vortices, swirl and velocity variation and minimum model Reynolds and Weber numbers, are set by standards such as ANSI/HI 9.8 and by the project's specification. They are named here and not quoted, and none of the illustrative thresholds in the running case should be taken as theirs.

Pump stations are hazardous places: wet wells are confined spaces, and pumps, electrical equipment and fast water can kill. The design, model study, commissioning and operation of a real station are matters for competent engineers and accredited laboratories under the project's specifications and Australian work health and safety law. This book teaches how scaling and model testing work. It is educational and is not a design for any station or a substitute for a model study.
