---
book: fine-particles-by-the-numbers
chapterSlug: slip-and-the-mean-free-path
order: 3
title: "Slip: when air stops being a continuous fluid"
description: "Calculate the mean free path of air, the Knudsen number and the Cunningham slip correction for LX-3's fume, and see how much faster small particles settle and diffuse than Stokes' law predicts."
draft: false
---

Stokes' law treats air as a smooth, continuous fluid. To a 10 µm particle it is: the air molecules are so small and so close together, compared with the particle, that their individual collisions blur into a steady viscous drag. To a 0.1 µm fume particle the picture changes. The particle is now comparable in size to the average distance an air molecule travels between collisions, and the air begins to behave less like syrup and more like a hail of separate molecules. The particle "slips" between them and feels less drag than Stokes' law predicts.

This chapter calculates the mean free path of air, uses it to find the Knudsen number for LX-3's particles, applies the Cunningham slip correction with Davies's coefficients, and recalculates settling velocities with it. The failure case is an enclosure door delay justified by a slip-corrected settling calculation that still could not clear the fume.

## The mean free path of air

Air molecules move fast, a few hundred metres a second, and collide with each other constantly. The average distance a molecule travels between collisions is the **mean free path**, λ. Kinetic theory relates it to the gas's viscosity, pressure and temperature. A common form is **λ = (μ ÷ p) × √(π R T ÷ (2M))**, where μ is the viscosity, p the pressure, R the gas constant, T the absolute temperature and M the molar mass of air.

```figure
type: formula
title: Mean free path of LX-3's air
formula: λ = (μ ÷ p) × √(π R T ÷ (2M))
caption: This is an illustration for air at 20 °C and standard atmospheric pressure. The result, about 0.065 µm, agrees with values commonly quoted for air at room conditions.
- Viscosity, μ | 1.81 × 10⁻⁵ Pa·s
- Pressure, p | 101,325 Pa
- Gas constant R and temperature T | 8.314 J/(mol·K) and 293.15 K
- Molar mass of air, M | 0.02897 kg/mol
- Mean free path, λ | about 6.49 × 10⁻⁸ m, or 0.065 µm
```

The mean free path is inversely proportional to pressure. At half an atmosphere it doubles; in a vacuum chamber it can be centimetres or metres. That is why slip matters enormously for particles in vacuum processes and at high altitude, and modestly for fume at sea level.

## The Knudsen number

The ratio that decides how "continuous" the air looks to a particle is the **Knudsen number**, Kn = 2λ ÷ d, the mean free path compared with the particle's radius. When Kn is small, below about 0.1, the air behaves as a continuum and Stokes' law holds. When Kn is large, above about 10, the particle is in the **free-molecular** regime and feels individual molecular impacts. Between the two is a transition regime.

For LX-3's particles, with λ ≈ 0.0649 µm:

- a 10 µm particle has Kn ≈ **0.013**, firmly continuum;
- a 1 µm particle has Kn ≈ **0.13**, at the edge;
- a 0.1 µm particle has Kn ≈ **1.3**, in the transition regime;
- a 0.01 µm primary fume particle has Kn ≈ **13**, free-molecular.

LX-3's fume therefore spans all three regimes. The physics of its smallest particles is closer to the kinetic theory of gases than to the fluid mechanics of Stokes.

## The Cunningham slip correction

Ebenezer Cunningham proposed in 1910 a correction factor to Stokes' law for particles small enough to slip. The drag is divided by a factor C_c, the **slip correction factor**, so the particle settles C_c times faster and, as Chapter 5 shows, diffuses C_c times faster than Stokes' law alone predicts. The empirical form widely used today fits C_c across all regimes with three coefficients. For air, Davies in 1945 gave **C_c = 1 + (2λ ÷ d) × (1.257 + 0.400 exp(−0.55 d ÷ λ))**.

```figure
type: compare
title: Slip correction for LX-3's particles in air at 20 °C
cols: Knudsen number | Slip correction C_c | What it means
caption: This is an illustration using λ ≈ 0.0649 µm and Davies's coefficients. Above about 3 µm the correction is under 6% and usually ignored; below about 0.3 µm it dominates.
- 10 µm | 0.013 | 1.016 | Stokes' law is within 2%
- 3 µm | 0.043 | 1.054 | about 5% faster than Stokes
- 1 µm | 0.13 | 1.163 | about 16% faster
- 0.3 µm | 0.43 | 1.557 | over half as fast again
- *0.1 µm | 1.3 | 2.854 | nearly three times as fast
- 0.05 µm | 2.6 | 4.943 | five times as fast
- 0.01 µm | 13 | 22.09 | twenty-two times as fast
```

