---
title: "Psychrometrics for HVAC and process air: humidity, dew point and the loads you cannot feel"
description: "A practical guide to moist air: dry-bulb, wet-bulb, dew point, humidity ratio and enthalpy, the main processes on the psychrometric chart, sensible and latent loads, and condensation."
publishDate: 2026-10-16
category: "Engineering"
tags:
  - design
  - operations
  - process-improvement
author: "KEVOS"
featured: false
draft: false
---

Air conditioning is usually discussed in terms of temperature. Is it too hot? Is it too cold? Many of the most stubborn comfort, quality and building problems, however, are about **moisture** in the air: offices that feel clammy even though the thermostat reads 23 °C, chilled water pipes dripping onto ceilings, mould behind cool-room panels, paint finishes that blush, products that absorb moisture in storage, evaporative coolers that work brilliantly in some towns and poorly in others. Understanding these problems requires **psychrometrics**: the study of the properties of moist air and how they change as air is heated, cooled, humidified, dehumidified and mixed.

Psychrometrics can look intimidating, mostly because of the psychrometric chart, a dense graph with curved and sloping lines. Its core ideas are straightforward, and a modest understanding helps owners, facility managers and engineers specify systems better, diagnose problems faster and avoid expensive mistakes such as oversized air conditioners and uninsulated cold pipes.

This article explains, in general terms, the properties of moist air, how to read the psychrometric chart, the main air-conditioning processes, the difference between sensible and latent loads, how to estimate them, why condensation occurs and how to troubleshoot common humidity problems. It is general information; HVAC design should be carried out by qualified practitioners using appropriate data and standards.

## The properties of moist air

Atmospheric air is a mixture of dry air and water vapour. Several properties describe its state:

- **Dry-bulb temperature** is the temperature measured by an ordinary thermometer, the one most people mean by "temperature".
- **Wet-bulb temperature** is the temperature read by a thermometer with a wetted wick in moving air. Evaporation cools the wick, so the wet-bulb temperature is lower than the dry-bulb temperature, except when the air is saturated. The drier the air, the greater the difference.
- **Dew point** is the temperature at which the air's water vapour would start to condense if the air were cooled without changing its moisture content. Any surface colder than the dew point will collect condensation.
- **Relative humidity** is the amount of water vapour in the air compared with the maximum it could hold at that temperature, expressed as a percentage. Because warm air can hold more moisture than cold air, relative humidity changes when air is heated or cooled even if the moisture content does not.
- **Humidity ratio**, also called moisture content, is the mass of water vapour per kilogram of dry air, often expressed in grams per kilogram. Unlike relative humidity, it does not change with temperature alone.
- **Enthalpy** is the total heat content of the air, including both the sensible heat associated with its temperature and the latent heat associated with its moisture, usually expressed in kilojoules per kilogram of dry air.
- **Specific volume** is the volume occupied by a kilogram of dry air with its associated moisture, which matters when converting volume flow rates to mass flow rates.

Any two independent properties fix the state of the air, and the others can then be read from a psychrometric chart or calculated.

## Reading the psychrometric chart

A typical psychrometric chart, drawn for a particular atmospheric pressure, shows:

- **dry-bulb temperature** along the horizontal axis;
- **humidity ratio** up the vertical axis, usually on the right;
- the **saturation curve**, at 100% relative humidity, curving across the top left;
- curved lines of constant **relative humidity** below the saturation curve;
- sloping lines of constant **wet-bulb temperature** and, nearly parallel to them, lines of constant **enthalpy**; and
- steeper lines of constant **specific volume**.

Finding the dew point is simple: from the air's state point, move horizontally left at constant humidity ratio until reaching the saturation curve, and read the temperature there.

## The main air processes

| Process | What happens | On the chart |
|---|---|---|
| Sensible heating | Temperature rises, moisture content unchanged; relative humidity falls | Horizontal line to the right |
| Sensible cooling (above dew point) | Temperature falls, moisture content unchanged; relative humidity rises | Horizontal line to the left |
| Cooling and dehumidification | Air passes over a coil colder than its dew point; temperature and moisture both fall | Line down and to the left towards the coil's effective surface temperature |
| Heating and humidification | Moisture and temperature both rise | Line up and to the right |
| Evaporative cooling | Water evaporates into the air; temperature falls, moisture rises, total heat roughly unchanged | Line up and to the left along a line of roughly constant wet-bulb temperature |
| Mixing of air streams | Two streams combine | The mixed state lies on the straight line between them, closer to the larger stream |

