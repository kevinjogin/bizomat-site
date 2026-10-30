---
book: polymer-chains-by-the-numbers
chapterSlug: melt-viscosity-and-the-34-power
order: 6
title: "Melt viscosity, entanglement and the 3.4 power"
description: "See why melt viscosity rises in proportion to chain length for short chains and with its 3.4 power above the entanglement threshold, and use that law to read melt flow rates, regrind and lot changes."
draft: false
---

A moulder meets molar mass mainly through the melt. A resin with longer chains fills a mould less easily, needs more pressure and holds more orientation; a resin with shorter chains flows freely but may be brittle. The relationship between chain length and melt viscosity is one of the most reliable scaling laws in materials science, and one of the most striking. For short chains, viscosity is simply proportional to molar mass. Above a threshold, where chains become long enough to entangle, it rises with the 3.4 power of molar mass, so that a 10% increase in chain length raises the viscosity by about 38%.

This chapter explains the two regimes and the crossover between them, applies the 3.4 power law to the workshop's virgin resin, regrind and blends, and shows how to read a melt flow rate in terms of molar mass. It ends with a lot that was nearly rejected because a 20% change in melt flow was read as a 20% change in chain length.

## Two regimes

Early measurements on a wide range of polymers, reviewed comprehensively by Berry and Fox in 1968, showed the same pattern for every linear flexible polymer. Plot the logarithm of the zero-shear melt viscosity, η₀, against the logarithm of the weight-average molar mass, and the data fall on two straight lines: a slope of 1 at low molar mass and a slope of about 3.4 at high molar mass. The two lines meet at a critical molar mass, M_c, which differs from polymer to polymer.

```figure
type: formula
title: Zero-shear melt viscosity against molar mass
formula: Below M_c: η₀ ∝ M_w
formula: Above M_c: η₀ ∝ M_w^3.4
caption: At constant temperature, for linear flexible chains. M_c is the critical molar mass for entanglement effects; the teaching value used here for polystyrene is 31,000 g/mol. The exponent 3.4 is empirical; reptation theory alone predicts 3.
- η₀ | zero-shear melt viscosity, the viscosity at very low flow rates
- M_w | weight-average molar mass
- M_c | critical molar mass, about two to three times the entanglement molar mass
step: Virgin resin against M_c: (249,900 ÷ 31,000)^3.4 = 1,207 times η₀ at M_c
step: The same ratio on a linear law would be 249,900 ÷ 31,000 = 8.1
step: Regrind against virgin: (215,000 ÷ 249,900)^3.4 = 0.600
```

The lower line describes chains too short to entangle. Each chain moves through a sea of its neighbours, feeling only friction, and the friction on a chain is proportional to its number of segments, so viscosity is proportional to molar mass. This is described by the Rouse model, named after the physicist who developed it.

The upper line describes entangled chains. Above M_c, every chain is threaded through so many others that it cannot move sideways. It is confined to a tube formed by its neighbours and can relax only by sliding along its own length, out of one end of its tube and into a new one. This picture, called reptation, was proposed by de Gennes and developed by Doi and Edwards. The time to escape the tube grows as the cube of the chain's length, which predicts η₀ ∝ M³. The observed 3.4 is a little steeper, because real chains also relax by fluctuations of their ends and by the movement of the tube itself, effects that matter more for shorter chains and so steepen the curve over the practical range.

## The crossover

The two lines do not meet in a sharp corner; the change from one regime to the other is spread over a factor of about two in molar mass around M_c. Physicists studying critical phenomena use the word crossover for exactly this: a region where one scaling law gives way to another, controlled by a ratio, here M ÷ M_c. Engineers need two practical facts about it. First, almost every commercial thermoplastic is far above M_c, so the 3.4 law is the one that applies to resins. Second, low-molar-mass additives, waxes and the shortest chains in a broad distribution sit near or below M_c, where viscosity follows molar mass only linearly.

```figure
type: line
title: Melt viscosity against molar mass, on logarithmic axes
x: log₁₀ of molar mass, g/mol
y: log₁₀ of η₀ relative to η₀ at M_c
caption: A slope of 1 below the teaching critical molar mass of 31,000 g/mol, where log₁₀ M = 4.49, and of 3.4 above it. A real curve rounds off the corner over about a factor of two in molar mass. The workshop's resin, at log₁₀ M = 5.40, has about 1,200 times the viscosity it would have at M_c.
mark: 4.49 | M_c
mark: 5.40 | virgin resin
- 3.70 | −0.79
- 4.00 | −0.49
- 4.30 | −0.19
- 4.49 | 0.00
- 4.70 | 0.71
- 5.00 | 1.73
- 5.40 | 3.08
- 6.00 | 5.13
```

