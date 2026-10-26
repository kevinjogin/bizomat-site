---
book: heat-pumps-and-refrigeration-by-the-numbers
chapterSlug: heat-pump-water-heating
order: 4
title: "Heat pump water heating"
description: "Evaluate a heat pump for factory hot water: COP at each temperature, why heating all the way to 85 °C costs more than gas, hybrid preheating, a waste-water source, and paybacks under different prices."
draft: false
---

A heat pump can deliver several kilowatts of heat for each kilowatt of electricity, so it is natural to ask whether one should replace the gas heater on HW-60, the factory's wash-down hot water system. The honest answer depends on four numbers: the temperature the water must reach, the temperature of the heat source, the price of electricity and the price of gas. Change any of them and the answer changes. A heat pump that is excellent for warm water can be more expensive to run than gas for very hot water, and the same heat pump fed from warm waste water rather than cool outside air can be a good investment. Working through the options with numbers is the only reliable way to decide.

This chapter evaluates heat pump options for HW-60's heat. It sets the baseline cost with gas, shows why a heat pump heating all the way to 85 °C would cost more, compares hybrid arrangements where a heat pump preheats and gas tops up, considers using the factory's warm waste water as the heat pump's source, works out paybacks under different prices, and records the decision. The failure case is a heat pump installed at another site to make hot water at the full temperature, whose running cost exceeded the gas it replaced.

## The baseline

HW-60 needs about **150,000 kWh** of heat a year, heating mains water from 15 °C to 85 °C. This is an illustration. From gas, at about **A$0.093** per kWh of delivered heat, that costs about **A$13,980** a year. Chapter 2 found that, at an electricity price of **A$0.25** per kWh, a heat pump beats gas only if its heating COP exceeds about **2.68**.

## Heating all the way to 85 °C

A heat pump making water at 85 °C must condense its refrigerant at about **90 °C**. With outside air as its source, evaporating at about **10 °C**, the lift is 80 K, the Carnot heating COP about **4.54**, and the realistic COP about **2.27**, below the break-even. Heating all 150,000 kWh this way would use about **66,100 kWh** of electricity, costing about **A$16,500** a year, about **A$2,500 more** than gas. Some heat pumps cannot reach 85 °C at all with common refrigerants, and those that can often do so with reduced capacity.

## Hybrids: let the heat pump do the easy part

A heat pump's COP is highest at low temperatures. The heat to raise water from 15 °C to 85 °C can be split: the heat pump preheats the water to a moderate temperature, where its COP is high, and the gas heater tops it up to 85 °C. The heat pump does the first part of the lift, the gas the last.

```figure
type: compare
title: Running cost of HW-60's 150,000 kWh of heat by arrangement
cols: Heat pump COP | Heat pump's share of the heat | Electricity cost | Gas cost | Total a year
caption: This is an illustration at A$0.25 per kWh of electricity and A$0.093 per kWh of gas heat, with an air source evaporating at 10 °C unless stated. COP is half the Carnot figure, condensing 5 K above the water temperature.
- Gas only | none | none | none | A$13,980 | A$13,980
- Heat pump to 85 °C | 2.27 | all | about A$16,520 | none | about A$16,520
- Heat pump to 65 °C, gas to 85 °C | 2.86 | 50 of 70 K | about A$9,370 | about A$3,990 | about A$13,360
- Heat pump to 50 °C, gas to 85 °C | 3.65 | 35 of 70 K | about A$5,140 | about A$6,990 | about A$12,130
- *Waste-water source, heat pump to 50 °C, gas to 85 °C | 5.47 | 35 of 70 K | about A$3,430 | about A$6,990 | about A$10,420
```

The pattern is clear. Heating only to **50 °C** with the heat pump, and topping up with gas, is cheaper than heating to 65 °C, because the heat pump's COP at 50 °C is so much higher. Pushing the heat pump to do more of the lift raises its electricity cost faster than it reduces the gas cost.

## A better heat source

The heat pump's other temperature is its source. Outside air at 10 to 15 °C is the usual choice, but the factory has a better one: its warm waste water. After the recovery heat exchanger in *Heat Transfer by the Numbers*, the waste water still leaves at about 36 °C. A water-source heat pump drawing heat from it could evaporate at about **25 °C**, cutting the lift to the 50 °C preheat to only **30 K**.

