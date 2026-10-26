---
book: entropy-by-the-numbers
chapterSlug: heat-pumps-and-refrigerators-against-the-limit
order: 3
title: "Heat pumps and refrigerators against the limit"
description: "Carnot limits for cooling and heating COPs, why temperature lift dominates performance, the extra headroom when water is heated from cold, and how to spot an impossible COP."
draft: false
---

Run a reversible engine backwards and it becomes a machine that uses work to move heat from cold to hot. Called a refrigerator when the cold side is the point, and a heat pump when the hot side is, it is the most important application of the second law in a modern plant. Refrigeration keeps food safe, and heat pumps are replacing boilers for hot water and space heating. Both are judged by a coefficient of performance, a number that routinely exceeds 1 and is easy to misread.

This chapter derives the Carnot limits on both coefficients, applies them to the running case's cool room and wash-water heat pump, and shows why the temperature lift, not the size or brand of the machine, sets most of its performance. It ends with a quotation for a cool room system whose stated efficiency was impossible.

## Coefficients of performance

A refrigerator takes heat Q_c from a cold space, takes in work W and rejects Q_h = Q_c + W to warmer surroundings. A heat pump is the same machine, valued for Q_h. The coefficients of performance are the useful heat divided by the work:

- **cooling:** COP_c = Q_c ÷ W
- **heating:** COP_h = Q_h ÷ W = COP_c + 1

For the same machine at the same conditions, the heating COP is always exactly one more than the cooling COP, because the work itself ends up as heat on the hot side. A coefficient above 1 does not create energy: the machine moves heat that already exists, and the COP says how many units it moves per unit of work.

A COP is also only as good as its two measurements. The work is usually easy: an electricity meter on the unit, including fans and controls if the comparison is to be fair. The heat is harder. For a cool room it can be estimated from the refrigerant's flow and enthalpy change, or from the airflow and temperature drop across the evaporator; for a water heater, from the water flow and its temperature rise. A COP measured over a few minutes on a mild afternoon says little about the year. One measured over weeks, from metered energy and a logged heat flow, is a number worth comparing with a limit.

## The Carnot limits

For a reversible machine between a cold reservoir at T_c and a hot one at T_h, the heats are in the ratio of the absolute temperatures, as in Chapter 2. The limits follow directly.

```figure
type: formula
title: Carnot limits on refrigerators and heat pumps
formula: COP_c,max = T_c ÷ (T_h − T_c)
formula: COP_h,max = T_h ÷ (T_h − T_c)
caption: Temperatures in kelvin. Both limits grow without bound as the temperature lift T_h − T_c shrinks, which is why lift dominates performance.
- T_c | absolute temperature of the cold side, K
- T_h | absolute temperature of the hot side, K
- T_h − T_c | temperature lift, K
step: Cool room at 2 °C, surroundings at 20 °C: 275.15 ÷ 18 = 15.29
step: Same room on a 35 °C day: 275.15 ÷ 33 = 8.34
```

The denominator is the key. Halving the lift roughly doubles the limit. A cool room in mild weather has a high limit, the same room on a hot day a much lower one, and a freezer lower still. Real machines follow the same pattern, because their losses are, roughly, a fraction of what the limit allows.

## The running case: the cool room

This is an illustration. The plant's cool room is held at 2 °C. Its refrigeration load averages 12 kW, and an energy meter on the condensing unit shows an average input of 4.8 kW, a cooling COP of 2.5.

Against surroundings at the 20 °C dead state, the Carnot limit is 15.29, so the minimum work for 12 kW of cooling is 12 ÷ 15.29 = 0.785 kW. The machine's **second-law efficiency** is 0.785 ÷ 4.8 = **16.4%**. That sounds poor, and partly it is, but most of the gap is not the compressor's fault. It is built into the temperatures the refrigerant must reach to move heat at all.

### Inside the machine

Heat flows only across a temperature difference. The refrigerant in the evaporator must be colder than the room to absorb heat, and the refrigerant in the condenser must be hotter than the outdoor air to reject it. A typical cool-room system might evaporate at about −5 °C and condense at about 40 °C, so the lift the refrigerant actually works across is not 18 K but 45 K.

```figure
type: compare
title: The cool room's COP at three levels of idealisation
rowhead: Basis
cols: Cold temperature | Hot temperature | Lift | COP
caption: This is an illustration. The internal temperatures are typical of a small air-cooled system, not measured values. The measured COP of 2.5 is 42% of the Carnot COP between the refrigerant's own temperatures; the rest of the shortfall comes from the heat exchangers' temperature differences.
- Room and surroundings, mild day | 2 °C | 20 °C | 18 K | 15.29
- Room and surroundings, hot day | 2 °C | 35 °C | 33 K | 8.34
- Refrigerant evaporating and condensing | −5 °C | 40 °C | 45 K | 5.96
- * Measured | | | | 2.5
```

