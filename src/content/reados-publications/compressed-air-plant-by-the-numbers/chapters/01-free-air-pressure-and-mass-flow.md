---
book: compressed-air-plant-by-the-numbers
chapterSlug: free-air-pressure-and-mass-flow
order: 1
title: "Free air, pressure and mass flow"
description: "Work out what a cubic metre of compressed air means, convert free air delivery to mass and actual volume, state pressure ratios in absolute terms and meet the CA-1 compressor room."
draft: false
---

Compressed air is sold, specified and argued about in cubic metres, and a cubic metre of air can mean several quite different amounts of air. A compressor's rating, a flow meter's reading, a dryer's capacity and a cylinder's catalogue air use may all be in cubic metres and still disagree by a factor of seven or more. Before any calculation of power, heat or water, the quantity being compressed has to be pinned down.

This chapter does that. It explains the ideal gas law as it applies to compressor rooms, defines free air delivery, normal volume and actual volume, converts between them for the CA-1 case, and shows why every calculation in this book uses absolute pressure. It ends with the conversion error that most often turns a sound compressed air estimate into a wrong one.

## Air as an ideal gas

At the pressures and temperatures of factory compressed air, air behaves very nearly as an ideal gas. Its pressure p, volume V, mass m and absolute temperature T are linked by:

**p V = m R T**

where R, the specific gas constant for dry air, is about 287 J/kg·K. Pressure must be absolute, in pascals, and temperature absolute, in kelvin. The supplied DOE handbook develops this law from the older laws of Boyle and Charles: at constant temperature, pressure and volume vary inversely; at constant pressure, volume varies with absolute temperature.

The practical consequences for a compressor room are straightforward:

- **Doubling the absolute pressure halves the volume** of a given mass of air at the same temperature.
- **Heating air at constant pressure expands it** in proportion to its absolute temperature.
- **The mass of air in a given volume depends on both**, so a "cubic metre" means nothing until its pressure and temperature are stated.

## The CA-1 compressor room

This is an illustration. CA-1's compressor room holds one oil-injected rotary screw compressor with a 37 kW motor, rated at 6.0 m³/min of free air at 750 kPa gauge and drawing about 41 kW at full load. Air enters through a filter at the back of the package from the room, which is ventilated by a fan and louvres. The compressed air passes through the package's built-in aftercooler, which cools it to about 35 °C, then through a water separator and drain, a 3 m³ receiver, a refrigerated dryer, filters and an isolating valve to the main that runs to the plant.

The compressor runs on load and unload control between pressure limits around its 750 kPa gauge set point. The plant draws an average of 4.2 m³/min of free air, 70 per cent of the compressor's capacity, over 6,000 hours a year, with peaks close to full capacity when every line is running.

Each later chapter follows one part of that chain. Chapter 2 calculates the work of compression and Chapter 3 the discharge temperature. Chapter 4 follows the heat. Chapters 5 and 6 follow the water through the aftercooler and the dryer. Chapter 7 deals with the pressure set point and the waste it drives, Chapter 8 with the receiver and control, Chapter 9 with the main, and Chapter 10 brings the room together in an assessment.

## Gauge, absolute and the pressure ratio

Gauges on compressors and receivers read gauge pressure, the pressure above the local atmosphere. The gas law and every compression formula need absolute pressure:

**absolute pressure = gauge pressure + atmospheric pressure**

This is an illustration. CA-1 delivers air at 750 kPa gauge. At sea level, with atmospheric pressure of 101.325 kPa, that is 851.3 kPa absolute. The compressor raises the air's absolute pressure from 101.3 to 851.3 kPa, a **pressure ratio of about 8.40**, not 7.5. The work of compression, the discharge temperature and the water condensed all depend on that ratio, so getting it right matters from the first line.

## Free air delivery

A compressor's capacity is normally stated as **free air delivery** (FAD): the volume of air it delivers per minute, measured at the conditions at its intake, usually the ambient temperature and pressure where it stands. ISO 1217, named in the references, sets out how it is measured in acceptance tests. FAD answers the question "how much of the room's air does this machine take in and deliver?"

FAD is convenient because users' demands are also usually expressed in free air, and because it does not change with the delivery pressure. But it is a volume at intake conditions, so the mass it represents depends on the weather and the site's altitude.

## Converting the case's flow

