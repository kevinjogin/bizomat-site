---
book: humidity-control-by-the-numbers
chapterSlug: reheat-and-humidity-control
order: 8
title: "Reheat, overcooling and humidity control"
description: "Why a dehumidifying coil must over-cool and what the reheat costs at full and part load, how dew-point control sequences work, ways to recover reheat energy, and how a drifting sensor wastes both."
draft: false
---

A plant that controls humidity as well as temperature has to answer one question at every moment: which of the two is setting the cooling coil? When the room needs cooling more than drying, the coil follows temperature and the humidity looks after itself. When the room needs drying more than cooling, the coil must run colder than the temperature alone requires, and the air it delivers is then too cold for the room and has to be warmed again. That second warming is reheat. It is the price of holding humidity, and it is often the largest avoidable energy use in a humidity-controlled space.

This chapter works out why the running case's coil leaves at 11.0 °C, what the reheat is at full and part load, how a control sequence decides between temperature and humidity, and which ways of supplying reheat cost least. It ends with a humidity sensor that drifted and made the plant over-cool every day.

## Why the coil leaves at 11.0 °C

This is an illustration. Chapter 4 found that the hall needs supply air at 13.58 °C to remove 80 kW of sensible heat, and no wetter than 7.830 g/kg to remove 9 kW of latent heat. The two requirements set two different coil leaving temperatures.

- **For temperature alone**, the coil would leave at 13.58 − 1.58 = **12.0 °C**, since the supply fan adds 1.58 K after the coil.
- **For humidity**, the coil must leave the air at no more than 7.830 g/kg. Air leaving a wet coil is close to saturated; at 95% the warmest temperature that gives 7.830 g/kg is **11.15 °C**. The plant design takes **11.0 °C and 95%**, 7.751 g/kg, to leave a small margin for sensor error and uneven conditions across the coil face, as Chapter 7 explained.

Humidity wins by 1.0 K. The coil cools the air 1.0 K further than the room needs, and the reheat coil puts the 1.0 K back.

```figure
type: formula
title: Overcooling and reheat on the humid design day
formula: Q_reheat = ṁ_a × c_p,moist × (t_supply − t_coil − Δt_fan)
caption: This is an illustration. The moist-air specific heat is 1.005 + 1.82 × 0.008225 = 1.020 kJ/kg·K. The same 9.5 kW is paid twice: once as extra cooling at the coil and once as reheat.
- ṁ_a | dry-air mass flow, 9.311 kg/s
- t_supply | supply temperature the room needs, 13.58 °C
- t_coil | coil leaving temperature set by humidity, 11.0 °C
- Δt_fan | supply fan heat, 1.58 K
step: Q_reheat = 9.311 × 1.020 × (13.58 − 11.0 − 1.58) = 9.311 × 1.020 × 1.0 = 9.50 kW
step: Extra coil load from overcooling by the same 1.0 K: about 9.50 kW
```

At full load the penalty is modest: 9.5 kW of reheat and 9.5 kW of extra coil load, against a coil of 220.9 kW. The trouble is that the penalty grows as the room's sensible load falls.

## Reheat at part load

The hall's latent load comes mostly from people and from outdoor air leaking in, and it barely changes with production. Its sensible load comes mostly from the presses, and it changes a great deal. On a humid day with only some presses running, the coil still has to leave at 11.0 °C to dry the air, but the room now needs warmer supply air.

This is an illustration. Keeping the latent load at 9 kW, the supply air flow at 9.311 kg/s of dry air and the outdoor air at the humid design condition:

- Room sensible **80 kW**: supply 13.58 °C, reheat **9.50 kW**.
- Room sensible **60 kW**: supply 22 − 60 ÷ (9.311 × 1.020) = 15.68 °C, reheat 9.311 × 1.020 × (15.68 − 12.58) = **29.46 kW**.
- Room sensible **40 kW**: supply 17.79 °C, reheat **49.46 kW**.

```figure
type: bars
title: Reheat needed on a humid day as the presses' heat falls
unit: kW
max: 55
caption: This is an illustration at 29 °C and 70% outdoors, coil leaving 11.0 °C, fan heat 1.58 K. The coil load stays at 220.9 kW in every case, because the coil's entering and leaving states do not change; only the reheat grows.
- * Room sensible 80 kW, full production | 9.5
- Room sensible 60 kW | 29.5
- Room sensible 40 kW, light production | 49.5
```

At light production the plant spends 220.9 kW of cooling and 49.5 kW of heating to remove 40 kW of heat and 9 kW of moisture from the hall. That is the pattern to look for in any humidity-controlled space that runs at part load on humid days: the coil load does not fall with the room's sensible load, and the reheat rises to fill the gap.

## Control sequences

A control sequence turns this logic into valve positions. The details vary between plants and controls contractors, but a sound sequence for a hall like this follows a common pattern.

