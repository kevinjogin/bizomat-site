---
book: humidity-control-by-the-numbers
chapterSlug: mixing-outdoor-and-return-air
order: 5
title: "Mixing outdoor and return air"
description: "The mass, water and energy balances for mixing outdoor and return air, outdoor-air share by mass, the straight-line rule, fog when cold and humid streams meet, minimum outdoor air and economy cycles."
draft: false
---

Nearly every air-handling unit starts with a mixing box, where outdoor air meets air returned from the space. Recirculating return air saves energy, because it has already been heated, cooled and humidified; outdoor air is needed for the people in the space, to replace air that is exhausted and to keep the building slightly pressurised. The proportions are set by dampers, and the state of the mixture they produce is the starting point for every coil and humidifier downstream.

This chapter sets out the three balances that govern mixing, applies them to the press hall's four design states with the BIZOMAT mixing tool, explains why the outdoor-air share should be counted by mass, and looks at what sets the minimum outdoor air and when bringing in more of it saves energy. It ends with a heat-recovery proposal that would have filled the air-handling unit's filters with fog on cold mornings.

## Three balances

When two air streams mix in a duct without heat exchange with the surroundings, three things are conserved: the mass of dry air, the mass of water and the energy.

```figure
type: formula
title: Adiabatic mixing of two air streams
formula: ṁ₃ = ṁ₁ + ṁ₂
formula: ω₃ = (ṁ₁ ω₁ + ṁ₂ ω₂) ÷ ṁ₃
formula: h₃ = (ṁ₁ h₁ + ṁ₂ h₂) ÷ ṁ₃
caption: This is an illustration: the press hall on the humid design day. ṁ is dry-air mass flow, found from each stream's volume flow and specific volume. The mixed temperature follows from the mixed enthalpy and humidity ratio.
- Stream 1, outdoor | 3.0 m³/s at 29 °C, 70%: ṁ₁ = 3.0 ÷ 0.8802 = 3.408 kg/s, ω₁ = 17.714 g/kg, h₁ = 74.38 kJ/kg
- Stream 2, return | 5.0 m³/s at 22 °C, 50%: ṁ₂ = 5.0 ÷ 0.8471 = 5.903 kg/s, ω₂ = 8.225 g/kg, h₂ = 43.01 kJ/kg
step: ṁ₃ = 3.408 + 5.903 = 9.311 kg/s; outdoor share by mass 36.6%
step: ω₃ = (3.408 × 17.714 + 5.903 × 8.225) ÷ 9.311 = 11.699 g/kg
step: h₃ = (3.408 × 74.38 + 5.903 × 43.01) ÷ 9.311 = 54.49 kJ/kg
step: t₃ = (54.49 − 2500.9 × 0.011699) ÷ (1.005 + 1.82 × 0.011699) = 24.59 °C, relative humidity 60.5%
```

The [two-stream air mixing check](/tools/air-stream-mixing-check/) does exactly this. From each stream's temperature, relative humidity and volume flow, and the barometric pressure, it finds each stream's dry-air mass flow, humidity ratio and enthalpy, averages the humidity ratio and enthalpy by mass, and returns the mixed temperature, relative humidity, dew point, the share of stream 1 by dry-air mass and the two mass flows. It then checks whether the mixed state lies beyond saturation, which means fog, and whether its relative humidity is below the limit the user sets. It assumes steady, adiabatic mixing at one pressure with the streams fully mixed.

## Share by volume and share by mass

The hall's dampers are set to 3.0 m³/s of outdoor air in 8.0 m³/s, which is 37.5% by volume. The share that matters for the balances is the share of dry-air mass, and it varies with the seasons because outdoor air is denser when it is cold.

This is an illustration. On the humid summer day outdoor air is 36.6% of the mixture by mass; on the hot dry afternoon 36.3%; in winter 39.0%; on the frosty morning 39.5%. The differences look small, but the winter humidifier must bring every kilogram of that outdoor air up to the supply humidity ratio, and a calculation done with the summer share would understate its load. Outdoor-air flows for ventilation are also specified and measured as volumes, so the engineer needs both numbers and needs to know which one a requirement refers to.

