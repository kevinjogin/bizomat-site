---
title: "Housings That Rebuild"
subtitle: "Curves, continuity, surfaces, shells and split parts for a plastic housing model that survives change"
description: "Model a two-part plastic housing with hybrid surface and solid methods: clean curves, chosen continuity, shells that solve, robust references and a master model split into parts."
category: Engineering
tags: [design, product-development, quality, validation]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-25
referencesChecked: 2026-10-25
edition: "1"
level: "Intermediate to advanced parametric CAD"
audience: "Mechanical and product designers who can already build solid parts in a parametric CAD system and now need curved housings that shell, split and survive design changes."
outcomes:
  - "Capture a housing's design intent in a small set of controlling sketches, planes and parameters."
  - "Build curves with few controls and judge G0, G1 and G2 joins with curvature and zebra evidence."
  - "Choose between extrude, sweep, loft, boundary and fill features, and avoid degenerate patches."
  - "Diagnose and fix shell, knit and rebuild failures by testing rather than guessing."
  - "Split a master model into separate parts with lips, bosses and draft that update together."
coverVariant: category
references:
  - title: "Advanced Modeling Techniques (presentation slides)"
    creator: "Mark Biasotti"
    year: "c. 2003 (PDF dated April 2003)"
    note: "Supplied conference-style slide deck reviewed for its topic list: design intent, curve continuity, loft and fill choice, surface utilities, shelling problems and split-part methods. No slides, wording, images, exercises or sequence are reproduced; the case, calculations and figures in this book are original."
  - title: "SOLIDWORKS Help"
    creator: "Dassault Systèmes"
    year: "current online help"
    url: "https://help.solidworks.com/"
    note: "Checked for the names and general behaviour of commands mentioned as examples, such as Fill Surface, Knit Surface, Thicken, Replace Face, Split and multibody parts. Other parametric CAD systems offer equivalent tools under different names."
  - title: "The NURBS Book, 2nd edition"
    creator: "Les Piegl and Wayne Tiller"
    year: "1997"
    note: "Springer. Background for B-spline and NURBS curves, control points, degree and knot behaviour described in Chapters 2 and 3."
  - title: "Curves and Surfaces for CAGD: A Practical Guide, 5th edition"
    creator: "Gerald Farin"
    year: "2002"
    note: "Morgan Kaufmann. Background for parametric and geometric continuity and curvature as used in Chapter 3. The clothoid-pair blend calculation is this book's own numerical example."
  - title: "Plastic Part Design for Injection Molding: An Introduction, 2nd edition"
    creator: "Robert A. Malloy"
    year: "2010"
    note: "Hanser. Background for draft, nominal wall, bosses and lip-and-groove joints in Chapter 8. Specific dimensions in the case are teaching choices to be confirmed with the moulder and resin supplier."
  - title: "ISO 10303 (STEP) and ASME Y14.41, Digital Product Definition Data Practices"
    creator: "International Organization for Standardization; American Society of Mechanical Engineers"
    year: "current editions"
    note: "Named by number and scope only, as the exchange format and model-based definition practice that a released model may need to satisfy. No clauses are quoted."
related:
  - title: "Surfaces That Make Parts"
    href: "/reados/publications/surfaces-that-make-parts/"
  - title: "3D CAD Modelling and Design Intent"
    href: "/reados/collections/cad-modelling-and-design-intent/"
  - title: "Drawings That Make Parts"
    href: "/reados/publications/drawings-that-make-parts/"
  - title: "Manufacturing Operations and Design for Manufacture"
    href: "/reados/collections/manufacturing-operations-and-design-for-manufacture/"
---

## About this book

Most designers can build a block with fillets. Fewer can build a curved housing that still rebuilds after the industrial designer raises the crown by 2 mm, the electronics team lengthens the board by 10 mm and the moulder asks for a thicker wall. This book is for the second job. It treats an advanced part model as a structure of decisions: which curves control the shape, how faces meet, which features are allowed to depend on which, and how one master shape becomes several parts.

You should already be comfortable with sketches, constraints, extrudes, revolves, fillets and simple assemblies in a parametric CAD system. Command names follow SOLIDWORKS where an example helps, because that is where the supplied material came from, but the methods apply to any history-based modeller with surface tools. Read the chapters in order the first time. Each one builds a piece of the same model and ends with an exercise and a worked answer.

## The running case

This is an illustration. The book follows a fictional **handheld moisture-meter housing** moulded in PC/ABS. It is 160 mm long, 72 mm wide and 34 mm tall, with a 2.0 mm nominal wall, a crowned top that rises 6 mm across its width, plan-view corners of R10, a 50 mm by 30 mm display window and a narrowed sensor nose. The housing splits into a top cover and a base at a parting height 14 mm above the underside.

Every dimension, mass, failure and test result in the case is invented for teaching. None of it describes a KEVOS® project, client or product. Calculations were checked by running them, and figures carry the same numbers as the text.

## Source limits and professional responsibility

READOS already introduces curves, surfaces, face editing and design intent in its edited CAD collection. This book goes deeper on one connected case and on the failure modes that the overview chapters only mention. The supplied slide deck informed the topic review only; nothing from it is reproduced.

The book teaches modelling method. It does not certify a part for moulding, impact, ingress protection, electrical safety or any regulated use. Draft, wall, boss and joint dimensions in the case are starting points for discussion with a moulder and resin supplier, not design values. A real product needs qualified review, supplier confirmation and its own testing.
