---
book: polymer-chains-by-the-numbers
chapterSlug: intrinsic-viscosity-and-resin-checks
order: 4
title: "Intrinsic viscosity and resin checks"
description: "Measure a resin's intrinsic viscosity from viscometer flow times, convert it to a viscosity-average molar mass with Mark–Houwink constants, and use it to check virgin resin, regrind and blends."
draft: false
---

The cheapest way to measure the length of a polymer's chains is to dissolve a little of it and time how fast the solution runs through a glass capillary. A dilute solution of long chains flows more slowly than the solvent alone, because each swollen coil is a large, slowly tumbling object that disturbs the flow around it. The amount of slowing, extrapolated to zero concentration and divided by the concentration, is the intrinsic viscosity. It measures the volume the coils sweep out per unit mass of polymer, and since that volume grows with chain length, it gives a molar mass.

Intrinsic viscosity is the standard specification test for polyesters, nylons and many other resins, and it is a practical way for a small laboratory to detect degraded regrind. This chapter defines the viscosities a capillary viscometer measures, shows how a single measurement can stand in for the full extrapolation, converts intrinsic viscosity to molar mass with the Mark–Houwink relation, and applies it to the workshop's virgin resin, regrind and blend. It ends with a result a hundred times too large.

## What the viscometer measures

A capillary viscometer, of the Ubbelohde or similar type, times the fall of a fixed volume of liquid through a fine glass capillary at a closely controlled temperature. For dilute solutions whose density is close to the solvent's, the ratio of flow times equals the ratio of viscosities. From the solvent's flow time t₀ and the solution's flow time t at a polymer concentration c, usually in grams per decilitre:

- the relative viscosity is η_r = t ÷ t₀;
- the specific viscosity is η_sp = η_r − 1, the fractional increase due to the polymer;
- the reduced viscosity is η_sp ÷ c;
- the inherent viscosity is ln(η_r) ÷ c.

Both the reduced and inherent viscosities depend slightly on concentration, because coils begin to interact as soon as there is more than one of them. Their common limit at zero concentration is the intrinsic viscosity, [η], with units of decilitres per gram. It belongs to a single, isolated coil in that solvent at that temperature.

## Extrapolating, or not

The classic method measures several concentrations and extrapolates. The reduced viscosity usually follows the Huggins equation, η_sp ÷ c = [η] + k_H [η]² c, a straight line whose intercept is [η] and whose slope gives the Huggins constant k_H, typically around 0.3 to 0.4 in a good solvent. The inherent viscosity follows a similar line with a negative slope, and the two lines meet at the intercept.

Routine checks often save time with a single concentration. Single-point relations combine the specific and relative viscosities so that the concentration dependence largely cancels. Two widely used ones are:

- **Solomon–Ciuta:** [η] = √(2 (η_sp − ln η_r)) ÷ c;
- **Billmeyer:** [η] = (η_sp + 3 ln η_r) ÷ (4 c).

A third uses the Huggins equation itself with an assumed k_H, solved for [η]. If the three agree closely, the single point is trustworthy; if they diverge, the concentration is too high or the Huggins constant unusual, and a proper extrapolation is needed.

```figure
type: formula
title: From flow times to molar mass
formula: η_r = t ÷ t₀     η_sp = η_r − 1
formula: Solomon–Ciuta: [η] = √(2 (η_sp − ln η_r)) ÷ c
formula: Mark–Houwink: [η] = K × M_v^a, so M_v = ([η] ÷ K)^(1 ÷ a)
caption: Flow times in seconds, concentration in g/dL, [η] in dL/g. K and a belong to one polymer, solvent and temperature; the values here are teaching values for polystyrene in toluene at 25 °C.
- t₀, t | flow times of solvent and solution
- c | polymer concentration, g/dL
- K | Mark–Houwink constant, 1.0 × 10⁻⁴ dL/g (teaching value)
- a | Mark–Houwink exponent, 0.73 (teaching value)
step: Virgin lot: η_r = 146.7 ÷ 100.0 = 1.467, η_sp = 0.467
step: [η] = √(2 × (0.467 − 0.38322)) ÷ 0.5 = 0.8187 dL/g
step: M_v = (0.8187 ÷ 1.0 × 10⁻⁴)^(1 ÷ 0.73) = 229,300 g/mol
```

