---
book: process-chillers-by-the-numbers
chapterSlug: temperature-lift-and-approach
order: 7
title: "Temperature lift and approach"
description: "How evaporating and condensing temperatures drive capacity, power and COP, approach temperatures, setpoints and head pressure, and a dirty condenser coil."
draft: false
---

Chapter 1 showed that the second law's limit on a refrigerator falls as the temperature lift rises. Real chillers follow the same rule, and more steeply. Every kelvin added to the condensing temperature, or taken from the evaporating temperature, costs capacity and power at the same time, and the effect is large enough that a chiller's running cost depends as much on how it is installed, maintained and set as on the machine itself. This is the chapter where the arithmetic of the earlier ones turns into money.

This chapter works CH-30's cycle at condensing temperatures from 35 to 55 °C and evaporating temperatures from −2 to 6 °C with NIST's data, shows what happens to capacity and power, explains approach temperatures and what sets them, looks at raising the water setpoint and letting the head pressure float, and ends with a condenser whose dirt cost a fifth of CH-30's efficiency.

## Condensing temperature

This is an illustration. Holding CH-30's evaporating temperature at 2 °C, with 5 K of superheat and subcooling and an isentropic efficiency of 0.70, and changing only the condensing temperature, NIST's data give:

- **35 °C**: refrigerating effect 162.55 kJ/kg, COP **5.14**, compressor power for 30 kW **5.83 kW**, discharge 52.6 °C;
- **40 °C**: 155.27 kJ/kg, COP **4.34**, **6.92 kW**, 58.9 °C;
- **45 °C**, the design: 147.86 kJ/kg, COP **3.71**, **8.09 kW**, 65.1 °C;
- **50 °C**: 140.33 kJ/kg, COP **3.21**, **9.36 kW**, 71.2 °C;
- **55 °C**: 132.65 kJ/kg, COP **2.79**, **10.75 kW**, 77.2 °C.

Two effects combine. The compressor's work per kilogram rises, because it must raise the pressure further, from 31.60 kJ/kg at 35 °C to 47.55 at 55 °C. And the refrigerating effect per kilogram falls, because the liquid reaches the expansion valve warmer and more of it flashes (Chapter 5). Around the design point, each kelvin of condensing temperature costs about **2.7%** of the COP.

```figure
type: line
title: CH-30's COP against condensing temperature
x: Condensing temperature, °C
y: COP
ymin: 0
ymax: 6
mark: 45 | Design
caption: This is an illustration from NIST R-134a data with 2 °C evaporating, 5 K superheat and subcooling, and an isentropic efficiency of 0.70. Each kelvin near the design point costs about 2.7%.
- 35 | 5.14
- 40 | 4.34
- 45 | 3.71
- 50 | 3.21
- 55 | 2.79
```

## Capacity at a fixed compressor

The figures above are for 30 kW of cooling at each condition. A real chiller has a fixed compressor, which moves a fixed volume of suction vapour each second, and its capacity changes with conditions instead.

With the evaporating conditions unchanged, the suction vapour's density is unchanged, so the compressor moves the same mass of refrigerant, 0.2029 kg/s, at every condensing temperature, if its volumetric efficiency stays about the same. Its capacity is that mass flow times the refrigerating effect:

- at 35 °C condensing: **33.0 kW**;
- at 45 °C: **30.0 kW**;
- at 55 °C: **26.9 kW**.

Real compressors lose a little volumetric efficiency as the ratio rises, which makes the fall slightly steeper. On a hot day, therefore, CH-30 has less capacity and needs more power per kilowatt of cooling, at exactly the time the process load is highest. That is why chillers are rated at a stated ambient temperature, and why a chiller sized for 30 kW at 35 °C may fall short at 40 °C.

```figure
type: compare
title: CH-30 at different condensing temperatures, 2 °C evaporating
rowhead: Condensing
cols: Pressure, MPa | Flash gas | Work, kJ/kg | COP | Capacity at fixed compressor, kW | Discharge, °C
caption: This is an illustration from NIST R-134a data. Capacity assumes the compressor's mass flow stays at 0.2029 kg/s.
- 35 °C | 0.887 | 19.8% | 31.60 | 5.14 | 33.0 | 52.6
- 40 °C | 1.017 | 23.5% | 35.80 | 4.34 | 31.5 | 58.9
- * 45 °C | 1.160 | 27.3% | 39.86 | 3.71 | 30.0 | 65.1
- 50 °C | 1.318 | 31.1% | 43.77 | 3.21 | 28.5 | 71.2
- 55 °C | 1.492 | 35.0% | 47.55 | 2.79 | 26.9 | 77.2
```

