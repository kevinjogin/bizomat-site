---
book: rooftop-solar-for-factories-by-the-numbers
chapterSlug: sun-on-the-roof-and-the-yearly-yield
order: 4
title: "Sun on the roof and the yearly yield"
description: "How to turn solar irradiation, roof tilt and orientation into a yearly yield, build the loss chain and performance ratio, and check a supplier's yield estimate line by line."
draft: false
---

The power rating of an array tells you what it delivers in one set of laboratory conditions. The number that pays for it is the energy it delivers in a year, and that depends on how much sunlight reaches the modules, at what angle and temperature, and how much is lost between the cells and the factory's switchboard. Every supplier's proposal contains a yield estimate. Most are produced by simulation software and are only as good as the assumptions fed into it. This chapter shows how to build the estimate by hand, so that the assumptions can be seen and checked.

It explains irradiance and irradiation, the parts of sunlight and how tilt and orientation change what a module receives, the loss chain and the performance ratio, and the seasonal pattern. It works SF-90's yearly yield, and ends with a quick estimate that left out the losses altogether.

## Irradiance, irradiation and peak sun hours

Irradiance is power per unit area, in W/m²: the rate at which sunlight arrives at a given moment. Irradiation is energy per unit area, in kWh/m², the irradiance added up over a day, a month or a year. The two are easy to confuse because both are called "solar radiation" in casual use.

A day's irradiation in kWh/m² is numerically the same as the number of hours of 1,000 W/m² sunlight that would deliver it. That gives the industry's shorthand, peak sun hours. A day with 4.6 kWh/m² is a day of 4.6 peak sun hours. Since a module's rating is set at 1,000 W/m², a kilowatt of modules receiving 4.6 peak sun hours would deliver 4.6 kWh if it had no losses at all. It always has losses.

Sunlight reaching a surface has three parts:

- **Direct (beam) radiation** comes straight from the sun's disc and casts sharp shadows. It depends strongly on the angle between the sun and the surface.
- **Diffuse radiation** comes from the whole sky after scattering by air, cloud and aerosols. On a clear day it is a small share; under cloud it is almost everything.
- **Reflected radiation** comes from the ground or nearby surfaces. It matters for steeply tilted modules and for bifacial modules that collect light on their rear face; for a near-flat roof array it is small.

Weather stations and satellite records give global horizontal irradiation, the total on a horizontal surface. The Bureau of Meteorology publishes measured and satellite-derived daily solar exposure for Australian sites. Simulation software converts horizontal values to the plane of the array with a transposition model that splits direct and diffuse radiation and adds back each according to the module's tilt and orientation.

```figure
type: formula
title: Yield of a grid-connected array
formula: Direct radiation on the module ∝ cos θ, θ = angle between the sun's rays and the module's normal
formula: H_POA = H_horizontal × transposition factor
formula: E = P_STC × (H_POA ÷ 1 kW/m²) × PR
formula: PR = E ÷ [P_STC × (H_POA ÷ 1 kW/m²)] = product of (1 − each loss)
formula: Specific yield Y = E ÷ P_STC, kWh per kW per year
caption: H_POA is the irradiation on the plane of the array, P_STC the array's rating at standard test conditions and PR the performance ratio, the share of the ideal energy that actually arrives as alternating current. The transposition factor depends on site, tilt, orientation and the mix of direct and diffuse light.
- H | irradiation, kWh/m² per year
- P_STC | array rating, kW
- E | yearly AC energy, kWh
- PR | performance ratio, dimensionless
- Y | specific yield, kWh/kW per year
```

## Sun angles at Shepparton

Shepparton lies at about 36.4° south. At solar noon the sun stands 90° − 36.4° = 53.6° above the northern horizon at the equinoxes, 53.6° + 23.4° = 77.0° at the December solstice and 53.6° − 23.4° = 30.2° at the June solstice. In summer it rises well south of east and sets well south of west, so a north-facing module sees the early morning and late evening sun from behind its plane; in winter the sun stays low in the northern sky all day.

