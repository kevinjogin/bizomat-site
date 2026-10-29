---
book: psychrometrics-by-the-numbers
chapterSlug: room-loads-and-the-supply-air-state
order: 4
title: "Room loads and the supply air state"
description: "How a room's sensible and latent loads fix the temperature and moisture of the air supplied to it, why the airflow is set by the sensible load, and the errors of fan heat and volume at the wrong state."
draft: true
---

An air-handling unit exists to deliver air in a particular state, and that state is not chosen; it is calculated. The room gains heat and moisture from people, machines, lights, sun and leaking outdoor air. The supply air must arrive cool enough and dry enough to absorb exactly those gains and leave at the room's design state. Two balances, one for heat and one for water, give the supply temperature and the supply humidity ratio for any airflow, and every component upstream, the mixing box, the coils, the humidifier and the fan, is then sized to produce that state.

This chapter sets up the two balances for the press hall in summer and winter, shows why the airflow is fixed by the sensible load and how the latent load then fixes the supply's water content, connects the result to the room ratio line of Chapter 2, and ends with an error that left the hall 1.6 K too warm: the heat of the supply fan, forgotten in the coil selection.

## Sensible and latent loads

A room's **sensible load** is the heat that raises its air temperature: heat from machine motors and drives, lights, people's bodies, conduction through walls and roof, sun through windows and the warmth of outdoor air that leaks in. Its **latent load** is the water added to the air, expressed as the heat that would be needed to condense it: moisture from people's breath and skin, from wet processes, open water and leaking humid air.

The distinction matters because the two are removed differently. Sensible heat is absorbed by supplying air cooler than the room. Latent load is absorbed only by supplying air drier than the room, and making air drier in a cooling coil means cooling it to below its dew point. A room with a large latent load needs a cold coil even if its sensible load is small.

This is an illustration. The press hall's summer loads on the humid design day were estimated, with assumed figures, as follows. A real estimate would use the presses' measured electrical input, the lighting design, the occupancy, a fabric and solar calculation for the building and published load data for people at light work.

```figure
type: stack
title: The press hall's summer sensible load
unit: kW
caption: This is an illustration. The split is assumed for the running case; the total, 80 kW, is the figure used throughout the book. Almost all electrical power used in the hall ends up as sensible heat in the hall, so the presses dominate.
- Presses, drives and drying units | 52
- Lighting | 10
- People at light work | 4
- Walls, roof and sun | 14
```

The latent load is 9 kW, from people and from humid outdoor air leaking in through dock doors. Divided by the latent heat of about 2,449 kJ/kg, that is 9 ÷ 2,449 = 0.00368 kg/s, or **13.2 kg of water an hour**, that the supply air must absorb. The room's sensible heat ratio is 80 ÷ 89 = **0.899**: nine-tenths of the load is heat.

### Leaking outdoor air is mostly latent load

Outdoor air that enters a room other than through the air-handling unit, through dock doors, gaps and openings, brings its heat and water straight into the room's loads. On a humid day most of what it brings is water. This is an illustration. Suppose that, averaged over a shift, 0.2 m³/s of outdoor air at 29 °C and 70% leaks in through the dock doors while trucks are loaded. That is 0.2 ÷ 0.8802 = 0.227 kg/s of dry air carrying 17.714 − 8.225 = 9.489 g/kg more water than the room air it displaces: 7.8 kg/h of water, a latent load of 0.227 × 9.489 × 2.449 = **5.3 kW**. Its sensible load, from the 7 K temperature difference, is only 0.227 × 1.02 × 7 = 1.6 kW.

So a modest leak supplies more than half of the hall's 9 kW latent load. This is why the hall is held slightly above atmospheric pressure, with 3.0 m³/s of outdoor air supplied against 2.6 m³/s extracted by the presses: the surplus leaks outwards through gaps instead of humid air leaking in. It is also why a dock door left open on a humid day shows up first as a rise in humidity rather than temperature.

## The two balances

For steady conditions, the supply air leaves the room at the room state. The sensible heat it picks up equals the sensible load, and the water it picks up equals the latent load.

```figure
type: formula
title: Supply state from the room loads
formula: t_s = t_r − Q_s ÷ (ṁ_a × c_pa)
formula: ω_s = ω_r − Q_L ÷ (ṁ_a × h_fg)
caption: This is an illustration for the humid design day. ṁ_a is the dry-air mass flow, c_pa the specific heat of the moist air per kilogram of dry air, 1.005 + 1.82 ω_r, and h_fg the latent heat, taken as 2500.9 + 1.82 t_r − 4.18 t_r = 2,449.0 kJ/kg at 22 °C.
- t_r, ω_r | room state, 22 °C and 8.225 g/kg dry air
- Q_s, Q_L | sensible and latent loads, 80 kW and 9 kW
- ṁ_a | 9.311 kg/s of dry air, from the mixing box flows in Chapter 5
step: c_pa = 1.005 + 1.82 × 0.008225 = 1.0200 kJ/kg·K, so ṁ_a × c_pa = 9.497 kW/K
step: t_s = 22 − 80 ÷ 9.497 = 13.58 °C
step: ω_s = 8.225 − 9 ÷ (9.311 × 2,449.0) × 1,000 = 8.225 − 0.395 = 7.830 g/kg dry air
step: Supply dew point 10.38 °C; relative humidity at 13.58 °C, 81%
```

