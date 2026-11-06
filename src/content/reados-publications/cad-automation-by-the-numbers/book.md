---
title: "CAD Automation by the Numbers"
subtitle: "Choosing, specifying, building, testing, deploying and supporting design automation in an engineering office"
description: "Build CAD automation that pays: measure the work, choose the level, capture rules, prepare master models, specify, build, test, deploy, generate outputs and support the tool."
category: Engineering
tags: [design, automation, systems, process-improvement, validation]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Intermediate engineering design and CAD"
audience: "Design engineers, CAD administrators, drafting leads and engineering managers who want to automate repetitive modelling and drawing work and keep that automation correct, supported and worth its cost."
outcomes:
  - "Measure repetitive design work and calculate whether automation will pay back, and at which level."
  - "Capture engineering design rules as checked, owned data with a validated range."
  - "Prepare master models and write a specification that makes automation predictable."
  - "Build tools that refuse bad input, fail safely and pass a regression test on every change."
  - "Deploy, version, support and review an automation tool across a team and through CAD upgrades."
coverVariant: category
references:
  - title: "SolidWorks 2009 API: Advanced Product Development, first edition"
    creator: "Luke Malpass, AngelSix"
    year: "2008–2013"
    note: "Supplied source, read for its subject map: the difference between in-process add-ins and stand-alone programs, planning before coding, building a non-functional prototype first, debugging, installers and deployment. All rights reserved; no text, code, figures or structure are reproduced. This book is software-neutral and follows its own case and method."
  - title: "SOLIDWORKS API Help"
    creator: "Dassault Systèmes"
    year: "current release"
    note: "Named as the vendor's programming reference for one widely used CAD system. No content is quoted; readers using other CAD systems should consult their own vendor's API documentation."
  - title: "Semantic Versioning 2.0.0"
    creator: "Tom Preston-Werner"
    year: "2013"
    url: "https://semver.org/"
    note: "Reference for the major.minor.patch version numbering used for the tool in Chapter 8."
  - title: "ISO/IEC/IEEE 29119 series, Software and systems engineering: Software testing"
    creator: "ISO, IEC and IEEE"
    year: "current editions"
    note: "Named by number and scope only as the international family of software testing standards. No content is quoted; Chapter 7 uses its own regression method."
  - title: "Mechanics of Materials (any standard text)"
    creator: "Various authors"
    year: "various"
    note: "Background for the Euler column formula used as a sanity check on the trestle rules in Chapter 3. The section properties are computed from geometry with square corners and are not catalogue values."
related:
  - title: "Automating CAD with macros and APIs"
    href: "/reados/collections/cad-modelling-and-design-intent/automating-cad-with-macros-and-apis/"
  - title: "CAD Automation That Pays"
    href: "/reados/publications/cad-automation-that-pays/"
  - title: "CAD Standards That Stick"
    href: "/reados/publications/cad-standards-that-stick/"
  - title: "CAD Data You Can Trust"
    href: "/reados/publications/cad-data-you-can-trust/"
---

## About this book

Every engineering office has work it repeats: the same family of parts drawn in slightly different sizes, the same drawing set prepared for every order, the same cut list typed from the same model. Automating that work can return hundreds of hours a year. It can also produce a tool that only one person understands, that breaks at the next CAD upgrade and that quietly draws parts outside the range anyone checked. The difference between the two outcomes is mostly method, not programming skill.

This book is for design engineers, CAD administrators, drafting leads and engineering managers who want automation that pays and keeps paying. It covers the whole life of a design automation tool: measuring the work, choosing the right level of automation, capturing the engineering rules, preparing master models, writing a specification, building in safe failure, testing against a reference set, deploying across seats, generating drawings and cut lists, and supporting the tool for years. Each chapter takes one decision, works it through the running case with real numbers and ends with an exercise and its worked answer.

It assumes working knowledge of a parametric CAD system and basic engineering mechanics. It does not assume programming experience. Where code concepts matter, the chapters explain them in plain terms, and the book is deliberately neutral about the CAD system and programming language.

## The running case

The book follows a fictional fabricator that makes bolted steel **conveyor support trestles** for quarries and recycling plants. The range covers six belt widths from 450 mm to 1,200 mm, heights from 400 mm to 1,500 mm in 50 mm steps, three foot styles and two bracing arrangements: 828 possible variants. The design office of four prepares a model, a drawing set and a cut list for about 36 trestle variants a month, each taking about 2.4 hours by hand.

All quantities, times, rates and results are invented for teaching. This is an illustration. None of it describes a BIZOMAT project, product or measured result. Money is in Australian dollars, excluding GST unless stated.

## How to use the book

Read the chapters in order the first time. Chapters 1 and 2 decide whether and how to automate, Chapters 3 to 5 prepare the rules, models and specification, Chapters 6 to 9 build, test, deploy and extend the tool, and Chapter 10 keeps it alive. A reader who only needs to decide whether to automate can stop after Chapter 2.

## Source limits and professional responsibility

A 2009 book on programming add-ins for one CAD system was supplied for this book. It was used only to choose the subject and to identify the stages of building and shipping a CAD tool. The structure, case, calculations, figures and exercises here are original, and no code from the source is reproduced. Programming interfaces change between CAD releases, so this book teaches method rather than specific calls.

This book is educational. An automation tool repeats whatever rules it is given, including wrong ones, faster than any person. Structural, pressure, lifting and other safety-related designs produced by automation still need qualified engineering review, and the rules behind them need the same verification as any engineering calculation.
