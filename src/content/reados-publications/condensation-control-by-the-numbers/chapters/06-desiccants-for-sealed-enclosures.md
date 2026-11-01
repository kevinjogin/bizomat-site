---
book: condensation-control-by-the-numbers
chapterSlug: desiccants-for-sealed-enclosures
order: 6
title: "Desiccants for sealed enclosures"
description: "How desiccants hold water, what a unit of desiccant means, how to measure the water a sealed box takes in, and how to size a charge and set its replacement interval."
draft: false
---

Small enclosures with little heat inside cannot be kept dry by heating, because there is no power to spare and no room for a heater. A battery-powered radio, a sensor junction box or a meter housing has to be sealed instead, and whatever water gets in over time has to be soaked up by something inside. That something is a desiccant.

A desiccant does not stop water entering; it gives the water somewhere to go other than the electronics, and it holds the box's relative humidity low while it has capacity left. Sized well, it lasts from one maintenance visit to the next. Sized by guesswork, it is either saturated within weeks or replaced far more often than it needs to be. This chapter explains how desiccants work, what a "unit" of desiccant is, how to measure the water a box actually takes in, and how PS-7's telemetry box was given a desiccant charge and a replacement interval that the data supports.

## How a desiccant holds water

The common desiccants are porous solids with enormous internal surface areas. Silica gel, the most familiar, is an amorphous form of silicon dioxide with pores a few nanometres across; a gram of it has an internal surface of hundreds of square metres. Water molecules from the air stick to those surfaces, a process called **adsorption**. The amount held at equilibrium depends on the relative humidity of the surrounding air: the drier the air, the less water the desiccant can hold, and the more humid, the more.

That relationship, the amount held against the relative humidity at a given temperature, is the desiccant's **adsorption isotherm**. It is the key to sizing. A desiccant in a box does not remove water to zero. It and the box's air reach a shared equilibrium, and as the desiccant fills, the relative humidity it can hold the box at rises. A desiccant charge has therefore not one capacity but a capacity at each humidity: how much water it can take before the box's humidity rises above a chosen level.

```figure
type: compare
title: Common enclosure desiccants
cols: Holds water best | Notes
rowhead: Desiccant
caption: General characteristics. Makers publish isotherms and regeneration instructions for their own products, and those govern.
- *Silica gel | moderate to high humidity | the usual choice for enclosures; available with colour-changing indicator grades; can be dried and reused
- Clay (bentonite) | low to moderate humidity at room temperature | cheap and inert; capacity falls at higher temperatures
- Molecular sieve | very low humidity | holds water strongly even when the air is dry; used where very low humidity is needed; harder to regenerate
```

### The unit of desiccant

Because desiccants differ, packaging practice defines a **unit** by performance rather than by mass. Under the definition traced to the military specification MIL-D-3464E, as summarised by enclosure suppliers, one unit is the amount of desiccant that adsorbs **at least 3 g of water at 20% relative humidity and at least 6 g at 40%**, both at 25 °C. A bag marked "2 units" will therefore hold at least 6 g before the box it is in rises above 20% RH, and at least 12 g before it rises above 40% RH, at 25 °C.

The definition gives two points on the isotherm and a temperature. It is a minimum, so a bag may do better, and it applies at 25 °C. Silica gel's capacity falls as temperature rises, and a box in the sun can run far hotter than 25 °C, so a charge sized at 25 °C carries less margin in summer than the numbers suggest.

## PS-7's telemetry box

This is an illustration. PS-7's telemetry box is a polycarbonate enclosure with internal dimensions of **300 × 250 × 150 mm**, rated IP66, mounted on a pole beside CC-7. It holds a radio, a small controller and a battery, which together dissipate about 1 W. Its internal volume is 0.01125 m³, of which about **9 litres** is free air. It has no heater and, as supplied, no vent.

A sealed box holds very little water in its own air. At 25 °C and 70% RH, 9 litres of air carry about **0.145 g** of water; even at 30 °C and 80% it is 0.22 g. Bringing that air down from 70% to 40% RH means removing only about 0.06 g. The air sealed in at assembly is therefore not what a desiccant is sized for. It is sized for the water that gets in afterwards.

