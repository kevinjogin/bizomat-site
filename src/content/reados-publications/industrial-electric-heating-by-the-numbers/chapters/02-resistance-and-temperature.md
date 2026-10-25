---
book: industrial-electric-heating-by-the-numbers
chapterSlug: resistance-and-temperature
order: 2
title: "Resistance and temperature"
description: "Calculate a conductor's resistance from its resistivity and size, see how much copper's resistance rises when it heats, and why heating elements are made from nickel-chromium alloys instead."
draft: false
---

Resistance is what turns current into heat, so every electric heating calculation depends on knowing it, and on knowing how it changes as things get hot. It depends on the material, the length and the cross-section of the conductor, and on its temperature. For the copper in a cable, the aim is to keep resistance low, so that little heat is wasted; for a heating element, the aim is the opposite, a resistance high enough to produce the wanted heat from the supply voltage in a conductor of sensible size, and stable enough that the heat stays the same as the element warms up.

This chapter calculates resistance from resistivity, checks Houston and Kennelly's 1895 figures for copper and its temperature coefficient, explains why heating elements are made from nickel-chromium alloys, and applies the results to the curing oven's supply cable and a faulty replacement element.

## Resistivity

The resistance of a uniform conductor is:

**R = ρ × L ÷ A**

where ρ is the material's resistivity, L the length and A the cross-sectional area. Resistivity is a property of the material, measured in ohm-metres, or for convenience in microhm-centimetres or ohm-square-millimetres per metre (Ω·mm²/m), which is numerically equal to microhm-metres.

Houston and Kennelly gave the resistivity of copper as 1.594 microhm-centimetres at 0 °C, and showed how to correct it for temperature. At 20 °C their method gave about **1.721 µΩ·cm**, which is 1.72 × 10⁻⁸ Ω·m, the figure engineers still use for annealed copper at 20 °C. They also noted that annealing reduces a metal's resistivity, though often by only one or two per cent, and that tabulated resistivities for lead, iron and German silver could not be relied on closer than about five per cent, because those metals vary with their composition and treatment.

## Resistivity changes with temperature

The resistivity of pure metals rises with temperature. Houston and Kennelly gave a simple rule: pure metals increase their resistivity by about 0.4% for each degree Celsius above their value at 0 °C. In symbols:

**ρ_T ≈ ρ₀ × (1 + 0.004 × T)**

where ρ₀ is the resistivity at 0 °C and T the temperature in degrees Celsius.

```figure
type: formula
title: Resistivity of copper at three temperatures, by the 1895 rule
formula: ρ_T ≈ ρ₀ × (1 + 0.004 × T)
caption: Houston and Kennelly's worked example for copper, with ρ₀ = 1.594 µΩ·cm at 0 °C. The 20 °C value matches the modern figure for annealed copper.
- ρ₀ | resistivity at 0 °C, 1.594 µΩ·cm
- T | temperature, °C
step: at 20 °C: 1.594 × (1 + 0.004 × 20) = 1.594 × 1.08 ≈ 1.721 µΩ·cm
step: at 100 °C: 1.594 × (1 + 0.004 × 100) = 1.594 × 1.40 ≈ 2.232 µΩ·cm
```

So copper's resistance at the boiling point of water is about 40% higher than at freezing, and about 30% higher than at 20 °C. A cable that runs at 70 °C has roughly 20% more resistance than the same cable at 20 °C, and so wastes 20% more heat for the same current. Cable ratings and voltage drop calculations allow for the conductor's operating temperature for this reason.

## Why heating elements are not copper

Copper is an excellent conductor, which is exactly why it makes a poor heating element. To make a 3 kW, 19.2 Ω element at 240 V from copper wire of 1.2 mm diameter would need about R × A ÷ ρ = 19.2 × 1.131 × 10⁻⁶ ÷ 1.72 × 10⁻⁸ ≈ 1,260 m of wire, more than a kilometre. Its resistance would also rise by more than half as it heated to a few hundred degrees, so its power would fall as it warmed up. And copper oxidises rapidly in hot air, so a bare copper element would soon scale away.

Heating elements are therefore made from alloys designed for the job. The best known is an 80/20 nickel-chromium alloy. Kanthal's data for its Nikrothal 80 gives:

