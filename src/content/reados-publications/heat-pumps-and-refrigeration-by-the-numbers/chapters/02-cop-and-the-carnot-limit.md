---
book: heat-pumps-and-refrigeration-by-the-numbers
chapterSlug: cop-and-the-carnot-limit
order: 2
title: "COP and the Carnot limit"
description: "Define the coefficient of performance for cooling and heating, calculate its Carnot limit from two temperatures, estimate realistic COPs, and see why temperature lift drives the cost of moving heat."
draft: false
---

A refrigerator or heat pump is judged by how much heat it moves for each unit of electricity it uses. That ratio is its **coefficient of performance**, or COP. Unlike an efficiency, it is usually greater than one: a heat pump with a COP of 3 delivers three kilowatts of heat for each kilowatt of electricity, because two of those kilowatts are drawn from the cold surroundings and only one is paid for. The second law sets a ceiling on the COP, and that ceiling depends only on the two temperatures between which heat is moved. The gap between them, the **temperature lift**, is the single biggest influence on a heat pump's or refrigerator's running cost.

This chapter defines COP for cooling and for heating, derives the Carnot limit for each, estimates realistic COPs using a fraction of that limit, shows how COP falls as lift rises, explains why the real lift is larger than the room-to-outside difference, and shows how to read a maker's rated COP. The failure case is a heat pump chosen from its brochure COP that delivered far less at the factory's conditions.

## Two COPs

A machine moving heat from a cold place at temperature T_cold to a warm place at T_hot takes in heat **Q_cold** from the cold side, uses work **W** from its compressor's motor, and rejects heat **Q_hot** to the warm side. By the first law, **Q_hot = Q_cold + W**.

- For **refrigeration**, the useful output is the heat removed from the cold side: **COP_cooling = Q_cold ÷ W**.
- For a **heat pump**, the useful output is the heat delivered to the warm side: **COP_heating = Q_hot ÷ W**.

Because Q_hot is Q_cold plus W, **COP_heating = COP_cooling + 1** for the same machine at the same conditions. A refrigerator with a cooling COP of 2.76 rejects heat at a heating COP of 3.76; that rejected heat is the warm air behind a domestic refrigerator, and the heat a heat pump exists to deliver.

## The Carnot limits

An ideal, reversible machine working between T_cold and T_hot, in kelvins, achieves:

**Carnot COP_cooling = T_cold ÷ (T_hot − T_cold)**        **Carnot COP_heating = T_hot ÷ (T_hot − T_cold)**

The denominator is the temperature lift. The smaller the lift, the higher the COP. No real machine reaches these figures, for the reasons Chapter 1 gave: friction, pressure losses and finite heat exchangers. This book uses a realistic COP of **half the Carnot figure**, a teaching value; real machines' COPs come from their makers' data.

```figure
type: formula
title: COP of CS-1's refrigeration plant
formula: Carnot COP_cooling = T_evap ÷ (T_cond − T_evap)        realistic COP ≈ 0.5 × Carnot COP
caption: This is an illustration. The refrigerant evaporates at −8 °C to keep the room at 2 °C, and condenses at 40 °C to reject heat to outside air at about 30 °C. The 0.5 fraction is a teaching value.
- Evaporating temperature | −8 °C = 265.15 K
- Condensing temperature | 40 °C = 313.15 K
step: Carnot COP = 265.15 ÷ 48 ≈ 5.52
step: realistic COP ≈ 0.5 × 5.52 ≈ 2.76
step: each 10 kW of cooling needs about 10 ÷ 2.76 ≈ 3.6 kW of electricity, rejecting about 13.6 kW
```

The chilled store's plant, Chapter 5's subject, removes heat from the room at about **2.76** times the electricity it uses. Each 10 kW of cooling needs about **3.6 kW** of electricity, and rejects about **13.6 kW** of heat outside.

## Why the real lift is larger than it looks

CS-1 is held at 2 °C, and on a summer afternoon the outside air is about 30 °C, a difference of 28 K. But the refrigerant's lift is **48 K**, from −8 °C to 40 °C. The extra 20 K comes from the two heat exchangers. For the evaporator to take heat from 2 °C air, its refrigerant must be colder than 2 °C, here by 10 K; for the condenser to reject heat to 30 °C air, its refrigerant must be hotter than 30 °C, here by 10 K. These temperature differences are what drive heat through the coils at a useful rate.

