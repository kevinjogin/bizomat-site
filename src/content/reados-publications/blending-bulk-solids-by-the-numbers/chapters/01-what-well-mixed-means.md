---
book: blending-bulk-solids-by-the-numbers
chapterSlug: what-well-mixed-means
order: 1
title: "What well mixed means"
description: "A blend's quality depends on the scale at which its user takes it. Define the scale of scrutiny, the composition variance and the perfectly segregated and random limits, and set the let-down ratio."
draft: false
---

Ask whether a blend is well mixed and the honest answer is always "at what scale?" A tonne of black-and-natural pellet blend is perfectly mixed if the question is whether the tonne contains 2% masterbatch. A single pellet is never mixed at all: it is either black or natural. Somewhere between those extremes is the scale that matters, the amount of blend that ends up in one product, one dose, one tablet or one test. A blend can be excellent at one scale and unacceptable at another, and much of the confusion about mixing comes from measuring at the wrong one.

This chapter sets out the vocabulary used throughout the book: the scale of scrutiny, the composition of a sample and its variance, and the two limiting states of a blend, perfectly segregated and randomly mixed. It introduces Plant C's three blends, works out the colour let-down, and describes a test that passed at the wrong scale.

## The scale of scrutiny

Danckwerts, in a 1952 paper that still frames the subject, called the size of the portion that matters the **scale of scrutiny**. It is not a property of the blend. It is set by the use.

- For Plant C's moulded lids, it is one lid: 60 g of plastic, which is what a customer sees. If one lid is paler than its neighbours, the blend has failed at that scale, even if the shift's output averages exactly 2% masterbatch.
- For the filled compound, the customer moulds parts of a few hundred grams, and the specification is checked by ashing a few grams of pellets. Each compound pellet already contains filler mixed at the scale of micrometres by the extruder, so a single pellet is itself a well-mixed sample of the compound. The scale of scrutiny is set by the customer's part and the test portion.
- For the additive premix, the scale is the amount of premix that ends up in a few grams of compound: about 1% of a few grams, so tens of milligrams of premix. That is a far smaller scale than the colour blend's, which is why the premix is mixed differently.

The scale of scrutiny decides how big the samples taken to judge the blend should be. Samples larger than the scale of scrutiny average out variation the user will see; samples smaller exaggerate variation the user will never see.

## Composition and its variance

Take a number of samples, each the size of the scale of scrutiny, from a blend. Each has a composition, x, the mass fraction of the component of interest. If the blend were perfect, every x would equal the overall fraction p. In practice the x values scatter, and the natural measure of the scatter is their variance, σ², or its square root, the standard deviation σ. The **coefficient of variation**, CV = σ ÷ p, puts it on a scale that compares blends with different target fractions.

Two limiting states bound every real blend.

- **Perfectly segregated.** The components sit apart, as in a bin with masterbatch at the bottom and natural pellets on top. A sample is either all masterbatch or all natural, so x is 1 with probability p and 0 with probability 1 − p. The variance is σ₀² = p (1 − p). For the colour blend, with p = 0.02, σ₀² = 0.0196 and σ₀ = 0.14: a CV of 700%.
- **Randomly mixed.** Every particle is equally likely to be anywhere, independently of every other. This is the best that a mixer can do with particles that do not attract or repel each other, and Chapter 2 shows that its variance is not zero. It depends on how many particles a sample contains.

Danckwerts's **intensity of segregation**, the ratio σ² ÷ σ₀², runs from 1 for a perfectly segregated blend towards a small value for a random one. Chapter 3 uses a closely related measure, Lacey's mixing index.

```figure
type: compare
title: Two limits of a blend, for Plant C's 2% colour blend sampled one lid at a time
rowhead: State
cols: What a 60 g sample contains | Standard deviation of masterbatch fraction | CV
caption: This is an illustration. The perfectly segregated value follows from p = 0.02; the random value is derived in Chapter 2 from the number of masterbatch pellets a lid contains, about 60. Real blends lie between, and mixing moves them from the first row towards the second.
- Perfectly segregated | all masterbatch or all natural | 0.140 | 700%
- * Randomly mixed | about 60 masterbatch pellets among 2,450 natural | 0.0026 | 12.8%
- Perfect, impossible with particles | exactly 1.2 g of masterbatch | 0 | 0%
```

## Plant C's three blends

The plant blends at three very different scales. This is an illustration.

