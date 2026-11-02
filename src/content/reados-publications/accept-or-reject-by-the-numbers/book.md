---
title: "Accept or Reject by the Numbers"
subtitle: "Inspection decisions as inference: base rates, measurement error, guard bands, repeat checks, combined evidence, thresholds and lot sampling, priced in dollars"
description: "Make better accept and reject decisions: Bayes' rule, readings near the limits, cost-based guard bands, gauge studies, repeat checks, combined evidence, thresholds and sampling."
category: Manufacturing
tags: [quality, manufacturing, validation, operations]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-31
referencesChecked: 2026-10-31
edition: "1"
level: "Intermediate quality and manufacturing engineering"
audience: "Quality engineers, inspectors, metrologists, production engineers and supervisors who set acceptance limits, choose gauges and inspection methods, tune automatic inspection, or decide what to do with parts and lots near the line."
outcomes:
  - "Use Bayes' rule with a process's own defect rate to work out what an inspection result really means for a part."
  - "Set acceptance limits from measurement uncertainty and the costs of false accepts and false rejects, and judge whether a gauge is good enough."
  - "Choose between single readings, repeat readings, averages and majority votes, and combine the evidence of several imperfect checks."
  - "Set an automatic inspection threshold for the shop's own defect rate, and learn that rate from inspection and audit data."
  - "Design lot sampling and two-stage inspection plans, and know when improving the process beats improving the inspection."
coverVariant: category
references:
  - title: "Statistical Physics of Spin Glasses and Information Processing: An Introduction"
    creator: "H. Nishimori, Oxford University Press (International Series of Monographs on Physics 111)"
    year: "2001"
    note: "In copyright. Used only as a map of the ideas behind Chapters 1, 5, 6 and 7: Bayesian decoding of noisy signals, the gain from assuming the true noise level and prior, majority voting as the simplest error-correcting code, and per-bit against whole-message decisions. No text, structure, figures, tables or problems are reproduced, and all cases and calculations are KEVOS® originals."
  - title: "An essay towards solving a problem in the doctrine of chances"
    creator: "T. Bayes, communicated by R. Price, Philosophical Transactions of the Royal Society of London 53, 370–418"
    year: "1763"
    url: "https://doi.org/10.1098/rstl.1763.0053"
    note: "Named in Chapter 1 as the origin of the rule for updating a probability with evidence, used throughout the book."
  - title: "JCGM 100:2008, Evaluation of measurement data: Guide to the expression of uncertainty in measurement (GUM)"
    creator: "Joint Committee for Guides in Metrology, published by BIPM"
    year: "2008"
    url: "https://www.bipm.org/en/committees/jc/jcgm/publications"
    note: "Named in Chapter 2 as the basis of the uncertainty budget, combined and expanded uncertainty used there and in the KEVOS® uncertainty tools. The guide is free from the BIPM publications page."
  - title: "JCGM 106:2012, Evaluation of measurement data: The role of measurement uncertainty in conformity assessment"
    creator: "Joint Committee for Guides in Metrology, published by BIPM"
    year: "2012"
    url: "https://www.bipm.org/en/committees/jc/jcgm/publications"
    note: "Named in Chapters 2 and 3 as the guidance that treats acceptance decisions with a prior distribution of the measured quantity, guard bands and the risks of false acceptance and rejection, the approach this book applies. No text or figures are reproduced."
  - title: "ISO 14253-1, Geometrical product specifications (GPS): Inspection by measurement of workpieces and measuring equipment, Part 1: Decision rules for verifying conformity or nonconformity with specifications"
    creator: "International Organization for Standardization"
    year: "current edition"
    note: "Named by number and scope only in Chapter 3. Contracts often call up its decision rules; read the edition the contract names. No values are reproduced."
  - title: "ISO 2859-1, Sampling procedures for inspection by attributes, Part 1: Sampling schemes indexed by acceptance quality limit (AQL) for lot-by-lot inspection"
    creator: "International Organization for Standardization"
    year: "current edition"
    note: "Named by number and scope only in Chapter 9. The plans in this book are designed from the binomial distribution by the KEVOS® tools, not taken from the standard's tables."
  - title: "NIST/SEMATECH e-Handbook of Statistical Methods"
    creator: "National Institute of Standards and Technology"
    year: "n.d."
    url: "https://www.itl.nist.gov/div898/handbook/"
    note: "Public reference for the attribute control charts and acceptance sampling methods used in Chapters 8 and 9."
  - title: "Estimating prevalence from the results of a screening test"
    creator: "W. J. Rogan and B. Gladen, American Journal of Epidemiology 107(1), 71–76"
    year: "1978"
    url: "https://doi.org/10.1093/oxfordjournals.aje.a112510"
    note: "Source of the correction applied in Chapter 8 to estimate a true defect rate from the results of an imperfect inspection."
  - title: "A mathematical theory of communication"
    creator: "C. E. Shannon, Bell System Technical Journal 27(3), 379–423"
    year: "1948"
    url: "https://doi.org/10.1002/j.1538-7305.1948.tb01338.x"
    note: "Named in Chapter 5 as the foundation of the theory of reliable decisions from noisy signals, of which repeated readings and majority votes are the simplest cases."