## From intrinsic viscosity to molar mass

Chapter 3 showed that the volume a coil sweeps out per unit mass grows as M^(3ν − 1), between M^0.5 in a theta solvent and M^0.764 in a good one. Measurements on narrow fractions of a polymer in a given solvent at a given temperature confirm a power law over a useful range, the Mark–Houwink relation:

[η] = K × M^a.

For a polydisperse resin, the molar mass that this gives is the viscosity average, M_v, which lies between M_n and M_w and closer to M_w. The constants K and a must come from the literature or from calibration with characterised samples, and they belong to one polymer, one solvent and one temperature. This book uses teaching values of K = 1.0 × 10⁻⁴ dL/g and a = 0.73 for polystyrene in toluene at 25 °C, of a realistic size; real work needs published or measured values.

## The workshop's virgin resin

This is an illustration. The workshop's laboratory dissolves 0.5 g of the virgin lot in toluene and makes it up to 100 mL, a concentration of 0.5 g/dL, filters it, and times solvent and solution in the same viscometer at 25 °C. The solvent's mean flow time is 100.0 s and the solution's is 146.7 s.

The [polymer intrinsic viscosity tool](/tools/polymer-intrinsic-viscosity/) calculates the relative, specific, reduced and inherent viscosities from the two flow times and the concentration, gives the intrinsic viscosity by the Solomon–Ciuta, Billmeyer and Huggins single-point relations side by side, converts the chosen one to a viscosity-average molar mass with Mark–Houwink constants the user supplies, and checks it against specification limits. For the virgin lot it gives:

- relative viscosity 1.467, specific viscosity 0.467, reduced viscosity 0.934 dL/g and inherent viscosity 0.7664 dL/g;
- intrinsic viscosity **0.8187 dL/g** by Solomon–Ciuta, 0.8083 by Billmeyer and 0.8171 by Huggins with k_H = 0.35, a spread of 1.26%;
- viscosity-average molar mass **229,300 g/mol**, within the workshop's specification of 0.78 to 0.92 dL/g.

The viscosity average agrees with the 228,600 g/mol calculated from the supplier's distribution in Chapter 2 to within 0.3%, a useful cross-check of both the measurement and the constants.

```figure
type: compare
title: The virgin lot's intrinsic viscosity by three single-point relations
rowhead: Relation
cols: Intrinsic viscosity | Viscosity-average molar mass
caption: From the polymer intrinsic viscosity tool, t₀ = 100.0 s, t = 146.7 s, c = 0.5 g/dL, teaching constants K = 1.0 × 10⁻⁴ dL/g and a = 0.73. A spread of about 1% supports the single-point result.
- * Solomon–Ciuta | 0.8187 dL/g | 229,300 g/mol
- Billmeyer | 0.8083 dL/g | 225,400 g/mol
- Huggins, k_H = 0.35 | 0.8171 dL/g | 228,700 g/mol
```

## A three-point check

Once a year, and whenever the solvent or the resin grade changes, the laboratory checks the single-point method against a full extrapolation. It makes up the virgin resin at 0.25, 0.50 and 0.75 g/dL and times each. This is an illustration: the flow times come to 121.9, 146.8 and 174.6 s against the solvent's 100.0 s, giving reduced viscosities of 0.877, 0.936 and 0.995 dL/g.

