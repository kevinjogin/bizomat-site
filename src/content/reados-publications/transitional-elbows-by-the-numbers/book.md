---
title: "Transitional Elbows by the Numbers"
subtitle: "Triangulating sheet metal fittings whose ends are not parallel: inclined ends, tapering, rectangular, twisted and helical elbows"
description: "Develop sheet metal fittings whose ends are not parallel by triangulation from coordinates: inclined ends, transitional, tapering, rectangular, flat-oval, twisted and helical elbows."
category: Manufacturing
tags: [manufacturing, design, quality]
author: KEVOS®
publisher: KEVOS® READOS
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Intermediate to advanced sheet metal layout"
audience: "Sheet metal workers, ductwork fabricators, apprentices and drafters who develop patterns for fittings that change shape and direction at once, and engineers who check them."
outcomes:
  - "Find the true length of any line on a fitting from its three coordinate differences, and know which shortcuts fail."
  - "Draw the true shape of an inclined end and divide it so that the pattern's lines land where they should."
  - "Triangulate and develop round, rectangular-to-round and flat-oval fittings whose ends are not parallel."
  - "Develop tapering elbows, rectangular elbows with warped cheeks, twisted transitions and helical elbows."
  - "Allow, assemble, check and list a set of transitional fittings so that each one meets its neighbours."
coverVariant: category
references:
  - title: "Triangulation Applied to Sheet Metal Pattern Cutting (sixth edition)"
    creator: "F. S. Kidder, The Sheet Metal Publication Company, New York"
    year: "1924"
    note: "Supplied source, first published 1917, read as a subject map of triangulated fittings, in particular its fittings with ends in different planes, transitional and tapering elbows, twisted fittings and helical elbows. No text, figures, constructions, tables or exercises are reproduced; the coordinate method, the running case, its numbers and its checks are this book's own."
  - title: "Developable Surface"
    creator: "Wolfram MathWorld, E. W. Weisstein"
    year: "2026"
    url: "https://mathworld.wolfram.com/DevelopableSurface.html"
    note: "Reference for which surfaces can be unrolled flat without stretching, used in Chapters 1 and 7 to explain why some faces need triangulation and others can be stretched out."
  - title: "Hyperbolic Paraboloid"
    creator: "Wolfram MathWorld, E. W. Weisstein"
    year: "2026"
    url: "https://mathworld.wolfram.com/HyperbolicParaboloid.html"
    note: "Reference for the warped surface formed by a twisted four-sided face, used in Chapter 9."
  - title: "Helix"
    creator: "Wolfram MathWorld, E. W. Weisstein"
    year: "2026"
    url: "https://mathworld.wolfram.com/Helix.html"
    note: "Reference for the helix's parametric form and arc length, used in Chapter 9 for the helical elbow's centreline."
  - title: "AS 4254.2 Ductwork for air-handling systems in buildings, Part 2: Rigid duct"
    creator: "Standards Australia"
    year: "edition as called up"
    note: "Named by number and scope as the Australian standard for rigid ductwork in buildings. The running case is an industrial extraction system, and nothing in this book claims compliance with it."
  - title: "AS 1397 Continuous hot-dip metallic coated steel sheet and strip"
    creator: "Standards Australia"
    year: "edition as called up"
    note: "Named by number and scope as the product standard for galvanised sheet of the kind used in the running case. No values are quoted from it."
related:
  - title: "Sheet Metal Patterns by the Numbers"
    href: "/reados/publications/sheet-metal-patterns-by-the-numbers/"
  - title: "Rectangular Duct Fittings by the Numbers"
    href: "/reados/publications/rectangular-duct-fittings-by-the-numbers/"
  - title: "Ductwork by the Numbers"
    href: "/reados/publications/ductwork-by-the-numbers/"
  - title: "Oval Sheet Metal Work by the Numbers"
    href: "/reados/publications/oval-sheet-metal-work-by-the-numbers/"
---

## About this book

Most sheet metal fittings join two ends that face the same way: a reducer, a square-to-round, a hopper. Their ends lie in parallel planes, and the pattern's lines rise by one height. The fittings in this book are the awkward ones, whose ends face different ways: a hood outlet that turns upward as it changes from rectangular to round, an elbow that tapers as it turns, a rectangular elbow that narrows round the bend, a duct that twists, an elbow that climbs as it turns. None of them can be drawn with one elevation and one height, and many cannot be unrolled at all without being divided into triangles.

The book treats every such fitting the same way. It puts the fitting on three axes, gives every point on its two ends a coordinate, finds the true length of every line from three differences, and lays the triangles out flat. That is triangulation, the method sheet metal workers have used for more than a century, written so that every line can be calculated and checked rather than drawn and measured. Each chapter develops a fitting from one running case, includes a plausible mistake and how it was found, and ends with an exercise and its worked answer.

It is for sheet metal workers, ductwork fabricators, apprentices and drafters, and for engineers who check their patterns. It assumes school algebra and trigonometry and the basics of pattern development. READOS's Sheet Metal Patterns by the Numbers covers triangulation of fittings with parallel ends, the eccentric reducer and the rectangle-to-round transition; this book starts where that one stops.

## The running case

Every chapter follows one fictional job. This is an illustration. A ductwork fabricator is making the fittings for a dust-extraction system, called DX-3 on its drawings, in a joinery workshop. The system collects dust from a panel saw hood, two machine drops and a fan, and runs to a collector outside. Six of its fittings change direction and shape at the same time:

- **F1**, a hood outlet that turns from a 400 × 200 mm rectangular face to a Ø250 mm round duct rising vertically;
- **F2**, a 30° reducing connector from Ø250 to Ø200 at a machine drop;
- **F3**, a three-piece tapering elbow from Ø315 to Ø250 on the main;
- **F4**, a rectangular elbow at the fan inlet box that narrows from 400 to 300 mm wide as it turns;
- **F5**, an elbow from Ø250 round to a 350 × 150 mm flat oval to pass between roof purlins;
- **F6**, a twisted rectangular transition and a helical elbow where the duct climbs round a column.

The fittings are made in 0.8 mm galvanised steel sheet. The fabricator, the workshop, the dimensions and the mistakes are invented. None describes KEVOS® work or a real business.

## How to use the book

Read Chapters 1 to 3 first: they set up the coordinates, true lengths and inclined ends that every later chapter uses. Chapters 4 to 9 each develop one fitting, and Chapter 10 deals with allowances, assembly, checks and the material list. Values are given to 0.1 mm so that the arithmetic can be followed; patterns are usually marked to the nearest half millimetre. Every number in the book was calculated by running it, and the line tables can be reproduced in a spreadsheet from the coordinates given.

## Source limits and professional responsibility

The geometry in this book is exact to the stated precision, and the triangulated patterns are as accurate as the number of divisions allows; Chapter 4 shows how that accuracy changes. Seam, lap and flange allowances are illustrations, to be calibrated with trial pieces in the shop's own sheet and machines. Dust-extraction systems must be designed for their duty, and combustible dust brings explosion and fire hazards that are matters for qualified design and the applicable regulations. This book teaches pattern geometry. It is not a design for any system, and qualified review governs real work.
