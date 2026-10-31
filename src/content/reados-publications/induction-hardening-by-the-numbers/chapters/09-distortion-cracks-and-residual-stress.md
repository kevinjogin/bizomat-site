---
book: induction-hardening-by-the-numbers
chapterSlug: distortion-cracks-and-residual-stress
order: 9
title: "Distortion, cracks and residual stress"
description: "Why a hardened journal grows, bows and is left in compression, where quench cracks start, why the end of the case matters for fatigue, grinding after hardening, and a cross-drilled hole that cracked."
draft: false
---

Induction hardening changes a part's shape and its internal stresses as well as its hardness. The surface layer is heated and expands while the core stays cool; then it is quenched and turns into martensite, which occupies more volume than the steel it replaced. The part ends up very slightly larger, sometimes slightly bent, and with a pattern of locked-in stresses: compression in the case, tension beneath it. Handled well, that pattern is a large benefit, because the compressive case resists fatigue. Handled badly, at a sharp corner, a hole or the end of the case in a fillet, it cracks the part.

This chapter explains where the stresses come from, how much a journal grows and bows, where quench cracks start and how they are prevented, why the end of the case needs care, what grinding after hardening can do to the case, and a cross-drilled oil hole that cracked a batch of shafts.

## Where the stresses come from

Two things happen to the surface layer that do not happen to the core.

```figure
type: steps
title: How the case ends up in compression
caption: The sequence is simplified; real stresses depend on the steel, the case depth, the part's shape and the heating and quench. The outcome for a well-designed induction-hardened shaft is compression at the surface and tension beneath the case.
- Heating | the hot surface layer tries to expand; the cold core holds it back, so the hot, weak layer is squeezed and yields slightly in compression
- Quenching starts | the surface cools and contracts first, before it transforms
- * Martensite forms in the case | the transformation expands the case, which the core now resists
- At room temperature | the case is left in compression and the region just below it in tension, balancing it
- Tempering | relieves the peaks but keeps most of the useful compression (Chapter 7)
```

The thermal part can be estimated. The WORKOS [Linear thermal growth](/tools/thermal-growth/) tool gives the free growth of a length from a constant expansion coefficient and a temperature change. This is an illustration. Taking a mean coefficient of about 14 µm/(m·K) for steel heated from 20 to 900 °C, an illustrative value over this range, the journal's 125.7 mm circumference would, if free, grow by 125.7 × 14 × 10⁻⁶ × 880 = 1.55 mm, and its 40 mm diameter by 0.49 mm. The cold core prevents most of that. The tool's own guide states the important limit: it models constant-coefficient, unrestrained growth with no phase change, so it describes what the hot layer is trying to do, not what happens. The difference between the growth the layer wants and the growth the core allows is what yields the hot layer, and the martensite's expansion on quenching comes on top of it.

### Why compression is good

A fatigue crack in a shaft almost always starts at the surface, where bending and torsion stresses are highest, and grows when the surface is in tension. A compressive residual stress in the case subtracts from the tension the shaft sees in service, so a crack is far less likely to start, and the case's high hardness makes the surface stronger as well. That is why induction-hardened shafts and axles have much better fatigue strength than unhardened ones of the same steel.

The balancing tension beneath the case is the price. In a shaft with a case too shallow for its loading, the service stress plus the residual tension just below the case can exceed what the core can bear, and fatigue cracks then start below the surface, at the case–core boundary. Case depth is therefore chosen for the loading as well as for wear.

## Growth and bow

This is an illustration. The manufacturer measures the journal's diameter before and after hardening on every shaft in the first batches of a new recipe and on a sample afterwards. Typical IH-40 journals grow by 0.010 to 0.015 mm on diameter after hardening and tempering, and the shaft's runout at the journal rises from about 0.02 mm to between 0.03 and 0.06 mm total indicator reading. The journal is turned to 40.4 mm before hardening and ground to 40.0 mm after, so the 0.2 mm per side grinding allowance easily absorbs both the growth and the runout.

```figure
type: compare
title: IH-40 journal dimensions through the process
cols: Journal diameter, mm | Runout at the journal, mm TIR | Allowance left for grinding, per side
rowhead: Stage
- Turned, before hardening | 40.40 | about 0.02 | 0.20 mm
- After hardening and tempering | 40.41 to 40.42 | 0.03 to 0.06 | about 0.17 to 0.19 mm, less on the high side of any runout
- * After grinding | 40.000 within its tolerance | within the drawing's limit | none
caption: This is an illustration. The case manufacturer's measured ranges for this recipe. Growth and bow are measured, not calculated, for each new part and recipe.
```

