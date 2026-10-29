---
book: condensation-control-by-the-numbers
chapterSlug: corrosion-salts-and-the-humidity-that-matters
order: 8
title: "Corrosion, salts and the humidity that matters"
description: "Why metals corrode below the dew point, how salts take up water at set humidities, how to count wet hours, measure corrosion with coupons, and why CC-7's hygrostat moved from 75% to 65%."
draft: false
---

Keeping surfaces above the dew point stops liquid water forming, but it does not by itself stop corrosion. Metals corrode wherever a thin film of electrolyte can form on them, and on real surfaces that happens well below 100% relative humidity. Dust, fingerprints and, near the coast, sea salt all take up water from the air at humidities that depend on what they are made of. A cabinet that never sees a drop of condensation can still grow green bloom on its terminals.

This chapter explains the humidity thresholds that matter for corrosion and for electronics, introduces the time-of-wetness idea used to compare environments, counts wet hours at PS-7 inside and outside CC-7, shows how to measure corrosion directly with coupons, and describes why the heater's control setting had to come down after the condensation was cured.

## Water films below the dew point

A clean metal surface in humid air carries a film of adsorbed water a few molecules thick, which thickens as the humidity rises. At low humidity the film is too thin and too pure to carry much current, and corrosion is slow. As the humidity rises the film thickens, and once it can dissolve the contaminants on the surface it becomes an electrolyte, and corrosion speeds up sharply.

Contaminants decide where that happens. A soluble salt on a surface takes up water from the air once the humidity exceeds a value characteristic of that salt, and dissolves into a droplet of its own saturated solution. This is **deliquescence**, and the threshold is the same equilibrium humidity that a saturated solution of the salt holds in a closed container. Greenspan's measurements, published by the National Bureau of Standards in 1977, give those equilibrium humidities precisely.

```figure
type: bars
title: Humidity at which salts take up water, 25 °C
unit: % RH
max: 100
caption: Equilibrium relative humidity over saturated solutions, from Greenspan (1977). Sea salt is mostly sodium chloride, but its magnesium chloride fraction stays damp at much lower humidity.
- Lithium chloride | 11.3
- Magnesium chloride | 32.8
- Magnesium nitrate | 52.9
- * Sodium chloride | 75.3
```

Sodium chloride, the main constituent of sea salt, turns into a brine film above about **75% RH**. Below that it stays a dry crystal and does little harm. The magnesium chloride in sea salt takes up water above about 33%, so a salt deposit from sea spray is never completely dry in ordinary air, but most of its mass, the sodium chloride, becomes active only above 75%. That threshold is the reason PS-7's coastal location matters, and the reason the humidity inside CC-7 needs to be held well below 75%, not merely below 100%.

## Time of wetness

To compare environments, corrosion practice uses the idea of **time of wetness**: the time during which a metal surface is likely to carry an electrolyte film. ISO 9223, which classifies the corrosivity of atmospheres, has conventionally estimated it as the hours in which the relative humidity is above 80% and the temperature above 0 °C. It is a crude measure, since it ignores salts and pollutants and assumes the surface is at the air temperature, but it is simple to count from a humidity log and it ranks environments sensibly.

This is an illustration. Take a design summer day at PS-7 with the air temperature varying between 20 °C before dawn and 29 °C mid-afternoon and the dew point steady at 19 °C. Counting the hours above each threshold outside CC-7, inside it without the heater, and inside it with the heater holding 8 K of lift at night, gives the figure below. Inside, the drive's heat lifts the cabinet 17.6 K above the outside air from 8 am to 4 pm; outside those hours the standby load lifts it 1.7 K, or the heater 8 K.

```figure
type: compare
title: Wet hours on a design summer day at PS-7
cols: Hours above 80% RH | Hours above 75.3% RH | Lowest RH
rowhead: Location
caption: This is an illustration from an hourly profile with a constant 19 °C dew point. The heater removes every hour above both thresholds; without it, the cabinet's contents spend seven hours a day above the point where salt films turn to brine.
- Outside air | 9 | 11 | 55%
- Inside CC-7, no heater | 5 | 7 | 21%
- *Inside CC-7, heater +8 K at night | 0 | 0 | 21%
```

