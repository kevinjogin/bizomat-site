---
book: reverse-osmosis-by-the-numbers
chapterSlug: scaling-and-the-recovery-limit
order: 6
title: "Scaling: what recovery the water allows"
description: "Concentration at the membrane wall, ionic strength and activity, solubility products for gypsum, silica solubility against temperature, calcium carbonate, antiscalants and BW-12's recovery limit."
draft: false
---

Chapter 2 showed that recovery multiplies every dissolved substance in the feed. Most of them stay dissolved at any concentration a brackish plant reaches. A few do not: calcium carbonate, calcium sulfate, silica, barium and strontium sulfate, calcium fluoride and some iron and manganese compounds have limited solubility, and once their concentration at the membrane surface passes that limit they can crystallise on it. Scale blocks the feed channel, raises the pressure drop and destroys flux, and some scales, silica above all, are very hard to clean off. In most brackish plants it is scaling, not pressure, that sets the highest recovery the water allows.

This chapter shows how to check a concentrate for scaling by hand: the concentration at the membrane wall, the ionic strength that weakens the ions' effective concentration, the solubility product of gypsum and the temperature-dependent solubility of silica. It runs the checks for BW-12 across a range of recoveries, discusses calcium carbonate and antiscalants, and ends with a scaling check done on the bulk concentrate at 25 °C that missed a winter silica problem.

## Concentration at the wall

The concentration that matters for scaling is the highest one in the plant: at the membrane surface of the last element, where the bulk is at its strongest and polarisation adds its factor on top. For BW-12 at 75% recovery, the bulk concentration factor at the concentrate end is about 4, and Chapter 5's polarisation factor for the two-to-one array is 1.079, so the surface sees 4 × 1.079 = 4.32 times the feed.

```figure
type: compare
title: BW-12's scaling ions at the concentrate-end membrane surface, 75% recovery
cols: Feed, mg/L | Bulk concentrate, mg/L | Membrane surface, mg/L
rowhead: Constituent
caption: This is an illustration. Bulk concentrate at 1 ÷ (1 − 0.75) = 4.0 times the feed, surface at 4.317 times with the polarisation factor of 1.079. Salt passage is ignored, which slightly overstates the concentrate and errs on the safe side.
- Calcium | 120 | 480 | 518
- Magnesium | 80 | 320 | 345
- Sulfate | 260 | 1,040 | 1,123
- Bicarbonate | 240 | 960 | 1,036
- * Silica | 28 | 112 | 121
- Ionic strength, mol/L | 0.048 | 0.192 | 0.208
```

The last row is the ionic strength, half the sum of each ion's concentration times its charge squared. BW-12's feed has an ionic strength of 0.0481 mol/L, and since every ion is concentrated by the same factor, the surface water's is 0.208 mol/L. Ionic strength matters because ions in a salty solution do not behave as if alone: each is surrounded by a loose cloud of opposite charge that lowers its tendency to react or crystallise. That lowering is the activity coefficient, and it is the same physics, ion interaction, that makes Chapter 1's osmotic coefficient less than one.

## Activity and the solubility product

A sparingly soluble salt dissolves until the product of its ions' activities reaches a constant, the solubility product. For gypsum, calcium sulfate dihydrate, the reaction is CaSO₄·2H₂O ⇌ Ca²⁺ + SO₄²⁻ + 2H₂O, and the US Geological Survey's PHREEQC geochemical database gives its constant at 25 °C as log K = −4.55, or K = 2.82 × 10⁻⁵. Water is supersaturated, and can scale, when the ion activity product exceeds K.

Activity is concentration times the activity coefficient. For ionic strengths up to a few tenths of a mole per litre, the Davies equation gives a reasonable coefficient for an ion of charge z: log γ = −0.509 z² × [√I ÷ (1 + √I) − 0.3 I] at 25 °C. The charge enters squared, so divalent ions such as calcium and sulfate are affected four times as strongly as monovalent ones.

