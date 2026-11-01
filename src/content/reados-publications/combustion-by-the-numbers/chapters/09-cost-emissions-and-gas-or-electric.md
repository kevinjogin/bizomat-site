---
book: combustion-by-the-numbers
chapterSlug: cost-emissions-and-gas-or-electric
order: 9
title: "Cost, emissions and choosing gas or electric"
description: "Compare gas and electric process heat per useful gigajoule, calculate carbon dioxide from the chemistry, find the break-even price and grid factor, and rank the improvements for TF-120."
draft: false
---

Sooner or later every gas-fired furnace faces the question of whether it should be gas-fired at all. Electricity prices, gas prices, emissions targets, customer requirements and the age of the equipment all push on the decision, and so do opinions. The numbers that settle it are not the prices on the two bills, but the cost and the emissions of each megajoule that actually reaches the work.

This chapter compares gas and electric heating for TF-120 on that basis, calculates the carbon dioxide released by burning natural gas from the chemistry of Chapter 1, finds the electricity price and grid emission factor at which the two options break even, ranks the improvements found in earlier chapters, and describes the comparison that made gas look nearly three times cheaper than it is.

## Purchased energy and useful energy

A gigajoule of gas and a gigajoule of electricity are the same amount of energy, but they do not deliver the same heat to a furnace. In a gas furnace, the flue gas takes its share before anything else: at TF-120's 650 °C flue and 15% excess air, only 62.6% of the gas's energy is available heat. In an electric furnace there is no flue. Almost all the electricity becomes heat inside the furnace; the remaining losses, in cables, switchgear and controls, are a few per cent. For the illustration, an electric version of TF-120 is taken to turn **95%** of its electricity into heat in the chamber.

Both furnaces then lose the same heat through their walls and openings, and both put the same heat into the load. The useful comparison is the cost of a gigajoule of heat delivered inside the furnace.

```figure
type: formula
title: Cost of heat delivered inside the furnace
formula: cost per useful GJ = price per GJ purchased ÷ share delivered
caption: This is an illustration at A$30/GJ for gas and A$0.30/kWh (A$83.3/GJ) for electricity, both including GST.
- Gas | share delivered = available heat, 62.6% at 650 °C and 15% excess air
- Electricity | share delivered = 95%, assumed for an electric furnace
step: gas: 30 ÷ 0.626 = A$47.9 per useful GJ
step: electricity: 83.3 ÷ 0.95 = A$87.7 per useful GJ, 1.83 times the gas figure
```

The [energy and work converter](/tools/energy-converter/) converts between kilowatt-hours, megajoules, gigajoules and other energy units, which is the first step in putting a gas bill in gigajoules and an electricity bill in kilowatt-hours on the same footing: 1 kWh is 3.6 MJ, so A$0.30/kWh is A$83.3/GJ.

### A load on each

This is an illustration. Per load, TF-120 delivers 88.6 kWh to the work and baskets and loses 40.8 kWh through its walls and openings over a 3.4-hour cycle, a total of 129.4 kWh delivered inside the furnace. The gas furnace burns 206.9 kWh of gas to supply it, as Chapter 3 calculated. An electric furnace with the same insulation and the same cycle would need 129.4 ÷ 0.95 ≈ **136.2 kWh** of electricity.

```figure
type: compare
title: TF-120 on gas and on electricity, per load and per year
cols: Gas | Electricity
rowhead: Quantity
caption: This is an illustration at the prices above, for 500 loads a year, with the same insulation and cycle. Network demand charges for a 120 kW electric load are not included and can be significant.
- Energy purchased per load | 206.9 kWh (745 MJ) | 136.2 kWh
- Cost per load | A$22.35 | A$40.86
- Cost per year | A$11,170 | A$20,430
- Carbon dioxide per load, combustion only | 36.8 kg | 136.2 × grid factor
```

At these prices, gas costs a little over half as much per load. Electricity has other advantages that do not show in this table: no flue loss, no combustion products touching the work, faster and more uniform control in some designs, and none of the gas safety regime of Chapter 8. It also has costs that do not show: a large new electrical supply, demand charges on a 120 kW load, and element replacement. A real decision weighs all of them.

### Costs that do not show per load

The per-load comparison covers energy only. Several other costs belong in the decision, and some of them are large enough to change it.

- **Electrical supply.** A 120 kW electric furnace needs a supply to match. If the site's connection cannot carry it, the upgrade, which may involve the distribution network, can cost more than the furnace.
- **Demand charges.** Many business electricity tariffs charge for the highest demand in a month as well as for energy. A furnace that draws 120 kW during every heat-up sets that peak, and the charge applies whether the furnace runs once a month or every day.
- **Fixed gas charges.** If TF-120 is the site's only gas user, converting it removes the gas supply's fixed charges as well as the gas itself, which favours conversion more than the per-load figures suggest.
- **Maintenance.** Gas burners, valve trains and burner management systems need regular servicing by licensed people, as Chapters 6 and 8 showed. Electric elements need replacing at intervals, and contactors and thyristor controllers wear. Neither is free; both belong in the comparison, from records where they exist.
- **Equipment life.** A furnace with ten good years left is a different decision from one due for replacement. Many businesses plan the change for the point where the furnace would be rebuilt anyway.

