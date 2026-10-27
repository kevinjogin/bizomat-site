---
book: heating-and-cooling-times-by-the-numbers
chapterSlug: corners-ends-and-junctions
order: 6
title: "Corners, ends and junctions: product solutions"
description: "Multiply one-dimensional solutions to get ends, edges, corners, square bars and short cylinders. Applied to DS-100's free end, flange rim and coupon, with a thermocouple placed too near an end."
draft: false
---

Real parts have ends, edges and corners, and those are where temperatures run ahead in heating and fall fastest in cooling. A corner is heated from three directions, an edge from two and a face from one, so the corner of a block in a furnace leads the face, and the face leads the centre. Remarkably, for the simple shapes that make up most parts, the two- and three-dimensional temperatures can be found without any new mathematics: they are the **products** of the one-dimensional solutions from the last three chapters.

This chapter explains the product rule and when it holds, applies it to DS-100's free end, the flange rim during transfer, the test coupon and the comparison of round and square bars, and sets out what it cannot do, which is the flange-to-body junction. The running case's error was a load thermocouple drilled into the shaft's free end, where it read ready several minutes before the body's middle.

## The product rule

Consider a rectangular bar, long in one direction, with a square section 2L × 2L. Its temperature depends on two coordinates, x and y. If the bar starts at a uniform temperature and all its faces see the same surroundings with the same coefficient, the dimensionless temperature in the bar is the product of the dimensionless temperatures of two plates:

θ(x, y, t) ÷ θᵢ = [θ ÷ θᵢ]_plate in x × [θ ÷ θᵢ]_plate in y

The same holds for a block (three plates), a short cylinder (a long cylinder times a plate), a long cylinder's end region (a long cylinder times a semi-infinite solid) and a plate's edge (a plate times a semi-infinite solid). Each factor is calculated on its own characteristic length, with its own Biot and Fourier numbers.

The rule works because the conduction equation and these boundary conditions are linear, and the product of solutions to the one-dimensional problems satisfies the multi-dimensional one. Its conditions matter, and they are exactly the conditions that real loads sometimes break:

- the starting temperature must be uniform;
- the surroundings' temperature must be the same on every face;
- each face's coefficient may differ from the others, but must be constant on that face;
- the properties must be constant.

A part laid on a cold hearth, a part heated in two stages with a cool-down between them, or a part whose faces see different furnace zones breaks the rule, and then the numerical model of Chapter 7 is the tool.

```figure
type: formula
title: Product solutions for common shapes
formula: θ ÷ θᵢ (shape) = product of the one-dimensional factors that make it
caption: Each factor uses its own characteristic length, Biot number and Fourier number. Dimensionless temperatures always lie between 0 and 1, so a product is always smaller than either factor: a corner is always further along than either of its faces.
- Square or rectangular bar | plate in x × plate in y
- Rectangular block | plate in x × plate in y × plate in z
- Short cylinder | long cylinder × plate along the axis
- End region of a long cylinder | long cylinder × semi-infinite solid from the end face
- Edge of a thick plate | semi-infinite from one face × semi-infinite from the other
```

## Round, square and cube

The product rule settles a question Chapter 4 raised: how does a square bar compare with a round one? With h = 150 W/m²·K and the furnace at 850 °C, a plate 100 mm thick takes about 136 minutes for its centre to reach 840 °C. A square bar 100 mm across is the product of two such plates; its centre reaches 840 °C when the product of the two plate factors falls to 10/830, which takes about **68.5 minutes**, almost the same as the 100 mm round's 67.1. A 100 mm cube, the product of three plates, takes about **46.1 minutes**, close to the 100 mm sphere's 44.3.

```figure
type: bars
title: Time for the centre to reach 840 °C, shapes 100 mm across
unit: min
max: 150
caption: This is an illustration with h = 150 W/m²·K, the furnace at 850 °C and the book's properties. Square shapes heat almost exactly like the round shapes they enclose, a few per cent slower.
- Plate, 100 mm thick | 136.0
- Square bar 100 mm | 68.5
- *Round bar 100 mm (DS-100's body) | 67.1
- Cube 100 mm | 46.1
- Short cylinder 100 mm × 100 mm long | 45.3
- Sphere 100 mm | 44.3
```

