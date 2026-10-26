---
book: process-steam-by-the-numbers
chapterSlug: reading-the-steam-table
order: 1
title: "Reading the steam table"
description: "Understand saturated steam through its table: absolute pressure and boiling point, sensible and latent heat, specific volume, why steam is distributed high and used low, and wet steam."
draft: false
---

Every steam calculation starts with the steam table. It lists, for water and steam in equilibrium at each pressure, the temperature at which water boils, how much heat is in the water, how much more it takes to turn that water into steam, and how much space the steam takes up. Those few columns explain almost everything about why factories use steam, how boilers are rated, why steam is carried at one pressure and used at another, and why steam that carries water droplets heats so poorly. They also hide the most common mistake in steam work: tables use absolute pressure, and gauges show gauge pressure.

This chapter reads the table for SV-8's three pressures: atmospheric, the 400 kPa kettle supply and the 800 kPa boiler. It explains saturation, absolute and gauge pressure, the three enthalpy columns, why latent heat makes steam such an effective carrier of heat, how specific volume drives pipe size, why high pressure suits distribution and low pressure suits use, and what wet steam does. The failure case is a set of kettles that heated slowly because their steam was wet.

## Boiling depends on pressure

Water boils when the pressure of its vapour equals the pressure around it. At atmospheric pressure, about 101.3 kPa absolute, that happens at **100 °C**. At higher pressure, water must be hotter before it boils: at **400 kPa** absolute, it boils at **143.1 °C**, and at **800 kPa** absolute, at **170.4 °C**. Water and steam together at a given pressure are always at that pressure's **saturation temperature**; adding heat makes more steam, not hotter water.

```figure
type: line
title: Saturation temperature rises with absolute pressure
x: Absolute pressure, kPa
y: Saturation temperature, °C
ymin: 90
ymax: 180
mark: 400 | kettle supply, 143.1 °C
caption: Published saturated steam table values at 101.3, 190, 280, 320, 400 and 800 kPa absolute. The curve flattens as pressure rises: the first 89 kPa above atmospheric add 18.6 °C, while the 400 kPa from the kettle supply to the boiler add 27.3 °C.
- 101.3 | 100.0
- 190 | 118.6
- 280 | 131.2
- 320 | 135.8
- 400 | 143.1
- 800 | 170.4
```

That one-to-one link between pressure and temperature is what makes steam controllable. To heat a kettle's jacket to a steady 143 °C, hold its steam at 400 kPa absolute. Change the pressure, and the temperature follows.

## Absolute and gauge pressure

Steam tables use **absolute** pressure: pressure measured from a perfect vacuum. Pressure gauges on plant read **gauge** pressure: pressure above the atmosphere. The difference is atmospheric pressure, about 101.3 kPa, or about 1 bar. SV-8's boiler at 800 kPa absolute shows about **6.99 bar** on its gauge, usually called 7 bar gauge; the kettle supply at 400 kPa absolute shows about **2.99 bar**, about 3 bar gauge.

Reading a table at the gauge pressure, as though it were absolute, picks the wrong row: about a bar too low. At SV-8's pressures, that puts the saturation temperature several degrees out, and at low pressures far more: between 101.3 and 190 kPa absolute the boiling point rises from 100.0 °C to 118.6 °C. Every steam calculation should state which pressure it uses, with "a" or "abs" and "g" written after the number.

## The table's columns

For each pressure, a saturated steam table gives, per kilogram:

```figure
type: stack
title: Where the heat sits in a kilogram of dry steam at 400 kPa absolute
unit: kJ/kg
caption: Published steam table values. Together they make h_g, about 2,738 kJ/kg. The latent part, nearly four-fifths of the total, is released only when the steam condenses, at a steady 143.1 °C.
- Heat in the boiling water, h_f | 604.7
- Latent heat of evaporation, h_fg | 2133
```

- **h_f**, the enthalpy of saturated liquid: the heat in water at its boiling point, measured from a reference near 0 °C;
- **h_fg**, the enthalpy of evaporation, or latent heat: the extra heat to turn that water entirely into steam at the same temperature;
- **h_g**, the enthalpy of saturated steam: h_f plus h_fg, the total heat in dry steam;
- **v_g**, the specific volume of the steam: how many cubic metres a kilogram occupies.

