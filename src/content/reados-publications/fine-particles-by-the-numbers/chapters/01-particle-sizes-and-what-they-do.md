---
book: fine-particles-by-the-numbers
chapterSlug: particle-sizes-and-what-they-do
order: 1
title: "Particle sizes and what they do"
description: "Sort LX-3's spatter, dust and fume by size, see why counting and weighing particles give opposite pictures, and use aerodynamic diameter to compare particles of different densities."
draft: false
---

Ask what a machine "makes" in the air and most people describe what they can see: sparks, a cloud of grinding dust, a haze over the welding bay. The particles that matter most for an extraction system are often the ones nobody can see. A laser cutting stainless steel throws visible spatter that falls within a metre, and at the same time releases fume particles a thousand times smaller that stay in the air for hours and pass straight through a filter chosen for dust. Before calculating anything, the designer has to know which particles are present, how big they are and which measure of "how much" is being used.

This chapter sorts LX-3's particles into families by size, shows why a count of particles, a measure of their surface and a weighing of their mass give opposite pictures of the same air, and introduces the aerodynamic diameter, which lets particles of different densities be compared on one scale. The failure case is an extractor chosen for "5 µm dust" that let laser fume straight back into the workshop.

## A thousandfold range

Engineers usually think in millimetres. Particles are measured in micrometres, thousandths of a millimetre, written µm. The particles a machine shop produces span about four orders of magnitude, from about 0.01 µm to about 100 µm, and their behaviour changes completely across that range.

```figure
type: compare
title: LX-3's three particle families
cols: Typical size | How it forms | How it behaves in air
caption: This is an illustration for a fibre laser cutting steel sheet. The boundaries are approximate; each family has a spread of sizes, and fume particles often join into loose chains whose overall size is larger than the primary particles.
- Spatter and dross | 30 µm to over 100 µm | molten metal blown from the kerf | falls or flies ballistically; hits the slats and plenum walls
- Coarse dust | about 1 to 30 µm | slag, scale and oxide broken from edges and slats | settles over seconds to minutes; follows strong air currents
- *Fume | about 0.01 to 1 µm | metal vapour that condenses and oxidises as it cools | follows the air almost perfectly; diffuses; settles over hours to days
```

The 1967 lecture notes that informed this book open with a demonstration of carmine particles about 2 µm across, jiggling in water under a microscope, the smaller ones more lively than the larger. That liveliness, Brownian motion, is real in air too, and it is the dominant way the smallest fume particles move relative to the air around them. Chapter 5 calculates it.

## Number, surface and mass

Three different measures describe "how much" particulate there is in a volume of air, and they weight particle sizes very differently:

- **number concentration**, particles per cubic metre or per cubic centimetre, counts each particle once regardless of size;
- **surface concentration**, square metres of particle surface per cubic metre, weights each particle by its diameter squared;
- **mass concentration**, milligrams per cubic metre, weights each particle by its diameter cubed.

A particle's mass is its density times its volume, ρ × π d³ ÷ 6. With LX-3's fume density of 5,000 kg/m³, one 0.1 µm particle has a mass of about **2.62 × 10⁻¹⁸ kg**, and one 10 µm particle about **2.62 × 10⁻¹² kg**: a million times more, because its diameter is a hundred times larger and mass goes with the cube.

```figure
type: compare
title: One million 0.1 µm fume particles beside ten 10 µm dust particles
cols: Number | Total surface | Total mass
caption: This is an illustration with both families at 5,000 kg/m³. The fume outnumbers the dust 100,000 to one and has ten times its surface area, yet the ten dust particles weigh ten times as much. Which family "dominates" depends entirely on what is measured.
- *Fume, 0.1 µm | 1,000,000 | about 3.14 × 10⁻⁸ m² | about 2.62 × 10⁻¹² kg
- Dust, 10 µm | 10 | about 3.14 × 10⁻⁹ m² | about 2.62 × 10⁻¹¹ kg
- Ratio, fume to dust | 100,000 : 1 | 10 : 1 | 1 : 10
```

This matters in three practical ways. First, workplace exposure standards for airborne contaminants are expressed mostly as **mass** concentrations, so a gravimetric sample that weighs what was collected is the regulatory measure. Second, many health effects of fine fume are thought to relate to particle **number** and **surface**, which a mass measurement barely registers, so a sample can show a low mass while the air is full of particles. Third, filters and extraction systems are often specified by a single "efficiency" without saying on which basis; a filter that captures 99% of the mass of a dusty airstream may capture far less than 99% of the number of fume particles in it, because the coarse dust carries most of the mass and is the easiest to catch.