Those three points lie on a straight line against concentration, with an intercept of **0.819 dL/g** and a slope of 0.235 dL²/g². The intercept is the intrinsic viscosity, in agreement with the single-point 0.8187. The Huggins constant is the slope divided by [η]², 0.235 ÷ 0.8187² = **0.35**, the value assumed in the tool's Huggins relation. Had the slope been much larger, giving a Huggins constant of 0.5 or more, that would have been a warning of a poor solvent or of aggregation, and the single-point relations, which work best with a typical good-solvent constant, would have become unreliable. The check costs an hour and protects every routine result that follows.

## Regrind and blends

The same test on the twice-processed regrind gives a solution flow time of 141.0 s. The tool returns an intrinsic viscosity of **0.7289 dL/g** and a viscosity-average molar mass of **195,600 g/mol**, below the 0.78 dL/g limit. Regrind on its own fails the feedstock specification, as expected. The ratio of its M_v to the 215,000 g/mol weight average estimated for it in Chapter 2 is 0.91, close to the virgin resin's ratio of 229,300 ÷ 249,900 = 0.92, which suggests that the two passes shortened the chains without greatly changing the shape of the distribution.

In dilute solution, the coils of different chains do not interact, so the specific viscosity of a mixture is the sum of its components' contributions, and the intrinsic viscosity of a blend is, to a good approximation, the mass-weighted average of its components'. For the workshop's 72:28 blend of virgin resin and regrind, that is 0.72 × 0.8187 + 0.28 × 0.7289 = **0.7936 dL/g**, within the specification. The laboratory confirms each new blending ratio once by measurement and then relies on the calculation.

```figure
type: compare
title: Intrinsic viscosity checks against the 0.78 to 0.92 dL/g specification
rowhead: Material
cols: Solution flow time | Intrinsic viscosity | Mv | Verdict
caption: Toluene at 25 °C, 0.5 g/dL, solvent flow time 100.0 s, Solomon–Ciuta relation, teaching constants. The blend's value is the mass-weighted average of its components' intrinsic viscosities.
- Virgin lot | 146.7 s | 0.8187 dL/g | 229,300 g/mol | pass
- Regrind, two passes | 141.0 s | 0.7289 dL/g | 195,600 g/mol | fail
- * 72:28 blend | calculated | 0.7936 dL/g | about 219,700 g/mol | pass
```

## Getting a reliable flow time

The calculation is simple; the measurement needs care, because a small error in a flow time becomes a larger error in the specific viscosity. At the workshop's concentration, the specific viscosity is 0.467, so an error of 0.2 s in a 146.7 s flow time is an error of 0.4% in the specific viscosity and slightly less in [η]. Several practices keep errors at that level or below.

1. **Control the temperature closely.** The NIST WebBook gives toluene's viscosity as 0.5871 mPa·s at 20 °C and 0.5522 mPa·s at 25 °C, a change of about 1.2% per kelvin. Solvent and solution must be timed at the same, steady temperature, in a well-stirred bath.
2. **Use one viscometer for both.** Every capillary differs slightly; using the same one for solvent and solution makes its constant cancel.
3. **Repeat the flow times** until consecutive readings agree within a few tenths of a second, and average them.
4. **Filter the solution** to remove dust and gel particles, which can partly block the capillary.
5. **Keep flow times long enough** that the kinetic-energy correction is negligible, typically above about 100 s for the solvent; shorter times need a correction.
6. **Dry and weigh the polymer carefully**, since the concentration enters directly. Moisture or residual monomer in the sample lowers the true polymer concentration.

ISO 1628-1 sets out the general principles of dilute-solution viscometry for polymers, and resin-specific parts of the same standard and other methods give conditions for particular polymers. A laboratory producing results for a customer should follow the method its customer specifies.

## The error: a hundredfold intrinsic viscosity

This is an illustration. A new technician, entering a routine virgin-lot result into the intrinsic viscosity tool, typed the concentration as 0.005, thinking in grams per millilitre, since the solution had been made up as 0.5 g in 100 mL. The tool returned an intrinsic viscosity of 81.87 dL/g and a viscosity-average molar mass of about 126 million g/mol, and flagged the result as outside the specification.

