---
book: heat-transfer-by-the-numbers
chapterSlug: convection-at-surfaces
order: 4
title: "Convection at surfaces"
description: "Use Newton's law of cooling with sensible convection coefficients, tell natural from forced convection, see when insulation makes convection irrelevant, and allow for wind and fans."
draft: false
---

Convection is heat carried by a moving fluid. Air warmed by a hot pipe becomes lighter and rises, drawing cooler air in behind it: natural convection. A fan or the wind blows air across a surface, or a pump drives water through a pipe: forced convection. Either way, heat crosses a thin layer of fluid next to the surface and is then swept away. The physics of that layer is complicated, but its effect is captured in one number, the **convection coefficient h**, and one simple law. The skill lies in choosing h sensibly and knowing when it matters.

This chapter works with convection in HW-60. It states Newton's law of cooling, explains what sets the coefficient and the wide range of published values, chooses coefficients for the case, shows that convection dominates a bare pipe's loss but barely affects an insulated one, looks at the water side inside the pipe, and considers wind and fans. The failure case is a sister plant's outdoor tank, whose losses were estimated with a still-air coefficient and came out far too low.

## Newton's law of cooling

The heat convected from a surface of area **A** at temperature **T_s** to a fluid at **T_f** is:

**Q = h × A × (T_s − T_f)**

This is Newton's law of cooling, and it is the definition of h as much as a law: h is whatever number makes it true. Its units are W/m²·K. In Chapter 1's terms, the surface has a convection resistance of **1 ÷ (h × A)**.

## What sets the coefficient

The coefficient depends on how vigorously the fluid moves past the surface and on the fluid itself. Published typical ranges show how widely it varies.

```figure
type: range
title: Typical convection coefficients by situation
unit: W/m²·K
min: 0
max: 3000
caption: Published typical ranges are very wide: free convection of air and gases from about 0.5 to 1,000 W/m²·K, forced convection of air from about 10, free convection of water from about 50 to 3,000 and forced convection of water from about 50 to 10,000. Ordinary plant conditions sit near the low ends; the values marked here are this book's teaching choices for HW-60.
- Still room air on an insulated jacket, about 5 K above the air | 2 | 6 | teaching value 4
- Still room air on a bare pipe at 85 °C | 3 | 8 | teaching value 5
- Air from a fan or light wind | 10 | 30 | teaching value 15
- Slowly moving hot water inside a pipe or tank | 200 | 1500 | teaching value 500
- Pumped water in a plate heat exchanger | 1000 | 3000 | high, Chapter 7
```

Three factors explain most of the variation:

- **The fluid.** Water carries heat away far better than air, because it is denser and has a much higher specific heat and conductivity. Coefficients in water are tens to hundreds of times those in air.
- **Natural or forced.** In natural convection the fluid moves only because of the temperature difference itself, slowly. A fan or pump moves it faster and thins the layer next to the surface, raising h several-fold.
- **Temperature difference and size.** Natural convection grows stronger as the surface gets hotter relative to the fluid, because the buoyancy driving it increases. A jacket a few degrees above the room moves the air only gently; a bare pipe at 85 °C sets up a clearly rising plume.

Detailed correlations, which give h from the fluid's properties, the geometry and the temperature difference or velocity, are found in heat transfer textbooks and give better estimates than a single chosen value. This book uses chosen values within the published ranges, labelled as such, because the aim is to see which numbers matter.

## HW-60's coefficients

For HW-60, the outside coefficients are chosen for still indoor air: **4 W/m²·K** on the insulated jacket, whose surface is only a few degrees above the room, and **5 W/m²·K** on bare metal at 85 °C. In Chapter 2's combined outside coefficient of 9 W/m²·K, about 4 is convection; the rest, about 5.6, is radiation, which Chapter 5 calculates. Inside, hot water moving slowly through the pipe and the tank is given **500 W/m²·K**.

## When convection matters, and when it does not

Whether the outside coefficient matters depends on how large the surface resistance is compared with the rest of the path. On a bare pipe, the surface resistance is the only significant one, so h controls the loss. On an insulated pipe, the insulation's resistance dwarfs the surface's, so even large changes in h barely matter.

