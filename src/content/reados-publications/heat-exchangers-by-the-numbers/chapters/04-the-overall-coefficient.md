---
book: heat-exchangers-by-the-numbers
chapterSlug: the-overall-coefficient
order: 4
title: "The overall coefficient and the controlling resistance"
description: "Build the overall coefficient from films, fouling and a cylindrical wall in series, find the controlling resistance, and catch a doubled water flow that bought 3% for seven times the pump power."
draft: false
---

Heat crossing an exchanger from oil to water passes through a series of obstacles: a thin layer of slow-moving oil next to the tube, any dirt on the outside of the tube, the tube wall, any scale on the inside, and a thin layer of slow-moving water. Each obstacle resists the heat flow, and like resistors in series their resistances add. The **overall heat transfer coefficient**, U, is the reciprocal of the total. Its value matters because it multiplies the area in the design equation, but the way it is built matters more: one resistance is usually much larger than the others, and that one, the **controlling resistance**, decides what can and cannot improve the exchanger.

This chapter builds OC-35's overall coefficient from its five resistances, using the conduction relationship for a cylindrical wall and the electrical analogy that the DOE handbook and most heat transfer texts use, then shows how to find the controlling resistance and what follows from it. The running case finds that when OC-35's oil ran hot, the first response was to double the water flow, which raised the overall coefficient by about 3% while multiplying the water side's pumping power by about seven.

## Resistances in series

Heat flow through a series of layers is like current through resistors in series: the same heat flows through each, and the temperature drops across them add up to the total. Each layer's resistance, per square metre of area, is its temperature drop divided by the heat flux through it. For a tube, the area changes from inside to outside, so each resistance must be referred to the same area, conventionally the tube's outside area.

```figure
type: formula
title: Overall coefficient referred to the outside of a tube
formula: 1 ÷ U_o = 1 ÷ h_o + R_f,o + r_o × ln(r_o ÷ r_i) ÷ k_w + (D_o ÷ D_i) × (R_f,i + 1 ÷ h_i)
caption: This is an illustration for OC-35: stainless steel tubes 12.7 mm outside and 10.9 mm inside, an illustrative oil-side coefficient of 450 W/(m²·K), a water-side coefficient of about 6,090 W/(m²·K) at 1.2 m/s, and fouling allowances of 0.00018 m²·K/W on each side.
- h_o, h_i | Film coefficients outside and inside the tube, W/(m²·K)
- R_f,o, R_f,i | Fouling resistances outside and inside, m²·K/W
- k_w | Thermal conductivity of the tube wall, W/(m·K), about 16 for stainless steel
- D_o ÷ D_i | Ratio that refers the inside resistances to the outside area
step: Oil film 22.2, oil fouling 1.8, wall 0.6, water fouling 2.1, water film 1.9, all × 10⁻⁴ m²·K/W
step: Total ≈ 28.6 × 10⁻⁴ m²·K/W, so U_o ≈ 349 W/(m²·K)
step: Without fouling, U_o ≈ 404 W/(m²·K)
```

## The cylindrical wall

Conduction through a tube wall differs slightly from conduction through a flat plate because the area grows with radius: heat crossing from the inside to the outside passes through ever-larger shells. The resistance of the wall, per unit of outside area, is r_o × ln(r_o ÷ r_i) ÷ k_w. For OC-35's stainless tubes, that is about 0.61 × 10⁻⁴ m²·K/W. A thin wall can be approximated as a flat plate, thickness divided by conductivity, which gives about 0.56 × 10⁻⁴ m²·K/W here, close enough for most purposes; the logarithmic form matters for thick walls and for insulation, where the ratio of radii is large.

The wall's resistance is small for metal tubes, and the choice of metal affects it less than people expect. Copper tubes, with a conductivity more than twenty times stainless steel's, would cut the wall's resistance from about 0.61 to about 0.03 × 10⁻⁴ m²·K/W, a 2% gain in U for OC-35. Tube material is chosen for corrosion resistance, strength and cost, and its conductivity usually decides little.

## The electrical analogy

The analogy that makes the overall coefficient easy to reason about is the electrical one: temperature difference as voltage, heat flow as current, thermal resistance as electrical resistance. Resistances in series add; the temperature drop across each is proportional to its share of the total; and the largest resistance takes the largest share of the temperature difference. Parallel paths, such as heat leaking around an obstruction or through a fin, combine like parallel resistors.