```figure
type: formula
title: COP of a waste-water-source heat pump preheating to 50 °C
formula: Carnot COP_heating = T_cond ÷ (T_cond − T_evap)        realistic COP ≈ 0.5 × Carnot
caption: This is an illustration. The waste water must be flowing when the heat pump runs, which suits wash-downs; a small buffer tank of preheated water evens out the timing.
- Evaporating, from waste water at about 36 °C | 25 °C = 298.15 K
- Condensing, to make water at 50 °C | 55 °C = 328.15 K
step: Carnot COP ≈ 328.15 ÷ 30 ≈ 10.9
step: realistic COP ≈ 5.47
step: electricity for 75,000 kWh of preheat ≈ 75,000 ÷ 5.47 ≈ 13,700 kWh, about A$3,430
```

With a COP near **5.5**, the waste-water heat pump preheats half the system's heat for about **A$3,430** of electricity, bringing the total to about **A$10,420**, a saving of about **A$3,560** a year against gas only.

## Sizing the heat pump and its storage

The heat pump does not have to match the gas heater's peak output. Its job is to supply about **75,000 kWh** a year of preheat. If it could run for about **4,000 hours** a year, an average of about **19 kW** would do it. But a waste-water source is only available during and shortly after wash-downs, perhaps 2,000 hours a year, which would need about **37.5 kW**. The difference between those two figures is the case for storage: a buffer tank of preheated water lets a smaller heat pump run longer, storing heat when the waste water flows and supplying it when the hot water is drawn. Each cubic metre of water heated from 15 °C to 50 °C stores about **40.7 kWh**, so a 3 m³ buffer holds about 122 kWh of preheat, enough to carry the gas heater's feed through a wash-down. Sizing heat pump and buffer together, from the hourly pattern of waste water and hot water demand, gives the smallest, cheapest combination.

## Preheated water and health

Water stored at around 50 °C sits in the range of temperatures at which bacteria such as Legionella can grow, which is why hot water systems are designed to store and distribute water hot enough to control them, under AS/NZS 3500.4 and health guidance. A preheat buffer tank is therefore never the last stage of a hot water system: the gas heater raises all water to its full temperature before use, and the preheat tank is designed, controlled and periodically heated or managed so that its water does not become a hazard. These requirements are settled with a plumbing designer and the relevant health guidance before the arrangement is fixed, and they may affect the buffer's size and controls.

## Refrigerants for higher temperatures

The refrigerant chosen for a heat pump sets the temperatures it can reach and the pressures it runs at. Some common refrigerants are poorly suited to water much above 55 to 60 °C, either because their pressures become very high or because their efficiency falls away. Others, including carbon dioxide used in a different, transcritical cycle, suit high water temperatures and large temperature rises well, especially when the water is heated from cold in a single pass. Refrigerant choice therefore belongs in the comparison: the supplier's data for the actual refrigerant, water temperatures and source temperatures, rather than a general COP, is what decides an option.

## Air sources in winter

An air-source heat pump's source temperature follows the weather. On cold mornings, as Chapter 2 showed, its COP falls, and below a few degrees its outdoor coil frosts and must be defrosted, using energy and interrupting heating, as Chapter 3 described for the cold room's evaporator. Annual running costs therefore depend on the local climate and on when the heat pump runs: one that heats water mainly during the day, when the air is warmest, does better than one that runs overnight. In a mild coastal climate the effect is modest; in a cold inland one it can be large. The waste-water source avoids the problem entirely, which is part of its appeal for a factory like this one.

## Measure the result

Whatever is installed, its performance should be measured. A heat meter on the heat pump's water side and an electricity meter on its supply give its real COP, day by day, and a year's data give its real seasonal COP and running cost. Comparing those with the study's predictions shows whether the arrangement is working as intended and catches faults, such as a buffer tank control that lets the gas heater do the heat pump's work, which would otherwise go unnoticed while the bills quietly rise.

## Paybacks

Running costs are only half of the decision. Heat pumps cost far more to buy and install than gas heaters.

