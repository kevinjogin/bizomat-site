---
book: strain-gauges-and-load-cells-by-the-numbers
chapterSlug: stress-strain-and-why-steel-springs-back
order: 1
title: "Stress, strain and why steel springs back"
description: "Why a metal behaves as a spring, how stress, strain, Young's modulus and Poisson's ratio are related, and why a load cell concentrates strain into a small spring element."
draft: false
---

Every load cell, force sensor and torque transducer in this book measures one thing: how much a piece of metal stretches. The metal is chosen and shaped so that the stretch is proportional to the load, returns to zero when the load is removed, and is large enough to measure but far too small to see. Under a full batch, the steel at the heart of each of BH-2's load cells stretches by about six parts in ten thousand. Understanding why it does so reliably, and what makes it stop doing so, is the foundation for everything else.

This chapter explains elasticity from the atoms up: why a solid resists being stretched, how stress and strain are defined and related, why the sideways shrinkage called Poisson's ratio matters to a gauge, and why real metals yield at a small fraction of the stress their bonds could carry. It then works the strain in BH-2's support stand and in its load cells, and ends with a mill that tried to weigh a bin by gauging its legs.

## Atoms, bonds and stiffness

A metal is a regular array of atoms held at a fixed spacing by a balance of forces. The positively charged ions are held together by a sea of shared electrons that attracts them towards each other, while at short range the ions' inner electron shells repel each other strongly. The atoms sit where the attraction and repulsion balance, at the bottom of an energy well. In iron that spacing is about a quarter of a nanometre.

Pull on the metal and every atom is drawn slightly away from its neighbours, up one side of its energy well. For a small displacement the restoring force is proportional to the displacement, exactly like a spring, because near the bottom of any smooth well the energy curve is close to a parabola. Release the load and the atoms fall back to the bottom of their wells: the metal springs back. This is the physical basis of Hooke's law, and the stiffness of a metal, its Young's modulus, is in effect the stiffness of its interatomic bonds multiplied by how many of them there are per unit area.

Two consequences matter to anyone measuring with strain. First, the modulus is a property of the bonds and the crystal structure, so it varies little between steels: plain carbon steel, alloy steel and tool steel all have a Young's modulus of about 200 GPa, whatever their strength. Heat treatment changes how far steel can be stretched before it yields, not how stiff it is. Aluminium alloys are about a third as stiff, around 70 GPa. Second, the well is not perfectly symmetrical: it is steeper on the compressed side than on the stretched side. As atoms vibrate more strongly at higher temperature they spend more time on the gentle side, so the average spacing grows. That is thermal expansion, and Chapter 3 shows it is the main source of error in strain measurement.

## Stress, strain and Hooke's law

Engineers describe load and stretch per unit size, so that results apply to any size of part. Stress is force per unit area, in megapascals (MPa, or N/mm²). Strain is change in length per unit length, a pure number. Strains in steel parts are small, so they are usually written in microstrain (µε), millionths: 1,000 µε is a stretch of 1 mm per metre, or 0.1%.

```figure
type: formula
title: Stress, strain and the elastic constants
formula: σ = F ÷ A
formula: ε = ΔL ÷ L = σ ÷ E
formula: ε_transverse = −ν × ε
formula: G = E ÷ (2 × (1 + ν))
caption: σ is stress (MPa), F force (N), A cross-section area (mm²), ε strain, L length, E Young's modulus (MPa), ν Poisson's ratio and G the shear modulus. For steel, E ≈ 200,000 MPa and ν ≈ 0.30 give G ≈ 76,900 MPa. These relations hold only in the elastic range, below the yield stress.
- σ | stress, MPa
- ε | strain; 1 µε = 0.000001
- E | Young's modulus, MPa
- ν | Poisson's ratio
- G | shear modulus, MPa
```

When a bar is stretched it also becomes thinner. The ratio of the sideways shrinkage to the lengthwise stretch is Poisson's ratio, about 0.3 for metals. It matters twice in this book. A gauge laid across a bar under tension reads a negative strain about 0.3 times the lengthwise one, which load cell makers use to add signal (Chapter 5). And a wire that is stretched also gets thinner, which raises its resistance by more than its extra length alone would (Chapter 2).

Shear is the other kind of deformation: layers of the material slide past each other, measured as an angle, the shear strain γ, related to the shear stress τ by the shear modulus G. Chapter 6 shows that pure shear is the same thing as equal tension and compression at 45°, which is how a shear beam load cell measures it.

## The elastic limit and dislocations

If the bonds were the only limit, a metal would shear when one plane of atoms was pushed about a quarter of an atomic spacing over its neighbour. A simple estimate made by Frenkel in 1926 puts the shear stress needed at about G divided by 2π: for steel, with G of 76,900 MPa, about 12,200 MPa. Real steels yield in shear at a few hundred megapascals, and pure annealed metals at far less. The difference is due to dislocations, line defects in the crystal along which a plane of atoms can slip a little at a time, like a ruck moved along a carpet, so that only a few bonds break at any moment.

