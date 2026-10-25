---
book: thermit-welding-by-the-numbers
chapterSlug: the-aluminothermic-reaction
order: 1
title: "The aluminothermic reaction"
description: "Balance the reaction between aluminium and iron oxide, calculate how much iron and slag a charge yields, and check the 1921 proportions with modern atomic masses."
draft: false
---

Every thermit weld starts with a piece of chemistry that can be written on one line. Aluminium has a stronger attraction for oxygen than iron does, so when the two are mixed and heated enough to start the reaction, the aluminium takes the oxygen from the iron oxide. The products are metallic iron and aluminium oxide, and the reaction releases so much heat that both come out liquid. The iron is the weld metal; the aluminium oxide is the slag.

This chapter balances the reaction for the two iron oxides used in thermit, calculates how much iron and slag a charge produces, and checks the proportions given in 1921 against modern atomic masses. These numbers underlie the charge sizing in Chapter 4 and the heat balance in Chapter 2.

## Why aluminium takes the oxygen

Metals differ in how strongly they hold oxygen. Aluminium holds it very strongly: aluminium oxide is one of the most stable compounds known, which is why aluminium carries a tough oxide film and why its oxide must be dealt with in welding, as [Weldability by the Numbers](/reados/publications/weldability-by-the-numbers/aluminium-oxide-hydrogen-and-heat/) explains. Iron holds oxygen much less strongly. So if aluminium and iron oxide are brought together hot enough to react, the oxygen moves from the iron to the aluminium, releasing the difference in their bonding energy as heat.

TWI describes the aluminothermic reaction in the same terms: aluminium and iron oxide produce molten iron in a highly exothermic reaction, showing that iron is below aluminium in the reactivity series. Chapter 2 calculates how much heat that is.

## Balancing the reaction

Two iron oxides are used. Haematite, Fe₂O₃, is the familiar red oxide. Magnetite, Fe₃O₄, is the black magnetic oxide that forms mill scale on hot-rolled steel. Commercial thermit in 1921, according to Viall, was a mixture of finely divided aluminium and less finely divided magnetic iron scale, which is magnetite.

The balanced reactions are:

- with haematite: **Fe₂O₃ + 2Al → 2Fe + Al₂O₃**
- with magnetite: **3Fe₃O₄ + 8Al → 9Fe + 4Al₂O₃**

In each, the oxygen atoms balance: three in one haematite molecule go to one aluminium oxide molecule; twelve in three magnetite molecules go to four aluminium oxide molecules. Viall gave the magnetite reaction in exactly this form.

## From atoms to kilograms

Using modern atomic masses of aluminium 26.98, iron 55.85 and oxygen 16.00, the molar masses are:

- Fe₂O₃: 2 × 55.85 + 3 × 16.00 ≈ **159.7 g/mol**
- Fe₃O₄: 3 × 55.85 + 4 × 16.00 ≈ **231.5 g/mol**
- Al₂O₃: 2 × 26.98 + 3 × 16.00 ≈ **102.0 g/mol**

For the magnetite reaction, the masses in grams are:

- reactants: 3 × 231.5 = 694.6 g of magnetite and 8 × 26.98 = 215.9 g of aluminium, 910.4 g in all;
- products: 9 × 55.85 = 502.6 g of iron and 4 × 102.0 = 407.8 g of aluminium oxide.

The iron is 502.6 ÷ 910.4 ≈ **55.2%** of the charge by mass, and the mass ratio of oxide to aluminium is 694.6 ÷ 215.9 ≈ **3.22 to 1**.

```figure
type: formula
title: Iron yield of a magnetite thermit charge
formula: 3Fe₃O₄ + 8Al → 9Fe + 4Al₂O₃
caption: Modern atomic masses. A real charge yields less, because of impurities, additions, slag entrapment and iron lost as spatter and in the crucible.
- Fe₃O₄ | 3 × 231.5 = 694.6 g
- Al | 8 × 26.98 = 215.9 g
- Fe produced | 9 × 55.85 = 502.6 g
- Al₂O₃ slag | 4 × 102.0 = 407.8 g
step: charge = 694.6 + 215.9 = 910.4 g
step: iron yield = 502.6 ÷ 910.4 ≈ 55.2%
step: oxide to aluminium ratio = 694.6 ÷ 215.9 ≈ 3.22
```

For the haematite reaction the corresponding figures are 159.7 g of oxide and 54.0 g of aluminium, 213.6 g in all, yielding 111.7 g of iron, which is **52.3%** of the charge, with an oxide to aluminium ratio of about 2.96 to 1.

