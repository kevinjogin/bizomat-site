---
book: industrial-electric-heating-by-the-numbers
chapterSlug: furnaces-and-radiation
order: 7
title: "Furnaces and radiation"
description: "See why radiation takes over as furnaces get hotter, size a small electric tempering furnace, check the 1895 figures for heating steel bars, and place the thermocouple where it tells the truth."
draft: false
---

An oven at 200 °C heats its load mostly by moving hot air. A furnace at 650 °C or 1,000 °C heats its load mostly by radiation, from its glowing elements and its hot walls. The change matters because radiation follows different rules: it rises with the fourth power of absolute temperature, it travels in straight lines so that one part can shade another, and it depends on the surfaces involved. Furnace design is largely the art of arranging radiation so that the load heats evenly and the furnace loses as little heat as possible through its walls, and furnace operation is largely the discipline of loading, soaking and measuring so that every part reaches the temperature the process needs.

This chapter shows why radiation dominates at high temperature, sizes the coating business's small electric tempering furnace, checks Houston and Kennelly's 1895 figures for heating steel bars electrically, and works through a failure caused by a thermocouple in the wrong place.

## Radiation takes over

Chapter 3 gave the radiative heat flux from a surface as ε × σ × (T⁴ − T₀⁴), with temperatures in kelvin. Because of the fourth power, radiation grows very quickly with temperature, while convection grows only in proportion to the temperature difference.

This is an illustration. A surface with an emissivity of 0.8 at 650 °C radiates to surroundings at 20 °C at about 0.8 × 5.67 × 10⁻⁸ × (923⁴ − 293⁴) ≈ **32.6 kW/m²**. Natural convection from the same surface, with h about 10 W/m²·°C, carries away only about 10 × 630 = 6.3 kW/m², about a fifth as much. At 200 °C, by contrast, radiation and natural convection are similar in size, about 1.9 and 1.8 kW/m². By 800 °C, radiation has nearly doubled again from its 650 °C value, to about 59.8 kW/m², while convection has grown by less than a quarter.

```figure
type: bars
title: Radiation and natural convection from a hot surface to 20 °C surroundings
unit: kW/m²
max: 35
caption: This is an illustration with an emissivity of 0.8 and a natural convection coefficient of about 10 W/m²·°C. At oven temperatures the two are similar; at furnace temperatures radiation dominates.
- Radiation at 200 °C | 1.9
- Convection at 200 °C | 1.8
- *Radiation at 650 °C | 32.6
- Convection at 650 °C | 6.3
```

## The tempering furnace

This is an illustration. The coating business's tempering furnace has an internal chamber 0.6 × 0.6 × 0.9 m, lined with 150 mm of ceramic fibre insulation, with nickel-chromium elements mounted on its side walls, 12 kW in total. It tempers springs and small tool steel parts at up to 650 °C, in batches of about 50 kg.

**Load.** Heating 50 kg of steel from 20 °C to 650 °C, using an average specific heat over that range of about 0.6 kJ/kg·°C, which is higher than the room-temperature value because steel's specific heat rises with temperature, takes about 50 × 0.6 × 630 ≈ **18.9 MJ**. Over an hour, that averages about 5.25 kW.

**Walls.** The chamber's internal surface is 2 × (0.6 × 0.6 + 0.6 × 0.9 + 0.6 × 0.9) = 2.88 m². Ceramic fibre has a thermal conductivity of roughly 0.1 W/m·°C at the mean temperature of the lining, so 150 mm of it conducts about 0.1 ÷ 0.15 ≈ 0.67 W/m²·°C. The wall loss is roughly 0.67 × 2.88 × 630 ≈ **1.2 kW**, ignoring the outer surface's film and the furnace's door and element penetrations, which add to it.

**Heating time.** With 12 kW installed and about 1.2 kW lost through the walls, about 10.8 kW is available to heat the load, so the load alone would take about 18,900 ÷ 10.8 ≈ 1,750 s, roughly half an hour, to absorb its heat, and longer in practice, because the transfer slows as the load approaches furnace temperature and because the furnace's own structure must be heated too.

