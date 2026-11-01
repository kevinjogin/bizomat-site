---
book: polymer-chains-by-the-numbers
chapterSlug: flory-huggins-and-cloud-points
order: 7
title: "Mixing and demixing: Flory–Huggins and the cold cement"
description: "Use Flory–Huggins theory to see why long chains leave a marginal solvent, estimate χ from solubility parameters, find cloud, spinodal and critical temperatures, and check a cement for cold storage."
draft: false
---

A solution of a polymer is a delicate thing. Small molecules mix freely because mixing gives them a large gain in entropy: there are vastly more ways to arrange two kinds of molecule mixed than separated. A long chain gets almost none of that gain, because its segments are tied together and cannot be arranged independently. So the small energy penalty that a marginal solvent carries, which small molecules would shrug off, is enough to make the chains separate out. The temperature at which they do, for a given concentration, is the cloud point, and below it a clear solution turns milky.

This chapter sets out the Flory–Huggins theory that describes this, derives its critical point, estimates the interaction parameter χ from solubility parameters, and uses a WORKOS tool to check the workshop's cement against cold storage. It ends with the thinned cement from Chapter 3 going cloudy in a winter shed.

## The free energy of mixing

Flory and Huggins, working independently in the early 1940s, described a polymer solution as a lattice of sites, each holding either one solvent molecule or one segment of a chain, with each chain occupying N connected sites. The free energy of mixing per site, in units of k T, is

ΔG ÷ (k T) = (φ ÷ N) ln φ + (1 − φ) ln(1 − φ) + χ φ (1 − φ),

where φ is the volume fraction of polymer. The first two terms are the entropy of mixing, always favourable. The third is the interaction: χ measures how much a polymer segment and a solvent molecule dislike being neighbours, in units of k T.

The key is the factor 1 ÷ N in the first term. A chain of N segments contributes only one Nth of the mixing entropy its segments would contribute as free molecules, because its segments move as a body. For the workshop's polystyrene in its cement solvent, N is about 1,800 solvent-sized sites, so the polymer's share of the mixing entropy is tiny, and the solvent's entropy and the interaction decide almost everything. [Entropy by the Numbers](/reados/publications/entropy-by-the-numbers/) treats entropy in plant engineering; this chapter shows how the entropy of mixing behaves when one component is a long chain.

```figure
type: formula
title: Flory–Huggins free energy and its critical point
formula: ΔG ÷ kT = (φ ÷ N) ln φ + (1 − φ) ln(1 − φ) + χ φ (1 − φ)
formula: Critical point: χ_c = ½ (1 + 1 ÷ √N)²   φ_c = 1 ÷ (1 + √N)
caption: Per lattice site of one solvent molecule's volume. For long chains the critical χ approaches ½ and the critical concentration approaches zero, so phase separation begins in quite dilute solutions.
- φ | volume fraction of polymer
- N | chain length in solvent-molecule volumes: polymer molar volume ÷ solvent molar volume
- χ | interaction parameter: positive means segments and solvent dislike each other
step: Workshop's chain: N = (250,000 ÷ 1.05) ÷ (113 ÷ 0.87) = 238,100 ÷ 129.9 = 1,833
step: χ_c = ½ (1 + 1 ÷ √1,833)² = 0.524; φ_c = 1 ÷ (1 + 42.8) = 2.3%
step: With the z-average correction for a polydisperse resin: χ_c = 0.524, φ_c = 2.9%
```

## Binodal, spinodal and the critical point

For χ below the critical value, the free energy curve against φ is everywhere curved upwards and any mixture is stable as one phase. Above it, the curve develops two minima, and mixtures between them lower their free energy by splitting into a polymer-poor phase and a polymer-rich phase. The compositions of the two coexisting phases trace a curve called the binodal; a solution crossing it is at its cloud point. Inside the binodal lies a second curve, the spinodal, where the free energy curve changes from upward to downward curvature.

Between the two curves a solution is metastable: it can stay clear for a while, because forming the first droplets of a new phase costs energy, but it will eventually separate, faster if disturbed or seeded. Inside the spinodal it is unstable and separates at once, throughout its volume. The binodal and spinodal touch at the critical point, the top of the two-phase region in a plot of temperature against concentration.

The critical point is where the theory's own simplicity shows. Flory–Huggins is a mean-field theory: it replaces the fluctuating local composition with an average. Close to a critical point, composition fluctuations grow large and long-ranged, and the true shape of the boundary near its peak differs from the mean-field shape, with exponents belonging to the same family as liquid–gas and magnetic critical points. Away from the critical point, and for long chains, mean-field theory is a good engineering approximation, but cloud temperatures near the peak of the curve should be treated as estimates.

## Estimating χ

