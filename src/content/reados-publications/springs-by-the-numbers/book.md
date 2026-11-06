---
title: "Springs by the Numbers"
subtitle: "Rate, stress, fatigue and fit of compression, extension, disc, torsion, bar and flat springs, on one machining centre"
description: "How to check and specify mechanical springs: rate and energy, compression, extension, disc, torsion, bar and flat springs, fatigue, and the springs that set forces in machines."
category: Engineering
tags: [design, manufacturing, validation]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-11-01
referencesChecked: 2026-11-01
edition: "1"
level: "Intermediate mechanical design and maintenance engineering"
audience: "Mechanical design engineers, machine builders, maintenance engineers and fitters who specify, check, replace or troubleshoot springs in machines, fixtures, guards and hydraulic equipment."
outcomes:
  - "Work out a spring's rate, load, stored energy and the effect of springs and supports acting in series or in parallel."
  - "Check and design helical compression and extension springs for stress, solid length, buckling, hooks and fatigue."
  - "Size disc spring stacks, torsion springs, torsion bars and flat springs for the force, travel and space available."
  - "Check the springs that set a machine's forces and pressures: counterbalances, detents, relief valves and spring-applied clamps."
  - "Write a spring specification and an inspection routine that catch set, wear, wrong parts and wrong assembly."
coverVariant: category
references:
  - title: "Concepts of Theoretical Solid State Physics"
    creator: "A. Altland and B. Simons"
    year: "2001"
    note: "Lecture notes released for verbatim copying only, so treated here as a protected work. Used only as a map of ideas: the harmonic approximation, in which every small deformation about equilibrium behaves as a spring storing energy in proportion to the square of the displacement, and the way springs combine into chains and networks. No text, equations, figures or problems are reproduced, and all cases and calculations are BIZOMAT originals."
  - title: "Shigley's Mechanical Engineering Design, tenth edition"
    creator: "R. G. Budynas and J. K. Nisbett, McGraw-Hill Education"
    year: "2015"
    note: "Background for helical compression, extension and torsion spring analysis, the Wahl and curvature correction factors, spring wire strengths fitted as A ÷ d^m, Zimmerli's endurance data and the Goodman fatigue check, used in Chapters 1 to 8."
  - title: "Roark's Formulas for Stress and Strain, eighth edition"
    creator: "W. C. Young, R. G. Budynas and A. M. Sadegh, McGraw-Hill Education"
    year: "2012"
    note: "Background for flat cantilever springs, torsion of round bars and the Almen–László treatment of disc springs, used in Chapters 7 and 9."
  - title: "Fundamentals of Machine Component Design, fifth edition"
    creator: "R. C. Juvinall and K. M. Marshek, John Wiley & Sons"
    year: "2012"
    note: "Background for spring materials, end types, buckling, surge and the design of springs from two working points, used in Chapters 2 to 6."
  - title: "Model Code of Practice: Managing the risks of plant in the workplace"
    creator: "Safe Work Australia"
    year: "2022"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-plant-workplace"
    note: "Named in Chapters 1, 7 and 10 for the duties to manage the risks of plant, including stored energy in springs and the isolation of machines before maintenance."
related:
  - title: "Metal Fatigue by the Numbers"
    href: "/reados/publications/metal-fatigue-by-the-numbers/"
  - title: "Blanking and Piercing Dies by the Numbers"
    href: "/reados/publications/blanking-and-piercing-dies-by-the-numbers/"
  - title: "Vibrating Machine Elements by the Numbers"
    href: "/reados/publications/vibrating-machine-elements-by-the-numbers/"
  - title: "Machining by the Numbers"
    href: "/reados/publications/machining-by-the-numbers/"
  - title: "Specifying springs that are easy to make and assemble"
    href: "/reados/collections/machine-elements-and-mechanical-design/specifying-springs-that-are-easy-to-make-and-assemble/"
---

## About this book

A spring is a part designed to deflect. Most machine parts are made stiff so that their deflection can be ignored; a spring is made flexible so that its deflection can be used, to store energy, to hold a force nearly constant while parts move, or to set a force or pressure that the rest of the machine depends on. That makes springs some of the most highly stressed parts in a machine, and some of the most often replaced with whatever fits.

This book shows how to check and specify mechanical springs with numbers. It starts with rate, energy and springs acting together, then works through helical compression springs, from checking one to designing one and checking it for fatigue, then square-wire and nested springs, extension springs and their hooks, disc spring stacks, torsion springs, torsion bars and flat springs. It finishes with the springs that set forces and pressures: detents, relief valves and spring-applied clamps.

It is for mechanical design and maintenance engineers, machine builders and fitters. It assumes engineering or trade training and comfort with force, stress and stiffness; the spring formulas are explained as they are used. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the BIZOMAT tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one machine. This is an illustration. A job shop in Ballarat, Victoria, has bought a used vertical machining centre, the VM-8, with a 40-taper spindle, a 20-pocket tool magazine with an arm-type tool changer and a fourth-axis rotary table. Before putting it to work, the shop is rebuilding it, and the rebuild has turned up a spring problem in nearly every assembly:

- **Tool changer:** the lock plunger that holds the changer arm parked, whose springs have broken twice.
- **Tool magazine:** the ball detents that hold tool holders in their pockets, and the shutter door between the magazine and the machining area.
- **Spindle:** the stack of disc springs that pulls the drawbar and clamps the tool holder.
- **Enclosure:** a hinged top hatch on torsion springs and a heavy rear service panel balanced by a torsion bar, with flat spring wipers on the way covers.
- **Hydraulics:** a small power unit with a direct-acting relief valve, and a spring-applied, hydraulically released brake on the rotary table.
- **First job:** a fixture whose pressure pads are pushed by heavy springs in tight pockets.

Loads, dimensions, materials, allowable stresses and test figures are the shop's working figures or are calculated from stated assumptions. They do not describe BIZOMAT work or any real business, machine maker or supplier's data.

## How to use the book

Read Chapter 1 first: it sets out rate, energy and how springs combine, which every later chapter uses. Chapters 2 to 4 cover helical compression springs and should be read in order. The later chapters can be read in any order once Chapter 2 is familiar. Chapter 10 also covers the inspection routine and records the shop adopted.

Every calculation in the book was checked by running it, and the BIZOMAT tools linked from each chapter were checked against the calculations they perform. Wire strengths, allowable stresses and friction values are typical figures for illustration; a real design uses the spring maker's data for the actual wire and process.

## Source limits and professional responsibility

This book is educational. Springs store energy and can release it suddenly when a part is dismantled or breaks; a compressed drawbar stack or a wound counterbalance must be released with the right tools and procedure, and machines must be isolated and locked out before work. Springs in safety functions, such as brakes, guards and pressure relief, must be designed or checked by a competent person against the applicable standards and the makers' data. Decisions about real machines remain with the competent people responsible for them.