The flag alone might have been taken as a bad lot, but the magnitude gave the error away. General-purpose polystyrene has an intrinsic viscosity of the order of 1 dL/g in a good solvent; a value of 82 would need chains hundreds of times longer than any commercial grade. The ratio between the result and the expected value, 100, was exactly the ratio between grams per millilitre and grams per decilitre. Re-entered as 0.5 g/dL, the result was the expected 0.8187 dL/g.

```figure
type: checklist
title: Before accepting an intrinsic viscosity result
caption: Most wrong results come from units, temperature or a contaminated sample rather than from the resin. A quick check against the expected magnitude catches the first.
- Concentration in g/dL | 0.5 g in 100 mL is 0.5 g/dL, not 0.005
- Solvent and solution at the same temperature | in the same viscometer, timed in the same session
- Three single-point relations agree | within the laboratory's tolerance, otherwise extrapolate
- Result of the expected magnitude | of the order of 1 dL/g for this resin in this solvent
- Mark–Houwink constants for this polymer, solvent and temperature | not borrowed from another system
- x Viscosity-average molar mass quoted as Mw | it is lower, by about 8% for this resin
- ? Sample dry and free of additives | fillers, pigments or residual monomer change the true concentration
```

The tool did its arithmetic correctly with the number it was given. The laboratory's worksheet now prints the concentration's units beside the entry, and the technician's training includes the order-of-magnitude check.

## What intrinsic viscosity cannot tell you

Intrinsic viscosity gives one average, M_v, and nothing about the distribution's breadth. Two resins with the same M_v can have very different M_n, and so different toughness, or different M_z, and so different melt elasticity. It also assumes that the chains are linear and of one chemistry: branched chains are more compact than linear ones of the same molar mass and give a lower intrinsic viscosity, and copolymers or blends of different polymers need their own constants. Where those properties matter, size-exclusion chromatography, ideally with a viscosity or light-scattering detector, is needed.

The result also belongs to its solvent. The same polystyrene gives a different intrinsic viscosity in toluene, in a theta solvent and in the workshop's cement blend, because its coils swell differently in each, as Chapter 3 explained. Mark–Houwink constants from one solvent cannot be used with flow times measured in another, and a specification limit written for one solvent means nothing in another. The workshop's specification therefore names the solvent, the temperature and the single-point relation used, so that a result from a supplier's laboratory can be compared with its own.

## How this applies to a small Australian business

A capillary viscometer, a good thermostatic bath, a balance and a stopwatch are within the reach of a small laboratory, and an intrinsic viscosity check of incoming resin and regrind catches the commonest problems: a lot from a different grade, regrind that has been through the machine too often, or a resin degraded by wet processing. It does not replace a supplier's certificate, but it confirms it cheaply, and a result outside a specification is a reason to stop and ask before the material reaches the hopper.

## Exercise: a third pass

A sample of regrind that has been through the moulding machine a third time is tested in the same way, giving a solution flow time of 138.2 s at 0.5 g/dL against the solvent's 100.0 s. Find its specific viscosity, its intrinsic viscosity by the Solomon–Ciuta relation and its viscosity-average molar mass with the teaching constants.

**Worked answer.** This is the same method as the virgin and regrind checks, one step further down the degradation path. η_r = 138.2 ÷ 100.0 = 1.382 and η_sp = **0.382**. ln(1.382) = 0.32353, so η_sp − ln η_r = 0.05847, and [η] = √(2 × 0.05847) ÷ 0.5 = √0.11694 ÷ 0.5 = 0.34196 ÷ 0.5 = **0.6839 dL/g**. Then M_v = (0.6839 ÷ 1.0 × 10⁻⁴)^(1 ÷ 0.73) = 6,839^1.3699 = **about 179,000 g/mol**, a further fall of about 8% from the twice-processed regrind's 195,600 g/mol.
