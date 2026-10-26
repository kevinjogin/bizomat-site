---
book: cooling-towers-by-the-numbers
chapterSlug: moist-air-and-the-wet-bulb
order: 2
title: "Moist air and the wet-bulb temperature"
description: "Work out the air a tower uses: humidity ratio, enthalpy, wet-bulb and dew point from temperature and humidity, why enthalpy drives a tower, and catch a 3 pm temperature paired with 9 am humidity."
draft: false
---

A cooling tower's performance is set by the air it draws in, and the property that matters is not the air's temperature but its capacity to take up moisture and heat. That capacity is described by a handful of related quantities: the vapour pressure of the water already in the air, the humidity ratio, the enthalpy of the moist air and, summarising them all for tower purposes, the wet-bulb temperature. They are the subject of **psychrometrics**, and a few formulas, run in a spreadsheet or a few lines of code, give all of them from the air's temperature and relative humidity.

This chapter defines the quantities, shows how to calculate them, explains why a tower's driving force is the difference in enthalpy between air and water rather than a difference in temperature, and shows how to choose a design wet-bulb. The running case finds that a feasibility study paired the afternoon's peak temperature with the morning's relative humidity from weather records, computed a wet-bulb of about 30 °C instead of about 24 °C, and nearly had the plant enlarge every one of its water-cooled coolers by about half.

## Vapour pressure and relative humidity

Air always carries some water vapour, and the vapour exerts a share of the air's total pressure, its **partial pressure** or vapour pressure. At each temperature, there is a maximum vapour pressure the air can hold, the **saturation vapour pressure**, which rises steeply with temperature. A widely used approximation is the Magnus formula, p_sat ≈ 0.61094 × exp(17.625 t ÷ (t + 243.04)) kPa, with t in °C. **Relative humidity** is the actual vapour pressure divided by the saturation value at the air's temperature.

## Humidity ratio and enthalpy

Two further quantities are what a tower calculation uses.

```figure
type: formula
title: Humidity ratio and enthalpy of moist air, per kilogram of dry air
formula: W = 0.622 × p_v ÷ (p − p_v);   h ≈ 1.006 × t + W × (2,501 + 1.86 × t) kJ/kg
caption: This is an illustration for CT-250's design-day air: 35 °C and 40% relative humidity at sea-level pressure, p ≈ 101.3 kPa.
- p_v | Partial pressure of water vapour, kPa
- W | Humidity ratio, kg of water vapour per kg of dry air
- h | Enthalpy of moist air, kJ per kg of dry air, from 0 °C dry air and liquid water
step: p_sat(35 °C) ≈ 5.62 kPa; p_v ≈ 0.40 × 5.62 ≈ 2.25 kPa
step: W ≈ 0.622 × 2.25 ÷ (101.3 − 2.25) ≈ 0.0141 kg/kg, about 14.1 g/kg
step: h ≈ 1.006 × 35 + 0.0141 × (2,501 + 1.86 × 35) ≈ 71.4 kJ/kg
```

The **humidity ratio** is the mass of water vapour carried by each kilogram of dry air, and the difference between the air leaving and entering a tower is the water it has evaporated. The **enthalpy** is the total heat content of the moist air, its sensible heat plus the latent heat of its vapour. In a tower, the air's enthalpy rises by exactly the heat the water loses.

## The wet-bulb temperature

The **wet-bulb temperature** is the temperature at which water, evaporating into the air, would saturate it while cooling it, with no heat added or removed from outside. Calculated, it is the temperature at which saturated air has the same enthalpy as the actual air, corrected slightly for the heat of the water evaporated. Measured, it is the reading of a thermometer with a wet wick in a brisk air flow, or the output of a calculation inside an electronic humidity sensor.

```figure
type: compare
title: Psychrometric properties of five air conditions
cols: Humidity ratio | Enthalpy | Wet-bulb | Dew point
caption: These follow from the formulas above at sea-level pressure. The first and third rows differ by 5 K in temperature but have almost the same wet-bulb and enthalpy, so a tower performs almost identically in them.
- *35 °C, 40% RH, design afternoon | 14.1 g/kg | 71.4 kJ/kg | 24.0 °C | 19.4 °C
- 35 °C, 70% RH | 25.1 g/kg | 99.7 kJ/kg | 30.1 °C | 28.7 °C
- 30 °C, 60% RH | 16.0 g/kg | 71.1 kJ/kg | 23.8 °C | 21.4 °C
- 25 °C, 80% RH | 15.9 g/kg | 65.7 kJ/kg | 22.4 °C | 21.3 °C
- 20 °C, 50% RH | 7.3 g/kg | 38.5 kJ/kg | 13.8 °C | 9.3 °C
```

