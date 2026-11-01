---
book: combustion-by-the-numbers
chapterSlug: available-heat-and-the-furnace-load
order: 3
title: "Where the heat goes: available heat and the furnace load"
description: "Follow a gas furnace's fuel into the load, the walls and the flue, calculate available heat from flue temperature and excess air, and plan a load's fuel, time and cost."
draft: false
---

Every megajoule of gas a furnace burns ends up somewhere. Some goes into the work, which is the point. Some leaks through the walls, door and openings. And a large share leaves up the flue in the hot combustion products, which in a high-temperature furnace is usually the biggest loss of all. Knowing how the fuel divides between these destinations is the basis of every sensible decision about a furnace: how long a load takes, what it costs, and which improvement is worth paying for.

This chapter defines available heat, the share of the fuel's energy left in the furnace after the flue gas has taken its share, and calculates it from the flue temperature and excess air. It works out TF-120's wall loss, plans a typical load's fuel, time and cost, and describes the job price that was set from the burners' nameplate instead of from the heat balance.

## The energy balance of a furnace

The fuel's energy, on the higher heating value, is fixed by the gas burned. It divides as follows:

- **Heat to the load**: the work and its baskets or fixtures, from their mass, specific heat and temperature rise.
- **Wall and opening losses**: conduction through the walls, radiation from openings and gaps, and heat lost when the door is opened.
- **Flue loss**: the heat carried away by the combustion products as they leave at the flue temperature, including the latent heat of their water vapour.
- **Infiltration**: room air drawn in, heated and carried away, which Chapter 2 showed can be a few per cent in a leaky furnace under suction.

The first three are the ones to calculate. The flue loss is the one that sets a gas furnace apart from an electric one, and it is captured in a single figure, the available heat.

The baskets deserve a separate mention, because the heat that goes into them is counted as heat to the load but does nothing useful. In TF-120's standard load, 200 kg of the 1,000 kg heated each cycle is basket, so a fifth of the heat to the load, about 17.7 kWh, and the fuel needed to supply it, about 34 kWh at the heating share of 52.6%, are spent on steel that leaves the furnace as it came in. Lighter fixtures, or baskets sized so that each one carries a full load, are among the cheapest energy savings a batch furnace offers, and they shorten the heat-up as well.

## Available heat

**Available heat** is the share of the fuel's higher heating value that remains in the furnace after the flue gas has left at the flue temperature. It is what the burners actually deliver to the load and the walls. It is calculated by subtracting from the heating value the enthalpy of the flue gas above the temperature at which the air and fuel came in, and the latent heat of the water vapour in it.

```figure
type: formula
title: Available heat on the higher heating value
formula: AH = (HHV − L_water − Σ nᵢ Δhᵢ(T_flue)) ÷ HHV
caption: Per mole of methane. Enthalpies from NIST's Shomate coefficients; air and fuel enter at 25 °C. With preheated air, the air's own enthalpy is added back.
- HHV | 890.7 kJ per mole of methane
- L_water | latent heat of the 2 moles of water, 2 × 44.0 = 88.0 kJ
- nᵢ | moles of each flue gas component: 1 CO₂, 2 H₂O, 2e O₂, 7.547(1 + e) N₂
- Δhᵢ(T_flue) | enthalpy of each component from 25 °C to the flue temperature
step: TF-120, 650 °C flue, 15% excess air: AH = 62.6%
step: flue loss = 37.4% of the fuel, of which 9.9% is latent and 27.6% sensible
```

Available heat falls as the flue temperature rises, because hotter gas carries more energy away, and as the excess air rises, because there is more gas to carry it. The figure gives it across the range of process furnaces.

```figure
type: compare
title: Available heat for natural gas, % of the higher heating value
cols: 0% excess | 10% | 15% | 20% | 50% | 100%
rowhead: Flue gas temperature
caption: Calculated for methane with air and fuel at 25 °C and no air preheat. At high flue temperatures, excess air costs far more than at low ones.
- 200 °C | 83.7 | 83.1 | 82.8 | 82.6 | 80.9 | 78.1
- 400 °C | 75.9 | 74.7 | 74.1 | 73.5 | 69.9 | 63.9
- 600 °C | 67.8 | 65.9 | 64.9 | 64.0 | 58.3 | 48.9
- *650 °C | 65.7 | 63.6 | 62.6 | 61.5 | 55.4 | 45.1
- 800 °C | 59.2 | 56.6 | 55.3 | 54.0 | 46.2 | 33.3
- 1,000 °C | 50.3 | 47.0 | 45.3 | 43.7 | 33.7 | 17.1
```