The middle row is worth noticing. Without the heater, CC-7's contents are wet for fewer hours than the outside air, because the drive keeps the cabinet warm by day. But the hours that remain are at night, when the cabinet is cooling and its surfaces are coldest. Over a year, five wet hours a day add up to about 1,800 hours, more than enough to keep a salt film active on every terminal.

### The humidity at the surface, not in the air

A humidity sensor reports the relative humidity of the air at the sensor, but corrosion responds to the relative humidity at the metal surface, and the two differ whenever the surface is at a different temperature from the air. The vapour pressure is the same; only the saturation pressure changes. A surface colder than the air therefore sees a higher relative humidity than the sensor reports.

This is an illustration. At 1 am on the design day, without the heater, CC-7's air is at 22.3 °C with a dew point of 19 °C, so its sensor reads about **82%**. The lower terminal rail is mounted close to the gland plate, which is cooled by the pit beneath it and runs about 2 K below the cabinet's air. At 20.3 °C the terminals see about **92%**, wetter than the sensor suggests and well above the sodium chloride threshold. With the heater on, the same pair of temperatures 8 K higher gives 51% in the air and 57% at the terminals, both comfortably below it. The practical rule is to judge corrosion risk from the coldest metal that matters, using a surface temperature and the air's dew point, exactly as Chapter 1 recommended for condensation.

## Counting wet hours from a log

The wet-hour figures above came from a modelled day, but the same count can be made from any temperature and humidity log, and it is the most useful single number to report from one. The method suits a spreadsheet:

- Convert each logged reading of air temperature and relative humidity to vapour pressure and dew point.
- If a surface temperature is logged, calculate the relative humidity at the surface from the air's vapour pressure and the surface's saturation pressure.
- Count the hours above 80% (the conventional time-of-wetness threshold), above 75% (the sodium chloride threshold) and with a dew point margin below 1 K at the coldest surface.
- Report each count per month, alongside the same counts for the outside air.

Monthly counts make seasonal patterns plain and turn the climate controls into something that can be checked against a target. For CC-7 the target set after this chapter's investigation is simple: no hours above 75% inside, and no hours with a dew point margin below 1 K at the roof or the gland plate.

### Keeping salt out

Salt reaches the inside of a coastal cabinet in three ways: on the air drawn in by breathing and ventilation, on hands, tools and clothing during maintenance, and through the filters of ventilation fans, which pass fine particles. Filter mats with a finer grade, a door kept shut in onshore winds, and a canopy that keeps spray off the door seals all reduce it. Where deposits have built up, they are removed by cleaning methods approved by the equipment maker, since water-based cleaning on live or sensitive equipment can do more harm than the salt. Reducing the salt raises the humidity a cabinet can tolerate; it does not remove the need to hold the humidity down.

## What humidity does to electronics

Electronic assemblies suffer from water films in ways that go beyond rust. Three mechanisms matter in an enclosure like CC-7:

- **Corrosion of contacts and terminals.** Tin, copper and brass terminals corrode under salt films, raising contact resistance. A terminal that runs warm because of a corroded joint makes matters worse by cycling the joint's temperature.
- **Leakage currents.** A conducting film across an insulating surface lets current leak between conductors at different voltages. On a circuit board or terminal strip, that can upset sensitive inputs long before anything visibly corrodes.
- **Electrochemical migration.** Under a voltage, metal ions can dissolve from one conductor, travel through a water film and deposit on the neighbouring conductor as fine metal filaments, eventually causing a short circuit. It needs a voltage, a film and a contaminant, and it is fastest when the humidity hovers near a salt's deliquescence point.

Conformal coatings on circuit boards slow all three by keeping water films off the copper, but they do not protect terminals and connectors, which have to be left bare. The physics of humidity testing for electronic assemblies, including the Peck model that relates life to humidity and the difference between damp heat and condensing tests, is covered in [Humidity and the Peck model](/reados/publications/accelerated-life-testing-by-the-numbers/humidity-and-the-peck-model/) in *Accelerated Life Testing by the Numbers*.

## Measuring corrosion with coupons

Humidity logs show the conditions; coupons show the result. A corrosion coupon is a small, weighed, cleaned plate of a known metal, exposed for a known time and then cleaned of corrosion products and weighed again. The mass lost, divided by the metal's density, the exposed area and the time, gives an average corrosion rate. The [corrosion rate tool](/tools/corrosion-rate/) applies the standard mass-loss method, giving the rate in millimetres a year from the mass loss in milligrams, the exposed area, the exposure time and the density, and the remaining life of a corrosion allowance.