### What a number concentration means

Fume concentrations are often quoted in particles per cubic centimetre. One thousand particles per cubic centimetre is a billion, **10⁹**, per cubic metre. At 0.1 µm and 5,000 kg/m³, a billion particles weigh about **2.62 × 10⁻⁹ kg**, which is about **0.0026 mg**. A cubic metre of air holding a thousand fume particles in every cubic centimetre therefore carries only about 0.0026 mg/m³ of them by mass: invisible to a scale, clearly visible to a particle counter. Near the cutting head, before extraction, fume concentrations can be many thousands of times higher.

## Size distributions

No process makes particles of one size. A cloud of fume has a spread of sizes, usually close to **lognormal**: the logarithms of the diameters follow a bell curve. Two numbers describe it: the **geometric mean** or **median** diameter, and the **geometric standard deviation**, σg, a ratio rather than a length. A σg of 1.8 means that about two-thirds of the particles lie between the median divided by 1.8 and the median multiplied by 1.8.

Because number, surface and mass weight sizes differently, the same cloud has a different median on each basis. For a lognormal distribution these medians are linked by the Hatch–Choate relations: the surface median is the count median times exp(2 ln² σg), and the mass median is the count median times exp(3 ln² σg).

```figure
type: formula
title: Count and mass medians of LX-3's fume
formula: mass median diameter = count median diameter × exp(3 × (ln σg)²)
caption: This is an illustration for a lognormal fume with a count median of 0.1 µm and a geometric standard deviation of 1.8. Half the particles by number are smaller than 0.1 µm, but half the mass is in particles larger than about 0.28 µm.
- Count median diameter | 0.10 µm
- Geometric standard deviation, σg | 1.8; (ln 1.8)² ≈ 0.346
- Surface median diameter | 0.10 × exp(2 × 0.346) ≈ 0.20 µm
- Mass median diameter | 0.10 × exp(3 × 0.346) ≈ 0.28 µm
```

The same cloud, described honestly, has a "size" of 0.10 µm, 0.20 µm or 0.28 µm depending on the basis. A filter maker who quotes performance at 0.3 µm, a hygienist who reports a mass median and a researcher who reports a count median may all be describing the same fume. Asking "median by what?" settles most arguments about particle size before they start.

### Where size data comes from

For a new process, size data usually comes from three places: published measurements on similar processes, which exist for most welding and cutting methods; the equipment maker, who may have tested the machine with its own extraction; and measurement on site, with instruments that Chapter 8 describes. Each has limits. Published data may be for a different material, power or gas; maker's data may be for ideal conditions; site data is only as good as the sampling. LX-3's designer used published ranges for fibre laser cutting of steel to set the families above, and planned measurements at commissioning to confirm them.

## Diameters that are not what they seem

A real fume particle is rarely a smooth sphere. It may be a chain of dozens of primary spheres, each a few hundredths of a micrometre across, stuck together into a loose, branched cluster. A dust particle may be a jagged flake. To calculate anything, each particle is given an **equivalent diameter**: the diameter of a sphere that behaves the same way in the respect that matters.

The most useful one for extraction is the **aerodynamic diameter**: the diameter of a sphere of unit density, 1,000 kg/m³, that settles in still air at the same speed as the particle. For compact particles larger than about a micrometre, where the slip correction of Chapter 3 is small, the aerodynamic diameter is approximately the physical diameter times the square root of the particle's density relative to 1,000 kg/m³.

```figure
type: formula
title: Aerodynamic diameter of LX-3's oxide particles
formula: d_a ≈ d × √(ρ_p ÷ 1,000 kg/m³)
caption: This is an illustration for compact spheres at 5,000 kg/m³, ignoring shape and slip. A dense particle behaves aerodynamically like a larger unit-density one, which is why size classes in standards and filter ratings are usually aerodynamic.
- 0.3 µm oxide | 0.3 × √5 ≈ 0.67 µm aerodynamic
- 1 µm oxide | 1 × √5 ≈ 2.24 µm aerodynamic
- 10 µm oxide | 10 × √5 ≈ 22.4 µm aerodynamic
step: A 1 µm metal oxide particle settles like a 2.24 µm water droplet
```

For the smallest fume, settling hardly matters and diffusion dominates, so a different equivalent, the **mobility** or **diffusion** diameter, is the relevant one; Chapter 5 uses it. For now the point is that a particle size quoted without saying which diameter is meant is ambiguous, and a factor of more than two can hide in the difference.

## Size classes in health standards

