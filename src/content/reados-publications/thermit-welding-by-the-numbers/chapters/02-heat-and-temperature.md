---
book: thermit-welding-by-the-numbers
chapterSlug: heat-and-temperature
order: 2
title: "Heat and temperature of the reaction"
description: "Calculate the heat a thermit charge releases from enthalpies of formation, estimate the temperature it can reach, and compare 1921 calculations and measurements with modern figures."
draft: false
---

A thermit charge carries its own fuel and its own oxygen, locked in the aluminium and the iron oxide. When it reacts, the heat released goes into the products themselves, so they reach temperatures far above the melting point of steel in a few seconds. That surplus of heat above melting, the superheat, is what lets the poured iron melt into the faces of the parts and fuse with them. How much heat there is, and how hot the iron gets, can be calculated from tabulated data, and the calculation explains both the power of the process and its sensitivity to losses.

This chapter calculates the heat of the reaction, estimates the temperature, compares the estimate with figures from 1921 and today, and works out what the superheat can do in the crusher-frame weld.

## Heat from enthalpies of formation

The heat released by a reaction can be calculated from the standard enthalpies of formation of the substances involved: the heat released or absorbed when each compound is formed from its elements. The elements themselves, aluminium and iron, have zero enthalpy of formation by definition. The heat of the reaction is the enthalpy of formation of the products minus that of the reactants.

From the NIST Chemistry WebBook, the standard enthalpies of formation are about −1,675.7 kJ/mol for aluminium oxide, −824.2 kJ/mol for haematite and −1,118.4 kJ/mol for magnetite. The negative signs mean heat is released when the compounds form.

```figure
type: formula
title: Heat released by the haematite and magnetite thermit reactions
formula: ΔH = Σ ΔHf(products) − Σ ΔHf(reactants)
caption: Standard enthalpies of formation from the NIST Chemistry WebBook. The values are per mole of reaction as written, at 25 °C; dividing by the mass of the charge gives the heat per kilogram.
- Fe₂O₃ + 2Al → 2Fe + Al₂O₃ | charge 213.6 g
- 3Fe₃O₄ + 8Al → 9Fe + 4Al₂O₃ | charge 910.4 g
step: haematite: ΔH = −1,675.7 − (−824.2) = −851.5 kJ, or about −3,990 kJ per kg of charge
step: magnetite: ΔH = 4 × (−1,675.7) − 3 × (−1,118.4) = −3,347.6 kJ, or about −3,680 kJ per kg of charge
```

So a kilogram of magnetite thermit releases about **3.7 MJ**, and a kilogram of haematite thermit about **4.0 MJ**. Haematite releases slightly more per kilogram because it holds more oxygen per unit of iron, so more aluminium oxide is formed.

## How that compares with a fuel

A kilogram of propane releases about 46 MJ when burnt, more than twelve times as much as a kilogram of thermit. But propane needs about three and a half kilograms of oxygen from the air for every kilogram burnt, and a burner releases its heat into a large volume of hot gas. Thermit needs no air: its oxygen is in the charge, and the heat is released in a small volume of liquid metal and slag. What thermit lacks in energy per kilogram it makes up in concentration and speed.

This is an illustration. The crusher-frame weld needs about 102 kg of thermit (Chapter 4). At 3.68 MJ per kilogram, the charge releases about 102 × 3.68 ≈ **375 MJ**, about 104 kWh. Hart wrote in 1910 that the whole contents of the crucible were boiling within a fraction of a minute of ignition. If a 102 kg charge reacted in about 20 seconds, the average power would be about 375 ÷ 20 ≈ **19 MW**, the output of a small power station, concentrated in a crucible. Chapter 3 explains why that rate of energy release demands such care.

## Estimating the temperature

If no heat were lost, all of the reaction heat would go into the products, raising them from room temperature, melting them and superheating the liquid. A simple heat balance gives a rough figure.

This is an illustration. Per kilogram of magnetite charge, the products are about 0.552 kg of iron and 0.448 kg of aluminium oxide. Using approximate average values over the whole range, about 0.80 kJ/kg·°C for iron including its liquid range, 270 kJ/kg for its latent heat of melting, about 1.25 kJ/kg·°C for aluminium oxide and about 1,090 kJ/kg for its latent heat, the heat needed to melt both products and raise them to a temperature T is roughly:

