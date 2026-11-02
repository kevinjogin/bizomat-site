---
book: plasma-surface-engineering-by-the-numbers
chapterSlug: plasma-nitriding-gas-heat-and-time
order: 5
title: "Plasma nitriding: gas, heat and time"
description: "How plasma nitriding hardens steel, how the gas mixture controls the compound layer, what gas flows and power a load needs, and how case depth grows with time."
draft: false
---

Nitriding hardens steel without quenching it. Nitrogen diffuses a fraction of a millimetre into the surface at 480 to 580 °C, well below the temperature at which a hardened tool steel would lose its hardness, and combines with chromium, molybdenum, vanadium and aluminium in the steel to form very fine nitride particles that make the surface layer hard and wear-resistant, and put it into compression, which improves fatigue strength. Because nothing is quenched, nitrided parts distort very little, which is why moulds, dies, gears, crankshafts and hydraulic parts are nitrided after final machining. Only the steels that contain nitride-forming alloying elements respond strongly; a plain carbon steel forms a compound layer but gains little hardness beneath it.

Plasma nitriding does this with the glow discharge of Chapters 2 and 3. This chapter explains the layers nitriding forms and how the plasma's gas mixture controls them, works out the gas flows and power that order 27's load needs with the KEVOS® gas law and gas mixture tools, and shows how case depth grows with the square root of time. It ends with a thermocouple in the wrong kind of part, which made the first trial load's case too shallow.

## The compound layer and the diffusion zone

A nitrided steel surface has two layers. At the very surface, if the nitrogen supply is generous, a thin compound layer of iron nitrides forms, a few micrometres to a few tens of micrometres thick, often called the white layer because it etches white under a microscope. It is very hard and resists wear, corrosion and seizure, but it can be brittle, especially if it is thick or porous. Beneath it lies the diffusion zone, where nitrogen has diffused into the steel's grains and formed fine alloy nitrides; it grades into the unaffected core over a depth of typically 0.05 to 0.5 mm.

Which layer a part needs depends on its duty. Parts that slide against other parts, such as hydraulic rods and gears in lightly lubricated service, often benefit from a thin, dense compound layer. Parts that will be coated afterwards, or that see heavy impact or thermal shock, such as die-casting tooling, usually need no compound layer at all, because a brittle layer under a hard coating cracks and takes the coating with it. Order 27 is the second kind: the toolmaker's drawing calls for a diffusion zone 0.10 to 0.15 mm deep with no compound layer, before the CrN coating.

```figure
type: compare
title: Nitrided layers and what they suit
cols: Typical thickness | Properties | Suits
rowhead: Layer
- Compound layer, ε and γ′ iron nitrides | a few to about 20 µm | Very hard, corrosion and seizure resistant, can be brittle | Sliding wear, corrosion resistance
- * Diffusion zone with alloy nitrides | about 0.05 to 0.5 mm | Hard, tough, in compression, good fatigue strength | Fatigue, impact, a base for PVD coatings
- Core | below the case | Unchanged hardened and tempered steel | Supports the case
caption: General characteristics of nitrided steels; actual thicknesses and hardness depend on the steel, the temperature, the time and the nitrogen supply.
```

## Controlling the layers with the gas mixture

In gas nitriding the nitrogen supply comes from ammonia and is controlled by the ammonia's dissociation. In plasma nitriding it comes from nitrogen gas activated in the glow, and the main control is the proportion of nitrogen in a nitrogen–hydrogen mixture. A nitrogen-rich mixture supplies nitrogen faster than it can diffuse inward, and the excess builds a compound layer at the surface. A lean mixture, with only a small fraction of nitrogen, supplies only what the diffusion zone can absorb, and no compound layer forms. Methane added in small amounts encourages the ε phase, which some sliding applications prefer.

The shop's standard mixture for general nitriding is 25% nitrogen and 75% hydrogen. Trials on H13 samples at 520 °C showed that this gave a compound layer about 2 µm thick, too much for a duplex treatment, so for order 27 the shop uses a lean mixture of 10% nitrogen and 90% hydrogen, which gave no measurable compound layer on the trial coupons. The right fraction depends on the steel and the temperature and is set by trials, not by a general rule.

## The case: gas flows and the mixture

PN-1's flow controllers meter gas in standard litres per minute: litres at 0 °C and 101.325 kPa. For order 27 they supply 0.2 standard litres per minute of nitrogen and 1.8 of hydrogen, 2.0 in all, which gives the 10:90 mixture.

The [gas volume at pressure and temperature tool](/tools/gas-law/) converts a gas volume or flow between two sets of pressure and temperature by the ideal gas law, entering pressures as gauge values with the atmospheric pressure. A flow of 0.002 m³/min at 0 bar gauge and 0 °C, converted to 0.003 bar absolute, entered as −1.01025 bar gauge with an atmosphere of 1.01325 bar, and 520 °C, becomes 1.961 m³/min: the volume ratio is about 981.

