---
book: polymer-chains-by-the-numbers
chapterSlug: molar-mass-averages-and-regrind
order: 2
title: "Molar mass averages, dispersity and regrind blends"
description: "Calculate number-, weight- and z-average molar masses from a distribution, see which properties follow which average, and blend regrind with virgin resin to a target without averaging the wrong way."
draft: false
---

No real resin is made of chains of one length. Polymerisation is a random process: some chains stop growing early and some late, and the resin that reaches the moulder is a mixture spanning a factor of a hundred or more in molar mass. A single number on a data sheet, or a melt flow rate, summarises that mixture, and different summaries weight it differently. The number-average molar mass counts every chain equally, however short. The weight-average counts each chain in proportion to its mass, so long chains dominate. The z-average leans further still towards the longest chains.

Which average matters depends on the property. This chapter defines the three averages and calculates them from the workshop's resin, shows which properties follow which average, and then uses the right one to blend regrind with virgin resin. It ends with a resin lot that was rejected as degraded because a number average was compared with the wrong expectation.

## Three averages

Suppose a resin is divided into fractions, each with a molar mass M_i and a mass fraction w_i, as a size-exclusion chromatograph does when it sorts chains by size. The averages are:

- **number-average**, Mn = 1 ÷ Σ(w_i ÷ M_i): the total mass divided by the total number of chains;
- **weight-average**, Mw = Σ(w_i × M_i): each fraction's molar mass weighted by its share of the mass;
- **z-average**, Mz = Σ(w_i × M_i²) ÷ Σ(w_i × M_i): a further step towards the heavy end.

For any real mixture, Mn < Mw < Mz. The ratio Mw ÷ Mn, called the dispersity (formerly the polydispersity index), measures the breadth of the distribution. A resin of perfectly uniform chains would have a dispersity of exactly 1; general-purpose polystyrene made by free-radical polymerisation is typically in the range of about 2 to 3.

```figure
type: formula
title: Molar mass averages from a distribution
formula: Mn = 1 ÷ Σ(wᵢ ÷ Mᵢ)     Mw = Σ(wᵢ × Mᵢ)     Mz = Σ(wᵢ × Mᵢ²) ÷ Σ(wᵢ × Mᵢ)
caption: wᵢ is the mass fraction of chains of molar mass Mᵢ, with the fractions summing to 1. The number average is a harmonic mean by mass, the weight average an arithmetic one.
- Mn | number-average: total mass ÷ number of chains
- Mw | weight-average: mass-weighted mean
- Mz | z-average: weighted towards the longest chains
- Đ = Mw ÷ Mn | dispersity, the breadth of the distribution
step: Σ wᵢ ÷ Mᵢ = 9.923 × 10⁻⁶ mol/g, so Mn = 100,800 g/mol
step: Σ wᵢ × Mᵢ = 249,900 g/mol = Mw
step: Σ wᵢ × Mᵢ² = 1.0485 × 10¹¹, so Mz = 1.0485 × 10¹¹ ÷ 249,900 = 419,600 g/mol
```

## The workshop's resin

This is an illustration. The resin supplier's certificate for the current lot of virgin polystyrene includes a size-exclusion chromatography (SEC) result, which the workshop's quality engineer reduces to seven slices.

```figure
type: compare
title: The virgin resin lot's molar mass distribution in seven slices
rowhead: Slice molar mass
cols: Mass fraction | Number fraction | wᵢ ÷ Mᵢ (10⁻⁶ mol/g) | wᵢ × Mᵢ (g/mol)
caption: Invented distribution for the illustration. The shortest slice holds 7% of the mass but 35% of the chains; the two longest hold 15% of the mass but only 2.4% of the chains. Totals give Mn = 100,800, Mw = 249,900 and Mz = 419,600 g/mol.
- 20,000 g/mol | 7% | 35.3% | 3.500 | 1,400
- 50,000 g/mol | 12% | 24.2% | 2.400 | 6,000
- 100,000 g/mol | 19% | 19.1% | 1.900 | 19,000
- 200,000 g/mol | 25% | 12.6% | 1.250 | 50,000
- 350,000 g/mol | 22% | 6.3% | 0.629 | 77,000
- 550,000 g/mol | 11% | 2.0% | 0.200 | 60,500
- 900,000 g/mol | 4% | 0.4% | 0.044 | 36,000
- * Totals | 100% | 100% | 9.923 | 249,900
```