The **dew point** is a different temperature: the one at which the air, cooled without adding moisture, would begin to condense. It is always at or below the wet-bulb, and it matters for condensation on cold surfaces, not for towers.

## Why enthalpy drives a tower

The table shows something important: air at 35 °C and 40% relative humidity and air at 30 °C and 60% have almost the same enthalpy, about 71 kJ/kg, and almost the same wet-bulb, about 24 °C. A tower treats them almost identically. That is because, in a tower, heat leaves the water by two routes at once, sensible heat to the air and latent heat by evaporation, and their sum depends on the difference between the enthalpy of saturated air at the water's temperature and the enthalpy of the air passing it. Lines of constant wet-bulb are, very nearly, lines of constant enthalpy. The tower's driving force is therefore an enthalpy difference, and the tower's performance depends on the incoming air's wet-bulb, which fixes its enthalpy, not on its dry-bulb. Chapter 4 builds the tower's performance on exactly this enthalpy difference.

## Choosing a design wet-bulb

A tower must meet its duty on hot, humid days, but not on the very worst hour in decades, which would make it unreasonably large. Designers therefore choose a **design wet-bulb** that is exceeded only for a small, stated fraction of the hours in a typical year, from climate data for the site. Design climate data are published for engineering use, often as temperatures exceeded for 0.4%, 1% or 2% of the year, and the choice among them is a decision about risk, made by the plant rather than the tower supplier: a 1% wet-bulb is exceeded for about 88 hours a year, during which the tower's cold water runs above its design value. For CT-250, the plant chose a design wet-bulb of 24 °C for its site, in this illustration, after checking how much its processes could tolerate warmer water for those hours.

The design wet-bulb is a coincident value: the wet-bulb itself, measured or calculated at the same moment as the temperature it occurs with. It is not assembled from separate statistics of temperature and humidity, which is where the running case went wrong.

## The running case: the feasibility study

This is an illustration. Before CT-250 was designed, a feasibility study was asked whether a tower could deliver 29 °C water to the plant in summer. The study used the nearest weather station's published monthly statistics for its hottest month, which listed the mean 3 pm temperature and the mean 9 am and 3 pm relative humidities. The study took the 3 pm temperature, about 35 °C on the hottest days, and paired it with the 9 am relative humidity, about 70%.

## The error: a temperature and a humidity from different hours

Air at 35 °C and 70% relative humidity has a wet-bulb of about **30.1 °C**. With a 5 K approach, a tower would deliver about 35 °C water, not 29 °C, and the study reported that the plant's water-cooled equipment should be designed for 35 °C water. For an oil cooler like OC-35, cooling oil from 55 °C to 45 °C with water warming 5 K, that would reduce the log mean temperature difference from about 18.4 K to about 12.3 K, needing about **1.49 times** the area: every water-cooled cooler in the plant about half as large again.

```figure
type: bars
title: The design-day wet-bulb, °C
unit: °C
max: 35
caption: This is an illustration. Pairing the afternoon temperature with the morning humidity produced a wet-bulb about 6 K too high; morning air is cooler and more humid, afternoon air hotter and drier, and their wet-bulbs are similar.
- Study: 35 °C with 9 am humidity of 70% | 30.1
- *Coincident afternoon: 35 °C with 40% | 24.0
```

The relative humidity is highest in the cool early morning and lowest in the hot afternoon, because the air's moisture content changes little through the day while its temperature, and so its saturation vapour pressure, rises. Pairing the morning humidity with the afternoon temperature created air that does not occur: as hot as the afternoon and as humid, relatively, as the morning. The afternoon's actual humidity, about 40%, gave a wet-bulb of about 24 °C. The check that caught it was the plant engineer's question: what wet-bulb does the station record on hot afternoons? The station's hourly data, which record coincident temperature and humidity, answered it within an hour. The general lesson is that a wet-bulb must come from coincident measurements, or from design data prepared from them, and that combining separate statistics for temperature and humidity can produce weather that never happens.

## The psychrometric chart

