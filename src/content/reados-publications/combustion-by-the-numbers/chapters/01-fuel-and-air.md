---
book: combustion-by-the-numbers
chapterSlug: fuel-air-and-the-reaction
order: 1
title: "Fuel, air and the reaction"
description: "The combustion reaction for natural gas and propane, the air each needs, the flue gas it makes, higher and lower heating values, and why a burner's rating basis matters."
draft: false
---

Every gas flame is the same chemical reaction run at different rates. Methane, the main constituent of natural gas, combines with oxygen from the air to make carbon dioxide and water, and releases heat. The proportions are fixed by chemistry: a cubic metre of methane needs exactly two cubic metres of oxygen, and that oxygen arrives diluted in nearly four times its volume of nitrogen. Everything else in this book, from the flue gas analyser to the cost of a load, follows from those proportions.

This chapter writes out the reaction, works out the air a burner needs and the flue gas it makes, defines the higher and lower heating values that fuel bills and burner nameplates use, applies them to TF-120, and describes the 11% that went missing from the furnace's energy budget because two documents used different heating values.

## The reaction

Burning methane completely gives one molecule of carbon dioxide and two of water for each molecule of methane, using two molecules of oxygen:

CH₄ + 2 O₂ → CO₂ + 2 H₂O

The reaction releases energy because the bonds in carbon dioxide and water hold their atoms more tightly than the bonds in methane and oxygen. Thermodynamics measures that release as the **enthalpy of combustion**, the heat given out when the reaction runs at constant pressure and the products are brought back to the starting temperature. NIST's Chemistry WebBook gives it for methane as **890.7 kJ per mole**, measured with the water ending as liquid. For propane, C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O, it is **2,219.2 kJ per mole**.

### From molecules to cubic metres

Gases at the same pressure and temperature have the same number of molecules in the same volume, very nearly. That is the ideal gas law, and for fuel gases and air at furnace-supply pressures it holds to within a fraction of a per cent. It means the mole ratios of the reaction are also volume ratios: one cubic metre of methane needs two cubic metres of oxygen and makes one cubic metre of carbon dioxide and two of water vapour.

To turn moles into cubic metres needs a reference condition. The Australian gas industry quotes volumes at **15 °C and 101.325 kPa**, at which one mole of an ideal gas occupies 8.314 × 288.15 ÷ 101.325 = **23.645 litres**. Every "standard" cubic metre in this book is at those conditions. Chapter 5 shows how much a meter reading can differ from a standard volume.

### Why the reaction goes all the way

Thermal physics explains why a gas flame burns essentially all of its fuel. Whether a reaction runs, and how far, is decided by the change in the **Gibbs free energy**, which combines the heat released with the change in entropy. For methane burning in oxygen, the heat released is so large that the Gibbs energy falls enormously, and the law of mass action then says that at equilibrium the remaining methane and the partly burned products, carbon monoxide and hydrogen, are present only in vanishingly small amounts at ordinary furnace temperatures, provided there is oxygen to spare.

Two qualifications matter in practice. At the very high temperatures inside a flame, approaching 2,000 °C, carbon dioxide and water start to break back down into carbon monoxide, hydrogen and oxygen, and the equilibrium shifts measurably; Chapter 4 returns to this when it calculates flame temperature. And equilibrium is only reached if the molecules meet. A burner that mixes gas and air poorly leaves pockets with too little oxygen, and those pockets leave carbon monoxide in the flue even when the burner has excess air overall. That is why excess air is needed, and why how much a burner needs depends on how well it mixes.

## Interchangeable gases: the Wobbe index

A burner's gas orifice passes a flow that depends on the pressure across it and on the gas's density: at a fixed pressure the volume flow varies as one over the square root of the gas's density. The heat delivered through the orifice is that flow times the heating value. Two gases therefore give the same heat input through the same orifice at the same pressure if their heating value divided by the square root of their relative density is the same. That quantity is the **Wobbe index**, and gas networks control it to keep appliances working as gas sources change.

For methane, the relative density to air is 16.04 ÷ 28.97 = 0.554, so its Wobbe index is 37.67 ÷ √0.554 ≈ **50.6 MJ/m³**. For propane, the relative density is 1.522 and the index is 93.85 ÷ √1.522 ≈ **76.1 MJ/m³**, about 50% higher. Feed propane through a natural gas orifice at the same pressure and the burner would fire at about one and a half times its rating, with far too little air. That is why an appliance converted between gases needs new orifices or injectors, new regulator settings and a fresh commissioning by a licensed gasfitter, even though, as the comparison of the two fuels later in this chapter shows, its combustion air hardly changes.

