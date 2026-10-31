---
book: solvent-vapours-by-the-numbers
chapterSlug: blends-raoults-law-and-mixed-vapours
order: 3
title: "Blends, Raoult's law and mixed vapours"
description: "The vapour above a solvent blend by Raoult's law, why it is richer in the volatile parts, the flammable limit of mixed vapours by Le Chatelier's rule, and how blends change as they evaporate."
draft: false
---

Few workshop solvents are pure. Thinners, cleaners and the solvent part of paints and adhesives are blends, chosen so that some parts evaporate quickly and others slowly. A blend's vapour is not a scaled-down copy of the liquid: the volatile parts are over-represented in it, and the blend changes composition as it evaporates. Both facts change how fast a blend releases vapour, at what concentration that vapour can burn, and what is left behind.

This chapter works out the vapour above Plant S's thinner with Raoult's law, finds its lower flammable limit with Le Chatelier's rule, follows the blend as it evaporates, and notes where real blends depart from the simple rules. Its error is treating a blend as if it were its main ingredient.

## Raoult's law

For an ideal solution, each component contributes to the vapour in proportion to its share of the molecules in the liquid. The partial pressure of component i above the liquid is its mole fraction in the liquid multiplied by the vapour pressure of the pure component at the same temperature. The total vapour pressure is the sum of the partial pressures, and the composition of the vapour follows from the partial pressures.

```figure
type: formula
title: Raoult's law for an ideal blend
caption: Mole fractions, not mass or volume fractions. The law holds well for chemically similar components and only approximately for dissimilar ones, as noted later in the chapter.
- pᵢ = xᵢ Pᵢ* | partial pressure of component i, from its liquid mole fraction xᵢ
- step: P = Σ pᵢ | total vapour pressure of the blend
- step: yᵢ = pᵢ ÷ P | mole fraction of component i in the vapour
- step: saturated concentration = P ÷ P_total | volume fraction of vapour in the headspace
```

Mole fractions come from the mass fractions divided by the molar masses. The thinner's recipe, 50% toluene, 25% 2-butanone and 25% ethyl acetate by mass, becomes, per 100 g: 50 ÷ 92.14 = 0.543 mol of toluene, 25 ÷ 72.11 = 0.347 mol of 2-butanone and 25 ÷ 88.11 = 0.284 mol of ethyl acetate, 1.173 mol in all. The mole fractions are 0.463, 0.296 and 0.242. Toluene is half the mass but under half the molecules, because its molecules are the heaviest of the three.

## The vapour above Plant S's thinner

```figure
type: compare
title: The thinner and its vapour at 20 °C
rowhead: Component
cols: Mass fraction in liquid | Mole fraction in liquid | Pure vapour pressure | Partial pressure | Mole fraction in vapour
caption: This is an illustration of the recipe; the vapour pressures are the 20 °C values from Chapter 2. The vapour is about 80% 2-butanone and ethyl acetate although they are only half the liquid.
- Toluene | 50% | 0.463 | 2.91 kPa | 1.35 kPa | 0.198
- 2-Butanone | 25% | 0.296 | 10.40 kPa | 3.07 kPa | 0.452
- Ethyl acetate | 25% | 0.242 | 9.84 kPa | 2.38 kPa | 0.350
- * Blend | 100% | 1.000 | | 6.80 kPa | 1.000
```

The total vapour pressure, 6.80 kPa, is 2.3 times that of toluene alone, and the saturated headspace above the thinner holds 6.80 ÷ 101.325 = 6.71% vapour by volume. The vapour is dominated by the two lighter, more volatile components: 2-butanone makes up 45% of it and ethyl acetate 35%, while toluene, half the liquid, is only 20% of the vapour.

## The flammable limit of a mixed vapour

Each component has its own lower explosive limit: 1.1% for toluene, 1.4% for 2-butanone and 2.0% for ethyl acetate, from the NIOSH Pocket Guide. For a mixture of flammable vapours, the limit is estimated by Le Chatelier's mixing rule, proposed in 1891 for mixtures of mine gases. Each component contributes its share of the mixture divided by its own limit, and the reciprocal of the sum gives the limit of the mixture.

```figure
type: formula
title: Le Chatelier's rule for the lower flammable limit of mixed vapours
caption: The yᵢ are mole fractions of each component within the flammable vapour only, excluding air. The rule is an approximation that works well for similar hydrocarbons and oxygenated solvents; it is less reliable for very dissimilar fuels and for upper limits.
- LEL_mix = 1 ÷ Σ (yᵢ ÷ LELᵢ) | lower explosive limit of the mixed vapour
- step: 1 ÷ (0.198 ÷ 1.1 + 0.452 ÷ 1.4 + 0.350 ÷ 2.0) | for the thinner's vapour
- step: = 1 ÷ (0.180 + 0.323 + 0.175) = 1 ÷ 0.678 | the sum of the shares
- step: LEL_mix = 1.475% | between the components' limits, nearer toluene's and 2-butanone's
```

