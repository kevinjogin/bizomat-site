---
book: entropy-by-the-numbers
chapterSlug: energy-has-a-quality
order: 1
title: "Energy has a quality"
description: "Why a plant that loses no energy still wastes most of its fuel's value: the first and second laws side by side, exergy as the useful part of energy, and three ways to heat the same wash water."
draft: false
---

Ask a plant engineer where the energy goes and the answer is usually a first-law balance. Fuel or electricity comes in, product heat and useful work go out, and the difference is the loss: up the flue, through the walls, down the drain. That balance is never wrong, but it hides the most important thing about energy, which is that some forms of it are worth far more than others. A kilowatt-hour of electricity can run a motor, a light, a computer or a heater. A kilowatt-hour of water at 60 °C can warm things that are colder than 60 °C, and nothing else.

This chapter puts the two laws side by side on the running case's wash water, introduces exergy as the measure of how much of a flow of energy is still useful, and compares three ways of heating the same water. It ends with an energy audit that ranked a resistance heater as "100% efficient" and missed what it was really doing.

## Two laws, two questions

The **first law** says energy is conserved. It answers the question "how much?" Every joule of fuel's heating value either ends up in the water or leaves the plant somewhere else, and a careful balance accounts for all of it. Efficiency in the first-law sense is the fraction that ends up where it was wanted.

The **second law** says that heat flows by itself only from hot to cold, and that no machine working in a cycle can turn heat from a single source wholly into work. It answers a different question: "how useful?" Its consequence is that every real process degrades energy, spreading it from a few concentrated forms, such as fuel, electricity and high-pressure gas, into the many diffuse forms that make up warm surroundings. The energy is conserved, but its capacity to do anything is used up.

The measure of that degradation is entropy. Chapter 4 shows how to calculate it, and Chapter 7 shows how it becomes lost work. For now the important idea is the one it leads to: every flow of energy has an **exergy**, the maximum work that could be obtained from it by bringing it into equilibrium with the surroundings. Electricity is almost pure exergy. Heat at the temperature of the surroundings has none.

```figure
type: compare
title: Energy and exergy of the same 1 kWh in different forms
rowhead: Form
cols: Energy | Exergy relative to surroundings at 20 °C | Why
caption: Electricity and shaft work are pure exergy. Heat's exergy depends on how far its temperature is above the surroundings, and is calculated in Chapter 7. Values for water use NIST data; fuel exergy is taken as equal to its heating value, a common simplification.
- Electricity or shaft work | 1 kWh | 1 kWh | can be turned wholly into any other form
- Natural gas, by heating value | 1 kWh | about 1 kWh | burns at very high temperature
- * Water heated from 20 °C to 60 °C | 1 kWh | 0.063 kWh | only 40 K above the surroundings
- Water heated from 20 °C to 80 °C | 1 kWh | 0.090 kWh | a little hotter, a little more useful
- Air or water at 20 °C | any amount | 0 | already in equilibrium with the surroundings
```

The third row is the heart of the matter for most food, beverage and cleaning plants. Hot water at 60 °C is one of the lowest-quality products a plant makes. Making it from a high-quality source throws away almost all of that source's value, however good the heater's first-law efficiency.

## The running case: wash water

This is an illustration. The plant heats 0.50 kg/s of mains water from 20 °C to 60 °C for washing. Using NIST property data for water at 0.3 MPa, the enthalpy rises from 84.194 to 251.42 kJ/kg, an increase of 167.226 kJ/kg, so the heat required is 0.50 × 167.226 = **83.6 kW**.

The entropy of the water rises from 0.29642 to 0.83114 kJ/kg·K, an increase of 0.53472 kJ/kg·K. Chapter 7 shows that the exergy gained by the water is the enthalpy gain less the dead-state temperature times the entropy gain:

167.226 − 293.15 × 0.53472 = 167.226 − 156.753 = **10.473 kJ/kg**

For the stream, 0.50 × 10.473 = **5.24 kW**. Of the 83.6 kW put into the water, only 5.24 kW, 6.3%, is exergy. That is the minimum work that a perfect machine, taking heat from the 20 °C surroundings, would need to heat the water. The other 78.4 kW could in principle be drawn from the surroundings free.

### Three ways to supply 83.6 kW

