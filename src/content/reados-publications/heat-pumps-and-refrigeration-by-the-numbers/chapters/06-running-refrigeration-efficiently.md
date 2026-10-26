---
book: heat-pumps-and-refrigeration-by-the-numbers
chapterSlug: running-refrigeration-efficiently
order: 6
title: "Running refrigeration efficiently"
description: "Keep a refrigeration plant's lift small and its COP high: clean condensers and evaporators, condenser placement, defrost, set points, controls and a maintenance routine, with the cost of each fault."
draft: false
---

A refrigeration plant's running cost is set at design and then either held or lost in operation. The design fixes the plant's size, its coils and its controls. Operation decides whether the condenser stays clean, whether the evaporator is defrosted when it should be, whether the set point drifts, and whether the condenser sits in fresh air or in its own hot exhaust. Each of those changes the temperature lift, and Chapter 2 showed that the lift drives the COP. A plant that slowly loses ten degrees of lift to a dirty condenser and a frosted coil can use half as much electricity again as it did when new, while still holding the room's temperature, so nobody notices until the bill or a heatwave reveals it.

This chapter puts numbers on the common operating faults in CS-1's plant. It shows what a dirty condenser, recirculated condenser air and a frosted evaporator each cost, how they combine, what clean, generous coils save, how set points and controls affect consumption, and what a maintenance routine looks like. The failure case is a condenser blocked by flour dust and a stack of boxes, which tripped the plant on the hottest day of the year.

## The lift is the lever

At design conditions, CS-1's refrigerant evaporates at **−8 °C** and condenses at **40 °C**, a 48 K lift, giving a realistic cooling COP of about **2.76** and about **40.8 kWh** of electricity a day at design conditions, about **A$3,730** a year on a design-day basis. Every fault that raises the condensing temperature or lowers the evaporating temperature widens the lift and lowers the COP. Every improvement that does the reverse narrows it.

```figure
type: bars
title: CS-1's daily electricity at design load under different conditions
unit: kWh a day
max: 60
caption: This is an illustration for 112.8 kWh a day of cooling, with a COP of half the Carnot figure at each pair of evaporating and condensing temperatures. Faults add up; good coils and maintenance claw back.
- Clean, generous coils: −5 °C and 37 °C | 35.3
- *Design: −8 °C and 40 °C | 40.8
- Frosted evaporator: −12 °C and 40 °C | 44.9
- Recirculated condenser air: −8 °C and 45 °C | 45.1
- Dirty condenser: −8 °C and 50 °C | 49.3
- Frosted evaporator and dirty condenser | 53.6
```

## Dirty condensers

A condenser coil outdoors or in a plant room collects dust, leaves, insects and, in a food factory, flour and fibres. A coating of dirt on the fins blocks the airflow and insulates the coil, so the condenser can only reject its heat with a larger temperature difference. A condensing temperature **10 K** higher than design, at 50 °C, lowers the realistic COP to about **2.29**, raising the daily electricity from about 40.8 to about **49.3 kWh**, about 21% more, worth about **A$775** a year on a design-day basis. It also reduces the plant's capacity just when it is needed most, on hot days, and pushes the compressor's discharge pressure and temperature up, shortening its life.

Cleaning is simple: brushing, vacuuming or washing the coil with low-pressure water or a coil cleaner, with the plant isolated, as the maker recommends. High-pressure washers bend the thin fins and should not be used. Bent fins can be straightened with a fin comb, which restores the airflow they were blocking. It is cheap enough that the only reason it is missed is that nobody's job includes it.

## Condenser placement

A condenser needs a free supply of fresh air at the surrounding temperature, and somewhere for its hot exhaust to go. Placed in a corner, behind a screen or under an overhang, it can draw back its own exhaust, so its inlet air is several degrees hotter than the surroundings. Condensing **5 K** higher, at 45 °C, costs about 11% more electricity, about **A$390** a year for CS-1 on the design-day basis. The same happens when condensers are crowded together, each breathing its neighbour's hot air, or placed in direct afternoon sun. Correct placement, with the maker's clearances, is set at installation and must be protected afterwards, as the failure case shows.

## Frost and evaporator condition

