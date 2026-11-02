---
book: thermoelectric-cooling-by-the-numbers
chapterSlug: condensation-and-the-cold-side
order: 7
title: "Condensation and the cold side"
description: "Why a cooler’s cold side can sweat inside a sealed cabinet, dew point and humidity ratio, how the setpoint sets the margin, managing condensate and protecting modules from moisture."
draft: false
---

Every cooler has a surface colder than the air it cools, and every cold surface in humid air is a place where water can condense. In a refrigerator that is expected and drained away. In a sealed electronics cabinet it is a fault: water forming on the cold-side fins can drip onto terminals, run along cables and corrode the very equipment the cooler exists to protect. Whether it happens depends on two numbers, the dew point of the cabinet's air and the temperature of the coldest surface, and the cooler's setpoint largely decides the second.

This chapter explains dew point and humidity in a sealed cabinet, checks CC-1's cold side on the design day and on a humid autumn day, shows how to manage condensate where it cannot be avoided, as in the sample box, and finishes with a lower setpoint, chosen to give the electronics more margin, that put water on the terminal rail.

## Dew point and humidity ratio

Air holds water vapour up to a limit that rises steeply with temperature. The relative humidity is the vapour present as a share of that limit at the air's temperature. Cool the air without changing the amount of vapour and its relative humidity rises, until at the dew point it reaches 100% and any further cooling condenses water. A surface below the air's dew point collects condensate from the air touching it.

The amount of vapour is best described not by relative humidity, which changes with temperature, but by the humidity ratio: grams of water per kilogram of dry air. In a sealed cabinet, the humidity ratio stays the same as the air warms and cools, unless water condenses or moist air leaks in, and so does the dew point. That is the key fact for a cooled cabinet: its dew point is set by the air that was sealed into it and by whatever leaks in since, not by its temperature.

```figure
type: formula
title: The condensation check for a cold surface
formula: Condensation if T_surface < T_dew point of the air touching it
formula: Margin = T_surface − T_dew point        required margin typically 3 K
formula: Humidity ratio w = 0.622 p_v ÷ (P − p_v)        constant in sealed air without condensation
caption: p_v is the water vapour's partial pressure and P the total pressure. The dew point is the temperature at which p_v equals the saturation pressure. A margin of a few kelvin allows for colder spots on the fins and errors in the measured humidity.
- T_dew point | dew point of the air, °C
- w | humidity ratio, kg water per kg dry air
```

The [surface dew point and condensation check](/tools/surface-dew-point-check/) works the moist-air properties from the air's temperature, relative humidity and pressure, calculates the dew point, and compares a surface temperature with it against a required margin.

## CC-1 on the design day

TC-1 was last closed on a mild, humid morning, with air at 22 °C and 75% relative humidity sealed inside. The tool gives that air a dew point of 17.4 °C and a humidity ratio of 12.4 g/kg. On the design afternoon the same air, warmed to 35 °C, has a relative humidity of only 35%, but its dew point is still 17.4 °C. The cold-side fins, a little warmer than the 27.0 °C cold faces, run at about 25 °C, so the margin is 7.6 K: the fins stay dry.

```figure
type: compare
title: CC-1's cold side against the cabinet air's dew point
cols: Cabinet air | Dew point | Coldest fin | Margin | Result
rowhead: Condition
- Design day, air sealed at 22 °C and 75% RH | 35 °C, 35% RH | 17.4 °C | about 25 °C | 7.6 K | dry
- Humid autumn day, setpoint 32 °C | 32 °C, 60% RH | 23.3 °C | 27.3 °C | 4.0 K | dry
- Humid autumn day, setpoint lowered to 25 °C | 25 °C, 90% RH | 23.3 °C | 19.4 °C | −3.9 K | sweats
caption: This is an illustration from the surface dew point and condensation check. The humid case is cabinet air with a humidity ratio of 18.1 g/kg after the door was opened on a damp morning at 26 °C and 85% RH.
```

## The humid autumn day

Riverland summers are dry, but autumn brings rain and still, humid mornings, and the pump shed sits beside irrigated land. When a technician opens TC-1's door on such a morning, at 26 °C and 85% relative humidity, the cabinet's air is replaced with air whose dew point is 23.3 °C and humidity ratio 18.1 g/kg. After the door is closed, that moisture stays.