The plant's options make the point in numbers. The figures for the boiler and heat pump are illustrations; Chapter 3 discusses where real figures come from.

1. **The existing gas boiler**, 90% efficient on the fuel's heating value, burns 83.6 ÷ 0.90 = 92.9 kW of gas. Its first-law loss is 9.3 kW, mostly in the flue.
2. **An electric resistance heater** converts 83.6 kW of electricity into 83.6 kW of heat. Its first-law efficiency is 100%.
3. **An air-source heat pump** with a coefficient of performance of 3.2 takes 83.6 ÷ 3.2 = 26.1 kW of electricity and moves the rest of the heat from the outside air.

```figure
type: compare
title: Three ways to heat the wash water, both laws
rowhead: Option
cols: Energy bought | First-law efficiency | Exergy in | Exergy destroyed | Second-law efficiency
caption: This is an illustration. Product exergy is 5.24 kW in every case. Second-law efficiency = product exergy ÷ exergy supplied. Fuel exergy is taken as its heating value.
- Gas boiler | 92.9 kW gas | 90% | 92.9 kW | 87.7 kW | 5.6%
- Electric resistance | 83.6 kW electricity | 100% | 83.6 kW | 78.4 kW | 6.3%
- * Heat pump, COP 3.2 | 26.1 kW electricity | 320% | 26.1 kW | 20.9 kW | 20.0%
```

The first-law column ranks the options in a confusing way: the heat pump appears to create energy, and the resistance heater appears perfect. The second-law column ranks them by how much of what was bought survives in the product. The boiler and the heater both destroy more than 90% of their input's value; the heat pump destroys about 80%, which is still a lot, and is why Chapter 3 asks what limits a heat pump.

## Second-law efficiency

The **second-law efficiency** of a process is the exergy of what it produces divided by the exergy it consumes. It has three properties that make it more useful than a first-law efficiency for comparing options.

- It can never exceed 100%, for any device. A heat pump's "320%" becomes 20%, a number that can be compared directly with a boiler's or a heater's.
- It shows how far a device is from the best that physics allows, not from an arbitrary reference. A device at 90% second-law efficiency has little left to gain; one at 6% has a great deal.
- It points to the cause. The exergy destroyed is the sum of specific losses, in combustion, in heat transfer across a temperature difference, in friction, in mixing, which Chapters 6 to 9 separate one by one.

A second-law efficiency does not say what an option costs or whether it is worth doing. Electricity and gas have different prices and different emissions, and a plant may have good reasons for a boiler. What it does is show where the room for improvement lies, so that the money decision is made with that knowledge.

## Where the value goes

Following the gas boiler's 92.9 kW of fuel exergy through the process shows where it is destroyed. The flame burns at well over 1,000 °C, and the heat it releases passes, through the combustion gases and the boiler's heat transfer surfaces, into water that never exceeds 60 °C. Every step from flame to water is heat flowing across a large temperature difference, and Chapter 6 shows that this is one of the biggest sources of entropy in any plant. The flue loss of 9.3 kW is the only part the first-law balance sees; by far the larger destruction happens inside the boiler, where heat at a high temperature becomes heat at a low one.

```figure
type: stack
title: Where the gas boiler's 92.9 kW of fuel exergy goes
unit: kW
caption: This is an illustration. The split between combustion and heat transfer inside the boiler needs a fuller model than this chapter uses; together they destroy about 86 kW. The flue gas is warm, so only part of its energy is exergy.
- Delivered to the water as exergy | 5.24
- Destroyed in combustion and in heat transfer to the water | 86.4
- Carried out with the flue gas, upper estimate | 1.3
```

The flue figure in the stack is an upper estimate chosen for illustration: flue gas at a modest temperature carries only a fraction of its 9.3 kW of energy as exergy. Whatever its exact value, it is small. The ranking would not change if it were twice as large.

## What gives energy its quality

Exergy is not only a matter of temperature. A flow of energy has exergy whenever it differs from the surroundings in a way that could drive a machine, and a plant contains several kinds.

