---
title: "Whirling Shafts by the Numbers"
subtitle: "Critical speeds, supports, unbalance and balancing, centrifugal and gyroscopic loads, starting and vibration checks for rotating machinery"
description: "How rotors behave at speed: critical speeds by Dunkerley and Rayleigh, foundation stiffness, balance grades, one- and two-plane balancing, centrifugal and gyroscopic loads, starts and spectra."
category: Engineering
tags: [design, validation, quality]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-31
referencesChecked: 2026-10-31
edition: "1"
level: "Intermediate mechanical engineering and machinery maintenance"
audience: "Mechanical designers, machinery engineers, maintenance and reliability engineers, service technicians and fitters who design, install, balance or look after fans, mills, pumps and other rotating machines."
outcomes:
  - "Explain why a shaft whirls near its critical speed, and estimate the first critical speed of a real rotor by Dunkerley's and Rayleigh's methods with a stated margin."
  - "Size a shaft for strength, twist and critical speed together, and allow for the stiffness of bearings, pedestals, frames and foundations."
  - "Set a balance tolerance from a balance grade, and balance narrow rotors in one plane and long rotors in two, from known masses or with trial weights."
  - "Check the centrifugal loads on discs, pins and attachments, the gyroscopic loads on a rotor whose axis turns, and the run-up time and heating of a heavy rotor's start."
  - "Measure and read vibration in service, recognise the signatures of unbalance, resonance, misalignment and bearing defects, and keep the records that make diagnosis quick."
coverVariant: category
references:
  - title: "Gauge Fields in Condensed Matter, Volume I: Superflow and Vortex Lines (Disorder Fields, Phase Transitions)"
    creator: "H. Kleinert, World Scientific, Singapore"
    year: "1989"
    note: "In copyright. Used only as a map for the idea, in Chapter 2, of reading a system's behaviour from the expansion of its energy about a minimum, which underlies Rayleigh's method. No text, equations, figures or problems are reproduced, and all cases and calculations are BIZOMAT originals."
  - title: "The lateral vibration of loaded shafts in the neighbourhood of a whirling speed: the effect of want of balance"
    creator: "H. H. Jeffcott, Philosophical Magazine, Series 6, volume 37"
    year: "1919"
    note: "Named in Chapter 1 as the origin of the single-disc rotor model and its whirl response above and below the critical speed."
  - title: "On the whirling and vibration of shafts"
    creator: "S. Dunkerley, Philosophical Transactions of the Royal Society of London, Series A, volume 185"
    year: "1894"
    note: "Named in Chapter 2 as the origin of Dunkerley's method of combining critical speeds."
  - title: "The Theory of Sound"
    creator: "J. W. Strutt, Lord Rayleigh, Macmillan, London"
    year: "1877"
    note: "Named in Chapter 2 as the origin of Rayleigh's energy method for natural frequencies."
  - title: "Dynamics of Rotating Machines"
    creator: "M. I. Friswell, J. E. T. Penny, S. D. Garvey and A. W. Lees, Cambridge University Press"
    year: "2010"
    note: "Background for the single-disc rotor, support flexibility, gyroscopic effects, forward and backward whirl and rotordynamic models in Chapters 1, 2, 4 and 9."
  - title: "ISO 21940-11 Mechanical vibration — Rotor balancing — Part 11: Procedures and tolerances for rotors with rigid behaviour"
    creator: "International Organization for Standardization"
    year: "2016"
    note: "Named by number and scope only in Chapter 5 as the standard that defines balance quality grades and the allocation of permissible unbalance to correction planes. No table or value from it is quoted; the case's choice of grade is its own."
  - title: "ISO 21940-12 Mechanical vibration — Rotor balancing — Part 12: Procedures and tolerances for rotors with flexible behaviour"
    creator: "International Organization for Standardization"
    year: "2016"
    note: "Named by number and scope only in Chapter 7 for the balancing of flexible rotors. No clause or value from it is quoted."
  - title: "ISO 21940-32 Mechanical vibration — Rotor balancing — Part 32: Shaft and fitment key convention"
    creator: "International Organization for Standardization"
    year: "2012"
    note: "Named by number and scope only in Chapter 5 for the convention for keys during balancing. No clause from it is quoted."
  - title: "ISO 20816-1 Mechanical vibration — Measurement and evaluation of machine vibration — Part 1: General guidelines"
    creator: "International Organization for Standardization"
    year: "2016"
    note: "Named by number and scope only in Chapter 11 as general guidance on measuring and evaluating machine vibration. The case's acceptance, alarm and trip levels are the case maker's own settings, not values from the standard."
  - title: "Model Code of Practice: Managing the risks of plant in the workplace"
    creator: "Safe Work Australia"
    year: "2022"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-plant-workplace"
    note: "Background for the safety notes on guarding rotating parts, isolating machines between runs and safe field balancing, under the model WHS laws."
