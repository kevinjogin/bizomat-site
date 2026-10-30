---
book: polymer-chains-by-the-numbers
chapterSlug: measuring-chains-and-the-incoming-check
order: 10
title: "Measuring chains and building an incoming check"
description: "Size dissolved coils by dynamic light scattering, compare the methods that measure chains, and combine them into a practical check of resin lots, regrind, cement batches, cleaners and containers."
draft: false
---

Every chapter of this book has ended in a measurement: a molar mass distribution, an intrinsic viscosity, a cement viscosity, a refrigerator test, a solvent screen, a soak test. Each measures something different about the same chains, and each has a cost, a precision and a blind spot. A workshop cannot run all of them on every lot, and does not need to. It needs to know which measurement answers which question, and to build a routine check that catches the likely problems cheaply and calls in the expensive methods only when the cheap ones raise a flag.

This chapter adds one more method, dynamic light scattering, which sizes dissolved coils directly, compares the methods side by side, and assembles them into the workshop's incoming check. It ends with a coil size that came out 38% too small because the instrument was set for water.

## Dynamic light scattering

A dilute polymer solution lit by a laser scatters a little light from every coil. Because the coils are in constant Brownian motion, the scattered light seen by a detector at a fixed angle flickers, and the flicker is faster for small, quickly diffusing coils than for large, slow ones. An instrument called a correlator measures how quickly the flicker loses its memory: the decay rate of the scattered intensity's correlation with itself over time.

Three steps turn that decay rate into a size.

1. **The scattering vector**, q = 4π n sin(θ ÷ 2) ÷ λ, sets the distance scale the measurement probes, from the liquid's refractive index n, the scattering angle θ and the laser's wavelength in vacuum λ.
2. **The diffusion coefficient**, D = Γ ÷ q², follows from the decay rate Γ of the field correlation, which is half the decay rate of the intensity correlation that most instruments record.
3. **The hydrodynamic radius**, R_h = k T ÷ (6 π η D), follows from the Stokes–Einstein equation, the same relation that [Fine Particles by the Numbers](/reados/publications/fine-particles-by-the-numbers/brownian-diffusion/) uses for airborne particles, with η the viscosity of the liquid at the measured temperature.

The hydrodynamic radius is the radius of a hard sphere that would diffuse at the same rate as the coil. A coil is not a hard sphere: water, or solvent, flows partly through its open structure, so its hydrodynamic radius is smaller than its radius of gyration. For flexible coils in a good solvent the ratio R_g ÷ R_h is typically around 1.5, and its value is itself a clue to the shape of the molecules measured.

```figure
type: formula
title: From a light-scattering decay rate to a coil size
formula: q = 4π n sin(θ ÷ 2) ÷ λ     D = Γ ÷ q²     R_h = k T ÷ (6 π η D)
caption: Γ is the field decay rate, half the intensity decay rate most instruments fit. Workshop case: polystyrene in toluene at 25 °C, laser 632.8 nm, angle 90°, teaching refractive index 1.49, NIST toluene viscosity 0.5522 mPa·s.
- n | refractive index of the liquid
- θ | scattering angle
- λ | laser wavelength in vacuum
- η | viscosity of the liquid at the sample temperature
step: q = 4π × 1.49 × sin 45° ÷ 632.8 nm = 20.92 µm⁻¹
step: Γ = 29,700 ÷ 2 = 14,850 s⁻¹, so D = 14,850 ÷ (20.92 × 10⁶)² = 33.92 µm²/s
step: R_h = 4.116 × 10⁻²¹ ÷ (6π × 0.5522 × 10⁻³ × 33.92 × 10⁻¹²) = 11.66 nm
```

## The workshop's coils sized

This is an illustration. The workshop sends a dilute solution of its virgin resin in toluene, filtered to remove dust, to a laboratory with a light-scattering instrument. The instrument fits the intensity correlation and reports a decay rate of 29,700 s⁻¹ at 90° and 25 °C.

