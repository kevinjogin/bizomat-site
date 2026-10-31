---
book: solvent-vapours-by-the-numbers
chapterSlug: recovering-solvent
order: 10
title: "Recovering solvent"
description: "When condensing solvent from an air stream can and cannot work, the saturation limit on recovery, distilling dirty thinner under vacuum to keep it cool, and what a small still saves."
draft: false
---

Solvent that has been used is not necessarily spent. Dirty thinner from gun washing is mostly clean solvent carrying a few per cent of paint, and vapour leaving an oven is solvent that could, in principle, be turned back into liquid. Recovery saves the cost of new solvent and of waste disposal, and keeps solvent out of the air. Whether it pays depends on the same physics as the rest of this book: vapour pressure decides both how much a condenser can catch and how hot a still has to run.

This chapter works out what a condenser could recover from Plant S's oven exhaust, explains why the answer was nothing, and then sizes the operation that did work, a small vacuum still for the waste thinner. Its error is a recovery idea that the saturation limit rules out before any equipment is bought.

## Condensing vapour from air

A condenser cools a vapour-laden air stream so that some of the vapour turns back into liquid. Air leaving a condenser at temperature T can carry no more vapour than its saturated concentration at T, the vapour pressure at T divided by the total pressure. Vapour above that concentration condenses; vapour below it passes straight through. The most a condenser can recover is therefore the difference between the inlet concentration and the saturated concentration at its outlet temperature, and nothing at all if the inlet is already below saturation at that temperature.

```figure
type: formula
title: The most a condenser can recover from an air stream
caption: For one condensable component in a non-condensable gas, assuming the outlet leaves saturated at the condenser temperature. Mixtures follow the same idea component by component with Raoult's law, and condense less readily than their least volatile component alone.
- y_out ≤ P*(T_cond) ÷ P_total | outlet concentration at most the saturated value
- step: fraction recovered ≤ (y_in − y_out) ÷ y_in | if y_in > y_out
- step: nothing condenses if y_in ≤ P*(T_cond) ÷ P_total | the inlet is already unsaturated at the condenser temperature
```

## The oven exhaust

The idea of recovering the oven's vapour came up when the plant learned that about 85 kg of solvent a month left through the oven stack. The engineer worked out the concentration in that stack. Averaged over a batch, the oven releases about 0.92 kg/h of vapour, mostly toluene, into about 500 m³/h of exhaust. As a vapour volume, that is 0.275 m³/h, and the stack's concentration is 0.275 ÷ 500 = 0.055% by volume, a toluene partial pressure of about 0.056 kPa.

```figure
type: compare
title: Saturated toluene concentration at condenser temperatures, against the oven exhaust
rowhead: Condenser outlet temperature
cols: Saturated toluene concentration | Compared with the 0.055% in the exhaust
caption: This is an illustration. Toluene vapour pressure by the Clausius–Clapeyron relation from 2.91 kPa at 20 °C and 38.0 kJ/mol. Even at −30 °C, air can hold twice the exhaust's concentration of toluene, so nothing condenses.
- Cooling water, about 5 °C | 1.24% | 22 times the exhaust's concentration: nothing condenses
- Refrigerated, −10 °C | 0.49% | 9 times: nothing condenses
- Deep refrigeration, −20 °C | 0.24% | over 4 times: nothing condenses
- * Very deep refrigeration, −30 °C | 0.12% | twice: nothing condenses
```

The exhaust does not reach toluene's saturation until it is cooled to about −39 °C, and recovering 90% of its toluene would need a condenser at about −64 °C. At those temperatures, the moisture in 500 m³/h of air would freeze on the condenser long before any solvent appeared, and the refrigeration would cost far more than the 85 kg of solvent a month is worth.

## The error: a condenser for the stack

The plant's first proposal, before the engineer's calculation, was to fit a water-cooled condenser in the oven's exhaust stack, on the reasoning that hot vapour meeting a cold surface condenses, as steam does on a cold window. A supplier quoted for a unit and offered a trial.

The reasoning was right about steam and wrong about dilute solvent vapour. A cold window collects condensation from a bathroom because the air there is close to saturation with water vapour, so a few degrees of cooling takes it past the dew point. The oven exhaust was nowhere near saturation with toluene: at 0.055%, it was about one-twentieth of saturation even at 5 °C. Cooling it to cooling-water temperature would have produced warm, damp air and no solvent. The calculation took ten minutes and saved the trial, the cost of the unit and a disappointment that would have made the next good recovery idea harder to sell.

