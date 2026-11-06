---
title: "Control Charts by the Numbers"
subtitle: "Variation as a random process: Shewhart, individuals, CUSUM and EWMA charts, run lengths, counts, drift and capability, worked through one turning cell"
description: "Design, read and trust control charts: subgroup statistics, false alarms and run lengths, CUSUM and EWMA for small shifts, attribute charts, autocorrelation, tool wear and capability."
category: Manufacturing
tags: [quality, manufacturing, operations, validation]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-30
referencesChecked: 2026-10-30
edition: "1"
level: "Intermediate manufacturing quality engineering"
audience: "Quality, manufacturing and process engineers, machinists and setters, production supervisors and students who need to set up control charts, read them correctly and decide when a process needs attention."
outcomes:
  - "Treat a measured characteristic as a random variable and predict out-of-tolerance parts from its mean and standard deviation."
  - "Set up X̄–R and individuals charts from a stable baseline and explain why their limits sit where they do."
  - "Calculate average run lengths for false alarms and for real shifts, and choose a subgroup size and chart to match the shift that matters."
  - "Design and read CUSUM and EWMA charts for small sustained shifts, and p and c charts for counts and proportions."
  - "Recognise autocorrelation and tool-wear drift, and quote capability with its confidence bound only for a process in control."
coverVariant: category
references:
  - title: "An Introduction to Stochastic Processes in Physics"
    creator: "D. S. Lemons, Johns Hopkins University Press"
    year: "2002"
    note: "In copyright. Used only as a map of the probability behind the book: random variables, the variance sum and central limit theorems, random walks with drift, the Ornstein–Uhlenbeck process and autocorrelation. No text, structure, figures, tables or problems are reproduced."
  - title: "NIST/SEMATECH e-Handbook of Statistical Methods, Chapter 6: Process or Product Monitoring and Control"
    creator: "National Institute of Standards and Technology"
    year: "2012"
    url: "https://www.itl.nist.gov/div898/handbook/pmc/pmc.htm"
    note: "Open reference for control charts for variables and attributes, process capability and exponential smoothing, used throughout."
  - title: "Economic Control of Quality of Manufactured Product"
    creator: "W. A. Shewhart, Van Nostrand"
    year: "1931"
    note: "Named in Chapter 2 as the origin of the control chart and its three-sigma limits."
  - title: "Continuous inspection schemes"
    creator: "E. S. Page, Biometrika 41, 100–115"
    year: "1954"
    note: "Named in Chapter 5 as the origin of the cumulative sum chart."
  - title: "Control chart tests based on geometric moving averages"
    creator: "S. W. Roberts, Technometrics 1, 239–250"
    year: "1959"
    note: "Named in Chapter 6 as the origin of the exponentially weighted moving average chart."
  - title: "Exponentially weighted moving average control schemes: properties and enhancements"
    creator: "J. M. Lucas and M. S. Saccucci, Technometrics 32(1), 1–12"
    year: "1990"
    note: "Named in Chapters 4 and 6 for the Markov-chain method of calculating EWMA run lengths, which the book uses with its own calculations."
  - title: "An approach to the probability distribution of cusum run length"
    creator: "D. Brook and D. A. Evans, Biometrika 59(3), 539–549"
    year: "1972"
    note: "Named in Chapters 4 and 5 for the Markov-chain method of calculating CUSUM run lengths. The book's run lengths are its own calculations, checked against values widely published for the same designs."
  - title: "Introduction to Statistical Quality Control"
    creator: "D. C. Montgomery, John Wiley & Sons"
    year: "current edition"
    note: "Named as a standard text on control chart design and capability analysis. No text or tables are reproduced."
  - title: "ISO 7870 Control charts (series) and ISO 22514 Statistical methods in process management: Capability and performance (series)"
    creator: "International Organization for Standardization"
    year: "current editions"
    note: "Named by number and scope in Chapters 2 and 9. Paywalled; no clauses or values are quoted."
related:
  - title: "Random Error and Drift by the Numbers"
    href: "/reados/publications/random-error-and-drift-by-the-numbers/"
  - title: "Inspecting to the Drawing"
    href: "/reados/publications/inspecting-to-the-drawing/"
  - title: "Fits That Work"
    href: "/reados/publications/fits-that-work/"
  - title: "Machining by the Numbers"
    href: "/reados/publications/machining-by-the-numbers/"
  - title: "Breakdowns and Buffers by the Numbers"
    href: "/reados/publications/breakdowns-and-buffers-by-the-numbers/"
---

## About this book

A control chart is a simple picture with a demanding job. It plots a measurement over time against limits drawn from the process's own variation, and it has to say, as early as possible, when something has changed, without crying wolf so often that people stop looking. Every design choice on a chart, from the subgroup size to the type of chart to the width of its limits, is a trade between those two errors, and every trade can be calculated. The calculations come from the theory of random processes: a measurement is a random variable, a subgroup mean obeys the central limit theorem, a cumulative sum is a random walk, an exponentially weighted average is a process with a fading memory, and the time until a chart signals is a first-passage time.

This book works through those ideas one chart at a time. It starts with variation itself and the X̄–R chart, moves to individuals charts and to the run lengths that measure every chart's performance, then to the CUSUM and EWMA charts that catch small sustained shifts. It covers charts for defect counts and proportions, the autocorrelation and tool-wear drift that break the textbook assumptions, and finishes with capability, quoted honestly with its confidence bound.

It is for quality, manufacturing and process engineers, setters and supervisors, and students who measure parts and want to act on the numbers correctly. It assumes averages, standard deviations and a first acquaintance with the normal distribution. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the BIZOMAT tool that performs the chapter's calculation, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one fictional cell. This is an illustration. A hydraulics manufacturer turns valve spools, part SP-12, on a CNC lathe with an in-process gauge. The critical feature is a land diameter of 12.000 mm with a tolerance of ±0.010 mm: 11.990 to 12.010 mm.

- **The process:** a cycle of 45 seconds, 40 spools every half hour, two shifts a day.
- **Sampling:** five consecutive spools measured every half hour, a subgroup of five, 32 subgroups a day.
- **Baseline:** 25 subgroups from a stable period gave a grand average of 12.0010 mm and an average range of 0.0051 mm, a within-subgroup standard deviation of about 0.0022 mm.
- **Other characteristics:** case hardness measured once per heat-treatment batch, burrs found at visual inspection, and scratches counted on trays of finished spools.

The cell, its data and any costs are invented. None describes BIZOMAT work or a real business. Measurements are in millimetres throughout.

## How to use the book

Read Chapters 1 to 4 in order: they set out the random-variable view of a measurement, the two basic charts and the run lengths by which every chart is judged. Chapters 5 and 6, on CUSUM and EWMA, belong together. Chapters 7 to 9 can be read in any order after Chapter 4.

The run lengths in the book were calculated by the Markov-chain methods of Brook and Evans for the CUSUM and of Lucas and Saccucci for the EWMA, and checked against values widely published for the same chart designs. Values are given to more figures than the data could justify, so that a reader can follow each step.

## Source limits and professional responsibility

The charts in this book assume measurements that are independent and roughly normal, from a measurement system that is fit for purpose; Chapter 8 shows what happens when the first assumption fails, and the companion books on inspection and measurement deal with the last. Real processes need their own baselines, and the chart designs here are starting points, not prescriptions.

A control chart says whether a process has changed; it does not say whether parts meet their specification, and it does not replace inspection required by a customer or a regulation. This book teaches how to design and read control charts. It is educational and is not a quality plan for any product.