The averages follow directly. The number of moles of chains per gram of resin is the sum of the third column, 9.923 × 10⁻⁶ mol/g, so Mn = 1 ÷ 9.923 × 10⁻⁶ = **100,800 g/mol**. The fourth column sums to Mw = **249,900 g/mol**. The sum of w_i × M_i² is 1.0485 × 10¹¹, so Mz = 1.0485 × 10¹¹ ÷ 249,900 = **419,600 g/mol**. The dispersity is 249,900 ÷ 100,800 = **2.48**, and Mz ÷ Mw = 1.68.

The number-fraction column shows why the averages differ so much. More than a third of all the chains are in the shortest slice, but they carry only 7% of the mass. Counting chains, the resin looks like a collection of short molecules; weighing them, it looks like a collection of long ones. Both views are correct, and each matters for different properties.

## Which property follows which average

The rule of thumb is that a property follows the average that weights the chains the way the property does.

1. **Properties that count molecules or chain ends** follow Mn. Osmotic pressure and freezing-point lowering count molecules. So, broadly, do effects of chain ends: each chain has two, ends are weak points in a glassy polymer, and a resin with many short chains has many ends. The tensile strength and toughness of glassy polymers are often correlated with Mn for this reason, and fall off when Mn becomes low.
2. **Properties dominated by the mass of long chains** follow Mw. Melt viscosity, in entangled melts, depends roughly on Mw, as Chapter 6 shows, and so therefore does the melt flow rate.
3. **Properties dominated by the very longest chains** follow Mz or higher averages. Melt elasticity, die swell, melt strength in film blowing and the tendency to frozen-in orientation are all sensitive to the high-molar-mass tail.
4. **Dilute solution viscosity** gives a viscosity average, Mv, which lies between Mn and Mw and usually close to Mw. For the workshop's distribution, with the teaching Mark–Houwink exponent of 0.73 used in Chapter 4, Mv = [Σ w_i M_i^0.73]^(1 ÷ 0.73) = **228,600 g/mol**.

A resin specified only by its melt flow rate is therefore specified only roughly by Mw. Two lots can have the same melt flow rate and different Mn or Mz, and mould differently as a result.

```figure
type: bars
title: The virgin lot's three averages and the viscosity average
unit: g/mol
caption: Each average weights the same distribution differently. Mv is the value a single-point viscosity test in Chapter 4 recovers, for the teaching Mark–Houwink exponent of 0.73.
- Number average Mn | 100,800 | counts every chain equally
- Viscosity average Mv | 228,600 | a = 0.73
- * Weight average Mw | 249,900 | follows melt viscosity roughly
- z-average Mz | 419,600 | follows melt elasticity
```

## Regrind and degradation

Every pass through a moulding machine breaks a small fraction of chain bonds by heat and shear. The breaks happen at random places along the chains, so they shorten long chains more often than short ones, simply because long chains have more bonds to break. The result is a fall in all the averages and usually a narrowing of the distribution at its long end. This is an illustration: after two passes the workshop's regrind has Mw of about 215,000 g/mol, down 14% from the virgin resin, and Mn of about 88,000 g/mol, down 13%.

The workshop's rule is that the blend going into the hopper must have Mw of at least 240,000 g/mol, which keeps its melt flow and impact performance close to the virgin resin's. That requires blending regrind with virgin resin in the right proportion.

## Counting the broken bonds

The number average has one property that makes it the natural measure of degradation: every broken bond adds exactly one chain to the resin without changing its mass. So the number of moles of chains per gram, which is 1 ÷ Mn, rises by exactly the number of moles of bonds broken per gram. That gives a direct count of the damage.