```figure
type: steps
title: Gypsum check at BW-12's concentrate-end surface, 75% recovery, 25 °C
caption: This is an illustration. The Davies equation without ion pairing. Calcium and sulfate also form a dissolved ion pair, which lowers their free concentrations further, so this hand check overstates saturation and errs on the safe side.
- Ionic strength | I = 0.0481 × 4.317 = 0.208 mol/L; √I = 0.456
- Activity coefficient, z = 2 | log γ = −0.509 × 4 × (0.456 ÷ 1.456 − 0.3 × 0.208) = −0.511; γ = 0.309
- Calcium | 518 mg/L ÷ 40,078 mg/mol = 0.01293 mol/L
- Sulfate | 1,123 mg/L ÷ 96,060 mg/mol = 0.01169 mol/L
- Ion activity product | 0.01293 × 0.01169 × 0.309² = 1.44 × 10⁻⁵
- * Ratio to K | 1.44 × 10⁻⁵ ÷ 2.82 × 10⁻⁵ = 0.51: about half saturated
```

Without the activity coefficients the same concentrations would give a product of 1.51 × 10⁻⁴, more than five times K, and the water would appear heavily supersaturated. Ignoring ionic strength is the commonest way a hand scaling check goes wrong in the cautious direction, and it can rule out a recovery the water would in fact allow.

## Silica, the cold-weather limit

Silica does not dissolve as ions; it is present as uncharged silicic acid, and its limit is the solubility of amorphous silica, the glassy form that deposits in plant. It depends strongly on temperature. The PHREEQC database gives amorphous silica a constant of log K = −2.71 at 25 °C, which corresponds to about 117 mg/L as SiO₂. Fournier's 1977 geothermometer equation for amorphous silica, log S = 4.52 − 731 ÷ T with S in mg/kg and T in kelvin, gives the same 117 mg/kg at 25 °C and shows the fall as the water cools.

```figure
type: line
title: Solubility of amorphous silica against temperature
x: Water temperature, °C
y: Solubility as SiO₂, mg/L
ymin: 90
ymax: 135
caption: From Fournier's equation, checked against the PHREEQC constant at 25 °C. A design program's silica limit will be similar at neutral pH, higher at high pH, and raised by an antiscalant rated for silica. BW-12's surface silica at 75% recovery is 121 mg/L.
- 15 | 96.2
- 18 | 102.2
- 20 | 106.3
- 25 | 117.0
- 30 | 128.4
```

At 75% recovery BW-12's surface silica is 121 mg/L. That is 3% above the 25 °C solubility, 18% above the 18 °C solubility, and 6% below the 30 °C solubility. The plant is close to its silica limit in a mild season and past it in winter. The pattern is common in groundwater, which picks up silica from the rock it passes through: silica, not calcium sulfate or carbonate, is often the first scale to limit recovery, and it limits it most in cold weather, when the plant also needs its highest pressure.

## BW-12's checks across the recovery range

```figure
type: compare
title: BW-12's scaling ratios at the concentrate-end surface by recovery
cols: Surface factor | Gypsum, IAP ÷ K | Silica, mg/L | Silica ÷ solubility at 25 °C | Silica ÷ solubility at 18 °C
rowhead: Recovery
caption: This is an illustration. Surface factor = 1 ÷ (1 − r) × exp(0.7 Yᵢ) for twelve elements in series. Ratios above 1.00 are supersaturated without an antiscalant. Gypsum limits near 83%; silica limits near 70% in winter.
- 70% | 3.56 | 0.38 | 99.8 | 0.85 | 0.98
- * 75% | 4.32 | 0.51 | 120.9 | 1.03 | 1.18
- 80% | 5.46 | 0.75 | 152.9 | 1.31 | 1.49
- 85% | 7.39 | 1.29 | 206.8 | 1.77 | 2.02
```

The table separates the two limits. Gypsum stays below saturation up to about 83% recovery; silica is at saturation at about 70% in winter. Without help, BW-12 would have to run at 70% or lower in the cold months. With an antiscalant that holds silica supersaturated, which is what its designers chose, 75% is achievable, and it is the antiscalant supplier's projection, not this hand check, that confirms by how much.

## Calcium carbonate and pH

