---
book: compressed-air-plant-by-the-numbers
chapterSlug: dryers-and-dew-point
order: 6
title: "Dryers and dew point"
description: "Understand pressure dew point, convert it to an atmospheric dew point, compare refrigerated and desiccant dryers by what they cost to run, and dry only the air that needs it."
draft: false
---

A dryer's job is to make sure compressed air never reaches the temperature at which its remaining water vapour condenses, anywhere in the plant. That temperature is the air's dew point, and because the air is compressed, the dew point that matters is the one at line pressure: the pressure dew point. Choosing a dryer is choosing a pressure dew point, and the choice has a large effect on running cost.

This chapter explains pressure dew point and how it relates to the more familiar atmospheric dew point, compares refrigerated and desiccant dryers, and prices the purge air that desiccant dryers use. It shows how pressure reduction after the dryer changes the dew point, how a dryer's capacity depends on its inlet conditions, and why drying all of a plant's air to the standard needed by one user is expensive. It closes with that mistake on CA-1's site.

## Pressure dew point

The **pressure dew point** (PDP) is the temperature at which water vapour in compressed air begins to condense, at the air's own pressure. A refrigerated dryer cools CA-1's air to about 3 °C, condenses everything that the air cannot hold at that temperature and pressure, drains it away, and then rewarms the air, usually using the incoming warm air in a heat exchanger. The air leaves with a PDP of 3 °C: as long as it stays above 3 °C at line pressure, nothing condenses.

At a room temperature of 20 °C, air with a 3 °C PDP has a relative humidity of about 32 per cent at line pressure: comfortably dry for most factory uses indoors.

## Pressure dew point and atmospheric dew point

The same air, released to atmospheric pressure, has a much lower dew point, because expansion lowers the vapour's partial pressure in proportion to the total pressure. This conversion is a common source of confusion, because some dryer specifications and hygrometers quote the atmospheric figure.

This is an illustration. Air at 851.3 kPa absolute with a PDP of 3 °C has a vapour partial pressure of about 0.758 kPa, water's saturation pressure at 3 °C. Expanded to 101.3 kPa, the vapour's partial pressure falls by the ratio 101.3 ÷ 851.3 to about 90 Pa. The temperature at which ice would form at 90 Pa, from the IAPWS sublimation equation in the references, is about −21.4 °C. That is the atmospheric dew point, strictly a frost point.

```figure
type: compare
title: Pressure dew point at 750 kPa gauge and the equivalent atmospheric dew point
rowhead: Pressure dew point
cols: Atmospheric dew point | Typical way to achieve it
caption: Calculated for 851.3 kPa absolute expanded to 101.3 kPa, using the IAPWS saturation and sublimation equations. Below 0 °C the figures are frost points.
- +10 °C | about −16.3 °C | aftercooler alone on a cool day; not a dryer standard
- * +3 °C | about −21.4 °C | refrigerated dryer
- −20 °C | about −40.4 °C | desiccant dryer at a relaxed setting
- −40 °C | about −57.4 °C | desiccant dryer, common standard
- −70 °C | about −83.4 °C | desiccant dryer for special uses
```

A dryer described as achieving "−20 °C dew point" might mean either column. The two differ by about 20 °C at this pressure, and by more at higher pressures. Specifications should always say "pressure dew point at" a stated pressure. ISO 8573-1, named in the references, classifies compressed air quality partly by pressure dew point.

## Regulators lower the dew point too

The same reasoning applies inside the plant. When air passes through a pressure regulator from 750 kPa to 600 kPa gauge, its vapour partial pressure falls in proportion, and its pressure dew point falls from 3 °C to about 0.3 °C. Air at lower pressure is drier relative to its own saturation. That is helpful at points of use with regulated supplies, and it means a dryer's specification only has to be met at the highest pressure in the system.

## Refrigerated and desiccant dryers

Dryers fall into two main families:

- **Refrigerated dryers** cool the air with a refrigeration circuit, condense the water, drain it and rewarm the air. They cannot go much below about 3 °C PDP without freezing the condensate in their own heat exchanger. Their running cost is the refrigeration compressor's electricity, modest compared with the air compressor.
- **Desiccant dryers** pass the air through a bed of adsorbent material that holds water on its surface, reaching −40 °C PDP or lower. The bed must be regenerated, dried out again, in a second tower while the first works. **Heatless** desiccant dryers regenerate with a flow of the dried compressed air itself, called purge, expanded to atmospheric pressure and blown back through the wet tower. **Heated** and **blower-purge** types use heaters or a separate blower to regenerate with little or no compressed air.

