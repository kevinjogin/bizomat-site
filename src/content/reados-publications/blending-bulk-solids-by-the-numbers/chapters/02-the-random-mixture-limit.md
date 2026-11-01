---
book: blending-bulk-solids-by-the-numbers
chapterSlug: the-random-mixture-limit
order: 2
title: "The random-mixture limit: counting particles"
description: "Why even a perfect random blend varies from sample to sample, how the variance follows from counting particles, why the tails matter more than the average, and what changes the limit."
draft: false
---

Mix two kinds of particles as thoroughly as possible and take a small sample. It will not contain exactly the right proportion, and no amount of further mixing will make it do so. The reason is the same one that makes a handful of coins tossed on a table rarely land exactly half heads: each particle's position is a matter of chance, and the count in any sample fluctuates. Lacey, writing in the 1940s and 1950s, treated mixing as a random process and showed that this fluctuation sets a floor under every blend's uniformity.

This chapter derives that floor from counting statistics, applies it to Plant C's black lids, and shows that the plant's steady 2% of grey lids was not a fault in the doser but the arithmetic of 60 pellets. It shows why the rare light lids depend on the tail of the distribution, where common approximations are weakest, and compares the ways the plant could change the floor.

## Fluctuations big and small

Suppose a sample contains, on average, N particles of the minor component, and each particle in the blend is placed independently at random. The number actually found in a sample, n, then follows a Poisson distribution, or very nearly so, with mean N and standard deviation √N. The relative fluctuation is

σ_n ÷ N = 1 ÷ √N

This is one of the most general results in statistical physics. Kadanoff's lectures open their discussion of fluctuations with the same observation in a different setting: the energy of a large system fluctuates by a fraction that falls as one over the square root of the number of particles, so a gas in a room has a definite temperature while a few molecules do not. A blend is the same. A tonne of blend contains millions of masterbatch pellets and has an exact composition for all practical purposes; a lid contains about 60, and its composition fluctuates by about 13%.

```figure
type: bars
title: Relative fluctuation of a count, 1 ÷ √N
unit: %
caption: The relative scatter of a random count falls slowly: a hundred times more particles gives only ten times less scatter. Plant C's lid contains about 60 masterbatch pellets.
- N = 10 | 31.6
- * N = 60, one lid | 12.9
- N = 240 | 6.5
- N = 1,000 | 3.2
- N = 10,000 | 1.0
```

## The random-mixture variance by mass

Blends are usually specified by mass, and the components often have different particle masses. Counting both components independently and converting to a mass fraction gives the variance of the mass fraction x in a sample of mass M from a random mixture of two components:

σ_R² = p (1 − p) [(1 − p) m_A + p m_B] ÷ M

where p is the mass fraction of component A, m_A and m_B are the masses of single particles of A and B, and M is the sample mass. Two features matter. The variance falls in proportion to 1 ÷ M, so the standard deviation falls with 1 ÷ √M. And it rises with the particle masses, especially that of the minor component, which dominates the bracket when p is small. Large particles of a minor ingredient are the enemy of uniformity.

```figure
type: formula
title: Variance of a random two-component mixture, by mass
formula: σ_R² = p (1 − p) [(1 − p) m_A + p m_B] ÷ M     CV_R = σ_R ÷ p
caption: Derived by treating the counts of both components in a sample as independent and converting to mass fraction. When p is small and the particles are of similar mass, CV_R ≈ 1 ÷ √N, where N is the mean number of minor-component particles in the sample.
- p | mass fraction of component A in the blend
- m_A, m_B | mass of one particle of A and of B
- M | sample mass, the scale of scrutiny
- σ_R | standard deviation of the mass fraction in samples of mass M
step: Lid: p = 0.02, m_A = 0.020 g, m_B = 0.024 g, M = 60 g: σ_R² = 0.0196 × (0.0196 + 0.00048) ÷ 60 = 6.56 × 10⁻⁶
step: σ_R = 0.00256, CV_R = 12.8%; carbon black 0.80% ± 0.102% (one standard deviation)
```

For Plant C's lid, with 2% masterbatch pellets of 20 mg among natural pellets of 24 mg, the random-mixture standard deviation of the masterbatch fraction is 0.00256, a CV of **12.8%**. The carbon black content of a lid scatters around 0.80% with a standard deviation of 0.102 percentage points. That is the best the blend can be at the scale of one lid, however well it is dosed and mixed.

## From scatter to rejects