related:
  - title: "Inspecting to the Drawing"
    href: "/reados/publications/inspecting-to-the-drawing/"
  - title: "Control Charts by the Numbers"
    href: "/reados/publications/control-charts-by-the-numbers/"
  - title: "Random Error and Drift by the Numbers"
    href: "/reados/publications/random-error-and-drift-by-the-numbers/"
  - title: "Fits That Work"
    href: "/reados/publications/fits-that-work/"
  - title: "Shop Floor Optimisation by the Numbers"
    href: "/reados/publications/shop-floor-optimisation-by-the-numbers/"
---

## About this book

Every inspection ends in a decision: accept or reject, pass or hold, ship the lot or sort it. The decision is made from evidence that is never perfect. Gauges have uncertainty, cameras make false calls, operators miss things, samples are small. And the evidence is never the only information available: the process's own record says how likely a part is to be bad before anyone measures it. Good decisions combine the two, and they weigh the cost of rejecting a good part against the cost of shipping a bad one.

This book treats inspection as inference. It starts with Bayes' rule and the base rate, works through readings near the tolerance limits, guard bands set from costs, gauge studies, repeat readings and majority votes, combining several checks, setting automatic inspection thresholds and learning a process's defect rate, and finishes with lot sampling and the design of a whole inspection plan. The mathematics is the same that information theory and statistical physics use to decode noisy signals, applied to parts instead of bits.

It is for quality engineers, inspectors, metrologists, production engineers and supervisors. It assumes familiarity with tolerances, the normal distribution and a spreadsheet. Each chapter works the running case with real numbers, includes one plausible mistake and how it was caught, links the KEVOS® tool that does the chapter's calculation where one exists, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one fictional part. This is an illustration. A CNC turning shop in Adelaide, South Australia, makes a steel bush, BU-25, for a hydraulic cylinder maker, about 2,000 a shift.

- **The characteristic:** a Ø25 H7 bore, 25.000 to 25.021 mm. The turning process runs with a mean of 25.0125 mm and a standard deviation of 3.5 µm, a little above the middle of the tolerance.
- **The gauge:** every bush's bore is measured by an air gauge with an expanded uncertainty of 2.26 µm at k = 2, about 6 seconds a reading. A bench gauge with a standard uncertainty of 0.30 µm is available for difficult cases, about 60 seconds a reading.
- **The camera:** a vision system checks every bore for chatter marks, a surface defect found on about 0.6% of bushes. At its current setting it catches 95% of them and calls 2% of good bushes defective.
- **The costs:** a bad bush that reaches the customer costs about A$400 in sorting, freight and goodwill; a good bush rejected costs about A$6.50 in material and machining. Operator time costs A$80 an hour. All excluding GST.
- **The customer:** checks incoming lots by attributes, with a plan of 132 bushes and an acceptance number of 3.

The shop, the customer, the bush and every number about them are invented for the case and do not describe KEVOS® work or any real business or product.

## How to use the book

Read Chapter 1 first: Bayes' rule and the base rate are the foundation of everything after. Chapters 2 to 5 concern measured characteristics and the gauge; Chapters 6 and 7 concern pass–fail checks and automatic inspection; Chapter 8 learns the defect rate from data; Chapter 9 decides about lots; Chapter 10 puts the pieces together into an inspection plan.

Every calculation in the book was checked by running it, and the false-accept and false-reject rates were calculated by integrating over the process distribution. The KEVOS® tools linked from the chapters perform the same calculations with the reader's own data.

## Source limits and professional responsibility

The models in this book are deliberately simple: normal process distributions, normal measurement errors and independent checks. Real processes drift, real errors correlate and real defects cluster, and each chapter notes where that matters. Contractual acceptance rules, customer specifications and the standards they call up govern real decisions, and in safety-critical or regulated products, acceptance decisions must follow the applicable standard and be approved by qualified people. This book is educational. It is not an acceptance procedure for any product, and a competent person must approve real ones.
