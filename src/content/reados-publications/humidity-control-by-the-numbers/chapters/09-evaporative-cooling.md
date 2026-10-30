---
book: humidity-control-by-the-numbers
chapterSlug: evaporative-cooling
order: 9
title: "Evaporative cooling for the warehouse"
description: "Size direct evaporative coolers from the wet-bulb limit and pad effectiveness, find their water use and real cooling to the room, see why humid days defeat them, and keep them hygienic."
draft: false
---

Next to the print hall is the finished-goods warehouse, where cartons wait on pallets for dispatch. It needs to be bearable for the people who work there and not so hot that stacked board softens or glue lines suffer, but it does not need the hall's close control. The printer cools it in summer with direct evaporative coolers on the roof: fans draw outdoor air through wetted pads, water evaporates into the air, and the air leaves cooler and wetter. No refrigeration plant is involved, so the running cost is mainly fan power and water.

Evaporative cooling is simple, cheap to run and very effective in dry heat. It is also limited in a way no amount of equipment can overcome: it cannot cool air below its wet-bulb temperature, and on a humid day the wet bulb is close to the dry bulb. This chapter works out how far the warehouse coolers can cool on the hot-dry and humid days, how much water they use, how much cooling the warehouse actually receives, and what the hygiene duties are. It ends with a cooling claim that broke the wet-bulb limit.

## Adiabatic saturation and the wet-bulb limit

When air passes over wet pads and no heat is supplied from outside, the energy to evaporate the water comes from the air itself. The air's dry-bulb temperature falls and its humidity ratio rises, while its enthalpy stays almost constant: the sensible heat it loses becomes latent heat in the vapour. If the air stayed in contact with the water long enough, it would reach saturation at the **adiabatic saturation temperature**, which for air-water mixtures is very close to the thermodynamic wet-bulb temperature that Chapter 3 described for a wet-bulb thermometer.

A real cooler does not reach saturation. Its pads achieve a fraction of the possible temperature drop, called the **saturation effectiveness**, which depends on the pad depth and type and the air velocity through it and is published by the pad or cooler maker.

```figure
type: formula
title: Leaving temperature and water use of a direct evaporative cooler
formula: t₂ = t₁ − ε × (t₁ − t_wb)
formula: ṁ_w = ṁ_a × (ω₂ − ω₁)
caption: This is an illustration for the warehouse coolers on the hot-dry day, 38 °C and 20%, 6.0 m³/s, pad effectiveness 85%. The leaving humidity ratio follows from holding the air's enthalpy constant, with the make-up water entering at the wet-bulb temperature.
- t₁, t₂ | entering and leaving dry-bulb temperature, °C
- t_wb | wet-bulb temperature of the entering air, °C
- ε | saturation effectiveness of the pads, as a fraction
- ṁ_a | dry-air mass flow, kg/s
step: t_wb = 20.76 °C, so the possible drop is 38 − 20.76 = 17.24 K
step: t₂ = 38 − 0.85 × 17.24 = 23.35 °C
step: ṁ_w = 6.719 × (0.014334 − 0.008250) = 0.04088 kg/s, or 147.2 kg/h
```

The [direct evaporative cooler check](/tools/evaporative-cooler-check/) does this calculation. From the entering temperature, relative humidity and pressure, it solves the adiabatic saturation balance for the wet-bulb temperature, applies the effectiveness to find the leaving temperature, holds the enthalpy constant to find the leaving humidity ratio and relative humidity, and reports the dry-air mass flow, the water evaporated and the sensible cooling of the air. It compares the leaving temperature with the supply temperature you need, and separately checks whether that target is above the wet bulb at all. It treats the process as adiabatic and does not include fan or pump heat.

## The warehouse on three summer days

This is an illustration. The warehouse coolers move 6.0 m³/s in total with pads of 85% effectiveness, and the printer would like supply air at or below 26 °C. The check gives:

```figure
type: compare
title: The warehouse coolers on three summer days
cols: Hot-dry, 38 °C 20% | Warm-humid, 33 °C 45% | Humid, 29 °C 70%
rowhead: Result
caption: This is an illustration from the direct evaporative cooler check at 6.0 m³/s and 85% effectiveness. The hottest day gives the largest temperature drop; the most humid day gives almost none.
- Wet-bulb temperature | 20.76 °C | 23.45 °C | 24.59 °C
- Leaving temperature | 23.35 °C | 24.88 °C | 25.25 °C
- Temperature drop | 14.65 K | 8.12 K | 3.75 K
- Leaving relative humidity | 79.5% | 88.8% | 94.8%
- Water evaporated | 147.2 kg/h | 83.2 kg/h | 39 kg/h
- Sensible cooling of the outdoor air | 100.42 kW | 56.6 kW | 26.49 kW
```

