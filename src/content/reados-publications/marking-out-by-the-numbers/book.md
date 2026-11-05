---
title: "Marking Out by the Numbers"
subtitle: "Hand layout on sheet and plate with rule, square, dividers and trammel: datums, divisions, angles, polygons, arcs, and the accuracy of every method"
description: "Mark out sheet and plate by hand with known accuracy: datums, squareness, lengths, divisions, angles, polygons, large arcs, ellipses and old shop rules tested."
category: Manufacturing
tags: [manufacturing, quality, design]
author: BIZOMAT
publisher: BIZOMAT Library
language: en-AU
status: published
publishDate: 2026-10-26
referencesChecked: 2026-10-26
edition: "1"
level: "Foundation to intermediate sheet and plate layout"
audience: "Sheet metal workers, plate fabricators, apprentices and trainers who mark out by hand, and engineers and drafters who want to know what accuracy a hand layout can deliver before they set a tolerance."
outcomes:
  - "Choose datum edges, square a sheet from them and prove the squareness with diagonals and a 3-4-5 triangle."
  - "Estimate the error of a marked length from the tape's accuracy class, the scribe line, parallax and temperature, and combine the sources."
  - "Construct perpendiculars, divisions, angles, polygons and large arcs with known accuracy, and choose the construction that keeps errors small."
  - "Test a traditional shop rule against exact geometry and decide whether it is good enough for the tolerance in hand."
  - "Check a layout independently before the first cut and record it so the next job starts from a proven method."
coverVariant: category
references:
  - title: "XXth Century Sheet Metal Worker: A Modern Treatise on Modern Sheet Metal Work"
    creator: "H. E. Osborne, The American Artisan, Chicago"
    year: "1910"
    note: "Supplied source, a public-domain trade handbook (United States copyright entry 1908). Read as a record of the bench constructions, circle rules and steel square methods used in tin shops of its time. Its rules are restated and tested against exact geometry in Chapters 5, 6 and 9 with attribution. No text, figures, tables, examples or exercises are reproduced, and the running case, numbers and checks in this book are original."
  - title: "Euclid's Elements"
    creator: "D. E. Joyce (online edition), Clark University"
    year: "1996"
    url: "https://mathcs.clarku.edu/~djoyce/java/elements/elements.html"
    note: "Reference for the classical compass and straightedge constructions behind Chapters 4, 5 and 7: bisecting a line and an angle, erecting and dropping perpendiculars, dividing a line in a given ratio and inscribing the regular pentagon and hexagon."
  - title: "Directive 2014/32/EU on measuring instruments, Annex X (MI-008): material measures"
    creator: "European Parliament and Council of the European Union (as published on legislation.gov.uk)"
    year: "2014"
    url: "https://www.legislation.gov.uk/eudr/2014/32/annex/X"
    note: "Source of the maximum permissible error formula a + bL for accuracy classes I, II and III of material measures of length, the reference temperature of 20 °C and the rounding of L, used in Chapter 3. Many tapes and rules carry these class marks; the directive is cited as the definition of the marks, not as Australian law."
  - title: "Guide for the Use of the International System of Units (SI), NIST Special Publication 811"
    creator: "A. Thompson and B. N. Taylor, National Institute of Standards and Technology"
    year: "2008"
    url: "https://www.nist.gov/pml/special-publication-811"
    note: "Reference for the exact definition of the inch as 25.4 mm, used when Chapter 9 converts inch-based shop rules to millimetres."
  - title: "Guidelines for Evaluating and Expressing the Uncertainty of NIST Measurement Results, NIST Technical Note 1297"
    creator: "B. N. Taylor and C. E. Kuyatt, National Institute of Standards and Technology"
    year: "1994"
    url: "https://www.nist.gov/pml/nist-technical-note-1297"
    note: "Reference for combining independent error sources by root-sum-square, applied in a simplified shop form in Chapters 1 and 3."
  - title: "Linear Thermal Expansion Coefficients of Materials"
    creator: "The Engineering ToolBox"
    year: "2026"
    url: "https://www.engineeringtoolbox.com/linear-expansion-coefficients-d_95.html"
    note: "Source of the representative expansion coefficients for carbon steel, austenitic stainless steel and aluminium used in Chapter 3's temperature check. Values for a specific alloy should come from its supplier."
  - title: "AS 1397 Continuous hot-dip metallic coated steel sheet and strip"
    creator: "Standards Australia"
    year: "edition as called up"
    note: "Named by number and scope as the Australian product standard for galvanised sheet of the kind used in the running case. No values are quoted from it."
  - title: "Model Code of Practice: Managing the risks of plant in the workplace"
    creator: "Safe Work Australia"
    year: "2022"
    url: "https://www.safeworkaustralia.gov.au/doc/model-code-practice-managing-risks-plant-workplace"
    note: "Cited for the duty to manage the risks of guillotines, shears, rolls and folders used after marking out. The book does not cover machine safety; this code and the shop's own procedures do."