For measurement this has three practical consequences.

1. The elastic range is limited by dislocations, not by bond strength, so a load cell's spring element is made from a steel in which dislocations are pinned by alloying and heat treatment: high-strength tool steels, precipitation-hardened stainless steels or high-strength aluminium alloys.
2. Even below the yield stress, a few dislocations move a tiny amount under load and do not all move back. That shows up as hysteresis (a different reading on loading and unloading) and creep (a reading that drifts while a load stays on). Good spring materials and correct heat treatment keep these to a few hundredths of a per cent.
3. Load cells are therefore designed to work at a strain of about 1,000 µε at their rated load, which in steel is a stress of about 200 MPa, well under half the yield stress of the steels used. That margin gives a safe overload, a long fatigue life and small creep.

```figure
type: compare
title: Where a load cell works on the stress–strain curve
cols: Stress in steel | Strain | Meaning
rowhead: Point
- Frenkel's ideal shear strength | about 12,200 MPa in shear | about 159,000 µε in shear | What perfect bonds could carry; never reached
- Yield of a load cell steel | 900–1,200 MPa | 4,500–6,000 µε | Permanent set begins; the cell is ruined
- * Rated load of a typical cell | about 200 MPa | about 1,000 µε | Design point: linear, small creep, long life
- BH-2 stand legs at a full batch | 6.3 MPa | 31 µε | Far too small a strain to weigh with
caption: This is an illustration. Yield values are typical ranges for high-strength steels used in spring elements; check the cell maker's data. The ideal shear strain is 1 ÷ 2π of a radian.
```

## The case: strain in the stand and in the cell

BH-2 weighs 1,150 kg empty and carries batches of up to 2,500 kg, so at the end of a fill the three load cells and their stands carry 3,650 kg between them, about 1,216.7 kg each if the hopper is level and the load is shared evenly. Each stand is a 100 × 100 × 5 mm square hollow section, 2,400 mm tall. Ignoring the rounded corners, its cross-section area is 4 × 100 × 5 − 4 × 5² = 1,900 mm².

The [axial stress tool](/tools/axial-stress/) works out the nominal stress, strain and change in length of a uniform member under a concentric axial force from the force, area, length and Young's modulus. For one stand at a full batch, a force of −11,931 N (1,216.7 kg × 9.80665 m/s², negative for compression), 1,900 mm², 2,400 mm and 200,000 MPa:

```figure
type: steps
title: One BH-2 stand leg under a full batch
caption: This is an illustration. Results from the axial stress tool. The tool assumes a uniform member under a concentric static load; it does not check buckling or connections.
- Force on one leg, 1,216.7 kg × 9.80665 | 11,931 N compression
- Stress, 11,931 ÷ 1,900 | 6.28 MPa
- Strain, 6.28 ÷ 200,000 | 31.4 µε
- * Shortening of the 2,400 mm leg | 0.075 mm
- Elastic energy stored | 0.45 J
```

The stand barely notices the batch. Its strain at full load is 31 µε, of which only 21.5 µε comes from the 833 kg of ingredients each leg carries; the rest is the hopper's own weight. A strain gauge could read it, but every source of error in the following chapters, temperature above all, is of the order of a few microstrain, so a stand leg makes a poor weighing element.

The load cell does the opposite. Its spring element is sized so that the rated 2,000 kg produces about 1,000 µε at the gauges, so a full batch, 1,216.7 kg per cell, produces about 608 µε: nearly 20 times the leg's strain from the same force. Concentrating strain in a small, well-defined piece of good steel is the whole purpose of a load cell.

```figure
type: bars
title: Strain from the same 1,216.7 kg in the stand and in the load cell
x: Where the strain is measured
y: Strain, µε
caption: This is an illustration. Stand leg from the axial stress tool; load cell at 1,216.7 ÷ 2,000 of its 1,000 µε design strain at rated load (Chapter 5 works the spring element in detail).
- Stand leg, ingredients only | 21.5
- Stand leg, full batch | 31.4
- * Load cell spring element, full batch | 608
```

## What a gauge actually sees

A strain gauge is glued to a surface, so it measures strain on that surface and nowhere else. Three facts follow from that, and each catches people out.

First, the gauge reads the average strain under its grid. A typical foil grid is 3 to 6 mm long. Where the strain changes quickly, near a hole, a fillet or a weld toe, the gauge averages a peak with its surroundings and reads low. Where the strain is uniform, as in a carefully shaped spring element, the grid length hardly matters. Load cell designers put the gauges where strain is high and even; people gauging a structure to find its peak stress must use short grids and place them with care.