The grinding allowance has to cover the runout as well as the growth: on a shaft that has bowed by 0.06 mm, the journal's high side carries 0.03 mm more metal and its low side 0.03 mm less. If the allowance were too small, the grinder would have to remove most of the case on one side to clean up the other. Distortion is therefore a reason not to make grinding allowances too lean, and to measure bow after hardening before the shafts reach the grinder.

### Straightening

Shafts that bow beyond what grinding can absorb are sometimes straightened in a press. Straightening a hardened shaft is risky: bending it enough to yield the core puts large stresses on the case, and the brittle martensite can crack, invisibly, on the tension side of the bend. Where straightening is allowed at all, it is done after tempering, with small, controlled presses at the soft parts of the shaft rather than across the hardened journal, and every straightened shaft is crack tested. The IH-40's procedure forbids straightening across the journal and allows it only between the journal and the drive end, with a magnetic particle test after. Bow is better prevented than corrected: shafts supported between centres and rotated during heating and quenching distort far less than shafts heated or quenched unevenly.

### Measuring residual stress

Residual stress cannot be seen and is rarely measured in production, but it can be measured, and new recipes for critical parts are sometimes proved that way. X-ray diffraction measures the spacing of the atoms in the surface layer and so the strain, and from it the stress; removing thin layers electrolytically and measuring again gives a profile through the case. Hole-drilling methods measure how the surface relaxes around a small drilled hole. Both need specialist laboratories. For most production, the residual stress is controlled indirectly, by controlling everything that creates it: case depth, hardness profile, quench and temper.

## Where quench cracks start

A quench crack forms when the stresses during transformation exceed what the brittle, fresh martensite can carry. They start at stress concentrations and at places that heat or cool unevenly:

```figure
type: tree
title: Common sites of quench cracks in induction-hardened parts
caption: Most cracks start where the induced current concentrates (so the steel overheats) and where the geometry concentrates stress (so the quench strains are highest). Many sites do both.
- Edges and corners
  - Sharp outside corners | current crowds in and overheats them; they cool fastest in the quench
  - Hole edges | the classic site; the hole interrupts the current path and concentrates it at its edge
- Section changes
  - Shoulders and fillets | the case ending in a fillet puts its stress transition in a high-stress zone
  - Keyway ends and slots | thin sections and sharp corners together
- Process causes
  - Overheating | coarse grains make brittle martensite (Chapter 5)
  - Too severe a quench | the polymer too weak or too cold (Chapter 6)
  - Delay before tempering | Chapter 7
```

The remedies follow. Holes are chamfered generously, or plugged during heating with copper or graphite inserts that carry the current past them, or drilled after hardening where that is practical. Sharp edges are broken. The case is stopped short of fillets and keyways by the coil's position and, where needed, flux concentrators or shields. The quench is kept within its proven severity, and parts are tempered promptly.

### The end of the case

Wherever a case ends, the residual stress changes from compression in the case to tension just beyond it, along the surface. If that change happens in a fillet, where the shaft's bending stress is already concentrated, the tensile residual stress adds to the service stress at exactly the worst place. The IH-40's case is therefore stopped 5 mm short of the shoulder fillet (Chapter 4), so that its end lies on the plain journal, where the service stress is lower. Some designs instead harden through the fillet, so the case covers it completely and the transition lies beyond it on a lightly loaded section; what must be avoided is a case that ends in the fillet itself.

### Length and other dimensions

The journal is not the only dimension that changes. A hardened zone grows along the shaft's axis as well as across it, so the shaft's overall length and the positions of features beyond the journal shift slightly. On the IH-40 the change in length is a few hundredths of a millimetre and well within the drawing's tolerances, but on long shafts with several hardened zones, on parts with close axial tolerances between features, and on hardened bores, which can shrink or grow depending on wall thickness, the changes accumulate and must be measured on the first parts. Bores in particular surprise people: a thin-walled hardened bushing may close up while a thick-walled one opens, and the only safe answer is to measure a trial part.

Where the process is stable, its distortion is stable too. The manufacturer's control chart of journal growth and runout, kept from the first-batch measurements onwards, shows a narrow, steady band; a shaft outside it is a sign that something in the heating, the quench or the incoming material has changed, and it is treated like any other out-of-control point (Chapter 10).

