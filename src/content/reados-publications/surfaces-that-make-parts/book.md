---
title: "Surfaces That Make Parts"
subtitle: "Surface modelling for manufacturable CAD parts: curves, lofts, patches, trims, knits, checks and thickening"
description: "Build complex CAD shapes from surfaces and turn them into parts that can be checked, moulded and made: curves, lofts, patches, trimming, knitting, continuity and draft."
category: Engineering
tags: [design, manufacturing, product-development, validation]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-25
referencesChecked: 2026-10-25
edition: "1"
level: "Intermediate 3D CAD modelling"
audience: "Designers, drafters and engineers who already model parts as solids and need surfaces for shapes that extrudes and revolves cannot make, and who must hand those shapes on to toolmakers and suppliers."
outcomes:
  - "Decide when a shape needs surface modelling and plan the curves, planes and sections that will carry it."
  - "Build extruded, revolved, swept, lofted, planar and filled surfaces and predict where each will fail."
  - "Trim, extend, offset and knit surfaces into a watertight body, and find gaps before they reach a supplier."
  - "Check continuity, curvature, section area and draft with the analysis tools, and read what they do not prove."
  - "Thicken or close a surface body into a solid, check its mass and wall, and release the model for tooling."
coverVariant: category
references:
  - title: "SolidWorks for Designers, Chapter 15: Surface Modeling"
    creator: "CADCIM Technologies"
    year: "2003"
    note: "Supplied copy (62 pages) read in full. Used only as a checklist of the surface tools a mainstream parametric modeller offers. Its sequence, text, figures, tutorials and exercises are not used; the running case, examples and checks in this book are original."
  - title: "The NURBS Book, 2nd edition"
    creator: "Les Piegl and Wayne Tiller (Springer)"
    year: "1997"
    url: "https://link.springer.com/doi/10.1007/978-3-642-59223-2"
    note: "Background on how NURBS curves and surfaces are defined by control points, knots and weights, which explains why fit-point curves, rebuilds and conversions behave as described in Chapters 2 and 4."
  - title: "Shape Interrogation for Computer Aided Design and Manufacturing (hyperbook edition)"
    creator: "Nicholas M. Patrikalakis, Takashi Maekawa and Wonjoon Cho (MIT)"
    year: "2009"
    url: "https://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/"
    note: "Freely available text used for the differential geometry of curves and surfaces (curvature, continuity, curvature analysis) and for offset curves and surfaces in Chapters 6 and 8."
  - title: "An overview of offset curves and surfaces"
    creator: "Takashi Maekawa, Computer-Aided Design 31(3), 165–173"
    year: "1999"
    url: "https://doi.org/10.1016/S0010-4485(99)00013-5"
    note: "Survey used for the condition under which an offset self-intersects, applied to the thickening failure in Chapters 6 and 9."
  - title: "Curves and Surfaces for CAGD: A Practical Guide, 5th edition"
    creator: "Gerald Farin (Morgan Kaufmann)"
    year: "2002"
    note: "Background on parametric and geometric continuity between patches, used for the G0, G1 and G2 explanations in Chapter 8."
  - title: "Plastic Part Design for Injection Molding: An Introduction, 2nd edition"
    creator: "Robert A. Malloy (Hanser)"
    year: "2010"
    note: "General principles of uniform wall, draft, radii and parting lines that frame Chapters 9 and 10. No design values are quoted from it; the values in the running case are illustrations."
  - title: "Materials Science and Engineering: An Introduction, 10th edition"
    creator: "William D. Callister Jr and David G. Rethwisch (Wiley)"
    year: "2018"
    note: "Typical density of polypropylene, about 0.90 g/cm³, used for the mass estimate in Chapter 9. A real part uses the chosen grade's datasheet."
  - title: "SOLIDWORKS Web Help"
    creator: "Dassault Systèmes"
    year: "current edition when checked"
    url: "https://help.solidworks.com/"
    note: "Checked for the current names of surface commands in one mainstream modeller. Command names in other systems are given as examples only; check your own software's help."
  - title: "Standards named but not read: ISO 10303-242 (STEP application protocol for managed model-based 3D engineering) and ISO 10303-214"
    creator: "ISO"
    year: "editions as called up by the contract"
    note: "Named by number and scope in Chapter 10 as common neutral exchange formats. No content is quoted; check which edition and protocol your supplier accepts."
related:
  - title: "Building CAD surfaces with clear dependencies"
    href: "/reados/collections/cad-modelling-and-design-intent/building-cad-surfaces-with-clear-dependencies/"
  - title: "Choosing and checking curves in CAD"
    href: "/reados/collections/cad-modelling-and-design-intent/choosing-and-checking-curves-in-cad/"
  - title: "Drawings That Make Parts"
    href: "/reados/publications/drawings-that-make-parts/"
---

## About this book

Most mechanical parts are modelled as solids: sketch a profile, extrude it, cut holes, add fillets. That works until the shape stops being a sequence of prisms and cylinders. A duct that changes from round to rectangular, a handle that has to fit a hand, a cover that wraps around a mechanism: these are easier, and sometimes only possible, when you build the skin first and give it thickness afterwards. That is surface modelling.

This book teaches surface modelling as an engineering method, not as a list of buttons. Each chapter adds one family of operations to a single part and asks the questions a toolmaker, an analyst or an inspector will ask later: is the section area right, does the surface close, will it offset, can it be pulled from a mould, and what does it weigh? It assumes you can build ordinary solid models in a parametric CAD system and read a simple drawing. It is software-neutral. Where a command name helps, it gives the name used in one mainstream modeller and notes that other systems use different words for the same operation.

Read the chapters in order the first time; each one builds on the model left by the previous chapter. Each chapter ends with an exercise and a worked answer. The Library’s chapter [Building CAD surfaces with clear dependencies](/reados/collections/cad-modelling-and-design-intent/building-cad-surfaces-with-clear-dependencies/) is a short companion on dependency chains; this book goes further into building, checking and releasing a whole part.

## The running case

Every chapter follows one fictional part. This is an illustration. A small Australian manufacturer of compressor enclosures needs an air-inlet duct between a filter chamber and the compressor's intake. The flow surface starts with a bell-mouth of 10 mm radius at the open inlet, runs as a round section of 120 mm inside diameter for 30 mm, then changes over 200 mm into a rectangle 180 mm wide and 60 mm high with 15 mm corner radii. The outlet centre sits 30 mm below the inlet centre so the duct clears a frame rail, and the outlet ends in a flat mounting flange 230 mm by 110 mm. A flat pad on the left side wall carries a pressure switch. The duct is moulded in polypropylene with a 2.5 mm wall, as two half-shells split on the vertical plane of symmetry.

The numbers are invented but they are worked properly: areas, volumes, curvatures, offsets, draft and mass are all calculated and checked, and most chapters include a modelling mistake, how it was detected and how it was corrected. The part, the business and the mistakes are fictional; none describes KEVOS® work, a client or a supplier.

## Source limits and professional responsibility

The tool coverage was checked against a supplied CAD training chapter, which is acknowledged in the references but not reproduced. The geometry comes from standard texts on curves, surfaces and offsets, which are listed with each use. Command names, defaults and options differ between CAD systems and between releases of the same system; check your own software's help before relying on a behaviour described here.

This book is educational. The duct's dimensions, wall, draft and material are chosen to illustrate the method, not as design values. A real moulded part needs the resin supplier's design data, the toolmaker's review of draft, parting lines and gating, and, where it carries load, pressure or a safety function, analysis and approval by a qualified engineer.