- resistivity at 20 °C of **1.09 Ω·mm²/m**, which is 1.09 µΩ·m, about 63 times that of copper;
- a temperature factor of resistivity that rises only from about 1.01 at 100 °C to about 1.07 at 1,200 °C, so the element's resistance changes by only a few per cent between cold and full working temperature;
- a maximum continuous operating temperature in air of **1,200 °C**, made possible by a protective chromium oxide film on its surface.

```figure
type: compare
title: Copper and a nickel-chromium heating alloy
cols: Annealed copper | 80/20 nickel-chromium (Nikrothal 80)
caption: Copper figures from Houston and Kennelly's 1895 values, which match modern data; nickel-chromium figures from Kanthal's data for Nikrothal 80. The alloy's high, stable resistivity is what makes a compact, steady element possible.
- Resistivity at 20 °C | 0.0172 µΩ·m | 1.09 µΩ·m
- Resistance change, cold to hot | about +0.4% per °C | a few per cent up to 1,200 °C
- Wire for a 19.2 Ω element, 1.2 mm diameter | about 1,260 m | about 19.9 m
- Behaviour in hot air | oxidises rapidly | protective oxide; up to 1,200 °C
```

The same 19.2 Ω element in nickel-chromium wire of 1.2 mm diameter needs only about 19.2 × 1.131 × 10⁻⁶ ÷ 1.09 × 10⁻⁶ ≈ **19.9 m**, which can be coiled into a compact element. Chapter 5 designs it.

## Stable resistance, steady power

The small temperature factor of nickel-chromium has a practical benefit beyond compactness. Because the element's resistance hardly changes as it heats, its power at a fixed voltage hardly changes either: an element that draws 12.5 A and 3 kW hot draws only slightly more when cold. Switching on a cold oven causes no great surge of current.

Contrast this with an incandescent lamp, which Houston and Kennelly described being used as a simple electric heater. Its tungsten filament has a large positive temperature coefficient and runs white hot, so its resistance when cold is roughly a tenth to a fifteenth of its hot resistance, and at the moment of switching on it draws a current many times its running current. Heaters made from materials with large temperature coefficients, such as some ceramic and silicon carbide elements used at very high temperatures, need control systems that manage that change.

## The oven's supply cable

Resistance also governs the losses in the cable that supplies the oven. This is an illustration. The oven is fed through 30 m of three-phase cable with 35 mm² copper conductors. Each conductor's resistance at 20 °C is 1.72 × 10⁻⁸ × 30 ÷ (35 × 10⁻⁶) ≈ 0.0147 Ω. Running warm, at about 70 °C, it is roughly 20% higher, about 0.0177 Ω.

At the oven's full-load current of 83.5 A:

- the voltage drop in each phase conductor is about 83.5 × 0.0177 ≈ 1.48 V, and the drop in line voltage about √3 × 1.48 ≈ 2.56 V, which is about 0.62% of 415 V;
- the heat produced in the cable is about 3 × 83.5² × 0.0177 ≈ **370 W**, spread along its 30 m length.

That 0.62% drop reduces the oven's heater power by about twice as much, about 1.2%, by the square law of Chapter 1. It is small, but it is real power that is lost before the oven sees it, paid for on every kilowatt-hour bill, and a longer or thinner cable would lose more. Over a year of 250 eight-hour days at full load, 370 W of cable loss would add up to roughly 740 kWh. Cable selection for voltage drop and for current-carrying capacity is covered by AS/NZS 3008.1.1 and is the electrician's responsibility (Chapter 4).

## Measuring resistance in practice

Resistance measurements on heaters are simple but need care. Element resistances are low, so the meter's own lead resistance, typically a fraction of an ohm, matters when measuring a few ohms. Contacts must be clean, because a corroded terminal adds resistance that belongs to the connection, not the element. And the element's temperature must be known: a nickel-chromium element reads within a few per cent of its working value when cold, but a copper winding or a tungsten lamp reads very differently cold and hot. For very low resistances, such as busbar joints and contactor contacts, a four-wire micro-ohmmeter separates the measuring current from the voltage sensing, removing lead resistance from the reading.

## Joints and connections

