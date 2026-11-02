---
title: "Blending Bulk Solids by the Numbers"
subtitle: "Mixing, segregation, feeding and sampling of powders and pellets, worked through one compounding plant's colour, filler and additive blends"
description: "How well a blend can be mixed, how to measure it, why it unmixes, how feeders and extruders smooth or pass on variation, and how to sample and prove a blend without fooling yourself."
category: Manufacturing
tags: [manufacturing, quality, process-improvement]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-31
referencesChecked: 2026-10-31
edition: "1"
level: "Intermediate process engineering and applied statistics"
audience: "Process, production and quality engineers, plant supervisors, laboratory staff and students who blend, feed, dose or test powders, pellets and granules and need blends that stay within specification."
outcomes:
  - "Define a blend's quality at the scale its user experiences, and calculate the best uniformity a random mixture can reach."
  - "Measure mixedness from sample results, compare blenders and blend times, and estimate the time a blender needs."
  - "Explain the main segregation mechanisms, predict where a blend will unmix, and choose handling that prevents it."
  - "Work out how feeder fluctuations and extruder back-mixing combine to set the variation in a continuous blend."
  - "Size particles, premixes and samples for minor ingredients using counting statistics."
  - "Plan sampling and acceptance of a blend, and monitor it with charts and capability indices."
coverVariant: category
references:
  - title: "Statistical Physics: Statics, Dynamics and Renormalization"
    creator: "L. P. Kadanoff, World Scientific, Singapore (ISBN 981 02 3758 8)"
    year: "2000"
    note: "Supplied source, in copyright. Read only as a subject map: random walks, diffusion, Gaussian distributions and the central limit theorem, fluctuations in large and small systems, the barometer formula and drift with diffusion. It is a physics text; no text, equations, figures, examples or exercises are reproduced or adapted, and the engineering treatment, running case and numbers in this book are original."
  - title: "The definition and measurement of some characteristics of mixtures"
    creator: "P. V. Danckwerts, Applied Scientific Research, vol. 3, pp. 279–296"
    year: "1952"
    url: "https://doi.org/10.1007/BF03184936"
    note: "Origin of the scale of scrutiny and the intensity of segregation used in Chapters 1 and 3. Described, not quoted."
  - title: "Continuous flow systems: distribution of residence times"
    creator: "P. V. Danckwerts, Chemical Engineering Science, vol. 2, pp. 1–13"
    year: "1953"
    url: "https://doi.org/10.1016/0009-2509(53)80001-1"
    note: "Residence time distributions, the basis of the back-mixing and smoothing model in Chapter 8."
  - title: "Developments in the theory of particle mixing"
    creator: "P. M. C. Lacey, Journal of Applied Chemistry, vol. 4, pp. 257–268"
    year: "1954"
    url: "https://doi.org/10.1002/jctb.5010040504"
    note: "Mixing as a random process, the random-mixture variance and the mixing index used in Chapters 2 to 4. Described, not quoted."
  - title: "Why the Brazil nuts are on top: size segregation of particulate matter by shaking"
    creator: "A. Rosato, K. J. Strandburg, F. Prinz and R. H. Swendsen, Physical Review Letters, vol. 58, pp. 1038–1040"
    year: "1987"
    url: "https://doi.org/10.1103/PhysRevLett.58.1038"
    note: "Simulation study of size segregation under shaking, used qualitatively in Chapter 6."
  - title: "The segregation of particulate materials. A review"
    creator: "J. C. Williams, Powder Technology, vol. 15, pp. 245–251"
    year: "1976"
    url: "https://doi.org/10.1016/0032-5910(76)80053-8"
    note: "Review of segregation mechanisms used for the classification in Chapter 6. Described, not quoted."
  - title: "Granular solids, liquids, and gases"
    creator: "H. M. Jaeger, S. R. Nagel and R. P. Behringer, Reviews of Modern Physics, vol. 68, pp. 1259–1273"
    year: "1996"
    url: "https://doi.org/10.1103/RevModPhys.68.1259"
    note: "Review of granular physics including convection and size segregation in vibrated beds, used for the physical explanations in Chapters 4 and 6."
  - title: "Sampling for Analytical Purposes"
    creator: "P. Gy, John Wiley & Sons, Chichester (ISBN 0 471 97956 2)"
    year: "1998"
    note: "The theory of sampling particulate materials, including the fundamental sampling error and its dependence on particle size and sample mass, used qualitatively in Chapter 10. No formulas or factors are reproduced."
  - title: "NIST/SEMATECH e-Handbook of Statistical Methods"
    creator: "National Institute of Standards and Technology"
    year: "2012"
    url: "https://www.itl.nist.gov/div898/handbook/"
    note: "Reference for the confidence interval of a variance, the F test for two variances, EWMA control charts and capability indices used in Chapters 3, 8 and 11, and by the KEVOS® tools linked there."
  - title: "ISO 3451-1, Plastics: Determination of ash, Part 1: General methods"
    creator: "International Organization for Standardization"
    year: "Current edition"
    note: "Named by number and scope only, as the type of method used to measure filler content in a compound by ashing, in Chapters 8 and 11. No values are quoted."
  - title: "ASTM D6940, Standard practice for measuring sifting segregation tendencies of bulk solids"
    creator: "ASTM International"
    year: "Current edition"
    note: "Named by number and scope only in Chapter 6, as a laboratory test that ranks a blend's tendency to segregate by sifting."