## The four seasons in the mixing box

```figure
type: compare
title: Mixed air in the press hall's mixing box, 3.0 m³/s outdoor and 5.0 m³/s return
cols: Mixed dry bulb | Mixed RH | Mixed dew point | Mixed ω, g/kg | Outdoor share by mass
rowhead: Outdoor state
caption: This is an illustration. Results of the mixing check with return air at 22 °C and 50% and a fog limit of 90%. None of the design states produces fog with return air from the hall.
- * Summer humid, 29 °C, 70% | 24.59 °C | 60.5% | 16.44 °C | 11.699 | 36.6%
- Summer hot-dry, 38 °C, 20% | 27.80 °C | 35.4% | 11.13 °C | 8.234 | 36.3%
- Winter, 5 °C, 80% | 15.39 °C | 61.7% | 8.09 °C | 6.698 | 39.0%
- Frosty morning, 0 °C, 95% | 13.35 °C | 67.2% | 7.41 °C | 6.392 | 39.5%
```

Each row tells the next component what it faces. On the humid day the cooling coil receives air with a dew point of 16.44 °C, far above the 10.38 °C the supply needs, so it must dehumidify hard. On the hot dry afternoon the mixed air is warmer but has almost the room's water content, so the coil's work is mostly sensible. In winter and on the frosty morning the mixed air is below the room's humidity ratio, so the humidifier must make up the difference.

The winter humidifier's load can be read straight from the mixing balance. This is an illustration. The outdoor air's 3.782 kg/s must be raised from 4.314 g/kg to the supply's 8.056 g/kg, which takes 3.782 × 3.742 = 14.15 g/s, or 50.9 kg/h. The return air, at 8.225 g/kg, is slightly wetter than the supply needs and gives back 5.903 × 0.169 = 1.0 g/s, or 3.6 kg/h. The net, 47.3 kg/h, agrees with the 47.46 kg/h that Chapter 6 calculates from the mixed state, within the rounding of the individual terms. The humidifier exists almost entirely to treat outdoor air.

## Mixing on paper and mixing in the box

The balances assume the two streams are fully mixed. In a real mixing box they often are not. Outdoor and return air enter through dampers on different faces, and cold outdoor air, being denser, tends to run along the bottom of the box and through the lower part of the filter and coils as a separate layer. The mixed temperature calculated for the frosty morning, 13.35 °C, may be the average across the coil face while its lower rows see air close to 0 °C.

That matters for two reasons. A hot-water heating coil whose lower tubes see air near or below freezing can freeze and split if its water flow is low, which is why such coils are protected by a low-limit thermostat across the coil face that stops the fan or opens the valve fully. And a sensor that reads the "mixed air" temperature at one point may read either stream rather than the mixture, sending the controls the wrong number. Opposed-blade dampers arranged so the two streams meet at an angle, baffles or a short mixing section, and a temperature sensor averaged across the duct, all help. The balances give the target; the box has to be built to reach it.

## The straight-line rule

Because humidity ratio and enthalpy both mix in proportion to mass, the mixed state lies on the straight line joining the two stream states on a chart of humidity ratio against enthalpy. On the ordinary psychrometric chart, with dry bulb across, the line is very nearly straight as well, and the mixed point divides it in proportion to the masses, as Chapter 2 showed.

Two cautions apply. First, the proportions are by dry-air mass, not volume. For the hot dry afternoon the volume share of 37.5% puts the mixed temperature at 22 + 0.375 × 16 = 28.0 °C; the mass share of 36.3% gives 27.8 °C, which is the correct answer. Second, the dry-bulb temperature does not mix exactly in proportion, because the specific heat of moist air depends on its water content. The error is a few hundredths of a kelvin in ordinary cases, but it is why the mixing tool, and any careful calculation, mixes enthalpy and then finds the temperature.

## Mixing can make fog