## Improvements are worth more on electricity

One consequence of the comparison is easy to miss. Every kilowatt-hour of heat saved inside the furnace is worth more on an electric furnace than on a gas one, because on electricity it is bought at a higher price per useful unit.

This is an illustration. Chapter 3's wall calculation showed that thickening TF-120's lining from 150 mm to 200 mm would cut the wall loss from about 6.1 kW to 4.6 kW. Over a 3.4-hour cycle that saves about **5.0 kWh** of heat delivered inside the furnace. On gas, that heat costs 5.0 ÷ 0.626 ≈ 7.9 kWh of fuel, about A$0.86 a load, or about **A$430 a year**. On electricity it costs 5.0 ÷ 0.95 ≈ 5.2 kWh, about A$1.57 a load, or about **A$780 a year**. The same is true of tighter doors, lighter baskets and fewer door openings. A shop that is thinking of converting should make those improvements first: they cut both running cost and the size of the electrical supply the converted furnace would need.

## Mixed approaches

The choice is not always all or nothing. A shop can keep TF-120 on gas while moving lower-temperature heat to electricity: the 60 °C parts washer of Chapter 7, for example, could be heated by a heat pump, which at that temperature delivers several times its electrical input as heat, a very different proposition from resistance heating at 600 °C. [Heat Pumps and Refrigeration by the Numbers](/reados/publications/heat-pumps-and-refrigeration-by-the-numbers/) covers the calculation. A shop can also plan for conversion at the furnace's next rebuild, with the insulation and door improvements made now, so that the electrical supply is sized for the smaller load that results.

The most important part of the comparison is that it is written down per unit of delivered heat, with every assumption visible: the prices, the available heat, the electric furnace's efficiency, the grid factor, the demand charges and the cycle. Then, when a price or a factor changes, the decision can be checked in minutes rather than argued from scratch.

## Carbon dioxide from the chemistry

The carbon dioxide released by burning gas follows directly from the reaction. Each mole of methane makes one mole of carbon dioxide, 44.01 g, while releasing 890.7 kJ on the higher heating value. Burning pure methane therefore releases 44.01 ÷ 0.8907 ≈ **49.4 kg of carbon dioxide per gigajoule**. Propane, with less hydrogen per carbon atom, releases about 59.5 kg/GJ.

The official factors used for reporting in Australia, published each year in the National Greenhouse Accounts Factors, differ slightly from that chemistry figure: they reflect the real composition of the gas, and they add the small amounts of methane and nitrous oxide emitted by combustion, expressed as carbon dioxide equivalent. For reporting, the official factor for the right year and fuel is the one to use. For comparing options, the chemistry figure is accurate enough and shows where the number comes from. Neither includes emissions upstream of the meter, which the same publication covers separately.

On the chemistry figure, a TF-120 load burning 0.745 GJ of gas releases about **36.8 kg** of carbon dioxide, and 500 loads release about **18.4 tonnes** a year.

### The break-even grid factor

Electricity's emissions depend on how it is generated, and the official factors for each state's grid are in the same National Greenhouse Accounts Factors publication, updated each year as the generation mix changes. Rather than quote a factor that will date, the comparison can be turned round: at what grid factor does the electric furnace's 136.2 kWh per load release the same 36.8 kg as the gas furnace?

```figure
type: bars
title: Carbon dioxide per TF-120 load, by grid emission factor
unit: kg
max: 120
caption: This is an illustration. The gas furnace releases 36.8 kg of CO₂ a load from combustion. The electric furnace beats it whenever the grid factor is below about 0.27 kg per kWh. The factors shown are example values, not those of any state.
- Gas, combustion only | 36.8
- Electric, 0.2 kg/kWh | 27.2
- Electric, 0.4 kg/kWh | 54.5
- Electric, 0.6 kg/kWh | 81.7
- Electric, 0.8 kg/kWh | 109
```

The break-even factor is 36.8 ÷ 136.2 ≈ **0.27 kg of CO₂ per kWh**. Below it, the electric furnace releases less carbon dioxide per load; above it, more. A shop that buys electricity under a renewable supply agreement, or has its own solar generation covering the furnace's daytime use, may already be below that figure. The comparison should be made with the current factor for the shop's own state and contract, and remade as the grid changes.

## Ranking the improvements

