---
title: "Water Hammer by the Numbers"
subtitle: "Wave speed, Joukowsky surges, valve closure, pump trip and surge protection for pumped pipelines"
description: "Size pressure surges in a pumped water main from wave speed and velocity change, check valve closure and pump trip, and choose protection before a pipe bursts."
category: Engineering
tags: [design, validation, projects]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Intermediate mechanical and hydraulic engineering"
audience: "Mechanical, process and maintenance engineers, pump and pipework designers, and project engineers who specify, commission or troubleshoot pumped water lines in plants and on sites."
outcomes:
  - "Calculate the pressure-wave speed in rigid, steel and plastic pipes, and the effect of entrained air on it."
  - "Estimate surge heads from the Joukowsky relation and the pipe period, and compare them with component ratings."
  - "Judge valve closure times, check valve behaviour and pump trip against the pipe period and the valve's characteristic."
  - "Draw minimum and maximum head envelopes along a pipeline profile and find where column separation can occur."
  - "Choose surge protection and write a clear brief for a surge study using the method of characteristics."
coverVariant: category
references:
  - title: "Waves: A mathematical approach to the common types of wave motion, second edition"
    creator: "C. A. Coulson, revised by Alan Jeffrey"
    year: "1977"
    note: "Longman Mathematical Texts. Supplied source, read selectively for the physics of plane waves, sound waves in pipes, reflection at boundaries and the characteristic method for nonlinear waves. It is under copyright: no passages, derivations, figures, examples or exercises are reproduced, and this book's structure, running case and applications are original."
  - title: "Water hammer (translated by O. Simin)"
    creator: "N. Joukowsky"
    year: "1904"
    note: "Proceedings of the American Water Works Association, volume 24. The translation of Joukowsky's 1898 Moscow experiments and theory, the source of the relation between velocity change and surge head used from Chapter 3 onwards."
  - title: "Über die Fortpflanzungsgeschwindigkeit des Schalles in elastischen Röhren"
    creator: "D. J. Korteweg"
    year: "1878"
    note: "Annalen der Physik und Chemie. Historical source of the correction to wave speed for pipe-wall elasticity used in Chapter 2."
  - title: "Fluid Transients in Systems"
    creator: "E. Benjamin Wylie and Victor L. Streeter, with Lisheng Suo"
    year: "1993"
    note: "Prentice Hall. Standard reference for wave speed with pipe restraint factors, valve closure, pump transients, column separation and the method of characteristics. The book's own model in Chapters 4 to 7 and 10 was written for this case and checked against the relations given there; no examples are reused."
  - title: "Fluid Transients in Pipeline Systems, second edition"
    creator: "A. R. D. Thorley"
    year: "2004"
    note: "Professional Engineering Publishing. Background on pump trip, check valve dynamics, surge vessels and air valves in Chapters 6 and 8."
  - title: "A review of water hammer theory and practice"
    creator: "Mohamed S. Ghidaoui, Ming Zhao, Duncan A. McInnis and David H. Axworthy"
    year: "2005"
    url: "https://doi.org/10.1115/1.1828050"
    note: "Applied Mechanics Reviews, 58(1), 49–76. Review of the governing equations, wave speed, friction models and numerical methods; used for background and further reading."
  - title: "Water hammer with column separation: A historical review"
    creator: "Anton Bergant, Angus R. Simpson and Arris S. Tijsseling"
    year: "2006"
    note: "Journal of Fluids and Structures, 22(2). Background for Chapter 7 on vapour cavities, rejoin surges and the limits of simple models."
  - title: "A Textbook of Sound"
    creator: "A. B. Wood"
    year: "1930"
    note: "G. Bell and Sons. Source of the mixture rule for sound speed in a liquid with gas bubbles, applied to entrained air in Chapter 2."
  - title: "AS 1210, Pressure vessels; AS/NZS 2566.1, Buried flexible pipelines, Part 1: Structural design"
    creator: "Standards Australia"
    year: "current editions"
    note: "Named by number and scope only, as the Australian Standards that govern a surge vessel's design and the structural design of buried flexible pipes. No clauses or values are quoted."
  - title: "Technical guidelines for plastic pipe systems"
    creator: "Plastics Industry Pipe Association of Australia"
    year: "current"
    url: "https://www.pipa.com.au/"
    note: "Industry source for guidance on PE and PVC pipe design, including surge and fatigue. Readers designing plastic lines should use the current guidance and the pipe maker's data; no values are quoted here."