## The air a burner needs

Burners take their oxygen from air, and dry air is 20.95% oxygen by volume. The rest is mostly nitrogen with about 1% argon, which this book treats together as inert gas, since neither takes part in the reaction at furnace temperatures in any amount that matters for the heat balance. Each cubic metre of oxygen therefore arrives with 1 ÷ 0.2095 − 1 = 3.773 cubic metres of inert gas.

```figure
type: formula
title: Stoichiometric combustion of methane in air
formula: CH₄ + 2 (O₂ + 3.773 N₂) → CO₂ + 2 H₂O + 7.547 N₂
caption: Volumes at the same pressure and temperature; argon counted with nitrogen. Stoichiometric means exactly the air needed to burn all the fuel, with nothing left over.
- Air needed | 2 ÷ 0.2095 = 9.547 m³ per m³ of methane
- Wet products | 1 + 2 + 7.547 = 10.547 m³ per m³ of methane
- Dry products | 1 + 7.547 = 8.547 m³ (water removed)
step: CO₂ in dry products = 1 ÷ 8.547 = 11.70%, the highest CO₂ methane can give
step: water vapour in wet products = 2 ÷ 10.547 = 19.0%
```

The highest possible carbon dioxide reading in dry flue gas, **11.7%** for methane, is called CO₂max. It is a property of the fuel, and Chapter 2 uses it to check flue gas analysers.

Burners are never run at exactly stoichiometric air, because real mixing is imperfect and any shortage of air makes carbon monoxide. They run with **excess air**, expressed as a percentage of the stoichiometric amount. The US Department of Energy's process heating tip sheet on air–fuel ratios notes that most high-temperature direct-fired furnaces, radiant tubes and boilers run with about 10 to 20% excess air at high fire. TF-120 is set for **15%**.

## Heating values

The enthalpy of combustion quoted by NIST assumes the water in the products ends as liquid. In a furnace it does not: it leaves up the flue as vapour, carrying its latent heat of evaporation with it. Two heating values are therefore in use:

- The **higher heating value** (HHV), also called gross calorific value, counts the heat released when the water condenses. It is the value on Australian gas bills.
- The **lower heating value** (LHV), or net calorific value, subtracts the latent heat of the water, which is about 44.0 kJ per mole of water at 25 °C. It is the value many European burner and boiler makers use for ratings and efficiencies.

```figure
type: compare
title: Methane and propane compared
cols: Methane | Propane
rowhead: Quantity
caption: Calculated from NIST enthalpies of combustion at 15 °C and 101.325 kPa, ideal gas. The air needed per megajoule is almost the same for both fuels, which is why burner air settings scale with heat input rather than with gas volume.
- Higher heating value | 37.67 MJ/m³ | 93.85 MJ/m³
- Lower heating value | 33.95 MJ/m³ | 86.41 MJ/m³
- Higher heating value per kilogram | 55.5 MJ/kg | 50.3 MJ/kg
- Stoichiometric air | 9.547 m³/m³ | 23.866 m³/m³
- *Air per MJ (HHV) | 0.2534 m³ | 0.2543 m³
- CO₂max, dry | 11.70% | 13.72%
```

For methane the lower heating value is 90.1% of the higher. That 10% gap is the latent heat of the water, and it matters whenever an efficiency is quoted: an appliance can be "95% efficient" on one basis and 86% on the other. Chapter 7 shows how a condensing heat exchanger recovers part of it.

The row marked in the figure is worth remembering. Methane and propane need almost exactly the same air for each megajoule they release, about **a quarter of a cubic metre**. The tip sheet expresses the same fact in older units, as about a cubic foot of air for each 100 Btu, which is 0.27 m³ per MJ. The reason is that most of the heat in any hydrocarbon comes from forming carbon dioxide and water, and the oxygen needed per unit of heat released is similar for both. A burner set up for one fuel therefore needs nearly the same air at the same heat input on another, although its gas orifices and pressures must change completely.

### Natural gas is not pure methane

Pipeline natural gas in Australia is mostly methane, with smaller amounts of ethane, propane and heavier hydrocarbons, and some nitrogen and carbon dioxide. The heavier hydrocarbons raise its heating value per cubic metre above pure methane's 37.67 MJ/m³, and networks measure and report the heating value they bill on. Because the air needed per megajoule is nearly the same for every hydrocarbon, treating natural gas as methane gives air requirements and flue gas quantities per megajoule that are accurate to within a per cent or so, which is how this book uses it. What does change with composition is the volume of gas per megajoule, so gas flows are always worked out from the network's heating value, never from methane's.

