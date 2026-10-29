---
book: psychrometrics-by-the-numbers
chapterSlug: heating-and-humidifying
order: 6
title: "Heating and humidifying in winter"
description: "Size the winter heater and humidifier from a mass and energy balance, compare steam injection with water spray, see where the energy goes, and check absorption, water quality and frosty mornings."
draft: true
---

In winter the print hall's problem is not warmth. The presses make more heat than the building loses, so the air-handling unit mostly has to stop the hall drying out. Outdoor air at 5 °C holds little water, and once it is warmed to room temperature its relative humidity collapses. Paper and board in that air give up moisture, shrink and curl, and static builds on the sheets. The humidifier is therefore the most important winter component in the plant, and the heater is sized around the way the humidifier adds its water.

This chapter sizes both from the mixed-air state found in Chapter 5 and the supply state the room needs. It compares steam injection with a water spray or evaporative pad, shows why the two need very different heaters for the same water, follows the energy into each, and covers the practical points that decide whether a humidifier works in service: where the water comes from, how far the steam or spray needs to be absorbed, and what happens on a frosty morning. It ends with a humidifier that was sized for the wrong share of outdoor air.

## The winter duty

This is an illustration. On the winter design day, 5 °C and 80% outdoors, the mixing box blends 3.0 m³/s of outdoor air with 5.0 m³/s of return air at 22 °C and 50%. Chapter 5 found the mixed air at 15.39 °C and 61.7%, with a humidity ratio of 6.698 g/kg dry air and 9.684 kg/s of dry air. Chapter 4's winter loads, a sensible surplus of 25 kW and a latent gain of 4 kW, set the supply state at 19.47 °C and 8.056 g/kg. The supply fan is downstream of the coils and adds 1.52 K, so the heater and humidifier together must deliver air at 17.95 °C and 8.056 g/kg, which is 62.96% relative humidity.

Two balances describe the section between the mixing box and the fan. Water is conserved: whatever the humidifier adds appears in the air. Energy is conserved: the heater's output plus the enthalpy carried in with the added water appears as the rise in the air's enthalpy.

```figure
type: formula
title: Mass and energy balance on a heating and humidifying section
formula: ṁ_w = ṁ_a × (ω₃ − ω₁)
formula: Q_heater = ṁ_a × (h₃ − h₁) − ṁ_w × h_w
caption: Subscript 1 is the air entering the section and 3 the air leaving it, both per kilogram of dry air. The water term is what makes steam and spray humidifiers so different: steam carries about 2,676 kJ/kg into the air, liquid water at 15 °C only about 63 kJ/kg.
- ṁ_a | dry-air mass flow, 9.684 kg/s in the winter case
- ω₁, ω₃ | humidity ratio entering and leaving, kg/kg dry air
- h₁, h₃ | enthalpy entering and leaving, kJ/kg dry air
- h_w | enthalpy of the steam or water added, kJ/kg
step: ṁ_w = 9.684 × (0.008056 − 0.006695) = 0.01318 kg/s, or 47.46 kg/h
step: ṁ_a × (h₃ − h₁) = 9.684 × (38.45 − 32.40) = 58.6 kW of enthalpy to add to the air
```

The [heating and humidification check](/tools/heating-humidification-check/) does this balance from the entering and leaving temperatures and relative humidities, the entering volume flow and the enthalpy of the steam or water, and reports the heater load, the water or steam needed, the energy the humidifier brings in, the leaving dew point and the dry-air mass flow. It compares the heater and humidifier with the capacities you enter. Entering 15.39 °C and 61.7%, 8.0 m³/s, and leaving 17.95 °C and 62.96%, it reports an entering humidity ratio of 6.695 g/kg rather than the 6.698 g/kg of Chapter 5; the 0.003 g/kg difference comes only from rounding the mixed relative humidity to one decimal place, and it changes the water by less than 0.1 kg/h.

## Steam injection against water spray

The water needed is the same whatever the humidifier type: 47.46 kg/h. The heater is not.