Two working rules follow. First, a square or rectangular section can be treated, for a first estimate, as the round section it encloses, with a small allowance. Second, a short cylinder whose length equals its diameter heats almost as fast as a sphere, because its ends add as much area as its curved surface. That second rule is why DS-100's test coupon, 25 mm in diameter and 100 mm long, reaches temperature at its centre in about **14.4 minutes**, a little faster than the 16.0 minutes of an infinitely long 25 mm bar: its ends contribute.

## DS-100's free end

DS-100's body has a free end, 500 mm from the flange. Near that end, heat enters through the end face as well as the curved surface, so the end region runs ahead. The product rule gives it as the long-cylinder solution, from Chapter 4, multiplied by the semi-infinite convective solution, from Chapter 5, measured inward from the end face.

This is an illustration. Thirty minutes into the heating, the long-cylinder factor at the axis is about 0.1426: on its own, that is the body's middle at about 731.6 °C. At the end face, the semi-infinite factor at x = 0 is about 0.6206. The product, 0.0885, puts the centre of the end face at about 776.5 °C, roughly 45 K ahead of the middle. At the corner where the end face meets the curved surface, the cylinder factor at the surface replaces the one at the axis, and the corner is at about 784 °C.

```figure
type: compare
title: DS-100's body during heating: middle against the end region
cols: Middle of the body, axis | Axis, 60 mm from the end | Axis, 30 mm from the end | End face, at the axis | End corner
caption: This is an illustration from the product of the long-cylinder series and the semi-infinite solution from the end face, h = 150 W/m²·K, furnace at 850 °C. The semi-infinite factor assumes the body is long compared with the heat's reach, which is only approximate late in the cycle.
- 10 min | 401 °C | 445 °C | 474 °C | 515 °C | 550 °C
- 20 min | 619 °C | 660 °C | 676 °C | 695 °C | 712 °C
- 30 min | 732 °C | 759 °C | 767 °C | 777 °C | 784 °C
- *40 min | 789 °C | 806 °C | 810 °C | 815 °C | 818 °C
- 60 min | 834 °C | 839 °C | 840 °C | 842 °C | 842 °C
```

The end's lead is largest in the middle of the cycle and fades towards the end, because every part of the shaft is converging on the furnace temperature. That matters for measurement, as the failure case below shows, and for anything that happens while temperatures are still rising, such as scaling and decarburisation, which start at corners and ends first.

## The flange rim during transfer

The product rule also handles cooling. During the transfer to the quench, described in Chapter 5, a face of DS-100 cools like a semi-infinite solid. The flange's rim, where the flat face meets the outer diameter, is an edge cooled from two faces, and its dimensionless temperature is the product of two semi-infinite factors. Where three faces meet, at a sharp corner of a block, it is the product of three.

```figure
type: compare
title: Temperature drop during transfer from 850 °C: face, edge and corner
cols: Face | Edge, two faces | Corner, three faces
caption: This is an illustration with an effective h of 100 W/m²·K in air at 20 °C, products of the semi-infinite convective solution. DS-100's flange rim is an edge; a sharp corner on a block would cool faster still.
- *20 s | 31 K | 62 K | 90 K
- 30 s | 38 K | 74 K | 109 K
- 45 s | 46 K | 90 K | 131 K
```

At the 20-second transfer limit, the flange rim has fallen about 62 K, twice the face's drop, and a sharp three-way corner would have fallen about 90 K. On a busy day's 45-second transfer, the rim has dropped about 90 K. That is why the heat treatment procedure for DS-100 calls for a radius on the flange's outer edges, and why sharp corners on any quenched part are both a cooling and a cracking risk: they cool first and fastest.

## The failure case: a thermocouple near the end

This is an illustration. To prove the calculated heating time, the shop planned to put a load thermocouple in one shaft of the trial load. Drilling a deep hole to the middle of a 500 mm body is awkward, so the first trial used a 30 mm deep hole drilled on the axis into the free end face. The thermocouple reached 840 °C at about **59.4 minutes**, and the trial record proposed a cycle of one hour to the body's centre, eight minutes shorter than calculated.

The product solution shows why the measurement read early. A point on the axis 30 mm from the end face is heated by the end face as well as the curved surface. At 59.4 minutes, when it read 840 °C, the body's middle was at about 833 °C; at 37 minutes, when it read 800 °C, the middle was at about 776 °C. The thermocouple had measured the end region accurately; it had not measured the slowest point.

