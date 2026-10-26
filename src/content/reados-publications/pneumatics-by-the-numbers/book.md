---
title: "Pneumatics by the Numbers"
subtitle: "Sizing, timing, supplying and safely running a small pneumatic system, worked through one carton reject station"
description: "Size a pneumatic cylinder, time and cushion its stroke, choose valves and a safe fail state, count air and leak costs, supply clean air and commission and maintain the system."
category: Engineering
tags: [automation, design, manufacturing, operations, process-improvement]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Intermediate machine design and maintenance"
audience: "Maintenance technicians, machine builders, production engineers and owners of small factories who specify, build, modify or look after pneumatic equipment and want to do it with numbers rather than habit."
outcomes:
  - "Convert between gauge and absolute pressure and size a cylinder from the load, the lowest supply pressure and a sensible load ratio."
  - "Build a timing budget for a fast stroke, check its kinetic energy and choose flow control and cushioning."
  - "Choose valves, tubing and a fail state, and calculate air consumption, leak flow and their annual cost."
  - "Specify supply pressure, air treatment and receiver size, and keep pressure drop small."
  - "Isolate stored energy, guard pneumatic motion, commission the system and run a leak program that lasts."
coverVariant: category
references:
  - title: "Improving Compressed Air System Performance: A Sourcebook for Industry, third edition"
    creator: "U.S. Department of Energy, Advanced Manufacturing Office, with the Compressed Air Challenge"
    year: "2016"
    url: "https://www.energy.gov/sites/prod/files/2016/03/f30/Improving%20Compressed%20Air%20Sourcebook%20version%203.pdf"
    note: "Source for the leak rates of poorly and well maintained systems, the load and unload leak estimate, the pressure-reduction rule of thumb, the guidance that pressure loss should be much less than 10% and the typical overall efficiency of compressed air, used in Chapters 1, 5, 6 and 8. Paraphrased, not quoted."
  - title: "Model Code of Practice: Managing the risks of plant in the workplace"
    creator: "Safe Work Australia"
    year: "current edition"
    url: "https://safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-plant-workplace"
    note: "Background for Chapter 7 on managing plant risks, isolation and stored energy. A model code has legal effect only where a state or territory has adopted it; check the version that applies locally."
  - title: "ISO 4414, Pneumatic fluid power: general rules and safety requirements for systems and their components"
    creator: "ISO"
    year: "current edition"
    note: "Named by number and scope only, in Chapters 4 and 7. No requirements are quoted."
  - title: "ISO 8573-1, Compressed air: contaminants and purity classes"
    creator: "ISO"
    year: "current edition"
    note: "Named by number and scope only, in Chapter 6, as the way air quality is specified by class. No class limits are quoted."
  - title: "ISO 6358-1 and ISO 1219-1, flow-rate characteristics and graphical symbols for fluid power components"
    creator: "ISO"
    year: "current editions"
    note: "Named by number and scope only, in Chapter 4, as the bases of valve flow ratings and circuit symbols."
  - title: "AS/NZS 4024.1 series and ISO 13849-1, safety of machinery and safety-related parts of control systems"
    creator: "Standards Australia, Standards New Zealand and ISO"
    year: "current editions"
    note: "Named by number and scope only, in Chapter 7, as the standards a competent person uses for guarding and safety functions. No requirements are quoted."
related:
  - title: "Power screws and linear motion"
    href: "/reados/collections/machine-elements-and-mechanical-design/power-screws-and-linear-motion/"
  - title: "Cutting energy use in business premises"
    href: "/reados/collections/lean-and-continuous-improvement/cutting-energy-use-in-business-premises/"
  - title: "Pressure vessels and thin-walled cylinders"
    href: "/reados/collections/machine-elements-and-mechanical-design/pressure-vessels-and-thin-walled-cylinders/"
  - title: "Fixtures That Repeat"
    href: "/reados/publications/fixtures-that-repeat/"
  - title: "Shape Memory Alloys by the Numbers"
    href: "/reados/publications/shape-memory-alloys-by-the-numbers/"
---

## About this book

Most small factories run on compressed air. Cylinders push, clamp, lift and sort; valves switch them; a compressor in a back room fills a receiver; and a network of pipes and hoses carries the air to every machine. Pneumatics is popular because it is simple, robust and cheap to buy. It is also easy to get roughly right and quietly wrong: cylinders chosen by habit, flow controls set by feel, pressure turned up to cure a problem somewhere else, leaks that hiss for years, and stored energy that surprises the person who disconnects a hose.

This book replaces habit with numbers. It covers pressure and why absolute pressure matters, cylinder force and side load, timing and cushioning a fast stroke, valves and the state a machine should fall into when power or air is lost, air consumption and its cost, supply pressure, air treatment and receivers, isolation and guarding, and commissioning, maintenance and leak hunting. Each chapter works one part of the system through the running case, with calculations checked step by step, and ends with an exercise and its worked answer.

## The running case

The book follows a fictional **contract packing business** of about 30 people, packing rice, flour and dry mixes into cartons on two lines. On line 2, a checkweigher identifies underweight cartons, and the business wants a pneumatic pusher to push each rejected carton sideways off the conveyor into a reject chute. The line runs at **40 cartons a minute**. Cartons weigh up to **4 kg**. The factory's air comes from one rotary screw compressor feeding a receiver and a pipe network shared with the other line and the workshop.

All quantities, prices, pressures, timings and results are invented for teaching. This is an illustration. None of it describes a KEVOS® client, supplier or project, and no product or manufacturer is endorsed. Money is in Australian dollars, excluding GST. Electricity is costed at an assumed A$0.30 a kilowatt-hour.

## How to use the book

Chapters 1 to 4 design the reject station: the job, the cylinder, the timing and the valves. Chapters 5 and 6 look outward to the air it uses and the system that supplies it. Chapters 7 and 8 cover making it safe and keeping it working. Calculators for several of the steps are in the WORKOS tools, including [pneumatic cylinder force](/tools/pneumatic-cylinder-force/), [pneumatic consumption](/tools/pneumatic-consumption/) and [air leak cost](/tools/air-leak-cost/).

## Source limits and professional responsibility

No source text was supplied for this book. It applies standard physics, a small number of cited public references and a fictional case. Standards are named by number and scope only, and no values are quoted from them. Manufacturers' data govern any real component: rated forces, cushioning energies, flow ratings, pressure ratings and response times differ between products. Pneumatic equipment stores energy and moves with force. Machine guarding, isolation and safety functions must be designed and checked by a competent person against the work health and safety law and standards that apply, and nothing here is a substitute for that.
