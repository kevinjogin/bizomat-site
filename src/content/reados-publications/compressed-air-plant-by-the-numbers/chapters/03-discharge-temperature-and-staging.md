---
book: compressed-air-plant-by-the-numbers
chapterSlug: discharge-temperature-and-staging
order: 3
title: "Discharge temperature, staging and cooling"
description: "Calculate how hot air gets in one isentropic stage, why oil injection and intercooled stages help, why an oil-flooded screw must stay above its own dew point, and what the aftercooler removes."
draft: false
---

Squeezing air heats it, and at a pressure ratio of eight the heating is dramatic. Compressed in a single stage with no cooling, CA-1's air would leave at well over 250 °C, hot enough to char oil, damage seals and start fires in discharge pipework. Real compressors control that temperature in different ways: by cooling during compression, by splitting compression into stages with coolers between them, or by flooding the compression space with oil.

This chapter calculates CA-1's ideal discharge temperature, shows how staging both lowers it and saves work, explains why an oil-injected screw must run hot enough to keep water out of its oil, and calculates the heat its aftercooler removes. It closes with the summer trip that a hot compressor room causes.

## The isentropic temperature rise

For ideal compression with no heat removed, the air's absolute temperature rises with the pressure ratio:

**T₂ = T₁ × r^((k−1)/k)**

with k = 1.4 for air, so the exponent is about 0.2857.

This is an illustration. CA-1's air enters at 25 °C, 298.15 K, and is compressed by a ratio of 8.40. In one ideal stage:

**T₂ = 298.15 × 8.402^0.2857 ≈ 298.15 × 1.8366 ≈ 547.6 K, about 274.6 °C**

A real uncooled compressor, less efficient than the ideal, would run hotter still. On a 45 °C day the same ideal calculation gives about 311 °C. Temperatures like these are why single-stage dry compression to factory pressures is not used in practice, and why discharge temperature is one of the main safety shutdowns on every compressor.

## Staging with intercooling

Splitting the compression into two stages, with an intercooler between them that cools the air back towards intake temperature, attacks the problem twice. Each stage works over a smaller ratio, so each discharge temperature is lower. And the second stage compresses cool, dense air, which takes less work than compressing the hot air that a single stage would be dealing with.

For two ideal stages with perfect intercooling to intake temperature, the total work is least when each stage has the same ratio, the square root of the overall ratio: √8.402, about 2.899. Then:

```figure
type: compare
title: Ideal compression of CA-1's 6.0 m³/min to 750 kPa gauge
rowhead: Arrangement
cols: Ratio per stage | Discharge temperature per stage | Ideal power | Saving on one stage
caption: Ideal gas, k = 1.4, intercooling to 25 °C. More stages approach the isothermal ideal of 21.57 kW but add coolers, piping and cost.
- One stage | 8.40 | about 274.6 °C | 29.68 kW | none
- * Two stages, equal ratios | 2.90 each | about 131 °C | 25.20 kW | about 15.1 per cent
- Two stages, 4.0 then 2.10 | unequal | about 170 °C first stage | 25.61 kW | about 13.7 per cent
- Three stages, equal ratios | 2.03 each | about 92 °C | 23.91 kW | about 19.4 per cent
```

The unequal split shows why the square-root rule matters: putting more of the ratio in the first stage raises its temperature and the total work. Imperfect intercooling costs work too: if the intercooler only brings the air back to 35 °C, the two-stage ideal rises from 25.20 to about 25.63 kW. Large reciprocating and oil-free screw compressors are usually two-stage for exactly these reasons. The [air compressor staging check tool](/tools/compressor-staging-check/) repeats these calculations for other ratios and stage numbers.

Staging is also used inside some oil-injected screw packages, where two compression elements in series share the ratio and the oil between them provides cooling. Two-stage oil-injected machines cost more than single-stage ones of the same capacity, and their makers claim lower specific power. Whether the saving justifies the price depends on running hours and electricity cost, and on a fair comparison at the plant's pressure, as Chapter 2 described. The thermodynamic ideal in the table above sets the ceiling on what any such claim can be.

## How oil-injected screws keep cool

An oil-injected screw compressor takes a different route. It sprays a large flow of oil into the compression space. The oil absorbs most of the heat of compression as the air is squeezed, so the air and oil leave the element together at a moderate temperature, typically somewhere around 80 °C to 95 °C, rather than at 270 °C. The oil is then separated from the air, cooled in an oil cooler and injected again.