This is an illustration. With **steam injection** at 2,676 kJ/kg, roughly dry saturated steam near atmospheric pressure, the tool gives a heater load of **23.34 kW** and reports 35.28 kW brought in by the steam. With a **water spray or evaporative pad** fed at about 15 °C, 63 kJ/kg, the heater load is **57.79 kW** and the water brings in only 0.83 kW. The air leaving is identical in both cases, at 17.95 °C, 8.056 g/kg and a dew point of 10.80 °C.

```figure
type: compare
title: Two ways to add 47.46 kg/h of water on the winter design day
cols: Steam injection | Water spray or pad
rowhead: Quantity
best: 1
caption: This is an illustration from the heating and humidification check, entering 15.39 °C and 61.7%, leaving 17.95 °C and 62.96%, 8.0 m³/s. The total energy into the air is the same 58.6 kW; only the route differs.
- Water added | 47.46 kg/h | 47.46 kg/h
- Enthalpy of the water | 2,676 kJ/kg | 63 kJ/kg
- Energy carried in by the water | 35.28 kW | 0.83 kW
- Heater load | 23.34 kW | 57.79 kW
- Where the evaporation energy comes from | the steam generator | the heating coil
```

The difference, 57.79 − 23.34 = 34.45 kW, is the energy needed to turn 47.46 kg/h of water into vapour. Every humidifier has to supply it somewhere. A steam humidifier supplies it in a steam generator or boiler before the water reaches the air. A spray or pad supplies none, so the water takes its evaporation energy from the air, cooling it towards its wet-bulb temperature, and the heating coil has to put that energy back.

### The steam case in detail

The steam is slightly hotter than the vapour already in the air. Vapour at 17.95 °C has an enthalpy of 2,500.9 + 1.82 × 17.95 = 2,533.6 kJ/kg, so each kilogram of steam at 2,676 kJ/kg brings 142.4 kJ more than it needs to become part of the air. At 0.01318 kg/s that is 1.88 kW of sensible heat. Warming the dry air and its existing vapour from 15.39 to 17.95 °C takes 9.684 × (1.005 + 1.82 × 0.006695) × 2.56 = 25.22 kW. The heater supplies the difference, 25.22 − 1.88 = 23.34 kW, which agrees with the tool. Steam injection is therefore almost a pure moisture addition: it raises the air's temperature by only about 0.2 K.

## Where the energy goes

The total that must reach the air is fixed at 58.6 kW by the leaving state. The choice of humidifier decides which piece of plant supplies it and with what energy source.

```figure
type: bars
title: Who supplies the 58.6 kW the winter air needs
unit: kW
max: 60
caption: This is an illustration. With steam, 35.3 kW reaches the air from the steam generator and 23.3 kW from the heating coil; with a spray, the heating coil supplies almost everything.
- Steam case: heating coil | 23.3
- * Steam case: steam generator | 35.3
- Spray case: heating coil | 57.8
- Spray case: feed water | 0.8
```

The steam case needs a steam source. Plants with a boiler can inject clean steam from it if the boiler treatment chemicals are acceptable in the occupied space, which often they are not; many plants use a clean-steam generator or a stand-alone electric humidifier instead. An **electric steam humidifier** boils mains or treated water with electrodes or resistance elements. Raising 47.46 kg/h from water at 15 °C to steam at 2,676 kJ/kg takes 0.01318 × (2,676 − 4.18 × 15) = 34.44 kW, before the unit's own losses and the energy thrown away when it drains concentrated water.

This is an illustration. At an electricity price of A$0.25/kWh, excluding GST, the steam alone costs about 34.44 × 0.25 = A$8.61 for each hour the humidifier runs at the design duty. The plant's actual cost depends on how many hours of the year the outdoor air is dry enough to need humidification, which the plant can estimate from weather records and confirm by logging the humidifier's output.

The spray case moves the 34.45 kW of evaporation energy to the heating coil, which here is supplied with hot water. If that hot water comes from a gas boiler, a heat pump or recovered heat, the energy can be much cheaper than electricity for an electrode boiler. The price is a larger heating coil, here 57.79 kW instead of 23.34 kW, a larger hot-water supply, and the hygiene and water-quality demands of keeping liquid water in an air-handling unit.

