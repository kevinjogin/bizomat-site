---
title: "Inspecting to the Drawing"
subtitle: "From ballooned drawing and acceptance limits to measurement decisions, first article reports and nonconformance"
description: "Turn a detail drawing into an inspection plan: balloon every requirement, set limits, choose instruments, decide near the limits and report a first article."
category: Manufacturing
tags: [quality, manufacturing, validation, process-improvement]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Introductory to intermediate manufacturing inspection"
audience: "Inspectors, machinists, quality coordinators, buyers and drafters who must decide whether made parts conform to a detail drawing, or who receive inspection reports and need to trust them."
outcomes:
  - "Read a detail drawing as an acceptance standard and confirm the revision, notes and referenced documents that govern a batch."
  - "Balloon every requirement on a drawing, including notes, finishes and repeated features, so nothing escapes inspection."
  - "Convert each requirement into numeric limits, including geometric tolerances with datum references and bonus tolerance."
  - "Choose instruments whose accuracy suits each tolerance and make an explicit decision for results near a limit."
  - "Write a first article inspection report and handle nonconforming parts through the correct authority."
coverVariant: category
references:
  - title: "Engineering Drawings: Detail Drawings (lecture slides)"
    creator: "Paul Briozzo, School of Aerospace, Mechanical and Mechatronic Engineering, University of Sydney"
    year: "2014"
    note: "Supplied 28-slide lecture on the content of detail drawings to AS 1100, read in full. Used only as a checklist of what a detail drawing states, which this book reads from the inspector's side. No slides, drawings, examples or text are reproduced, and the lecture's third-party drawings are not used."
  - title: "JCGM 100:2008 Evaluation of measurement data: Guide to the expression of uncertainty in measurement (GUM)"
    creator: "Joint Committee for Guides in Metrology (BIPM, IEC, IFCC, ILAC, ISO, IUPAC, IUPAP, OIML)"
    year: "2008"
    url: "https://doi.org/10.59161/JCGM100-2008E"
    note: "Freely available guide. Basis for the standard uncertainty, root-sum-square combination and coverage factor used in Chapter 6. The small budget in Chapter 6 is this book's own illustration."
  - title: "JCGM 106:2012 Evaluation of measurement data: The role of measurement uncertainty in conformity assessment"
    creator: "Joint Committee for Guides in Metrology"
    year: "2012"
    url: "https://doi.org/10.59161/JCGM106-2012"
    note: "Freely available guide. Background for acceptance zones, guard bands and decision rules in Chapter 6. No figures or examples are reproduced."
  - title: "JCGM 200:2012 International vocabulary of metrology: Basic and general concepts and associated terms (VIM)"
    creator: "Joint Committee for Guides in Metrology"
    year: "2012"
    url: "https://doi.org/10.59161/JCGM200-2012"
    note: "Freely available vocabulary. The terms resolution, repeatability, calibration and maximum permissible error are used in the senses it defines."
  - title: "NIST/SEMATECH e-Handbook of Statistical Methods, section 2.4: Gauge R & R studies"
    creator: "NIST/SEMATECH"
    year: "online handbook"
    url: "https://www.itl.nist.gov/div898/handbook/mpc/section4/mpc4.htm"
    note: "Supports the distinction between repeatability, reproducibility, stability and bias in Chapter 6. The short repeat study in this book is a screening check, not a formal gauge study."
  - title: "Supplier First Article Inspection Requirements, QA-01.1.1"
    creator: "L3Harris Technologies"
    year: "2024"
    url: "https://l3harris.com/sites/default/files/2024-12/Supplier%20FAI%20Requirement_QA-01.1.1.pdf"
    note: "Public supplier guide to SAE AS9102C, read for the structure of first article reports, ballooned documents, partial first articles and the events that trigger a new first article. Used in Chapters 2 and 8 in paraphrase only."
  - title: "ISO/IEC 17025 laboratory accreditation"
    creator: "National Association of Testing Authorities, Australia (NATA)"
    year: "current web page"
    url: "https://nata.com.au/accreditation/laboratory-accreditation-iso-iec-17025/"
    note: "Confirms that NATA accredits Australian calibration laboratories to ISO/IEC 17025, as discussed in Chapter 5."
  - title: "Standards referenced but not read: SAE AS9102C (2023), ISO 14253-1, ISO 2360, ISO 2859-1, EN 10204, AS/NZS ISO 9001, ASME Y14.5, AS 1100.201, AIAG PPAP and MSA reference manuals"
    creator: "SAE International, ISO, CEN, Standards Australia, ASME and AIAG"
    year: "editions as called up by the drawing, order or quality system"
    note: "Named by number and scope only, where they govern the practice described. No clauses, tables or values are quoted from them. Check the edition your contract or customer specifies."
