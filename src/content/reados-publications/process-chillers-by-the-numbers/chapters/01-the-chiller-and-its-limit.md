---
book: process-chillers-by-the-numbers
chapterSlug: the-chiller-and-its-limit
order: 1
title: "The process chiller and its limit"
description: "What a process chiller is and how its water circuit works, how it is rated, the second law's limit on CH-30, where the shortfall goes, COP, EER and tons, and a quoted figure that broke the second law."
draft: false
---

A process chiller is a refrigerating machine with one job: to take heat out of a stream of water and throw it away outside, so that the water can go back to the process cold. It sits beside the plant it serves, usually as a packaged unit with its compressor, heat exchangers, pump, tank and controls in one frame, and it is judged by two numbers on its data plate: how many kilowatts of heat it removes, and how many kilowatts of electricity it takes to do so. Both depend on conditions that the data plate states in small print, and both are limited by the second law of thermodynamics.

This chapter describes what is inside a process chiller and how its water circuit works, explains how chillers are rated, applies the second law's limit to CH-30 and shows where a real chiller falls short of it, sorts out the units in which performance is quoted, and ends with a supplier's efficiency figure that broke the second law. The theory of the second law, entropy and the Carnot limit is set out fully in READOS's [Heat Pumps and Refrigeration by the Numbers](/reados/publications/heat-pumps-and-refrigeration-by-the-numbers/cop-and-the-carnot-limit/); this chapter uses its results.

## What is inside a process chiller

A packaged process chiller like CH-30 contains two circuits that meet in one heat exchanger.

**The refrigerant circuit** is a sealed loop of four components (Chapter 3):

- an **evaporator**, a heat exchanger in which refrigerant boils at a low pressure and takes heat from the process water;
- a **compressor**, which raises the refrigerant vapour's pressure, and is the only component that uses much electricity;
- a **condenser**, which rejects the heat to outdoor air through finned coils and fans, or to water from a cooling tower;
- an **expansion valve**, which drops the liquid refrigerant's pressure back to the evaporating pressure.

**The process water circuit** is an open or closed loop that carries the heat from the plant to the evaporator:

- a **pump** that circulates the water round the plant;
- a **buffer tank** that adds thermal mass, so that the compressor can run in long cycles rather than short ones when the load is light;
- **strainers**, a **flow switch** and temperature sensors that protect the evaporator and control the machine;
- often a **bypass valve** that keeps a minimum flow through the evaporator when the plant's valves close.

The controls hold the water leaving the chiller at its setpoint, here 12 °C, by running, unloading or cycling the compressor, and they stop the machine on faults such as low water flow, freezing temperatures, high discharge pressure or low suction pressure. Everything the later chapters calculate happens inside this frame.

```figure
type: steps
title: The heat's path through CH-30
caption: This is an illustration at the design point. Heat enters from the moulds, crosses into the refrigerant in the evaporator, is raised in temperature by the compressor's work, and leaves to the air at the condenser.
- Moulds heat the water | 30 kW; water warms from 12 to 17 °C
- Evaporator | refrigerant boils at 2 °C and takes the 30 kW from the water
- *Compressor | adds 8.09 kW of work, raising the vapour from 0.31 to 1.16 MPa
- Condenser | rejects 38.09 kW to 35 °C air as the refrigerant condenses at 45 °C
- Expansion valve | drops the liquid back to 0.31 MPa; part of it flashes to vapour
```

## Air-cooled, water-cooled and central plant

Process chillers differ mainly in where they put their heat.

- **Air-cooled** chillers, like CH-30, reject heat to outdoor air through finned coils and fans. They need no water treatment and suit small and medium plants, but their condensing temperature follows the outdoor dry-bulb temperature, so their capacity and efficiency fall on hot days (Chapter 7).
- **Water-cooled** chillers reject heat to water from a cooling tower or another water source. They condense at lower temperatures in most weather and are more efficient, at the cost of the tower, its water and its treatment.
- **Central chilled-water plant** serves a whole factory from several large chillers, with pumps and pipework delivering water to every machine; it is efficient at scale and less flexible when one process needs a different temperature.
- **Portable and machine-side chillers** serve a single machine at its own setpoint, which suits processes that need tight or unusual temperatures.

The moulder chose a single air-cooled packaged chiller for its moulding shop because the load is modest, the shop has no cooling tower, and every mould accepts the same 12 °C water. The calculations in this book apply to all of them; the condenser's medium changes the condensing temperature, not the physics.

## Sizing the water circuit