Second, the gauge reads strain, not stress. Converting a strain into a stress needs the modulus, and for a surface with stress in two directions it needs Poisson's ratio as well (Chapter 6). Young's modulus for a particular steel is known to within a few per cent, so a stress worked out from a gauge reading carries that uncertainty too. A load cell avoids the problem altogether: it is calibrated against known loads, so its output is related to force directly and the modulus never enters the calculation.

Third, the gauge reads the change in strain since it was bonded, not the absolute strain. Any stress already in the part, from its own weight, from fabrication or from residual stresses left by welding or machining, is invisible. A gauge glued to BH-2's stand leg with the hopper already in place would read zero, not the 9.9 µε of the hopper's own weight. That is why load cells are fitted and zeroed before the vessel is loaded, and why strain surveys of existing structures report changes in strain under a known change in load.

```figure
type: compare
title: What a bonded gauge reports and what it misses
cols: Reported | Missed or distorted | Consequence
rowhead: Situation
- Uniform strain, as in a spring element | The true strain | Nothing important | The basis of a good load cell
- Strain peak at a fillet | The average over the grid | The peak itself | Use a short grid, or a model, for peak stress
- Stress in two directions | Strain along the grid only | The stress, until combined with other gauges | Use a rosette (Chapter 6)
- Load already on when bonded | Changes from that moment | The existing strain | Zero before loading, or measure changes only
caption: This is an illustration of the general behaviour of a bonded foil gauge; the grid length and placement for a real survey come from the gauge maker's guidance.
```

## When it goes wrong: weighing a bin by its legs

The mill's second ingredient bin stands on four legs of the same section, and a few years ago someone suggested a cheap way to know how full it was: weld strain gauges to the legs and convert their strain into mass. The arithmetic is straightforward. One microstrain in one leg corresponds to 0.000001 × 200,000 MPa × 1,900 mm² ÷ 9.80665 = 38.7 kg, so the bin's mass is about 38.7 kg times the sum of the four legs' microstrain readings.

The system was fitted and calibrated on a cool, overcast morning, and read within 1% of a known fill. In the afternoon, with the sun on the western legs, it showed the bin gaining more than half a tonne while the discharge was running. The cause was temperature. The gauges' self-temperature compensation (Chapter 3) was matched to steel, but not perfectly to these legs, and the sunny legs were about 15 K warmer than the shaded ones. A residual thermal output of 1 µε per kelvin, which is a good result for a field installation, produced 15 µε on each sunny leg: 15 × 38.7 = 581 kg on one leg alone.

```figure
type: checklist
title: What the bin-leg trial showed
caption: This is an illustration. The mill kept the gauges as a rough level indication, recorded with a note of its limits, and bought load cells for any bin used for batching.
- x Strain per kilogram in a stiff structural leg is tiny: 38.7 kg per µε here
- x Temperature differences between legs give several µε each, hundreds of kilograms
- x Wind, bolt slip and the bin's own thermal growth add more
- x Leg gauging can indicate a level to a few per cent with careful compensation, not weigh a batch
- ? Any future inventory system to be checked against deliveries for a month before it is trusted
```

Systems that weigh silos by gauging their legs do exist and are useful for stock-keeping, but they work to a few per cent, need careful temperature compensation and site calibration, and are no substitute for load cells where a batch must be weighed. The Library's [Bulk Solids Flow by the Numbers](/reados/publications/bulk-solids-flow-by-the-numbers/) explains why loads on silo supports also shift as material arches and collapses.

## Exercise: a tension link

The mill hangs a 10 t (10,000 kg) maximum lifting load from a tension link made of a 40 mm diameter steel bar, and wants to fit strain gauges to it as a load monitor.

1. What are the stress and strain in the bar at 10 t?
2. What does a gauge laid across the bar read at 10 t?
3. What diameter would give 1,000 µε at 10 t, the strain a load cell maker would design for?

**Answer.** The force is 10,000 × 9.80665 = 98,067 N and the area π × 20² = 1,256.6 mm².

1. Stress = 98,067 ÷ 1,256.6 = 78.0 MPa. Strain = 78.0 ÷ 200,000 = 390 µε. The [axial stress tool](/tools/axial-stress/) gives the same with these inputs.
2. The transverse gauge reads −0.30 × 390 = −117 µε: the bar gets thinner as it stretches.
3. For 1,000 µε the stress must be 200 MPa, so the area must be 98,067 ÷ 200 = 490 mm², a diameter of √(4 × 490.3 ÷ π) = 25.0 mm. The full 40 mm bar is only needed at the ends, where it is pinned; the gauged section can be turned down to 25 mm, as long as the reduced section's fatigue and overload strength is checked and the change of section is well radiused. That is exactly how a tension load cell is made.