That keeps temperatures manageable in a single stage and brings the process closer to isothermal than a dry single stage, which is part of why oil-injected screws are efficient for their simplicity. It also moves almost all the compression heat into the oil, which makes it easy to recover, as Chapter 4 shows.

## The dew point inside the compressor

Running an oil-injected screw too cool causes a less obvious problem: water in the oil. The air entering CA-1 carries about 0.0119 kg of water vapour per kilogram of dry air. Inside the element at 851.3 kPa absolute, that vapour's partial pressure rises in proportion to the total pressure, to about 0.0119 × 851.3 ÷ (0.622 + 0.0119), roughly 16.0 kPa. Water's saturation temperature at 16.0 kPa, from the IAPWS equation in the references, is about **55.3 °C**.

If the air and oil inside the compressor fall below about 55 °C, water condenses in the element and mixes with the oil. The oil emulsifies, loses its lubricating and sealing properties, and the bearings and rotors suffer. This is why oil-injected screws have a thermostatic valve that sends oil around the cooler until it is warm, and why their minimum discharge temperature is set some margin above the internal dew point. A compressor that runs lightly loaded for long periods, or that is cooled too hard in a cold room, can spend much of its time below that temperature. On humid sites the internal dew point is higher still.

```figure
type: bars
title: CA-1's temperatures, from intake to the main
unit: °C
max: 300
caption: This is an illustration. The single-stage dry figure is the ideal; the oil-injected discharge is a teaching value. The compressor must run above its internal dew point and the aftercooler must bring the air close to ambient.
- Intake air | 25
- Dew point of the air inside the element | 55.3
- * Oil-injected discharge, teaching value | 85
- Ideal single-stage dry discharge | 274.6
- After the aftercooler | 35
```

## The aftercooler

Air leaving CA-1's element, after the oil separator, still carries the heat of its discharge temperature and almost all the water vapour it came in with. The aftercooler, a finned air-cooled heat exchanger in the package, cools it to about 35 °C, 10 °C above the room, so that most of the water condenses where it can be drained.

This is an illustration. At full load, cooling 0.1162 kg/s of dry air with its vapour from 85 °C to 35 °C removes about 6.0 kW of sensible heat. Condensing the 3.25 kg/h of water that drops out, at a latent heat of about 2,418 kJ/kg, removes about another 2.2 kW. The aftercooler therefore handles about **8.2 kW**, a fifth of the compressor's 41 kW input. The rest leaves through the oil cooler, as Chapter 4 explains. Chapter 5 follows the condensed water.

Aftercooler performance depends on the cooling air reaching it. A package that draws its cooling air from a hot room, or a cooler clogged with dust, delivers warmer and wetter air to everything downstream, including the dryer, which then has to work harder.

## Temperatures at part load

A compressor's temperatures change with its load. An oil-injected screw running loaded produces heat continuously and its thermostatic valve holds the oil within its working range. Unloaded, it produces little heat, and in a cool room its oil temperature can fall towards the internal dew point calculated above. A machine that spends long periods lightly loaded or idling in winter is the one most likely to suffer water in its oil, and the oil analysis that maintenance contracts often include is the way to find out. Water content in the oil sample is a direct measure of whether the compressor has been running too cool.

Load and unload cycling also cycles temperatures, which stresses coolers and seals. A compressor sized far larger than its average demand, as Chapter 8 discusses, cycles more and spends more time cool. Temperature is one more reason to match compressor size to demand.

## Warm air in the main

Air leaving the aftercooler at 35 °C is saturated with water vapour at that temperature and pressure. If it went straight to the plant without drying, it would cool further in the main, towards the temperature of the pipes and the plant, and condense more water inside them: in pipes, in valves, in cylinders and on products. The aftercooler removes the bulk of the water; the dryer, in Chapter 6, removes enough of the rest that the air will not condense anywhere it travels. That is why the two always appear together, and why a warm aftercooler outlet, which leaves more vapour for the dryer, shows up as wet air in the plant.

## A failure case: the summer trip

This is an illustration. Every summer, CA-1's compressor tripped on high discharge temperature on the hottest afternoons, stopping the plant's air supply for the twenty minutes it took to cool down and restart. The maintenance response had been to reset it and hose down the cooler.

