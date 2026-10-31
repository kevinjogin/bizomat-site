---
book: yield-and-plastic-flow-by-the-numbers
chapterSlug: true-stress-and-work-hardening
order: 3
title: "True stress, true strain and work hardening"
description: "Why engineering stress misleads after yield, how true stress and strain and the flow curve describe work hardening, when necking starts, and what cold drawing does to the HC-63's barrel."
draft: false
---

The engineering stress-strain curve of Chapter 2 divides every load by the specimen's original area and every extension by its original length. That is convenient for design, where parts stay close to their original shape. For anything that deforms a lot, such as a bend, a drawn tube or a rolled thread, it misleads: the area shrinks as the metal stretches, and the curve's fall after the maximum load suggests the metal is getting weaker when in fact it is getting stronger.

This chapter replaces engineering stress and strain with true stress and strain, fits the HC-63 rod steel's work hardening with a simple flow curve, explains when and why a bar necks, and follows the barrel tube through cold drawing and stress relief. It also shows how a convenient assumption gave a fracture stress that was wrong by almost half.

## True stress and true strain

True stress is the load divided by the area at that instant. True strain is the sum of all the small increments of extension, each divided by the length at that moment, which works out to the natural logarithm of the length ratio.

```figure
type: formula
title: True stress and true strain
formula: σT = F ÷ A,    εT = ln(l ÷ l₀)
formula: before necking, at constant volume: A = A₀ l₀ ÷ l, so σT = σ (1 + e) and εT = ln(1 + e)
caption: σ and e are the engineering stress and strain. Plastic deformation keeps the volume almost constant, so until the specimen necks the area follows from the length. After necking, the area must be measured at the neck.
- σT, εT | true stress and true strain
- F, A | load and current area
- l, l₀ | current and original gauge length
```

True strain has a useful property: it adds. A tube drawn to a true strain of 0.2 and then another 0.2 has a total true strain of 0.4, whereas engineering strains of 22% and 22% do not add to 44%. For metal forming, where parts go through several steps, that makes true strain the natural measure.

### The true stress and strain tool

The [true stress, true strain and flow curve](/tools/true-stress-strain/) tool takes a load, the original area, a current area (or 0 to assume constant volume), the original and current gauge lengths, and the constants K and n of a power-law flow curve. It returns the nominal and true stress and strain, the flow stress K εⁿ at that true strain, the elongation and the reduction of area. Its true strain is always taken from the lengths, ln(l ÷ l₀). It warns that the constant-volume area holds only before necking.

```figure
type: steps
title: The HC-63 rod bar at maximum load, in the true stress and strain tool
caption: This is an illustration. 50.3 kN, A₀ = 78.54 mm², gauge length 50 mm stretched uniformly to 55.5 mm at the maximum load, constant volume, K = 900 MPa, n = 0.104.
- Engineering stress and strain | 640.4 MPa and 0.110
- Area at maximum load | 78.54 × 50 ÷ 55.5 = 70.76 mm²
- * True stress and true strain | 710.9 MPa and 0.1044
- Flow stress K εⁿ at that strain | 711.5 MPa
- Reduction of area so far | 9.9%
```

## The flow curve

Over most of the plastic range, the true stress of many metals rises with true strain roughly as a power law, often called Hollomon's equation: σT = K εTⁿ. The strength coefficient K is the true stress at a true strain of 1, and the strain-hardening exponent n describes how fast the metal hardens. Low-carbon and stainless steels and copper have n of 0.2 to 0.5 and harden strongly; medium-carbon and cold-worked steels have lower n.

```figure
type: compare
title: The HC-63 rod steel's flow curve, K = 900 MPa, n = 0.104
cols: Flow stress K εⁿ, MPa | Comment
rowhead: True strain
- 0.002 | 472 | above the measured 360 MPa yield: the power law fails near yield
- 0.01 | 557 | early work hardening
- 0.05 | 659 | well into the uniform range
- * 0.104 | 711 | maximum load: necking begins
- 0.2 | 761 | in the neck, or in a formed part
- 0.4 | 818 | heavy forming
- 0.771 | 876 | the neck at fracture, before correction for triaxial stress
caption: This is an illustration. The constants were fitted to the test in Chapter 2: n from the true strain at maximum load and K from the true stress there. The fit is good from a few per cent strain upwards and poor close to yield, which is usual for a power law.
```

A power law is a fit, not a law of nature, and it is poor at small strains, where it overestimates the stress, as the first row shows. For calculations close to yield, such as springback, the measured yield strength is used, not the flow curve. For calculations with large strains, such as tube bending and drawing, the flow curve is far better than the engineering curve.

### Necking

As a bar stretches, two things compete. Its area shrinks, which raises the stress for a given load, and it work hardens, which raises its strength. While hardening wins, any slightly thinner section becomes stronger than its neighbours and the deformation spreads along the bar. When the rate of hardening falls to the true stress itself, the next increment of strain anywhere can no longer be carried by a stronger section, and the deformation localises into a neck. The load reaches its maximum at that point.