The saturated headspace at 6.71% is 4.55 times this limit. Above a container of thinner at 20 °C, the vapour is well into the flammable range.

### The temperature at which the vapour reaches the limit

A useful single number for a flammable liquid is the temperature at which its saturated vapour just reaches the lower explosive limit. Below it, the headspace above the liquid is too lean to burn; above it, it can burn. The idea is close to that of the flash point, which is measured in a standard apparatus and governs classification; Chapter 4 compares the two for each of Plant S's solvents and explains why they differ by a few degrees.

For the thinner, the engineer solved for the temperature at which the blend's saturated concentration equals its own Le Chatelier limit, recalculating each component's vapour pressure with the Clausius–Clapeyron relation at each trial temperature. The result was about −7.4 °C. For pure toluene the same calculation gives about 3.0 °C. The blend reaches a flammable headspace about 10 K colder than its main ingredient.

## The error: treating the blend as toluene

The plant's chemical register listed the thinner by its largest ingredient: "toluene-based thinner". The first assessment of the gun-washing drum then used toluene's properties throughout: a vapour pressure of 2.91 kPa at 20 °C, a lower explosive limit of 1.1%, and a temperature of about 3 °C at which the headspace becomes flammable. It concluded that on cold winter mornings below about 3 °C, the drum's headspace would be too lean to burn.

```figure
type: compare
title: The thinner assessed as toluene and as the blend it is
rowhead: Property at 20 °C
cols: Treated as toluene | Treated as the blend
caption: This is an illustration. Raoult's law for the vapour and Le Chatelier's rule for the limit. Treating the blend as its main ingredient understated its vapour pressure 2.3-fold and put the temperature at which it becomes flammable about 10 K too high.
- Vapour pressure | 2.91 kPa | 6.80 kPa
- Saturated headspace | 2.87% | 6.71%
- Lower explosive limit of the vapour | 1.1% | 1.475%
- Headspace as a multiple of the limit | 2.6 times | 4.55 times
- * Liquid temperature at which the headspace reaches the limit | about 3 °C | about −7.4 °C
```

The error mattered in two ways. It understated the vapour released from the open drum by more than half, because the volatile components it ignored produce most of the vapour. And it put the temperature at which the headspace becomes flammable about 10 K too high, which made winter mornings look safe when they were not: Plant S's workshop rarely falls below 5 °C, and at that temperature the thinner's headspace is still well above its limit.

A safety data sheet for a blend usually gives the blend's flash point and flammable limits, measured or estimated by the supplier, and those should be used in preference to any calculation. The plant had the data sheet; the register had simply abbreviated its name.

The fix was clerical but important. The register was rewritten to list every blend by its product name with its main components and their approximate proportions from the safety data sheet, and with the blend's own flash point and limits beside them. A short note under each blend recorded which component dominates the vapour, because that component, not the largest one in the liquid, decides how the blend behaves in a headspace, a duct or a detector. For the thinner, the note read: vapour mostly 2-butanone and ethyl acetate; behaves as a fast, low-flash solvent.

## How a blend changes as it evaporates

Because the vapour is richer in the volatile components than the liquid is, evaporation strips them out first. An open container of thinner gradually becomes mostly toluene. The engineer followed the change by assuming each component evaporates in proportion to its partial pressure, a reasonable approximation when air movement is the same for all of them.

```figure
type: compare
title: The thinner's composition as it evaporates from an open container at 20 °C
rowhead: Share of the original mass evaporated
cols: Toluene in the remaining liquid, by mass | Blend vapour pressure | Lower explosive limit of its vapour
caption: This is an illustration. Each component's evaporation taken as proportional to its partial pressure by Raoult's law. The volatile components leave first; by the time 80% has gone, the remainder is over 90% toluene by mass.
- Fresh | 50% | 6.80 kPa | 1.48%
- 50% evaporated | 70% | 5.27 kPa | 1.38%
- * 80% evaporated | 92% | 3.55 kPa | 1.20%
- 90% evaporated | 98% | 3.05 kPa | 1.13%
```

This fractionation has practical effects. Thinner left open in a gun-washing drum loses its fast components and cleans less well, so operators top it up with fresh thinner, and the drum's contents drift towards a toluene-rich mixture. Paint thinned with a partly evaporated thinner behaves differently in the spray gun and flashes off more slowly. And waste thinner sent to a recycler is not the same composition as the thinner bought, which matters to the recycler and, in Chapter 10, to the plant's own still.

## Why paint makers blend fast and slow solvents

Plant S's paint supplier blends solvents for a reason that the fractionation table makes clear. A coating needs fast solvents to leave quickly after spraying, so the wet film thickens and does not run down vertical surfaces, and slow solvents to stay behind a little longer, so the film can flow out smooth and release trapped air before it sets. As the film flashes off, its solvent composition shifts from the blend that was sprayed towards the slowest component, just as the open container does, but in minutes instead of days.