What matters to the moulding cell is not the standard deviation but the share of lids that look wrong. The plant's colour standard says a lid with less than 0.60% carbon black, three-quarters of the target, is visibly greyer and is rejected. This is an illustration. A lid falls below 0.60% when it receives fewer than 0.75 × 60 = 45 masterbatch pellets.

For a Poisson count with mean 60, the probability of 44 or fewer is **1.9%**. About one lid in fifty should be grey, from the random mixture alone.

The normal approximation, which treats the count as normally distributed with mean 60 and standard deviation 7.75, gives a z of (44.5 − 60) ÷ 7.75 = −2.00 and a probability of 2.3%. Here the approximation is close but not exact, and it gets worse further into the tail. The reason is that the Poisson distribution is skewed: its lower tail is shorter than a normal curve's. Kadanoff's lectures discuss this under the heading of large deviations: the central limit theorem describes the bulk of a distribution of sums well, but the probability of a rare, large deviation is governed by a different and less forgiving rule. For blends, that means the share of seriously off-specification units should be calculated from the count distribution, not read from a normal table, whenever the counts are small.

```figure
type: compare
title: Share of lids below 0.60% carbon black, by how the colour is added
rowhead: Option
cols: Masterbatch pellets per lid | CV of the random mixture | Share below 0.60%, Poisson | Normal approximation
caption: This is an illustration. Each option gives 0.80% carbon on average. The normal approximation overstates the tail for these counts; for rarer events the error grows. The micro-pellet option is the only one that makes the random-mixture rejects negligible.
- * 2% of 40% masterbatch, 20 mg pellets | 60 | 12.8% | 1.9% | 2.3%
- 4% of 20% masterbatch, 20 mg pellets | 120 | 9.0% | 0.19% | 0.27%
- 2% of 40% masterbatch, 5 mg micro-pellets | 240 | 6.6% | 0.002% | 0.005%
```

## The error: adjusting the doser after every bad day

This is an illustration. For a month after the black lids started, the moulding cell's reject records showed between two and six grey lids in each day's sample of 200. On any day with four or more, the supervisor had the doser recalibrated, on the reasoning that a bad day meant the doser had drifted. Recalibrations took half an hour and happened about every second day. The rejects continued at the same rate.

The engineer put ten consecutive days' results into the [p-chart check tool](/tools/p-chart-check/), which calculates the fraction defective in each sample, the average, the binomial control limits and which samples fall outside them. With 200 lids a day and daily rejects of 4, 3, 5, 2, 6, 4, 3, 5, 2 and 4, it gave an average fraction defective of **1.9%**, control limits from 0 to 4.8%, a signal threshold of 10 or more rejects in a day, and no samples outside the limits: "process in control".

```figure
type: stats
title: Ten days of grey lids on the p-chart check tool
caption: This is an illustration. The process is stable at 1.9% rejects, exactly the share the random-mixture arithmetic predicts. Recalibrating the doser after a day of four or more rejects was reacting to chance.
- 1.9% | average fraction of lids rejected for shade
- 1.9% | share expected below 0.60% carbon from 60 pellets a lid, Poisson
- 0 to 4.8% | p-chart control limits for samples of 200 lids
- 10 or more | rejects in a day that would signal a real change
```

Two numbers settled it. The process was in statistical control, so the day-to-day variation was common-cause variation, not drift. And its level, 1.9%, matched the share the random-mixture limit predicts. The rejects were the arithmetic of 60 pellets a lid. Recalibrating the doser was what quality engineers call tampering: adjusting a stable process in response to its own random variation, which cannot reduce the variation and can add to it.

The recalibrations stopped. The plant compared the options in the table above. Raising the let-down to 4% of a 20% masterbatch would cut the rejects tenfold but double the volume of masterbatch handled. Micro-pellets of 5 mg would make the random-mixture rejects negligible at the same let-down, but cost more per kilogram and need a doser that meters small pellets accurately. A mixing section on the moulding machine's screw, discussed in Chapter 8, would blend the melt over more than one shot's worth of pellets and so increase the effective count. The plant trialled the micro-pellets first. The p-chart was kept running, with its signal threshold now the trigger for investigating the doser.

## What changes the random limit

The formula shows the levers.

