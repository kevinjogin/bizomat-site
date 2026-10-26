---
book: heat-pumps-and-refrigeration-by-the-numbers
chapterSlug: cold-room-loads
order: 5
title: "Cold room loads"
description: "Build up a chilled store's refrigeration load from walls, floor, product, door infiltration and internal heat, size the plant from the daily total, and find the loads worth reducing."
draft: false
---

A cold room's refrigeration plant exists to remove heat as fast as it arrives. Heat arrives through the walls, ceiling and floor; with every load of warm product; with the warm, moist air that enters whenever the door opens; and from the lights, fans and people inside. Add them up over a day, divide by the hours the plant can run, and you have the plant's capacity. Do it carefully and the plant is the right size, runs efficiently and holds temperature in a heatwave. Skip a load, usually the door or the product, and the room warms on the busiest day of the year.

This chapter builds up CS-1's load. It calculates heat through the insulated panels and the floor, the heat removed from each day's product, an allowance for door infiltration and internal heat, totals the daily load, sizes the plant from it, converts it into electricity and cost, and then looks at which loads are worth reducing. The failure case is a day when warm product and a propped-open door overwhelmed the plant.

## The room

CS-1 is **6 m** long, **5 m** wide and **3 m** high inside, held at **2 °C**. Its walls and ceiling are insulated sandwich panels with **100 mm** of polyurethane foam, at a published conductivity of about **0.03 W/m·K**. It stands inside the factory, where the air around it reaches about **30 °C** on summer afternoons, the design condition. Its floor is an insulated slab on ground at about 18 °C. It receives about **2,000 kg** of product a day at about 20 °C, to be cooled to 2 °C. These values are an illustration.

## Through the walls and ceiling

The panels' U-value follows from *Heat Transfer by the Numbers*: surface resistances inside and out of about 1 ÷ 9 m²·K/W each, plus the foam's **0.1 ÷ 0.03 ≈ 3.33 m²·K/W**, give a total of about 3.56 m²·K/W and a U-value of about **0.281 W/m²·K**. The walls and ceiling cover **2 × (6 × 3 + 5 × 3) + 6 × 5 = 96 m²**. With 28 K between the 30 °C surroundings and the 2 °C room, the heat gain is about **0.281 × 96 × 28 ≈ 756 W**.

The floor, about **30 m²**, gains heat from the ground. With an insulated slab, taken here at a U-value of about 0.3 W/m²·K, a teaching value, and ground at 18 °C, it adds about **0.3 × 30 × 16 ≈ 144 W**.

## The product

Each day's 2,000 kg of product, with a specific heat taken as **3.6 kJ/kg·K**, cooled from 20 °C to 2 °C, gives up **2,000 × 3.6 × 18 = 129,600 kJ**, about **36.0 kWh**. If it arrives through the working day, over about 16 hours, that averages **2.25 kW**, but the actual rate depends on how product is loaded and how quickly it must reach temperature. Product that must be cooled fast needs the plant's capacity concentrated in those hours.

## The door and the people

Every time the door opens, warm, moist factory air flows in at the top and cold air flows out at the bottom. The heat carried depends on the door's size, how long it stays open, how often it opens and the temperature and humidity of the air outside it, and it is often the largest load on a busy store. Detailed methods estimate it from those factors. For CS-1, an allowance of **1.5 kW** averaged over the day is used, a teaching value for a busy door without a strip curtain.

The evaporator's fans, the lights and the people working inside add heat too. CS-1's allowance for all internal heat is **0.8 kW** averaged over the day, also a teaching value; the fans' motors run whenever the plant runs and their heat all ends up in the room.

## The daily total

```figure
type: stack
title: CS-1's daily refrigeration load at summer design conditions
unit: kWh a day
caption: This is an illustration. Walls, ceiling, floor, door and internal loads are taken over 24 hours; product over its 16 hours of arrival. The door and the product together are nearly two thirds of the load.
- Walls and ceiling | 18.1
- Floor | 3.5
- *Door infiltration | 36.0
- Internal heat: fans, lights, people | 19.2
- *Product | 36.0
```

