---
book: metal-casting-by-the-numbers
chapterSlug: solidification-time
order: 6
title: "Solidification time and Chvorinov's rule"
description: "How long each part of a casting takes to freeze: the casting modulus, Chvorinov's rule, measuring the mould constant, freezing order, and a riser that froze before the section it fed."
draft: false
---

The order in which a casting freezes decides where its shrinkage ends up. Chapter 1 made the point qualitatively: thin parts freeze first, thick parts last, and whatever freezes last must be fed with liquid or it will contain a cavity. This chapter puts numbers on it. A single, simple rule, published by Nicolas Chvorinov in 1940, gives the freezing time of any part of a casting from its shape, and it is still the foundation of everyday riser design.

The chapter explains the casting modulus, applies Chvorinov's rule to GB-12's walls, boss and risers with a WORKOS tool, shows how a foundry measures its own mould constant, and works through a riser that looked big enough but froze before the boss it was meant to feed. None of the arithmetic needs more than a calculator; what it needs is the habit of working out the freezing order before the pattern is made, rather than discovering it in the first sections.

## The casting modulus

A section of casting freezes as fast as the mould can draw its heat away, and the mould draws heat through the section's cooling surface. The heat to be removed is proportional to the section's volume; the rate at which it can be removed is proportional to its surface area. The ratio of the two, volume divided by cooling surface area, is the casting modulus, M, with units of length.

```figure
type: formula
title: Casting modulus and Chvorinov's rule
formula: Modulus: M = V ÷ A
formula: Solidification time: t = B × M²
formula: Riser to casting modulus ratio: M_riser ÷ M_casting, commonly at least about 1.2
caption: V is the volume of the section and A its cooling surface, the area in contact with the mould. Surfaces joined to other sections of the casting do not cool it and are left out of A. B is the mould constant, which depends on the metal, its pouring temperature and the mould material, and is best found by test.
- M | modulus, cm
- t | solidification time, min
- B | mould constant, min/cm²
```

The modulus turns any shape into a single number. A plate of thickness T has a modulus close to T ÷ 2; a long bar of square section a × a has a ÷ 4; a cube of side a has a ÷ 6. Two sections with the same modulus freeze in about the same time, whatever their shapes. And because time goes with the square of the modulus, a section with twice the modulus takes four times as long.

```figure
type: compare
title: Moduli of common shapes
cols: Volume ÷ cooling area | Modulus
rowhead: Shape
- Large plate, thickness T, cooling on both faces | T × area ÷ (2 × area) | T ÷ 2
- Long square bar, side a | a² ÷ 4a | a ÷ 4
- Cube, side a, cooling on all faces | a³ ÷ 6a² | a ÷ 6
- * Cylinder, diameter D and height H, cooling on side and top | (πD²H ÷ 4) ÷ (πDH + πD² ÷ 4) | depends on both
caption: The cylinder with its base resting on the casting, where it does not cool, is the usual model of a riser. Its modulus is greatest, for a given volume, when its height is roughly equal to its diameter.
```

### Where the rule comes from

Chvorinov's rule is not just an empirical fit; it follows from how heat flows into sand. Sand is a poor conductor, so almost all of the resistance to cooling lies in the mould, not in the metal. Heat flowing from a hot surface into a large body of cold, poorly conducting material penetrates it more and more slowly: the heat absorbed per unit area grows with the square root of time, not in proportion to it. A casting section must give up a fixed amount of heat per unit volume, its superheat and latent heat, before it is solid. Setting the heat that must leave, proportional to V, equal to the heat the mould can absorb through the area A in time t, proportional to A × √t, gives √t proportional to V ÷ A, and so t proportional to M². The constant of proportionality gathers up the metal's heat content and the sand's thermal properties, which is why B has to be measured for each metal and sand.

Two consequences follow. In metal moulds, where the mould conducts well and the interface between metal and mould controls the heat flow, the exponent is closer to 1 than 2, and Chvorinov's rule in its simple form does not apply. And in sand, since the time goes with the square of the modulus, a modest increase in a section's thickness causes a disproportionate increase in its freezing time, which is why hot spots matter so much.

## Junctions and hot spots

Sections do not meet at sharp lines. Where two walls meet in an L, a T or a cross, the metal at the junction is thicker than either wall, and its cooling surface is smaller relative to its volume, because the inside corner of the mould is surrounded by metal on two sides and heats up quickly. The junction therefore freezes after the walls that meet in it, forming a small hot spot. A useful way to see it is to draw the largest circle that fits inside the junction: its diameter is the junction's effective thickness. At a sharp T-junction of two equal walls, that circle is noticeably larger than the wall thickness.