```figure
type: steps
title: Order 27's nitriding gas in PN-1
caption: This is an illustration. Actual flow from the gas law tool; mixture properties from the gas mixture properties tool with nitrogen (28.014 kg/kmol, c_p 1.04 kJ/(kg·K)) and hydrogen (2.016 kg/kmol, c_p 14.30 kJ/(kg·K)) at 0.3 kPa and 520 °C. The vessel's gas volume of about 2 m³ is the shop's estimate.
- Standard flows | 0.2 L/min N₂ + 1.8 L/min H₂ = 2.0 standard L/min
- Actual flow at 300 Pa and 520 °C | about 1.96 m³/min
- * Gas residence time in about 2 m³ | about one minute
- Partial pressure of nitrogen, 10% of 300 Pa | 30 Pa
- Mixture molar mass | 4.62 kg/kmol
- Mixture density | about 0.0002 kg/m³
```

The gas in PN-1 is replaced roughly once a minute. That matters because the plasma splits hydrogen and nitrogen, consumes nitrogen into the parts and produces small amounts of water from the oxides it reduces; a steady flow keeps the composition near the set mixture. The [gas mixture properties tool](/tools/gas-mixture-properties/) gives a partial pressure of 30 Pa of nitrogen, which is the figure trials relate to compound layer formation, more directly than the percentage, since a 10% mixture at a different total pressure supplies nitrogen at a different rate.

## Heating the load with the glow

PN-1 has no heaters in its working space: the glow heats the load. Order 27's 24 inserts each weigh about 3.31 kg (π × 0.03² × 0.15 m × 7,800 kg/m³), 79 kg in all, and with fixtures and dummy parts the load is about 139 kg. Heating it from 20 to 520 °C, with steel's specific heat of about 0.46 kJ/(kg·K), takes 139 × 0.46 × 500 = 32,000 kJ, about 8.9 kWh. With roughly 12 kW more going in than is being lost during heat-up, that takes about three-quarters of an hour of glow, consistent with the hour-long start of Chapter 2, during which the cleaning of Chapter 4 also takes place.

At temperature, all of the power goes to replacing losses. PN-1 is a cold-wall vessel: its wall is water-cooled to about 50 °C. Radiation from the load's 1.41 m² of surface at 520 °C, with an assumed emissivity of 0.4, to a wall at 50 °C is about 12.3 kW by the Stefan–Boltzmann law. The rest of the 24 kW the supply delivers goes by conduction through the gas, through the hearth's supports and into the water-cooled feedthroughs.

```figure
type: compare
title: PN-1's heat balance for order 27 at 520 °C
cols: Power | Basis
rowhead: Item
- Input from the glow | 24 kW | 600 V × 40 A, measured
- Radiation from load to wall | about 12.3 kW | Stefan–Boltzmann, ε = 0.4 assumed, 1.41 m² at 520 °C to 50 °C
- * Conduction through gas, hearth and feedthroughs | about 11.7 kW | The balance
- Radiation with polished heat shields, ε_effective ≈ 0.15 | about 4.6 kW | For comparison
caption: This is an illustration. The emissivity of oxidised steel varies widely; the balance shows the order of the losses. Many nitriding vessels have radiation shields or auxiliary wall heaters, which cut the power the glow must supply and make temperatures more uniform.
```

The balance explains a practical problem. Since the glow supplies the heat, and the glow's current density depends on geometry and pressure, the power a part receives is not something the operator sets part by part. Thin parts, edges and parts near the hearth's rim heat differently from massive ones in the middle. Auxiliary heaters and heat shields reduce the share of the heating the glow must do, which is why most modern vessels have them.

## How case depth grows

Nitrogen enters the steel by diffusion, so the depth of the diffusion zone grows roughly with the square root of time, like any diffusion front. The Library's [Diffusion by the Numbers](/reados/publications/diffusion-by-the-numbers/) derives the relation and shows how strongly the diffusion coefficient depends on temperature. In practice the case depth is written d = k√t, with k found by trials for the steel, temperature and mixture.

```figure
type: bars
title: Diffusion zone depth for H13 at 520 °C, d = k√t
x: Nitriding time at temperature, h
y: Depth, mm
caption: This is an illustration. k = 0.0354 mm/√h, from the shop's trial result of 0.10 mm after 8 hours on H13 with the lean mixture. Doubling the depth takes four times as long.
- 8 h | 0.100
- 12 h | 0.122
- 16 h | 0.141
- * 18 h | 0.150
- 24 h | 0.173
```

For order 27's specification of 0.10 to 0.15 mm, the shop aims at 0.125 mm, which needs (0.125 ÷ 0.0354)² = 12.5 hours at temperature. It runs 12 hours, giving 0.122 mm, comfortably inside the band. Raising the temperature would shorten the time, because diffusion speeds up steeply with temperature, but H13 tempered for 46 HRC must stay well below its tempering temperature or its core will soften, and the nitrides formed at higher temperatures are coarser and the surface hardness lower.