The correction grows rapidly as particles get smaller. In the free-molecular limit, where Kn is large, C_c becomes roughly proportional to 1 ÷ d, so the drag stops depending on d in the Stokes way and instead depends on the particle's cross-section and the rate at which molecules strike it.

### A quick approximation

For particles larger than about 0.3 µm, the exponential term in Davies's formula becomes very small, because d ÷ λ is large, and dropping it leaves a simpler form that is often used: **C_c ≈ 1 + 2 × 1.257 × λ ÷ d = 1 + 2.514 λ ÷ d**. It gives **1.163** for 1 µm, identical to the full formula, and **1.544** for 0.3 µm, under 1% low. At 0.1 µm it gives **2.632** against the full formula's 2.854, about 8% low, and it gets worse as particles get smaller. The quick form is fine for coarse dust and the upper end of the fume range; for anything below about 0.3 µm, the full formula is used. A spreadsheet makes the difference irrelevant: once the full formula is in a cell, it costs nothing to use everywhere.

### Slip for chains of particles

LX-3's fume is not a collection of separate spheres. The primary particles, a few hundredths of a micrometre across, collide and stick within milliseconds of forming, building loose, branched chains that may contain tens or hundreds of primaries and stretch to a micrometre or more. Such a chain is mostly empty space. Its drag is far less than that of a solid sphere of its overall size, and its slip behaviour is closer to that of its primary particles than to its outline.

For calculation, a chain is usually described by a **mobility diameter**: the diameter of a sphere that has the same drag, including slip, at the same velocity. Instruments that size fume by its drag in an electric field measure exactly this diameter. The mobility diameter of a fume chain is typically smaller than its longest dimension and larger than its primaries, and it is the right diameter to use for diffusion and slip calculations. For settling, the mass that the drag must support matters as well, so a chain's aerodynamic diameter can be very different from its mobility diameter. For LX-3's design calculations, the fume is represented by mobility-equivalent spheres between 0.05 and 1 µm; the figures in this book use those equivalent sizes.

## Settling with slip

The slip-corrected settling velocity is simply the Stokes velocity multiplied by C_c: **v_s = ρp g d² C_c ÷ (18 μ)**. For the fume, this changes the numbers of Chapter 2 substantially but not the conclusion.

```figure
type: bars
title: Settling velocity of LX-3's fume, with and without slip
unit: µm/s
max: 25
caption: This is an illustration for 5,000 kg/m³ oxide. Slip nearly triples the settling velocity of a 0.1 µm particle and adds over half again for 0.3 µm, but both remain a few micrometres a second, far slower than any air current in a workshop.
- 0.1 µm, Stokes only | 1.51
- 0.1 µm, with slip | 4.30
- 0.3 µm, Stokes only | 13.6
- *0.3 µm, with slip | 21.1
```

With slip, a 0.1 µm particle takes about four days rather than eleven to settle 1.5 m in perfectly still air; a 0.3 µm particle takes about **20 hours** rather than 31. Both are irrelevant in a working shop, where air movement keeps fume suspended. Slip matters far more for diffusion, which Chapter 5 shows controls how fume is captured, and for the instruments that size fume by its mobility, which Chapter 8 describes.

## Slip in every later calculation

The slip correction is not only a settling correction. Wherever Stokes' drag appears, slip divides it, and every quantity that depends on drag changes with it:

- **settling velocity** is multiplied by C_c, as above;
- **relaxation time**, the time a particle takes to adjust to a change in the air's velocity, is multiplied by C_c (Chapter 4);
- **stopping distance** and the **Stokes number**, which decide impaction on bends and fibres, are multiplied by C_c (Chapter 4);
- the **diffusion coefficient**, which governs Brownian motion, is multiplied by C_c (Chapter 5);
- the **electrical mobility**, the speed a charged particle gains in an electric field, which electrostatic precipitators and mobility sizers rely on, is multiplied by C_c (Chapter 8).

LX-3's design spreadsheet therefore calculates C_c once, in its own column, for every particle size in the analysis, and every later column refers to it. Building it in once is safer than remembering it each time; the most common slip error is not a wrong coefficient but a formula that forgot to include C_c at all.