GB-12 has many such junctions, where its ribs meet its walls and its walls meet its flange. Most are small enough that the surrounding walls feed them before they close off. The fillets on the pattern (Chapter 4) are sized with this in mind: a fillet large enough to ease the flow of metal and avoid a stress concentration, but not so large that it builds a thick hot spot. Where a junction is unavoidably heavy, a small chill or a local reduction in thickness is the usual remedy.

## Freezing times for GB-12

The WORKOS [Casting solidification time and riser check](/tools/casting-solidification/) tool applies Chvorinov's rule to a casting section and a cylindrical riser. From the section's volume and cooling area, the riser's diameter and height, the mould constant and the required ratio of riser to casting modulus, it gives both moduli, both solidification times and the modulus ratio, and checks the ratio. It treats the riser as a cylinder cooling on its side and top. It also gives a pattern dimension from a shrinkage allowance, as a convenience. Its guide notes that Chvorinov's rule is an approximation, that feeding volume and feeding distance must also be checked, and that exothermic or insulating sleeves change a riser's modulus.

This is an illustration. GB-12's heavy section is its bearing boss. Modelled as a block of 600 cm³ with 380 cm² of its surface against the mould (the rest of its surface joins the walls and does not count), it has a modulus of 1.579 cm. Its walls, 6 mm thick, have a modulus of about 0.3 cm. The foundry's mould constant for this alloy, poured at 720 °C into its resin-bonded sand, is 1.6 min/cm².

```figure
type: compare
title: Freezing times of GB-12's sections by Chvorinov's rule
cols: Modulus, cm | Solidification time
rowhead: Section
- 6 mm wall | 0.30 | 0.14 min, about 9 s
- Whole casting, as one block (2,493 cm³ and 2,600 cm²) | 0.96 | 1.47 min
- * Bearing boss (600 cm³ and 380 cm²) | 1.58 | 3.99 min
- Riser 90 mm diameter × 120 mm high | 1.89 | 5.74 min
caption: This is an illustration. Mould constant B = 1.6 min/cm². The walls freeze in seconds; the boss takes four minutes and must be fed for all of that time by a riser that stays liquid longer.
```

The table is the whole feeding problem in four lines. The walls around the boss freeze within seconds, so they cannot carry liquid to the boss for long. The boss itself takes four minutes, during which it shrinks by several per cent of its volume. The riser on top of it, at 5.74 minutes, outlasts it, so liquid in the riser can flow down into the boss as it shrinks, and the riser, not the boss, ends up with the cavity.

### The riser on the boss

The tool's riser check for the 90 × 120 mm riser on the boss:

```figure
type: steps
title: GB-12's boss and riser in the casting solidification tool
caption: This is an illustration. Section 600 cm³ and 380 cm²; riser 90 mm diameter, 120 mm high; B = 1.6 min/cm²; required ratio 1.2.
- Casting section modulus | 600 ÷ 380 = 1.579 cm
- Riser volume and cooling area | 763 cm³ and 403 cm²
- Riser modulus | 1.895 cm
- Solidification times | boss 3.99 min, riser 5.74 min
- * Modulus ratio | 1.895 ÷ 1.579 = 1.20, meeting the 1.2 required
```

A modulus ratio of 1.2 means the riser freezes 1.2² = 1.44 times as long as the section it feeds. In GB-12's case that is 5.74 minutes against 3.99, so the riser is still partly liquid for nearly two minutes after the boss has finished freezing, which is the margin that lets it keep supplying metal to the boss's last, slowest-freezing core. The margin allows for the riser losing heat to the metal it feeds, and for the riser's top cooling to the air or a cold mould surface.

## Finding the mould constant

The constant B is not a property that can be looked up reliably. It depends on the alloy, the pouring temperature, the sand, its binder and its moisture, and even the mould's temperature. Foundries find their own by test.

This is an illustration. GB-12's foundry poured a 100 mm sand-moulded cube in the alloy at 720 °C with a thermocouple at its centre, and timed the interval from pouring to the end of the eutectic plateau on the cooling curve (Chapter 1): 4.4 minutes. The cube's modulus is 10 ÷ 6 = 1.667 cm, so B = 4.4 ÷ 1.667² = 1.58 min/cm², which the foundry rounds to 1.6. A second test on a plate gave a similar value. Repeating the test whenever the sand system or the alloy changes keeps the constant honest.

## Steering the freezing order

The ideal casting freezes in one direction, from its thinnest, most distant parts towards its risers, so that every region, as it freezes, is fed through hotter metal behind it. This is called directional solidification, and much of a foundry engineer's craft lies in arranging it.

```figure
type: tree
title: Ways to steer the freezing order
caption: Each tool changes a section's effective modulus: chills make a section behave as if it were thinner, sleeves make a riser behave as if it were thicker.
- Make the last-to-freeze region a riser
  - Riser sized by modulus | Chapter 7 adds the volume check
  - Insulating or exothermic sleeve on the riser | raises the riser's effective modulus
- Make thick sections freeze sooner
  - External chill against the section | a metal block in the mould that draws heat fast
  - Internal design change | core out the boss, add ribs that conduct heat away
- Make the feeding path stay open
  - Taper sections towards the riser | each section a little thicker than the one beyond it
  - Padding | extra metal on a wall, machined off later, to keep a path open
```