For the workshop's resin, 1 ÷ Mn was 1 ÷ 100,800 = 9.921 × 10⁻⁶ mol/g before moulding and 1 ÷ 88,000 = 11.364 × 10⁻⁶ mol/g after two passes. The difference, 1.443 × 10⁻⁶ mol/g, is the number of bonds broken in two passes, or **7.2 × 10⁻⁷ mol/g per pass**. Per original chain, that is 7.2 × 10⁻⁷ × 100,800 = 0.073 breaks per pass: roughly one chain in fourteen is cut once each time the material goes through the machine.

If the damage per pass stays the same, the same arithmetic predicts later passes. After four passes, 1 ÷ Mn = 9.921 × 10⁻⁶ + 4 × 7.2 × 10⁻⁷ mol/g, giving Mn of about **78,100 g/mol**. Real degradation per pass is not constant, since it depends on melt temperature, residence time, moisture and shear, and a single bad cycle can do far more damage than a normal one. But the reciprocal of Mn is the right quantity to track, because it adds up pass by pass.

In continuous production, regrind is itself partly made from earlier regrind. If every batch contains a share r of regrind, a fraction (1 − r) × r^k of the material in the hopper has been through the machine k times before. At r = 28%, that is 72% virgin material, 20.2% once through, 5.6% twice, 1.6% three times and 0.4% four times, and the average number of previous passes is r ÷ (1 − r) = 0.39. A regrind limit therefore also limits how much heavily degraded material can accumulate, which is a second reason for setting one.

## Blending by weight average

The weight-average molar mass of a blend is the mass-weighted average of the components' weight averages. That follows directly from its definition: Mw is a mass-weighted mean of molar masses, and a blend's mass is just the sum of its components' masses. So Mw blends exactly like a price per kilogram.

The [mixture cost and blending tool](/tools/mixture-cost/) calculates the weighted average of up to four ingredients by quantity, and the proportions of two ingredients that blend to a target value by the alligation method, with the quantities for a batch. It is described in terms of prices, but its arithmetic applies to any property that mixes linearly by mass, and Mw is one.

- **Cost mode:** 70 kg of virgin resin at Mw 249,900 with 30 kg of regrind at 215,000 gives a blend of **239,430 g/mol**, just under the 240,000 limit.
- **Blend mode:** with regrind as ingredient A at 215,000, virgin as B at 249,900 and a target of 240,000, the tool gives a regrind share of **28.37%**, or 141.8 kg of regrind and 358.2 kg of virgin resin in a 500 kg batch.

The workshop therefore caps regrind at 28% by mass, rounding down for a small margin, and records each batch's proportions so that its Mw can be traced.

```figure
type: compare
title: Regrind blends and their weight-average molar mass
rowhead: Regrind share by mass
cols: Blend Mw | Against the 240,000 limit
caption: Mw blends linearly by mass, so the weighted average gives it exactly. Virgin Mw 249,900, regrind 215,000 g/mol.
- 0% | 249,900 g/mol | pass
- 20% | 242,920 g/mol | pass
- * 28.4% | 240,000 g/mol | at the limit
- 30% | 239,430 g/mol | fail, just
- 50% | 232,450 g/mol | fail
```

## Blending by number average

The number-average molar mass does not blend linearly by mass. Because Mn is total mass divided by total number of chains, the blend's Mn is the blend's mass divided by the sum of the components' numbers of chains, which gives a harmonic mean:

1 ÷ Mn,blend = Σ (w_j ÷ Mn,j).

For a 70:30 blend of virgin resin (Mn 100,800) and regrind (Mn 88,000), that gives 1 ÷ (0.7 ÷ 100,800 + 0.3 ÷ 88,000) = **96,590 g/mol**, close to the linear average of 96,960 because the two components are similar. When they are very different, the harmonic mean is dominated by the component with the smallest molar mass, however little of it there is.

## The error: a false alarm from a number average