That makes heat exchanger size a direct lever on running cost. Larger, cleaner evaporator and condenser coils work with smaller temperature differences, reducing the lift and raising the COP. Chapter 6 shows the cost of a dirty condenser that adds 10 K to the lift.

## Heat pump COP falls steeply with lift

For heating, the same arithmetic shows why heat pumps suit warm water far better than very hot water.

```figure
type: bars
title: Realistic heating COP against the water temperature, with a heat source at 10 °C
unit: COP
max: 6
caption: This is an illustration: half the Carnot heating COP, with the refrigerant evaporating at 10 °C and condensing at 40, 55, 70 and 90 °C, about 5 K above the water temperature produced. Heat pumps are most efficient at low temperature lifts.
- Condensing at 40 °C, water at about 35 °C | 5.22
- Condensing at 55 °C, water at about 50 °C | 3.65
- *Condensing at 70 °C, water at about 65 °C | 2.86
- Condensing at 90 °C, water at about 85 °C | 2.27
```

A heat pump making water at about 35 °C, for underfloor heating or preheating, could run at a COP over 5. The same kind of machine making 85 °C water for HW-60's wash-down would run at about 2.3. The heat source matters too: with the evaporator at 0 °C instead of 10 °C, on a cold morning, the COP at 70 °C condensing falls from about **2.86** to about **2.45**. Chapter 4 turns these figures into running costs.

## Set points cost money

Every degree colder a room is kept, or hotter water is made, adds a degree to the lift. For CS-1, holding the room at 0 °C instead of 2 °C, with the evaporator 2 K colder at −10 °C, lowers the Carnot cooling COP from about 5.52 to about **5.26**, nearly 5% worse, before counting the extra heat that leaks into a colder room. Product temperature requirements come first, and food safety requirements are not negotiable; but set points chosen "to be safe" a few degrees beyond what the product needs cost electricity every hour. CS-1's set point was reviewed against the product's specified storage temperature and the controller's accuracy, and set accordingly.

## Cooling and heating at once

A refrigeration plant rejects all the heat it removes plus the work it uses. Most plants throw that heat away to the outside air. Where there is a use for low-grade heat at the same time, such as preheating water, it can be recovered from the condenser, and the plant then provides cooling and heating from the same electricity.

```figure
type: compare
title: What 1 kW of compressor electricity buys in CS-1's plant
cols: Cooling delivered | Heat rejected | Combined useful output if the heat is used
caption: This is an illustration at a cooling COP of 2.76. Recovering condenser heat at a useful temperature raises the condensing temperature and lowers the cooling COP somewhat, which the design must account for.
- *Heat thrown away to outside air | 2.76 kW | 3.76 kW | 2.76 kW
- Condenser heat recovered for preheating | 2.76 kW | 3.76 kW | up to about 6.5 kW
```

The catch is temperature. Heat recovered at a useful temperature, for water at 40 °C, say, needs the condenser hotter than it would be rejecting heat to cool night air, which raises the lift and lowers the cooling COP. Heat recovery suits plants that already condense at a moderate temperature and sites that need warm water whenever the plant runs. Many food factories fit both descriptions.

## Seasonal and part-load performance

A COP at one set of temperatures describes one moment. Over a year, the outdoor temperature, the load and the machine's own controls all vary, and so does the COP. Makers and standards therefore also describe seasonal performance, an average over a defined pattern of conditions, and performance at part load, where many modern machines with variable-speed compressors do better than at full load. For estimating running costs, the right COP is a weighted average over the hours the machine actually runs at each condition, which is what the maker's detailed data, or a monitoring period after installation, can give.

## From COP to running cost

COP converts directly into a cost of heat. The cost of a kilowatt-hour of heat from a heat pump is the electricity tariff divided by its heating COP. At the assumed A$0.25 per kWh, a COP of 2.86 gives heat at about **A$0.087** per kWh, a little cheaper than gas heat at about A$0.093; a COP of 2.27 gives about **A$0.110**, dearer. The **break-even COP** against gas is the electricity tariff divided by the cost of gas heat: **0.25 ÷ 0.093 ≈ 2.68**. Above it, the heat pump's heat is cheaper; below it, gas is. That single number, set by local tariffs, frames the whole heat pump decision in Chapter 4. A cheaper electricity tariff, such as off-peak or self-generated solar power, lowers the break-even COP and widens the range where heat pumps win.