The point (13.58 °C, 7.830 g/kg) lies on the room ratio line of Chapter 2, and it must: the two balances and the line are the same statement. Any other supply point with the same airflow would leave the room at a different state.

## Why the airflow is set by the sensible load

The sensible balance links three numbers: the load, the airflow and the temperature difference between room and supply. The load is given. The designer chooses one of the other two, and the third follows.

The temperature difference has practical limits. Supply air much colder than the room causes draughts and cold spots near diffusers, and it needs a colder coil, which costs more to run. Supply air only slightly cooler than the room needs a very large airflow, with large ducts and a large fan. For the press hall the designer chose a mixed airflow of 8.0 m³/s, which gave 9.311 kg/s of dry air on the humid day and a difference of 8.42 K. Halving the airflow would double the difference and need supply air at 5.2 °C, colder than the coil could produce, while doubling it would double the fan and duct sizes for a difference of only 4.2 K.

The latent balance has no such freedom. Once the airflow is fixed by the sensible load, the supply humidity ratio follows, and the coil must make air that dry. For the hall the supply must be 0.395 g/kg drier than the room. That sounds small, but at 13.58 °C it is 81% relative humidity, drier than a cooling coil produces directly, which is why Chapter 2's chart showed the coil leaving at 11.0 °C and the air being reheated.

```figure
type: compare
title: Supply states for three operating conditions
cols: Dry air, kg/s | Supply temperature | Supply humidity ratio | What it asks of the plant
rowhead: Condition
caption: This is an illustration. Winter supply is below the room temperature because the presses still produce a 25 kW sensible surplus after fabric losses. With the presses stopped in summer, the same airflow must be supplied much warmer, which a cooling coil working for dehumidification can only provide by reheat.
- * Humid summer day, 80 kW sensible, 9 kW latent | 9.311 | 13.58 °C | 7.830 g/kg | cool, dehumidify, then reheat 1.0 K
- Summer, presses stopped, 30 kW sensible, 9 kW latent | 9.311 | 18.84 °C | 7.830 g/kg | dehumidify, then reheat by about 6 K
- Winter, 25 kW sensible surplus, 4 kW latent | 9.684 | 19.47 °C | 8.056 g/kg | heat and humidify the mixed air
```

### Winter

This is an illustration. In winter the presses still produce 60 kW of heat, while the building loses 35 kW through its fabric and leaks, so the hall has a 25 kW sensible surplus and the supply air must still be cooler than the room. With 9.684 kg/s of dry air, denser winter air through the same 8.0 m³/s, the supply temperature is 22 − 25 ÷ (9.684 × 1.0200) = **19.47 °C**. The latent gain of 4 kW from people means the supply must be 4 ÷ (9.684 × 2,449.0) × 1,000 = 0.169 g/kg drier than the room, **8.056 g/kg**. Because the mixed air in winter holds only 6.698 g/kg, reaching 8.056 g/kg means adding water, not removing it. Chapter 6 sizes the humidifier for it.

On a winter weekend with the presses stopped, the 35 kW of losses would need supply air at 22 + 35 ÷ 9.877 = 25.5 °C. A hall that swings between surplus and deficit needs a heating coil sized for the deficit and controls that move smoothly between heating and cooling without running both.

## Volume, mass and where the air is measured

The balances use the mass of dry air, but the air is specified, measured and balanced as a volume, and the volume of a given mass depends on its state. This is an illustration. The hall's 9.311 kg/s of dry air occupies 8.0 m³/s in the mixing box at 24.59 °C on the humid day, 7.89 m³/s at the room state, and 7.66 m³/s at the supply state of 13.58 °C, where its specific volume is 0.8223 m³/kg. The same air, all of it, measures 4% less at the diffusers than in the mixing box.

That difference is enough to cause arguments at commissioning. A balancing contractor who measures 7.66 m³/s at the diffusers against a design of 8.0 m³/s may report a 4% shortfall that does not exist. The design airflow should therefore always be stated with the point and state at which it applies, or as a mass flow of dry air, and measured air volumes should be corrected to that state before they are compared.