related:
  - title: "Drawings That Make Parts"
    href: "/reados/publications/drawings-that-make-parts/"
  - title: "Fits That Work"
    href: "/reados/publications/fits-that-work/"
  - title: "Manufacturing Quality"
    href: "/reados/collections/manufacturing-quality/"
---

## About this book

A detail drawing is written once and read many times. Most of those readings are not by the person who drew it. A machinist reads it to plan the work, an estimator to price it, and an inspector to decide whether the part that arrives on the bench is the part the drawing describes. The inspector's reading is the one that ends in a signature, so it has to be complete.

This book is about that reading. It starts where *Drawings That Make Parts* stops, at the released drawing, and follows the drawing into the inspection room: confirming which revision governs, numbering every requirement, turning each one into limits, choosing instruments that can tell good from bad, deciding what to do with a result near a limit, writing a first article report and handling a part that does not conform. It is written for inspectors and machinists, and for the buyers, quality coordinators and drafters who receive inspection reports and need to know whether to trust them.

It assumes you can read a simple orthographic drawing and use a caliper and a micrometer. It does not teach geometric tolerancing in full, statistics beyond a standard deviation, or the operation of a coordinate measuring machine. Where those subjects matter, the book says so and points to the right reference.

## The running case

Every chapter follows one fictional part. This is an illustration. A small machine shop receives an order for 40 sensor brackets from a machine builder. The bracket is an L-shaped part machined from 6061-T6 aluminium alloy plate and clear anodised. The base is 80 mm long, 50 mm wide and 8 mm thick and carries two Ø6.6 mm mounting holes. An upright 8 mm thick rises to an overall height of 45 mm and carries a Ø10 mm sensor bore with tight limits, a 0.8 µm Ra finish and a perpendicularity tolerance, plus two M4 tapped holes for a cover. The underside of the base is datum A, the long side face is datum B and the outside face of the upright is datum C. The drawing is SB-2041, revision C, with a general tolerance note of ±0.1 mm.

The shop, the customer, the drawing and every measured value are invented. None describes KEVOS® work, a real supplier or a real customer. Each chapter adds to the bracket's inspection record, and most include a mistake that an inspection room could plausibly make, how it was found and how it was put right.

## How to use the book

Read the chapters in order the first time: each builds on the requirement list and limits established in the one before. After that, the chapters work as references. Chapters 2 and 3 produce the ballooned drawing and the limits table; Chapters 4 to 7 decide how each requirement is verified; Chapter 8 assembles the report; Chapter 9 covers what happens when a result fails. Each chapter ends with an exercise and a worked answer.

## Source limits and professional responsibility

The book draws on freely available metrology guidance from the Joint Committee for Guides in Metrology and NIST, and on a published supplier guide to first article inspection. Standards that govern this work in particular industries, such as SAE AS9102C for aerospace first articles, ISO 14253-1 for decision rules and the AIAG manuals for automotive suppliers, are named by number and scope only; buy and read the edition your customer specifies. The supplied university lecture was used as a checklist of drawing content and nothing more.

The numbers in the running case show how to reason, not what values to use. Instrument accuracies, uncertainty contributions, coating growth and acceptance rules for real work come from calibration certificates, manufacturers' data, finishers' process sheets and the agreement with your customer. Where a part is safety-critical or regulated, inspection planning and acceptance decisions need the review and authority your quality system and your customer require. This book is educational and is not advice for any particular product.
