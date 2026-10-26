---
title: "Random Error and Drift by the Numbers"
subtitle: "Noise, averaging, correlated noise, random walks, Allan deviation, thermal noise and drift for production measurement, worked through one checkweigher"
description: "Separate noise, random walk and drift in production measurements by numbers: averaging, correlated noise, Allan deviation, thermal noise, line speed, recalibration and uncertainty budgets."
category: Engineering
tags: [quality, manufacturing, design]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-27
referencesChecked: 2026-10-27
edition: "1"
level: "Intermediate measurement and instrumentation"
audience: "Quality, process and instrumentation engineers, machine builders and technicians who specify, tune or troubleshoot sensors, weighing systems and production measurements."
outcomes:
  - "Distinguish random error, systematic error, random walk and drift, and recognise each in measured data."
  - "Predict how averaging reduces noise, and calculate the effective number of samples when noise is correlated."
  - "Calculate how a random walk accumulates, and use Allan deviation to choose an averaging or zeroing time."
  - "Estimate the thermal noise floor of a strain-gauge bridge and compare it with other noise sources."
  - "Trade line speed against precision, set check intervals for drift, and combine the components into an uncertainty budget."
coverVariant: category
references:
  - title: "Dynamical Theories of Brownian Motion"
    creator: "Edward Nelson, Princeton University Press"
    year: "1967"
    note: "Supplied source, read as a subject map of the Wiener process, Gaussian processes and the Ornstein–Uhlenbeck theory. The book is in copyright; none of its text, derivations, figures or exercises is reproduced. This book applies the same mathematics to measurement noise with its own case, figures and exercises."
  - title: "Über die von der molekularkinetischen Theorie der Wärme geforderte Bewegung von in ruhenden Flüssigkeiten suspendierten Teilchen"
    creator: "Albert Einstein, Annalen der Physik 322(8), 549–560"
    year: "1905"
    url: "https://doi.org/10.1002/andp.19053220806"
    note: "Origin of the square-root-of-time growth of a random walk, used in Chapter 4."
  - title: "On the theory of the Brownian motion"
    creator: "G. E. Uhlenbeck and L. S. Ornstein, Physical Review 36, 823–841"
    year: "1930"
    url: "https://doi.org/10.1103/PhysRev.36.823"
    note: "Origin of the mean-reverting process used in Chapters 3 and 8 to model correlated noise and slow drift."
  - title: "Statistics of atomic frequency standards"
    creator: "David W. Allan, Proceedings of the IEEE 54(2), 221–230"
    year: "1966"
    url: "https://doi.org/10.1109/PROC.1966.4634"
    note: "Origin of the two-sample (Allan) variance used in Chapter 5."
  - title: "Thermal agitation of electricity in conductors; and Thermal agitation of electric charge in conductors"
    creator: "J. B. Johnson and H. Nyquist, Physical Review 32, 97–109 and 110–113"
    year: "1928"
    url: "https://doi.org/10.1103/PhysRev.32.97"
    note: "Measurement and theory of thermal noise in resistors, used in Chapter 6 for the noise floor of a strain-gauge bridge."
  - title: "JCGM 100:2008, Evaluation of measurement data: Guide to the expression of uncertainty in measurement"
    creator: "Joint Committee for Guides in Metrology (BIPM and partner organisations)"
    year: "2008, corrected 2010"
    url: "https://www.bipm.org/en/doi/10.59161/jcgm100-2008e"
    note: "Framework for the uncertainty budget in Chapter 8: standard uncertainties, combination by root-sum-square and expanded uncertainty with a coverage factor."
  - title: "NIST/SEMATECH e-Handbook of Statistical Methods"
    creator: "National Institute of Standards and Technology"
    year: "current"
    url: "https://www.itl.nist.gov/div898/handbook/"
    note: "Background for the averaging, normal-distribution and control-chart methods used in Chapters 2, 7 and 8."
  - title: "Boltzmann constant"
    creator: "NIST, CODATA values of the fundamental physical constants"
    year: "current"
    url: "https://physics.nist.gov/cgi-bin/cuu/Value?k"
    note: "Exact value 1.380 649 × 10⁻²³ J/K used for thermal noise in Chapter 6."
  - title: "National Trade Measurement Regulations 2009"
    creator: "Commonwealth of Australia; administered by the National Measurement Institute"
    year: "2009, as amended"
    note: "Named in Chapters 1 and 7 as governing the measurement of prepackaged goods for trade; no requirements are quoted. Real trade-use checkweighing must follow them and NMI guidance."