The [particle and polymer coil size tool](/tools/dls-particle-size/) reduces a light-scattering measurement by hand. From the laser wavelength, the liquid's refractive index, the scattering angle, the measured decay rate and whether it came from the intensity or the field correlation, and the liquid's temperature and viscosity, it calculates the scattering vector, the field decay rate, the diffusion coefficient, the hydrodynamic radius and diameter by the Stokes–Einstein equation, and the product q R_h, which shows whether internal motions of the coils could be affecting the result. With the NIST WebBook's viscosity of toluene at 25 °C, 0.5522 mPa·s, it gives:

- scattering vector 20.92 µm⁻¹ and field decay rate 14,850 s⁻¹;
- diffusion coefficient **33.92 µm²/s**;
- hydrodynamic radius **11.66 nm**, diameter 23.32 nm, within the workshop's illustrative range of 18 to 28 nm for this check;
- q R_h = 0.244, well below 1, so the decay reflects the coils' translation, not their internal wriggling.

The radius of gyration of the same chain in a good solvent was estimated in Chapter 3 as 17.45 nm, with a teaching expansion factor. The ratio 17.45 ÷ 11.66 = **1.50** is of the size expected for flexible coils in a good solvent, which is a reassuring check that the teaching numbers in this book hang together.

```figure
type: stats
title: The virgin resin's coils by light scattering
caption: Dilute polystyrene in toluene at 25 °C, by the particle and polymer coil size tool. The hydrodynamic radius is smaller than the radius of gyration because solvent drains partly through the coil.
- 33.92 µm²/s | diffusion coefficient | D = Γ ÷ q²
- * 11.66 nm | hydrodynamic radius | Stokes–Einstein, η = 0.5522 mPa·s
- 17.45 nm | radius of gyration | Chapter 3, teaching expansion 1.30
- 1.50 | R_g ÷ R_h | typical of flexible coils in a good solvent
```

Light scattering earns its place in the workshop's toolkit less for the mean size, which intrinsic viscosity tracks more cheaply, than for what it reveals about the solution. Undissolved gel particles, aggregates or dust in a cement batch scatter light far more strongly than coils, and they show up as a second, much slower decay or a large increase in the apparent size. A cement that has started to separate, as in Chapter 7, shows growing droplets long before it looks cloudy.

## Getting a good light-scattering result

Light scattering is easy to do badly, because a few large particles can dominate the signal from millions of small coils. The scattered intensity from a particle rises steeply with its size, so a single dust grain or gel lump in the beam can swamp everything else. Samples are therefore filtered through fine membrane filters directly into dust-free cells, and the instrument's count rate is watched for spikes that betray a passing particle.

The concentration must be low enough that the coils diffuse independently, well below the overlap concentration of Chapter 5, and the sample must sit long enough in the instrument to reach the set temperature, since a 1 K error changes the solvent's viscosity, and so the size, by more than 1%. A single decay rate fitted to the start of the correlation curve gives an intensity-weighted average size; a broad or multimodal sample needs a distribution analysis, and the breadth of the fitted decay is reported as a polydispersity index that should be read alongside the size. For large coils, where q R_h approaches 1, measurements at several angles are extrapolated to zero angle, as the tool's check warns. ISO 22412 describes good practice for particle sizing by this method, and the laboratory's report should say which parts of it were followed.

## Reading a supplier's certificate

Most of the information a moulder has about a resin arrives on the supplier's certificate of analysis, and it repays careful reading. A typical certificate gives the grade, the lot number, the melt flow rate and its test condition, and perhaps a few other properties such as Vicat softening temperature, volatile content or colour. It rarely gives the molar mass distribution unless asked.

Three habits make the certificate more useful. First, record the melt flow rate of every lot in one place, so that a trend or a jump is visible; Chapter 6 showed that a 20% change corresponds to only about 5% in M_w. Second, check that the test condition is the one on the grade's data sheet, since melt flow rates measured at different temperatures or loads cannot be compared. Third, for a resin whose toughness or melt elasticity matters, ask the supplier for M_n, M_w and M_z by size-exclusion chromatography, at least once for each new grade and whenever the melt flow rate moves outside its usual band. Most suppliers can provide them, and having them on file turns a later dispute about a lot into a comparison of numbers.