```figure
type: bars
title: OC-35's thermal resistances, referred to the outside area, × 10⁻⁴ m²·K/W
unit: × 10⁻⁴ m²·K/W
max: 24
caption: This is an illustration. The oil film is about 78% of the total resistance; everything on the water side together is about 14%.
- *Oil film | 22.2
- Oil-side fouling | 1.8
- Tube wall, stainless steel | 0.6
- Water-side fouling | 2.1
- Water film | 1.9
```

## The controlling resistance

For OC-35, the oil film is about **78%** of the total resistance. Of the 17.9 K mean temperature difference, about 14 K is lost across the oil film, and only about 2.5 K across everything on the water side. That one fact explains most of OC-35's behaviour: anything that improves the oil side improves the exchanger almost proportionally, and anything on the water side barely matters.

Oil-side coefficients are low because oils are viscous and poor conductors: a thick, slow boundary layer forms against the tube. Water is a much better heat transfer fluid, with high conductivity and low viscosity. In most oil coolers, gas coolers and air-cooled exchangers, the oil, gas or air side controls, and designers respond by putting the controlling fluid where its coefficient can be raised: on the shell side with close baffle spacing, or on the outside of finned tubes, which add area where the coefficient is low.

## The running case: the oil runs hot

This is an illustration. In its first summer, OC-35's oil ran a few kelvin above 45 °C on hot afternoons. The maintenance team, reasoning that more cooling water would cool better, opened the water valve fully and fitted a larger pump impeller, doubling the water flow through the tubes from about 1.2 to about 2.4 m/s.

## The error: improving the side that did not control

Doubling the water velocity raises the water-side film coefficient by about 2^0.8 ≈ 1.74, from about 6,090 to about 10,600 W/(m²·K), by the correlation of Chapter 5. But the water film was only about 7% of the total resistance. The overall coefficient rose from about 349 to about **359 W/(m²·K)**, a gain of about **2.9%**.

The cost was large. Pressure drop through the tubes rises roughly with the 1.8 power of velocity, so doubling the velocity raised the tube-side pressure drop by about 3.5 times, and the pumping power, pressure drop times flow, by about **7 times**. The higher velocity also increased erosion of the tube inlets. The extra water flow did help a little more than the coefficient suggests, because it lowered the water's outlet temperature and widened the mean temperature difference, but the oil still ran warm.

```figure
type: compare
title: Two ways to improve OC-35's overall coefficient
cols: Change | New overall coefficient | Gain | Cost
caption: This is an illustration. Improving the controlling oil side gives more than ten times the gain of doubling the water velocity.
- Double the water velocity | Water film coefficient × 1.74 | 359 W/(m²·K) | 2.9% | About 7 times the tube-side pumping power
- *Raise the oil-side coefficient by 50% | Closer baffle spacing | 471 W/(m²·K) | 34.9% | More shell-side pressure drop on the oil circuit
```

The check that would have prevented it is the resistance breakdown, a few lines of arithmetic that show where the temperature difference is being lost. The fix, for the following summer, was on the oil side: OC-35's bundle was replaced with one having closer baffle spacing, which raised the oil-side coefficient by about 50% and the overall coefficient to about 471 W/(m²·K), about 35% more, at the cost of a modest rise in the oil-side pressure drop that the power unit's return line could accept. The water flow was returned to its design value. The general lesson is that an exchanger is improved by attacking its controlling resistance, and that the controlling resistance is found by calculation, not by intuition about which fluid is "doing the cooling".

## Where the temperature drops

The resistance breakdown also gives the temperature at each surface, which matters for fouling, corrosion and the fluids' behaviour near the wall. This is an illustration. At OC-35's hot end, oil at 55 °C faces water at 34 °C, a local difference of 21 K, and the local heat flux is about 349 × 21 ≈ 7,330 W/m². Dividing that flux through each resistance in turn gives the temperatures: across the oil film the temperature falls by about 16.3 K, to about 38.7 °C at the outer surface of the oil-side fouling; across the fouling to about 37.4 °C; across the wall to about 36.9 °C; across the water-side scale to about 35.4 °C; and across the water film to the water's 34 °C.