χ can be measured, but for screening it is often estimated from solubility parameters, which Chapter 8 discusses in more detail. A common form is

χ = χ_S + V₁ (δ₁ − δ₂)² ÷ (R T),

where V₁ is the solvent's molar volume, δ₁ and δ₂ are the solubility parameters of solvent and polymer, and χ_S is an empirical entropic term, often taken as about 0.34. The second term falls as temperature rises, so χ falls and the solvent gets better as the solution warms, the behaviour called an upper critical solution temperature. That is why the problem in this chapter appears in winter.

This is an illustration. For the workshop, the cement solvent is treated as one liquid of molar mass 113 g/mol and density 0.87 g/cm³, a molar volume of 129.9 cm³/mol. Polystyrene's teaching solubility parameter is 19.3 MPa½. The original blend of ethyl acetate and d-limonene has a teaching total solubility parameter of 17.8 MPa½; the blend with 12% of the cheaper aliphatic thinner, 17.35 MPa½, as Chapter 8 calculates. The cement's 16% polystyrene by mass is 13.6% by volume, since polystyrene is denser than the solvent.

## Checking the cement with the phase tool

The [polymer solution phase check tool](/tools/polymer-solution-phase-check/) applies Flory–Huggins theory to a polymer in a solvent, or to a blend of two polymers. From the components' molar masses, densities and solubility parameters, the entropic part of χ and the temperature, it calculates χ, the spinodal χ at the polymer fraction from the weight-average chain length, the critical concentration and χ from the weight- and z-average chain lengths, and the binodal or cloud-point χ for a uniform chain of the weight-average length. It converts each to a temperature, reports whether the mixture is one phase, metastable or unstable, checks the margin above the cloud temperature, and tabulates the phase boundary.

For the thinned cement at 13.6% polymer by volume, with M_w = 250,000 g/mol, M_z ÷ M_w = 1.68 and a required margin of 10 K, it gives at 20 °C:

- χ = **0.5426**, against **0.5545** at the binodal and 0.5807 at the spinodal: **one phase**;
- estimated cloud temperature **3.7 °C**, spinodal temperature −26.4 °C, critical temperature 48.9 °C;
- a margin of 16.3 K above the cloud point, more than the 10 K required.

At 5 °C the same tool gives χ = 0.5536, just below the binodal: **one phase, small margin**, only 1.3 K above the estimated cloud point. For the original blend at 17.8 MPa½, χ is 0.4599 at 20 °C and the estimated cloud temperature is −109 °C, which means no clouding at any temperature the workshop will see.

```figure
type: line
title: Cloud and spinodal temperatures of the thinned cement by polymer fraction
x: Polymer volume fraction, %
y: Temperature, °C
legend: Cloud temperature (binodal) | Spinodal temperature
caption: From the polymer solution phase check tool, solvent 17.35 MPa½, polystyrene 19.3 MPa½, M_w 250,000 g/mol, χ_S = 0.34. Teaching values and mean-field estimates. The cement at 13.6% clouds below about 4 °C, but the same solution diluted to 10% clouds below about 22 °C, and dilute solutions are two-phase well above room temperature.
mark: 13.6 | cement
- 0.5 | 41.1 | 0.5
- 1 | 46.8 | 35.7
- 2 | 50.2 | 50.0
- 2.9 | 49.8 | 48.9
- 5 | 44.2 | 36.6
- 10 | 21.7 | −1.0
- 13.6 | 3.7 | −26.4
- 20 | −27.0 | −65.7
- 30 | −69.4 | −114.8
```

The shape of the curve is the most important result. The cloud temperature is highest near the critical concentration, about 3% polymer, and falls steeply at higher concentrations. A concentrated cement is therefore much more tolerant of a marginal solvent than a dilute one. That explains the hazy dilute test solution of Chapter 3, and it predicts the second problem in the error below.

## How sensitive the estimate is

Estimating χ from solubility parameters is a screening method, not a measurement. The cloud temperature depends on the difference δ₁ − δ₂ squared, and small uncertainties in either parameter move it a long way. Running the tool with the solvent at 17.45, 17.4, 17.35 and 17.3 MPa½, with everything else unchanged, gives cloud temperatures for the cement of −23.9, −10.3, 3.7 and 18.1 °C: about 14 K for each 0.05 MPa½. Solubility parameters are rarely known better than about ±0.5 MPa½.

