---
book: combustion-by-the-numbers
chapterSlug: flame-temperature-and-preheated-air
order: 4
title: "Flame temperature and preheated air"
description: "Adiabatic flame temperature and why excess air lowers it, dissociation, how preheating combustion air raises available heat, and whether a recuperator pays on a small batch furnace."
draft: false
---

A flame is hot because the energy released by the reaction has nowhere to go except into the gases that carry it. How hot it gets depends on how much gas there is to heat: more excess air means more nitrogen and oxygen to share the same energy, and a cooler flame. Preheat the combustion air, and the flame starts hotter and finishes hotter, and the furnace keeps more of the fuel's energy.

This chapter calculates the adiabatic flame temperature of natural gas, shows how excess air and dissociation change it, works out how much preheating the combustion air raises the available heat, asks whether a recuperator would pay for itself on TF-120, and checks a supplier's claim that turned out to describe a different furnace.

## Adiabatic flame temperature

The **adiabatic flame temperature** is the temperature the combustion products would reach if all the heat released went into them, with none lost to the surroundings. It is found from an energy balance: the products' enthalpy rise from the starting temperature equals the heat released, on the lower heating value, because the water stays as vapour in the flame.

```figure
type: formula
title: Adiabatic flame temperature of methane
formula: Σ nᵢ Δhᵢ(T_ad) = LHV + n_air Δh_air(T_air)
caption: Per mole of methane, enthalpies from NIST's Shomate coefficients. Solved for T_ad by iteration. Dissociation of the products is ignored.
- nᵢ | moles of products: 1 CO₂, 2 H₂O, 2e O₂, 7.547(1 + e) N₂
- LHV | 890.7 − 88.0 = 802.7 kJ per mole of methane
- Δh_air(T_air) | enthalpy of the combustion air above 25 °C, zero without preheat
step: stoichiometric air at 25 °C: T_ad = 2,051 °C
step: 15% excess air at 25 °C: T_ad = 1,852 °C
```

The figure below shows how quickly excess air cools the flame. Every extra kilogram of air must be heated by the same fuel, so at double the stoichiometric air the flame temperature falls by nearly 850 K.

```figure
type: bars
title: Adiabatic flame temperature of natural gas by excess air, air at 25 °C
unit: °C
max: 2200
caption: Calculated for methane without dissociation. TF-120's setting is highlighted. A hot flame transfers heat to the work faster, by radiation and convection, which is one reason burners are run close to stoichiometric where their mixing allows.
- 0% | 2051
- 10% | 1914
- * 15% | 1852
- 20% | 1794
- 50% | 1513
- 100% | 1206
```

### Why a hot flame heats faster

Flame temperature matters for more than efficiency. Hot combustion gases pass heat to the work by convection and, at furnace temperatures, by radiation from the carbon dioxide and water vapour in them and from the hot refractory they warm. Radiation rises with the fourth power of absolute temperature, so a modest change in flame temperature makes a large change in the driving force.

As a rough comparison, the black-body radiation difference between gas at TF-120's 1,852 °C flame temperature and work at 600 °C is σ × (2,125⁴ − 873⁴) ≈ **1,124 kW per square metre**, against about **544 kW/m²** for a flame at 1,513 °C, the adiabatic temperature with 50% excess air. Real flame gases radiate only a fraction of that, depending on their composition, thickness and the furnace geometry, but the ratio of about two shows the direction plainly: excess air does not just waste heat up the flue, it also slows the transfer of what remains. That is why the drifting air of Chapter 3's exercise lengthened the heat-up as well as raising the fuel.

### Dissociation

At temperatures near 2,000 °C, carbon dioxide and water vapour begin to break apart into carbon monoxide, hydrogen, oxygen and smaller fragments. Breaking bonds absorbs energy, so dissociation lowers the flame temperature below the calculated adiabatic value. Thermal physics describes it through the law of mass action: at each temperature the products settle into an equilibrium mixture whose composition depends on the equilibrium constants of the reactions, which rise steeply with temperature. Equilibrium calculations that include dissociation put the stoichiometric flame temperature of methane in air roughly a hundred kelvin lower than the value above. With 15% excess air, the extra oxygen pushes the equilibrium back towards complete combustion and the correction is smaller.

