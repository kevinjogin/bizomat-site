---
book: polymer-chains-by-the-numbers
chapterSlug: solvents-and-the-flory-exponent
order: 3
title: "Good solvents, theta solvents and the Flory exponent"
description: "See why a chain swells in a good solvent and stays ideal in a theta solvent, estimate coil size with the self-avoiding-walk exponent 0.588, and judge solvent quality from what the chains do."
draft: false
---

The random walk of Chapter 1 has a flaw that a real chain does not share: it can cross itself. A real chain's segments occupy space, so the chain cannot pass through itself, and in a good solvent its segments positively prefer to be surrounded by solvent rather than by each other. Both effects push the coil outwards. In a good solvent a long chain is therefore bigger than a random walk, and, more importantly, its size grows faster with its length. Instead of the square root of molar mass, the size grows as molar mass to the power of about 0.588.

That exponent turns up again in intrinsic viscosity, in the concentration at which coils overlap and in the viscosity of a cement. This chapter explains where it comes from, how solvent quality moves a chain between a swollen coil, an ideal coil and a collapsed one, and what that means for the workshop's solvent cement. It ends with a cheaper thinner that left the cement looking clear and made it weaker.

## Excluded volume and the self-avoiding walk

A walk that is forbidden to revisit any site it has already visited is called a self-avoiding walk. Because every step must avoid the walk's own past, the walk is pushed away from itself and spreads further than a random walk of the same length. Mathematicians and physicists have studied it intensively, because it is the simplest model of a polymer in a good solvent and because, surprisingly, it is mathematically related to a magnet at its critical point. That connection, pointed out by de Gennes in the early 1970s, means the methods physicists developed for critical phenomena, including the renormalisation group, can be used to calculate how a chain's size depends on its length.

The answer is a power law, R ∝ N^ν, with an exponent ν that is the same for every long flexible chain in a good solvent, whatever its chemistry. Its best current value for three dimensions comes from large computer simulations of self-avoiding walks: Clisby, in 2010, found ν = 0.587597, with an uncertainty in the sixth decimal place. For engineering purposes, **ν = 0.588**.

```figure
type: compare
title: How coil size scales with chain length
rowhead: Condition
cols: Exponent ν in R ∝ N^ν | Doubling the molar mass multiplies R by | The coil is
caption: The exponent is universal: it depends on the solvent condition but not on the chemistry of the chain. The prefactor, which sets the absolute size, does depend on the chemistry and the solvent.
- Good solvent | 0.588 | 1.503 | swollen
- Theta solvent, or melt | 0.5 | 1.414 | ideal, a random walk
- Poor solvent, below theta | about 1/3 when collapsed | 1.26 | collapsed, or precipitates
```

## Flory's argument

Long before the exact value was known, Flory gave a simple estimate that comes remarkably close. Consider a chain of N segments of size b swollen to a size R. Two effects compete.

- **Stretching costs entropy.** A random walk prefers a size of about b √N. Holding it at a larger size R costs a free energy of about k T R² ÷ (N b²), the entropic spring of Chapter 1.
- **Overlaps cost energy.** The chain's N segments are spread over a volume of about R³, so the number of segment–segment contacts is about N² ÷ R³ times an excluded volume v per contact. Each contact costs about k T, so the repulsion is about k T v N² ÷ R³.

The coil settles at the size that minimises the sum. Setting the derivative of R² ÷ (N b²) + v N² ÷ R³ with respect to R to zero gives R⁵ ∝ v b² N³, so R ∝ N^(3/5). Flory's exponent, 0.6, is within 2% of the exact 0.588. It works because two errors in the crude argument nearly cancel, and it is a fine example of a mean-field estimate: one that replaces the detailed, fluctuating arrangement of a chain by an average and still captures the main effect.

```figure
type: formula
title: Flory's estimate of the coil-size exponent
formula: Free energy ÷ kT ≈ R² ÷ (N b²) + v N² ÷ R³
formula: Minimising over R: R⁵ ∝ v b² N³, so R ∝ N^(3/5)
caption: The first term is the entropic cost of stretching, the second the repulsion between segments. The estimate 0.6 is close to the exact 0.588 for three dimensions.
- R | coil size
- N | number of segments
- b | segment size
- v | excluded volume per segment pair, positive in a good solvent
step: Flory exponent: 3 ÷ 5 = 0.600
step: Self-avoiding walk, Clisby 2010: 0.5876
step: Difference: 2.1%
```

## The theta condition

Solvent quality is not fixed. In a good solvent, segments repel each other and the excluded volume v is positive. In a poor solvent, segments attract each other more than they attract the solvent, and v is negative. In between lies a special condition, the theta point, where the attraction exactly cancels the repulsion and v is effectively zero. At the theta point the second term in Flory's free energy vanishes and the chain is an ideal random walk again, with ν = ½.

