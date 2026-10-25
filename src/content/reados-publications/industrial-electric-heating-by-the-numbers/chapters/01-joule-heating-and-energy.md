---
book: industrial-electric-heating-by-the-numbers
chapterSlug: joule-heating-and-energy
order: 1
title: "Joule heating, power and energy"
description: "Use P = VI = I²R = V²/R for single- and three-phase heaters, check the 1895 electric kettle, and turn an oven's power into energy, demand and cost per day."
draft: false
---

Every electric heater does the same thing. It passes a current through a resistance, and the resistance turns electrical energy into heat. There is no combustion, no flame and no flue, and in a resistance heater every joule of electrical energy that enters it becomes heat. That simplicity makes electric heating easy to calculate, easy to control and easy to measure. The difficulty is not in producing the heat but in getting it where it is wanted without losing too much of it on the way, and in paying for it.

This chapter sets out the relationships between voltage, current, resistance, power and energy for single- and three-phase heaters, checks Houston and Kennelly's 1895 electric kettle, and works out the power, supply and daily energy of the running case's curing oven.

## Energy and power

Energy is measured in joules. Power is the rate of using energy, measured in watts, where one watt is one joule per second. Electricity is sold by the kilowatt-hour, which is 1,000 watts for an hour, or 3.6 million joules, 3.6 MJ.

Houston and Kennelly spent the opening of their 1895 book explaining these units, because they were then new to most readers. They related them to the units of the day: the foot-pound, the horsepower and the British thermal unit, which they gave as 778 foot-pounds or 1,055 joules, and the calorie, which they gave as 4.18 joules. Those figures are close to modern values. The joule, named for James Prescott Joule, who measured the heat produced by electric currents in the 1840s, is now the only energy unit needed.

## Joule's law

The power turned into heat in a resistance R carrying a current I with a voltage V across it is:

**P = V × I = I² × R = V² ÷ R**

The three forms are the same relationship, linked by Ohm's law, V = I × R. Each is useful in a different situation:

- **P = I² × R** when the current is known, as in a cable or busbar carrying a load current (Chapters 3 and 4);
- **P = V² ÷ R** when the voltage is fixed, as in a heating element connected to the supply (Chapter 5);
- **P = V × I** when both are measured, as when checking a heater with a clamp meter.

```figure
type: formula
title: Power of one heating element of the curing oven
formula: P = V² ÷ R;  I = V ÷ R
caption: This is an illustration. Each element is connected between one phase and neutral of a 415 V three-phase supply, so it sees 240 V.
- V | voltage across the element, 240 V
- R | element resistance at working temperature, 19.2 Ω
step: P = 240² ÷ 19.2 = 3,000 W
step: I = 240 ÷ 19.2 = 12.5 A
```

The P = V² ÷ R form has an important consequence: a heater's power depends on the square of the voltage across it. A 10% rise in voltage gives about 21% more power, and connecting an element to a higher voltage than it was designed for can multiply its power several times, as the failure later in this chapter shows.

## Three-phase heaters

Industrial heaters above a few kilowatts are usually supplied from a three-phase supply, which in Australia is nominally 415 V between phases and 240 V from each phase to neutral. Elements can be connected in two ways:

- **star (wye)**: each element connected between a phase and the neutral or a common star point, seeing 240 V;
- **delta**: each element connected between two phases, seeing 415 V.

For a balanced three-phase load, the total power is:

**P = √3 × V_L × I_L**

where V_L is the line voltage, 415 V, and I_L is the current in each supply line. A balanced load draws the same current in each phase, which keeps the supply balanced and the cable currents as low as possible for a given power.

This is an illustration. The curing oven has twenty 3 kW elements, 60 kW in all, arranged as balanced groups across the three phases. The line current is 60,000 ÷ (√3 × 415) ≈ **83.5 A** in each phase. That figure sets the size of the oven's supply cable and protection (Chapter 4).

## Unbalanced loads