Adding thinner changes that balance. The plant's thinner is relatively fast, about 80% of its vapour coming from 2-butanone and ethyl acetate, so thinning the paint heavily on a hot day makes the film lose solvent faster at first. That speeds the evaporative cooling Chapter 6 discusses, and it can leave too little slow solvent for the film to level. Paint suppliers often offer a slower thinner for hot weather for exactly this reason. Using the right one is a quality decision that is also a vapour decision, because the slow solvent still evaporates, later, in the oven.

## The upper limit and over-rich mixtures

Le Chatelier's rule can be applied to upper explosive limits too, though less reliably. For the thinner's vapour, with upper limits of 7.1% for toluene, 11.4% for 2-butanone and 11.5% for ethyl acetate, it gives 1 ÷ (0.198 ÷ 7.1 + 0.452 ÷ 11.4 + 0.350 ÷ 11.5) = 10.2%. The saturated headspace at 20 °C, 6.71%, lies between the lower and upper limits, in the flammable range. At higher temperatures the headspace rises towards and past the upper limit and becomes too rich to burn, but, as Chapter 4 shows, that is no comfort: any air entering on its way out passes back through the flammable range.

## Measuring a blend's vapour

Portable gas detectors used to check for flammable atmospheres usually read in percentage of the lower explosive limit, but they are calibrated on one reference gas. Their response to other vapours differs, sometimes by a factor of two or more, and the instrument maker publishes correction factors for common solvents. For a blend, the correction depends on the vapour's composition, which, as this chapter has shown, is not the liquid's. The practical rule is to calibrate or bump-test the detector on a gas recommended by its maker for the solvents in use, to apply the maker's factor for the dominant vapour component, and to treat readings with a margin. Exposure measurements for health need different instruments or sampling, interpreted by an occupational hygienist.

## When Raoult's law is not enough

Raoult's law assumes that the molecules of different components attract each other about as strongly as their own kind. That is close to true for mixtures of chemically similar liquids, such as toluene and xylene, and reasonable for the thinner's ketone, ester and aromatic components. It fails noticeably for dissimilar liquids. Alcohols mixed with hydrocarbons are the common workshop example: an alcohol's molecules hold each other by hydrogen bonds, which the hydrocarbon breaks up, so each component escapes more easily than Raoult's law predicts. The blend's vapour pressure is then higher than the law gives, sometimes considerably. Some such mixtures form azeotropes, compositions that boil without changing composition, which limits what distillation can separate.

For a safety screen, the direction of the error matters. A blend of an alcohol and a hydrocarbon will usually release more vapour than Raoult's law predicts, so the law understates the hazard. Measured flash points and limits from the supplier, or published activity coefficient data, are the better guide for such blends.

### Solutions of solids and resins

When a solvent carries a non-volatile resin, as in a paint or adhesive, the resin lowers the solvent's mole fraction and therefore its vapour pressure, but by less than its share of the mass suggests, because resin molecules are very large. A paint that is 40% solvent by volume behaves, in the headspace of its tin, much more like the solvent alone than like a 40% solution. Treating paints and adhesives as if their headspace were that of their solvent is a cautious and usually close estimate.

## How this applies to a small Australian business

List blends by what they contain, not by their largest ingredient, and use the supplier's data for their flash points and flammable limits. When you need to calculate, convert to mole fractions and use Raoult's law for the vapour and Le Chatelier's rule for the flammable limit. Expect the vapour to be richer in the volatile components than the liquid, expect open blends to change as they evaporate, and treat alcohol and hydrocarbon blends as likely to release more vapour than Raoult's law predicts. Keep fresh and used blends apart, label part-used containers, and do not top up an old drum of thinner with new: its composition has already drifted.

## Exercise: a cleaning blend

A cleaning blend is 70% acetone and 30% toluene by mass. (a) What are the liquid mole fractions? (b) Using 20 °C vapour pressures of 24.6 and 2.91 kPa, what are the total vapour pressure and the vapour composition? (c) With lower explosive limits of 2.5% and 1.1%, what is the vapour's lower explosive limit by Le Chatelier's rule, and how many times is the saturated headspace above it?

**Worked answer.** (a) Per 100 g: 70 ÷ 58.08 = 1.205 mol of acetone and 30 ÷ 92.14 = 0.326 mol of toluene, so **x = 0.787 acetone and 0.213 toluene**. (b) Partial pressures are 0.787 × 24.6 = 19.37 kPa and 0.213 × 2.91 = 0.62 kPa; the **total is 19.99 kPa**, and the vapour is **96.9% acetone and 3.1% toluene**. (c) LEL = 1 ÷ (0.969 ÷ 2.5 + 0.031 ÷ 1.1) = 1 ÷ (0.388 + 0.028) = **2.41%**. The saturated headspace is 19.99 ÷ 101.325 = 19.7%, about **8.2 times** the limit. The vapour is almost all acetone, so the blend behaves in the headspace much like acetone, although nearly a third of its mass is toluene.