Chills are particularly useful on GB-12. A steel or iron block set into the mould against the boss draws heat from it much faster than sand. This is an illustration. If the chill effectively increases the boss's cooling area by 40%, its effective modulus falls to 600 ÷ (380 × 1.4) = 1.13 cm and its freezing time to about 2.0 minutes. A chilled boss can sometimes be fed from the walls and a smaller riser, or freeze sound with no riser at all if the region around it is fed. The foundry tried both approaches on trial moulds and settled on a riser without a chill, which gave the most consistent results.

## Freezing times on the shop floor

Freezing times have practical uses beyond riser design. A mould cannot be knocked out until the casting is not just solid but strong enough to be handled without distorting or cracking. GB-12's slowest section, its riser, is solid after about six minutes; the foundry leaves its moulds for 30 minutes before knock-out, which also lets the casting cool enough that it does not distort when it is dropped onto the shakeout grid. A casting knocked out too early can crack at its junctions, where it is hottest and weakest, or warp as one side cools faster than the other in the open air.

The same numbers also show what changes when a job changes. A larger cover with a 1.5 times thicker boss would have a 1.5 times larger modulus and a freezing time 1.5² = 2.25 times as long, and its riser, its knock-out time and its mould turnaround would all have to change with it.

### Where the rule stops being reliable

Chvorinov's rule assumes each section cools on its own, into a large body of sand, with no interference from its neighbours. In real castings, sections close together heat the sand between them and cool more slowly than the rule predicts; a riser placed on a section loses some of its heat into that section; and very thin sections, which freeze in seconds, are governed more by how hot the metal arrives than by their modulus. The rule is a first estimate. The foundry checks it with cooling curves in trial moulds, with sections of the first castings and, on new jobs, with solidification simulation that models the whole casting and mould together.

## The error: a riser that froze first

This is an illustration. On the first GB-12 trial moulds, the patternmaker fitted a riser of 70 mm diameter and 100 mm height on the boss, sized by eye from a similar job. It held about 385 cm³ of metal, which looked ample for a boss of 600 cm³ shrinking by a few per cent.

Sections through the bosses of the first castings showed a ragged shrinkage cavity in the centre of each boss, right where the bearing bore would be machined, and the riser above it sound and full. The riser had frozen first and fed nothing.

```figure
type: compare
title: The boss riser, as first fitted and as corrected
cols: Riser modulus, cm | Riser freezing time, min | Ratio to the boss's 1.579 cm | Result
rowhead: Riser
- 70 × 100 mm, sized by eye | 1.49 | 3.55 | 0.94 | froze before the boss; cavity in the boss
- * 90 × 120 mm, sized by modulus | 1.89 | 5.74 | 1.20 | boss sound
- 100 × 130 mm, larger option | 2.10 | 7.03 | 1.33 | sound, more metal to remelt
caption: This is an illustration. From the casting solidification tool with B = 1.6 min/cm². A riser's volume is not what matters first; its modulus is. A riser that freezes before the section it feeds cannot feed it, however much metal it holds.
```

The tool showed the problem at once: a modulus ratio of 0.94, below 1, means the riser freezes before the boss, at 3.55 minutes against the boss's 3.99. The corrected 90 × 120 mm riser meets the 1.2 ratio. Chapter 7 then checks whether it holds enough metal, which it turns out, on its own, it does not.

## Exercise: an insulating sleeve

This is an illustration. An insulating sleeve around a riser slows its cooling through the sides. The sleeve supplier's data, for this alloy and sand, let the foundry treat a sleeved riser as if its modulus were 1.3 times its bare value.

1. What is the bare modulus of a 75 mm diameter × 90 mm high riser cooling on its side and top?
2. What is its effective modulus with the sleeve, and its ratio to the boss's 1.579 cm?
3. Would the sleeved 75 mm riser feed the boss on modulus, and why might the foundry prefer it?

**Worked answer.**

1. V = π × 7.5² × 9 ÷ 4 = 397.6 cm³; A = π × 7.5 × 9 + π × 7.5² ÷ 4 = 212.1 + 44.2 = 256.2 cm²; M = **1.551 cm**.
2. 1.551 × 1.3 = **2.02 cm**; ratio 2.02 ÷ 1.579 = **1.28**.
3. **Yes** on modulus, above 1.2. A sleeved riser holds about half the metal of the bare 90 × 120 mm riser, so more of the poured metal ends up in the casting and the yield improves, at the cost of the sleeve. Its volume must still pass Chapter 7's feeding check.