Two lessons stand out. First, a high-temperature furnace is inherently less efficient than a low-temperature one: at 1,000 °C, more than half of the fuel's energy leaves in the flue even with ideal air. Second, excess air matters most where the flue is hottest. At 200 °C, going from 15% to 50% excess air costs about two points of available heat; at 650 °C it costs about seven, and at 1,000 °C about twelve. That is why the air–fuel ratio of a hot furnace deserves more attention than the same ratio on a low-temperature dryer.

### Why available heat and not combustion efficiency

Analysers often display a "combustion efficiency" calculated from flue temperature and oxygen. It is closely related to available heat, but it is often on the lower heating value, often calculated from the difference between flue and room temperature rather than from 25 °C, and sometimes leaves out the latent heat. Each of those choices can move the figure by several points. Available heat on the higher heating value is used throughout this book because it connects directly to the gas bill, which is on the same basis, and because it is the fraction that actually stays in the furnace.

## TF-120's walls and openings

This is an illustration. TF-120's chamber is lined with **150 mm** of ceramic fibre insulation, taken for the illustration as having a mean conductivity of **0.12 W/m·K** at its working temperatures, inside a 4 mm steel shell. Its outside surface area, excluding the door, is about **14 m²**. The outside surface loses heat to the 25 °C shop by convection, with a coefficient of about 8 W/m²·K, and by radiation, with an emissivity of about 0.8.

The [furnace wall design tool](/tools/furnace-wall-design/) solves this kind of wall: it finds the outside surface temperature at which conduction through the layers equals convection plus radiation from the surface, and gives the heat flux, the total loss for the area and the temperature at each interface. With a 600 °C hot face and the values above, it gives a surface temperature of about **57 °C**, a flux of about **434 W/m²**, and a loss through the walls of about **6.1 kW**. The door, its seal, the flue opening and the burner ports add more. For the illustration, the shop takes TF-120's total standing loss at temperature as **12 kW**, about twice the wall loss alone, which is typical of batch furnaces with large doors.

### The open door

The standing loss assumes the door is shut. When it is opened at temperature to load or unload, the chamber radiates straight out through the opening, and the loss is far larger than through the insulated walls. A furnace chamber seen through its door behaves almost like a black body, because radiation entering the opening is reflected around inside many times before it can escape. The [radiant heat loss tool](/tools/radiant-heat/), with an emissivity of 1, gives the radiation from an opening to the room.

This is an illustration. TF-120's door opening is about 1.0 m wide and 1.2 m high. At a chamber temperature of 600 °C and a room at 25 °C, a black opening radiates about σ × (873.15⁴ − 298.15⁴) ≈ **32.5 kW per square metre**, or about **39 kW** through the open door, a third of the burners' full input and more than three times the furnace's whole standing loss. A door held open for 3 minutes loses about 2 kWh by radiation alone, before the hot gas that spills out of the top of the opening and the cold air that flows in at the bottom are counted. Loading a hot furnace quickly, with the load staged and the forklift ready, is worth more than it looks.

## Planning a load

With the available heat and the standing loss, a load can be planned. The load is 800 kg of steel parts and 200 kg of baskets, heated from 20 °C to 600 °C. Steel's specific heat rises with temperature; for the illustration, a mean value of **0.55 kJ/kg·K** over that range is used.

```figure
type: formula
title: TF-120's load plan
formula: E = Q ÷ η_heat + (L ÷ AH) × t_soak
caption: This is an illustration, following the furnace load plan tool. η_heat is the share of the burners' input reaching the load while heating: available heat less the standing loss as a share of input.
- Q | heat to the load, 1,000 kg × 0.55 × 580 K = 319 MJ = 88.6 kWh
- η_heat | 0.626 − 12 ÷ 120 = 0.526
- L ÷ AH | fuel to hold temperature, 12 ÷ 0.626 = 19.2 kW
- t_soak | 2 h
step: heat-up at full fire = 88.6 ÷ (120 × 0.526) = 1.40 h
step: E = 88.6 ÷ 0.526 + 19.2 × 2 = 168.5 + 38.4 = 206.9 kWh = 745 MJ, about 19.3 m³ of gas
step: cost at A$30/GJ (A$0.108/kWh) = A$22.35 a load, 2.8 cents per kilogram of work
```