Two consequences matter for furnaces. The partly burned species released by dissociation recombine as the gas cools on its way to the work and the flue, releasing their energy again, so dissociation shifts heat release rather than losing it. And the hottest parts of a flame are also where nitric oxide forms from the nitrogen and oxygen of the air, at a rate that rises very steeply with temperature. Burners designed for low emissions keep their peak flame temperatures down by staging the air or fuel or by recirculating flue gas, which is a trade-off between flame temperature, heat transfer and emissions.

## Preheating the combustion air

Chapter 3 showed that the flue gas carries away 37.4% of TF-120's fuel. Much of that energy can be recovered by passing the hot flue gas through a heat exchanger, a **recuperator**, that warms the incoming combustion air. The preheated air brings energy back into the furnace, so less fuel is needed for the same heat to the work.

The effect on available heat follows directly from the formula in Chapter 3: the enthalpy of the preheated air is added back. It also raises the flame temperature, which can matter for burner and refractory life.

```figure
type: compare
title: TF-120 at 650 °C flue and 15% excess air, by air preheat
cols: Available heat | Flame temperature | Fuel saving
rowhead: Combustion air temperature
caption: Calculated for methane without dissociation. Fuel saving = 1 − AH(no preheat) ÷ AH(preheat). The flue gas leaving the recuperator is cooler, but the available heat is defined at the furnace exit.
- 25 °C, no preheat | 62.6% | 1,852 °C | none
- 200 °C | 68.9% | 1,967 °C | 9.2%
- *300 °C | 72.6% | 2,033 °C | 13.8%
- 400 °C | 76.4% | 2,101 °C | 18.1%
- 500 °C | 80.3% | 2,171 °C | 22.0%
```

The fuel saving formula is worth writing out. If the furnace needs a fixed amount of heat delivered, the fuel needed is that heat divided by the available heat. Raising the available heat from AH₀ to AH₁ cuts the fuel in the ratio AH₀ ÷ AH₁, so the saving is 1 − AH₀ ÷ AH₁. For TF-120 with air preheated to 300 °C, that is 1 − 0.626 ÷ 0.726 = **13.8%**.

The hotter the flue, the more there is to recover. At a 1,200 °C flue, typical of a forge or reheating furnace, the available heat with 15% excess air and no preheat is only **35.0%**. Preheating the air to 500 °C raises it to **52.7%**, a saving of about **34%**. Recuperation is standard on high-temperature furnaces for that reason, and much less common on furnaces below about 700 °C.

### What the recuperator itself has to do

A recuperator is a gas-to-gas heat exchanger, and its job can be checked with an energy balance. For TF-120 at 15% excess air, each mole of methane burned needs 10.98 moles of air, which take about 89.5 kJ to warm from 25 °C to 300 °C. The same energy must come out of the 11.98 moles of flue gas, which therefore cool from 650 °C to about **433 °C** as they pass through. The recuperator's effectiveness, the air's temperature rise as a share of the largest possible rise, is (300 − 25) ÷ (650 − 25) = **44%**, a modest figure for a counterflow exchanger.

Three practical points follow from those numbers. The flue gas leaving the recuperator at about 430 °C is still hot, which is why recuperators on low-temperature furnaces recover only part of the flue loss. The recuperator's hot end sees flue gas at 650 °C on one side and must survive thermal cycling every time the furnace starts and stops. And the burners must be designed for hot air: preheated air has a lower density, so for the same mass flow it needs larger passages or higher pressure, and the burners' air and gas settings have to be recommissioned for it.

### Oxygen enrichment

The other way to shrink the flue loss is to bring in less nitrogen. Enriching the combustion air with oxygen reduces the inert gas that must be heated and carried away. For TF-120's conditions, raising the oxygen content of the combustion air from 20.95% to 30% would raise the available heat at a 650 °C flue from 62.6% to about **69.6%**, a saving similar to preheating the air to about 200 °C. The oxygen itself has to be bought or made, and higher flame temperatures bring the same refractory and emission questions as preheat, so enrichment is used mainly in high-temperature processes such as glass and metal melting, where the gains are much larger.

### Recuperators, recuperative burners and regenerators

There are three common ways to preheat combustion air. A **central recuperator** sits in the flue and heats all the air for all the burners. A **self-recuperative burner** has a small recuperator built around its body, drawing the flue gas back out through the burner itself. And a **regenerative burner** pair alternates, each storing heat from the flue gas in a bed of ceramic for a short cycle and then releasing it to the incoming air. They reach progressively higher preheat temperatures and cost progressively more. All of them raise flame temperatures, which raises nitric oxide formation, so they are usually paired with burner designs that limit peak temperatures.

