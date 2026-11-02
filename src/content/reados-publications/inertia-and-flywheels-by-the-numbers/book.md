---
title: "Inertia and Flywheels by the Numbers"
subtitle: "Moments of inertia, reflected inertia, servo ratios and duty cycles, heavy starts, flywheels and spinning safely, on one timber line"
description: "How to work with rotating inertia: moments of inertia, reflection through drives, ratio choice, move profiles and RMS torque, heavy starts, flywheel energy and design, and safe rim speeds."
category: Engineering
tags: [design, automation, systems]
author: KEVOS®
publisher: KEVOS® Library
language: en-AU
status: published
publishDate: 2026-11-01
referencesChecked: 2026-11-01
edition: "1"
level: "Intermediate mechanical and machine design engineering"
audience: "Mechanical and machine design engineers, automation and controls engineers, and maintenance engineers who size motors, servos, gearboxes and flywheels or check the rotating parts of production machinery."
outcomes:
  - "Calculate the moment of inertia of machine parts and built-up rotors, and convert datasheet inertias between units without the common factor-of-four error."
  - "Find the torque to accelerate and stop a rotating load, and reflect inertia and load torque through gears, belts and pulleys to the motor."
  - "Choose a gear ratio for a servo axis, build a move profile, and check RMS and peak torque against a motor's ratings."
  - "Estimate the run-up time and rotor heating of a heavy direct-on-line start, and judge when a start is acceptable."
  - "Size a flywheel for an energy fluctuation and speed variation, and check rotating disc stress, rim speed and the energy that guarding must contain."
coverVariant: category
references:
  - title: "Bose–Einstein Condensation in Dilute Gases"
    creator: "C. J. Pethick and H. Smith, Cambridge University Press"
    year: "2002"
    note: "In copyright. Used only as a map of ideas: the moment of inertia of a rotating body, angular momentum and energy held in rotation, rotation viewed from a turning frame, and the release of energy as a system's speed changes, which this book applies to machine rotors and flywheels. No text, equations, figures or problems are reproduced, and all cases and calculations are KEVOS® originals."
  - title: "Shigley's Mechanical Engineering Design, tenth edition"
    creator: "R. G. Budynas and J. K. Nisbett, McGraw-Hill Education"
    year: "2015"
    note: "Background for flywheel energy and the coefficient of speed fluctuation, and for stresses in rotating rings and discs, used in Chapters 8 to 10."
  - title: "Theory of Elasticity, third edition"
    creator: "S. P. Timoshenko and J. N. Goodier, McGraw-Hill"
    year: "1970"
    note: "Background for the stresses in a rotating disc of uniform thickness, solid and with a central hole, used in Chapters 9 and 10."
  - title: "Roark's Formulas for Stress and Strain, eighth edition"
    creator: "W. C. Young, R. G. Budynas and A. M. Sadegh, McGraw-Hill"
    year: "2012"
    note: "Background for rotating disc formulas and their limits, used in Chapter 10."
  - title: "IEC 60034-1 Rotating electrical machines, Part 1: Rating and performance"
    creator: "International Electrotechnical Commission"
    year: "2022"
    note: "Named by number and scope only in Chapters 6 and 7, as the standard that defines motor duty types and rating conditions. No values are quoted from it; motor limits in this book are the case's working figures and are labelled as illustrations."
  - title: "Model Code of Practice: Managing the risks of plant in the workplace"
    creator: "Safe Work Australia"
    year: "2022"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-plant-workplace"
    note: "Named in Chapters 3 and 10 for the duty to manage the risks of plant under the model WHS laws, including guarding and stopping rotating parts."
related:
  - title: "Whirling Shafts by the Numbers"
    href: "/reados/publications/whirling-shafts-by-the-numbers/"
  - title: "Power Presses by the Numbers"
    href: "/reados/publications/power-presses-by-the-numbers/"
  - title: "Permanent Magnets in Machines by the Numbers"
    href: "/reados/publications/permanent-magnets-in-machines-by-the-numbers/"
  - title: "Gears by the Numbers"
    href: "/reados/publications/gears-by-the-numbers/"
  - title: "Selecting electric motors and drives"
    href: "/reados/collections/machine-elements-and-mechanical-design/selecting-electric-motors-and-drives/"
---

## About this book

Inertia is the property that makes rotating machinery hard to start, hard to stop and useful for storing energy. It decides how big a servo motor must be to move a carriage in time, how long a large fan or chipper takes to reach speed and how hot its motor gets doing so, and how much a flywheel smooths a machine whose load comes in bursts. It also decides how much energy a rotor carries, and so how much a guard must contain if something comes apart.

This book shows how to work with inertia by the numbers. It starts with the moments of inertia of machine parts and built-up rotors and the units they are quoted in, then the torque to change speed, the reflection of inertia through drives, the choice of a gear ratio, and the move profiles and RMS torque that size a servo. It then covers heavy starts, flywheels and their design, and finishes with the stresses and energies of spinning parts.

It is for mechanical, machine design, automation and maintenance engineers. It assumes engineering training and comfort with torque, speed and energy; the formulas are explained as they are used. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the KEVOS® tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one production line. This is an illustration. A sawmill near Mount Gambier, South Australia, is commissioning DL-3, a docking and chipping line that cuts sawn boards to length and chips the offcuts.

- **Infeed:** eight lagged steel rollers, 180 mm over the lagging, feeding boards at 1.5 m/s.
- **Length pusher:** a servo-driven carriage on a toothed belt that pushes each board to length against the saw line, with moves of up to 1.8 m at 2 m/s.
- **Docking saw:** a 900 mm circular saw blade on a direct-coupled 15 kW motor at 1,480 rpm.
- **Chipper:** a 1,400 mm steel disc chipper at 600 rpm, belt-driven by a 75 kW motor at 1,480 rpm, started direct on line.

Masses, dimensions, speeds, motor data, limits and loads are the case mill's working figures or are calculated from stated assumptions. They do not describe KEVOS® work or any real business, machine or supplier's data.

## How to use the book

Chapters 1 and 2 build the inertias the rest of the book uses. Chapters 3 to 6 cover accelerating loads and sizing drives, ending with servo duty cycles. Chapter 7 covers heavy starts. Chapters 8 and 9 cover flywheels, and Chapter 10 covers the stresses, speeds and energies of spinning parts. Readers interested only in servo sizing can read Chapters 1 to 6; those interested in flywheels and heavy rotors can read Chapters 1 to 3 and 7 to 10.

Every calculation in the book was checked by running it, and the KEVOS® tools linked from each chapter were checked against the calculations they perform.

## Source limits and professional responsibility

This book is educational. Motor starting limits, servo ratings, rim speed limits and material strengths come from the makers of the machines and materials concerned, and the figures used here are illustrations. Rotating machinery stores energy that can injure or kill; its guarding and stopping are governed by the model WHS laws and by Australian machinery safety standards, and a real design must be done or checked by a competent engineer. Work on such machinery is done with it stopped, isolated and locked out. Decisions about real machines remain with the competent people responsible for them.
