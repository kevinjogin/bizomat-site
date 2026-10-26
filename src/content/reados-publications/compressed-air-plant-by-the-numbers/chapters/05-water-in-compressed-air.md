---
book: compressed-air-plant-by-the-numbers
chapterSlug: water-in-compressed-air
order: 5
title: "Water in compressed air"
description: "Calculate the water CA-1 draws in, how much its aftercooler condenses, how weather changes the load, and how to drain and dispose of the oily condensate without wasting air."
draft: false
---

Every cubic metre of air a compressor takes in carries water vapour, and compression concentrates it. When CA-1 squeezes 6.0 m³/min of humid air into a little over 0.7 m³/min, the vapour that was comfortably invisible at atmospheric pressure is suddenly far more than the air can hold once it cools. It condenses: in the aftercooler, in the receiver, in the dryer, and, if they fail, in the pipes, valves and machines of the plant.

This chapter calculates the water that enters CA-1, how much the aftercooler removes, how much is left for the dryer, and how strongly the weather changes all three. It then covers the practical side: draining condensate without blowing compressed air away, and disposing of it properly, because condensate from an oil-injected compressor is oily wastewater. It closes with a drain that stuck.

## How much water the air carries

Air's capacity for water vapour depends on its temperature. At saturation, the vapour's partial pressure equals water's saturation pressure at that temperature, which this book takes from the IAPWS equation in the references. **Relative humidity** is the vapour's actual partial pressure as a fraction of that saturation pressure. The useful quantity for a mass balance is the **humidity ratio**, the mass of water per kilogram of dry air:

**ω = 0.622 × p_v ÷ (p − p_v)**

where p_v is the vapour's partial pressure, p the total pressure, and 0.622 the ratio of the molar masses of water and air.

This is an illustration. CA-1's intake air is at 25 °C, 101.3 kPa and 60 per cent relative humidity. Water's saturation pressure at 25 °C is about 3.17 kPa, so p_v is about 1.90 kPa and:

**ω = 0.622 × 1.90 ÷ (101.3 − 1.90) ≈ 0.0119 kg of water per kg of dry air**

With 0.1162 kg/s of dry air, CA-1 draws in about **4.98 kg of water an hour** at full load.

## What compression does to the vapour

Compression raises the vapour's partial pressure along with the air's, in the same proportion, while the humidity ratio stays the same. Air at 851.3 kPa absolute can hold, at saturation, a humidity ratio of only:

**ω_sat = 0.622 × p_sat(T) ÷ (851.3 − p_sat(T))**

At 35 °C, the aftercooler's outlet temperature, that is about 0.00414 kg/kg, roughly a third of the 0.0119 kg/kg the air brought in. Everything above that must condense.

```figure
type: stack
title: CA-1's 4.98 kg/h of water at full load, by where it leaves
unit: kg/h
caption: This is an illustration: intake 25 °C and 60 per cent humidity, aftercooler outlet 35 °C, refrigerated dryer at a 3 °C pressure dew point, line pressure 851.3 kPa absolute. Saturation pressures from the IAPWS equations.
- * Condensed in the aftercooler and separator | 3.24
- Condensed in the refrigerated dryer | 1.5
- Left in the air as vapour, below the dew point | 0.23
```

About two thirds of the water drops out in the aftercooler. The refrigerated dryer, cooling the air further to 3 °C, takes out most of the rest. About 0.23 kg/h stays in the air as vapour, but the air is now far from saturation at any temperature above 3 °C, so it will not condense in the plant. Chapter 6 covers the dryer and what "pressure dew point" means.

## Saturated, not wet

Air leaving the aftercooler at 35 °C is saturated: its relative humidity is 100 per cent at that temperature and pressure. That does not mean it contains liquid water, if the separator has done its job; it means it holds as much vapour as it can at 35 °C. Any further cooling, by even a degree, condenses more. That is the condition of air leaving many small compressors that have no dryer, and the reason their mains run wet: the pipes are almost always cooler than 35 °C, especially at night and in winter, so water condenses inside them along their whole length.

The same reasoning shows why a refrigerated dryer is described by the temperature it cools the air to. After the dryer, air at 851.3 kPa absolute is saturated at 3 °C. Warmed back to the room's temperature as it travels through the main, it is far from saturation, so it can cool to just above 3 °C anywhere in the plant without condensing. Chapter 6 develops that idea as the pressure dew point.