That condition, dσT ÷ dεT = σT, is Considère's criterion. For a power-law material it gives a simple result: necking starts at a true strain equal to n. A metal with a high n stretches uniformly a long way before it necks; one with a low n necks early. That is why the strain-hardening exponent is the best single number for a metal's stretch-forming ability, and why the builder's rod steel, with n = 0.104, has a uniform elongation of about 11% even though its elongation after fracture is 19%.

```figure
type: line
title: Engineering and true stress for the HC-63 rod steel up to necking
x: True strain
y: Stress, MPa
ymin: 400
ymax: 800
legend: True stress, K εⁿ | Engineering stress, K εⁿ × e^(−ε)
mark: 0.104 | necking: maximum engineering stress
caption: This is an illustration. The engineering stress, the true stress divided by e^ε at constant volume, reaches its maximum where the true strain equals n. Beyond it the engineering curve falls while the true stress keeps rising.
- 0.02 | 599 | 587
- 0.05 | 659 | 627
- 0.08 | 692 | 639
- 0.104 | 711 | 641
- 0.15 | 739 | 636
- 0.2 | 761 | 623
```

### Forming loads from the flow curve

The flow curve also gives the work and force a forming process needs. The work to deform a unit volume of metal to a true strain ε is the area under the true stress-strain curve, which for a power law is K εⁿ⁺¹ ÷ (n + 1). Dividing it by the strain gives the mean flow stress over the process.

```figure
type: formula
title: Ideal work and mean flow stress for the barrel's draw
formula: w = K εⁿ⁺¹ ÷ (n + 1) = 780 × 0.479^1.18 ÷ 1.18 = 277 MJ/m³
formula: mean flow stress = w ÷ ε = 579 MPa
caption: This is an illustration. The ideal work assumes frictionless, uniform deformation. Real drawing needs more, for friction at the die and plug and for the redundant shearing of the metal as it changes shape; dividing by an efficiency of about 0.5 to 0.7 is a common first allowance.
- w | ideal plastic work per unit volume
- K, n | flow curve constants
- ε | true strain of the process
```

For a draw, the ideal work per unit volume equals the ideal drawing stress on the exit section. On the 1,419 mm² drawn tube, 277 MPa needs an ideal pull of 394 kN; with an efficiency of 0.6, about 656 kN. The real drawing stress, 277 ÷ 0.6 = 462 MPa, is 68% of the drawn tube's 683 MPa flow stress. That ratio is the reason a single draw is limited: if the drawing stress approached the drawn tube's own flow stress, the tube would stretch and break outside the die instead of being drawn through it. Reductions in one pass are therefore kept to about 30 to 45% of area, and heavier reductions are done in several passes with anneals between them.

### Fitting K and n

The builder's laboratory fits K and n to each heat's test in a few minutes. It converts several points on the engineering curve between about 2% strain and the maximum load to true stress and strain, plots them on log-log axes, where a power law is a straight line, and reads n as the slope and K as the true stress at a true strain of 1. A quick check uses the maximum load alone, as above: n equals the true strain there, and K follows from the true stress. If the two methods disagree badly, the material does not follow a power law well, and the measured curve should be used directly.

## The error: true stress at fracture from the gauge length

A forming engineer wanted the true fracture stress of the rod steel to compare with the stresses in a rolled thread root. The engineer entered the fracture load of 38.5 kN and the final gauge length of 59.6 mm in the true stress tool, with the current area left at 0 so the tool would assume constant volume. The tool returned a true stress of 584.3 MPa.

That number is wrong by almost half. The tool's own warning says it: constant volume gives the right area only before necking. After the maximum load, nearly all further deformation is in the neck. The gauge length as a whole hardly changes, while the neck's area falls from 70.8 mm² to 36.3 mm². Using the gauge length, the tool assumed an area of 65.9 mm², nearly twice the real one.

With the measured neck diameter of 6.8 mm entered as the current area, 36.32 mm², the tool gives a true fracture stress of 1,060 MPa, the same as the tensile test evaluation tool's figure in Chapter 2. The forming engineer caught the error by comparing the tool's reduction of area, 16.1%, with the 53.8% measured on the broken specimen: a difference that large meant the areas could not both be right.

```figure
type: compare
title: Two ways of finding the area at fracture
cols: Area used, mm² | True stress at fracture, MPa | Reduction of area
rowhead: Method
- Constant volume from the final gauge length | 65.9 | 584.3 | 16.1%
- * Measured at the neck | 36.32 | 1,060 | 53.8%
caption: This is an illustration. True stress and strain tool, 38.5 kN at fracture. The tool's true strain is from the gauge length in both cases, 0.176; the true strain in the neck, ln(78.54 ÷ 36.32) = 0.771, is far larger.
```