## What purge air costs

Purge air is compressed air that has been paid for, dried, and released to atmosphere. For heatless desiccant dryers, purge commonly amounts to a substantial fraction of the dryer's rated flow; the maker's data gives the figure for each dryer and setting.

```figure
type: bars
title: Annual running cost of drying CA-1's air, by dryer type
unit: A$
max: 11000
caption: This is an illustration, excluding GST, over 6,000 hours at A$0.25 per kWh. The refrigerated dryer is taken as drawing 1.2 kW; the heatless desiccant dryer's purge as a teaching 15 per cent of 6.0 m³/min, priced at CA-1's average specific power of 7.57 kW per m³/min.
- * Refrigerated dryer, 3 °C pressure dew point | 1800
- Heatless desiccant dryer, −40 °C pressure dew point | 10220
- Point-of-use desiccant dryer for 0.3 m³/min only | 511
```

On CA-1's numbers, a heatless desiccant dryer for the whole plant would cost over five times as much to run as a refrigerated dryer: about 0.9 m³/min of purge, roughly 6.8 kW of compressor input, all year. That figure is why heated and blower-purge desiccant dryers exist, why desiccant dryers are fitted with dew-point-dependent purge controls that purge only as much as the actual moisture load needs, and why the first question about any desiccant dryer is whether its dew point is really needed.

## How a desiccant bed works

Desiccant materials such as activated alumina, silica gel and molecular sieves have enormous internal surface areas on which water molecules stick, a process called adsorption. Air passing through a bed of them leaves its vapour behind until the bed is loaded, after which water breaks through and the dew point rises. A heatless dryer switches towers every few minutes, long before breakthrough, and regenerates the loaded tower with dry purge air at atmospheric pressure, where the purge's very low vapour pressure strips the water off the desiccant again.

That mechanism explains the purge cost. The dried purge air, expanded to atmospheric pressure, has a much larger volume and a much lower dew point than the wet air the tower collected water from, so a fraction of the dried flow is enough to carry the water away. But that fraction was compressed, dried and paid for, and it goes to atmosphere. Desiccant beds also age, losing capacity as oil and dust coat them, which is why a coalescing filter before the dryer and periodic replacement of the desiccant are part of the cost.

## Who needs which dew point

Most factory uses indoors are well served by a 3 °C PDP: the air never meets a surface colder than that at line pressure. A lower dew point is needed where air is piped outdoors in climates where pipes can freeze, for instrument air in some industries, for certain painting, food, pharmaceutical and electronics processes, and for air that is cooled sharply at the point of use, for example in vortex tubes or cold-air guns.

The design question is whether the whole plant needs the lower dew point, or only one or two users. Drying everything to the standard of the most demanding user costs the purge on the whole flow. Drying the main to 3 °C with a refrigerated dryer and adding a small desiccant dryer at the one user that needs better costs the purge on that user's flow only.

## A failure case: drying the whole plant for one booth

This is an illustration. When a paint booth was added to CA-1's site, its maker specified air with a −40 °C pressure dew point. The site replaced CA-1's refrigerated dryer with a heatless desiccant dryer sized for the whole 6.0 m³/min, reasoning that one dryer was simpler than two.

Within months, the plant's air demand appeared to have grown: CA-1 was running loaded more often and the electricity bill had risen. Nothing new had been connected apart from the booth, which used about 0.3 m³/min. A check of the new dryer's purge found it running at a fixed rate equal to its full design purge, about 0.9 m³/min, all the time the compressor ran, whatever the plant's actual flow.

The error was in letting one user's requirement set the whole plant's drying. The correction was to reinstate a refrigerated dryer for the main, at a running cost of about A$1,800 a year, and to fit a small desiccant dryer at the booth, whose purge on 0.3 m³/min costs about A$510 a year, against about A$10,200 for the whole-plant desiccant dryer. Where a whole-plant desiccant dryer is genuinely needed, a dew-point-dependent purge control is fitted so that purge follows the real moisture load.

## Dryer capacity depends on its inlet

