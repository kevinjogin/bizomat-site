---
book: thermoelectric-cooling-by-the-numbers
chapterSlug: thermoelectric-compressor-or-ventilation
order: 10
title: "Thermoelectric, compressor or ventilation"
description: "Comparing thermoelectric, compressor and ventilation cooling for a sealed cabinet on COP, annual energy, running cost, sealing, maintenance and failure, with a year worked band by band."
draft: false
---

Every chapter so far has assumed that thermoelectric cooling was the right choice for TC-1 and worked out how to do it well. This chapter tests the assumption. The alternatives are a small compressor air conditioner made for cabinets, a closed-loop air-to-air heat exchanger, and plain filtered ventilation. Each has a place, and the choice depends on whether the cabinet must be held below the outside air, how large its load is, what the site does to equipment, and how much the electricity and the maintenance cost over the years.

This chapter compares the four on the design day, works out a year's energy for the thermoelectric and compressor options band by band, sets out the qualitative differences that often decide the choice, and finishes with a running-cost estimate that overstated the thermoelectric cooler's electricity seven-fold.

## Which methods can do the job at all

The first question is whether the cabinet must be cooled below the outside air. TC-1 must: its limit is 35 °C and the design air is 45 °C. Chapter 6's enclosure cooling tool refused to size a fan for that condition, because ventilation cannot cool below the air it uses. A closed-loop air-to-air heat exchanger, which passes heat through a sealed core from cabinet air to outside air without mixing them, has the same limit for the same reason. Only a refrigerating method, thermoelectric or compressor, can hold 35 °C at 45 °C outside.

```figure
type: decision
title: Choosing a cabinet cooling method
caption: This is an illustration of the reasoning; real choices also depend on the equipment's limits, the site and the supply.
- Cabinet limit above the hottest outside air, clean site | Filtered fan ventilation | Cheapest; breaks the cabinet's seal
- Cabinet limit above the hottest outside air, dusty or wet site | Closed-loop air-to-air heat exchanger | Keeps the seal; cannot cool below outside air
- Limit below the outside air, load up to about 100 to 200 W | Thermoelectric cooler | Sealed, solid-state, any orientation; low COP
- Limit below the outside air, larger load | Compressor cabinet air conditioner | Higher COP; refrigerant circuit, compressor and filters to maintain
```

## The design day

The [heat pump and chiller COP check](/tools/heat-pump-cop-check/) compares a cooler's actual COP with the Carnot limit at its refrigerant or face temperatures. For CC-1, cooling 66.4 W for 76.7 W of module power with faces at 27.0 °C and 59.3 °C, it gives a Carnot COP of 9.29, an actual COP of 0.87 and a second-law efficiency of 9.3%. For a small compressor cabinet air conditioner quoted to the trust at 62 W of cooling for 31 W of input at the same conditions, with an evaporator 10 K below the cabinet air and a condenser 10 K above the outside air, it gives a Carnot COP of 9.94, an actual COP of 2.0 and a second-law efficiency of 20%.

```figure
type: compare
title: The two refrigerating options at 45 °C outside and 35 °C inside
cols: Cooling | Input power | COP | Second-law efficiency
rowhead: Option
- Thermoelectric CC-1, three modules | 66.4 W | 76.7 W, plus 5 W of fans | 0.87 | 9.3%
- Compressor cabinet air conditioner, quoted | 62 W | 31 W | 2.0 | 20%
caption: This is an illustration. The compressor unit's figures are a quote at the stated conditions; the thermoelectric figures are from Chapter 5's balance. Both COPs from the heat pump and chiller COP check.
```

On the design day the compressor unit uses less than half the electricity. If the cabinet ran at the design condition all year, that would settle the question. It does not.

## A year, band by band

The Riverland's air spends most of the year well below 45 °C. The trust's records for the station give a year of outside temperatures that can be grouped into bands, and the cooler's power can be worked out for each, with the cabinet held at 32 °C by proportional control.

```figure
type: compare
title: CC-1's year at the pump station, cabinet held at 32 °C
cols: Hours | Heat load | Module current | Power with fans | Energy
rowhead: Outside air, band mid-point
- 10 °C | 3,300 h | 23.2 W | none: heat leaves through the modules and sinks | 5.0 W | 16.5 kWh
- 20 °C | 3,000 h | 34.5 W | 0.63 A | 6.9 W | 20.8 kWh
- 30 °C | 1,800 h | 45.7 W | 1.45 A | 19.7 W | 35.5 kWh
- 38 °C | 500 h | 54.8 W | 2.28 A | 43.7 W | 21.8 kWh
- 43 °C | 160 h | 60.4 W | 2.94 A | 70.3 W | 11.3 kWh
- * Year | 8,760 h | — | — | — | 105.9 kWh
caption: This is an illustration. Load = 48 W + 1.129 W/K × (outside − 32 °C). Fans run all year at 5 W. Below about 20 °C outside, heat conducts out through the idle modules and sinks unaided.
```