0.552 × (0.80 × (T − 25) + 270) + 0.448 × (1.25 × (T − 25) + 1,090) kJ

Setting this equal to the 3,677 kJ released gives T ≈ **3,060 °C**. This figure is an upper bound with crude property values. In reality, heat is lost by radiation from the boiling surface and to the crucible, some iron and aluminium vaporise, and the reaction is not perfectly complete.

## The 1921 figures and today's

Viall gave three temperatures in 1921. Joseph W. Richards, in *Metallurgical Calculations*, calculated the theoretical temperature of the reaction as 2,694 °C. Féry, using a radiation pyrometer, measured the stream of steel leaving the crucible at 2,300 °C, which Viall considered about right once the chilling effect of the crucible was allowed for. Hart in 1910 gave a figure of about 2,500 °C for the boiling crucible. TWI's modern description puts the reaction at around 2,000 °C.

```figure
type: bars
title: Thermit temperatures, calculated and measured
unit: °C
max: 3200
caption: The simple heat balance in this chapter has no losses and crude property values, so it is an upper bound. Richards' figure is a 1921 theoretical calculation; Féry's is a measurement of the stream leaving the crucible; TWI's is a modern round figure. The melting point of iron is shown for comparison.
- Simple heat balance, no losses | 3060
- Richards, calculated, 1921 | 2694
- Hart, boiling crucible, 1910 | 2500
- *Féry, measured stream, 1921 | 2300
- TWI, modern description | 2000
- Melting point of iron | 1535
```

The figures form a sensible sequence: an idealised calculation at the top, then calculations with better data, then measurements of real streams that have lost heat, then a modern round figure. Every one of them is well above the 1,535 °C that TWI gives for the melting point of iron. Viall took the melting point of steel as about 1,350 °C and concluded that thermit steel was nearly twice as hot; with a modern figure of around 1,500 °C for low carbon steel, the measured stream is still roughly 800 °C above melting.

## Where the heat goes in the crucible

The same approximate property values show where the heat ends up if the products leave the crucible at the measured 2,300 °C. This is an illustration, per kilogram of magnetite charge:

- heating and melting 0.552 kg of iron to 2,300 °C takes about 0.552 × (0.80 × 2,275 + 270) ≈ 1,150 kJ;
- heating and melting 0.448 kg of aluminium oxide to 2,300 °C takes about 0.448 × (1.25 × 2,275 + 1,090) ≈ 1,760 kJ;
- the remaining 3,677 − 2,916 ≈ 760 kJ, about a fifth of the total, is lost to the crucible, by radiation from the boiling surface, in vapour and in incomplete reaction.

Two points stand out. The slag takes more of the heat than the iron does, because aluminium oxide has a high specific heat and a large latent heat, and there is almost as much of it. And the losses, about a fifth, are of the same order as everything the process can afford to lose: the iron's superheat, calculated below, is only about a tenth of the total heat. For the crusher-frame charge, the split is roughly 118 MJ into the iron, 180 MJ into the slag and 78 MJ lost.

## Additions cool the charge

Charges for welding steel often include steel punchings or other metallic additions, as Chapter 8 describes. They add to the weld metal and adjust its composition, but they also absorb heat: each kilogram of cold steel added must be heated and melted to the temperature of the iron, roughly 0.80 × 2,275 + 270 ≈ 2,090 kJ to reach 2,300 °C. A charge with a substantial proportion of punchings therefore runs cooler than plain thermit, and its proportion is a balance between more weld metal and less superheat. Hart's 1910 examples, discussed in Chapter 8, added punchings at roughly a tenth of the thermit's weight.

## Measuring a temperature of 2,300 °C

Viall noted that the temperature of the reaction itself was beyond what a pyrometer could measure, which is why Richards calculated it; Féry's figure was a measurement, with a radiation pyrometer, of the stream leaving the crucible. A radiation pyrometer infers temperature from the light and heat a surface emits, and its reading depends on the emissivity assumed for the surface, which for a stream of liquid iron partly covered by slag and fume is uncertain. Modern optical and two-colour pyrometers reduce but do not remove that uncertainty. Temperatures quoted for thermit are therefore best read as approximate, which is why this chapter gives a range rather than a single figure.

## What the superheat is for

The superheat is the heat in the liquid iron above its melting point. It is what the poured metal can give up to the parts while staying liquid, and it is what melts the faces of the parts so that the weld fuses with them rather than merely casting against them.