```figure
type: stats
title: The tempering furnace's heat balance at 650 °C
caption: This is an illustration. Ceramic fibre's low conductivity keeps the wall loss small; its low mass also means the lining stores little heat and the furnace warms up quickly.
- 12 kW | Installed element power
- *18.9 MJ | Heat to bring 50 kg of steel to 650 °C
- about 1.2 kW | Wall loss through 150 mm ceramic fibre
- about 30 min | Minimum time for the load to absorb its heat
```

## Low-mass linings

Older furnaces were lined with dense refractory brick, which stores a great deal of heat. A brick-lined furnace takes hours to heat up and cools slowly, which suits continuous operation but wastes energy in a furnace used intermittently, because the lining's stored heat is lost every time it cools. Ceramic fibre linings are light and store little heat, so they heat quickly and lose little energy when the furnace is switched off between batches. The coating business's furnace is used a few times a week, which is exactly the duty for which a low-mass lining pays. The trade-off is that fibre is softer and more easily damaged than brick, so loads must be placed and removed with care, and the lining inspected for erosion and gaps.

## Houston and Kennelly's steel bars

Houston and Kennelly described the electrical heating of iron and steel bars, for forging and similar work, by passing current directly through them. A bar one square inch in section and 20 inches long needed about 27 kW for about 2 minutes, about 4 MJ, which they gave as about 200,000 joules per cubic inch. A larger bar, 3 inches in diameter and 3 feet long, needed about 75 kW for ten minutes, 45 MJ, or nearly 180,000 joules per cubic inch.

Those figures can be checked. A cubic inch of steel, 16.4 cm³ at 7.85 g/cm³, weighs about 129 g, so 200,000 J per cubic inch is about **1.55 MJ per kilogram**. Raising steel to a forging temperature of around 1,150 °C needs, with an average specific heat over that range of about 0.7 kJ/kg·°C, roughly 0.7 × 1,150 ≈ 0.8 MJ per kilogram. On those assumptions, the 1895 figures imply that about half the electrical energy reached the bar as useful heat, the rest being lost by radiation from the white-hot bar during heating, conduction into the clamps, and losses in the transformer and connections. The larger bar, needing slightly less per cubic inch, lost proportionally less from its smaller surface relative to its volume.

```figure
type: compare
title: Houston and Kennelly's bar-heating figures, checked
cols: 1 in² × 20 in bar | 3 in diameter × 3 ft bar
caption: Figures as Houston and Kennelly gave them in 1895; the per-kilogram and efficiency figures are this book's estimates, assuming a forging temperature of about 1,150 °C.
- Power and time | about 27 kW for 2 min | about 75 kW for 10 min
- Energy | about 4 MJ | about 45 MJ
- Energy per cubic inch | about 200,000 J | about 180,000 J
- Energy per kilogram | about 1.55 MJ | about 1.4 MJ
- Implied efficiency, about 0.8 MJ/kg needed | roughly 50% | roughly 55 to 60%
```

## Electric furnaces in 1895

Houston and Kennelly's chapter on electric furnaces described a technology then only a few years old. They illustrated a furnace for making carborundum, silicon carbide, in which a heavy current passed through a central core of coke grains, packed round with a charge of carbon, sand, salt and sawdust, so that the core heated the charge, leaving crystals of carborundum around it. They described the manufacture of calcium carbide by the prolonged action of an electric arc on lime and carbon, a process whose product, reacting with water, gave acetylene, the fuel gas of the oxy-acetylene torch. And they described furnaces for producing aluminium alloys with a carbon arc, and the electrolytic production of pure aluminium.

Those were metallurgical and chemical processes that could not be done any other way, because no fuel-fired furnace could reach the temperatures an electric arc or a heavy current through carbon could produce. Electric furnaces today still dominate where very high temperature, precise control or a clean atmosphere is needed: arc furnaces for melting steel scrap, induction furnaces for melting metals (Chapter 8), and resistance furnaces for heat treatment like the coating business's.

## Soaking

A furnace's control thermocouple reaching its set point does not mean the load has. The surface of each part heats first, and the heat must then conduct into the part's interior and, in a dense load, through the parts shaded from the elements. Heat treatment specifications therefore call for a soak: a period at temperature after the load has reached it, long enough for every part, and every part's interior, to reach and hold the specified temperature. For tempering, the time at temperature is also part of the metallurgy, because tempering is a time and temperature process.

The coating business sets its soak times from the tool steel and spring suppliers' tempering recommendations, and confirms them on new loads with a load thermocouple inserted in a part at the middle of the batch, where it heats last. A load thermocouple's record shows when the slowest part reached temperature, which the control thermocouple never can.