related:
  - title: "Inspecting to the Drawing"
    href: "/reados/publications/inspecting-to-the-drawing/"
  - title: "Fine Particles by the Numbers"
    href: "/reados/publications/fine-particles-by-the-numbers/"
---

## About this book

Every measurement wobbles. Weigh the same pack twice and the readings differ in the last digit; leave a sensor running overnight and its zero wanders; run a line faster and its measurements get noisier. Most of the time those wobbles are treated as a nuisance to be filtered out by eye or by a setting nobody remembers choosing. They can instead be measured, separated into their kinds and designed for, and that is what this book does.

The mathematics comes from an unexpected place. The random jiggling of pollen and dust particles in water, Brownian motion, was explained in 1905 by Einstein as a random walk, and refined in 1930 by Ornstein and Uhlenbeck into a process with memory that reverts to its mean. The same two models, the random walk and the mean-reverting process, describe the two kinds of wandering found in almost every sensor, and the thermal agitation that drives Brownian motion also sets a floor under the noise of every resistor. The book works from those ideas to the practical decisions: how long to average, how often to zero, how fast to run, how often to check, and how to state the result with an honest uncertainty.

## Prerequisites and how to use the book

It assumes algebra, the idea of a standard deviation and a willingness to use a spreadsheet. Chapters 1 and 2 cover random and systematic error and averaging; Chapters 3 to 5 cover correlated noise, random walks and the Allan deviation that separates them; Chapter 6 the thermal noise floor; Chapter 7 the trade between line speed and precision; and Chapter 8 drift, check intervals and the uncertainty budget. *Inspecting to the Drawing* covers measurement of parts against tolerances; this book covers the behaviour of the measurement itself.

## The running case

The book follows **CW-5**, a fictional checkweigher at the end of a packing line that fills **500 g** packs of dry product at **120 packs a minute**. Each pack crosses a weigh conveyor on a single strain-gauge load cell of 1 kg capacity, rated output 2 mV/V, excited at 5 V, read by an analogue-to-digital converter at **1,000 samples a second**. Each pack spends about 300 ms on the weigh conveyor; the first 100 ms are lost to the transient as it arrives, leaving a **200 ms** averaging window. Between packs, the controller re-zeroes the scale on the empty conveyor. Packs below a set threshold are rejected.

The noise model used throughout is invented for teaching but realistic in form: broadband electrical and mechanical noise of **0.5 g** standard deviation per sample; a correlated vibration component of **0.2 g** with a correlation time of **20 ms**; a slow **random walk** in the zero of about **0.05 g** per square root of a minute; and a temperature-driven **span drift** that wanders with a standard deviation of **0.15 g** and a time constant of 30 minutes. This is an illustration. None of it describes a KEVOS® client, supplier or product.

## Source limits and professional responsibility

The supplied 1967 lecture notes develop the mathematics of Brownian motion; they informed the subject, and nothing from them is reproduced. This book is educational. Measuring instruments used for trade in Australia, including checkweighers that determine whether prepackaged goods are compliant, are regulated under the National Trade Measurement Regulations 2009 and National Measurement Institute requirements, and their verification, settings and records must follow those rules and the maker's instructions. Measurements that affect safety or compliance should be designed and checked by a competent person.