```figure
type: compare
title: Plant C's three blends
rowhead: Blend
cols: Components | Target fraction | Scale of scrutiny | How it is mixed
caption: This is an illustration. Each blend is introduced here and followed through the book. The scale of scrutiny, not the batch size, decides how good the mixing must be.
- Colour | natural PP pellets, 24 mg; black masterbatch pellets, 20 mg, 40% carbon black | 2% masterbatch, 0.8% carbon | one 60 g lid | volumetric doser at the moulding machine throat, then the screw
- Filler | PP from one feeder, calcium carbonate from another, premix from a third | 30.0 ± 1.0% filler | a few grams of compound | loss-in-weight feeders into a twin-screw extruder
- Additives | stabiliser powder in PP powder | 20% in the premix; 0.20% in the compound | tens of milligrams of premix | 500 L ribbon blender, 200 kg batches
```

## Setting the let-down ratio

The colour blend's proportions come from a simple mass balance. The lids need 0.8% carbon black. The masterbatch contains 40% carbon black and the natural pellets none. If a fraction p of the blend is masterbatch, the carbon content is 40% × p, so p = 0.8 ÷ 40 = 0.02, or 2%. The trade calls this a let-down ratio of 50 to 1.

The [mixture cost and blending tool](/tools/mixture-cost/) does this calculation, the alligation rule for blending two ingredients to a target value, and gives the quantities for a batch. Entered with ingredient A at 0% carbon, ingredient B at 40% and a target of 0.8%, it gives shares of **98% and 2%**, or 98 kg of natural pellets and 2 kg of masterbatch per 100 kg. It assumes the property mixes linearly by mass, which is exact for a content such as carbon black and only approximate for a property such as viscosity or colour strength. The same tool, in its cost mode, gives the cost per kilogram of a blend as a weighted average, which is how the plant compares a 2% let-down of a strong masterbatch with a 4% let-down of a weaker one in Chapter 2.

The same balance gives the additive premix: 0.20% stabiliser in the compound from a 20% premix needs a premix fraction of 0.20 ÷ 20 = 1%, so 15 kg/h of premix in 1,500 kg/h of compound.

## Mixing at two scales

Plant C's line shows a distinction that is easy to miss. A dry blend of separate particles, such as the colour blend at the moulding machine's throat, can only ever be mixed at the scale of whole particles: a black pellet stays black until it melts. A compounding extruder mixes at a much finer scale. It melts the polymer and disperses the filler particles, a few micrometres across, through it, so that every compound pellet contains filler in almost exactly the right proportion. Its output is mixed at the micrometre scale and its pellets are, from the customer's point of view, identical.

The extruder, however, can only mix what arrives in it over a short time. If the feeders deliver 28% filler for half a minute, the extruder will produce half a minute's worth of 28% pellets, very well mixed at 28%. Chapter 8 deals with that time scale, which is the scale of scrutiny of a continuous process.

The moulding machine's screw sits between the two. It melts the colour blend and mixes it partly, so the colour of a lid depends on the masterbatch pellets that arrived at the screw over roughly the last shot or two, not only in exactly one shot's worth of pellets. Chapter 8 returns to this too. For Chapters 1 to 3, the lid's 60 g is treated as the portion that matters.

### The scale of scrutiny in time

For a continuous process the scale of scrutiny has a time equivalent. At 1,500 kg/h, the extrusion line makes 417 g of compound a second. A customer's 300 g part is made from pellets produced in about **0.72 s** of extrusion, and a 5 g ash test portion from about 0.012 s. Pellets from different moments are partly mixed again in bags, bins and the customer's hopper, so the part does not see exactly 0.72 s of production. Even so, the scale shows the order of the problem: a filler feeder that wanders for a few seconds produces pellets that a customer's part can contain. Chapter 8 works out how much of a feeder's short-term wander the extruder smooths and how much passes into the pellets.

## The error: testing at the wrong scale

This is an illustration. When the moulding cell started using the black masterbatch, the quality laboratory validated the colour blend by taking ten samples of about 500 g each from the blend at the doser's outlet, at intervals through a shift, and measuring their carbon black content by burning off the polymer. All ten fell between 0.75% and 0.85%, a CV of about 4%, and the blend was approved.

Within a week, the moulding supervisor reported that about two lids in every hundred were visibly greyer than the rest and were being rejected for shade.