There is a further subtlety. The neck of a tensile bar carries a triaxial stress: its curved profile adds radial and hoop tension in the middle. The average axial stress at fracture, 1,060 MPa, is therefore higher than the flow stress of the metal at that strain. The flow curve gives 876 MPa at a true strain of 0.771, and the ratio of 1.21 is about the size that corrections for the neck's shape, such as Bridgman's, usually give. For forming calculations, the flow curve is the right number to use.

## Cold drawing the barrel

The HC-63's barrel starts as a hot-finished seamless tube, 90 mm outside diameter with a 9 mm wall, and is cold drawn in one pass over a plug to 76 mm with a 6.5 mm wall. The cross-section falls from 2,290 mm² to 1,419 mm², a reduction of 38%, and the true strain is ln(2,290 ÷ 1,419) = 0.479. This is an illustration.

The barrel steel, a lower-carbon steel than the rod's, has a flow curve of roughly K = 780 MPa and n = 0.18 in the hot-finished condition, according to the tube maker's data. At a true strain of 0.479, that curve gives a flow stress of 683 MPa. Immediately after drawing, the tube's yield strength is close to that figure, its elongation is small and it carries residual stresses from the draw.

```figure
type: bars
title: Barrel steel flow stress along its flow curve, K = 780 MPa, n = 0.18
unit: MPa
caption: This is an illustration. The as-drawn tube, at a true strain of 0.479, has a yield strength near 683 MPa. Stress relieving brings it down to the 520 MPa on the mill certificate and restores some elongation.
- 0.002 (power law, overstated) | 255
- 0.05 | 455
- 0.2 | 584
- * 0.479, as drawn | 683
- Certificate after stress relief | 520
```

The tube is then stress relieved, at a temperature well below that at which the steel would recrystallise. Dislocations rearrange into lower-energy patterns, residual stresses fall, and the yield strength drops back, to 520 MPa on the certificate, while the elongation recovers to about 14%. That combination, high yield with adequate ductility and low residual stress, is why cold-drawn and stress-relieved tube is used for hydraulic barrels: it can be honed to a precise bore without moving.

### Hot and cold working

The hot-finished tube the barrel starts from was formed at a red heat, where the steel behaves very differently. Above about half its absolute melting temperature, dislocations can climb out of their slip planes and the grains recrystallise as fast as they are deformed, so the metal hardly work hardens at all. Its flow stress is low, but it depends strongly on the rate of deformation, and a power law in strain no longer describes it. That is why hot working takes large reductions with modest forces, and why the hot-finished tube has a coarse surface and loose tolerances that only cold drawing can tighten. Cold working, by contrast, hardens the metal with every pass, gives a fine surface and accurate sizes, and stores the residual stresses and work hardening that the stress relief then partly removes. The HC-63's barrel needs both: the hot process to make a tube cheaply, and the cold one to make it precise and strong.

## Two more effects of plastic flow

### Bauschinger effect

A metal that has been stretched plastically and is then compressed yields in compression at a lower stress than it would have done fresh. This is the Bauschinger effect. The dislocation tangles built up in one direction push back when the load is reversed, helping dislocations move the other way. It matters wherever a part is plastically loaded one way and then the other: straightening bent bars, reversing bends, autofrettage of thick tubes (Chapter 6), and cyclic plasticity in low-cycle fatigue. A straightened shaft or rod has a lower compressive yield strength at its straightened zone than the certificate suggests.

### Strain ageing

In carbon steels, dissolved carbon and nitrogen atoms gather at the dislocations created by cold work and pin them again, over days at room temperature or minutes at a few hundred degrees. The yield strength rises, the yield point returns, and the ductility falls. A cold-bent bracket that is later hot-dip galvanised, at about 450 °C, can be strain aged in its bend and become brittle there; guidance on galvanising cold-formed steel addresses this with limits on bend radii and with stress relief where needed. The HC-63's brackets are painted, not galvanised, but the bracket drawing still sets a minimum bend radius (Chapter 7) partly for this reason.

## Exercise: a second draw

The tube maker offers a thinner barrel for a lighter cylinder, drawn in a second pass from the 76 × 6.5 mm tube to 74 × 5.5 mm before stress relief. Find the second pass's true strain, the total true strain from the hot-finished tube, and the flow stress on the barrel steel's curve at that total strain. Why can true strains be added here when engineering reductions cannot?

**Worked answer.** The 74 × 5.5 mm tube's area is π ÷ 4 × (74² − 63²) = 1,184 mm². The second pass's true strain is ln(1,419 ÷ 1,184) = 0.181, and the total is 0.479 + 0.181 = 0.660, the same as ln(2,290 ÷ 1,184). The flow stress is 780 × 0.660^0.18 = 724 MPa.

The reductions in area were 38% and then 17%, which do not add to the total reduction of 48%; the second percentage is taken on a smaller starting area. True strains are logarithms of ratios, and the logarithm of a product is the sum of the logarithms, so successive true strains add exactly. That is why forming engineers track true strain through multi-step processes.