```figure
type: steps
title: A dew-point control sequence for the print hall
caption: This is an illustration of the logic, not a specification. The deadband in step 5 is chosen inside the printer's 45 to 55% band so that the humidifier and the cooling coil never act at the same time.
- Temperature loop | Room temperature sets a supply-air temperature setpoint between limits
- Dehumidification loop | Room dew point (or humidity ratio) above setpoint lowers the coil-leaving dew point setpoint
- Cooling valve | Takes the colder of the two demands: supply temperature or coil-leaving dew point
- Reheat valve | Opens only when the coil is held below the supply temperature setpoint by the dehumidification demand
- Humidifier | Enabled only when the room dew point is below its lower setpoint and the cooling coil is not dehumidifying
- Safeties | Fan interlock and high-limit humidity after the humidifier; low-limit temperature on the coil in winter
```

Controlling the room's **dew point** or humidity ratio, rather than its relative humidity, separates the two loops. Relative humidity changes whenever temperature changes, even when no water is added or removed: a 1 K rise in the hall at 50% drops the reading by about three percentage points. A controller acting on relative humidity therefore reacts to every temperature swing, and the cooling and humidity loops fight each other. Dew point changes only when the air's water content changes, so the humidity loop responds only to moisture. A room at 22 °C and 50% has a dew point of 11.11 °C; the printer's band of 45 to 55% at 22 °C corresponds to dew points of about 9.5 to 12.6 °C.

The same logic explains why the hot-dry day still needs some dehumidification. On that day Chapter 5 found the mixed air at 8.234 g/kg, slightly wetter than the room's 8.225 g/kg, before the people add their moisture. A coil leaving at 12.0 °C would barely condense anything, so the dew-point loop still drives it towards 11.0 °C, but the latent load on the coil is only 11.01 kW, as Chapter 7 showed.

## The fan as free reheat

Where the supply fan sits changes the reheat. In the running case the fan draws air through the coil and its 15 kW heats the air after the coil. That heat is useful: it supplies 1.58 K of the 2.58 K between the coil and the supply temperature, and the hot-water reheat supplies only the last 1.0 K.

This is an illustration. If the same unit had a blow-through fan, upstream of the coil, the fan's 15 kW would warm the mixed air before the coil instead. The coil would have to remove it, so the coil load would rise by about 15 kW, and the air would leave the coil at 11.0 °C with nothing after it but the reheat coil. The reheat would then have to supply the whole 2.58 K: 9.311 × 1.020 × 2.58 = **24.50 kW** instead of 9.50 kW. The same fan, in a different position, adds about 15 kW to the coil and 15 kW to the reheat on every humid day.

Blow-through units have other advantages, such as keeping the coil and drain pan under positive pressure, which makes the condensate trap simpler. The point is not that one arrangement is always right, but that the fan heat belongs in the balance and its position decides whether it helps or hinders.

## Setpoints, deadbands and overcooling without reheat

The printer's band, 45 to 55% at 22 °C, gives the controls room to work. A sequence that dehumidifies only above about 53% and humidifies only below about 47%, for example, leaves a deadband in which neither runs, and the hall drifts gently inside it as the weather and production change. A single setpoint of 50% with both loops acting on it keeps both busy, wastes energy and wears the valves.

Removing the reheat altogether is tempting and usually wrong. Without reheat, a coil held at 11.0 °C for humidity delivers air at 12.58 °C after the fan whatever the room needs. At light production the hall would cool. With 40 kW of sensible load, the room would settle where 9.311 × 1.020 × (t_room − 12.58) = 40, at about **16.8 °C**, uncomfortable for staff and, because relative humidity rises as air cools at the same moisture content, damp for the paper: air leaving the coil at 7.751 g/kg, plus the room's 0.395 g/kg pick-up, is about 68.5% relative humidity at 16.8 °C. Overcooling without reheat trades one fault for two.

Commissioning should test the sequence, not just the setpoints. Forcing the room humidity reading up, with the hall otherwise steady, should drive the coil-leaving temperature down and open the reheat valve; forcing it down should lock out the coil's dehumidification and enable the humidifier only after the deadband is crossed. Each test takes minutes, and each catches a sequence that would otherwise be found by a humid summer or a dry winter.

## Where the reheat energy comes from

Reheat is unavoidable when a coil dehumidifies a room with a small sensible load, but the energy that supplies it does not have to be bought. The options below are standard in principle; their performance in a given plant comes from the equipment maker's data and the plant's own operating hours.