The cooler's year is dominated not by the few hot weeks but by the many mild hours, when its modules work across a small difference at a high COP, or not at all. At 20 °C outside, the modules need only 0.63 A and their COP is about 18, because the cabinet is warmer than the air and the modules merely assist a flow of heat that would go that way anyway. At 10 °C, the modules are switched off and the cabinet's heat leaves through them by conduction, since an idle module is simply a thermal conductance between its plates. The year totals 105.9 kWh, of which 43.8 kWh is the fans.

The compressor unit's year, estimated the same way with its COP falling from about 7 at mild conditions to 1.9 at 43 °C, plus 8 W for its controls and fan on standby, totals about 137 kWh. A compressor cannot let heat leak through its idle evaporator as a thermoelectric module does, and it must run, at low capacity and with its standby losses, through the mild hours that the thermoelectric cooler spends almost idle.

```figure
type: bars
title: A year's electricity for TC-1's cooling, at A$0.40 per kWh including GST
unit: kWh
max: 150
caption: This is an illustration. The compressor estimate assumes 20% of Carnot at each band and 8 W of standby; real units vary, and their makers' part-load data should be used.
- * Thermoelectric CC-1, proportional control | 105.9
- Compressor cabinet air conditioner | 137
```

At A$0.40 per kWh, the thermoelectric cooler's year costs about A$42 and the compressor unit's about A$55. Over ten years the difference is about A$125, small beside either unit's price. Running cost does not decide this choice. It would have, had the cooler been run by an on–off thermostat at full current, because the mild hours, which proportional control spends at a COP of 3 to 18, would then have been spent at the design point's COP of below 1.

## What does decide it

```figure
type: compare
title: The differences that decided TC-1's cooler
cols: Thermoelectric | Compressor
rowhead: Question
- Keeps the cabinet sealed against dust | yes | yes, if a closed-loop type
- Parts that wear | two fans | compressor, two fans, filters, refrigerant circuit
- Work on the refrigerant circuit | none | needs a licensed refrigeration technician in Australia
- Mounting | any orientation, on the door or wall | upright, with condensate drain
- Capacity at 45 °C outside | 66 W, adequate | 62 W, adequate; minimum capacity often larger than the load
- Behaviour when lightly loaded | runs slowly at high COP | cycles on and off at its minimum capacity
- Failure mode | gradual loss of capacity, telemetry warns | often abrupt: compressor or controls stop
- Price quoted to the trust | lower | about twice the thermoelectric unit
caption: This is an illustration from the trust's quotes and records. Prices and capacities are for the units offered, not general market figures.
```

For TC-1, the decisive points were maintenance and the site. The station is unattended and dusty; the thermoelectric cooler's only wearing parts are two fans that any technician can change, while the compressor unit has a refrigerant circuit that, if it leaked or failed, would need a licensed refrigeration technician to travel to the station. The thermoelectric cooler's gradual loss of capacity as its sink fouls is visible in the telemetry months before it matters, as Chapter 5 found. And at 62 W the load sits comfortably within thermoelectric range.

### Where the answer changes

Double the load and the answer changes. At about 130 W, a thermoelectric cooler would need six modules or more, with a hot-side sink rejecting nearly 300 W, and its design-day power would approach 160 W against about 65 W for a compressor; the energy difference over a hot year would become hundreds of kilowatt-hours, and the price advantage would disappear. A cabinet carrying a variable-speed drive, which may dissipate several hundred watts, is a compressor's job, or better still a job for a separate ventilated enclosure for the drive. Thermoelectric cooling is at its best for small loads, sealed cabinets, unattended sites and precise temperatures, which is exactly where the trust uses it.

## Ten years of ownership

Price, energy and maintenance together give a fairer comparison than any one of them. Using the trust's quotes and its own maintenance rates, for illustration only: the thermoelectric cooler costs A$1,450 including GST, about A$42 a year in electricity and four fan replacements in ten years at A$120 each, about A$2,350 in all. The compressor unit costs A$2,900, about A$55 a year in electricity, the same four fan replacements, and a service visit by a refrigeration technician every two years at A$350, about A$5,680 in all. Neither figure includes a failure. The thermoelectric cooler's failures are mostly fans, a part any technician carries; the compressor unit's include the compressor and its refrigerant circuit, which take a specialist and often a replacement unit.

The comparison would look different at a staffed site with a refrigeration technician on hand, or for a larger load, where the compressor's higher COP saves hundreds of kilowatt-hours a year. It is a site-by-site calculation, and its inputs should come from real quotes and real maintenance records rather than from rules of thumb.

### Refrigerants and the environment

A compressor unit carries a refrigerant charge, typically a hydrofluorocarbon or one of its newer replacements. In Australia, handling refrigerants is regulated under the Ozone Protection and Synthetic Greenhouse Gas Management framework, which requires licensed technicians for work on the refrigerant circuit and is phasing down imports of hydrofluorocarbons. A small cabinet unit's charge is small, but every unit must be recovered properly at the end of its life, and a leak is both a failure and a release. A thermoelectric cooler has no refrigerant; at the end of its life it is aluminium, copper, ceramic and a few grams of bismuth telluride, which should be recycled with electronic waste. Over a year at TC-1, the two options' electricity, and so the emissions from generating it, are close, as this chapter's bands showed.

