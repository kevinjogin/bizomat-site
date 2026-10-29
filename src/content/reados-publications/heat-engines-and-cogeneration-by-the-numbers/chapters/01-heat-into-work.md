---
book: heat-engines-and-cogeneration-by-the-numbers
chapterSlug: heat-into-work
order: 1
title: "Heat into work: the first law and the Carnot ceiling"
description: "How the first law accounts for every kilowatt of fuel, what efficiency and heat rate mean, and how the Carnot limit at real temperatures tests any claim to turn heat into power."
draft: true
---

Every engine, turbine and power-from-heat box sold to a plant does the same thing: it takes heat at a high temperature, turns part of it into shaft work and throws the rest away at a lower temperature. Two laws govern how well it can do that. The first law keeps the books, so every kilowatt of fuel must turn up somewhere as work, useful heat or loss. The second law sets a ceiling on the share that can become work, and that ceiling depends only on the temperatures involved.

This chapter sets up the running case, a commercial laundry thinking about making its own electricity, and uses it to show how efficiency and heat rate are defined, how the first-law balance of an engine is checked, and how the Carnot limit is used to test a supplier's claim before anyone pays for a trial. It ends with a claim that breaks the second law and one that only appears not to.

## The running case: a laundry that buys both heat and power

This is an illustration. A commercial laundry in a regional Australian city washes, dries and irons hotel and restaurant linen. It runs 16 hours a day for 300 days a year, 4,800 hours in all. While it runs it draws an average of 450 kW of electricity, never less than 400 kW, and uses 900 kW of heat: 550 kW as steam at 10 bar gauge (1,101.3 kPa absolute, saturated at 184.1 °C) for the flatwork ironers and finishing, and 350 kW as hot water at 60 to 70 °C for the tunnel washer. A gas-fired steam boiler supplies all the heat, the hot water through a steam calorifier fed at 2 bar gauge.

The boiler is ageing, and the owners have been offered three things: a replacement boiler, a gas engine generator that would also supply heat (combined heat and power, or cogeneration), and a small organic Rankine cycle (ORC) unit that claims to make electricity from warm water. The engineer uses surroundings at 25 °C (298.15 K) and 101.325 kPa for every second-law figure in this book.

The book follows these options through the engines that might drive them: the gas engine (Chapters 3 and 5), a diesel standby set already on site (Chapter 4), gas turbines and microturbines (Chapters 6 and 7), a steam turbine (Chapter 8), heat recovery (Chapter 9) and the business case for cogeneration (Chapter 10).

## The first law keeps the books

For a machine running steadily, the first law says that energy in equals energy out. For a boiler, fuel energy in equals heat delivered to the steam plus losses up the flue and from the casing. For an engine generator, fuel energy in equals electrical output plus heat to the cooling water plus heat in the exhaust plus everything else that leaves as warm air.

This is an illustration. The boiler delivers 900 kW of heat at an efficiency of 82% on the gas's gross heating value, so it burns 900 ÷ 0.82 = **1,097.6 kW** of gas. The 197.6 kW difference leaves as hot flue gas, water vapour that never condenses and radiation from the shell.

The gas engine offered for the site takes **1,000 kW** of fuel on the lower heating value basis that engine makers quote (Chapter 5 explains the two bases). Its balance at full load is:

```figure
type: stack
title: First-law balance of the offered gas engine at full load
unit: kW
caption: This is an illustration on the lower heating value basis. Exhaust heat is counted down to the 25 °C surroundings. Every kilowatt of fuel is accounted for; the first law says nothing about which of these streams is worth recovering.
- Electrical output, gross | 400
- Jacket water and oil cooler, 90 °C | 230
- Exhaust after the turbocharger, 470 °C | 304.7
- Alternator, radiation and intercooler losses | 65.3
```

