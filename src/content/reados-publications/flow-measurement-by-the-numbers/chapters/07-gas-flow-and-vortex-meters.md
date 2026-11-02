---
book: flow-measurement-by-the-numbers
chapterSlug: gas-flow-and-vortex-meters
order: 7
title: "Gas flow and vortex meters"
description: "Why a gas’s actual volume changes with pressure and temperature, free air and normal volumes, how a vortex meter counts eddies, its low-flow cutoff, and an air audit that understated demand eightfold."
draft: false
---

Gases make flow measurement harder in one fundamental way: their volume depends on their pressure and temperature. A cubic metre of compressed air at 7 bar gauge contains nearly eight times as much air as a cubic metre at atmospheric pressure. A meter that measures velocity in the pipe measures actual volume, at whatever pressure and temperature the gas happens to be, and its reading means nothing for energy, cost or comparison with a compressor's rating until it has been converted to a standard basis. Almost every misunderstanding about gas flow comes from that conversion.

This chapter explains actual, free air and normal volume flow, converts the brewery's compressed air flow with the gas law tool, describes the vortex meter that measures it, works out its signal and its low-flow limit, and finishes with an energy audit that compared actual cubic metres with the compressor's free air rating and concluded the air system was nearly idle.

## Actual, free air and normal volumes

For an ideal gas, volume is proportional to absolute temperature and inversely proportional to absolute pressure. The same mass of gas therefore has a different volume at every pressure and temperature, and a volume flow must always be stated with its conditions.

```figure
type: formula
title: Converting a gas volume flow between conditions
formula: Q₂ = Q₁ × (p₁ ÷ p₂) × (T₂ ÷ T₁)
caption: Pressures and temperatures are absolute: bar absolute = bar gauge + atmospheric pressure, and kelvin = °C + 273.15. The mass flow is the same at both conditions; only the volume it occupies changes.
- Q₁, Q₂ | volume flows at conditions 1 and 2
- p₁, p₂ | absolute pressures
- T₁, T₂ | absolute temperatures
```

Three bases are common.

**Actual volume** is the volume at the conditions in the pipe, the quantity a velocity meter senses. It is useful for sizing pipes and checking velocities and nearly useless for anything else.

**Free air**, or free air delivery, is the volume the air would occupy at stated reference conditions near the compressor's inlet, often about 1 bar absolute and 20 °C. Compressors are rated in it, and compressed air demands and leak rates are usually stated in it, so that they can be compared with the compressor's output.

**Normal volume**, written Nm³, is the volume at 0 °C and 1.01325 bar absolute. It is common for industrial gases and in European practice. Normal and free air volumes for the same mass differ by about 8%, because of the temperature difference, so the basis must be stated even between two "standard" figures.

## The brewery's compressed air

The brewery's air compressor delivers up to 4 m³/min of free air, taken here at 1.013 bar absolute and 20 °C, and its main runs at 7 bar gauge, 8.013 bar absolute, and about 25 °C after the dryer. The [gas volume at pressure and temperature tool](/tools/gas-law/) converts between the two: entering 4 m³/min at 0 bar gauge and 20 °C and converting to 7 bar gauge and 25 °C, with atmospheric pressure at 1.013 bar, gives 0.5143 m³/min of actual volume, a ratio of 0.1286. In FT-401's DN50 main, with a 52.5 mm bore, that actual flow, 30.9 m³/h, moves at only 3.96 m/s.

```figure
type: compare
title: The compressor's full output on three bases
cols: Volume flow | Basis
rowhead: Expressed as
- Free air, 1.013 bar absolute and 20 °C | 4.00 m³/min, 240 m³/h | compressor rating; demand and leaks
- Normal, 1.01325 bar absolute and 0 °C | 3.73 m³/min | about 7% less volume for the same mass
- * Actual, 8.013 bar absolute and 25 °C | 0.514 m³/min, 30.9 m³/h | what FT-401 senses
caption: This is an illustration. Actual = free air × (1.013 ÷ 8.013) × (298.15 ÷ 293.15) from the gas law tool. The density of the air in the main is about 9.4 kg/m³.
```

## How a vortex meter works

A blunt object placed across a flow sheds vortices alternately from its two sides, the same mechanism that makes a flag flutter or a power line hum in the wind. Over a wide range of Reynolds numbers, the frequency of shedding is proportional to the velocity past the object, with a constant of proportionality, the Strouhal number, that depends on the object's shape and is very nearly independent of the fluid.