```figure
type: bars
title: Simple payback of the hybrid options at different electricity prices
unit: years
max: 25
caption: This is an illustration with installed costs of about A$40,000 for the air-source hybrid and about A$55,000 for the waste-water-source hybrid, excluding GST. Lower electricity prices, such as from on-site solar during the day, shorten paybacks sharply.
- Air source to 50 °C, electricity A$0.25 | 21.6
- *Waste-water source to 50 °C, electricity A$0.25 | 15.4
- Waste-water source, electricity A$0.15 | 11.1
```

At A$0.25 per kWh, neither hybrid pays back quickly. The waste-water hybrid's payback of about **15 years** is long for a factory investment. At **A$0.15** per kWh, which the factory could achieve by running the heat pump during the day from rooftop solar, the payback falls to about **11 years**. A higher gas price, as the exercise shows, shortens it further. The numbers say the project is close to worthwhile and very sensitive to prices, which is a common position for heat pumps in Australia today.

## Things the running cost leaves out

Several factors sit outside the running cost comparison. Electricity network charges, such as demand charges based on peak power, can add to the heat pump's cost if it runs during the site's peak. Gas connection and supply charges may not fall if gas is still used for top-up and other loads. Heat pumps need refrigeration servicing by licensed technicians. On the other side, many businesses put a value on reducing emissions or on reducing their dependence on gas, and those values can tip a close decision. The analysis above gives the factual base; the business decides how to weigh the rest. Writing those other factors down beside the numbers, with a view on each, makes the decision easier to explain to the owners, and easier to revisit when prices change.

## The decision

The factory decided not to install a heat pump immediately, and to revisit the decision when its gas contract is renewed or its planned rooftop solar is installed, whichever comes first. The engineering study recorded the arrangement that makes sense when it does: a **waste-water-source heat pump preheating to about 50 °C**, with the gas heater topping up, a small buffer tank to match the heat pump's output to the wash-down schedule, and a monitoring period after installation to confirm the real COP. The study also noted that the recovery heat exchanger, already planned, should be installed first, because it is far cheaper per kilowatt-hour saved and does not depend on prices.

## A failure case: heating to full temperature

This is an illustration. A neighbouring food business installed an air-source heat pump to replace its gas water heater outright, heating its wash-down water to 80 °C. Its supplier's proposal used a COP of about 3 from rating conditions that assumed much cooler water.

After a year, the business's electricity bill had risen by more than its gas bill had fallen. Metering the heat pump showed an average COP of about **2.1** at the real water temperature and the winter air temperatures, below that business's break-even COP. The heat pump was performing as physics predicted; the proposal's assumptions had not matched the duty.

The detection came from comparing a year's metered electricity with the gas it replaced. The correction was to change the arrangement: the heat pump's set point was lowered to about 55 °C, and the old gas heater was reinstated as a top-up heater. The heat pump's COP rose to over 3, and the combined running cost fell below the original gas-only cost. The lesson for the factory's own study was to design the arrangement around the temperatures, not the equipment, and to ask every supplier for performance at the site's own water and source temperatures, in writing, before comparing quotes.

## How this applies to a small Australian business

Before choosing a heat pump for hot water, work out the break-even COP from your electricity and gas prices, and the heat pump's realistic COP at your real temperatures. Let the heat pump do the low-temperature part of the lift and a conventional heater the rest. Look for warm waste streams as heat sources, which raise COP greatly. Calculate paybacks under the prices you expect, including on-site solar, and include network charges and servicing. Install cheaper measures, such as heat recovery, first. And monitor the real COP after installation.

## Exercise: dearer gas

The factory's gas contract renewal raises the price to **A$30 per gigajoule**, making delivered gas heat about **A$0.127** per kWh. With electricity still at A$0.25 per kWh, what does gas-only heating now cost a year? What does the waste-water-source hybrid cost, what does it save, and what is its payback at A$55,000?

**Worked answer.** Gas only costs about **150,000 × 0.127 ≈ A$19,060** a year. The hybrid's electricity is unchanged at about **A$3,430**, and its gas for the 75,000 kWh top-up costs about **75,000 × 0.127 ≈ A$9,530**, a total of about **A$12,960**. The saving is about **A$6,100** a year, and the payback about **55,000 ÷ 6,100 ≈ 9 years**. A higher gas price makes the heat pump substantially more attractive, which is why the decision was tied to the contract renewal.