With the cooler's proportional controller holding the cabinet at 32 °C on a 24 °C day, the modules barely work: they pump 39 W at 0.94 A, drawing 5.4 W, and their cold faces sit at 27.3 °C. The fins are 4.0 K above the dew point, and dry. The low current is the protection. A cooler that only holds its cabinet a little below its limit keeps its cold side warm.

### A sealed cabinet still breathes

An IP66 cabinet keeps out dust and water jets, but it is not airtight. As its air warms through the day it expands and some leaks out past the gaskets and cable glands; as it cools at night it contracts and draws outside air back in. Between a 35 °C afternoon and a 15 °C night, the air in TC-1 changes in volume by about 7%, so each day a few per cent of its air is exchanged with the outside even with the door shut. In a dry summer this brings in dry air and does no harm. In a humid autumn it slowly raises the cabinet's dew point towards the outside air's. That is why the dew point the controller sees is not fixed at the value sealed in on the last door opening, and why a desiccant bag is a consumable that must be replaced, not a permanent fix.

### What the setpoint does

Hold the cabinet at 25 °C instead, on the same 24 °C day, and the modules must work harder: 1.60 A, with the cold faces at 19.4 °C. Against the same air's dew point of 23.3 °C, that is 3.9 K below it, and the fins sweat. The lower the setpoint, the colder the cold side and the smaller the margin, in any cabinet, whatever the weather outside. The setpoint should be no lower than the equipment needs, and in humid places it is best tied to the cabinet's dew point, as the next section describes.

## The mistake: a cooler set to 25 °C

After the router's warning in Chapter 4, a technician lowered CC-1's setpoint from 32 °C to 25 °C "to give the router more margin". Through summer, nothing changed: the cabinet air was dry and the cooler ran at full current regardless. In April, after a week of wet weather and two door openings for a radio fault, the next technician found water droplets on the cold-side fins, a water stain down the back panel and green corrosion beginning on two terminals of the lower DIN rail.

```figure
type: steps
title: From water on the terminal rail to a dew-point limit
caption: This is an illustration. Each opening on a humid morning sealed in moisture; each night the cold fins condensed some of it, and the water ran down the back panel.
- Found | droplets on the cold-side fins; stain on the back panel; corrosion on two terminals
- Cabinet log | air held at 25 °C; door opened twice in a week of damp weather
- Check with the dew-point tool | cabinet air at 25 °C and 90% RH: dew point 23.3 °C, fins at about 19.4 °C, 3.9 K below it
- * Setpoint restored to 32 °C | fins at about 27.3 °C, 4.0 K above the dew point
- Changes | humidity sensor added; controller raises the setpoint when the margin falls below 3 K; drip tray and drain under the cold exchanger; door-opening rule for damp weather
```

The dew-point check explained it. The air sealed in on damp mornings had a dew point of about 23.3 °C, and the fins, held at about 19.4 °C to keep the cabinet at 25 °C, were well below it. Each time the cabinet breathed through its gaskets or the door was opened, more moisture came in, and the fins condensed it. The water ran down the back panel to the terminal rail. The setpoint was restored to 32 °C, which keeps the fins above the dew point in all but extreme conditions, the corroded terminals were replaced, and three changes followed: a small humidity sensor beside the controller's temperature sensor, so that the controller can calculate the dew point and raise its setpoint whenever the fins would come within 3 K of it; a drip tray with a drain through a gland in the cabinet floor under the cold exchanger, for the occasions when condensation cannot be avoided; and a rule that the door is opened on damp mornings only for as long as the work takes, with a desiccant bag placed inside before it is closed.

### How much water is involved

The quantities are small, which is why the problem is easily overlooked. TC-1 holds about 0.06 m³ of air around its equipment, or 0.070 kg of dry air. Cooling air at 18.1 g/kg to saturation on 19.4 °C fins, where it can hold only 14.1 g/kg, condenses 3.9 g of water per kilogram, about 0.27 g per cabinet-full of air. That is a few drops. But a cabinet exchanges air through its gaskets and glands with every daily temperature swing, and a few drops a day collected on fins and run to one place is enough to wet and corrode a terminal over a few weeks. Corrosion of fine-pitch connectors and circuit boards needs even less water, which is why a cooled cabinet should never be allowed to sweat, however small the quantity seems.

## A dew-point limit in the controller