On all three days the leaving air meets the 26 °C target, which is why direct evaporative cooling suits much of inland Australia in summer. But the margin on the humid day is only 0.75 K, and the cooling the coolers provide shrinks with the wet-bulb depression, the gap between dry bulb and wet bulb. On the hot-dry day that gap is 17.24 K; on the humid day it is 4.41 K. The equipment is the same and the effectiveness is the same; the weather decides the result.

## How much cooling the warehouse receives

The tool's "sensible cooling of the air" is measured from the outdoor temperature: it is how much the coolers cool the outdoor air. The warehouse does not receive all of that, because the air it would otherwise have is not outdoor air. With 100% outdoor air supplied and the warehouse air relieved through openings, the cooling the building actually receives is the heat the supply air can absorb as it warms from its supply temperature to the warehouse temperature.

This is an illustration. With the warehouse held at about 28 °C:

```figure
type: bars
title: Cooling delivered to a 28 °C warehouse by the same coolers
unit: kW
max: 35
caption: This is an illustration: ṁ_a × c_p,moist × (28 − t₂). The delivered cooling is one-third or less of the cooling of the outdoor air, and it falls by 40% between the hot-dry and the humid design day.
- * Hot-dry day, supply 23.35 °C | 32.21
- Warm-humid day, supply 24.88 °C | 21.89
- Humid day, supply 25.25 °C | 19.50
```

On the hot-dry day the coolers deliver 6.719 × (1.005 + 1.82 × 0.014334) × (28 − 23.35) = **32.21 kW** to the warehouse. That is the figure to compare with the warehouse's heat gains from the roof, walls, lights, forklifts and people. If those gains exceed it, the warehouse settles above 28 °C, and the only remedies are more air, more effective pads, a different cooling method or less heat gain, for example from a better-insulated or more reflective roof.

## Air to get in and out

An evaporative cooler supplies outdoor air, so the same quantity has to leave the building. This is an illustration. If the warehouse is 40 m by 30 m by 9 m, 10,800 m³, then 6.0 m³/s is 21,600 m³ an hour, two air changes an hour. The relief air leaves through doors, roof vents or dedicated relief openings. If the relief paths are too small, the building pressurises, the cooler fans move less air than their rating, and the delivered cooling falls with the airflow. The maker's literature usually states the relief opening area needed for a given airflow; it should be confirmed before the coolers are blamed for a hot warehouse.

The path the air takes matters too. Supply outlets should throw the cool air towards where people work, and relief should be on the far side of the building, so that the air sweeps the space rather than short-circuiting from outlet to relief. Air relieved near the coolers' own intakes can be drawn back in, raising the entering wet bulb and lowering every number in the comparison above.

## Measuring a cooler on site

The effectiveness in the formula can be measured with the instruments described in Chapter 3. Read the entering dry bulb and wet bulb, or dry bulb and humidity, at the cooler's intake, and the leaving dry bulb at the outlet once the pads have been wet for some minutes.

This is an illustration. A reading of 36.0 °C entering with a wet bulb of 21.0 °C, and 24.6 °C leaving, gives an effectiveness of (36.0 − 24.6) ÷ (36.0 − 21.0) = 11.4 ÷ 15.0 = **0.76**. If the pads were rated at 85% when new, the difference points to scaled or dry patches on the pads, uneven water distribution or air bypassing the pads around their frames. A set of readings at the start of each summer, kept with the maintenance record, shows the pads' decline and tells the owner when replacement pays.

On mild days the coolers can run with their pumps off as plain ventilation fans. Controls that run the fans first and add water only when the outdoor temperature rises above a set point save water and avoid adding moisture to the warehouse when it is not needed.

## Humidity in the warehouse

Direct evaporative cooling adds water to the air. That is how it works, and for people in dry heat it is harmless. For a store of paperboard cartons it needs thought, because the board takes up moisture as the print hall's board does.

This is an illustration. Supply air at 23.35 °C and 14.334 g/kg on the hot-dry day, warming to 28 °C in the warehouse, is at about **60%** relative humidity there. On the warm-humid day, supply at 24.88 °C and 17.642 g/kg warms to about **74%** at 28 °C. The warehouse is therefore a much damper place than the print hall's 50%, and cartons moved from the hall into it take up moisture and may warp before dispatch.

That is a decision for the printer, not a calculation error: perhaps the cartons are wrapped, perhaps they ship within hours, perhaps the customer's specification allows it. The calculation makes the choice visible. If the warehouse humidity is unacceptable, an **indirect evaporative cooler**, which cools the supply air through a heat exchanger wetted on the other side, cools without adding moisture to the supply. Its limit is the wet bulb of the air on the wet side, and its effectiveness is generally lower than a direct cooler's. A **two-stage** cooler places an indirect stage before a direct one; because the indirect stage lowers the supply air's wet bulb as well as its dry bulb, the direct stage can then cool below the outdoor wet bulb. The performance of either comes from the maker's data at the site's design conditions.

## Water use and bleed-off

