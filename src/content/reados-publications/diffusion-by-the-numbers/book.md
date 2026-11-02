---
title: "Diffusion by the Numbers"
subtitle: "Fick's laws, the error function, temperature, carburising, decarburisation, scale and hydrogen bake-out, worked through one carburised drive shaft"
description: "Calculate diffusion in steel parts by numbers: Fick's laws, error-function profiles, Arrhenius temperature effects, carburised case depth, decarburisation, scale and hydrogen bake-out."
category: Manufacturing
tags: [manufacturing, quality, design]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-27
referencesChecked: 2026-10-27
edition: "1"
level: "Intermediate materials and heat treatment"
audience: "Mechanical and manufacturing engineers, heat treaters, quality engineers and designers who specify, buy, check or troubleshoot carburising, hardening, plating and other diffusion-controlled processes."
outcomes:
  - "Explain diffusion as a random walk of atoms and use the square-root-of-time rule to estimate how far it reaches."
  - "Use Fick's laws and the error-function solution to predict carbon profiles and case depths."
  - "Calculate how strongly temperature changes diffusion with the Arrhenius law, and what furnace errors do to case depth."
  - "Estimate decarburisation depth, parabolic scale growth and the machining allowances they need."
  - "Size hydrogen bake-out times from section thickness and diffusivity, and set up controls and records for diffusion processes."
coverVariant: category
references:
  - title: "Dynamical Theories of Brownian Motion"
    creator: "Edward Nelson, Princeton University Press"
    year: "1967"
    note: "Supplied source, read as a subject map of the diffusion equation and Einstein's random-walk treatment of Brownian motion. The book is in copyright; none of its text, derivations, figures or exercises is reproduced. This book applies the diffusion equation to steel processing with its own case, figures and exercises."
  - title: "Ueber Diffusion"
    creator: "Adolf Fick, Poggendorff's Annalen der Physik und Chemie 94, 59–86"
    year: "1855"
    note: "Original statement of the laws of diffusion used throughout, cited for history in Chapters 1 and 2."
  - title: "Über die von der molekularkinetischen Theorie der Wärme geforderte Bewegung von in ruhenden Flüssigkeiten suspendierten Teilchen"
    creator: "Albert Einstein, Annalen der Physik 322(8), 549–560"
    year: "1905"
    url: "https://doi.org/10.1002/andp.19053220806"
    note: "Origin of the link between random molecular steps and the square-root-of-time spread used in Chapter 1."
  - title: "Materials Science and Engineering: An Introduction"
    creator: "William D. Callister Jr. and David G. Rethwisch, Wiley"
    year: "current edition"
    note: "Textbook source of the widely quoted diffusion data for carbon in face-centred cubic (austenitic) iron, D₀ ≈ 2.3 × 10⁻⁵ m²/s and Q ≈ 148 kJ/mol, used for the teaching calculations in Chapters 3 to 5. Real alloy steels differ; heat treaters use data and practice for their grades."
  - title: "A molecular-dynamics study on carbon diffusion in face-centered cubic iron"
    creator: "LAMMPS publications abstract"
    year: "current web page"
    url: "https://lammps.org/abstracts/abstract.4690.html"
    note: "Background confirming that experimental activation energies for carbon diffusion in austenite are reported at about 148 to 157 kJ/mol, consistent with the textbook value used."
  - title: "Microstructural features and hydrogen diffusion in bcc FeCr alloys: a comparison between the Kelvin probe- and nanohardness based-methods"
    creator: "Jing Rao, Binhan Sun, Arulkumar Ganapathi and others, Max-Planck-Institut für Eisenforschung (arXiv 2409.02787)"
    year: "2024"
    url: "https://arxiv.org/abs/2409.02787"
    note: "Source for Chapter 7's statements that hydrogen diffusivity in ferritic iron alloys can reach 10⁻⁵ to 10⁻⁴ cm²/s at ambient temperature, that dislocations, grain boundaries and alloying atoms trap hydrogen and lower its diffusion coefficient, and that reversible traps have activation energies below about 50 kJ/mol and irreversible traps above."
  - title: "ISO 18203, Steel: Determination of the thickness of surface-hardened layers (replacing ISO 2639)"
    creator: "International Organization for Standardization"
    year: "current edition"
    note: "Named by number and scope only as the method for measuring case depth by hardness traverse, discussed in Chapters 4 and 8. Limit hardness values are taken from the drawing, not quoted from the standard."
related:
  - title: "Gears by the Numbers"
    href: "/reados/publications/gears-by-the-numbers/"
  - title: "Electroplating by the Numbers"
    href: "/reados/publications/electroplating-by-the-numbers/"
  - title: "Fine Particles by the Numbers"
    href: "/reados/publications/fine-particles-by-the-numbers/"
---

## About this book

Many of the processes that give steel parts their properties are diffusion processes. Carburising puts carbon into the surface of a gear or shaft so that it can be hardened; careless reheating takes carbon out again; oxygen diffusing through a growing layer of scale eats into the surface; hydrogen absorbed during plating or welding has to diffuse out before it cracks the part. In every case, atoms move through the solid by countless random jumps, and the result follows the same mathematics: depth grows with the square root of time, and rises steeply with temperature.

This book makes those processes calculable. It starts with diffusion as a random walk of atoms and Fick's laws, develops the error-function profile that describes most surface treatments, and shows how strongly temperature controls diffusion through the Arrhenius law. It then applies the tools to carburising a case to depth, to decarburisation during reheating, to the parabolic growth of scale and to the bake-out of hydrogen, and ends with the controls, measurements and records that keep a diffusion process on target. Every chapter carries the same running case, shows how an error is caught and ends with an exercise and its worked answer.

## Prerequisites and how to use the book

It assumes algebra, exponentials and logarithms, and a general idea of how steel is hardened. Chapters 1 to 3 build the theory: random walks and Fick's first law, the second law and the error function, and temperature. Chapters 4 to 7 apply it to carburising, decarburisation, scale and hydrogen. Chapter 8 deals with process control. The randomness behind diffusion is the same randomness developed for particles in *Fine Particles by the Numbers* and for measurement errors in *Random Error and Drift by the Numbers*; gear case depth requirements are discussed in *Gears by the Numbers*, and plating hydrogen in *Electroplating by the Numbers*.

## The running case

The book follows **DS-40**, a fictional drive shaft 40 mm in diameter, made from a low-carbon alloy case-hardening steel with about **0.20%** carbon. Its bearing and spline surfaces must be hard and wear-resistant while its core stays tough, so it is gas carburised at **925 °C**, hardened and tempered, ground, and then zinc plated at one end for corrosion protection. The drawing calls for an effective case depth of **0.8 mm**, with a tolerance of **0.7 to 1.0 mm**, and this book takes the effective case as the depth at which the carbon content falls to **0.40%**, a teaching stand-in for the hardness-based definition used in practice.

Diffusion data for carbon in austenite are the widely quoted values for iron, D₀ ≈ 2.3 × 10⁻⁵ m²/s and Q ≈ 148 kJ/mol; real alloy steels differ somewhat, and heat treaters use data and experience for their grades. All dimensions, carbon levels, times and results are invented for teaching. This is an illustration. None of it describes a KEVOS® client, supplier or product.

## Source limits and professional responsibility

The supplied 1967 lecture notes treat the mathematics of Brownian motion and the diffusion equation; they informed the subject, and nothing from them is reproduced. This book is educational. Heat-treatment specifications, case depth requirements, hydrogen embrittlement relief and the testing of safety-critical parts must follow the drawing, the applicable standards and the heat treater's and plater's qualified procedures, and be approved by a competent person.