```figure
type: decision
title: Can a condenser recover solvent from this stream?
question: Is the solvent's concentration in the stream above its saturated concentration at a practical condenser temperature?
caption: Practical condenser temperatures are a few degrees above the coolant: about 5 to 10 °C with chilled water, down to about −20 °C with refrigeration before ice from the air's moisture becomes a serious problem. Dilute ventilation exhausts almost never qualify.
- * Yes, by a wide margin | condensing can recover most of the solvent | size the condenser and check ice and water handling
- Yes, but only just | condensing recovers a small fraction | consider concentrating the stream first, for example by adsorption
- No | condensing recovers nothing | reduce the solvent at its source, or use adsorption or thermal destruction if required
```

Condensers work on concentrated streams: the vent of a closed solvent tank during filling, the vapour from a still, or the purge from a drying chamber that holds a few per cent of solvent. Dilute ventilation exhaust needs a different technology, such as adsorption on activated carbon to concentrate the vapour before recovery, or thermal oxidation to destroy it. Both are justified only by large flows or regulatory requirements, and neither applied to Plant S. The cheapest way to recover the oven's solvent was not to put it there: the measures of Chapter 11 reduce the solvent in the paint film itself.

## Distilling dirty thinner

The waste thinner was a different matter. It was a liquid, about 80% solvent, and its contaminants, paint resins and pigments, were non-volatile. Distillation separates them: heat the dirty thinner, boil off the solvent, condense the vapour, which is concentrated by definition, and leave the residue behind.

Two features of Plant S's waste thinner shaped the still. First, after the fractionation of Chapter 3, the waste was mostly toluene, the least volatile component, which boils at 110.7 °C at atmospheric pressure. Second, the paint residue contained two-pack polyurethane, which the paint supplier advised should not be heated much above about 70 °C, to avoid curing reactions and decomposition in the still. A still running at atmospheric pressure would have to reach about 111 °C. Running it under a vacuum lowers the boiling point.

The [vacuum boiling point tool](/tools/vacuum-boiling-point/) works out the boiling temperature of a liquid at a reduced or raised pressure from one known boiling point and the enthalpy of vaporisation, by the integrated Clausius–Clapeyron relation, and the absolute pressure at which it boils at the highest temperature allowed, for vacuum drying, evaporation, distillation and degassing. It flags how far the result is extrapolated from the known point, and reminds the user that liquid depth and dissolved solids raise the boiling point.

```figure
type: compare
title: Boiling toluene under vacuum to stay below 70 °C
rowhead: Quantity
cols: Vacuum boiling point tool | NIST Antoine fit
caption: Tool inputs: known boiling point 110.65 °C at 101.325 kPa, enthalpy of vaporisation at the boiling point 33.2 kJ/mol, temperature limit 70 °C. The tool runs about 3 K low at 20 kPa because the enthalpy of vaporisation rises at lower temperatures, which the tool's extrapolation check warns of. Antoine coefficients from the NIST WebBook, valid from 35 °C to 112 °C.
- Boiling point at 20 kPa absolute | 58.9 °C | 61.9 °C
- * Pressure to boil at 70 °C | 29.5 kPa | 27.2 kPa
- Boiling point at 29.5 kPa | 70.0 °C | 72.3 °C
```

The tool says a still at 20 kPa absolute boils pure toluene at about 59 °C; the Antoine fit says about 62 °C. Both are comfortably below the 70 °C limit, with the difference covering the extrapolation error. Dissolved resin raises the boiling point further as the batch concentrates, so the still's controller watches liquid temperature, not just pressure, and stops the batch when the residue thickens. The engineer chose 20 kPa rather than the 27 to 30 kPa that would just reach 70 °C, to leave that margin.

### What the still recovers

Plant S bought a small batch vacuum still sized for its waste, rated for flammable solvents and installed by its supplier in a ventilated area away from ignition sources.

```figure
type: stats
title: Monthly results of the vacuum still
caption: This is an illustration. Waste about 120 L a month at 80% solvent; about 90% of the solvent recovered; prices from Chapter 1, excluding GST. The recovered solvent is mostly toluene and is reused for gun washing, not for thinning paint.
- 96 L | solvent in the month's waste thinner
- about 86 L | recovered as clean distillate
- about 34 L | residue left for disposal, down from 120 L
- about A$518 | monthly saving in new thinner and disposal
```

The recovered solvent is not the thinner the plant buys. It is mostly toluene, without the fast components, so it would change the paint's behaviour if used for thinning. It is ideal for flushing spray guns, where its slower evaporation is an advantage, and it replaced fresh thinner for that job entirely, with no complaints from the painters. The still pays for itself in a couple of years on solvent and disposal alone, and it also removes most of a hazardous waste stream from the site.

### The still's own condenser

