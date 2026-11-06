---
title: "CAD Standards That Stick"
subtitle: "Settings, templates, properties, libraries and modelling rules for a small parametric CAD office"
description: "Set up a parametric CAD office so every seat, template, property, library part and model behaves the same, then check, train and change the standard without losing control."
category: Engineering
tags: [design, systems, quality, process-improvement, automation]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Intermediate CAD practice and administration"
audience: "CAD administrators, lead designers and engineering managers in small design offices who need parametric CAD to behave the same way for every person, every file and every release."
outcomes:
  - "Define what a CAD administrator owns and measure the current environment before changing it."
  - "Separate settings that change results from personal preferences, and control only the first group."
  - "Build templates, a property schema and a shared standard-part library that feed drawings and bills of materials cleanly."
  - "Write a short modelling and drawing standard, test models by flexing them, and check compliance by sampling."
  - "Run training, support and change requests so the standard improves instead of drifting."
coverVariant: category
references:
  - title: "SolidWorks Administration Bible"
    creator: "Matt Lombard; Wiley Publishing"
    year: "2010"
    note: "Supplied copy, ISBN 978-0-470-53726-8, reviewed for its table of contents and the range of subjects a CAD administrator handles. Its menus, settings, macros, templates and chapter sequence describe SolidWorks 2010 and are neither reproduced nor relied on. This book is vendor-neutral and uses its own structure, case, figures and exercises."
  - title: "SOLIDWORKS 2025 Installation and Administration Guide"
    creator: "Dassault Systèmes SolidWorks Corporation"
    year: "2025"
    url: "https://files.solidworks.com/Supportfiles/SW_Installation_Guide/2025/English/install_guide.pdf"
    note: "Current vendor documentation, checked for the idea of an administrative image and option editor that keep versions, products and settings consistent across many installations. Used only as an example of a deployment mechanism; other CAD systems offer their own equivalents."
  - title: "AS 1100.101-1992 Technical drawing, Part 101: General principles"
    creator: "Standards Australia, Committee ME/72"
    year: "1992"
    url: "https://store.standards.org.au/product/as-1100-101-1992"
    note: "Named as the drawing standard that templates and the written CAD standard must follow in Australia. No values are quoted; the Library’s Drawings That Make Parts explains the conventions themselves."
  - title: "ISO 7200 Technical product documentation: Data fields in title blocks and document headers"
    creator: "International Organization for Standardization"
    year: "edition as called up by the contract"
    note: "Named by number and scope only, as a reference point for deciding which title block fields a property schema should carry. Not read for this book; no field lists or values are taken from it."
  - title: "Essential Eight Explained"
    creator: "Australian Signals Directorate, Australian Cyber Security Centre"
    year: "current guidance"
    url: "https://www.cyber.gov.au/publication/essential-eight-explained"
    note: "Checked for its baseline mitigation strategies, including restricting Microsoft Office macros, application control and restricting administrative privileges. Cited in Chapter 9 as context for controlling CAD macros and add-ins; not a CAD-specific requirement."
related:
  - title: "Governing a CAD environment"
    href: "/reados/collections/engineering-design-practice/governing-a-cad-environment/"
  - title: "3D CAD Modelling and Design Intent"
    href: "/reados/collections/cad-modelling-and-design-intent/"
  - title: "Drawings That Make Parts"
    href: "/reados/publications/drawings-that-make-parts/"
---

## About this book

Parametric CAD gives every designer a powerful, private workshop. That is its strength and, in a team, its weakness. Each seat carries hundreds of settings, each person has habits, and each file inherits whatever template, property names and library parts happened to be on hand when it was started. Left alone, a small office ends up with six slightly different ways of doing everything, and the differences surface where they cost most: in the bill of materials, on the workshop floor and during the next upgrade.

This book is for the person who has to make the office behave as one system, whether that is a full-time CAD administrator or, more often, a lead designer with a few hours a week. It works through the environment in the order it is usually built: what the role owns, how to measure the starting point, which settings to control, templates, custom properties, standard-part libraries, modelling rules, the written standard, compliance checking, and finally training, support and change. Each chapter ends with an exercise and its worked answer.

You will need working knowledge of one parametric CAD system and of mechanical drawings. The book is deliberately vendor-neutral. Menus and file types differ between products and change between releases, so the chapters describe what to decide and how to test it, and leave the clicks to your vendor's current documentation.

## The running case

Every chapter follows one fictional design office. This is an illustration. A small Australian manufacturer of modular belt conveyors runs six CAD seats: an engineering manager, three designers, a drafter and a graduate. Its main product family is a 600 mm wide transfer module made in seven lengths from 1,200 mm to 3,000 mm in 300 mm steps. The office issues about 480 new drawings a year, holds about 26,400 CAD files in its project folders and has 3,860 standard-part files scattered across personal and shared folders. One of the designers has been given four hours a week to act as CAD administrator.

The chapters measure the office, change it and measure it again. Money is in Australian dollars at an internal cost rate of A$95 an hour; internal labour costs carry no GST, and any bought item is shown excluding GST. The business, people, files, times and costs are invented for teaching. None of them describes BIZOMAT work, a real company or a real software product's performance.

## Source limits and professional responsibility

The supplied source was a 2010 book on administering one CAD product. It shaped the list of subjects that a CAD administrator must cover, but its product instructions are old, and nothing in its text, figures, templates or macros has been reproduced. The current vendor guide cited in the references was checked for the general idea of deploying settings centrally. Drawing conventions belong to the standards your work calls up, normally AS 1100 in Australia; this book refers to them and does not restate them.

A CAD standard is a tool for consistency, not a substitute for engineering judgement. Consistent files can still describe an unsafe or unsuitable design. Design approval, checking of calculations and compliance with regulations remain the responsibility of competent people, and anything in this book that touches safety-related equipment needs review against the actual product and its standards.