The daily total is about **112.8 kWh** of heat to remove. The walls and ceiling, which people usually think of first, are only about 16% of it. The door and the product are nearly two thirds.

## Moisture adds load

The air that enters through the door carries water vapour as well as heat. In the cold room, much of that vapour condenses or freezes on the evaporator coil, and as it does, it gives up its latent heat, which the plant must remove just as it removes the sensible heat of cooling the air. On a humid day, the moisture's latent heat can be a large share of the door load, which is one reason door infiltration varies so much with the weather. The moisture also forms the frost that Chapter 3 described, which reduces the coil's capacity until it is defrosted, and the defrost's heat then adds to the load in turn. Moist product, such as freshly washed produce, adds moisture in the same way. The [Psychrometrics for HVAC](/reados/collections/fluids-hvac-and-building-services/psychrometrics-for-hvac/) chapter explains how the heat in moist air is calculated, which a detailed door load estimate uses.

## Sizing the plant

A refrigeration plant is not sized to run continuously. It needs time off for defrost, Chapter 3, and spare capacity to recover after door openings and to cope with hot days beyond the design. A common approach is to size it to remove the daily load in about **16 to 18 hours** of running. CS-1's plant is sized on **18 hours**:

```figure
type: formula
title: CS-1's plant capacity and electricity at design conditions
formula: capacity = daily load ÷ running hours        electricity = daily load ÷ COP
caption: This is an illustration at the realistic cooling COP of 2.76 from Chapter 2, electricity at A$0.25 per kWh. A plant of about 7 kW at the design evaporating and condensing temperatures was selected.
- Daily load | about 112.8 kWh
- Running time allowed | 18 hours
step: capacity ≈ 112.8 ÷ 18 ≈ 6.3 kW, so select about 7 kW at design conditions
step: electricity ≈ 112.8 ÷ 2.76 ≈ 40.9 kWh a day
step: cost ≈ 40.9 × 365 × 0.25 ≈ A$3,730 a year, if every day were a design day
```

The plant's capacity must be stated at the conditions it will meet: the evaporating temperature that holds the room at 2 °C, and the condensing temperature on a design summer day. Makers' capacities at other conditions can be very different. Real annual electricity is lower than A$3,730, because most days are cooler than the design day, but that figure is a useful upper bound.

## Which loads are worth reducing

With the load broken down, the options are easy to compare.

**Thicker panels.** Going from 100 mm to 150 mm of foam lowers the U-value to about 0.191 W/m²·K and the wall and ceiling gain from about 756 W to about 515 W. That saves about **5.8 kWh** of cooling a day, about **2.1 kWh** of electricity, about **A$190** a year at design conditions. Worth doing when a room is built; rarely worth retrofitting.

**A strip curtain or rapid-roll door.** If a strip curtain halved the door infiltration, to 0.75 kW, it would save about **18 kWh** of cooling a day, about **6.5 kWh** of electricity, about **A$595** a year, for a modest outlay. Door discipline, closing the door between trips, does even more and costs nothing.

**Pre-cooling product.** Product that arrives cooler needs less cooling in the store. Where the product comes from a process that can cool it with cooling water or ambient air first, part of the product load moves off the refrigeration plant and onto cheaper cooling.

```figure
type: compare
title: Options for reducing CS-1's load, at design conditions
cols: Cooling saved a day | Electricity saved a year | Cost and practicality
caption: This is an illustration at a COP of 2.76 and A$0.25 per kWh. Door measures beat insulation by a wide margin in a busy store.
- Panels 150 mm instead of 100 mm | about 5.8 kWh | about A$190 | worthwhile only when building
- *Strip curtain halving door load | about 18 kWh | about A$595 | low cost, quick to fit
- Door closed between trips | often more than a curtain | often more than A$595 | free, needs habit and supervision
- Pre-cooling product before the store | depends on the process | can be large | needs a cheaper cooling source
```

**Efficient internal loads.** LED lighting on a door switch and electronically commutated fan motors reduce the internal load directly, and every watt saved inside the room saves a further fraction of a watt of compressor electricity removing it.

## Design conditions and hot days

