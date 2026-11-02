---
book: metal-casting-by-the-numbers
chapterSlug: getting-the-chemistry-right
order: 3
title: "Getting the chemistry right"
description: "Making up a charge that pours to the right composition: blending returns and ingot by alligation, allowing for melt loss, correcting a low melt, and elements that build up with remelting."
draft: false
---

A casting alloy is defined by its composition, and its properties after heat treatment depend on a few elements held within narrow bands. A foundry does not buy molten metal of the right composition; it makes it, from new ingot, its own returns and small additions of alloying elements, each of slightly different composition, and some elements are lost in the melting. Getting the charge right before it melts is far cheaper than correcting a melt afterwards, and far cheaper again than scrapping castings that are found to be off.

This chapter shows how to blend two charge materials to a target content with a KEVOS® tool, how to allow for an element that burns off during melting, how to correct a melt that comes out low, and how elements such as iron build up when returns are remelted again and again. Its error is a cost-saving change to the charge that left a whole night's castings soft. The arithmetic throughout is simple; the discipline of doing it for every element, every melt, is what makes it work.

## The elements that matter in GB-12's alloy

This is an illustration. GB-12's alloy is an aluminium–silicon–magnesium casting alloy of the Al–7Si–0.35Mg type. Each element has a job:

```figure
type: compare
title: The main elements in GB-12's alloy and what they do
cols: Role | What goes wrong if it drifts | Foundry's working band for GB-12
rowhead: Element
- Silicon, about 7% | gives fluidity and reduces shrinkage | too low: poor filling and more hot tearing; too high: more brittle | held by buying ingot to specification
- * Magnesium, about 0.35% | forms the precipitates that harden the alloy in heat treatment | too low: castings soft after T6; too high: less ductile | 0.32 to 0.40%, aim 0.35%
- Iron, as low as possible | an impurity, picked up from tools, crucibles and scrap | forms brittle needle-shaped phases that cut ductility | kept below the customer's limit by diluting returns
- Titanium and boron, small additions | refine the grain | coarse grains, more porosity and hot tearing | added as a master alloy each melt (Chapter 8)
- Strontium, small additions | modifies the silicon into a fine form | coarse, plate-like silicon, lower ductility | added as a master alloy and checked by cooling curve
caption: This is an illustration. The bands are the foundry's working targets for this job, set inside the customer's specification; they are not quoted from an alloy standard.
```

Magnesium is the element this chapter follows, because it is both the one that sets the casting's hardness and the one most easily lost. It is reactive, and some of it oxidises from the surface of the melt during melting and holding, especially if the melt is held hot for a long time or stirred. The foundry's records show a typical loss of about 5% of the magnesium content between charging and pouring.

## Blending two materials

A charge made of two materials with different contents of an element, mixed to hit a target, is a classic piece of arithmetic called alligation. If material A contains c_A and material B contains c_B, the share of A needed to reach a content c_T is:

```figure
type: formula
title: Blending two materials to a target content
formula: Share of A: s_A = (c_B − c_aim) ÷ (c_B − c_A)
formula: Content to aim for in the charge, allowing for melt loss: c_aim = c_T ÷ (1 − loss)
formula: Charge cost per kg: s_A × p_A + (1 − s_A) × p_B
caption: The target must lie between the two contents. The loss is the fraction of the element lost in melting; aiming higher in the charge leaves the right amount in the casting.
- c_A, c_B | contents of the element in materials A and B, %
- c_T | target content in the poured metal, %
- p_A, p_B | prices of the two materials, $/kg
```

The KEVOS® [Melt charge blend](/tools/melt-charge-blend/) tool does the calculation for two materials. From the two contents, the target, the melt loss of the element as a percentage of its content, the charge mass, the two prices and the highest charge cost you will accept, it gives the content to aim for, the shares and masses of each material, and the charge cost per kilogram and in total. Its guide notes that it treats mixing as linear, uses a single melt-loss figure, and that every other specified element must be checked with the same shares.

### GB-12's charge

This is an illustration. GB-12's two charge materials are the foundry's own returns, gates and risers from earlier melts of the same alloy, which have lost some magnesium on their way round and contain about 0.25%; and new primary ingot, which the foundry buys at about 0.45% magnesium so that it can carry returns. The foundry values its returns at A$1.20 per kilogram, the cost of handling and remelting them, and pays about A$4.80 per kilogram for new ingot including GST. Its ceiling for this job's charge cost is A$3.50 per kilogram.