The 147.2 kg/h the coolers evaporate on the hot-dry day leaves behind every dissolved solid that came in with the water. Without control the solids concentrate in the sump until they scale the pads. Coolers therefore bleed off part of the circulating water, either continuously or by dumping the sump periodically, and replace it with fresh water.

The bleed needed depends on how far the water's solids may be allowed to concentrate, expressed as cycles of concentration, which the cooler maker or water treatment provider sets for the local water. For a concentration ratio C, the bleed-off is the evaporation divided by (C − 1).

This is an illustration. If the maker allows three cycles of concentration, the bleed is 147.2 ÷ (3 − 1) = **73.6 L/h** and the total water use is **220.8 L/h** on the hot-dry day. Over eight hours at that duty it is about **1,766 litres**. The water use is part of the running cost and, in drought, part of the case against evaporative cooling, and it should be metered so that a stuck bleed valve or a leaking float is noticed.

## Hygiene and the law

Any device that keeps water warm, wet and in contact with outdoor air can grow bacteria, including Legionella, and can release aerosol. Evaporative coolers differ from cooling towers in how they wet the air and how much aerosol they release, but the duties are similar in kind: a maintenance program, cleaning and disinfection, draining when not in use and records of what was done. The AS/NZS 3666 series, *Air-handling and water systems of buildings – Microbial control*, sets out design, installation and commissioning (Part 1) and operation and maintenance (Part 2) requirements. Whether a particular system must be registered, inspected or tested is set by state and territory public health law, which differs between jurisdictions, so the owner should confirm what applies locally. [Legionella control and the law](/reados/publications/cooling-towers-by-the-numbers/legionella-and-the-law/) in *Cooling Towers by the Numbers* covers the risk management approach for towers in detail.

```figure
type: checklist
title: Keeping the warehouse coolers safe and effective
caption: The open item is the one most often missed at the end of summer, when coolers are switched off with water still in the sump.
- Pads inspected and replaced at the maker's interval | scaled or clogged pads lose effectiveness and harbour growth
- Bleed-off working and water use metered | a stuck bleed scales the pads; a stuck float wastes water
- Sumps drained and cleaned as the maintenance program requires | with a record of each service
- Coolers placed away from exhausts, flues and drift sources | the coolers draw in whatever is in the air
- ? Coolers drained and dried out when not used for an extended period | standing water in a warm idle unit
- x Recirculating warehouse air through the coolers | raises humidity and loses the wet-bulb benefit of outdoor air
```

## The error: a cooler that promised 18 °C

This is an illustration. When the printer sought quotations to add coolers for an extension of the warehouse, one offer stated that its units would "deliver 18 °C air on a 38 °C day". The printer's engineer entered the hot-dry design day, 38 °C and 20%, with a target of 18 °C, into the cooler check. The tool reported **COOLER CANNOT REACH TARGET**, and its wet-bulb check failed: the target was below the 20.76 °C wet bulb, the limit of direct evaporative cooling with any effectiveness. Even pads of 100% effectiveness would deliver 20.76 °C.

Asked for the basis of the figure, the supplier explained that it came from a test at lower outdoor humidity. At 38 °C and a much drier condition the wet bulb is indeed lower, and 18 °C may be possible. The claim was not false, but it was not for this site. The printer now asks for every cooler's leaving temperature at the site's own design conditions, with the effectiveness stated, and checks it against the wet bulb before comparing prices.

## How this applies to a small Australian business

Direct evaporative cooling is common in Australian warehouses, workshops and factories, particularly inland, because it cools large volumes for little energy. The calculation in this chapter gives an owner three things a brochure seldom does: the leaving temperature at the site's design wet bulb, the cooling actually delivered to the space at its operating temperature, and the water and humidity that come with it. Those three numbers decide whether evaporative cooling suits the building and its contents, and on how many days of the year it will fall short.

## Exercise: worn pads

After several seasons the warehouse pads have scaled, and a test shows their effectiveness has fallen to 70%. Find the leaving temperature on the hot-dry day and the cooling delivered to a 28 °C warehouse, assuming the same 6.0 m³/s.

**Worked answer.** The wet bulb is unchanged at 20.76 °C, so the leaving temperature is 38 − 0.70 × 17.24 = **25.93 °C**, still just below the 26 °C target. The dry-air flow is unchanged at about 6.72 kg/s, and the leaving humidity ratio is somewhat lower than with new pads, about 13.3 g/kg, so the moist-air specific heat is about 1.029 kJ/kg·K. The cooling delivered to the warehouse is 6.72 × 1.029 × (28 − 25.93) = about **14.3 kW**, less than half the 32.21 kW from new pads. The temperature target is barely met, but the delivered cooling has more than halved, because it depends on the small difference between the supply and the warehouse temperature. The direct evaporative cooler check, run with 70% effectiveness, gives the leaving temperature and humidity ratio directly; the delivered cooling should always be worked out against the space temperature as well.
