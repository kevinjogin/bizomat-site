---
book: industrial-gases-by-the-numbers
chapterSlug: generators-and-dissolved-acetylene
order: 3
title: "Generators and dissolved acetylene"
description: "See how acetylene generators handled heat and after-generation, why dissolved acetylene replaced them, and why acetylene is never used above about 100 kPa."
draft: false
---

In 1915, a workshop that wanted to weld with oxy-acetylene often had to decide what kind of generator to buy, where to house it and who would look after it. Swingle's manual of that year described the choices at length, with sections on heating, polymerisation, after-generation, the classes of generator and their relative merits. A generator was a small chemical plant, and it behaved like one: it made heat, it made impurities, it could make more gas than was wanted, and it needed regular cleaning and careful attention.

This chapter describes how generators worked and how they were classified, and calculates why the choice of design mattered so much for heat and water. It then explains why dissolved acetylene in cylinders replaced the workshop generator for most users, and why the most important modern rule about acetylene, never to use it above about 100 kPa gauge, follows from the same chemistry. Cylinder contents, weights and withdrawal rates are covered in Oxy-Fuel by the Numbers and are not repeated here.

## The generator's job

A generator brings carbide and water together at a controlled rate, collects the acetylene, cools and cleans it, and delivers it to the torch at a steady low pressure. Two features of the reaction, both covered in Chapter 2, make that harder than it sounds. The reaction releases about 2 MJ of heat per kilogram of carbide, and it cannot be stopped instantly: once carbide is wet, it goes on producing gas until it is spent. Swingle's manual, translating a French text, named the two principal difficulties of generation as heating and over-production, and it is a fair summary.

## Heating

Swingle gave the heat released as more than 900 British thermal units per pound of carbide, about 2.1 MJ/kg, close to the 2.0 MJ/kg calculated from modern formation enthalpies in Chapter 2. No design could reduce that heat; all a design could do was control where it went. If carbide met an excess of cold water, the water absorbed the heat and could not rise above its boiling point. If water reached a mass of carbide slowly, in small amounts, the heat stayed in the carbide and the lime around it, which conducts heat poorly, and the temperature could climb far higher. Steam from the hot water then reacted with more carbide, releasing more heat, and the lime itself could give up water to the carbide, so that the mass could become red hot without any outside cooling.

The manual's rule was that the heating in a generator should never exceed 130 °C at its maximum delivery. Above that, the heat caused two problems: polymerisation, in which acetylene condensed into tarry liquids and solids that fouled the lime and represented lost gas, and greater impurity, because hot carbide gives up more of the sulphur and other compounds that make the gas foul.

## After-generation

The second difficulty was that a generator cannot match production to consumption exactly. When the welder shuts the torch off, carbide that is already wet keeps reacting. In generators where water is fed to carbide, the slaked lime coating the carbide holds water and passes it slowly to the carbide underneath, so gas continues to form, sometimes for a long time. Swingle called this excess production or after-generation, and the manual's second rule was that a generator must be able to store and use that after-generated gas in case of a sudden stop, rather than vent it or let the pressure build.

The practical answer was a gasholder: a floating bell sealed in water, which rose as gas was produced and fell as it was used, holding the gas at a low, steady pressure. The gasholder had to be large enough to absorb the after-generation from a full charge of wet carbide, which set a minimum size for any generator of a given output.

## Classes of generator

Swingle divided generators into two classes. **Non-automatic** or intermittent generators made a quantity of gas in advance, dropping a fixed charge of carbide into a mass of water, and stored it in a gasholder large enough for a day's or several days' work. **Automatic** generators produced gas in proportion to consumption, controlled by the rise and fall of the gasholder bell or by the gas pressure, and these were the commonest. Automatic generators were themselves of three main kinds.

```figure
type: compare
title: The three kinds of automatic acetylene generator described in 1915
cols: How water and carbide meet | Strengths | Weaknesses
caption: Summarised from Swingle's 1915 comparison in new words. Generators of these kinds are historical; modern acetylene plant is designed and operated to current standards.
- Water to carbide | water fed onto a carbide charge | compact, little water | hotter, less pure gas, after-generation, awkward cleaning
- Dipping or contact | carbide lowered into water, or water raised to carbide | simple control | after-generation as the wet lime keeps reacting
- *Carbide to water | carbide dropped into a large mass of water | cool, purer gas, easy to clean and empty | larger for the same output, much water and liquid residue
```

