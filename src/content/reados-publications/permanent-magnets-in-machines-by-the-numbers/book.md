---
title: "Permanent Magnets in Machines by the Numbers"
subtitle: "Magnet materials, load lines, heat and demagnetisation, magnetic couplings, eddy currents, servo motors, tramp-metal separators, sensors and safe handling"
description: "How to choose and use permanent magnets in machines: materials, load lines, heat and demagnetisation, couplings, brakes, servos, separators, sensors and safe handling."
category: Engineering
tags: [design, systems, automation]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-10-31
referencesChecked: 2026-10-31
edition: "1"
level: "Intermediate machine design and maintenance engineering"
audience: "Machine designers, maintenance and reliability engineers, automation engineers and technicians who specify, install or troubleshoot magnetic couplings, servo motors, holding magnets, separators and magnetic sensors."
outcomes:
  - "Read a magnet's demagnetisation curve, find its working point from the load line of its circuit, and choose a material for the job and the temperature."
  - "Predict reversible and irreversible losses with temperature, and design so that magnets in motors, couplings and holders are not demagnetised."
  - "Size a magnetic coupling for a sealless pump against running and starting torque, and estimate the eddy-current loss in its containment shell."
  - "Check permanent-magnet servo motors, holding brakes and detents with their duty cycles, and explain how magnet temperature changes torque."
  - "Design tramp-metal separation and magnetic sensing from the field and its gradient, and handle, store, ship and inspect strong magnets safely."
coverVariant: category
references:
  - title: "Statistical Physics, Part 2: Theory of the Condensed State (Course of Theoretical Physics, Volume 9)"
    creator: "E. M. Lifshitz and L. P. Pitaevskii, translated by J. B. Sykes and M. J. Kearsley, Pergamon Press, Oxford"
    year: "1980"
    note: "In copyright. Used only as a map for the physics in Chapters 1 and 4: the chapter on magnetism, which treats the ferromagnet's spontaneous magnetisation, its spin waves and why magnetisation falls as temperature rises. No text, equations, figures or problems are reproduced, and all cases and calculations are KEVOS® originals."
  - title: "Zur Theorie des Ferromagnetismus"
    creator: "F. Bloch, Zeitschrift für Physik 61, 206–219"
    year: "1930"
    url: "https://doi.org/10.1007/BF01339661"
    note: "Named in Chapter 4 as the origin of the three-halves-power law for the fall of magnetisation with temperature."
  - title: "Magnetism and Magnetic Materials"
    creator: "J. M. D. Coey, Cambridge University Press"
    year: "2010"
    url: "https://doi.org/10.1017/CBO9780511845000"
    note: "Background for hard magnetic materials, demagnetising fields, the energy product and the typical properties of magnet families in Chapters 1 to 3."
  - title: "Introduction to Magnetic Materials, second edition"
    creator: "B. D. Cullity and C. D. Graham, Wiley-IEEE Press"
    year: "2009"
    url: "https://doi.org/10.1002/9780470386323"
    note: "Background for magnetic circuits, permeance, eddy currents and the force on magnetised bodies in Chapters 3, 6 and 8."
  - title: "Temperature Effects on Magnetic Output (TECHNotes TN 0303)"
    creator: "Arnold Magnetic Technologies"
    year: "2015"
    url: "https://www.arnoldmagnetics.com/wp-content/uploads/2017/10/TN_0303_rev_150715.pdf"
    note: "Source of the typical reversible temperature coefficients of remanence and coercivity, the Curie temperatures and the three categories of loss used in Chapters 2, 4, 5 and 7."
  - title: "ISO 14119:2024 Safety of machinery — Interlocking devices associated with guards — Principles for design and selection"
    creator: "International Organization for Standardization"
    year: "2024"
    note: "Named by number and scope only in Chapter 9: principles for the design and selection of interlocking devices on guards, including measures against defeat. No clause or value from it is quoted."
  - title: "Magnetic lifting devices"
    creator: "Health and Safety Executive (United Kingdom), web page accessed 31 October 2026"
    year: "2026"
    url: "https://www.hse.gov.uk/work-equipment-machinery/magnetic-lifting-devices.htm"
    note: "Cited in Chapter 10 for its note that strong magnetic fields can affect pacemakers and other active implants. It describes United Kingdom law, which does not apply in Australia."
  - title: "Model Code of Practice: Managing the risks of plant in the workplace"
    creator: "Safe Work Australia"
    year: "2022"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-plant-workplace"
    note: "Named in Chapters 5, 9 and 10 for the duty to manage the risks of plant, including guarding and interlocks, under the model WHS laws."