Most polymer–solvent pairs pass through a theta point as the temperature changes. For polystyrene in cyclohexane, a classic laboratory pair, the theta temperature is commonly reported at about 35 °C: above it the solvent is good, below it poor. A theta solvent is useful for measurement, because chains in it have their ideal, unperturbed size, the size they also have in their own melt. Chapter 7 shows that a solvent much poorer than theta, or a cooled theta solvent, separates into two phases.

## Measuring solvent quality

Solvent quality is usually expressed by one of two numbers. The first is the Flory–Huggins interaction parameter χ, a dimensionless measure of how much a polymer segment and a solvent molecule dislike being neighbours compared with being among their own kind. In Flory's lattice theory the excluded volume is proportional to (1 − 2χ), so:

- χ below 0.5 means a good solvent, and the lower χ, the better;
- χ = 0.5 is the theta condition for very long chains;
- χ above 0.5 is a poor solvent, in which long chains contract and, above a critical value that Chapter 7 calculates, separate out.

The second is the second virial coefficient, A₂, measured by osmometry or light scattering on dilute solutions. It describes how strongly two coils repel each other: positive in a good solvent, zero at theta and negative in a poor solvent. A₂ and χ carry essentially the same information, from different measurements.

Both depend on temperature. For most polymer–solvent pairs, including polystyrene in the solvents in this book, χ rises as the temperature falls, so a solvent gets poorer on cooling. That is the root of the cold-store problem in Chapter 7. And both can be estimated, roughly, from solubility parameters, which is how Chapter 7 calculates χ for the workshop's two solvent blends: about 0.46 for the original blend at 20 °C, comfortably good, and about 0.54 for the blend with the cheaper thinner, already poorer than theta. The error at the end of this chapter is what that difference looks like on the workshop floor.

## The swelling of the workshop's chains

The ratio of a chain's actual size to its ideal size is called its expansion factor, α. In a good solvent, α grows slowly with molar mass, as N^(0.588 − 0.5) = N^0.088, because longer chains have more self-contacts to avoid. This is an illustration: for the workshop's cement solvent at 20 °C, the book takes a teaching expansion factor of α = 1.30 for a 250,000 g/mol polystyrene chain.

The swollen chain then has an end-to-end distance of 1.30 × 32.9 = **42.8 nm** and a radius of gyration of 1.30 × 13.4 = **17.5 nm**. Its volume, which scales as the cube of its size, is 1.30³ = 2.20 times its ideal volume. The swelling matters most for that volume, because the volume decides how much solvent each chain holds and so how much it thickens the solution.

```figure
type: line
title: Coil size against molar mass, ideal and swollen
x: Molar mass, thousands of g/mol
y: End-to-end distance, nm
legend: Ideal coil (theta solvent or melt) | Swollen coil (teaching α = 1.30 at 250,000)
caption: The ideal coil grows as M^0.5 and the swollen coil as M^0.588, so the gap between them widens with chain length. Teaching values for polystyrene; the swollen curve assumes α grows as M^0.088 from 1.30 at 250,000 g/mol.
- 20 | 9.3 | 9.7
- 50 | 14.7 | 16.6
- 100 | 20.8 | 24.9
- 250 | 32.9 | 42.8
- 500 | 46.5 | 64.3
- 1000 | 65.8 | 96.6
```

The regrind's shorter chains swell slightly less. At 215,000 g/mol, α = 1.30 × (215 ÷ 250)^0.088 = 1.283, and the swollen radius of gyration is 12.45 × 1.283 = **16.0 nm**. A 14% fall in molar mass shrinks the swollen coil by (0.86)^0.588 = 0.915, or 8.5%, slightly more than the 7.3% fall of the ideal coil.

## Why it matters for viscosity

A chain in solution thickens the solvent roughly in proportion to the volume its coil sweeps out, divided by its mass. Since the coil's volume grows as R³ and R grows as M^ν, the volume per unit mass grows as M^(3ν − 1). This combination appears as the Mark–Houwink exponent of Chapter 4, and the theory predicts its values directly: 3 × 0.5 − 1 = **0.5** in a theta solvent and 3 × 0.588 − 1 = **0.764** in a good solvent.

Real measurements usually give exponents between those limits, often around 0.7 to 0.75 for flexible chains in good solvents. The reason is that the good-solvent exponent is an asymptotic value, reached only for very long chains; chains of ordinary molar mass are in a crossover between ideal and fully swollen behaviour, so their apparent exponent lies in between. This book's teaching Mark–Houwink exponent of 0.73 reflects that.

## The error: a clear cement that had gone poor

