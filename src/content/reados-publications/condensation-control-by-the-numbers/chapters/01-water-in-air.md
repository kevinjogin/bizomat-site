---
book: condensation-control-by-the-numbers
chapterSlug: water-in-air-vapour-pressure-and-dew-point
order: 1
title: "Water in air: vapour pressure, humidity and dew point"
description: "What vapour pressure is, why it depends only on temperature, how relative humidity, dew point and absolute humidity follow from it, and why dew point is the number to watch."
draft: false
---

Air always carries some water as vapour, an invisible gas mixed with the nitrogen and oxygen. How much it can carry depends on temperature, and the amount it does carry depends on where it has been. When moist air meets a surface colder than a certain temperature, some of the vapour turns to liquid on that surface. That temperature is the dew point, and every calculation in this book comes back to it.

This chapter sets out the quantities: vapour pressure, saturation, relative humidity, dew point, absolute humidity and the mixing ratio. It gives the formulas used throughout the book, checks how accurate they are, applies them to the weather around PS-7's control cabinet, and shows how a reassuring relative humidity reading led a technician to the wrong conclusion.

## Vapour pressure and saturation

Put a dish of water in a closed box of dry air and wait. Water molecules leave the surface, because some of them always have enough energy to escape, and the vapour in the box builds up. Molecules in the vapour also strike the surface and stick. After a while the two rates match and the amount of vapour stops changing. The partial pressure the vapour then exerts is the **saturation vapour pressure**, written p_s. It depends only on temperature, not on how much air is in the box or what else the air contains.

Thermal physics explains why. A water molecule's escape needs energy, and the share of molecules with enough energy rises steeply with temperature, following the Boltzmann factor. At equilibrium the liquid and the vapour have equal chemical potential, and that condition fixes the vapour pressure at each temperature. The result is the **Clausius–Clapeyron relation**: the logarithm of the vapour pressure rises in proportion to the latent heat of evaporation divided by the square of the absolute temperature. Near room temperature it means that the saturation vapour pressure rises by about **6.4% for each kelvin**, roughly doubling for every 11 K.

Two practical facts follow. Warm air can hold far more water than cold air: saturated air at 29 °C holds about 28.7 grams of vapour per cubic metre, and at 7 °C only 7.7. And when air cools with its water content unchanged, it reaches saturation at some point, after which any further cooling forces water out as liquid.

### The Magnus formula

The saturation vapour pressure of water has been measured very precisely, and the reference formulation is the IAPWS-IF97 equation used in steam tables and in NIST's data. For everyday work, a much simpler formula of the Magnus form is accurate enough. This book uses the coefficients published by Alduchov and Eskridge in 1996.

```figure
type: formula
title: Saturation vapour pressure and dew point over water
formula: p_s = 610.94 × exp(17.625 t ÷ (t + 243.04))
caption: Magnus form with the Alduchov–Eskridge coefficients. t in °C, pressures in Pa. The inverse gives the dew point from the actual vapour pressure p_v.
- p_s | saturation vapour pressure at temperature t, Pa
- p_v | actual partial pressure of water vapour, Pa
- RH | relative humidity, p_v ÷ p_s(t) × 100%
- γ | ln(p_v ÷ 610.94)
step: dew point t_d = 243.04 γ ÷ (17.625 − γ)
step: p_s(20 °C) = 2,333 Pa; IAPWS-IF97 gives 2,339 Pa, a difference of 0.25%
```

The check against IAPWS-IF97 shows how good the simple formula is over the range that matters for enclosures and plant rooms.

```figure
type: compare
title: Magnus formula against the reference formulation
cols: IAPWS-IF97, Pa | Magnus, Pa | Difference
rowhead: Temperature
caption: The reference values agree with NIST's water saturation data. Over 0 to 50 °C the Magnus formula is within 0.25%, which shifts a dew point by less than 0.05 K.
- 0 °C | 611.2 | 610.9 | −0.04%
- 10 °C | 1,228.2 | 1,226.0 | −0.18%
- 20 °C | 2,339.2 | 2,333.4 | −0.25%
- 30 °C | 4,246.7 | 4,236.7 | −0.24%
- 40 °C | 7,384.4 | 7,374.7 | −0.13%
- 50 °C | 12,351.3 | 12,360.6 | +0.08%
```

A dew point error of 0.05 K is far smaller than the error of any humidity sensor a pump station is likely to have, so the Magnus formula is the right tool here. Below 0 °C, vapour in equilibrium with ice has a lower pressure than over supercooled water, and a separate set of coefficients applies; the frost point is then the threshold. PS-7 is near the coast and rarely sees a frost, so this book stays above 0 °C.

## Four ways to say how wet the air is

Once the vapour pressure is known, four related quantities follow, and each is useful for a different question.