related:
  - title: "Plate Work by the Numbers"
    href: "/reados/publications/plate-work-by-the-numbers/"
  - title: "Sheet Metal Patterns by the Numbers"
    href: "/reados/publications/sheet-metal-patterns-by-the-numbers/"
  - title: "Drafting Geometry by the Numbers"
    href: "/reados/publications/drafting-geometry-by-the-numbers/"
  - title: "Oval Sheet Metal Work by the Numbers"
    href: "/reados/publications/oval-sheet-metal-work-by-the-numbers/"
  - title: "Inspecting to the Drawing"
    href: "/reados/publications/inspecting-to-the-drawing/"
---

## About this book

Marking out is the step between a drawing and a cut. A fabricator takes a sheet or plate, chooses the edges everything will be measured from, and transfers the drawing onto the metal with a rule, a tape, a square, a scriber, dividers and, for big work, a trammel. Every line that follows, sheared, nibbled, drilled, folded or rolled, is only as good as the line that was marked. In a shop with CNC cutting, marking out survives wherever a part is one-off, too big for the table, cut from offcuts, adjusted to suit work already built, or checked after a machine has done its work.

This book treats marking out as measurement. Each chapter shows the bench method, then asks how accurate it is: how far a mark can be from where it should be, which part of the method causes most of the error, and what to change when the error is too big for the tolerance on the drawing. That question is rarely asked out loud, and its answer decides whether a hand layout is good enough or whether the part should go to a machine.

It is for sheet metal workers and plate fabricators, apprentices and trainers, and engineers and drafters who set tolerances for parts that will be marked by hand. It assumes school algebra and basic trigonometry. Every calculation was checked by running it.

## The running case

Every chapter follows one fictional job. This is an illustration. A small regional sheet metal shop with no CNC cutting has been asked for a kit of parts for a rooftop ventilation cowl over a farm workshop. The shop calls the drawing C-12. All parts are cut from 1.2 mm galvanised steel sheet in 2400 × 1200 mm sheets and are marked out by hand.

- A **base plate**: a regular octagon 600 mm across flats, with sixteen Ø7 mm holes equally spaced on a 540 mm pitch circle.
- A **collar**: a rolled cylinder Ø300 mm inside and 250 mm high, with a riveted lap seam.
- A **flashing apron**: a 900 × 900 mm plate laid on a roof pitched at 10°, with a hole for the collar to pass through vertically.
- A **hood**: a curved weather hood rolled to an arc 700 mm across its chord with a 120 mm rise.
- A **louvre panel**: a side panel 900 mm long with seven louvre slots at equal pitch.

The drawing allows ±1.0 mm on general dimensions and ±0.5 mm on hole positions relative to one another. The shop's rule is that marking out may use no more than half of a tolerance, leaving the rest for cutting, drilling and forming. The shop, the drawing, the mistakes and the numbers are invented. None describes BIZOMAT work or a real business.

## How to use the book

Chapters 1 to 3 set the ground rules: what accuracy a layout needs, how to start from a square datum and how to read and transfer a length without losing more than a few tenths of a millimetre. Chapters 4 to 8 are the constructions, from perpendiculars to ellipses, each with its error worked out. Chapter 9 tests the rules of thumb found in old trade handbooks and in shop folklore, and Chapter 10 checks a finished layout before the first cut.

Values are calculated to 0.01 mm where that helps a reader follow the arithmetic. No scriber marks to that precision; a careful hand layout on sheet is good to about 0.2 to 0.5 mm, and the chapters show where that figure comes from.

## Source limits and professional responsibility

The geometry in this book is exact. The error estimates are illustrations built from stated assumptions, such as a scribe line about 0.15 mm wide or a tape of accuracy class II; a shop should measure its own tools and its own people before relying on any figure here. Tape accuracy classes are quoted from the European measuring instruments directive because many tapes carry its marks; they describe a new tape, not one that has been dropped.

Marking out is followed by cutting, punching, rolling and folding, which carry real risks of injury. Guarding, safe systems of work and training are governed by Australian work health and safety law and by Safe Work Australia's model code of practice for plant, not by this book. Where a marked part is structural, pressure-bearing or safety-related, the drawing, the specification and a competent person's review govern the work. This book is educational.
