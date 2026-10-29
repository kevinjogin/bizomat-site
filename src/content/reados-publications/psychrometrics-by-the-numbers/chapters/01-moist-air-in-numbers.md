---
book: psychrometrics-by-the-numbers
chapterSlug: moist-air-in-numbers
order: 1
title: "Moist air in numbers"
description: "The properties an air-handling engineer works with: humidity ratio, enthalpy, specific volume, dew point and relative humidity, on a dry-air basis, from temperature, humidity and pressure."
draft: true
---

An air-handling unit does four things to air: it mixes it, heats it, cools it and changes how much water it carries. Every one of those jobs is a mass and energy balance, and a balance needs quantities that add up. Temperature and relative humidity, the two numbers on every wall display, do not add up. Two air streams at 50% relative humidity can mix to make fog, and air heated without any change in its water content can fall from 80% to 26% relative humidity. The engineer needs a different set of numbers, and this chapter sets them out.

The set is short: the humidity ratio, the enthalpy, the specific volume and the dew point, all counted per kilogram of dry air. The chapter calculates them for the running case's press hall and its four outdoor design states, turns a fan's volume flow into the mass flow a balance needs, checks three cold surfaces in the hall for condensation, and ends with an error that came from trusting relative humidity as a measure of how wet the air is.

## Why everything is counted per kilogram of dry air

Moist air is a mixture of dry air and water vapour. As it passes through an air-handling unit, the water content changes: a humidifier adds water, a cooling coil condenses some out. The dry air does not change. Every kilogram of dry air that enters the unit leaves it, so dry air is the natural thing to count, and every psychrometric property is stated per kilogram of it.

That is why the **humidity ratio**, written ω, is grams of water vapour per kilogram of dry air, not per kilogram of mixture. The difference looks small. For the room state used throughout this book the humidity ratio is 8.225 g/kg dry air, while the water per kilogram of moist air, the specific humidity, is 8.158 g/kg. The gap is under 1%, but a balance done on one basis and finished on the other carries that error into every load, and the habit of saying "per kilogram of dry air" prevents it.

## Five properties from three readings

Given the dry-bulb temperature t, the relative humidity and the barometric pressure p, everything else follows. The saturation vapour pressure p_s depends only on temperature, and the WORKOS tools used in this book take it from the Hyland–Wexler equations, the formulation given in the ASHRAE Handbook of Fundamentals. Readers who want the physics of vapour pressure and dew point, and a simpler formula that is accurate to about a quarter of a percent, will find both in [Water in air: vapour pressure, humidity and dew point](/reados/publications/condensation-control-by-the-numbers/water-in-air-vapour-pressure-and-dew-point/). This chapter takes them as given and moves on to what an air-handling engineer does with them.

```figure
type: formula
title: Moist-air properties on a dry-air basis
formula: p_v = RH × p_s(t)
formula: ω = 0.622 × p_v ÷ (p − p_v)
formula: h = 1.005 t + ω × (2500.9 + 1.82 t)
formula: v = 0.287 × (t + 273.15) ÷ (p − p_v)
caption: t in °C, pressures in kPa, ω in kg of water per kg of dry air, h in kJ per kg of dry air, v in m³ per kg of dry air. The dew point is the temperature at which p_s equals p_v. Worked for the hall at 22 °C and 50% relative humidity at 101.325 kPa.
- p_s | saturation vapour pressure at the dry-bulb temperature
- 0.622 | ratio of the molar masses of water and dry air, 18.015 ÷ 28.965
- 1.005 | specific heat of dry air, kJ/kg·K
- 2500.9 | enthalpy of water vapour at 0 °C, kJ/kg, taking liquid water at 0 °C as zero
step: p_s(22 °C) = 2.6448 kPa, so p_v = 0.50 × 2.6448 = 1.3224 kPa
step: ω = 0.622 × 1.3224 ÷ (101.325 − 1.3224) = 0.008225 kg/kg, or 8.225 g/kg dry air
step: h = 1.005 × 22 + 0.008225 × (2500.9 + 1.82 × 22) = 22.11 + 20.90 = 43.01 kJ/kg dry air
step: v = 0.287 × 295.15 ÷ 100.003 = 0.8471 m³/kg dry air; dew point 11.11 °C
```