**Relative humidity** (RH) is the actual vapour pressure as a percentage of the saturation vapour pressure at the air's own temperature. It says how close the air is to saturation, which matters for anything that responds to dampness: salts, paper, wood, corrosion films and humidity sensors themselves. But it changes whenever the temperature changes, even if no water is added or removed.

**Dew point** is the temperature at which the air's actual vapour pressure would be the saturation pressure. Cool the air, or a surface in contact with it, below the dew point and water condenses. As long as no water is added or taken away, the dew point stays the same when the air is warmed or cooled. That makes it the number to carry from one place to another.

**Absolute humidity** is the mass of vapour in a cubic metre of air, found from the vapour pressure with the gas law for water vapour: ρ_v = p_v ÷ (R_v T), with R_v = 461.5 J/kg·K and T in kelvin. It answers "how many grams of water are in this enclosure?"

**Mixing ratio** is the mass of vapour per kilogram of dry air, 621.98 × p_v ÷ (p − p_v) grams per kilogram at total pressure p. Unlike absolute humidity it does not change when air expands or is compressed, which makes it the natural quantity for mass balances and for the condensation-rate estimates in Chapter 7.

### The case: PS-7's weather

This is an illustration. The figure applies the formulas to four typical conditions at PS-7, chosen for the illustration rather than taken from a weather record.

```figure
type: compare
title: Water in the air around PS-7 in four typical conditions
cols: Vapour pressure | Dew point | Absolute humidity | Mixing ratio
rowhead: Condition
caption: This is an illustration. The summer night is the condition that matters most: the air is within 0.8 K of saturation, so any surface even slightly colder than the air will gather water.
- Summer afternoon, 29 °C, 65% RH | 2,600 Pa | 21.8 °C | 18.64 g/m³ | 16.38 g/kg
- *Summer night, 20 °C, 95% RH | 2,217 Pa | 19.2 °C | 16.39 g/m³ | 13.91 g/kg
- Winter afternoon, 18 °C, 60% RH | 1,236 Pa | 10.1 °C | 9.20 g/m³ | 7.68 g/kg
- Winter night, 7 °C, 95% RH | 951 Pa | 6.3 °C | 7.35 g/m³ | 5.89 g/kg
```

Three things stand out. First, the summer afternoon air holds the most water, but its relative humidity is the lowest; it is far from saturated only because it is warm. Second, at night the relative humidity climbs to 95% with less water in the air than in the afternoon, because the temperature has fallen. Third, summer air carries about twice as much water as winter air. The summer night, with a dew point only 0.8 K below the air temperature, is the condition this book keeps returning to.

## Dew point is conserved; relative humidity is not

Suppose the cabinet shuts its door on a summer afternoon and traps 0.27 m³ of air at 29 °C and 65% RH, which is CC-7's free internal volume after the equipment is allowed for. That air contains 0.27 × 18.64 = **5.03 g** of water and has a dew point of 21.8 °C. As it cools in the evening, its relative humidity rises: at 25 °C it is about 82%, and at 21.8 °C it reaches 100%. Below that, the air cannot hold its water. If it cooled all the way to 20 °C, the arithmetic would give a relative humidity of 111%, which is impossible; instead the excess condenses on the coldest surfaces until the air is just saturated at 20 °C.

The amount is small in grams, but it all lands in one place. On a winter night, if the same trapped afternoon air cooled to 7 °C, saturated air at 7 °C holds only 7.74 g/m³, so 0.27 × (18.64 − 7.74) = **2.94 g** of water would have to come out. That is about half a teaspoon, deposited as a film on the coldest steel, which is usually the roof and the door.

The margin between a surface's temperature and the dew point is what decides whether water forms. At a given air temperature the margin shrinks rapidly as relative humidity rises.

```figure
type: bars
title: Dew point margin of air at 20 °C, by relative humidity
unit: K
max: 12
caption: The air temperature minus its dew point. At 90% RH a surface only 1.7 K colder than the air gathers water; at 50% RH it would have to be 10.7 K colder. Near saturation, each 1% of RH moves the dew point by about 0.18 K.
- 50% RH | 10.7
- 60% RH | 8.0
- 70% RH | 5.6
- 80% RH | 3.6
- * 90% RH | 1.7
- 95% RH | 0.8
```

The steep end of that chart explains why condensation is common in coastal and tropical climates and on cool nights everywhere. Night air near the coast often sits above 90% RH, and on such nights almost any surface that loses heat by radiation, or is cooled by contact with cold water or cold ground, falls below the dew point.

## Grams, not percentages

It is worth getting used to thinking of humidity problems in grams of water, because the means of control (heaters, desiccants, vents and drains) are judged by how much water they handle. A few reference numbers help.

