---
title: "Polymer Chains by the Numbers"
subtitle: "Chain size, molar mass, solutions and melts for people who mould, join and clean plastic parts, worked through one polystyrene workshop"
description: "Use the physics of long chains to judge resin grades, regrind, solvent cements, cleaners and storage: molar mass averages, coil size, viscosity, phase separation and solvent attack."
category: Engineering
tags: [design, manufacturing, quality]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-31
referencesChecked: 2026-10-31
edition: "1"
level: "Introductory polymer physics for engineers"
audience: "Plastics engineers, moulders, product designers, quality and laboratory staff, and technical students who handle resins, regrind, solvent cements and cleaners and want to understand why polymer chains behave as they do."
outcomes:
  - "Estimate the size of a polymer coil from its molar mass and explain why chains are coils, not rods."
  - "Calculate number-, weight- and z-average molar masses and blend regrind with virgin resin to a target."
  - "Measure intrinsic viscosity and use it to check a resin grade or detect degradation."
  - "Predict how solution and melt viscosity change with concentration and molar mass, and where the scaling laws change."
  - "Screen solvents and cleaners for a plastic with solubility parameters, and check a solution or container against phase separation and melting."
  - "Build an incoming-resin and cement check that catches problems before they reach production."
coverVariant: category
references:
  - title: "Scaling and Renormalization in Statistical Physics"
    creator: "J. Cardy, Cambridge University Press, Cambridge (Cambridge Lecture Notes in Physics 5, ISBN 0 521 49959 3)"
    year: "1996"
    note: "Supplied source, in copyright. Read only as a subject map of random walks, the self-avoiding walk and polymer statistics, mean-field theory and critical points. No text, equations, figures, examples or exercises are reproduced or adapted; the engineering treatment, running case, numbers and checks in this book are original."
  - title: "Accurate estimate of the critical exponent ν for self-avoiding walks via a fast implementation of the pivot algorithm"
    creator: "N. Clisby, Physical Review Letters, vol. 104, 055702"
    year: "2010"
    url: "https://doi.org/10.1103/PhysRevLett.104.055702"
    note: "Source of the value ν = 0.587597(7) for three-dimensional self-avoiding walks used in Chapter 3, checked against the paper's abstract (arXiv:1002.0494)."
  - title: "Principles of Polymer Chemistry"
    creator: "P. J. Flory, Cornell University Press, Ithaca"
    year: "1953"
    note: "Named as the origin of the Flory–Huggins mixing theory, Flory's estimate of the coil-size exponent and his equation for melting-point depression, used in Chapters 3, 7 and 9. Described, not quoted."
  - title: "Scaling Concepts in Polymer Physics"
    creator: "P.-G. de Gennes, Cornell University Press, Ithaca"
    year: "1979"
    note: "Named as the origin of the overlap concentration and the scaling description of semidilute solutions discussed in Chapter 5. Described, not quoted."
  - title: "The viscosity of polymers and their concentrated solutions"
    creator: "G. C. Berry and T. G. Fox, Advances in Polymer Science, vol. 5, pp. 261–357"
    year: "1968"
    note: "Named as a classic review of the dependence of melt and concentrated-solution viscosity on molar mass, including the change from a first-power to a 3.4-power law, discussed in Chapters 5 and 6."
  - title: "Hansen Solubility Parameters: A User's Handbook, 2nd edition"
    creator: "C. M. Hansen, CRC Press, Boca Raton"
    year: "2007"
    note: "Named as the reference for the three-parameter solubility method of Chapter 8 and as the place to find measured parameters. The parameter values in this book are teaching values and must be replaced by measured or tabulated ones for real work."
  - title: "Thermodynamics of Systems Containing Flexible-Chain Polymers"
    creator: "V. J. Klenin, Elsevier, Amsterdam"
    year: "1999"
    note: "Named as the source behind the KEVOS® polymer tools linked in Chapters 4, 7, 8, 9 and 10. Not quoted."
  - title: "Thermophysical Properties of Fluid Systems, NIST Chemistry WebBook, SRD 69"
    creator: "National Institute of Standards and Technology"
    year: "2026"
    url: "https://webbook.nist.gov/chemistry/fluid/"
    note: "Source of the viscosity of toluene at 25 °C, 0.5522 mPa·s, used for the light-scattering calculation in Chapter 10."
  - title: "Boltzmann constant, CODATA recommended value"
    creator: "National Institute of Standards and Technology, Physical Measurement Laboratory"
    year: "2026"
    url: "https://physics.nist.gov/cgi-bin/cuu/Value?k"
    note: "Source of the exact value k = 1.380 649 × 10⁻²³ J/K used in the Stokes–Einstein equation in Chapter 10."
  - title: "ISO 1628-1, ISO 1133-1, ISO 16014 and ISO 22412"
    creator: "International Organization for Standardization"
    year: "Current editions"
    note: "Named by number and scope only: dilute-solution viscosity of polymers, melt mass-flow rate of thermoplastics, size-exclusion chromatography of polymers and dynamic light scattering. No values or procedures are quoted; laboratories should follow the editions they are accredited to."
  - title: "Model Code of Practice: Managing risks of hazardous chemicals in the workplace"
    creator: "Safe Work Australia"
    year: "2021"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-hazardous-chemicals-workplace"
    note: "Cited for the duty to manage the risks of the flammable and harmful solvents discussed in the running case. The book does not cover chemical safety; this code, safety data sheets and competent people do."
