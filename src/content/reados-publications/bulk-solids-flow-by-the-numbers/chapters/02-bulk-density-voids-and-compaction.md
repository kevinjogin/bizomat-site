---
book: bulk-solids-flow-by-the-numbers
chapterSlug: bulk-density-voids-and-compaction
order: 2
title: "Bulk density, voids and compaction"
description: "Particle density, poured, tapped and consolidated bulk density, voidage and the Hausner ratio, and how each is used for capacity, level-to-mass conversion and a first flowability check."
draft: false
---

Every calculation about a bin starts with a density, and for a bulk solid there is no single density to use. The particles have one density, the heap they form when poured has another, the same material after tapping has a third, and the material at the bottom of a full silo, squeezed by everything above it, has a fourth. For free-flowing pellets these numbers differ by a few per cent. For a fine powder they can differ by half, and choosing the wrong one makes capacities, level readings, feeder settings and structural loads wrong by the same proportion.

This chapter defines the densities, shows how each is measured, and uses them for Plant C's two stores: the pellet silo S1, where the differences are small, and the filler bin B2, where they caused a stock-out on the line.

## Particle density, bulk density and voidage

The **particle density**, ρ_p, is the mass of a particle divided by its own volume, including any closed pores but not the gaps between particles. For polypropylene it is about 905 kg/m³. For calcite, the mineral in ground calcium carbonate, it is about 2,710 kg/m³.

The **bulk density**, ρ_b, is the mass of a quantity of the material divided by the whole volume it occupies, gaps included. The fraction of that volume that is gap is the **voidage**, ε:

ε = 1 − ρ_b ÷ ρ_p

For S1's pellets, with a poured bulk density of 545 kg/m³, the voidage is 1 − 545 ÷ 905 = **0.398**. About 40% of the silo is air, which is typical of packed particles of similar size and fairly regular shape. Randomly packed equal spheres settle at a solids fraction of about 0.60 to 0.64, so a voidage of 0.36 to 0.40.

For B2's filler, with a poured bulk density of 650 kg/m³, the voidage is 1 − 650 ÷ 2,710 = **0.760**. Three-quarters of the poured powder is air. Fine cohesive particles stick together where they first touch and build an open, loose structure, so a fine powder poured lightly is far less dense than its particles would allow. Tapped, the same filler reaches 1,000 kg/m³ and a voidage of 0.631, still far looser than a bed of pellets.

```figure
type: compare
title: Densities and voidage of Plant C's two materials
rowhead: Quantity
cols: S1 polypropylene pellets | B2 calcium carbonate filler
caption: This is an illustration. Particle densities are typical published values for polypropylene and calcite; the bulk densities are the plant's own measurements. The fine powder is mostly air when poured and gains more than half its poured density when tapped.
- Particle density | 905 kg/m³ | 2,710 kg/m³
- Poured bulk density | 545 kg/m³ | 650 kg/m³
- Tapped bulk density | 572 kg/m³ | 1,000 kg/m³
- Voidage, poured | 0.398 | * 0.760
- Voidage, tapped | 0.368 | 0.631
- Hausner ratio, tapped ÷ poured | 1.05 | * 1.54
```

## Poured, tapped and consolidated

Three conditions matter in practice.

1. **Poured, or loose, bulk density.** The material is poured gently into a container of known volume, struck off level and weighed. For plastics granules and powders, ISO 60 sets out a method using a specified funnel and cup. This is the density of material freshly filled into a bin, before it settles.
2. **Tapped bulk density.** The same sample in a graduated cylinder is tapped or jolted a set number of times and the settled volume read. The result depends on the number of taps and the drop height, so it is only comparable between tests run the same way.
3. **Consolidated bulk density.** In a bin or silo the material is squeezed by the weight above it, so its density depends on the stress acting on it. A shear tester, described in Chapter 4, measures this relation directly: it reports the bulk density at each consolidation stress used in the test.

For S1's pellets the three are close. Under the 26.7 kPa vertical pressure at the bottom of S1's cylinder, the pellets compress very slightly and their density rises perhaps to 560 kg/m³. For B2's filler the range is wide: from 650 kg/m³ as poured, to around 820 kg/m³ at the stresses in the lower part of the bin, to 1,000 kg/m³ after hard tapping.

### Compaction is slow