- A cubic metre of saturated air holds 7.7 g of water at 7 °C, 17.3 g at 20 °C and 28.7 g at 29 °C.
- CC-7's free air volume of 0.27 m³ holds about 4 to 5 g in typical summer conditions.
- A film of water 0.1 mm thick over one square metre is 100 g.
- A small sachet of silica gel of the kind found in a shoe box adsorbs a gram or two.

These numbers show that the water held in an enclosure's own air is rarely the problem. A sealed enclosure that only ever contained its original air could produce at most a few grams of condensate, once. Puddles of tens or hundreds of grams mean that moist air is being exchanged, over and over, through some path. Chapter 3 finds the paths.

### Heating does not dry air

A point that trips up many people: heating air lowers its relative humidity but does not remove any water. The dew point stays where it was. Heating an enclosure works because it keeps the surfaces inside above the dew point and keeps the relative humidity at the components low, not because it dries the air. If the heater stops, or if a surface somewhere in the enclosure stays cold despite the heater, condensation returns. Chapters 2 and 5 show that this is exactly what happens on an enclosure's roof on a clear night.

## Turning weather data into design conditions

Most sites have no humidity record of their own when a cabinet is first specified, so designers start from public climate statistics or from a nearby automatic weather station. Those sources usually give temperature with either relative humidity or dew point, often at fixed times of day such as 9 am and 3 pm, and sometimes as monthly means. Three habits make such data useful for condensation work.

First, convert everything to dew point before comparing conditions. A 3 pm humidity of 60% and a 9 am humidity of 80% can describe almost the same amount of water, and only the dew points show it. Over a day near the coast the dew point often changes by only two or three kelvin while the relative humidity swings by thirty or forty percentage points.

Second, design for the night, not the monthly mean. Means smooth away exactly the hours that matter: the still, clear, humid hours before dawn, when the air is coolest and surfaces cool further by radiation. If hourly records are available, the useful statistic is the number of hours per year in which the dew point is within a kelvin or two of the air temperature.

Third, remember that the air inside a building, pit or enclosure is not the weather. A pump room with wet floors, an open sump or a leaking gland has its own, higher dew point, and an underground pit is often close to saturation at the temperature of the soil. Chapter 3 shows that the pit under PS-7's cabinet turns out to matter more than the weather above it.

## The error: a reassuring humidity reading

This is an illustration. CC-7's controller has a combined temperature and humidity sensor on its DIN rail, and its reading is logged by the telemetry system. During a site visit on a summer afternoon, a technician investigating corrosion on the cabinet's terminals found the display showing **46.6 °C and 25% RH**, and recorded "cabinet air dry, condensation unlikely" in the work order.

The reading was correct, but the conclusion was not. Air at 46.6 °C and 25% RH has a vapour pressure of 0.25 × 10,400 ≈ 2,600 Pa, the same as the outside afternoon air, and the same dew point of 21.8 °C. The cabinet's air was warm because the drive was running, not because it was dry. When the pump stopped in the evening and the steel cooled towards the night air and below, the same water would meet surfaces colder than 21.8 °C.

The engineer reviewing the work order caught the mistake by converting the logged temperature and humidity to dew point and plotting it beside the outside dew point from the utility's weather station. The two traces lay almost on top of each other, which showed that the cabinet was exchanging air freely with the outside. The corrosion was then traced, as later chapters describe, to condensation at night.

The business changed its practice in three ways:

- Telemetry now calculates and logs the **dew point** inside the cabinet, not only the relative humidity.
- Work orders that mention humidity record the **dew point margin**, the coldest measured surface temperature minus the dew point, rather than a relative humidity.
- Inside and outside dew points are compared before any judgement is made about whether an enclosure is sealed.

## Exercise: a winter night

On a winter night at PS-7, the air outside is at 7 °C and 95% RH. With only the 30 W standby load, CC-7's inside air sits about 1.7 K above the outside air. Assume the inside air has the same dew point as the outside air. What is the inside relative humidity and the dew point margin of the inside air, and would a roof panel whose inner face is 3 K colder than the inside air gather water?

**Worked answer.** The outside vapour pressure is 0.95 × p_s(7 °C) = 0.95 × 1,001 ≈ **951 Pa**, so the dew point is **6.3 °C**. Inside, at 7 + 1.7 = 8.7 °C, the saturation pressure is about 1,124 Pa, so the relative humidity is 951 ÷ 1,124 ≈ **84.6%** and the inside air's dew point margin is 8.7 − 6.3 = **2.4 K**. A roof panel 3 K colder than the inside air is at about 5.7 °C, where the saturation pressure is 915 Pa. That is less than the 951 Pa in the air, so the panel is **below the dew point** by about 0.6 K, and water condenses on it. The 84.6% at the sensor does not reveal this; only a surface temperature compared with the dew point does.