## When the checks disagree

The value of several cheap checks lies partly in their disagreements, because each pattern of results points to a different cause.

- **Melt flow rate off, intrinsic viscosity normal.** The average chain length is probably fine, but the distribution may have changed, for example by a broader distribution or an additive. Ask for size-exclusion chromatography before rejecting the lot.
- **Intrinsic viscosity low, melt flow rate high.** The chains are shorter: degradation, a different grade or too much regrind. Check the blend records and the regrind's history.
- **Cement viscosity off, resin intrinsic viscosity normal.** The concentration or the solvent has changed: check the weighing, solvent loss from open pots and the solvent batch.
- **Cement viscosity low and refrigerator test failed.** The solvent has become poorer, as in Chapters 3 and 7. Check for a change of solvent or thinner.
- **Light-scattering size high, intrinsic viscosity normal.** Aggregates, gels or dust rather than longer chains. Refilter and remeasure before drawing any conclusion.

Writing these patterns into the workshop's procedure saves the time otherwise spent arguing about which test is right. Usually both are right, about different things.

## The error: the instrument set for water

This is an illustration. When the workshop bought time on a second laboratory's instrument, the first report gave a hydrodynamic diameter of **14.5 nm**, well below the 18 to 28 nm range, and the laboratory's comment suggested that the resin might be degraded.

The quality engineer entered the report's raw values into the coil size tool and reproduced the 14.5 nm only by using a viscosity of 0.89 mPa·s, the viscosity of water at 25 °C and a common default on light-scattering instruments. With toluene's 0.5522 mPa·s, the same decay rate gave 23.3 nm. The ratio of the two sizes, 1.61, was exactly the ratio of the two viscosities, as the Stokes–Einstein equation requires. The intrinsic viscosity of the same lot, 0.8187 dL/g, had already shown that the resin was normal.

```figure
type: compare
title: The same light-scattering decay rate reduced with two viscosities
rowhead: Viscosity used
cols: Hydrodynamic diameter | Against 18 to 28 nm | Note
caption: Decay rate 29,700 s⁻¹ (intensity), 90°, 632.8 nm, 25 °C, refractive index 1.49. The size is inversely proportional to the viscosity entered, so a default for the wrong liquid scales it by the ratio of viscosities.
- Water default, 0.89 mPa·s | 14.5 nm | fail | wrong liquid
- * Toluene, 0.5522 mPa·s (NIST) | 23.3 nm | pass | correct
```

The laboratory reissued its report. The workshop's request form for light scattering now states the liquid, its viscosity at the measurement temperature and its refractive index, and the tool is used to check every result received. The tool's own checks list this exact hazard: use the viscosity of the actual liquid at the measured temperature.

## The methods side by side

Each method in this book answers a different question about the chains, at a different cost.

```figure
type: compare
title: Methods for measuring chains, and what each is for
rowhead: Method
cols: What it gives | Where | Use it for
caption: The cheap methods in the upper rows catch most problems; the laboratory methods in the lower rows explain them. Standards named by number only.
- Melt flow rate (ISO 1133) | a rough gauge of Mw | supplier certificate; small tester | lot-to-lot comparison
- Intrinsic viscosity (ISO 1628-1) | Mv | small laboratory | resin, regrind and blend checks
- Cement viscosity at 20 °C | concentration and Mw together | workshop viscometer | every cement batch
- Refrigerator and dilution test | margin to cloud point | workshop refrigerator | cement release, new solvents
- Solubility screen and soak test | swelling and attack | tool plus scrap parts | cleaners, containers, seals
- Size-exclusion chromatography (ISO 16014) | Mn, Mw, Mz and the distribution | test laboratory | disputes, new grades, additives
- Light scattering (ISO 22412) | coil size, aggregates | test laboratory | cement problems, gels
- Differential scanning calorimetry | melting point, crystallinity | test laboratory | semicrystalline parts and containers
```

