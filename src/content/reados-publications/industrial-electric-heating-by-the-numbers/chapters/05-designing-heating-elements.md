---
book: industrial-electric-heating-by-the-numbers
chapterSlug: designing-heating-elements
order: 5
title: "Designing heating elements"
description: "Size a resistance heating element from its power and voltage: resistance, wire length, diameter and surface loading, and why a thicker wire runs so much cooler and lasts longer."
draft: false
---

A heating element looks simple: a coil of wire that gets hot when current flows. Behind it are four linked choices. The power and voltage fix its resistance. The alloy and wire diameter then fix its length. The length and diameter fix its surface area, and the surface area fixes how hard each square centimetre must work to shed the heat, which decides how hot the wire runs and how long it lasts. Get the balance right and an element runs quietly for years; get it wrong and it sags, oxidises and fails in weeks.

This chapter designs a 3 kW element for the curing oven from first principles, shows why the wire diameter matters so much more than it seems, looks at the main types of element, and works through a failure caused by a kink.

## Start with power and voltage

The element's resistance at its working temperature follows from Joule's law (Chapter 1):

**R = V² ÷ P**

For a 3 kW element connected between phase and neutral at 240 V, R = 240² ÷ 3,000 = **19.2 Ω**. The same element connected across two phases at 415 V would need 415² ÷ 3,000 ≈ 57.4 Ω, three times as much. The connection, star or delta, must be decided before the element is designed, and once designed, an element must only be connected the way it was designed for, as the failure in Chapter 1 showed.

## From resistance to length

With the alloy and wire diameter chosen, the length follows from R = ρ × L ÷ A:

**L = R × A ÷ ρ**

For an 80/20 nickel-chromium alloy with a resistivity of 1.09 µΩ·m at 20 °C and a wire diameter of 1.2 mm, the cross-section is π ÷ 4 × 1.2² ≈ 1.131 mm², so the length is 19.2 × 1.131 ÷ 1.09 ≈ **19.9 m**.

The alloy's resistance rises slightly as it heats. Kanthal's data for Nikrothal 80 gives a temperature factor rising from about 1.01 at 100 °C to about 1.07 at 1,200 °C, so at a working temperature of several hundred degrees the element's resistance is a few per cent above its cold value. A designer who wants exactly 3 kW at working temperature shortens the wire by the same few per cent, using the factor from the maker's table for the expected temperature. For the oven, where the controller sets the temperature (Chapter 9), a few per cent of power makes little difference, and the 19.9 m element, giving 19.2 Ω cold, draws slightly under 3 kW when hot.

```figure
type: formula
title: A 3 kW, 240 V element in 1.2 mm nickel-chromium wire
formula: R = V² ÷ P;  L = R × A ÷ ρ;  surface loading = P ÷ (π × d × L)
caption: This is an illustration using Kanthal's resistivity for Nikrothal 80 at 20 °C. The element's resistance rises a few per cent at working temperature, which a designer allows for with the maker's temperature factor.
- P, V | 3,000 W at 240 V
- ρ | 1.09 µΩ·m (1.09 Ω·mm²/m)
- d | wire diameter, 1.2 mm; A = 1.131 mm²
step: R = 240² ÷ 3,000 = 19.2 Ω
step: L = 19.2 × 1.131 ÷ 1.09 ≈ 19.9 m
step: surface loading = 3,000 ÷ (π × 0.12 cm × 1,990 cm) ≈ 4.0 W/cm²
```

## Surface loading

The surface loading is the power per unit of wire surface:

**surface loading = P ÷ (π × d × L)**

For the 1.2 mm element, it is about 3,000 ÷ (π × 0.12 × 1,990) ≈ **4.0 W/cm²**. Chapter 3 showed that a surface shedding about 4 W/cm² in a 200 °C oven runs at roughly 580 to 680 °C, depending on the airflow. A higher surface loading means a hotter wire; a lower one, a cooler wire.