A three-phase supply is easiest on the network and the cables when its load is balanced, with the same current in each phase. A single large heater connected between one phase and neutral, or between two phases, loads some phases and not others. On a star-connected supply, an unbalanced load also sends current through the neutral conductor, which is normally sized on the assumption that the load is roughly balanced.

This is an illustration. If the oven's twenty elements were split unevenly, with eight on one phase and six on each of the others, the phases would carry 8 × 12.5 = 100 A and 6 × 12.5 = 75 A, and the neutral would carry the imbalance, about 25 A. The supply cable would have to be sized for the 100 A phase rather than the 83.5 A of a balanced load. Heater banks are therefore arranged in multiples of three, or in balanced groups, and the oven maker's wiring keeps them that way. When an element fails, the imbalance it creates is a small clue that a maintenance technician with a clamp meter can find quickly.

## Checking a heater with a meter

Because Joule's law links current, voltage and resistance, a heater's condition can be checked with ordinary instruments. With the supply isolated, the resistance of each element can be measured and compared with its design value: an open circuit means a broken element, and a resistance well below design can mean a partial short or the wrong element fitted. With the oven running, a clamp meter on each phase shows whether the currents are balanced and of the expected size. An insulation resistance test between the elements and the oven's metal body checks that the element insulation has not broken down, which matters for electrical safety (Chapter 10). These checks are part of an electrician's routine maintenance and of commissioning.

Most heating alloys change resistance only slightly with temperature (Chapter 2), so a cold resistance reading is a good guide to the working value. Some materials, such as pure metals and the tungsten in incandescent lamps, change a great deal, and their cold resistance is much lower than their hot resistance.

## The same law everywhere in the plant

Joule heating is wanted in a heater and unwanted almost everywhere else. Every cable, busbar, switch contact, transformer winding and motor winding has resistance, and every one of them turns some of the current passing through it into heat by exactly the same law. That heat is a loss of energy and, if it is not carried away, a cause of overheating. Chapters 3 and 4 apply Joule's law to conductors, cables and fuses, where the aim is the opposite of a heater's: to keep the heat small and the temperature within safe limits.

## The 1895 electric kettle

Houston and Kennelly worked through the energy needed to bring a gallon of water to the boil in an electric kettle. Their American gallon held 3,786 cm³ of water, which they raised from 5 °C to 100 °C, a rise of 95 °C. Since one calorie raises one gram of water by one degree, the heat needed was 3,786 × 95 = 359,575 calories, which at 4.18 joules per calorie is about **1.503 MJ**.

They then costed it. Electricity was sold at about 8 cents per kilowatt-hour in large quantities and 15 cents in small. At 8 cents, the heat itself cost about 3 cents. But not all the electrical energy reached the water: some heated the metal of the kettle and some was lost to the air during the quarter of an hour the heating took. They estimated the kettle's efficiency at about 70%, so the real cost was about 4 cents a gallon.

```figure
type: compare
title: Boiling an American gallon of water from 5 °C, 1895 and today
cols: Houston and Kennelly, 1895 | Same energy at today's price
caption: The 1895 figures as Houston and Kennelly gave them. The modern column uses an illustrative 30 cents per kilowatt-hour, excluding GST, with their 70% efficiency.
- Heat into the water | 1.503 MJ | 1.503 MJ (0.418 kWh)
- Price of electricity | 8 cents per kWh (large quantities) | 30 cents per kWh (illustration)
- Cost if 100% efficient | about 3 cents | about 12.5 cents
- Efficiency | about 70% (their estimate) | about 70%
- Cost of the heated water | about 4 cents | about 17.9 cents
```

The physics has not changed in 130 years, and neither has the shape of the calculation. The arithmetic of heat, electricity and efficiency is exactly the arithmetic of an industrial oven, on a larger scale.

## From power to heat in material

The heat needed to warm a material is:

**Q = m × c × ΔT**

where m is the mass, c the specific heat and ΔT the temperature rise. If the material melts or boils, its latent heat must be added. Water, with a specific heat of about 4.18 kJ/kg·°C, is unusually demanding; steel, at about 0.49 kJ/kg·°C near room temperature, needs about an eighth as much heat per kilogram per degree.