For polystyrene this book uses a teaching critical molar mass of 31,000 g/mol, of the order reported for it. The workshop's resin at 249,900 g/mol is eight times M_c, so its melt viscosity is (249,900 ÷ 31,000)^3.4 = **1,207 times** the viscosity it would have at M_c. A linear law would give only eight times. That ratio is the reason long-chain polymers are so viscous, and so tough.

## Applying the 3.4 law to the workshop's resin

The law's practical value is in comparing materials of the same polymer at the same temperature. Ratios of viscosity follow ratios of M_w raised to the power 3.4, without needing to know the absolute viscosity.

- **Regrind against virgin.** With M_w falling from 249,900 to 215,000 g/mol, a 14% fall, η₀ falls to (215,000 ÷ 249,900)^3.4 = **0.600** of the virgin resin's, a 40% fall.
- **The 28.4% blend against virgin.** At the blend's M_w of 240,000 g/mol, η₀ is (240,000 ÷ 249,900)^3.4 = **0.872** of the virgin resin's.
- **A third pass.** Chapter 4's third-pass regrind had M_v of 179,200 g/mol; with the same ratio of M_v to M_w as the virgin resin, its M_w is about 195,300 g/mol and its η₀ is **0.433** of the virgin resin's, less than half.

These ratios assume that the blend's viscosity follows its M_w. For blends of the same polymer with similar distributions, that is a good approximation. For blends of very different distributions, the long-chain tail has a disproportionate effect, and measuring the blend is better than calculating it.

## Melt flow rate as a molar mass gauge

Most resin data sheets quote a melt mass-flow rate, measured under ISO 1133 or a similar method: the mass of melt, in grams per 10 minutes, extruded through a standard die under a standard load at a standard temperature. The test runs at a fixed stress, so a less viscous melt flows faster, and at low enough stresses the melt flow rate is roughly inversely proportional to the zero-shear viscosity. That makes it a convenient, if approximate, gauge of M_w:

MFR ∝ 1 ÷ η₀ ∝ M_w^−3.4.

This is an illustration: the workshop's virgin lot has a melt flow rate of 3.0 g/10 min at the standard condition its supplier uses. By the 3.4 law, the regrind would be expected at about 3.0 ÷ 0.600 = **5.0 g/10 min**, the 28.4% blend at 3.0 ÷ 0.872 = **3.4 g/10 min** and the third-pass regrind at 3.0 ÷ 0.433 = **6.9 g/10 min**.

```figure
type: compare
title: Predicted melt viscosity and melt flow rate by material
rowhead: Material
cols: M_w | η₀ relative to virgin | Predicted MFR
caption: By the 3.4 law from the virgin lot's illustrative MFR of 3.0 g/10 min. The prediction assumes MFR is inversely proportional to zero-shear viscosity, which holds only roughly, because the test's stress already causes some shear thinning.
- * Virgin lot | 249,900 g/mol | 1.000 | 3.0 g/10 min
- 28.4% regrind blend | 240,000 g/mol | 0.872 | 3.4 g/10 min
- Regrind, two passes | 215,000 g/mol | 0.600 | 5.0 g/10 min
- Regrind, three passes | about 195,300 g/mol | 0.433 | 6.9 g/10 min
```

The inverse relation is only approximate. The test's load produces a shear rate at which polystyrene is already somewhat shear-thinning, and broad distributions shear-thin more than narrow ones. Two resins with the same M_w but different breadths can therefore have different melt flow rates. The 3.4 law is a guide for comparing similar materials, and a measured melt flow rate is always better than a calculated one.

## The error: a melt flow rate read as a chain length

This is an illustration. A new lot of virgin resin arrived with a certificate showing a melt flow rate of 3.6 g/10 min, 20% above the usual 3.0. A purchasing officer, reading the certificate, reasoned that a 20% higher flow meant correspondingly shorter chains, a fall in M_w from about 250,000 to 250,000 ÷ 1.2 = 208,000 g/mol, worse than the regrind. They placed the lot on hold and asked the supplier for a replacement.

The workshop's quality engineer checked the reasoning against the 3.4 law. A 20% rise in melt flow rate means η₀ is 1 ÷ 1.2 = 0.833 of the usual value, so M_w is (0.833)^(1 ÷ 3.4) = **0.948** of the usual value: about 5% lower, around 237,000 g/mol. A 5% difference in M_w is within the normal variation between lots of a commodity resin, though it leaves this lot just below the 240,000 g/mol the workshop requires of its hopper blend.