Surface loading is the element designer's main control over wire temperature and life. Element makers publish recommended maximum surface loadings for their alloys in different kinds of equipment, because the right value depends on how the element can shed its heat: an open coil in moving air can work harder than a coil buried in a groove in an insulating brick, which can shed heat only from one side. Those recommendations, not a general rule, govern a real design.

## Why diameter matters so much

For a fixed power and voltage, the resistance is fixed, so the ratio of length to cross-section is fixed. Cross-section rises with the square of diameter, so the length needed rises with the square of diameter too. Surface area is circumference times length, so it rises with the cube of diameter. Surface loading, power divided by surface, therefore falls with the cube of diameter.

```figure
type: compare
title: Three wire diameters for the same 3 kW, 240 V element
cols: Length needed | Surface loading | Wire mass
caption: This is an illustration in 80/20 nickel-chromium. A thicker wire needs much more length and metal but runs at a far lower surface loading, so it runs cooler and lasts longer.
- 1.0 mm | about 13.8 m | about 6.9 W/cm² | about 90 g
- *1.2 mm | about 19.9 m | about 4.0 W/cm² | about 190 g
- 1.6 mm | about 35.4 m | about 1.7 W/cm² | about 590 g
```

Going from 1.2 mm to 1.0 mm wire, only 17% thinner, shortens the element by 30% and raises the surface loading by about 73%, from 4.0 to 6.9 W/cm². Going to 1.6 mm, a third thicker, nearly doubles the length and cuts the loading by more than half. That cube law, more than any other single fact in this chapter, is why the slow oven in Chapter 2, whose rewinder used 1.0 mm wire at the original length, produced too little power, and why an element rewound in thinner wire at the correct length would have the right power but run much hotter and fail sooner.

The cost of a thicker wire is more alloy, about six times as much at 1.6 mm as at 1.0 mm, and more space to fit a longer element. The designer balances element life against cost and space, guided by the maker's surface loading recommendations, and for a production oven that runs every day, the longer life of a thicker wire usually repays its extra cost many times over in avoided breakdowns.

## Coiling the wire

Nineteen metres of wire must fit in the oven. It is coiled, typically into a helix with a coil diameter several times the wire diameter, stretched to a pitch that leaves gaps between the turns. The coil diameter and pitch matter. Turns that are too close shield each other: the inner faces of the turns radiate onto neighbouring turns rather than out into the oven, so the wire runs hotter than its surface loading suggests. A coil that is too large in diameter for its wire becomes floppy at high temperature and sags, eventually touching other coils or the oven structure. Element makers give recommended ratios of coil diameter to wire diameter and of pitch to wire diameter for this reason.

## Types of element

The open coil is only one form. Industrial heating uses several:

- **Open coils** on ceramic supports, in direct contact with the air or the furnace atmosphere, which can run hot and respond quickly but have exposed live wire.
- **Sheathed or tubular elements**, in which the wire is embedded in compacted magnesium oxide powder inside a metal tube. The powder insulates electrically but conducts heat, and the sheath protects the wire. They can be bent to shape, immersed in liquids and used where live wire must not be exposed. The wire runs hotter than the sheath, because heat must flow through the powder.
- **Cartridge heaters**, small sheathed elements inserted into bored holes in moulds, platens and dies.
- **Band and strip heaters**, clamped around barrels and onto surfaces, as on plastics machinery.
- **Ceramic and infrared emitters**, which are designed to radiate (Chapter 8).

For sheathed elements, the surface loading is quoted on the sheath, and the sheath's temperature, not the wire's, limits what the element can do in a given fluid or air stream.

## Sheathed elements in liquids

Sheathed elements immersed in liquids show the importance of surface loading clearly. In water, which carries heat away very effectively, an element can work at a high surface loading with a modest sheath temperature. In oil, which carries heat away less effectively and can break down if overheated, the surface loading must be much lower, or the oil next to the sheath degrades, carbonises and insulates the element, which then overheats. Element makers and heater suppliers recommend surface loadings by liquid for this reason. The coating business's parts-washing tank uses sheathed elements with a surface loading chosen for its detergent solution, and a low-level cut-out that switches them off if the liquid level falls below them: an immersion element run dry in air loses most of its ability to shed heat and burns out quickly.