```figure
type: compare
title: Heat loss per metre of HW-60's pipe as the convection coefficient changes
cols: Bare weathered pipe | Pipe with 40 mm insulation
caption: This is an illustration. The bare pipe's radiation coefficient is about 6.7 W/m²·K and the jacket's about 5.4 W/m²·K, added to each convection coefficient. Insulation makes the loss almost independent of the air movement.
- Very still air, h = 2 | about 107 W/m | about 17.7 W/m
- *Still room air, h = 5 | about 144 W/m | about 18.2 W/m
- Gentle draught, h = 10 | about 206 W/m | about 18.5 W/m
- Fan or light wind, h = 15 | about 268 W/m | about 18.7 W/m
- Strong wind, h = 25 | about 391 W/m | about 18.9 W/m
```

On the bare pipe, going from still air to a light wind nearly doubles the loss. On the insulated pipe, the same change adds about 3%. This is the most practical lesson about convection: **once a surface is insulated, the air around it hardly matters**; while it is bare, the air matters a great deal. It is also why estimates of bare surfaces need more care than estimates of insulated ones.

## The water side

Inside the pipe, the hot water's convection coefficient is high, and the resistance it represents is tiny next to the insulation's. With a circulating flow of 0.1 kg/s in a pipe with a bore of about 56 mm, the water moves at only about **0.04 m/s**, slow enough that its coefficient is at the low end for water. Even so, at 500 W/m²·K its resistance per square metre is 0.002 m²·K/W, against 1.25 for 50 mm of mineral wool. The water side only matters where both sides of a wall are fluids with high coefficients, which is the case in heat exchangers, Chapter 7's subject.

## Scale and deposits on the water side

Hot water deposits scale, mainly calcium carbonate from hard water, on the surfaces that heat it, and slimes and sediment collect where water moves slowly. A deposit is another layer in the heat's path, with its own resistance, and it sits exactly where the coefficients are highest and the resistances smallest, so even a thin layer can matter. On the pipe and tank walls of HW-60, where the insulation dominates, scale makes no measurable difference to the heat loss. On the heating surfaces inside the water heater, and in the heat exchanger of Chapter 7, it reduces the heat transferred, raises the metal's temperature and wastes fuel. That is why water treatment and periodic descaling belong in a hot water system's maintenance plan, and why heat exchanger designers add a fouling allowance.

## The warm plume above hot pipes

Natural convection from a bare hot surface sends a plume of warm air upwards. Above HW-60's plant room water heater and the few bare fittings, the air under the roof is several degrees warmer than at floor level. That has practical effects: a room temperature sensor mounted high reads warmer than the air people work in, and anything stored on high shelves above hot equipment runs warm. In a food plant, it can also matter for condensation on cold surfaces nearby. Insulating hot surfaces reduces the plume along with the heat loss, and makes the plant room more comfortable to work in.

## Wind, fans and outdoor equipment

Indoors, air speeds are low, and natural convection dominates. Near doors, fans and air-conditioning outlets, they are higher. HW-60's wash-down area has extraction fans that pull air across the hose stations, and the short bare lengths of pipe at the hose connections lose heat noticeably faster there than in the plant room.

Outdoors, wind changes everything for bare surfaces. A light wind of a few metres a second raises the coefficient on a pipe or tank several-fold over still air, and a strong wind more. Outdoor equipment is also rained on, which can cool a bare surface very quickly and soak unprotected insulation. For outdoor equipment, the designer chooses a coefficient for a representative wind speed, not still air, and makes sure the insulation's jacket is weatherproof.

## Measure a coefficient with a cooling test

Where a coefficient matters and no correlation fits the situation well, it can be measured. HW-60's maintenance engineer did this for a bare 2 m length of pipe at a hose station, to check the value used in the estimates. With the hose station isolated and full of hot water, a clamp-on sensor under a small patch of insulation recorded the pipe's temperature as it cooled. The rate of cooling at any moment, multiplied by the heat capacity of the water and steel in the length, gives the heat being lost; dividing by the surface area and the temperature difference gives the combined coefficient, convection and radiation together.

The test gave a combined coefficient of a little under 12 W/m²·K with the extraction fans off, close to the 11.7 W/m²·K used in this book, and over 20 with the fans running. The engineer kept the result in the design file as the measured basis for the wash-down area's estimates, which is more defensible than any value from a table.

## Convection inside a tank

