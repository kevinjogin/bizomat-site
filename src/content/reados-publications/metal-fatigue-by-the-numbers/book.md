---
title: "Metal Fatigue by the Numbers"
subtitle: "Stress cycles, endurance limits, notches, mean stress, finite life, shafts, bolts, springs, surfaces and scatter, worked through one packaging machine"
description: "How metal parts fail under repeated stress and how to design them not to: cycles, endurance limits, notches, Goodman lines, S-N lives, Miner's rule, shafts, bolts, springs and surfaces."
category: Engineering
tags: [design, validation, quality]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-31
referencesChecked: 2026-10-31
edition: "1"
level: "Intermediate mechanical design engineering"
audience: "Mechanical design engineers, machine builders, maintenance and reliability engineers and technicians who design, check, repair or investigate shafts, levers, bolted joints and springs that carry repeated loads."
outcomes:
  - "Explain how a fatigue crack starts at slip bands, grows and finally breaks a part, and read the story on a fracture surface."
  - "Describe a stress cycle by its amplitude, mean and ratio, and turn loads on shafts and levers into nominal stresses."
  - "Estimate a corrected endurance limit, the fatigue notch factor at a fillet or hole, and the safety factor by Goodman, Soderberg and Gerber."
  - "Estimate finite lives from an S-N line, add mixed loading with Miner's rule, and see where that rule can be unsafe."
  - "Check shafts, preloaded bolts and springs for fatigue, and control the surface finish, scatter and evidence that decide real lives."
coverVariant: category
references:
  - title: "Gauge Fields in Condensed Matter, Volume II: Stresses and Defects (Differential Geometry, Crystal Melting)"
    creator: "H. Kleinert, World Scientific, Singapore"
    year: "1989"
    note: "In copyright. Used only as a map for the physics behind Chapter 1: crystals as ordered arrays, dislocation lines as the line-like defects that carry plastic deformation, and how their movement on slip planes disturbs the order of the lattice. No text, equations, figures or problems are reproduced, and all cases and calculations are KEVOS® originals."
  - title: "Shigley's Mechanical Engineering Design, tenth edition"
    creator: "R. G. Budynas and J. K. Nisbett, McGraw-Hill Education"
    year: "2015"
    note: "Background for the endurance limit estimate, the Marin correction factors, Peterson's notch sensitivity relation, the Goodman, Soderberg and Gerber criteria, the S-N line between 10³ and 10⁶ cycles, spring fatigue with Zimmerli's data and the fatigue of preloaded bolts in Chapters 3 to 9."
  - title: "Peterson's Stress Concentration Factors, third edition"
    creator: "W. D. Pilkey and D. F. Pilkey, John Wiley & Sons"
    year: "2008"
    note: "Background for stress concentration factors at shoulder fillets and holes in Chapters 4 and 7. The factors used in the running case are the designer's chart readings, labelled as illustrations."
  - title: "Mechanical Behavior of Materials, fourth edition"
    creator: "N. E. Dowling, Pearson"
    year: "2013"
    note: "Background for the stages of fatigue cracking, fracture surface features, variable amplitude loading and the scatter of fatigue lives in Chapters 1, 6 and 10."
  - title: "Cumulative damage in fatigue"
    creator: "M. A. Miner, Journal of Applied Mechanics, volume 12, pages A159 to A164"
    year: "1945"
    note: "Source of the linear damage rule used in Chapter 6."
  - title: "The exponential law of endurance tests"
    creator: "O. H. Basquin, Proceedings of the American Society for Testing and Materials, volume 10, pages 625 to 630"
    year: "1910"
    note: "Source of the power-law S-N line used in Chapters 6 and 7."
  - title: "A statistical distribution function of wide applicability"
    creator: "W. Weibull, Journal of Applied Mechanics, volume 18, pages 293 to 297"
    year: "1951"
    note: "Source of the distribution used to describe the scatter of fatigue failures in Chapter 10."
  - title: "ISO 4288 Geometrical Product Specifications (GPS) — Surface texture: Profile method — Rules and procedures for the assessment of surface texture"
    creator: "International Organization for Standardization"
    year: "1996"
    note: "Named by number and scope only in Chapter 10, as the source of the comparison rules that the surface roughness acceptance tool describes."
  - title: "Model Code of Practice: Managing the risks of plant in the workplace"
    creator: "Safe Work Australia"
    year: "2022"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-plant-workplace"
    note: "Named in Chapters 1 and 10 for the duty to manage the risks of plant, including failures of moving parts, under the model WHS laws."