A module receives the most direct light when it faces the sun squarely. Its share of direct irradiance is cos θ: at 30° off the normal it still receives 86.6%, at 60° only 50%. For the most energy over a whole year, a fixed module at this latitude would face north at a tilt of about 30°. But a steeply tilted array on a near-flat factory roof needs frames, ballast or penetrations, casts shadows on the next row and catches much more wind. Most factory arrays lie close to the roof pitch and accept a smaller annual gain.

```figure
type: compare
title: SF-90's orientation and the assumed transposition factors
cols: Tilt | Orientation | Transposition factor | Yearly plane-of-array irradiation
rowhead: Part of the array
- Horizontal reference | 0° | — | 1.000 | 1,679 kWh/m²
- * Workshop roof, 180 modules | 5° | North | 1.025 | 1,721 kWh/m²
- Annex frames, 36 modules | 10° | North | 1.045 | 1,755 kWh/m²
- South face of the workshop, not used | 5° | South | 0.975 | 1,637 kWh/m²
- For comparison: annual optimum | about 30° | North | — | higher, but needs frames and space
caption: This is an illustration. Horizontal irradiation assumed at 4.60 kWh/m² a day, 1,679 kWh/m² a year. The factors are assumed values of the order a transposition model gives for low tilts at this latitude; a real project should take them from simulation with the site's weather file.
```

At low tilts, orientation matters surprisingly little. A 5° north-facing surface gains only about 2.5% over horizontal and a 5° south-facing surface loses about the same, so the south face of the workshop roof would deliver about 0.975 ÷ 1.025 = 95.1% of the north face's yield per kilowatt. That makes the south face a reasonable place for a later extension, an option the exercise explores.

## The loss chain

The performance ratio collects every loss between the plane-of-array irradiation and the alternating-current energy at the meter. A good estimate lists each loss separately, so that each can be questioned. SF-90's chain is set out below for the workshop roof, per kilowatt of modules.

```figure
type: steps
title: SF-90 workshop roof, from irradiation to AC energy, per kilowatt of modules
caption: This is an illustration. Each step multiplies the running total by (1 − loss). The losses are assumed values typical of a well-built commercial array and are justified in the chapters named.
- Plane-of-array irradiation | 1,721 kWh per kW; ideal energy at standard conditions
- Cell temperature, 6.4% (Chapter 3) | 1,610.8
- Soiling, 2% (Chapter 9) | 1,578.6
- Angle of incidence, spectrum and low light, 3% (Chapter 2) | 1,531.3
- Module mismatch and power tolerance, 1% (Chapter 6) | 1,515.9
- DC cables and connectors, 1% (Chapter 5) | 1,500.8
- Inverter conversion, 2% (Chapter 5) | 1,470.8
- AC cables to the switchboard, 0.5% | 1,463.4
- Availability, 0.5% (Chapter 8) | 1,456.1
- * Inverter clipping, 0.3% (Chapter 5) | 1,451.7 kWh per kW per year
```

The chain gives a performance ratio for the workshop roof of 1,451.7 ÷ 1,721 = 0.844. The annex frames, cooler and slightly better tilted, have a temperature loss of 4.7% and a performance ratio of 0.859, and deliver 1,754.6 × 0.859 = 1,507 kWh per kW.

Put together:

- Workshop roof: 75.60 kW × 1,451.7 = 109.75 MWh a year.
- Annex frames: 15.12 kW × 1,507 = 22.78 MWh a year.
- Whole array: 132.54 MWh a year, a specific yield of 132,540 ÷ 90.72 = 1,461 kWh per kW and an overall performance ratio of 0.846.

The supplier's first estimate, with the open-rack temperature on the workshop roof described in Chapter 3, was 134.53 MWh and 1,483 kWh per kW. The difference, 1.99 MWh a year, is entirely the temperature assumption.