## Combining methods

The methods are not exclusive. A cabinet in a climate with a few hot weeks a year can use a closed-loop air-to-air heat exchanger for most of the year and a thermoelectric cooler for the hottest hours, each controlled from the same cabinet temperature: the exchanger runs whenever the outside air is several kelvin below the cabinet, and the cooler takes over above that. The combination keeps the cabinet sealed, lets the thermoelectric cooler be smaller, since the exchanger carries the load at night and in the mild hours, and gives a second path for heat if either fails. At TC-1 the thermoelectric cooler already does the mild hours at a very high COP, or with its modules idle, so the trust kept the single cooler, but for a larger load the combination is worth working through.

A simpler backup is an emergency vent: a thermostatically opened, filtered fan that runs only when the cooler has failed and the cabinet has passed its limit. It breaks the seal and lets dust in, but only in an emergency, and it can hold the cabinet within a few kelvin of the outside air until a technician arrives, which on most days is far better than the 42.5 K rise of a sealed, uncooled, insulated cabinet.

## The mistake: a running cost seven times too high

When the trust first compared the options, a project engineer estimated each cooler's yearly running cost by multiplying its design-day input power by the hours in a year. For the thermoelectric cooler that gave 82 W × 8,760 h = 718 kWh, A$287 a year, against about A$110 for the compressor unit on the same basis. Over ten years, the difference of nearly A$1,800 seemed to favour the compressor clearly.

```figure
type: steps
title: Replacing the design-day estimate with a year
caption: This is an illustration. The design day is the right basis for sizing and the wrong basis for energy.
- Design-day power × 8,760 hours | thermoelectric 718 kWh, A$287; compressor about 270 kWh, A$110
- Review: how many hours are near 45 °C? | 160 hours in the 43 °C band, 660 above 35 °C in all
- Energy worked by temperature band | thermoelectric 105.9 kWh; compressor about 137 kWh
- * Yearly cost | thermoelectric about A$42, compressor about A$55
- Decision | thermoelectric, on maintenance, sealing and price; running cost about equal
```

The reviewer asked how many hours a year the station actually spends near 45 °C. The answer, 160 hours in the hottest band and 660 above 35 °C, showed that design-day power was the wrong basis for energy. Working the year by temperature band, as in this chapter, gave 105.9 kWh for the thermoelectric cooler, one-seventh of the first estimate, and about 137 kWh for the compressor unit. The comparison reversed, and the decision moved to the factors that really differed. The design day sizes a cooler; the year decides what it costs to run.

## Learn, apply, improve

Thermoelectric cooling rests on one piece of solid-state physics: charge carriers carry heat, and a junction between materials whose carriers carry different amounts absorbs or releases the difference. Everything practical follows from three numbers fitted to a datasheet and from a few honest calculations around them: how much of the modules' temperature difference the heat sinks create, how large the cabinet's load really is, where the cold side sits against the dew point, how the current is delivered, how the fans and joints wear, and how the year, not the design day, spends its hours. Each mistake in this book was a number left out of that chain. Each was caught by someone asking whether the result made physical sense.

## Exercise: a cabinet in a colder place

The trust's highland station has an identical cabinet and load, but its design air temperature is 32 °C, and its limit remains 35 °C. Using the enclosure cooling airflow tool's method with the insulated cabinet's 1.129 W/K, decide whether a fan could do the job on the design day, and say whether thermoelectric cooling is still the right choice there.

### Answer

**Given:** internal load 48 W; insulated walls 1.328 W/(m²·K) over 0.85 m², 1.129 W/K; design outside air 32 °C; limit 35 °C.

**Assumptions:** a filtered fan bringing in outside air; the walls' loss counted as the tool counts it.

**Method:** heat lost through the walls at the allowed difference; the rest carried away by the fan's air at the allowed rise.

**Design day:** allowed rise 35 − 32 = 3 K. Walls lose 1.129 × 3 = 3.4 W. The fan must remove 48 − 3.4 = 44.6 W with a 3 K rise: an air mass of 44.6 ÷ (1.005 × 3) = 14.8 g/s, about 53 kg/h, or 46 m³/h at 1.16 kg/m³. A small filtered fan can deliver that.

**Is thermoelectric still right?** On this site, ventilation or a closed-loop air-to-air heat exchanger can hold the limit on the design day. A plain fan would break the cabinet's seal and need filter maintenance; a closed-loop exchanger keeps the seal and has no refrigeration at all. Either is cheaper to buy and run than a thermoelectric cooler, whose ability to cool below ambient is not needed here. Unless the cabinet's limit were lowered, for example for battery life, a closed-loop exchanger is the better choice.

**Verification:** the enclosure cooling airflow tool, given 48 W, 32 °C outside, 35 °C inside, 0.85 m² and 1.328 W/(m²·K), gives a wall loss of about 3 W and an airflow of about 46 m³/h; with a 3 K margin the fan must be sized on its airflow with filters fitted, not its free-blowing rating.
