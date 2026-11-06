---
title: "Bills of Materials by the Numbers"
subtitle: "Structuring, rolling up and costing bills of materials: levels, quantities, units, scrap, phantoms, variants, effectivity and BOMs built from CAD"
description: "Build bills of materials that order the right parts: levels, quantity roll-ups, units of measure, scrap and yield, phantoms, variants, costed roll-ups, effectivity and CAD BOMs."
category: Manufacturing
tags: [manufacturing, operations, systems, quality, design]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Intermediate manufacturing engineering and operations"
audience: "Design and manufacturing engineers, CAD administrators, planners and buyers who create, check or use bills of materials to order, make and cost products."
outcomes:
  - "Structure a bill of materials in levels and read it as indented, top-level and parts-only views."
  - "Roll up quantities through every level and convert between buying and using units."
  - "Allow for scrap, cutting yield and kerf so that gross requirements cover what is really consumed."
  - "Handle phantoms, kits, variants and effectivity without double counting or ordering the wrong revision."
  - "Cost a product from its BOM, and build and audit BOMs generated from CAD assemblies."
coverVariant: category
references:
  - title: "SolidWorks 2008 API: Programming & Automation (SolidWorks API Series 1), second edition"
    creator: "Luke Malpass, AngelSix"
    year: "2011"
    note: "Supplied source, read as a subject map for traversing assemblies, reading custom properties and configurations, which Chapter 10 applies to generating BOMs. No code, text, figures or exercises are reproduced."
  - title: "Indented BOMs (SOLIDWORKS Help)"
    creator: "Dassault Systèmes"
    year: "2016"
    url: "https://help.solidworks.com/2016/English/SolidWorks/sldworks/c_indented_boms.htm"
    note: "Reference for the indented, top-level-only and parts-only BOM views a CAD program produces from an assembly, used in Chapters 1, 2 and 10."
  - title: "Creating Bills of Materials from Parts or Assemblies (SOLIDWORKS Help)"
    creator: "Dassault Systèmes"
    year: "2021"
    url: "https://help.solidworks.com/2021/english/solidworks/sldworks/t_creating_boms_parts_assemblies.htm"
    note: "Reference for how a CAD BOM is generated from an assembly and its configurations, in Chapters 7 and 10."
  - title: "Orlicky's Material Requirements Planning, third edition"
    creator: "Carol Ptak and Chad Smith, McGraw-Hill"
    year: "2011"
    note: "Background reading on bill of materials structures, low-level codes, phantoms and gross-to-net requirements. No text, figures or values are reproduced."
related:
  - title: "Modelling bills of materials and other hierarchies"
    href: "/reados/collections/manufacturing-operations-and-design-for-manufacture/modelling-bills-of-materials-and-hierarchies/"
  - title: "CAD Automation That Pays"
    href: "/reados/publications/cad-automation-that-pays/"
  - title: "CAD Standards That Stick"
    href: "/reados/publications/cad-standards-that-stick/"
---

## About this book

A bill of materials is a list of what goes into a product, and it is the document most of a manufacturing business runs on. Purchasing buys from it, the store picks from it, the workshop builds from it, costing prices from it and the planning system schedules from it. When it is right, nobody notices. When it is wrong by one bracket, a build stops; when it is wrong by a factor, because a sub-assembly's quantity was not multiplied or a bar was ordered in pieces instead of metres, the business buys too much, too little or the wrong thing, sometimes for months before anyone traces the cause.

This book is about getting the numbers in a bill of materials right. It starts with what a BOM is for and how its levels are structured, then works through the arithmetic that most BOM errors come from: quantities that multiply down the levels, units of measure that differ between buying and using, scrap and cutting yield, phantoms and kits that are counted once or twice, variants that share most of their parts, costed roll-ups, and the revisions and effectivity dates that decide which version of a part a build uses. It ends with BOMs generated from CAD assemblies and how to keep them accurate.

It suits design and manufacturing engineers, CAD administrators, planners and buyers. It assumes no particular software. The Library’s collection chapter on modelling bills of materials and hierarchies covers how business systems store BOMs; this book covers what the numbers in them must be.

## The running case

Every chapter follows one fictional product. This is an illustration. A machinery builder makes a pallet conveyor module, PC-600: a welded steel frame, a drive unit with a bought motor and gearbox and a made drive shaft assembly, twelve idler rollers each made from a tube, a shaft, two bearings and two end caps, two folded sheet metal side guides, a belt bought by the metre, and the fasteners that hold them together. The business builds the module in batches for different customers, sometimes with options, and its BOM lives in its CAD assemblies and its business system.

The business, the product and the faults are invented; none describes BIZOMAT work, a real supplier or a real product. Prices are illustrations in Australian dollars, excluding GST.

## Source limits and professional responsibility

The arithmetic of bills of materials is exact, and every calculation in this book was checked by running it. How a particular business system stores, explodes or costs a BOM varies between products and configurations, and the book describes the logic rather than any system's screens. Check your own system's behaviour, especially for phantoms, units of measure and effectivity, against a small worked example before trusting it with a large one.

A BOM is an engineering record. Changes to it are changes to what the business makes and buys, and they should go through the business's change control, with the people who own each part of the record, design, purchasing and production, agreeing to them.
