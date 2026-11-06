---
title: "Bolted Joints by the Numbers"
subtitle: "Preload, tightening, separation, fatigue, threads, shear, eccentric loads, gaskets and temperature, on one cylinder test rig"
description: "How to design, tighten and check bolted joints: preload and joint stiffness, torque, stretch and angle, separation and fatigue, threads, shear, bolt groups, gaskets and heat."
category: Engineering
tags: [design, quality, validation]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-11-01
referencesChecked: 2026-11-01
edition: "1"
level: "Intermediate mechanical design and maintenance engineering"
audience: "Mechanical design engineers, machine builders, maintenance engineers and fitters who design, specify, tighten, inspect or troubleshoot bolted joints in machines, rigs, frames and pressure equipment."
outcomes:
  - "Explain how preload and the stiffness of bolt and members decide how a tension joint shares an external load and when it separates."
  - "Set and check a bolt's preload by torque, stretch or angle, and allow for nut factor scatter, wrench adapters and measurement."
  - "Check a bolted joint for separation, proof load and fatigue, and size thread engagement, tapped holes and screw lengths."
  - "Check shear joints, eccentrically loaded bolt groups, brackets in tension and gasketed flanges for their loads."
  - "Allow for temperature, plan hole patterns and tolerances, and keep tightening records that show a joint was made as designed."
coverVariant: category
references:
  - title: "Concepts of Theoretical Solid State Physics"
    creator: "A. Altland and B. Simons"
    year: "2001"
    note: "Lecture notes released for verbatim copying only, so treated here as a protected work. Used only as a map of ideas: the harmonic approximation, in which bonded parts act as springs about an equilibrium position, and the way a preloaded system shares an applied load between its stiffnesses. No text, equations, figures or problems are reproduced, and all cases and calculations are BIZOMAT originals."
  - title: "Shigley's Mechanical Engineering Design, tenth edition"
    creator: "R. G. Budynas and J. K. Nisbett, McGraw-Hill Education"
    year: "2015"
    note: "Background for bolt and member stiffness by the frustum method, the joint constant, separation, the torque–preload relation, metric property class strengths and fully corrected endurance strengths of bolts, and the Goodman fatigue check, used in Chapters 1 to 5."
  - title: "Introduction to the Design and Behavior of Bolted Joints: Non-Gasketed Joints, fourth edition"
    creator: "J. H. Bickford, CRC Press"
    year: "2007"
    note: "Background for nut factor scatter, torque, turn and stretch control of preload, ultrasonic measurement of bolt stretch, relaxation and the effect of temperature on preload, used in Chapters 2, 3 and 10."
  - title: "Machinery's Handbook, thirtieth edition"
    creator: "E. Oberg, F. D. Jones, H. L. Horton and H. H. Ryffel, Industrial Press"
    year: "2016"
    note: "Background for the length of thread engagement by shear areas, tap drill sizes, bolt and screw thread lengths, the turn-of-nut relation and the empirical working strength of bolts in packed joints, as used by several of the BIZOMAT tools in Chapters 3, 6 and 9."
  - title: "ISO 898-1 Mechanical properties of fasteners made of carbon steel and alloy steel, Part 1: Bolts, screws and studs"
    creator: "International Organization for Standardization"
    year: "2013"
    note: "Named by number and scope only, as the standard that defines metric property classes such as 8.8 and 10.9. The proof and tensile strengths used in the book are taken from Shigley's tables and labelled as the case's working figures."
  - title: "Model Code of Practice: Managing the risks of plant in the workplace"
    creator: "Safe Work Australia"
    year: "2022"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-plant-workplace"
    note: "Named in Chapters 1 and 9 for the duties to manage the risks of plant, including pressure equipment and the release of stored energy when joints are opened."
related:
  - title: "Metal Fatigue by the Numbers"
    href: "/reados/publications/metal-fatigue-by-the-numbers/"
  - title: "Housings That Rebuild"
    href: "/reados/publications/housings-that-rebuild/"
  - title: "Designing Welded Joints by the Numbers"
    href: "/reados/publications/designing-welded-joints-by-the-numbers/"
  - title: "Fixtures That Repeat"
    href: "/reados/publications/fixtures-that-repeat/"
  - title: "Bolted joints that stay tight"
    href: "/reados/collections/machine-elements-and-mechanical-design/bolted-joints-that-stay-tight/"
---

## About this book

A bolted joint looks like the simplest connection in engineering: a hole, a bolt, a nut and a spanner. It is also one of the least understood. A bolt is a spring, stretched when it is tightened, and the parts it clamps are springs too, squeezed by the same force. How that pair of springs shares the loads the joint later carries decides whether the joint stays tight, leaks, slips or breaks its bolts, and almost none of it can be seen once the nut is on.

This book shows how to design, tighten and check bolted joints with numbers. It starts with preload and joint stiffness, then covers the three ways of setting preload, by torque, by stretch and by angle, and how accurately each one works. It then checks joints against separation, proof load and fatigue, sizes threads, tapped holes and screw lengths, and moves on to joints in shear, bolt groups under eccentric loads, brackets in tension, gasketed flanges and joints that change temperature. It finishes with hole patterns and the records that show a joint was made as designed.

It is for mechanical design and maintenance engineers, machine builders and fitters. It assumes engineering or trade training and comfort with force, stress and stiffness; the joint models are explained as they are used. Each chapter works the running case with real numbers, includes one plausible mistake and how it was found, links the BIZOMAT tools that do the chapter's calculations, and ends with an exercise and its worked answer.

## The running case

Every chapter follows one machine. This is an illustration. A hydraulic repair shop in Mackay, Queensland, that rebuilds cylinders for mining equipment is building the CT-1, a test rig that pressure-tests rebuilt cylinders and cycles them for endurance before they go back to site. Its bolted joints include:

- **Test head:** a steel head closing a 125 mm bore test chamber, held by eight M20 property class 10.9 cap screws into tapped holes, cycled from zero to 25 MPa.
- **Frame:** a welded steel frame with a bolted splice in its main beam, which carries the cylinders' reaction loads in shear.
- **Brackets:** a rod-end support plate bolted to a column web, and a load cell bracket bolted to a column flange.
- **Hydraulics:** an aluminium valve manifold held by M10 cap screws that runs warm, and a gasketed return-line filter housing.

Pressures, dimensions, materials, property classes, friction and nut factors, gasket factors and test figures are the shop's working figures or are calculated from stated assumptions. They do not describe BIZOMAT work or any real business, equipment maker or supplier's data.

## How to use the book

Read Chapter 1 first: it sets out preload and joint stiffness, which every later chapter uses. Chapters 2 and 3 cover tightening and should be read together. Chapters 4 and 5 check tension joints. Chapters 6 to 10 can be read in any order once Chapter 1 is familiar.

Every calculation in the book was checked by running it, and the BIZOMAT tools linked from each chapter were checked against the calculations they perform. Nut factors, friction coefficients, gasket factors and allowable stresses are typical figures for illustration; a real design uses the fastener, gasket and coating makers' data and the applicable standard.

## Source limits and professional responsibility

This book is educational. Joints in pressure equipment, lifting equipment and structures are designed and checked to their codes and standards, such as the pressure vessel and structural steel standards that apply in Australia, by competent engineers. A pressurised joint must never be loosened or tightened while it is under pressure. Decisions about real joints remain with the competent people responsible for them.