This is an illustration. If the iron reaches the mould at about 2,300 °C and freezes at about 1,510 °C, each kilogram can give up about 0.80 × (2,300 − 1,510) ≈ **630 kJ** of superheat before it starts to freeze. The crusher-frame charge yields about 56 kg of iron in theory (Chapter 1), so it carries about 56 × 630 ≈ **35 MJ** of superheat.

How much parent metal could that melt? Melting a kilogram of steel from room temperature needs roughly 0.75 × 1,485 + 270 ≈ 1,385 kJ. If all 35 MJ went into the parts, it could melt about 35,000 ÷ 1,385 ≈ **25 kg** of cold steel. In practice much of the superheat goes into heating the mould and the parts below their melting point, which is why the parts are preheated (Chapter 6): preheating to red heat means much less of the superheat is spent bringing the faces up to temperature, and more is left to melt them.

```figure
type: stats
title: The crusher-frame charge in energy terms
caption: This is an illustration using the theoretical yield and approximate property values. The superheat, not the total heat, is what melts the faces of the parts.
- 102 kg | Thermit charge
- 375 MJ | Total heat released, about 104 kWh
- *35 MJ | Superheat in 56 kg of iron above its freezing point
- about 19 MW | Average power if the charge reacts in about 20 s
```

## Why losses matter so much

The superheat is a small fraction of the total heat: about 35 MJ out of 375 MJ in the illustration. Most of the reaction's heat is spent melting and heating the products to the temperature at which they leave the crucible. So a modest loss of heat, for example from a cold or damp crucible, a delay between the end of the reaction and tapping, or a long, cold runner, takes a large bite out of the superheat.

This is an illustration. If the iron reaches the mould at 2,100 °C instead of 2,300 °C, its superheat falls to about 0.80 × (2,100 − 1,510) ≈ 470 kJ per kilogram, a quarter less, and the weld faces are less likely to fuse fully. That is why thermit procedures specify tapping times, crucible preheating and mould design so carefully, and why welds poured late tend to show lack of fusion at the faces.

The same reasoning applies to the size of the weld. A small weld has a small mass of iron and a large surface of mould and parts relative to that mass, so it loses its superheat quickly; a large weld holds its heat longer. Viall observed that thermit was not practical for very small sections or long seams in thin material, where oxy-acetylene or electric welding were better. In heat terms, the small weld simply does not carry enough superheat for its surface area.

## A failure: the late tap

This is an illustration. The quarry siding's failed rail weld, examined by the rail contractor, had broken across the weld after several years in service, with a fracture face that showed a smooth, unfused band along part of the original rail end. The rest of the face showed sound fusion.

The weld record showed a note that the crucible had been tapped later than the procedure specified, because a crew member had been distracted. The rail contractor's metallurgist explained the likely mechanism: during the delay the liquid iron and slag in the crucible lost heat, the iron entered the mould with less superheat, and part of the rail end face never reached melting. The unfused band acted as a crack from the day the weld was made, and traffic slowly grew a fatigue crack from it until the rail broke.

The fracture face itself was the evidence. A fusion defect present from the start shows a smooth, often oxidised surface where the iron lay against the rail without melting into it, quite different from the beach marks of the fatigue crack that grew from its edge. The contractor replaced the weld under its approved procedure and reviewed the timing controls with its crews; its procedures already required tapping within a set time of the reaction finishing, and the review reinforced that. The quarry added a check of weld records to its siding inspection routine, the subject of Chapter 9.

## Exercise: a haematite charge's heat

A 10 kg haematite thermit charge is used for a demonstration. Calculate the heat released, the theoretical iron yield, and the superheat carried by that iron if it leaves the crucible at 2,300 °C and freezes at 1,510 °C, using 0.80 kJ/kg·°C.

At about 3,990 kJ per kilogram, 10 kg releases about **39.9 MJ**. The theoretical iron yield is 52.3%, so about **5.23 kg** of iron. Its superheat is 5.23 × 0.80 × (2,300 − 1,510) ≈ 5.23 × 632 ≈ **3.3 MJ**.

As with the magnetite charge, the superheat is less than a tenth of the total heat released. A charge sized only by the iron needed to fill a gap would have little margin for losses, which is one reason the charge rules in Chapter 4 allow generously for the runner and riser.