## Checking the 1921 proportions

Viall gave the magnetite reaction in weights as 217 parts of aluminium plus 732 parts of magnetite giving 540 parts of steel and 409 parts of slag, and summarised it as roughly 3 parts of aluminium and 10 parts of magnetite producing 7 parts of steel. He also said that commercial thermit was mixed at about three parts of iron scale to one part of aluminium by weight, and that the steel produced was about half the original thermit by weight and a third by volume.

```figure
type: compare
title: The magnetite reaction in 1921 and with modern atomic masses
cols: Viall, 1921 (parts by weight) | Modern atomic masses (g)
caption: The aluminium and slag agree closely; the 1921 magnetite and iron figures are higher, which may reflect older atomic weights or rounding. Both give an iron yield of a little over half the charge.
- Aluminium | 217 | 215.9
- Magnetite | 732 | 694.6
- Iron or steel produced | 540 | 502.6
- Slag | 409 | 407.8
- Iron as share of charge | 56.9% | 55.2%
- Oxide to aluminium ratio | 3.37 | 3.22
```

The modern figures confirm the shape of the 1921 numbers: a little over half the charge becomes iron, the rest becomes slag, and the oxide outweighs the aluminium by just over three to one. Hart's 1910 charge rule, used in Chapter 4, assumed that the steel was half the weight of the thermit, a round figure that sits slightly below the theoretical yield and allows for losses.

## Particle size and mixing

The proportions are only half of a thermit mixture; the particle sizes matter as much. Viall described the aluminium in commercial thermit as about like granulated sugar and the iron scale as like coarse sand. Particle size controls how fast the reaction spreads through the charge. Very fine aluminium powder has an enormous surface area and reacts far more violently; coarse granules react more steadily, so that the charge burns through in seconds rather than flashing off. Chapter 3 returns to this when it looks at ignition.

A mixture of granules of different size and density can also separate when it is shaken in transport, with the finer and denser particles working their way down. A segregated charge reacts unevenly and may leave unreacted material or produce iron of uneven composition. That is one reason modern thermit is supplied in sealed portions that are mixed and packed by the supplier for a specific weld, and why suppliers give instructions on handling and storing them.

The purity of the ingredients matters too. Viall noted that the aluminium and iron scale had to be very pure to produce steel of the composition he gave, and that scale from steelmaking would come close to meeting commercial demands. Oil, moisture and other contaminants in the scale add gas and absorb heat, as the failure later in this chapter shows.

## Slag and why it floats

The aluminium oxide slag is the other half of the product. Liquid aluminium oxide has a density of roughly 3 g/cm³ against about 7 g/cm³ for liquid iron, so it floats, and after the reaction the crucible holds a layer of liquid iron under a layer of slag. Two consequences follow.

First, the order in which they leave the crucible can be chosen. Viall described the two ways thermit was used. In the plastic method, used for pipe ends, the crucible was tipped and poured from the top, so the slag entered the mould first and coated the parts, protecting them from the iron, which then heated them to welding temperature before they were pressed together. In the fusion method, used for most heavy welds, the crucible was tapped from the bottom, so the iron ran into the mould first and the slag stayed behind, preventing it from spoiling the fusion of the parts.

Second, slag must not end up in the weld. A modern rail weld is poured from a crucible with a bottom tap that opens only after the reaction has finished and the slag has separated, and the mould has a riser where any slag and excess metal can collect above the weld.

```figure
type: steps
title: From charge to weld in the fusion method
caption: The sequence described by Viall in 1921 and still followed in outline by modern rail welding, with the bottom-tapped crucible keeping the slag out of the joint.
- Charge | aluminium and iron oxide, with any additions, in the crucible
- Ignite | a booster starts the reaction at the top of the charge
- React | the whole charge boils within seconds; iron and slag separate
- *Tap | iron runs from the bottom of the crucible into the mould
- Fuse | the iron melts into the preheated faces of the parts
- Freeze and trim | the weld solidifies; mould, riser and excess are removed
```

## Too much or too little aluminium

The balanced equation gives the exact proportion, but a real mixture is never exact, and the error in each direction has its own effect.

If there is too little aluminium, some of the iron oxide is not reduced. It stays in the slag, lowering the iron yield, and some may dissolve in the iron as oxide, making the weld metal dirty and weaker. The reaction also releases less heat, so the iron is cooler when it reaches the mould.