Two things stand out. The total heat in steam, h_g, barely changes with pressure: 2,676 to 2,768 kJ/kg across the range. And most of it is latent heat, released only when the steam condenses.

## Latent heat: why steam carries so much

When a kilogram of steam at 400 kPa condenses in a kettle's jacket, it gives up its latent heat, **2,133 kJ**, at a steady 143.1 °C, and leaves as a kilogram of hot water. Compare that with hot water used as a heating medium: a kilogram of water cooling from 85 °C to 15 °C gives up only about **4.19 × 70 ≈ 293 kJ**. Condensing steam delivers about **7.3 times** as much heat per kilogram, and does it at a constant, high temperature, which makes heat transfer through a jacket or coil fast and even.

That is steam's great advantage: a small mass flow carries a large heat flow. One of SV-8's kettles, at 100 kW, needs only about **169 kg** of steam an hour, as Chapter 3 shows.

## Specific volume: why pipe size depends on pressure

Steam's volume changes greatly with pressure. A kilogram at 800 kPa occupies **0.240 m³**; at 400 kPa, **0.462 m³**, about 1.9 times as much; at atmospheric pressure, **1.67 m³**, about 3.6 times as much again. For the same mass flow, steam at low pressure needs much larger pipes to keep its velocity reasonable, as Chapter 5 calculates.

That gives the usual pattern of steam systems: **distribute at high pressure, use at low pressure**. High pressure keeps the main small and cheap and its heat loss low; reducing the pressure near the point of use gives the lower temperature the process needs and slightly more latent heat per kilogram. SV-8 raises steam at 800 kPa, carries it 60 m in a small main, and reduces it to 400 kPa at the kettles.

## Wet steam and dryness fraction

The table describes **dry saturated steam**: steam with no liquid water in it. Steam leaving a boiler often carries droplets of water, and steam travelling through a pipe loses heat and condenses a little. Such **wet steam** is described by its **dryness fraction x**, the proportion by mass that is actually steam. Steam at x = 0.95 is 95% steam and 5% water.

Wet steam carries less heat. Its enthalpy is **h_f + x × h_fg**, and the heat it releases on condensing is only **x × h_fg**. The water droplets also form a film on heating surfaces that slows heat transfer further, and they erode valves and fittings.

Good practice keeps steam dry: a boiler operated within its rated output and water level, a separator after the boiler, a main that falls in the direction of flow with drain points and traps, and insulation to limit condensation.

## Reading between rows

Tables list pressures at intervals, and real pressures rarely fall exactly on a row. Between two nearby rows, properties change smoothly enough that **linear interpolation** is accurate for practical work. The published table has rows at 280 and 320 kPa absolute, with saturation temperatures of 131.2 °C and 135.8 °C and latent heats of 2,170 and 2,157 kJ/kg. For steam at 300 kPa absolute, halfway between, the saturation temperature is about **(131.2 + 135.8) ÷ 2 ≈ 133.5 °C** and the latent heat about **(2,170 + 2,157) ÷ 2 ≈ 2,164 kJ/kg**. Interpolating across widely spaced rows, say from 400 to 800 kPa, is less accurate because the properties curve; use a table with closer rows, or steam property software, for anything that matters.

## Kilojoules, kilowatt-hours and tonnes

Steam tables give heat in kilojoules per kilogram; bills and boiler ratings use kilowatts and kilowatt-hours. One kilogram of steam at 400 kPa releases 2,133 kJ on condensing, which is about **0.593 kWh**, so a tonne releases about **593 kWh** of latent heat. A heating duty in kilowatts, divided by the latent heat in kilojoules per kilogram, gives the steam flow in kilograms per second; multiplied by 3,600, kilograms per hour. These two conversions, latent heat into kilowatt-hours and duty into kilograms an hour, are the ones most worth practising.

## The condensate still holds heat

When the steam has condensed, the kilogram of water leaving the kettle's jacket is still at 143.1 °C, holding its h_f of **604.7 kJ/kg**. Compared with feedwater at about 80 °C, which holds about 4.19 × 80 ≈ 335 kJ/kg, the condensate carries about **270 kJ/kg** of heat that the boiler would otherwise have to supply again. That is about an eighth of the latent heat, and a large part of why condensate is worth returning to the boiler, as Chapters 6 and 7 calculate. A steam system is really a loop: steam out, condensate back, with every kilogram of condensate lost costing its heat, its treated water and its treatment chemicals.