```figure
type: compare
title: Estimated cloud temperature of the 16% cement by solvent solubility parameter
rowhead: Solvent δ₁
cols: χ at 20 °C | Cloud temperature | State at 5 °C
caption: From the polymer solution phase check tool with the workshop's other inputs, cement at 13.6% polymer by volume. A change of 0.1 MPa½ in one parameter moves the cloud point by about 28 K, which is why the estimate must be confirmed by a cooling test.
- 17.8 MPa½ (original blend) | 0.4599 | −109 °C | one phase
- 17.4 MPa½ | 0.5324 | −10.3 °C | one phase
- * 17.35 MPa½ (thinned blend) | 0.5426 | 3.7 °C | one phase, 1.3 K margin
- 17.3 MPa½ | 0.5532 | 18.1 °C | metastable
```

The conclusion is not that 3.7 °C is the cloud point of the thinned cement. It is that the thinned cement is close enough to its cloud point that winter temperatures could reach it, and that the original blend is nowhere near. The decision follows from that, and a cooling test confirms it.

## The error: a cement that clouded in July

This is an illustration. The thinned cement passed its release check, which was a visual inspection at 20 °C in the laboratory. It was decanted into working pots and stored overnight in the solvent shed. On a July morning after a 2 °C night, the pots were milky, with a thin, polymer-rich layer settling at the bottom of some. Joints made with it after it was stirred back to clarity in the warm assembly room were weak, and the cement had also run, as Chapter 3 described. Worse, a pot that had been thinned to about 10% for brushing long joints was cloudy even in the assembly room at 18 °C.

The quality engineer ran the phase tool and got the results above. At its full concentration, the thinned cement's estimated cloud point was within two degrees of the night's minimum, and diluted to 10% its cloud point, about 22 °C, was above the assembly room's temperature. A sample of the full-strength cement in the laboratory refrigerator at 2 °C went hazy within two hours, confirming the estimate. A sample of the original blend stayed clear.

The thinner was withdrawn, as Chapter 3 recorded, and two lasting changes followed. The cement release check now includes a refrigerator test: a sealed sample held at 2 °C for four hours must stay clear, and so must a sample diluted to the weakest strength the assembly area uses. And the solvent shed has a minimum-temperature thermometer, read at the start of each shift, so that a cold night is noticed before cement from the shed is used.

## Regrind and the cloud point

Shorter chains are slightly more soluble, because each contributes a little more mixing entropy. Running the tool for regrind of M_w 215,000 g/mol in the thinned solvent lowers the estimated cloud temperature of the cement from 3.7 °C to 2.9 °C. The effect is real but small compared with the effect of the solvent. A polydisperse resin also clouds over a range, because its longest chains, which are least soluble, separate first; the tool's cloud temperature, for a uniform chain of the weight-average length, is a central estimate within that range.

## Why most polymers do not mix with each other

The same theory explains a fact every recycler knows: two different polymers almost never form a single phase. For a blend of two polymers with chain lengths N₁ and N₂, both entropy terms are divided by a chain length, and the critical interaction parameter becomes χ_c = ½ (1 ÷ √N₁ + 1 ÷ √N₂)². For two polymers each about 2,000 segments long, that is ½ × (2 ÷ 44.7)² = **0.001**. Almost any chemical difference between two polymers gives a χ larger than that, so almost every pair separates.

The tool handles this case too, by entering a second polymer's molar mass and density as component 1. The practical consequence for the workshop is in its regrind. If flakes of another plastic, such as ABS from a neighbouring job or a polypropylene cap, get into the polystyrene regrind, they will not dissolve into it in the melt. They form separate particles with weak interfaces, which become sites for cracks and delamination in the moulded housings. Keeping regrind streams segregated by polymer, and inspecting regrind for foreign material, is therefore not fussiness; it follows directly from a free energy of mixing divided by chain length.

## How this applies to a small Australian business

Polymer solutions that are clear in the warm can separate in the cold, and dilute solutions separate first. Any business that stores cements, coatings, adhesives or inks in unheated space should test a sample in a refrigerator before relying on it through winter, and should treat a change of solvent or thinner as a change that needs that test again. The phase tool gives a quick estimate and shows which way a change will push the cloud point; the refrigerator test gives the answer.

## Exercise: a warmer cabinet

The workshop considers keeping the thinned cement but storing it in an insulated cabinet that never falls below 12 °C. Using the tool's results for the thinned cement at full strength (cloud temperature 3.7 °C), what is the margin above the cloud point at 12 °C? Does it meet the workshop's rule of 10 K? What else would make the workshop reluctant to keep the thinned cement?

**Worked answer.** The margin is 12 − 3.7 = **8.3 K**, below the 10 K rule, so storage at 12 °C would not meet it. Even if it did, the estimate is uncertain by more than the margin, since 0.05 MPa½ in a solubility parameter moves the cloud point by about 14 K; the cement would still go cloudy at room temperature if diluted to 10% or less, where the estimated cloud point is about 22 °C or higher; and Chapter 3 showed that the thinned blend makes weaker joints even when clear. The original blend avoids all three problems.