The chiller's water circuit is sized with it. CH-30's 30 kW at a 5 K temperature difference needs about 86 litres a minute (Chapter 2), and its pump must deliver that flow against the pressure losses of the evaporator, the pipes, the mould circuits and their valves. A pump sized too small starves the evaporator, lowers the evaporating temperature and risks freezing; a pump sized too large wastes power, all of which becomes heat in the water and adds to the load. A buffer tank of a few hundred litres, as an illustration, gives the compressor long enough on and off periods at light load; its size is set by the compressor's minimum run time and the load's smallest steady value. These choices are part of buying a chiller, not afterthoughts.

## How a chiller is rated

A chiller's capacity and efficiency change with the temperatures it works between (Chapter 7), so a rating means nothing without its conditions. A rating states, at least:

- the **leaving water temperature**, here 12 °C, and the water flow or temperature difference, here 5 K;
- the **ambient air temperature** at the condenser for an air-cooled machine, here 35 °C, or the entering condenser water temperature for a water-cooled one;
- the **cooling capacity** at those conditions, in kilowatts;
- the **power input**, and what it includes: the compressor alone, or also the fans, pump and controls.

Makers rate their chillers to published test standards so that ratings can be compared, and they publish tables of capacity and power at other conditions. A buyer compares chillers at the conditions the plant will actually see, including the hottest day, and asks for the part-load figures as well, because a chiller spends most of its life below full load (Chapter 2).

## The second law's limit

Moving heat from cold water into warmer air requires work, and the second law sets a minimum. For a refrigerator taking heat from a cold place at absolute temperature T_c and rejecting it to a hot place at T_h, the coefficient of performance, the heat removed per unit of work, can be no higher than the Carnot limit:

COP_max = T_c ÷ (T_h − T_c)

The difference T_h − T_c is the **temperature lift**. The limit depends on nothing but the two temperatures in kelvin, and it falls as the lift grows.

This is an illustration for CH-30. Two limits are worth calculating.

- **Between the water and the air**, 12 °C and 35 °C, 285.15 K and 308.15 K, a lift of 23 K: COP_max = 285.15 ÷ 23 = **12.4**.
- **Between the refrigerant's evaporating and condensing temperatures**, 2 °C and 45 °C, a lift of 43 K: COP_max = 275.15 ÷ 43 = **6.40**.

Chapter 3 works through CH-30's real cycle from NIST's data and finds a COP of **3.71**: 30 kW of cooling for 8.09 kW of compressor work. That is 58% of the Carnot figure for its refrigerant temperatures and 30% of the figure for the water and air.

```figure
type: formula
title: The Carnot limit for CH-30
formula: COP_max = T_c ÷ (T_h − T_c)
caption: Temperatures in kelvin. This is an illustration: the limit between the fluids CH-30 serves, and between its refrigerant temperatures, against its actual cycle COP.
- T_c, T_h | 285.15 and 308.15 K for the water and air; 275.15 and 318.15 K for the refrigerant
step: Water to air: 285.15 ÷ 23 = 12.4
step: Refrigerant: 275.15 ÷ 43 = 6.40
step: CH-30's cycle: 3.71 (Chapter 3), 58% of the refrigerant limit
```

## Where the shortfall goes

The gap between the limits, and between the limit and the real machine, has identifiable causes, each of which a later chapter takes up.

1. **Approach temperatures.** To take heat from 12 °C water, the refrigerant must boil colder than the water, here at 2 °C; to reject heat into 35 °C air, it must condense hotter, here at 45 °C. These approaches nearly double the lift, from 23 K to 43 K, and halve the best possible COP (Chapter 7).
2. **Throttling.** The expansion valve drops the pressure without recovering any work, and part of the liquid flashes to vapour on the way (Chapter 5).
3. **Compression.** The real compressor needs more work than an ideal one, and its losses heat the gas (Chapter 6).
4. **Superheated discharge.** The compressed vapour leaves hotter than the condensing temperature, and rejecting that heat at a higher temperature than necessary costs work (Chapters 3 and 6).

Chapter 7 shows that the first cause, the approaches, is usually the cheapest to reduce.

```figure
type: bars
title: CH-30's coefficient of performance against the second law's limits
unit: COP
max: 13
caption: This is an illustration. Approach temperatures nearly halve the limit; throttling, compression and superheat take most of the rest.
- Carnot, 12 °C water to 35 °C air | 12.4
- Carnot, 2 °C to 45 °C refrigerant | 6.40
- * CH-30's actual cycle | 3.71
```

## Why lift dominates

Because the limit is the cold temperature divided by the lift, and the cold temperature changes little in practice, the limit is roughly inversely proportional to the lift. With the cold side at 2 °C, 275.15 K:

- a lift of **20 K** allows a COP of up to **13.8**;
- **30 K**, **9.17**;
- **40 K**, **6.88**;
- **43 K**, CH-30's design, **6.40**;
- **50 K**, **5.50**;
- **60 K**, **4.59**.

