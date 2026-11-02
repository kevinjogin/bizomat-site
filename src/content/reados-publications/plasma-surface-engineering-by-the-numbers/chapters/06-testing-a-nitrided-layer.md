---
book: plasma-surface-engineering-by-the-numbers
chapterSlug: testing-a-nitrided-layer
order: 6
title: "Testing a nitrided layer"
description: "How to prove a nitrided layer with coupons, metallography and a microhardness traverse, how to read nitriding depth, and why a Rockwell C test on a nitrided surface misleads."
draft: false
---

A nitrided part looks almost exactly as it did before treatment: perhaps a matt grey surface, perhaps a faint colour, no visible case. Nothing about it shows whether the diffusion zone is 0.12 mm deep or 0.05 mm, whether a compound layer formed, or whether the core kept its hardness. The only way to know is to test, and the test usually destroys what it tests, so it is done on coupons that travel with the load or, for critical work, on a sacrificial part.

This chapter describes how the shop proves order 27's nitriding: the test coupons, the metallographic section, and the microhardness traverse from which the nitriding depth is read. It uses the KEVOS® Vickers and Knoop hardness tool to turn indentation diagonals into hardness and to check that each indentation is shallow enough for the layer being measured. It ends with a toolmaker's inspector who rejected nitrided inserts as too soft, measured with a Rockwell C tester that pushed right through the case.

## Test coupons

Every load in PN-1 carries test coupons: small pieces of the same steel, from the same bar or at least the same heat, hardened and tempered with the parts and finished like them. For order 27 the coupons are H13 discs, 30 mm in diameter and 15 mm thick, ground on one face, placed at the top, middle and bottom of the load. They see the same glow, temperature and time as the inserts and can be cut up without loss.

A coupon only represents the parts if it shares their history. A coupon of a different steel, or the same steel tempered to a different hardness, nitrides differently; a small coupon placed where the glow is more intense may run hotter than the parts. The shop's procedure states the coupon material, condition, size and positions for each order, and the job card lists them.

## The metallographic section

One coupon from each position is cut at right angles to its ground face, mounted in resin, ground and polished to a mirror finish, and etched with a weak acid that darkens the diffusion zone and leaves any compound layer bright. Under an optical microscope at a few hundred times magnification, the section shows whether a compound layer is present and how thick it is, the depth to which the diffusion zone's darker etching extends, and any defects such as porosity in the compound layer or nitrides along the grain boundaries, which can make a case brittle.

For order 27, the section must show no compound layer, since the CrN coating will go directly onto the diffusion zone. The shop's sections from the production load show none at any position, and a dark-etching diffusion zone of about 0.12 mm.

Etched depth is only a rough guide, because the visible boundary of the etching does not correspond to any particular hardness. The depth on which the customer's specification relies is read from hardness.

## The microhardness traverse

A microhardness traverse is a row of small hardness indentations made on the polished section at increasing distances from the surface. Each indentation is made with a diamond pyramid under a small, known force; the size of the impression, measured under the microscope, gives the hardness. Plotting hardness against depth shows the case's profile from the hard surface down to the core.

The [Vickers and Knoop hardness tool](/tools/vickers-knoop-hardness/) works out Vickers (HV) or Knoop (HK) hardness from the test force and the measured diagonal, and gives the indentation's depth and the minimum specimen or layer thickness for a valid test. For an indentation at 0.5 kgf, the HV0.5 scale, with a mean diagonal of 0.0296 mm, it gives 1,058 HV0.5, an indentation depth of 4.2 µm and a minimum thickness of 0.044 mm.

```figure
type: formula
title: Vickers and Knoop hardness from an indentation
formula: HV = 1.8544 × F ÷ d²
formula: HK = 14.229 × F ÷ d²
caption: F is the test force in kgf and d the mean diagonal (Vickers) or long diagonal (Knoop) in mm. A Vickers indentation is about d ÷ 7 deep and a Knoop indentation about d ÷ 30, so Knoop suits very thin layers. The scale is written with the force, for example HV0.5 for 0.5 kgf.
- HV | Vickers hardness
- HK | Knoop hardness
- d | diagonal, mm
```