A common shortcut makes a related error. Taking the air as 1.2 kg/m³ and the specific heat as 1.02 kJ/kg·K is reasonable for rough sizing, but it is not a property of the air at any particular state. Applied to 8.0 m³/s it gives 9.6 kg/s and a supply temperature of 13.83 °C, a quarter of a kelvin warmer than the correct 13.58 °C. In a hall held to ± 2 °C that is tolerable; in a laboratory held to ± 0.5 °C it is not.

## The latent load decides the humidity, not the temperature

The room's temperature depends on the sensible balance, its humidity on the latent balance, and the two can drift independently. This is an illustration. With the coil delivering 7.751 g/kg rather than the minimum 7.830, the hall on the humid design day settles at 7.751 + 0.395 = 8.146 g/kg, or **49.5%** at 22 °C. If a dock door is left open in humid weather and the latent load doubles to 18 kW, the hall's humidity ratio rises to 8.540 g/kg, **51.9%**, while its temperature need not change at all. A thermostat cannot see this. Only a humidity sensor, placed as Chapter 3 described, can, and only a coil cold enough to dry the air can correct it.

## The error: the forgotten fan

This is an illustration. The first coil selection for the hall, made by a supplier from the design brief, set the coil's leaving temperature to the supply temperature from the balance, 13.58 °C, and selected the coil to deliver it. The air-handling unit, however, has a draw-through supply fan after the coil. The fan's absorbed power, 15 kW, all ends up as heat in the air: as friction in the motor, drive and impeller, and as the work done on the air, which turns into heat in the ducts and diffusers. That heat raises the air temperature by 15 ÷ 9.497 = **1.58 K**.

The engineer checked the selection by following the air from the coil to the room. Air leaving the coil at 13.58 °C would reach the hall at 15.16 °C. At that supply temperature the air could absorb only 9.497 × (22 − 15.16) = 65.0 kW, not 80 kW. The hall would have warmed until the air could carry the load away: 15.16 + 80 ÷ 9.497 = **23.58 °C**, inside the printer's band but only just, with no margin for a hot afternoon or a dirty coil. Its relative humidity, at the same water content, would have fallen to about 45%, at the bottom of the band.

```figure
type: bars
title: Hall temperature on the humid design day with and without the fan heat allowed for
unit: °C
max: 26
caption: This is an illustration. The coil selected without allowing for the fan leaves the hall 1.58 K warm; with the coil leaving at 11.0 °C and 1.0 K of reheat, as Chapter 2 plotted, the supply arrives at 13.58 °C.
- Coil leaving 13.58 °C, fan heat forgotten | 23.58
- * Coil leaving 11.0 °C, fan heat 1.58 K, reheat 1.0 K | 22.0
- Printer's upper limit | 24.0
```

The selection was revised so that the coil's leaving state allowed for the fan: the air leaves the coil at 11.0 °C, which also gives the dehumidification the latent balance needs, picks up 1.58 K in the fan and 1.0 K in a reheat coil, and arrives at 13.58 °C. The brief now states the supply state at the diffusers and the fan position, and asks every supplier to show the temperature rise across the fan in their selection.

Fan heat also matters in the other direction. In a blow-through unit, with the fan before the coil, the fan's heat is added to the air the coil must cool, so it becomes part of the coil load instead of part of the supply temperature. Either way it has to be counted once, in the right place.

## How this applies to a small Australian business

A small business buying air conditioning or ventilation for a process area will be quoted equipment by its capacity in kilowatts. Capacity alone does not show whether the equipment can hold a humidity. Ask for the room's sensible and latent loads, the design airflow with the state it applies to, and the supply temperature and humidity the equipment will deliver at the design condition, including fan heat. If the latent load is significant, as it is wherever people work in numbers, outdoor air is high or a wet process runs, check that the quoted unit's sensible heat ratio at the design condition is low enough to remove it. A unit with a high sensible heat ratio will hold the temperature and let the humidity drift.

## Exercise: a crowded open day

On an open day, 80 visitors are in the hall as well as the usual staff, and the presses are running. Assume the visitors add 6 kW of sensible heat and 5 kW of latent load, so that the loads become 86 kW sensible and 14 kW latent. The air-handling unit is unchanged: 9.311 kg/s of dry air supplied at 13.58 °C and 7.751 g/kg. Find the hall's temperature and relative humidity.

**Worked answer.** This is an illustration. The hall's temperature rises until the supply air can absorb 86 kW: 13.58 + 86 ÷ 9.497 = **22.64 °C**. (The specific heat changes slightly with the hall's water content; the effect is under 0.01 K.) The hall's humidity ratio is 7.751 + 14 ÷ (9.311 × 2,449.0) × 1,000 = 7.751 + 0.614 = **8.365 g/kg**. At 22.64 °C that is a relative humidity of about **49%**. Both stay inside the printer's band, but the temperature has used a third of its upper margin and the humidity has risen by 0.22 g/kg of water: an open day is close to the limit of what the unit can do without a colder coil.