## Water quality, wetting and absorption

The calculation assumes that every gram of water ends up as vapour in the air. Three practical issues decide whether that is true.

**Water quality.** A spray humidifier or atomiser that evaporates mains water leaves behind every dissolved solid in it. Those solids become a fine white dust carried into the hall, onto the presses and onto the product. Spray and atomising humidifiers are usually fed with treated water, for example from reverse osmosis or demineralisation, for this reason. Electric steam humidifiers leave the solids behind in their cylinder or tank, which must be drained and cleaned at intervals set by the maker for the local water hardness. Evaporative pads tolerate some dissolved solids but need bleed-off to keep them from scaling.

**Absorption distance.** Steam injected through a dispersion manifold takes a finite distance to become invisible vapour, and a spray takes longer to evaporate. Within that distance, droplets or condensate can wet anything they hit. Humidifier makers publish a non-wetting or absorption distance for their dispersion systems at stated air velocities, temperatures and loads. The duct or AHU section downstream must be clear of coils, filters, dampers, sensors and bends for at least that distance. A humidity sensor or high-limit sensor placed inside it reads high, because it sits in air that has not yet mixed.

**The air's capacity to absorb.** A humidifier placed where the air is cold may push it towards saturation. This is an illustration. If the plant injected the same 47.46 kg/h of steam into the mixed air before the heating coil, at 15.39 °C, the air would reach 8.056 g/kg at 15.39 °C, which is 74.1% relative humidity. That is acceptable. In a colder or more heavily humidified unit it would not be, and the rule is to humidify after heating, where the air has the most room for water. A high-limit humidity sensor downstream of the humidifier, typically set somewhere around 80 to 90% depending on the maker's guidance, shuts the humidifier off before the duct reaches saturation.

```figure
type: checklist
title: Before accepting a humidifier installation
caption: The open item is where many installations fail in their first winter: the section after the humidifier is shortened to fit the plant room.
- Water added and heater load from the mass and energy balance | 47.46 kg/h and 23.34 kW (steam) or 57.79 kW (spray) in the running case
- Humidifier downstream of the heating coil | warmest air, most capacity to absorb
- Feed water quality matched to the type | treated water for sprays and atomisers; drain and clean schedule for electric steam units
- High-limit humidity sensor and airflow interlock | humidifier off when the fan stops or the duct nears saturation
- ? Clear straight length after the dispersion manifold at least equal to the maker's absorption distance | no coil, filter, sensor or bend inside it
- x Humidity sensor inside the absorption zone | reads high and starves the hall of water
```

## A frosty morning

The winter design day is not the hardest morning. This is an illustration. At 0 °C and 95% outdoors, with the same 3.0 m³/s of outdoor air, Chapter 5 found the mixed air at 13.35 °C and 67.2%, 6.392 g/kg, with 9.758 kg/s of dry air. Holding the same leaving state, 17.95 °C and 8.056 g/kg, the heating and humidification check gives:

- **Steam injection:** 58.65 kg/h of steam and a heater load of 43.31 kW.
- **Water spray:** the same 58.65 kg/h of water and a heater load of 85.89 kW.

Holding the same leaving state understates the morning, because the colder outdoor air also raises the building's fabric and infiltration losses, which lowers the presses' sensible surplus and calls for warmer supply air. The comparison still shows how the duty grows. The water needed rises by 24% and the steam-case heater by 86% between the design day and the frosty morning.

This is an illustration. If the plant has a 60 kW hot-water coil and a 60 kg/h steam humidifier, the tool reports that the steam option meets the duty on the frosty morning with little to spare, while the spray option's 85.89 kW exceeds the coil. The capacity question is therefore settled on the coldest, driest morning in which the hall must run, not on the design day the outdoor conditions were first chosen for. The design data for the site, from Bureau of Meteorology records or the AIRAH design data, tell the engineer how cold and dry those mornings get and how often.