The controller's new rule needs one more number: how much colder than the cabinet air the fins run. That difference is the heat pumped multiplied by the cold-side exchanger's resistance, Q_c × θ_c, and it grows with the load. On the humid autumn day, with 39 W pumped through the 0.12 K/W exchanger, the fins run 39 × 0.12 = 4.7 K below the cabinet air; on the design day, at 66 W, they run 8.0 K below it.

```figure
type: formula
title: Lowest safe setpoint for a cabinet cooler
formula: T_setpoint,min = T_dew point + margin + Q_c × θ_c
caption: For TC-1 on the humid autumn day: 23.3 + 3 + 39 × 0.12 = 31.0 °C. The restored 32 °C setpoint clears it by 1 K, which is why the fins stayed dry at 32 °C and sweated at 25 °C.
- T_setpoint,min | lowest cabinet setpoint that keeps the fins dry, °C
- Q_c × θ_c | how far the coldest fin runs below the cabinet air, K
```

The controller measures the cabinet air's temperature and relative humidity, calculates the dew point every minute and raises its setpoint above 32 °C whenever the formula requires it, up to the 35 °C limit. If even 35 °C would leave the fins too close to the dew point, which would need cabinet air with a dew point above about 24 °C at full load or 27 °C at light load, the controller sends an alarm rather than either flooding the cabinet or overheating it. In the trust's records that has not yet happened; a desiccant bag placed at each door opening keeps the cabinet's dew point well below that.

## Protecting the modules

Moisture is also a threat to the modules themselves. Inside a module, between its ceramic plates, the cold side's copper strips and solder joints are as cold as the cold face. If humid air reaches them, water condenses there, out of sight, and electrochemical corrosion of the joints and leakage currents between strips follow. CC-1's modules are sealed around their edges with silicone, and the space around them between the hot and cold plates is filled with closed-cell foam, so that no air can circulate past the cold face. Sealed modules cost a little more and are the standard for any cooler whose cold side can drop below the surrounding dew point.

## The sample box: condensation by design

SC-1 is different. Its cold plate runs at about 1 °C to hold the box at 4 °C, and every time the autosampler's lid is opened to remove the day's samples, warm shed air enters. On a humid morning, at 20 °C and 90% relative humidity, that air has a dew point of 18.3 °C, and the tool shows the 1 °C plate 17.3 K below it. Condensation on the cold plate is certain.

The design accepts it. The cold plate's fins are vertical so that water runs off; a channel beneath them collects it and a tube drains it out through the box's insulated floor, with a trap to stop warm air flowing in. Because the plate stays just above 0 °C, the water does not freeze into a growing layer of frost that would insulate the plate. Had the box been designed for a colder setting, with the plate below 0 °C, it would have needed a defrost cycle, which a thermoelectric cooler provides easily by briefly reversing the current to warm the plate.

## Exercise: a cold store for reagents

The trust plans a second small box to hold water-testing reagents at 15 °C, using the same module and sinks as SC-1. In the shed, the air on a humid autumn morning is at 24 °C and 80% relative humidity, which gives a dew point of about 20.3 °C. With a light load, the box's cold plate would run at about 12 °C. Using the dew-point check, decide whether the plate will sweat, what margin a 3 K requirement leaves, and what cold-plate temperature would keep it dry. Then decide whether the box needs a drain.

### Answer

**Given:** shed air 24 °C, 80% RH, dew point about 20.3 °C; cold plate 12 °C; required margin 3 K.

**Assumptions:** the box's air is replaced by shed air whenever it is opened; the plate is the coldest surface.

**Method:** compare the plate's temperature with the dew point of the air that enters.

**Margin:** 12 − 20.3 = −8.3 K. The plate is well below the dew point, and it will sweat whenever humid air enters.

**Plate to stay dry:** at least 20.34 + 3 = 23.4 °C, which is above the box's own 15 °C setting. A cold plate cannot be both colder than the box and warmer than the humid air's dew point.

**Decision:** the box needs a drain and vertical fins, as SC-1 has, and its plate should be kept above 0 °C so that condensate does not freeze. If water in the box is unacceptable, reagents should go in sealed containers, and the box should be opened as little and as briefly as possible on humid days.

**Verification:** the dew-point check, with air at 24 °C and 80% RH and a surface at 12 °C, reports the surface well below the dew point and sweating; with the surface at 23.4 °C, it reports a margin just over 3 K. Any cooler that holds something below the dew point of the air that reaches it must plan for water.
