---
book: solvent-vapours-by-the-numbers
chapterSlug: evaporation-from-open-surfaces
order: 5
title: "Evaporation from open surfaces"
description: "How fast solvent evaporates from open containers, wipes and spills, the mass transfer coefficient, measuring it by weighing, and what lids, freeboard and cooler liquid save."
draft: false
---

An open container of solvent loses liquid every minute it stands open, during work and long after it. The rate depends on the solvent's vapour pressure, on the area exposed, on the air moving over it and on how far down the liquid sits inside the container. Most of it can be stopped with a lid. Putting a number on the loss turns that obvious advice into a business case and, as Plant S found, into a surprise about where its solvent was going and when.

This chapter sets out the rate equation for evaporation, explains the mass transfer coefficient and the correlations used to estimate it, measures it at Plant S by weighing, and shows what lids, cooler liquid and smaller areas save. Its error is a loss judged by eye during the working day.

## The rate equation

Evaporation from a liquid surface into moving air is a mass transfer process. Right at the surface, the air is saturated with vapour, at a concentration set by the vapour pressure. Away from the surface, the concentration falls to whatever is in the room, often close to zero by comparison. Vapour diffuses and is carried across that difference, and the rate per unit area is proportional to it.

```figure
type: formula
title: The evaporation rate from an open surface
caption: Cₛ is the mass of vapour per cubic metre of saturated air at the liquid's temperature, from the ideal gas law. The mass transfer coefficient k has units of velocity and carries all the effects of air movement, container shape and the vapour's diffusivity.
- m = k A (Cₛ − C_room) | evaporation rate, kg/s
- step: Cₛ = P M ÷ (R T) | saturated vapour concentration, kg/m³
- step: m ≈ k A P M ÷ (R T) | when the room concentration is small
- step: for a blend, P M is replaced by Σ pᵢ Mᵢ | the vapour mass from each component's partial pressure
```

The rate is proportional to vapour pressure times molar mass, which is why Chapter 2's ranking used that product. It rises with temperature in step with vapour pressure, and it is proportional to the exposed area.

### The mass transfer coefficient

Everything else is in the mass transfer coefficient k. It increases with air speed over the surface, decreases slightly with the size of the surface in the direction of the air flow, because the air picks up vapour as it crosses and becomes less able to take more, and depends on how fast the vapour diffuses in air, expressed through the Schmidt number, the ratio of the air's kinematic viscosity to the vapour's diffusivity.

For pools and spills in open air, a widely used correlation is that of Mackay and Matsugu, published in 1973 for hydrocarbon spills. It has the form k = 0.0048 U^(7/9) Z^(−1/9) Sc^(−2/3) in metres per second, with the wind speed U in metres per second, the pool's diameter Z in metres and the Schmidt number Sc. For a 0.3 m pool in a 2 m/s breeze and a Schmidt number of about 1.4, illustrative for a solvent vapour in air, it gives about 7.5 mm/s.

Inside a container the picture is very different. When the liquid sits below the rim, the space above it is sheltered, the air above the surface is slow and already loaded with vapour, and the coefficient falls sharply, often by several times. Open-pool correlations overestimate evaporation from containers. The reliable way to find k for a real container in a real workshop is to measure it, and the measurement needs nothing more than a scale, a clock and a thermometer in the liquid.

## Measuring by weighing

Weighing a container over a known time gives its evaporation rate directly, and dividing by A Cₛ gives its mass transfer coefficient. Plant S's engineer put the two open containers on a platform scale, one at a time, and weighed them at the start and end of a full day, 24 hours, with the workshop working normally.

```figure
type: compare
title: Plant S's open containers, weighed over 24 hours
rowhead: Container
cols: Open area | Saturated vapour concentration at 24 °C | Loss in 24 hours | Mass transfer coefficient
caption: This is an illustration. Average liquid temperature 24 °C. Saturated concentrations from the Clausius–Clapeyron vapour pressures of Chapter 2 and, for the thinner, Raoult's law; coefficients back-calculated from the weighed loss. Both are far below an open-pool estimate, because the liquid sits well below the rim.
- * Acetone bucket for wiping rags, 300 mm diameter, no lid | 0.0707 m² | 0.688 kg/m³ | 4.1 kg | 0.98 mm/s
- Gun-washing drum of thinner, open-top 205 L | 0.255 m² | 0.274 kg/m³ | 3.0 kg | 0.50 mm/s
```