The comparison is a direct consequence of the heat. Carbide-to-water generators dropped each piece of carbide into a large mass of water, which absorbed the heat, so the gas came off cool and free of the worst impurities. They paid for it in size and water. Water-to-carbide generators were compact and used little water, but the carbide ran hotter, the gas was less pure, and after-generation was hard to manage.

## Water and heat in numbers

Swingle gave the water needed in practice: about 1.2 to 1.6 pints of water per pound of carbide in water-to-carbide and dripping generators, and 5 to 5.5 pints per pound in carbide-to-water generators, enough in each case for the lime residue to be removed as a liquid. In metric terms, those are about 1.3 to 1.7 litres per kilogram and about 5.2 to 5.7 litres per kilogram.

```figure
type: bars
title: Water per kilogram of carbide in two kinds of generator, 1915
unit: litres of water per kilogram of carbide
max: 10
caption: Converted from Swingle's pints per pound. The 9.6 L value is calculated in Chapter 2 as the water that would absorb 2.0 MJ with a 50 °C rise; it is shown for comparison, not as a design figure.
- Water to carbide or dripping, about | 1.5
- Carbide to water, about | 5.5
- *Water to absorb 2.0 MJ at a 50 °C rise | 9.6
```

The heat balance shows why the two classes behaved so differently. If all of a kilogram's 2.0 MJ went into 5.5 litres of water, the water would warm by about 2,000 ÷ (4.18 × 5.5) ≈ **87 °C**. In practice much of the heat also went into the generator's body, the gas and the surroundings, and the water in a carbide-to-water generator's tank was a far larger mass than one charge's share, so the water stayed well below boiling. In a water-to-carbide generator with about 1.5 litres per kilogram, the same heat would have been enough to warm the water by more than 300 °C, which is impossible: the water boiled, and the excess heat stayed in the carbide and lime, which is exactly the overheating Swingle warned against.

## Purifiers and dryers

Generator gas carried water vapour, lime dust and impurities, so it passed through a washer, a purifier and sometimes a dryer before reaching the torch. Purifiers held a chemical bed that removed the phosphorus and sulphur compounds described in Chapter 4. Swingle described several purifying materials, including one based on chromic acid and one of iron oxychlorides that could be regenerated by exposure to air, and warned that gas must pass through a purifier slowly, because too high a flow per unit of bed area gave poor purification and heated the bed. A purifier was sized for the generator's maximum delivery, and enlarging the torch without enlarging the purifier gave dirty gas.

## The generator house

A generator was a hazard, and the early rules treated it as one. Generators were placed in a separate, well-ventilated building or room, away from the welding, with no open flames, and with vents leading outside. The water seals and back-pressure valves between the generator and the torch stopped a flashback from reaching the gas store. The insurance and fire rules of the day, which Swingle's contents list among his topics, set requirements for generator size, location and construction, and the manuals were insistent that only trained people should charge, clean or repair them.

## Why dissolved acetylene won

Acetylene could not simply be compressed into cylinders like oxygen, because compressed acetylene gas can decompose explosively. The solution, developed in France in the 1890s and widely used by the 1910s, was to dissolve acetylene in acetone. Acetone dissolves many times its own volume of acetylene, and more as the pressure rises, so a cylinder could hold a useful quantity of acetylene without holding it as a compressed gas. The cylinder was packed with a porous mass, originally materials such as charcoal or asbestos-based fillers and today a monolithic porous filler, so that the acetone and acetylene were held in many tiny pores rather than in a large free space where decomposition could start and spread.

For a workshop, dissolved acetylene removed the generator, the carbide, the water, the lime, the purifier and the attendant. It delivered clean, dry gas, ready at the turn of a valve, in a cylinder the supplier filled, tested and maintained. The cost per cubic metre was higher than gas made on site from carbide, but the saving in labour, space, cleaning and risk usually outweighed it. Generators remained in use for large consumers and remote sites for decades, but for most workshops the cylinder won.

## Withdrawal and acetone

Because acetylene in a cylinder is dissolved, it has to come out of solution as it is used, and that limits how fast it can be drawn. Drawing too fast cools the acetone and carries acetone vapour or liquid out with the gas, which harms the flame and the weld and can damage equipment. Oxy-Fuel by the Numbers explains the withdrawal limit and how to calculate when a manifold of several cylinders is needed in its chapter on [cylinders, contents and withdrawal](/reados/publications/oxy-fuel-by-the-numbers/cylinders-contents-and-withdrawal/). The same chapter explains why acetylene cylinders must be used upright.