```figure
type: formula
title: Vortex shedding frequency
formula: f = St × v ÷ d
formula: Volume flow from frequency: Q = f ÷ K
caption: St is the Strouhal number, about 0.2 for many bluff shapes, v the velocity past the bluff body and d its width. The meter's K-factor, in pulses per cubic metre, is found by calibration and is nearly constant over the meter's range.
- f | shedding frequency, Hz
- St | Strouhal number
- d | width of the bluff body, m
- K | meter factor, pulses per m³
```

A vortex meter places a bluff body, about a quarter of the bore wide, across a spool and senses the alternating pressure of the vortices with a piezoelectric or capacitive sensor. Each vortex is a pulse, and counting pulses counts volume. With no moving parts, a reading independent of the fluid's density and viscosity over its range, and tolerance of high temperatures, vortex meters are widely used for steam, compressed air and other gases, and for liquids.

At the compressor's full output, with a bluff body 0.28 times the 52.5 mm bore and a Strouhal number of 0.2, FT-401's vortices are shed at 0.2 × 3.96 ÷ 0.0147 = 54 Hz.

### The low-flow cutoff

Vortex shedding becomes irregular below a minimum Reynolds number, and the vortices' pressure pulses, which grow with the gas's density and the square of its velocity, become too weak to sense. Every vortex meter therefore has a low-flow cutoff, below which it reads zero. In compressed air at 7 bar gauge, that cutoff is typically a few metres per second for a meter of this size; the maker's sizing program gives the exact figure for the gas's density and viscosity.

FT-401, sized for the compressor's full output, sees only 3.96 m/s at full flow, close to its cutoff. On a weekend, when the brewery's air demand falls to its leaks, about 0.6 m³/min of free air, the velocity is 0.59 m/s, far below the cutoff, and the meter reads zero. A meter that reads zero at night cannot measure the leaks it would be most useful for finding, a point Chapter 10 returns to when the meter's size is reconsidered.

## Correcting a velocity meter to free air

A vortex meter measures actual volume. To report free air, the meter or the control system must multiply by the ratio of densities, which needs the actual pressure and temperature at the meter. Many vortex meters for gas include a pressure and temperature sensor and do the correction internally; others leave it to the control system; a simple meter with neither reads actual volume and nothing else.

The correction is not small, and its inputs must be accurate. An error of 0.1 bar in the line pressure at 8.013 bar absolute changes the free air figure by 1.2%; an error of 3 K in temperature changes it by 1.0%. Using the compressor's set pressure rather than the measured pressure at the meter, when the main loses 0.3 bar between the compressor and the meter, puts the reading 3.7% high. The pressure and temperature used for the correction must therefore be measured at the meter, close to it and on the same pipe, and logged with the flow, so that a later reader can repeat the conversion.

## The mistake: actual cubic metres against a free air rating

An energy consultant audited the brewery's compressed air by logging FT-401's output for a week. FT-401 was a simple vortex meter without pressure and temperature compensation, configured to display actual cubic metres per hour. The consultant's report compared its average, about 19 m³/h during production, with the compressor's rating of 240 m³/h of free air and concluded that the compressor was running at 8% of its capacity, grossly oversized, and recommended replacing it with one a quarter of the size.

```figure
type: steps
title: Converting the audit to free air
caption: This is an illustration. Actual volume at 7 bar gauge is about an eighth of the free air volume of the same mass of air.
- Logged | average 19 m³/h actual during production, from an uncompensated vortex meter
- Compared with | compressor rating 240 m³/h of free air
- Conclusion in the draft report | compressor at 8% of capacity; replace with one a quarter of the size
- * Conversion | 19 × (8.013 ÷ 1.013) × (293.15 ÷ 298.15) = 148 m³/h of free air, 62% of the rating
- Cross-check | compressor's own load hours: loaded about 60% of production time
- Outcome | recommendation withdrawn; meter reconfigured to free air with measured pressure and temperature
```

Converted to free air, the 19 m³/h of actual volume at 8.013 bar absolute and 25 °C was 19 × (8.013 ÷ 1.013) × (293.15 ÷ 298.15) = 148 m³/h, 62% of the compressor's rating, a sensible loading. The compressor's own controller confirmed it: it had been loaded for about 60% of production hours. The draft recommendation was withdrawn before it reached the brewery's management, and FT-401 was replaced with a vortex meter with built-in pressure and temperature sensors, configured to report free air at the compressor's stated reference conditions, with the conditions written beside the reading on every display and report. Had the recommendation gone ahead, a compressor a quarter of the size, delivering 1 m³/min of free air, would have faced a production demand of about 2.5 m³/min. The pressure in the main would have collapsed within minutes of the brewhouse and packaging line starting together, and the brewery would have had to hire a portable compressor while it bought another. The consultant had done the arithmetic correctly on the wrong basis, which is the most dangerous kind of error, because every step can be checked and found right. The question that would have caught it was a simple one: does a compressor running at 8% of its capacity match what its own controller says about its loaded hours?

