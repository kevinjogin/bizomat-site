---
book: condensation-control-by-the-numbers
chapterSlug: cold-surfaces-and-the-night-sky
order: 2
title: "Cold surfaces and the night sky"
description: "Why surfaces fall below air temperature, how a clear night sky cools an enclosure roof by radiation, how much water then forms, and why a heater alone may not stop it."
draft: false
---

Condensation needs two things: air with a dew point, and a surface colder than that dew point. Chapter 1 dealt with the air. This chapter deals with the surface, and in particular with the question that surprises people most: how can the steel roof of an outdoor cabinet become colder than the air around it, with nothing cold nearby?

The answer is radiation. On a clear night the sky is a very cold surface, and everything that can see it loses heat to it. This chapter works out how cold CC-7's roof gets, what that means for the water inside, which other surfaces at PS-7 run cold, and why the first attempted fix for the dripping roof was aimed at the wrong cause.

## How a surface gets colder than the air

A surface's temperature is set by a balance of heat flows. Heat arrives by convection from the air on each side, by conduction from whatever the surface touches, and by radiation from everything it can see. Heat leaves by the same routes. In still conditions with no radiation, every surface in a room drifts to the air temperature. A surface runs colder than the air only when it loses heat by some route the air cannot replace quickly enough. At a pump station there are four common routes:

1. **Radiation to a cold sky.** Any surface facing upwards on a clear night.
2. **Contact with cold water.** Pipes, pumps and valve bodies carrying bore or mains water cooler than the air.
3. **Contact with cold ground.** Gland plates over pits, cables rising from underground, plinths and conduits.
4. **Thermal lag.** Heavy objects that cooled overnight and lag behind the air when warm, humid air arrives in the morning.

This chapter concentrates on the first, because it is the least obvious and because it decides the design of CC-7's heater in Chapter 5. Chapter 7 deals with cold water pipes.

## Thermal radiation and the sky

Every surface emits thermal radiation at a rate set by its absolute temperature. For a perfect emitter, a black body, the rate is σT⁴ per square metre, where σ = 5.670 × 10⁻⁸ W/m²·K⁴ is the Stefan–Boltzmann constant. Real surfaces emit a fraction ε of that, their **emissivity**. At the temperatures of enclosures and buildings the radiation is in the infrared, at wavelengths around 10 µm, and nearly all paints, including powder coats of every colour, have emissivities of about 0.9 there. Colour matters for absorbing sunlight, but not for emitting at night. Bare metals and metallised foils are different: polished aluminium foil has an emissivity of about 0.05 to 0.1.

Two surfaces facing each other exchange radiation, and the net flow goes from the hotter to the colder. For a small surface facing large surroundings, the net loss per square metre is εσ(T_s⁴ − T_surr⁴). The question is what the surroundings are for a roof facing upwards. The answer is the sky, and on a clear night the sky radiates as if it were well below the air temperature, because the atmosphere is partly transparent in the infrared: some of the roof's radiation escapes straight to space, and only the water vapour and carbon dioxide in the air send radiation back. Under cloud, the cloud base is a nearly black surface only a little colder than the air near the ground, and the effect mostly disappears.

The effective sky temperature on a clear night depends on the humidity and temperature of the atmosphere above, and it is commonly ten to thirty kelvin below the air temperature at ground level. For PS-7 this book assumes a **sky 20 K below the air** on a clear night and 5 K below under cloud. These are assumptions for the illustration, not measurements; a real design would use local data or measure it with a pyrgeometer or with a test panel.

## How cold CC-7's roof gets

This is an illustration. On a still, clear summer night at PS-7, the air is at 20 °C and 95% RH, with a dew point of 19.2 °C. The cabinet is on standby, dissipating 30 W, and its inside air sits about 1.7 K above the outside air, at 21.7 °C. The roof is 1.5 mm powder-coated steel, thin enough that its inner and outer faces are at the same temperature. Its heat balance per square metre has three terms.

```figure
type: formula
title: Heat balance on CC-7's roof at night
formula: h_o (T_a − T_r) + h_i (T_i − T_r) = ε σ (T_r⁴ − T_sky⁴)
caption: Convection from the outside air and from the inside air balances the net radiation to the sky. Temperatures in the radiation term are absolute. Solved by iteration.
- T_r | roof temperature
- T_a, T_i | outside air 20 °C and inside air 21.7 °C
- T_sky | effective sky temperature, 0 °C on a clear night (assumed)
- h_o, h_i | convection coefficients, 4 and 3 W/m²·K for still air (assumed)
- ε | emissivity of powder coat, 0.9
step: T_r = 12.7 °C: convection in 29.3 + 27.1 = 56.4 W/m², radiation out 56.4 W/m²
step: the roof sits 7.3 K below the air and 6.5 K below the dew point
```