## Terminals and cold ends

The element's power should be released inside the heated space, not in its terminals or where it passes through the oven wall. Elements are therefore made with cold ends: short lengths of thicker wire, or wire of a lower-resistance material, welded to the heating section where it passes through the insulation and into the terminal box. Because the cold ends have a much lower resistance per metre, they generate little heat and stay cool enough for the terminals and their insulation (Chapter 3). A replacement element made without proper cold ends heats its own terminals, which then oxidise and fail, often taking the terminal block with them.

## Temperature and life

An element's life depends above all on its temperature. Nickel-chromium alloys survive at high temperature because they form a thin, adherent layer of chromium oxide that protects the metal beneath, and that layer grows slowly, consuming metal as it does. The hotter the wire, the faster the oxide grows and the sooner the wire is thinned to failure. A modest reduction in wire temperature, achieved by a lower surface loading or better airflow, can extend element life considerably, which is why element makers set their surface loading recommendations conservatively for long-life applications.

Temperature cycling matters too. Each time an element heats and cools, the wire and its oxide expand and contract by different amounts, which can crack and flake the oxide, exposing fresh metal to oxidise. An element switched on and off many times an hour sees far more cycles than one held at a steady temperature, which is one reason the control method chosen in Chapter 9 affects element life as well as temperature accuracy.

## Where the elements go in an oven

In a fan-assisted oven like the coating business's, the elements are not placed in the work chamber. They sit in a heater box, usually behind a baffle at the back or side, where the circulating fan draws air over them and blows it through ducts into the chamber. That arrangement keeps the hot wire away from the work, so parts close to the elements are not overheated by direct radiation, and away from people loading the oven. It also makes the elements' heat transfer depend on the fan, which is why the airflow interlock in Chapter 3 matters.

In a radiant oven or furnace, by contrast, the elements line the walls or roof of the chamber and heat the work mainly by radiation. Their arrangement then decides how evenly the work is heated: elements too close to the work create hot spots, and work that shades other work from the elements leaves it cooler. Chapter 7 returns to radiant heating in furnaces.

## A failure: the kink

This is an illustration. A new element in the oven failed after only a few weeks, burning through at one point near a support. The rest of the coil was in good condition, with the even grey oxide of a healthy element.

The burnt section showed a kink, where the coil had been bent sharply during installation. At the kink, the wire had been slightly flattened and stretched, reducing its cross-section locally. The local resistance per centimetre was higher, so the local heat per centimetre was higher, and the turns at the kink had been pressed together, so they shielded each other and shed heat less well. Both effects raised the wire's temperature at that one spot. Higher temperature speeds oxidation, which thins the wire further, raising its resistance and temperature again, until it burnt through.

The element was replaced, the installer was shown how to handle and support coils without kinking them, and the oven's maintenance instructions now require coils to be inspected for kinks, sags and turns that touch, and supports to be checked, whenever an element is fitted.

## Exercise: a 2 kW element

Design a 2 kW element for 240 V in the same 80/20 nickel-chromium alloy using 1.0 mm wire. Calculate its resistance, wire length and surface loading, and compare the loading with the 3 kW element in 1.2 mm wire.

The resistance is 240² ÷ 2,000 = **28.8 Ω**. The cross-section of 1.0 mm wire is π ÷ 4 × 1.0² ≈ 0.785 mm², so the length is 28.8 × 0.785 ÷ 1.09 ≈ **20.7 m**. The surface loading is 2,000 ÷ (π × 0.10 × 2,075) ≈ **3.1 W/cm²**.

The lower power allows a thinner wire at a lower surface loading than the 3 kW element in 1.2 mm wire: the 2 kW element is about the same length but works each square centimetre less hard. Whether 1.0 mm is robust enough mechanically for the oven's coil supports and airflow is a separate question that the element maker's guidance on wire size would answer.