## Evaporating temperature

The evaporating side matters as much. Holding the condensing temperature at 45 °C:

- at **−2 °C** evaporating: COP **3.28**; compressor power for 30 kW **9.14 kW**;
- at **2 °C**, the design: COP **3.71**; **8.09 kW**;
- at **6 °C**: COP **4.23**; **7.10 kW**.

At a fixed compressor, the evaporating temperature changes the capacity more strongly than the condensing temperature does, because it changes the density of the suction vapour: colder vapour at a lower pressure is less dense, so the compressor moves fewer kilograms each second. CH-30's compressor, sized for about 48.5 m³/h of suction vapour, would give about **25.7 kW** at −2 °C evaporating and about **35.0 kW** at 6 °C. Around the design point, each kelvin of evaporating temperature is worth about **3.5%** of the COP and more than that in capacity.

```figure
type: bars
title: CH-30's capacity at a fixed compressor by evaporating temperature, 45 °C condensing
unit: kW
max: 40
caption: This is an illustration: the compressor's suction volume of about 48.5 m³/h held constant. Colder suction vapour is less dense, so fewer kilograms are pumped each second.
- −2 °C evaporating | 25.7
- * 2 °C, design | 30.0
- 6 °C evaporating | 35.0
```

## Approach temperatures

The refrigerant's temperatures are not chosen directly. They settle where the heat exchangers can pass the heat:

- the **evaporator approach** is the difference between the leaving water and the evaporating temperature: CH-30's design is 12 − 2 = **10 K**;
- the **condenser approach** is the difference between the condensing temperature and the entering air: 45 − 35 = **10 K**.

An approach is the temperature difference a heat exchanger needs to pass its duty. It is set by the exchanger's surface area, its cleanliness, the flows of water and air across it, and the duty itself: a larger exchanger, or the same one at part load, needs a smaller approach. The Library’s Heat Transfer by the Numbers deals with that heat flow in detail. For the cycle, what matters is the result: any fault that reduces an exchanger's effectiveness raises its approach, and the lift rises with it.

The design approaches of 10 K are an illustration of a typical compromise between the price of larger exchangers and the energy cost of a larger lift. A chiller with larger exchangers, and approaches of 5 K on each side, would evaporate at 7 °C and condense at 40 °C, a lift of 33 K instead of 43 K, with a COP well above CH-30's.

## Setpoints and head pressure

Two settings that operators control change the lift directly.

- **Chilled water setpoint.** CH-30 supplies water at 12 °C because the moulds need it. If a process could accept 14 °C, the evaporating temperature would rise by about 2 K, worth roughly 7% of the COP and more in capacity. Setpoints are often set colder than the process needs, out of caution or habit, and every kelvin costs.
- **Head pressure.** On a cool day, with air at 15 °C, CH-30's condenser could condense at about 25 °C, with a COP far above its design figure. Many chillers hold their condensing pressure up artificially, by slowing their fans, because a thermostatic expansion valve needs a minimum pressure difference to feed the evaporator properly. Letting the head pressure **float** down with the ambient, as far as the expansion valve and compressor allow, is one of the largest savings available in a temperate climate. Electronic expansion valves (Chapter 5) make it easier.

## Part load lowers the lift

A heat exchanger's approach depends on its duty. At half load, the same evaporator and condenser carry half the heat through the same surface, and need roughly half the temperature difference to do it. A chiller at part load therefore runs at a smaller lift than at full load, and its COP rises, provided its compressor can follow the load efficiently.

This is an illustration. If CH-30 ran continuously at half load with a variable-speed compressor, its approaches might fall from 10 K to about 5 K on each side, evaporating near 7 °C and condensing near 40 °C on a 35 °C day, a lift of 33 K instead of 43 K. Chapter 1's sensitivity of about 2.3% per kelvin of lift suggests a COP roughly a fifth higher than at full load, before allowing for the compressor's own efficiency at reduced speed. A fixed-speed compressor cycling on and off does not get this benefit, because while it runs it runs at full flow, at full-load approaches. That is the main thermodynamic argument for variable-speed compressors in chillers that spend most of their lives at part load, and Chapter 8 puts a price on it.

## Mild weather is most of the year

A chiller's design point is its worst case. Through most of the year, in most Australian climates, the air entering its condenser is well below the 35 °C design figure, and the condensing temperature, if the controls let it float, is correspondingly lower.