The saturation curve bends upwards, and a straight line between two points on or near it can pass above it. When it does, the mixture holds more water than saturated air at its temperature can, and the excess condenses as fine droplets: fog. Two conditions make this likely: one stream close to saturation and cold, the other warm and humid. Breath on a cold morning is the everyday example.

In an air-handling unit, fog wets filters, which then load up and can freeze on cold mornings, drips onto the floor of the unit and its insulation, and can carry into the ductwork. The mixing tool flags it: a mixed relative humidity above 100% is reported as supersaturated, with the verdict "FOG FORMS".

## Minimum outdoor air

The outdoor air quantity is set by the largest of several needs. The people in the space need fresh air, and AS 1668.2, the Australian standard for mechanical ventilation in buildings, sets out how the required outdoor air rates are determined; the building's designer applies it, with any local requirements. Air exhausted from the space, here the 2.6 m³/s drawn off by the presses, must be replaced. And a small surplus keeps the building pressurised so that humid or dusty air leaks out rather than in. In the press hall the extraction and pressurisation set the figure: 3.0 m³/s supplied against 2.6 m³/s extracted.

The minimum should be measured, not assumed from damper positions. Dampers leak when closed and do not pass flow in proportion to their opening, and the flow through an outdoor-air damper changes with wind and with the pressure in the mixing box. A measuring station in the outdoor-air duct, checked at commissioning and at intervals afterwards, is the only reliable way to know what the humidifier and coil are actually treating.

## Economy cycles in a humidity-controlled space

An economy cycle opens the outdoor-air dampers beyond the minimum when outdoor air can do some of the cooling for free. In an office it is usually worth having. In a space whose humidity is controlled, it needs a second test.

This is an illustration. On a mild day the outdoor air is at 10 °C and 80%, carrying 6.090 g/kg. The hall still needs air leaving the cooling coil section at about 12.0 °C, so that after the fan it supplies the presses' heat. With the minimum outdoor air, the mixing box delivers 9.607 kg/s at 17.38 °C and 7.402 g/kg, and the coil must take out 9.607 × 1.018 × (17.38 − 12.0) = **52.6 kW** of sensible heat. The hall's humidity settles at about 47%, inside the band, with no humidifier running.

With the economy cycle, the dampers move to 6.65 m³/s of outdoor air and 1.35 m³/s of return air, and the mixing check gives 11.96 °C: no coil cooling at all. But the mixed air holds only **6.437 g/kg**, and the hall would fall to about 41.5%. To hold it at 50% the humidifier must bring 9.805 kg/s of air up to 7.850 g/kg, about **49.9 kg/h** of steam carrying 37 kW of energy.

```figure
type: compare
title: Minimum outdoor air against an economy cycle on a mild day, 10 °C and 80%
cols: Minimum outdoor air | Economy cycle
rowhead: Item
caption: This is an illustration. The economy cycle removes the coil load but creates a humidifier load. Whether it saves energy depends on how the cooling and the steam are produced; with an electric steam humidifier and a chiller using a fraction of its cooling output as electricity, it usually does not.
- Dampers, outdoor and return | 3.0 and 5.0 m³/s | 6.65 and 1.35 m³/s
- Mixed air | 17.38 °C, 7.402 g/kg | 11.96 °C, 6.437 g/kg
- Cooling coil load | 52.6 kW sensible | none
- Hall humidity without humidifier | about 47% | about 41.5%
- * Steam to hold 50% | none | about 49.9 kg/h, 37 kW
```

For example, if the chiller produced its 52.6 kW of cooling with an electrical input of a quarter of that, about 13 kW, the economy cycle would replace 13 kW of electricity with 37 kW of steam. The rule for a humidity-controlled hall is therefore to enable the economy cycle only when the outdoor dew point is close to the required supply dew point, so that extra outdoor air neither needs drying nor needs humidifying. The same principle, comparing dew points rather than temperatures or relative humidities, came up in Chapter 1.

## The error: fog from a heat-recovery proposal