Two facts stand out from the weighing. The acetone bucket, much smaller in area, loses more than the drum, because acetone's saturated vapour concentration is two and a half times the thinner's and its liquid sits nearer the rim. And between them the two containers lose about 7.1 kg a day, about 213 kg a month, more than the first allocation of Chapter 1 had given them. The open containers were the single largest controllable source in the plant.

## The error: judging the loss by eye

Before the weighing, the supervisor's estimate of the bucket's loss was "a few hundred grams a shift", based on watching the level during the morning and topping it up at lunch. It had been entered in the plant's first allocation as about 0.5 kg a day.

The estimate was wrong in two ways. The level was hard to read in a bucket that was constantly being dipped and topped up, and the loss during the 8-hour shift was in fact about 1.4 kg. More importantly, the estimate counted only the working day. The bucket had no lid. It stood open for 24 hours a day, seven days a week, and evaporated at about the same rate whether anyone was using it or not. Two-thirds of its daily loss happened while the workshop was empty.

```figure
type: stats
title: The acetone bucket, estimated and weighed
caption: This is an illustration. The estimate counted the visible loss during working hours; the scale counted all day, every day.
- about 0.5 kg | daily loss as estimated by eye during the shift
- 1.4 kg | loss during the 8-hour shift, by weighing
- 4.1 kg | loss over 24 hours, by weighing
- about 8 times | the daily loss as a multiple of the estimate
```

The general lesson is that open containers evaporate on their own schedule, not the workshop's. A loss judged during working hours misses nights, weekends and holidays, which together make up about three-quarters of the year.

## What lids and dispensers save

The obvious fix was the right one. The engineer replaced the acetone bucket with two plunger dispensing cans, which release a small puddle of solvent onto a rag pressed onto a perforated plate and drain the rest back, and which are closed at all other times. The gun-washing drum got a fitted lid with a small, self-closing port for the gun, and the drum was moved out of the main walkway, away from the forklift route.

The scale was used again after a week.

```figure
type: compare
title: Daily loss before and after covering Plant S's open containers
rowhead: Container
cols: Before, open | After | Monthly saving
caption: This is an illustration. Weighed over 24 hours on a normal working day. Savings at A$4.00 a litre for acetone and A$4.50 for thinner, excluding GST. The equipment cost a few hundred dollars and paid for itself within a fortnight.
- * Acetone: bucket replaced by plunger cans | 4.1 kg | 0.15 kg | about 150 L, about A$600
- Thinner: drum lid with a self-closing port | 3.0 kg | 0.3 kg | about 94 L, about A$423
- Total | 7.1 kg | 0.45 kg | about 200 kg, about A$1,023
```

About 200 kg a month of vapour no longer entered the workshop air, close to 40% of the plant's total evaporated solvent, at a cost of a few hundred dollars. In the hierarchy of control, keeping solvent covered is an engineering control at the source, and it is usually the cheapest of them. It also lowers the vapour concentration around the bench, which helps with the health limits of Chapter 7 at no extra cost.

### Freeboard, area and temperature

Where a container has to stay open while it is used, three things reduce its evaporation.

- **Freeboard.** Keeping the liquid well below the rim of a container shelters it, as the drum's lower coefficient shows. Dip tanks for cleaning are usually designed with a freeboard of a good fraction of their width for this reason.
- **Area.** Evaporation is proportional to the exposed area. A tall, narrow container loses less than a wide, shallow one holding the same volume.
- **Temperature.** At 35 °C instead of 24 °C, acetone's saturated concentration rises from 0.688 to 1.046 kg/m³, and its evaporation by the factor 1.52. Keeping solvent containers out of sun and away from heaters, ovens and compressors reduces their loss.

## Wipes and rags

Solvent on a rag evaporates completely, by design: wiping relies on the solvent carrying oil away from the surface and then leaving. The only question is where it evaporates. A rag wetted at the bench and used at the part releases its solvent at the part, into the operator's breathing zone, and a used rag dropped into an open bin releases the rest beside the bench. Plant S's wiping used about 30 g of acetone per rag and about 2,300 rags a month, about 70 kg of acetone, all of which evaporated.