Each property answers a different question.

- **Humidity ratio** answers "how much water?" It is the quantity that a humidifier raises and a cooling coil lowers, and it is the only humidity measure that mixes linearly.
- **Enthalpy** answers "how much energy?" A heating or cooling coil's load is the dry-air mass flow times the change in enthalpy, with a small correction for any water that enters or leaves as liquid.
- **Specific volume** answers "how much dry air does this fan move?" Fans move volume; balances need mass.
- **Dew point** answers "which surfaces will sweat?" It is fixed by the water content alone, so it does not change when air is heated or cooled without condensing.
- **Relative humidity** answers "how close to saturation, at this temperature?" It matters to paper, people and sensors, but it is a ratio, and it changes every time the temperature does.

### Sensible and latent parts of enthalpy

The enthalpy formula has two terms. The first, 1.005 t, is the energy of the dry air. The second, ω (2500.9 + 1.82 t), is the energy carried by the vapour, and almost all of it is the latent heat that was needed to evaporate that water. For the room air the two parts are nearly equal: 22.11 kJ/kg in the air and 20.90 kJ/kg in the vapour. Removing water from air takes as much energy, kilogram for kilogram of dry air, as a large temperature change. That is the first reason humidity control costs money.

## The running case: the hall and its design states

This is an illustration. A carton printer's press hall, 60 m × 30 m × 8 m, is held at 22 °C and 50% relative humidity all year, the printer's specification for keeping paperboard flat and stable. One air-handling unit mixes 3.0 m³/s of outdoor air with 5.0 m³/s of return air. The engineer has chosen four outdoor design states for the site, invented for this book: a humid summer day, a hot dry summer afternoon, a winter day and a frosty morning. Real design states would come from Bureau of Meteorology records or published design data for the site.

The properties of all five states, at the standard pressure of 101.325 kPa, came from the same equations as the [moist air dew point and surface condensation check](/tools/surface-dew-point-check/), which returns the humidity ratio, enthalpy, specific volume, vapour pressure and dew point for any temperature and relative humidity.

```figure
type: compare
title: The press hall's room state and outdoor design states
cols: ω, g/kg | h, kJ/kg | Dew point | v, m³/kg
rowhead: State
caption: This is an illustration. All values per kilogram of dry air at 101.325 kPa. Below 0 °C the tool reports a frost point, the temperature at which vapour is in equilibrium with ice.
- * Room, 22 °C, 50% | 8.225 | 43.01 | 11.11 °C | 0.8471
- Summer humid, 29 °C, 70% | 17.714 | 74.38 | 22.97 °C | 0.8802
- Summer hot-dry, 38 °C, 20% | 8.250 | 59.39 | 11.15 °C | 0.8930
- Winter, 5 °C, 80% | 4.314 | 15.85 | 1.84 °C | 0.7933
- Frosty morning, 0 °C, 95% | 3.585 | 8.97 | −0.62 °C frost | 0.7781
```

The table already tells the engineer most of what the plant will have to do. On the humid day the outdoor air carries more than twice the room's water, 17.714 against 8.225 g/kg, so it must be dried. On the hot dry afternoon it carries almost exactly the room's water, so it needs cooling but hardly any drying. In winter it carries about half, so it must be humidified. The relative humidities, 70%, 20% and 80%, give no reliable hint of any of this.

## From volume flow to mass flow

A fan is rated in cubic metres per second, and the volume depends on the air's temperature and water content. Dividing the volume flow by the specific volume at the point where the volume is measured gives the dry-air mass flow.