This is an illustration. To save cost, the workshop replaced 12% of its cement solvent with a cheaper aliphatic thinner, keeping the polystyrene content at 16% by mass. The new cement looked exactly like the old one: clear and free-flowing. Within a week, however, the assembly area reported that it seemed thinner and was running on vertical joints, and a batch of joints made with it failed the workshop's peel check.

The quality engineer measured the cement's viscosity: about 870 mPa·s at 20 °C, against 1,250 for the old cement at the same polymer content. A 30% fall with no change in concentration pointed to a change in the chains, not in their amount. The engineer then tried to measure the intrinsic viscosity of the same resin in each solvent blend, using the dilute-solution method of Chapter 4 at 0.5 g/dL. In the old blend it gave about 0.82 dL/g. In the new blend the dilute solution turned faintly hazy within minutes at room temperature, and its flow times drifted from run to run, so no valid reading could be taken. A dilute polymer solution that will not stay clear is the clearest possible evidence that the solvent is poorer than theta: on their own in the solvent, the chains preferred each other's company and began to separate out. In the 16% cement, crowded together, they stayed in one phase, but less swollen than before.

```figure
type: compare
title: The workshop's cement before and after the cheaper thinner
rowhead: Property
cols: Original blend | With 12% thinner | What it shows
caption: Invented measurements for the illustration, 16% polystyrene by mass at 20 °C. The polymer content was unchanged; the cement thinned because its chains were less swollen, and the dilute test showed the new blend was poorer than a theta solvent.
- Cement appearance | clear | clear | one phase at 16%
- Cement viscosity | 1,250 mPa·s | about 870 mPa·s | 30% lower
- * Dilute solution, 0.5 g/dL | clear; [η] about 0.82 dL/g | hazy; no valid reading | new blend poorer than theta
- Joint peel check | pass | fail | less swelling of the joint surfaces
```

Appearance was the wrong test. A solution stays clear until it separates into two phases, and a solvent can be far poorer than before, close to or even below theta, while still clear. The poorer solvent also swelled the housing surfaces less, so the chains on each side of the joint had less freedom to mix, which explains the failed peels. Chapter 7 shows that the same thinned cement goes cloudy on a cold morning, and Chapter 8 shows how solubility parameters would have warned of the change before it was made. The thinner was withdrawn and the original blend restored.

## Concentrated solutions and melts

In a melt, or in a concentrated solution, a chain is surrounded mostly by other chains. Its segments' repulsion of each other is screened by the other chains' segments, which crowd around it from all sides, and the chain behaves as an ideal random walk again. This screening, predicted by Flory and confirmed by neutron scattering, is why Chapter 1's ideal-chain sizes apply to moulded parts. In solutions of intermediate concentration, chains are swollen on small scales and ideal on large ones, a picture developed by de Gennes and used in Chapter 5.

## Workshop signs of solvent quality

A workshop without a light-scattering instrument can still judge solvent quality from simple observations, provided it compares like with like:

1. **Dissolution time.** Granules dissolve faster in a good solvent, because their chains swell and disentangle readily.
2. **Viscosity at a fixed concentration.** At the same polymer content, a better solvent gives a thicker solution, because the chains are more swollen.
3. **Haze on dilution.** Diluting a sample tenfold with the same solvent and watching for haze tests the dilute regime, where a solvent poorer than theta shows itself first.
4. **Haze on cooling.** Cooling a sample in a refrigerator and watching for cloudiness tests the margin to phase separation, as Chapter 7 explains.
5. **Swelling of a film.** A weighed offcut of the plastic soaked in the solvent gains more mass in a better solvent.

None of these gives χ, but each detects a change, and a change is usually what matters.

## How this applies to a small Australian business

Solvent quality is invisible until something goes wrong. Two solvents that both dissolve a plastic can swell its chains very differently, giving cements, coatings or inks of different viscosity at the same solids content, different film quality and different adhesion. A workshop that changes a solvent, a thinner or a supplier should check more than whether the polymer still dissolves: a viscosity measurement at fixed concentration, or better an intrinsic viscosity, shows at once whether the chains are as swollen as before.

## Exercise: coil volume and molar mass

In a good solvent with ν = 0.588, by what factor does the volume of a coil change when the molar mass doubles? By what factor does the volume per unit mass change? Compare both with a theta solvent.

**Worked answer.** In a good solvent, R ∝ M^0.588, so the volume, proportional to R³, scales as M^1.764. Doubling M multiplies the volume by 2^1.764 = **3.40** and the volume per unit mass by 3.40 ÷ 2 = 2^0.764 = **1.70**. In a theta solvent, volume scales as M^1.5, so doubling M multiplies it by 2^1.5 = **2.83**, and the volume per unit mass by 2^0.5 = **1.41**. Those per-mass factors are the ratios by which the intrinsic viscosity changes in Chapter 4, through the Mark–Houwink exponents 0.764 and 0.5.