A roof 6.5 K below the dew point is not a marginal case. Its outer face gathers dew like a car windscreen, which does no harm. Its inner face is in contact with the cabinet's own air, which has the same dew point as the outside air if the cabinet exchanges air freely, as Chapter 1's logged data showed. That inner face gathers water too, and water on the inside of a roof drips.

The [radiant heat loss tool](/tools/radiant-heat/) calculates the net radiant exchange between a surface and large surroundings from the area, emissivity and the two temperatures. Entering CC-7's roof area of 0.32 m², an emissivity of 0.9, a surface temperature of 12.7 °C and surroundings at 0 °C to represent the sky gives about **18 W**, which matches the balance above: a cabinet roof the size of a small table radiates away more than half the cabinet's standby dissipation.

### How the conditions change the result

The same balance gives the roof temperature under other conditions.

```figure
type: compare
title: CC-7's roof temperature at night with 20 °C air, by condition
cols: Roof temperature | Below the air | Against the 19.2 °C dew point
rowhead: Condition
caption: This is an illustration with assumed sky temperatures and convection coefficients. Clear, still nights are the worst case. A low-emissivity surface barely cools, but no practical cabinet finish has one.
- *Clear sky, still air, powder coat | 12.7 °C | 7.3 K | 6.5 K below
- Clear sky, light wind (h_o = 12) | 15.6 °C | 4.4 K | 3.6 K below
- Cloudy sky (5 K below air) | 18.4 °C | 1.7 K | 0.8 K below
- Clear sky, polished foil (ε = 0.1) | 19.3 °C | 0.7 K | 0.1 K above
```

Wind helps, because it brings more heat from the air to the roof, but even a breeze leaves the roof well below the dew point. Cloud helps more. A low-emissivity surface would help most of all, but a bare foil roof is not durable outdoors and would corrode or dull within months. The useful lesson from the last row is the principle behind a **canopy** or rain hood: if the roof can be made to see something warmer than the sky, it stops radiating so strongly.

## How much water forms

The potential condensation rate on a surface below the dew point is high. Using the analogy between heat and mass transfer, the rate of condensation per square metre is about h ÷ c_p times the difference in mixing ratio between the air and saturated air at the surface temperature. For the inner face of CC-7's roof, with h_i = 3 W/m²·K, inside air at a mixing ratio of 13.9 g/kg and saturated air at 12.7 °C at about 9.1 g/kg, that is roughly **52 g per square metre per hour**, enough to cover the roof's 0.32 m² with about 130 g in an 8-hour night.

In a closed cabinet that rate cannot be sustained, because the cabinet's air soon runs out of water. Air at 20 °C and 95% RH holds 16.4 g/m³; saturated air at 12.7 °C holds 11.1 g/m³. Each time the cabinet's 0.27 m³ of air is cooled against the roof, it can give up only 0.27 × (16.4 − 11.1) ≈ **1.4 g**. The total that condenses in a night therefore depends on how often the air is replaced by new moist air from outside. If CC-7 exchanged half its air volume an hour with the outside through its seals and gaps, an assumed figure for the illustration, it would collect about 0.5 × 0.27 × 8 × 5.3 ≈ **5.7 g** on the roof in an 8-hour night. That is small in mass, but it forms on the one surface directly above the drive, and a few grams of water dripping onto a drive's cooling slots is enough to cause a fault.

```figure
type: stats
title: CC-7's roof on a still, clear summer night
caption: This is an illustration. The supply of moist air, not the cold surface, limits how much water forms; the paths that supply it are the subject of Chapter 3.
- 12.7 °C | roof temperature, 6.5 K below the dew point
- 18 W | radiated by the 0.32 m² roof to the sky
- 1.4 g | the most one fill of cabinet air can give up
- 5.7 g | collected in a night at an assumed 0.5 air changes an hour
```

## Why heating the air is not enough

The obvious response is to put a heater in the cabinet. Heating the inside air raises the inner convection term, but with still air inside, the inner film is a poor conductor of heat and the sky keeps pulling the roof down. The balance shows how little a heater alone achieves, and what changes when a canopy is added and the heater has a fan.

```figure
type: compare
title: Roof inner surface temperature with heating and a canopy, 20 °C clear night
cols: No canopy | Canopy over the roof
rowhead: Inside air and circulation
caption: This is an illustration. Dew point 19.2 °C. The canopy is a separate sheet above the roof, itself cooled by the sky to about 12.8 °C, so the roof sees a surface 7 K below the air instead of 20 K. Only a canopy combined with a heater that stirs the air keeps the roof above the dew point.
- Standby only, still air (+1.7 K, h_i = 3) | 12.7 °C | 17.5 °C
- Heated +5 K, still air (h_i = 3) | 13.5 °C | 18.3 °C
- Heated +5 K, fan-stirred air (h_i = 8) | 16.9 °C | *20.3 °C
- Heated +8 K, fan-stirred air (h_i = 8) | 18.3 °C | *21.7 °C
```