Natural convection also happens inside HW-60's tank. Hot water is lighter than cold, so it rises and collects at the top, while cold mains water entering at the bottom stays there. The tank **stratifies**: it can hold 85 °C water at the top and much cooler water at the bottom at the same time. That is useful, because the outlet at the top draws the hottest water, and the heater can be fed from the cool bottom, where it works most efficiently. It also means a single thermostat reads only the temperature at its own height. HW-60 has two sensors, near the top and near the bottom, so the controls know how much hot water is actually stored, not just the temperature at one point.

```figure
type: checklist
title: Choosing a convection coefficient for an estimate
caption: This is an illustration of the questions the HW-60 engineer works through before choosing a value. The answer matters most for bare surfaces.
- Fluid | air or water; water coefficients are far higher
- Natural or forced | is there a fan, pump, draught or wind moving the fluid
- Temperature difference | a hot bare surface drives stronger natural convection than a warm jacket
- Indoors or outdoors | outdoors, use a representative wind, not still air
- Insulated or bare | if insulated, the choice barely matters; if bare, it controls the loss
- ? Measured value available | a cooling test beats a table
- x Using one coefficient for every surface in the plant | bare and insulated, still and windy, are different
```

## Radiation and convection side by side

At an outside surface, convection to the air and radiation to the surrounding surfaces happen together and in parallel. Their coefficients add, giving a combined outside coefficient. On HW-60's painted jacket, about **4** for convection plus about **5.6** for radiation gives about 9.6 W/m²·K, which Chapter 2 rounded to 9. On a bare weathered stainless pipe at 85 °C, about **5** plus about **6.7** gives about 11.7 W/m²·K. Radiation, in other words, is as large as natural convection at these temperatures, and cannot be ignored. Chapter 5 shows how to calculate it and how a surface's finish changes it.

## A failure case: the still-air assumption outdoors

This is an illustration. A sister plant keeps a similar hot water tank outdoors, on a slab beside the building. Its insulation and jacket are sound, but its manway, two flanged nozzles and a section of pipe at the inlet were left bare, about **1.5 m²** of metal at about 80 °C in all. When the plant's engineer estimated their loss, the calculation used a still-air convection coefficient of 5 W/m²·K, giving about 1.0 kW for the bare parts, including radiation.

The plant's gas metering, compared month by month with production, showed much higher overnight use than the estimate predicted, and highest on windy nights. The site sits on an exposed ridge. With a representative wind giving a convection coefficient of about 25 W/m²·K, the bare parts' loss would be nearly three times the still-air estimate, and much more in strong wind and rain.

The detection came from comparing metered gas use with the calculation, and noticing the link with weather. The correction was to fit weatherproof removable jackets to the manway, nozzles and inlet, which reduced the overnight use markedly and made it largely independent of the wind. The engineer's calculation template now asks whether a surface is indoors or outdoors and applies a wind coefficient for outdoor bare surfaces.

## How this applies to a small Australian business

Use Newton's law, Q = h A ΔT, with coefficients chosen for the real conditions: low single figures for still air on warm surfaces, higher for hot surfaces, much higher in wind or from fans, and far higher in water. Treat published ranges as a guide and use proper correlations when accuracy matters. Remember that convection controls the loss from bare surfaces and barely affects insulated ones, so the most effective response to a high convection loss is usually insulation, not a better estimate. Add radiation in parallel at every outside surface. And treat outdoor bare surfaces as windy, not still.

## Exercise: a fan in the wash-down area

A 2 m length of bare, weathered stainless pipe at a hose station sits in the airflow from an extraction fan, giving a convection coefficient of about **15 W/m²·K**, with a radiation coefficient of about 6.7 W/m²·K. The water is at 85 °C and the air at 20 °C. What does the length lose, compared with still air at 5 W/m²·K? What would 40 mm of insulation reduce it to?

**Worked answer.** In the fan's airflow, the combined coefficient is about **15 + 6.7 = 21.7 W/m²·K**, and each metre loses about **21.7 × π × 0.0603 × 65 ≈ 267 W**, so 2 m loses about **535 W**. In still air, about **11.7 × π × 0.0603 × 65 ≈ 144 W/m**, or about **289 W** for 2 m. With 40 mm of insulation, the loss is about **18.7 W/m** even in the fan's airflow, about **37 W** for the 2 m, a reduction of about 93%.