This is an illustration. The outdoor air damper passes 3.0 m³/s, measured at outdoor conditions. On the humid day that is 3.0 ÷ 0.8802 = **3.408 kg/s** of dry air. In winter the same 3.0 m³/s is 3.0 ÷ 0.7933 = **3.782 kg/s**, 11% more, because cold air is denser. On the frosty morning it is 3.855 kg/s. A balance that assumed one density all year would be wrong by a tenth in one season or the other.

With mass flows the outdoor air's burden on the plant follows directly. On the humid day the outdoor air brings in 3.408 × 17.714 = 60.4 g/s of water. The room air it displaces holds 8.225 g/kg, so the excess the plant must remove to keep the hall at 50% is 3.408 × (17.714 − 8.225) = 32.3 g/s, or **116 kg of water an hour**, from outdoor air alone. Its enthalpy excess is 3.408 × (74.38 − 43.01) = **106.9 kW**, of which only 24.8 kW is sensible heat from the 7 K temperature difference. The rest, about 82 kW, is latent: the energy needed to condense 116 kg/h of water.

```figure
type: bars
title: What 3.0 m³/s of outdoor air brings into the hall, relative to room air
unit: kW
max: 140
caption: This is an illustration. Enthalpy flow of the outdoor air above or below that of the same dry-air mass at the room state. Negative values are energy the plant must add. The hot-dry afternoon carries almost no excess water; its 55 kW is nearly all sensible.
- * Summer humid, 29 °C, 70% | 106.9 | 116 kg/h of excess water
- Summer hot-dry, 38 °C, 20% | 55.0 | 0.3 kg/h of excess water
- Winter, 5 °C, 80% | −102.7 | 53 kg/h of water short
- Frosty morning, 0 °C, 95% | −131.3 | 64 kg/h of water short
```

These are not the plant's loads, because the outdoor air mixes with return air and the room adds its own heat and moisture. Chapters 4 and 5 build those balances. But the outdoor air sets the scale, and the comparison shows why the humid day, not the hottest day, sizes the cooling coil in this hall.

## Relative humidity follows temperature

Relative humidity is the vapour pressure divided by the saturation vapour pressure at the air's own temperature. Change the temperature with the water content fixed and the relative humidity changes, sometimes dramatically.

This is an illustration. Winter outdoor air at 5 °C and 80% has a vapour pressure of 0.698 kPa. Heated to 22 °C without adding water, it still has 0.698 kPa, but the saturation pressure is now 2.6448 kPa, so its relative humidity is 0.698 ÷ 2.6448 = **26.4%**. Frosty-morning air heated the same way reaches 22.0%. The printer's board would dry out and curl at either. Nothing has been removed from the air; heating has simply raised its capacity.

The reverse is the condensation problem. Air cooled with its water content fixed rises in relative humidity until, at the dew point, it reaches 100%, and any surface below that temperature collects water.

## Cold surfaces in the hall

The dew point check compares a surface temperature with the dew point of the surrounding air and reports the margin, the relative humidity the air would have if cooled to the surface temperature, and a verdict against the margin the engineer asks for. A margin is needed because neither the surface temperature nor the humidity is known exactly; this book uses 3 K.

This is an illustration. Three surfaces in the hall were checked against the room air at 22 °C and 50%, dew point 11.11 °C.

```figure
type: stats
title: Three surfaces in the press hall against the room dew point of 11.11 °C
caption: This is an illustration. Results of the dew point check with a 3 K margin. A relative humidity above 100% at the surface means the air there is supersaturated and water condenses until it is not.
- * −4.11 K | Chilled-water pipe at 7 °C | sweats; 132% at the surface
- −3.11 K | Paper reels delivered at 8 °C | sweat until warmed; 123% at the surface
- 2.47 K | Supply duct at 13.58 °C | stays dry, but inside the 3 K margin; 85% at the surface
```