These processes explain everyday observations. Heating winter air dries it out in relative terms, which is why heated buildings can feel dry. A cooling coil that runs below the dew point removes moisture, which is why air conditioners drain water. Evaporative coolers work well in dry inland climates, where the gap between dry-bulb and wet-bulb temperatures is large, and much less well in humid coastal conditions, where the gap is small.

## Sensible and latent loads

Air-conditioning loads have two components:

- **Sensible load** changes the air temperature. It comes from sources such as solar gain, lighting, equipment, people and heat conduction through walls and roofs.
- **Latent load** changes the moisture content. It comes from people's breathing and perspiration, cooking, wet processes, washdowns and humid outdoor air entering the building.

The **sensible heat ratio** is the sensible load divided by the total load. Spaces with high latent loads, such as kitchens, gyms, food production areas and buildings bringing in large amounts of humid outside air, need equipment and controls that can remove moisture effectively, not just lower temperature.

### Estimating loads from airflow

For air near standard conditions, with a density of about 1.2 kg/m³, simple approximations are widely used:

- **Sensible heat (W)** ≈ 1.2 × airflow (L/s) × temperature difference (K).
- **Latent heat (W)** ≈ 3.0 × airflow (L/s) × difference in humidity ratio (g/kg).
- **Total heat (W)** ≈ 1.2 × airflow (L/s) × difference in enthalpy (kJ/kg).

The latent factor comes from multiplying the mass flow of air by the moisture removed and the latent heat of vaporisation of water, about 2,450 kJ/kg. These approximations are useful for checking designs and diagnosing systems; detailed design uses property data appropriate to the actual conditions and altitude.

## Condensation

Condensation forms whenever moist air meets a surface colder than its dew point. Common examples include:

- **chilled water and refrigerant pipes**, ducts and fittings without adequate insulation and vapour barriers;
- **cold-room and freezer panels**, especially at joints, doors and penetrations;
- **windows and metal frames** in cold weather;
- **roof sheeting** on cold nights, dripping onto stock or equipment; and
- **cold products** brought into warm, humid areas.

Condensation causes corrosion, mould, damaged insulation, ceiling stains, slip hazards and product damage. Prevention involves keeping surfaces above the dew point, typically with insulation that has a continuous **vapour barrier** on the warm side, or reducing the dew point of the surrounding air through dehumidification or ventilation control.

## Humidity in processes

Many processes need humidity controlled, not just temperature:

- **Coating and painting**, where high humidity or surfaces below the dew point cause defects; coating specifications often require the surface temperature to be a margin above the dew point.
- **Electronics assembly**, where very dry air increases static discharge risk.
- **Food, timber, paper and textiles**, which absorb or lose moisture with changes in humidity, affecting weight, dimensions and quality.
- **Storage** of moisture-sensitive materials.
- **Drying processes**, whose rate depends on the moisture-carrying capacity of the air.

## Humidity and energy use

Moisture has a large effect on energy consumption. Removing water vapour requires the cooling coil to condense it, and the latent heat released is significant: removing each gram of moisture from each kilogram of air takes roughly as much energy as cooling that air by about two and a half degrees. Bringing large volumes of humid outdoor air into a building can therefore dominate cooling loads in humid climates.

Several measures reduce this energy use:

- **Ventilate to need.** Supplying the outdoor air that occupants and processes actually require, rather than a fixed maximum, avoids conditioning unnecessary moist air.
- **Recover energy.** Energy recovery ventilators can transfer heat and moisture between exhaust and incoming air.
- **Control infiltration.** Sealing gaps and managing door openings stops unconditioned humid air entering.
- **Avoid overcooling.** Cooling air far below the temperature needed, then reheating it, wastes energy unless dehumidification genuinely requires it.

## Using the right chart and tools

Standard psychrometric charts are drawn for sea-level atmospheric pressure. At higher altitudes the relationships change slightly, so charts or software for the local pressure should be used for accurate design work. Many engineers now use psychrometric calculators and software, which compute properties directly and plot processes, but understanding the chart remains valuable for interpreting results and spotting errors.

## Troubleshooting humidity problems

Psychrometrics turns vague complaints into measurable questions. Useful steps include:

1. **Measure**: dry-bulb temperature and relative humidity, or wet-bulb, at the outdoor air intake, return air, supply air and in the problem area, using calibrated instruments or data loggers over time.
2. **Plot** the states on a chart or in software to find dew points, humidity ratios and enthalpies.
3. **Check the coil**: is the supply air leaving the cooling coil cool and dry enough to absorb the space's moisture load?
4. **Look for moisture sources**: infiltration, washdowns, open doors, cooking, processes and outdoor air quantities.
5. **Check control behaviour**: equipment that cycles on and off rapidly, often because it is oversized, may satisfy the thermostat before removing enough moisture, leaving spaces cool but clammy.

The [HVAC for commercial and industrial buildings](/insights/hvac-for-commercial-and-industrial-buildings/) article covers system types, efficiency and controls.

## A worked example

This is an illustrative example. The figures are hypothetical, and approximations are used for simplicity.

A food manufacturer's packing room is supplied with 1,500 L/s of conditioned air at 14 °C, and the room is held at 24 °C. The sensible cooling delivered is about 1.2 × 1,500 × (24 − 14) = 18,000 W, or 18 kW.

The supply air has a humidity ratio of about 8.5 g/kg, and the room air about 9.5 g/kg. The latent capacity of the supply air is about 3.0 × 1,500 × 1.0 = 4,500 W, or 4.5 kW. The sensible heat ratio is therefore about 18 ÷ (18 + 4.5), or 0.8.

Staff complain that the room feels damp, and condensation drips from chilled water pipes above the packing line. Measurements on a humid summer day show the room at 27 °C and 70% relative humidity. The dew point at that condition is about 21 °C, well above the 10 °C pipe surface temperature, so the pipes sweat. Investigation finds that a large roller door is often left open to a humid loading dock, adding moisture faster than the system removes it, and the pipe insulation has gaps where its vapour barrier is damaged.

The business installs a fast-acting door and an air curtain, repairs the insulation and its vapour barrier and adjusts the coil controls to provide more dehumidification. The room returns to about 24 °C and 55% relative humidity, giving a dew point of roughly 14 °C, still above the pipe temperature, which is why the repaired insulation remains essential, and the condensation stops.

## How this applies to a small Australian business

- **Measure humidity, not just temperature**, when comfort or quality problems arise.
- **Insulate cold pipes and ducts** with continuous vapour barriers.
- **Control moisture sources**: doors, washdowns, infiltration and outside air.
- **Choose cooling suited to the climate.** Evaporative cooling suits dry conditions; humid conditions need dehumidification.
- **Avoid oversized equipment**, which can short-cycle and leave spaces humid.
- **Specify humidity requirements** for processes such as coating and storage.

## Common mistakes

- **Treating humidity complaints as temperature problems.**
- **Uninsulated or poorly sealed cold surfaces.**
- **Using evaporative cooling in humid conditions** and expecting the same results as inland.
- **Ignoring the moisture brought in with outdoor air.**
- **Relying on uncalibrated humidity sensors.**
- **Painting or coating surfaces below or near the dew point.**

## Frequently asked questions

**Why does relative humidity rise when air cools?** Because cooler air can hold less water vapour. The moisture content stays the same, but the maximum possible falls, so the ratio rises until, at the dew point, it reaches 100%.

**What humidity is comfortable?** Comfort depends on temperature, air movement, clothing and activity, but many guides suggest moderate relative humidity, avoiding very dry and very humid extremes, for occupied spaces.

## Questions to ask

- What are the temperature, humidity and dew point in our problem areas, measured over time?
- Where are the moisture sources, and can they be reduced?
- Are cold surfaces insulated with intact vapour barriers?
- Is our cooling equipment able to remove the latent load, not just the sensible load?
- Do any of our processes need humidity limits specified and monitored?

## Bringing it together

Psychrometrics explains the behaviour of moist air through a handful of properties: dry-bulb and wet-bulb temperatures, dew point, relative humidity, humidity ratio and enthalpy. The psychrometric chart shows how heating, cooling, dehumidifying, humidifying, evaporative cooling and mixing change those properties. Separating sensible from latent loads, estimating them from airflow and understanding when surfaces fall below the dew point resolves many comfort, condensation and process problems that temperature alone cannot explain. The [cutting energy use in business premises](/insights/cutting-energy-use-in-business-premises/) article shows how better control of air conditioning also reduces energy costs.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations. HVAC design should be carried out by qualified practitioners using appropriate data and standards.*
