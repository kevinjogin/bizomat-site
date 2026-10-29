---
book: condensation-control-by-the-numbers
chapterSlug: breathing-and-air-paths
order: 3
title: "Breathing: how enclosures draw in water"
description: "Thermal and barometric breathing, stack flow and cable conduits: how much moist air each path brings into an enclosure, and how a warm, wet pit turned out to be the real source."
draft: false
---

Chapter 2 showed that the water condensing on a cold surface inside an enclosure is limited by the supply of moist air, not by the surface. A cabinet that only ever held its original air could produce a gram or two of condensate and then stay dry. Every enclosure that collects more than that is being refilled with moist air, again and again, through some path.

This chapter identifies the paths and puts numbers on each: thermal breathing as the enclosure warms and cools, barometric breathing as the weather changes, buoyancy or stack flow through openings at different heights, and the path that so often turns out to matter most, cable conduits from an underground pit. It finishes with the winter puzzle at PS-7, where CC-7's inside air was far wetter than the weather outside could explain.

## Thermal breathing

An enclosure's air expands when it warms and contracts when it cools. If the enclosure is not perfectly sealed, the expanding air pushes out through the gaps and the contracting air draws new air in. At constant pressure the volume of a fixed amount of gas is proportional to its absolute temperature, so the share of the air exchanged in one cycle is 1 − T_cool ÷ T_warm.

This is an illustration. On a summer day, CC-7's drive runs for eight hours and the inside air reaches about 46.6 °C; at night, on standby, it falls to about 21.7 °C. Its free air volume is 0.27 m³.

```figure
type: formula
title: Air drawn in by one cooling of CC-7
formula: ΔV = V × (1 − T_cool ÷ T_warm)
caption: Temperatures absolute. The air drawn in has the outside air's water content; a similar volume of the inside air is pushed out on the next warming.
- V | free air volume, 0.27 m³
- T_warm | 46.6 °C = 319.75 K, pump running
- T_cool | 21.7 °C = 294.85 K, standby at night
step: ΔV = 0.27 × (1 − 294.85 ÷ 319.75) = 0.0210 m³, 7.8% of the volume
step: water drawn in = 0.0210 m³ × 16.39 g/m³ (20 °C, 95% RH) = 0.35 g per day
```

The [gas volume tool](/tools/gas-law/) gives the same result: 0.27 m³ at 46.6 °C and 0 bar gauge becomes 0.249 m³ at 21.7 °C and the same pressure, so 21 litres of outside air must enter to fill the space. Over a year of such days, thermal breathing brings in about **126 g** of water. That is a real quantity, and in a cabinet that never dries out it accumulates, but it is spread over a year. It cannot explain a puddle that appears overnight.

### What happens if the cabinet is truly sealed

If CC-7 were perfectly sealed, the air could not contract and its pressure would fall instead: from 101.3 kPa to 101.3 × 294.85 ÷ 319.75 = **93.4 kPa**, a vacuum of about 7.9 kPa. Across the 1.2 × 0.8 m door that is a force of about 7.6 kN, roughly the weight of a small car. No cabinet door seal is designed to hold that, and in practice the seal leaks long before the pressure difference builds up; the cabinet breathes anyway, only less predictably. Small sealed electronic housings face the same physics at a smaller scale, which is why [Seal and vent the enclosure](/reados/publications/electronics-packaging-by-the-numbers/seal-and-vent-the-enclosure/) in *Electronics Packaging by the Numbers* treats pressure equalisation as part of sealing. Chapter 4 compares the options.

## Barometric breathing

The atmosphere's pressure changes with the weather. A typical change over a day or with a passing front is one or two kilopascals. An enclosure whose air is at constant temperature exchanges the same fractional volume: a 1.5 kPa change is 1.5%, or about **4 litres** for CC-7, carrying only 0.07 g of water. Barometric breathing is smaller than thermal breathing for an outdoor cabinet, though it matters for well-insulated or buried enclosures whose temperature hardly changes.

## Stack flow through openings at different heights

Warm air is lighter than cool air. When an enclosure has openings at the bottom and the top, and its air is warmer than the air outside, the warm column inside pushes air out at the top and draws air in at the bottom, continuously, for as long as the temperature difference lasts. This is stack or buoyancy flow, and unlike breathing it does not stop after each cycle.

The driving pressure is g × h × (ρ_out − ρ_in), where h is the height between the openings. Air density at atmospheric pressure is p ÷ (R T), with R = 287 J/kg·K for dry air.