## Does a recuperator pay on TF-120?

This is an illustration. TF-120 burns about 745 MJ a load and runs 500 loads a year: about **372 GJ** of gas, costing about A$11,170 at A$30/GJ. A central recuperator giving 300 °C air would save 13.8% of that, about **51.5 GJ, or A$1,545 a year**. The shop obtained a budget price of **A$25,000** installed, which with hot-air pipework, controls and recommissioning is plausible for a furnace this size, and estimated **A$200 a year** for inspection and maintenance.

The [equipment investment appraisal tool](/tools/investment-appraisal/) works out the net present value, internal rate of return, simple and discounted payback and the equivalent annual cost from the purchase cost, the yearly savings and running cost, the salvage value, the life and an interest rate. Entered with A$25,000, A$1,545 a year of savings, A$200 a year of running cost, no salvage, a 15-year life and an 8% hurdle rate, it gives a net present value of about **−A$13,500** and a simple payback of about **18.6 years**, longer than the equipment's life. The internal rate of return is negative: the recuperator never earns back its cost.

```figure
type: stats
title: A recuperator for TF-120, at 300 °C air preheat
caption: This is an illustration with an assumed installed cost and gas price. On a small batch furnace at 650 °C the saving is real but small in dollars; on a large, hot, continuously running furnace the same percentage pays back quickly.
- 13.8% | fuel saving
- A$1,545 | saving a year, 500 loads
- 18.6 years | simple payback
- −A$13,500 | net present value at 8% over 15 years
```

The result is not a general verdict on recuperation. The same 13.8% on a furnace burning **3,000 GJ** a year would save about A$12,400 a year and pay back the same A$25,000 in about **2 years**. The deciding factor is the gas bill the percentage applies to. For TF-120, the money is better spent on the cheaper measures from Chapter 3: tighter doors, lighter baskets and keeping the excess air where it should be.

The appraisal counts only gas. A complete case would also weigh things that are harder to price: a slightly faster heat-up from the hotter flame, against the risks of a new item of hot equipment that can crack or leak, burners that must be rated and recommissioned for hot air, and a change to an appliance whose design has been accepted by the technical regulator, which Chapter 8 explains is not a minor matter. On a furnace this size, none of those changes the answer, but on a marginal case they can.

## The error: a saving from another furnace

This is an illustration. Before the shop worked through the numbers above, a supplier's brochure for self-recuperative burners quoted **fuel savings of around 30%**, and an enthusiastic proposal to replace TF-120's burners was based on that figure. At 30%, the saving would have been about A$3,350 a year, and the payback on burners costing similar money would have looked reasonable.

The shop's engineer asked where the 30% came from. The brochure's case study was a forging furnace with its flue gas leaving at about 1,200 °C, where, as calculated above, preheating the air to 500 °C saves about 34%. TF-120's flue is at 650 °C, where the same burners would preheat the air less, because there is less heat in the flue to recover, and where each degree of preheat saves less. Calculated for TF-120's own conditions, the saving was 14 to 18%, not 30%.

The supplier's figure was not wrong for its own furnace; it had simply been carried across to one with a different flue temperature. The shop's rule since then is that any claimed fuel saving is recalculated from the available heat at the furnace's own flue temperature and excess air, before and after, and that the calculation, not the brochure, goes into the business case.

## Exercise: hotter air from a better recuperator

A second supplier offers a recuperator that would preheat TF-120's combustion air to **400 °C**. Using the figure above, what fuel saving and annual dollar saving would it give, and roughly what installed cost would give a simple payback of 5 years after allowing A$200 a year for maintenance?

**Worked answer.** At 400 °C preheat the available heat is 76.4%, so the saving is 1 − 0.626 ÷ 0.764 = **18.1%** of the fuel. On 372.4 GJ a year that is about 67.4 GJ, or **A$2,020 a year** at A$30/GJ. Net of maintenance, the yearly benefit is about A$1,820, so a 5-year simple payback needs an installed cost of about 5 × 1,820 ≈ **A$9,100**. A recuperator reaching 400 °C on a furnace this size is unlikely to cost so little, so the conclusion stands: on TF-120's gas use, air preheat does not pay, however good the recuperator. The flame temperature at 400 °C preheat, about 2,100 °C before dissociation, would also need checking against the burner's and refractory's ratings.