This is an illustration. To check that the climate controls were working, the utility exposed three mild steel coupons, each 50 × 100 mm and counted on both faces for an area of **100 cm²**, for **90 days (2,160 hours)** over summer: one outside under the canopy, one inside CC-7 before the heater was changed, and one inside after.

```figure
type: formula
title: Corrosion rate from a coupon's mass loss
formula: CR (mm/year) = 87,600 × W ÷ (A × t × ρ)
caption: This is an illustration. W in grams, A in cm², t in hours, ρ in g/cm³; the constant converts the result to millimetres a year. Steel density 7.86 g/cm³.
- W | mass loss after cleaning, g
- A | exposed area, 100 cm²
- t | exposure, 2,160 h
- ρ | density, 7.86 g/cm³
step: outside, 310 mg: 87,600 × 0.310 ÷ (100 × 2,160 × 7.86) = 0.0160 mm/year
step: inside, before: 95 mg gives 0.0049 mm/year; after: 18 mg gives 0.0009 mm/year
```

Mild steel bare to the air is not what CC-7 is made of, but steel coupons respond quickly and show differences between environments plainly. Inside the heated cabinet the coupon corroded at about **1 µm a year**, roughly a fifth of the rate inside the unheated cabinet and about a seventeenth of the rate outside. Copper coupons, which respond more to sulfur and chloride than to wetness alone, are often exposed alongside steel ones for electronics.

## The error: a hygrostat set at the salt's threshold

This is an illustration. When the 250 W heater of Chapter 5 was first installed, its hygrostat was set to switch on at **75% RH** and off at 70%, to keep its energy use down. The condensation stopped at once: the roof stayed dry and no more water appeared on the drive. But six months later, an inspection found white and green bloom on the brass terminals of the lower terminal rail, and the second steel coupon inside the cabinet showed a rate barely better than the unheated one.

The humidity log showed why. With the hygrostat at 75%, the heater let the inside humidity rise to about 75% every humid night and held it there, cycling between 70% and 75% for hours at a time. That band straddles the deliquescence point of sodium chloride, and a fine salt deposit had built up on the terminals, carried in on sea breezes whenever the door was opened. Every humid night the salt took up water and became a brine film; every warm day it dried out again. The cabinet had no condensation, but its terminals spent most nights wet.

The hygrostat was reset to switch on at **65%** and off at **55%**, comfortably below the sodium chloride threshold, which is the setting given in Chapter 5. The terminals were cleaned, and maintenance crews were asked to keep the door shut while working in an onshore wind. The third coupon, exposed after the change, gave the rate shown above. The energy cost of the lower setting was a little higher, within the bounds estimated in Chapter 5, and the business recorded the reason for the setting on the drawing so that no one would raise it again to save power.

```figure
type: checklist
title: Humidity settings for a coastal enclosure
caption: The open item is this chapter's error. Preventing condensation is necessary but not sufficient; the humidity must also stay below the thresholds of the salts that are present.
- x Surfaces above the dew point with a margin | Chapters 2 and 5
- x Paths to wetter spaces sealed | Chapter 3
- x Corrosion measured, not assumed | coupons inside and outside, recorded each season
- ? Inside humidity held below the deliquescence point of sea salt | hygrostat at 75% straddled it
```

## Exercise: comparing two coupons

A copper coupon of 100 cm² exposed inside CC-7 for 2,160 hours lost 12 mg before the hygrostat change and 4 mg after. Copper's density is 8.96 g/cm³. What were the two corrosion rates, and by what factor did the change reduce the rate?

**Worked answer.** Before: 87,600 × 0.012 ÷ (100 × 2,160 × 8.96) = 1,051.2 ÷ 1,935,360 ≈ **0.00054 mm/year**, or 0.54 µm a year. After: 87,600 × 0.004 ÷ 1,935,360 ≈ **0.00018 mm/year**, or 0.18 µm a year. The rate fell by a factor of **3**. The rates are small in millimetres, which is typical of copper indoors, but contact resistance depends on a film only a fraction of a micrometre thick, so for terminals the ratio matters more than the absolute number. A single pair of coupons over one season is weak evidence on its own; the utility repeats the exposure each season and looks for a consistent difference.