```figure
type: compare
title: Stack pressure across CC-7, openings 1.1 m apart
cols: Outside air | Inside air | Density difference | Stack pressure
rowhead: Condition
caption: This is an illustration. The pressures are tiny, but the openings can be large, and a flow driven by a fraction of a pascal never stops while the cabinet is warmer than its surroundings.
- Summer day, pump running | 29 °C, 1.168 kg/m³ | 46.6 °C, 1.104 kg/m³ | 0.064 kg/m³ | 0.69 Pa
- Summer night, standby | 20 °C, 1.204 kg/m³ | 21.7 °C, 1.197 kg/m³ | 0.007 kg/m³ | 0.075 Pa
```

The flow through an opening is roughly C_d × A × √(2Δp ÷ ρ). For a pressure of 0.69 Pa that is a velocity of about 1.1 m/s through a sharp opening, so even a few hundred square millimetres of gap at the top and the bottom pass of the order of a cubic metre of air an hour. A cabinet that breathes by stack flow can exchange its whole air volume several times an hour. That explains why CC-7's inside dew point tracked the outside dew point so closely in Chapter 1's logged data.

### A worked estimate of gap flow

This is an illustration. Suppose CC-7's door seal leaves an effective gap of about 500 mm² near the top, and the gland plate and conduits leave about 3,200 mm² at the bottom. Air must pass through both in series, and two openings in series behave like a single opening of area 1 ÷ √(1/A₁² + 1/A₂²), here about **494 mm²**. With a discharge coefficient of 0.6:

- On a summer day, at 0.69 Pa and a mean density of 1.14 kg/m³, the flow is 0.6 × 494 × 10⁻⁶ × √(2 × 0.69 ÷ 1.14) ≈ 3.3 × 10⁻⁴ m³/s, or **1.18 m³/h**, about 4.4 changes of the cabinet's 0.27 m³ of air an hour.
- On a summer night, at 0.075 Pa, the same gaps pass about **0.38 m³/h**, about 1.4 air changes an hour.

The night figure is nearly three times the 0.5 air changes an hour assumed in Chapter 2, so the roof there could have collected nearly three times the 5.7 g estimated. These figures are only as good as the assumed gap areas, which are hard to measure, but they show the scale: stack flow through modest gaps exchanges the air tens of times more than breathing does. Two practical consequences follow. A cabinet with gaps at both top and bottom cannot hold a dew point different from its source air for long. And the smaller of the two openings controls the flow, so sealing either the top or the bottom properly reduces stack flow sharply, while sealing both halfway achieves little.

Where the bottom opening leads matters as much as how large it is. If it opens to outside air, the cabinet's air has the outside dew point. If it opens to a pit, a trench or a conduit, the cabinet breathes whatever air is there.

## Cable conduits from pits

Cables rarely arrive in an outdoor cabinet through the air. They come up from an underground pit through conduits, and an unsealed conduit is an open pipe between the pit and the cabinet. Pits are usually wet: rainwater and groundwater collect in them, their walls are damp, and their air is close to saturation at the temperature of the surrounding soil. A metre or so below the surface, soil temperature varies much less than the air temperature, so it is cooler than the air in summer and warmer in winter.

That seasonal difference decides whether a pit is a problem. In summer at PS-7, soil at about 18 °C makes the pit air saturated at 18 °C, with a dew point of 18 °C, slightly drier than the summer night air outside at a dew point of 19.2 °C. In winter the pit air, saturated at about 16 °C, has a dew point of **16 °C**, nearly 10 K above the winter night air's 6.3 °C. A cabinet drawing pit air in winter is breathing summer humidity.

```figure
type: bars
title: Dew point of the air each path brings into CC-7 on a winter night
unit: °C
max: 18
caption: This is an illustration with an assumed pit at 16 °C. The cabinet's air sits at 8.7 °C on standby; any source with a dew point above that condenses on every surface inside, not just the roof.
- Outside air, 7 °C, 95% RH | 6.3
- * Pit air, saturated at 16 °C | 16
- Cabinet air temperature on standby | 8.7
```

Warm pit air in a cold cabinet is the worst combination: the pit air is warmer than the cabinet, so it rises into it by buoyancy, and its dew point is above the temperature of everything inside, so it condenses not only on the roof but on the walls, the gland plate, the terminals and the drive.

## The error: a winter cabinet wetter than the weather

This is an illustration. During CC-7's first winter, the operators reported water on the gland plate and on the bottom terminal rows most mornings, even after the canopy from Chapter 2 had been fitted. The telemetry log now recorded the inside dew point, as the business had decided in Chapter 1, and it showed something new: on winter nights the inside dew point sat between **12 and 14 °C**, while the outside dew point was about 6 °C. No amount of breathing outside air could raise the cabinet's dew point above the outside's. The water had to be coming from somewhere wetter.

