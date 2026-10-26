---
book: process-chillers-by-the-numbers
chapterSlug: running-cost-and-heat-recovery
order: 8
title: "Running cost and heat recovery"
description: "CH-30's electricity and annual cost with GST stated, what improvements are worth, whole-life cost, recovering condenser heat at the right temperature, and heat promised that was not there."
draft: false
---

A chiller's price is paid once; its electricity is paid every hour it runs, for fifteen years or more. Over its life, a process chiller usually costs several times its purchase price in energy, and the decisions of the last three chapters, setpoints, approaches, maintenance, compressor control, show up here as dollars. So does the other side of the cycle: every chiller rejects more heat than it removes, and that heat, at the right temperature, can do useful work.

This chapter builds up CH-30's electrical demand, estimates its annual energy and cost, prices the improvements found in earlier chapters, looks at recovering heat from the condenser and the discharge gas at the temperatures the plant can use, and ends with a heat recovery proposal that promised heat at a temperature the cycle could not deliver.

## Electrical demand

The compressor is the largest load, but not the only one. This is an illustration for CH-30 at its design point:

- **compressor**: 8.09 kW of compression work, which with a motor efficiency of 90% is **8.99 kW** of electricity;
- **condenser fans**: **1.2 kW** at full speed;
- **controls and crankcase heater**: about **0.1 kW**.

The total is about **10.3 kW** for 30 kW of cooling, a system COP of **2.92**, against the cycle's 3.71. The chilled water circulation pump, 1.5 kW, is usually counted separately as part of the water system, though its heat is part of the chiller's load (Chapter 2). A chiller's quoted efficiency should say which of these it includes.

## Annual energy and cost

This is an illustration. CH-30 runs **4,800 hours** a year, two shifts on working days, at an average of **70%** of its peak load, **21 kW** of cooling. Its average efficiency over the year is better than at its design point, because most hours are at part load and below the 35 °C design ambient, with the head pressure floating (Chapter 7); taking a seasonal COP for the compressor and motor together of **3.9**:

- cooling delivered: 21 × 4,800 = **100,800 kWh** a year;
- compressor and motor: 100,800 ÷ 3.9 = **25,846 kWh**;
- fans, at an average of 0.8 kW: **3,840 kWh**;
- controls: **480 kWh**;
- total: about **30,170 kWh** a year.

At an illustrative tariff of **A$0.28 per kWh excluding GST**, that is about **A$8,450 a year** excluding GST, or about A$9,290 including GST. A business registered for GST generally claims the GST back as an input tax credit, so comparisons are made excluding it, as the Australian Taxation Office's guidance explains; this book states both.

```figure
type: stack
title: CH-30's annual electricity, about 30,170 kWh
unit: kWh
caption: This is an illustration: 4,800 hours at 70% load, a seasonal compressor and motor COP of 3.9, fans averaging 0.8 kW. At A$0.28 per kWh excluding GST, about A$8,450 a year.
- Compressor and motor | 25846
- Condenser fans | 3840
- Controls and crankcase heater | 480
```

## What the improvements are worth

The earlier chapters found several ways to reduce CH-30's energy. At the same tariff, as illustrations:

