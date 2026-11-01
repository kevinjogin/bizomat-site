---
book: blending-bulk-solids-by-the-numbers
chapterSlug: minor-ingredients-and-premixes
order: 9
title: "Minor ingredients and premixes"
description: "Why ingredients at fractions of a per cent fail by counting statistics, how to calculate the particle size a minor ingredient needs, and how premixes and carrier strategies put it in every unit."
draft: false
---

The smaller an ingredient's share of a blend, the harder it is to distribute. A component at 30% is present as thousands of particles in any reasonable sample. A component at 0.1% may be present as a handful, and at a handful the random-mixture arithmetic of Chapter 2 stops being a matter of a few per cent scatter and becomes a matter of some units receiving none at all. Minor ingredients, the vitamins in a feed, the active ingredient in a low-dose tablet, the catalyst in a resin, the tracer in a product, are where blending most often fails outright.

This chapter shows how counting statistics govern minor ingredients, derives the particle size a minor ingredient needs for a given uniformity, and explains the premix and carrier strategies that solve the problem. Plant C's case is a fluorescent tracer added to its lids for a customer's anti-counterfeiting checks, and a dry blend that left one lid in twenty without any tracer.

## When the count gets small

Chapter 2 showed that the number of minor-component particles in a sample follows a Poisson distribution with mean N. For large N the scatter is about 1 ÷ √N of the mean. For small N the shape of the distribution matters more than its spread, and one probability matters most: the chance of finding none at all,

P(0) = e^(−N)

At N = 60, P(0) is about 10⁻²⁶, effectively zero. At N = 10 it is 4.5 × 10⁻⁵, about one unit in 22,000. At N = 3 it is **0.0498**, one unit in twenty. To make P(0) as small as one in a million, N must be at least −ln(10⁻⁶) = **13.8**.

```figure
type: bars
title: Share of units with none of the minor ingredient, P(0) = e^(−N)
unit: %
caption: Poisson probability that a unit receives no particles of an ingredient when it should receive N on average. Below about ten particles per unit, a noticeable share of units get nothing.
- N = 1 | 36.8
- N = 2 | 13.5
- * N = 3 | 4.98
- N = 6 | 0.25
- N = 10 | 0.0045
```

That threshold is independent of the ingredient's role. Whether the missing ingredient is a colour, a drug, a nutrient or a tracer, a blend that delivers a few particles per unit on average delivers none to a predictable share of units, however well it is mixed.

## The error: a tracer added as pellets

This is an illustration. A customer for Plant C's black lids asked for a fluorescent tracer in every lid, so that its distributors could check authenticity with an ultraviolet lamp. The tracer supplier provided a tracer masterbatch in 20 mg pellets and recommended a let-down of 0.1%. The moulding cell added it with a second small doser at the throat, beside the black masterbatch doser.

Three weeks later the customer's audit found 11 lids out of 200 with no fluorescence at all, and the customer suspended deliveries pending an investigation.

The arithmetic took a minute. A 60 g lid at 0.1% contains 0.06 g of tracer masterbatch, which is **3 pellets** on average. With a Poisson count, P(0) = e^(−3) = 4.98%: about 10 lids in 200 should have received none, and 11 did. A further 15% would have received exactly one pellet and shown a single fluorescent spot that an inspector might miss. Nothing was wrong with the dosers or the mixing; the formulation guaranteed blank lids.

```figure
type: compare
title: Tracer in a 60 g lid by how it is added
rowhead: Method
cols: Tracer-bearing particles per lid | Lids with no tracer | Comment
caption: This is an illustration. Doubling the dose barely helps; putting the tracer inside a component that is already present in large numbers solves the problem.
- 0.1% tracer masterbatch, 20 mg pellets | 3 | 5.0% | supplier's recommendation
- 0.2% tracer masterbatch, 20 mg pellets | 6 | 0.25% | twice the cost, still fails
- * Tracer compounded into the black masterbatch | 60 pellets, each carrying tracer | about 10⁻²⁶ | every lid has tracer
- Tracer pigment dispersed in the melt | millions of pigment particles | 0 | uniform at any scale
```

### Too much is a failure too

The tracer only had a lower limit: a lid with six tracer pellets was as good as one with three. Many minor ingredients have an upper limit as well. An active ingredient, a vitamin with a safe upper intake or a catalyst that degrades a product in excess must not be over-delivered either, and the Poisson distribution's upper tail is longer than its lower one. With an average of three particles per unit, 8.4% of units receive six or more, twice the intended dose. A two-sided specification for a minor ingredient therefore needs a count high enough that both tails are acceptable, which usually means the same remedies: finer particles, a carrier or a premix.