The table splits the 84% shortfall into two parts. Between the room-to-surroundings limit of 15.29 and the refrigerant-to-refrigerant limit of 5.96 lie the temperature differences across the evaporator and condenser coils, which are design choices: bigger coils, cleaner coils and better airflow narrow them. Between 5.96 and 2.5 lie the compressor's inefficiency, the throttling of the refrigerant through the expansion device, and pressure drops in the pipework, which are mostly fixed by the machine's design. Chapter 8 returns to the expansion device, a throttle like the plant's air regulators.

## Temperature lift is the lever

Because the limit depends on the lift, almost everything that improves a heat pump or refrigerator in service does so by reducing it.

```figure
type: checklist
title: Ways to raise a COP by cutting the lift
caption: Each item narrows the gap between the refrigerant's two temperatures, or between the reservoirs themselves. None needs a new compressor.
- Clean condenser and evaporator coils | fouled coils need larger temperature differences to move the same heat
- Keep condenser air paths clear and shaded | hot recirculated air raises the condensing temperature
- Set the cold space no colder than it must be | each kelvin of setpoint raises the lift by a kelvin
- Deliver heat no hotter than it must be | the same applies to a heat pump's supply temperature
- Use the warmest available heat source for a heat pump | warm effluent or exhaust air beats winter outdoor air
- x Oversize the setpoint "for margin" | margin in temperature is paid for in work, every hour
```

A rough rule follows from the formula. Each kelvin removed from the lift raises the Carnot COP by roughly 2 to 6%: about 6% for the cool room on a mild day, when the lift is 18 K, about 3% on a 35 °C day and about 2% across the refrigerant's own 45 K lift. A real machine's COP moves by a similar fraction. A degree of setpoint that nobody needs costs a few per cent of the compressor's energy, all year.

## The cool room's rejected heat

A refrigerator does not destroy heat; it moves it, and adds its own work. The cool room's condensing unit rejects 12 + 4.8 = 16.8 kW to the outdoor air, at a refrigerant temperature of about 40 °C. That is warm enough to preheat the wash water, which arrives at 20 °C.

If all 16.8 kW went into the 0.50 kg/s wash-water stream, it would raise the water by 16.8 ÷ (0.50 × 4.18) = 8.0 K, from 20 °C to about 28 °C, saving the boiler or heat pump that much heat. The catch is that a water-cooled heat recovery condenser must run at a temperature above the water's, and if the plant tried to recover heat at a higher temperature than the outdoor air would require, the refrigeration COP would fall. Recovering heat into cold incoming water, at the low end of its temperature range, avoids that penalty, which is why heat recovery from refrigeration is usually arranged to preheat cold water rather than to top up hot water. The same reasoning reappears in Chapter 6, where the order in which heat sources are used decides how much entropy each generates.

## Reading a datasheet

Equipment ratings are expressed in several ways, and comparing them needs care.

- **COP** is a ratio of heat to work in the same units, kW per kW. It is the measure used in this book.
- **EER**, an energy efficiency ratio, is used for cooling equipment. In Australia and in many international standards it is a ratio of watts to watts, the same as a cooling COP. In the United States it is often quoted in Btu per hour per watt, and an EER on that basis is 3.412 times the equivalent COP, because one watt is 3.412 Btu per hour.
- **Seasonal** figures average performance over a defined climate and load pattern. They are better than single-point ratings for estimating annual energy, but only if the defined climate resembles the plant's.

Whichever is quoted, the conditions decide the number. A rating without its source and sink temperatures cannot be checked against the Carnot limit and cannot be used to predict a bill. [Heat Pumps and Refrigeration by the Numbers](/reados/publications/heat-pumps-and-refrigeration-by-the-numbers/) follows the vapour-compression cycle, cold room loads and refrigerant rules in more depth than this chapter, which keeps to the second-law limits.

## The wash-water heat pump

The plant is considering an air-source heat pump to replace the gas boiler. It must heat 0.50 kg/s of water from 20 °C to 60 °C, 83.6 kW, taking heat from outdoor air at about 20 °C on an average day.

There are two quite different Carnot limits for this duty, and the difference matters.