1. **Increase the sample, or the product unit.** σ_R falls with √M. Rarely an option, because the unit is the product.
2. **Make the minor particles smaller.** σ_R² is roughly proportional to m_A when p is small. Halving the diameter of a spherical particle cuts its mass by 8 and its contribution to the variance by 8, and the CV by √8 = 2.8.
3. **Use more of a weaker minor component.** A larger p with a lower concentration of the active ingredient raises the count of carrier particles.
4. **Mix at a finer scale.** Melting, dissolving or dispersing the component, as a compounding extruder does with filler, replaces particles by molecules or micrometre-sized fragments and makes N enormous.

None of these is "mix longer". Once a blend has reached the random limit, further mixing changes nothing, and Chapter 3 shows how to tell whether it has.

## A catch with smaller particles

Making the minor component smaller improves the random limit, but it creates a difference in size between the components, and Chapter 6 shows that size differences are the main cause of segregation. Five-milligram micro-pellets among 24 mg natural pellets are about 0.59 times the natural pellets' diameter if their shapes and densities are similar, and smaller still because a carbon-black masterbatch is denser than natural polypropylene: small enough to work down through the gaps between natural pellets whenever the blend moves. A blend that is random as it leaves the doser can unmix in a hopper, a chute or a vibrating feeder before it reaches the screw.

Plant C's doser avoids most of the risk because it meters the masterbatch directly into the throat of the moulding machine, a few centimetres above the screw, so the blend exists for only a few seconds before it is melted. The plant's trial of micro-pellets therefore kept the doser at the throat and checked the lids' carbon content at the start, middle and end of each hopper fill to catch any drift. A plant that pre-blends a whole octabin of pellets and micro-pellets and then conveys it would need to test for segregation first.

## Is a blend at the random limit?

The random-mixture variance gives a simple test of whether a blend has been mixed as well as it can be. Take n samples at the scale of scrutiny, measure the composition of each, and calculate their sample variance s². Compare it with σ_R² from the formula. If s² is close to σ_R², the blend is random and further mixing is pointless. If s² is several times σ_R², the blend is still partly segregated.

"Close" needs a statistical meaning, because a sample variance from a handful of samples is itself uncertain. For samples from a normal distribution, (n − 1) s² ÷ σ² follows a chi-square distribution with n − 1 degrees of freedom, which gives a confidence interval for the true variance. Chapter 3 works through the calculation for the plant's premix and turns the comparison into Lacey's mixing index.

For the lids, the validation repeated at the right scale in Chapter 1 found a CV of about 13% from 20 lids, against the random limit of 12.8%. The blend leaving the doser was as good as a blend of these pellets can be.

## Pellets, powders and premixes

The random limit bites hardest where particles are large and the minor component is small. Pellet blends are the worst case: particles of tens of milligrams mean small counts in any product unit. Powders are much more forgiving: a particle 50 µm across of density 1,000 kg/m³ weighs about 65 ng, so even a tiny sample contains millions. Chapter 9 uses the same formula for the stabiliser premix and shows where the limit starts to matter for powders too: for ingredients at parts per million.

## How this applies to a small Australian business

If a blended product shows a steady small share of off-colour, under-dosed or over-dosed units, work out how many particles of the minor component a unit contains before blaming the mixer, the doser or the operator. If the count is in the tens or low hundreds, the random-mixture limit may explain the whole problem, and the fix is in the particles or the formulation, not in the machine. A p-chart of the reject rate tells you whether you are looking at a stable process or a changing one; the counting arithmetic tells you whether a stable process is as good as it can be.

The same arithmetic helps when talking to suppliers. A masterbatch or additive supplier can usually tell you the pellet or particle mass, and with your let-down ratio and product mass that is enough to calculate the count per unit and the share of units that will fall outside your limits. A supplier who recommends a let-down that cannot meet your limits at your product's size has not done that calculation.

## Exercise: a 3% let-down

A supplier offers a masterbatch with 26.7% carbon black in 20 mg pellets, used at 3% to give the same 0.80% carbon. (a) How many masterbatch pellets does a 60 g lid contain on average, and what is the CV of the count? (b) Below how many pellets is a lid under 0.60% carbon, and what share of lids is that, using a Poisson distribution?

**Worked answer.** (a) 60 g × 0.03 ÷ 0.020 g = **90 pellets**; the CV of the count is 1 ÷ √90 = **10.5%**. (b) 0.60% is three-quarters of the target, so the threshold is 0.75 × 90 = 67.5 pellets: a lid with **67 or fewer** is grey. For a Poisson count with mean 90, P(n ≤ 67) is about **0.69%**, roughly a third of the present rejects. It is better than the 2% let-down but not as good as the 4% option, as the trend in the table would suggest.