The technician lifted the pit lid. The pit held 150 mm of water, its walls were wet, and the four conduits ended open above the water, two of them with no cables in them at all, installed for future use. A smoke pencil held at the conduit mouths showed a steady draught up into the cabinet.

The numbers fit. Pit air saturated at 16 °C holds 13.6 g/m³. At an assumed **0.1 m³/h** of pit air reaching the cabinet, which is a modest flow for open conduits, the cabinet received 0.1 × 24 × 13.6 ≈ **33 g of water a day**. Cooled to the cabinet's 8.7 °C, where saturated air holds 8.6 g/m³, that air had to give up 0.1 × 24 × (13.6 − 8.6) ≈ **12 g a day** as liquid. Mixed with an equal flow of outside air, the inside air's dew point would sit near 11.8 °C, inside the logged range once the cabinet's own temperature swings are allowed for.

```figure
type: stats
title: CC-7's winter water budget before the conduits were sealed
caption: This is an illustration with an assumed pit-air flow of 0.1 m³/h. Thermal breathing of outside air, the path everyone had thought about, is a few hundredths of the water the pit supplied.
- 33 g/day | water carried in by pit air
- 12 g/day | condensed inside at 8.7 °C
- 0.35 g/day | thermal breathing of outside air, summer
- 6.3 °C | inside dew point after the conduits were sealed
```

The fix was to seal every conduit at both ends with a duct-sealing compound made for the purpose, including the spare conduits, and to fit a drain to the pit. Within a week the inside dew point fell to track the outside dew point, and the wet mornings stopped. The business added the conduit seals to its installation checklist and to the six-monthly inspection.

## A water budget for any enclosure

The PS-7 investigation suggests a simple discipline for any enclosure with a condensation problem: write down every path, estimate its flow and the dew point of the air it brings, and multiply.

```figure
type: steps
title: Building an enclosure's water budget
caption: The purpose is to find the dominant path before choosing a fix. In most outdoor enclosures it is an opening to something wetter than the weather.
- List the paths | door seals, gland plate, conduits, vents, drains, cable glands, fan openings
- Find what each opens to | outside air, a pit, a trench, a plant room, a wash-down area
- Estimate each source's dew point | measure it where possible; pits and wet rooms are often near saturation
- Estimate each path's flow | breathing volume per cycle, stack flow through measured gaps, smoke tests
- * Multiply and compare | grams per day from each path; deal with the largest first
- Confirm by logging | inside dew point should track the source you believe is dominant
```

A water budget does not need to be precise to be useful. Flows through gaps are uncertain by a factor of two or more, but the paths usually differ by factors of ten or a hundred, as they did at PS-7. Knowing which path dominates is what decides the fix.

### Other paths worth checking

Several other paths turn up in practice and belong on the list:

- **Cable glands that do not grip the cable.** A gland sized for a larger cable, or a multi-core cable whose cores are not sealed, leaves a path along the cable itself. Air can also travel inside a cable's sheath from a wet pit to a dry terminal box.
- **Drain holes and breather plugs.** These are deliberate openings, and their position decides what air they admit. A breather at the bottom of an enclosure mounted over a wet area brings in that area's air.
- **Fans and filters.** A fan-ventilated enclosure exchanges its air with the room tens of times an hour by design, and it has the room's dew point. Chapter 4 explains when that is acceptable.
- **Doors left open.** An enclosure opened for maintenance on a humid day takes in a full charge of humid air, which then condenses when the door closes and the night cools it. Desiccants and heaters are sized to recover from that, as Chapters 5 and 6 explain.

## Exercise: a spare conduit in summer

In summer, PS-7's pit air is saturated at 18 °C. Suppose one conduit had been left unsealed and supplied 0.05 m³/h of pit air to CC-7 continuously, and that on a clear summer night the inner face of CC-7's roof falls to 12.7 °C without the canopy, as in Chapter 2. How much water could the pit air deposit on the roof in an 8-hour night, and how does that compare with the pit's effect in winter?

**Worked answer.** Saturated air at 18 °C holds 15.33 g/m³; saturated air at 12.7 °C holds about 11.1 g/m³. Each cubic metre that reaches the roof can give up about 15.33 − 11.1 = 4.2 g. Over 8 hours, 0.05 × 8 = 0.4 m³ arrives, so the pit air could deposit up to about **1.7 g**, and only on surfaces below its 18 °C dew point, which on a summer night is just the roof. In winter the same pit air, with a dew point of 16 °C, condenses on every surface in a cabinet at 8.7 °C, so its effect is far larger. The summer case is dominated by the outside air and the night sky; the winter case is dominated by the pit. Sealing the conduits deals with both.