Frost on the evaporator, Chapter 3 explained, insulates the coil and blocks its airflow. To keep up, the evaporating temperature falls. An evaporator running at **−12 °C** instead of −8 °C lowers the COP to about **2.51**, adding about 10% to the electricity, and the room's humidity falls as more moisture freezes out. Defrost restores the coil, but defrost that is too infrequent leaves the coil frosted for long periods, and defrost that is too frequent wastes energy and puts heat into the room. Demand defrost, triggered when frost actually builds up, avoids both. Evaporator fans and coils also need cleaning, particularly in rooms with dusty or fibrous product.

## Faults combine

Faults rarely come one at a time. A plant with both a frosted evaporator and a dirty condenser, at −12 °C and 50 °C, has a lift of 62 K and a COP of about **2.11**, using about **53.6 kWh** a day, about a third more than design, about **A$1,160** a year extra on the design-day basis. And it has much less capacity in reserve for a hot day.

## Generous coils save every day

The reverse is also true. A plant designed with larger evaporator and condenser coils, able to work with smaller temperature differences, evaporates warmer and condenses cooler. At **−5 °C** and **37 °C**, CS-1's COP would rise to about **3.19**, using about **35.3 kWh** a day, about 13% less than design, saving about **A$500** a year. Larger coils cost more to buy; their saving continues for the plant's whole life, which is why life-cycle cost, not purchase price, is the right basis for choosing refrigeration plant.

## Buying on life-cycle cost

A refrigeration plant runs for fifteen years or more, and over that life its electricity usually costs several times its purchase price. CS-1's design-day electricity of about A$3,730 a year comes to over **A$55,000** in fifteen years, undiscounted, typically several times what a plant of this size costs to buy and install. A plant with larger coils that saves about A$500 a year saves about **A$7,500** over fifteen years, which pays for a good deal of extra coil. The same logic favours efficient compressors, variable-speed drives and good controls. Asking suppliers for each option's electricity use at the room's design and typical conditions, and comparing totals over the plant's life, gives a very different answer from comparing purchase prices.

```figure
type: checklist
title: What to ask for when buying refrigeration plant
caption: This is an illustration of the information CS-1's owner requested from each supplier, so options could be compared on life-cycle cost rather than price.
- Capacity at the room's design evaporating and condensing temperatures | not at a standard rating condition
- Electricity use at design and at typical conditions | with the COP at each
- Condenser and evaporator temperature differences at design | larger coils mean smaller differences
- Control features: floating head pressure, demand defrost, fan control | each affects annual energy
- Refrigerant type and charge | Chapter 8's regulatory and safety questions
- ? Expected maintenance and service intervals | and who will do them
- x Comparing quotes on purchase price alone | the electricity costs many times more over the plant's life
```

## Tariffs and timing

When the plant uses electricity can matter as much as how much. Many business tariffs charge more at peak times, and some add a demand charge based on the highest power drawn in a month. A cold room has thermal mass, in its product, its structure and its air, which allows some flexibility: pre-cooling slightly below the set point before a known peak, within the product's limits, lets the plant run less during it. Rooftop solar changes the picture again, making daytime running cheaper. These strategies need care, because product temperature always comes first, but on larger plants they can reduce costs noticeably.

## Set points and controls

The room's set point, Chapter 2 showed, costs about 5% of electricity for each 2 K lower than needed. Controls matter too:

- **Floating head pressure.** Many plants hold a fixed minimum condensing pressure all year, wasting the chance to condense cooler on mild days and nights. Controls that let the condensing temperature float down with the outside air, within the system's limits, reduce the lift for much of the year.
- **Fan control.** Evaporator fans that run flat out while the compressor is off add heat to the room for no purpose; variable-speed or cycling fans reduce it.
- **Door alarms.** An alarm that sounds when the door has been open for more than a minute or two costs little and prevents the largest single load from growing.

## Leaks cost efficiency as well as refrigerant

A slowly leaking plant loses more than refrigerant. As Chapter 3 described, a low charge starves the evaporator, raising superheat and lowering the evaporating pressure, which widens the lift and lowers the COP, while the compressor runs longer to keep up. A plant can lose a good part of its charge and still hold its room's temperature, consuming more electricity for months before anyone notices. Regular leak checks, comparing service readings with previous ones, and repairing leaks promptly, protect efficiency as well as meeting the obligations in Chapter 8.