Two things follow. The tube wall runs at about 37 °C, much closer to the water's temperature than the oil's, because the water side's resistance is small. Scaling from hard cooling water rises with surface temperature, so a cool wall helps the water side stay clean. And the oil next to the wall is about 16 K cooler than the oil in the bulk of the shell, so it is markedly more viscous, which thickens its boundary layer and lowers its coefficient further. The film correlations of Chapter 5 include a correction for this wall viscosity effect, which is significant for oils and negligible for water.

## Orders of magnitude

Typical film coefficients differ by orders of magnitude between fluids, and knowing the order is enough to spot the controlling resistance before any detailed calculation. Water in turbulent flow in tubes gives coefficients in the thousands of W/(m²·K); condensing steam, in the thousands to tens of thousands; boiling water, similar. Oils and other viscous liquids give hundreds, and less in laminar flow. Gases and air at ordinary pressures and velocities give tens. An exchanger between water and air is therefore controlled by the air side, by a wide margin; one between oil and water by the oil side; and one between water and water by neither, with both sides and the fouling all mattering. That ordering is why air coolers are finned on the air side, why oil coolers put the oil where its velocity can be raised, and why water-to-water plate exchangers achieve such high overall coefficients.

## Improving an exchanger in service

When an exchanger underperforms in service, the resistance breakdown points to the order in which to look. If the controlling resistance is a film, check the flow of that fluid: a bypass valve left open, a blocked strainer, a pump below its duty, or, on the shell side, a bundle whose bypass lanes are letting the fluid avoid the tubes. If fouling has grown, the U × A trend of Chapter 2 shows it, and cleaning restores the coefficient. If neither has changed, the duty or the inlet temperatures have, and the exchanger is being asked for more than it was designed for. Each of those causes has a different remedy, and only the breakdown tells which applies.

## Clean and fouled coefficients

The overall coefficient with fouling included, about 349 W/(m²·K) for OC-35, is the **design** or **service** coefficient; without fouling, about 404 W/(m²·K), it is the **clean** coefficient. A new exchanger performs at close to its clean coefficient and so has a margin over its duty, which it gradually uses up as it fouls. The ratio of the two, about 1.16 for OC-35, is the area margin that the fouling allowance buys. Chapter 6 discusses how that allowance should be chosen and why too much is as harmful as too little.

## Referring to the right area

Because a tube's outside and inside areas differ, the overall coefficient must always be stated with the area it refers to: U_o with the outside area, U_i with the inside area, and U_o × A_o = U_i × A_i. Mixing them, using an outside-referred U with an inside area, gives an error equal to the diameter ratio, about 17% for OC-35's tubes, in the direction that undersizes the exchanger. Makers usually quote U and area on the outside of the tubes; plate exchangers have the same area on both sides, which removes the problem.

## Recording the breakdown

The resistance breakdown belongs on the exchanger's design record beside its data sheet: each film coefficient and its source, each fouling allowance, the wall material and thickness, the resulting clean and service coefficients, and the share each resistance takes. For OC-35, that is five lines and a total. When the exchanger is later re-rated for a new duty, a new oil or a summer complaint, the record shows at once which side controls and which changes are worth testing, and it saves the next engineer from repeating the doubled-water-flow experiment.

## Exercise: a finned option

An alternative to OC-35's bundle uses low-finned tubes, with integral fins on the outside that give about 2.5 times the outside area per metre of tube. If the oil film and oil fouling resistances, per unit of the larger finned area, stay the same, and everything inside the tube is unchanged per unit inside area, roughly how does the overall conductance per metre of tube compare with the plain tube? Ignore fin efficiency.

**Worked answer.** Per metre of tube, the oil-side resistances fall by the area ratio of 2.5: the oil film from 22.2 to about 8.9 and oil fouling from 1.8 to about 0.7, in the same units referred to the plain tube's outside area. The wall, water fouling and water film, about 0.6, 2.1 and 1.9, are unchanged. The total falls from about 28.6 to about 14.2 × 10⁻⁴ m²·K/W, so the conductance per metre of tube roughly doubles, by about 28.6 ÷ 14.2 ≈ **2.0**.

In practice, fins are less than fully effective, because heat must conduct along them and their tips run cooler than their roots, and closely spaced fins can trap viscous oil, so the real gain is less. But the calculation shows why finned tubes are used for oil and gas coolers: they add area exactly where the controlling resistance is.