## Grinding after hardening

Grinding a hardened surface generates intense local heat. Too aggressive a grind, or a dull or loaded wheel, can heat the surface enough to temper it, softening a thin layer and reversing its compressive stress into tension, or even to reharden it into fresh, untempered martensite with cracks around it. This damage, called grinding burn, is invisible to the eye on a ground finish. It is found by a nital etch, which shows tempered and rehardened areas as dark and light patches, or by instruments that detect the change in the surface's magnetic properties. The IH-40's grinding cell controls its wheel dressing, feed and coolant, and a sample of ground journals is etched each shift.

## The error: a cross-drilled oil hole

This is an illustration. A customer asked for a variant of the IH-40 with a 6 mm oil hole drilled across the journal, to feed lubricant to the bearing. The hole was drilled before hardening, with a light 0.5 mm chamfer, and the shafts were hardened on the standard recipe.

Magnetic particle testing of the first batch found fine cracks radiating from the edges of the hole on about one shaft in five. Sections through the hole showed a coarse, overheated structure at the hole's edges and hardness above 700 HV1 there, against about 650 HV1 elsewhere on the journal. The induced current, forced to flow around the hole, had crowded at its edges and overheated them; the sharp edges had then quenched faster than the rest of the journal, and the brittle, overheated martensite had cracked.

```figure
type: compare
title: The cross-drilled journal before and after the changes
cols: Edge condition | Heating at the hole edge | Crack rate at magnetic particle test
rowhead: Version
- First batch | 0.5 mm chamfer, standard recipe | overheated, coarse martensite above 700 HV1 | about 1 in 5
- * Revised | 2 mm × 45° chamfer, copper plug in the hole during heating, standard recipe | close to the rest of the journal | none in the next 500
caption: This is an illustration. The plug carries current past the hole so that it does not crowd at the edges; the larger chamfer removes the sharp edge that both concentrated the heat and cooled fastest.
```

The manufacturer changed the drawing to a 2 mm chamfer and introduced a copper plug, fitted into the hole before hardening and removed afterwards, to carry the current smoothly past it. Every shaft of the variant was then crack tested, and the sample sections showed the hole's edges hardened like the rest of the journal. None of the first batch reached the customer, because the manufacturer crack tests every part of the first batch of any new variant; without it, cracks radiating from an oil hole would have grown in service under the bearing's load, exactly where they could not be seen. The episode also changed the manufacturer's quoting: any feature in a hardened zone, holes, flats, keyways or grooves, now triggers a design review before the price is given.

## Designing parts for induction hardening

Many induction hardening problems are decided on the drawing, long before the part reaches the coil. A designer who knows the process can avoid most of them:

- mark the hardened zone, its case depth and surface hardness, and where the case may and may not end, on the drawing;
- keep holes, flats, keyways and grooves out of hardened zones where possible, and give any that must be there generous chamfers and radii;
- make sure the hardened zone ends on a plain section, not in a fillet, unless the fillet is hardened through;
- allow enough material for grinding after hardening to absorb growth and bow;
- specify the steel and its delivery condition, not just its grade;
- agree the test method, the limit hardness for the effective case depth and the sampling plan with the hardener before production.

The IH-40's drawing now carries all of these, and its design review checklist asks each question for every new part sent for induction hardening.

## Exercise: a flat on the journal

This is an illustration. A customer wants a 5 mm wide flat machined along the hardened journal, for a set screw.

1. What would happen at the flat's edges if it were machined before hardening?
2. What are the options?
3. Which would you recommend, and why?

**Worked answer.**

1. The flat's two long edges are sharp outside corners in the hardened zone. Induced current crowds at them, overheating them, and they cool fastest in the quench: they are likely to **overheat and crack**, as the oil hole's edges did.
2. Machine the flat **after** hardening, by grinding through the case (which removes the case and its compression at the flat); machine it before hardening with **generously rounded edges** and prove the recipe by sections and crack testing; or **move** the set screw off the hardened zone.
3. If the design allows, **move the feature off the journal**, which removes the risk entirely. If not, a rounded-edge flat machined before hardening, proved by sections and crack testing, keeps a hardened surface; grinding the flat afterwards leaves the flat soft and without compression, which may be acceptable for a set-screw seat but should be the designer's informed choice.
