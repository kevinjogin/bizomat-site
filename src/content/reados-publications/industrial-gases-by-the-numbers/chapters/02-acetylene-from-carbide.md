---
book: industrial-gases-by-the-numbers
chapterSlug: acetylene-from-carbide
order: 2
title: "Acetylene from carbide"
description: "Follow acetylene from the electric furnace that makes calcium carbide to the reaction with water, and calculate the gas yield, water, lime and heat per kilogram of carbide from the chemistry."
draft: false
---

Acetylene is the fuel gas of oxy-fuel cutting and welding, because no other common fuel gas burns with oxygen at so high a flame temperature or concentrates its heat so sharply at the tip of the inner cone. It is also an unusual gas: it does not occur naturally in useful quantities, it is unstable under pressure, and for most of the twentieth century it was made from a grey, stony solid, calcium carbide, dropped into water. Many workshops in the early years made their own.

This chapter follows acetylene from the furnace that makes carbide to the reaction that releases the gas, and calculates from the chemistry how much gas, water, lime and heat a kilogram of carbide produces. The numbers explain why carbide quality mattered so much to the early manuals, why generators needed so much water, and why the slaked lime left behind was a disposal problem. Chapter 3 then looks at the generators themselves and why dissolved acetylene in cylinders replaced them for most work.

## What acetylene is

Acetylene, C₂H₂, is the simplest hydrocarbon with a triple bond between its two carbon atoms. That triple bond stores a great deal of energy: acetylene's standard enthalpy of formation is about +226.7 kJ/mol, meaning that energy has to be put in to make it from carbon and hydrogen, and is released again when it breaks down. When acetylene burns with oxygen, it releases both its heat of combustion and that stored energy in a small volume of flame, which is why the oxy-acetylene flame is so hot.

The same stored energy is acetylene's danger. Under enough pressure or heat, acetylene can decompose into carbon and hydrogen without any oxygen at all, releasing that energy violently. That is why acetylene is handled at low pressure and why it is stored dissolved in acetone rather than compressed as a gas, as Chapter 3 explains. It is also why the NIOSH Pocket Guide gives acetylene's upper explosive limit as 100%.

## Making calcium carbide

Calcium carbide, CaC₂, is made by heating lime, calcium oxide, with carbon, usually coke, in an electric arc furnace at around 2,000 °C. The reaction takes calcium oxide and three carbon atoms and gives calcium carbide and carbon monoxide:

CaO + 3C → CaC₂ + CO

The reaction absorbs a large amount of heat, which only an electric furnace could supply economically at that temperature in the 1890s, when the process was commercialised. Houston and Kennelly, writing on electric heating in 1895, listed calcium carbide among the products that only electric furnaces could make, and acetylene from carbide became one of the first large industrial uses of cheap hydro-electric power.

```figure
type: formula
title: Least heat to make a kilogram of calcium carbide
formula: ΔH = ΔHf(CaC₂) + ΔHf(CO) − ΔHf(CaO)
caption: Standard enthalpies of formation from the NIST Chemistry WebBook. Real furnaces use considerably more energy than this, because the charge and products must be heated to about 2,000 °C and the furnace loses heat.
- ΔHf CaC₂ | −59.8 kJ/mol
- ΔHf CO | −110.5 kJ/mol
- ΔHf CaO | −635.1 kJ/mol
step: ΔH = −59.8 − 110.5 + 635.1 ≈ +464.8 kJ per mole of carbide
step: one kilogram of carbide is 1,000 ÷ 64.10 ≈ 15.6 mol
step: least heat ≈ 15.6 × 464.8 ≈ 7.25 MJ, about 2.0 kWh, per kilogram
```

The carbon monoxide leaves the furnace as a fuel gas, the molten carbide is tapped, cooled, crushed and graded by lump size, and the lumps are packed in airtight steel drums, because carbide reacts with moisture in the air.

## The reaction with water

Carbide reacts with water to give acetylene and calcium hydroxide, slaked lime:

CaC₂ + 2H₂O → C₂H₂ + Ca(OH)₂

The reaction starts the moment water touches carbide, and it is vigorous: the lumps fizz, the water heats, and the lime forms a white sludge. The Vulcan Process Company's 1914 manual set out the proportions by weight: 64 parts of carbide and 36 of water give 74 parts of slaked lime and 26 of acetylene. Those numbers follow exactly from the molar masses, about 64.1 g/mol for calcium carbide, 18.0 g/mol for water, 74.1 g/mol for calcium hydroxide and 26.0 g/mol for acetylene, and they are a neat check that the 1914 writers had their chemistry right.

## Gas yield per kilogram