Three changes cut it. The plunger cans dispense a measured small amount per rag instead of a soaking. Used rags go into a closed, self-closing metal bin, which stops them releasing their remaining solvent into the room and is in any case good practice for flammable waste. And, for the parts that needed only light cleaning, a less volatile cleaner was trialled, which Chapter 11 evaluates.

## Evaporation from a sprayed film

Paint solvent evaporates under very different conditions from a solvent in a bucket. A sprayed film is thin, tens of micrometres wet, spread over the whole area of the part, and swept by the booth's airflow. Its mass transfer coefficient is high and its area enormous compared with any container, so the fast solvents in it leave within a few minutes. As they go, the film thickens, the remaining solvent has to diffuse out through an increasingly viscous layer, and evaporation slows; the slowest solvents leave over the following tens of minutes, much of them in the oven.

For Plant S, the split between booth and oven matters because they are ventilated differently. Vapour released in the booth is carried away by the booth's extraction; vapour released in the oven has to be removed by the oven's exhaust, which Chapter 9 sizes. The engineer estimated the split by weighing painted test panels: a panel weighed immediately after spraying, again at the end of the flash-off period and again after the oven. On the plant's paint and thinning ratio, about two-thirds of the solvent left during spraying and flash-off and about one-third in the oven. That proportion is a property of the paint, the thinner, the film thickness and the flash-off time, and it changes when any of them does.

## Weighing as a habit

Weighing proved so useful that the engineer kept it going in three small ways. The paint tins at the mixing bench were weighed before and after each mix, so that paint and thinner use per frame could be tracked. The waste thinner drum was weighed when it was collected, not estimated by its level. And the plunger cans and the gun-washing drum were weighed on the first working day of each month, a five-minute job that showed at once if a lid had been left off or a can had been replaced by an open bucket again.

A kitchen-grade platform scale reading to 10 g, costing well under A$200, was enough for all of it. Measurements of this kind are more convincing to people on the floor than any calculation, because they can see the number change.

## Spills

A spill is an open surface with no container at all, full exposure to air movement and often a large area. An open-pool correlation such as Mackay and Matsugu's is appropriate here. A 1 L spill of acetone spread to a 1 m² pool on a warm floor in a draught evaporates in minutes, releasing several hundred litres of vapour at floor level, where, as Chapter 1 noted, it tends to stay. That is why spill kits, absorbents that can be bagged and sealed, and ventilation at floor level belong near solvent use, and why ignition sources should be kept away from where spills could spread.

## How this applies to a small Australian business

Weigh your open solvent containers over a full day: the result is usually larger than anyone expects, because containers evaporate when nobody is watching. Cover them. Plunger cans, safety cans with self-closing lids and fitted drum lids cost little and pay back quickly in solvent not bought. Where containers must be open, keep the liquid well below the rim, the area small and the temperature low. Dispense measured amounts onto rags and put used rags in a closed metal bin. Then weigh again a week later, and once a month after that, so that the saving is measured rather than assumed and a lid left off is noticed within days, not at the next stocktake.

## Exercise: a dip tank

A cleaning dip tank 600 by 400 mm holds acetone at 22 °C, with the liquid 150 mm below the rim. Weighing shows a loss of 3.6 kg over an 8-hour shift with the lid open. (a) What is the saturated vapour concentration at 22 °C, using the Clausius–Clapeyron relation from 24.6 kPa at 20 °C and 31.3 kJ/mol? (b) What is the mass transfer coefficient? (c) If the lid is kept closed except for 2 hours of actual dipping per shift, and the closed tank loses almost nothing, what is the saving per 8-hour shift?

**Worked answer.** (a) P = 24.6 × exp[−(31,300 ÷ 8.314)(1 ÷ 295.15 − 1 ÷ 293.15)] = **26.84 kPa**, and Cₛ = 26,840 × 0.05808 ÷ (8.314 × 295.15) = **0.635 kg/m³**. (b) The rate is 3.6 ÷ (8 × 3,600) = 1.25 × 10⁻⁴ kg/s over an area of 0.24 m², so k = 1.25 × 10⁻⁴ ÷ (0.24 × 0.635) = **0.82 mm/s**. (c) With the lid open only 2 hours of the 8, the loss falls to about a quarter, 0.9 kg, a **saving of about 2.7 kg a shift**, about 3.4 L of acetone. If the tank had stood open overnight as well, the saving from a lid would be larger still.