related:
  - title: "Pipe flow, pressure drop and pump selection"
    href: "/reados/collections/fluids-hvac-and-building-services/pipe-flow-pressure-drop-and-pumps/"
  - title: "Pipe Welding by the Numbers: Sizes, walls and pressure"
    href: "/reados/publications/pipe-welding-by-the-numbers/sizes-walls-and-pressure/"
  - title: "Fluids, HVAC and Building Services"
    href: "/reados/collections/fluids-hvac-and-building-services/"
---

## About this book

Close a valve on a moving column of water and the water cannot stop all at once. The front of the column stops first, its pressure jumps, and that jump runs back up the pipe as a wave at over a kilometre a second. A few seconds later it has reflected, reversed and returned. Pressure surges of this kind, called water hammer, burst pipes, split fittings, lift pipes off their supports, slam check valves and pull water apart into vapour pockets that collapse with a second, harder blow.

This book treats water hammer as what it is: a pressure wave in a long, elastic tube of slightly compressible liquid. It starts from the wave speed, uses the Joukowsky relation to size the instant surge, adds reflections and the pipe period to judge valve closure and pump trip, and then draws the head envelopes along a real profile to find where pressures go too high or too low. The last chapters cover protection, pulsation in branches and the method of characteristics that a full surge study uses.

It serves mechanical, process and maintenance engineers, pump and pipework designers and project engineers who specify, commission or troubleshoot pumped water lines. You need comfortable algebra, SI units, the idea of hydraulic head, and a spreadsheet. The book uses metres of head throughout, with pressures in kPa or MPa alongside where it helps; one metre of water is about 9.79 kPa at the temperatures used here.

## The running case

Every chapter works on one fictional pipeline. **A pump station at a dam lifts process water to a header tank on a hill**, 900 m away, through a steel main of 168.3 mm outside diameter and 7.1 mm wall, giving a 154.1 mm bore. The pump sits at reduced level (RL) 100 m and the tank's water level is RL 142 m. The line rises steeply at first, flattens near a high point at chainage 600 m, and ends at a motorised inlet valve at RL 141 m beside the tank. At 30 L/s the water moves at 1.61 m/s, and the pump delivers a head of 58 m. Valves and flanged fittings on the line are rated PN16.

This is an illustration. All dimensions, levels, flows, ratings, times and results are invented for teaching and checked by calculation. They are not KEVOS® work, a real site, or a measured system. The book's transient results come from a short method-of-characteristics model written for this case and described in Chapter 10. It simplifies the pump as a fixed head and omits some effects real studies include.

## Source limits and professional responsibility

Surge in a real pipeline depends on details this book simplifies: the pump's full characteristics and inertia, valve curves, air content, pipe restraint, friction during transients, and vapour cavities. Hand methods give a first estimate and show which questions matter. They do not replace a surge analysis by a competent engineer using a validated program, with the actual pipe, pump and valve data.

This book is educational. Pressure pipelines store large amounts of energy and fail violently. Design, modification and commissioning of pumped mains, surge vessels and pressure equipment are governed by the relevant Australian Standards, the requirements of the water authority or asset owner where they apply, and the model Work Health and Safety laws as adopted in your state or territory, which include registration requirements for certain pressure equipment. Testing a pipeline's transient behaviour on purpose, for instance by tripping a pump, must be planned and approved, with people kept clear of the line.