### Where the water comes from

Water enters a sealed box by three routes:

1. **Openings for maintenance.** Each opening replaces the box's air with outside air. At PS-7 that is about 0.15 g per opening, a few openings a year.
2. **Breathing past the seals.** The box warms in the sun and cools at night, and its seals pass a little air each cycle, much as Chapter 3 described for CC-7, but on a smaller scale.
3. **Permeation.** Water vapour diffuses slowly through the gasket and through the plastic walls themselves. Polycarbonate and rubber gaskets are not perfect vapour barriers, and over months the vapour that passes through them adds up.

The second and third routes are hard to calculate from first principles, because they depend on the seal, the gasket compression, the wall thickness and the temperature cycle. They are easy to measure: weigh the desiccant.

## Measuring the water a box takes in

This is an illustration. When the utility first fitted a desiccant bag to the telemetry box, it weighed the bag on a scale reading to 0.1 g before installation and again when the bag was removed **91 days** later. The bag had gained **6.2 g**. That is an average ingress of 6.2 ÷ 91 = **0.068 g a day**, or about 25 g a year, from all routes together.

The measurement is simple and it is worth doing on every new enclosure design, because it turns the desiccant from guesswork into a sized component. Three precautions make it reliable: weigh the bag in a closed container so that it does not gain water on the scale, note the temperature, and repeat the measurement over a different season, since ingress is faster in hot, humid months.

```figure
type: stats
title: The telemetry box's water budget
caption: This is an illustration. The water in the box's own air is trivial; the steady ingress through seals and walls is what a desiccant charge must absorb between visits.
- 0.145 g | water in 9 litres of air at 25 °C, 70% RH
- 0.15 g | brought in by each opening
- 0.068 g/day | measured ingress, 6.2 g in 91 days
- 25 g/year | the same ingress over a year
```

## Sizing the charge and the interval

A sizing rule needs a humidity the box must stay below and a margin. The utility chose to keep the box below **40% RH** at 25 °C, and to plan replacement when the desiccant has used **half** of its capacity at that humidity. The margin covers the fall in capacity at higher temperatures, a summer with more ingress than the measured season, and a visit that is late.

```figure
type: formula
title: Desiccant charge and replacement interval
formula: units = ingress rate × interval ÷ (capacity per unit × share used)
caption: This is an illustration. Capacity per unit at 40% RH is the 6 g minimum from the unit definition; using half of it gives 3 g per unit.
- ingress rate | 0.068 g/day, measured
- capacity per unit | 6 g at 40% RH, 25 °C
- share used | 0.5, the planning margin
step: 2 units: 2 × 6 × 0.5 = 6 g ÷ 0.068 = 88 days, about quarterly
step: 4 units: 12 g ÷ 0.068 = 176 days, about six-monthly
```

The bag the utility had first installed, **2 units**, gives an interval of about 88 days, which happens to match a quarterly site visit. A **4-unit** bag would last about six months on the same basis. The box has room for either. Because site visits at PS-7 are quarterly for other reasons, the utility kept 2 units and replaces them at each visit, with a humidity indicator card fitted where it can be seen through the box's window.

### Checking the target against the coldest surface

A humidity target expressed at 25 °C is really a dew point target, and it should be checked against the coldest surface the box will have. Air at 25 °C and 40% RH has a dew point of **10.5 °C**. On a winter night at PS-7, with the air at 7 °C and the box's window radiating to a clear sky, the window can fall below that, and a box held at 40% RH would fog on its window. At 30% RH the dew point is 6.2 °C, and at 20% it is 0.5 °C.

The utility's 40% target is therefore a summer target. In winter the same charge holds the box well below 40%, because the box is cooler and its ingress slower, and the bag's own isotherm pulls the humidity down. But a bag that has used most of its capacity by the end of autumn leaves the box exposed to window fogging through winter, which is one more reason for planning replacement at half capacity rather than at full. Where a box has a window or a cold metal plate, the target should be set from the dew point those surfaces need, not from a round-number humidity.