related:
  - title: "Diffusion by the Numbers"
    href: "/reados/publications/diffusion-by-the-numbers/"
  - title: "Control Charts by the Numbers"
    href: "/reados/publications/control-charts-by-the-numbers/"
  - title: "Random Error and Drift by the Numbers"
    href: "/reados/publications/random-error-and-drift-by-the-numbers/"
  - title: "Polymer Chains by the Numbers"
    href: "/reados/publications/polymer-chains-by-the-numbers/"
  - title: "Plastic Parts by the Numbers"
    href: "/reados/publications/plastic-parts-by-the-numbers/"
  - title: "Bulk Solids Flow by the Numbers"
    href: "/reados/publications/bulk-solids-flow-by-the-numbers/"
---

## About this book

Most manufactured products contain a blend somewhere: a colour masterbatch in a plastic, a filler in a compound, a vitamin in a feed, an active ingredient in a tablet, cement and sand in a dry mortar. A blend is good if every portion its user takes contains the right proportions, and it fails if some portions do not. Whether that happens depends on how the blend was mixed, how it was moved and stored afterwards, how it was fed into the process, and how it was sampled and tested. Each of those steps can be understood with a small number of ideas from probability and the physics of particles.

This book teaches those ideas for practical use. It starts by defining what "well mixed" means and showing that even a perfect random mixture has a limit to its uniformity, set by counting statistics. It then covers measuring mixedness, mixing as a random walk, the scale-up of blenders, the mechanisms that unmix a blend, and segregation in hoppers and transfers. The later chapters deal with continuous blending by feeders and extruders, minor ingredients and premixes, sampling, and the plans and charts that prove a blend.

It is for process, production and quality engineers, plant supervisors, laboratory staff and students. It assumes algebra, logarithms and introductory statistics: means, standard deviations and the normal distribution. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one fictional plant. This is an illustration. Plant C compounds polypropylene with calcium carbonate filler and sells the result as pellets. Three blends run through it.

- **Colour.** The plant's own moulding cell makes 60 g lids from natural polypropylene pellets, each about 24 mg, coloured by adding 2% of a black masterbatch, pellets of about 20 mg carrying 40% carbon black. A volumetric doser at the moulding machine's throat adds the masterbatch.
- **Filler.** The extrusion line makes a 30% filled compound at 1,500 kg/h. Loss-in-weight feeders deliver polypropylene at 1,035 kg/h, calcium carbonate at 450 kg/h and an additive premix at 15 kg/h into the extruder. The product specification is 30.0 ± 1.0% filler by ash content.
- **Additives.** The premix is 20% of a stabiliser powder in polypropylene powder, made in 200 kg batches in a 500 L ribbon blender. At 1% addition it gives 0.20% stabiliser in the compound.

The plant, its equipment, materials, specifications and every measurement are invented. None describes KEVOS® work, a real plant or a real supplier's product.

## How to use the book

Read Chapters 1 to 4 in order: they define mixedness, its random limit, how to measure it and how mixing proceeds. Chapters 5 to 7 cover batch blenders, segregation and what happens to a blend after it leaves the blender. Chapters 8 and 9 deal with continuous feeding and minor ingredients, and Chapters 10 and 11 with sampling and proving a blend.

KEVOS® tools are linked where they perform a step of the method, with a note of exactly what each calculates. The statistical tools follow the methods in the NIST/SEMATECH e-Handbook of Statistical Methods.

## Source limits and professional responsibility

The statistics in this book are exact for the models stated; the physical models of mixing and segregation are simplifications that capture the main behaviour and are checked against measurement in each chapter. Specifications, test methods and acceptance criteria for real products are set by customers, standards and, for regulated products such as food, feed, medicines and agricultural chemicals, by regulators. They are named where relevant and not quoted.

Blending involves rotating machinery, dust and, for many materials, combustible or hazardous powders. The design and operation of real blending, feeding and sampling systems are matters for competent people under the equipment makers' instructions and Australian work health and safety law. This book is educational. It explains how blends behave and how the standard calculations work; it is not a validation of any process or a substitute for testing a real blend.