If there is too much aluminium, the excess has no oxygen to take from the iron oxide. Some of it burns in the air above the crucible, but some dissolves in the iron. Viall's analysis of 1921 thermit steel listed aluminium at 0.07 to 0.18%, evidence that a small surplus of aluminium was normal. A little aluminium deoxidises the steel; too much makes it brittle.

Commercial mixtures are therefore proportioned with a deliberate, controlled balance, and with additions that adjust the final composition (Chapter 8). Users do not adjust the proportions; they choose the supplier's portion designed for the job.

## A short history in dates

The dates in Viall's 1921 account give a sense of how quickly the process developed:

- around 1895 or 1896, Goldschmidt found that a cold mixture of aluminium and iron oxide could be ignited with a fuse of barium peroxide set off by a storm match, while he was working on the reduction of chromium and manganese;
- on 16 March 1897, the original patent for the reduction of metals by this method was granted, the first of more than forty;
- about 1898, Goldschmidt used the reaction to weld two pieces of iron together;
- by 1910, Hart was describing the process for rail joints, pipe joints and heavy repairs;
- in 1918, the American company handling the process changed its name from the Goldschmidt Thermit Company to the Metals and Thermit Corporation.

TWI notes that exothermic welding of railway rails has been in use in the United States since at least 1935. The process has been joining rails, in one form or another, for more than a century.

## Copper and other thermits

Aluminium will reduce other oxides too, and the same chemistry is used to join copper. TWI describes exothermic welding of copper conductors, widely used for earthing and lightning-protection systems, in which a small charge in a graphite mould produces molten copper that joins the cables without a separate heat source or electricity. Goldschmidt's original work was on reducing chromium and manganese, according to Viall, and aluminothermic reduction is still used to make some metals and alloys. This book concentrates on iron thermit for welding steel.

## The crusher frame: first numbers

This is an illustration. The contractor's proposal for the crusher frame uses a commercial steel-welding thermit portion. Chapter 4 calculates that the mould needs about 102 kg of thermit. Using the theoretical magnetite yield, that charge would produce about 0.552 × 102 ≈ **56 kg** of iron and about 102 − 56 = **46 kg** of slag. Using Hart's working figure of half the charge, it would produce about **51 kg** of steel.

The difference between 51 and 56 kg is the allowance for losses, impurities and any additions that do not become weld metal. The engineer notes that the contractor's portion is a proprietary mixture with alloying additions (Chapter 8), so the yield must come from the supplier's data, not from the simple reaction.

The slag is not a trivial by-product either. Some 46 kg of aluminium oxide at well over 2,000 °C must be caught in a slag pan or bed of dry sand and allowed to cool before it is handled and disposed of. The engineer adds the slag pan, its dry location and its cooling time to the list of things the job plan must cover, alongside the crucible support and the exclusion zone around the pour.

## A failure: the wrong mixture

This is an illustration. In a training exercise many years earlier, the quarry's records showed, a contractor's crew had made up a small trial charge from loose aluminium powder and mill scale collected from a rolling mill, instead of using a supplied portion. The reaction was sluggish, the iron did not separate cleanly from the slag, and the test weld was full of slag inclusions.

The chemistry explains it. Mill scale is not pure magnetite: it contains a mixture of iron oxides, some metallic iron, oil and moisture. Its oxygen content was uncertain, so the aluminium was not in the right proportion, and the oil and moisture absorbed heat and produced gas. The ratio of oxide to aluminium had been guessed by volume, not weighed. The quarry's procedure, which predates the present engineer, has since required that only the supplier's sealed portions, matched to the job, are used.

## Exercise: a haematite charge

A small demonstration charge uses haematite and aluminium in the correct proportion. Calculate how much aluminium is needed for 1.00 kg of haematite, the total charge, and the iron and slag produced.

From the haematite reaction, 159.7 g of Fe₂O₃ needs 2 × 26.98 = 53.96 g of aluminium. For 1,000 g of haematite, the aluminium is 1,000 × 53.96 ÷ 159.7 ≈ **338 g**, so the charge is about **1,338 g**.

The iron produced is 1,000 × 111.7 ÷ 159.7 ≈ **699 g**, which is 699 ÷ 1,338 ≈ 52.3% of the charge, and the slag is about 1,338 − 699 = **639 g**. Comparing with the magnetite charge, haematite thermit yields slightly less iron per kilogram of charge, because haematite contains more oxygen per unit of iron, and needs proportionally more aluminium.