### Regenerating used desiccant

Silica gel can be dried and reused by heating it in an oven, following the maker's temperature and time. Clay and molecular sieve can be regenerated too, at different temperatures. Regeneration is worth doing only with a scale and a record: a regenerated bag should return to within a few tenths of a gram of its marked dry mass, and one that does not has lost capacity or been contaminated and should be discarded. Colour-changing indicator grades need care, since some indicator chemicals have health restrictions, and the maker's safety data sheet governs their handling and disposal.

### What happens if the desiccant is not replaced

A desiccant that has passed its planned capacity does not stop working at once. The box's humidity rises gradually as the desiccant fills: below 20% until about 3 g per unit is held, below 40% until about 6 g per unit, and then towards the outside humidity as the desiccant saturates. The radio and battery may tolerate 50% or 60% RH for a while. The real risk comes when a saturated desiccant meets a temperature swing: it then releases water as the box warms and takes it up again as the box cools, and in the meantime the box's air can reach saturation on its coldest surface, which is often the window or the lid.

### Venting a box that has a desiccant

A sealed box with a desiccant must not also have an open vent. A vent connects the desiccant to the whole outdoors, and it then tries to dry the atmosphere. A small vent that exchanges the box's air a few times a day brings in a gram or more of water a day in a humid climate, which would saturate a 2-unit bag within a couple of weeks.

The case for a vent on a small box is pressure: the 9 litres of air in the telemetry box would swing by about 9% of an atmosphere between a sun-warmed afternoon at about 45 °C and a 15 °C night, a force of roughly **700 N** on its 0.075 m² lid if the box were perfectly rigid and sealed. In practice a gasketed polycarbonate box flexes and its seals pass the small volume involved, which is part of the ingress the bag absorbs. Where a box must be vented for pressure, the usual answer is a membrane vent combined with a larger desiccant charge sized from a measured ingress, or a heater if power is available, not a vent added to a box sized as sealed.

## The error: a bag that arrived full

This is an illustration. A year into the routine, a technician replacing the telemetry box's desiccant noticed that the humidity indicator card in the box had already changed colour at the 40% spot, only six weeks after the previous visit. The box showed no sign of damage or a failed seal.

The technician weighed the removed bag: it was **11.4 g** heavier than its marked dry weight, nearly its whole planned capacity, after 42 days. At the measured ingress of 0.068 g a day, the box could account for only about 2.9 g. The rest, about 8.5 g, must have been in the bag before it was installed. The new bags in the van were checked next: they had been stored in an unsealed plastic tub that had been opened and closed many times over the summer, and each had gained between 6 and 9 g sitting in the van.

The desiccant had been doing its job, but on the van's air instead of the box's. The utility changed the routine:

- Desiccant is kept in sealed, metallised bags or airtight containers with their own indicator, and opened only at the box.
- Each bag's dry mass is marked, and bags are weighed before installation; any bag more than 1 g over its marked mass is regenerated or discarded.
- Removed bags are weighed and the gain recorded, which keeps the ingress measurement up to date at no extra cost.

## Exercise: a six-month interval

The utility wants to reduce visits to PS-7 to twice a year. Using the measured ingress of 0.068 g a day, the 40% RH target and the half-capacity margin, how many units of desiccant does the telemetry box need for a 182-day interval? Allow also for two openings during the interval at 0.15 g each.

**Worked answer.** Ingress over 182 days is 0.068 × 182 = **12.4 g**, plus 2 × 0.15 = 0.3 g for openings, a total of about **12.7 g**. With 3 g usable per unit (6 g at 40% RH × 0.5), the charge needs 12.7 ÷ 3 = 4.2 units, so **5 units** rounded up. A 4-unit bag would cover about 4 × 3 ÷ 0.068 ≈ 176 days without openings, just short of the target. Before relying on a six-month interval, the utility should also repeat the ingress measurement in the hottest, most humid months, since a single 91-day measurement in a mild season may understate the summer rate.