The still shows where condensing does work. Inside it, the vapour leaving the boiling thinner is nearly pure solvent, at a partial pressure close to the still's operating pressure, so a water-cooled condenser at about 20 °C condenses almost all of it. What it cannot condense leaves with the small amount of air that leaks into the still and is drawn out by the vacuum pump. That gas leaves saturated at the condenser temperature: at 20 °C and 20 kPa absolute, toluene's vapour pressure of 2.91 kPa makes up about 14.6% of it. The flow is tiny, but it is rich, so the vacuum pump's exhaust is piped outside, above the roof, away from ignition sources, as the still's supplier specified.

### Checking the distillate

Recovered solvent is only useful if it is clean enough for its next job, and three simple checks tell the plant whether it is. A few millilitres evaporated to dryness on a clean glass plate should leave no visible film; a residue means resin has carried over, usually because the batch was run too far or boiled too hard. A density reading with a hydrometer or by weighing a known volume should sit near toluene's specific gravity of 0.87, since the fast components of the original thinner are largely gone; a markedly lower reading means more of the light components than expected, which is harmless for gun washing but worth knowing. And a sample left to stand in a clear bottle should stay a single clear layer: toluene dissolves very little water, so water carried over from condensation or from the waste itself separates as droplets or a lower layer and should be drained off before use.

The plant labels each drum of distillate with the batch date and the results of the three checks, keeps distillate apart from purchased thinner, and uses it only at the gun-washing station. A distillate drum is still a drum of flammable liquid, stored and handled exactly like new solvent.

## When the vapour is too dilute

For dilute vapour streams that must be treated, rather than simply discharged, two technologies are used in industry, and it is useful to know what they are even when, as at Plant S, neither is justified.

- **Adsorption.** Activated carbon holds solvent molecules on its very large internal surface. Air passes through a bed of carbon and leaves almost free of solvent until the bed nears saturation; the bed is then regenerated, often with steam or hot inert gas, releasing the solvent in a concentrated stream that can be condensed. Adsorption turns a dilute stream into a concentrated one, at the cost of carbon, regeneration energy and careful control, since carbon beds loaded with some solvents can heat up.
- **Thermal oxidation.** The solvent is burned, in a flame or over a catalyst, to carbon dioxide and water. Nothing is recovered, but the heat released can sometimes be used, and for mixed or contaminated vapours it is often the practical choice.

Both are capital equipment with running costs, justified by large flows, valuable solvents or regulatory requirements. For a workshop of Plant S's size, reducing the solvent at its source does far more for far less.

## A still or a recycler?

Plant S's alternative to its own still was to keep sending waste to the recycler. The comparison was not only about money. Running a still means storing and heating flammable liquid on site, maintaining the still, handling its residue, and training people to run it, all within the plant's hazardous area classification and its obligations for flammable liquids. A recycler takes those tasks away at a price. Hazardous waste transport and disposal are regulated by the state environment protection authorities, and the residue from a still is still hazardous waste.

The engineer's comparison, with illustrative figures, was that the still saved about A$518 a month and would pay for itself in a couple of years, but that it added a piece of equipment the plant had to be competent to run. The plant chose the still because its waste was consistent, its staff were already trained to handle the thinner, and the supplier offered installation, training and a service contract. A workshop with irregular, mixed waste might reasonably decide the other way.

## How this applies to a small Australian business

Before investing in vapour recovery, compare the stream's concentration with the solvent's saturated concentration at a practical condenser temperature: dilute exhausts cannot be condensed. Recover solvent where it is concentrated, above all from dirty liquid solvent, with a still rated for flammable liquids. Run the still under vacuum when the residue or the solvent must be kept cool, choosing a pressure with a margin below the temperature limit. Reuse recovered solvent where its changed composition does no harm, check each batch for residue, density and water, and keep it labelled and apart from new solvent.

## Exercise: an acetone wash

A parts washer produces 60 L a month of dirty acetone, 85% acetone, with a residue that must stay below 40 °C. (a) Using the vacuum boiling point tool's method, with acetone boiling at 56.2 °C at 101.325 kPa and 29.1 kJ/mol at its boiling point, what pressure boils acetone at 40 °C? (b) What pressure would you choose? (c) How much acetone would a still recovering 90% return each month?

**Worked answer.** (a) Solving the integrated Clausius–Clapeyron relation for the pressure at 40 °C: P = 101.325 × exp[−(29,100 ÷ 8.314)(1 ÷ 313.15 − 1 ÷ 329.35)] = 101.325 × e^−0.550 = **58.5 kPa** absolute. (b) A margin of about 10 K is reasonable, so choose the pressure that boils acetone at about 30 °C: 101.325 × exp[−(29,100 ÷ 8.314)(1 ÷ 303.15 − 1 ÷ 329.35)] = **40.4 kPa**; a setting of about **40 kPa absolute** leaves room for the rise in boiling point as the residue concentrates. (c) The waste holds 60 × 0.85 = 51 L of acetone, and 90% of that is **about 46 L** a month.