Every kelvin of lift costs between about 2 and 5% of the best possible COP over this range, more at small lifts and less at large ones, and about 2.3% around CH-30's design lift of 43 K. Real chillers follow the same trend, as Chapter 7 shows from refrigerant data. Anything that reduces the lift, a warmer setpoint, a cooler or cleaner condenser, a larger evaporator, saves energy in nearly direct proportion; anything that adds to it costs energy the same way.

## Free cooling

When the outdoor air is colder than the water returning from the process, the lift is negative and heat flows downhill by itself: no compressor is needed, only fans and a pump to bring water and air together in a heat exchanger, a **dry cooler**. For CH-30, whose water returns at 17 °C, outdoor air below about 7 °C could cool the water to its 12 °C setpoint with a 5 K approach, and air between 7 and 17 °C could do part of the job while the compressor did the rest. Whether a dry cooler is worth adding depends on how many of the plant's operating hours have air that cold, a question for the site's weather records. Chapter 8 returns to it.

## Units of performance

Chiller performance is quoted in several units, and confusing them causes real errors.

- **COP**, kilowatts of cooling per kilowatt of input: dimensionless, the unit of this book.
- **EER**, energy efficiency ratio, in British thermal units per hour per watt, common on equipment from or for the United States: EER = 3.412 × COP. CH-30's COP of 3.71 is an EER of about 12.7.
- **Tons of refrigeration**: a ton is 3.517 kW, the cooling of a short ton of ice melting in a day. CH-30 is about 8.5 tons, and its compressor alone uses about 0.95 kW per ton.
- **Seasonal or part-load figures**, which average performance over a range of conditions and loads and are usually higher than the design-point COP.

A COP should always be stated with its conditions and with what its input power includes.

```figure
type: compare
title: CH-30's design-point performance in common units
rowhead: Measure
cols: Value | Conversion
caption: This is an illustration for the compressor alone at the design point; including fans and the pump lowers every figure.
- * COP | 3.71 | kW cooling per kW of work
- EER | 12.7 | 3.412 × COP, Btu/h per W
- Capacity in tons | 8.53 | 30 kW ÷ 3.517 kW per ton
- kW per ton | 0.95 | 3.517 ÷ COP
```

## The error: a figure that broke the second law

This is an illustration. When the moulder was replacing an old chiller, one supplier's brochure claimed an efficiency of "9.0" for its 30 kW unit, against the 3.5 to 4 the other suppliers offered. The engineer checked it against the second law. With 12 °C water and 35 °C air, the absolute limit was 12.4, so 9.0 was not impossible in principle; but with any realistic approach temperatures, around 10 K each side, the limit for the refrigerant was about 6.4, and a real cycle reaches a little over half of its Carnot figure. A COP of 9.0 at those conditions could not be achieved.

The supplier confirmed that the figure was an **EER**, in Btu/h per watt, at a lower ambient temperature than the moulder's design. As a COP it was 9.0 ÷ 3.412 = **2.64**, and at 35 °C ambient it would be lower still. The "best" quote was the worst.

The moulder's request for quotation now asks for COP in kW per kW at 12 °C leaving water and 35 °C ambient, including condenser fans, with part-load figures, and the engineer checks every figure against the Carnot limit before comparing quotes.

```figure
type: checklist
title: Checks on a quoted chiller rating
caption: The second law is a free check on any claim. The last line is this chapter's error.
- Unit stated: COP in kW per kW, not EER or kW per ton | EER = 3.412 × COP
- Conditions stated: leaving water and ambient temperatures | 12 °C and 35 °C
- Input power stated: compressor only, or with fans and pump | fans included
- Figure below the Carnot limit with realistic approaches | about 6.4 for 10 K approaches
- Part-load figures given as well as full load | most hours are at part load
- x An EER read as a COP | 9.0 claimed; COP 2.64 in fact
```

## Exercise: a colder process

A second chiller must supply water at **5 °C** with the same 35 °C air. Assuming 10 K approach temperatures on each side, find the Carnot COP for the water and air, and for the refrigerant temperatures. If the real cycle reaches the same 58% of its refrigerant Carnot figure as CH-30, estimate its COP and the work for 30 kW of cooling.

**Worked answer.** The refrigerant evaporates at −5 °C and condenses at 45 °C.

- Water to air: 278.15 ÷ 30 = **9.27**.
- Refrigerant: 268.15 ÷ 50 = **5.36**.
- Real COP: 0.58 × 5.36 = about **3.1**; work: 30 ÷ 3.1 = about **9.7 kW**, against CH-30's 8.09 kW.

Cooling water 7 K colder raises the work by about a fifth. Water at 5 °C is also close enough to freezing that the circuit would probably need glycol (Chapter 2), which lowers the evaporator's effectiveness and adds to the lift again. Chapter 7 calculates the effect of evaporating temperature from refrigerant data rather than from a fixed fraction of Carnot.