The plant's laboratory ran a tap test on the filler, recording the density after each set of taps. The density rose quickly at first and then more and more slowly, by about the same amount for each tenfold increase in the number of taps. Experiments on vibrated granular columns by Knight and colleagues found the same slow, roughly logarithmic approach to a final density. It happens because each tap can only rearrange a few particles, and every rearrangement that makes the packing denser makes the next one harder.

```figure
type: line
title: Tapped bulk density of B2's filler against number of taps
x: Number of taps
y: Bulk density, kg/m³
ymin: 600
ymax: 1050
caption: This is an illustration. The density rose by about 89 kg/m³ for each tenfold increase in taps over this range, close to a straight line against the logarithm of the number of taps. It has not stopped rising at 1,250 taps; the tapped density quoted is the value at the method's fixed number of taps, not a true limit.
- 0 | 650
- 10 | 812
- 30 | 865
- 100 | 912
- 300 | 958
- 1000 | 995
- 1250 | 1000
```

The practical consequence is that a powder keeps settling in a bin for hours or days, especially if the bin is vibrated by nearby machinery, and that it gains strength as it settles. A bin that discharges well when freshly filled can refuse to discharge after a weekend. Chapter 7 returns to this time effect.

## The Hausner ratio as a first check

The ratio of tapped to poured bulk density is called the Hausner ratio, after the powder metallurgist who proposed it. Its sister measure, the compressibility or Carr index, is 100 × (1 − ρ_poured ÷ ρ_tapped) per cent. Both measure how much a material can compact, and since compaction and cohesion go together, both are used as quick screening tests of flowability.

For S1's pellets the Hausner ratio is 572 ÷ 545 = **1.05** and the Carr index 4.7%. For B2's filler it is 1,000 ÷ 650 = **1.54** and the Carr index 35%. Ratios close to 1 belong to free-flowing materials; ratios above about 1.25 are widely read as a sign of a cohesive, poorly flowing powder, and above 1.4 as very poor flow. The filler is well into that range, which agrees with its behaviour in B2.

The Hausner ratio is a screening test, not a design method. It is quick, cheap and good for comparing batches of the same material or spotting a change. It cannot give a hopper angle or an outlet size; those need the shear tests of Chapter 4 and the methods of Chapters 6 and 7. A high ratio is a reason to run those tests, not a substitute for them.

## Capacity and the right density

Capacity calculations need the density the material will actually have in the bin. The [hopper and bin design tool](/tools/hopper-bin-design/) takes the bin geometry, a bulk density and a fill level, and gives the volume, the mass held and the hopper wall angle. For B2, 1.6 m in diameter with a 1.5 m cylinder and a 1.26 m cone to a 150 mm outlet, it gives a volume of 3.947 m³, of which 3.016 m³ is the cylinder and 0.931 m³ the cone, and a wall angle of 60.1° from horizontal.

At 85% fill, the mass held depends entirely on the density chosen:

```figure
type: bars
title: B2's capacity at 85% fill by the bulk density used
unit: kg
caption: Calculated with the hopper and bin design tool. The same bin holds 2,181 kg of freshly poured filler or 3,355 kg if the whole contents were at tapped density, which they never are in practice.
- Poured, 650 kg/m³ | 2181 | freshly filled
- * Consolidated, 820 kg/m³ | 2751 | typical of the lower bin
- Tapped, 1,000 kg/m³ | 3355 | upper bound, not reached
```

B2 only needs to hold one one-tonne bulk bag plus a working reserve, about 1,200 kg, so it has ample capacity on any density. The density question bit Plant C somewhere else.

For S1 the question is whether a full tanker load fits. A 27 t delivery at the poured density of 545 kg/m³ occupies 27,000 ÷ 545 = **49.5 m³**. S1's volume is 79.8 m³, so a delivery can be accepted when the silo holds less than about 30 m³, or 16 t, allowing for the heap that forms at the top, which Chapter 3 calculates.

## The error: level converted to mass with the wrong density

This is an illustration. B2 has an ultrasonic level sensor on its roof. The control system converts the measured level to a volume from the bin geometry and then to a mass, and shows the filler stock on the operator's screen. When the system was commissioned, the integrator took the bulk density from the filler supplier's data sheet, which quoted "bulk density 1.0 t/m³". That figure is the tapped density.

One night shift the screen showed 1,200 kg of filler left, enough for more than two and a half hours at the extruder's filler rate of 450 kg/h, and the operator did not call for a bag change. The feeder ran out after about two hours. The line stopped, the melt in the extruder degraded, and the restart scrapped about 300 kg of product.