The chilled-water pipe sweats whenever it is exposed, which is why it is insulated with a vapour-tight jacket; a gap in the jacket drips onto whatever is below. The paper reels arrive from an unheated truck in winter and stay below the dew point for hours while their mass warms, wetting the outer wraps; the printer's rule is to leave them wrapped until their surface has warmed above about 14 °C. The supply duct, carrying air at 13.58 °C in summer, is 2.47 K above the room's dew point. It stays dry in the hall's design state, but a rise in room humidity to about 59% would bring the dew point up to the duct surface, so the duct is insulated as well. Chapter 10 returns to all three.

## Pressure and altitude

The humidity ratio and the specific volume both contain the total pressure. At a site 600 m above sea level the standard barometric pressure is about 94.3 kPa, and the same 22 °C and 50% gives a humidity ratio and a specific volume both about 7.5% larger than at sea level. The tools in this book take the barometric pressure as an input for that reason. Charts are printed for one pressure, usually sea level; using a sea-level chart at an elevated site is a common source of small, systematic errors. Chapter 2 deals with charts.

## The error: drying the hall with dry outdoor air

This is an illustration. During a hot, dry spell the hall's relative humidity drifted up to 56% one afternoon, above the printer's limit. The outdoor display at the loading dock read 38 °C and 20%. The shift supervisor, reasoning that 20% air was much drier than 56% air, asked maintenance to open the outdoor air dampers fully to "dry the hall out". The cooling plant, already near its limit on the hot afternoon, could not hold the temperature, and the hall warmed to 25 °C within an hour. The humidity did not fall.

The engineer worked in humidity ratios instead. Outdoor air at 38 °C and 20% holds 8.250 g/kg; the room air at 22 °C and 50% holds 8.225 g/kg. The outdoor air was not drier at all: it carried 0.025 g/kg more water. All that opening the dampers achieved was to replace room air with air of the same water content and 16.38 kJ/kg more enthalpy. With the unit on full outdoor air, 8.0 m³/s at outdoor conditions, that was 8.958 kg/s of dry air bringing about 147 kW more into the hall than recirculated room air would have.

The rise to 56% had a different cause: a steam leak at a press's drying unit, found the next morning. The supervisor's instruction was reversed, the leak repaired, and the hall's display was changed to show the dew point beside the relative humidity. The plant's rule is now that outdoor air can dry the hall only when its dew point is below the room's, and the display makes that comparison possible at a glance.

## How this applies to a small Australian business

Most humidity problems in small factories, stores and workshops are first reported in relative humidity, because that is what cheap displays show. Converting the readings to humidity ratio or dew point is the first step in any diagnosis. Air at the same dew point carries the same water, whatever its relative humidity, and only air with a lower dew point can dry a space. Outdoor air in much of inland Australia in summer is hot and low in relative humidity but not necessarily low in water content, while coastal air can be humid for weeks. The numbers, not the feel of the air, decide what ventilation will do.

For anyone specifying an air-handling unit, the design states should be stated as dry-bulb with humidity ratio, wet bulb or dew point, at the site's pressure. A specification that gives only relative humidity, or pairs a temperature and a humidity from different hours of the day, will mislead every calculation that follows.

## Exercise: the frosty morning

On the frosty morning the outdoor air is at 0 °C and 95% relative humidity, and 3.0 m³/s of it enters through the damper. Using the values in the table, find the dry-air mass flow, the water it brings in, how much water must be added to bring that air to the room's humidity ratio, and the relative humidity the air would have if it were heated to 22 °C without adding water.

**Worked answer.** This is an illustration. The specific volume is 0.7781 m³/kg, so the dry-air mass flow is 3.0 ÷ 0.7781 = **3.855 kg/s**. At 3.585 g/kg it carries 3.855 × 3.585 = **13.8 g/s** of water. To reach the room's 8.225 g/kg it needs 3.855 × (8.225 − 3.585) = 17.9 g/s, or **64.4 kg/h**. Its vapour pressure is 0.95 × 0.6112 = 0.5807 kPa; heated to 22 °C it has a relative humidity of 0.5807 ÷ 2.6448 = **22.0%**. The outdoor air arrives close to saturation and, once heated, is dry enough to damage the board, which is why the hall needs a humidifier even though the air outside feels damp.