From the equation, each mole of carbide gives one mole of acetylene. A kilogram of pure carbide is about 15.6 mol, and at 15 °C and atmospheric pressure, a mole of gas occupies about 23.6 litres.

```figure
type: formula
title: Theoretical acetylene yield of pure calcium carbide
formula: V = (1,000 ÷ M_CaC₂) × V_m
caption: At 15 °C and 101.325 kPa, treating acetylene as an ideal gas. At 20 °C the molar volume is about 24.0 L and the yield about 375 L per kilogram.
- M_CaC₂ | 64.10 g/mol
- V_m at 15 °C | 23.6 L/mol
step: moles per kilogram = 1,000 ÷ 64.10 ≈ 15.6 mol
step: V ≈ 15.6 × 23.6 ≈ 369 L of acetylene per kilogram of pure carbide
step: mass of acetylene ≈ 15.6 × 26.04 ≈ 0.41 kg
```

The Vulcan manual gave about 5.5 cubic feet per pound for chemically pure carbide, about 343 L/kg, a little below the value calculated here, and said that good commercial carbide should never yield less than 4.5 cubic feet per pound, about 281 L/kg. The gap between the pure and commercial figures reflects the fact that commercial carbide is not pure calcium carbide: it contains unreacted lime, carbon and small amounts of other compounds from the raw materials, and some of it has already reacted with moisture before use.

## What carbide quality meant

Yield per kilogram was the measure of carbide quality, and it mattered for two reasons. The first was cost: carbide was bought by weight, so carbide yielding 281 L/kg cost about a quarter more per litre of gas than carbide that would have yielded 369 L/kg. The second was impurity: the compounds that lowered the yield also produced the impurities that made acetylene unpleasant and harmful to welds, as Chapter 4 explains.

```figure
type: bars
title: Acetylene yield per kilogram of carbide
unit: litres of acetylene per kilogram
max: 400
caption: The theoretical value at 15 °C is calculated in this chapter. The two 1914 values are converted from the Vulcan manual's cubic feet per pound. Ratios between them, rather than the exact values, are the point.
- Theoretical, pure carbide, 15 °C | 369
- Vulcan 1914, pure carbide | 343
- *Vulcan 1914, minimum for good carbide | 281
```

A simple ratio gives the implied purity. If commercial carbide yields 281 L/kg against a theoretical 369 L/kg, it behaves as though it were about 281 ÷ 369 ≈ 76% calcium carbide. A generator operator who knew the carbide charged and measured the gas produced could check the carbide this way, and some early writers recommended exactly that test on a new drum.

## Water consumed and lime produced

The reaction itself consumes two moles of water per mole of carbide, about 0.56 kg of water per kilogram of pure carbide, and produces about 1.16 kg of calcium hydroxide. Those are the minimum quantities. In practice, a generator uses far more water than the reaction needs, for reasons that the heat of the reaction makes clear.

```figure
type: stats
title: The reaction of one kilogram of pure calcium carbide with water
caption: Calculated from the equation and molar masses. Real generators use many times the reacting water, to carry away heat and to keep the lime as a fluid sludge.
- 369 L | acetylene at 15 °C
- 0.56 kg | water consumed by the reaction
- 1.16 kg | slaked lime produced
- 2.0 MJ | heat released
```

## The heat of the reaction

The reaction of carbide with water releases heat, which the enthalpies of formation give directly. On the left side, calcium carbide (−59.8 kJ/mol) and two moles of liquid water (2 × −285.8 kJ/mol); on the right, calcium hydroxide (−986.1 kJ/mol) and acetylene (+226.7 kJ/mol). The difference, products minus reactants, is about (−986.1 + 226.7) − (−59.8 − 571.6) ≈ **−128 kJ per mole**: heat given out. For a kilogram of carbide, that is about 15.6 × 128 ≈ **2.0 MJ**.

Two megajoules is a great deal of heat to release in a few minutes in a closed vessel. Spread over the 0.56 kg of water the reaction consumes, it would boil the water off many times over. A generator therefore needs enough water to absorb the heat without becoming hot. If the water is allowed to warm by about 50 °C, the water needed to absorb 2.0 MJ is about 2,000 ÷ (4.18 × 50) ≈ **9.6 kg**, more than seventeen times the water the reaction uses.

## Why heat mattered

The early manuals gave close attention to heating in generators, and the reasons were practical. Hot acetylene carries more water vapour, which condenses in pipes and can freeze in winter. Hot carbide, where water reaches it slowly and in small quantities, can reach temperatures at which acetylene begins to change chemically, forming heavier hydrocarbons, a process the manuals called polymerisation, which fouled the gas and the generator. And at higher temperatures still, acetylene's tendency to decompose becomes a real danger. Swingle's 1915 manual treated generator heating and polymerisation as subjects in their own right, and the generator designs described in Chapter 3 were largely shaped by the need to keep the carbide and gas cool.