All of these quantities can be read from a **psychrometric chart**, a diagram with dry-bulb temperature along the bottom, humidity ratio up the side, and curves of relative humidity, wet-bulb, enthalpy and dew point drawn across it. Any one point on the chart is a state of the air, and two properties fix it. The saturation curve, 100% relative humidity, bounds the chart; lines of constant wet-bulb slope down from it towards the right, nearly parallel to lines of constant enthalpy. A tower's process can be drawn on the chart as the air's path from its inlet state to its outlet state, rising in enthalpy and humidity towards the saturation curve. Charts are printed for sea-level pressure and for altitudes, and software and calculators give the same values; the formulas above reproduce them closely enough for tower work.

## The air leaving the tower

The air leaving a tower is warmer and wetter than the air entering, and usually close to saturated. This is an illustration. For CT-250 at its design point, a flow of about 10 kg/s of dry air, a liquid-to-air ratio of about 1.2 as Chapter 4 explains, enters with an enthalpy of about 72 kJ/kg and gains the 250 kW the water loses, leaving at about 97 kJ/kg. Saturated air with that enthalpy is at about 29.5 °C and carries about 26.4 g/kg of water vapour. Each kilogram of dry air has therefore picked up about 12.3 g of water, about 0.12 kg/s in all, which is the evaporation Chapter 1 discussed.

Leaving near saturation, the exhaust air forms a visible **plume** when it mixes with cooler outside air and its vapour condenses into fog, much as breath does on a cold morning. The plume is water, not smoke, but it can be alarming to neighbours, can ice surfaces in cold climates, and carries any drift droplets that escape the eliminators, which is why Chapter 9 considers where it goes.

## Weather through the year

The design wet-bulb sizes the tower, but the tower spends most of its life in milder weather. Through a typical year, the wet-bulb varies with the season and through each day, and the tower's cold water follows it, warmer on humid summer days, cooler at night and in winter. The annual pattern decides how much energy the fans use and how much water evaporates, which Chapters 5 and 8 estimate, and it is described by the site's hourly climate data or by a table of hours in each wet-bulb band. A plant that values cold water can also use the cooler months: with the fans controlled to hold a set cold-water temperature, the tower simply runs its fans more slowly when the wet-bulb is low.

## Altitude

The formulas above assume sea-level pressure. At altitude, the total pressure is lower, the humidity ratio for the same vapour pressure is higher, and psychrometric properties shift. For most Australian industrial sites, near sea level, the effect is small, but at an elevated inland site the calculation should use the site's actual atmospheric pressure. Towers are rated by their makers for the stated pressure, and a selection at the wrong altitude can be off by a noticeable margin.

## Measuring humidity on site

On site, wet-bulb temperature is measured with an aspirated psychrometer, two thermometers, one with a wetted wick, in a fan-driven air flow, or with an electronic relative humidity and temperature sensor whose readings are converted with the formulas above. For checking a tower's performance, as Chapter 10 describes, the wet-bulb is measured in the air actually entering the tower, upwind and away from its exhaust, because air that has passed through the tower once and been drawn back in is warmer and wetter, which Chapter 9 covers. A sensor on the roof beside the tower's discharge, or in a plant room, does not measure the tower's inlet air, and a building management system that controls the tower from such a sensor will make poor decisions on exactly the days that matter. The sensor's position belongs on the tower's drawings, with a note saying why it is there.

## Exercise: an inland site

A sister plant inland sees summer afternoons of 38 °C at about 20% relative humidity. Using the formulas, what are the humidity ratio, enthalpy and approximate wet-bulb? How would a tower there compare with CT-250 on its design day?

**Worked answer.** p_sat(38 °C) ≈ 6.62 kPa; p_v ≈ 0.20 × 6.62 ≈ 1.32 kPa; W ≈ 0.622 × 1.32 ÷ (101.3 − 1.32) ≈ **8.2 g/kg**; h ≈ 1.006 × 38 + 0.0082 × (2,501 + 1.86 × 38) ≈ **59.4 kJ/kg**. The wet-bulb, by the iterative calculation, is about **21 °C**.

Although the inland afternoon is 3 K hotter than CT-250's design day, its wet-bulb is about 3 K lower, so a tower of the same size would deliver colder water, or a smaller tower would do the same duty. Dry inland heat is a tower's best weather, which is why evaporative cooling is so widely used in Australia's inland. The same tower on a humid tropical coast, where summer wet-bulbs run higher, would need to be larger for the same duty, and its selection would start from that site's own design wet-bulb.