This is an illustration. CA-1 delivers 6.0 m³/min of free air from an intake at 25 °C, 101.325 kPa and 60 per cent relative humidity.

```figure
type: compare
title: The same CA-1 flow expressed four ways
rowhead: Measure
cols: Value | Conditions
caption: This is an illustration from the ideal gas law. Free air and normal volume differ by about 10 per cent; free air and compressed volume differ by more than eight times.
- * Free air delivery | 6.0 m³/min | intake: 25 °C, 101.3 kPa, 60 per cent humidity
- Mass flow of dry air | about 0.116 kg/s, 418 kg/h | independent of conditions
- Normal volume, dry | about 5.39 Nm³/min | 0 °C, 101.325 kPa, dry
- Actual volume after the aftercooler | about 0.738 m³/min | 851.3 kPa absolute, 35 °C
```

The mass flow of dry air is the quantity that is conserved through the whole system. At the intake, the partial pressure of water vapour is 60 per cent of water's saturation pressure at 25 °C, about 0.6 × 3.17 = 1.90 kPa, so the dry air's partial pressure is about 99.42 kPa. The mass of dry air in 0.1 m³ per second is then 99,423 × 0.1 ÷ (287.05 × 298.15), about **0.1162 kg/s**.

**Normal volume** expresses the same mass at a reference state, here 0 °C and 101.325 kPa, dry: about 5.39 Nm³/min. Normal and standard volumes are used by gas suppliers and some flow meters, and their reference conditions vary, so the conditions should always be stated beside the number.

**Actual volume** is the volume the air occupies in the pipe. After the aftercooler, at 851.3 kPa absolute and 35 °C, the 6.0 m³/min of free air occupies about 6.0 × (101.3 ÷ 851.3) × (308.15 ÷ 298.15), roughly 0.738 m³/min. That is the volume a pipe must carry, and the basis for the velocities in Chapter 9.

## Weather and altitude

FAD is a volume at intake conditions, so the mass a compressor delivers falls when the intake air is hot or thin. On a hot day, intake air at 40 °C rather than 25 °C is about 5 per cent less dense, and the same FAD delivers about 5 per cent less mass. Ducting cool outside air to the intake, rather than drawing hot air from inside the compressor room, recovers part of that.

Altitude matters more. At a site about 900 m above sea level, standard atmospheric pressure is about 91.0 kPa. The same compressor, delivering the same FAD, delivers only about 90 per cent of the mass it would at sea level. Its pressure ratio to reach 750 kPa gauge rises to about 9.24, so it works harder for less air. Compressor data sheets give performance at stated reference conditions; a site well above sea level should check them against its own.

```figure
type: bars
title: Mass delivered by 6.0 m³/min of free air under different intake conditions
unit: per cent of the 25 °C sea-level mass
max: 110
caption: Ideal gas law, density proportional to absolute pressure over absolute temperature, humidity ignored for the comparison. The compressor's free air delivery is the same in every row.
- 15 °C intake, sea level | 103.5
- * 25 °C intake, sea level | 100
- 40 °C intake, sea level | 95.2
- 25 °C intake, about 900 m altitude | 89.8
```

## Units that turn up

Compressed air data arrives in a mixture of units, often from overseas equipment. Volume flow appears in litres per second, cubic metres per minute or hour, and cubic feet per minute, where 1 cfm is about 0.0283 m³/min, so CA-1's 6.0 m³/min is about 212 cfm. Imperial figures add "scfm" and "acfm" for standard and actual cubic feet per minute, each with its own reference conditions. Pressure appears in kilopascals, bar and pounds per square inch, with 1 bar equal to 100 kPa and 1 psi about 6.895 kPa, and with the same gauge and absolute distinction as everywhere else. The conversions are fixed; the danger is losing track of which reference a figure uses. A calculation sheet that writes the basis beside every number, "m³/min FAD", "Nm³/h", "kPa g", is far easier to check.

## Measuring flow on site

Flow meters on compressed air mains mostly use one of two principles. Thermal mass flow meters measure the cooling effect of the flowing air on a heated sensor, which depends on mass flow, and report it as a normal or standard volume at the reference conditions configured in the meter. Vortex and differential-pressure meters measure velocity or pressure drop and need the line pressure and temperature to convert to mass or free air. Either can be accurate; either can mislead if its reference conditions, pipe size or installation are wrong.