The [heat-treatment furnace load plan tool](/tools/furnace-heat-treat-plan/) does the same sum from the work and fixture masses, mean specific heat, temperatures, furnace input, the share of input reaching the load, the standing loss and soak time, and an energy price. For a gas furnace, the standing loss is entered as the fuel needed to hold temperature, the wall loss divided by the available heat, because the tool adds it as input energy. With those inputs it reproduces the figures above.

The heat-up time of 1.40 hours is a lower bound. It assumes the burners can fire at full input throughout, but as the load approaches its set point, heat transfer into it slows, the controller turns the burners down, and the last part of the heat-up takes longer. How long a load takes to heat through depends on its section and on the heat transfer at its surface, which is the subject of *Heating and Cooling Times by the Numbers*.

### Where one load's fuel goes

```figure
type: bars
title: Where TF-120's 206.9 kWh per load goes
unit: kWh
max: 100
caption: This is an illustration. The flue takes nearly as much as the load; the walls and openings take about a fifth of the fuel over a 3.4-hour cycle.
- * Into the work and baskets | 88.6
- Up the flue | 77.4
- Walls, door and openings | 40.8
```

The breakdown points to where improvements can come from. Better insulation or a tighter door would cut the 40.8 kWh of standing loss, and Chapter 4 looks at cutting the 77.4 kWh flue loss by preheating the combustion air. Shorter soaks, fuller loads and fewer door openings reduce both.

## Testing the balance with the sub-meter

A heat balance built from assumptions should be checked against measurements, and the gas sub-meter makes that straightforward. Reading the meter at the start and end of each load, and recording the load mass, the set temperature, the soak time and the number of door openings, costs a minute a load and builds the data set that every later decision about the furnace can rest on. The load plan predicts that fuel per load rises in a straight line with load mass: a fixed part that does not depend on the load, here the 38.4 kWh to hold temperature through the soak, and a variable part that does. For TF-120 the model gives **173.2 kWh** for a load of 600 kg of work in 200 kg of baskets and **206.9 kWh** for the standard 800 kg, a slope of about 0.17 kWh for each extra kilogram.

Metering a dozen loads of different masses and fitting a straight line through fuel against mass separates the two parts from real data. If the measured intercept is much larger than predicted, the standing loss is larger than assumed, perhaps a damaged door seal or a burner holding too high a fire at temperature. If the slope is larger, the share reaching the load while heating is lower, which points to the flue: too much excess air or a flue temperature higher than expected. The line also gives the estimator what this chapter's error needed: a fixed cost per load and a variable cost per kilogram, both measured.

## The error: pricing from the nameplate

This is an illustration. When the shop first quoted tempering work on TF-120, the estimator worked out the gas cost per load by multiplying the burners' rated input, 120 kW, by the cycle time of about 3.4 hours: **408 kWh**, or about 38 m³ of gas a load. At A$0.108/kWh that was A$44 a load, which the estimator built into the price per kilogram.

After three months the gas sub-meter told a different story: the furnace was using about 19 to 20 m³ a load, about half the estimate. The nameplate input is the most the burners can fire, not what they fire. During the heat-up the burners run at or near full input, but during the 2-hour soak they only need to replace the standing loss, about 19.2 kW of fuel, a sixth of their rating. The heat balance, not the nameplate, was the right basis.

Overestimating cost is a safer error than underestimating it, but it had cost the shop work: two tempering quotes had been lost on price. The estimator now uses the load plan above, checked each quarter against the metered gas per load, and keeps the nameplate figure only as the upper limit for sizing the gas supply.

## Exercise: the cost of drifting air

Suppose TF-120's air damper linkage slips and the burners drift to **50% excess air** (about 7.5% oxygen dry) without anyone noticing. Using the available heat table and the same load, standing loss and soak, what is the new fuel per load and cost, and how much more is that than the correct setting?

**Worked answer.** At 650 °C and 50% excess air, the available heat is **55.4%**. The share reaching the load while heating becomes 0.554 − 0.10 = **0.454**, so the heat-up takes 88.6 ÷ (120 × 0.454) = **1.63 h** instead of 1.40. The fuel to hold temperature becomes 12 ÷ 0.554 = 21.7 kW. The fuel per load is 88.6 ÷ 0.454 + 21.7 × 2 ≈ **238.7 kWh**, which costs about **A$25.78**. That is about 31.8 kWh, or **15%**, more than the 206.9 kWh at the correct setting, and the cycle is 14 minutes longer. Over 500 loads a year, the slipped linkage would cost about 57 GJ of gas, about A$1,700, and about 115 hours of furnace time, which is why the oxygen reading belongs in every routine check.