This is an illustration. The press hall's plate-washing room is exhausted separately at 1.0 m³/s, and its exhaust air is warm and humid, 30 °C and 85%, carrying 22.97 g/kg. To recover its heat in winter, a contractor proposed ducting it into a small plenum where it would mix with the incoming outdoor air before the main mixing box. On paper the mixture would be warmer than the outdoor air, saving heating energy, and wetter, saving humidifier steam.

The engineer ran the proposal through the mixing check for the frosty design morning: 3.0 m³/s of outdoor air at 0 °C and 95% with 1.0 m³/s of the exhaust air.

```figure
type: stats
title: Outdoor air mixed with plate-wash exhaust on the frosty morning
caption: This is an illustration. Results of the mixing check, with the equilibrium after condensation worked separately from the mixed enthalpy and humidity ratio. The mist would collect on the filters immediately downstream of the plenum.
- * 128.2% | Mixed relative humidity | verdict FOG FORMS
- 6.95 °C | Mixed temperature before condensation | dew point of the mixture 10.62 °C
- 0.84 g/kg | Water condensing as mist | about 15 kg/h at 4.98 kg/s of dry air
- 8.99 °C | Temperature once the fog has formed | released latent heat warms the saturated air
```

The mixture's dew point, 10.62 °C, was well above its temperature of 6.95 °C. The mixing line between a nearly saturated cold stream and a warm humid one crossed the saturation curve. Once condensation released its latent heat, the air would settle saturated at about 8.99 °C with 0.84 g/kg of liquid mist, around 15 kg of water an hour arriving at the filters, at a temperature from which a colder morning would take it to freezing.

The engineer tested preheating the outdoor air first. With the outdoor air heated to 8 °C before the plenum, about 30 kW, the mixture leaves at 13.21 °C and 85.3%, clear of the 90% limit; at 7 °C it is just under the limit, at 6 °C it is near saturation. That preheat would have consumed much of the heat the scheme was meant to recover. The proposal was replaced by a run-around coil system, which takes heat from the exhaust through a closed water loop to a coil in the outdoor-air duct without mixing the streams, so the exhaust's water never meets the cold air.

## How this applies to a small Australian business

In a small building, the mixing box is often a set of dampers inside a packaged unit, set once at installation and rarely checked. Three questions are worth asking. How much outdoor air is the unit actually taking in, measured rather than assumed? Is the economy cycle, if there is one, controlled on temperature alone, which can waste energy in a humidity-controlled space, or on enthalpy or dew point? And has anyone mixed, or proposed mixing, a humid exhaust with cold outdoor air? In much of southern Australia, winter mornings are cold and often near saturation, and the fog that results is easy to predict with a five-minute calculation and expensive to discover through wet filters.

## Exercise: the hot dry afternoon by hand

Using the stream properties in Chapter 1, calculate the mixed humidity ratio, enthalpy and temperature for 3.0 m³/s of outdoor air at 38 °C and 20% (3.3594 kg/s, 8.250 g/kg, 59.39 kJ/kg) mixed with 5.0 m³/s of return air at 22 °C and 50% (5.9028 kg/s, 8.225 g/kg, 43.01 kJ/kg). Compare the mixed temperature with the estimate from the volume share.

**Worked answer.** This is an illustration. The total dry air is 3.3594 + 5.9028 = 9.2622 kg/s, of which the outdoor air is 36.3%. The mixed humidity ratio is (3.3594 × 8.250 + 5.9028 × 8.225) ÷ 9.2622 = **8.234 g/kg**, and the mixed enthalpy (3.3594 × 59.39 + 5.9028 × 43.01) ÷ 9.2622 = **48.95 kJ/kg**. The temperature follows from the enthalpy: (48.95 − 2500.9 × 0.008234) ÷ (1.005 + 1.82 × 0.008234) = **27.80 °C**, matching the mixing check. The volume share would have given 22 + 0.375 × 16 = 28.0 °C, 0.2 K too warm. The mixed air holds almost exactly the room's water, so on this afternoon the cooling coil's work is nearly all sensible, and very different from its work on the humid day.