Occupational hygiene divides airborne particles by where they would deposit if breathed in. The **inhalable** fraction is what enters the nose and mouth; the **respirable** fraction is the part fine enough to reach the gas-exchange region of the lungs. The size conventions are defined in ISO 7708, and the sampling methods used in Australia for inhalable and respirable dust are set out in Australian Standards, among them AS 3640 for inhalable dust and AS 2985 for respirable dust. They are named here by number and scope only.

The practical point for an extraction designer is that LX-3's fume lies entirely in the respirable range, and much of its coarse dust does too. Visible spatter does not. An extraction system judged by whether it "gets the sparks" has been judged on the wrong particles.

## Where LX-3's particles go

With the families defined, the rest of this book follows each through the system:

- **Spatter** flies from the kerf with the assist gas, strikes the slats and plenum walls and falls into the slag trays. Its motion is ballistic; Chapter 4 calculates how far it travels before the air takes over.
- **Coarse dust** is picked up by the downdraught through the table. Some of it settles in the plenum and in the horizontal duct (Chapter 7); most of it is caught in the spark trap and on the surface of the cartridges.
- **Fume** follows the air through the whole system and must be caught by diffusion and interception in the filter media (Chapter 6). Fume that is not captured at the table escapes into the workshop and stays there.

The extraction system's real job is therefore set by the fume, even though the spatter is what people see.

The spatter still matters, for a different reason: it is hot. A glowing droplet of molten steel carried down the duct can reach the filter cartridges still burning and set them alight, which is why LX-3 has a spark trap, a baffled box that slows and turns the airflow so that heavy, hot particles drop out before the filters. The spark trap works precisely because spatter cannot follow a sharp turn in the air, the behaviour Chapter 4 quantifies with the Stokes number. Fume follows the turn without noticing it. One device, two particle families, opposite behaviour: that contrast is the whole subject of this book in miniature.

## A failure case: rated for 5 µm dust

This is an illustration. A shop installed a second-hand dust collector on a new laser cutting machine, reasoning that it had worked well on a sanding bench. Its cartridges were rated by their maker at high efficiency for particles of 5 µm and above, a rating appropriate for wood and paint dust. Nobody asked what size the laser fume was.

Within a week, staff noticed a faint blue haze in the workshop on still afternoons, strongest near the collector's outlet, and a fine grey film on surfaces near it. The detection came from the haze and the film. A hygienist's assessment, with a particle counter at the collector's inlet and outlet, found that the count of particles between 0.3 and 1 µm at the outlet was a large fraction of that at the inlet: the filter was passing most of the fume by number, while capturing nearly all the dust by mass.

The correction was a filter unit designed for metal fume, with cartridges rated for sub-micron particles, a high-efficiency after-filter and a fire-safe spark trap, with the cleaned air discharged outdoors until the new unit had been tested. The shop now asks, for every extraction job, what the particle size distribution of the source is, and which basis, number or mass, a filter's efficiency is quoted on.

### Why the room matters

Fume that escapes capture does not disappear. In a workshop with little air movement, it accumulates over a shift, because fume particles settle so slowly that the room's air is the only thing that removes them, by ventilation to outside or by recirculation through a filter. Chapter 2 shows that a 0.1 µm particle would take days to settle the height of a cutting table. The concentration in the room is set by the balance between what escapes and how fast the room air is changed or cleaned, which makes capture at the source far more effective than general ventilation of the room.

## How this applies to a small Australian business

Before selecting any extraction equipment, find out what particles the process makes and roughly how big they are. Process makers, filter suppliers and published research on similar processes can give size ranges; a hygienist can measure them. Distinguish number, surface and mass, and ask on which basis efficiencies are quoted. Use aerodynamic diameter when comparing particles of different densities. Treat fume as the design case for cutting and welding, because it is the hardest to capture and the easiest to overlook.

## Exercise: equal mass, different numbers

A sample of oxide fume has the same total mass as a sample of 2.5 µm oxide particles. If every fume particle is 0.25 µm, how many fume particles are there for each 2.5 µm particle? How do the two samples compare in total surface area? What is the aerodynamic diameter of a 2.5 µm oxide particle at 5,000 kg/m³?

**Worked answer.** Mass goes with the cube of diameter, so a 2.5 µm particle has **(2.5 ÷ 0.25)³ = 10³ = 1,000** times the mass of a 0.25 µm particle, and equal mass needs **1,000** fume particles for each larger one. Surface goes with the square, so each fume particle has **1 ÷ 10² = 1/100** the surface of the larger one; 1,000 of them have **1,000 ÷ 100 = 10 times** the surface. The aerodynamic diameter of the 2.5 µm particle is about **2.5 × √5 ≈ 5.6 µm**.