Calcium carbonate behaves differently because its solubility depends on pH, and pH changes across a reverse osmosis membrane. Dissolved carbon dioxide passes through the membrane almost freely, while bicarbonate is rejected. The concentrate therefore loses some of its carbon dioxide to the permeate and is concentrated in bicarbonate and calcium, and its pH rises, both of which push it towards carbonate scale. The permeate, carrying the carbon dioxide without the bicarbonate that buffered it, comes out with a lower pH than the feed.

The usual index for carbonate scaling in a brackish concentrate is the Langelier saturation index: the measured pH minus the pH at which the water would be exactly saturated with calcium carbonate, calculated from calcium, alkalinity, dissolved solids and temperature. A positive index means a tendency to scale. Calculating it for a concentrate needs the feed pH and an estimate of the concentrate pH, and is best left to the antiscalant supplier's or membrane maker's software, which models the carbon dioxide balance. The controls are well known: dose an antiscalant that inhibits carbonate crystal growth, or lower the feed pH with acid so that more of the alkalinity is converted to carbon dioxide, which passes through the membrane. Acid dosing adds a hazardous chemical to the site and lowers the permeate pH further, which may then need correcting for the boiler and the rinse tanks.

## Antiscalants and what they buy

Antiscalants are dosed in small quantities, a few milligrams per litre of feed, ahead of the cartridge filter. They work by interfering with crystal nucleation and growth, allowing a concentrate to stay supersaturated for the minutes it spends in the plant before it leaves. Each product has its own limits for each scalant, published through the supplier's projection software, and different products target carbonate, sulfate, silica, iron or combinations.

```figure
type: checklist
title: Scaling review for a brackish reverse osmosis design
caption: This is an illustration. BW-12's review closed every item except the winter silica limit, which was resolved by the antiscalant choice and a winter recovery set point.
- x Full ion analysis with balance error reported | Chapter 1
- x Surface concentration factor at the concentrate end, with polarisation | Chapter 5
- x Calcium sulfate, barium and strontium sulfate, calcium fluoride ratios | gypsum 0.51 at 75%
- x Calcium carbonate index for the concentrate | from the supplier's projection
- ? Silica at the coldest feed temperature | 1.18 times solubility at 18 °C without antiscalant
- x Iron and manganese below the levels the maker allows | Chapter 7
- x Antiscalant product, dose and limits confirmed by its supplier for this water
```

An antiscalant is not a licence to ignore the arithmetic. It extends the limit by a margin the supplier states for its product, at the dose it states. A plant whose recovery has crept up to the edge of that margin will scale when something else changes: a colder week, a saltier bore, a dosing pump that runs dry. The dosing pump needs a flow interlock or a low-level alarm on the antiscalant tank, because a plant that scales for want of a cheap chemical is an expensive lesson.

## The other scalants

Gypsum, carbonate and silica are the three a brackish design always checks, but a full analysis can turn up others that are present in tiny amounts and still matter.

- **Barium and strontium sulfate.** Barium sulfate is several hundred times less soluble than gypsum, so a feed with a fraction of a milligram per litre of barium and a few hundred of sulfate can saturate in the concentrate. Laboratories do not report barium unless asked; ask.
- **Calcium fluoride.** Some groundwaters carry fluoride from the rock, and calcium fluoride's solubility is low enough to matter at high recovery.
- **Iron and manganese.** Dissolved iron and manganese in reduced form pass through the plant harmlessly if they stay reduced, but oxygen from a vented tank or air leaking into the suction line oxidises them to insoluble hydroxides that foul the lead elements. Chapter 7 deals with them as foulants rather than scale.
- **Phosphate and aluminium.** Less common in bore water, but present in some treated waters, where they can form scale with calcium or deposit as colloids.

The design rule is the same for all of them: find the surface concentration at the concentrate end, compare it with solubility at the coldest and warmest temperatures, and ask the antiscalant supplier which limits its product extends.

## What the hand check leaves out