- **Recovered condenser heat.** The chiller rejects all the heat the coil removes, plus its compressor work, at a temperature well above the 12 to 18 °C the reheat needs. A heat-recovery condenser or a separate hot-water circuit from the chiller can supply the reheat almost free. The heat it supplies is heat the cooling tower or condenser fans would otherwise reject.
- **Run-around coil.** A pumped water loop links a coil in the mixed air upstream of the cooling coil with a coil downstream of it. The upstream coil precools the warm mixed air, the downstream coil reheats the cold air, and the same heat does both jobs. The cooling coil's load falls by the same amount the reheat falls.
- **Heat pipe.** A wrap-around heat pipe does the same thing as a run-around coil without a pump, moving heat from the entering to the leaving side of the cooling coil by evaporation and condensation of a sealed refrigerant.
- **Desiccant dehumidification.** Where the required dew point is low, a desiccant wheel removes moisture without overcooling, and is regenerated with heat. It changes the problem rather than removing it, because the regeneration heat must still be supplied.
- **Less outdoor air.** Since most of the latent load comes from the outdoor air, matching the outdoor air to the press extraction actually running, rather than to its maximum, reduces both the coil load and the reheat.

The choice depends on how many hours of the year the plant is in dehumidification with a low sensible load. A trend log of the cooling valve, the reheat valve and the room dew point over one humid season gives that number directly.

## The error: a sensor that read high

This is an illustration. Two summers after commissioning, the plant's energy use rose while production stayed steady. The engineer looked at the trend log and found the coil-leaving temperature at about 9.5 °C on humid days, not 11.0 °C, the chilled-water valve wide open and the reheat valve much further open than in the commissioning records.

A check with a calibrated reference hygrometer, as described in Chapter 3, found the hall at 45% while the plant's room sensor read 50%. The sensor had drifted five percentage points high. The controller, believing the hall was at its setpoint, had been driving the hall down to a true 45%, the bottom of the printer's band.

The cost follows from the balance. At a true 45% and 22 °C, the room holds 7.393 g/kg. With the same 0.395 g/kg latent pick-up, the supply must hold 6.998 g/kg, and a coil leaving at 95% must reach **9.49 °C**. The [cooling coil load check](/tools/cooling-coil-dehumidification-check/), with the same entering air and 9.49 °C and 95% leaving, gives a coil load of **252.83 kW** against 220.9 kW, and 157.66 kg/h of condensate against 132.42 kg/h. The reheat rises from 9.50 kW to 9.311 × 1.020 × (13.58 − 1.58 − 9.49) = **23.84 kW**.

```figure
type: compare
title: The cost of a room humidity sensor reading five points high
cols: Sensor correct | Sensor reads 5 points high
rowhead: Humid design day
caption: This is an illustration. The hall stayed inside the printer's band, so no product complaint revealed the fault; only the energy trend and a reference check did.
- True room humidity | 50% | 45%
- Supply humidity ratio needed | 7.830 g/kg | 6.998 g/kg
- Coil leaving temperature | 11.0 °C | 9.49 °C
- Coil load | 220.9 kW | 252.83 kW
- Condensate | 132.42 kg/h | 157.66 kg/h
- Reheat | 9.50 kW | 23.84 kW
```

The sensor was replaced, and the plant added a cross-check that would have found the fault within days. The coil-leaving air is close to saturated, so its dew point is close to its temperature, and the room's humidity ratio should exceed the supply's by about 0.4 g/kg at full load. When the room sensor's humidity ratio and the coil-leaving dew point disagree by more than that, the system raises an alarm. Neither reading is trusted on its own.

## How this applies to a small Australian business

Reheat hides in plain sight. A plant that holds humidity can look efficient in its chiller's figures while buying heat to undo cooling it did not need. Three questions find most of the waste: how often the cooling coil is in dehumidification while the reheat is on, whether the humidity setpoint is at the top of the allowable band or the bottom, and whether the reheat energy is bought or recovered. Raising a humidity setpoint by a few percentage points, inside what the process truly needs, and recalibrating the humidity sensors are low-cost measures with an effect on every humid day.

## Exercise: a run-around coil

A run-around loop is proposed that moves 9.5 kW from the mixed air entering the cooling coil to the air leaving it, at full production on the humid design day. Find the air temperature entering the cooling coil, the new coil load, and the reheat the hot-water coil must still supply.

**Worked answer.** The mixed air's moist specific heat is 1.005 + 1.82 × 0.011702 = 1.0263 kJ/kg·K, so removing 9.5 kW lowers it by 9.5 ÷ (9.311 × 1.0263) = 0.99 K, from 24.59 to **23.60 °C**, with its humidity ratio unchanged at 11.702 g/kg, which is 64.2% relative humidity. The cooling coil still leaves at 11.0 °C and 95%. The cooling coil check, with 23.60 °C and 64.2% entering at 7.973 m³/s, gives a coil load of **211.43 kW**, 9.5 kW less than before. The run-around loop returns the 9.5 kW to the air after the coil, which is exactly the reheat needed at full production, so the hot-water reheat falls to **zero**. At light production the reheat need of 49.5 kW is larger than the loop can supply, so the hot-water coil still provides about 40 kW; the loop's value depends on how the hall's hours split between full and light production on humid days.