This is an illustration. A new supplier offered a version of the same polystyrene with 5% by mass of a low-molar-mass processing aid, number-average molar mass about 2,000 g/mol, compounded in to improve flow. The quality engineer used the mixture tool's cost mode to predict the compounded resin's Mn as a weighted average, 0.95 × 100,800 + 0.05 × 2,000 = 95,860 g/mol, and asked the supplier for an SEC result to confirm it. The result came back at about 29,000 g/mol, less than a third of the prediction, and the engineer rejected the material as badly degraded.

The supplier queried the rejection. Recalculating the blend's Mn correctly, as a harmonic mean, gives 1 ÷ (0.95 ÷ 100,800 + 0.05 ÷ 2,000) = **29,050 g/mol**, almost exactly what the SEC had found. The 5% of small molecules contained about 2.7 times as many molecules as the 95% of polystyrene, and Mn counts molecules. The polystyrene chains themselves were unchanged: the SEC trace showed the same polystyrene peak as the old resin, plus a separate small peak at low molar mass.

```figure
type: compare
title: The compounded resin's averages, predicted two ways and measured
rowhead: Average
cols: Linear by mass (wrong for Mn) | Correct rule | SEC result
caption: 95% polystyrene (Mn 100,800, Mw 249,900) with 5% of an additive of molar mass about 2,000 to 3,000 g/mol. Mn blends harmonically and is pulled down by a small mass of small molecules; Mw blends linearly and barely moves.
- * Number average Mn | 95,860 g/mol | 29,050 g/mol (harmonic) | about 29,000 g/mol
- Weight average Mw | 237,560 g/mol | 237,560 g/mol (linear) | about 238,000 g/mol
```

The rejection was withdrawn after the processing aid's effect on the housings' properties had been checked by trial, which was the question that actually mattered. The workshop's procedure now states that Mw may be blended linearly by mass, that Mn must be blended harmonically, and that any SEC result for a compounded material is read with its trace, so that additives are not mistaken for degraded polymer.

## Measuring the distribution

Size-exclusion chromatography, standardised in ISO 16014, separates chains by their size in solution: large coils pass through a column of porous beads faster than small ones, which wander into more of the pores. A detector measures the concentration leaving the column over time, and a calibration converts elution time to molar mass. For polystyrene the calibration is direct, because the standards used are usually narrow polystyrenes; for other polymers, results quoted "relative to polystyrene" can differ from the true molar masses by a large factor, because different polymers have different coil sizes at the same molar mass.

Few workshops own a chromatograph. A supplier's certificate, a test laboratory, or the simpler intrinsic viscosity check of Chapter 4 usually serves. What a workshop can do is ask for the right numbers: Mn, Mw and Mz, not only a melt flow rate, for any resin whose toughness, flow or orientation matters.

## How this applies to a small Australian business

Regrind is valuable and its use is often limited by fear of degradation rather than by measurement. A moulder who knows that Mw blends linearly can set a regrind limit from two measurements and a weighted average, and justify it to a customer. The same arithmetic flags the opposite risk: a resin that meets its melt flow specification can still contain a large number of short molecules, and Mn, read correctly, is the average that reveals them.

## Exercise: a 25% regrind blend

Find Mw, Mn and the dispersity of a blend of 75% virgin resin (Mn 100,800, Mw 249,900 g/mol) and 25% regrind (Mn 88,000, Mw 215,000 g/mol) by mass. Does it meet the workshop's limit of Mw 240,000?

**Worked answer.** Mw blends linearly: 0.75 × 249,900 + 0.25 × 215,000 = **241,200 g/mol**, which meets the limit. Mn blends harmonically: 1 ÷ (0.75 ÷ 100,800 + 0.25 ÷ 88,000) = 1 ÷ (7.440 × 10⁻⁶ + 2.841 × 10⁻⁶) = 1 ÷ 1.0281 × 10⁻⁵ = **97,260 g/mol**. The dispersity is 241,200 ÷ 97,260 = **2.48**, the same as the virgin resin's to two decimal places.