A compressor without a flow meter can still be measured. A fixed-speed compressor on load and unload control delivers roughly its rated free air delivery while loaded and nothing while unloaded, so its loaded hours, read from its controller, give the free air delivered over a period. That estimate assumes the compressor still delivers its rated FAD; a worn compressor, or one with a blocked intake filter, delivers less. Chapter 10 uses both methods in the assessment of CA-1.

## Demand that is not production

The air a plant uses is not all productive. A meter on the main sees everything: machines, blow-offs, open hoses, drain valves stuck open and leaks. A list of machines sees only what the machines were designed to use. On many sites the difference between the two is a fifth to a third of the total, and it is the cheapest air to eliminate, because nothing depends on it. CA-1's average demand of 4.2 m³/min includes such losses, which Chapter 7 estimates and prices.

## What users mean by air use

Users' air consumption comes from many sources: equipment makers' data, flow meters, cylinder calculations and old estimates. Each may use a different basis:

```figure
type: checklist
title: Questions to ask of any compressed air flow figure
caption: A flow figure without its basis cannot be added to others or compared with a compressor's free air delivery.
- Is it free air, normal volume or actual volume | free air is usual for compressors; normal for meters and gases; actual for pipes
- At what pressure and temperature | actual volumes need both to convert
- Is it an average or a peak | compressors and receivers are sized for different ones
- Is it per cycle, per minute or per hour | cylinder data is often per cycle
- ? Does it include leaks and blow-offs | a meter on the main sees them; a list of machines does not
```

The pneumatics side of this conversion, cylinder volumes, cycle rates and air use per stroke, is covered in the Library’s [Pneumatics by the Numbers](/reados/publications/pneumatics-by-the-numbers/), and the [pneumatic cylinder sizing tool](/tools/pneumatic-cylinder-sizing/) converts a cylinder's stroke volume to free air.

## A failure case: actual litres added as free air

This is an illustration. When CA-1's plant added a new packaging line, an engineer totalled the line's air use from the machine supplier's data sheets: 180 L/min for the cylinders and 260 L/min for the vacuum generators and blow-offs, a total of 440 L/min, about 0.44 m³/min. Against CA-1's spare capacity of about 1.8 m³/min, that looked comfortable.

The cylinder figure on the data sheet was stated as "air consumption at 600 kPa operating pressure". It was the actual volume of the cylinders' strokes, at 600 kPa gauge. Each litre of air at 600 kPa gauge contains about (600 + 101.3) ÷ 101.3, roughly 6.92 litres of free air. The cylinders' 180 L/min of actual volume was about 1.25 m³/min of free air. The blow-offs, quoted correctly in free air, added 0.26 m³/min, for a real total of about 1.5 m³/min: over 80 per cent of the spare capacity, not a quarter of it.

The error was detected at commissioning, when the plant's pressure began sagging during peak production and the compressor ran fully loaded for long periods. A check of the data sheet's footnote found the basis. The correction was a rule for the engineering office: every flow figure is converted to free air delivery at the site's intake conditions before it is added to anything, and its original basis is recorded beside it. The [compressed-air system sizing tool](/tools/compressed-air-system-sizing/) does the conversion for each user.

## Humidity and the mass balance

The air entering CA-1 carries water vapour: at 25 °C and 60 per cent relative humidity, about 0.0119 kg of water for each kilogram of dry air. Through the system, the dry air's mass is constant, but the water's is not, because aftercoolers and dryers condense it out. That is why this book works in dry-air mass flow, about 418 kg/h for CA-1, whenever water matters. Chapters 5 and 6 follow the water.

## Exercise: a site at altitude

CA-1's maker offers the same compressor for a site about 900 m above sea level, where atmospheric pressure is about 91.0 kPa. If it still delivers 6.0 m³/min of free air at 750 kPa gauge from the same 25 °C intake, what is its pressure ratio, and roughly what fraction of the sea-level mass flow does it deliver?

**Answer.** The delivery pressure is 750 + 91.0 = 841.0 kPa absolute, so the pressure ratio is 841.0 ÷ 91.0, about **9.24**, against 8.40 at sea level. The intake air's density is proportional to its absolute pressure at the same temperature, so the mass flow is about 91.0 ÷ 101.3, roughly **0.90 of the sea-level figure**. The compressor works against a higher ratio and delivers about a tenth less air by mass. Users who need a fixed mass of air, such as some process and combustion uses, need about 11 per cent more free air at that site to get the same.