The exhaust figure comes from its flow and temperature: 0.64 kg/s × 1.07 kJ/kg·K × (470 − 25) K = 304.7 kW. The remainder, 1,000 − 400 − 230 − 304.7 = 65.3 kW, is what is left once everything measurable has been counted. A first-law balance like this is the first check on any datasheet: if the stated streams add up to more than the fuel, a figure is wrong; if they add up to much less, something is missing, and the missing heat is usually in the room ventilation or an unlisted cooling circuit.

## Efficiency and heat rate

**Thermal efficiency** is useful work out divided by heat in. For the engine, 400 ÷ 1,000 = 40.0% on the lower heating value. The same engine, measured against the gross heating value of the gas the laundry actually buys, burns 1,000 ÷ 0.901 = 1,110 kW and is 400 ÷ 1,110 = 36.0% efficient. Neither figure is wrong, but they cannot be compared with each other.

Power engineers often prefer the **heat rate**: the fuel energy needed per kilowatt-hour of electricity. It is the reciprocal of efficiency, scaled to kilojoules per kilowatt-hour:

heat rate = 3,600 ÷ η   (kJ/kWh)

A 40% efficient engine has a heat rate of 3,600 ÷ 0.40 = 9,000 kJ/kWh. On the gross basis it is 9,990 kJ/kWh, and once the engine's own 10 kW of pumps and fans are taken off its output, the laundry pays for 1,110 ÷ 390 × 3,600 = **10,246 kJ/kWh** of net electricity. Heat rate is useful because it converts directly to fuel cost: at a gas price per gigajoule, the fuel cost per kilowatt-hour is the heat rate in gigajoules times the price.

Two rules keep efficiency figures honest:

1. State the heating-value basis (gross or net) next to every fuel figure.
2. State whether the output is gross (at the alternator terminals) or net (after the plant's own auxiliaries).

## The second law sets a ceiling

The first law would allow an engine to turn all its fuel into work. Nothing ever does, and the reason is the second law: a machine working in a cycle cannot take heat from one body and turn all of it into work. Some heat must be rejected to something colder. Carnot showed that the best possible engine working between a source at absolute temperature T_H and a sink at T_C converts at most a fraction

η_Carnot = 1 − T_C ÷ T_H

of the heat it receives. Temperatures must be absolute, in kelvin. The derivation and the absolute temperature scale are covered in [Absolute temperature and the Carnot limit](/reados/publications/entropy-by-the-numbers/absolute-temperature-and-the-carnot-limit/) in *Entropy by the Numbers*; here the formula is used as a test.

The ceiling depends only on the temperatures. With the laundry's surroundings at 25 °C as the sink, the limit rises steeply with the temperature at which heat is supplied.

```figure
type: bars
title: Carnot ceiling for heat supplied at different temperatures, sink at 25 °C
unit: %
max: 100
caption: Each bar is 1 − 298.15 ÷ T_H. The jacket water at 90 °C can never yield more than about 18% of its heat as work; heat supplied at combustion temperatures could in principle yield more than 80%.
- Jacket water, 90 °C | 17.90
- Saturated steam, 184.1 °C | 34.80
- Engine exhaust, 470 °C | 59.88
- Microturbine combustor exit, 950 °C | 75.62
- * Combustion gases, 1,500 °C | 83.19
```

The figure explains why engineers burn fuel at high temperature to make power, and why low-temperature heat is better used as heat. A kilowatt of 90 °C water and a kilowatt of 1,500 °C combustion gas are equal on the first law and very unequal on the second.

### Second-law efficiency

Dividing a real efficiency by the Carnot efficiency for the same temperatures gives the **second-law efficiency**, the share of the possible that a machine achieves. If the engine's heat were all supplied at 1,500 °C, the [Heat Engine Carnot Limit Check](/tools/heat-engine-carnot-limit/) gives a Carnot efficiency of 83.19% and puts the engine's 40% at 48.09% of it, with 431.85 kW of work lost per 1,000 kW of heat. The tool takes the hot and cold temperatures, the stated efficiency and the heat supplied, and returns the Carnot efficiency, the second-law efficiency, the most work and least heat rejected, the work and rejected heat at the stated figure, the entropy generated and the work lost, and a verdict: impossible, inside the limit, or inside the limit but high enough to ask for test evidence.

A real engine does not receive its heat at a single temperature, so 48% is a rough figure. Its value is as a sanity check: a heat engine claiming 90% of Carnot needs very strong evidence, and one claiming more than 100% is not a heat engine at all.

## Testing the ORC claim

This is an illustration. The ORC supplier proposes to take the gas engine's 230 kW of jacket water heat at 90 °C and turn it into **25 kW** of electricity, rejecting the rest to an air-cooled condenser. That is 25 ÷ 230 = 10.87% of the heat.

```figure
type: formula
title: The Carnot check on the ORC claim
formula: η_Carnot = 1 − T_C ÷ T_H
formula: second-law efficiency = η_claimed ÷ η_Carnot
caption: This is an illustration, using the Heat Engine Carnot Limit Check with fixed reservoirs at 90 °C and 25 °C and the laundry's threshold of 50% of Carnot for accepting a figure without test evidence.
- T_H | 90 °C = 363.15 K, the jacket water
- T_C | 25 °C = 298.15 K, the surroundings
step: η_Carnot = 1 − 298.15 ÷ 363.15 = 17.90%
step: Second-law efficiency = 10.87 ÷ 17.90 = 60.73%
step: Most work from 230 kW = 41.17 kW; least heat rejected = 188.83 kW
step: At 25 kW: 205 kW rejected, entropy generated 0.0542 kW/K, work lost 16.17 kW
step: Verdict: inside the limit, but above 50% of Carnot, so ask for test evidence
```

The claim passes the first test. Real ORC units at this temperature are seldom close to Carnot, though, and the next section shows why the fixed-reservoir check is generous.

### The temperatures that matter

The Carnot formula uses the temperatures at which the engine actually takes in and rejects heat, not the temperatures of the fluids outside it. Heat flows only down a temperature difference, so the ORC's working fluid must boil below 90 °C and condense above 25 °C. On a summer afternoon an air-cooled condenser in a regional Australian town may condense at 40 °C or more.

This is an illustration. With the working fluid boiling at 80 °C and condensing at 40 °C, the ceiling falls to 1 − 313.15 ÷ 353.15 = **11.33%**, and the most work from 230 kW to 26.05 kW. The supplier's 25 kW would then be 95.97% of Carnot: inside the limit only in arithmetic, and not credible for a real machine with pumps, fans and friction. There is a further effect. The jacket water cools from 90 °C to 70 °C as it gives up heat, so the average temperature of supply is below 90 °C. Chapter 9 integrates that properly and finds the true limit lower again.

The engineer's conclusion was to ask the supplier three things: the evaporating and condensing temperatures behind the 25 kW, whether 25 kW is gross or net of the unit's own pumps and condenser fans, and measured results from an installed unit at similar temperatures.

```figure
type: compare
title: Three heat-to-power claims against the Carnot ceiling
rowhead: Claim
cols: Heat supplied | Claimed power | Carnot ceiling | Share of ceiling | Verdict
caption: This is an illustration. All three use the Heat Engine Carnot Limit Check with the laundry's 50% threshold for asking for test evidence.
- ORC, 90 °C water to 25 °C air | 230 kW | 25 kW | 17.90% | 60.73% | inside, ask for evidence
- * ORC, boiling 80 °C, condensing 40 °C | 230 kW | 25 kW | 11.33% | 95.97% | not credible
- Brochure, 30% from 90 °C water | 230 kW | 69 kW | 17.90% | 167.61% | impossible
```

## The error: a brochure that beat Carnot

This is an illustration. A second supplier's brochure for a "heat-to-power module" stated that it converted **30%** of the heat in water at 90 °C into electricity. The sales representative offered it as a better option than the ORC: 69 kW instead of 25 kW from the same jacket water.

The engineer entered the figures in the Carnot check before the meeting. With the source at 90 °C and the sink at 25 °C, the most any machine could make is 41.17 kW, and a 30% efficiency is 167.61% of the Carnot limit. The tool's verdict was **impossible: above the Carnot limit**, and its entropy figure showed why: at 30% the machine would destroy entropy at 0.0934 kW/K, which no cyclic machine can do.

The brochure was not necessarily dishonest. On enquiry, the 30% turned out to be a figure for the same module with a heat source at about 150 °C, copied into a leaflet aimed at lower-temperature sites. The lesson is general: an efficiency figure without its source and sink temperatures cannot be judged, and any heat-to-power figure should be checked against the Carnot limit at the site's own temperatures before anyone discusses price.

## Heat engines and heat users

The laundry needs 900 kW of heat at or below 184 °C and 450 kW of electricity. The second law suggests how to supply that with the least fuel. Fuel burns at well over 1,000 °C. Burning it in a boiler to make 184 °C steam uses a high-temperature source for a low-temperature duty, and the potential to make work is lost the moment the flame heats the boiler tubes. Burning it in an engine first, taking work at high temperature, and then using the engine's rejected heat for the laundry's lower-temperature duties, uses the same fuel twice. That is the principle of cogeneration, and Chapter 10 tests whether it pays.

The ORC does the opposite: it takes heat that is already low in temperature and tries to wring work from it. It can be worthwhile when the heat would otherwise be wasted and there is nowhere to use it as heat. In the laundry, the jacket water could instead heat the tunnel washer's water, which needs 350 kW at 60 to 70 °C. Used that way, every kilowatt of jacket heat displaces boiler fuel; turned into power at the supplier's own figure, about one kilowatt in nine survives as electricity.

## How this applies to a small Australian business

Most small and medium plants buy both electricity and gas, and are offered energy technologies through brochures that quote efficiencies without stating the conditions. Three habits protect them:

- Put every fuel figure on one heating-value basis. Australian gas is billed on the gross heating value in megajoules and gigajoules; engine datasheets usually use the lower heating value. Chapter 5 shows the conversion.
- Write down the temperatures at which a machine takes in and rejects heat, and check its claimed efficiency against the Carnot limit at those temperatures. The tool does this in seconds.
- Before turning waste heat into power, ask whether it could replace heat the site already buys. Using heat as heat almost always recovers more value.

Gas-fired engines, boilers, pressure equipment and connections to the electricity network are regulated in Australia. Their selection, installation and approval are matters for qualified engineers, licensed gas fitters and electrical contractors, and the network service provider. This book teaches the thermodynamics behind the decisions; it is not a design for any plant.

## Exercise: power from the exhaust

The engine's exhaust leaves the turbocharger at 470 °C and could be cooled to 200 °C, releasing 0.64 × 1.07 × (470 − 200) = 184.9 kW. Taking 470 °C as a fixed source and 25 °C as the sink, find the most power any engine could make from that heat. A supplier claims 40 kW. What share of the heat and of the Carnot ceiling is that?

**Worked answer.** The Carnot efficiency is 1 − 298.15 ÷ 743.15 = 59.88%, so the most work from 184.9 kW is 0.5988 × 184.9 = **110.7 kW**. The claim of 40 kW is 40 ÷ 184.9 = 21.6% of the heat and 21.6 ÷ 59.88 = 36.1% of the ceiling, comfortably inside the limit.

The fixed-temperature figure overstates the limit, because the exhaust does not stay at 470 °C: it cools to 200 °C as heat is taken from it. Chapter 9 integrates the Carnot efficiency over that cooling and finds the true most-work figure is 92.71 kW, so the 40 kW claim is 43.1% of what is possible. The method is the same; the temperatures must describe the heat as it is actually delivered.