## Stainless steels and masking

Two features make plasma nitriding the preferred method for some work. Stainless steels protect themselves with a thin chromium oxide film that blocks nitrogen in gas nitriding unless the surface is first activated chemically. In a plasma, sputtering and hydrogen remove that film continuously during the treatment, so stainless steels nitride readily. At ordinary nitriding temperatures, though, nitrogen ties up the chromium as chromium nitride and the nitrided layer loses its corrosion resistance; low-temperature treatments, below about 450 °C, can harden austenitic stainless steels while keeping much of their corrosion resistance, and they are a specialised process with its own trials.

Masking is the other. Areas that must stay soft, such as threads that will be machined later or bearing seats that will be ground, can be shielded with close-fitting steel covers or plugs, which keep the glow off the surface underneath, or with stop-off pastes. Masks must fit closely, because a gap of a millimetre or two is exactly the size that can start a hollow cathode glow (Chapter 2), and they must not touch the hearth in a way that changes the part's electrical contact. The shop records every mask on the job card, with a sketch, and checks the masked areas for softness after treatment.

## Cooling and finishing the cycle

At the end of the soak the glow is switched off and the load cools under vacuum or in a flow of nitrogen or hydrogen, never in air, which would oxidise the hot surfaces and spoil the colour and the subsequent coating adhesion. Cooling a 139 kg load from 520 °C in a cold-wall vessel takes several hours; many vessels add gas circulation and cooling fans to speed it up. The load is not unloaded until it is below about 150 °C, and the parts are then kept dry until they are coated.

The run sheet then records the whole cycle: base pressure and leak rate, heat-up time, both thermocouples' readings through the soak, voltage, current, arc counts, gas flows, pressure and cooling time. With the test coupons of Chapter 6 travelling in the same load, those records are what let the shop show the toolmaker that the inserts saw the process that was agreed, and let it trace a problem if one appears in service.

## When it goes wrong: the thermocouple in the wrong part

The first trial load of eight inserts came out with a diffusion zone of only 0.08 mm after the planned 12 hours, against the expected 0.12 mm. The run log showed 520 °C throughout the soak.

The control thermocouple had been placed in a small dummy pin, 12 mm in diameter, at the edge of the load. A thin pin has much more surface per kilogram than a 60 mm insert, so it receives more glow power per kilogram and heats faster. When the controller saw the pin reach 520 °C and started counting the soak time, the inserts' cores were still about 40 K cooler, and they took about three more hours to catch up. For those hours they were nitriding slowly, and the soak was effectively about three hours shorter at full temperature; the case was shallower still because diffusion is so sensitive to temperature.

```figure
type: decision
title: Fixing the soak timing
caption: This is an illustration. The shop now specifies the dummy part's section for each order.
- Add three hours to the soak | Treats the symptom; still wrong for a different load | Not adopted
- * Put the control thermocouple in a dummy part of the same section as the load | The soak starts when the slowest part is at temperature | Adopted
- Add a second thermocouple in a load part and use the lower reading | Good practice for mixed loads | Adopted for mixed loads
```

The control thermocouple now sits in a dummy insert of the same 60 mm diameter, drilled to its centre, and for mixed loads a second thermocouple in the most massive part decides when the soak begins. The run sheet records both readings every ten minutes. The rerun of the trial load, with the thermocouple in a dummy insert and the same 12-hour soak, gave 0.12 mm on all eight inserts, matching the prediction, and the full order was released for treatment on that basis.

## Exercise: a deeper case

A pump maker asks the shop to plasma nitride shafts of a chromium–molybdenum steel to a diffusion zone of 0.30 mm with a thin compound layer. Trials at 530 °C with the 25% nitrogen mixture gave 0.18 mm in 10 hours.

1. What is k, and how long is needed for 0.30 mm?
2. What standard flows of nitrogen and hydrogen give 25% nitrogen at a total of 2.0 standard L/min, and what is the nitrogen partial pressure at 300 Pa?
3. Why might the shop not simply raise the temperature to shorten the cycle?

**Answer.**

1. k = 0.18 ÷ √10 = 0.0569 mm/√h. Time = (0.30 ÷ 0.0569)² = 27.8 hours, so about 28 hours at temperature.
2. 0.5 standard L/min of nitrogen and 1.5 of hydrogen. The [gas mixture properties tool](/tools/gas-mixture-properties/) with 25% nitrogen at 0.3 kPa gives a nitrogen partial pressure of 75 Pa.
3. Because the shafts are hardened and tempered, and nitriding near or above their tempering temperature would soften the core; because higher temperatures coarsen the nitrides and lower the surface hardness; and because distortion grows with temperature. The steel maker's tempering temperature and the drawing's core hardness set the upper limit.
