---
book: yield-and-plastic-flow-by-the-numbers
chapterSlug: hardness-and-grain-size
order: 4
title: "Hardness and grain size"
description: "What a hardness test measures and how far it predicts strength, how grain size raises yield strength by the Hall–Petch relation, and why a coarse-grained heat passed a hardness check."
draft: false
---

A tensile test takes a machined specimen and a testing machine; a hardness test takes seconds on the part itself. That makes hardness the most common check on metal parts in production, and a tempting stand-in for strength. It is a good one within limits, and those limits are where a material defect can slip through. Grain size, meanwhile, is the one strengthening mechanism that raises yield strength and toughness together, and it is invisible to a hardness tester.

This chapter explains what a Brinell hardness number measures, how it relates to tensile strength, and why it does. It then explains how grain size sets yield strength, and follows a heat of rod bar whose grains were too coarse.

## What hardness measures

A hardness test presses a hard indenter into the surface under a known force and measures the size of the dent. The metal under the indenter flows plastically outward and upward around it, so hardness is a measure of resistance to localised plastic flow: a yield-and-work-hardening property, measured in a small volume.

The Brinell test uses a tungsten carbide ball, commonly 10 mm in diameter, pressed in with a force of up to 3,000 kgf (29.42 kN) for steel. The hardness number is the force in kilograms-force divided by the curved surface area of the dent, in square millimetres. The method is set out in ISO 6506-1, which also gives the rules for a valid test: the dent's diameter must lie within a range of fractions of the ball's diameter, the specimen must be thick enough that the dent does not show on its back, and indentations must be far enough from edges and from each other.

```figure
type: formula
title: Brinell hardness from the indentation
formula: HBW = 2F ÷ {π D [D − √(D² − d²)]}
formula: depth h = [D − √(D² − d²)] ÷ 2
caption: F is the test force in kgf, D the ball diameter and d the mean diameter of the dent, both in mm. The force-diameter ratio F ÷ D² is chosen for the material: 30 for steel. The W denotes the tungsten carbide ball.
- F | test force, kgf
- D | ball diameter, mm
- d | mean of two perpendicular dent diameters, mm
```

### The Brinell hardness tool

The [Brinell hardness from indentation](/tools/brinell-hardness/) tool takes the force, the ball diameter and the mean dent diameter and returns the hardness, the ratio d ÷ D, the force-diameter ratio, the dent's depth, and an approximate tensile strength for steels of 3.45 times the hardness. It checks that d ÷ D lies between 0.24 and 0.6, and reminds the user that the specimen should be at least eight times as thick as the dent is deep.

```figure
type: steps
title: The HC-63 rod bar in the Brinell hardness tool
caption: This is an illustration. 3,000 kgf, 10 mm ball, mean dent diameter 4.40 mm, on a slice cut from the bar.
- * Hardness | 187 HBW 10/3000
- Indentation ratio d ÷ D | 0.440, within 0.24 to 0.6: VALID TEST
- Force-diameter ratio | 30, as for steel
- Depth | 0.510 mm; specimen at least 4.08 mm thick
- Approximate tensile strength | 3.45 × 187 = 646 MPa, against 640 MPa measured
```

### Other hardness scales

Brinell's large ball averages over many grains and suits coarse or uneven structures such as castings, forgings and bar. Other methods suit other jobs. The Vickers test presses a diamond pyramid in with a small force and measures the diagonals of the square dent; at low forces it can measure thin layers and individual zones, such as a case-hardened surface or a weld's heat-affected zone. The Rockwell tests measure the depth of penetration instead of the dent's size, and are quick and suited to production checks of hardened parts. Each scale has its own method standard and its own validity rules.

Converting between scales is common and approximate. Published conversion tables, such as those in ISO 18265, are empirical and differ for different materials and conditions; a converted value should be reported as converted, with the table used, and never used to decide acceptance against a limit stated in another scale if a direct test is possible.

## Why hardness tracks tensile strength

Under a ball, the metal is constrained by the material around it, so it can only flow sideways and upward. Analyses of an indenter pressed into a rigid-plastic material show that the mean pressure needed is about three times the material's flow stress. Tabor showed experimentally that, for a work-hardening metal, the flow stress that matters is the one at a representative strain of about 8%, because the metal under a ball is strained by roughly that amount.

For the rod steel, the mean pressure over the dent's projected area, the Meyer hardness, is 3,000 ÷ (π × 4.4² ÷ 4) = 197 kgf/mm², or 1,935 MPa. A third of that is 645 MPa. On the rod steel's flow curve from Chapter 3, the flow stress at 5 to 8% strain is 659 to 692 MPa. The agreement, within about 7%, is as good as such a rough relation deserves.

That is why the familiar factor of about 3.45 between tensile strength in MPa and Brinell hardness works for annealed and normalised steels: the flow stress at 8% strain is close to the tensile strength for steels that neck at around 10% strain. It also explains where the factor fails.