This is an illustration. A batch of steel frames weighing 400 kg, heated from 20 °C to the oven's 200 °C, needs about 400 × 0.49 × 180 ≈ **35.3 MJ**, which is about 9.8 kWh. Chapter 6 builds the full heat balance of the oven, including the racks, the walls, the exhaust and the warm-up; here the point is that the heat in the product is only one part of what the oven uses.

## Efficiency and where the heat goes

Inside a resistance heater, conversion is complete: every joule of electrical energy becomes heat. Efficiency is about where that heat ends up. In the kettle, 70% reached the water; the rest warmed the kettle and the room. In an oven, some heat goes into the product, some into the racks and conveyors that carry it, some through the walls, some out with the exhaust air and some through open doors. Process efficiency is the fraction that ends up in the product.

That distinction matters when comparing electric and gas heating (Chapter 10). A gas burner loses part of its heat up the flue before any reaches the oven; an electric heater does not. But both lose heat through walls, exhaust and doors in the same way, and good insulation and sensible operation matter equally to both.

## Power, energy and demand

A heater's power rating in kilowatts tells you how fast it can supply heat; the energy it uses, in kilowatt-hours, tells you what it costs to run. The two are different, and electricity tariffs for businesses often charge for both: an energy charge per kilowatt-hour and a demand charge based on the highest power drawn in a billing period.

This is an illustration. The oven's heaters total 60 kW, but once warm and running, Chapter 6 estimates an average demand of about 36 kW. Over an eight-hour production day, that is about 36 × 8 ≈ 286 kWh, about A$86 a day at 30 cents per kilowatt-hour, excluding GST. The 60 kW figure matters at start-up, when all heaters run together to bring the oven to temperature, and that peak may set the demand charge. Chapter 9 looks at how control can limit it.

```figure
type: stats
title: The curing oven in electrical terms
caption: This is an illustration. The average running demand comes from the heat balance in Chapter 6.
- 60 kW | Installed heater power | twenty 3 kW elements
- *83.5 A | Line current at full power | 415 V three-phase, balanced
- about 36 kW | Average demand when running
- about 286 kWh | Energy in an eight-hour day | about A$86 at 30 c/kWh, excluding GST
```

## A failure: the element that glowed white

This is an illustration. During commissioning of a replacement element bank in an older oven, one group of elements glowed far brighter than the rest within seconds of switching on, and two of them burnt out before the electrician could isolate the supply.

The replacement elements were rated 3 kW at 240 V, designed for star connection between phase and neutral. The old oven's terminal block was wired in delta, with each element between two phases, so the new elements saw 415 V. Their power was therefore (415 ÷ 240)² ≈ 3.0 times their rating, about 9 kW each, and their surface loading, temperature and current all rose far beyond their design. The wire overheated and failed within seconds.

The electrician rewired the terminal block in star for the new elements, the burnt elements were replaced, and the oven maker's wiring diagram was attached inside the terminal box. The lesson is the square law: a heater's power follows the square of its voltage, so connecting it to the wrong voltage is not a small error.

## Exercise: the same element in delta

The oven's 19.2 Ω element is connected across two phases at 415 V instead of 240 V. Calculate its power and current. Then calculate the power if the supply voltage at the oven drops by 6% while the element is correctly connected at 240 V.

In delta at 415 V, P = 415² ÷ 19.2 ≈ **8,970 W** and I = 415 ÷ 19.2 ≈ **21.6 A**, about three times the power and 1.7 times the current of the correct connection.

With a 6% drop, the element sees 240 × 0.94 = 225.6 V, so P = 225.6² ÷ 19.2 ≈ **2,651 W**, about 12% less than 3,000 W. A small change in supply voltage causes roughly twice its percentage change in heater power, which is why ovens on weak supplies take longer to warm up and why the controller, not the heater rating, must hold the temperature (Chapter 9).
