---
title: "Fits That Work"
subtitle: "Tolerance budgets, measurement decisions and evidence for assembly release"
description: "Follow a mechanical assembly from functional limits to tolerance budgets, temperature checks, measurement uncertainty and a defensible release decision."
category: Engineering
tags: [design, manufacturing, quality, validation]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: draft
publishDate: 2026-10-20
referencesChecked: 2026-10-20
edition: "1"
level: "Intermediate practical engineering"
audience: "Mechanical designers, manufacturing engineers, quality practitioners and technical leads who can read a drawing and need to connect dimensional decisions with assembly performance."
outcomes:
  - "Translate an assembly function into a signed dimensional model with explicit operating conditions."
  - "Distinguish guaranteed dimensional bounds from statistical predictions and measurement uncertainty."
  - "Evaluate temperature, geometry, process shifts and measurement decisions before tightening tolerances."
  - "Prepare a traceable release record and identify changes that invalidate its evidence."
coverVariant: category
references:
  - title: "Machinery's Handbook, 29th edition"
    creator: "Erik Oberg, Franklin D. Jones, Holbrook L. Horton and Henry H. Ryffel; Christopher J. McCauley, senior editor"
    year: "2012"
    note: "Industrial Press. Supplied reference examined selectively: contents, thermal-property context, allowances and tolerances, and measuring instruments. Printed pages 376, 629 and 675 are examples of the material consulted. Historical background only; no tables, artwork, fit values or prose reproduced."
  - title: "Fundamental Good Practice in Dimensional Metrology, Good Practice Guide 80"
    creator: "National Physical Laboratory"
    year: "2005; online edition consulted"
    url: "https://eprintspublications.npl.co.uk/3360/1/mgpg80.pdf"
    note: "Reference for temperature effects and practical dimensional measurement. Chapter 4 uses independently chosen dimensions and explicitly assumed expansion coefficients."
  - title: "Guidelines for Evaluating and Expressing the Uncertainty of NIST Measurement Results, Technical Note 1297"
    creator: "Barry N. Taylor and Chris E. Kuyatt, NIST"
    year: "1994"
    url: "https://www.nist.gov/pml/nist-technical-note-1297"
    note: "Sections 5 and 6 support the distinction between combined standard uncertainty and expanded uncertainty in Chapter 6. The numerical budget is original."
  - title: "Evaluation of measurement data: The role of measurement uncertainty in conformity assessment, JCGM 106"
    creator: "Joint Committee for Guides in Metrology"
    year: "2012"
    url: "https://www.bipm.org/en/doi/10.59161/jcgm106-2012"
    note: "Background for agreeing a conformity decision rule and understanding guard bands. The book's interval-containment rule is an explicitly chosen teaching rule, not a claim of mandatory compliance."
  - title: "What is Process Capability? NIST/SEMATECH e-Handbook, section 6.1.6"
    creator: "NIST/SEMATECH"
    year: "online handbook"
    url: "https://itl.nist.gov/div898/handbook/pmc/section1/pmc16.htm"
    note: "Supports the limited capability discussion in Chapter 8, including the need for process stability and appropriate distribution assumptions."
  - title: "Gauge R & R studies, NIST/SEMATECH e-Handbook, section 2.4"
    creator: "NIST/SEMATECH"
    year: "online handbook"
    url: "https://www.itl.nist.gov/div898/handbook/mpc/section4/mpc4.htm"
    note: "Further study on separating measurement effects, operators and time. The small pilot in this book is deliberately not presented as a complete gauge R&R study."
related:
  - title: "Engineering Design Practice"
    href: "/reados/collections/engineering-design-practice/"
  - title: "Manufacturing Quality"
    href: "/reados/collections/manufacturing-quality/"
  - title: "Practical Mathematics for Engineering and Manufacturing"
    href: "/reados/collections/practical-mathematics-for-engineering/"
---

## About this book

A component can satisfy its drawing and still contribute to an assembly that binds, rattles or cannot be accepted with confidence. The missing connection is often between the function, the dimensional model, the manufacturing process and the evidence used to release the result.

This book develops that connection through ten chapters. It follows a fictional **stop-cartridge assembly**: a housing contains a cartridge and a spacer, leaving a controlled axial gap. The model starts with three dimensions, then encounters temperature, geometry, imperfect measurement, production variation and a proposed design change. Each complication changes what the original calculation can legitimately claim.

Every case value, dataset, cost and exercise is invented for education. None describes a KEVOS® customer, product or result. Dimensions are in millimetres unless another unit is stated. The cases are deliberately simple enough to reproduce by hand or with the included Python examples. They are not instructions to release a particular real assembly.

The reader should be comfortable with basic algebra and engineering drawings. Read sequentially to develop a complete decision record; use individual chapters when reviewing a specific assumption. Exercises include a worked answer or a review criterion so the reasoning can be checked independently.

## Scope and source use

The existing Engineering Design Practice collection introduces tolerances, fits and drawing practice. This authored book adds a continuous numerical investigation and an explicit acceptance decision. It does not replace a fit standard, a geometric product specification, a component manufacturer's requirements or a qualified design review.

The supplied *Machinery's Handbook* helped frame the dimensional questions. Its 2012 edition is treated as historical technical background. Current source pages were checked for the methods actually cited; no claim is made that an old handbook establishes a current contractual standard. The chapter sequence, assembly, tables, exercises, code and release records are original. Source authors and organisations do not endorse this publication.

Select the applicable drawing standard and edition with the customer and supplier. Resolve safety, regulatory and specialised material requirements within the actual project. The book's most useful habit is simple: keep the calculation and its limits together, so a correct number cannot quietly become an unsupported promise.