- **Cold-worked steels** have little work hardening left, so their tensile strength is close to their flow stress at small strains, and the ratio of tensile strength to hardness is lower, nearer 3.2 to 3.3.
- **Yield strength** is not predicted well by hardness at all, because two steels with the same tensile strength can have quite different yield strengths, as the normalised and cold-drawn bars of Chapter 2 showed.
- **Hardened and surface-treated parts** have hardness gradients; a hardness reading on the surface says nothing about the core.
- **Other metals** have other ratios; the 3.45 factor is for steels.

```figure
type: compare
title: Hardness and tensile strength for HC-63 materials
cols: Hardness, HBW | 3.45 × HBW, MPa | Measured tensile strength, MPa | Ratio Rm ÷ HBW
rowhead: Material
- * Rod bar, normalised | 187 | 646 | 640 | 3.42
- Barrel tube, cold drawn and stress relieved | 196.5 | 678 | 640 | 3.26
caption: This is an illustration. The cold-drawn tube's lower ratio is typical of cold-worked steel, which has less work hardening left. Hardness is a good check for consistency within one material and condition, and a rough one between them.
```

## Grain size

A dislocation moving through a grain cannot simply cross into the next one, because the neighbouring grain's slip planes lie at different angles. Dislocations pile up against the boundary, and the stress at the head of the pile-up builds up until it can start slip in the next grain. A larger grain holds a longer pile-up, which concentrates the stress more, so slip crosses the boundary at a lower applied stress. Smaller grains therefore mean a higher yield strength.

The relation, found independently by Hall in 1951 and Petch in 1953, is that the yield strength rises with the inverse square root of the grain diameter.

```figure
type: formula
title: The Hall–Petch relation
formula: σy = σ₀ + k ÷ √d
caption: σ₀ is the friction stress of the lattice with its other obstacles, k a constant for the material and d the grain size, usually taken as the mean lineal intercept. For ferritic steels, k is commonly of the order of 0.5 to 0.75 MPa·√m. Fine grains also raise toughness, which almost no other strengthening mechanism does.
- σy | yield strength
- σ₀ | friction stress, MPa
- k | Hall–Petch constant, MPa·√m
- d | grain size, m
```

### Measuring grain size

Grain size is measured on a polished and etched section under a microscope, by counting the grains in a known area or the grain boundaries crossed by test lines of known length. ASTM E112 defines a grain size number G from those counts: the number of grains per square inch at 100 times magnification is 2^(G − 1), so each step of 1 in G halves the grain area. A higher G means finer grains.

The [ASTM grain size number](/tools/grain-size/) tool converts a count of grains per square inch at 100×, a count of grains per square millimetre at 1×, or a mean lineal intercept length in micrometres, into G and the other two measures. It assumes equiaxed grains and reminds the user to report the method and the number of fields measured.

```figure
type: compare
title: Grain size measures for three mean intercept lengths, from the grain size tool
cols: ASTM grain size number G | Grains per mm² at 1× | Grains per in² at 100×
rowhead: Mean lineal intercept
- * 20 µm (the builder's normal rod bar) | 8.00 | 1,984 | 128
- 35 µm | 6.39 | 648 | 41.8
- 60 µm | 4.83 | 220 | 14.2
caption: This is an illustration. Equiaxed grains. The builder's rod bar specification calls for G 7 or finer in the normalised condition.
```

### Controlling grain size

Grain size in steel is set mainly by its last heat treatment or hot working. Normalising heats the steel just above the temperature at which it becomes fully austenitic, forms new small grains, and cools them in air; on cooling, those grains transform into fine ferrite and pearlite. Heating too high or holding too long lets the austenite grains grow, and the product after cooling is coarser. That is the most common cause of a coarse-grained heat.

Steel makers control it in several ways. Small additions of aluminium, niobium, titanium or vanadium form fine particles that pin grain boundaries and stop them moving at normalising temperatures; such steels are described as fine-grained. Controlled rolling finishes the hot rolling at a lower temperature, so the steel recrystallises into fine grains as it is rolled. Both are why modern structural plate can be strong and tough without alloying.

Welding undoes some of this. Next to a weld, the steel is heated far above its normalising temperature, and the grains there grow large. That coarse-grained zone in the heat-affected zone is often the weakest point of a welded joint for toughness, and it is why welding procedures control heat input. The HC-63's welded mounting lugs are attached to the barrel's end cap, away from the honed bore, partly for this reason.

## The error: a hardness check that passed a coarse heat

The HC-63 builder had been told by a consultant that a hardness check on every bar would be enough, and that tensile tests on each heat could be dropped to save the A$420 including GST each one costs. This is an illustration. For three months the laboratory checked one Brinell hardness per bar and stopped tensile testing.

