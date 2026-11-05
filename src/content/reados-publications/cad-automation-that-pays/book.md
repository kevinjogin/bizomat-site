---
title: "CAD Automation That Pays"
subtitle: "Macros, scripts and add-ins for a CAD office: choosing what to automate, units, selections, assemblies, properties, batch export, testing and upkeep"
description: "Automate CAD work that pays: payback, recorded and written macros, the object model, units, selections, assembly traversal, properties, batch export, add-ins and upkeep."
category: Engineering
tags: [automation, design, systems, quality, process-improvement]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Intermediate CAD administration and programming"
audience: "CAD administrators, design engineers and drafters who write or commission macros, scripts and add-ins for a parametric CAD system, and managers who decide which CAD work is worth automating."
outcomes:
  - "Decide which CAD tasks are worth automating from a time study, an error count and a payback estimate."
  - "Turn a recorded macro into a written one that checks its inputs and the state of the CAD session."
  - "Handle the API's internal units, selections and assembly structures without silent errors."
  - "Build batch tools for properties, drawings and exports that log, recover and report what they did."
  - "Test, deploy and maintain automation through CAD upgrades at a known cost."
coverVariant: category
references:
  - title: "SolidWorks 2008 API: Programming & Automation (SolidWorks API Series 1), second edition"
    creator: "Luke Malpass, AngelSix"
    year: "2011"
    note: "Supplied source and its example files, read as a subject map of CAD API programming: recorded and written macros, connecting from VBA, C# and VB.NET, document information, selections, mates, materials, dimensions, PropertyManager pages, assembly traversal, custom properties, drawings and add-ins. No code, text, figures or exercises are reproduced; the examples in this book are original and language-neutral."
  - title: "Units (SOLIDWORKS API Help)"
    creator: "Dassault Systèmes"
    year: "2020"
    url: "https://help.solidworks.com/2020/english/api/sldworksapiprogguide/overview/units.htm"
    note: "Reference for the API's use of metres, radians and SI units regardless of a document's display units, in Chapter 4."
  - title: "GetChildren Method (IComponent2) (SOLIDWORKS API Help)"
    creator: "Dassault Systèmes"
    year: "2017"
    url: "https://help.solidworks.com/2017/English/api/sldworksapi/SOLIDWORKS.Interop.sldworks~SOLIDWORKS.Interop.sldworks.IComponent2~GetChildren.html"
    note: "Reference for the need to traverse an assembly recursively, because the method returns only one level of children, and for suppressed and lightweight components appearing in the results, in Chapter 6."
  - title: "Traverse Assembly at Component Level Example (VBA) (SOLIDWORKS API Help)"
    creator: "Dassault Systèmes"
    year: "2020"
    url: "https://help.solidworks.com/2020/english/api/sldworksapi/traverse_assembly_at_component_level_example_vb.htm"
    note: "The vendor's own recursive traversal example, cited for readers who want working code. Not reproduced."
related:
  - title: "Automating CAD with macros and APIs"
    href: "/reados/collections/cad-modelling-and-design-intent/automating-cad-with-macros-and-apis/"
  - title: "CAD Standards That Stick"
    href: "/reados/publications/cad-standards-that-stick/"
  - title: "CAD Data You Can Trust"
    href: "/reados/publications/cad-data-you-can-trust/"
  - title: "CAD Automation by the Numbers"
    href: "/reados/publications/cad-automation-by-the-numbers/"
---

## About this book

Most CAD offices have a handful of macros. Someone recorded one to save drawings as PDF, someone else wrote one to fill in title block properties, and a third, found on a forum, renames files in a way nobody quite remembers. They save time until the CAD system is upgraded, the person who wrote them leaves, or one of them quietly writes the wrong value into a thousand files. Automation in a CAD office is worth doing, and worth doing deliberately: choosing the tasks that pay, writing code that checks what it is about to change, and treating each tool as a small piece of software with an owner, a test set and an upgrade plan.

This book is a method for that. It starts with deciding what to automate, from a time study and an error count, and works through the practical problems every CAD automation meets: what a recorded macro gets wrong, how a CAD program's objects are organised, the internal units its programming interface uses, working with what the user has selected, walking through assemblies, reading and writing custom properties, automating drawings and batch exports, giving tools a user interface, and testing and maintaining them through upgrades.

It suits CAD administrators and engineers who write macros, and managers who commission or approve them. Some programming experience helps, at the level of variables, conditions and loops; the code examples are short, original and written as language-neutral pseudocode, so that they translate into whichever language the reader's CAD system supports. Where a programming interface behaves in a particular way, the book uses SOLIDWORKS as its example, cites the vendor's own API help, and says so. The Library’s collection chapter on automating CAD with macros and APIs gives a shorter overview; this book goes into the numbers and the failure modes.

## The running case

Every chapter follows one fictional project. This is an illustration. A machinery builder's drawing office has nine CAD seats and releases about 40 drawings a week. Each release is done by hand: check the title block properties, save a PDF of the drawing, save a DXF of any sheet metal flat, save a STEP of the model, copy the files to the release folder with the right names, and record the release in the register. The office's CAD administrator proposes a "release pack" tool to do it, and the chapters follow the tool from the first time study to its third year in service.

The business, the tool and its faults are invented; none describes BIZOMAT work, a real office or a real product.

## Source limits and professional responsibility

Programming interfaces change between versions and between CAD products. The behaviour described here was checked against the vendor's current help pages where cited, and the reader should confirm it against the help for the version they use. Every calculation in the book was checked by running it.

Automation acts on engineering data at speed. A tool that writes a wrong value, deletes a configuration or saves over a released file can do in a minute what would take a person a week to undo. Test on copies, keep backups that have been restored, and treat any tool that changes released data as a controlled change under the office's procedures. Licensing terms for CAD programming interfaces and add-ins vary; check them with the vendor or reseller before distributing a tool outside the licensed organisation.