## Variable speed and staging

Real loads vary through the day and the year, and a machine sized for the peak runs most of the time at part load. Older machines meet part load by cycling on and off, which wastes energy at each start and holds temperatures less steadily. Machines with several compressors stage them, running only as many as the load needs. Machines with variable-speed compressors slow down to match the load, and at part load their heat exchangers are effectively oversized for the reduced flow of heat, so the temperature differences across them shrink and the lift falls, which raises the COP. For loads that are often well below peak, as CS-1's is overnight, variable speed or staging can make a large difference to annual electricity use.

## Measuring a machine's real COP

A COP can be measured, and for any large machine it should be, at least during commissioning. The electricity is the easy half: a meter on the machine's supply. The heat is harder. For a water heater or chiller, a heat meter on the water circuit, combining flow rate and temperature difference as in *Heat Transfer by the Numbers*, gives the heat delivered or removed. For an air-cooled cold room, the heat removed is harder to measure directly, and the plant's performance is usually checked against its maker's data using measured refrigerant pressures and temperatures. Measured COPs over a few weeks, compared with the maker's figures at the same conditions, show whether a machine is performing as it should or needs attention.

## Reading a maker's COP

Makers rate heat pumps and refrigeration plant at stated conditions: a source temperature, a delivery temperature and sometimes a load. A COP quoted without its conditions is meaningless. Two things are worth doing with any rated figure. First, check it against the Carnot limit at its rating conditions, which shows what fraction of ideal the machine achieves. Second, apply a similar fraction to the Carnot limit at your own conditions, or better, ask the maker for performance data at your conditions. A machine rated at mild conditions will perform very differently at a hot water temperature or a cold source.

## A failure case: the brochure COP

This is an illustration. Before the present study, a supplier offered the factory a heat pump water heater with a COP of **4.5** in its brochure. Using that figure, the factory's previous engineer calculated large savings against gas and nearly ordered one.

The figure's footnote gave its rating conditions: air at 20 °C and water heated to 35 °C. The factory needed water at 65 °C or more, and the heat pump's air source would often be near 7 °C. A check against the Carnot limits showed the problem. At the rating conditions, with the refrigerant evaporating near 15 °C and condensing near 40 °C, the Carnot heating COP is about **12.5**, so the rated 4.5 was about **36%** of ideal. At the factory's conditions, evaporating near 0 °C and condensing near 70 °C, the Carnot heating COP is about **4.9**; at the same 36% fraction, the real COP would be about **1.8**, not 4.5.

The detection came from reading the footnote and checking both conditions against the Carnot limit. The correction was to ask the supplier for performance data at the factory's actual conditions, which confirmed a COP of a little under 2 at 65 °C on cold mornings. That figure, not the brochure's, is what Chapter 4 uses to decide whether and how a heat pump makes sense for HW-60.

## How this applies to a small Australian business

Judge refrigeration and heat pumps by COP at your own conditions. Calculate the Carnot limit from the evaporating and condensing temperatures in kelvins, remembering that each heat exchanger adds to the lift, and expect real machines to achieve roughly half of it, or whatever the maker's data show. Keep lifts small: cool to no lower than needed, heat to no higher than needed, and keep coils large and clean. Never use a rated COP without its rating conditions. And remember that cooling and heating COPs differ by exactly one.

## Exercise: a freezer room

A freezer room held at −22 °C has its refrigerant evaporating at **−30 °C** and condensing at **40 °C**. What is the Carnot cooling COP? Using half of it, how much electricity does the plant use for 10 kW of cooling? Compare with CS-1's chilled store.

**Worked answer.** The evaporating temperature is **243.15 K** and the lift **70 K**, so the Carnot cooling COP is **243.15 ÷ 70 ≈ 3.47**, and the realistic COP about **1.74**. Ten kilowatts of cooling needs about **10 ÷ 1.74 ≈ 5.8 kW** of electricity, against about 3.6 kW for CS-1's chilled store at a COP of 2.76. The freezer's larger lift costs about 60% more electricity for the same cooling, which is why frozen storage costs so much more to run than chilled storage, and why freezer rooms are worth insulating heavily.