The hand checks in this chapter are conservative in some ways and optimistic in others, and it helps to know which. They ignore ion pairing, which lowers free calcium and sulfate and makes the gypsum check cautious. They take the polarisation factor from a correlation for one maker's elements, which may differ from the real plant. They treat solubility as an equilibrium, while crystallisation takes time: a slightly supersaturated concentrate may pass through the plant before crystals form, which is part of how antiscalants work, but deposits that do form act as seeds for more. And they use the design analysis, while the real feed varies.

Gypsum's solubility changes little over BW-12's temperature range, so its check at 25 °C stands for the year. Silica's changes a great deal, as shown above, and calcium carbonate's solubility falls as temperature rises, so carbonate is a summer risk while silica is a winter one. A plant that is checked at only one temperature can miss either.

## Watching for scale in operation

Scale grows where the water is strongest, so its first signs appear at the concentrate end. The operator's indicators are the second-stage pressure drop, the second-stage normalised permeate flow and the second-stage permeate conductivity; Chapter 9 shows how to normalise them. A slow rise in the second stage's pressure drop with a fall in its output, while the first stage holds steady, is the classic signature. The concentrate itself can be watched too: a rise in its turbidity, or calcium or silica in the concentrate falling below what the feed analysis and the concentration factor predict, means that some of it is being left behind in the plant.

When scale is suspected, removing the last element of the second-stage vessel and weighing it against a new one is a quick check, since scale adds weight; a membrane autopsy by a specialist laboratory identifies the deposit. Carbonate scale usually responds to an acid clean; sulfate and silica scales respond poorly or not at all, which is why prevention is worth so much more than cure.

## The error: a bulk check in a warm month

This is an illustration. BW-12's original design note checked silica on the bulk concentrate at 25 °C: 28 × 4 = 112 mg/L against a solubility of 117 mg/L, so silica "passes" at 96% of saturation, and the antiscalant was chosen for carbonate and sulfate only. The design reviewer redid the check at the membrane surface, 121 mg/L, and at the coldest feed in the brief, 18 °C, where the solubility is 102 mg/L. The ratio was 1.18.

The difference between "passes" and "18% supersaturated" came from two habits: using the bulk concentrate instead of the surface, and checking only at the reference temperature. Either alone would have been enough to hide the problem. The reviewer's recommendation had three parts: use an antiscalant whose supplier states a silica limit above the winter surface concentration at this water's pH, with a margin; set a winter recovery of 70% in the control system as a fallback for weeks when the feed tank falls below 20 °C; and include silica in the monthly concentrate analysis, so that any upward drift in the bore's silica would be seen. Silica scale on a membrane is very difficult to remove, and the elements often have to be replaced, so the cost of the review was small beside the risk it removed.

## Exercise: 80% recovery in winter

The plant asks whether it could run at 80% recovery to save bore water. For BW-12's water at 18 °C, find the surface concentration factor (twelve elements in series), the surface calcium, sulfate and silica, and compare silica with its solubility. Using the Davies equation, find whether gypsum is saturated. The polarisation factor for 80% is exp(0.7 × Yᵢ), with Yᵢ = 1 − 0.2^(1/12).

**Worked answer.** This is an illustration. The element recovery is 1 − 0.2^(1/12) = 0.1255 and the polarisation factor exp(0.0879) = 1.092, so the surface factor is 5 × 1.092 = **5.46**. Surface calcium is 120 × 5.46 = **655 mg/L**, sulfate 260 × 5.46 = **1,419 mg/L** and silica 28 × 5.46 = **153 mg/L**, which is 153 ÷ 102.2 = **1.49 times** the solubility at 18 °C. The ionic strength is 0.0481 × 5.46 = 0.263 mol/L, √I = 0.513, and log γ = −0.509 × 4 × (0.513 ÷ 1.513 − 0.3 × 0.263) = −0.530, so γ = 0.296. The ion activity product is (655 ÷ 40,078) × (1,419 ÷ 96,060) × 0.296² = 2.11 × 10⁻⁵, which is **0.75 of K**: gypsum is not yet saturated. Silica rules 80% out in winter unless an antiscalant supplier confirms a silica limit about 50% above saturation for this water, which would be an unusual claim to rely on. The bore water saving is not worth the risk.