Two changes work together. The canopy makes the roof radiate to a warmer surface, and a fan heater raises the inner convection coefficient so that the warm air actually reaches the roof. With both, holding the inside air 8 K above the outside air keeps the roof's inner face at 21.7 °C, 2.5 K above the dew point. Without the canopy, even a fan heater holding +8 K leaves the roof below the dew point. Chapter 5 sizes the heater on this basis.

### The other cold surfaces at PS-7

The same reasoning finds the other surfaces at risk at PS-7:

- **The door.** It faces sideways and sees about half sky and half ground, so it cools less than the roof, but on a clear night it still runs a few kelvin below the air.
- **The gland plate.** It sits above the cable pit, whose air is near the soil temperature of about 18 °C in summer. On summer nights that is close to the dew point; in the morning, when warm humid air arrives, it lags behind.
- **The cable cores.** Cables rising from underground arrive at close to soil temperature and can carry a film of condensate into terminal blocks.
- **The pump room's delivery main.** At 17 °C it is colder than the summer dew point day and night, and it is the subject of Chapter 7.

### Morning: the surfaces that lag

Thermal lag needs its own mention because it catches equipment that is perfectly dry at night. When the sun rises and warm, humid air moves in, light objects follow the air closely but heavy ones do not. A lumped object's temperature follows a steadily rising air temperature with a lag equal to the rate of rise multiplied by its time constant, which is its heat capacity divided by its surface heat-transfer conductance.

Take the drive's aluminium heat sink, assumed for the illustration to have a mass of 4 kg and an exposed area of 0.6 m². Its heat capacity is about 4 × 900 = 3,600 J/K; with still air at h = 4 W/m²·K its conductance to the air is 2.4 W/K, so its time constant is 3,600 ÷ 2.4 = 1,500 s, or 25 minutes. If the cabinet air warms at 2 K an hour after dawn, the heat sink lags about 2 × 25 ÷ 60 ≈ **0.8 K** behind it. On a morning when the air's dew point margin is under a kelvin, which Chapter 1 showed is common near the coast, the heat sink's fins gather a film of water just as the drive is about to start. Heavier items, such as a pump casing full of cold water, lag far more.

## The error: sealing a roof that did not leak

This is an illustration. Soon after CC-7 was commissioned, the operators found water on top of the drive and a rust stain under the roof. The obvious explanation was a leak, and a contractor resealed the roof-to-body seam with silicone. The water came back. The seam was resealed a second time, more thoroughly, and the water came back again.

An engineer asked for the dates of the wet mornings and compared them with the weather station's records. Every wet morning followed a clear, still night, and no wet morning followed a rainy one. A leak would have done the opposite. A thermocouple taped to the inner face of the roof and logged for a week settled it: on clear nights the roof fell to between 12 and 13 °C while the cabinet's air dew point stayed between 18 and 20 °C. On cloudy nights the roof stayed within a kelvin or two of the air and no water formed.

The water was condensation, formed by radiation to the sky and supplied by moist air entering the cabinet. The fix had three parts: a canopy over the roof, a fan heater (Chapter 5) and the sealing of the real air path (Chapter 3). The lesson the business recorded was to look at the weather pattern before resealing anything: rain leaks follow rain, and condensation follows clear, still, humid nights.

## Exercise: a roof that is not yet in balance

Take CC-7's roof at 15 °C on the clear night described above: outside air 20 °C, inside air 21.7 °C, sky 0 °C, emissivity 0.9, h_o = 4 and h_i = 3 W/m²·K. Calculate each heat flow per square metre and say whether the roof will warm or cool from 15 °C.

**Worked answer.** Convection from outside: 4 × (20 − 15) = **20.0 W/m²** into the roof. Convection from inside: 3 × (21.7 − 15) = **20.1 W/m²** into the roof. Net radiation to the sky: 0.9 × 5.670 × 10⁻⁸ × (288.15⁴ − 273.15⁴) ≈ **67.7 W/m²** out of the roof. The roof loses 67.7 − 40.1 = 27.6 W/m² more than it gains, so it **cools** further. As it cools, the convection terms grow and the radiation term shrinks, and the balance is reached at about 12.7 °C, as calculated in the chapter. The exercise shows why the radiation term dominates on clear nights: it takes a temperature difference of several kelvin across two weak convection films to replace what the roof radiates.