related:
  - title: "Whirling Shafts by the Numbers"
    href: "/reados/publications/whirling-shafts-by-the-numbers/"
  - title: "Random Vibration by the Numbers"
    href: "/reados/publications/random-vibration-by-the-numbers/"
  - title: "Fits That Work"
    href: "/reados/publications/fits-that-work/"
  - title: "Accelerated Life Testing by the Numbers"
    href: "/reados/publications/accelerated-life-testing-by-the-numbers/"
---

## About this book

Most broken machine parts were never overloaded. They carried a load well below their strength, again and again, millions of times, until a crack too small to see grew across them and they snapped. That is metal fatigue, and it is the most common way that shafts, levers, bolts, springs and welded frames fail in service. It gives little warning, and the part that breaks often looks as if it should have lasted for ever.

This book explains fatigue from the crystal up and then turns it into design numbers. It starts with how cracks start and grow, then describes stress cycles, the endurance limit and what lowers it, notches, the effect of mean stress and finite lives under mixed loading. It then applies the method to the three parts that fail most often in machines, shafts, bolted joints and springs, and closes with the surface finish, scatter and evidence that decide whether a part really lives as long as its calculation says.

It is for mechanical design engineers, machine builders, maintenance and reliability engineers and technicians. It assumes school physics, algebra and a first course in stress analysis. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the WORKOS tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one machine. This is an illustration. A packaging machinery builder in Wetherill Park, New South Wales, is designing the PK-20 carton erector to replace its PK-16, whose camshafts cracked in service.

- **Duty:** 40 cartons a minute, one cam revolution per carton, two shifts of 8 hours, 250 days a year: 4,000 running hours and 9.6 million cycles a year, and 96 million cycles over the 10-year design life.
- **Camshaft:** 30 mm diameter at the follower-side bearing seat, stepping up to 36 mm, in a quenched and tempered alloy steel with a tensile strength of 900 MPa and a yield strength of 700 MPa. It carries a rotating bending moment of 260 N·m and a steady torque of 100 N·m at the shoulder.
- **Rocker lever:** a 16 × 40 mm section of normalised 0.45% carbon steel, 620 MPa tensile and 410 MPa yield, loaded by the cam follower between 300 N and 2,400 N at 150 mm.
- **Return spring and bolts:** a 3 mm music wire compression spring on the follower, and the bolts that hold the cam housing to the frame, carrying 0 to 12 kN each as the cam turns.

Loads, strengths, factors, failure records, prices and times are the case builder's working figures or are calculated from stated assumptions. They do not describe KEVOS® work or any real business, machine or supplier's data.

## How to use the book

Read Chapters 1 to 5 in order: they build the method that every later chapter uses. Chapter 6 deals with finite life and mixed loading. Chapters 7, 8 and 9 apply the method to shafts, bolted joints and springs and can be read in any order. Chapter 10 covers surfaces, scatter and the evidence that proves a design.

Every calculation in the book was checked by running it, and the WORKOS tools linked from each chapter were checked against the calculations they perform. The methods are the standard textbook estimates for steels. They are good enough to compare designs and to find the weak point, but real fatigue strengths scatter widely, and the final word on a critical part is a test.

## Source limits and professional responsibility

This book is educational. Its methods give first estimates of fatigue strength and life for steel parts under the stated assumptions; they do not replace tested fatigue data, a design standard that applies to the product, or the judgement of a competent engineer. Fatigue failures of machine parts can release stored energy, throw parts or drop loads, and the risks of plant must be managed under the model WHS laws. Decisions about real parts and machines remain with the competent people responsible for them.