1. **All heat delivered at 60 °C.** If the heat pump's condenser delivers every kilowatt at 60 °C, as when it heats a tank held at 60 °C, the limit is 333.15 ÷ 40 = **8.33**.
2. **Water heated from 20 °C to 60 °C as it flows.** The first heat is needed at just above 20 °C and the last at 60 °C. A reversible machine could match its delivery temperature to the water at every point, and its limit is the heat divided by the water's exergy gain: 83.6 ÷ 5.24 = **15.97**. This equals the Carnot formula evaluated at the water's logarithmic mean temperature, 40 ÷ ln(333.15 ÷ 293.15) = 312.72 K.

```figure
type: bars
title: Heating COP limits and a real heat pump for the wash water
caption: This is an illustration. Real heat pumps that heat water in a single pass across a large temperature glide can exploit part of the higher limit; those that charge a hot tank at constant temperature cannot.
max: 18
- Reversible, matched to the water's rise from 20 °C to 60 °C | 15.97
- Reversible, all heat at 60 °C | 8.33
- Internal Carnot, condensing 65 °C, evaporating 10 °C | 6.15
- * Quoted heat pump | 3.2
```

The quoted COP of 3.2 is 52% of the internal Carnot limit between the refrigerant's likely temperatures, a reasonable figure for a real machine, and 20% of the reversible limit for the duty. The gap between 8.33 and 15.97 explains why heat pumps designed for a large temperature glide, heating water in one pass from cold to hot, can outperform those designed to keep a tank hot. That is a design question for the supplier, and a good one to ask.

### The source temperature

An air-source heat pump's limit falls as the outdoor air cools. In winter, with air at 5 °C and water delivered at a constant 60 °C, the limit falls to 333.15 ÷ 55 = 6.06. If the refrigerant evaporates at −2 °C and condenses at 65 °C and the machine reaches half of its internal limit, its COP is 338.15 ÷ 67 ÷ 2 = 2.52, and the work for the same 83.6 kW rises to about 33.1 kW. A heat pump's annual performance must be judged over the plant's real range of source temperatures, not at a single rating point.

## The error: an impossible cool room quotation

This is an illustration. Before measuring the existing cool room, the engineer obtained a quotation for a replacement condensing unit that claimed a cooling "efficiency ratio of 9" and calculated large savings from it. The quotation did not state the conditions.

The plant's design summer condition is 35 °C. The Carnot limit between the 2 °C room and 35 °C air is 8.34, so a claim of 9 is impossible at that condition, for any machine. Even at the 20 °C dead state, where the limit is 15.29, a real machine would need to reach nearly 60% of the ideal between room and surroundings, which no small air-cooled unit does once its coils' temperature differences are counted.

Asked for the conditions, the supplier found that the figure came from a rating for a water chiller at a far smaller lift, attached to the wrong product. The corrected figure for the cool-room unit at the plant's conditions was close to 2.8, a modest improvement on the existing 2.5. The savings case was recalculated on that basis. The check that caught the error needed only the two temperatures and one division, and it should be the first step in reading any COP: what are the two temperatures, and is the figure below T_c ÷ (T_h − T_c)?

## How this applies to a small Australian business

Refrigeration and heat pumps are among the largest electricity users in many Australian food, beverage and cold-storage businesses, and much of Australia has hot summers that raise condensing temperatures exactly when the cooling load peaks. Keeping condensers clean and shaded, setting cold rooms no colder than food safety needs and delivering hot water no hotter than the process needs are the cheapest improvements available, and the Carnot formula shows why each works.

Comparing equipment needs COPs at the plant's own conditions. Ratings at standard conditions are useful for comparing models with each other, but not for predicting a bill. Ask for performance at the plant's summer and winter temperatures, check each figure against its Carnot limit, and treat any figure close to or above the limit as an error until shown otherwise. Work on refrigerant circuits is regulated, and the installer must hold the licences that apply.

## Exercise: the winter wash-water limit

On a cold morning the outdoor air is 5 °C. Find the Carnot heating COP for delivering all the heat at 60 °C, the cooling COP the same reversible machine would have if it were used as a refrigerator between the same two temperatures, and the minimum work to supply 83.6 kW.

**Worked answer.** The lift is 60 − 5 = 55 K. The Carnot heating COP is 333.15 ÷ 55 = **6.06**. The same reversible machine run between the same temperatures has a cooling COP of 278.15 ÷ 55 = **5.06**, exactly one less, as the relation COP_h = COP_c + 1 requires.

The minimum work for 83.6 kW of heating is 83.6 ÷ 6.06 = **13.8 kW**. A real heat pump at half its internal limit would need more than twice that, which is why the plant's engineer asks for the supplier's performance at 5 °C as well as at 20 °C before comparing running costs with the boiler.