related:
  - title: "Plastic Parts by the Numbers"
    href: "/reados/publications/plastic-parts-by-the-numbers/"
  - title: "Rubber Parts by the Numbers"
    href: "/reados/publications/rubber-parts-by-the-numbers/"
  - title: "Diffusion by the Numbers"
    href: "/reados/publications/diffusion-by-the-numbers/"
  - title: "Fine Particles by the Numbers"
    href: "/reados/publications/fine-particles-by-the-numbers/"
  - title: "Entropy by the Numbers"
    href: "/reados/publications/entropy-by-the-numbers/"
---

## About this book

Plastics are made of long chains, and almost everything a plastics engineer cares about follows from that. A resin's melt flow, a moulding's toughness, the strength of a solvent-cemented joint, the clouding of a cement in a cold store, the crazing of a part wiped with the wrong cleaner and the swelling of a container: each depends on how long the chains are, how they coil, and how they mix with other molecules. The physics that describes this is mature, much of it is surprisingly simple, and most of it is never taught to the people who mould, join and clean plastic parts.

This book teaches it for practical use. It starts with a chain as a random walk, which gives its size, and with the molar mass averages that describe a real resin, which is a mixture of chains of many lengths. It then follows the chains into solution, where the solvent swells them, their viscosity reveals their size, and above a certain concentration they overlap and entangle; into the melt, where viscosity rises steeply with chain length; and into mixtures, where they may separate, dissolve or survive depending on temperature and solvent. It ends with the measurements that tie all of this to a resin lot or a batch of cement.

It is for plastics engineers, moulders, product designers, quality and laboratory staff, and students who handle resins and solvents. It assumes algebra, logarithms and basic chemistry: molar mass, density and the idea of a solvent. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one fictional workshop. This is an illustration. The workshop moulds general-purpose polystyrene housings for small instruments, regrinds its sprues and rejects, and joins its housings with a solvent cement it makes itself by dissolving clean regrind.

- **Virgin resin:** a general-purpose polystyrene whose current lot has a number-average molar mass of 100,800 g/mol, a weight-average of 249,900 g/mol and a z-average of 419,600 g/mol.
- **Regrind:** after two passes through the moulding machine its weight-average molar mass has fallen to about 215,000 g/mol.
- **Feedstock check:** intrinsic viscosity in toluene at 25 °C, with an internal specification of 0.78 to 0.92 dL/g.
- **Solvent cement:** 16% polystyrene by mass in a 50:50 by volume blend of ethyl acetate and d-limonene, which replaced an older toluene-based cement; target viscosity 1,000 to 1,500 mPa·s at 20 °C.
- **Storage and cleaning:** solvents kept in high-density polyethylene containers in a shed that reaches 5 °C in winter and 40 °C in summer; housings wiped with isopropanol before assembly.

The workshop, its resin, its measurements and every specification are invented. The polymer constants used, such as Mark–Houwink and solubility parameters, are teaching values of a realistic size, chosen so that the arithmetic can be followed; they must be replaced by measured or tabulated values for real work. None of this describes KEVOS® work or a real business.

## How to use the book

Read Chapters 1 to 3 in order: they describe a single chain, a real resin's mix of chains, and the effect of the solvent on coil size. Chapters 4 to 6 deal with viscosity in dilute solution, in concentrated solution and in the melt. Chapters 7 to 9 deal with mixing: phase separation, solvent selection and the melting of crystals in a solvent. Chapter 10 brings the measurements together into a check that a workshop can actually run.

KEVOS® tools are linked where they perform a step of the method, with a note of exactly what each one calculates.

## Source limits and professional responsibility

The models in this book, the random walk, Flory–Huggins theory, the Mark–Houwink relation, the Hansen sphere and Flory's melting-point equation, are standard and useful but approximate, and each chapter states its limits. Teaching values of constants are labelled as such. Real resins vary from lot to lot, and real decisions need measured data, the resin supplier's information and the relevant test standards.

Many of the solvents discussed are flammable, and some are harmful to breathe or to skin. Their storage, handling and use are governed by Australian work health and safety law, Safe Work Australia's code of practice for hazardous chemicals, the safety data sheet for each product and, for flammable liquids, the applicable storage requirements. This book teaches the physics of chains in solvents and melts. It is educational and is not a formulation, a safety assessment or advice for any process.