A temperature logger showed the compressor room reaching 45 °C on those afternoons. The room's ventilation fan, sized when a smaller compressor stood there, could not remove the heat of a 41 kW machine, and the package was recirculating its own warm exhaust through its coolers. With a cooler that removes heat in proportion to the difference between oil and cooling air, every degree of room temperature added roughly a degree to the oil and the discharge, pushing the discharge towards its trip setting.

The error was in treating the trip as a compressor fault rather than a room fault. The correction was to duct the package's hot exhaust air out of the room, to bring cool outside air in low on the opposite side, and to duct the intake from outside, which also improved the compressor's mass flow, as Chapter 1 described. Chapter 4 then turned the ducted hot air into a heat source. A room temperature alarm, set well below the point where the compressor would trip, gives warning before the next heatwave.

## Air-cooled or water-cooled

CA-1's package is air-cooled: fans blow room air across its oil cooler and aftercooler. Larger compressors are often water-cooled, with the oil cooler and aftercooler connected to a cooling water circuit and a cooling tower or dry cooler outside. Water cooling removes heat from the room, which keeps the room cooler and the compressor more efficient, and puts the heat in a form that is easier to recover. It also adds a water circuit to maintain, with its own scaling, corrosion and, for cooling towers, health risks that are subject to registration and management requirements in Australian states and territories.

The choice is usually made by the compressor's size and the site. For a 37 kW machine like CA-1's, air cooling with good ducting is simple and effective. For several hundred kilowatts of compression, water cooling and heat recovery tend to win.

## Drains on every cooler

Every cooler that cools compressed air below its dew point condenses water, and that water must be drained. Intercoolers on staged machines, aftercoolers, separators and receivers all need drains that work reliably. A failed drain lets water accumulate until it is carried downstream in slugs, through the dryer and into the main. Chapter 5 covers drain types and the condensate's oil content.

## Watch the temperatures

```figure
type: checklist
title: Temperatures to log in CA-1's compressor room
caption: Most are shown on the compressor's controller; logging them weekly, or continuously, shows drift long before a trip.
- Room and intake air temperature | rising room temperature means ventilation is failing or being blocked
- Element discharge temperature | trending upward points to a fouled cooler, low oil or a failing thermostatic valve
- x Do not raise a temperature trip setting to stop nuisance trips | find the cause instead
- Aftercooler outlet temperature | more than about 10 to 15 °C above the room points to a fouled cooler or blocked airflow
- Dryer inlet and pressure dew point | a hot inlet overloads the dryer, as Chapter 6 shows
- ? Does the minimum discharge stay above the internal dew point | especially at light load and in winter
```

The aftercooler outlet reading is the most useful single check of cooler condition. If the air leaving the aftercooler is 20 °C above the room instead of 10 °C, the dryer downstream receives about 70 per cent more water vapour per kilogram of air than it was sized for, if the room is 25 °C and the outlet 45 °C instead of 35 °C, and the plant's air quality suffers even though nothing appears to have failed.

## Discharge temperature as a safety limit

Discharge temperature limits protect more than the compressor. In older reciprocating compressors, oil carried into hot discharge pipework can form carbon deposits that, at high temperature, can ignite. Oil-injected screws carry far more oil, kept in a controlled loop, and depend on their temperature shutdowns, their oil separator and their oil quality to keep it there. A compressor whose discharge temperature has been creeping up, or whose temperature shutdown has been raised or bypassed to stop nuisance trips, is a fire risk as well as an efficiency problem. Temperature shutdowns are set by the maker and are not adjusted on site without the maker's agreement.

## Exercise: three stages for a larger plant

A larger plant considers a three-stage machine with intercooling to 25 °C for the same overall ratio of 8.40. Find each stage's ratio, its ideal discharge temperature, and the ideal saving compared with two stages.

**Answer.** Each stage's ratio is the cube root of 8.402, about **2.03**. Each stage's ideal discharge temperature is 298.15 × 2.03^0.2857, about 365 K, roughly **92 °C**. The ideal total power for 6.0 m³/min is about 23.91 kW, against 25.20 kW for two stages: a further saving of about **5.1 per cent** of the two-stage figure.

The saving per stage shrinks as stages are added, while each stage adds an intercooler, piping, drains and cost. That is why two stages are common, three are reserved for higher pressures or larger machines, and the isothermal ideal is never reached.