- **Thermal exergy**: anything hotter or colder than the surroundings. Hot water, steam and flue gas are above them; the cool room's air is below them, and keeping it there takes work, as Chapter 3 shows.
- **Pressure exergy**: gas above or below atmospheric pressure. The plant's compressed air at 8 bar absolute carries exergy because it could drive an air motor as it expands. Chapters 8 and 9 follow it from the compressor to the regulators.
- **Chemical exergy**: fuel, and any stream whose composition differs from the surroundings. Natural gas carries its exergy chemically until it burns.
- **Mechanical and electrical exergy**: shaft work, electricity and the kinetic and potential energy of moving or raised things, all of which are pure exergy.

The second law's message for every kind is the same. Each time a flow is brought towards the surroundings without doing work, by cooling it, letting it expand through a valve, mixing it with something else or burning it to make low-temperature heat, some of its exergy is destroyed for good. Good engineering arranges for that to happen as little as possible, and as late as possible, in each flow's journey through the plant.

## The dead state

Every exergy figure depends on the temperature of the surroundings, called the **dead state**, because a flow in equilibrium with the surroundings can do no more work. The running case uses 20 °C throughout. On a winter morning, with outdoor air and mains water at 10 °C, the same 60 °C water would have more exergy relative to the colder surroundings, and a heat pump drawing heat from 10 °C air would need more work.

The choice is not arbitrary, but it must be consistent. A second-law audit states its dead state, uses it for every number, and repeats the key results at a second dead state when the season matters. Chapter 7 returns to this, with an example of what happens when two engineers use different ones.

## The error: the "100% efficient" heater

This is an illustration. Before this review, an energy audit of the plant recommended replacing the gas boiler with electric resistance heaters, on the grounds that they were "100% efficient" against the boiler's 90%. The report calculated a 9.3 kW reduction in losses and recommended the change for its efficiency alone, before looking at energy prices.

The plant's engineer checked the recommendation with a second-law balance. The heaters would take 83.6 kW of electricity, nearly pure exergy, and turn it into 5.24 kW of exergy in the water: a second-law efficiency of 6.3%, barely better than the boiler's 5.6%. In physical terms, the change would swap one way of degrading high-quality energy to 60 °C water for another way of doing almost the same thing. The first-law gain was real but tiny compared with the destruction both options shared.

The error was not in the arithmetic. It was in the question. "How much energy is lost?" has an answer that makes resistance heating look ideal. "How much of the energy's value is destroyed?" shows that resistance heating and combustion both waste nearly all of it, and that the real improvement is a machine that supplies most of the heat from the surroundings. The audit was revised to compare the boiler with a heat pump, and Chapter 3 tests the heat pump's figures against the limits that apply to it.

## How this applies to a small Australian business

Most small and medium plants buy energy in high-quality forms and use much of it as low-temperature heat: hot water for washing and cleaning, warm air, process heating below 100 °C. A first-law audit of such a plant finds modest losses and suggests modest improvements. A second-law look at the same plant often finds that the biggest opportunity is not a better heater but a different kind of machine, a heat pump, a heat recovery exchanger or a process that needs less heat, because the losses that matter are inside the heater, where the first-law balance cannot see them.

The second-law view also protects against good-sounding claims. A supplier quoting efficiencies above 100%, or an audit recommending a switch on first-law grounds alone, can be checked in minutes with the numbers in this chapter.

## Exercise: hotter wash water

The plant considers raising the wash water to 80 °C for a cleaning step. Using the NIST values for water at 0.3 MPa, enthalpy 335.21 kJ/kg and entropy 1.0754 kJ/kg·K at 80 °C, find the heat and the exergy needed for 0.50 kg/s heated from 20 °C, and the second-law efficiency of the gas boiler for this duty.

**Worked answer.** The enthalpy rise is 335.21 − 84.194 = 251.016 kJ/kg, so the heat is 0.50 × 251.016 = **125.5 kW**. The entropy rise is 1.0754 − 0.29642 = 0.77898 kJ/kg·K. The exergy gained is 251.016 − 293.15 × 0.77898 = 251.016 − 228.358 = 22.658 kJ/kg, or 0.50 × 22.658 = **11.33 kW**, 9.0% of the heat.

The boiler burns 125.5 ÷ 0.90 = 139.5 kW of gas, so its second-law efficiency is 11.33 ÷ 139.5 = **8.1%**. Hotter water is a slightly better use of fuel, because the product is of higher quality, but the efficiency is still low: most of the fuel's value is destroyed in bringing it down to 80 °C.