Earlier chapters found several ways to cut TF-120's gas. Set side by side, with their costs, they rank very differently from how they first sounded.

```figure
type: compare
title: Improvements to TF-120 found in this book
cols: Saving a year | Capital | Source
rowhead: Measure
caption: This is an illustration at A$30/GJ for gas and A$0.30/kWh for electricity, 500 loads a year. The cheapest measures are the habits; the most expensive are not always the best.
- *Keep ratio control and check excess air at three firing rates | A$1,700 to A$2,840 avoided | service time | Chapters 3 and 6
- Lighter baskets, 200 kg to 120 kg per load | about A$730 | new baskets | Chapter 3
- Faster loading, door open less | about 2 kWh of radiation per 3 minutes saved | none | Chapter 3
- Flue heat to the parts washer | about A$4,100 | about A$30,000 | Chapter 7
- Recuperator, air preheated to 300 °C | about A$1,545 | about A$25,000 | Chapter 4
```

The top row is not a new saving but a loss avoided: a slipped linkage or a fixed-air control would cost between about A$1,700 and A$2,840 a year, and the only defence is the routine checking of Chapters 2, 3 and 6. Of the capital projects, the flue heat recovery for the washer is the better one, because it displaces electricity at nearly three times the price of gas per megajoule. The recuperator, which sounded the most technical, is the weakest.

## TF-120 in numbers

Taken together, the chapters of this book describe one furnace completely enough to run it well and to decide its future on evidence. Every figure below came from a calculation that anyone with the gas bill, a flue gas analyser and a meter can repeat.

- **Fuel and air.** 432 MJ/h of natural gas at high fire, about 11.2 m³/h, burned with about 126 standard m³/h of air at 15% excess, making about 137 m³/h of flue gas and 17.5 kg/h of water.
- **Flue gas.** 3.0% oxygen and 10.0% carbon dioxide dry, about 29 ppm air-free carbon monoxide, a dew point of 56.4 °C.
- **Available heat.** 62.6% at a 650 °C flue, with the flue taking 37.4% of the fuel.
- **A load.** 745 MJ of gas, about 19.3 m³, A$22.35 and 36.8 kg of carbon dioxide, for 800 kg of work.
- **Metering.** Each cubic metre on the 35 kPa sub-meter is 1.3225 standard cubic metres, and one turn of the 0.25 m³ dial in about 106 seconds means 120 kW.
- **Control.** Ratio control holds the soak on about 19 kW of fuel; fixed air would need about 45 kW.

The same list, rebuilt each year from new measurements, is the furnace's energy record. It shows when something has drifted, it prices each proposed improvement, and it lets the gas-or-electric question be asked again with the numbers already in hand.

## The error: comparing bills, not heat

This is an illustration. When the shop's owners first discussed converting TF-120 to electricity, a summary prepared for the discussion compared the two tariffs directly: gas at A$30/GJ and electricity at A$0.30/kWh, or A$83.3/GJ. It concluded that electricity was **2.8 times** as expensive as gas and that conversion could not be justified on running costs, with the figure repeated in the minutes.

The shop's engineer pointed out that the comparison treated a gigajoule of gas and a gigajoule of electricity as delivering the same heat, which they do not. Per gigajoule delivered inside the furnace, gas costs 30 ÷ 0.626 = A$47.9 and electricity 83.3 ÷ 0.95 = A$87.7, a ratio of **1.83**, not 2.8. Gas was still cheaper at those prices, but by a much smaller margin, and the conclusion became sensitive to things the summary had left out: the electricity tariff the shop could negotiate for a new 120 kW load, demand charges, the value of a combustion-free atmosphere to some customers, and the emissions comparison above.

The shop redid the comparison on a per-load basis, as in this chapter, and agreed a rule for all future energy comparisons: compare costs and emissions per unit of heat delivered to the process, with every efficiency stated and on a single heating-value basis, and show the break-even price and grid factor so that the decision can be revisited when either changes.

## Exercise: the break-even electricity price

At what electricity price, including GST, would an electric TF-120 cost the same per load as the gas furnace at A$30/GJ? And if the gas price rose to A$36/GJ with electricity unchanged at A$0.30/kWh, what would the ratio of electric to gas cost per load become?

**Worked answer.** The gas furnace costs A$22.35 a load. The electric furnace needs 136.2 kWh a load, so it matches at 22.35 ÷ 136.2 ≈ **A$0.164 per kWh**, a little over half the assumed tariff. At A$36/GJ, gas costs 0.745 × 36 = **A$26.82** a load, while electricity stays at A$40.86, so the ratio falls to 40.86 ÷ 26.82 ≈ **1.52**. A 20% rise in gas prices closes a large part of the gap. The calculation is simple enough to redo whenever either tariff changes, which is the point of setting it out per load: the decision is not made once, but revisited with each contract.
