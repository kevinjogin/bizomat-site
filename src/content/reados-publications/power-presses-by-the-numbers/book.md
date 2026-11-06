---
title: "Power Presses by the Numbers"
subtitle: "Force, energy, stroke and speed: screw, crank, hydraulic and servo presses, flywheels, frames, shut height, feeding, stopping time and choosing a press"
description: "Choose, set and check a power press with numbers: tonnage curves, flywheel energy, frame deflection, hydraulic and servo drives, shut height, feeding, stopping time and cost."
category: Manufacturing
tags: [manufacturing, operations, quality]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Intermediate press shop engineering"
audience: "Production engineers, press shop supervisors, toolmakers, maintenance staff and buyers who choose, set up, run or check power presses for sheet metal work."
outcomes:
  - "Read a press's specification and test it against a job's force, energy, stroke, speed and die space."
  - "Calculate the force a crank press can deliver at any height above the bottom of its stroke."
  - "Work out a job's energy per stroke, a flywheel's slowdown and why speed changes the energy available."
  - "Size a hydraulic press's cylinder, speed and power, and compare mechanical, hydraulic and servo drives."
  - "Fit a die, time a feed, understand how stopping time sets guard distances, and choose a press on whole cost."
coverVariant: category
references:
  - title: "Machines and Tools Employed in the Working of Sheet Metals"
    creator: "R. B. Hodgson, The Technical Publishing Co., Manchester"
    year: "1903"
    note: "Supplied source, out of copyright, read as a subject map for screw, fly and power presses, press frames, clutches, feeds, stamping and the power of presses and stamps. Its worked examples of the work stored in a fly press's balls are restated in SI and checked in Chapter 2, where an arithmetic slip in the original is noted. No text, figures, tables or exercises are reproduced; the case, numbers and checks in this book are its own."
  - title: "Manufacturing Engineering and Technology"
    creator: "Serope Kalpakjian and Steven R. Schmid, Pearson"
    year: "2014"
    note: "University text used for the general classification of presses by how they deliver force and energy, and for the mechanics of shearing and bending that the companion book develops."
  - title: "Controlling risks from power press machines"
    creator: "WorkSafe Victoria"
    year: "2026"
    url: "https://www.worksafe.vic.gov.au/controlling-risks-power-press-machines"
    note: "Regulator guidance on power press hazards and controls: fixed and interlocked guards, presence-sensing systems where guards are not possible, chocks, inching, daily checks of clutch and brake mechanisms and test runs. It names AS 4024.3001 and AS 4024.3002. Used in Chapters 7 and 9."
  - title: "Power presses"
    creator: "WorkSafe Western Australia"
    year: "2024"
    url: "https://worksafe.wa.gov.au/power-presses"
    note: "Regulator guidance giving priority to tooling and stroke limits that prevent access, automatic feeders and interlocking guards, stating that two-hand controls alone are not an acceptable means of protection, and describing foul strokes from brake or clutch faults. Used in Chapters 8 and 9."
  - title: "Model Code of Practice: Managing the risks of plant in the workplace"
    creator: "Safe Work Australia"
    year: "2024"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-plant-workplace"
    note: "The national model code that state guidance on presses refers to, for managing plant risks, guarding, maintenance and inspection. Readers are directed to their own regulator to confirm its status in their jurisdiction. Used in Chapters 9 and 10."
  - title: "29 CFR 1910.217 Mechanical power presses"
    creator: "United States Occupational Safety and Health Administration, via Cornell Law School Legal Information Institute"
    year: "2026"
    url: "https://www.law.cornell.edu/cfr/text/29/1910.217"
    note: "A publicly readable regulation whose simple safety distance formula, Ds = 63 inches per second × the press's stopping time, is used in Chapter 9 only to show how stopping time sets the distance of a presence-sensing device. It is a United States rule; Australian presses are guarded under Australian law and standards."
  - title: "AS 4024.3001 and AS 4024.3002 Safety of machinery: mechanical and hydraulic power presses"
    creator: "Standards Australia"
    year: "current edition"
    note: "Named by number and scope as the Australian standards for the safety of mechanical and hydraulic power presses. No values are quoted from them."