## What compression does in one sentence

Compression does not add water; it squeezes the water already in the air into a smaller volume, and the smaller volume at the same temperature can hold less. The humidity ratio is unchanged from intake to aftercooler inlet; what changes is the air's capacity. Every calculation in this chapter follows from that single fact and from the saturation pressure of water at the temperature the air is cooled to.

## A year of condensate

This is an illustration. At CA-1's average 70 per cent load, the aftercooler condenses about 2.27 kg/h, about 54.5 litres a day on continuous running. Over 6,000 hours a year that is about 13.6 kL from the aftercooler alone, and about 19.9 kL including the dryer. That is a lot of water to drain reliably, every few minutes, from equipment at 750 kPa gauge. It is also a volume that has to go somewhere acceptable: twenty kilolitres of oily water a year is a trade waste matter, not a puddle on the compressor room floor.


## The weather sets the load

The water load changes enormously with the weather, because the humidity ratio of the intake air does.

```figure
type: compare
title: CA-1's water at full load under different intake conditions
rowhead: Intake air
cols: Humidity ratio | Water in | Condensed in the aftercooler | Left for the dryer
caption: This is an illustration with the aftercooler outlet held at 35 °C and line pressure at 851.3 kPa absolute. In practice the aftercooler outlet rises on hot days, leaving more for the dryer.
- 15 °C, 50 per cent | 0.0053 kg/kg | 2.31 kg/h | 0.50 kg/h | 1.81 kg/h
- * 25 °C, 60 per cent | 0.0119 kg/kg | 4.98 kg/h | 3.24 kg/h | 1.73 kg/h
- 35 °C, 50 per cent | 0.0178 kg/kg | 7.12 kg/h | 5.46 kg/h | 1.66 kg/h
- 30 °C, 80 per cent | 0.0216 kg/kg | 8.74 kg/h | 7.07 kg/h | 1.68 kg/h
```

A humid summer day brings in nearly four times the water of a cool, dry day. With the aftercooler outlet held at 35 °C, the extra water all drops out in the aftercooler, and the dryer's load hardly changes. That assumption is the weak point. On a hot day the aftercooler's outlet temperature rises with the room, and every extra degree there leaves more vapour for the dryer, as Chapter 3 showed. Humid, hot weather is when dryers fall behind and water appears in the plant, and it is the condition compressor rooms should be designed for.

## Why water matters to the plant

Liquid water in compressed air does damage in many ways at once. It washes lubricant out of cylinders, valves and air tools, shortening their lives. It corrodes steel pipework from the inside, and the rust it produces then travels with the air into valves and fine orifices. Outdoors and in cold rooms it can freeze in lines and valves. It spoils paint finishes, contaminates products that air blows onto or into, and upsets instruments that use air as a signal or a purge. Each of these costs more than the drying needed to prevent it, which is why dry air is the norm rather than a luxury for most factories.

## The receiver and the main

The receiver downstream of the aftercooler, on CA-1's layout, acts as a second, slower aftercooler. Air entering it at 35 °C cools further on the receiver's walls, especially in winter, and drops more condensate, which collects at the bottom and needs its own drain. A receiver without a working drain slowly fills with water, losing storage volume and corroding from the inside, which is a concern for a pressure vessel as well as for air quality.

Downstream of the dryer, the main should carry dry air and need little draining. In practice, mains are laid to fall gently in the direction of flow, branches are taken from the top of the main so they draw air rather than any water running along the bottom, and drop legs with drains are fitted at low points and at the ends of runs. Those features cost little at installation and protect the plant on the day a dryer or drain fails. Chapter 9 sets out main layout in more detail.

## Measuring the condensate

Condensate volume is one of the simplest checks of a compressed air system. Collecting a drain's discharge in a bucket for an hour, or fitting a small meter to the oil-water separator's outlet, and comparing the result with the calculation in this chapter shows whether the drains are working and whether the aftercooler is cooling as it should. Much less condensate than expected, on a humid day, means water is going somewhere it should not: past a stuck drain, through the dryer or into the main.

## Draining without wasting air

Condensate collects in the aftercooler's separator, the receiver, the dryer, filters and drop legs in the main, and each collection point needs a drain. Drains come in three broad kinds:

```figure
type: compare
title: Condensate drain types
rowhead: Type
cols: How it works | Air lost | Watch for
caption: General characteristics. The choice affects reliability and energy; zero-loss drains cost more and usually pay back on any drain that discharges regularly.
- Manual valve | opened by hand | whatever is blown out while open | forgotten, or left cracked open permanently
- Timer solenoid | opens for a set time at set intervals | air blows through every time it opens with no water present | settings rarely match the actual water load
- * Level-sensing, zero-loss | opens only when condensate is present and closes before air escapes | essentially none | needs power, strainers and occasional service; most have a fault alarm
- Float drain | a float opens the valve as water rises | little | sticks with oily, dirty condensate
```

Timer drains are cheap and common, and their settings tend to grow over time: when water appears in the plant, someone lengthens the open time or shortens the interval. A timer drain with a 6 mm effective orifice at 750 kPa gauge passes air at about 1.7 m³/min of free air while it is open. Opening for 10 seconds every two minutes, it wastes on average about 0.14 m³/min, about 1 kW of compressor input. If it runs around the clock, as timer drains often do, that is about A$2,100 a year at the case's prices, from one drain. A level-sensing drain on the same duty loses almost nothing.

## Condensate is wastewater

Condensate from an oil-injected compressor carries oil in fine droplets and emulsion, along with dust and anything else drawn in through the intake. It must not go to stormwater, and discharging it to sewer is usually governed by the site's trade waste agreement, which normally sets limits on oil content.

Oil-water separators, designed for compressor condensate, pass it through settling chambers and adsorbent media and discharge water with a much lower oil content, while retaining the oil for disposal. Their media must be changed at intervals set by the maker and the condensate volume, and the discharge should be checked against the trade waste limits. Condensate from oil-free compressors has little oil but can be acidic, because it absorbs gases from the intake air, and may still need treatment. The local water authority, under its trade waste requirements, is the authority to consult.

## Drains are maintenance items

Every drain in a compressor room handles dirty, oily water under pressure, and every one will eventually block, stick or fail. Level-sensing drains need their strainers cleaned and their service kits replaced at the intervals their makers set. Float drains need cleaning more often on oily duty. Manual drains need someone to open them, which in practice means they are either forgotten or left cracked open. A weekly walk past every drain, seeing or hearing each discharge and checking any alarm lights, takes a few minutes and catches most failures before the plant does. CA-1's drain list, with each drain's location, type and service date, sits beside the compressor's maintenance schedule.

## A failure case: the stuck separator drain

This is an illustration. One humid summer week, CA-1's plant started finding water in its air: wet blow-off nozzles, a cylinder that sprayed water when it exhausted, and a product reject rate that climbed on a line using air to dry packages. The dryer's pressure dew point display was reading well above its normal 3 °C.

The dryer was the obvious suspect, and a refrigeration contractor was called. Before they arrived, an engineer checked the condensate path from the compressor and found the float drain on the aftercooler's separator stuck shut, jammed by oily sludge. The water that should have left at the separator, about 7 kg/h on those humid days, was passing straight into the dryer as liquid. A refrigerated dryer is designed to condense vapour, not to cope with slugs of liquid water; it was overwhelmed, and the excess water went to the plant.

The correction was to clean and replace the drain with a level-sensing zero-loss drain with a fault alarm, to drain and dry the main's low points, and to add the drains to a weekly check: each drain is seen to discharge, and any alarm is investigated the same day. The dryer itself was fine. The lesson from the calculation above is that the aftercooler separator handles most of the water, so its drain is the most important one in the room.

## Exercise: a humid day

On a 30 °C, 80 per cent humidity day, CA-1 runs at its average 70 per cent load. Using the table above, how much condensate does its aftercooler produce per hour, and per eight-hour shift?

**Answer.** At full load the aftercooler condenses about 7.07 kg/h on such a day; at 70 per cent load, about 0.7 × 7.07 ≈ **4.95 kg/h**, nearly 5 litres an hour. Over an eight-hour shift that is about **40 litres**, a little over twice the roughly 18 litres of a 25 °C, 60 per cent shift. Drains, separators and oil-water separators should be sized for the humid case, not the average. On a coastal site, where humid days are common through summer, the humid case is closer to the typical day than the exception.

