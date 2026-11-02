---
title: "Vibrating Machine Elements by the Numbers"
subtitle: "Wave speed, natural frequency and resonance in belts, cables, bars, shafts, springs and panels"
description: "Find the natural frequencies of belts, guy ropes, shafts, isolator springs and panels from wave speed, then keep them clear of what drives the machine."
category: Engineering
tags: [design, validation, quality]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Intermediate mechanical engineering"
audience: "Mechanical designers, maintenance and reliability engineers, and technicians who set up, troubleshoot or review belt drives, fans, guyed structures, isolated plant and sheet metal enclosures."
outcomes:
  - "Calculate wave speed and the first natural frequencies of strings, belts, cables, bars, shafts and springs."
  - "Set and check belt tension by span frequency, and recognise the input errors that make the reading wrong."
  - "List a machine's excitation frequencies across its whole speed range and test every natural frequency against them."
  - "Choose isolator deflection, panel stiffening and shaft size changes from transmissibility and frequency margins."
  - "Measure damping and beats from a tap test or spectrum and record the findings in a resonance register."
coverVariant: category
references:
  - title: "Waves: A mathematical approach to the common types of wave motion, second edition"
    creator: "C. A. Coulson, revised by Alan Jeffrey"
    year: "1977"
    note: "Longman Mathematical Texts. Supplied source, read selectively for the physics of waves on strings, reflection at a junction, longitudinal waves in bars and springs, and membranes. It is a mathematical text under copyright: no passages, derivations, figures, examples or exercises are reproduced, and this book's structure, running case and applications are original."
  - title: "Mechanical Vibrations, fourth edition"
    creator: "J. P. Den Hartog"
    year: "1956 (Dover reprint 1985)"
    note: "Background for single-degree-of-freedom response, transmissibility, torsional vibration of drive trains and damping. The formulas used are standard results; no worked examples are reused."
  - title: "Formulas for Natural Frequency and Mode Shape"
    creator: "Robert D. Blevins"
    year: "1979"
    note: "Van Nostrand Reinhold, later reprinted by Krieger. Reference for the standard natural-frequency formulas of taut strings, bars, simply supported rectangular plates and membranes used in Chapters 2, 4, 5 and 9. No tables are reproduced."
  - title: "Flow-Induced Vibration, second edition"
    creator: "Robert D. Blevins"
    year: "1990"
    note: "Van Nostrand Reinhold. Background for vortex shedding from circular cylinders and the Strouhal number of about 0.2 used as a screening value in Chapter 4."
  - title: "Classical vibration analysis of axially moving continua"
    creator: "J. A. Wickert and C. D. Mote, Jr."
    year: "1990"
    note: "Journal of Applied Mechanics, 57(3), 738–744. Source for the reduction in the natural frequencies of a string as its transport speed rises, used in Chapter 3."
  - title: "Mechanical Springs, second edition"
    creator: "A. M. Wahl"
    year: "1963"
    note: "McGraw-Hill. Background for surge in helical springs and the standing-wave treatment of a spring's own mass in Chapter 8. The surge frequency formula is the standard result; no examples are reused."
  - title: "8.03SC Physics III: Vibrations and Waves"
    creator: "Yen-Jie Lee, Massachusetts Institute of Technology OpenCourseWare"
    year: "2016"
    url: "https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/"
    note: "Free course material for readers who want the derivations behind travelling waves, standing waves, reflection and impedance that this book uses without proof."
  - title: "ISO 20816-1, Mechanical vibration: Measurement and evaluation of machine vibration, Part 1: General guidelines"
    creator: "International Organization for Standardization"
    year: "2016"
    note: "Named by number and scope only, as the general framework for measuring and evaluating machine vibration. No limit values are quoted."
  - title: "ISO 14694, Industrial fans: Specifications for balance quality and vibration levels"
    creator: "International Organization for Standardization"
    year: "2003"
    note: "Named by number and scope only, as the fan-specific document a fan specification may call up. No grades or limits are quoted."
related:
  - title: "Design Simulation by the Numbers: Check stiffness, frequency and buckling"
    href: "/reados/publications/design-simulation-by-the-numbers/check-stiffness-frequency-and-buckling/"
  - title: "Electronics Packaging by the Numbers: Mount the board for vibration"
    href: "/reados/publications/electronics-packaging-by-the-numbers/mount-the-board-for-vibration/"
  - title: "Machine Elements and Mechanical Design"
    href: "/reados/collections/machine-elements-and-mechanical-design/"
  - title: "Rubber Parts by the Numbers"
    href: "/reados/publications/rubber-parts-by-the-numbers/"
---

## About this book

Machines are full of parts that can ring. A belt span hums, a guy rope sings in the wind, a fan housing panel drums, an isolator spring passes vibration it was meant to stop. Each of these is a wave travelling along a part, reflecting at its ends and building into a standing pattern at particular frequencies. When one of those frequencies matches something that pushes on the part, a small force produces a large motion.

This book treats those parts as wave carriers. It starts from one relationship, that a wave's speed equals its frequency multiplied by its wavelength, and uses it to find natural frequencies of belts, cables, bars, shafts, springs and panels. Each chapter then compares those frequencies with what drives the machine, decides whether the margin is enough, and shows what to change when it is not.

It serves mechanical designers, maintenance and reliability engineers and technicians who set up or review belt drives, fans, guyed structures, isolated plant and sheet metal enclosures. You need comfortable algebra, SI units, the idea of stiffness and mass, and a calculator or spreadsheet. Calculus helps but is not required: the formulas are stated and used, not derived. Read the chapters in order the first time, because each one adds a line to the same resonance register.

## The running case

Every chapter works on one fictional machine: **RF-3, a belt-driven rooftop exhaust fan** on a variable speed drive. A 4-pole motor running at 1,450 rpm at full speed drives an eight-blade impeller through two wedge belts, with a 160 mm motor pulley, a 250 mm fan pulley and a 600 mm centre distance. The fan runs at 928 rpm at full speed and down to 60 per cent of that at the drive's 30 Hz minimum. The unit sits on four spring isolators, its discharge stack is braced by four guy ropes, and its housing is folded from 1.6 mm steel sheet.

This is an illustration. All dimensions, masses, tensions, test readings and frequencies are invented for teaching and checked by calculation. They are not KEVOS® work, a product, or a measured machine. Where a value would normally come from a manufacturer, such as a belt's mass per metre, the book says it is an assumed teaching value.

## Source limits and professional responsibility

The formulas used are standard results of vibration and wave theory, cited in the references. They describe idealised parts: uniform strings, ideal edge supports, linear springs and light damping. Real machines have joints, sag, nonlinear mounts and coupled modes that move the numbers, sometimes a long way. Treat every calculated frequency as a screening estimate to be confirmed by a tap test or measurement on the actual equipment.

This book is educational. It does not replace the manufacturer's instructions for belt tensioning, rope selection or isolator installation, the fan or plant specification, or the judgement of a competent engineer. Rotating machinery, work at height on roofs and guyed structures carry real hazards. Measurement on running plant must follow the site's isolation and safe work procedures under the model Work Health and Safety laws as adopted in your state or territory. Money values, where they appear, are in Australian dollars and exclude GST.