- **Warmer setpoint** on the circuits that can take it (Chapter 7's exercise): about 0.53 kW less compressor work at full load, which at 70% average load over 4,800 hours, with the motor's losses, is about **1,980 kWh** and **A$554 a year**, for the cost of a conversation with the process engineers.
- **Keeping the condenser clean** (Chapter 7's error): the dirty coil added about 22% to the compressor's power in the hottest hours. Over 720 hot hours at full load, about **1,420 kWh** and **A$399 a year**, and more in a dusty year, for an hour's cleaning each month in summer.
- **Variable-speed compressor**: if a variable-speed drive raised the seasonal compressor COP from 3.9 to 4.6, by following the load and taking advantage of smaller approaches at part load, the saving would be about **3,930 kWh** and **A$1,100 a year**. At an illustrative extra cost of A$4,500 excluding GST, the simple payback is about **4.1 years**.

The cheapest savings are operational, and they come first. Equipment changes are compared on their payback and life, with their assumptions stated, because a seasonal COP is an estimate until the chiller has been metered for a year.

```figure
type: compare
title: Savings found in earlier chapters, at A$0.28 per kWh excluding GST
rowhead: Measure
cols: Energy saved, kWh a year | Saving, A$ a year ex GST | Cost
caption: This is an illustration for CH-30's 4,800 hours at 70% average load. Operational measures cost little; the variable-speed drive pays back in about four years.
- Warmer setpoint where the process allows | 1,980 | 554 | a decision
- Condenser kept clean | 1,420 | 399 | an hour a month in summer
- * Variable-speed compressor | 3,930 | 1,100 | about A$4,500 ex GST
```

## Whole-life cost

Energy dominates a chiller's lifetime cost. This is an illustration: if CH-30 cost about A$38,000 excluding GST to buy and install, and its electricity costs about A$8,450 a year at today's tariff, then over a 15-year life, without allowing for tariff changes or discounting, it would use about A$127,000 of electricity, more than three times its price. Maintenance, refrigerant checks and eventual repairs add to that.

That ratio is why the cheapest chiller to buy is rarely the cheapest to own, and why buyers compare chillers on their measured or certified efficiency at conditions like their own, including part load and fans. A chiller that costs A$5,000 more but uses 15% less electricity saves about A$1,270 a year at CH-30's figures, and repays its extra cost in about four years. The calculation should be made with the buyer's own hours, load profile and tariff, and with any interest or discounting the business uses for capital decisions; the illustrative figures here only show its shape.

## Demand charges

Many business electricity tariffs charge not only for energy, in kilowatt-hours, but also for **demand**, the highest power drawn in a billing period, in kilowatts or kilovolt-amperes. A chiller's highest demand comes on the hottest afternoon, at full load and the highest condensing temperature, which is often when the rest of the site's demand peaks too.

The measures that lower the lift also lower the peak: a clean condenser, a sensible setpoint, and shading or ventilating the plant room so that the condenser's intake air is not hotter than the outdoor air. A buffer tank or thermal store can shift some cooling to cooler hours. The value of each depends entirely on the tariff, which is worth reading line by line before estimating savings.

## Leaks cost energy before they cost refrigerant

A refrigeration circuit that is slowly losing refrigerant shows it first in its performance, not as a breakdown. The subcooling falls as there is less liquid to fill the condenser's bottom passes, the flash gas rises (Chapter 5), the evaporator is starved and the superheat climbs, and the capacity and COP fall together. A system that has lost a tenth of its charge can still run, using noticeably more energy for less cooling, until the shortage is bad enough to trip it. Logged subcooling and superheat, read against the conditions, catch it early; Chapter 9 shows how these readings are logged and read as fault signatures; READOS's chapter on [refrigerants, rules and safety](/reados/publications/heat-pumps-and-refrigeration-by-the-numbers/refrigerants-rules-and-safety/) sets out what the law requires once a leak is suspected.

## Measuring savings honestly

A saving claimed is not a saving made. Chiller energy depends on the weather and the production load as much as on the improvement being measured, so a simple comparison of this summer's bill with last summer's can show a saving that is really a cooler season, or hide one that was real.

The sound approach is to meter the chiller's electricity and its cooling output, as in this chapter's exercise, for long enough before the change to establish a baseline across a range of weather and load, and then to compare the system COP after the change with the baseline at similar conditions. A COP comparison corrects for the load, and comparing like weather with like corrects for the lift. For the moulder, a heat meter on CH-30's water circuit, a flow meter and two matched temperature sensors (Chapter 2), cost little next to a variable-speed drive and turn every later decision from an estimate into a measurement.

## Free cooling's value

Chapter 1 noted that when the outdoor air is colder than the water returning from the process, heat can flow downhill without a compressor. For CH-30, with water returning at 17 °C and leaving at 12 °C, a dry cooler could do the whole job in air below about 7 °C, with a 5 K approach, and part of it in air up to 17 °C. How much that is worth depends on the site's climate during the hours the moulds run. In a cool climate with long winter nights of production, it can be a large share of the year's cooling at almost no energy cost; in a warm climate with day-shift production, very little. The calculation is the same as in the rest of this chapter, using the site's hourly weather instead of the design point, and it is worth doing before a chiller is replaced.

## Heat rejected is heat available

CH-30's condenser rejects 38.09 kW at full load (Chapter 3): the 30 kW taken from the water plus the compressor's 8.09 kW. Over a year at 70% load, that is roughly 128,000 kWh of heat blown into the air outside the plant room. Some of it can be used, and the second law decides how much, because heat is only useful at a temperature above where it is needed.

The condenser's heat comes at three temperatures (Chapter 3):

- **desuperheating**, 4.59 kW at full load, available from 65 °C down to 45 °C;
- **condensing**, 31.97 kW, at 45 °C;
- **subcooling**, 1.53 kW, from 45 down to 40 °C.

The desuperheating heat is the hottest and the easiest to recover: a small heat exchanger, a **desuperheater**, in the discharge line ahead of the condenser can heat water towards the discharge temperature without changing the cycle. At 70% average load over 4,800 hours, CH-30's desuperheater could recover about **15,400 kWh** a year, worth about **A$4,320** excluding GST if it displaced electric water heating. The condensing heat is far larger but only at 45 °C, which suits preheating, space heating in winter, or warming the moulding shop's make-up air, rather than hot water.

## Where the heat can go

The moulder's plant has three uses for low-grade heat, each at a different temperature, and the condenser's heat suits them differently.

- **Wash water at 60 °C.** Only the desuperheating heat is hot enough to contribute directly, and only as preheating; the final rise needs a heater or a heat pump. READOS's Heat Pumps and Refrigeration by the Numbers works through [heat pump water heating](/reados/publications/heat-pumps-and-refrigeration-by-the-numbers/heat-pump-water-heating/) in detail, and its arithmetic applies here: preheating the water with CH-30's desuperheater reduces the lift the heat pump or heater must provide.
- **Space heating in winter.** The condensing heat, at 45 °C, can warm air for the moulding shop or its offices through a water coil, which needs only about 30 to 35 °C water. In winter, when the shop needs heat, CH-30 still runs, because the moulds still need cooling.
- **Make-up air and drying.** Air for the shop's ventilation, or for drying hygroscopic polymer pellets before moulding, can be pre-warmed by the condenser's exhaust air or water, reducing the energy of the dryers' own heaters.

Each use needs the heat at the time it is produced, or a store to hold it until it is wanted, and a control arrangement that does not let the heat recovery raise the chiller's condensing temperature and cost more in compressor power than it saves. The design rule is simple: the recovery must take heat from the condenser at or below the temperature the condenser would have reached anyway.

## The error: heat at the wrong temperature

This is an illustration. A supplier proposed a heat recovery system for CH-30 that would "recover the chiller's 38 kW of rejected heat to provide the wash water", and its proposal estimated savings on that basis: enough to heat the whole wash water demand several times over.

The moulder's engineer checked the temperatures. The wash water had to reach 60 °C. The condensing heat, 31.97 of the 38.09 kW, is rejected at 45 °C, and heat at 45 °C cannot warm water above 45 °C: in practice, with a heat exchanger's approach, not above about 40 °C. Only the desuperheating heat, 4.59 kW at full load, is available above 45 °C, and even that falls to 45 °C as the gas cools. The second law, which had made the chiller work in the first place, limited what its heat could do.

The proposal was revised to what the temperatures allowed: a desuperheater preheating the wash water, with the condensing heat used to preheat the incoming cold water to about 40 °C in winter, and the final lift to 60 °C by the existing heater, with a heat pump to be considered separately. The revised savings were about half the original claim, and real.

```figure
type: checklist
title: Running cost and heat recovery checks
caption: Energy costs follow from hours, load and seasonal efficiency; recovered heat is limited by its temperature. The last line is this chapter's error.
- Electrical demand includes fans and controls | about 10.3 kW at the design point
- Annual energy from hours, average load and seasonal COP | about 30,170 kWh
- Costs stated with and without GST | A$8,450 ex GST; A$9,290 incl GST
- Operational savings before equipment | setpoint and cleaning first
- Recovered heat matched to the temperature needed | desuperheat to 65 °C; condensing at 45 °C
- x Total condenser heat counted as hot water | only the desuperheat is above 45 °C
```

## Exercise: metering the chiller

After CH-30 has been fitted with an electricity meter and a heat meter on its water circuit, a month's readings show **8,900 kWh** of cooling delivered and **2,480 kWh** of electricity for the chiller, excluding the circulation pump. Find the measured system COP for the month and the month's cost at A$0.28 per kWh excluding GST. How does the measured figure compare with the design-point system COP of 2.92?

**Worked answer.**

- Measured system COP: 8,900 ÷ 2,480 = **3.59**.
- Cost: 2,480 × 0.28 = **A$694** excluding GST, about A$764 including GST.

The month's COP is about 23% better than the design-point system COP, which is what a month of mostly part-load running in mild weather with a floating head pressure should give. Logging it month by month shows the seasonal pattern and catches a fault, such as a dirty coil, as a fall against the same month in earlier years.