This is an illustration, not climate data. Suppose CH-30's plant room intake sees air below 20 °C for 40% of its operating hours, between 20 and 30 °C for 45%, and above 30 °C for 15%. With a floating head pressure and the same 10 K approach, the chiller condenses at about 25 to 30 °C for a large part of the year, where its COP is well above 5, and only at the design point during the hottest hours. Its average COP over the year is then considerably higher than the 3.71 of its design point. Seasonal efficiency figures, calculated over a defined climate and load profile, capture this, and they are a better guide to running cost than the design-point COP, as long as the climate and profile assumed resemble the site's.

## Water-cooled and evaporative condensers

CH-30 rejects its heat to air, so its condensing temperature follows the dry-bulb temperature of the air. A **water-cooled** condenser rejects heat to water from a cooling tower, and a cooling tower cools water towards the air's **wet-bulb** temperature, which in most weather is several kelvin, and in dry weather many kelvin, below the dry-bulb. Water-cooled and **evaporative** condensers therefore condense at lower temperatures than air-cooled ones in the same weather, and their chillers run at smaller lifts and higher COPs.

The price is water consumption, water treatment and the management of the risks that come with cooling towers, in particular *Legionella* bacteria, which in Australia are controlled under state public health regulations and the AS/NZS 3666 series on air-handling and water systems of buildings. The Library’s chapter on [HVAC for commercial and industrial buildings](/reados/collections/fluids-hvac-and-building-services/hvac-for-commercial-and-industrial-buildings/) discusses cooling towers and their maintenance. A cooling tower's own fans and pumps, its water and its treatment chemicals all belong in the comparison with an air-cooled condenser, alongside the compressor energy saved, and the comparison is made over a year's weather, not at the design point alone. For a 30 kW process chiller, an air-cooled condenser is usually the simpler choice; for large plant, the energy saved by a lower condensing temperature often pays for the tower.

## The error: a dirty condenser

This is an illustration. Over a summer, CH-30's energy use crept up, and on the hottest afternoons its leaving water rose above 13 °C. The maintenance technician read the gauges: on a 35 °C afternoon the discharge pressure was **1.385 MPa** absolute, a condensing temperature of **52 °C**, an approach of 17 K against the design's 10 K.

The condenser coil was coated with dust and seed fluff from trees near the plant room's air intake. The dirt insulated the coil and blocked the airflow, so the condenser needed a larger temperature difference to reject its heat. Working the cycle at 52 °C condensing from NIST's data:

- COP **3.03**, against 3.71: **18% worse**;
- compressor power for 30 kW **9.90 kW**, against 8.09: **22% more**;
- capacity at the fixed compressor about **27.9 kW**, which explained the warm water on hot afternoons.

The coil was cleaned with the method its maker specifies, and the condensing temperature returned to 45 °C at 35 °C ambient. The cleaning took an hour; the dirt had been costing roughly a fifth of the chiller's electricity for every hot hour of the summer, a figure that Chapter 8's tariff turns into a case for regular cleaning that no one needed to argue for again. The shop added a coil inspection to its monthly checklist in summer, a mesh screen on the intake, and a simple test: if the condensing temperature, read from the discharge pressure, is more than about 12 K above the entering air at full load, the coil is checked before anything else.

```figure
type: checklist
title: Lift checks on a running chiller
caption: Approaches measure the heat exchangers; lift measures the cost. The last line is this chapter's error.
- Evaporator approach at full load | leaving water 12 °C, evaporating 2 °C: 10 K
- Condenser approach at full load | condensing 45 °C, air 35 °C: 10 K
- Chilled water setpoint no colder than the process needs | each kelvin about 3.5% of COP
- Head pressure allowed to float on cool days within the valve's limits | large savings in mild weather
- Coils clean and airflow unobstructed | inspected monthly in summer
- x Condenser coil left dirty | 52 °C condensing; COP down 18%, power up 22%
```

## Exercise: a warmer setpoint

The moulder's process engineers agree that two of the moulds could run with water at **14 °C**. Suppose CH-30's whole circuit moved to 14 °C supply and 19 °C return, so that its evaporating temperature rose to about 4 °C with the same 10 K approach. Estimate the change in COP using the sensitivity of about 3.5% per kelvin near the design point, and the compressor power for the same 30 kW load.

**Worked answer.**

- Evaporating temperature up 2 K: COP about 3.71 × (1 + 2 × 0.035) = **3.97**.
- Compressor power: 30 ÷ 3.97 = **7.56 kW**, against 8.09 kW, about **0.53 kW** less.

The linear estimate is close to the figures a full NIST calculation at 4 °C evaporating would give, since 2 K is a small step. At CH-30's typical load and operating hours, Chapter 8 turns half a kilowatt into dollars. A warmer setpoint also raises the chiller's capacity, which could help the new moulding cell of Chapter 2, provided the moulds that need 12 °C get it.