The engineer weighed the next full bin's contents by difference, emptying it into bags on a platform scale, and compared the result with the volume the level sensor reported. The average bulk density of the contents was **760 kg/m³**, lower than the data sheet value because most of the bin was freshly filled, aerated powder. The display had overstated the stock by 1 − 760 ÷ 1,000 = **24%**. At a displayed 1,200 kg, there was about 1,200 × 0.76 = **912 kg** in the bin.

```figure
type: bars
title: B2 filler stock at a displayed 1,200 kg
unit: kg
caption: This is an illustration. The level sensor's volume was right; the density used to convert it was the supplier's tapped value. The actual stock was 24% lower than displayed.
- Displayed, at 1,000 kg/m³ | 1200 | data sheet tapped density
- * Actual, at 760 kg/m³ | 912 | measured average density
- Shortfall | 288 | about 40 minutes of filler
```

The fix had two parts. In the short term, the conversion density was changed to the measured 760 kg/m³ and the low-stock alarm raised. In the longer term, B2 was mounted on three load cells, because a powder's density changes with fill history, settling time and aeration, and only weighing measures mass directly. The level sensor stayed as a high-level alarm to stop overfilling.

The general rule is to ask which density a quoted figure is. Supplier data sheets often give one number called bulk density without saying how it was measured. For a free-flowing granular material it barely matters. For a fine powder it can change the answer by half.

## One material, two design densities

Because bulk density varies, a careful design uses two values for different purposes. Capacity is checked with the lowest density the material is likely to have in the bin, usually the poured density, so the bin is big enough even when it holds freshly filled, aerated material. Structural loads are checked with the highest density it is likely to reach, usually the consolidated density at the highest stress in the bin, so the walls, hopper, supports and foundations are strong enough when the contents have settled. Using one middle value for both makes the bin a little too small and the structure a little too weak at the same time.

For B2 the two values are 650 and about 900 kg/m³, a ratio of nearly 1.4. For S1 they are 545 and about 560 kg/m³, a ratio of 1.03, and the distinction is almost academic. Silo load standards such as AS 3774 describe how upper and lower characteristic values of material properties are to be chosen for each load case; this book does not quote them, but the principle of using the unfavourable value for each check is the same.

## Moisture and temperature

Bulk density also changes with moisture and temperature, and these changes matter for flow as much as for capacity. A small amount of moisture forms liquid bridges between fine particles and makes a powder more cohesive and usually less dense, because the sticky particles hold an open structure. Hygroscopic materials such as sugar, salt and many fertilisers pick up moisture from humid air and can cake into a solid mass in a bin over a weekend.

Plant C's calcium carbonate is not hygroscopic, but bags stored in a humid shed can still take up surface moisture. Its pellets are dried before compounding, and warm pellets blown into S1 from a tanker on a hot day cool slowly, so condensation on a cold silo wall can wet the pellets touching it. Chapter 4 shows what that does to wall friction.

## How this applies to a small Australian business

Most small businesses that store bulk materials get their density from a supplier's data sheet and use it for everything. Two checks cost almost nothing. First, find out whether the quoted bulk density is poured, tapped or something else, and measure the poured density yourself with a bucket of known volume and a scale. Second, if a fine powder is involved, measure the tapped density too and work out the Hausner ratio: a value above about 1.25 is a warning that the material may arch or rathole, and that its density, and so any level-to-mass conversion, will vary with how long it has been sitting.

## Exercise: S1's next delivery

S1's level radar shows the pellet surface 6.8 m below the top of the cylinder, measured at the centre. Treat the surface as flat for this exercise. Using the poured density of 545 kg/m³, how much is in S1, and can a 27 t tanker be accepted if the plant keeps 10% of the silo volume empty?

**Worked answer.** The material fills the cone, 7.433 m³, and 9.0 − 6.8 = 2.2 m of the cylinder: π × 1.6² × 2.2 = 17.69 m³. The total is 25.13 m³, or 25.13 × 545 = **13.7 t**. The usable volume is 90% of 79.82 m³ = 71.83 m³, so the space available is 71.83 − 25.13 = 46.70 m³. A 27 t delivery needs 49.5 m³, so it **cannot** be accepted yet. Another 49.5 − 46.7 = 2.8 m³, about 1.5 t, must be used first.