The difference was found because the calculated time and the measured time disagreed by more than the shop's tolerance, and the product calculation explained the gap without suggesting that either was wrong. The correction was to drill the next trial's thermocouple hole radially into the middle of the body, at least three diameters from either end, to the axis, and to repeat the trial. That measurement agreed with the calculation within two minutes. Chapter 9 sets out the general rule for placing load thermocouples: put them at the point that heats last, which is the point furthest from the most heated surface, not the most convenient point to drill.

## Checking a product calculation

Product calculations are easy to get subtly wrong, because each factor has its own length, Biot number and Fourier number, and it is tempting to reuse one factor's numbers for another. Three checks catch most errors. First, every factor must lie between 0 and 1, and the product must be smaller than each of them: a corner that comes out cooler than its faces during heating means a factor has been inverted, usually by multiplying temperature rises instead of remaining differences. Second, when one dimension is much larger than the others, its factor should be close to 1 for most of the cycle: a 500 mm long shaft's end factor at its middle is effectively 1, and if it is not, the semi-infinite factor has been evaluated at the wrong distance. Third, the product rule must reproduce the one-dimensional answer far from edges: the end-region product at the body's middle must equal the long-cylinder result.

There is also a limit on the semi-infinite factor itself. It assumes that heat entering through the end face never reaches the far end of the body. DS-100's heat reaches about 3.6√(α t), which is about 0.55 m after an hour, longer than the body. Late in the cycle, the end factor is therefore only approximate, and the end region's lead is slightly overstated, which is a safe direction for a thermocouple-placement argument but not for a precise end temperature. The finite-difference model of the next chapter has no such limit.

## What the product rule cannot do

DS-100's flange-to-body junction is not a product shape. Where the 100 mm body joins the 220 mm flange, there is extra metal around the body's end, heated from the flange's faces and rim, and the shape cannot be written as a product of plates, cylinders and semi-infinite solids. Treating the flange as a separate short cylinder, 220 mm in diameter and 40 mm thick, gives a centre time of about 40 minutes, faster than the 51.8 minutes of the flange as an infinite plate, because the rim helps. But the flange's centre is not a free centre; it sits on the body's axis, backed by the body's mass, and the junction lags the flange and leads the body's middle. For a part like this, the product rule bounds the answer, and the slowest point is still the body's middle. Where the junction itself mattered, for example a heavy hub on a thin disc, a two-dimensional model would be needed, either the finite-difference method of Chapter 7 extended to two dimensions or a finite-element package.

## How this applies to a small Australian business

The product rule turns a library of three one-dimensional solutions into answers for bars, blocks, short cylinders, ends and edges, all in a spreadsheet. Its main uses in a small shop are three. It ranks shapes in a mixed load, showing that squares heat like the rounds they enclose and short, chunky parts heat like spheres. It shows how far ahead corners, edges and ends run, which is where scale, decarburisation, overheating and quench cracks begin. And it shows where not to put a thermocouple: near an end or an edge, a sensor reads early, and a cycle proved by it will be short at the part's slowest point. A one-page table of the factors for the shop's common sections, kept beside the furnace, lets anyone check a new part's slowest point before the first load goes in, and it costs nothing once the spreadsheet exists.

## Exercise: the end corner at 20 minutes

Using the table above, the long-cylinder surface factor at 20 minutes is about 0.2488 and the semi-infinite factor at the end face is about 0.6705. Calculate the temperature at the corner where DS-100's free end face meets its curved surface at 20 minutes, and compare it with the body's middle at the axis and at the surface. What would an infrared thermometer aimed at that corner tell the operator?

**Worked answer.** The corner's dimensionless temperature is the product 0.2488 × 0.6705 ≈ 0.1668, so the corner is at 850 − 0.1668 × 830 ≈ **711.5 °C**, the 712 °C in the table.

The body's middle at that time is at about 619 °C on the axis and about 644 °C at the surface (Chapter 4). The corner therefore leads the middle's axis by about 92 K and its surface by about 68 K. An infrared thermometer aimed at the end corner would report the hottest point on the shaft, not the slowest, and would say the shaft was much closer to ready than it was. Infrared readings are useful for checking surfaces, but a reading at a corner or an end says nothing reliable about the body's centre.