```figure
type: compare
title: Microhardness traverse on order 27's middle coupon
cols: Hardness, HV0.5 | Note
rowhead: Depth below the surface
- 0.02 mm | 1,058 | Diagonal 0.0296 mm
- 0.04 mm | 980 |
- 0.06 mm | 860 |
- 0.08 mm | 720 |
- 0.10 mm | 600 |
- * 0.12 mm | 520 | Just above core + 50 HV
- 0.15 mm | 470 | Below core + 50 HV
- 0.20 mm | 460 | Core hardness
caption: This is an illustration. The core hardness of 460 HV corresponds roughly to the 46 HRC of the hardened and tempered H13. Indentations are staggered so that each is several diagonals away from its neighbours and from the edge, as the hardness test standard requires.
```

## Reading the nitriding depth

A nitrided case has no sharp boundary, so its depth must be defined. A common definition, used in several national standards, is the depth at which the hardness falls to a stated margin above the core hardness, often 50 HV. The drawing or specification should state which definition and margin apply; without that, two laboratories can report different depths from the same traverse.

With a core of 460 HV and a margin of 50 HV, the limit is 510 HV. The traverse falls through 510 HV between 0.12 mm (520 HV) and 0.15 mm (470 HV). Interpolating linearly, the depth is 0.12 + 0.03 × (520 − 510) ÷ (520 − 470) = 0.126 mm, inside order 27's band of 0.10 to 0.15 mm and close to the 0.122 mm predicted in Chapter 5. The top and bottom coupons gave 0.121 and 0.119 mm.

```figure
type: steps
title: Order 27's nitriding result against its specification
caption: This is an illustration. Results from the three coupons of the production load.
- Compound layer | none visible at any position | Meets: none allowed
- Surface hardness, 0.02 mm deep | 1,040 to 1,060 HV0.5 | Meets the drawing's 950 HV minimum
- Nitriding depth to core + 50 HV, middle coupon | 0.126 mm | Meets 0.10–0.15 mm
- Top and bottom coupons | 0.121 and 0.119 mm | Meet
- * Core hardness | 460 HV, unchanged from before treatment | Core not softened
```

The core hardness matters as much as the case. If the soak temperature had been too high, the core would have tempered further and softened, and a traverse is the cheapest way to find out. The shop compares the core hardness of each coupon with a coupon from the same batch that was not nitrided, so that any change can be attributed to the treatment rather than to the original heat treatment.

## Choosing the test force

The test force must be small enough that the indentation, and the deformed region under it, stay within the layer being measured, and large enough that the diagonal can be measured accurately. The plastic zone under an indentation extends several times deeper than the indentation itself, so a reading near the surface of a thin hard layer is influenced by the softer material beneath if the force is too large. Small forces have the opposite problem: a diagonal of a few micrometres is hard to measure to better than a few per cent, and a 3% error in the diagonal is a 6% error in hardness.

For the diffusion zone of order 27, HV0.5 is a good compromise: diagonals around 0.03 to 0.045 mm and depths of 4 to 6 µm, well within a 0.12 mm case. For a compound layer a few micrometres thick, or for the CrN coating of Chapter 9, even HV0.1 is too heavy for a cross-section reading, and the Knoop indenter is used: at 0.1 kgf with a long diagonal of 0.036 mm it gives 1,098 HK0.1 at a depth of only 1.2 µm. Coatings a few micrometres thick are better measured by instrumented nanoindentation, which records force against depth at loads of milligrams.

## Uniformity across the load

Three coupons from one load give three depths, here 0.119, 0.121 and 0.126 mm, a spread of 0.007 mm. That spread is a measure of how evenly PN-1 treats a load of this kind, and it should be watched over many loads, not judged from one. Positions that run consistently shallow point to a cooler region, often near the hearth's edge or the top of the load where radiation losses are higher; positions that run consistently deep point to stronger glow or hotter spots.

The shop keeps every coupon result in a table by machine, load type and position, and reviews it monthly. Over the first year of order 27's repeat batches, the top position ran on average about 0.004 mm shallower than the middle, small against the 0.05 mm tolerance band and judged acceptable, but the record means that a change of that pattern would be noticed. For loads where a tolerance is tight, the shop places extra coupons at the positions its records show to be extreme.

## Distortion, finish and appearance

Hardness and depth are not the only things to check. Nitriding puts the case into compression and adds a little volume, so parts grow slightly, typically by a few micrometres on a diameter, and long thin parts can bow if the case is uneven. For order 27 the toolmaker measures each insert's critical diameters before dispatch and the shop measures them again after treatment; the growth is recorded and fed back to the toolmaker's finishing allowances.