```figure
type: bars
title: Fall in Mw implied by a 20% rise in melt flow rate
unit: %
caption: Reading melt flow rate as proportional to chain length overstates a change in Mw by a factor of about four. The 3.4 law, confirmed here by intrinsic viscosity, gives about 5%.
- Assumed by the purchasing officer (linear) | 16.7 | Mw about 208,000 g/mol
- * By the 3.4 law | 5.2 | Mw about 237,000 g/mol
```

The engineer confirmed it with the intrinsic viscosity test of Chapter 4. A 5.2% fall in molar mass predicts an intrinsic viscosity of 0.8187 × 0.948^0.73 = 0.787 dL/g, and the lot measured 0.789 dL/g, within the specification. The lot was released on condition that it be mixed half and half with the remaining stock of the previous lot, giving a virgin blend of about 243,000 g/mol, and that no regrind be added until it was used up. The general lesson was added to the purchasing checklist: melt flow rate is very sensitive to chain length, so a modest change in melt flow rate means only a small change in the chains.

## The short-chain tail

The 3.4 law applies to chains above M_c, but every broad resin has a tail below it. In the workshop's virgin distribution of Chapter 2, the slice at 20,000 g/mol, 7% of the mass, lies below the teaching M_c of 31,000 g/mol. Those chains are too short to entangle. In the melt they act less like polymer and more like a viscous diluent: they move through the entangled network of longer chains, lowering the melt's viscosity somewhat, and they contribute little to its elasticity.

In the solid, the same short chains carry little load. A crack in a glassy polymer is bridged by fibrils of drawn polymer, called crazes, and a craze is only stable if the chains crossing it are long enough to be anchored by entanglements on both sides. Short chains pull out instead. That is the physical basis for the rule of thumb in Chapter 2 that toughness tracks M_n: a resin with a large short-chain tail, and so a low M_n, has a larger share of chains that cannot hold a craze together.

The practical consequence is that two resins with the same melt flow rate can differ in toughness. A resin made more free-flowing by adding a short-chain tail, or by mixing in a low-molar-mass processing aid as in Chapter 2, keeps its M_w and melt flow rate close to the original but loses some of the long-chain anchoring that resists cracking. A moulder choosing between a high-flow grade and a standard one should ask for M_n as well as the melt flow rate, and for impact data on parts, not only on test bars.

Branching changes the picture too. Long branches entangle and relax differently from linear chains, and a branched resin can have a much higher low-shear viscosity and melt strength than a linear one of the same M_w, while flowing similarly at high shear. General-purpose polystyrene is essentially linear, so the 3.4 law applies; for branched polymers such as low-density polyethylene, it does not, and the maker's flow data must be used.

## Temperature and shear rate

Melt viscosity also depends steeply on temperature, typically falling by several per cent per kelvin in the moulding range, and on shear rate, falling as the melt is sheared faster. Both effects are large, and both are why moulding conditions, not only resin properties, govern how a mould fills. The 3.4 law compares resins at the same temperature and at low shear; it does not replace the resin's viscosity data at moulding conditions, which moulding simulations need.

Shear thinning is itself a consequence of entanglement. At low shear rates, chains have time to reptate out of their tubes as the melt flows; at high rates, they are dragged faster than they can relax, line up with the flow and slide past each other more easily. The longer the chains, the longer their relaxation time and the lower the shear rate at which thinning starts. That is why the longest chains, measured by M_z, have so much influence on how a melt behaves in a fast-filling mould, and why Chapter 2 linked M_z to melt elasticity.

## How this applies to a small Australian business

The 3.4 power law gives a moulder a quick way to interpret every melt flow rate, regrind ratio and lot change, and to set expectations for how a process will respond. A 10% loss of chain length makes the melt about 30% less viscous at the same temperature; a 20% rise in melt flow rate means only about 5% shorter chains. Reading the numbers that way turns a supplier's certificate into useful information, and stops small, normal variations from being mistaken for large, abnormal ones, or the reverse.

## Exercise: a lower-flow lot

A lot arrives with a melt flow rate of 2.4 g/10 min against the usual 3.0, measured under the same conditions. Using the 3.4 law, estimate the change in its M_w and its intrinsic viscosity with the teaching Mark–Houwink exponent of 0.73. Should it be accepted against the workshop's intrinsic viscosity specification of 0.78 to 0.92 dL/g?

**Worked answer.** η₀ is 3.0 ÷ 2.4 = 1.25 times the usual value, so M_w is 1.25^(1 ÷ 3.4) = **1.068** times the usual, about 266,900 g/mol, 6.8% higher. The intrinsic viscosity scales as M^0.73, so it is about 0.8187 × 1.068^0.73 = **0.859 dL/g**, within the specification. The lot is acceptable on molar mass, but its melt will be 25% more viscous at the same temperature, so the first moulding run should be watched for short shots and the injection pressure or melt temperature adjusted if needed.