## Doors and seals

The door is the cold room's largest load, Chapter 5 showed, and its condition matters as much as how often it is opened. A torn or flattened door gasket lets cold air spill out and warm air in continuously, and the moisture it admits freezes on the frame. On rooms below freezing, the door frame carries a small heater to stop the gasket freezing to it; on a chilled room like CS-1, the gaskets simply need to seal. A quick check, closing the door on a strip of paper at intervals around the frame and feeling whether it grips, finds gaps. Self-closing hinges and door alarms deal with doors left ajar. These are the cheapest efficiency measures in refrigeration, and among the most often neglected, because a leaking door seal makes no noise and sets off no alarm.

## Benchmarking against design

The most useful single test of a plant's health is to compare what it uses with what it should use. With the room's logged temperatures, the compressor's running hours, an electricity meter on the plant and the design calculation from Chapter 5, the business can see each month whether the plant is using about what the design predicts for the weather that month. A plant drifting above its benchmark has a fault: a dirty coil, a leak, a defrost problem or a door habit. Plotting the monthly figure against the month's average temperature makes the comparison fair, because hot months should use more. CS-1's monthly benchmark is part of the yearly review in the routine below, and the monthly figure is shared with the production team.

## A maintenance routine

```figure
type: timeline
title: CS-1's refrigeration maintenance routine
caption: This is an illustration. The licensed technician's service covers the refrigerant circuit; the site's own staff handle cleaning, checks and records.
- Daily | Production staff | check room temperature log and door seals; keep stock clear of the evaporator
- Weekly | Production supervisor | review the logger and compressor running hours; check condenser surroundings are clear
- Monthly | Maintenance | inspect and clean the condenser coil; check evaporator for frost and drainage
- Quarterly | Licensed technician | record superheat, subcooling, pressures and currents; leak check; clean evaporator; check controls and defrost
- *Yearly | Licensed technician and site | review a year of logs and electricity against the plant's design figures
```

## A failure case: the blocked condenser

This is an illustration. On the hottest afternoon of the summer, CS-1's plant tripped on its high-pressure cut-out. It reset itself, ran for twenty minutes and tripped again. The room's temperature began to rise.

The maintenance technician found the condenser, on the factory's rear wall, with its coil coated in a mat of flour dust from a nearby extraction vent, and a stack of empty cartons that had been placed against its side, blocking about a third of its air inlet. The plant had been running with a high condensing temperature for weeks, and on the hottest day, the condensing pressure reached the cut-out.

The detection came from the high-pressure trip, the plant's own protection doing its job, and the room's temperature alarm. The product was moved to the factory's other chilled store while the plant was restored, and its temperature history was assessed under the food safety plan. The correction was to clean the coil, clear the area and mark it as a no-storage zone, and redirect the extraction vent's discharge away from the condenser. The monthly coil cleaning was added to the maintenance schedule, and the compressor running hours, which had crept up for weeks before the trip, were added to the weekly review, because they would have given warning.

## How this applies to a small Australian business

Keep the temperature lift small. Clean condenser coils regularly, protect their air supply, and keep them out of their own exhaust and away from dust sources. Defrost evaporators on demand and keep them clean. Set rooms no colder than the product needs, let condensing temperatures float on mild days, and control fans and doors. Log temperatures and compressor running hours and review them weekly. When buying plant, compare life-cycle cost, including the electricity that larger coils save. And treat a high-pressure trip as a message about the condenser.

## Exercise: a clean-up

A survey of a plant similar to CS-1 finds its condenser dirty, condensing at about 50 °C, and its evaporator frosted, evaporating at about −12 °C, for most of the year. Cleaning and demand defrost would return it to the design −8 °C and 40 °C. Using the bar chart's figures, what is the daily electricity saving at design load, and the annual saving on a design-day basis at A$0.25 per kWh?

**Worked answer.** The faulty plant uses about **53.6 kWh** a day; at design, about **40.8 kWh**. The saving is about **12.8 kWh** a day, about **12.8 × 365 × 0.25 ≈ A$1,170** a year on the design-day basis. Real savings over a year would be somewhat lower, because most days are cooler than the design day, but the work involved, coil cleaning and a defrost control setting, costs a small fraction of that, and the plant regains the capacity it needs on hot days.