related:
  - title: "Blanking and Piercing Dies by the Numbers"
    href: "/reados/publications/blanking-and-piercing-dies-by-the-numbers/"
  - title: "Press tools and dies"
    href: "/reados/collections/machining-and-metal-parts/press-tools-and-dies/"
  - title: "Sheet Metal Parts by the Numbers"
    href: "/reados/publications/sheet-metal-parts-by-the-numbers/"
  - title: "Deep Drawing and Spinning by the Numbers"
    href: "/reados/publications/deep-drawing-and-spinning-by-the-numbers/"
---

## About this book

A power press is a machine for delivering a large force over a short distance, quickly and repeatably, to a die that cuts or forms sheet metal. How it does that decides what it can do. A screw press stores energy in a spinning flywheel and spends it in one blow. A crank press converts a flywheel's rotation into a stroke of fixed length, with a force that depends on where in the stroke the work is done. A hydraulic press pushes with a force set by its pressure, at any point in its stroke, at a speed set by its pump. A servo press drives its crank with a motor that can be told how to move. Each has a number that limits it, and choosing or running a press without knowing which number it is leads to stalled presses, broken dies and parts that cost more than they should.

This book works through presses with numbers. It starts with what a press must deliver, then looks at energy machines through Hodgson's 1903 examples, the crank press's force curve, flywheel energy, frames and their deflection, hydraulic and servo drives, fitting a die, feeding the strip, stopping the press and guarding it, and finally choosing a press on its whole cost. Each chapter follows one running case, includes a plausible mistake and how it was found, and ends with an exercise and its worked answer.

It is for production engineers, press shop supervisors, toolmakers, maintenance staff and the people who buy presses. It assumes school algebra and physics. The dies themselves, their cutting force, clearance, stripping and wear, are the subject of the Library’s companion book, Blanking and Piercing Dies by the Numbers, whose MP-40 die is one of the two jobs in this book's case.

## The running case

Every chapter follows one fictional decision. This is an illustration. A manufacturer of electrical enclosures is choosing a press, called Press 4 here, for two jobs:

- **MP-40**, a flat mounting plate made from 2.0 mm steel strip in a three-station progressive die, 60,000 a year. The die needs 192.8 kN to cut and 28.5 kN for its stripper springs, 221.3 kN in all at the bottom of the stroke, and is 204 mm high when closed.
- **AB-75**, an angle bracket formed from a pre-cut 3.0 mm blank in a wiping die, loaded by hand, 20,000 a year. Its die maker's trial shows the forming force rising from first contact 25 mm above the bottom of the stroke to 65 kN, and then to 180 kN in the final millimetre as the bend is set.

The main candidate is a 400 kN gap-frame mechanical press with a 60 mm stroke, a crank radius of 30 mm, a connecting rod of 250 mm between centres, a geared flywheel with a moment of inertia of 4.0 kg·m² turning five times for each stroke, a speed range of 40 to 120 strokes a minute, and a shut height adjustable from 240 to 300 mm. Hydraulic and servo presses of the same rating are the alternatives. The manufacturer, the jobs, the presses, the prices and the mistakes are invented. None describes BIZOMAT work, a real business or a real press.

## How to use the book

Read Chapter 1 first: it sets out the five numbers every press is judged on. Chapters 2 to 4 deal with force and energy, Chapters 5 and 6 with the machine's structure and drives, Chapters 7 to 9 with running a press, and Chapter 10 brings the decision together. Every calculation was checked by running it, and values are given to more figures than a shop needs so that the arithmetic can be followed.

## Source limits and professional responsibility

The relationships in this book are standard mechanics, and the press specifications, stopping times, prices and job forces are illustrations. Real presses are chosen and run with the maker's data, the die maker's figures and trials. Power presses cause amputations and crush injuries. Their guarding, controls, inspection and maintenance are governed by Australian work health and safety law, the regulators' guidance and the Australian standards for presses, and are designed and verified by competent people. This book teaches how presses work and how to check them. It is not advice for any particular press or installation, and qualified review governs real work.