### Checking a published value

Handbooks and papers sometimes quote slip corrections calculated with different mean free paths or different coefficient sets, and the differences are a few per cent at 0.1 µm. When a quoted value is used, the designer checks it against the formula with the stated λ, so that one set of assumptions runs through the whole calculation. A slip correction of 2.9 from one source and a diffusion coefficient calculated with 2.8 from another will not cause a failure, but they make a calculation harder to check, and a calculation that cannot be checked is not trusted.

## Where slip came from

Slip was not an academic curiosity. In the early twentieth century, measurements of the electron's charge relied on timing tiny charged oil droplets falling in air between the plates of a capacitor, and the droplets' velocities were related to their size and the forces on them through Stokes' law. Droplets of about a micrometre fell faster than Stokes predicted, and the discrepancy had to be corrected before the charge came out right. Cunningham's correction, and later refinements of its coefficients, grew out of exactly that problem. The same correction now underpins the sizing of nanoparticles, the testing of filters and the design of sampling instruments.

## Temperature and pressure

Because the mean free path depends on pressure and temperature, so does the slip correction. Two practical cases arise in extraction work:

- **Hot fume** at the kerf has a longer mean free path, because both viscosity and temperature rise, so slip is larger near the source than in the duct. Calculations for the extraction system use the duct and filter conditions, where the air has cooled and mixed with room air.
- **Low pressure**, in vacuum furnaces, sputtering chambers or at altitude, lengthens the mean free path in proportion. At 50 kPa, λ is about **0.13 µm** and the slip correction for a 0.1 µm particle rises from about 2.85 to about **5.0**.

For LX-3, at room temperature and atmospheric pressure in the duct, the values in this chapter apply.

## A failure case: waiting for fume to settle

This is an illustration. On an earlier enclosed laser cell, the safety review asked how long operators should wait after cutting before opening the enclosure door. The designer calculated a slip-corrected settling velocity for 0.3 µm fume, noted that slip made it about 1.5 times faster than Stokes' law, and proposed a 10-minute door delay "to let the fume settle".

The figures did not support the proposal. Even with slip, 0.3 µm fume settles 1.5 m in about 20 hours, so after 10 minutes almost none of it had settled; and in any case, settling would only move fume to the enclosure floor, where opening the door would stir it up again. The detection came during commissioning, when the hygienist's particle counter at the door opening recorded a burst of sub-micron particles each time the door opened after the delay.

The correction replaced settling with purging. With the enclosure's 12 m³ volume and the extraction's 0.60 m³/s, the air in the enclosure is replaced on average every **12 ÷ 0.60 = 20 s**. Assuming good mixing, the fume concentration falls by a factor of e every 20 s, so a 99% reduction takes about **20 × ln 100 ≈ 92 s** and 99.9% about **138 s**. The door interlock was set to a purge time based on that calculation and then confirmed with the particle counter. The lesson was not that the slip calculation was wrong, but that settling was the wrong mechanism to rely on for fume.

## How this applies to a small Australian business

Calculate the mean free path for the conditions the particles are actually in, and use the Knudsen number to judge whether slip matters. Apply the Cunningham correction with published coefficients for any particle below about 3 µm. Expect sub-micron fume to settle a few times faster than Stokes' law predicts, and still far too slowly to matter in a workshop. Remove fume by extraction and purging, not by waiting for it to settle, and size purge times from the volume and the extraction flow, then confirm them by measurement.

## Exercise: a smaller fume particle

For a 0.05 µm oxide particle at 5,000 kg/m³ in LX-3's air, what is its Knudsen number, its slip correction and its slip-corrected settling velocity? How long would it take to settle 1.5 m in still air?

**Worked answer.** The Knudsen number is **2 × 0.0649 ÷ 0.05 ≈ 2.6**. The slip correction is **1 + 2.6 × (1.257 + 0.400 × exp(−0.55 × 0.05 ÷ 0.0649)) ≈ 4.94**. The Stokes velocity is **5,000 × 9.81 × (0.05 × 10⁻⁶)² ÷ (18 × 1.81 × 10⁻⁵) ≈ 3.76 × 10⁻⁷ m/s**, so with slip the settling velocity is about **4.94 × 3.76 × 10⁻⁷ ≈ 1.86 × 10⁻⁶ m/s**. Settling 1.5 m would take about **1.5 ÷ 1.86 × 10⁻⁶ ≈ 806,000 s**, more than nine days.