```figure
type: steps
title: GB-12's 150 kg charge in the melt charge blend tool
caption: This is an illustration. Returns 0.25% Mg at A$1.20/kg; new ingot 0.45% Mg at A$4.80/kg; target 0.35% in the poured metal; 5% of the magnesium lost in melting.
- Content to aim for in the charge | 0.35 ÷ 0.95 = 0.3684%
- Share of returns | (0.45 − 0.3684) ÷ (0.45 − 0.25) = 40.8%
- * Masses | 61.2 kg of returns and 88.8 kg of new ingot
- Charge cost | 0.408 × 1.20 + 0.592 × 4.80 = A$3.33 per kg, within A$3.50
- Same check for every other element | iron, silicon and the rest, with the same shares
```

Without the melt-loss allowance, the blend would have been half returns and half ingot, aiming at exactly 0.35% in the charge; after losing 5% of its magnesium the melt would have poured at 0.3325%, still inside the band but near its bottom. The allowance moves the aim up so that the poured metal sits in the middle of the band.

### How much returns the charge can carry

Returns are the cheapest charge material, and a foundry with a casting yield of 55% generates nearly as many kilograms of returns as it ships in castings. The arithmetic decides how many it can use. Because returns are lower in magnesium than the target, every kilogram of returns must be balanced by ingot richer than the target. For GB-12, the share of returns cannot exceed about 41% without the magnesium falling below the aim, unless magnesium is added separately. Since the yield returns 45% of each melt as gates and risers, the foundry generates slightly more returns than this job can absorb, and it uses the surplus on other jobs in the same alloy.

```figure
type: bars
title: Charge cost per kg for GB-12 at three shares of returns
unit: A$/kg
caption: This is an illustration. Linear blend of returns at A$1.20 and ingot at A$4.80. Only the 40.8% blend meets the magnesium target without an addition; the 60% blend is cheaper and too low in magnesium.
- 0% returns, all ingot | 4.80
- * 40.8% returns | 3.33
- 60% returns | 2.64
```

## Checking the melt before pouring

The blend calculation predicts the composition; it does not prove it. GB-12's foundry takes a sample from every melt after it is skimmed and treated, casts it into a small chill mould, and analyses it on an optical emission spectrometer, which gives the content of each element in about a minute. The result is compared with the working bands before any mould is poured. A melt outside the band is corrected or held, not poured.

### Correcting a low melt

This is an illustration. If a 147 kg melt analyses at 0.3135% magnesium, below the 0.32% lower limit, magnesium can be added. Raising it to 0.35% needs 147 × (0.35 − 0.3135) ÷ 100 = 0.054 kg of magnesium in the metal. Magnesium additions are not fully recovered: some burns as it goes in. With a recovery of about 80%, the foundry adds about 0.067 kg, 67 g, of pure magnesium, plunged below the surface in a perforated bell so that it dissolves rather than burning on top. A fresh sample then confirms the result.

The blend tool can do the same arithmetic, treating the melt as material A and pure magnesium as material B, but for a small addition the direct calculation is simpler and clearer. Either way, the correction costs time at the furnace, a little magnesium and some risk of oxide; it is a remedy, not a plan.

### Taking a sample that means something

An analysis is only as good as its sample. A sample taken before the melt is fully molten and stirred, before additions have dissolved, or from the top of a bath with dross on it, can be quite different from the metal that fills the moulds. GB-12's foundry samples after skimming and treatment, with the melt at pouring temperature, from below the surface with a preheated spoon, into a chill mould that freezes the sample quickly enough to avoid segregation. The spectrometer is checked each shift against certified reference samples of a similar alloy, and the check is recorded with the analysis. A reading that looks wrong is repeated on a fresh sample before anyone adds anything to the melt.

## Additions by weight

Grain refiners and modifiers are added as master alloys: aluminium carrying a known, higher content of the element, in rod, waffle or ingot form. The arithmetic is the same as blending, simplified because the addition is small.

This is an illustration. The foundry's practice for GB-12 is to add titanium at 0.02% of the melt as a grain refiner, using a master alloy containing 5% titanium and 1% boron. For a 147 kg melt that is 147 × 0.0002 ÷ 0.05 = 0.59 kg of rod. Its practice for modification is to add strontium at 0.015%, using a master alloy with 10% strontium: 147 × 0.00015 ÷ 0.10 = 0.22 kg. Both are weighed on the furnace scale and recorded.

The effect of both additions fades. Grain refiner particles settle to the bottom of the crucible if the melt stands undisturbed, and strontium is slowly lost by oxidation, especially from a melt that is degassed vigorously or held for a long time. The cooling curve of Chapter 1 shows whether each is still working before pouring, and a melt held too long is topped up or re-treated. The figures here are the case foundry's own practice; real addition rates come from the master alloy supplier's guidance and the foundry's trials.

### Recording the melt