The resistance that causes most trouble in practice is often not in a conductor at all but at a connection. A loose or corroded terminal has a contact resistance that can be many times the resistance of metres of cable, and it is concentrated in a few square millimetres. This is an illustration. A terminal with a contact resistance of 0.005 Ω carrying 12.5 A dissipates 12.5² × 0.005 ≈ 0.78 W, which sounds harmless, but in a connection of a few cubic millimetres that cannot shed heat well, it can raise the temperature enough to oxidise the contact further, increasing its resistance and its heat in a cycle that ends in a burnt terminal. Heater terminals, which sit close to hot elements and go through repeated heating and cooling, are particularly prone to this, which is why they are checked and retightened in routine maintenance and why infrared thermography of switchboards finds hot joints before they fail.

## Series and parallel groups

Heater banks combine elements in series and parallel, and the combination sets the bank's resistance, power and behaviour when an element fails. Elements in series add their resistances: two 9.6 Ω elements in series make 19.2 Ω, and together they draw the same 3 kW at 240 V as a single 19.2 Ω element. Elements in parallel combine as the reciprocal of the sum of reciprocals: two 19.2 Ω elements in parallel make 9.6 Ω and draw 6 kW at 240 V.

The choice affects failure. If one element in a series pair breaks, the whole pair goes cold and the power of that group falls to zero; if one element in a parallel pair breaks, the other carries on at its own rating and the group's power halves. Series connection lets lower-resistance, thicker elements be used on a given voltage, which can be more robust; parallel connection keeps some heat if an element fails. Oven makers choose the arrangement for the voltage, the element design and the consequences of a failure, and the wiring diagram records it.

## Elements age

A heating element's resistance does not stay exactly at its new value. At high temperature, the alloy's surface slowly oxidises, and the protective oxide layer grows by consuming metal from the wire, reducing its cross-section. Over a long life the element's resistance creeps upwards and its power at a fixed voltage creeps down. Elements run hotter than their alloy's rating, or exposed to contaminants that attack the oxide layer, age much faster. Measuring and recording element resistances at each maintenance visit shows the trend and gives warning of elements approaching the end of their life, before one fails during a production run.

## Aluminium conductors

Not every supply conductor is copper. Aluminium, lighter and cheaper, is widely used for larger cables and busbars. Its resistivity is about 1.6 times that of copper, so an aluminium conductor needs roughly 1.6 times the cross-section for the same resistance and the same Joule heating. Aluminium also forms a tough, insulating oxide film and creeps under sustained pressure, so its connections need terminals and fittings designed for it and correctly tightened; a poorly made aluminium joint is a classic source of the overheating connections described above.

## A failure: the slow oven

This is an illustration. After two elements in the oven were replaced with units made by a local rewinder, the oven took noticeably longer to reach temperature, and the temperature in one zone lagged behind the others.

The maintenance electrician measured the resistances. The original elements read close to 19 Ω; the two new ones read about **27.6 Ω**. The rewinder had used 1.0 mm wire instead of the specified 1.2 mm, keeping the same length of about 19.9 m. The smaller wire's area is π ÷ 4 × 1.0² ≈ 0.785 mm², about 69% of the original 1.131 mm², so its resistance was about 1 ÷ 0.694 ≈ 1.44 times higher. At 240 V, each new element produced only about 240² ÷ 27.6 ≈ **2,090 W** instead of 3,000 W, so that zone was short of about 1.8 kW.

The thinner wire also ran at a higher surface loading for its size, shortening its life (Chapter 5). The elements were replaced with correct ones, the rewinder was given the full specification, and the oven's spares list now specifies the wire alloy, diameter and length, and requires a resistance check of every replacement element before it is fitted.

## Exercise: copper at 90 °C

Using Houston and Kennelly's rule, calculate copper's resistivity at 90 °C from its value of 1.594 µΩ·cm at 0 °C. Then calculate the resistance of one 30 m, 35 mm² conductor of the oven cable at 90 °C, and compare it with the value at 20 °C.

At 90 °C, ρ ≈ 1.594 × (1 + 0.004 × 90) = 1.594 × 1.36 ≈ **2.168 µΩ·cm**, which is 2.168 × 10⁻⁸ Ω·m. The conductor's resistance is then 2.168 × 10⁻⁸ × 30 ÷ (35 × 10⁻⁶) ≈ **0.0186 Ω**, against about 0.0147 Ω at 20 °C, roughly 26% higher.

A cable running near its maximum temperature therefore wastes about a quarter more power, and drops about a quarter more voltage, than the same cable cold. That is why cable ratings and voltage drop calculations are made at the conductor's operating temperature, not at room temperature.