## Lump size and the rate of gas

Carbide was sold graded by lump size, and the size mattered as much as the purity. Small lumps and granules present a large surface to the water, so they react fast and release gas and heat quickly; large lumps react more slowly and steadily. A generator was designed for a particular grade, and using the wrong one upset it: fine carbide in a generator built for large lumps could produce gas faster than the gasholder could take it, raising the pressure and the temperature, while large lumps in a generator built for fine carbide might not keep up with the torch. Dust and fines at the bottom of a drum were a particular nuisance, because they reacted almost instantly. The early manuals' insistence on the correct grade was a matter of controlling the rate of the reaction, and with it the heat.

## Carbide in storage

Carbide reacts with moisture in the air, slowly releasing acetylene and crumbling to lime. Drums were therefore kept sealed, opened only when needed, closed again immediately, and stored in a dry, ventilated place, never where water could reach them from a leaking roof, flood or fire hose. A drum that had been opened and left in a damp shed would contain lime dust and a reduced yield, and could fill with acetylene that a spark would ignite when the drum was next opened. Sparking tools were kept away from carbide drums for the same reason. The rules have changed little where carbide is still used, for example in some mining and caving lamps and in some industrial processes; the supplier's safety data sheet governs.

## What one cylinder represents

This is an illustration. Suppose one of the workshop's acetylene cylinders holds about 6 kg of acetylene. At a density of about 1.10 kg/m³ at 15 °C, that is about 6 ÷ 1.10 ≈ **5.45 m³** of gas. Making it from pure carbide would take about 5,450 ÷ 369 ≈ **15 kg** of carbide; from carbide of the 1914 minimum quality, about 5,450 ÷ 281 ≈ **19 kg**.

The 15 kg of pure carbide would consume about 8 kg of water in the reaction, need perhaps 140 kg of water to absorb the heat at a 50 °C rise, release about 30 MJ of heat, and leave about 17 kg of slaked lime sludge, plus the water it was mixed with, to be disposed of. One small cylinder, delivered and swapped by the supplier, replaces all of that in the workshop.

## The lime

Slaked lime is strongly alkaline, and generator sludge is a caustic, wet mixture that burns skin and eyes and harms drains and watercourses. The early manuals recognised that the sludge had to be removed and disposed of carefully, and they warned against emptying it where it could reach streams. Today, any carbide or lime residue is disposed of according to its safety data sheet and the local environmental rules; it is not washed into a stormwater drain.

## Acetylene made today

Calcium carbide is still a major source of acetylene, alongside processes that make acetylene from natural gas or as a by-product of other petrochemical processes. For a workshop, the source does not change what is in the cylinder: acetylene dissolved in acetone, purified to the supplier's specification. But the chemistry in this chapter still explains acetylene's stored energy, its need for careful handling, and the impurities that Chapter 4 discusses.

## A failure: the damp drum

This is an illustration. In an old maintenance shed being cleared out, a contractor found a rusted, half-full carbide drum left over from a lighting system decades earlier. Its lid had corroded and rain had reached the contents through a leaking roof; the carbide had partly crumbled to lime. The contractor, intending to cut the drum up for scrap, began to open it with an angle grinder.

A colleague who recognised the drum's label stopped the work. Wet carbide in a closed drum can fill it with acetylene, and a spark from a grinder or a dropped tool could ignite the mixture inside. The drum was moved outdoors with non-sparking handling, left open in a ventilated area away from ignition sources until no gas remained, and the carbide residue and lime were disposed of according to the safety data sheet. The lesson was not about carbide alone: any drum or container that has held something reactive or flammable must be identified and made safe before hot work, a rule Chapter 10 returns to.

## Exercise: carbide for a heating job

A historical generator supplied acetylene to a torch using about 400 litres an hour for a 6-hour day. Calculate the mass of pure carbide and of 1914-minimum carbide needed for the day, the heat released, and the water that would absorb that heat with a 50 °C rise.

The day's acetylene is 400 × 6 = **2,400 L**. Pure carbide at 369 L/kg would need about 2,400 ÷ 369 ≈ **6.5 kg**; carbide at 281 L/kg about 2,400 ÷ 281 ≈ **8.5 kg**.

Taking the pure carbide case, the heat released is about 6.5 × 2.0 ≈ **13 MJ**, and the water needed to absorb it with a 50 °C rise is about 13,000 ÷ (4.18 × 50) ≈ **62 kg**, which is why generators of that size held tens of litres of water and why the water was changed or topped up as the lime sludge built up. The lime left behind, about 6.5 × 1.16 ≈ 7.5 kg of calcium hydroxide, would need disposing of every day.