Surface finish usually roughens slightly, by sputtering and by the growth of nitrides at the surface, and polished mould surfaces may need a light repolish before coating if the customer requires a mirror finish. A uniform dull grey colour is normal; patches of colour, staining or bright spots indicate local overheating, arcing or contamination and are a reason to section a coupon from nearby or reject the part. The shop inspects every part under good light after unloading and records any marks on the job card with their position.

## Checks on the parts themselves

Coupons prove the process; they do not prove each part. For order 27 the shop adds two non-destructive checks on the inserts themselves. A portable hardness tester of the ultrasonic contact impedance type, which presses a small diamond into the surface at a load of a few kilograms-force or less, gives a quick reading of surface hardness on every insert, at a few positions each. Its readings are compared with readings taken the same way on the coupons, whose true profile is known from the traverse, so that the instrument is used to compare parts with coupons rather than to give an absolute value. And eddy current instruments can sort nitrided from un-nitrided parts, because the case changes the steel's electrical and magnetic properties near the surface; the Library's [Eddy Current Inspection by the Numbers](/reados/publications/eddy-current-inspection-by-the-numbers/) explains how. Neither replaces the traverse, but together they catch a part that missed the treatment or was shielded by a neighbour.

## What the certificate should say

The certificate the shop issues for order 27 states, for each load: the steel and its condition, the process and the gas mixture, the soak temperature and time with the thermocouple positions, the coupon positions, the compound layer result, the surface hardness with its test method and load, the nitriding depth with the definition used, the core hardness, the inspection results, and the run number that links back to the run sheet. A certificate that says only "nitrided, 0.12 mm" cannot be checked, compared or relied on if a part fails in service, and a toolmaker who receives one should ask for the rest.

## When it goes wrong: the Rockwell C test

The toolmaker's goods-in inspector checked three inserts from order 27 on a Rockwell C hardness tester and recorded 52 HRC. The drawing called for a surface hardness of at least 950 HV, which the inspector converted with a hardness conversion table to about 68 HRC, and rejected the inserts as soft.

The Rockwell C test presses a diamond cone into the surface under a total force of 150 kgf. Its depth increment for 52 HRC is (100 − 52) × 0.002 = 0.096 mm, almost the whole depth of the case, and the deformed zone under the cone extends far deeper. The reading therefore reflects mainly the 460 HV core under a thin hard skin; it is not a measurement of the surface hardness at all. Conversion tables between hardness scales also assume a material that is uniform with depth, which a nitrided case is not, so converting 950 HV to HRC for a nitrided part is meaningless.

```figure
type: compare
title: Why the hardness test must suit the case
cols: Load | Indentation depth | Reads
rowhead: Test
- Rockwell C | 150 kgf | about 0.1 mm at 52 HRC | Mostly the core under a 0.12 mm case
- Superficial Rockwell 15N | 15 kgf | a few hundredths of a millimetre | Mostly the case
- * Vickers HV0.5 on a section | 0.5 kgf | about 4 µm | Hardness at a chosen depth
- Knoop HK0.1 on a section | 0.1 kgf | about 1 µm | Thin layers and coatings
caption: This is an illustration. Indentation depths for the Vickers and Knoop tests from the hardness tool; the Rockwell C figure is the test's depth increment for 52 HRC. The drawing should name the test method and load for surface hardness.
```

The shop sent the toolmaker the coupon traverse and a short note explaining the difference. The inserts were accepted, and the toolmaker's drawing for the next order specifies surface hardness as HV0.5 on the coupon section, nitriding depth to core + 50 HV, and no compound layer, which is what the inspector now checks against the shop's certificate.

## Exercise: a heavier indentation

A laboratory reports a reading at 0.05 mm depth on a nitrided coupon: HV1 with a mean diagonal of 0.0420 mm.

1. What is the hardness?
2. How deep is the indentation, and what minimum layer thickness does the tool give?
3. Is the reading at 0.05 mm depth trustworthy if the indentation is 0.05 mm from the surface, and what would you change?

**Answer.**

1. The [Vickers and Knoop hardness tool](/tools/vickers-knoop-hardness/) gives 1.8544 × 1 ÷ 0.0420² = 1,051 HV1.
2. About 6 µm deep, with a minimum layer thickness of 0.063 mm.
3. Doubtful. The indentation's centre is 0.05 mm from the edge of the section, little more than one diagonal, while the test standard requires a larger distance from an edge, and the edge itself may be slightly rounded by polishing. Use a lower force, such as HV0.5, so that the diagonal is smaller, mount the coupon with an edge-retaining resin or a nickel plating to protect the edge, and stagger the indentations so that each is far enough from the edge and from its neighbours.