A dryer is rated at reference conditions, typically an inlet air temperature, an ambient temperature and an inlet pressure. Hotter inlet air carries more vapour, as Chapter 3 showed: air saturated at 45 °C carries about 70 per cent more vapour per kilogram than air saturated at 35 °C at CA-1's pressure. A dryer receiving air at 45 °C must condense much more water than it was rated for, and a refrigerated dryer in a hot room also has less capacity to reject its own heat. Makers publish correction factors for these conditions; on hot sites a dryer is often selected one size up, or the aftercooler and room ventilation are improved so that the dryer sees air close to its rating.

Lower line pressure works the same way: air at lower pressure has more volume and more vapour for the same mass flow, so a dryer's capacity falls as its inlet pressure falls. A plant that lowers its pressure, as Chapter 7 recommends, should check the dryer's rating at the new pressure.

## Choosing a dryer

```figure
type: checklist
title: Questions before choosing CA-1's dryer
caption: The answers decide the dryer type, its size and whether one dryer or several is the cheaper arrangement.
- What pressure dew point does each user actually need | at what pressure, stated as pressure dew point
- Does any air run outdoors or through cold spaces | the coldest pipe sets the dew point needed there
- What are the dryer's inlet temperature and pressure on a hot day | rate the dryer at those, not the brochure's reference
- How does the plant's flow vary through the day | part-load behaviour sets running cost
- x Do not dry the whole plant to one user's standard | dry the main to what most users need and treat the exception locally
- ? Is there a dew-point sensor after the dryer | without one, failure shows up first in the plant
```

## Measuring dew point

A dew point sensor after the dryer, displaying and logging pressure dew point, turns the dryer from a box that is assumed to work into one that is known to work. Sensors drift and need periodic calibration or replacement, and they must be installed where they see representative air at line pressure. For a refrigerated dryer, the dryer's own evaporator temperature display gives a useful indication but is not the same as a measurement of the air leaving it. For a desiccant dryer, a dew point sensor is also the input to purge control, so its accuracy directly affects running cost.

A simple cross-check is the plant itself: water in drop-leg drains downstream of a dryer, or condensation on cold surfaces, means the dryer is not achieving its dew point, whatever its display says.

## Bypasses

Most dryers are installed with a bypass so that they can be serviced without stopping the plant's air. A bypass left open after service sends wet air to the plant, and does so silently unless a dew point sensor downstream raises the alarm. Bypass valves should be locked closed in normal running, and their position included in the weekly walk past the drains described in Chapter 5.

## Refrigerated dryers at part load

A refrigerated dryer sized for full flow runs at full refrigeration power whether the air flow is full or not, unless it has part-load control. Cycling dryers, which use a thermal mass to store cooling and switch their refrigeration compressor off at light load, and variable-speed dryers reduce power at part load. On CA-1, with its 70 per cent average load, the saving is a fraction of the dryer's 1.2 kW, small beside the compressor but worth taking when a dryer is replaced.

## Filters belong with dryers

Dryers deal with water vapour. Oil aerosols, oil vapour, particles and liquid water droplets are handled by filters: a coalescing filter before the dryer to protect it from oil and liquid water, and particulate or further coalescing filters after it according to the air quality the users need. Each filter adds pressure drop, which rises as the filter element loads with dirt. Differential pressure gauges across filters, and element changes at the maker's interval or when the pressure drop reaches the replacement point, keep that cost down. A blocked filter can easily cost more in compressor power than its element is worth.

## Exercise: a booth at lower pressure

The paint booth's air is regulated from 750 kPa to 400 kPa gauge at the booth. If it is supplied from the main at a 3 °C pressure dew point, what is its pressure dew point at 400 kPa gauge, and does that remove the need for a booth dryer?

**Answer.** The vapour partial pressure at 3 °C is about 0.758 kPa at 851.3 kPa absolute. At 501.3 kPa absolute it falls to 0.758 × 501.3 ÷ 851.3, about 0.446 kPa, which is water's saturation pressure, over ice, at roughly **−4 °C**. Regulating the pressure has improved the dew point by about 7 °C, but it is nowhere near the −40 °C the booth's maker specifies. The booth still needs its own desiccant dryer. The calculation is still worth doing, because it shows the booth's small dryer needs to remove less water than one working at full line pressure would, and its maker can size it accordingly.