## The 100 kPa rule

The most important number for anyone using acetylene is its pressure limit. The University of Pennsylvania's acetylene fact sheet, like many safety references, states that acetylene must never be dispensed at pressures greater than 15 psig, about 103 kPa gauge, because a violent, explosive decomposition can occur. In practice, regulators and equipment for acetylene are built and set to keep the delivered pressure below that value, and the acetylene regulator's gauge is often marked to show the limit.

```figure
type: gauge
title: Acetylene delivery pressure and the decomposition limit
min: 0
max: 150
value: 60
unit: kPa gauge at the regulator outlet
caption: The 103 kPa limit is the 15 psig figure from the University of Pennsylvania acetylene fact sheet. The 60 kPa setting is an illustration; the torch maker's and gas supplier's instructions give the actual settings for each tip.
- 0 | 103 | Within the safe delivery range
- 103 | 150 | Never use: risk of explosive decomposition
```

The limit is the same chemistry that made generators hot and cylinders porous. Acetylene stores energy in its triple bond; under pressure, the molecules are close enough together that a decomposition started by heat, a flashback or a spark can spread through the gas. In the dissolved state inside the porous mass, that spread is prevented. Once the acetylene leaves the cylinder as a gas, only low pressure prevents it.

## Copper, silver and acetylides

Acetylene also reacts with some metals to form acetylides, compounds that are sensitive to shock and heat and can detonate. The NIOSH Pocket Guide warns that acetylene forms explosive acetylide compounds with copper, mercury and silver, and with brasses containing more than 66% copper. That is why acetylene piping is never copper, why fittings for acetylene are made from approved alloys, and why silver-bearing brazing alloys must not be used on acetylene lines. Chapter 9 returns to this when it looks at piping materials.

## A generator in the running case

This is an illustration. When the workshop manager mentioned that an old acetylene generator was still standing in the yard of a neighbouring property, the workshop's oldest fitter recalled that it had been used decades earlier for a large repair contract, then abandoned when the contract ended. Nobody knew whether it held carbide or lime residue. The manager arranged for the gas supplier's specialist to inspect it before anyone touched it, and the residue was found to include crusted lime and some unspent carbide. It was made safe, emptied and disposed of according to the specialist's procedure and the residue's safety data sheet. The generator is history; its residue was not.

## A failure: the long hose run

This is an illustration. A fitter working on a structural repair at the far end of a long building found that the acetylene flame was weak at the end of a long hose and turned the acetylene regulator up well beyond its usual setting, to about 140 kPa, to make up for the pressure lost in the hose. The supervisor, seeing the gauge on a routine walk-round, stopped the work.

The problem was real: a long, small-bore hose loses pressure at high flows, as Oxy-Fuel by the Numbers calculates in its chapter on [regulators, hoses and torch pressure](/reados/publications/oxy-fuel-by-the-numbers/regulators-hoses-and-torch-pressure/). But the fix was wrong, because it put acetylene above the decomposition limit in the regulator and the hose. The correct remedies were a shorter hose, a larger bore within the equipment maker's options, or moving the cylinders closer, with the regulator set within its safe range. The workshop now keeps cylinder trolleys close to the work and has marked every acetylene gauge at the limit.

## Exercise: sizing a historical gasholder

This is an illustration. A historical automatic generator charged with 5 kg of carbide was supplying a torch using 400 L/h when the welder shut the torch off. Suppose that after-generation could release up to a fifth of the gas from the carbide still unspent in the generator. If about half the charge was still unspent at the stop, estimate the after-generated gas, assuming 300 L/kg from the commercial carbide, and the smallest gasholder volume that could hold it.

The unspent carbide is about 2.5 kg, which could yield about 2.5 × 300 = 750 L of acetylene in all. A fifth of that is about **150 L** of after-generated gas. The gasholder therefore needed at least about **150 L**, or 0.15 m³, of spare volume at the moment of the stop, and in practice more, to allow for a stop with a fuller charge and for safety. The figures are illustrative, but the logic is the one Swingle's rule required: a generator must be able to store the gas it goes on making after the torch stops.
