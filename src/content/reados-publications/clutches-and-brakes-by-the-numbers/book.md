---
title: "Clutches and Brakes by the Numbers"
subtitle: "Loads, linings, plate, cone and centrifugal clutches, shoe, band, disc and motor brakes, on one slipway winch"
description: "How to size and check friction clutches and brakes: loads and inertia, linings, plate, cone and centrifugal clutches, shoe, band and disc brakes, and spring-applied motor brakes."
category: Engineering
tags: [design, operations, validation]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-11-01
referencesChecked: 2026-11-01
edition: "1"
level: "Intermediate mechanical design and maintenance engineering"
audience: "Mechanical design engineers, maintenance engineers, fitters and machine builders who specify, size, check or maintain friction clutches and brakes on winches, conveyors, hoists and other drives."
outcomes:
  - "Turn a machine's duty into the torques, speeds, inertias and energies that a clutch or brake must handle, on the shaft where the device sits."
  - "Calculate the torque capacity of plate, cone and centrifugal clutches and the slip time and heat of an engagement."
  - "Calculate the lever force, band tensions, clamp force and lining pressure of shoe, band and disc brakes, and recognise self-energising and self-locking geometry."
  - "Size a spring-applied motor brake for stop time, stop distance, energy and holding factor, including overhauling loads."
  - "Measure torque with a brake arm, plan a brake proof test and keep records that show a clutch or brake is fit for its duty."
coverVariant: category
references:
  - title: "Bose–Einstein Condensation in Dilute Gases"
    creator: "C. J. Pethick and H. Smith, Cambridge University Press"
    year: "2002"
    note: "In copyright. Used only as a map of ideas: rotation and angular momentum, energy held in motion, and the dissipation and relaxation that bring a moving system to rest, which this book applies to friction clutches and brakes. No text, equations, figures or problems are reproduced, and all cases and calculations are BIZOMAT originals."
  - title: "Shigley's Mechanical Engineering Design, tenth edition"
    creator: "R. G. Budynas and J. K. Nisbett, McGraw-Hill Education"
    year: "2015"
    note: "Background for the uniform-wear and uniform-pressure models of plate and cone clutches, short-shoe and band brake analysis, self-energising and self-locking, and the energy and temperature rise of an engagement, used in Chapters 3 to 9."
  - title: "Fundamentals of Machine Component Design, fifth edition"
    creator: "R. C. Juvinall and K. M. Marshek, John Wiley & Sons"
    year: "2012"
    note: "Background for friction materials, clutch and brake types and their heat capacity, used in Chapters 2 to 6."
  - title: "Clutches and Brakes: Design and Selection, second edition"
    creator: "W. C. Orthwein, Marcel Dekker"
    year: "2004"
    note: "Background for centrifugal clutches, band and disc brakes and their thermal checks, used in Chapters 6, 8 and 9."
  - title: "AS 1418.2 Cranes (including hoists and winches), Part 2: Serial hoists and winches"
    creator: "Standards Australia"
    year: "1997"
    note: "Named by number and scope only in Chapters 1 and 10, as the Australian standard for the design of serial hoists and winches. No values are quoted from it; brake factors and test loads in this book are the case's working figures and are labelled as illustrations."
  - title: "Model Code of Practice: Managing the risks of plant in the workplace"
    creator: "Safe Work Australia"
    year: "2022"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-plant-workplace"
    note: "Named in Chapters 1 and 10 for the duties to manage the risks of plant such as winches under the model WHS laws, including isolation and the inspection and maintenance of brakes."
related:
  - title: "Power Presses by the Numbers"
    href: "/reados/publications/power-presses-by-the-numbers/"
  - title: "Vehicle Mechanics by the Numbers"
    href: "/reados/publications/vehicle-mechanics-by-the-numbers/"
  - title: "Whirling Shafts by the Numbers"
    href: "/reados/publications/whirling-shafts-by-the-numbers/"
  - title: "Gears by the Numbers"
    href: "/reados/publications/gears-by-the-numbers/"
  - title: "Clutches, brakes and torque limiters"
    href: "/reados/collections/machine-elements-and-mechanical-design/clutches-and-brakes/"
---

## About this book

A clutch connects a load to its drive and a brake connects a load to the ground. Both do it through friction, and both turn motion into heat while they slip. That shared physics is why one book can cover them: the torque a lining can carry comes from the force pressing it and the friction coefficient, the slip time comes from inertia and the torque left over to accelerate or stop it, and the heat comes from the torque multiplied by the angle slipped.

This book shows how to size and check friction clutches and brakes with numbers. It starts with the loads a device must handle, measured on the shaft where it sits, and the friction linings that carry them. It then covers plate, cone and centrifugal clutches, shoe, band and disc brakes, and the spring-applied brakes built into motors, finishing with proof tests and records.

It is for mechanical design and maintenance engineers, fitters and machine builders. It assumes engineering or trade training and comfort with torque, speed and energy; the friction models are explained as they are used. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the BIZOMAT tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one machine. This is an illustration. A boatyard in Cairns, Queensland, is refitting the SW-25, the electric winch that hauls boats on a wheeled cradle up a 60 m slipway and lets them back down.

- **Slipway and load:** a slope of 1 in 12, a largest boat of 22 t on a 3 t cradle, 25 t in all, and a rolling resistance of 0.02 for the cradle wheels on the rails.
- **Drive:** a 5.5 kW, four-pole motor at 1,450 rpm with a spring-applied brake, a 20:1 helical gearbox, a friction clutch on the gearbox output shaft, and a 22.5:1 open gear pair to the drum: 450:1 in all.
- **Drum and brakes:** a rope drum of 600 mm diameter to the rope centre, a 700 mm brake rim carrying a band brake for lowering, and a caliper disc brake on the drum flange as an independent second brake.
- **Auxiliaries:** a warping capstan engaged by a cone clutch, and a petrol engine with a centrifugal clutch that can drive the winch through a belt when the power is off.

Masses, dimensions, speeds, friction coefficients, ratings, limits and test figures are the case yard's working figures or are calculated from stated assumptions. They do not describe BIZOMAT work or any real business, vessel or supplier's data.

## How to use the book

Read Chapter 1 first: it sets out the loads that every later chapter uses. Chapter 2 covers friction linings and measuring torque. Chapters 3 to 6 cover clutches, and Chapters 7 to 10 cover brakes; the brake chapters can be read without the clutch chapters. Chapter 10 also covers proof testing and records.

Every calculation in the book was checked by running it, and the BIZOMAT tools linked from each chapter were checked against the calculations they perform. Friction coefficients and lining limits in the book are typical figures for illustration; a real design uses the lining maker's values.

## Source limits and professional responsibility

This book is educational. Winches, hoists and their brakes are plant whose design, inspection and maintenance are governed by the model WHS laws and by Australian standards such as AS 1418.2; their brakes are safety-critical, and a real design must be done or checked by a competent engineer against the applicable standard and the makers' data. Work on a winch is done with the load secured, the machine isolated from all energy sources and locked out. Decisions about real machines remain with the competent people responsible for them.