## Checking how dry steam is

Dryness cannot be seen from outside a pipe. Three practical approaches give an idea of it. The first is a **heat balance**: measure the steam flow to a process and the heat its product actually gains, and compare the heat per kilogram with the table's latent heat, as in the failure case below. The second is a **throttling calorimeter**: a small sample of steam is bled through a valve into a chamber at atmospheric pressure, where, if the original steam was nearly dry, it becomes slightly superheated; the measured temperature then gives the original dryness from the table, because throttling keeps the enthalpy constant, as Chapter 4 explains. The third is simply watching for symptoms: water hammer, wet discharges from traps and vents, slow heating and erosion of valve seats all point to wet steam. On SV-8, the heat balance was the method used, because the kettles already had product temperature probes and a portable steam flow meter was available.

```figure
type: decision
title: Choosing a way to judge how dry the steam is
question: What can you measure at the point of use?
caption: Methods described in this chapter. A heat balance needs a steam flow meter and a product temperature; a throttling calorimeter needs a sampling point and works only on nearly dry steam.
- *Steam flow and the heat the product gains | heat balance | heat per kilogram ÷ the table's h_fg gives the dryness fraction
- A sample of steam bled to atmospheric pressure | throttling calorimeter | measured superheat and constant enthalpy give the original dryness
- Only what you can see and hear | symptoms | water hammer, wet trap discharges, slow heating and eroded seats point to wet steam
```

## Superheated steam

Steam heated above its saturation temperature, with no water present, is **superheated**. Superheat is valuable in turbines, where it prevents water forming in the last stages, but for process heating it is a nuisance: superheated steam must first cool to saturation before it condenses, and it gives up heat poorly while it does. Most factory process steam is saturated, as SV-8's is, and a table of saturated steam covers everything the factory needs. Superheated steam has its own tables, with temperature as well as pressure, because the two are no longer linked. Chapter 4 shows that reducing pressure through a valve can add a small amount of superheat.

## A failure case: wet steam to the kettles

This is an illustration. Shortly after SV-8's boiler was replaced with a larger unit, the kitchen supervisor reported that the kettles were taking noticeably longer to bring each batch to temperature, and that the steam lines near the kettles knocked and hammered at start-up.

The maintenance engineer measured the steam flow to one kettle during heat-up with a portable flow meter and compared it with the heat going into the product. The heat delivered per kilogram of steam was about **8% less** than the table's 2,133 kJ/kg, consistent with a dryness fraction of about 0.92. The new boiler had been commissioned with its water level set high and its firing rate stepped up quickly at start-up, both of which make a boiler throw water into its steam.

The detection came from comparing measured steam with the heat the product actually received. The correction was to reset the boiler's water level and start-up firing ramp to the maker's settings, and to fit a separator with a trap on the main after the boiler. The kettles' heat-up times returned to normal, and the knocking stopped. The boiler's start-up settings were written into its operating instructions, so they would survive the next service.

## How this applies to a small Australian business

Use a steam table, and always at absolute pressure: add about 101 kPa to a gauge reading first. Remember that most of steam's heat is latent, released only on condensing, at a constant temperature set by the pressure. Distribute steam at high pressure to keep pipes small, and reduce it near the point of use. Keep steam dry with good boiler operation, separators, drainage and insulation, because wet steam carries less heat and damages the system. And write "a" or "g" after every steam pressure.

## Exercise: how wet is too wet

At 400 kPa absolute, steam with a dryness fraction of **0.90** is supplied to a 100 kW kettle. What is its enthalpy, how much heat does each kilogram release on condensing, and how much more steam does the kettle need than with dry steam?

**Worked answer.** The enthalpy is **604.7 + 0.90 × 2,133 ≈ 2,524 kJ/kg**. Each kilogram releases **0.90 × 2,133 ≈ 1,920 kJ** on condensing to saturated water. The kettle needs **100 ÷ 1,920 ≈ 0.052 kg/s**, about **188 kg/h**, compared with about 169 kg/h of dry steam, about **11% more**. The boiler must raise that extra steam, and the water film in the jacket slows the kettle as well, so wet steam costs both fuel and production time.