The load and the plant's capacity both depend on the weather. On a hot day, the surroundings are warmer, so more heat leaks in; the door brings in hotter, often more humid air; and the condenser rejects heat to hotter outside air, so its condensing temperature rises and the plant's capacity and COP both fall. All three effects arrive together. That is why the design condition, here 30 °C around the room and a condensing temperature of 40 °C, is chosen near the hot end of the site's normal range, and why the 18-hour running allowance matters: it is the margin that lets the plant keep up on days hotter than the design. A plant sized to run 24 hours on an average day will fail on the first heatwave.

## Airflow inside the room

The evaporator's fans move the room's air across the coil and round the room. Product stacked against the evaporator, or packed solidly to the ceiling, blocks that circulation: some of the room stays warm while the air near the coil is cold, and the controller, sensing the cold air, stops the plant early. CS-1 has marked floor lines that keep stock clear of the evaporator and the walls, and a sensor placed in the return air to the evaporator rather than right beside the coil. Good loading practice costs nothing and lets the plant's capacity reach the product, wherever it sits in the room.

## Monitoring the room

A data logger in the room, recording temperature every few minutes with a high-temperature alarm, is the simplest protection a cold room can have, and food safety plans usually require temperature records anyway. Logged alongside the compressor's running time, it shows more than whether the room is cold. A room that holds temperature but whose compressor runs longer each week is losing capacity, to frost, a dirty condenser or a slow leak, as Chapter 3 described. A room that warms every afternoon at the same time points to a delivery pattern or a door left open. CS-1's logger and compressor run-hours are reviewed weekly by the production supervisor and checked by the refrigeration technician at each service.

## A failure case: warm product and an open door

This is an illustration. On a hot afternoon before a public holiday, CS-1 received a double delivery of product, about 2,000 kg in two hours, from a supplier's truck whose own refrigeration had failed, so the product arrived at about **30 °C** instead of 20 °C. To speed unloading, the door was propped open for most of those two hours.

The room's data logger showed the temperature rising to about **8 °C** and taking most of the evening to recover. The product load alone was about **2,000 × 3.6 × 28 ÷ 3,600 ≈ 56 kWh**, arriving in two hours, a rate of about 28 kW, four times the plant's capacity, and the open door was adding warm air continuously. No reasonably sized plant could have held 2 °C through that.

The detection came from the data logger's high-temperature alarm and the trend it recorded. The correction was procedural rather than mechanical: warm deliveries are now refused or held in a separate area until assessed, unloading is done in batches with the door closed between them, and a strip curtain was fitted. The product's safety was assessed against its temperature history, as the food safety plan required. The plant itself was correctly sized for the design load; the day's load was far outside it. Buying a plant big enough for that one afternoon would have cost far more, and run less efficiently every other day of the year, than changing how deliveries are received.

## How this applies to a small Australian business

Size refrigeration from a load built up item by item: walls, ceiling, floor, product, door and internal heat, totalled over a day and divided by the hours the plant can run, usually 16 to 18. State the capacity at the actual evaporating and condensing temperatures. Expect the door and the product, not the walls, to be the biggest loads, and reduce them with door discipline, strip curtains and pre-cooling. Log the room's temperature with alarms. And manage deliveries so that a single warm load cannot overwhelm a correctly sized plant.

## Exercise: more product

The factory plans to store **3,000 kg** of product a day in CS-1, still arriving at 20 °C. With the other loads unchanged, what is the new daily load, the plant capacity needed at 18 hours of running, and the daily electricity at a COP of 2.76? Is the existing 7 kW plant enough?

**Worked answer.** The product load becomes **3,000 × 3.6 × 18 ÷ 3,600 = 54.0 kWh**, so the daily load is **112.8 − 36.0 + 54.0 = 130.8 kWh**. At 18 hours, the plant needs about **130.8 ÷ 18 ≈ 7.3 kW**, slightly more than the 7 kW installed. Electricity rises to about **130.8 ÷ 2.76 ≈ 47.4 kWh** a day. The existing plant would have little margin on design days. Fitting a strip curtain, which saves about 18 kWh a day of door load, would bring the total back to about 113 kWh and restore the margin more cheaply than a larger plant.