## Carry the minor ingredient on something plentiful

The cure is to stop treating the tracer as a separate particle population. If the tracer is compounded into the black masterbatch, every black pellet carries some, and a lid contains about 60 tracer-bearing pellets. Once the melt is mixed in the screw, the tracer's own pigment particles, a few micrometres across, are spread through the lid in their millions.

The masterbatch supplier needs to know how much tracer to put in the black masterbatch. The customer specified 50 ppm of tracer pigment in the lid, 0.005%. The black masterbatch is used at 2%, so it must contain 0.005 ÷ 2 × 100 = **0.25%** tracer pigment. The tracer supplier's concentrate contains 5% pigment. The [mixture cost and blending tool](/tools/mixture-cost/), in its blending mode, finds the proportions of two ingredients that blend to a target value: with plain black masterbatch at 0%, concentrate at 5% and a target of 0.25%, it gives **95% and 5%**, or 50 kg of concentrate in each 1,000 kg of black masterbatch, which the supplier adds when compounding the masterbatch.

This is the general strategy for minor ingredients: put the ingredient into, or onto, a component that is present in every unit in large numbers, at a concentration chosen so the overall dose comes out right. In feed and food it is done with premixes on a fine carrier; in pharmaceuticals, by granulating the drug with excipients or coating it onto carrier particles; in plastics, by compounding additives into a masterbatch or into the base resin.

## What an audit can prove

After the change, the customer audited 500 lids from the first deliveries and found no blank ones. That is reassuring, but it is worth knowing what it proves. With zero failures in n units, the upper 95% confidence bound on the failure rate is about 3 ÷ n, a result often called the rule of three: here 3 ÷ 500 = **0.6%**. The audit shows the blank rate is below 0.6%; it cannot show that it is below one in a million, which is what the counting arithmetic predicts. To demonstrate a rate as low as 0.01% by inspection alone would take about 30,000 lids with none blank.

That is a general limit of testing for rare failures, and it is why the design argument, the count of tracer-bearing pellets per lid and its Poisson consequence, carries most of the weight in the plant's response to the customer. The audit confirms that nothing gross is wrong; the arithmetic says how rare a blank lid should now be.

The original audit fits the same picture. Eleven blanks in 200 is 5.5%, against an expected 4.98%; with a Poisson mean of about 10 blanks in 200 lids, 11 is entirely ordinary. The investigation did not need to look for a second cause, although it checked the dosers anyway and found them within their calibration.

```figure
type: checklist
title: Before adding a minor ingredient
caption: This is an illustration. The first open item is the calculation the tracer supplier's recommendation skipped; the second is the long-term check the plant added after the change.
- ? Count of ingredient-bearing particles per unit calculated | at least about 14 for P(0) below one in a million
- x Unit mass taken from the actual product | 60 g lid, not a typical value
- x Carrier strategy chosen | tracer compounded into the black masterbatch
- x Particle size or coarse tail checked for powders | d_max from the target CV
- ? Ongoing verification | periodic UV check of retained lids, results trended
```

## How small must the particles be?

For powders, where the ingredient stays particulate in the product, the question becomes what particle size gives the uniformity required. For a minor ingredient at mass fraction p, with particles of mass m, in a unit of mass M, the mean count is N = p M ÷ m, and the CV of a random mixture is about 1 ÷ √N. Setting the CV to a target value and solving:

m = p × M × CV²

For an ingredient at 0.05% in a 1 g unit with a target CV of 2%, the particle mass must be at most 0.0005 × 1 g × 0.02² = 2 × 10⁻⁷ g, or 0.2 µg. For a spherical particle of density 1,200 kg/m³ that is a diameter of (6 m ÷ π ρ)^(1/3) = **68 µm**. Relax the target to 5% and the particle can be 126 µm.

```figure
type: formula
title: Largest particle of a minor ingredient for a target uniformity
formula: m_max = p × M × CV²     d_max = (6 m_max ÷ π ρ)^(1/3)
caption: From the random-mixture count, assuming the ingredient's particles are independent and the other components' particles are much more numerous. Particle size distributions with a coarse tail need the largest particles, not the median, to meet it.
- p | mass fraction of the minor ingredient
- M | mass of the unit or sample, the scale of scrutiny
- CV | target coefficient of variation of the ingredient's content
- ρ | particle density of the ingredient
step: p = 0.0005, M = 1 g, CV = 0.02: m_max = 2 × 10⁻⁷ g; at ρ = 1,200 kg/m³, d_max = 68 µm
step: Plant C's premix: 0.5 g at 20% stabiliser of 2.03 µg particles contains about 49,000 stabiliser particles
```