## The workshop's incoming check

The workshop's routine, built from the chapters of this book, is set out below. This is an illustration, and every limit in it is the workshop's own, set for its own products.

```figure
type: checklist
title: The workshop's routine checks on chains, solvents and containers
caption: Cheap checks every time; laboratory checks when a cheap check fails, a supplier or grade changes, or once a year. Limits are the workshop's illustrative values.
- Every resin lot | certificate read for MFR and Mw; intrinsic viscosity in toluene at 25 °C within 0.78 to 0.92 dL/g
- Every regrind batch | intrinsic viscosity recorded; blend share set so the hopper Mw is at least 240,000 g/mol
- Every cement batch | made by weight at 16.7%; viscosity 1,000 to 1,500 mPa·s at 20 °C; refrigerator test at 2 °C, full strength and diluted
- Every new solvent, thinner or cleaner | Hansen screen against polystyrene; test on a stressed scrap part; safety data sheet reviewed
- Solvent containers | maker's compatibility data on file; replaced on schedule; shed minimum temperature logged
- Once a year | three-point intrinsic viscosity; size-exclusion chromatography of one virgin lot and one regrind batch
- x Releasing material on appearance alone | clear cement can be close to its cloud point; normal-looking regrind can be degraded
- ? A result outside its range | repeat the cheap test, then send a sample to the laboratory before rejecting a lot
```

The results go into one log, kept by lot and batch number, so that any moulded housing or cemented joint can be traced back to the resin lot, the regrind share, the cement batch and the checks each passed. When a customer reports a cracked housing or a failed joint, the log shows at once whether anything was unusual about the materials that went into it, and whether the cause is more likely to lie in the process, the design or the service conditions. Without the log, the same investigation starts from guesses. The log also shows trends that single results hide: a slow drift in the intrinsic viscosity of regrind, for example, can reveal a moulding machine whose barrel temperature has crept upwards long before any part fails.

The routine costs an hour or two a week and a few laboratory tests a year. Each of its lines exists because of one of the errors in this book: the stretched chain mistaken for the coil, the number average blended linearly, the concentration entered in the wrong units, the cement diluted by a quarter, the melt flow rate read as a chain length, the clear cement that clouded in the shed, the citrus cleaner, the Hansen screen applied to crystals and the instrument set for water.

## How this applies to a small Australian business

A small moulder or fabricator cannot run a polymer laboratory, and does not need to. It needs a few cheap checks matched to its own materials, a clear idea of what each check can and cannot see, and a relationship with a test laboratory for the questions the cheap checks raise. The physics in this book explains why those checks work and how to read their results; the routine turns it into a habit. The return is fewer rejected batches, fewer field failures and better conversations with suppliers, because a disagreement about a lot can be settled with numbers both sides understand.

## Exercise: light scattering on regrind

If the twice-processed regrind, M_w about 215,000 g/mol, were dissolved and measured in the same way, roughly what hydrodynamic radius should be expected, assuming it scales with molar mass as the coil size does in a good solvent, M^0.588? What intensity decay rate would the instrument then report at 90°?

**Worked answer.** The expected radius is 11.66 × (215,000 ÷ 250,000)^0.588 = 11.66 × 0.915 = **10.67 nm**. The decay rate is inversely proportional to the radius at fixed temperature, viscosity and angle, so the intensity decay rate would be about 29,700 × 11.66 ÷ 10.67 = **32,460 s⁻¹**. Entering that value in the coil size tool gives a hydrodynamic radius of 10.67 nm and a diameter of 21.33 nm, still within the 18 to 28 nm range. Light scattering is therefore much less sensitive to degradation than melt flow rate or intrinsic viscosity, and is used here for aggregates and solution quality rather than as a molar mass check.