The engineer's review found that the validation had been done at the wrong scale. A 500 g sample contains about 500 masterbatch pellets; a lid contains about 60. The scatter of a random mixture shrinks with the square root of the number of particles, so the validation samples were bound to look about √(500 ÷ 60) = 2.9 times more uniform than the lids. The test had answered the question "does the doser deliver 2% on average over half a kilogram?", which it did, and not the question that mattered: "does every lid get enough masterbatch?"

```figure
type: bars
title: Expected CV of masterbatch fraction for a random mixture, by sample size
unit: %
caption: This is an illustration. Calculated from the random-mixture variance in Chapter 2 for Plant C's pellets. The validation samples were about eight times the lid's mass, so they could not show the variation a single lid carries.
- One lid, 60 g | 12.8 | about 60 masterbatch pellets
- Validation sample, 500 g | 4.4 | about 500 masterbatch pellets
- 2 kg | 2.2 | about 2,000 masterbatch pellets
```

The validation was repeated with samples of one lid's mass, 60 g, taken by a riffle divider from larger grab samples, and with moulded lids themselves measured for carbon content. The CV at that scale was about 13%, as the random-mixture limit predicted, and the share of lids below the visible threshold matched the reject rate. Chapter 2 explains the arithmetic and what the plant did about it.

## Blends that beat the random limit

The random mixture is the best a mixer can do with particles that move independently, but not every blend is made of independent particles. When a very fine powder is mixed with much coarser particles, the fines can stick to the surfaces of the coarse ones and coat them. Each coarse particle then carries its own small share of the fine component, and the blend behaves as if it were made of identical coated particles. Such ordered or interactive mixtures can be more uniform than a random mixture of the same components, and some pharmaceutical and food blends rely on them. They can also come apart, if the fines are knocked off by handling or the carrier particles segregate by size. Plant C's blends are not of this kind: pellets do not coat each other, and the stabiliser and polypropylene powders in the premix are of similar size. The random limit therefore applies to all three.

## What a blend specification should say

A blend specification that says only "2% masterbatch" or "30% filler" is incomplete, because it does not say at what scale or how it will be judged. A complete one states five things.

```figure
type: checklist
title: What Plant C's colour blend specification now states
caption: This is an illustration. The open item is the one the first validation missed; without it, any sample size could be argued to comply.
- x Component and target | carbon black 0.80% in the lid, from 2% masterbatch
- x Tolerance | each lid between 0.60% and 1.00% carbon, the visible shade limits
- ? Scale of scrutiny | one lid, 60 g, stated in the specification
- x Sampling plan | number of samples, where and how they are taken, Chapter 10
- x Test method | carbon content by pyrolysis of the whole lid, or colour measurement against limits
```

The tolerance deserves particular care. A tolerance on the average, such as "2.0 ± 0.1% masterbatch over a shift", is a statement about the doser. A tolerance on each unit, such as "every lid between 0.60% and 1.00% carbon", is a statement about the blend at the scale of scrutiny, and it is the one the customer experiences. Chapter 11 shows how to turn a tolerance on each unit into an acceptance plan.

## How this applies to a small Australian business

Before mixing longer, buying a better blender or arguing with a supplier, write down the scale of scrutiny: how much of the blend goes into one unit of product, one dose or one test. Then make sure every sample you take to judge the blend is about that size. A blend validated with samples much bigger than the product unit will look better than it is; one judged by samples much smaller will look worse. Both lead to the wrong decision.

It also helps to know which of the two limits your blend is near. If samples at the right scale vary about as much as a random mixture would, mixing longer will not help, and only a change to the particles, the proportions or the product unit will. If they vary much more, the blend is still partly segregated, and better mixing or gentler handling is the cure. Chapter 2 shows how to calculate the random limit so the two cases can be told apart.

## Exercise: a larger lid

The plant is quoting for a 150 g lid in the same black, using the same 2% let-down of the same pellets. (a) How many masterbatch pellets does a lid contain on average? (b) If the CV of a random mixture falls with the square root of the number of masterbatch pellets, what CV would you expect, compared with 12.8% for the 60 g lid?

**Worked answer.** (a) 150 g × 0.02 = 3.0 g of masterbatch, at 0.020 g a pellet, is **150 pellets**. (b) The CV scales as 1 ÷ √N, so it falls by √(60 ÷ 150) = 0.632, from 12.8% to about **8.1%**. A larger product unit is easier to colour uniformly with the same blend.