A performance ratio in the low to mid 0.80s is typical of a well-designed modern array in a temperate climate. A proposal quoting 0.90 or more for a flush-mounted roof in northern Victoria deserves questions; one quoting below 0.75 suggests an unusual loss, such as heavy shading or a long cable run, that should be visible in the loss table.

## Light at low angles

One line in the loss chain, the 3% for angle of incidence, spectrum and low light, deserves a closer look, because on a near-flat roof much of the morning and evening light arrives at steep angles to the modules. Part of the light striking the front glass is reflected rather than transmitted, and the share grows quickly as the angle from the normal increases. For plain glass with a refractive index of about 1.53, the Fresnel equations give a reflection of about 4.3% at normal incidence, 4.5% at 30°, 5.4% at 45°, 9.3% at 60°, 17.6% at 70° and 25.8% at 75°.

Two things keep the loss modest over a year. First, light arriving at steep angles is already weak, because direct irradiance on the module falls with cos θ: at 75°, only 26% of the direct beam's irradiance reaches the plane at all, so even a quarter of that being reflected is a small share of the day's energy. Second, the 4.3% reflected at normal incidence is already allowed for in the module's rating, which is measured with light at normal incidence; only the extra reflection at larger angles is a loss. Anti-reflection coatings on the glass reduce both. The early-morning and late-afternoon light is also redder than midday light, because the longer path through the atmosphere scatters out blue. Silicon responds well to red and near-infrared light, so the spectral shift costs a crystalline silicon module little.

## Uncertainty and the P90 figure

A yield estimate is a central value. The sunshine in any one year can differ from the long-term average by several per cent, and the model, the weather data and the loss assumptions each carry their own uncertainty. Lenders and many buyers therefore ask for a P90 figure as well as the central or P50 figure: the yield that the array is expected to exceed in nine years out of ten.

The business assumed a year-to-year variation in irradiation with a standard deviation of 4% and a combined uncertainty in the model and losses of 3%. Treated as independent, these combine as √(0.04² + 0.03²) = 5.0%. For a normal distribution, the P90 lies 1.2816 standard deviations below the centre, so P90 = 132.54 × (1 − 1.2816 × 0.050) = 124.0 MWh. The P75 is 128.1 MWh. For the business case, the business tested the payback at both the P50 and the P90 yield in Chapter 10, so that an ordinary dull year would not come as a surprise.

```figure
type: bars
title: SF-90 assumed yearly energy at three levels of confidence
x: Level
y: Yearly AC energy, MWh
caption: This is an illustration. Central estimate 132.54 MWh; combined standard uncertainty 5.0% from an assumed 4% year-to-year variation and 3% model uncertainty, treated as normal and independent.
- * P50, central | 132.5
- P75 | 128.1
- P90 | 124.0
- P99 | 117.1
```

## Seasons and the daily profile

A yearly figure hides a strong seasonal swing. With the assumed monthly horizontal irradiation for the site, the array's output in June is about a quarter of its output in December.

```figure
type: bars
title: SF-90 assumed AC energy by month
x: Month
y: Energy, MWh
caption: This is an illustration. Monthly horizontal irradiation assumed from 7.12 kWh/m² a day in January and December to 1.95 in June, scaled so the year totals 1,679 kWh/m²; energy scaled from the year's 132.5 MWh in proportion. A simulation would also show the low tilt favouring summer and higher temperature losses in summer, which partly offset each other.
- Jan | 17.4
- Feb | 14.0
- Mar | 12.4
- Apr | 8.8
- May | 6.2
- Jun | 4.6
- Jul | 5.3
- Aug | 7.4
- Sep | 10.2
- Oct | 13.4
- Nov | 15.5
- Dec | 17.4
```

On a clear summer day the array delivers about 560 kWh; on a clear winter day about 150 to 170 kWh, and on a heavily overcast winter day much less. Within a day, the output rises from first light, peaks around solar noon, which at Shepparton, about 4.6° west of the time zone's meridian, falls near 12:20 pm in winter and 1:20 pm in summer daylight saving time, and falls away in the late afternoon. That profile, set against the factory's load, decides how much of the energy the factory uses itself, the subject of Chapter 10.