related:
  - title: "Vibrating Machine Elements by the Numbers"
    href: "/reados/publications/vibrating-machine-elements-by-the-numbers/"
  - title: "Plain Bearings by the Numbers"
    href: "/reados/publications/plain-bearings-by-the-numbers/"
  - title: "Permanent Magnets in Machines by the Numbers"
    href: "/reados/publications/permanent-magnets-in-machines-by-the-numbers/"
---

## About this book

A spinning shaft is a spring, and every rotor carries a little unbalance that pushes it sideways once a revolution. Near one particular speed, the shaft's critical or whirling speed, those pushes arrive in step with the shaft's own natural frequency and its whirl grows many times over. Most of what goes wrong with rotating machines, from a prototype that shakes on its first run to a bearing that fails in a year, traces back to that resonance, to the unbalance it amplifies, or to the loads that speed itself creates.

This book shows how to calculate and control them. It starts with the single-disc rotor and the critical speed, then estimates real critical speeds by Dunkerley's and Rayleigh's methods, sizes a shaft for strength, twist and whirl together, and adds the flexibility of bearings, frames and foundations. It then turns to unbalance: balance grades, balancing in one plane and in two, from known masses or with trial weights. It finishes with the loads that speed creates, centrifugal and gyroscopic, the start of a heavy rotor, and how to read a machine's vibration in service.

It is for mechanical designers, machinery and reliability engineers, service technicians and fitters. It assumes school physics, algebra and some familiarity with vectors. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the BIZOMAT tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one machine. This is an illustration. An agricultural equipment maker in Wagga Wagga, New South Wales, designs and builds the HM-30, a 30 kW hammer mill for grinding stock feed, direct-coupled to a two-pole motor at 2,950 rpm.

- **Rotor:** seven 520 mm steel discs on the shaft between two pillow-block bearings 1,000 mm apart, with four hammer pins at 230 mm radius carrying 48 swinging hammers of 0.75 kg; 180 kg in all, spread over the middle 400 mm of the span.
- **Shaft:** 80 mm on the prototype, 90 mm in production, 100 mm on the 60 Hz export variant at 3,550 rpm.
- **Around it:** a narrow discharge fan wheel, balanced in one plane; a truck-mounted variant used in feedlots; and the mill's customers, foundations and maintenance crews.

Masses, dimensions, stiffnesses, vibration readings, motor and bearing data, prices and times are invented for the case or calculated from stated assumptions. None of it describes BIZOMAT work or any real business, product or manufacturer's rating.

## How to use the book

Read Chapters 1 and 2 first: the critical speed and its estimates are used throughout. Chapters 3 and 4 complete the design of the shaft and its supports. Chapters 5 to 7 cover unbalance and balancing and are best read in order. Chapters 8 to 10 cover centrifugal loads, gyroscopic loads and starting, and can be read in any order. Chapter 11 brings the book together in service.

Every calculation in the book was checked by running it, and the BIZOMAT tools linked from each chapter were checked against the calculations they perform. The hand methods used are the classical ones; they show which changes matter and give sound first estimates, but they assume rigid rotors and simple supports, and each chapter says where they stop being reliable.

## Source limits and professional responsibility

This book is educational. Its methods estimate critical speeds, balance tolerances and loads for rigid rotors on simple supports. Machines that run near or above a critical speed, flexible rotors, high-speed or high-energy rotors and machines whose failure could injure people need rotordynamic analysis, testing and design review by competent people. Balancing and vibration work on running machinery must be done with the machine guarded, isolated between runs and under a safe system of work, as the model WHS laws and the maker's instructions require. Decisions about real machines remain with the competent people responsible for them.