## Radiation travels in straight lines

Because radiation travels in straight lines, a part in a furnace receives heat from the surfaces it can see. A part facing the elements directly heats faster than one shaded behind another part; the face of a stack nearest the elements heats faster than its middle. Loading matters: parts should be spaced so that each can see the hot walls and elements, and dense loads need longer soaking times so that heat can conduct into the parts that radiation reaches last.

The hot walls help. A well-insulated furnace's walls reach close to furnace temperature and radiate back onto the load, evening out the heat that the elements alone would deliver unevenly. That is one reason a furnace heats its load more evenly once it has soaked than during its first heating.

## Element temperature in a furnace

The elements must be hotter than the load to radiate heat to it, and at furnace temperatures the difference can be large. This is an illustration. An element at 900 °C with an emissivity of about 0.85 radiating to a load at 650 °C delivers about 0.85 × 5.67 × 10⁻⁸ × (1,173⁴ − 923⁴) ≈ 56 kW/m², about 5.6 W/cm². As the load approaches its set temperature, the element can run cooler for the same power, but during heating, elements in a 650 °C furnace typically run in the region of 850 to 1,000 °C. Nickel-chromium alloys are rated for continuous use up to 1,200 °C in air, according to Kanthal's data for Nikrothal 80, which covers this furnace comfortably. Furnaces running near or above 1,000 °C use other element materials designed for higher temperatures.

## Atmosphere and scale

Steel heated in air oxidises, and above several hundred degrees it forms scale that spoils surfaces and wastes metal. Tempering at a few hundred degrees produces only a thin, coloured oxide, but hardening at 800 to 900 °C produces heavy scale unless the furnace is filled with a protective atmosphere, such as nitrogen or a controlled gas mixture, or the parts are heated in a vacuum or wrapped in protective foil. The atmosphere also affects the elements: some atmospheres attack nickel-chromium alloys, and furnace makers choose elements for the atmosphere as well as the temperature.

## Measuring furnace temperature

A furnace's temperature is measured by thermocouples, two dissimilar wires joined at a junction that produces a small voltage depending on its temperature. A thermocouple measures its own junction's temperature, which depends on where it is: near an element it reads hotter than the load; near the door it reads cooler. Furnaces used for critical heat treatment, such as aerospace and pressure equipment work, are surveyed periodically by placing several thermocouples throughout the working space and recording them through a cycle, to establish how uniform the temperature is and how the control thermocouple relates to the load.

## A failure: the springs that stayed hard

This is an illustration. A batch of tempered springs failed the customer's hardness check: they were harder than specified, as if they had been tempered at too low a temperature. The furnace's controller record showed the set temperature reached and held for the full time.

The investigation found that the control thermocouple had been moved during an element repair, from its original position in the working space to a new position close to the side-wall elements. There it read the temperature of the air and radiation near the hot elements, perhaps 40 to 50 °C above the load. The controller held that reading at the set point, so the load itself was 40 to 50 °C cooler than the set point, and the springs were under-tempered.

The thermocouple was returned to its correct position, a temperature survey with load thermocouples was carried out to confirm the relationship between control reading and load temperature, and the furnace's procedure now includes a check of the control thermocouple's position after any maintenance inside the chamber. The under-tempered springs were re-tempered and retested.

## Exercise: hotter radiation

Calculate the radiative flux from a surface with an emissivity of 0.8 at 800 °C to surroundings at 20 °C, and compare it with the flux at 650 °C. Then calculate the ratio of the two absolute temperatures raised to the fourth power, and explain the difference from the flux ratio.

At 800 °C, the flux is about 0.8 × 5.67 × 10⁻⁸ × (1,073⁴ − 293⁴) ≈ **59.8 kW/m²**, about 1.83 times the 32.6 kW/m² at 650 °C. The ratio of absolute temperatures to the fourth power is (1,073 ÷ 923)⁴ ≈ 1.83 as well, because the surroundings' term, 293⁴, is tiny by comparison.

A rise of 150 °C, about 16% in absolute temperature, nearly doubles the radiation. That fourth-power sensitivity is why furnace temperatures must be controlled precisely, why a thermocouple's position matters, and why a small overheat of an element or a load can have large consequences.
