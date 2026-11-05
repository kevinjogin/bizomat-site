---
title: "Printed Mechanisms That Run"
subtitle: "Designing 3D-printed working assemblies with gears, bearings, fits and fasteners, and a build guide that goes together first time"
description: "Design an FDM-printed working mechanism: orientation, measured fits, bearings, printed gears, a Geneva index, fasteners, low-voltage drive and a tested build guide."
category: Products
tags: [prototyping, design, product-development, validation, manufacturing]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-25
referencesChecked: 2026-10-25
edition: "1"
level: "Intermediate mechanical design and prototyping"
audience: "Designers, engineering students, makers and product teams who can model parts in CAD and run a desktop printer, and now want printed mechanisms that move reliably and can be rebuilt by others."
outcomes:
  - "Scope a printed mechanism by loads, temperatures and the jobs printing does well or badly."
  - "Choose print orientation and set fits from measured calibration coupons rather than guesses."
  - "Size printed gears, a planetary stage and a Geneva index, and check tooth stress with stated assumptions."
  - "Join printed parts with inserts, screws and snap fits that survive repeated assembly."
  - "Wire a low-voltage drive safely and write a build guide whose checks catch assembly errors."
coverVariant: category
references:
  - title: "Electric Turboprop with Variable Pitch Propellers, Build Guide v1.6.4"
    creator: "CADLY"
    year: "2024 (copyright notice); PDF created January 2025"
    url: "https://cadly.com.au/"
    note: "Supplied commercial build guide for a printed model kit, reviewed only as evidence of the topics a printed-mechanism build involves: numbered parts, hardware lists, print settings, gear trains and calibration. No text, images, part designs, sequences, bills of materials or settings are reproduced, and the case in this book is a different, original mechanism."
  - title: "ISO/ASTM 52900:2021 Additive manufacturing, General principles, Fundamentals and vocabulary"
    creator: "ISO and ASTM International"
    year: "2021"
    note: "Named by number and scope for the process terminology, including material extrusion. No clauses are quoted."
  - title: "ISO/ASTM 52910:2018 Additive manufacturing, Design, Requirements, guidelines and recommendations"
    creator: "ISO and ASTM International"
    year: "2018"
    note: "Named by number and scope as the general design-for-additive guideline. Specific clearances and settings in this book come from the case's own coupon tests, not from the standard."
  - title: "Additive Manufacturing Technologies, 3rd edition"
    creator: "Ian Gibson, David Rosen, Brent Stucker and Mahyar Khorasani"
    year: "2021"
    note: "Springer. Background for material extrusion, layer bonding and anisotropy discussed in Chapters 1 and 2."
  - title: "Shigley's Mechanical Engineering Design, 11th edition"
    creator: "Richard G. Budynas and J. Keith Nisbett"
    year: "2020"
    note: "McGraw-Hill. Source of the Lewis bending equation and the Lewis form factors for 12 and 18 teeth used in Chapter 5, and background for shafts and bearings."
  - title: "Mechanisms and Dynamics of Machinery, 4th edition"
    creator: "Hamilton H. Mabie and Charles F. Reinholtz"
    year: "1987"
    note: "Wiley. Background for Geneva mechanism geometry and motion. The velocity and acceleration values in Chapter 6 were recalculated numerically for this book."
  - title: "Electrical Equipment Safety System (EESS) and the Regulatory Compliance Mark"
    creator: "Electrical Regulatory Authorities Council"
    year: "current guidance"
    url: "https://www.erac.gov.au/"
    note: "Background for buying a compliant mains power supply in Australia in Chapter 8. The book's own wiring is extra-low-voltage DC only."
  - title: "Arduino language reference"
    creator: "Arduino"
    year: "current online documentation"
    url: "https://docs.arduino.cc/"
    note: "Checked for the 10-bit analogue input range and 8-bit PWM output range of common ATmega328P-based boards used in Chapter 8."
related:
  - title: "Gears by the Numbers"
    href: "/reados/publications/gears-by-the-numbers/"
  - title: "Fits That Work"
    href: "/reados/publications/fits-that-work/"
  - title: "Product Development and Launch"
    href: "/reados/collections/product-development-and-launch/"
---

## About this book

Printing a part is easy. Printing twenty parts that go together into a mechanism, turn smoothly, survive being taken apart and work again when someone else builds them from your files is a design problem. The difficulty is rarely the printer. It lies in clearances that were guessed, gears that were drawn rather than designed, holes that shrank, screws that stripped and instructions that assumed the builder already knew what the designer knew.

This book is for people who can model parts in CAD and run a desktop material-extrusion printer, often called FDM or FFF, and who now want working mechanisms. It covers scoping, orientation, measured fits, bearings and shafts, printed gears, an intermittent indexing drive, fasteners, a low-voltage drive and control, and the build guide that turns a set of files into a repeatable product. Read the chapters in order the first time; each one ends with an exercise and a worked answer.

## The running case

This is an illustration. The book follows a fictional **six-station rotary indexing table**, a desktop teaching model printed in PLA and PETG. A 12 V DC gearmotor drives a printed planetary stage with a 5:1 ratio, which turns a six-slot Geneva mechanism. The 140 mm dial steps 60° at a time, about ten times a minute, pausing at each station. Standard 608 ball bearings, 8 mm steel shafts, M3 screws and heat-set inserts make up the bought hardware, and a small microcontroller board sets the speed and the dwell.

Every load, measurement, cost, print time and test result in the case is invented for teaching. None of it describes a BIZOMAT project, product or client. Prices are illustrative Australian dollars including GST. Calculations were checked by running them, and figures carry the same numbers as the text.

## Source limits and professional responsibility

The Library already introduces additive manufacturing for production parts and has a full book on gear geometry. This book concentrates on one printed mechanism and the decisions that make it work. A supplied commercial build guide for a different printed model informed the topic review only; nothing from it is reproduced, and its publisher does not endorse this book.

Printed mechanisms in this book are teaching and demonstration devices at low speed and low power. The stress checks use simple models with stated assumptions and do not qualify a part for a product, a load-bearing use or anything that could injure someone if it failed. Mains electricity is outside scope: use a purchased, compliant power supply, and leave any mains work to a licensed electrician. Real products need qualified review, supplier data and their own testing.