## Steam

Steam is the gas most often measured by vortex meters, and it shows the density problem at its sharpest. Saturated steam's density depends on its pressure alone, from about 3 kg/m³ at 5 bar gauge to about 5 kg/m³ at 9 bar gauge, so a vortex meter on saturated steam needs a pressure measurement to turn volume into mass. Superheated steam needs pressure and temperature. Wet steam, carrying water droplets, reads wrongly on any meter, because the droplets carry mass that the vortices do not represent. Breweries that raise steam for their brewhouse meter it in kilograms per hour, from vortex meters with pressure compensation, to track boiler efficiency and the steam used per brew. The brewery in this book heats its brewhouse electrically and has no steam, which is why the hot liquor line carries water.

## Compressor pulsation and the meter's position

Reciprocating and some rotary compressors deliver air in pulses, and a vortex meter close to the compressor can see those pulses as velocity fluctuations. If their frequency is near the meter's shedding frequency, the meter can lock on to the pulsation and read it as flow. A receiver between the compressor and the meter smooths the flow, and the meter is best placed downstream of the receiver and dryer, in a straight run, where the air is dry, steady and at its working temperature. FT-401 sits there, 15 diameters downstream of a reducer, as Chapter 2's table showed. Placing it there also means it measures what the brewery uses, not what the compressor delivers into the receiver, which differs by any air the dryer purges.

## Other gas meters

**Thermal mass meters** measure the heat carried away from a heated element by the gas and respond to mass flow directly, so they need no pressure or temperature correction. They suit low flows and leak monitoring, and they must be calibrated for the gas's composition, because different gases carry heat differently. Moisture in the gas changes its heat transfer too, so they are installed after dryers, where the gas is clean and its composition steady. The brewery uses one on its carbon dioxide recovery line, as Chapter 5 mentioned.

**Differential pressure meters** work for gases as for liquids, with an expansibility factor in the orifice equation to allow for the gas's expansion through the restriction, and with the density at the plate, which depends on pressure and temperature, inside the square root.

**Turbine and rotary meters**, with moving parts, measure gas volume accurately and are standard for natural gas billing, with volume correctors that apply the pressure and temperature conversion.

## Exercise: a nitrogen line

The brewery's packaging line uses nitrogen at 4 bar gauge and 15 °C, supplied from a generator rated at 30 Nm³/h, normal conditions being 1.01325 bar absolute and 0 °C. The nitrogen is measured by a vortex meter in a DN25 line with a 26.6 mm bore. Calculate the actual volume flow at the meter at the generator's full output, the velocity in the line, and the free air equivalent at 1.013 bar absolute and 20 °C. Then say whether the vortex meter is suitable if its low-flow cutoff is 3 m/s.

### Answer

**Given:** 30 Nm³/h at 1.01325 bar and 273.15 K; line at 5.01325 bar absolute (taking atmosphere as 1.01325 bar) and 288.15 K; bore 26.6 mm; cutoff 3 m/s.

**Assumptions:** ideal gas; steady flow.

**Method:** Q_actual = Q_N × (p_N ÷ p) × (T ÷ T_N); v = Q ÷ A.

**Actual flow:** 30 × (1.01325 ÷ 5.01325) × (288.15 ÷ 273.15) = 30 × 0.2021 × 1.0549 = 6.40 m³/h.

**Velocity:** A = π × 0.0266² ÷ 4 = 5.557 × 10⁻⁴ m²; v = (6.40 ÷ 3,600) ÷ 5.557 × 10⁻⁴ = 3.20 m/s.

**Free air equivalent:** 30 × (1.01325 ÷ 1.013) × (293.15 ÷ 273.15) = 32.2 m³/h.

**Suitability:** at full output the velocity is only 3.20 m/s, just above the 3 m/s cutoff; at any lower flow the meter reads zero. A smaller meter, DN15, would raise the velocity about threefold, or a thermal mass meter, which reads mass flow directly and works at low velocities, would suit the duty better.

**Verification:** the gas law tool, with its atmospheric pressure set to 1.01325 bar and 30 m³/h at 0 bar gauge and 0 °C converted to 4 bar gauge and 15 °C, gives 6.40 m³/h, matching. Left at its default atmosphere of 1.013 bar, with the normal state entered as 0.01325 bar gauge, it gives 6.48 m³/h, because the absolute pressure at state 1 then becomes 1.026 bar: a reminder that every pressure in a gas conversion must be on the same absolute basis.