## Bifacial modules on a roof

Some proposals offer bifacial modules, which have transparent rear faces and collect light on both sides, and quote a bifacial gain of 5% to 10% or more. The gain depends on how much light reaches the rear face, which depends on the height of the module above the surface behind it, the reflectance of that surface, the spacing of the rows and how much of the rear is shaded by rails and frames. Bifacial gains of that size are measured on open ground-mounted arrays standing a metre or more above pale ground, with wide row spacing.

Flush on a factory roof, the rear face sits about 100 mm above a steel deck in a narrow, dim gap, and receives very little light. On the workshop roof the business assumed no bifacial gain at all. On the annex frames, standing a little higher above a pale concrete roof, a small gain is plausible, but the business assumed none there either and asked suppliers who quoted one to show the rear irradiance model behind it. A bifacial gain claimed for a flush roof without that model is a figure to remove from the estimate.

## Checking a yield estimate

When a proposal arrives, the business now asks for, and checks, these figures:

```figure
type: checklist
title: Questions for a supplier's yield estimate
caption: This is an illustration. The business's standard list.
- x Which weather data and years, and from which source? Compare its yearly horizontal irradiation with Bureau of Meteorology solar exposure for a nearby site
- x Which transposition model, tilt and orientation for each part of the array?
- x The loss table, line by line, with the temperature model and heat loss coefficient for each mounting
- x Shading: from which survey or model, and at which times of year (Chapter 6)?
- x Is the yield for the first year, or averaged over the life with degradation (Chapter 9)?
- x Is the energy at the inverter output or at the meter, after AC losses?
- ? Was the estimate checked against a second, independent simulation?
```

A free public simulator, such as the United States National Renewable Energy Laboratory's PVWatts, is a useful second opinion for the order of magnitude, though its default losses and weather data must be set for the site.

## The error: peak sun hours times kilowatts

Before any supplier was involved, a brochure handed to the managing director estimated the array's output as kilowatts times peak sun hours times days: 90.72 × 4.6 × 365 = 152.3 MWh a year. That figure travelled into the first draft of the business case.

It contains two errors. It uses horizontal irradiation rather than the plane of the array, which happens to understate slightly for a north-facing roof, and it has no losses at all, a performance ratio of 1, which overstates heavily. Compared with the loss chain's 132.5 MWh, the brochure figure was 14.9% too high. In the business case, at the self-consumption and tariffs in Chapter 10, that error alone would have overstated the yearly saving by several thousand dollars and shortened the apparent payback by more than half a year.

The business's engineer found it by asking where the 152.3 MWh came from and rebuilding the estimate from the loss chain. The rule since then is that no yield figure enters a business case unless it comes with its plane-of-array irradiation and its performance ratio, so that a reader can see both.

## Exercise: using the south face

The business is considering a later extension of 72 more modules, 30.24 kW, on the south face of the workshop roof, mounted in the same way as the north face.

1. What yearly plane-of-array irradiation would the south face receive?
2. Taking the north face's performance ratio, what yearly energy and specific yield would the extension give?
3. How does its yield per kilowatt compare with the north face, and what else would need checking before deciding?

### Worked answer

1. H_POA = 1,679 × 0.975 = 1,637 kWh/m².
2. E = 30.24 × 1,637 × 0.8436 = 41,760 kWh, about 41.8 MWh a year; specific yield 41,760 ÷ 30.24 = 1,381 kWh per kW.
3. The north face gives 1,721 × 0.8436 = 1,452 kWh per kW, so the south face gives about 95.1% as much. That is a small penalty, but before deciding, the business would need to check: whether the existing inverters have spare capacity or a new inverter is needed (Chapter 5); whether the extra energy can be used on site or would mostly be exported at a low feed-in tariff (Chapter 10); whether the network will accept more export; whether the roof structure can carry the extra load (Chapter 7); and whether the ridge vents and skylights on the south face cast shadows (Chapter 6).