related:
  - title: "Magnetic Workholding by the Numbers"
    href: "/reados/publications/magnetic-workholding-by-the-numbers/"
  - title: "Centrifugal Pumps by the Numbers"
    href: "/reados/publications/centrifugal-pumps-by-the-numbers/"
  - title: "Pneumatics by the Numbers"
    href: "/reados/publications/pneumatics-by-the-numbers/"
  - title: "Connected Products by the Numbers"
    href: "/reados/publications/connected-products-by-the-numbers/"
---

## About this book

Permanent magnets are now in most machines, often where nobody notices them: in the rotors of servo motors, in the couplings of sealless pumps, in holding brakes, door catches and detents, in the separators that catch stray metal before it reaches a product, and in the sensors that tell a controller where a cylinder or a door is. They work silently for years, until a motor runs short of torque on a hot afternoon, a pump stops pumping with its motor still turning, a separator lets a fragment through, or a guard switch is defeated with a fridge magnet.

This book explains how permanent magnets behave in machines and how to design, specify and check them with numbers. It starts with what a permanent magnet is and how to read its demagnetisation curve, chooses between the main magnet materials, and finds a magnet's working point from the load line of its circuit. It then deals with temperature and demagnetisation, which cause most magnet failures, before working through the main applications: magnetic couplings, eddy currents and brakes, servo motors, tramp-metal separation and sensing. The last chapter covers handling, storage, shipping and incoming inspection.

It is for machine designers, maintenance and reliability engineers, automation engineers and technicians. It assumes school physics and algebra. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the KEVOS® tool that does the chapter's calculation where one exists, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one fictional production line. This is an illustration. A snack-food plant in Ballarat, Victoria, runs a seasoning and packing line, Line 4, with these magnetic parts:

- **Clean-in-place pump:** a sealless magnetic-drive centrifugal pump supplying 1.5% caustic solution at 75 °C to the line's tanks and spray devices, driven by a 4 kW, two-pole motor.
- **Metal separation:** a grate magnet in the seasoning hopper and a plate magnet over the product conveyor before the weigher.
- **Bagger:** a vertical form-fill-seal bagger whose cross-seal jaws are driven by a permanent-magnet servo motor, with a holding brake on its vertical film-reel lift.
- **Guards and sensors:** magnetic guard interlock switches, a magnetic catch on the hopper lid, and magnetic position sensors on pneumatic cylinders.

Field strengths, torques, temperatures, prices and rates in the book are invented for the case or calculated from stated assumptions. They do not describe KEVOS® work or any real business, product or manufacturer's rating.

## How to use the book

Read Chapters 1 to 4 first: they set out the curve, the materials, the load line and temperature, which every application chapter uses. Chapters 5 to 9 can then be read in any order. Chapter 10 applies to every magnet in the plant.

Every calculation in the book was checked by running it. The models are simple, and each chapter says where they stop being reliable. A maker's data for a particular magnet, motor, coupling or sensor always overrides an estimate from this book.

## Source limits and professional responsibility

This book is educational. Its models explain behaviour and show which changes matter; they do not replace makers' data, application engineering or testing of the real product. Machine guarding and interlocking, food safety controls, pressure equipment and electrical work are regulated, and decisions about them belong to competent people working to the model WHS laws, the relevant Australian and international standards and the makers' instructions. Strong permanent magnets can crush fingers, shatter and affect pacemakers and other active implants; Chapter 10 explains the precautions, and people with implants should get medical advice before handling them.