The formula has an important consequence for real particle size distributions. Mass is concentrated in the largest particles, so a powder whose median size meets the limit may still have a coarse tail carrying a large share of the ingredient in a few big particles. Specifications for minor ingredients are therefore often written on a coarse percentile, such as the size below which 90% or 99% of the mass lies, not on the median.

## Premixes and geometric dilution

A premix is a blend made at a higher concentration than the final product, so that the minor ingredient is mixed in a step where it is less minor. Plant C's stabiliser premix at 20% is an example: blending 0.2% stabiliser directly into 1,500 kg/h of feed would mean a stabiliser feeder running at 3 kg/h, near the bottom of any feeder's useful range, with pulsation from a few large flights. Pre-diluting it to 20% lets the premix feeder run at 15 kg/h, and the premix blender handles the uniformity problem in a 200 kg batch where the stabiliser is a fifth of the mass.

For very small doses, dilution is done in steps, each mixing the previous premix with an equal or a few-times larger amount of diluent, so that no single step asks a blender to distribute a tiny fraction. This geometric dilution is standard practice in pharmacy and in feed premix manufacture. Each step must itself be validated, because each can segregate, and the carrier for each step should be close in size to the ingredient, for the reasons in Chapter 6.

## How small ingredients go missing

Counting statistics are not the only way a minor ingredient fails. Small amounts are also easily lost to equipment surfaces, filters and dead zones. A fine, sticky stabiliser can coat a blender's walls and ribbon, so the first batch after cleaning is low and the walls release it into later batches. A premix that passes through a pneumatic conveying line can lose fines to the filter. A dose added to the wrong point, such as above a screw section that back-flows, can accumulate and release. Validation of a minor ingredient therefore checks the first batch after cleaning and the material balance as well as the uniformity, and Plant C's premix procedure discards the first 5 kg after a blender clean.

## Liquids as minor ingredients

Some minor ingredients arrive as liquids: oils, antistatic agents, flavours, liquid vitamins, binders. A liquid sprayed onto a moving powder bed is distributed at first in droplets, each wetting a few particles, and the counting problem then concerns droplets and wetted clusters. Fine atomisation, slow addition over many bed turnovers and a blender with good shear help. Too much liquid at once forms lumps that carry far more than their share and resist breaking up, a familiar defect in feed and dry-mix plants. Absorbent carriers, such as a porous silica, are often used to turn a liquid minor ingredient into a free-flowing powder premix that can then be blended like any other.

## How this applies to a small Australian business

For any ingredient below about 1% of a blend, calculate how many of its particles end up in one unit of product. If the answer is below about ten, a share of units will receive none, and no mixer can fix that. Ask the supplier for the particle mass or size distribution, use a finer grade, carry the ingredient on a plentiful component, or premix it in steps. And check a recommended let-down against your own unit size, because a supplier's recommendation is usually made for a typical product, not yours. The calculation takes a minute and needs only the particle mass, the dose and the unit mass.

## Exercise: a smaller tablet

A supplement maker blends a vitamin at 0.02% into 0.5 g tablets and wants a CV of 3% or better from random mixing alone. The vitamin's particles have a density of 1,400 kg/m³. (a) What is the largest particle mass that meets the target? (b) What diameter is that? (c) If the vitamin is available only at 100 µm, how many particles does a tablet contain on average, and what CV would random mixing give?

**Worked answer.** (a) m_max = 0.0002 × 0.5 g × 0.03² = **9.0 × 10⁻⁸ g**. (b) d = (6 × 9.0 × 10⁻¹¹ kg ÷ (π × 1,400))^(1/3) = (1.228 × 10⁻¹³)^(1/3) m = **50 µm**. (c) A 100 µm particle weighs π ÷ 6 × (10⁻⁴)³ × 1,400 = 7.33 × 10⁻¹⁰ kg = 7.33 × 10⁻⁷ g. The tablet holds 0.0002 × 0.5 = 1.0 × 10⁻⁴ g of vitamin, or about **136 particles**, and the CV is 1 ÷ √136 = **8.6%**, nearly three times the target. A finer grade, a premix on a fine carrier or granulation would be needed.