A heat delivered in the fourth month gave hardnesses of 177 to 181 HBW, against 183 to 191 for the previous heats. The lowest was within the builder's hardness range of 170 to 210 HBW, so the bar was accepted. Its rods went into production.

The problem surfaced when one of those rods bent permanently in a customer's machine under a side load that earlier rods had carried without damage. The builder's investigation took a tensile specimen from a remaining bar of that heat: the 0.2% proof strength was 322 MPa, below the 340 MPa minimum, although the tensile strength, 618 MPa, was within specification. A section under the microscope gave a mean intercept of 35 µm, G = 6.4, coarser than the specification's G 7. The heat had been normalised at too high a temperature, and its grains had grown.

The Hall–Petch relation accounts for the drop. With k of 0.74 MPa·√m, coarsening the grains from 20 µm to 35 µm lowers the yield strength by 0.74 × (1 ÷ √0.000020 − 1 ÷ √0.000035) = 40 MPa: from the usual 360 MPa to about 320 MPa. The tensile strength falls much less, because at larger strains work hardening dominates and the grain size matters less. Hardness, which follows the flow stress at about 8% strain, fell by only 4%.

```figure
type: compare
title: Normal and coarse-grained heats of the rod bar
cols: Mean intercept, µm | G | Hardness, HBW | Yield, MPa | Tensile, MPa | Against specification
rowhead: Heat
- Normal | 20 | 8.0 | 187 | 360 | 640 | passes all
- * Coarse-grained | 35 | 6.4 | 179 | 322 | 618 | fails yield and grain size; passes hardness and tensile
caption: This is an illustration. A 40 MPa fall in yield, predicted by Hall–Petch, with only a small fall in hardness. A hardness check alone cannot find a yield deficiency of this kind.
```

The builder reinstated a tensile test on every heat and added a grain size check on the first bar of each new supplier's heat. The consultant's reasoning had been right about consistency and wrong about what hardness measures: it tracks tensile strength, not yield, and the rod's design depends on yield.

The saving had never been large. A heat of rod bar makes several hundred rods, so a tensile test adds roughly a dollar a rod. Against that, the coarse heat cost the builder the replacement of every rod made from it, the customer's downtime and a warranty investigation, several hundred times the testing it had saved. The lesson the builder recorded was not that hardness testing is poor, but that a check must measure the property the design depends on, or something reliably tied to it, and that the tie between hardness and yield strength is not reliable.

## Using hardness well

Hardness remains the builder's main production check, for the right jobs:

- checking that each bar of a heat is consistent with the bars that were tensile tested;
- checking heat treatment results, such as the depth and surface hardness of the rod's induction-hardened layer, with the Vickers tests that suit thin layers;
- sorting mixed bars quickly, with a tensile test on any that look out of place;
- checking repair and weld areas, where a hard zone warns of a brittle microstructure.

Each of these uses also needs a reference: a hardness range established from bars or parts that were tensile tested, sectioned or proved in service. A hardness range without that link to a proven condition is a number without a meaning, and the builder reviews its ranges whenever a supplier or process changes.

Each use compares like with like: the same material, condition and test method. Converting hardness to strength between different conditions, or using it in place of a yield test, is where it goes wrong.

```figure
type: checklist
title: Before trusting a Brinell result
caption: The builder's checklist, after the coarse heat. This is an illustration.
- x d ÷ D between 0.24 and 0.6
- x Specimen at least eight times as thick as the dent is deep
- x Flat, clean, decarburisation-free surface, prepared by grinding if needed
- x Edge and spacing distances as the method requires
- x Compared only with results for the same material and condition
- ? Tensile test on every heat, whatever the hardness says
```

## Exercise: the barrel

A slice of the barrel tube, flattened by grinding to 6 mm thick, is tested at 3,000 kgf with a 10 mm ball, and the mean dent diameter is 4.30 mm. Find the hardness, check the test's validity, and compare the tool's tensile strength estimate with the certificate's 640 MPa. What does the ratio say about the barrel's condition?

**Worked answer.** The depth term is 10 − √(100 − 4.30²) = 10 − 9.028 = 0.972 mm, so HBW = 2 × 3,000 ÷ (π × 10 × 0.972) = 196.5. The ratio d ÷ D = 0.43 is within 0.24 to 0.6, and the dent's depth, 0.486 mm, needs a specimen at least 3.89 mm thick; 6 mm is enough. The test is valid.

The tool's estimate is 3.45 × 196.5 = 678 MPa, 6% above the certificate's 640 MPa. The ratio of tensile strength to hardness is 640 ÷ 196.5 = 3.26, lower than the normalised bar's 3.42. That is what Tabor's explanation predicts for a cold-drawn tube: it has used up much of its work hardening, so its tensile strength sits closer to the flow stress that the ball measures. The estimate is good enough to confirm the tube is in its expected condition, and not good enough to replace the certificate.