## TF-120's fuel, air and flue gas

This is an illustration. At high fire TF-120's two burners take **432 MJ/h** (120 kW) of gas on the higher heating value. With the network's heating value taken as 38.6 MJ/m³, that is 432 ÷ 38.6 = **11.19 m³/h** of gas. The rest follows per megajoule.

```figure
type: stats
title: TF-120 at high fire, 15% excess air
caption: This is an illustration. Air and flue gas worked per megajoule on the methane basis; flue volume at 650 °C is the actual volume the flue must carry.
- 11.19 m³/h | natural gas at 38.6 MJ/m³
- 125.9 m³/h | combustion air, standard, 0.2534 m³/MJ × 432 MJ/h × 1.15
- 137.4 m³/h | wet flue gas, standard
- 440 m³/h | the same flue gas at 650 °C
```

The air is about eleven times the gas by volume, and the flue gas is about twelve times. At 650 °C the flue gas occupies 923.15 ÷ 288.15 = 3.2 times its standard volume, which is why flues and their dampers are much larger than the gas pipe that feeds the burners. The flue gas also carries about **17.5 kg of water vapour an hour**, 1.52 kg for every standard cubic metre of methane burned, which becomes important in Chapter 7.

The flue gas volume sets the size of the flue. TF-120 discharges through a 250 mm flue, whose bore has an area of π × 0.125² ≈ 0.049 m². Carrying 440 m³/h, or 0.122 m³/s, the gas moves up it at about **2.5 m/s** at high fire, and at a quarter of that at low fire. Those velocities matter for two reasons. They decide the draught the flue provides and the pressure the burners and fan must overcome. And if the gas slows and cools in a long, cold flue, its water vapour can reach its dew point inside the flue, which is the subject of Chapter 7. The flue, like the burners, is part of the appliance's approved design, and is not altered without the approval that covers it.

## The error: two heating values in one budget

This is an illustration. When TF-120 was bought, the shop's engineer prepared an energy budget from the burner data sheet, which gave each burner's rating as 60 kW. The budget assumed 120 kW of gas at high fire and predicted the gas a typical load would use. In the first month, the gas sub-meter showed about **11% more gas** than the budget for the same number of loads, and the engineer suspected a leak or a burner running rich.

The flue gas analysis showed 3% oxygen and negligible carbon monoxide, which ruled out a rich burner, and a leak test of the gas train found nothing. The answer was on the burner data sheet itself, in small print: the burners were rated on the **net** (lower) heating value, as is common for burners made in Europe. A burner releasing 60 kW on the lower heating value is consuming 60 ÷ 0.901 ≈ **66.6 kW** on the higher heating value, which is the basis of the gas bill. Both burners together use about **133 kW gross**, or 479 MJ/h, not 432.

The furnace was working correctly; the budget had mixed two bases. The engineer reworked it on the higher heating value throughout, and the shop now records the basis next to every energy figure it uses: "gross" or "net" beside every heating value, rating and efficiency. For the rest of this book, TF-120's burners are taken as **120 kW gross** after the burner supplier reset them to that input, so that the case uses one basis throughout.

```figure
type: checklist
title: Fuel and air checks for a gas-fired appliance
caption: The open item is this chapter's error. A heating value without its basis is not a number.
- x Fuel identified and its heating value taken from the network | natural gas, 38.6 MJ/m³ gross
- x Reference conditions stated for every volume | 15 °C, 101.325 kPa
- x Air requirement worked per megajoule | 0.2534 m³/MJ stoichiometric
- x Excess air set for the duty | 15% at high fire
- ? Burner rating basis confirmed as gross or net | rated net: 11% more gas than budgeted
```

## Exercise: TF-120 on propane

The shop is asked to quote for a site without natural gas, where an identical furnace would run on propane at the same 432 MJ/h gross input and 15% excess air. What gas flow and combustion air would it need, and what would its CO₂max be?

**Worked answer.** Propane's higher heating value is 93.85 MJ/m³, so the gas flow is 432 ÷ 93.85 = **4.60 m³/h**, about 41% of the natural gas flow. The air is 0.2543 × 432 × 1.15 = **126.3 m³/h**, within half a per cent of the natural gas figure of 125.9 m³/h, so the combustion air fan needs no change. The CO₂max of propane is **13.72%**, higher than methane's 11.70%, because propane has less hydrogen per carbon atom. The flue gas analyser must be set to the right fuel, or every CO₂ and excess air figure it calculates will be wrong, as Chapter 2 explains.