Start-up adds a further load. A hall that has been off over a weekend has dried out, and paper stacks and the building fabric absorb water as the humidity comes back. A humidifier sized exactly for steady operation takes a long time to bring the hall back into its band, which is one reason to start the plant early on Monday rather than buy a larger humidifier.

## The error: a humidifier sized for the wrong outdoor air

This is an illustration. The air-handling unit was first designed with 1.0 m³/s of outdoor air and 7.0 m³/s of return air, before the press extraction was added. With that mix, the [mixing of two air streams](/tools/air-stream-mixing-check/) gives mixed air at 19.76 °C and 53.8%, 7.707 g/kg, and 9.524 kg/s of dry air. To reach 8.056 g/kg the humidifier needed only 9.524 × (8.056 − 7.707) = 3.32 g/s, or 11.97 kg/h, and the designer specified a 15 kg/h unit with a comfortable margin.

When the extraction was added, the outdoor air rose to 3.0 m³/s. The air-handling unit, the dampers and the heating coil were revised. The humidifier schedule was not.

The fault showed in the first cold week. The humidifier ran at 100% output for whole shifts, and the hall drifted down to about 44% while the controls were still demanding more. With 15 kg/h added to the 9.684 kg/s of dry air, the supply rises only by 15 ÷ 3,600 ÷ 9.684 = 0.43 g/kg, from 6.695 to 7.125 g/kg. The people's latent gain adds 0.168 g/kg in the room, which settles at about 7.29 g/kg, 44.4% relative humidity at 22 °C, just outside the printer's 45 to 55% band on the design day and further outside it on colder mornings.

The trend log made the diagnosis quick: humidifier output pinned at 100%, room humidity falling, supply dew point well below its setpoint. The engineer re-ran the balance with the actual outdoor-air flow and found 47.46 kg/h needed on the design day and 58.65 kg/h on a frosty morning. The humidifier was replaced with a 60 kg/h unit, and the control drawings now carry the design water rate beside the outdoor-air flow, so that a change to one prompts a check of the other.

The lesson is general. A humidifier's duty is set mostly by the outdoor air, not by the room. In this hall the people add 4 kW of latent heat, about 5.9 kg/h of water; the outdoor air brings in far drier air than it replaces, and the humidifier makes up the difference.

## How this applies to a small Australian business

Many Australian climates are dry enough in winter, especially inland and in the south-east, that a printer, a timber workshop, an electronics assembler or a museum store loses humidity whenever the plant brings in outdoor air. The calculation in this chapter takes a few minutes with weather data and the plant's airflows. It tells an owner how much water must be added, which humidifier type suits the energy sources on site, and whether the heating coil is big enough for that type.

Electric steam humidifiers are simple to install and keep water out of the air stream, at the cost of electricity. Spray and pad humidifiers use cheaper heat but need treated water, careful hygiene and a larger coil. The choice is a whole-plant decision, not a catalogue selection, and the maker's absorption distance and maintenance requirements belong in it from the start.

## Exercise: a smaller outdoor-air share

Suppose the press extraction were reduced so that the plant needed only 2.0 m³/s of outdoor air on the winter design day, with 6.0 m³/s of return air. Using the formulas above with a mixed-air humidity ratio you calculate yourself, estimate the steam needed to reach 8.056 g/kg. Take the outdoor air at 4.314 g/kg and the return air at 8.225 g/kg, and assume dry-air flows of 2.52 kg/s outdoor and 7.08 kg/s return.

**Worked answer.** The mixed humidity ratio is the dry-air-weighted average: (2.52 × 4.314 + 7.08 × 8.225) ÷ (2.52 + 7.08) = (10.87 + 58.23) ÷ 9.60 = 7.198 g/kg. The water needed is 9.60 × (8.056 − 7.198) ÷ 1,000 = 0.00824 kg/s, or about **29.7 kg/h**. Cutting the outdoor air by one third cuts the humidifier duty by more than a third, from 47.46 kg/h, because the return air already carries most of the water the hall needs. The supply state would also change slightly, since the room loads are spread over a different dry-air flow, which is why the full balance should be re-run with the heating and humidification check before a humidifier is chosen.