Every melt gets a number. The melt record lists the charge make-up by weight, the additions, the temperatures and times, the analysis, the cooling curve result and who signed it off, and the moulds poured from it carry the melt number on a cast-in tag. When a problem appears weeks later, as it did in the error below, the record lets the foundry find exactly which castings came from which melt, and the customer's quality system will expect that traceability.

## Elements that build up

Some elements cannot be removed from an aluminium melt by any practical means. Iron is the main one. It comes in from steel tools, stirrers and skimmers that dissolve slightly in the melt, from steel inserts and fasteners in scrap, and from uncoated crucibles. Each time returns are remelted they pick up a little more. Over many cycles, a foundry that recycles only its own returns would see its iron content creep upwards until castings failed their ductility requirements.

The only control is dilution with new ingot. This is an illustration. If GB-12's returns now carry 0.15% iron and new ingot 0.08%, the 40.8% blend pours at about 0.41 × 0.15 + 0.59 × 0.08 = 0.109% iron. The same blend calculation, run for iron with the shares found for magnesium, is the check the tool's guide asks for. The foundry also coats its steel tools with a refractory wash and never leaves them standing in the melt.

Bought-in scrap is a bigger risk than the foundry's own returns. Mixed aluminium scrap can contain wrought alloys rich in copper or zinc, painted or coated material, and alloys with elements that GB-12's specification limits tightly. A few kilograms of the wrong alloy in a 150 kg charge can push copper or zinc over its limit, and like iron they cannot be removed. GB-12's foundry uses only its own sorted returns and certified ingot for this job; scrap of unknown origin goes to jobs whose specifications can tolerate it, or back to the scrap merchant. Silicon, by contrast, is rarely a problem in this charge: the returns and the ingot both sit close to 7%, so any blend of the two pours close to 7% as well.

```figure
type: checklist
title: Before a charge is melted
caption: The open item is the one skipped in the error below.
- Charge made up by weight to the blend sheet | returns and ingot weighed, not estimated
- Returns sorted by alloy | another alloy's returns contaminate the melt
- Every specified element checked with the blend shares | not just the one the blend was calculated for
- ? Spectrometer sample taken and passed before the first mould is poured | on every melt, every shift
- Additions weighed and recorded | grain refiner, modifier and any correction
```

## The error: a cheaper charge on night shift

This is an illustration. To cut costs, the night-shift supervisor changed GB-12's charge to 60% returns, which brought the charge cost down from A$3.33 to A$2.64 per kilogram. Unknown to the supervisor, the blend had been calculated for magnesium, and 60% returns could not meet it. The charge went in at (0.6 × 0.25 + 0.4 × 0.45) = 0.33% magnesium and, after the usual 5% loss, poured at about 0.3135%, below the 0.32% limit.

The spectrometer would have caught it, but on that shift its argon supply had run out, and the operator, under pressure to keep the moulding line fed, poured without an analysis, intending to test a retained sample in the morning. The morning analysis showed the low magnesium. By then 50 castings had been poured.

The castings looked perfect. They were heat treated with the rest, and at final inspection their Brinell hardness came out at the bottom of the specification or below it (Chapter 10), because there was too little magnesium to form the hardening precipitates. Twelve were below the 75 HBW minimum and were scrapped; the rest were held for the customer's decision and accepted on concession.

The cost of the 50 castings' metal saved by the cheaper charge, about A$0.69 per kilogram on some 600 kg poured, was about A$414. The scrap, the concession paperwork and the delay cost several times that. The foundry made three changes: no melt is poured without a passed analysis, a spare argon cylinder is kept on site, and any change to a charge make-up needs the metallurgist to rerun the blend for every specified element.

## Exercise: a richer ingot

This is an illustration. A new ingot supplier offers metal at 0.50% magnesium for A$4.95 per kilogram.

1. With returns at 0.25% and a 5% melt loss, what share of returns hits the 0.35% target?
2. What are the masses for a 150 kg charge and the charge cost per kilogram?
3. Is the richer ingot worth it against the current A$3.33 per kilogram?

**Worked answer.**

1. Aim 0.3684%. s_A = (0.50 − 0.3684) ÷ (0.50 − 0.25) = **52.6%** returns.
2. **79.0 kg** of returns and **71.0 kg** of ingot. Cost 0.526 × 1.20 + 0.474 × 4.95 = **A$2.98 per kilogram**.
3. **Yes**, on charge cost: about A$0.35 per kilogram cheaper, because the richer ingot lets the charge carry more returns, and the foundry has returns to spare. The other elements must still be checked with the new shares, especially iron, which rises with more returns: 0.526 × 0.15 + 0.474 × 0.08 = about 0.117%.
